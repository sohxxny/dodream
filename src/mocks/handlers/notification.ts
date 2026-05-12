import { HttpResponse, http } from 'msw';
import { BASE_URL } from '@/constants/auth.constant';
import { mockNotifications } from '../data/notifications';

export const notificationHandlers = [
  /** 알림 목록 조회 */
  http.get(`${BASE_URL}/api/v1/notifications`, () => {
    return HttpResponse.json(mockNotifications);
  }),

  /** 알림 읽기 */
  http.post(`${BASE_URL}/api/v1/notifications/:id/read`, ({ params }) => {
    const notif = mockNotifications.find((n) => n.id === params.id);
    if (notif) notif.read = true;
    return HttpResponse.json({});
  }),

  /** 알림 SSE 스트림 */
  http.get(`${BASE_URL}/api/v1/notifications/stream`, () => {
    const stream = new ReadableStream({
      start(controller) {
        const event = `event: notification\ndata: ${JSON.stringify({ message: '새 알림이 있습니다.' })}\n\n`;
        controller.enqueue(new TextEncoder().encode(event));
        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),
];
