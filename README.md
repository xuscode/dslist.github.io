# 产品价格查询系统

## 项目说明
这是一个基于HTML和JSON的产品价格查询网站，支持从CSV文件转换数据并进行快速查询。

## 文件结构
```
WEB_TEST/
├── price_list_20250701.csv    # 原始CSV数据文件
├── price_list.json            # 转换后的JSON数据文件（需要生成）
├── index.html                 # 主页面
├── convert_csv_to_json.py     # CSV转JSON脚本
└── README.md                  # 说明文档
```

## 使用步骤

### 1. 转换CSV为JSON
运行Python脚本将CSV文件转换为JSON格式：
```bash
python convert_csv_to_json.py
```

### 2. 启动Web服务器
由于浏览器安全限制，需要通过HTTP服务器访问：

**方法1：使用Python内置服务器**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**方法2：使用Node.js的http-server**
```bash
npm install -g http-server
http-server -p 8000
```

**方法3：使用PHP内置服务器**
```bash
php -S localhost:8000
```

### 3. 访问网站
在浏览器中打开：`http://localhost:8000`

## 功能特性
- ✅ 单选按钮切换查询类型
- ✅ 价格查询功能（已完成）
  - 🔍 智能搜索：优先匹配关键字段（产品名称、编号、短代码等）
  - ⚡ 实时搜索：输入时自动搜索（400ms防抖）
  - 📊 精确筛选：只显示相关的10个重要字段
  - 📱 横向滚动：表格支持横向滚动，完整显示所有数据
  - 🎨 斑马纹表格：隔行变色，易于阅读
  - 📌 固定表头：滚动时表头保持可见
- ⏳ 其他查询功能（预留接口）

## 技术栈
- HTML5
- CSS3（渐变、Flexbox、响应式、Sticky定位）
- JavaScript（原生，模块化设计）
- Python（数据转换脚本）

## 注意事项
1. 必须先运行 `convert_csv_to_json.py` 生成 `price_list.json` 文件
2. 不能直接双击打开 `index.html`，必须通过HTTP服务器访问
3. 确保 `price_list.json` 和 `index.html` 在同一目录下
