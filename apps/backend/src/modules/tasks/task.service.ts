import { Prisma, TaskStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  projectId?: string | null;
  priority?: number;
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  status?: TaskStatus;
};

export const TaskService = {
  async listByOwner(ownerId: string) {
    return prisma.task.findMany({
      where: { ownerId },
      orderBy: [
        { status: 'asc' },
        { orderIndex: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  },

  async create(ownerId: string, data: CreateTaskInput) {
    // Validate project exists and belongs to user if provided
    if (data.projectId) {
      const project = await prisma.project.findFirst({
        where: { id: data.projectId, ownerId }
      });
      if (!project) {
        throw new Error('Project not found or access denied');
      }
    }

    const payload: Prisma.TaskCreateInput = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      project: data.projectId ? { connect: { id: data.projectId } } : undefined,
      priority: data.priority ?? 0,
      owner: { connect: { id: ownerId } }
    };

    try {
      return await prisma.task.create({ data: payload });
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string };
        if (prismaError.code === 'P2002') {
          throw new Error('Task with this identifier already exists');
        }
        if (prismaError.code === 'P2003') {
          throw new Error('Invalid reference (project or owner not found)');
        }
      }
      throw error;
    }
  },

  async update(ownerId: string, taskId: string, data: UpdateTaskInput) {
    // Validate project if being updated
    if (data.projectId !== undefined && data.projectId !== null) {
      const project = await prisma.project.findFirst({
        where: { id: data.projectId, ownerId }
      });
      if (!project) {
        throw new Error('Project not found or access denied');
      }
    }

    try {
      const result = await prisma.task.updateMany({
        where: { id: taskId, ownerId },
        data
      });

      if (result.count === 0) {
        throw new Error('Task not found or access denied');
      }

      return await prisma.task.findUniqueOrThrow({ where: { id: taskId } });
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string };
        if (prismaError.code === 'P2025') {
          throw new Error('Task not found');
        }
      }
      throw error;
    }
  },

  async delete(ownerId: string, taskId: string) {
    const result = await prisma.task.deleteMany({
      where: { id: taskId, ownerId }
    });

    if (result.count === 0) {
      throw new Error('Task not found or access denied');
    }

    return { success: true };
  }
};

