# Автоматическая настройка ngrok для MiniApp

Write-Host "🚀 Настройка ngrok для MiniApp..." -ForegroundColor Cyan
Write-Host ""

# Проверка ngrok
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokInstalled) {
    Write-Host "❌ ngrok не установлен" -ForegroundColor Red
    Write-Host "   Установите ngrok: https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host "   Или через npm: npm install -g ngrok" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ ngrok найден" -ForegroundColor Green
Write-Host ""

# Проверка авторизации ngrok
Write-Host "🔐 Проверка авторизации ngrok..." -ForegroundColor Yellow
$ngrokConfig = "$env:USERPROFILE\.ngrok2\ngrok.yml"
if (-not (Test-Path $ngrokConfig)) {
    Write-Host "⚠️  ngrok не авторизован" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Для работы ngrok нужна регистрация:" -ForegroundColor Cyan
    Write-Host "1. Зарегистрируйтесь на https://ngrok.com" -ForegroundColor White
    Write-Host "2. Получите токен авторизации" -ForegroundColor White
    Write-Host "3. Выполните: ngrok config add-authtoken YOUR_TOKEN" -ForegroundColor White
    Write-Host ""
    Write-Host "Или используйте альтернативу - настройте через @BotFather" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ ngrok авторизован" -ForegroundColor Green
Write-Host ""

# Запуск ngrok
Write-Host "🌐 Запуск ngrok туннеля..." -ForegroundColor Yellow
Start-Process ngrok -ArgumentList "http", "5173" -WindowStyle Minimized

Start-Sleep -Seconds 5

# Получение URL
try {
    $tunnels = Invoke-RestMethod -Uri http://localhost:4040/api/tunnels -ErrorAction Stop
    $httpsUrl = ($tunnels.tunnels | Where-Object { $_.proto -eq 'https' }).public_url
    
    if ($httpsUrl) {
        Write-Host "✅ Туннель создан: $httpsUrl" -ForegroundColor Green
        
        # Обновление .env
        $envPath = "apps\bot\.env"
        $envContent = Get-Content $envPath -Raw -ErrorAction SilentlyContinue
        if (-not $envContent) {
            $envContent = Get-Content "apps\bot\env.example" -Raw
        }
        
        if ($envContent -notmatch "MINIAPP_URL") {
            $envContent += "`nMINIAPP_URL=$httpsUrl`n"
        } else {
            $envContent = $envContent -replace "MINIAPP_URL=.*", "MINIAPP_URL=$httpsUrl"
        }
        
        Set-Content -Path $envPath -Value $envContent -NoNewline
        
        Write-Host ""
        Write-Host "✅ URL обновлен в apps/bot/.env" -ForegroundColor Green
        Write-Host ""
        Write-Host "🤖 Перезапустите бота: npm run dev -w apps/bot" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  Не удалось получить URL туннеля" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Ошибка при получении URL: $_" -ForegroundColor Red
    Write-Host "   Проверьте, что ngrok запущен на порту 4040" -ForegroundColor Yellow
}

