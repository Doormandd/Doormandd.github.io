// 飞行路径生成模块
const FlightPathGenerator = {
    /**
     * 生成边界矩形
     */
    generateBoundingRectangle(points, longestEdge) {
        if (!longestEdge) {
            longestEdge = GeometryUtils.findLongestEdge(points);
        }
        
        const edgeVec = Cesium.Cartesian3.subtract(longestEdge.end, longestEdge.start, new Cesium.Cartesian3());
        const edgeLen = Cesium.Cartesian3.magnitude(edgeVec);
        const edgeDir = Cesium.Cartesian3.normalize(edgeVec, new Cesium.Cartesian3());
        
        const avgCart = Cesium.Ellipsoid.WGS84.cartesianToCartographic(longestEdge.start);
        const up = Cesium.Cartesian3.normalize(longestEdge.start, new Cesium.Cartesian3());
        const east = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.cross(Cesium.Cartesian3.UNIT_Z, up, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        const north = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.cross(up, east, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        
        let minAlong = Infinity, maxAlong = -Infinity;
        let minPerp = Infinity, maxPerp = -Infinity;
        
        points.forEach(point => {
            const vec = Cesium.Cartesian3.subtract(point, longestEdge.start, new Cesium.Cartesian3());
            const along = Cesium.Cartesian3.dot(vec, edgeDir);
            const perp = Cesium.Cartesian3.dot(vec, 
                Cesium.Cartesian3.cross(up, edgeDir, new Cesium.Cartesian3())
            );
            
            minAlong = Math.min(minAlong, along);
            maxAlong = Math.max(maxAlong, along);
            minPerp = Math.min(minPerp, perp);
            maxPerp = Math.max(maxPerp, perp);
        });
        
        const perpVec = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.cross(up, edgeDir, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        
        const corner1 = Cesium.Cartesian3.add(
            longestEdge.start,
            Cesium.Cartesian3.multiplyByScalar(edgeDir, minAlong, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.add(
            corner1,
            Cesium.Cartesian3.multiplyByScalar(perpVec, minPerp, new Cesium.Cartesian3()),
            corner1
        );
        
        const corner2 = Cesium.Cartesian3.add(
            longestEdge.start,
            Cesium.Cartesian3.multiplyByScalar(edgeDir, maxAlong, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.add(
            corner2,
            Cesium.Cartesian3.multiplyByScalar(perpVec, minPerp, new Cesium.Cartesian3()),
            corner2
        );
        
        const corner3 = Cesium.Cartesian3.add(
            longestEdge.start,
            Cesium.Cartesian3.multiplyByScalar(edgeDir, maxAlong, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.add(
            corner3,
            Cesium.Cartesian3.multiplyByScalar(perpVec, maxPerp, new Cesium.Cartesian3()),
            corner3
        );
        
        const corner4 = Cesium.Cartesian3.add(
            longestEdge.start,
            Cesium.Cartesian3.multiplyByScalar(edgeDir, minAlong, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.add(
            corner4,
            Cesium.Cartesian3.multiplyByScalar(perpVec, maxPerp, new Cesium.Cartesian3()),
            corner4
        );
        
        return [corner1, corner2, corner3, corner4];
    },

    /**
     * 沿段生成矩形
     */
    generateRectanglesAlongSegment(p1, p2, rectWidth, rectHeight, forwardOverlap) {
        const rectangles = [];
        const segmentLength = GeometryUtils.calculateDistance(p1, p2);
        const effectiveHeight = rectHeight * (1 - forwardOverlap / 100);
        const numRects = Math.ceil(segmentLength / effectiveHeight);
        
        const cart1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(p1);
        const cart2 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(p2);
        
        const direction = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.subtract(p2, p1, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        
        const up = Cesium.Cartesian3.normalize(p1, new Cesium.Cartesian3());
        const perpVector = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.cross(up, direction, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        
        for (let i = 0; i < numRects; i++) {
            const t = i / numRects;
            const lon = cart1.longitude + t * (cart2.longitude - cart1.longitude);
            const lat = cart1.latitude + t * (cart2.latitude - cart1.latitude);
            const height = cart1.height + t * (cart2.height - cart1.height);
            
            const center = Cesium.Cartesian3.fromRadians(lon, lat, height);
            const rect = GeometryUtils.createRectangle(center, direction, perpVector, rectWidth, rectHeight);
            rectangles.push(rect);
        }
        
        return rectangles;
    },

    /**
     * 生成完整飞行路径（Z字形）
     */
    generateFlightPath(rectangleCorners, longestEdge, rectWidth, rectHeight, forwardOverlap, sideOverlap) {
        const direction = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.subtract(longestEdge.end, longestEdge.start, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        
        const up = Cesium.Cartesian3.normalize(longestEdge.start, new Cesium.Cartesian3());
        const perpVector = Cesium.Cartesian3.normalize(
            Cesium.Cartesian3.cross(up, direction, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        
        const effectiveWidth = rectWidth * (1 - sideOverlap / 100);
        const perpDistance = GeometryUtils.calculateDistance(rectangleCorners[0], rectangleCorners[3]);
        const numLines = Math.ceil(perpDistance / effectiveWidth);
        
        const allRectangles = [];
        let sequenceNumber = 1;
        
        for (let lineIdx = 0; lineIdx < numLines; lineIdx++) {
            const t = lineIdx / numLines;
            
            const startCart = Cesium.Ellipsoid.WGS84.cartesianToCartographic(rectangleCorners[0]);
            const endCart = Cesium.Ellipsoid.WGS84.cartesianToCartographic(rectangleCorners[3]);
            const startLon = startCart.longitude + t * (endCart.longitude - startCart.longitude);
            const startLat = startCart.latitude + t * (endCart.latitude - startCart.latitude);
            const lineStart = Cesium.Cartesian3.fromRadians(startLon, startLat, startCart.height);
            
            const endStartCart = Cesium.Ellipsoid.WGS84.cartesianToCartographic(rectangleCorners[1]);
            const endEndCart = Cesium.Ellipsoid.WGS84.cartesianToCartographic(rectangleCorners[2]);
            const endLon = endStartCart.longitude + t * (endEndCart.longitude - endStartCart.longitude);
            const endLat = endStartCart.latitude + t * (endEndCart.latitude - endStartCart.latitude);
            const lineEnd = Cesium.Cartesian3.fromRadians(endLon, endLat, endStartCart.height);
            
            const p1 = lineIdx % 2 === 0 ? lineStart : lineEnd;
            const p2 = lineIdx % 2 === 0 ? lineEnd : lineStart;
            
            const lineRects = this.generateRectanglesAlongSegment(p1, p2, rectWidth, rectHeight, forwardOverlap);
            
            lineRects.forEach(rect => {
                rect.sequenceNumber = sequenceNumber++;
                allRectangles.push(rect);
            });
        }
        
        return allRectangles;
    },

    /**
     * 裁剪飞行路径
     */
    clipFlightPath(flightPath, roiPolygon, viewer) {
        const clippedSegments = [];
        let intersectionCount = 0;
        
        console.log('===== 开始裁剪飞行路径 =====');
        console.log('总航点数:', flightPath.length);
        
        for (let i = 0; i < flightPath.length - 1; i++) {
            const p1 = flightPath[i].center;
            const p2 = flightPath[i + 1].center;
            
            const isP1Inside = GeometryUtils.isPointInPolygon(p1, roiPolygon);
            const isP2Inside = GeometryUtils.isPointInPolygon(p2, roiPolygon);
            
            console.log(`段 ${i}-${i+1}: 起点${isP1Inside?'内':'外'} -> 终点${isP2Inside?'内':'外'}`);
            
            if (isP1Inside && isP2Inside) {
                // 完全在内
                clippedSegments.push({ start: p1, end: p2 });
                console.log('  ✓ 完整保留');
            } else if (!isP1Inside && !isP2Inside) {
                // 完全在外
                console.log('  × 完全舍弃');
            } else {
                // 一内一外 - 必须有交点
                let intersections = GeometryUtils.lineSegmentPolygonIntersections(p1, p2, roiPolygon);
                
                if (intersections.length === 0) {
                    console.log('  ⚠️ 参数法未找到交点，尝试二分法...');
                    const bisectionPoint = GeometryUtils.findIntersectionByBisection(p1, p2, roiPolygon);
                    intersections = [bisectionPoint];
                }
                
                if (intersections.length > 0) {
                    const intersection = intersections[0];
                    
                    // 添加交点标记
                    intersectionCount++;
                    viewer.entities.add({
                        position: intersection,
                        point: {
                            pixelSize: 12,
                            color: Cesium.Color.LIME,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2
                        },
                        label: {
                            text: `交点${intersectionCount}`,
                            font: '14px sans-serif',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            pixelOffset: new Cesium.Cartesian2(0, -20),
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                        }
                    });
                    
                    if (isP1Inside) {
                        clippedSegments.push({ start: p1, end: intersection });
                        console.log(`  ✓ 保留 起点->交点${intersectionCount}`);
                    } else {
                        clippedSegments.push({ start: intersection, end: p2 });
                        console.log(`  ✓ 保留 交点${intersectionCount}->终点`);
                    }
                } else {
                    console.log('  ⚠️ 二分法也失败，强制保留当前点');
                    if (isP2Inside) {
                        clippedSegments.push({ start: p2, end: p2 });
                    }
                }
            }
        }
        
        console.log('===== 裁剪完成 =====');
        console.log('原始段数:', flightPath.length - 1);
        console.log('保留段数:', clippedSegments.length);
        console.log('交点总数:', intersectionCount);
        
        return clippedSegments;
    }
};
