import { bookmarkHandlers } from './handlers/bookmark';
import { chatHandlers } from './handlers/chat';
import { matchedHandlers } from './handlers/matched';
import { myHandlers } from './handlers/my';
import { notificationHandlers } from './handlers/notification';
import { postHandlers } from './handlers/posts';
import { profileHandlers } from './handlers/profile';
import { reviewHandlers } from './handlers/review';

export const handlers = [
  ...bookmarkHandlers,
  ...postHandlers,
  ...matchedHandlers,
  ...profileHandlers,
  ...myHandlers,
  ...reviewHandlers,
  ...notificationHandlers,
  ...chatHandlers,
];
