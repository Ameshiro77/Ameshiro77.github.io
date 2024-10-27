---
uuid: e2302e00-69ff-11ef-b7f0-4322a7e6b415
title: 论文阅读-以cGAN作为未知信道的端到端无线通信系统
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
tags:
  - 生成式AI
  - GAN
  - 无线通信
  - 论文阅读
categories:
  - AI无线通信
abbrlink: 56af421c
date: 2024-08-20 22:22:00
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

论文地址：[Deep Learning-Based End-to-End Wireless Communication Systems With Conditional GANs as Unknown Channels | IEEE Journals & Magazine | IEEE Xplore](https://ieeexplore.ieee.org/document/8985539)

# 摘要

本文将DNN应用于端到端的无线通信系统中，DNN的关键功能有：编码与调制、解码与解调。然而，我们需要对于**瞬时通道传递函数**（instantaneous channel transfer function）（例如信道状态信息，**CSI**）进行精确估计，使得能够让**发射器(transmitter)DNN**来学习最优化解码过程中的接收器增益（让梯度得以传播）。这项任务很有挑战性是因为：CSI在无线通信中随时间和空间变化，在设计收发器（transceiver）时很难获得。本文提出使用一种**条件GAN**来表示信道效果（channel effects）并且沟通起发射器DNN和接收器DNN，使得发射器DNN的梯度可以从接收器DNN反向传播。特别是，应用了一个条件GAN以数据驱动的方式来建模信道效果，其中与导频符号（pilot symbol）对应的接收器信号被作为GAN条件信息的一部分来添加。为了解决传输信号序列长带来的维度灾难，文章利用了卷积层。模拟结果表明，文章提出的方法在additive white Gaussian noise (AWGN) channels, Rayleigh fading channels, and frequency-selective channels上很有用，开辟了数据驱动DNN应用于端到端通信系统的新道路。

# 简介

文章核心示意图如下图1所示：

<img src="https://s2.loli.net/2024/09/03/FEdqZQKvcYokgAt.png" alt="image-20240903231929177" style="zoom:80%;" />

​	传统的无线通信系统如图1.a所示，数据传输过程需要几个过程块。这些“块”需要分别设计优化，难以确保全局最优；且信道传播需要用一个数学模型假设，可能对实际场景来说不够精确。

​	因而，一些工作提出数据驱动的深度学习方法，用于MIMO检测、信道编码、信道估计等等。此外，深度学习方法可以联合优化这些“块”：比如一起优化信道估计、检测；一起优化信道编码、信源编码等等。而且，深度学习方法可以单纯从数据中学习，并用端到端损失优化，并不需要手工制作或ad-hoc设计。因此，如图1.b所示，一些工作用DNN用作transmitter/receiver，来进行编码解码、调制解调。对于有噪声时的鲁棒性，这些工作向隐藏层添加噪音来模拟无线信道影响。

​	但是这样的缺点是：1.如果信道转移函数不知道，那么**梯度无法传播**到transmitter DNN（提前假设函数会让网络权重发生偏置，且有些时候也难以假设）；2.**如果传播的码块（code block）大小太长**，那么可能的码字（codewords）大小会指数上涨（应该意思是2^n），如此一来那些不可见码字就会非常多。而之前一些工作中，就算90%的码字参与了训练，剩下那些不可见的解码性能也很不好。3.码块太长会有**维度灾难**。

​	因此，本文提出一个信道不可知的端到端通信系统，信道分布的输出通过一个cGAN(条件GAN)来学习，其中**条件信息是来自transmitter的解码信号和用于估计信道的接收到的导频信息（pilot information）**。此外，本文用CNN来克服维度灾难，扩展码块长度到许多位（代码里是十万位）。本文主要贡献是：1.用**cGAN进行信道条件分布建模，可以学习信道影响**；2.**添加了导频信号作为条件信息的一部分**，使得cGAN可以根据现有信道模型生成更多具体样本；3.**端到端的系统，梯度可以传播**；4.应用了CNN缓解维度灾难，带有卷积层的发射器DNN可以将信息位数编码到高维。

# 相关工作

​	挑几个重要的。1.cGAN可用于将低分辨率图像重建；而在无线通信领域，已经有工作用它模拟AWGN，但作者由于加了导频信号作为条件信息的一部分，可以用到更多实际的时分信道上。2.传统DNN无线通信都没想着咋扩展码块大小。3.传统方法用RNN什么的去解码汉明码、卷积码、Polar码什么的，但作者的附带CNN卷积层的网络可以**同时学习编码解码，不用解码人为设计的码字**。

# 用cGAN建模信道

​	cGAN的模型结构如图2所示：

<img src="https://s2.loli.net/2024/09/04/iSnRoB7YyLkbxwd.png" alt="image-20240904110557401" style="zoom:80%;" />

​	给生成器G和判别器D加入额外条件信息就成了cGAN。总体的优化目标与GAN基本完全一致：

$$
\begin{aligned}
\operatorname*{min}_{\mathcal{G}}\operatorname*{max}_{\mathcal{D}}V(D,G)& =E_{\mathbf{x}\sim p_{data}(\mathbf{x})}[\log(D_{\mathcal{D}}(\mathbf{x}|\mathbf{m}))] \\
&+E_{\mathbf{z}\sim p_{z}(\mathbf{z})}[\log(1-D_{\mathcal{D}}(G_{\mathcal{G}}(\mathbf{z}|\mathbf{m})].
\end{aligned}
$$
​	这里的**条件信息就是编码出的信号$x$和接收到的导频数据$y_p$**。代码中，生成器生成信号时，直接把**噪声z和条件信息m在最后一维拼接**起来。

​	作者又提了下CNN的公式，其实代码里就是重复的tf.conv1d接一个leakly_ReLU。**比起人工设计的码，CNN编码的结果可以更容易被解码器解码**。此外，信道影响可以通过ISI信道（符号间干扰）中的卷积运算表示，因此用CNN处理ISI信道也很合适。

# 端到端系统建模

​	编码器把N个信息位，$s\in\{0,1\}^N$映射到固定K长的embedding，然后解码器根据收到的信号$y$进行恢复，得到$\hat{s}$。显然可以用交叉熵计算损失：

$$
L=\sum_{n=1}^M(s_n\log(\hat{s}_n)+(1-s_n)\log(1-\hat{s}_n)).
$$
​	训练和测试的系统架构如图3所示：

![image-20240904113346557](https://s2.loli.net/2024/09/04/vNy9A5njUIHwRhk.png)

​	其中，$\mathcal{H}$是一个信道集合，用于采样瞬时CSI。为了获得训练数据，即$s$，直接随机生成就好（**代码中用二项分布随机生成，即np.random.binomial**）。对于发射器、接收器、 GAN，当训练一个组件时，别的组件的参数固定。训练接收器、发射器时，目标是最小化端到端损失；训练cGAN时，就是最小化GAN的min-max优化目标。测试时，用真实信道测试性能。

# 实验

​	实验包括**三种信道**：1.AWGN，信道输出直接加上个高斯噪音就行；2.瑞利衰落信道，信道输出为：$y_n=h_n\cdot x_n+w_n$，$h_n$是信道参数，符合高斯分布，时分不可知；3.频率选择性衰落信道，看不懂就不放了（本科没学过通信...）。

​	实验**比较基线**：与传统通信系统比，每个信号处理模块根据信道先验知识设计，**比较BER(bit-error rate)和BLER(block-error rate)**。同时，QAM用于调制，且使用汉明码或卷积码（具体来说是RSC码）；频率选择性衰落信道用OFDM处理ISI。

​	

