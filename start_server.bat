@echo off
chcp 65001 >nul
echo ========================================
echo    3DS产品价格查询系统 - 服务器启动
echo ========================================
echo.

cd /d "%~dp0"

:: 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Python，请先安装Python
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [提示] 首次使用角色APP查询功能，请运行数据转换脚本：
echo.
echo   方法1 (推荐): 使用TXT文件（更准确）
echo        cd scripts
echo        python txt_to_json.py
echo.
echo   方法2: 从PDF提取（需要安装依赖）
echo        cd scripts
echo        pip install -r requirements.txt
echo        python pdf_to_json.py
echo.
echo [提示] 启动HTTP服务器...
echo [提示] 请在浏览器中访问: http://localhost:8080
echo [提示] 按 Ctrl+C 停止服务器
echo.

python -m http.server 8080

pause
