# YOLO+DeepSORT+Hunyuan3D Real-time Drone Object Tracking Project


## Project Overview

This project implements a real-time drone object tracking system that combines multiple state-of-the-art computer vision techniques. The system processes video frames from drones in real-time, detects vehicles using YOLO, tracks them across frames using DeepOCSORT (an improved version of DeepSORT), and visualizes results through a WebSocket-based interface.

## Key Features

### Real-time Object Detection
- **YOLO (You Only Look Once)** for fast and accurate object detection
- Specialized for vehicle detection (cars in VisDrone dataset)
- Configurable confidence threshold for optimal detection performance
- Efficient filtering of invalid detections based on size and aspect ratio

### Advanced Object Tracking
- **DeepOCSORT** tracking algorithm from BoxMOT framework
- ReID (Re-identification) features using OSNet-x0.25-MSMT17 model
- Camera motion compensation for improved tracking accuracy
- Adaptive weighting for robust track association
- Configurable parameters: max age, min hits, IOU threshold

### Real-time Communication
- **WebSocket server** for real-time frame processing
- Base64-encoded image transmission
- Bidirectional communication for target selection
- JSON-based protocol for control messages

### User Interface
- Interactive web interface (demo.html)
- Real-time visualization of tracking results
- Target selection capability
- Track history trails visualization
- Color-coded bounding boxes (green for normal, red for selected)

## Technical Architecture

```
Client (Web Browser)
    ↓ WebSocket (Base64 images)
Server (track_server.py)
    ↓ 1. Image Decoding
    ↓ 2. YOLO Detection
    ↓ 3. DeepOCSORT Tracking
    ↓ 4. Visualization
    ↓ WebSocket (JSON with annotated image)
Client (Display results)
```

## Installation

```bash
# Install dependencies
pip install -r requirements_boxmot.txt

# Download required models
# - best.pt (YOLO detection model)
# - osnet_x0_25_msmt17.pt (ReID model)
```

## Usage

### 1. Start WebSocket Server

```bash
# Start WebSocket server
python track_server.py

# The server runs on ws://localhost:8765
```

### 2. Open Demo Page

<div style="text-align: center; margin: 30px 0;">
  <a href="https://github.com/Doormandd/Yolo-DeepSORT-Hunyuan3D/blob/main/demo.html" target="_blank" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
    🚀 Launch Online Demo
  </a>
</div>

<div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
  <strong>💡 Tip:</strong> After clicking the button, please download or clone the project locally, then open <code>demo.html</code> in your browser to experience the complete 3D simulation and tracking demo.
</div>

Open `demo.html` in a web browser to see the complete 3D simulation and tracking demo.

## Demo Features Overview

### 3D Visualization System

This project includes a **Cesium-based** 3D visualization demo system with the following features:

#### Key Features

- **3D Earth Visualization**: Realistic 3D Earth and terrain rendering using Cesium
- **Vehicle and Drone Simulation**: Place and control vehicle and drone models in 3D scenes
- **Trajectory Planning**: Support for custom trajectory drawing and path planning
- **Real-time Object Tracking Integration**: Integrated with WebSocket server to display real-time tracking results

#### Control Panel Functions

1. **Model Management**
   - Load and manage 3D models (vehicles, drones)
   - Support for multiple vehicle models (Toyota, oil tanker, etc.)
   - Model preview and selection

2. **Trajectory Editing**
   - Draw custom trajectories on the 3D Earth
   - Edit and modify existing trajectories
   - Trajectory preview functionality

3. **Simulation Control**
   - Start/pause simulation
   - Control drone flight along trajectories
   - Real-time camera view switching

4. **Real-time Tracking**
   - Connect to WebSocket tracking server
   - Real-time display of detection results and bounding boxes
   - Select specific tracking targets
   - Track history visualization

#### Usage Workflow

1. **Prepare Environment**
   ```bash
   # Ensure tracking server is running
   python track_server.py
   ```

2. **Open Demo**
   - Open `demo.html` in a browser
   - System automatically loads 3D Earth and models

3. **Create Scene**
   - Click "Place Target" button to place vehicle models on Earth
   - Draw trajectory paths
   - Place drone Agents

4. **Start Tracking**
   - Click "Connect Tracking Server" button
   - System starts real-time frame transmission and processing
   - View detection results and tracking information

5. **Interactive Control**
   - Click detection boxes to select specific targets
   - Use mouse to control 3D view
   - Manage simulation state via control panel

#### Technical Implementation

- **Frontend Framework**: Cesium.js for 3D rendering
- **Communication Protocol**: WebSocket for real-time data transmission
- **Model Format**: GLB/GLTF 3D models
- **Camera Control**: Support for multi-view switching and free movement

#### Interface Overview

Demo includes two main views:
- **Main View**: 3D Earth and scene visualization
- **Preview View**: Real-time drone camera feed
- **Control Panel**: Right floating panel with all control functions

### Demo File Structure

```
├── demo.html                # Main demo page
├── js/
│   └── app.js               # Frontend logic and WebSocket client
└── asset/                   # 3D model resources
    ├── agent/
    │   └── drone.glb        # Drone model
    └── target/
        ├── oil.glb          # Oil tanker model
        └── toyo.glb         # Toyota car model
```

## Configuration

Key parameters in `track_server.py`:

```python
# Target detection classes (VisDrone dataset)
TARGET_CLASSES = [3]  # 3 = car

# DeepOCSORT tracker parameters
tracker = DeepOcSort(
    reid_weights='osnet_x0_25_msmt17.pt',
    device=device,              # Auto-detect CUDA
    half=use_half,              # Enable half precision on GPU
    delta_t=3,                  # Time delta
    inertia=0.2,                # Inertia weight
    w_association_emb=0.5,      # ReID feature weight
    alpha_fixed_emb=0.95,       # ReID feature smoothing
    embedding_off=False,        # Enable ReID features
    cmc_off=False,              # Enable camera motion compensation
    aw_off=False,               # Enable adaptive weighting
    det_thresh=0.2,             # Detection confidence threshold
    max_age=300,                # Max lost frames (30s @ 10fps)
    min_hits=3,                 # Min consecutive detections
    iou_threshold=0.3,          # IOU threshold
    asso_func='giou',           # Association function
)
```

## WebSocket Protocol

### Client to Server
- **Image frames**: Base64-encoded JPEG images
- **Control messages**: JSON format
  ```json
  {"command": "select_target", "track_id": 1}
  {"command": "clear_selection"}
  ```

### Server to Client
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

## Performance Optimization

### Detection Filtering
- Minimum size threshold (10px) to eliminate false positives
- Aspect ratio validation (0.1 to 10) to remove invalid detections
- Coordinate validity checks (NaN/Infinity)

### Tracking Configuration
- ReID features for improved track identity maintenance
- Camera motion compensation for moving camera scenarios
- Adaptive weight adjustment for robust association

### Visualization
- JPEG compression (quality 70) for efficient transmission
- Track history limited to last 30 frames
- Color-coded visualization for easy interpretation

## Project Structure

```
.
├── track_server.py          # Main WebSocket server
├── best.pt                  # YOLO detection model
├── osnet_x0_25_msmt17.pt    # ReID model for DeepOCSORT
├── requirements_boxmot.txt  # Python dependencies
├── demo.html                # Frontend demo page
├── js/
│   └── app.js               # Frontend WebSocket client
├── asset/                   # 3D models for visualization
│   ├── agent/
│   └── target/
├── input_tmp/               # Debug: input frames
└── detect_tmp/              # Debug: processed frames
```

## Applications

- **Drone surveillance**: Real-time vehicle tracking for security
- **Traffic monitoring**: Count and track vehicles in real-time
- **Autonomous navigation**: Obstacle detection and tracking
- **Research platform**: Testbed for tracking algorithm evaluation

## Future Enhancements

- Support for additional object classes
- Multi-object tracking (beyond vehicles)
- 3D visualization integration with Hunyuan3D
- Mobile client application
- Distributed tracking across multiple drones

## Acknowledgments

- **YOLO**: Ultralytics team
- **DeepOCSORT**: BoxMOT framework
- **ReID model**: OSNet-x0.25-MSMT17
- **VisDrone dataset**: For training and evaluation

## License

See LICENSE file for details.

---

**Project Repository**: [https://github.com/Doormandd/Yolo-DeepSORT-Hunyuan3D](https://github.com/Doormandd/Yolo-DeepSORT-Hunyuan3D)

**Date**: October 12, 2025

