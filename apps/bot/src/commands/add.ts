import { Context } from 'grammy';
import { api } from '../lib/api';
import { getUserInfo } from '../lib/utils';

export async function addCommand(ctx: Context) {
  const messageText = ctx.message?.text || '';
  // Extract text after /add command
  const text = messageText.replace(/^\/add(@\w+)?\s*/, '').trim();

  if (!text || text.length === 0) {
    await ctx.reply('📝 Использование: /add <название задачи>\n\nПример: /add Купить молоко');
    return;
  }

  try {
    const userId = String(ctx.from?.id);
    console.log(`Creating task for user ${userId}: "${text}"`);
    const task = await api.createTask(userId, { title: text }, getUserInfo(ctx.from));
    console.log(`Task created: ${task.id}`);

    await ctx.reply(`✅ Задача добавлена!\n\n📝 ${task.title}`);
  } catch (error) {
    console.error('Error in addCommand:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await ctx.reply(`❌ Ошибка при добавлении задачи: ${errorMessage}\n\nПопробуй позже или проверь подключение к серверу.`);
  }
}

