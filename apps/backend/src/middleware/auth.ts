import type { FastifyRequest, FastifyReply } from 'fastify'
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js'

export async function ensureUserSession(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<number> {
  const userId = request.headers['x-user-id']

  if (!userId) {
    return reply.code(HTTP_STATUS.UNAUTHORIZED).send({
      success: false,
      error: ERROR_MESSAGES.UNAUTHORIZED,
    })
  }

  const parsedUserId = parseInt(String(userId), 10)

  if (isNaN(parsedUserId)) {
    return reply.code(HTTP_STATUS.BAD_REQUEST).send({
      success: false,
      error: 'Invalid user ID',
    })
  }

  return parsedUserId
}

