---
uuid: 84584f90-a4e9-11ef-906f-f1d4c537fd70
title: 论文阅读-6G卫星高效联邦学习-基于DRL的多目标优化
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
date: 2024-11-17 21:40:32
updated:
description:
img:
top_img:
password:
summary:
tags:
  - 论文阅读
  - 分布式训练
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

# 摘要

​	基于无线的FL作为新兴的**分布式学习**方法，在6G系统中被广泛研究。当这一范式从地面网络转移到非地面网络，就会有更多挑战：例如LEO卫星服务时间有限、需要高效的上传和聚合时间。本文中，作者利用了LEO广泛的接入能力和FL的隐私保护和协作学习能力。与大多数FL工作不同，本文从多目标优化（MOO）的角度同时提高了通信训练效率和局部训练精度。为此，作者提出了一种基于分解、DRL和迁移学习的FL MOO算法DRT-FL，旨在动态适应星地环境，实现高效上传聚合，并逼近pareto最优集合（多目标优化问题上的帕累托最优）。

# 简介

​	以往基于无线通信的FL研究主要集中在覆盖范围有限的地面系统中，这些研究未能充分展示FL整合边缘设备碎片化计算资源的潜力。当6G范式从地面网络向非地面网络（NTN）转移时，低轨道卫星（LEO）成为6G NTN的重要组成部分[4]。凭借广泛的覆盖范围和无缝连接能力，LEO可以作为FL中的中央服务器，用于聚合本地模型的参数并更新全局模型。

​	在LEO-FL系统中，现有研究仅在有限程度上探讨了相关问题，还有一些关键问题需要解决。首先，服务区域内只有部分设备可以参与FL本地训练，不同参与设备可能会影响全局模型的性能。因此，有效优化计算和通信资源尤为重要。其次，由于LEO的服务时间有限，需要在保持良好精度的同时减少整个FL过程中通信和计算所需的时间。

​	为了应对LEO-FL系统中的这些挑战，我们研究了一个LEO-FL系统，并通过联合确定设备选择、功率和计算资源分配，构建了一个多目标优化问题（MOP），以最小化全局模型收敛时间和通信-计算时间。据我们所知，这是首次尝试为LEO-FL系统研究高质量且高效的多目标优化（MOO）解决方案。

# 系统模型

## LEO-FL系统	

​	如图所示，我们考虑一种低地球轨道（LEO）卫星联邦学习（FL）系统，该系统包括一个装备了多天线的LEO卫星用于全局模型的共享和聚合，以及一组具有有限通信和计算资源的设备用于本地模型的更新和上传。我们将所有设备的集合记为 $M$。

![image-framework](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20241118004715742.png)

​	对于每个设备，它通过自身的本地数据集 D来更新其本地模型。该数据集包含 Dm个数据样本，每个样本x为特征，y为标签。考虑到LEO的**动态位置**和受限带宽，只有一部分设备参与FL训练。这些设备记为M'。

​	之后文章介绍了FL训练过程，包括T轮，就是寻常的FL过程，包括模型初始化、共享、更新上传、聚合等等。不作详细介绍了。本文考虑两种场景：一种是训练过程在单个LEO的服务时间内可以完成；一种是完成不了，当LEO离开服务区后全局模型就无法收敛或者准确率低。此时，下一个来的LEO需要重启FL训练过程。在这种模型中，作者考虑LEOs之间的协作，现有的全局模型可以由网关或者ISR传输。两种场景如图：

​	![image-两种场景](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20241127165608504.png)

## 通信建模

### 上行通信

​	在上行通信中，本地模型从被选中的设备传输给LEO。假**设利用设备位置、卫星轨道、速度等信息，可以在网关有效补偿高移动性LEO引起的多普勒频移**。在第t轮，LEO与设备m间的信道状态h建模为：$h_m^t=G_T\cdot G_C\cdot G_R$，即收发器天线增益相乘再乘以信道损失（假设是个Rician衰落模型，考虑到了大气损失衰减啥的）。在每一轮，被选中的设备m分配对应的子信道h后，能达到的上传传输速率则定义为：
$$
r_{m,u}^t=b_m^t\log_2\left(1+\frac{p_m^t\left(h_m^t\right)^2}{\sigma^2}\right)
$$
​	其中b和p是带宽和传输功率。$\sigma$是高斯噪音。这样第t轮第m个设备的上传时间就定义为： $L_{m,u}^{t,com}=\frac X{r_{m,u}^t}$，X是全局模型大小。这个时间再乘功率p就是对应设备的能耗$E_{m,u}^{t,com}$。

### 下行通信

​		作者考虑了一种block fading channel，h与上行一样。设备m的下行速率与通行时间定义为：
$$
L_{m,d}^{t,com}=\frac{X}{r_{m,d}^{t}}=\frac{X}{b_{leo}^{t}\log_{2}\left(1+\frac{p_{leo}(h_{m}^{t})^{2}}{\sigma^{2}}\right)}
$$
​	能量损耗同理。

### 计算模型

​	在系统中，设备只有有限的计算能力更新本地模型。定义设备m处理一个样本需要的CPU cycles数为c，样本集合D，$\mathcal{k}$是本地训练轮数，g是CPU频率，则计算时间为：
$$
L_m^{t,cmp}=\frac{\kappa c_mD_m}{g_m^t}
$$
​	由此计算能耗可以定义为：$E_m^{t,cmp}=\kappa\alpha_mc_mD_m(g_m^t)^2$，α是电容常数。

​	这里的g和上面的m都是从一个离散集合中取值，以代表一种等级分类。

### 通信-计算时间

​	在同步更新下，一轮的通信时间显然是要取max的，即：
$$
L^{t}=\operatorname*{max}\{s_{m}^{t}L_{m,d}^{t,com}\}+\operatorname*{max}\{s_{m}^{t}L_{m}^{t,cmp}\}+\operatorname*{max}\{s_{m}^{t}L_{m,u}^{t,com}\}
$$
​	s=1/0代表是否选择了该设备。能耗即求和：$E=\sum_{m=1}^{M}s_{m}^{t}\left(E_{m,d}^{t,com}+E_{m}^{t,cmp}+E_{m,u}^{t,com}\right)$。

​	在本文系统模型中，作者旨在同时优化设备选择和资源分配，以同时实现全局模型训练收敛和减少通信-计算时间。为此，MOP问题建模为：

![image-](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20241127174816704.png)
