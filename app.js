// 产品价格查询系统 - JavaScript模块

let priceData = [];
let dataLoaded = false;

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', async () => {
    await loadPriceData();
    setupRadioButtons();
    setupSearchEvents();
});

// 加载价格数据
async function loadPriceData() {
    const resultsDiv = document.getElementById('priceResults');
    resultsDiv.innerHTML = '<div class="loading">正在加载数据...</div>';

    try {
        const response = await fetch('price_list.json');
        if (!response.ok) {
            throw new Error('无法加载数据文件');
        }
        priceData = await response.json();
        dataLoaded = true;
        resultsDiv.innerHTML = '<div class="stats">✅ 数据加载成功，共 ' + priceData.length + ' 条记录</div>';
        console.log('数据加载成功:', priceData.length, '条记录');
    } catch (error) {
        console.error('加载数据失败:', error);
        resultsDiv.innerHTML = '<div class="no-results">❌ 数据加载失败，请确保 price_list.json 文件存在</div>';
    }
}

// 设置单选按钮事件
function setupRadioButtons() {
    const radioButtons = document.querySelectorAll('input[name="queryType"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', handleRadioChange);
    });
}

// 处理单选按钮变化
function handleRadioChange(e) {
    // 隐藏所有搜索框
    document.querySelectorAll('.search-box').forEach(box => {
        box.classList.remove('active');
    });

    // 显示对应的搜索框
    if (e.target.value === 'price') {
        document.getElementById('priceSearchBox').classList.add('active');
    }
}

// 设置搜索事件
function setupSearchEvents() {
    const searchInput = document.getElementById('priceSearchInput');
    if (searchInput) {
        // 回车键搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchPrice();
            }
        });
        
        // 实时搜索（防抖）
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchPrice();
            }, 400);
        });
    }
}

// 价格查询函数
function searchPrice() {
    if (!dataLoaded) {
        alert('数据尚未加载完成，请稍候...');
        return;
    }

    const searchTerm = document.getElementById('priceSearchInput').value.trim();
    const resultsDiv = document.getElementById('priceResults');

    if (!searchTerm) {
        resultsDiv.innerHTML = '<div class="stats">✅ 数据加载成功，共 ' + priceData.length + ' 条记录</div>';
        return;
    }

    // 搜索匹配的记录
    const filtered = priceData.filter(item => {
        const searchFields = [
            'Product Name',
            'Product Number',
            'Short Ref',
            'Portfolio Name',
            'Product Type',
            'Release'
        ];
        
        for (let field of searchFields) {
            if (item[field] !== null && item[field] !== undefined) {
                const fieldValue = String(item[field]).toLowerCase();
                const searchLower = searchTerm.toLowerCase();
                
                if (fieldValue.includes(searchLower)) {
                    return true;
                }
            }
        }
        
        return false;
    });

    displayResults(filtered, resultsDiv);
}

// 显示搜索结果
function displayResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="no-results">未找到匹配的记录，请尝试其他关键词</div>';
        return;
    }

    let html = '<div class="stats">🔍 找到 ' + results.length + ' 条匹配记录</div>';
    html += '<div class="results-table-wrapper">';
    html += '<table class="results-table">';
    
    // 定义显示的字段
    const displayFields = [
        'Portfolio Name',
        'Product Number', 
        'Short Ref',
        'Product Name',
        'Release',
        'Licensing Scheme',
        'PLC',
        'ALC',
        'QLC',
        'YLC'
    ];
    
    html += '<thead><tr>';
    displayFields.forEach(field => {
        html += '<th>' + escapeHtml(field) + '</th>';
    });
    html += '</tr></thead>';

    html += '<tbody>';
    results.forEach(item => {
        html += '<tr>';
        displayFields.forEach(field => {
            const value = item[field];
            html += '<td>' + escapeHtml(formatValue(value)) + '</td>';
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    html += '</div>';

    container.innerHTML = html;
}

// 格式化值
function formatValue(value) {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
        return value.toLocaleString('zh-CN', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }
    return value;
}

// HTML转义，防止XSS攻击
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
