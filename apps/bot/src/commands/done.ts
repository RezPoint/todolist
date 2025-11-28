import { Context } from 'grammy';
import { api } from '../lib/api';
import { getUserInfo } from '../lib/utils';

export async function doneCommand(ctx: Context) {
  const text = ctx.message?.text?.replace('/done', '').trim();

  if (!text || text.length === 0) {
    await ctx.reply('✅ Использование: /done <номер задачи>\n\nПример: /done 1');
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
    if (task.status === 'DONE') {
      await ctx.reply('✅ Эта задача уже выполнена!');
      return;
    }

    await api.updateTask(userId, task.id, { status: 'DONE' }, getUserInfo(ctx.from));
    await ctx.reply(`✅ Задача "${task.title}" отмечена как выполненная!`);
  } catch (error) {
    console.error('Error in doneCommand:', error);
    await ctx.reply('❌ Ошибка при обновлении задачи. Попробуй позже.');
  }
}

