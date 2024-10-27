---
uuid: cd54dbb0-79a5-11ef-97b9-0ba58f342fa8
title: '论文阅读:促进DRL，生成式扩散模型在网络优化的应用'
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
abbrlink: c3cb86a7
date: 2024-09-25 20:17:29
updated:
description:
img:
top_img:
password:
summary:
tags:
  - 扩散模型
  - 生成式AI
  - 论文阅读
categories:
  - AI无线通信
copyright:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:
---

论文地址：[[2308.05384\] Enhancing Deep Reinforcement Learning: A Tutorial on Generative Diffusion Models in Network Optimization (arxiv.org)](https://arxiv.org/abs/2308.05384#:~:text=Generative Diffusion Models (GDMs) have)

# 摘要

​	生成式扩散模型(GDM)作为代表性GAI，有很强的学习数据分布、生成高质量样本的能力，使得这种模型在图像生成、强化学习等领域很有效。本文提供了**GDM在网络优化任务中**的综合教程，详细说明了如何利用GDM解决网络中固有的优化问题。本文介绍了一系列案例研究，包括**与深度强化学习（DRL）、激励机制设计、语义通信（SemCom）、车联网（IoV）网络等的整合**。

# 简介

​	未来的智能网络，如摘要最后所述，其特点是高维配置、非线性关系和复杂决策过程。这些问题表现出复杂的动态性，对先前和当前状态以及环境有显著的依赖性，导致高维和多峰状态分布。**在这种情况下，GDMs能够捕捉这种高维和复杂的结构，并有效地处理众多决策过程和优化问题**。

​	GDMs在优化中的作用可以分为增强'决策制定'和'深度强化学习'。例如在[论文阅读:离线强化学习中的扩散策略 | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/1c6e6ef6.html)中，GDM就被用来表示策略，捕捉多模态动作分布。本文主要为网络优化领域提供了一个关于GDMs的全面介绍，并通过案例研究和对未来研究方向的讨论，探索GDMs在智能网络优化中的应用。

​	P.S. 在机器人动作控制中，也用到了diffusion policy，如：[[2303.04137\] Diffusion Policy: Visuomotor Policy Learning via Action Diffusion (arxiv.org)](https://arxiv.org/abs/2303.04137#:~:text=Diffusion Policy represents a robot's)；这些方法提出，DM可以适用于多模态动作分布、可以解决高维输出空间、训练更稳定。

# 在网络优化中使用GDM的动机

​	首先，GDM适用于有/没有expert dataset的动态网络优化。与GDM在图像或文本领域的传统应用不同，**网络优化通常没有适合离线训练的大型数据集**。GDM的**逆向扩散过程**可以被有效利用。具体来说，与GAN中所示的标准损失函数不同（GAN主要训练网络使得逼近真实数据分布），去噪网络**可以被训练来最大化最终生成解的值**。在网络优化中，**值可以是性能指标，如总速率、延迟或能效**。通过在网络环境中执行生成的解决方案，然后根据收到的反馈调整网络参数，可以实现这一训练过程。此外，当可以访问专家数据集时，可以进行调整以最小化专家和生成解之间的损失。

​	其次，GDM可以轻松地将**条件信息**纳入去噪过程。在智能网络中，最优解，例如功率分配方案和激励机制设计，**通常随着动态无线环境的变化而变化**。因此，**无线环境信息**，如路径损耗和小尺度衰落信道参数，可以用作去噪过程中的条件信息。经过充分的训练后，去噪网络应该能够在任何动态无线环境条件下生成最优解。

​	此外，**GDM与DRL**在智能网络优化中的关系不仅仅是替代或竞争，而是相互补充增强。具体来说，在GDM中训练去噪网络，该网络由外部环境的反馈指导，因此**Q网络等技术可以促进去噪网络的更有效训练**。此外，GDM可以替代DRL算法中的**actor网络**，其中行动被视为去噪过程的输出。见：[论文阅读:离线强化学习中的扩散策略 | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/1c6e6ef6.html)

## 示例：无线通信网络优化

### 问题建模

​	考虑一个无线通信网络，其中基站使用总功率$P_T$通过多个正交信道为一组用户提供服务。我们的目标是通过在信道之间最优地分配功率来最大化所有信道的总速率。设$g_n$表示第n个信道的信道增益，$p_n$表示分配给该信道的功率。所有M个正交信道的总速率由它们的各个速率之和表示：
$$
\sum_{m=1}^M\log_2\left(1+g_mp_m/N_0\right)
$$
​	N0是噪声等级，设为1.问题是找到功率分配方案${P_1...P_M}$，使得在功率预算和非负的约束下最大化容量C:
$$
\begin{array}{cc}\max_{\{p_1,\dots,p_M\}}&C=\sum\limits_{m=1}^M\log_2{(1+g_mp_m)}\\\mathrm{s.t.,}&\left\{\begin{array}{c}p_m\geq0,\forall m,\\\sum\limits_{m=1}^Mp_m\leq P_T.\end{array}\right.\end{array}
$$
​		由于无线环境的动态性，信道增益的值$g_i$在一定范围内波动。信道条件的变化会显著影响分配方案。GDM 可以很容易地将无线环境作为去噪过程中的条件，利用它们强大的生成能力来生成最优解。

### 用GDM解决

​	首先定义解空间是M维的；我们的训练目标是最大化GDM生成的功率分配实现的总和速率。基于是否有专家数据集，训练分为两种：

​	1.如果没有数据集，则引入solution evaluation网络Q用来表示分配后的预期目标函数。这里的Q网络是用来指导GDM进行训练的，最优的$\epsilon_{\theta}$对应的扩散网络，生成的分配能产出最高的Q值期望，即：
$$
\arg\min\mathcal{L}_{\boldsymbol{\epsilon}}(\theta)=-\mathbb{E}_{\boldsymbol{p}_0\sim\boldsymbol{\epsilon}_\theta}\left[Q_\upsilon\left(g,p_0\right)\right]
$$
​	为了训练Q网络，我们要最小化预测Q和真实Q直接的差值，即最小化：
$$
\arg\min_{Q_{v}}\mathcal{L}_{Q}(v)=\mathbb{E}_{\boldsymbol{p}_{0}\sim\pi_{\theta}}\left[\left\|r(\boldsymbol{g},p_{0})-Q_{v}\left(\boldsymbol{g},p_{0}\right)\right\|^{2}\right]
$$
​		在这里，r表示环境g中执行方案p时的目标函数值。

​	2.有专家数据集时就比较简单了，最小化与专家数据集之间的差即可。

![image:算法框架](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20240925165927331.png)

​	 在实验中，作者给出了一些观点：GDM优于传统DRL方法，可以快速收敛和取得高性能。其次，GDM 中与学习相关的参数，例如**学习率和去噪步骤，促进了探索和开发之间的新平衡**。GDM 即使在没有专家数据集的情况下，也显示出鲁棒性和适应性。这种鲁棒性在现实世界的应用程序中尤其重要，因为**条件可能是不可预测的，数据可能不完美或不完整**。

# GDM与DRL的结合

​	在无线通信环境下，DRL可以不需要知道具体的网络信息而给出最优决策；且支持自主决策，减少通信开销，增强网络鲁棒性。**但是，DRL还有以下缺点，但可以通过GDM来缓解**：

​	1.采样效率低。DRL 通常需要与环境的大量交互来有效地学习，这在计算上可能很昂贵且耗时。GDM具有较强的对复杂数据分布建模能力，可以减少所需的样本数量。

​	2.对超参数敏感。DRL算法的性能可能会受到超参数的显著影响，需要对不同的任务进行细致调优。GDM具有灵活的结构和对各种数据分布的适应性，可以提供鲁棒性更高的解决方案。

​	3.对复杂环境建模困难。DRL算法可能难以处理具有复杂和高维**状态和动作空间**的特征的环境。通过准确地捕获底层数据分布，GDM可以提供更有效的表示。

​	4.不稳定和收敛速度慢。DRL算法可能会受到不稳定和收敛速度慢的影响。GDM的独特结构涉及扩散过程，可能提供更稳定和有效的学习过程。

​	而GDM的下述优势可以缓解DRL的缺点：

​	1.表达能力强。GDM可以对复杂的数据分布进行建模，使得它们非常适合表示DRL中的策略（比如动态交通场景，策略需要适应各种交通状况、车辆行为）。

​	2.样本质量。GDM可以生成高质量样本，那么在DRL背景下，这可以转化为高质量动作或策略的生成，例如在一些网络资源分配任务中。

​	3.灵活性。GDM可以对不同行为进行建模，这在智能体需要适应各种情况任务时很有用。例如网络管理任务，网路可能需要适应各种用户需求等等。

​	但GDM也有缺点，比如计算复杂度会高，且对于那些噪声水平很高、分布很不规则、异常值很多的数据分布（比如现实世界网络流量数据），GDM难以建模。

## 案例：ASP分配

[论文阅读-基于扩散模型的强化学习应用于边缘AIGC服务（的调度） | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/61bbf8ca.html)

## 案例：语义通信+最优合同生成

[论文阅读:用于信息共享的AI生成激励机制和全双工语义通信 | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/6f19da25.html)

# GDM与车联网

## 用途

​	车联网（IoV）将移动车辆转变为信息收集节点；对于IoV网络来说，目标是提高车辆的整体智能化水平，以及提高安全性、燃油效率和驾驶体验。车联网中GDM主要有以下作用：

​	1.**恢复车辆发送的图像**：在IoV网络中，车辆通常传输图像以传达其环境信息，以实现安全驾驶。然而，这些图像可能因传输错误、噪声或干扰而失真。GDM凭借其生成高质量图像的能力，可以被用来恢复这些传输图像的原始质量。具体来说，车辆可以提取图像语义信息，即作为发射端的提示，并在接收端使用GDM进行恢复，以减少IoV中的传输数据和通信延迟。

​	2.**基于GDM的优化**：GDM迭代框架适用于IoV网络优化任务，包括路径规划和资源分配。例如，在路径规划中，GDM 从随机路径开始，根据旅行时间和能耗等性能标准进行迭代细化。该模型使用这些指标的梯度来引导路径更新朝着最优或接近最优解方向发展。

## 案例：GenAI驱动的IoV网络

​	在3GPP V2X标准下，考虑一个由GenAI驱动的IoV，其中包含多个车对车（V2V）链路。我们的目标是确保我们所考虑的网络中可靠、实时的信息传输。

![image-涉及语义信息提取、图像骨架提取、无线传输步骤、图像生成与重建](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20240926170451972.png)

​	我们将传输速率和图像相似度作为性能指标，然后将它们组合成一个统一的QoE并用作优化目标。于是，在传输功率预算和每辆车成功传输概率约束下，提出了一个优化问题，使系统QoE最大化，其中信道选择策略、每辆车的传输功率和插入skeleton的扩散步骤共同优化。
$$
\begin{aligned}
\operatorname*{max}_{\{P_{v},d_{v},c_{v}\}}& \sum_{v\in V}\mathrm{QoE}(v) \\
\mathrm{s.t.}& \sum_{v\in V}p_{v}\leq P_{\max},(\mathrm{Power~Budget}) \\
&\mathrm{Pr}(v)\geq\mathrm{Pr}_{\mathrm{min}},(\mathrm{Transmission~Constraint}) \\
&c_{v}\in C,(\mathrm{Channel~Selection~Constraint}) \\
&d_{v}\in\mathbb{N}^{+},\mathrm{(Diffusion~Steps~Constraint)} \\
&\forall v\in V.
\end{aligned}
$$
​	**GDM如何使用**：作者团队提出了一种基于GDM的信道选择和功率分配。对于制定的问题，提出了一种基于GDM的DDPG方法（**GDM主要体现在重建和规划**和,DDPG主要是指导扩散模型更新参数）

​	方法有两个GDM。首先，一个GDM在车辆网络的接收器处**重建接收到的图像**。利用多模态技术，我们使用对比语言-图像预训练（CLIP）框架，在扩散过程中结合文本和图像信息进行图像重建，这是一个包含图像生成的去噪步骤和传输功率值的任务。其次，另一个GDM负责**优化:去噪步骤的数量、信道选择策略和传输功率值**。

# 其他：信道估计、纠错编码、信道去噪

[论文阅读-基于扩散模型先验生成器的低复杂度MIMO信道估计 | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/6a56c53.html)
