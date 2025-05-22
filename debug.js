/**
 * 寶寶照護筆記 - 手機版調試工具
 * Debug.js - 適用於手機觸控操作的調試面板
 * 
 * 使用方法：
 * 1. 在 HTML 中加入這個文件：<script src="debug.js"></script>
 * 2. 長按頁面右下角顯示調試面板
 * 3. 點擊浮動按鈕開啟調試功能
 */

window.MobileDebug = (function() {
    'use strict';
    
    let debugEnabled = false;
    let debugPanel = null;
    let floatingButton = null;
    let logContainer = null;
    let isVisible = false;
    
    // 創建樣式
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mobile-debug-float-btn {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: none;
                align-items: center;
                justify-content: center;
                user-select: none;
                transition: all 0.3s ease;
            }
            
            .mobile-debug-float-btn:active {
                transform: scale(0.95);
            }
            
            .mobile-debug-panel {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.9);
                z-index: 10000;
                display: none;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            
            .mobile-debug-header {
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                font-size: 18px;
            }
            
            .mobile-debug-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .mobile-debug-tabs {
                display: flex;
                background: #333;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            .mobile-debug-tab {
                background: none;
                border: none;
                color: #ccc;
                padding: 12px 16px;
                cursor: pointer;
                white-space: nowrap;
                border-bottom: 3px solid transparent;
                transition: all 0.2s;
            }
            
            .mobile-debug-tab.active {
                color: #4ECDC4;
                border-bottom-color: #4ECDC4;
            }
            
            .mobile-debug-content {
                flex: 1;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                background: #1a1a1a;
            }
            
            .mobile-debug-section {
                display: none;
                padding: 20px;
            }
            
            .mobile-debug-section.active {
                display: block;
            }
            
            .mobile-debug-button {
                background: linear-gradient(45deg, #4ECDC4, #44A08D);
                border: none;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                margin: 8px 0;
                cursor: pointer;
                font-size: 16px;
                width: 100%;
                text-align: left;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: all 0.2s;
            }
            
            .mobile-debug-button:active {
                transform: scale(0.98);
                opacity: 0.8;
            }
            
            .mobile-debug-button.danger {
                background: linear-gradient(45deg, #FF6B6B, #ee5a52);
            }
            
            .mobile-debug-button.warning {
                background: linear-gradient(45deg, #FFE66D, #FF6B35);
            }
            
            .mobile-debug-log {
                background: #000;
                border-radius: 8px;
                padding: 15px;
                margin: 10px 0;
                font-family: monospace;
                font-size: 12px;
                line-height: 1.4;
                max-height: 200px;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                border: 1px solid #333;
            }
            
            .mobile-debug-log-item {
                margin: 5px 0;
                padding: 5px 0;
                border-bottom: 1px solid #222;
            }
            
            .mobile-debug-log-time {
                color: #888;
                font-size: 10px;
            }
            
            .mobile-debug-log-message {
                color: #fff;
                word-break: break-all;
            }
            
            .mobile-debug-log-data {
                color: #4ECDC4;
                margin-top: 5px;
                white-space: pre-wrap;
            }
            
            .mobile-debug-stat {
                background: #333;
                border-radius: 8px;
                padding: 15px;
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .mobile-debug-stat-label {
                color: #ccc;
                font-size: 14px;
            }
            
            .mobile-debug-stat-value {
                color: #4ECDC4;
                font-size: 18px;
                font-weight: bold;
            }
            
            .mobile-debug-input {
                background: #333;
                border: 1px solid #555;
                color: white;
                padding: 12px;
                border-radius: 8px;
                margin: 8px 0;
                width: 100%;
                font-size: 16px;
            }
            
            .mobile-debug-select {
                background: #333;
                border: 1px solid #555;
                color: white;
                padding: 12px;
                border-radius: 8px;
                margin: 8px 0;
                width: 100%;
                font-size: 16px;
            }
            
            .mobile-debug-toggle {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #333;
                padding: 15px;
                border-radius: 8px;
                margin: 10px 0;
            }
            
            .mobile-debug-toggle-label {
                color: #ccc;
                font-size: 16px;
            }
            
            .mobile-debug-switch {
                position: relative;
                width: 50px;
                height: 24px;
                background: #555;
                border-radius: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .mobile-debug-switch.active {
                background: #4ECDC4;
            }
            
            .mobile-debug-switch-thumb {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: transform 0.2s;
            }
            
            .mobile-debug-switch.active .mobile-debug-switch-thumb {
                transform: translateX(26px);
            }
            
            .mobile-debug-toast {
                position: fixed;
                bottom: 90px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 12px 20px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 10001;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }
            
            .mobile-debug-toast.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 顯示提示訊息
    function showToast(message, duration = 2000) {
        let toast = document.querySelector('.mobile-debug-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'mobile-debug-toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
    
    // 記錄日誌
    function log(message, type = 'info', data = null) {
        if (!logContainer) return;
        
        const logItem = document.createElement('div');
        logItem.className = 'mobile-debug-log-item';
        
        const time = new Date().toLocaleTimeString();
        logItem.innerHTML = `
            <div class="mobile-debug-log-time">${time}</div>
            <div class="mobile-debug-log-message">[${type.toUpperCase()}] ${message}</div>
            ${data ? `<div class="mobile-debug-log-data">${JSON.stringify(data, null, 2)}</div>` : ''}
        `;
        
        logContainer.appendChild(logItem);
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // 限制日誌數量
        const items = logContainer.querySelectorAll('.mobile-debug-log-item');
        if (items.length > 50) {
            items[0].remove();
        }
    }
    
    // 創建浮動按鈕
    function createFloatingButton() {
        floatingButton = document.createElement('button');
        floatingButton.className = 'mobile-debug-float-btn';
        floatingButton.innerHTML = '🐛';
        floatingButton.title = '調試工具';
        
        // 長按顯示按鈕
        let pressTimer;
        let longPressTriggered = false;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 3) { // 三指觸控
                pressTimer = setTimeout(() => {
                    longPressTriggered = true;
                    floatingButton.style.display = 'flex';
                    showToast('調試模式已啟用');
                }, 1000);
            }
        });
        
        document.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
            if (!longPressTriggered) {
                longPressTriggered = false;
            }
        });
        
        // 點擊浮動按鈕
        floatingButton.addEventListener('click', () => {
            togglePanel();
        });
        
        document.body.appendChild(floatingButton);
    }
    
    // 創建調試面板
    function createDebugPanel() {
        debugPanel = document.createElement('div');
        debugPanel.className = 'mobile-debug-panel';
        
        debugPanel.innerHTML = `
            <div class="mobile-debug-header">
                <span>🐛 調試工具</span>
                <button class="mobile-debug-close">×</button>
            </div>
            
            <div class="mobile-debug-tabs">
                <button class="mobile-debug-tab active" data-tab="status">狀態</button>
                <button class="mobile-debug-tab" data-tab="database">資料庫</button>
                <button class="mobile-debug-tab" data-tab="test">測試</button>
                <button class="mobile-debug-tab" data-tab="tools">工具</button>
                <button class="mobile-debug-tab" data-tab="logs">日誌</button>
            </div>
            
            <div class="mobile-debug-content">
                <!-- 狀態頁面 -->
                <div class="mobile-debug-section active" data-section="status">
                    <div id="debug-status-info"></div>
                    <button class="mobile-debug-button" onclick="MobileDebug.checkAppStatus()">
                        🔍 檢查應用狀態
                    </button>
                    <button class="mobile-debug-button" onclick="MobileDebug.checkBrowserCompat()">
                        🌐 檢查瀏覽器相容性
                    </button>
                </div>
                
                <!-- 資料庫頁面 -->
                <div class="mobile-debug-section" data-section="database">
                    <div id="debug-db-stats"></div>
                    <button class="mobile-debug-button" onclick="MobileDebug.getDBStats()">
                        📊 資料庫統計
                    </button>
                    <select class="mobile-debug-select" id="db-store-select">
                        <option value="">選擇資料表</option>
                        <option value="children">寶寶資料</option>
                        <option value="feeding">餵食記錄</option>
                        <option value="sleep">睡眠記錄</option>
                        <option value="diaper">尿布記錄</option>
                        <option value="health">健康記錄</option>
                        <option value="activities">活動記錄</option>
                        <option value="interactions">親子互動</option>
                        <option value="milestones">發展里程碑</option>
                    </select>
                    <button class="mobile-debug-button" onclick="MobileDebug.viewStore()">
                        👁️ 查看資料表
                    </button>
                    <button class="mobile-debug-button danger" onclick="MobileDebug.clearStore()">
                        🗑️ 清空資料表
                    </button>
                </div>
                
                <!-- 測試頁面 -->
                <div class="mobile-debug-section" data-section="test">
                    <input type="text" class="mobile-debug-input" id="test-child-name" placeholder="測試寶寶名稱" value="測試寶寶">
                    <button class="mobile-debug-button" onclick="MobileDebug.createTestChild()">
                        👶 建立測試寶寶
                    </button>
                    <div id="test-child-list"></div>
                    <button class="mobile-debug-button" onclick="MobileDebug.generateTestData()">
                        🎲 生成測試資料
                    </button>
                </div>
                
                <!-- 工具頁面 -->
                <div class="mobile-debug-section" data-section="tools">
                    <button class="mobile-debug-button" onclick="MobileDebug.exportData()">
                        📤 匯出所有資料
                    </button>
                    <button class="mobile-debug-button" onclick="MobileDebug.analyzeData()">
                        📈 資料分析
                    </button>
                    <button class="mobile-debug-button warning" onclick="MobileDebug.clearAllData()">
                        🔄 重設應用程式
                    </button>
                    <div class="mobile-debug-toggle">
                        <span class="mobile-debug-toggle-label">調試日誌</span>
                        <div class="mobile-debug-switch" onclick="MobileDebug.toggleDebugLog()">
                            <div class="mobile-debug-switch-thumb"></div>
                        </div>
                    </div>
                </div>
                
                <!-- 日誌頁面 -->
                <div class="mobile-debug-section" data-section="logs">
                    <button class="mobile-debug-button" onclick="MobileDebug.clearLogs()">
                        🧹 清空日誌
                    </button>
                    <div class="mobile-debug-log" id="debug-log-container"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // 設定事件監聽
        setupEventListeners();
        
        // 初始化日誌容器
        logContainer = document.getElementById('debug-log-container');
    }
    
    // 設定事件監聽
    function setupEventListeners() {
        // 關閉按鈕
        debugPanel.querySelector('.mobile-debug-close').addEventListener('click', () => {
            togglePanel();
        });
        
        // 頁籤切換
        debugPanel.querySelectorAll('.mobile-debug-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // 切換頁籤樣式
                debugPanel.querySelectorAll('.mobile-debug-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 切換內容
                debugPanel.querySelectorAll('.mobile-debug-section').forEach(s => s.classList.remove('active'));
                debugPanel.querySelector(`[data-section="${targetTab}"]`).classList.add('active');
            });
        });
    }
    
    // 切換面板顯示
    function togglePanel() {
        isVisible = !isVisible;
        debugPanel.style.display = isVisible ? 'flex' : 'none';
        
        if (isVisible) {
            // 自動檢查狀態
            setTimeout(() => {
                checkAppStatus();
            }, 300);
        }
    }
    
    // 檢查應用狀態
    function checkAppStatus() {
        log('檢查應用狀態...', 'info');
        
        const status = {
            database: typeof db !== 'undefined' && db ? '✅ 已連接' : '❌ 未連接',
            currentChild: typeof currentChildId !== 'undefined' && currentChildId ? `✅ ${currentChildId}` : '❌ 未選擇',
            currentPage: typeof currentPage !== 'undefined' ? `✅ ${currentPage}` : '❌ 未知',
            theme: document.documentElement.getAttribute('data-theme') || 'light',
            localStorage: checkLocalStorage() ? '✅ 支援' : '❌ 不支援',
            indexedDB: 'indexedDB' in window ? '✅ 支援' : '❌ 不支援'
        };
        
        const statusDiv = document.getElementById('debug-status-info');
        statusDiv.innerHTML = `
            <div class="mobile-debug-stat">
                <span class="mobile-debug-stat-label">資料庫</span>
                <span class="mobile-debug-stat-value">${status.database}</span>
            </div>
            <div class="mobile-debug-stat">
                <span class="mobile-debug-stat-label">當前寶寶</span>
                <span class="mobile-debug-stat-value">${status.currentChild}</span>
            </div>
            <div class="mobile-debug-stat">
                <span class="mobile-debug-stat-label">當前頁面</span>
                <span class="mobile-debug-stat-value">${status.currentPage}</span>
            </div>
            <div class="mobile-debug-stat">
                <span class="mobile-debug-stat-label">主題</span>
                <span class="mobile-debug-stat-value">${status.theme}</span>
            </div>
        `;
        
        log('應用狀態檢查完成', 'success', status);
    }
    
    // 檢查瀏覽器相容性
    function checkBrowserCompat() {
        const features = {
            indexedDB: '✅ 支援',
            localStorage: checkLocalStorage() ? '✅ 支援' : '❌ 不支援',
            serviceWorker: 'serviceWorker' in navigator ? '✅ 支援' : '❌ 不支援',
            fetch: 'fetch' in window ? '✅ 支援' : '❌ 不支援',
            touchEvents: 'ontouchstart' in window ? '✅ 支援' : '❌ 不支援',
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        log('瀏覽器相容性檢查', 'info', features);
        showToast('檢查完成，請查看日誌');
    }
    
    // 檢查 localStorage
    function checkLocalStorage() {
        try {
            const testKey = 'debug_test';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // 獲取資料庫統計
    async function getDBStats() {
        if (typeof db === 'undefined' || !db) {
            log('資料庫未連接', 'error');
            showToast('資料庫未連接');
            return;
        }
        
        log('獲取資料庫統計...', 'info');
        
        const storeNames = ['children', 'feeding', 'sleep', 'diaper', 'milestones', 'activities', 'health', 'interactions'];
        const stats = {};
        
        for (const storeName of storeNames) {
            try {
                const transaction = db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const count = await new Promise((resolve, reject) => {
                    const request = store.count();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
                
                stats[storeName] = count;
            } catch (error) {
                stats[storeName] = 'Error';
                log(`統計 ${storeName} 失敗`, 'error', error);
            }
        }
        
        const statsDiv = document.getElementById('debug-db-stats');
        statsDiv.innerHTML = Object.entries(stats).map(([key, value]) => `
            <div class="mobile-debug-stat">
                <span class="mobile-debug-stat-label">${key}</span>
                <span class="mobile-debug-stat-value">${value}</span>
            </div>
        `).join('');
        
        log('資料庫統計完成', 'success', stats);
    }
    
    // 查看資料表
    async function viewStore() {
        const storeName = document.getElementById('db-store-select').value;
        if (!storeName) {
            showToast('請選擇資料表');
            return;
        }
        
        if (typeof db === 'undefined' || !db) {
            showToast('資料庫未連接');
            return;
        }
        
        try {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const data = await new Promise((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
            
            log(`${storeName} 資料表內容 (${data.length} 筆)`, 'info', data);
            showToast(`查看完成，共 ${data.length} 筆記錄`);
        } catch (error) {
            log(`查看 ${storeName} 失敗`, 'error', error);
            showToast('查看失敗');
        }
    }
    
    // 清空資料表
    async function clearStore() {
        const storeName = document.getElementById('db-store-select').value;
        if (!storeName) {
            showToast('請選擇資料表');
            return;
        }
        
        if (!confirm(`確定要清空 ${storeName} 資料表嗎？`)) {
            return;
        }
        
        if (typeof db === 'undefined' || !db) {
            showToast('資料庫未連接');
            return;
        }
        
        try {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            await new Promise((resolve, reject) => {
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
            
            log(`${storeName} 資料表已清空`, 'success');
            showToast('清空完成');
        } catch (error) {
            log(`清空 ${storeName} 失敗`, 'error', error);
            showToast('清空失敗');
        }
    }
    
    // 建立測試寶寶
    async function createTestChild() {
        const name = document.getElementById('test-child-name').value.trim() || '測試寶寶';
        
        if (typeof db === 'undefined' || !db) {
            showToast('資料庫未連接');
            return;
        }
        
        const childData = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: name,
            gender: Math.random() > 0.5 ? '男' : '女',
            birthdate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            avatar: null
        };
        
        try {
            const transaction = db.transaction(['children'], 'readwrite');
            const store = transaction.objectStore('children');
            await new Promise((resolve, reject) => {
                const request = store.add(childData);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
            
            log('測試寶寶建立成功', 'success', childData);
            showToast(`${name} 建立成功`);
            
            // 更新測試寶寶列表
            updateTestChildList();
            
        } catch (error) {
            log('建立測試寶寶失敗', 'error', error);
            showToast('建立失敗');
        }
    }
    
    // 更新測試寶寶列表
    async function updateTestChildList() {
        if (typeof db === 'undefined' || !db) return;
        
        try {
            const transaction = db.transaction(['children'], 'readonly');
            const store = transaction.objectStore('children');
            const children = await new Promise((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
            
            const listDiv = document.getElementById('test-child-list');
            listDiv.innerHTML = children.map(child => `
                <div class="mobile-debug-stat">
                    <span class="mobile-debug-stat-label">${child.name}</span>
                    <span class="mobile-debug-stat-value">${child.gender}</span>
                </div>
            `).join('');
            
        } catch (error) {
            log('更新測試寶寶列表失敗', 'error', error);
        }
    }
    
    // 生成測試資料
    async function generateTestData() {
        if (typeof db === 'undefined' || !db) {
            showToast('資料庫未連接');
            return;
        }
        
        // 獲取第一個寶寶
        try {
            const transaction = db.transaction(['children'], 'readonly');
            const store = transaction.objectStore('children');
            const children = await new Promise((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
            
            if (children.length === 0) {
                showToast('請先建立測試寶寶');
                return;
            }
            
            const childId = children[0].id;
            log(`為 ${children[0].name} 生成測試資料...`, 'info');
            
            // 生成各種記錄
            const records = [
                { store: 'feeding', count: 10 },
                { store: 'sleep', count: 8 },
                { store: 'diaper', count: 15 },
                { store: 'health', count: 3 }
            ];
            
            for (const { store, count } of records) {
                const transaction = db.transaction([store], 'readwrite');
                const objectStore = transaction.objectStore(store);
                
                for (let i = 0; i < count; i++) {
                    const record = generateRandomRecord(store, childId);
                    objectStore.add(record);
                }
            }
            
            log('測試資料生成完成', 'success');
            showToast('測試資料生成完成');
            
        } catch (error) {
            log('生成測試資料失敗', 'error', error);
            showToast('生成失敗');
        }
    }
    
    // 生成隨機記錄
    function generateRandomRecord(type, childId) {
        const now = new Date();
        const randomTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        const base = {
            childId: childId,
            timestamp: randomTime.toISOString()
        };
        
        switch (type) {
            case 'feeding':
                return {
                    ...base,
                    method: ['breastfeeding', 'formula', 'solid'][Math.floor(Math.random() * 3)],
                    amount: Math.floor(Math.random() * 200) + 50,
                    note: '測試記錄'
                };
            case 'sleep':
                return {
                    ...base,
                    duration: Math.floor(Math.random() * 240) + 30,
                    quality: ['good', 'normal', 'poor'][Math.floor(Math.random() * 3)],
                    note: '測試記錄'
                };
            case 'diaper':
                return {
                    ...base,
                    type: ['wet', 'dirty', 'mixed'][Math.floor(Math.random() * 3)],
                    note: '測試記錄'
                };
            case 'health':
                return {
                    ...base,
                    type: Math.random() > 0.5 ? 'weight' : 'height',
                    value: Math.random() > 0.5 ? (Math.random() * 5 + 8).toFixed(1) : Math.floor(Math.random() * 20 + 70),
                    note: '測試記錄'
                };
        }
    }
    
    // 匯出資料
    async function exportData() {
        if (typeof db === 'undefined' || !db) {
            showToast('資料庫未連接');
            return;
        }
        
        log('匯出所有資料...', 'info');
        
        const storeNames = ['children', 'feeding', 'sleep', 'diaper', 'milestones', 'activities', 'health', 'interactions'];
        const exportData = {};
        
        for (const storeName of storeNames) {
            try {
                const transaction = db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const data = await new Promise((resolve, reject) => {
                    const request = store.getAll();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
                
                exportData[storeName] = data;
            } catch (error) {
                log(`匯出 ${storeName} 失敗`, 'error', error);
            }
        }
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `baby_care_export_${new Date().toISOString().split('T')[0]}.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        log('資料匯出完成', 'success');
        showToast('匯出完成');
    }
    
    // 資料分析
    async function analyzeData() {
        log('分析資料...', 'info');
        await getDBStats();
        showToast('分析完成，請查看統計');
    }
    
    // 清空所有資料
    function clearAllData() {
        if (!confirm('確定要清空所有資料嗎？此操作無法復原！')) {
            return;
        }
        
        if (typeof db !== 'undefined' && db) {
            db.close();
        }
        
        const deleteRequest = indexedDB.deleteDatabase('BabyCareDB');
        deleteRequest.onsuccess = () => {
            log('所有資料已清空', 'warning');
            showToast('資料已清空，即將重新載入頁面');
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        };
    }
    
    // 切換調試日誌
    function toggleDebugLog() {
        debugEnabled = !debugEnabled;
        const toggle = document.querySelector('.mobile-debug-switch');
        toggle.classList.toggle('active', debugEnabled);
        
        log(`調試日誌 ${debugEnabled ? '啟用' : '停用'}`, 'info');
        showToast(`調試日誌已${debugEnabled ? '啟用' : '停用'}`);
    }
    
    // 清空日誌
    function clearLogs() {
        if (logContainer) {
            logContainer.innerHTML = '';
        }
        showToast('日誌已清空');
    }
    
    // 初始化
    function init() {
        createStyles();
        createFloatingButton();
        createDebugPanel();
        
        log('手機調試工具初始化完成', 'success');
        
        // 顯示啟用提示
        setTimeout(() => {
            showToast('三指長按螢幕 1 秒啟用調試工具', 3000);
        }, 2000);
    }
    
    // 公開 API
    return {
        init,
        log,
        showToast,
        checkAppStatus,
        checkBrowserCompat,
        getDBStats,
        viewStore,
        clearStore,
        createTestChild,
        generateTestData,
        exportData,
        analyzeData,
        clearAllData,
        toggleDebugLog,
        clearLogs,
        toggle: togglePanel
    };
})();

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
    MobileDebug.init();
});

console.log('🐛 手機版調試工具已載入 - 三指長按啟用');