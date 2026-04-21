/**
 * 价格查询系统 - 核心配置文件
 * 应用配置和常量定义
 */

const CONFIG = {
    // 应用信息
    app: {
        name: '产品价格查询系统',
        version: '1.0.0',
        description: '3DS产品价格查询工具'
    },

    // 数据配置
    data: {
        priceListFile: 'data/price_list.json',
        rolesAppsFile: 'data/roles_apps.json',
        loadOnStart: true
    },

    // 搜索配置
    search: {
        debounceDelay: 400,      // 防抖延迟(ms)
        minQueryLength: 0,       // 最小查询长度
        maxResults: 1000,        // 最大显示结果数
        caseSensitive: false     // 搜索是否区分大小写
    },

    // 主题配置
    theme: {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },

    // API配置（为未来扩展预留）
    api: {
        baseUrl: '',
        timeout: 30000
    },

    // 模块配置
    modules: {
        priceQuery: { enabled: true },
        roleAppQuery: { enabled: true }
    }
};

// 搜索字段配置
const SEARCH_FIELDS = [
    'Product Name',
    'Product Number',
    'Short Ref',
    'Portfolio Name',
    'Product Type',
    'Release'
];

// 表格显示字段
const TABLE_FIELDS = [
    { key: 'Portfolio Name', label: '产品组合' },
    { key: 'Product Number', label: '产品编号' },
    { key: 'Short Ref', label: '短代码' },
    { key: 'Product Name', label: '产品名称' },
    { key: 'Release', label: '发布版本' },
    { key: 'Licensing Scheme', label: '许可方案' },
    { key: 'PLC', label: 'PLC' },
    { key: 'ALC', label: 'ALC' },
    { key: 'QLC', label: 'QLC' },
    { key: 'YLC', label: 'YLC' }
];

// 导出配置（支持模块化导入）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, SEARCH_FIELDS, TABLE_FIELDS };
}
