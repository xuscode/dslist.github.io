/**
 * 工具函数模块
 * 通用辅助函数集合
 */

/**
 * HTML转义，防止XSS攻击
 * @param {string} text - 原始文本
 * @returns {string} 转义后的HTML安全文本
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

/**
 * 格式化值显示
 * @param {*} value - 需要格式化的值
 * @returns {string} 格式化后的字符串
 */
function formatValue(value) {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
        return value.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    return String(value);
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间(ms)
 * @returns {Function} 防抖处理后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 创建带样式的消息元素
 * @param {string} message - 消息内容
 * @param {string} className - CSS类名
 * @returns {string} HTML字符串
 */
function createMessage(message, className = '') {
    return `<div class="${className}">${message}</div>`;
}

/**
 * 创建加载状态HTML
 * @param {string} text - 加载提示文本
 * @returns {string} HTML字符串
 */
function createLoading(text = '正在加载...') {
    return createMessage(text, 'loading');
}

/**
 * 创建统计信息HTML
 * @param {string} text - 统计信息文本
 * @returns {string} HTML字符串
 */
function createStats(text) {
    return createMessage(text, 'stats');
}

/**
 * 创建空结果HTML
 * @param {string} text - 空结果提示文本
 * @returns {string} HTML字符串
 */
function createNoResults(text = '未找到匹配的记录') {
    return createMessage(text, 'no-results');
}

/**
 * 创建错误消息HTML
 * @param {string} text - 错误信息文本
 * @returns {string} HTML字符串
 */
function createError(text) {
    return createMessage(text, 'no-results');
}

/**
 * 生成表格HTML
 * @param {Array} data - 表格数据
 * @param {Array} fields - 字段配置 [{key, label}]
 * @returns {string} 表格HTML字符串
 */
function generateTable(data, fields) {
    if (!data || data.length === 0) return '';

    let html = '<div class="results-table-wrapper">';
    html += '<table class="results-table">';

    // 表头
    html += '<thead><tr>';
    fields.forEach(field => {
        html += `<th>${escapeHtml(field.label)}</th>`;
    });
    html += '</tr></thead>';

    // 表体
    html += '<tbody>';
    data.forEach(item => {
        html += '<tr>';
        fields.forEach(field => {
            const value = item[field.key];
            html += `<td>${escapeHtml(formatValue(value))}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody>';

    html += '</table></div>';

    return html;
}

/**
 * 检查数据类型
 * @param {*} value - 要检查的值
 * @returns {boolean}
 */
function isArray(value) {
    return Array.isArray(value);
}

/**
 * 空值检查
 * @param {*} value - 要检查的值
 * @returns {boolean}
 */
function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (isArray(value)) return value.length === 0;
    return false;
}

/**
 * 生成唯一ID
 * @param {string} prefix - 前缀
 * @returns {string} 唯一ID
 */
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 导出工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        escapeHtml,
        formatValue,
        debounce,
        createMessage,
        createLoading,
        createStats,
        createNoResults,
        createError,
        generateTable,
        isArray,
        isEmpty,
        generateId
    };
}
