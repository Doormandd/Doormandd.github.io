# YOLOv8 Phone Holder Detection Project


In this article, I'll share a complete object detection project using YOLOv8 - Phone Holder Detection. This project covers everything from dataset preparation and model training to inference deployment, demonstrating practical application of YOLOv8.

<!--more-->

## Project Background

### Why Phone Holder Detection?

Phone holders are common everyday items, but automated detection has significant applications in smart warehousing, item classification, and more. By training a specialized model to detect phone holders, we can:

- Automate inventory management
- Enable smart item sorting
- Implement visual quality inspection
- Apply security monitoring

### Why YOLOv8?

YOLOv8 (You Only Look Once version 8) by Ultralytics is the latest object detection architecture with advantages over previous versions:

- **Best balance of speed and accuracy**: Provides real-time inference speed while maintaining high accuracy
- **Easy to use**: Unified CLI and clean API
- **Model diversity**: Offers multiple sizes: nano, small, medium, large, extra-large
- **Active community**: Rich documentation and continuously updated ecosystem

---

## Dataset Preparation

### Dataset Statistics

I built a dataset with 58 images using Label Studio professional annotation tool:

| Dataset Split | Image Count | Percentage |
|---------------|--------------|------------|
| Training set | 44 images | 75.86% |
| Validation set | 7 images | 12.07% |
| Test set | 7 images | 12.07% |

### Annotation Process

1. **Data Collection**: Captured phone holder images from various angles and lighting conditions
2. **Label Studio Annotation**:
   - Created "phone holder" category
   - Drew bounding boxes
   - Exported YOLO format annotation files
3. **Dataset Split**: Partitioned data into train/validation/test sets with 75%/15%/10% ratio

### Dataset Structure

```
data/
├── classes.txt              # Class definitions
├── phoneholder.yaml         # Dataset configuration
├── images/               # Image files
│   ├── train/           # 44 images
│   ├── val/             # 7 images
│   └── test/           # 7 images
└── labels/               # YOLO format annotations
    ├── train/
    ├── val/
    └── test/
```

---

## Model Training

### Environment Setup

```python
# Install YOLOv8
pip install ultralytics
```

### Training Command

```bash
yolo detect train data=data/phoneholder.yaml model=yolov8n.pt epochs=32 imgsz=640
```

### Training Parameters

- `data`: Dataset configuration file path
- `model`: Pre-trained YOLOv8n (nano) model
- `epochs`: 32 training epochs
- `imgsz`: Input image size 640x640

---

## Training Results

### Performance Metrics

After 32 epochs of training, the model achieved excellent performance:

| Metric | Value | Description |
|--------|-------|-------------|
| **Precision** | 99.975% | Ratio of correctly detected positive samples among all detected positives |
| **Recall** | 100% | Ratio of correctly detected positive samples among all actual positives |
| **mAP@0.5** | 83.348% | Mean average precision at IoU threshold 0.5 |
| **mAP@0.5:0.95** | 78.834% | Mean average precision at IoU thresholds 0.5 to 0.95 |

![](/images/yolov8-project/01-training-curves.png)

### Confusion Matrix Analysis

![](/images/yolov8-project/02-confusion-matrix.png)

The confusion matrix shows model performance on the validation set with almost no false positives or false negatives.

### Training Batch Visualization

![](/images/yolov8-project/04-training-batch.jpg)

Batch visualization during training shows feature representations learned by the model.

---

## Model Characteristics

### 1. High Accuracy Performance

- **99.975% precision**: Almost zero false positives
- **100% recall**: No false negatives
- This is excellent performance for single-class object detection

### 2. Lightweight Model

- **best.pt file size**: Only 6.0MB
- Suitable for edge device deployment (Raspberry Pi, Jetson Nano, etc.)
- Fast inference, suitable for real-time applications

### 3. Easy Integration

```python
from ultralytics import YOLO

# Load model
model = YOLO('best.pt')

# Inference
results = model('image.jpg')

# Get results
for r in results:
    boxes = r.boxes
    for box in boxes:
        print(f"Class: {int(box.cls[0])}, Conf: {float(box.conf[0]):.2f}")
```

---

## Usage

### Quick Start

```bash
# 1. Clone the project
git clone https://github.com/Doormandd/YOLOv8-Phone-Holder-Detection.git
cd YOLOv8-Phone-Holder-Detection

# 2. Install dependencies
pip install ultralytics

# 3. Run inference
yolo predict model=best.pt source=test_image.jpg

# 4. Use GPU acceleration
yolo predict model=best.pt source=test_image.jpg device=0
```

### Python API Usage

```python
from ultralytics import YOLO
import cv2

# Load model
model = YOLO('best.pt')

# Read image
image = cv2.imread('test_image.jpg')

# Perform inference
results = model(image)

# Process results
for result in results:
    boxes = result.boxes
    
    # Draw detection boxes on image
    for box in boxes:
        x1, y1, x2, y2 = box.xyxy[0]
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        
        # Draw
        cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
        cv2.putText(image, f"Phone Holder {conf:.2f}", 
                   (int(x1), int(y1)-10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Show results
cv2.imshow('Detection', image)
cv2.waitKey(0)
```

---

## Project Highlights

### 1. High-Quality Dataset

- Professional annotation tool Label Studio
- Accurate bounding box annotations
- Diverse shooting scenarios

### 2. Excellent Training Results

- Precision nearly 100%
- Perfect 100% recall
- Good model convergence

### 3. Practical Utility

- Small model (6.0MB)
- Fast inference speed
- Easy integration into existing systems

### 4. Complete Documentation

- Detailed README documentation
- Bilingual (Chinese/English) instructions
- Complete code examples

---

## Future Improvements

- [ ] **Expand dataset**: Add more scenes and different angle images
- [ ] **Test different models**: Compare YOLOv8n/s/m/l/x performance
- [ ] **Model optimization**: Try quantization, pruning and other compression techniques
- [ ] **Data augmentation**: Add rotation, scaling, color jitter and other augmentation strategies
- [ ] **Real-time application**: Integrate into video stream real-time detection system

---

## GitHub Repository

Complete project code, dataset configuration, training results, and detailed documentation have been uploaded to GitHub:

🔗 **[YOLOv8-Phone-Holder-Detection](https://github.com/Doormandd/YOLOv8-Phone-Holder-Detection)**

### Project Includes

- ✅ Complete README documentation (bilingual)
- ✅ Trained model file (best.pt)
- ✅ Dataset configuration and annotation files
- ✅ Training results and visualization charts
- ✅ Detailed usage instructions and code examples

---

## Conclusion

Through this project, I successfully trained a high-precision phone holder detection model. YOLOv8's ease of use and powerful performance make object detection tasks simple and efficient. I hope this project helps developers learning computer vision and object detection.

If you have any questions or suggestions about the project, feel free to open an Issue or Pull Request on GitHub!

---

**Related Tags**: #YOLOv8 #ObjectDetection #DeepLearning #ComputerVision #ProjectSharing
