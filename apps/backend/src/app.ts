import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod';
import { env } from './config/env';
import { registerHealthRoutes } from './routes/health';
import { registerTaskRoutes } from './routes/tasks';

export async function buildServer() {
  const app = Fastify({
    logger: {
      transport:
        env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true
              }
            }
          : undefined
    }
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
    origin: true,
    credentials: true
  });

  await app.register(sensible);

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Todolist API',
        version: '0.1.0'
      }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    initOAuth: {},
    staticCSP: true
  });

  await app.register(async (instance) => {
    await registerHealthRoutes(instance);
    await registerTaskRoutes(instance);
  }, { prefix: '/api' });

  return app;
}

