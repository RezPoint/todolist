# 📁 Структура проекта

Подробное описание структуры проекта TodoList.

## 🏗️ Общая структура

```
todolist/
├── .github/                 # GitHub конфигурация
│   └── workflows/          # CI/CD workflows
├── apps/                   # Приложения
│   ├── backend/           # Backend API
│   ├── bot/               # Telegram Bot
│   └── miniapp/           # Telegram MiniApp
├── packages/               # Shared packages
│   ├── bot-scenarios/     # Сценарии для бота
│   ├── sdk/               # SDK для API
│   ├── types/             # Общие типы
│   └── ui-kit/            # UI компоненты
├── docs/                   # Документация (опционально)
└── [config files]         # Конфигурационные файлы
```

## 📦 Apps

### Backend (`apps/backend/`)

REST API сервер на Fastify.

```
backend/
├── prisma/
│   ├── schema.prisma      # Схема базы данных
│   └── migrations/        # Миграции БД
├── src/
│   ├── config/
│   │   └── env.ts         # Конфигурация окружения
│   ├── lib/
│   │   └── prisma.ts      # Prisma Client
│   ├── modules/
│   │   ├── tasks/         # Модуль задач
│   │   │   └── task.service.ts
│   │   └── users/         # Модуль пользователей
│   │       └── user.service.ts
│   ├── routes/
│   │   ├── health.ts      # Health check
│   │   └── tasks.ts       # API endpoints для задач
│   ├── app.ts             # Настройка Fastify
│   └── main.ts            # Точка входа
└── package.json
```

**Технологии:**
- Fastify - веб-фреймворк
- Prisma - ORM
- Zod - валидация
- Swagger - документация API

### Bot (`apps/bot/`)

Telegram бот на Grammy.

```
bot/
├── src/
│   ├── commands/          # Команды бота
│   │   ├── start.ts
│   │   ├── add.ts
│   │   ├── list.ts
│   │   ├── done.ts
│   │   ├── todo.ts
│   │   ├── delete.ts
│   │   └── today.ts
│   ├── handlers/          # Обработчики
│   │   └── text.ts        # Обработка текстовых сообщений
│   ├── lib/
│   │   ├── api.ts         # API клиент для backend
│   │   └── utils.ts       # Утилиты
│   ├── config/
│   │   └── env.ts         # Конфигурация
│   ├── bot.ts             # Настройка бота
│   └── main.ts            # Точка входа
└── package.json
```

**Технологии:**
- Grammy - Telegram Bot Framework
- node-fetch - HTTP клиент
- TypeScript - типизация

### MiniApp (`apps/miniapp/`)

React приложение для Telegram MiniApp.

```
miniapp/
├── public/                 # Статические файлы
├── src/
│   ├── components/        # React компоненты
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   └── AddTaskForm.tsx
│   ├── store/
│   │   └── taskStore.ts   # Zustand store
│   ├── lib/
│   │   └── api.ts         # API клиент
│   ├── App.tsx            # Главный компонент
│   ├── main.tsx           # Точка входа
│   └── index.css          # Стили
├── index.html
├── vite.config.ts         # Vite конфигурация
├── tailwind.config.js     # Tailwind конфигурация
├── vercel.json            # Vercel конфигурация
└── package.json
```

**Технологии:**
- React 19 - UI библиотека
- Vite - сборщик
- Tailwind CSS - стилизация
- Zustand - управление состоянием
- Telegram WebApp SDK - интеграция с Telegram
- Axios - HTTP клиент

## 🔧 Конфигурационные файлы

### Root level

- `package.json` - конфигурация монорепозитория
- `tsconfig.base.json` - базовая TypeScript конфигурация
- `eslint.config.mjs` - ESLint конфигурация
- `.prettierrc.json` - Prettier конфигурация
- `.gitignore` - Git ignore правила
- `.gitattributes` - Git атрибуты
- `docker-compose.yml` - Docker конфигурация

### Documentation

- `README.md` - основная документация
- `CONTRIBUTING.md` - руководство по вкладу
- `CHANGELOG.md` - история изменений
- `LICENSE` - лицензия
- `PROJECT_STRUCTURE.md` - этот файл

## 📊 Архитектурные решения

### Монорепозиторий

Используется npm workspaces для управления зависимостями:
- Общие dev зависимости в корне
- Изолированные зависимости в каждом app
- Единая конфигурация TypeScript/ESLint

### API Design

RESTful API с:
- Валидацией через Zod
- Автоматической документацией через Swagger
- Аутентификацией через Telegram ID в заголовках

### Database

Prisma ORM с поддержкой:
- PostgreSQL (продакшн)
- SQLite (разработка)

### State Management

- Backend: Stateless (каждый запрос независим)
- Bot: Stateless (Grammy обрабатывает каждый запрос)
- MiniApp: Zustand для клиентского состояния

## 🚀 Деплой

### Backend
- Требует PostgreSQL базу данных
- Переменные окружения для конфигурации
- Миграции через Prisma

### Bot
- Требует постоянное подключение
- Переменные окружения для токена и API URL

### MiniApp
- Статический хостинг (Vercel, Netlify)
- Переменные окружения для API URL

## 📝 Соглашения

### Именование
- Файлы: `kebab-case` для конфигов, `camelCase` для кода
- Компоненты: `PascalCase`
- Функции/переменные: `camelCase`
- Константы: `UPPER_SNAKE_CASE`

### Структура кода
- Один экспорт на файл для основных модулей
- Группировка по функциональности
- Разделение на слои (routes → services → database)

### Коммиты
- Conventional Commits формат
- Ясные и описательные сообщения
- Один коммит = одно логическое изменение

