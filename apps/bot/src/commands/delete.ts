import { Context } from 'grammy';
import { api } from '../lib/api';
import { getUserInfo } from '../lib/utils';

export async function deleteCommand(ctx: Context) {
  const text = ctx.message?.text?.replace('/delete', '').trim();

  if (!text || text.length === 0) {
    await ctx.reply('🗑️ Использование: /delete <номер задачи>\n\nПример: /delete 1');
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
    console.log(`Deleting task ${task.id} for user ${userId}`);
    const result = await api.deleteTask(userId, task.id, getUserInfo(ctx.from));
    console.log(`Delete result:`, result);
    
    if (result.success) {
      await ctx.reply(`🗑️ Задача "${task.title}" удалена!`);
    } else {
      await ctx.reply('❌ Не удалось удалить задачу. Попробуй позже.');
    }
  } catch (error) {
    console.error('Error in deleteCommand:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    await ctx.reply(`❌ Ошибка при удалении задачи: ${errorMessage}\n\nПопробуй позже или проверь подключение к серверу.`);
  }
}

