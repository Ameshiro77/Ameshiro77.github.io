---
uuid: 8b389890-f73a-11ee-b863-a5198ae5a4e5
title: 'HOI琐碎闲聊(二):HICO-DET数据集分析'
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
tags:
  - CV
  - HICO-DET
  - 人/物交互检测
categories:
  - CV
abbrlink: aa8856cc
date: 2024-04-10 21:02:11
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

最近在利用stable diffusion模型人工生成数据集，我们知道，HICO-DET包括117种动作，600种hoi类别，这600种hoi类别有着非常明显的长尾分布问题，如图所示：

<img src="https://s2.loli.net/2024/04/10/Qmflu1owTaHC7pY.png" alt="image-20240410213107117" style="zoom:50%;" />

至于动词，也有着很明显的长尾分布，不过我们主要考虑hoi三元组的分布。可以看出，大概前160个类别的数量非常稀少，我们打印出这160个类别对应的prompt的一部分(大概70个):

<img src="https://s2.loli.net/2024/04/10/HIowjkpNtl3QCxq.png" alt="image-20240410221259903" style="zoom:67%;" />

​		使用扩散模型生成虚拟数据集时，可以利用clip再过滤。以下是使用CLIP计算相似度结果，前者是正常配对，后者是错误配对(每个图片与上一个图片的提示词配对)：

<img src="https://s2.loli.net/2024/04/13/QkOFMh6K1NVa9td.png" alt="image-20240413194832046" style="zoom: 50%;" />

<img src="https://s2.loli.net/2024/04/13/tbrmhXovFizn7Yk.png" alt="image-20240413194847872" style="zoom: 50%;" />

​		可以看出，我的实验中，大致的分水岭是0.25。进一步取500个图，画两张图：一种编码的text是非完整的prompt，只包括动词名词；另一类是原生prompt，结果见下。上图是非完整的，下图是完整的。

<img src="https://s2.loli.net/2024/04/13/x2pCfYGHViNyFE5.png" alt="image-20240413195630035" style="zoom: 50%;" />

![image-20240413201140788](https://s2.loli.net/2024/04/13/xUcQkvpj71HimoP.png)

​		二者基本无差。再检查低于0.25的图片时，一个神奇的现象是：大多数图片都是no interaction的图片，比如：

<img src="https://s2.loli.net/2024/04/13/c4PdI73vODxLMzF.png" alt="image-20240413201457256" style="zoom:50%;" />
