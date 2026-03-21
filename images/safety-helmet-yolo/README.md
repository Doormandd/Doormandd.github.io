# Safety Helmet YOLO 博客图片资源说明

此目录包含用于 Safety Helmet YOLO 博客文章的图片资源。

## 图片列表及用途

### hero-image.jpg
- 用途：文章的主要展示图片
- 尺寸：1200x630px（推荐）
- 内容建议：安全帽检测的可视化效果，最好包含多个检测结果

### dataset-overview.jpg
- 用途：数据集概览图
- 尺寸：800x600px（推荐）
- 内容建议：展示数据集中不同场景的安全帽标注示例

### training-curves.jpg
- 用途：模型训练曲线图
- 尺寸：800x600px（推荐）
- 内容建议：训练损失和验证指标的变化曲线

### confusion-matrix.jpg
- 用途：混淆矩阵分析图
- 尺寸：600x600px（推荐）
- 内容建议：模型在测试集上的分类性能可视化

### detection-results.jpg
- 用途：检测结果示例图
- 尺寸：800x600px（推荐）
- 内容建议：不同场景下的安全帽检测结果展示

## 图片获取方法

由于这是一个纯数据集项目（没有实际训练的模型），有以下几种获取图片的方式：

1. **使用实际数据集图片**：
   - 从 SafetyHelmet_YOLO/val/images/ 目录中选择代表性图片
   - 使用标注工具在图片上绘制检测框
   - 添加适当的标签和说明

2. **使用模型训练结果**：
   - 训练实际的 YOLO 模型
   - 从训练过程中保存的曲线图和混淆矩阵
   - 使用训练好的模型生成检测结果

3. **创建概念图**：
   - 使用图像编辑工具创建示意图
   - 展示安全帽检测的概念和应用场景
   - 保持与项目主题一致

## 图片优化建议

- 使用 WebP 格式以提高加载速度
- 压缩图片以减少文件大小
- 确保图片在不同设备上的显示效果
- 添加适当的 alt 文本以提高可访问性

## 创建训练可视化

如果需要创建真实的训练可视化，可以使用以下代码：

```python
# 生成训练曲线示例代码
import matplotlib.pyplot as plt
import numpy as np

# 模拟训练数据
epochs = np.arange(1, 101)
train_loss = 2.5 * np.exp(-epochs/20) + 0.1 + np.random.normal(0, 0.05, 100)
val_loss = 2.8 * np.exp(-epochs/25) + 0.15 + np.random.normal(0, 0.08, 100)
val_map = 0.95 - 0.8 * np.exp(-epochs/30) + np.random.normal(0, 0.02, 100)

# 创建图表
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(epochs, train_loss, label='Train Loss')
plt.plot(epochs, val_loss, label='Val Loss')
plt.title('Training Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(epochs, val_map, label='mAP@0.5', color='green')
plt.title('Validation mAP')
plt.xlabel('Epoch')
plt.ylabel('mAP@0.5')
plt.legend()

plt.tight_layout()
plt.savefig('training-curves.jpg', dpi=300, bbox_inches='tight')
```

## 备注

这些图片占位符应该在获得实际图片后替换。如果无法获得真实的项目图片，可以考虑：

1. 使用免费的安全帽相关图片（需注意版权）
2. 创建简单的示意图来解释概念
3. 从 YOLO 官方文档中获取类似的示例图片

最终的文章中，暂时注释掉图片引用，等实际图片准备就绪后再启用。