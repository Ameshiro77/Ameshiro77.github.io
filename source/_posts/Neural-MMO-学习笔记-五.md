---
uuid: eedd5010-ee27-11ed-829d-5d2702ea4b08
title: Neural MMO 学习笔记(五)
author: Ameshiro
top: false
toc: true
mathjax: true
copyright_author: Ameshiro
description: 关于openai的neural mmo学习笔记
cover: 'https://s2.loli.net/2023/05/09/X3yjH7hzZsR6Adb.jpg'
tags:
  - Newral MMO
  - 强化学习
  - 多智能体
  - 在线学习 离线学习
categories:
  - Neural MMO
abbrlink: d4086348
date: 2023-05-09 13:11:19
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

​		之前我们是运行了NMMO的示例，并且看到了示例的结果。除去代码层面，还是得要结合一下文档和强化学习的相关学习的。学习NMMO的主要目标，并不是跑一个游戏模型，而是说——如何利用这个框架，实现在**大型**环境下的**高效**学习。

​		官方文档写到：

![image-20230509132326377](https://s2.loli.net/2023/05/09/PSrYtQvomZzRqfH.png)

​		Neural MMO 提供标准环境配置以及脚本模型、使用 CleanRL 预训练的基线以及 WanDB 托管的训练/评估日志。什么是CleanRL?它是是一个深度强化学习库，它提供了高质量的单文件实现，具有研究用的功能。github如下： [vwxyzjn/cleanrl: High-quality single file implementation of Deep Reinforcement Learning algorithms with research-friendly features (PPO, DQN, C51, DDPG, TD3, SAC, PPG) (github.com)](https://github.com/vwxyzjn/cleanrl)。不过CleanRL只包括在线强化学习的实现——什么是在线强化学习？

![image-20230509133310393](https://s2.loli.net/2023/05/09/KbZY5jTpik73sXQ.png)

​		注意这里的用词：**online而不是on-policy**。on/off policy （同/异策略）强调采样和更新的策略是否相同：

![image-20230509133920041](https://s2.loli.net/2023/05/09/w9KZMWyN58gd3iB.png)

​		说白了就是：看更新Q值用的方法是沿用既定的策略还是用新策略。		

​		而on/off line是指，比如说我在玩超级马里奥，在线学习是我边玩边学，第一关没过我就学到了很多；而离线学习是我死了或者过了第一关后，我开始回顾并且更新策略。它强调更新权重的时机。

​		**（所以我强烈推荐写强化学习博客的同学在写在线学习的时候写清楚是on-policy还是online）**
