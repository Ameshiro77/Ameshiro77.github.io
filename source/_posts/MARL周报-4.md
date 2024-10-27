---
uuid: fe982140-4815-11ee-b23c-df8192d3bac8
title: MARL周报(4)
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: true
abbrlink: 93b0e799
date: 2023-08-06 23:49:39
updated:
description:
img:
top_img:
password:
summary:
tags:
categories:
  - MARL周报
copyright:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:
---

​			这两周对一些多智能体强化学习的环境做了研究。参考：[(35 封私信 / 80 条消息) 有哪些常用的多智能体强化学习仿真环境？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/332942236)

​		目前许多框架是以petting zoo为基本搭建的。目前petting zoo对windows并不是很友善，MADDPG的论文MPE环境就是基于它的。同时，面对大规模多智能体，除了NMMO外，还有MAgent。游戏环境，星际争霸2因为暴雪停服而凉了，此外还有Unity ML-Agents。

​		这两周尝试了Unity ML-Agents，也折腾了好久跑通了，并且有了结果：

<img src="https://s2.loli.net/2023/08/18/qfvx6hAt72glByp.png" alt="image-20230818191756319" style="zoom:67%;" />

​		但是！这个环境如果要自定义算法的话非常麻烦，内置算法只有PPO，也翻阅了哔哩哔哩一些up的资料，都说unity ml-agents的环境很难自定义修改..因此尝试了两周不得不放弃了。

​		另外，这些环境很多在windows都是跑不通的，只能开着虚拟机去运行。。Magent的环境更是重量级，它现在迁移到v2.0版本了，但是pip install的包和它github的包竟然严重不一致以至于必须自己手动复制到site-package里。
