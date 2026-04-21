# 角色APP查询功能使用说明

## 功能概述

新增的**角色APP双向查询**功能支持:
- **角色 → APP**: 输入角色名称,查看该角色包含的所有APP
- **APP → 角色**: 输入APP名称,查看包含该APP的所有角色

## 首次使用准备

### 1. 安装Python依赖

```bash
cd scripts
pip install -r requirements.txt
```

### 2. 运行PDF转换脚本

```bash
python pdf_to_json.py
```

这个脚本会:
- 从 `data/CATIA_ROLES/` 目录读取所有PDF文件
- 提取角色名称和APP列表
- 生成 `data/roles_apps.json` 文件

### 3. 启动Web服务器

双击运行 `start_server.bat` 或在命令行执行:

```bash
python -m http.server 8080
```

然后在浏览器访问: http://localhost:8080

## 使用方法

1. 在页面中选择 **"角色APP查询"** 单选按钮
2. 使用顶部的模式切换按钮选择查询方向:
   - **角色 → APP**: 输入角色名称(如 "Building Design Engineer")
   - **APP → 角色**: 输入APP名称(如 "CATIA", "IFC")
3. 在搜索框中输入关键词,系统会实时显示匹配结果

## 数据说明

当前已解析9个CATIA角色,包含19个不同的APP:

**角色示例:**
- Building Design Engineer Role (BCMDC)
- Building Designer Role (BUDEC)
- Construction Designer Role (VDCEC)
- Visual Script Designer Role (GGR)
- 等等...

**APP示例:**
- IFC, IGES, STEP (文件格式)
- COLLADA, FBX, OBJ (3D格式)
- PDM, CAD, HVAC (应用类型)
- 等等...

## 自定义调整

如果PDF解析结果不理想,可以编辑 `scripts/pdf_to_json.py` 中的 `extract_apps_from_text()` 函数来优化提取逻辑。

## 项目结构

```
WEB_TEST/
├── scripts/                # 预处理脚本
│   ├── pdf_to_json.py      # PDF转JSON工具
│   └── requirements.txt    # Python依赖
├── data/                   # 数据文件
│   ├── price_list.json     # 价格数据
│   ├── roles_apps.json     # 角色-APP映射(自动生成)
│   └── CATIA_ROLES/        # 原始PDF文件
├── src/                    # 前端代码
│   ├── js/modules/roleAppQuery.js  # 查询模块
│   └── css/components/search.css   # 样式
└── index.html              # 主页面
```


```txt

WEB_TEST/
├── index.html                    # 主页面
├── start_server.bat              # 启动脚本
├── ROLE_APP_QUERY_README.md      # 新功能使用说明
│
├── scripts/                      # Python预处理脚本
│   ├── pdf_to_json.py           # PDF转JSON工具
│   └── requirements.txt         # Python依赖
│
├── data/                         # 数据文件
│   ├── price_list.json          # 价格数据
│   ├── roles_apps.json          # 角色-APP映射(自动生成)
│   └── CATIA_ROLES/             # 原始PDF文件(9个)
│
└── src/                          # 前端源代码
    ├── css/                      # 样式文件
    │   ├── base.css
    │   ├── main.css
    │   ├── responsive.css
    │   └── components/
    │       ├── search.css       # 包含模式切换按钮样式
    │       └── table.css
    │
    └── js/                       # JavaScript模块
        ├── main.js              # 主入口
        ├── core/                # 核心模块
        │   ├── app.js           # 应用初始化器
        │   ├── config.js        # 配置(已更新路径)
        │   ├── dataLoader.js    # 数据加载器
        │   └── moduleRegistry.js # 模块注册表
        ├── modules/             # 功能模块
        │   ├── priceQuery.js    # 价格查询
        │   └── roleAppQuery.js  # 角色APP查询(新增)
        └── utils/
            └── helpers.js       # 工具函数

```
