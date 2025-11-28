import { Bot } from 'grammy';
import { env } from './config/env';
import { startCommand } from './commands/start';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { doneCommand } from './commands/done';
import { todoCommand } from './commands/todo';
import { deleteCommand } from './commands/delete';
import { todayCommand } from './commands/today';
import { textHandler } from './handlers/text';

export function createBot() {
  const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

  // Commands
  bot.command('start', startCommand);
  bot.command('add', addCommand);
  bot.command('list', listCommand);
  bot.command('done', doneCommand);
  bot.command('todo', todoCommand);
  bot.command('delete', deleteCommand);
  bot.command('today', todayCommand);

  // Text handler (for quick task creation)
  bot.on('message:text', textHandler);

  // Error handler
  bot.catch((err) => {
    console.error('Bot error:', err);
  });

  return bot;
}

