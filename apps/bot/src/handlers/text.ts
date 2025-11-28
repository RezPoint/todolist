import { Context } from 'grammy';
import { api } from '../lib/api';
import { getUserInfo } from '../lib/utils';

export async function textHandler(ctx: Context) {
  const text = ctx.message?.text?.trim();

  if (!text || text.startsWith('/')) {
    return; // Ignore commands and empty messages
  }

  try {
    const userId = String(ctx.from?.id);
    console.log(`Creating task from text for user ${userId}: "${text}"`);
    const task = await api.createTask(userId, { title: text }, getUserInfo(ctx.from));
    console.log(`Task created: ${task.id}`);

    await ctx.reply(`✅ Задача добавлена!\n\n📝 ${task.title}`);
  } catch (error) {
    console.error('Error in textHandler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await ctx.reply(`❌ Ошибка при добавлении задачи: ${errorMessage}\n\nПопробуй позже или проверь подключение к серверу.`);
  }
}

