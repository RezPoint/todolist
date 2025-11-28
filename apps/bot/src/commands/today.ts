import { Context } from 'grammy';
import { api } from '../lib/api';
import { getUserInfo } from '../lib/utils';

export async function todayCommand(ctx: Context) {
  try {
    const userId = String(ctx.from?.id);
    const tasks = await api.getTasks(userId, getUserInfo(ctx.from));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Показываем задачи без даты (считаем их актуальными на сегодня) 
    // или задачи с датой на сегодня
    const todayTasks = tasks.filter((task) => {
      if (!task.dueDate) {
        // Задачи без даты показываем как задачи на сегодня
        return true;
      }
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });

    if (todayTasks.length === 0) {
      await ctx.reply('📅 У тебя нет задач на сегодня. Отличный день! 🎉');
      return;
    }

    const statusEmoji = {
      PENDING: '⏳',
      IN_PROGRESS: '🔄',
      DONE: '✅'
    };

    let message = '📅 <b>Задачи на сегодня:</b>\n\n';
    todayTasks.forEach((task, index) => {
      const emoji = statusEmoji[task.status];
      const dateInfo = task.dueDate ? ` 📅 ${new Date(task.dueDate).toLocaleDateString('ru-RU')}` : '';
      message += `${index + 1}. ${emoji} ${task.title}${dateInfo}\n`;
      if (task.description) {
        message += `   └ ${task.description.substring(0, 50)}${task.description.length > 50 ? '...' : ''}\n`;
      }
    });

    await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Error in todayCommand:', error);
    await ctx.reply('❌ Ошибка при получении задач. Попробуй позже.');
  }
}

