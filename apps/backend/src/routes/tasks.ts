import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { TaskStatus } from '@prisma/client';
import { TaskService } from '../modules/tasks/task.service.js'
import { ensureUser } from '../modules/users/user.service.js'

const createTaskBody = z.object({
  title: z.string().min(1),
  description: z.string().max(2000).optional(),
  dueDate: z.string().datetime().optional(),
  projectId: z.string().optional(),
  priority: z.number().int().min(0).max(3).optional()
});

const updateTaskBody = createTaskBody
  .partial()
  .extend({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Payload is empty'
  });

async function ensureUserSession(request: FastifyRequest) {
  const telegramId = request.headers['x-user-id'];
  if (!telegramId || typeof telegramId !== 'string') {
    throw request.server.httpErrors.badRequest('Missing x-user-id header');
  }
  const profile = await ensureUser({
    telegramId,
    username: request.headers['x-user-username'] as string | undefined,
    firstName: request.headers['x-user-first-name'] as string | undefined,
    lastName: request.headers['x-user-last-name'] as string | undefined,
    languageCode: request.headers['x-user-language-code'] as string | undefined
  });
  return profile.id;
}

export async function registerTaskRoutes(app: FastifyInstance) {
  app.get(
    '/tasks',
    {
      schema: {
        tags: ['tasks'],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string().nullable(),
              status: z.nativeEnum(TaskStatus),
              dueDate: z.string().datetime().nullable(),
              priority: z.number().int(),
              orderIndex: z.number().int(),
              projectId: z.string().nullable(),
              ownerId: z.string(),
              createdAt: z.string().datetime(),
              updatedAt: z.string().datetime()
            })
          )
        }
      }
    },
    async (request) => {
      const userId = await ensureUserSession(request);
      const tasks = await TaskService.listByOwner(userId);
      // Convert Date objects to ISO strings for JSON serialization
      return tasks.map((task: typeof tasks[0]) => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      }));
    }
  );

  app.post(
    '/tasks',
    {
      schema: {
        tags: ['tasks'],
        body: createTaskBody
      }
    },
    async (request) => {
      const userId = await ensureUserSession(request);
      const payload = request.body as z.infer<typeof createTaskBody>;
      try {
        const task = await TaskService.create(userId, {
          ...payload,
          dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined
        });
        return task;
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          throw request.server.httpErrors.notFound(error.message);
        }
        throw error;
      }
    }
  );

  app.patch(
    '/tasks/:taskId',
    {
      schema: {
        tags: ['tasks'],
        params: z.object({ taskId: z.string().min(1) }),
        body: updateTaskBody
      }
    },
    async (request) => {
      const userId = await ensureUserSession(request);
      const { taskId } = request.params as { taskId: string };
      const payload = request.body as z.infer<typeof updateTaskBody>;
      try {
        const updated = await TaskService.update(userId, taskId, {
          ...payload,
          status: payload.status as TaskStatus | undefined,
          dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined
        });
        return updated;
      } catch (error) {
        if (error instanceof Error && error.message.includes('Task not found')) {
          throw request.server.httpErrors.notFound(error.message);
        }
        throw error;
      }
    }
  );

  app.delete(
    '/tasks/:taskId',
    {
      schema: {
        tags: ['tasks'],
        params: z.object({ taskId: z.string().min(1) }),
        response: {
          200: z.object({
            success: z.boolean()
          })
        }
      }
    },
    async (request) => {
      const userId = await ensureUserSession(request);
      const { taskId } = request.params as { taskId: string };
      try {
        const result = await TaskService.delete(userId, taskId);
        return result;
      } catch (error) {
        if (error instanceof Error && error.message.includes('Task not found')) {
          throw request.server.httpErrors.notFound(error.message);
        }
        throw error;
      }
    }
  );
}

