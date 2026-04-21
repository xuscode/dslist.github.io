/**
 * 价格查询系统 - 主入口文件
 * 
 * 项目结构：
 * - core/           核心模块
 *   - config.js     配置和常量
 *   - dataLoader.js 数据加载器
 *   - app.js        应用初始化器
 *   - moduleRegistry.js 模块注册表
 * - modules/        功能模块
 *   - priceQuery.js 价格查询
 *   - query2.js     扩展模块示例
 *   - query3.js     扩展模块示例
 * - utils/          工具函数
 *   - helpers.js    辅助函数集合
 */

'use strict';

// ============================================
// 按顺序加载依赖模块
// ============================================

// 1. 核心配置（必须最先加载）
// CONFIG, SEARCH_FIELDS, TABLE_FIELDS 在 config.js 中定义

// 2. 工具函数
// escapeHtml, formatValue, debounce, generateTable 等在 helpers.js 中定义

// 3. 数据加载器
// DataLoader, priceDataLoader 在 dataLoader.js 中定义

// 4. 模块类
// PriceQuery, Query2Module, Query3Module 在对应文件中定义

// 5. 应用初始化器
// App, app 在 app.js 中定义

// ============================================
// 应用启动
// ============================================

// 页面加载完成后初始化应用
window.addEventListener('DOMContentLoaded', async () => {
    console.log('===== 价格查询系统启动 =====');
    
    try {
        // 初始化应用
        await app.init();
        
        // 输出应用信息
        const info = app.getInfo();
        console.log(`应用: ${info.name} v${info.version}`);
        console.log(`描述: ${info.description}`);
        
    } catch (error) {
        console.error('启动失败:', error);
    }
});

// ============================================
// 导出全局接口（供HTML直接调用）
// ============================================

// 保持向后兼容：暴露全局函数供HTML onclick使用
function searchPrice() {
    if (app.modules.priceQuery) {
        app.modules.priceQuery.search();
    }
}

// 角色APP查询全局函数
function searchRoleApp() {
    if (app.modules.roleAppQuery) {
        app.modules.roleAppQuery.search();
    }
}

// 导出到全局作用域
window.searchPrice = searchPrice;
window.searchRoleApp = searchRoleApp;
window.app = app;
window.CONFIG = CONFIG;
window.SEARCH_FIELDS = SEARCH_FIELDS;
window.TABLE_FIELDS = TABLE_FIELDS;
