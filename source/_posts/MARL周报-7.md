---
uuid: 49e20490-481b-11ee-83ce-7bf4b6d3f2b0
title: MARL周报(7)
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: true
abbrlink: b89db45a
date: 2023-09-01 00:27:33
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

假期周报汇总：

[MARL周报(1) | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/eec713dc.html) 想了想要干啥

[MARL周报(2) | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/c5ea401f.html) 开始单智体学习，实现了简单的代码熟悉一下

[MARL周报(3) | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/ea484025.html) 接着想了想要干啥，调研了一些框架的论文 

[MARL周报(4) | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/93b0e799.html) 尝试了许多现有的多智能体强化学习环境，本来打算使用unity ml-agents但是很难自己定制算法，但对于现有环境以及MARL任务分类有了认知。

[MARL周报(5) | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/8aabd6d8.html) 学完了单智体，并总结成了详细的笔记（在个人网站）以便以后反复观看：[分类: 强化学习 | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/categories/强化学习/)。 开始学多智能体，环境选定了Magent并虚拟机上跑起来了。		

[MARL周报(6) | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/a186851b.html) 详细调研了最重要的论文：MFMARL相关的论文，即平均场强化学习，适合大规模多智能体强化学习（比如智能城市，MMO等等），并且在虚拟机上复现了。代码也在一行一行仔细读。MF结合的MARL是目前我研究的主流。

[MARL周报(7) | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/b89db45a.html) 额也就是这篇

​		确立了方向：把平均场理论与其他算法（比如现在最流行的PPO算法）结合起来，或者说实现一些改进；之后应用到其他的大规模多智能体环境，比如NMMO，或者自己实现一个仿真环境（当然自己实现非常困难，得看之后有没有这个水平了。。）。 这些是算法的方面，面对大规模多智能体，还有利用Ray库等等实现分布式训练的方法，这些会在以后进一步使用NMMO的时候研究（因为现在NMMO更新到2.0了）。最大的问题是：分布式训练是否会和算法产生干扰？如果可以实现：分布式训练的每个训练模块都利用各自种群的平均场的话就好了，因为现在的大规模智能体基本都是利用的基于种群的思想。

​		在调研时，找到了一篇把MF和PPO结合的论文，是在2021年发表的：[[2105.08268\] Permutation Invariant Policy Optimization for Mean-Field Multi-Agent Reinforcement Learning: A Principled Approach (arxiv.org)](https://arxiv.org/abs/2105.08268)  这一篇论文比较冷门，数学更为艰涩难懂，也暂时没有找到对应的代码，只能看之后能不能复现了。。另外，也寻找到了一篇论文，https://www.ijcai.org/proceedings/2021/0070.pdf。这篇论文直接说，MF的方法存在特殊情况使得无法收敛，因此提出了MF与VFD(值分解)结合的方法：MFVFD。我们知道呢，PPO也是基于AC框架的（实际上MF论文作者的代码给出了MF-Q和MF-AC，应该可以利用一下），主要在Actor上作更新；而VFD是critic部分的，二者能否结合在一起呢？这篇论文也暂时没找到相关代码，所以还得我自己慢慢读。。

​		在MAgent环境中实现算法后，会考虑往更大的环境作迁移。总之现阶段的目标就是：搞懂MF的原理和代码，然后把PPO和VFD的思想应用到MF，看算法能不能收敛，能不能取到更好的效果。**主要是假期现在得准备复试笔试，没太多时间。。QAQ**
