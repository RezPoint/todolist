import { Context } from 'grammy';
import { env } from '../config/env';

export async function startCommand(ctx: Context) {
  const name = ctx.from?.first_name || 'друг';
  
  // URL для MiniApp (если настроен)
  const miniappUrl = env.MINIAPP_URL;
  
  const message = `👋 Привет, ${name}!\n\n` +
    `Я помогу тебе управлять задачами. Вот что я умею:\n\n` +
    `📝 /add - добавить новую задачу\n` +
    `📋 /list - показать все задачи\n` +
    `✅ /done <номер> - отметить задачу выполненной\n` +
    `🔄 /todo <номер> - вернуть задачу в работу\n` +
    `🗑️ /delete <номер> - удалить задачу\n` +
    `📊 /today - задачи на сегодня\n` +
    `\n💡 Или просто напиши задачу, и я её добавлю!`;
  
  // Добавляем кнопку MiniApp только если URL настроен и валиден
  if (miniappUrl && miniappUrl.startsWith('https://')) {
    await ctx.reply(
      message + `\n\n📱 Или открой MiniApp для удобного управления!`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📱 Открыть MiniApp',
                web_app: { url: miniappUrl }
              }
            ]
          ]
        }
      }
    );
  } else {
    await ctx.reply(message);
  }
}

