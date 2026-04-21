/**
 * 模块注册表
 * 管理所有可用的查询模块
 */

class ModuleRegistry {
    constructor() {
        this.modules = new Map();
    }

    /**
     * 注册模块
     * @param {string} key - 模块标识
     * @param {Object} module - 模块实例
     */
    register(key, module) {
        this.modules.set(key, {
            instance: module,
            name: module.getName ? module.getName() : key,
            status: module.getStatus ? module.getStatus() : 'ready',
            available: module.isAvailable ? module.isAvailable() : true
        });
        console.log(`模块已注册: ${key}`);
    }

    /**
     * 获取模块
     * @param {string} key - 模块标识
     * @returns {Object|null}
     */
    get(key) {
        return this.modules.get(key)?.instance || null;
    }

    /**
     * 获取所有已注册的模块
     * @returns {Array}
     */
    getAll() {
        return Array.from(this.modules.entries()).map(([key, value]) => ({
            key,
            ...value
        }));
    }

    /**
     * 获取可用模块
     * @returns {Array}
     */
    getAvailable() {
        return this.getAll().filter(m => m.available);
    }

    /**
     * 检查模块是否存在
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return this.modules.has(key);
    }
}

// 全局模块注册表实例
const moduleRegistry = new ModuleRegistry();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModuleRegistry, moduleRegistry };
}
