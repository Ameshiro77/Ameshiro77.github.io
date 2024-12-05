---
uuid: 045d50d0-b2d4-11ef-8451-0f4e0cca6891
title: 论文阅读-面向分布式卫星边缘网络、基于DRL的leader联邦学习优化
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
tags:
  - 论文阅读
categories:
  - AI无线通信
abbrlink: e5231234
date: 2024-12-03 14:41:54
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

​	2024,[Leader Federated Learning Optimization Using Deep Reinforcement Learning for Distributed Satellite Edge Intelligence | IEEE Journals & Magazine | IEEE Xplore](https://ieeexplore.ieee.org/abstract/document/10478789)

# 摘要

​	将AI融入低轨道卫星（LEO）的卫星移动边缘计算系统，就构成了卫星边缘智能（SEI）。这种智能系统是实现由海量数据驱动的空间任务自主处理的有力途径；但是单个卫星的话资源受限和样本不足，学习效率低；大规模LEO网络的时空约束又使得协作训练变得困难。

​	为此，本文提出了一种用于分布式SEI的领导者联邦学习（Leader FL）架构，称为**SELFL**。通过评估动态的constellation的连接性和负载情况，共享AI模型的全局和局部参数可以基于已建立的星间链路，在选定的领导卫星与其他跟随卫星之间持续传输和更新，从而实现SELFL独立于地面的高效自我演化。（就是卫星自己玩自己的，跟地面基站无关了）

​	此外，本文为SELFL引入了一种基于深度强化学习的资源分配策略，该策略利用分布式近端策略优化（DPPO）方法**优化卫星的计算能力和发射功率**，从而**加速联邦学习并减少能耗**。这种方法不仅通过自适应学习步长实现了稳定的更新，还通过多线程并行工作器提高了样本效率。

# 简介

​	近年来，**大量小型卫星在低地球轨道（LEO）**的部署提供了**高吞吐量、低延迟和广覆盖**的互联网服务，取代了中地球轨道（MEO）和静止地球轨道（GEO）上的传统大卫星 。这些卫星具有更强的硬件能力，能够**收集大量地球影像和传感器数据**，因此可以AI+大量数据，应用于城市规划、气候预报和灾害管理等新兴卫星应用 。

​	于是就有了卫星移动边缘计算（SMEC），将云服务器的丰富计算资源下沉到 LEO 边缘，并确保计算过程不依赖地面站 。但是问题在于：1.由于轨道和位置差异，**LEO 卫星上的数据集通常是non-IID的**；2.能源供给主要来自太阳能电池板和电池单元，因此其能**量预算也是最重要的限制之一** 。因此，每颗卫星只能依赖本地数据独立训练 AI 模型，导致效率低下和能量浪费。

​	于是有人提出了**卫星联邦学习**：能使多个卫星能够共享模型参数，共同训练一个全局模型，减轻了单颗卫星的计算负担，提高了学习精度，减少了通信吞吐量并保护了隐私。**但是之前研究很少考虑由大规模 LEO 网络动态运行带来的时间变化的卫星可见性。本文针对分布式 LEO 卫星的时空特性，开展了有关动态 SEI 中高效 FL 优化的研究（即DRL部分：为了在时变的 ISL 连接性下交换参数，需要加速 FL 轮次以确保成功执行。因此，有必要制定最佳的资源分配策略，联合最小化训练时间和能量消耗。）。**

​	此外**本文认为相关研究里大多是地面站作为中央参数服务器**，持续与所有卫星建立通信并传输数据，增加了冗余的通信开销，违背了星座自主性的初衷。于是本文就想，**让地面站只负责评估卫星的通信和计算能力，并根据评分选举出一颗领导卫星作为聚合服务器。（即系统模型部分）**

# 系统模型

## 网络模型	

如图所示：

![image-系统模型](https://raw.githubusercontent.com/Ameshiro77/BlogPicture/main/pic/image-20241205152754541.png)

​	考虑有K个卫星，在L个轨道平面上，因此每个轨道有K/L个卫星。在星座图运行期间，每个卫星k从地球收集存储图像数据集Dk，这些数据集是不均衡、非iid的（规模不一样所以计算压力自然不同）。此外，每颗卫星通过激光链路与周围四颗卫星建立星间链路（ISL）：两条平轨链路连接同一轨道上相邻卫星，另外两条交轨链路连接相邻轨道上的相邻卫星。

​	（PS： Intra-Plane ISLs（平轨链路）：是指同一轨道上相邻卫星之间的链路。Inter-Plane ISLs（交轨链路）：是指位于不同轨道的卫星之间建立的链路。）

​	由于卫星动的快，所有卫星都处于动态网络拓扑结构中。星间通信仅能在视距（LoS）范围内进行。当两颗卫星被天体遮挡或天线未对准时，它们之间的星间链路无法在非视距（NLoS）范围内建立。因此，卫星之间的可见性和连通性始终是时变的。

​	基于此，本文的SELFL架构的FL学习中，**在每一轮学习时，都会先让地面云服务器根据卫星的计算和通信能力评分，选举出一个最优的领航卫星执行参数聚合**。其他追随卫星将本地参数传递给领航卫星，并使用原路径下载全局参数（路由规划采用卫星间距离最短的次优路径）。地面云仅在初始化阶段接收来自卫星的操作信息，并广播控制指令以管理SELFL流程。

![image-选leader](https://raw.githubusercontent.com/Ameshiro77/BlogPicture/main/pic/image-20241205155732098.png)

​	本文的联邦学习是经典的FedAvg方法。（在这一节也没听到非iid的影响。）

## 通信计算模型

​	整体的FL过程可以总结如下：

![image-FL过程](https://raw.githubusercontent.com/Ameshiro77/BlogPicture/main/pic/image-20241205162805778.png)

​	忽略初始化阶段，每一FL轮包括：本地训练，本地上传，全局聚合和下载阶段。这些可以分为两部分：计算和无线通信。最终优化的是时间和能耗。

### 卫星计算

其实和之前说的论文也都没啥区别。时间和能耗由下得：$T_{r,k}^{comp}=\frac{I(C_k|D_k|)}{f_t^k}$，$E_{r,k}^{comp}=I(\kappa{f_t^k}^2C_k|D_k|).$；I是迭代次数，C是处理数据需要的单位CPU cycle，f是分配的计算资源。

### 无线传输

假设是AWGN。本文中，**由于忽略了基于激光的 ISL 的通道条件的变化**，因此 带宽B 和 信道特性g 被认为是恒定的。数据发射率定义为：$R_r^k=B_klog_2(1+p_t^kg_c)$，由此自然得到时间和能耗。

由于往返过程中leader卫星不改变，所以上传和下行的时间和能耗假设是一致的。

### 问题建模

​	要优化的自然是对全部轮中T和E的加权和：
$$
\begin{aligned}
 & \operatorname*{minimize}_{x_{t}^{k},f_{t}^{k},p_{t}^{k}} & & \sum_{r=1}^{R}\omega_{t}T_{r}+\omega_{e}E_{r} \\
 & \mathrm{subject~to} & & T_r\leq T_{r,k}^{hold},\forall k=1,2,\ldots,K, \\
 & & & x_{t}^{k}\in\{0,1\},\forall t,k. \\
 & & & \sum_{k=1}^{K}x_{t}^{k}=1,\forall t. \\
 & & & 0<f_{t}^{k}\leq F,\forall t,k. \\
 & & & 0<p_{t}^{k}\leq P,\forall t,k.
\end{aligned}
$$
​	这里的$T_r$是一个针对各时间的max，而$E_r$是一种求和。

# 强化学习



​	本文不详细介绍DRL算法的细节，只介绍几点。

​	本文DRL的状态state是不同卫星收集的数据集大小、卫星两两之间的可视情况（KxK矩阵）和两两间距离矩阵。动作是分配给不同卫星的计算资源f和功率p。

​	在分配完毕后，才会进行leader选择：根据每个卫星的数据集大小、分配的计算资源和功率的占比，去选择leader（在实验中，这些值超参数是-1，意味着找负担最小、资源最充足的去聚合）。算法如下：

![image](https://raw.githubusercontent.com/Ameshiro77/BlogPicture/main/pic/image-20241205171132261.png)

​	奖励与目标函数有关。如果因为星间不可见导致FL失败，就给一个惩罚项。

# 实验

​	实验用的一个叫AGI STK的仿真软件做的，在MNIST数据集上进行实验。
