/**
 * 角色APP查询模块
 * 支持双向查询：角色→APP列表，APP→角色列表
 */

class RoleAppQuery {
    constructor(options = {}) {
        this.containerId = options.containerId || 'roleAppResults';
        this.inputId = options.inputId || 'roleAppSearchInput';
        this.dataPath = options.dataPath || 'data/roles_apps.json';
        this.queryMode = options.queryMode || 'role'; // 'role' 或 'app'
        
        this.data = null;
        this.dataLoaded = false;
        
        this.init();
    }

    /**
     * 初始化查询模块
     */
    async init() {
        await this.loadData();
        this.setupSearchInput();
        this.setupModeSwitch();
        console.log('角色APP查询模块初始化完成');
    }

    /**
     * 加载数据
     */
    async loadData() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = createLoading('正在加载角色APP数据...');
        }

        try {
            const response = await fetch(this.dataPath);
            if (!response.ok) {
                throw new Error('无法加载数据文件');
            }
            
            this.data = await response.json();
            this.dataLoaded = true;
            
            if (container) {
                container.innerHTML = createStats(
                    `✅ 数据加载成功 - ${this.data.metadata?.totalRoles || 0} 个角色, ${this.data.metadata?.totalApps || 0} 个APP`
                );
            }
            
            console.log('角色APP数据加载成功:', this.data);
        } catch (error) {
            console.error('加载角色APP数据失败:', error);
            if (container) {
                container.innerHTML = createError(
                    '❌ 数据加载失败，请确保已运行PDF转换脚本生成 roles_apps.json'
                );
            }
        }
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
        }, 400));
    }

    /**
     * 设置查询模式切换
     */
    setupModeSwitch() {
        const modeRoleBtn = document.getElementById('modeRoleToApp');
        const modeAppBtn = document.getElementById('modeAppToRole');

        if (modeRoleBtn) {
            modeRoleBtn.addEventListener('click', () => {
                this.setQueryMode('role');
                modeRoleBtn.classList.add('active');
                if (modeAppBtn) modeAppBtn.classList.remove('active');
                
                // 更新placeholder
                const input = document.getElementById(this.inputId);
                if (input) {
                    input.placeholder = '输入角色名称，如：Building Design Engineer...';
                }
                
                this.search(); // 重新搜索
            });
        }

        if (modeAppBtn) {
            modeAppBtn.addEventListener('click', () => {
                this.setQueryMode('app');
                modeAppBtn.classList.add('active');
                if (modeRoleBtn) modeRoleBtn.classList.remove('active');
                
                // 更新placeholder
                const input = document.getElementById(this.inputId);
                if (input) {
                    input.placeholder = '输入APP名称，如：CATIA、DELMIA...';
                }
                
                this.search(); // 重新搜索
            });
        }
    }

    /**
     * 设置查询模式
     * @param {string} mode - 'role' 或 'app'
     */
    setQueryMode(mode) {
        this.queryMode = mode;
        console.log(`查询模式切换为: ${mode === 'role' ? '角色→APP' : 'APP→角色'}`);
    }

    /**
     * 执行搜索
     */
    search() {
        if (!this.dataLoaded) {
            this.showError('数据尚未加载完成，请稍候...');
            return;
        }

        const searchTerm = document.getElementById(this.inputId)?.value.trim();

        // 空搜索词显示统计信息
        if (!searchTerm) {
            this.showStats(
                `✅ 数据加载成功 - ${this.data.metadata?.totalRoles || 0} 个角色, ${this.data.metadata?.totalApps || 0} 个APP`
            );
            return;
        }

        // 根据当前模式执行搜索
        let results;
        if (this.queryMode === 'role') {
            results = this.searchByRole(searchTerm);
        } else {
            results = this.searchByApp(searchTerm);
        }

        this.displayResults(results);
    }

    /**
     * 按角色名称搜索（返回APP列表）
     * @param {string} roleName - 角色名称关键词
     * @returns {Array} 匹配的角色及其APP列表
     */
    searchByRole(roleName) {
        const searchLower = roleName.toLowerCase();
        
        return this.data.roles.filter(role => {
            const nameLower = role.roleName.toLowerCase();
            return nameLower.includes(searchLower);
        }).map(role => ({
            roleName: role.roleName,
            appCount: role.apps.length,
            apps: role.apps.join(', ')
        }));
    }

    /**
     * 按APP名称搜索（返回包含该APP的角色列表）
     * @param {string} appName - APP名称关键词
     * @returns {Array} 包含该APP的角色列表
     */
    searchByApp(appName) {
        const searchLower = appName.toLowerCase();
        const results = [];

        // 遍历apps映射
        for (const [app, roles] of Object.entries(this.data.apps)) {
            if (app.toLowerCase().includes(searchLower)) {
                results.push({
                    appName: app,
                    roleCount: roles.length,
                    roles: roles.join(', ')
                });
            }
        }

        return results;
    }

    /**
     * 显示搜索结果
     * @param {Array} results - 搜索结果
     */
    displayResults(results) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = createNoResults('未找到匹配的记录，请尝试其他关键词');
            return;
        }

        let html = createStats(`🔍 找到 ${results.length} 条匹配记录`);

        if (this.queryMode === 'role') {
            // 角色→APP的表格
            html += this.generateRoleTable(results);
        } else {
            // APP→角色的表格
            html += this.generateAppTable(results);
        }

        container.innerHTML = html;
    }

    /**
     * 生成角色→APP表格
     * @param {Array} results - 结果数据
     * @returns {string} HTML字符串
     */
    generateRoleTable(results) {
        const fields = [
            { key: 'roleName', label: '角色名称' },
            { key: 'appCount', label: 'APP数量' },
            { key: 'apps', label: 'APP列表' }
        ];

        return generateTable(results, fields);
    }

    /**
     * 生成APP→角色表格
     * @param {Array} results - 结果数据
     * @returns {string} HTML字符串
     */
    generateAppTable(results) {
        const fields = [
            { key: 'appName', label: 'APP名称' },
            { key: 'roleCount', label: '角色数量' },
            { key: 'roles', label: '包含该APP的角色' }
        ];

        return generateTable(results, fields);
    }

    /**
     * 显示统计信息
     * @param {string} message - 统计信息
     */
    showStats(message) {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = createStats(message);
        }
    }

    /**
     * 显示错误信息
     * @param {string} message - 错误信息
     */
    showError(message) {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = createError(message);
        }
    }

    /**
     * 获取模块名称
     * @returns {string}
     */
    getName() {
        return '角色APP查询';
    }

    /**
     * 获取模块状态
     * @returns {string}
     */
    getStatus() {
        return this.dataLoaded ? 'ready' : 'loading';
    }

    /**
     * 检查模块是否可用
     * @returns {boolean}
     */
    isAvailable() {
        return this.dataLoaded;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RoleAppQuery };
}
