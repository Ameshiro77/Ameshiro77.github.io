---
uuid: 2c906e80-4e83-11ef-a11b-631e32ff91b9
title: 生成式AI对于无线通信的应用
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden:true
date: 2024-07-30 22:51:16
updated:
description:
img:
top_img:
password:
summary:
tags:
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

​		[CCCF专栏丨AIoT时代的智能无线感知：特征、算法、数据集-中国计算机学会](https://www.ccf.org.cn/Focus/2020-03-12/696634.shtml)。

## GAI应用

· VAE:音频合成、图像生成、物联网设备故障检测

· GAN:视频预测 3D对象生成 物联网异常检测

· 扩散模型：文生图 时间序列预测 

## 偏向物理层面的应用

​		目前常用的人工智能生成模型主要是GAN,扩散模型等。一些论文主要指出了这些方法在通信工程底层方面的一些应用，比如信道误差估计、信道生成、去噪、重建信息信号等。

## DeepSense 6G

​	DeepSense 6G 是一个基于真实世界的多模态数据集，包含在现实无线环境中(包括不同车辆、无人机、室内外等等场景)收集的共存多模态传感和通信数据（例如mmwave、摄像头、GPS 数据、LiDAR 等等）。

有助于更高层次的应用，比如：

· Current and Future Beam Prediction (LOS and NLOS)

· Blockage Prediction and Proactive Handoff

​	与CV关系更密切，生成式AI的应用偏少一些。

以下官网暂无

· User Scheduling

· Resource Management

· User Clustering

· Reflection Identification

· Interference Management

· Security Enhancement

· Codebook Design and Optimization

## 与多智能体结合

​	· 不同agent之间通过通信、协作来实现任务；生成式AI（如轻量级的LLM）部署在每一个边缘设备上，进行智能决策，每个设备上的LLM对特定知识进行编码。但是不是在简单的模拟环境中，而是在无线通信领域，因此需要额外考虑通信成本。

· **在轨迹预测（下面提到的）等问题中**，如果是多主体环境，agent与agent之间也会有影响（与MARL关系似乎不大）。

## 车联网

· **驾车模拟** 用生成式AI生成复杂的道路情况，以训练自动驾驶学算法

· **交通模拟与预测** 通过GAN、DFM等网络， 根据实时交通数据优化路线

<img src="C:\Users\yubai\AppData\Roaming\Typora\typora-user-images\image-20240801200051702.png" alt="image-20240801200051702" style="zoom: 67%;" />

## 轨迹预测（序列->序列问题）

​	从多种无线通信手段（如雷达、相机等等）获取场景信息，然后对行人轨迹进行预测。由于问题可能是多模态的，最近的解决方案从判别式模型（通常只能输出一条确定路径）转变利用生成式AI进生成预测出的轨迹分布。**多模态轨迹预测要求模型提供多个人类可以接受的轨迹分布。**

<img src="C:\Users\yubai\AppData\Roaming\Typora\typora-user-images\image-20240801200206963.png" alt="image-20240801200206963" style="zoom: 25%;" />

​	一些工作提出**GAN**来解决轨迹预测等问题，但GAN会导致有out of distribution的问题出现；有些工作采用多生成器GAN解决这种问题。或者针对一些zero/few shot的问题，利用**生成模型**扩充虚拟数据集。



=====

放论文 放图片 

数字孪生建模无线环境

wireless communication

AIGC生成数据集 模拟分布 例如信道分布 扩充训练数据

deepsense辅助通信

transaction on) wireless communication
