---
uuid: 4e734310-865a-11ef-b854-cf1a26bc9ee7
title: '论文阅读:QECO-移动边缘计算(MCE)中基于DRL的面向QoE的计算卸载算法'
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
tags:
  - 强化学习
  - 边缘计算
  - 无线通信
  - 论文阅读
categories:
  - AI无线通信
abbrlink: 10dad796
date: 2024-10-08 00:19:49
updated:
description:
img:
top_img:
password:
summary:
copyright:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:
---

# 摘要

​	在移动边缘计算（MEC）领域，高效的计算任务卸载对于确保用户的体验质量（QoE）至关重要。挑战：处理动态和不确定的移动环境。本文深入探讨了MEC系统中的计算卸载问题，其中严格的任务处理**截止时间和能源限制**可能会对系统性能产生不利影响。本文将计算任务卸载问题表述为一个**马尔可夫决策过程（MDP）**，以**最大化每个用户的长期QoE**。我们提出了一种基于深度强化学习的分布式QoE导向的计算卸载（QECO）算法，该算法使移动设备能够在不需要了解其他设备所做的决策的情况下做出卸载决策。本文结果：能够完成14%更多的任务，并将任务延迟和能源消耗分别减少9%和6%；将平均QoE提高了37%。

# 简介

​		本文说，移动设备（MDs）技术虽然不断进步，但其有限的计算能力和电池容量可能导致任务丢失、处理延迟和整体较差的用户体验。通过将密集任务卸载到附近的边缘节点（ENs），可以增强计算能力、减少延迟和能源消耗，提高了用户的QoE。**主要挑战在于**：确定最优的卸载策略、调度任务、选择最适合的EN进行任务卸载、对延迟敏感等等。

​		而近期一些研究里，DRL被证明很有用，可以通过捕捉环境的动态性和学习实现长期目标的策略来确定最优的决策策略。作者先是列举了一些工作，然后说：QoE是一个随时间变化的性能度量，反映用户满意度，不仅受延迟影响，还受**能源消耗**的影响。作者指出，本文工作特点在于：尽管一些现有工作已经研究了延迟和能源消耗之间的权衡，但它们未能妥善解决用户需求和满足QoE要求，需要一种更全面的方法来解决实时场景中多个MDs和ENs的个体用户的动态需求。

​		故而，本文提出了一种基于DRL的分布式算法，深入研究了MEC系统中的计算任务卸载问题，其中**严格的任务处理截止时间和能源限制**可能会对系统性能产生不利影响。我们提出了一种分布式QoE导向的计算卸载（QECO）算法，利用DRL高效处理ENs处不确定负载下的任务卸载。该算法使MDs能够**利用仅本地观察到的信息**（如任务大小、队列详细信息、电池状态和ENs处的历史工作负载）做出卸载决策。

# 系统模型

​	定义MDs集合为$\mathcal{I}$，ENs集合为$\mathcal{J}$，定义时间为一序列的time slots $\mathcal{T}={1...T}$，每一项代表$\tau$秒的duration。每个MD有两个分开的FIFO queues；由调度器决定是本地计算或计算卸载。此外，假设每个EN都有I个对应于不同MD的FIFO队列。当每个任务到达EN，对应的队列就入队。 

![系统模型](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20241010145341046.png)

​		定义$z_i(t)$是t时间段的任务，其bit大小为$\lambda_i(t)$，从一个集合中随机取值，如果没有任务到达就指定为0。此外

## 通信模型

​	设$l^T_i(t)\in{T}$代表任务分配到EN或被drop的time slot，则任务在传输前需要在队列里等待的time slots数量为：
$$
\delta_i^{\mathrm{T}}(t)=\left[\max _{t^{\prime} \in\{0,1, \ldots, t-1\}} l_i^{\mathrm{T}}\left(t^{\prime}\right)-t+1\right]^{+}
$$
​		[]+表示max(0,·)。这个$l$也不是随便定义的，首先定义第i个MD到第j个EN之间的传输速率为$r$，$y_{i,j}$是一个{0,1}值，如果传输就是1否则是0，那么任务从i传到j的总时间需求就可以定义为：$D_i^{\mathrm{T}}(t)=\sum_{\mathcal{J}} y_{i, j}(t) \frac{\lambda_i(t)}{r_{i, j}(t) \tau}$；这样$l$就可以定义为：$l_i^{\mathrm{T}}(t)=\min \left\{t+\delta_i^{\mathrm{T}}(t)+\left\lceil D_i^{\mathrm{T}}(t)\right\rceil-1, t+\Delta_i(t)-1\right\}$。其中$\Delta$是任务的deadline。这一通信过程的能量损耗也可以得出，记为$E_i^T(t)$（能耗是与后面的reward设置相关的，就不后面一一细说了）。

## 计算模型

​	计算任务可以本地执行也可以EN上执行，所以要分两种情况。

​	1.本地执行。这里的定义和上面基本差不多，先定义任务被处理完毕或者drop的时间$l^C_i(t)$，然后MD上的处理时间$D^C_i(t)$，便可得到：
$$
\delta_i^{\mathrm{C}}(t)=\left[\max _{t^{\prime} \in\{0,1, \ldots, t-1\}} l_i^{\mathrm{C}}\left(t^{\prime}\right)-t+1\right]^{+}
$$
​	2.边缘节点上执行。这里要考虑的主要是队列的长度，即任务积压的程度，定义为：
$$
\eta_{i, j}^{\mathrm{E}}(t)=\left[\eta_{i, j}^{\mathrm{E}}(t-1)+\lambda_{i, j}^{\mathrm{E}}(t)-\frac{f_j^{\mathrm{E}} \tau}{\rho_i(t) B_j(t)}-\omega_{i, j}(t)\right]^{+}
$$
​		这里面呢$f$表示处理能力(就看做CPU强度吧)，$\rho$是处理完任务需要的CPU cycle数，B是EN上活跃队列（即有任务执行）的数量，$\omega$是队列中drop掉的任务bit数。

## 状态空间

​	上述的单独拎出来的公式都代表着状态。此外还有一些状态。首先是一个表示历史数据的矩阵$\mathcal{H}(t)$，T行J列，记录了所有ENs的历史活跃队列数量。最后是$\phi$，它表示第i个MD在t时刻的电池等级，取三种离散值，对应超级节能、节能模式和性能模式。由此，定义状态空间：
$$
s_i(t)=\left(\lambda_i(t), \delta_i^{\mathrm{C}}(t), \delta_i^{\mathrm{T}}(t), \boldsymbol{\eta}_i^{\mathrm{E}}(t-1), \phi_i(t), \mathcal{H}(t)\right)
$$

## 动作空间

​	动作是MD的动作。包括两部分：一个是是否卸载，一个是卸载到哪个EN。

## QoE函数

​	定义为：
$$
\begin{aligned}
& q_i\left(s_i(t), a_i(t)\right)= \\
& \qquad \begin{cases}\mathcal{R}-\mathcal{C}_i\left(s_i(t), a_i(t)\right) \text { if task } z_i(t) \text { is processed } \\
-\mathcal{E}_i\left(s_i(t), a_i(t)\right) & \text { if task } z_i(t) \text { is dropped }\end{cases}
\end{aligned}
$$
​		其中，R是任务完成的常数奖励值；$\mathcal{C}$是任务的cost，包括上述提到的处理时延$\mathcal{D}$以及能耗花费$\mathcal{E}$；如果任务drop了，那么奖励就是负的能耗值了。

​		这样，最优策略就可以表达为：$\pi_i^*=\arg \max _{\pi_i} \mathbb{E}\left[\sum_{t \in \mathcal{T}} \gamma^{t-1} \boldsymbol{q}_i(t) \mid \pi_i\right]$。网络结构如图所示：

![网络结构](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20241010160800870.png)
