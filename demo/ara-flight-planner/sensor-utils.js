// 传感器参数计算模块
const SensorUtils = {
    /**
     * 根据GSD和传感器参数计算飞行高度
     * @param {Object} params - 传感器参数
     * @param {number} params.sensorWidth - 传感器宽度 (mm)
     * @param {number} params.sensorHeight - 传感器高度 (mm)
     * @param {number} params.pixelWidth - 像素宽度 (px)
     * @param {number} params.pixelHeight - 像素高度 (px)
     * @param {number} params.focalLength - 焦距 (mm)
     * @param {number} params.gsd - 地面采样距离 (mm/px)
     * @returns {number} 飞行高度 (米)
     */
    calculateFlightHeight(params) {
        const { sensorWidth, sensorHeight, pixelWidth, pixelHeight, focalLength, gsd } = params;
        
        // 计算像元大小 (mm/px)
        const pixelSizeWidth = sensorWidth / pixelWidth;
        const pixelSizeHeight = sensorHeight / pixelHeight;
        const avgPixelSize = (pixelSizeWidth + pixelSizeHeight) / 2;
        
        // 飞行高度公式: H = (GSD × f) / pixelSize
        // 单位: (mm/px × mm) / (mm/px) = mm，需要转换为米
        const flightHeight = (gsd * focalLength) / avgPixelSize / 1000;
        
        return flightHeight;
    },
    
    /**
     * 计算地面覆盖尺寸
     * @param {Object} params - 传感器参数
     * @returns {Object} {width: 地面覆盖宽度(米), height: 地面覆盖高度(米)}
     */
    calculateGroundCoverage(params) {
        const { pixelWidth, pixelHeight, gsd } = params;
        
        // 地面覆盖尺寸 = 像素数 × GSD / 1000
        const width = (pixelWidth * gsd) / 1000;  // 米
        const height = (pixelHeight * gsd) / 1000; // 米
        
        return { width, height };
    },
    
    /**
     * 反向计算: 根据飞行高度计算GSD
     * @param {Object} params - 传感器参数（不包含GSD）
     * @param {number} flightHeight - 飞行高度 (米)
     * @returns {number} 地面采样距离 (mm/px)
     */
    calculateGSDFromHeight(params, flightHeight) {
        const { sensorWidth, sensorHeight, pixelWidth, pixelHeight, focalLength } = params;
        
        // 计算像元大小
        const pixelSizeWidth = sensorWidth / pixelWidth;
        const pixelSizeHeight = sensorHeight / pixelHeight;
        const avgPixelSize = (pixelSizeWidth + pixelSizeHeight) / 2;
        
        // GSD = (H × pixelSize) / f
        const gsd = (flightHeight * 1000 * avgPixelSize) / focalLength;
        
        return gsd;
    },
    
    /**
     * 计算完整的飞行参数
     * @param {Object} params - 传感器参数（包含GSD）
     * @returns {Object} 完整计算结果
     */
    calculateFlightParams(params) {
        const flightHeight = this.calculateFlightHeight(params);
        const coverage = this.calculateGroundCoverage(params);
        
        // 计算像元大小
        const pixelSizeWidth = params.sensorWidth / params.pixelWidth;
        const pixelSizeHeight = params.sensorHeight / params.pixelHeight;
        
        return {
            flightHeight: flightHeight,
            groundWidth: coverage.width,
            groundHeight: coverage.height,
            pixelSizeWidth: pixelSizeWidth,
            pixelSizeHeight: pixelSizeHeight,
            avgPixelSize: (pixelSizeWidth + pixelSizeHeight) / 2,
            gsd: params.gsd
        };
    },
    
    /**
     * 验证传感器参数
     * @param {Object} params - 传感器参数
     * @returns {Object} {valid: 是否有效, errors: 错误信息数组}
     */
    validateParams(params) {
        const errors = [];
        
        if (!params.sensorWidth || params.sensorWidth <= 0) {
            errors.push('传感器宽度必须大于0');
        }
        if (!params.sensorHeight || params.sensorHeight <= 0) {
            errors.push('传感器高度必须大于0');
        }
        if (!params.pixelWidth || params.pixelWidth <= 0) {
            errors.push('像素宽度必须大于0');
        }
        if (!params.pixelHeight || params.pixelHeight <= 0) {
            errors.push('像素高度必须大于0');
        }
        if (!params.focalLength || params.focalLength <= 0) {
            errors.push('焦距必须大于0');
        }
        if (!params.gsd || params.gsd <= 0) {
            errors.push('GSD必须大于0');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },
    
    /**
     * 格式化输出飞行参数
     * @param {Object} params - 计算结果
     * @returns {string} 格式化的字符串
     */
    formatFlightParams(params) {
        return `
飞行参数计算结果:
  - 飞行高度: ${params.flightHeight.toFixed(2)} m
  - 地面覆盖宽度: ${params.groundWidth.toFixed(2)} m
  - 地面覆盖高度: ${params.groundHeight.toFixed(2)} m
  - 像元大小: ${params.avgPixelSize.toFixed(4)} mm/px
  - GSD: ${params.gsd} mm/px
        `.trim();
    }
};
