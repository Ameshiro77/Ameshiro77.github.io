---
uuid: f81c3a20-e2b9-11ed-a38a-792cf66fffdb
title: Neural MMO 学习笔记（四）
author: Ameshiro
top: false
toc: true
mathjax: true
copyright_author: Ameshiro
description: 关于openai的neural mmo学习笔记
tags:
  - Newral MMO
  - 强化学习
  - 多智能体
categories:
  - Neural MMO
abbrlink: a719dae3
date: 2023-04-25 00:06:27
updated:
img:
cover: https://s2.loli.net/2023/04/25/6erUumpBsXHM7kl.jpg
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

​		写这篇笔记的时候也在学习强化学习相关知识，移步：[强化学习（一） | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/34960eab.html)

​		上文说到我们希望运行出一个游戏界面，而之后我发现是经典读东西读不全的问题，官方文档给出的提示是让我们运行demos.minimal后去运行client里的可执行文件，而非用浏览器打开对应端口（虽然不知道为什么引入了three.js库（做图形学用过这个），但他的示例是用unity做的）。教程还贴心的告诉我们要运行符合系统的可执行文件，我之前之所以运行不了是因为运行了上次在windows下用的.exe。本文先按照官方文档的TUTORIALS的教程来。

​		顺便解释个名词：`scripted_agent`：动作由自定义脚本所控制的智能体。

# Minimal Example

​		这个示例让我们渲染智能体所在的环境。运行baselines中的minimal后，来到client/UnityCilent中,启动右边这个exe。

![image-20230425123810351](https://s2.loli.net/2023/04/25/8Q2iS9LxJPvFyIZ.png)

​		可以看到如下界面：

![image-20230425123948469](https://s2.loli.net/2023/04/25/6BYLCPmA7SOqwaz.png)

​		按tab隐藏下面文字；使用鼠标中键可以调整视角以及进行缩放。按右键可以拖动位置。我们放大视角，选定一个agent，可以对其进行follow：

![image-20230425124543867](https://s2.loli.net/2023/04/25/wMDgTHoQSjNRqea.png)

​		至于下面的commands，目前还没有找到有什么用。另外，这个unity游戏甚至找不到退出键，必须得**alt+F4**才行。。

# Config Classes

​		Neural MMO提供了小型、中型、大型预设的基本配置，以及一套游戏系统。通过对预设子类化(大概就是python对子类的定义)来启用游戏系统。比如默认配置是：

![image-20230425131538638](https://s2.loli.net/2023/04/25/ZUVzdIKOx1kcePT.png)

​		而在我们刚才所运行的minimal中，就指定了config:

![image-20230425132433003](https://s2.loli.net/2023/04/25/C86Nj3LMa4VTDY5.png)

​		可以看出用的是中型预设。地图将根据提供的配置在环境实例化时生成，并存放在PATH_MAPS里以供重用。如果主动调整terrain（地形）生成参数，要像上图里设置MAP_FORCE_GENERATION = TRUE。（文档写的是FORCE_MAP_GENERATION不知道为啥）

​		当然也可以通过覆盖预设和游戏系统配置参数来自定义地形生成和游戏平衡：

![image-20230425133455292](https://s2.loli.net/2023/04/25/yAGqvSlOdcXgUD3.png)

​		使用config的话，就把自己设定的config当成simulate()的参数就行了。（应该是）

![image-20230425133554611](https://s2.loli.net/2023/04/25/nixbzoEdrDLk4qm.png)

​		源码的simulate()如下：

![image-20230425133639963](https://s2.loli.net/2023/04/25/MOfbEFj1WxCzr7m.png)

# Scripted API

​		暂时没看懂这是在干啥。源代码里捏了个LavaAgent，这个Agent喜欢没事就往岩浆里跳，通过nmmo.Agent的子类来实现。这一部分提到了observation和wrapper  class，之后再看看。



# Rewards & Tasks

​		默认情况下，Neural MMO为死亡提供-1的奖励信号，其他行为信号为0.当然我们可以自己覆写奖励。如下：

![image-20230425135312956](https://s2.loli.net/2023/04/25/BSp3ZPeqRgDy1mO.png)

​		这是插入了一个新属性kills。*hasattr*()函数是用来判断一个对象是否包含对应属性的。这段代码是增加了一个奖励机制：对每一个击败的玩家增加0.1的奖励。比如击杀了两个，就加0.2。当然了，如果只这么加的话，智能体就会总想着杀人而不参与农业了。

​		暂时看到这，看代码的时候还得继续看强化学习的知识。。
