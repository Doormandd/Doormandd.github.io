// 几何计算工具模块
const GeometryUtils = {
    /**
     * 计算多边形面积（平面近似）
     */
    calculatePolygonArea(positions) {
        if (positions.length < 3) return 0;

        const cartographics = positions.map(pos => 
            Cesium.Ellipsoid.WGS84.cartesianToCartographic(pos)
        );

        let area = 0;
        const n = cartographics.length;
        
        for (let i = 0; i < n; i++) {
            const current = cartographics[i];
            const next = cartographics[(i + 1) % n];
            
            const lon1 = current.longitude;
            const lat1 = current.latitude;
            const lon2 = next.longitude;
            const lat2 = next.latitude;
            
            area += (lon2 - lon1) * (lat2 + lat1) / 2;
        }
        
        area = Math.abs(area);
        const avgLat = cartographics.reduce((sum, c) => sum + c.latitude, 0) / n;
        const cosAvgLat = Math.cos(avgLat);
        
        const areaM2 = area * CONFIG.earth.radius * CONFIG.earth.radius * cosAvgLat;
        
        return areaM2;
    },

    /**
     * 格式化面积显示
     */
    formatArea(areaM2) {
        if (areaM2 > 1000000) {
            return (areaM2 / 1000000).toFixed(2) + ' km²';
        } else if (areaM2 > 10000) {
            return (areaM2 / 10000).toFixed(2) + ' 亩';
        } else {
            return areaM2.toFixed(0) + ' m²';
        }
    },

    /**
     * 计算两点间距离
     */
    calculateDistance(point1, point2) {
        const cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(point1);
        const cartographic2 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(point2);
        
        const geodesic = new Cesium.EllipsoidGeodesic(cartographic1, cartographic2);
        return geodesic.surfaceDistance;
    },

    /**
     * 找到多边形最长边
     */
    findLongestEdge(points) {
        if (points.length < 2) return null;
        
        let maxDistance = 0;
        let longestEdge = null;
        
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            const distance = this.calculateDistance(p1, p2);
            
            if (distance > maxDistance) {
                maxDistance = distance;
                longestEdge = {
                    start: p1,
                    end: p2,
                    distance: distance
                };
            }
        }
        
        return longestEdge;
    },

    /**
     * 判断点是否在多边形内（射线法）
     */
    isPointInPolygon(point, polygonPoints) {
        const pos = Cesium.Ellipsoid.WGS84.cartesianToCartographic(point);
        const x = pos.longitude;
        const y = pos.latitude;
        
        let inside = false;
        const polygon = polygonPoints.map(p => Cesium.Ellipsoid.WGS84.cartesianToCartographic(p));
        
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].longitude, yi = polygon[i].latitude;
            const xj = polygon[j].longitude, yj = polygon[j].latitude;
            
            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    },

    /**
     * 计算线段与多边形边的交点
     */
    lineSegmentPolygonIntersections(p1, p2, polygonPoints) {
        const intersections = [];
        const cart1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(p1);
        const cart2 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(p2);
        
        const x1 = cart1.longitude, y1 = cart1.latitude;
        const x2 = cart2.longitude, y2 = cart2.latitude;
        
        const polygon = polygonPoints.map(p => Cesium.Ellipsoid.WGS84.cartesianToCartographic(p));
        
        for (let i = 0; i < polygon.length; i++) {
            const j = (i + 1) % polygon.length;
            const x3 = polygon[i].longitude, y3 = polygon[i].latitude;
            const x4 = polygon[j].longitude, y4 = polygon[j].latitude;
            
            const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (Math.abs(denom) < CONFIG.tolerance.parallel) continue;
            
            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
            
            const TOLERANCE = CONFIG.tolerance.intersection;
            if (t >= -TOLERANCE && t <= 1 + TOLERANCE && u >= -TOLERANCE && u <= 1 + TOLERANCE) {
                const tClamped = Math.max(0, Math.min(1, t));
                const lon = x1 + tClamped * (x2 - x1);
                const lat = y1 + tClamped * (y2 - y1);
                const height = cart1.height + tClamped * (cart2.height - cart1.height);
                const intersectionPoint = Cesium.Cartesian3.fromRadians(lon, lat, height);
                intersections.push({ point: intersectionPoint, t: tClamped });
            }
        }
        
        intersections.sort((a, b) => a.t - b.t);
        return intersections.map(i => i.point);
    },

    /**
     * 二分法查找交点（备用方案）
     */
    findIntersectionByBisection(p1, p2, polygonPoints) {
        let start = 0;
        let end = 1;
        const isP1Inside = this.isPointInPolygon(p1, polygonPoints);
        
        for (let i = 0; i < 20; i++) {
            const mid = (start + end) / 2;
            const midPoint = Cesium.Cartesian3.lerp(p1, p2, mid, new Cesium.Cartesian3());
            const isMidInside = this.isPointInPolygon(midPoint, polygonPoints);
            
            if (isMidInside === isP1Inside) {
                start = mid;
            } else {
                end = mid;
            }
        }
        
        const t = (start + end) / 2;
        const intersectionPoint = Cesium.Cartesian3.lerp(p1, p2, t, new Cesium.Cartesian3());
        return intersectionPoint;
    },

    /**
     * 创建单个矩形
     */
    createRectangle(center, direction, perpVector, width, height) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        const corner1 = Cesium.Cartesian3.add(
            center,
            Cesium.Cartesian3.multiplyByScalar(direction, -halfHeight, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.add(
            corner1,
            Cesium.Cartesian3.multiplyByScalar(perpVector, -halfWidth, new Cesium.Cartesian3()),
            corner1
        );
        
        const corner2 = Cesium.Cartesian3.add(
            center,
            Cesium.Cartesian3.multiplyByScalar(direction, halfHeight, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.add(
            corner2,
            Cesium.Cartesian3.multiplyByScalar(perpVector, -halfWidth, new Cesium.Cartesian3()),
            corner2
        );
        
        const corner3 = Cesium.Cartesian3.add(
            center,
            Cesium.Cartesian3.multiplyByScalar(direction, halfHeight, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.add(
            corner3,
            Cesium.Cartesian3.multiplyByScalar(perpVector, halfWidth, new Cesium.Cartesian3()),
            corner3
        );
        
        const corner4 = Cesium.Cartesian3.add(
            center,
            Cesium.Cartesian3.multiplyByScalar(direction, -halfHeight, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.add(
            corner4,
            Cesium.Cartesian3.multiplyByScalar(perpVector, halfWidth, new Cesium.Cartesian3()),
            corner4
        );
        
        return {
            corners: [corner1, corner2, corner3, corner4],
            center: center
        };
    }
};
