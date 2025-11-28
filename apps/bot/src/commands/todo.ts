import { Context } from 'grammy';
import { api } from '../lib/api';
import { getUserInfo } from '../lib/utils';

export async function todoCommand(ctx: Context) {
  const text = ctx.message?.text?.replace('/todo', '').trim();

  if (!text || text.length === 0) {
    await ctx.reply('🔄 Использование: /todo <номер задачи>\n\nПример: /todo 1');
    return;
  }

  const taskNumber = parseInt(text, 10);
  if (isNaN(taskNumber) || taskNumber < 1) {
    await ctx.reply('❌ Укажи правильный номер задачи. Используй /list чтобы увидеть все задачи.');
    return;
  }

  try {
    const userId = String(ctx.from?.id);
    const tasks = await api.getTasks(userId, getUserInfo(ctx.from));

    if (taskNumber > tasks.length) {
      await ctx.reply(`❌ Задачи с номером ${taskNumber} не существует. Используй /list чтобы увидеть все задачи.`);
      return;
    }

    const task = tasks[taskNumber - 1];
    if (task.status === 'PENDING') {
      await ctx.reply('⏳ Эта задача уже в статусе "В ожидании"!');
      return;
    }

    await api.updateTask(userId, task.id, { status: 'PENDING' }, getUserInfo(ctx.from));
    await ctx.reply(`🔄 Задача "${task.title}" возвращена в работу!`);
  } catch (error) {
    console.error('Error in todoCommand:', error);
    await ctx.reply('❌ Ошибка при обновлении задачи. Попробуй позже.');
  }
}

