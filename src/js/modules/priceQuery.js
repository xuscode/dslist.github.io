/**
 * 价格查询模块
 * 负责产品价格搜索和结果展示
 */

class PriceQuery {
    constructor(options = {}) {
        this.containerId = options.containerId || 'priceResults';
        this.inputId = options.inputId || 'priceSearchInput';
        this.dataLoader = options.dataLoader || priceDataLoader;
        this.searchFields = options.searchFields || SEARCH_FIELDS;
        this.tableFields = options.tableFields || TABLE_FIELDS;
        this.debounceDelay = options.debounceDelay || CONFIG.search.debounceDelay;
        
        this.init();
    }

    /**
     * 初始化查询模块
     */
    init() {
        this.setupSearchInput();
        console.log('价格查询模块初始化完成');
    }

    /**
     * 设置搜索输入事件
     */
    setupSearchInput() {
        const input = document.getElementById(this.inputId);
        if (!input) {
            console.warn('搜索输入框未找到:', this.inputId);
            return;
        }

        // 回车键搜索
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.search();
            }
        });

        // 防抖实时搜索
        input.addEventListener('input', debounce(() => {
            this.search();
        }, this.debounceDelay));
    }

    /**
     * 执行搜索
     */
    search() {
        const data = this.dataLoader.getData();

        if (!this.dataLoader.isLoaded()) {
            this.showError('数据尚未加载完成，请稍候...');
            return;
        }

        const searchTerm = document.getElementById(this.inputId).value.trim();

        // 空搜索词显示统计信息
        if (!searchTerm) {
            this.showStats(`✅ 数据加载成功，共 ${data.length} 条记录`);
            return;
        }

        // 执行搜索
        const results = this.performSearch(data, searchTerm);
        this.displayResults(results);
    }

    /**
     * 执行搜索逻辑
     * @param {Array} data - 数据源
     * @param {string} term - 搜索关键词
     * @returns {Array} 过滤后的结果
     */
    performSearch(data, term) {
        const searchLower = term.toLowerCase();

        return data.filter(item => {
            for (const field of this.searchFields) {
                if (item[field] !== null && item[field] !== undefined) {
                    const fieldValue = String(item[field]).toLowerCase();
                    if (fieldValue.includes(searchLower)) {
                        return true;
                    }
                }
            }
            return false;
        });
    }

    /**
     * 显示搜索结果
     * @param {Array} results - 搜索结果
     */
    displayResults(results) {
        const container = document.getElementById(this.containerId);

        if (results.length === 0) {
            container.innerHTML = createNoResults('未找到匹配的记录，请尝试其他关键词');
            return;
        }

        let html = createStats(`🔍 找到 ${results.length} 条匹配记录`);
        html += generateTable(results, this.tableFields);

        container.innerHTML = html;
    }

    /**
     * 显示统计信息
     * @param {string} message - 统计信息
     */
    showStats(message) {
        const container = document.getElementById(this.containerId);
        container.innerHTML = createStats(message);
    }

    /**
     * 显示加载状态
     * @param {string} message - 加载提示
     */
    showLoading(message = '正在加载数据...') {
        const container = document.getElementById(this.containerId);
        container.innerHTML = createLoading(message);
    }

    /**
     * 显示错误信息
     * @param {string} message - 错误信息
     */
    showError(message) {
        const container = document.getElementById(this.containerId);
        container.innerHTML = createError(message);
    }

    /**
     * 获取模块名称
     * @returns {string}
     */
    getName() {
        return '价格查询';
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PriceQuery };
}
