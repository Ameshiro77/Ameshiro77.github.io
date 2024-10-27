---
uuid: e4c8a2d0-dc72-11ed-abac-911b764ef699
title: Nerual MMO 学习笔记(三)
author: Ameshiro
top: false
toc: true
mathjax: true
copyright_author: Ameshiro
cover: 'https://s2.loli.net/2023/04/17/OBvF3W8PDR791bo.jpg'
tags:
  - Newral MMO
  - 强化学习
  - 多智能体
categories:
  - Neural MMO
abbrlink: 3e735cb4
date: 2023-04-17 00:22:34
updated:
description:
img:
top_img:
password:
summary:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:
---

​		上次说到，我们可能遭遇了关于ray这个库的版本上的问题。所以在这里，先了解一下ray是干什么的，以及相关资料。

​		首先介绍一下ray是干什么的：ray是一个用于分布式计算的多功能框架。ray依赖于高效的c++代码，以及优雅而简单的python API。从机器学习的角度来看，它有两个主要优点：1.它可以用于将流行的工具如Spark和Tensorflow/Pytorch捆绑在一个集群中，并为两者之间的数据传输提供优雅的选项。2.当你需要大量的机器学习特别是深度学习的时候，它可以提供分布式计算能力。

​		简单的说，今天的机器学习需要分布式计算。无论是训练网络、调整超参数、服务模型还是处理数据，机器学习都是计算密集型的，如果没有访问集群，速度会非常慢。而ray 是一个流行的分布式 Python 框架，它可以与 PyTorch 配对，以快速扩展机器学习应用。

![preview](https://s2.loli.net/2023/04/17/9nkE8IFxelgi5Ao.png)

​		参考链接：[程序员 - PyTorch & 分布式框架 Ray ：保姆级入门教程 - 超神经HyperAI - SegmentFault 思否](https://segmentfault.com/a/1190000039283586)

​		那么什么是分布式计算和集群？

​		随着计算技术的发展，有些应用需要非常巨大的计算能力才能完成，如果采用集中式计算，需要耗费相当长的时间来完成。

​	     分布式（distributed）是指在多台不同的服务器中部署**不同**的服务模块，通过远程调用协同工作，对外提供服务。不同服务器中部署不同的功能，通过网络连接起来，组成一个完整的系统。

![image-20230417003653966](https://s2.loli.net/2023/04/17/WAqbORZnhv6zwce.png)

​		集群（cluster）是指在多台不同的服务器中部署**相同**应用或服务模块，构成一个集群，通过[负载均衡](https://so.csdn.net/so/search?q=负载均衡&spm=1001.2101.3001.7020)设备对外提供服务。在不同的服务器中部署相同的功能。

![image-20230417003715760](https://s2.loli.net/2023/04/17/x9NacUy2ZHCmf6G.png)

（图源[什么是分布式和集群？它们有什么区别_DUT_子陌的博客-CSDN博客](https://blog.csdn.net/qq_49948651/article/details/127003662) 侵删）

​		基础概念讲完了，该研究一下ray的相关资料了。上文我们讲到，官方提供的ray版本是0.6.2，但是我们无法pip install。我们直接去pip官网看看0.6.2版本：

![image-20230417003940384](https://s2.loli.net/2023/04/17/mMyFedYTgESP65X.png)

​		好家伙，这下知道为什么下不了了，同时也理解了为什么Neural MMO官方只提供了WSL、Ubuntu、macos三种系统下的安装方式，原来这玩意是真不兼容windows啊。事实上，ray的高版本开始支持windows，但是并不稳定，可能会有很多错误。同时，我在WSL上成功安装了nmmo，但是因为WSL上的anaconda环境有些问题，我还是打算用VM虚拟机继续进一步实现了（其实我不太想用虚拟机，一个是太费空间了，第二个是我的虚拟机总是明明没怎么用、有很大空间却总是说没地方下东西了，第三个是有时候会崩。。）

​		**所以第一个重要结论：请务必用linux系统完成这个项目...**想起以前有个博士学长给我说windows会有一堆问题，没想到这么快就碰的我脑壳晕..

​		打开VM，新开个虚拟机（硬盘开大点），**记得要apt install一下gcc和python3-dev**，否则有些库是安装不了的。然后下载anaconda，安装，接着开个虚拟环境，这些过程都没啥说的。先开个python版本为3.7的虚拟环境，尝试跑一下openai发布的neural mmo那个github的代码：

[openai/neural-mmo: Code for the paper "Neural MMO: A Massively Multiagent Game Environment for Training and Evaluating Intelligent Agents" (github.com)](https://github.com/openai/neural-mmo)

​		由于他需要ray版本是0.6.2，但是这玩意pip install不了，只能去pypi.org找历史发布版本然后安装了。之后运行它说的代码，结果遇到了一个很让人摸不清头脑的问题：

![image-20230418004958567](https://s2.loli.net/2023/04/18/WMqfrB2QAO8DXaY.png)

​		他说找不到这个模块，但是实际上这个embyr是一个不属于任何类型的文件，所以压根不能导入它。。而且，这个github要求python版本要不能超过3.7，因为ray0.6.2只支持3.7及以下；而nmmo官方介绍里的python版本又必须到3.9，否则不能安装nmmo这个package。。简直乱的我头皮发麻。

​		只能先不管这个github了，先看看官方介绍给出的，也就是这些：（记得开个py版本是3.9的新环境）

![image-20230418005451549](https://s2.loli.net/2023/04/18/iuP1qmwhUclKGsZ.png)

​		由于使用了linux版本，我们终于可以愉快地下载nmmo库了。但是用这条指令安装的库巨多：

![image-20230418005641218](https://s2.loli.net/2023/04/18/bmKR8PdlTDuCHev.png)

​		而且占的空间也很大，所以之前会提醒虚拟机稍微开大点。。按照它说的，我们先去搞个wandb api key：[Weights & Biases (wandb.ai)](https://wandb.ai/authorize)  然后echo到文件夹里。不得不说他这个官方文档也非常混乱，上面让我clone git下面又让我clone，根本看不懂顺序，而且执行下面的pip install -e -[all]后还把我nmmo给uninstall了就离谱。之后，我们运行python -m demos.minimal：

​		结果这里又报错：

![image-20230418010127664](https://s2.loli.net/2023/04/18/5cY7BMgnzDskEfP.png)

​		大概百度了一下说是循环调用的问题，但是我看了半天源码根本看不出哪里循环调用了，而且源码也不能乱改。。于是大胆猜测是不是版本问题，联想到现在pip list出来的nmmo版本是1.7而最开始pip install nmmo（没加[cleanrl],nmmo[cleanrl]的意思是nmmo增加了对cleanrl的支持，cleanrl是另一个强化学习库）安装的版本是1.6，外加1.6是去年九月发布的而这些github的最后更改时间也是去年九月，于是pip install nmmo==1.6.0.6试试，果然不报错了。。最后运行控制台是这个样子：

![image-20230418010656681](https://s2.loli.net/2023/04/18/aNghYerktKwM5dT.png)

​		**不过之前不小心非正常途径把他停止了，导致进程依然在占用，所以再次运行会报错：**

![image-20230418011111547](https://s2.loli.net/2023/04/18/lIJorjfTUHhi7Et.png)

​		这个时候需要指令 sudo lsof -i:8080 （8080是开的端口，它这个代码默认是开到了8080）查看pid，然后sudo kill -9 {pid}.如下：

![image-20230418011225432](https://s2.loli.net/2023/04/18/rWzdVbkZHAxqs26.png)

​		再次运行就可以了。然后浏览器localhost:8080 看看是啥东西：

![image-20230418011441403](https://s2.loli.net/2023/04/18/tRvDAyPSs1dMmOl.png)

​		我直接打出一个问号，这是直接把我文件夹放到端口上去了，可是官方文档里的那些游戏界面呢？可能到目前为止我们只完成了库的安装吧，毕竟到现在为止只是user guide部分。。之后继续研究官方文档教程了，希望早日能看到图形化界面（而且我的linux运行不了他们给出的unity做的.exe）... 
