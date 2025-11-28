# Автоматическая настройка MiniApp через Cloudflare Tunnel

Write-Host "🚀 Автоматическая настройка MiniApp..." -ForegroundColor Cyan
Write-Host ""

# Проверка MiniApp
Write-Host "📱 Проверка MiniApp..." -ForegroundColor Yellow
$miniappRunning = try {
    $response = Invoke-WebRequest -Uri http://localhost:5173 -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    $true
} catch {
    $false
}

if (-not $miniappRunning) {
    Write-Host "⚠️  MiniApp не запущен, запускаю..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev -w apps/miniapp"
    Start-Sleep -Seconds 5
}

# Запуск Cloudflare Tunnel
Write-Host ""
Write-Host "🌐 Запуск Cloudflare Tunnel..." -ForegroundColor Yellow

$cloudflaredInstalled = Get-Command cloudflared -ErrorAction SilentlyContinue
if (-not $cloudflaredInstalled) {
    Write-Host "❌ cloudflared не установлен" -ForegroundColor Red
    Write-Host "   Устанавливаю..." -ForegroundColor Yellow
    npm install -g cloudflared
}

# Запуск туннеля в фоне и получение URL
Write-Host "   Запускаю туннель..." -ForegroundColor Yellow

$tunnelProcess = Start-Process -FilePath "cloudflared" -ArgumentList "tunnel", "--url", "http://localhost:5173" -PassThru -WindowStyle Hidden -RedirectStandardOutput "cloudflared-output.txt" -RedirectStandardError "cloudflared-error.txt"

Start-Sleep -Seconds 8

# Попытка получить URL из вывода
$output = Get-Content "cloudflared-output.txt" -ErrorAction SilentlyContinue
$errorOutput = Get-Content "cloudflared-error.txt" -ErrorAction SilentlyContinue

$httpsUrl = $null
if ($output) {
    foreach ($line in $output) {
        if ($line -match "https://([a-z0-9-]+\.trycloudflare\.com)") {
            $httpsUrl = $matches[0]
            break
        }
    }
}

if (-not $httpsUrl -and $errorOutput) {
    foreach ($line in $errorOutput) {
        if ($line -match "https://([a-z0-9-]+\.trycloudflare\.com)") {
            $httpsUrl = $matches[0]
            break
        }
    }
}

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
    Write-Host "📋 Следующий шаг:" -ForegroundColor Cyan
    Write-Host "   Настройте через @BotFather:" -ForegroundColor White
    Write-Host "   1. Откройте @BotFather в Telegram" -ForegroundColor Gray
    Write-Host "   2. /mybots → выберите бота" -ForegroundColor Gray
    Write-Host "   3. Bot Settings → Menu Button" -ForegroundColor Gray
    Write-Host "   4. Введите URL: $httpsUrl" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🤖 После настройки кнопка MiniApp появится в меню бота!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Не удалось автоматически получить URL" -ForegroundColor Yellow
    Write-Host "   Проверьте вывод cloudflared в консоли" -ForegroundColor White
    Write-Host "   Или используйте ngrok вручную" -ForegroundColor White
}

