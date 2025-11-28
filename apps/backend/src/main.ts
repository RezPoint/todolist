import { buildServer } from './app.js'
import { env } from './config/env.js'

async function bootstrap() {
  const app = await buildServer();

  try {
    await app.listen({
      port: env.PORT,
      host: '0.0.0.0'
    });
    app.log.info(`🚀 Backend ready on http://localhost:${env.PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

bootstrap();

