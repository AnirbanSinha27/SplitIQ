import redis from './redis';
import { handleExpenseEvent } from './handlers/redis.handler';
import { NotificationEvent } from '@splitiq/validation/notification';

console.log('🔔 Notification worker started');

async function start() {
  while (true) {
    try {
      const result = await redis.brpop('notification-queue', 0);

      if (!result) continue;

      const [, message] = result;
      const event = JSON.parse(message) as NotificationEvent;

      console.log('[EVENT RECEIVED]', event.type);

      await handleExpenseEvent(event);
    } catch (err) {
      console.error('❌ Worker error:', err);
    }
  }
}

start();
