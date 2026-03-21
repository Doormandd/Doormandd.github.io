// 主应用程序模块
class FlightPlanningApp {
    constructor() {
        this.viewer = null;
        this.handler = null;
        this.roiPolygon = [];
        this.drawingMode = null;
        this.savedSurveys = [];
        this.currentFlightPath = [];
        this.rectangleEntity = null;
        this.flightPathEntity = null;
        this.clippedPathEntity = null;
    }

    /**
     * 初始化Cesium viewer
     */
    async init() {
        Cesium.Ion.defaultAccessToken = CONFIG.cesiumToken;
        
        this.viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: await Cesium.createWorldTerrainAsync(),
            animation: false,
            timeline: false,
            geocoder: true,
            homeButton: true,
            sceneModePicker: true,
            baseLayerPicker: true,
            navigationHelpButton: false,
            fullscreenButton: true,
            vrButton: false,
            selectionIndicator: true,
            infoBox: true
        });

        // 设置初始视角
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                CONFIG.initialView.longitude,
                CONFIG.initialView.latitude,
                CONFIG.initialView.height
            )
        });

        // 初始化事件处理器
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        
        // 绑定事件
        this.bindEvents();
        
        console.log('飞行规划系统初始化完成');
    }

    /**
     * 绑定UI事件
     */
    bindEvents() {
        const buttons = {
            drawROI: () => this.startDrawing('roi'),
            clearROI: () => this.clearROI(),
            generateRectangle: () => this.generateRectangle(),
            generatePath: () => this.generatePath(),
            clipPath: () => this.clipPath(),
            saveSurvey: () => this.saveSurvey(),
            clearAll: () => this.clearAll()
        };

        Object.keys(buttons).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.onclick = buttons[id];
            }
        });
    }

    /**
     * 开始绘制模式
     */
    startDrawing(mode) {
        this.drawingMode = mode;
        this.roiPolygon = [];
        
        const button = document.getElementById('drawROI');
        if (button) {
            button.classList.add('active');
            button.textContent = '点击地图绘制多边形...';
        }

        this.handler.setInputAction((click) => {
            const cartesian = this.viewer.camera.pickEllipsoid(
                click.position,
                this.viewer.scene.globe.ellipsoid
            );

            if (cartesian) {
                this.roiPolygon.push(cartesian);
                
                // 添加点标记
                this.viewer.entities.add({
                    position: cartesian,
                    point: {
                        pixelSize: 8,
                        color: Cesium.Color.RED
                    }
                });

                // 更新多边形显示
                this.updateROIDisplay();
                UIManager.updateCoordinatesDisplay(this.roiPolygon);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 右键完成绘制
        this.handler.setInputAction(() => {
            if (this.roiPolygon.length >= 3) {
                this.finishDrawing();
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    /**
     * 完成绘制
     */
    finishDrawing() {
        this.drawingMode = null;
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        const button = document.getElementById('drawROI');
        if (button) {
            button.classList.remove('active');
            button.textContent = '绘制测区';
        }

        UIManager.updateStatusBar('ROI绘制完成', 'success');
    }

    /**
     * 更新ROI显示
     */
    updateROIDisplay() {
        // 移除旧的多边形
        const oldEntities = this.viewer.entities.values.filter(
            e => e.polygon && e.id.startsWith('roi-')
        );
        oldEntities.forEach(e => this.viewer.entities.remove(e));

        if (this.roiPolygon.length >= 3) {
            this.viewer.entities.add({
                id: 'roi-polygon',
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(this.roiPolygon),
                    material: Cesium.Color.RED.withAlpha(0.3),
                    outline: true,
                    outlineColor: Cesium.Color.RED,
                    outlineWidth: 2
                }
            });
        }
    }

    /**
     * 清除ROI
     */
    clearROI() {
        UIManager.showConfirm('确定要清除当前ROI吗?', () => {
            this.roiPolygon = [];
            
            // 清除所有ROI相关实体
            const roiEntities = this.viewer.entities.values.filter(
                e => e.id.startsWith('roi-') || (e.point && e.point.color?.getValue() === Cesium.Color.RED)
            );
            roiEntities.forEach(e => this.viewer.entities.remove(e));

            UIManager.updateCoordinatesDisplay([]);
            UIManager.updateStatusBar('ROI已清除', 'info');
        });
    }

    /**
     * 生成边界矩形
     */
    generateRectangle() {
        if (this.roiPolygon.length < 3) {
            UIManager.updateStatusBar('请先绘制ROI多边形', 'warning');
            return;
        }

        const longestEdge = GeometryUtils.findLongestEdge(this.roiPolygon);
        const rectangleCorners = FlightPathGenerator.generateBoundingRectangle(
            this.roiPolygon,
            longestEdge
        );

        // 显示矩形
        if (this.rectangleEntity) {
            this.viewer.entities.remove(this.rectangleEntity);
        }

        this.rectangleEntity = this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(rectangleCorners),
                material: Cesium.Color.BLUE.withAlpha(0.3),
                outline: true,
                outlineColor: Cesium.Color.BLUE,
                outlineWidth: 3
            }
        });

        // 存储用于后续生成路径
        this.rectangleCorners = rectangleCorners;
        this.longestEdge = longestEdge;

        UIManager.updateStatusBar('边界矩形已生成', 'success');
    }

    /**
     * 生成飞行路径
     */
    generatePath() {
        if (!this.rectangleCorners) {
            UIManager.updateStatusBar('请先生成边界矩形', 'warning');
            return;
        }

        const params = UIManager.getFlightParamsFromInputs();
        
        if (!params.rectWidth || !params.rectHeight) {
            UIManager.updateStatusBar('请输入矩形宽度和高度', 'warning');
            return;
        }

        // 清除旧路径
        if (this.flightPathEntity) {
            this.viewer.entities.remove(this.flightPathEntity);
        }

        // 生成路径
        const flightPath = FlightPathGenerator.generateFlightPath(
            this.rectangleCorners,
            this.longestEdge,
            params.rectWidth,
            params.rectHeight,
            params.forwardOverlap,
            params.sideOverlap
        );

        this.currentFlightPath = flightPath;

        // 显示路径
        const pathPositions = flightPath.map(r => r.center);
        this.flightPathEntity = this.viewer.entities.add({
            polyline: {
                positions: pathPositions,
                width: 3,
                material: Cesium.Color.YELLOW,
                clampToGround: false
            }
        });

        // 显示矩形框
        flightPath.forEach(rect => {
            this.viewer.entities.add({
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(rect.corners),
                    material: Cesium.Color.YELLOW.withAlpha(0.2),
                    outline: true,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 1
                }
            });
        });

        UIManager.updateStatusBar(`飞行路径已生成 (${flightPath.length}个航点)`, 'success');
    }

    /**
     * 裁剪飞行路径
     */
    clipPath() {
        if (this.currentFlightPath.length === 0) {
            UIManager.updateStatusBar('请先生成飞行路径', 'warning');
            return;
        }

        if (this.roiPolygon.length < 3) {
            UIManager.updateStatusBar('请先绘制ROI多边形', 'warning');
            return;
        }

        // 清除旧的裁剪路径和交点标记
        if (this.clippedPathEntity) {
            this.viewer.entities.remove(this.clippedPathEntity);
        }
        
        // 清除所有交点标记
        const intersectionMarkers = this.viewer.entities.values.filter(
            e => e.point?.color?.getValue() === Cesium.Color.LIME
        );
        intersectionMarkers.forEach(e => this.viewer.entities.remove(e));

        // 执行裁剪
        const clippedSegments = FlightPathGenerator.clipFlightPath(
            this.currentFlightPath,
            this.roiPolygon,
            this.viewer
        );

        // 显示裁剪后的路径
        clippedSegments.forEach(segment => {
            this.viewer.entities.add({
                polyline: {
                    positions: [segment.start, segment.end],
                    width: 5,
                    material: Cesium.Color.GREEN
                }
            });
        });

        UIManager.updateStatusBar(
            `路径裁剪完成 (保留${clippedSegments.length}段)`,
            'success'
        );
    }

    /**
     * 保存测区
     */
    saveSurvey() {
        if (this.roiPolygon.length < 3) {
            UIManager.updateStatusBar('没有可保存的测区', 'warning');
            return;
        }

        UIManager.showPrompt('请输入测区名称:', `测区${this.savedSurveys.length + 1}`, (name) => {
            const area = GeometryUtils.calculatePolygonArea(this.roiPolygon);
            
            const survey = {
                name: name,
                polygon: [...this.roiPolygon],
                area: area,
                timestamp: new Date().toISOString(),
                loadCallback: () => {
                    // 恢复测区
                    this.clearAll();
                    this.roiPolygon = [...survey.polygon];
                    this.updateROIDisplay();
                    UIManager.updateCoordinatesDisplay(this.roiPolygon);
                    this.viewer.camera.flyTo({
                        destination: Cesium.BoundingSphere.fromPoints(survey.polygon).center,
                        duration: 2
                    });
                }
            };

            this.savedSurveys.push(survey);
            UIManager.updateSurveyList(this.savedSurveys);
            UIManager.updateStatusBar(`测区"${name}"已保存`, 'success');
        });
    }

    /**
     * 清除所有
     */
    clearAll() {
        UIManager.showConfirm('确定要清除所有内容吗?', () => {
            this.roiPolygon = [];
            this.currentFlightPath = [];
            this.rectangleCorners = null;
            this.longestEdge = null;

            // 清除所有实体
            this.viewer.entities.removeAll();

            UIManager.updateCoordinatesDisplay([]);
            UIManager.updateStatusBar('已清除所有内容', 'info');
        });
    }
}

// 应用程序实例
let app = null;

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', async () => {
    try {
        app = new FlightPlanningApp();
        await app.init();
    } catch (error) {
        console.error('初始化失败:', error);
        alert('应用程序初始化失败，请检查控制台错误信息');
    }
});
