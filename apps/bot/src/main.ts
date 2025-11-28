import { createBot } from './bot';
import { env } from './config/env';

async function bootstrap() {
  const bot = createBot();

  try {
    await bot.start();
    console.info(`🤖 Bot started successfully!`);
    console.info(`📱 Environment: ${env.NODE_ENV}`);
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

bootstrap();

