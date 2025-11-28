# Скрипт автоматической настройки MiniApp для Telegram

Write-Host "🚀 Настройка MiniApp для Telegram..." -ForegroundColor Cyan
Write-Host ""

# Проверка запущенного MiniApp
Write-Host "📱 Проверка MiniApp..." -ForegroundColor Yellow
$miniappRunning = try {
    $response = Invoke-WebRequest -Uri http://localhost:5173 -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    $true
} catch {
    $false
}

if (-not $miniappRunning) {
    Write-Host "⚠️  MiniApp не запущен на порту 5173" -ForegroundColor Yellow
    Write-Host "   Запускаю MiniApp..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev -w apps/miniapp"
    Start-Sleep -Seconds 5
}

# Попытка использовать localtunnel
Write-Host ""
Write-Host "🌐 Настройка туннеля..." -ForegroundColor Yellow

# Проверка localtunnel
$ltInstalled = Get-Command lt -ErrorAction SilentlyContinue
if ($ltInstalled) {
    Write-Host "✅ localtunnel найден" -ForegroundColor Green
    
    # Запуск localtunnel в фоне
    Write-Host "   Запускаю localtunnel..." -ForegroundColor Yellow
    $ltProcess = Start-Process -FilePath "lt" -ArgumentList "--port", "5173", "--subdomain", "todolist-rezpoin" -PassThru -WindowStyle Hidden -ErrorAction SilentlyContinue
    
    if ($ltProcess) {
        Start-Sleep -Seconds 5
        $tunnelUrl = "https://todolist-rezpoin.loca.lt"
        Write-Host "✅ Туннель создан: $tunnelUrl" -ForegroundColor Green
        
        # Обновление .env
        $envContent = Get-Content apps\bot\.env -Raw
        if ($envContent -notmatch "MINIAPP_URL") {
            $envContent += "`nMINIAPP_URL=$tunnelUrl`n"
        } else {
            $envContent = $envContent -replace "MINIAPP_URL=.*", "MINIAPP_URL=$tunnelUrl"
        }
        Set-Content -Path apps\bot\.env -Value $envContent -NoNewline
        
        Write-Host ""
        Write-Host "✅ Настройка завершена!" -ForegroundColor Green
        Write-Host "📱 MiniApp URL: $tunnelUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🤖 Теперь:" -ForegroundColor Yellow
        Write-Host "   1. Перезапустите бота: npm run dev -w apps/bot" -ForegroundColor White
        Write-Host "   2. Отправьте /start в Telegram" -ForegroundColor White
        Write-Host "   3. Нажмите кнопку '📱 Открыть MiniApp'" -ForegroundColor White
    } else {
        Write-Host "⚠️  Не удалось запустить localtunnel" -ForegroundColor Yellow
        Write-Host "   Попробуйте вручную: lt --port 5173" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  localtunnel не установлен" -ForegroundColor Yellow
    Write-Host "   Устанавливаю..." -ForegroundColor Yellow
    npm install -g localtunnel
    Write-Host ""
    Write-Host "✅ Установлено! Запустите скрипт снова." -ForegroundColor Green
}

