# Автоматический деплой MiniApp на Vercel

Write-Host "🚀 Деплой MiniApp на Vercel..." -ForegroundColor Cyan
Write-Host ""

# Проверка Vercel CLI
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "📦 Устанавливаю Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Сборка MiniApp
Write-Host "🔨 Собираю MiniApp..." -ForegroundColor Yellow
Set-Location apps/miniapp
npm run build

if (-not (Test-Path "dist")) {
    Write-Host "❌ Ошибка сборки!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Сборка завершена" -ForegroundColor Green
Write-Host ""

# Деплой на Vercel
Write-Host "🌐 Деплой на Vercel..." -ForegroundColor Yellow
Write-Host "   (Потребуется авторизация в браузере)" -ForegroundColor Gray
Write-Host ""

# Создаем vercel.json если его нет
if (-not (Test-Path "vercel.json")) {
    @{
        "rewrites" = @(
            @{
                "source" = "/(.*)"
                "destination" = "/index.html"
            }
        )
    } | ConvertTo-Json | Set-Content "vercel.json"
}

# Запускаем деплой
Write-Host "📤 Запускаю деплой..." -ForegroundColor Yellow
Write-Host "   Следуйте инструкциям в браузере" -ForegroundColor Gray
Write-Host ""

vercel --prod

Write-Host ""
Write-Host "✅ Деплой завершен!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Следующие шаги:" -ForegroundColor Cyan
Write-Host "   1. Скопируйте URL из вывода выше" -ForegroundColor White
Write-Host "   2. Обновите apps/bot/.env: MINIAPP_URL=<ваш-vercel-url>" -ForegroundColor White
Write-Host "   3. Перезапустите бота" -ForegroundColor White
Write-Host "   4. Обновите Menu Button через @BotFather" -ForegroundColor White

Set-Location ../..

