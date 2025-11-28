# 🤖 Telegram Bot

Telegram бот для управления задачами через удобные команды в чате.

## 📁 Структура

```
bot/
├── src/
│   ├── commands/       # Команды бота
│   │   ├── start.ts
│   │   ├── add.ts
│   │   ├── list.ts
│   │   ├── done.ts
│   │   ├── todo.ts
│   │   ├── delete.ts
│   │   └── today.ts
│   ├── handlers/       # Обработчики событий
│   │   └── text.ts     # Обработка текстовых сообщений
│   ├── lib/            # Утилиты
│   │   ├── api.ts      # API клиент
│   │   └── utils.ts    # Вспомогательные функции
│   ├── config/         # Конфигурация
│   ├── constants/      # Константы
│   ├── types/          # TypeScript типы
│   ├── bot.ts          # Настройка бота
│   └── main.ts         # Точка входа
└── package.json
```

## 🛠️ Технологии

- **Grammy** - современный Telegram Bot Framework
- **node-fetch** - HTTP клиент для API запросов
- **TypeScript** - типизация

## 🚀 Запуск

```bash
# Установка зависимостей
npm install

# Разработка
npm run dev

# Сборка
npm run build

# Продакшн
npm start
```

## 📝 Переменные окружения

Создайте `.env` файл на основе `env.example`:

```env
NODE_ENV=development
TELEGRAM_BOT_TOKEN=your_bot_token
BACKEND_URL=http://localhost:3000
MINIAPP_URL=https://your-miniapp-url.com
```

## 📋 Команды

- `/start` - Начать работу с ботом
- `/add <задача>` - Добавить задачу
- `/list` - Показать все задачи
- `/done <номер>` - Отметить задачу выполненной
- `/todo <номер>` - Вернуть задачу в работу
- `/delete <номер>` - Удалить задачу
- `/today` - Задачи на сегодня

Также можно просто написать текст - бот автоматически создаст задачу!

