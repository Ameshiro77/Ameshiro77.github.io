---
uuid: 8d9285f0-27e8-11ee-b8cf-a9fadab1cec0
title: MARL周报(3)
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: true
categories:
  - MARL周报
abbrlink: ea484025
date: 2023-07-22 01:03:45
updated:
description:
img:
top_img:
password:
summary:
tags:
copyright:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:
---

​		本周学习了贝尔曼最优和蒙特卡洛。前者是model-based，后者是model-free的，是基于统计数据的。蒙特卡洛的笔记暂时没写，贝尔曼最优方程的求解见[强化学习(三):贝尔曼最优方程(BOE) | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/70521b50.html).

​		另，今天早上开完会之后，感觉老师说的很好，就是（像）我（在内的一些同学）有点被项目什么的束缚住，然后不知道要干什么。因为这个MARL计算引擎的话，确实相关资料甚少，而且上手也很难。像我之前做计算机视觉，项目代码全是我自己写的，感觉代码能有着热情上手，包括做机器学习相关的都是能上手的。但是呢，对于这个MARL计算平台来说，真的感觉**代码上手都很困难**。

​		我一开始的研究热情点在于（多/单智能体）强化学习在游戏领域的应用。这应该包括两方面：**一个是支撑起强化学习的平台，一个是相关的算法**（也可以加上模拟器的使用，比如unity）。这里有一个问题：现有的大规模多智能体强化学习平台是否可以开箱即用，我的调研重点比较侧重平台本身的架构是否有失偏额。下一周我打算：1.继续基础知识学习 2.尝试一些现有的强化学习用于游戏的项目，并且实现。如果时间允许（因为要复习408，准备复试），去调研一下相关MARL算法（比如maddpg，q-mix什么的）

​		本周论文调研方面，寻找到了另一个由上交团队开发的MARL平台，文章地址为[上海交大开源训练框架，支持大规模基于种群多智能体强化学习训练__财经头条 (sina.com.cn)](https://t.cj.sina.com.cn/articles/view/3996876140/ee3b7d6c02700ujqo#:~:text=1 支持大规模基于种群的多智能体强化训练。 星际争霸 2，Dota2，王者荣耀等游戏上超越人类顶尖水平的 AI，都得益于大规模基于种群的多智能体强化学习训练，但现在没有一个开源通用的框架支持相关研究与应用。 针对这一场景，MALib 基于 Ray,Football），自动驾驶等场景的支持。 2 MALib 的采样吞吐量较现有多智能体强化学习框架大幅度提升。 ... 3 最全的多智能体强化学习算法的支持。 )；论文地址为 [[2106.07551\] MALib: A Parallel Framework for Population-based Multi-agent Reinforcement Learning (arxiv.org)](https://arxiv.org/abs/2106.07551)。论文阅读如下。

​		 首先是摘要。这个论文呢提出了一个叫PB-MARL的概念，这是指基于群体的（population-based ）多智能体强化学习，以及一系列嵌套在RL算法中的方法。我们知道之前有分布式的RL框架（比如ray？），然而PB-MARL进行的是并行化（parallel）训练，并且有着新的挑战。MALib是一种高效的应用于PB-MARL的计算框架（也就是说我们的项目要能用在PB-MARL；也就是城市规划中能不能划分为不同群体，实际上我感觉NMMO也是这样的，因为我回顾NMMO的论文也是提到了不同群体的异构策略），由三部分组成：**1.一个集中式任务调度模型**；**2.一种编程架构**（叫Actor-Evaluator-Learner），实现了训练和采样的高并行性；**3.训练范式（用的单词叫paradigm）更高级抽象**，能够实现高效代码复用，以及在分布式计算范式上灵活部署。最后总结说，MALib在单台机器上比RLlib快五倍，多智能体训练任务效率很高。

​		然后是一个introduction。PB-MARL算法把深度强化学习（DRL）和动态群体选择方法结合起来，不断生成先进的策略。但是嘞，多智能体群体有内在的动态特性，所用算法都具有复杂的嵌套结构，且对数据需求非常大，所以就需要一个灵活的能扩展的训练框架来支撑。PB-MARL的许多算法中，子任务执行高度异构，底层策略组合在智能体之间不同。总之呢论文就是说PB-MARL必须依赖于分布式计算，以实现高效率。

​		然后呢，现在现有的训练框架大多设计用单智能体RL。这些训练方案呢可以独立地用于MARL，但是显然MARL很多训练要求非独立进行，因为智能体之间交互性有时是很强的。论文总结了MARL分布式框架有两种主要要素：一个是高效的控制机制，一个是训练模式的高度抽象，简化实现并提供统一训练标准。性能方面，有两种性能：**系统性能和算法性能**。系统性能通过工作结点数量、采样效率和吞吐量来比较，后者就与基线算法比较。

​		malib是基于ray构建的，我们还是只能linux下跑。，实际上跑了一下论文的样例，但是我虚拟机memory太少，跑了500个epoch直接空间不够了：

![image-20230722110105993](https://s2.loli.net/2023/07/22/7jeabxsGMpinB1Q.png)

