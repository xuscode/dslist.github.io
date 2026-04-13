@echo off
chcp 65001 >nul
echo ========================================
echo   启动 Web 服务器
echo ========================================
echo.

REM 检查 price_list.json 是否存在
if not exist "price_list.json" (
    echo [警告] 未找到 price_list.json 文件
    echo [提示] 请先运行 convert.bat 转换数据
    echo.
    pause
    exit /b 1
)

REM 检查Python是否安装
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Python，请先安装 Python
    echo.
    echo 下载地址: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo [信息] 正在启动 Web 服务器...
echo [端口] 8000
echo.
echo ========================================
echo   服务器已启动！
echo   请在浏览器中访问:
echo   http://localhost:8000
echo.
echo   按 Ctrl+C 停止服务器
echo ========================================
echo.

python -m http.server 8000
