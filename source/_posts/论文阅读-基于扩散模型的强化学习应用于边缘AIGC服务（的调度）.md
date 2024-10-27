---
uuid: e48754f0-70c4-11ef-85a8-23fe53a78916
title: 论文阅读-基于扩散模型的强化学习应用于边缘AIGC服务（的调度）
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
tags:
  - 扩散模型
  - 生成式AI
  - 强化学习
  - 论文阅读
categories:
  - AI无线通信
abbrlink: 61bbf8ca
date: 2024-09-12 13:07:22
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

论文地址：[[2303.13052\] Diffusion-based Reinforcement Learning for Edge-enabled AI-Generated Content Services (arxiv.org)](https://arxiv.org/abs/2303.13052)

# 摘要

​		背景：元宇宙时代，AIGC技术至关重要，但资源集中，需要分配。本文介绍了一个**AIGC-as-a-Service (AaaS) 架构**，把AIGC模型**部署到边缘网络**来确保让更多用户使用AIGC服务。尽管如此，为了提升用户个性化体验，需要仔细地**选择能高效执行任务的AIGC Service Providers (ASPs)**，这一问题因为环境不确定性和变化性而变得复杂。为此，本文**提出了AI-Generated Optimal Decision (AGOD)**算法，一个基于扩散模型的方法，用来**生成最优ASP选择决策**。将AGOD与Deep Reinforcement Learning (DRL)结合，作者提出了**Deep Diffusion Soft Actor-Critic (D2SAC)** 算法，提高了ASP选择的高效性（大致即，扩散模型用作SAC中actor网络，用来从一个高斯噪声中生成策略$\pi$）。

# 简介（大部分灌水）

​	目前AIGC很重要，但是训练部署成本很高，限制了其广泛应用。其次是AIGC要为不同用户生成个性化内容。因此AIGC下的元宇宙有两个目标：1.让任何设备在何时何地都能用;2.其服务能够最大化用户体验。为实现目标（1），**AIGC被部署在边缘网络上**，用户上传需求然后拿到结果。对目标（2），不同AIGC生成偏好不同，用户兴趣和服务器计算能力也不同，因此要为用户选择最佳的ASP，设计高效的调度算法。然而，对用户效用（user utility，大概可以看作用户满意度）和AIGC模型能力进行数学建模并不容易。本文提出了一种diffusion model-based AI-Generated Optimal Decision (AGOD)算法，来用扩散模型在不确定和变化的环境中生成最佳决策。本文贡献在于：

​	1.提出了AaaS架构（解决目标1）；2.提出AGOD算法（解决目标2）；3.把AGOD用到了DRL（SAC算法）中，最大化用户的主观体验。

相关工作

# 无线网络中的AIGC服务

## Aaas

​	本文以图像生成为例，其架构如图所示。

![image-20240913001143130](https://s2.loli.net/2024/09/13/pE1z6VZkW5M8wbA.png)

​	其实就是用户发送需求（如prompt和去噪步数），然后选择边缘网络的合适ASP执行任务并返回。不同ASP有不同的图片生成风格，用户也会因此收到不同的效用（图中是BRISQUE衡量的，即模型无参考评价模型）。

## ASP选择问题

​	ASP选择问题与资源约束下的任务分配问题类似，旨在分配任务到可用的资源，并在满足约束的前提下最大化整体效用。

​	问题建模：一组序列任务$\mathcal{J}={j_1,...,j_J}$，一组可用的ASP：$\mathcal{I}={i_1,...,i_I}$；每个ASP的资源可用量为$T_i$。设对第i个ASP的单独的效用函数$u_i(T_j)$，其意思是第j个任务分配到第i个ASP时，针对所需资源$T_j$的函数。问题目标是找到一个分配$\mathcal{A}={a_1...a_J}$，使得总体用户效应$\mathcal{U} = \sum_{j=1}^{J}u_{i} (T_{j})$最大。不失一般性，**本文假设$T_j$是去噪步骤**，与能耗损失正相关。最后，令$\mathcal{\hat{J_i}}$为第i个ASP已经运行的任务数。ASP选择问题可以建模为一个整数规划问题：

<img src="https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20240913170115521.png" alt="image-20240913170115521" style="zoom:80%;" />

​	难点：任务是动态的实时变化的，不能提前知道；效用值不仅取决于用户主观感知，也取决于分配给的ASP的性能，在调度时是未知的。

## human-aware utility function

​	用户任务的效用值无法提前获知，它需要由一些应用于AIGC的评估技术决定，可定义为：$u_i(T_j)=\mathcal G(\mathcal F_i(T_j))$，G和F表示评估函数和AIGC模型函数。G可以是上面提到的BRISQUE。**实际代码里用的是PyTorch Image Quality (PIQ)**。

# AI生成最优决策

## AGOD的动机

​		ASP选择问题的解空间是有穷、离散的，解空间大小随变量数量而指数增长；一些RL方法难以应用。受DDPM启发，本文旨在提出一个基于扩散模型的优化器来**生成这种离散性质的决策方案**。即，根据扩散模型，当前环境下的最优决策加入噪声直到变成高斯噪声，然后在逆向过程中根据环境$s$恢复最优决策$x_0$。

## 前向过程

​	由于缺少最优决策解的数据集，AGOD没有前向过程。（通过奖励训练）

## 逆向过程

​	具体实现AGOD时，我们先计算逆向转移分布$p_\theta(x_{t-1}|x_{t})$的均值，以此获得$x_{t-1}$的分布，然后用一个softmax进行归一化，得到策略π:
$$
\pi_{\boldsymbol{\theta}}\left(s\right)=\left\{\frac{e^{\boldsymbol{x}_0^i}}{\sum_{k=1}^{\mathcal{A}}e^{\boldsymbol{x}_0^k}},\forall i\in\mathcal{A}\right\}
$$
​	然而，在DDPM中优化目标是MSE，需要标签图像；而ASP选择问题没有标签，需要用一种探索性方式（**强化学习**）去学习，目标变成了最大化决策方案的价值。**本文将AGOD集成到了SAC框架内，可以处理离散动作，并且是off policy的**，称为D2SAC。**实际的扩散模型是用MLP实现的。**

# 基于扩散模型的强化学习

## 问题建模

**1.状态空间**。状态s（即agent的观测）包括两个特征向量：一个代表将要到来的任务$s^T$,一个代表所有ASP目前的资源状态$s^A$。$s^T$用来编码任务所需资源（即去噪步数）T和预计完成时间o，记作$s^T=[T，o]$；$s^A$包括第i个ASP所有可用的资源$T_i$和目前可用的资源$\tilde{\mathcal{T}_{i}}$，记作$s^{\mathrm{A}} = [\mathcal{T}_{i},\tilde{\mathcal{T}}_{i}|\forall i \in \mathcal{I}]$。因此，agent观测到的状态就是$s = [s^{\mathrm{T}},s^{\mathrm{A}}]$。所有分量都被归一化到(0,1)。

**2.动作空间。**动作空间很好理解，就是从1到I的整数空间。在评估过程中，动作a就等于$a=\arg\max_i\left\{\pi_{\boldsymbol{\theta}}^i(s),\forall i\in\mathcal{I}\right\}$。

**3.奖励函数。**奖励包括两部分：AIGC质量奖励$r^R$和冲突（即：使得某个ASP过载崩溃，让其已有工作报废掉了）惩罚$r^P$。$r^R$由效应值减去一个噪音采样得到。$r^P$则包括一个固定的惩罚值（值为2），和一个与运行任务数成正比的额外惩罚值。最终的奖励记作$r = r^{\mathrm{R}}-r^{\mathrm{P}}$。

​	此外，指定状态转换的最大数量L，来指示一个trajectory的终止。通过上述定义，我们的总体目标就是训练AGOD网络的参数$\theta$,使得它最大化奖励，即：
$$
\theta^*=\arg\max_{\boldsymbol{\theta}} \mathbb{E}\left[\sum_{l=0}^L\gamma^l\left(r_l+\alpha H(\pi_{\boldsymbol{\theta}}(s_l))\right)\right]
$$
​	这里的$H$是SAC提出的正则项，即分布的熵，用于进行exploration和exploitation之间的trade-off。

## 算法架构

​	 包括一个actor，一个double critic，一个target actor和target critic，一个experience replay和交互环境。

<img src="https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20240913170254447.png" alt="image-20240913170254447" style="zoom:80%;" />

​		本文用了两个Q函数来进行policy evaluation，两个Q函数有各自的独立参数，并且独立更新。训练期间，估计的Q值是二者的最小值，这一方法确保actor根据Q值的保守估计进行更新，更加稳定高效。

​		考虑到正则化，actor要最大化的式子就可以写成：$\max_{\boldsymbol{\theta}} \pi_{\boldsymbol{\theta}}\left(s_{l}\right)^{T}Q_{\boldsymbol{\phi}}\left(s_{l}\right)+\alpha H\left(\pi_{\boldsymbol{\theta}}\left(s_{l}\right)\right)$。根据梯度下降法，第e步的训练里，actor参数就可以用下式更新：
$$
\left.\theta_{e+1}\leftarrow\theta_{e}-\eta_{\mathrm{a}}\cdot\mathbb{E}_{s_{l}\sim\mathcal{B}_{e}}\left[\begin{array}{c}-\alpha\nabla_{\boldsymbol{\theta}_{e}}H\left(\pi_{\boldsymbol{\theta}_{e}}\left(s_{l}\right)\right)\\-\nabla_{\boldsymbol{\theta}_{e}}\pi_{\boldsymbol{\theta}_{e}}\left(s_{l}\right)^{T}Q_{\boldsymbol{\phi}_{e}}\left(s_{l}\right)\end{array}\right.\right]
$$
​		之后是Q函数的更新。为了更新，我们需要最小化Q-target：$\hat{y}_{e}$和Q-eval：$y_e^i$之间的TD error。即：
$$
\begin{aligned}&\operatorname*{min}_{\phi^{1},\phi^{2}}\quad\mathbb{E}_{(s_{l},a_{l},s_{l+1},r_{l})\sim\mathcal{B}_{e}}[\sum_{i=1,2}\left(\hat{y}_{e}-y_{e}^{i}\right)^{2}],\\&\mathrm{s.t.}\quad y_{e}^{i}=Q_{\phi_{e}^{i}}\left(s_{l},a_{l}\right),\\&\hat{y}_{e}=r_{l}+\gamma\left(1-d_{l+1}\right)\hat{\pi}_{\hat{\boldsymbol{\theta}}_{e}}\left(s_{l+1}\right)^{T}\hat{Q}_{\hat{\boldsymbol{\phi}}_{e}}\left(s_{l+1}\right).\end{aligned}
$$
​	对于目标网络来说，他们的参数不随着梯度下降更新，而是用一种soft update机制由训练网络赋值：
$$
\hat{\theta}_{e+1}\leftarrow\tau\theta_{e}+(1-\tau)\hat{\theta}_{e},\\\hat{\phi}_{e+1}\leftarrow\tau\phi_{e}+(1-\tau)\hat{\phi}_{e},
$$
​	总算法流程：

![image-20240913175834216](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20240913175834216.png)
