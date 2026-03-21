// 配置文件
const CONFIG = {
    // Cesium Ion Token
    cesiumToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YTI4MTIzMi00MTE5LTRmOGEtYTY5NS1jZjE2YjBmOTYzZTQiLCJpZCI6MTE2NzM0LCJpYXQiOjE2Njk4Nzk0MjB9.yXkpWK9u3aO99Yst1LYpbDRyy8LkOQ86bemQJ3xCQ0g',
    
    // 默认相机参数
    defaultCamera: {
        sensorWidth: 35.9,      // mm - 传感器宽度
        sensorHeight: 24,       // mm - 传感器高度
        pixelWidth: 6000,       // px - 像素宽度
        pixelHeight: 4000,      // px - 像素高度
        focalLength: 50,        // mm - 焦距
        gsd: 20.0,             // mm/px - 默认地面采样距离（可调整）
    },
    
    // 默认航线参数
    defaultFlight: {
        forwardOverlap: 70,     // % - 航向重叠度
        sideOverlap: 60,        // % - 旁向重叠度
    },
    
    // 地球参数
    earth: {
        radius: 6371000,        // 米 - 地球平均半径
    },
    
    // 精度参数
    tolerance: {
        parallel: 1e-15,        // 平行判定阈值
        intersection: 1e-6,     // 交点检测容差
        bisection: 1e-6,        // 二分法精度
    },
    
    // 初始场景位置
    initialView: {
        longitude: 116.3974,    // 北京经度
        latitude: 39.9087,      // 北京纬度
        height: 5000,          // 相机高度(米)
    }
};
