---
uuid: 3f153400-d7b5-11ed-94c1-7b98ea69a6d5
title: Nerual MMO 学习笔记(二)
author: Ameshiro
top: false
toc: true
mathjax: true
copyright_author: Ameshiro
cover: 'https://s2.loli.net/2023/04/11/JFQOKRAnXuZSBUx.jpg'
tags:
  - Newral MMO
  - 强化学习
  - 多智能体
categories:
  - Neural MMO
abbrlink: 40807c9f
date: 2023-04-10 23:34:56
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

​		首先按照这个官网的挨个来：[Introduction — Neural MMO v1.6.0 1.6.0 documentation](https://neuralmmo.github.io/build/html/rst/landing.html) 

​		<img src="https://s2.loli.net/2023/04/10/zFsWn2Iw7oh4ker.png" alt="image-20230410233958750" style="zoom:80%;" />

​		首先是介绍：它说Neural MMO是一个开源且可计算访问（不太明白这俩词合在一起啥意思）的研究平台，一大堆智能体联合生存+探索+战斗持续数小时，以以及完成任务。它在其他环境下这种大规模的研究可能不切实际或不可能进行，也就是NMMO具有大规模的特点。

​		之后它贴了一串代码：

<img src="https://s2.loli.net/2023/04/10/Jk1YAVsf6T2hXzW.png" alt="image-20230410234510556" style="zoom:80%;" />

​		但显然我们目前没法安装nmmo，暂时没法试这个。但是我去pip库找的时候发现了一个叫neural-mmo的库，可能是nmmo库的历史版本（我猜的），不过暂时还没试。这个Env提供了标准的Petting Zoo API，详见：[Pettingzoo：类似gym的多Agent强化学习的环境 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/375049925)

​		之后它说NMMO是把经典MMO开发的技术应用到深度学习，并且介绍了一般的工作流程：

<img src="https://s2.loli.net/2023/04/10/8Juoi5jDTX3atsv.png" alt="image-20230410234919966" style="zoom:80%;" />

​		也就是生成环境——训练智能体——行为可视化。

​		之后它让我们安装nmmo（虽然目前安不上），以及clone三个库。

<img src="https://s2.loli.net/2023/04/10/yrtGjI1Win8M5Jg.png" alt="image-20230410235041834" style="zoom:80%;" />

​		但是这三个库暂时压根不知道是干啥的，虽然在client里有一个unity的应用程序可以运行，但打开后的界面看不太懂，因为不管怎么操作都没有反应，就先不管这个了。。

<img src="https://s2.loli.net/2023/04/10/eGdlY7KwfIPuaNg.png" alt="image-20230410235201312" style="zoom:80%;" />

​		到这里官方文档的User Guide就结束了，是不是感觉一头雾水。**比较坑的是，这里还有一个仓库没有提及**，我也不知道当时怎么找找到的这个github。这是由openai所发布的一个仓库,与上面那三个仓库是不同源的，地址为：[openai/neural-mmo: Code for the paper "Neural MMO: A Massively Multiagent Game Environment for Training and Evaluating Intelligent Agents" (github.com)](https://github.com/openai/neural-mmo) 		下载这个仓库，参考仓库里面的README.md，运行setup.py（前提是下载了scripts/setup/requirements.txt里面的库（有个坑后面会说））。此时很有可能会报一个错，是说opensimplex函数参数过少，我去pip包官网查阅了一下，发现应该是版本的问题。pip list的话可以看到，版本是0.4，我们改成0.2：

```python
pip install opensimplex==0.2
```

​		同时，会报一个scripy的错，说是没有imread、imsave。这也是版本问题，但是我直接下载老版本会出问题，解决方法是用另一个库：imageio

<img src="https://s2.loli.net/2023/04/04/2AlxoveERj98Uz7.png" alt="image-20230404155701010" style="zoom:80%;" />

​		pip install这个库，然后代码改成上图即可。

<img src="https://s2.loli.net/2023/04/04/SEnY72NxryfCVt5.png" alt="image-20230404155728039" style="zoom:80%;" />

​		到此可以看出setup.py运行完毕，这个命令的作用应该是生成地图，在resource/maps/procedural里可以看到我们生成的地图。

<img src="https://s2.loli.net/2023/04/10/dKGAaS67PbwOH1D.png" alt="image-20230410235641217" style="zoom:80%;" />

​		根据README.md里面的Quickstart，我们下载好了NMMO的环境和独立客户端，以进行渲染。注意python版本要3.6+，且拥有pytorch。之后按照它说的：

```python
python Forge.py --render #Run the environment with rendering on
```

​		结果又报了个错： AttributeError: module 'ray' has no attribute 'PYTHON_MODE'。估计又是版本的问题，因为它说的ray版本是0.6.2，但是pip install根本没办法下载版本这么低的ray了。。之后再查文档改一下吧，麻了
