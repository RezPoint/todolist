import type { User as TelegramUser } from '@grammyjs/types';

export function getUserInfo(user?: TelegramUser) {
  if (!user) return {};
  return {
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    languageCode: user.language_code
  };
}

