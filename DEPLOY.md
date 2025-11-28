# 🚀 Деплой проекта (бесплатно)

Инструкции по деплою всех компонентов проекта на бесплатные платформы.

## 📋 Обзор

- **Backend** → Railway или Render (бесплатно)
- **Bot** → Railway или Render (бесплатно)
- **MiniApp** → Vercel (бесплатно)
- **Database** → Railway PostgreSQL или Render PostgreSQL (бесплатно)

## 🚂 Railway (Рекомендуется)

### Локальная разработка (опционально)

Если хотите тестировать локально с Railway:

```bash
# Установите Railway CLI
curl -fsSL https://railway.com/install.sh | sh

# Авторизуйтесь
railway login

# Подключитесь к проекту
railway link -p YOUR_PROJECT_ID

# Деплой
railway up
```

### 1. Backend

1. Зарегистрируйтесь на [Railway](https://railway.app)
2. Создайте новый проект
3. Добавьте PostgreSQL базу данных
4. Добавьте новый сервис из GitHub репозитория
5. Выберите корневую папку проекта
6. Установите переменные окружения:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   BACKEND_PUBLIC_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   ```
7. Установите команду запуска: `cd apps/backend && npm start`
8. Railway автоматически определит build команду

### 2. Bot

1. В том же проекте Railway добавьте новый сервис
2. Выберите тот же репозиторий
3. Установите переменные окружения:
   ```
   NODE_ENV=production
   TELEGRAM_BOT_TOKEN=your_bot_token
   BACKEND_URL=https://your-backend-url.railway.app
   MINIAPP_URL=https://your-miniapp-url.vercel.app
   ```
4. Установите команду запуска: `cd apps/bot && npm start`

## 🎨 Render

### 1. Backend

1. Зарегистрируйтесь на [Render](https://render.com)
2. Создайте новый Web Service
3. Подключите GitHub репозиторий
4. Настройки:
   - **Build Command**: `npm install && npm run build --workspace=apps/backend`
   - **Start Command**: `cd apps/backend && npm start`
   - **Environment**: Node
5. Добавьте PostgreSQL базу данных
6. Установите переменные окружения:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   BACKEND_PUBLIC_URL=https://your-backend.onrender.com
   ```

### 2. Bot

1. Создайте новый Background Worker
2. Подключите тот же репозиторий
3. Настройки:
   - **Build Command**: `npm install && npm run build --workspace=apps/bot`
   - **Start Command**: `cd apps/bot && npm start`
4. Установите переменные окружения:
   ```
   NODE_ENV=production
   TELEGRAM_BOT_TOKEN=your_bot_token
   BACKEND_URL=https://your-backend.onrender.com
   MINIAPP_URL=https://your-miniapp-url.vercel.app
   ```

## ⚡ Vercel (MiniApp)

MiniApp уже настроен на Vercel. Для обновления:

```bash
cd apps/miniapp
vercel --prod
```

Или подключите репозиторий в Vercel Dashboard для автоматического деплоя.

## 🔗 Настройка URL

После деплоя обновите:

1. **Backend URL** в переменных окружения Bot
2. **Backend URL** в переменных окружения MiniApp (Vercel)
3. **MiniApp URL** в Bot через переменные окружения
4. **MiniApp URL** в Telegram Bot через @BotFather

### 🌐 Кастомный домен

Если у вас есть кастомный домен (например, `cryptalis.su`), см. [DOMAIN_SETUP.md](DOMAIN_SETUP.md) для подробных инструкций по настройке.

## ✅ Проверка

1. Backend: `https://your-backend-url/api/health`
2. Bot: Отправьте `/start` боту
3. MiniApp: Откройте через кнопку в боте

## 💡 Важно

- Railway и Render бесплатны, но могут "засыпать" после неактивности
- Для постоянной работы используйте Railway (лучше для ботов)
- Render может засыпать на бесплатном тарифе (просыпается за ~30 сек)

