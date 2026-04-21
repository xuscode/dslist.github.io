/**
 * 应用初始化器
 * 负责协调各个模块的初始化
 */

class App {
    constructor() {
        this.initialized = false;
        this.modules = {};
        this.dataLoader = priceDataLoader;
    }

    /**
     * 初始化应用
     */
    async init() {
        if (this.initialized) {
            console.warn('应用已初始化');
            return;
        }

        console.log('正在初始化应用...');

        try {
            // 加载数据
            await this.loadData();

            // 初始化UI组件
            this.initUI();

            // 初始化模块
            this.initModules();

            this.initialized = true;
            console.log('应用初始化完成');
        } catch (error) {
            console.error('应用初始化失败:', error);
        }
    }

    /**
     * 加载数据
     */
    async loadData() {
        await this.dataLoader.load();
    }

    /**
     * 初始化UI组件
     */
    initUI() {
        // 设置单选按钮事件
        this.setupRadioButtons();
    }

    /**
     * 设置单选按钮事件
     */
    setupRadioButtons() {
        const radioButtons = document.querySelectorAll('input[name="queryType"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => this.handleRadioChange(e));
        });
    }

    /**
     * 处理单选按钮变化
     * @param {Event} e
     */
    handleRadioChange(e) {
        // 隐藏所有搜索框
        document.querySelectorAll('.search-box').forEach(box => {
            box.classList.remove('active');
        });

        // 显示对应的搜索框
        const value = e.target.value;
        if (value === 'price') {
            document.getElementById('priceSearchBox').classList.add('active');
        } else if (value === 'roleApp') {
            document.getElementById('roleAppSearchBox').classList.add('active');
        }
    }

    /**
     * 初始化所有模块
     */
    initModules() {
        // 价格查询模块
        this.modules.priceQuery = new PriceQuery({
            dataLoader: this.dataLoader
        });

        // 注册到模块注册表
        moduleRegistry.register('priceQuery', this.modules.priceQuery);

        // 角色APP查询模块
        this.modules.roleAppQuery = new RoleAppQuery({
            containerId: 'roleAppResults',
            inputId: 'roleAppSearchInput',
            dataPath: CONFIG.data.rolesAppsFile
        });

        // 注册到模块注册表
        moduleRegistry.register('roleAppQuery', this.modules.roleAppQuery);
    }

    /**
     * 获取模块
     * @param {string} name - 模块名称
     * @returns {Object|null}
     */
    getModule(name) {
        return this.modules[name] || moduleRegistry.get(name);
    }

    /**
     * 获取应用信息
     * @returns {Object}
     */
    getInfo() {
        return {
            name: CONFIG.app.name,
            version: CONFIG.app.version,
            description: CONFIG.app.description
        };
    }
}

// 创建全局应用实例
const app = new App();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, app };
}
