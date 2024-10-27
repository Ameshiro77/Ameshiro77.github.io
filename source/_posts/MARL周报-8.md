---
uuid: 187e4050-5453-11ee-a212-41d81128d9c6
title: MARL周报(8)
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: true
categories:
  - MARL周报
abbrlink: 3f05a895
date: 2023-09-16 13:37:16
updated:
description:
img:
top_img:
password:
summary:
tags:
copyright:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:
---

​		本周主要调研了多智能体强化学习的MFVFD的方法，作为一篇2021年的论文，MFVFD将平均场理论和值分解方法结合，使得可以实现不同类型智能体的多智能体强化学习：[MFVFD 论文阅读 | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/dbeda41.html)

​		我们的项目是大规模多智能体场景，用于智慧城市或人口流动模拟，所以我认为我们项目的智能体应该算**同类型的（因为有着相同的动作空间，状态维数也是相同的，这方面没找到太严谨的定义，但应该大差不差）**当然，目前我使用的Magent环境也可以认为是同类型的。那么目前主流的多智能体强化学习方法可以分为两种：

​		第一种是：CTDE范式，也就是集中训练，分布执行。这种方式有个问题，就是因为要集中训练，它会有一个集体的Q函数，当智能体规模变得很大的时候，联合动作空间会巨大无比，Q函数的训练将非常艰难。也因此，有许多值分解(VFD)的方法被提出，来分解这个集体的Q函数。著名的MADDPG也是这种范式下的。

​		第二种方法，就是我目前在调研的平均场强化学习，是由2018年提出的。它解决了大规模维度灾难的问题，但是它依赖于全局观测，且要求多智能体同质。

​		因此，我们在做多智能体项目的时候，可以从以下三点考虑：**1.智能体规模；2.是同类型还是不同类型（同构or异构）；3.智能体是否能获得全局观测**，**还是说只能有局部的观测。**这篇论文之所以做到了大规模智能体下，不同类型依赖于局部观测的多智能体学习，是因为它把平均场理论中，把原先依赖于全局状态的每个智能体的Q，分解为了它的局部Q+邻居平均Q的和。文章的数学东西比较多，目前还在看中；另外作为近些年很常用的PPO算法（一些多智能体强化学习平台用的它作为基线），想看看它能否与平均场理论结合。

