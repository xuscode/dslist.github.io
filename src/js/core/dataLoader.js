/**
 * 数据加载器模块
 * 负责数据的获取和管理
 */

class DataLoader {
    constructor(config = {}) {
        this.config = {
            dataFile: config.dataFile || 'price_list.json',
            onSuccess: config.onSuccess || (() => {}),
            onError: config.onError || (() => {}),
            onProgress: config.onProgress || (() => {})
        };
        this.data = [];
        this.loaded = false;
        this.loading = false;
    }

    /**
     * 加载JSON数据
     * @returns {Promise<Array>} 加载的数据数组
     */
    async load() {
        if (this.loading) {
            console.warn('数据正在加载中...');
            return this.data;
        }

        if (this.loaded) {
            console.log('数据已加载，返回缓存数据');
            return this.data;
        }

        this.loading = true;

        try {
            this.config.onProgress('正在加载数据...');

            const response = await fetch(this.config.dataFile);

            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }

            this.data = await response.json();
            this.loaded = true;
            this.loading = false;

            this.config.onSuccess(this.data);
            console.log(`数据加载成功: ${this.data.length} 条记录`);

            return this.data;
        } catch (error) {
            this.loading = false;
            console.error('数据加载失败:', error);
            this.config.onError(error);
            throw error;
        }
    }

    /**
     * 获取数据
     * @returns {Array} 数据数组
     */
    getData() {
        return this.data;
    }

    /**
     * 检查数据是否已加载
     * @returns {boolean}
     */
    isLoaded() {
        return this.loaded;
    }

    /**
     * 检查数据是否正在加载
     * @returns {boolean}
     */
    isLoading() {
        return this.loading;
    }

    /**
     * 重置加载状态
     */
    reset() {
        this.data = [];
        this.loaded = false;
        this.loading = false;
    }
}

/**
 * 创建默认的数据加载器实例
 */
const priceDataLoader = new DataLoader({
    dataFile: CONFIG.data.priceListFile
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataLoader, priceDataLoader };
}
