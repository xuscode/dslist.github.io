# 启动 Web 服务器 (PowerShell版本)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  启动 Web 服务器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$jsonFile = "price_list.json"

# 检查 price_list.json 是否存在
if (-not (Test-Path $jsonFile)) {
    Write-Host "[警告] 未找到 $jsonFile 文件" -ForegroundColor Yellow
    Write-Host "[提示] 请先运行 convert.ps1 转换数据" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "[信息] 正在启动 Web 服务器..." -ForegroundColor Green
Write-Host "[端口] 8000" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  服务器已启动！" -ForegroundColor Green
Write-Host "  请在浏览器中访问:" -ForegroundColor White
Write-Host "  http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "  按 Ctrl+C 停止服务器" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 启动HTTP服务器
$port = 8000
Start-Process "http://localhost:$port"

try {
    python -m http.server $port
} catch {
    Write-Host ""
    Write-Host "[错误] 启动失败: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "[提示] 如果Python未安装，可以尝试其他方法：" -ForegroundColor Yellow
    Write-Host "  1. 安装 Python: https://www.python.org/downloads/" -ForegroundColor White
    Write-Host "  2. 使用 Node.js: npm install -g http-server; http-server -p 8000" -ForegroundColor White
    Write-Host "  3. 使用 PHP: php -S localhost:8000" -ForegroundColor White
}
