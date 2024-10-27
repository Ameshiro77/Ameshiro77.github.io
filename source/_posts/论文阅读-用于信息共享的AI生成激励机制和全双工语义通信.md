---
uuid: 6992f2f0-7a82-11ef-8466-7f22ea5846e3
title: '论文阅读:用于信息共享的AI生成激励机制和全双工语义通信'
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
tags:
  - 生成式AI
  - 扩散模型
  - 论文阅读
categories:
  - AI无线通信
abbrlink: 6f19da25
date: 2024-09-22 22:36:40
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

论文地址：[[2303.01896\] AI-Generated Incentive Mechanism and Full-Duplex Semantic Communications for Information Sharing (arxiv.org)](https://arxiv.org/abs/2303.01896#:~:text=To facilitate semantic information)

# 摘要

​	本文以元宇宙和混合现实技术为背景。以MR头戴式设备(HMD)为例，它们有限的计算能力阻碍了相关服务的发展；为此，本文提出了一种基于全双工设备到设备（D2D）语义通信的高效信息共享方案来解决这个问题，使得用户避免了繁重的计算（例如MR用户视角中的AIGC内容），即：用户可以从他们视角下的图像中提取语义信息和生成内容，传输给别的用户，这些用户可以使用这些信息来获得他们视角图像下的计算结果的空间匹配。在通信方面，作者通过使用广义小尺度衰落模型分析全双工D2D通信的性能，包括可实现的速率和比特错误概率。**在促进语义信息共享方面，作者设计了一种基于合同理论的AI生成激励机制，用所提出的扩散模型生成最优的合同设计，超过了PPO和SAC算法**。

# 简介

​	由于每个玩家相对独立，通过MR HMD显示给用户的场景需要分别计算和渲染，这消耗了大量的计算和传输资源。为避免重复计算和渲染虚拟对象，一个方法是在用户之间建立一个信息共享方案。具体来说，用户根据自身的视角，要在HMD上显示的视图中找到安全、可行走的区域，称为**空闲空间信息**。用户可以通过比较接受的视图来规避重复计算，但传输这种信息需要大量资源，尤其对于高清晰度图像。

​	（针对通信：）为此，本文提出了一个全双工语义通信框架，旨在实现用户间高效的信息共享。该框架利用语义编码算法从视图图像中提取语义特征，然后通过全双工通信将它们传输给其他用户。用户可以使用接收到的语义特征，通过轻量级的语义匹配来获取空闲空间信息，而不是执行重复的计算。**基于语义信息的传输具有更小的数据量，从而最小化了用户的传输资源消耗**。

​	此外，必须建立适当的激励机制，以激励用户高效有效地共享语义信息。一个直接而有效的方式是让语义信息接收者（SIR）向语义信息提供者（SIP）支付（pay）激励。合同理论可以用来为双方建模支付方案，最大化SIR的效用。然而，要解决最优合同问题，接收语义信息的一方必须了解发送方的各种特征，如每单位传输功率的成本；此外不同的无线传输条件也可能会影响最优合同解决方案。尽管基于深度强化学习（DRL）的解决方案可以在没有特定环境参数的情况下找到合同设计，但**高状态维度**可能会使基于强化学习的解决方案难以解决或容易陷入局部最优（**应该是探索所有可能得状态会变得非常困难**）。为此，作者希望利用扩散模型来生成最优合同设计。

​	本文是第一篇AI生成+激励设计，激励设计和强化学习不太一样。

# 系统建模

## 语义感知的自由空间信息共享

​	当用户使用MR技术访问虚拟服务时，HMD需要执行各种计算任务,即应该计算叠加在现实世界上的虚拟对象的位置，并实时规划用户可以安全行走的路线。因为在同一场景中用户的view不同，因此每个用户都需要独立执行上述任务。例如，第k个用户在地面上生成一朵虚拟花，而第j个用户为了同步这个操作，需要根据自己的视角计算花在地面上的位置。一个可能的解决方案是执行用户视角共享图像，但这会会消耗大量的无线传输资源，即传输功率和带宽。原因是HMD的分辨率很高，导致视角图像的数据量很大。

![image-架构图](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20240925234419433.png)

​	为了解决这个问题并实现高效有效的信息共享，我们在设备到设备（D2D）全双工通信系统中**应用了语义通信技术**。一个典型的任务是上述提到的自由空间信息的共享。如图所示，具体来说，一个用户如果在他们的视野图像中识别出一个可以安全行走的区域，就可以将检测到的自由空间信息与其他用户共享。其他用户随后可以直接进行匹配，以获取他们自己视野图像中的安全行走区域。令$x_k$表示第k个用户的原始视图图像。这里，语义信息包括检测到的自由空间（$i_k$）、反映视觉场图中重要结构的interest points（$p_k$）以及与interest points对应的descriptors（$d_k$）。用 S{⋅}表示语义编码器，即有：
$$
\mathcal{S}\left\{\mathrm{x}_k\right\}=\{\mathrm{p}_k,\mathrm{d}_k,\mathrm{i}_k\}
$$
​		这个数据比原始图像数据要小得多。语义编码器在下文提到。

## 全双工通信

​	有很多通信知识，看不懂，但最终给出第k个用户收到的SINR为：
$$
\gamma_k=\frac{P_jD_{jk}^{-\beta_k}\left|h_{jk}\right|^2}{P_I\sum\limits_{i=1}^N\left|g_k\right|^2+v_kP_k\sigma_S^2+\sigma_N^2}
$$
​		这里的诸多变量在之后用作DRL的环境表示。

# 语义匹配和合同建模

## 自监督语义解码

​	语义信息的定义通常与任务相关。卷积神经网络已经广泛用于兴趣点检测和描述，本文利用已经提出的自监督的SuperPoint 架构作为语义编码器，在单次前向传递中产生兴趣点检测和固定长度描述符。具体来说，如图所示，第k个用户的全尺寸视图图像被发送到一个共享的CNN中，以降低输入视图图像的维度。然后，输出被送入两个单独的编码器，分别获得兴趣点和描述符。

![image-CNN图](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20240926000631842.png)

## 语义匹配

​	在其他用户接收到兴趣点和描述符之后，还应该对用户自己的视图图像执行语义信息提取。然后，在提取的兴趣点和描述符之间执行语义信息匹配。在这里，我们使用已经提出的SuperGlue作为语义匹配网络架构。

![image-语义匹配网络](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20240926001535486.png)

## 合同（contract）建模

​	论文使用合同作为激励措施，鼓励用户彼此共享语义信息；并分别为SIP（信息提供者）和SIR（信息接收者）制定了支付计划和效用。

### 支付计划（payment plan）

​	为了促进MR用户参与语义信息共享，需要一个适当的支付计划，允许SIP和SIR从合作中受益。为此，文章提出了一个基于合同理论的支付计划，其中SIP根据共享语义信息的质量（QoS）从SIR那里获得薪资（compensation）。因此，信息提供者的收益函数可以表示为：
$$
I_\mathrm{SIP}=c_qQ_s+c_f
$$
​	其中$c_f$是针对语义解码计算资源的支付，$c_q$是单位QoS的支付，$Q_s$是QoS量化结果。因为语义匹配结果受到无线传输过程的影响，可达到的速率影响信息共享的延迟，而误码率（BEP）影响接收到的语义信息的准确性。因此，我们定义QoS为：
$$
Q_s(P_k)=M_k\mathcal{T}\left(R_k\right)\mathcal{T}\left(1-E_k\right)
$$
​		其中$M_k\in[0,1]$表示语义提取匹配算法对QoS的影响，R是可达到的速率，E是误码率，T函数用于消除量级影响。

### 效用（utility）

​	SIP的效用可以定义为：
$$
U_{\mathrm{SIP}}=I_{\mathrm{SIP}}-c_pP_k=c_qQ_s-c_pP_k+c_f,
$$
​	其中$P_k$是SIP传输能力，$c_p$是其单位开销。SIR可以使用接收到的语义信息与SIP匹配空间位置。因此，Qs 越高，SIR通过匹配获得的结果就越准确，从而可以节省更多的计算资源。我们使用参数 $c_s$ 来衡量SIR每单位 Qs提升带来的效用增益。则SIR的效用可以表示为：
$$
U_{\mathrm{SIR}}=c_sQ_s-I_{\mathrm{SIP}}=(c_s-c_q) Q_s-c_f
$$

### 	合同建模

​	SIR提供的合同包括两项，即{$c_q$，$c_f$}。为了设计最优合同，我们在为SIP提供必要的激励以同意合同的同时，制定了SIR的效用最大化问题。这个优化问题可以表达为：
$$
\begin{aligned}\max_{c_{q},c_{f},P_{k}}&U_{\mathrm{SIR}}\left(c_{q},c_{f},P_{k}\right)\\\mathrm{s.t.}&\left\{\begin{array}{l}P_{k}{}^{*}\in\arg\max_{P_{k}}U_{\mathrm{SIP}}\left(P_{k},c_{q},c_{f}\right)\\U_{\mathrm{SIP}}\left(P_{k}{}^{*},c_{q},c_{f}\right)\geq U_{\mathrm{th}}^{\mathrm{SIP}},\end{array}\right.\end{aligned}
$$
​		第一个约束是要$P_k$最大化自身的utility。第二个就是一个效应阈值。

​	最优合同设计建模为一个复杂的决策问题。传统的数学技术在解决给定问题时可能会遇到可处理性挑战，**而基于深度强化学习（DRL）的方法可能提供了一个可行的替代方案**。然而，无线通信系统的最优合同设计不仅受到用户特定因素的影响，如单位功率的价格，还受到复杂的无线环境的影响，包括同信道干扰信号功率、干扰路径数量以及与小规模衰落相关的不同参数。因此，**DRL算法可能难以收敛到最优解或由于状态的高维度而获得次优性能**。为了应对这一挑战，选择DRL算法对于提高有效性至关重要。PPO和SAC算法在高维度状态问题上显示出了有希望的结果。因此，本文使用两种DRL算法，即PPO和SAC，来解决最优合同设计问题；此外，**为了应对使用DRL算法解决高维度状态空间的挑战**，本文提出了一种基于扩散模型的新型人工智能生成合同方法。

# 人工智能生成最优合同

​		根据之前所述，环境可以表示为：$e=\begin{Bmatrix}c_{s},c_{p},D_{jk},\beta_{k},\alpha,\mu,\sigma_{N}^{2},\sigma_{S}^{2},v_{k},P_{I},\eta_{k},N,P_{j}\end{Bmatrix}$。类似的，最优合同设计也是从 一个高斯噪声逐渐生成。最优策略是最小化contract quality：
$$
\pi=\arg\min_{\pi_\theta}\mathcal{L}(\theta)=-\mathbb{E}_{\mathbf{c}^0\sim\pi_\theta}\left[Q_v\left(\mathbf{e},\mathbf{c}^0\right)\right]
$$
​	而contract quality的Q网络就用常规的Q学习方法学习：
$$
\mathbb{E}_{\mathbf{c}_{t+1}^0\sim\pi_{\theta}\prime}\left[\left\|\left(r(\mathbf{e},\mathbf{c}_t)+\gamma\min_{i=1,2}Q_{v_i^{\prime}}(\mathbf{e},\mathbf{c}_{t+1}^0)\right)-Q_{v_i}(\mathbf{e},\mathbf{c}_t)\right\|^2\right]
$$


![image](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20240926120953566.png)
