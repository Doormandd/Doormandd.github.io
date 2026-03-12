// UI管理模块
const UIManager = {
    currentSurvey: null,
    
    /**
     * 更新坐标显示
     */
    updateCoordinatesDisplay(positions) {
        const coordsDiv = document.getElementById('coordinates');
        if (!coordsDiv) return;
        
        coordsDiv.innerHTML = '';
        
        if (positions.length === 0) {
            coordsDiv.textContent = '未绘制多边形';
            return;
        }
        
        positions.forEach((pos, index) => {
            const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pos);
            const lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
            const lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
            
            const pointDiv = document.createElement('div');
            pointDiv.textContent = `点 ${index + 1}: ${lon}, ${lat}`;
            coordsDiv.appendChild(pointDiv);
        });
        
        // 显示面积
        if (positions.length >= 3) {
            const area = GeometryUtils.calculatePolygonArea(positions);
            const areaDiv = document.createElement('div');
            areaDiv.style.fontWeight = 'bold';
            areaDiv.style.marginTop = '10px';
            areaDiv.textContent = `面积: ${GeometryUtils.formatArea(area)}`;
            coordsDiv.appendChild(areaDiv);
        }
    },

    /**
     * 更新测区列表
     */
    updateSurveyList(surveys) {
        const listDiv = document.getElementById('surveyList');
        if (!listDiv) return;
        
        listDiv.innerHTML = '';
        
        if (surveys.length === 0) {
            listDiv.textContent = '暂无保存的测区';
            return;
        }
        
        surveys.forEach((survey, index) => {
            const surveyDiv = document.createElement('div');
            surveyDiv.style.padding = '10px';
            surveyDiv.style.borderBottom = '1px solid #444';
            surveyDiv.style.cursor = 'pointer';
            
            if (this.currentSurvey === survey) {
                surveyDiv.style.backgroundColor = '#3a3a3a';
            }
            
            surveyDiv.innerHTML = `
                <div style="font-weight: bold;">${survey.name}</div>
                <div style="font-size: 12px; color: #aaa;">
                    ${GeometryUtils.formatArea(survey.area)}
                </div>
            `;
            
            surveyDiv.onclick = () => {
                this.currentSurvey = survey;
                this.updateSurveyList(surveys);
                if (survey.loadCallback) {
                    survey.loadCallback();
                }
            };
            
            listDiv.appendChild(surveyDiv);
        });
    },

    /**
     * 更新状态栏
     */
    updateStatusBar(message, type = 'info') {
        const statusBar = document.getElementById('statusBar');
        if (!statusBar) return;
        
        const colors = {
            info: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336',
            success: '#2196F3'
        };
        
        statusBar.textContent = message;
        statusBar.style.backgroundColor = colors[type] || colors.info;
        statusBar.style.display = 'block';
        
        setTimeout(() => {
            statusBar.style.display = 'none';
        }, 3000);
    },

    /**
     * 显示确认对话框
     */
    showConfirm(message, callback) {
        if (confirm(message)) {
            callback();
        }
    },

    /**
     * 显示输入对话框
     */
    showPrompt(message, defaultValue, callback) {
        const value = prompt(message, defaultValue);
        if (value !== null) {
            callback(value);
        }
    },

    /**
     * 更新飞行参数显示
     */
    updateFlightParamsDisplay(params) {
        const elements = {
            rectWidth: document.getElementById('rectWidth'),
            rectHeight: document.getElementById('rectHeight'),
            forwardOverlap: document.getElementById('forwardOverlap'),
            sideOverlap: document.getElementById('sideOverlap'),
            flightHeight: document.getElementById('flightHeight')
        };
        
        if (elements.rectWidth) elements.rectWidth.value = params.rectWidth || '';
        if (elements.rectHeight) elements.rectHeight.value = params.rectHeight || '';
        if (elements.forwardOverlap) elements.forwardOverlap.value = params.forwardOverlap || '';
        if (elements.sideOverlap) elements.sideOverlap.value = params.sideOverlap || '';
        if (elements.flightHeight) elements.flightHeight.value = params.flightHeight || '';
    },

    /**
     * 获取飞行参数输入值
     */
    getFlightParamsFromInputs() {
        return {
            rectWidth: parseFloat(document.getElementById('rectWidth')?.value) || 0,
            rectHeight: parseFloat(document.getElementById('rectHeight')?.value) || 0,
            forwardOverlap: parseFloat(document.getElementById('forwardOverlap')?.value) || 70,
            sideOverlap: parseFloat(document.getElementById('sideOverlap')?.value) || 60,
            flightHeight: parseFloat(document.getElementById('flightHeight')?.value) || 100
        };
    },
    
    /**
     * 获取传感器参数输入值
     */
    getSensorParamsFromInputs() {
        return {
            sensorWidth: parseFloat(document.getElementById('sensorWidth')?.value) || CONFIG.defaultCamera.sensorWidth,
            sensorHeight: parseFloat(document.getElementById('sensorHeight')?.value) || CONFIG.defaultCamera.sensorHeight,
            pixelWidth: parseFloat(document.getElementById('pixelWidth')?.value) || CONFIG.defaultCamera.pixelWidth,
            pixelHeight: parseFloat(document.getElementById('pixelHeight')?.value) || CONFIG.defaultCamera.pixelHeight,
            focalLength: parseFloat(document.getElementById('focalLength')?.value) || CONFIG.defaultCamera.focalLength,
            gsd: parseFloat(document.getElementById('gsd')?.value) || CONFIG.defaultCamera.gsd
        };
    },
    
    /**
     * 更新计算后的飞行参数（只读字段）
     */
    updateCalculatedParams(calculated) {
        const flightHeightEl = document.getElementById('flightHeight');
        const rectWidthEl = document.getElementById('rectangleWidth');
        const rectHeightEl = document.getElementById('rectangleHeight');
        
        if (flightHeightEl) {
            flightHeightEl.value = calculated.flightHeight.toFixed(2);
        }
        if (rectWidthEl) {
            rectWidthEl.value = calculated.groundWidth.toFixed(2);
        }
        if (rectHeightEl) {
            rectHeightEl.value = calculated.groundHeight.toFixed(2);
        }
    },

    /**
     * 切换面板显示
     */
    togglePanel(panelId, show) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.display = show ? 'block' : 'none';
        }
    },

    /**
     * 启用/禁用按钮
     */
    setButtonEnabled(buttonId, enabled) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = !enabled;
            button.style.opacity = enabled ? '1' : '0.5';
        }
    },

    /**
     * 更新进度条
     */
    updateProgress(percent, message) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar) {
            progressBar.style.width = percent + '%';
        }
        
        if (progressText) {
            progressText.textContent = message || `${percent}%`;
        }
    },

    /**
     * 显示/隐藏加载指示器
     */
    showLoading(show, message = '加载中...') {
        let loadingDiv = document.getElementById('loadingIndicator');
        
        if (!loadingDiv && show) {
            loadingDiv = document.createElement('div');
            loadingDiv.id = 'loadingIndicator';
            loadingDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 20px 40px;
                border-radius: 5px;
                z-index: 10000;
            `;
            document.body.appendChild(loadingDiv);
        }
        
        if (loadingDiv) {
            loadingDiv.textContent = message;
            loadingDiv.style.display = show ? 'block' : 'none';
        }
    }
};
