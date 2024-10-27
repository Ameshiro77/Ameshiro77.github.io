---
uuid: 2e066710-d233-11ed-93a1-73ec9b9f0852
title: Neural MMO 学习笔记(一)
author: Ameshiro
top: false
toc: true
mathjax: true
copyright_author: Ameshiro
description: 关于openai的neural mmo学习笔记
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
tags:
  - Newral MMO
  - 强化学习
  - 多智能体
categories:
  - Neural MMO
abbrlink: f9226073
date: 2023-04-03 23:21:17
updated:
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

# 什么是Neural MMO？

## 概述

​		首先，我们可以访问Neural MMO的官网获取信息：[Neural MMO: A massively multiagent game environment (openai.com)](https://openai.com/research/neural-mmo)

​		![image-20230403232817474](https://s2.loli.net/2023/04/03/vDYLzVCFXaTKiO8.png)

​		对于经常打游戏的同学来说，MMO这个名字应该不会陌生。MMO是指大型多人在线游戏 (Massively Multiplayer Online);而我们的Neural MMO正是一个用于多智能体强化学习的游戏环境。这个环境提供许多智能体（数量可以变化），并且让他们在一个持久、开放的任务中进行工作。这样一个智能体与其他各种生物实体的集合带来了更好的探索、不同的生态位（niche）形成以及更出色的整体竞争力。

​		其代表性论文如下：[[1903.00784\] Neural MMO: A Massively Multiagent Game Environment for Training and Evaluating Intelligent Agents (arxiv.org)](https://arxiv.org/abs/1903.00784)

## Neural MMO环境与训练

​		智能体们可以加入任何环境，对于每一个环境都包含一个自动生成的游戏地图。这个地图叫tile maps，其地图环境包含不能穿越的水和石头、以及可以穿越的森林等等。在每一个时间戳里，每个智能体要观察自身一定半径内的地图，进行一次移动并且发动攻击。站在森林里、水边可以获得食物和水，但是这些资源是有限的；攻击方式有近战、远战、法术等可以选择。这就相当于模拟了一个生态系统，许多智能体在这个系统中进行生存竞争，锻炼出他们的探索能力和整体竞争力。

![](https://s2.loli.net/2023/04/04/GH4fkKvq6Fogp2P.png)

​		OpenAI使用NMMO训练了一个AI，奖励award为智能体生存的时间。他们发现：

· 智能体彼此交互越久，那么他们表现越好。同时存在的智能体越多，探索效果越好。

· 增加智能体种群规模可以促使他们分散到地图不同区域；大环境的训练效果优于小环境。

## 其他的多智能体强化学习环境

​		本部分参考自：[常见多智能体强化学习仿真环境介绍【一】 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/592544395)



# Neural MMO安装

​		首先进入NMMO的introduction界面：[Introduction — Neural MMO v1.6.0 1.6.0 documentation](https://neuralmmo.github.io/build/html/rst/landing.html#icon-installation) 可以看到它给我们的提示方法是：

![image-20230404145651712](https://s2.loli.net/2023/04/04/lTEDKBeCUoN84gR.png)

​		我装了很久，但是一直报Twisted相关的错：

![image-20230404145729883](https://s2.loli.net/2023/04/04/rD6bidJqPQuymSE.png)

​		网上也找了很多方法，但是都没有用。鉴于官方安装步骤是以Ubuntu、WSL和MacOS来的，打算先试试WSL（还没成功，暂且请不要跟着做..）。

​		安装WSL Ubuntu20.04，参考链接：[win10开启wsl系统，让我们愉快的在windows上使用Linux_DLGG创客DIY的博客-CSDN博客](https://blog.csdn.net/tiandiren111/article/details/120984740)

​		这里注意一下，不要随便改安装路径，比如微软商店安到C盘就不要改别的盘，因为这玩意必须安到系统驱动盘。否则初始化的时候你的用户名没法输入的。之后安装anaconda，然后进行一系列操作，但是我还是没成功... 后续见下一篇笔记~


