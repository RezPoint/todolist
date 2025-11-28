import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: {
        tags: ['health'],
        description: 'Service health check',
        response: {
          200: z.object({
            status: z.string(),
            timestamp: z.string()
          })
        }
      }
    },
    async () => ({
      status: 'ok',
      timestamp: new Date().toISOString()
    })
  );
}

