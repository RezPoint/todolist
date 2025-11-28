import { prisma } from '../../lib/prisma';

export type UpsertUserInput = {
  telegramId: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  languageCode?: string | null;
};

export async function ensureUser(input: UpsertUserInput) {
  return prisma.user.upsert({
    where: { telegramId: input.telegramId },
    update: {
      username: input.username ?? undefined,
      firstName: input.firstName ?? undefined,
      lastName: input.lastName ?? undefined,
      languageCode: input.languageCode ?? undefined
    },
    create: {
      telegramId: input.telegramId,
      username: input.username,
      firstName: input.firstName,
      lastName: input.lastName,
      languageCode: input.languageCode
    }
  });
}

