# Andrew Ng: Agent Workflows and Four Main Design Patterns


In this sharing session, Professor Andrew Ng introduced the development trends of Agents and four main Agent design patterns. These design patterns represent significant progress in the field of artificial intelligence and will dramatically expand the capabilities of AI.

<!--more-->

## Introduction

Andrew Ng shared his insights about Agent trends at the Sequoia China AI event. He pointed out that unlike the traditional way of using LLMs, the Agent workflow is more iterative and conversational. This means AI is no longer simply outputting answers in one go, but can think, reflect, revise, and gradually improve results.

## Four Main Agent Design Patterns

Andrew Ng introduced four key Agent design patterns:

### 1. Reflection

![](/images/agent-workflow/01-andrew-ng.jpg)

Let the Agent leverage and optimize its own generated output. This is one of the **most important design patterns**. LLMs can review their output, critique it, and then modify it.

**Real-world impact**: By having LLMs think→generate→critique→revise in a loop, output quality can be significantly improved. Even using older models, the reflection pattern can achieve performance close to the latest models.

**Related Research**:
- Self-Refine: Towards Reflexive Language Models
- Reflexion: Language Agents with Verbal Reinforcement Learning
- OpenAI's o1 series has built-in this capability

### 2. Tool Use

![](/images/agent-workflow/02-four-design-patterns.jpg)

LLMs generate code and call APIs to perform actual operations. This enables AI to extend its capability boundaries and perform complex tasks.

**Typical Applications**:
- Web search and information analysis
- Image processing and object detection
- Calling external APIs to complete tasks

**Evolution**: Early tool use focused primarily on computer vision because LLMs couldn't understand images. Now with multimodal models like GPT-4, tool use is more widespread and powerful.

### 3. Planning

![](/images/agent-workflow/06-planning-example.jpg)

Let the Agent handle complex tasks and execute according to a plan. Agents can break down large tasks into multiple steps and complete them gradually.

**Example**: Generate an image where a girl is reading a book, with the same pose as the boy in example.jpg, and describe the new image with voice. The Agent needs to:
1. Determine the boy's pose
2. Find the correct pose model
3. Synthesize a girl's image
4. Use image detection
5. Use text-to-speech

**Characteristics**: While not always reliable, when it works, the effect is amazing. When it fails, the Agent can try other approaches with self-healing capabilities.

### 4. Multi-Agent Collaboration

![](/images/agent-workflow/07-multiagent-collaboration.jpg)

Multiple Agents collaborate by playing different roles to complete tasks together. This simulates how real teams work.

**Performance Improvement** (Du et al., 2023):
| Task | Single Agent | Multi-Agent Collaboration |
|------|-------------|-------------------------|
| Biographies | 66.0% | 73.8% |
| MMLU | 63.9% | 71.1% |
| Chess move | 29.3% | 45.2% |

**Real-world Application**: The ChatDev project simulates a software company with Agents playing roles as CEO, software engineer, product manager, and tester. They can collaboratively develop complex software programs.

## Key Insights

### 1. Performance Beyond the Model Itself

**Surprising Discovery**: GPT-3.5 using an agentic workflow can outperform zero-shot GPT-4 on some tasks.

**Coding Benchmark Test (HumanEval)**:
- GPT-3.5 (zero-shot): 48% accuracy
- GPT-4 (zero-shot): 67.7% accuracy
- **GPT-3.5 (agentic workflow): >67.7% accuracy**

### 2. Need to Change Usage Habits

**From Instant Feedback to Patient Waiting**:
- Traditional web search: Expect response within 30 minutes
- Agentic workflow: May take hours or even longer

**Advice**: Learn to delegate tasks to AI agents and wait patiently. Don't demand instant feedback like you would from humans.

### 3. Importance of Fast Token Generation

**Key Conclusion**: Fast token generation is very important. Even on lower-quality LLMs, generating more tokens can achieve results comparable to fewer tokens from higher-quality LLMs.

## Future Outlook

### Summary

![](/images/agent-workflow/08-conclusion.jpg)

Andrew Ng's four core points:

1. **Dramatic Expansion of Tasks**: Because of agentic workflows, the tasks AI can complete will expand dramatically in the coming years
2. **Learn to Delegate**: We need to get used to delegating tasks to AI agents and patiently waiting for responses
3. **Speed Matters**: Fast token generation; even generating more tokens from a lower-quality LLM can give good results
4. **No Need to Wait for New Models**: If you're looking forward to GPT-5/Claude 4/Gemini 2.0, you might already be able to get similar performance with agentic reasoning on earlier models

### The Journey to AGI

Andrew Ng frankly admits that the road to AGI (Artificial General Intelligence) feels more like a **journey than a destination**. But these four Agent workflows may help us take a big step forward on this long journey.

**Technical Reality**: These design patterns don't always work perfectly. Sometimes they fail, sometimes they're amazing. But the technology is constantly improving, and each improvement makes AI more powerful.

## Recommended Reading

### Academic Papers

- **Gorilla**: Large Language Model Connected with Massive APIs, Patil et al. (2023)
- **MM-REACT**: Prompting ChatGPT for Multimodal Reasoning and Action, Yang et al. (2023)
- **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models**, Wei et al. (2022)
- **HuggingGPT**: Solving AI Tasks with ChatGPT and its Friends in Hugging Face, Shen et al. (2023)
- **Communicative Agents for Software Development**, Qian et al. (2023)
- **AutoGen**: Enabling Next-Gen LLM Applications via Multi-Agent Conversation, Wu et al. (2023)

### Open Source Projects

- **ChatDev**: Multi-agent system for software development
- **OpenAI o1**: Built-in reflection capability
- Various Agent frameworks supporting tool use and planning

## Resource Download

📄 **[Download Complete PDF Version](/files/agent-workflow-andrew-ng.pdf)**

The PDF contains the complete presentation content, all slides, and example code, suitable for in-depth study and sharing.

---

**Special Thanks**: Joaquin Dominguez and John Santerre for help with analysis.

**Author**: Andrew Ng

**Sharing Date**: February 1, 2025

**Tags**: #AI #Agent #AndrewNg #LLM #ArtificialIntelligence #Workflow
