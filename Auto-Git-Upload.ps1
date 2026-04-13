<#
  自动 Git 同步脚本（自动定位目录，无需手动改路径）
#>

# 自动获取当前脚本所在的文件夹
$scriptFolder = $PSScriptRoot

# 进入脚本所在目录（确保 Git 操作正确）
cd $scriptFolder

# 执行 Git 命令
git pull
git add .
git commit -m "Auto commit $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push