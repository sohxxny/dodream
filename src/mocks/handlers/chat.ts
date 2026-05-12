import { HttpResponse, http, ws } from 'msw';
import { BASE_URL } from '@/constants/auth.constant';
import {
  mockChatHistory,
  mockChatList,
  mockChatRoom,
  mockNewChatRoom,
} from '../data/chat';
import { mockPostList } from '../data/posts';
import { mockProfile } from '../data/user';

const WS_URL = BASE_URL.replace(/^http/, 'ws');
const stompWs = ws.link(`${WS_URL}/connect/:server/:session/websocket`);

function parseStompFrame(data: string) {
  const frameStr = data.endsWith('\0') ? data.slice(0, -1) : data;
  const lines = frameStr.split('\n');
  const command = lines[0];
  const headers: Record<string, string> = {};
  let i = 1;
  while (i < lines.length && lines[i] !== '') {
    const colonIndex = lines[i].indexOf(':');
    if (colonIndex > 0) {
      headers[lines[i].slice(0, colonIndex)] = lines[i].slice(colonIndex + 1);
    }
    i++;
  }
  const body = lines.slice(i + 1).join('\n');
  return { command, headers, body };
}

function buildStompFrame(
  command: string,
  headers: Record<string, string>,
  body = '',
) {
  const headerStr = Object.entries(headers)
    .map(([k, v]) => `${k}:${v}`)
    .join('\n');
  return `${command}\n${headerStr}\n\n${body}\0`;
}

function sendStomp(client: { send: (data: string) => void }, frame: string) {
  client.send(`a[${JSON.stringify(frame)}]`);
}

export const chatHandlers = [
  stompWs.addEventListener('connection', ({ client }) => {
    client.send('o');
    const subscriptions = new Map<string, string>(); // subId → destination

    client.addEventListener('message', ({ data }) => {
      let stompFrame: string;
      try {
        const parsed = JSON.parse(data as string);
        stompFrame = Array.isArray(parsed) ? parsed[0] : (data as string);
      } catch {
        stompFrame = data as string;
      }

      const { command, headers, body } = parseStompFrame(stompFrame);

      if (command === 'CONNECT') {
        sendStomp(
          client,
          buildStompFrame('CONNECTED', { version: '1.2', 'heart-beat': '0,0' }),
        );
      } else if (command === 'SUBSCRIBE') {
        subscriptions.set(headers.id, headers.destination);
      } else if (command === 'SEND') {
        const payload = JSON.parse(body) as {
          body: string;
          messageType: string;
          roomId: string | null;
          postId: string | null;
          receiverId: string | null;
        };

        let roomId = payload.roomId;
        let subId: string | undefined;
        let destination: string | undefined;

        if (roomId) {
          const sub = [...subscriptions.entries()].find(([, dest]) =>
            dest.includes(roomId ?? ''),
          );
          if (sub) [subId, destination] = sub;
        } else {
          // 신규 방 - 첫 메시지 전송 시 roomId 생성 후 subscription destination 업데이트
          roomId = `room-${payload.postId ?? Date.now()}`;
          const sub = [...subscriptions.entries()][0];
          if (sub) {
            [subId] = sub;
            destination = `/topic/chat/${roomId}`;
            subscriptions.set(subId, destination);
          }

          // mockChatList에 새 방 추가
          const postId = Number(payload.postId);
          const roomData = mockChatRoom[postId];
          const post = mockPostList.find((p) => p.id === postId);
          if (roomData && !mockChatList.some((c) => c.roomId === roomId)) {
            mockChatList.unshift({
              roomId,
              topicId: destination ?? '',
              leaderId: roomData.leaderId,
              memberId: roomData.memberId,
              myRole: roomData.myRole,
              roomName: post?.author ?? '',
              unReadCount: 0,
              lastMessage: '',
              lastMessageAt: new Date(),
              postId: String(postId),
              leaderProfileImageCode: roomData.leaderProfileImageCode,
              memberProfileImageCode: roomData.memberProfileImageCode,
            });
          }
        }

        if (!subId || !destination) return;

        const response = {
          id: `msg-${Date.now()}`,
          roomId,
          postId: payload.postId ?? '',
          senderId: 'user-1',
          receiverId: payload.receiverId ?? '',
          senderNickname: mockProfile.nickname,
          body: payload.body,
          createdAt: new Date().toISOString(),
          messageType: payload.messageType,
        };

        mockChatHistory.push(response);

        const chatListItem = mockChatList.find((c) => c.roomId === roomId);
        if (chatListItem) {
          chatListItem.lastMessage = response.body;
          chatListItem.lastMessageAt = new Date(response.createdAt);
        }

        sendStomp(
          client,
          buildStompFrame(
            'MESSAGE',
            {
              subscription: subId,
              'message-id': `msg-${Date.now()}`,
              destination,
              'content-type': 'application/json',
            },
            JSON.stringify(response),
          ),
        );
      }
    });
  }),

  /** SockJS 핸드셰이크 - info 엔드포인트 */
  http.get(`${BASE_URL}/connect/info`, () => {
    return HttpResponse.json({
      websocket: true,
      origins: ['*:*'],
      cookie_needed: false,
      entropy: Math.floor(Math.random() * 2147483647),
    });
  }),

  /** 채팅방 개설 또는 기존 roomId 조회 */
  http.post(`${BASE_URL}/api/chat/room/create`, async ({ request }) => {
    const body = (await request.json()) as { postId: string };
    const postId = Number(body.postId);
    const room = mockChatRoom[postId];
    if (room)
      return HttpResponse.json({
        ...room,
        history: mockChatHistory.filter((m) => m.roomId === room.roomId),
      });

    const post = mockPostList.find((p) => p.id === postId);
    const newRoom = {
      ...mockNewChatRoom,
      topicId: `/topic/chat/new-${postId}`,
      leaderProfileImageCode: post?.authorProfileImageCode ?? 1,
      memberProfileImageCode: mockProfile.profileImageCode,
    };
    mockChatRoom[postId] = newRoom;
    return HttpResponse.json(newRoom);
  }),

  /** 내 채팅방 목록 조회 */
  http.get(`${BASE_URL}/api/chat/my/rooms`, ({ request }) => {
    const filter = new URL(request.url).searchParams.get('filter');
    const list =
      filter === 'UNREAD'
        ? mockChatList.filter((c) => c.unReadCount > 0)
        : mockChatList;
    return HttpResponse.json(list);
  }),

  /** 채팅방 히스토리 조회 */
  http.get(`${BASE_URL}/api/chat/rooms/:roomId/history`, ({ params }) => {
    return HttpResponse.json(
      mockChatHistory.filter((m) => m.roomId === params.roomId),
    );
  }),

  /** 메시지 읽음 처리 */
  http.post(`${BASE_URL}/api/chat/rooms/:roomId/read`, ({ params }) => {
    const chatListItem = mockChatList.find((c) => c.roomId === params.roomId);
    if (chatListItem) {
      chatListItem.unReadCount = 0;
    }
    return HttpResponse.json({ readCount: 0 });
  }),

  /** 채팅방 나가기 */
  http.delete(`${BASE_URL}/api/chat/rooms/:roomId/leave`, ({ params }) => {
    const index = mockChatList.findIndex((c) => c.roomId === params.roomId);
    if (index !== -1) {
      const postId = Number(mockChatList[index].postId);
      mockChatList.splice(index, 1);
      delete mockChatRoom[postId];
    }

    mockChatHistory.splice(
      0,
      mockChatHistory.length,
      ...mockChatHistory.filter((m) => m.roomId !== params.roomId),
    );

    return new HttpResponse(null, { status: 204 });
  }),
];
