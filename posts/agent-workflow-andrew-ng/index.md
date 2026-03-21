# 吴恩达分享：Agent Workflow与四种主流设计模式


在本次分享中，吴恩达教授介绍了Agent（智能代理）的发展趋势，以及四种主要的Agent设计模式。这些设计模式代表了人工智能领域的重要进展，将大幅扩展AI的能力边界。

<!--more-->

## 背景介绍

吴恩达教授在中国红杉AI活动上分享了关于Agent的前沿洞察。他指出，与传统使用LLM（大语言模型）的方式不同，Agent的工作流程更加迭代和对话式。这意味着AI不再是简单的一次性输出答案，而是能够思考、反思、修订并逐步完善结果。

## 四种主要的Agent设计模式

吴恩达介绍了四种关键的Agent设计模式：

### 1. 反思（Reflection）

![](/images/agent-workflow/01-andrew-ng.jpg)

让Agent利用并优化自己生成的输出。这是**最重要的设计模式**之一。LLM可以查看自己的输出，进行批判，然后修改。

**实际效果**：通过让LLM思考→生成→批判→修订的循环，可以显著提高输出质量。即使使用较旧的模型，通过反思模式也能达到接近最新模型的效果。

**相关研究**：
- Self-Refine: Towards Reflexive Language Models
- Reflexion: Language Agents with Verbal Reinforcement Learning
- OpenAI的o1系列模型已内置此功能

### 2. 工具使用（Tool use）

![](/images/agent-workflow/02-four-design-patterns.jpg)

LLM生成代码，调用API进行实际操作。这使得AI能够扩展其能力边界，执行复杂的任务。

**典型应用**：
- 网络搜索和信息分析
- 图像处理和对象检测
- 调用外部API完成任务

**发展历程**：早期工具使用主要集中在计算机视觉领域，因为当时的LLM无法理解图片。现在GPT-4等多模态模型的出现，让工具使用更加广泛和强大。

### 3. 规划（Planning）

![](/images/agent-workflow/06-planning-example.jpg)

让Agent处理复杂任务并按计划执行。Agent可以将大任务分解为多个步骤，逐步完成。

**示例**：生成一张图片，要求女孩在读书，姿势与示例图片中的男孩相同，并用语音描述图片。Agent需要：
1. 确定男孩的姿势
2. 找到正确的姿势模型
3. 合成女孩图片
4. 使用图像检测
5. 使用文本转语音

**特点**：虽然不总是可靠，但当它工作时效果惊人。失败时Agent可以尝试其他方法，具有自愈能力。

### 4. 多Agent协作（Multi-agent Collaboration）

![](/images/agent-workflow/07-multiagent-collaboration.jpg)

多个Agent扮演不同角色合作完成任务。这模拟了真实团队的工作方式。

**性能提升**（Du et al., 2023）：
| 任务 | 单个Agent | 多Agent协作 |
|------|-----------|-------------|
| Biographies | 66.0% | 73.8% |
| MMLU | 63.9% | 71.1% |
| Chess move | 29.3% | 45.2% |

**实际应用**：ChatDev项目模拟了软件公司，Agent分别扮演CEO、软件工程师、产品经理、测试员等角色，能够协作开发复杂的软件程序。

## 核心洞察

### 1. 性能超越模型本身

**令人惊讶的发现**：使用代理工作流的GPT-3.5，在某些任务上表现优于零样本的GPT-4。

**编码基准测试（HumanEval）**：
- GPT-3.5（零样本）：48%正确率
- GPT-4（零样本）：67.7%正确率
- **GPT-3.5（代理工作流）：>67.7%正确率**

### 2. 需要改变使用习惯

**从即时反馈到耐心等待**：
- 传统网络搜索：期望30分钟内得到响应
- Agent工作流：可能需要几小时甚至更长时间

**建议**：学会把任务委托给AI代理并耐心等待，不要像要求人类一样要求即时反馈。

### 3. 代币生成速度的重要性

**关键结论**：快速代币生成非常重要。即使在较低质量的LLM上，生成更多代币可以获得与高质量LLM较少代币相当的结果。

## 未来展望

### 总结

![](/images/agent-workflow/08-conclusion.jpg)

吴恩达的四个核心观点：

1. **任务范围大幅扩展**：因为代理工作流，AI能够完成的任务在未来几年将大幅扩展
2. **学会委托**：我们习惯于把任务委托给AI代理并耐心等待响应
3. **速度很重要**：快速代币生成，即使从较低质量的LLM生成更多代币也能得到好的结果
4. **无需等待新模型**：如果你正在等待GPT-5/Claude 4/Gemini 2.0，可能已经可以通过代理推理在早期模型上获得类似性能

### 通向AGI的旅程

吴恩达坦言，通往AGI（通用人工智能）的道路感觉更像是一个**旅程而不是一个目的地**。但这四种Agent工作流可能会帮助我们在漫长的旅途中向前迈出一大步。

**技术现实**：这些设计模式并不总是完美工作，有时失败，有时令人惊讶。但技术正在不断进步，每一次改进都让AI变得更加强大。

## 参考阅读

### 学术论文

- **Gorill**: Large Language Model Connected with Massive APIs, Patil et al. (2023)
- **MM-REACT**: Prompting ChatGPT for Multimodal Reasoning and Action, Yang et al. (2023)
- **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models**, Wei et al. (2022)
- **HuggingGPT**: Solving AI Tasks with ChatGPT and its Friends in Hugging Face, Shen et al. (2023)
- **Communicative Agents for Software Development**, Qian et al. (2023)
- **AutoGen**: Enabling Next-Gen LLM Applications via Multi-Agent Conversation, Wu et al. (2023)

### 开源项目

- **ChatDev**: Multi-agent system for software development
- **OpenAI o1**: Built-in reflection capability
- 各种Agent框架支持工具使用和规划

## 资源下载

📄 **[下载完整PDF版本](/files/agent-workflow-andrew-ng.pdf)**

PDF包含完整的演讲内容、所有幻灯片和示例代码，适合深入研究和分享。

---

**特别感谢**：Joaquin Dominguez和John Santerre对数据分析的帮助。

**作者**：Andrew Ng（吴恩达）

**分享日期**：2025年2月1日

**标签**：#AI #Agent #吴恩达 #LLM #人工智能 #工作流
