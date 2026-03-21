# YOLO+DeepSORT+Hunyuan3D 实现无人机实时目标跟踪项目


## 项目概述

本项目实现了一个实时无人机目标跟踪系统，结合了多种最先进的计算机视觉技术。系统能够实时处理来自无人机的视频帧，使用 YOLO 检测车辆，通过 DeepOCSORT（DeepSORT 的改进版本）在帧间跟踪目标，并通过基于 WebSocket 的接口可视化结果。

## 核心特性

### 实时目标检测
- **YOLO (You Only Look Once)** 实现快速准确的目标检测
- 专门针对车辆检测（VisDrone 数据集中的汽车）
- 可配置的置信度阈值以获得最佳检测性能
- 基于尺寸和宽高比的高效无效检测过滤

### 高级目标跟踪
- BoxMOT 框架中的 **DeepOCSORT** 跟踪算法
- 使用 OSNet-x0.25-MSMT17 模型的 ReID（重识别）特征
- 相机运动补偿以提高跟踪准确性
- 自适应加权实现鲁棒的轨迹关联
- 可配置参数：最大寿命、最小命中数、IOU 阈值

### 实时通信
- 用于实时帧处理的 **WebSocket 服务器**
- Base64 编码的图像传输
- 用于目标选择的双向通信
- 基于 JSON 的控制消息协议

### 用户界面
- 交互式 Web 界面（demo.html）
- 实时可视化跟踪结果
- 目标选择功能
- 轨迹历史可视化
- 颜色编码的边界框（普通目标绿色，选中目标红色）

## 技术架构

```
客户端（Web 浏览器）
    ↓ WebSocket (Base64 图像)
服务器 (track_server.py)
    ↓ 1. 图像解码
    ↓ 2. YOLO 检测
    ↓ 3. DeepOCSORT 跟踪
    ↓ 4. 可视化
    ↓ WebSocket (带标注图像的 JSON)
客户端（显示结果）
```

## 安装

```bash
# 安装依赖
pip install -r requirements_boxmot.txt

# 下载所需模型
# - best.pt (YOLO 检测模型)
# - osnet_x0_25_msmt17.pt (ReID 模型)
```

## 使用方法

### 1. 启动 WebSocket 服务器

```bash
# 启动 WebSocket 服务器
python track_server.py

# 服务器运行在 ws://localhost:8765
```

### 2. 打开 Demo 演示页面

<div style="text-align: center; margin: 30px 0;">
  <a href="https://github.com/Doormandd/Yolo-DeepSORT-Hunyuan3D/blob/main/demo.html" target="_blank" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
    🚀 进入在线 Demo
  </a>
</div>

<div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
  <strong>💡 提示：</strong>点击按钮后，请下载或克隆项目到本地，然后在浏览器中打开 <code>demo.html</code> 文件即可体验完整的 3D 模拟和跟踪演示。
</div>

在 Web 浏览器中打开 `demo.html` 文件，即可看到完整的 3D 模拟和跟踪演示。

## Demo 功能介绍

### 3D 可视化系统

本项目包含一个基于 **Cesium** 的 3D 可视化演示系统，提供以下功能：

#### 主要特性

- **3D 地球可视化**：使用 Cesium 实现逼真的 3D 地球和地形渲染
- **车辆和无人机模拟**：在 3D 场景中放置和控制车辆及无人机模型
- **轨迹规划**：支持自定义轨迹绘制和路径规划
- **实时目标跟踪集成**：与 WebSocket 服务器集成，实时显示跟踪结果

#### 控制面板功能

1. **模型管理**
   - 加载和管理 3D 模型（车辆、无人机）
   - 支持多种车辆模型（如丰田、油罐车等）
   - 模型预览和选择

2. **轨迹编辑**
   - 在 3D 地球上绘制自定义轨迹
   - 编辑和修改已有轨迹
   - 轨迹预览功能

3. **模拟控制**
   - 启动/暂停模拟
   - 控制无人机沿轨迹飞行
   - 实时相机视角切换

4. **实时跟踪**
   - 连接到 WebSocket 跟踪服务器
   - 实时显示检测结果和边界框
   - 选中特定跟踪目标
   - 轨迹历史可视化

#### 使用流程

1. **准备环境**
   ```bash
   # 确保已启动跟踪服务器
   python track_server.py
   ```

2. **打开 Demo**
   - 在浏览器中打开 `demo.html`
   - 系统会自动加载 3D 地球和模型

3. **创建场景**
   - 点击"放置目标"按钮，在地球上放置车辆模型
   - 绘制轨迹路径
   - 放置无人机 Agent

4. **启动跟踪**
   - 点击"连接跟踪服务器"按钮
   - 系统开始实时传输和处理视频帧
   - 查看检测结果和跟踪信息

5. **交互控制**
   - 点击检测框选择特定目标
   - 使用鼠标控制 3D 视角
   - 通过控制面板管理模拟状态

#### 技术实现

- **前端框架**：Cesium.js 用于 3D 渲染
- **通信协议**：WebSocket 实现实时数据传输
- **模型格式**：GLB/GLTF 3D 模型
- **相机控制**：支持多视角切换和自由移动

#### 界面截图说明

Demo 包含两个主要视图：
- **主视图**：3D 地球和场景可视化
- **预览视图**：无人机相机实时画面
- **控制面板**：右侧浮动面板，包含所有控制功能

### Demo 文件说明

```
├── demo.html                # 主演示页面
├── js/
│   └── app.js               # 前端逻辑和 WebSocket 客户端
└── asset/                   # 3D 模型资源
    ├── agent/
    │   └── drone.glb        # 无人机模型
    └── target/
        ├── oil.glb          # 油罐车模型
        └── toyo.glb         # 丰田车模型
```

## 配置

`track_server.py` 中的关键参数：

```python
# 目标检测类别（VisDrone 数据集）
TARGET_CLASSES = [3]  # 3 = 汽车

# DeepOCSORT 跟踪器参数
tracker = DeepOcSort(
    reid_weights='osnet_x0_25_msmt17.pt',
    device=device,              # 自动检测 CUDA
    half=use_half,              # GPU 上启用半精度
    delta_t=3,                  # 时间增量
    inertia=0.2,                # 惯性权重
    w_association_emb=0.5,      # ReID 特征权重
    alpha_fixed_emb=0.95,       # ReID 特征平滑系数
    embedding_off=False,        # 启用 ReID 特征
    cmc_off=False,              # 启用相机运动补偿
    aw_off=False,               # 启用自适应权重
    det_thresh=0.2,             # 检测置信度阈值
    max_age=300,                # 最大丢失帧数（30秒 @ 10fps）
    min_hits=3,                 # 最小连续检测帧数
    iou_threshold=0.3,          # IOU 阈值
    asso_func='giou',           # 关联函数
)
```

## WebSocket 协议

### 客户端到服务器
- **图像帧**：Base64 编码的 JPEG 图像
- **控制消息**：JSON 格式
  ```json
  {"command": "select_target", "track_id": 1}
  {"command": "clear_selection"}
  ```

### 服务器到客户端
```json
{
  "type": "frame",
  "image": "base64_encoded_jpg",
  "detections": [
    {
      "track_id": 1,
      "class_id": 3,
      "class_name": "car",
      "confidence": 0.95,
      "bbox": [x1, y1, x2, y2],
      "is_selected": false
    }
  ],
  "selected_track_id": null
}
```

## 性能优化

### 检测过滤
- 最小尺寸阈值（10px）以消除误报
- 宽高比验证（0.1 到 10）以移除无效检测
- 坐标有效性检查（NaN/Infinity）

### 跟踪配置
- ReID 特征用于改进轨迹身份维护
- 相机运动补偿适用于移动相机场景
- 自适应权重调整实现鲁棒关联

### 可视化
- JPEG 压缩（质量 70）以高效传输
- 轨迹历史限制为最近 30 帧
- 颜色编码可视化以便于解释

## 项目结构

```
.
├── track_server.py          # 主 WebSocket 服务器
├── best.pt                  # YOLO 检测模型
├── osnet_x0_25_msmt17.pt    # DeepOCSORT 的 ReID 模型
├── requirements_boxmot.txt  # Python 依赖
├── demo.html                # 前端演示页面
├── js/
│   └── app.js               # 前端 WebSocket 客户端
├── asset/                   # 用于可视化的 3D 模型
│   ├── agent/
│   └── target/
├── input_tmp/               # 调试：输入帧
└── detect_tmp/              # 调试：处理后的帧
```

## 应用场景

- **无人机监控**：实时车辆跟踪用于安全防护
- **交通监控**：实时计数和跟踪车辆
- **自主导航**：障碍物检测和跟踪
- **研究平台**：跟踪算法评估的测试平台

## 未来增强

- 支持更多目标类别
- 多目标跟踪（超越车辆）
- 与 Hunyuan3D 的 3D 可视化集成
- 移动客户端应用
- 跨多架无人机的分布式跟踪

## 致谢

- **YOLO**：Ultralytics 团队
- **DeepOCSORT**：BoxMOT 框架
- **ReID 模型**：OSNet-x0.25-MSMT17
- **VisDrone 数据集**：用于训练和评估

## 许可证

详见 LICENSE 文件。

---

**项目仓库**：[https://github.com/Doormandd/Yolo-DeepSORT-Hunyuan3D](https://github.com/Doormandd/Yolo-DeepSORT-Hunyuan3D)

**日期**：2025年10月12日

