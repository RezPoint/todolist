import type { FastifyRequest } from 'fastify'

export function getUserId(request: FastifyRequest): number {
  const userId = request.headers['x-user-id']
  if (!userId) {
    throw new Error('User ID not found in headers')
  }
  return parseInt(String(userId), 10)
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

