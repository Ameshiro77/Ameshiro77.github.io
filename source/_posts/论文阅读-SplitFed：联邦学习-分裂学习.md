---
uuid: 4f854890-9c01-11ef-b038-1157642dea74
title: 论文阅读-SplitFed：联邦学习+分裂学习
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
date: 2024-11-06 13:38:11
updated:
description:
img:
top_img:
password:
summary:
tags:
  - 联邦学习
  - 分裂学习
  - 论文阅读
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

​	地址：[[2004.12088\] SplitFed: When Federated Learning Meets Split Learning](https://arxiv.org/abs/2004.12088)

# 摘要

​	联邦学习和分裂学习（FL和SL）是两种受欢迎的**分布式机器学习**方法。这两种都遵循一种model-to-data的场景；客户端无需要到raw data就可以训练、测试模型。SL还比FL提供了更好的模型隐私，因为模型会在服务器和客户端之间分隔开（就比如Conv1（S）->Conv2(C1)->Conv3(C2)...）。但是，比起FL，SL这种训练方式肯定更慢，因此本文提出一种新的方法叫splitfed（SFL），增强数据隐私和模型鲁棒性，在测试精度、通信效率上都表现良好。

# 简介

​	FL在分布式客户端上分别根据本地数据训练一个完整的模型，但是一些资源受限的客户端可能没法跑整个模型，且从模型隐私角度讲有隐患。为此，SL被提出：将完整的模型分成更小的一些网络部分并在服务器、客户端群上训练。这样，客户端减少了计算负载，且服务端、客户端无法互相访问模型。不过尽管如此，SL也有个问题：其中继式的训练使得同时只有一个客户端会与服务器交互，这样就增加了训练时间开销。（就是不并行的意思吧应该。）本文在四种数据集上用四种网络比较了SFL的通信效率、模型精度。

![image-不同分布式方法的比较](https://cdn.jsdelivr.net/gh/Ameshiro77/BlogPicture/pic/image-20241106143233914.png)

​	

# 框架

​	





























