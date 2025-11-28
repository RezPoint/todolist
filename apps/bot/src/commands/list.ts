import { Context } from 'grammy';
import { api } from '../lib/api';
import { getUserInfo } from '../lib/utils';

export async function listCommand(ctx: Context) {
  try {
    const userId = String(ctx.from?.id);
    const tasks = await api.getTasks(userId, getUserInfo(ctx.from));

    if (tasks.length === 0) {
      await ctx.reply('📭 У тебя пока нет задач. Добавь первую командой /add или просто напиши задачу!');
      return;
    }

    const statusEmoji = {
      PENDING: '⏳',
      IN_PROGRESS: '🔄',
      DONE: '✅'
    };

    const priorityEmoji: Record<string | number, string> = {
      0: '',
      1: '🔴',
      2: '🟠',
      3: '🟡',
      LOW: '🟢',
      MEDIUM: '🟡',
      HIGH: '🔴'
    };

    let message = '📋 <b>Твои задачи:</b>\n\n';
    tasks.forEach((task, index) => {
      const emoji = statusEmoji[task.status];
      const priorityKey = typeof task.priority === 'number' ? task.priority : task.priority || 0;
      const priority = priorityEmoji[priorityKey] || '';
      const dueDate = task.dueDate ? ` 📅 ${new Date(task.dueDate).toLocaleDateString('ru-RU')}` : '';
      message += `${index + 1}. ${emoji} ${priority} ${task.title}${dueDate}\n`;
      if (task.description) {
        message += `   └ ${task.description.substring(0, 50)}${task.description.length > 50 ? '...' : ''}\n`;
      }
    });

    await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error in listCommand:', error);
    await ctx.reply('❌ Ошибка при получении задач. Попробуй позже.');
  }
}

