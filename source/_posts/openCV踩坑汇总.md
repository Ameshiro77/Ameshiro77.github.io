---
uuid: 472efce0-f013-11ed-9c61-c1f17f7f5305
title: openCV踩坑汇总
author: Ameshiro
top: false
toc: true
mathjax: true
copyright_author: Ameshiro
description: opencv踩坑记录贴
cover: https://s2.loli.net/2023/05/11/gtmGrZEuaHFh4dA.jpg
tags:
  - 计算机视觉
  - openCV
categories:
  - openCV
abbrlink: 4e9580a4
date: 2023-05-11 23:48:30
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

​		opencv总是在许多地方设定一些奇奇怪怪的反常识的坑，此贴以供记录。本帖主要记录python的opencv；同时对于有些版本引起的问题可能无法涉及。

# 图像的shape：并不是宽比高

​		假设我们现在有一张1920*1080的图片，我们用img = cv2.imread("1.png") 去读取，然后输出image.shape，会得到：

```
(1080, 1920, 3)
```

​		**可见img.shape输出的是：高、宽、通道数。但尤其注意，resize的时候，cv2.resize()输入的是(宽，高)而不是(高，宽)！！**

​		**另外，openCV的通道排列是B、G、R。**

# 普通棋盘版标定规则

​		（应该是这样，老师讲过但是有点记不得了）首先，请确保您的标定板的行列角点数是一奇一偶。在openCV的实现中，角点的排列顺序时：**以奇数角点的方向为x轴，以偶数角点的方向为y轴；以黑色方块角落为原点**。可能听起来比较绕，看下图：

<img src="https://s2.loli.net/2023/05/12/v5MuA62tkdgZOpB.png" style="zoom:80%;" />

​		这是openCV画出来的角点，我们每行是9个角点，每列是10个角点，所以向右是x轴，向下是y轴。然后，我们从原点角点开始，向右且逐行地扫描角点。

​		**为什么我们要关注这个？因为要建立世界坐标系下角点和像素坐标系下角点的一一对应关系，这样你世界坐标系的点也这么排列，就能建立起来对应关系了。否则标定结果是完全错误的。**		

​		还是举个例子，比如这个图中，我们棋盘格世界坐标系下角点间距13mm，那么输出世界坐标系中的角点坐标（部分）：

<img src="https://s2.loli.net/2023/05/12/5RxUXyAFEVqljMg.png" alt="image-20230512001350674" style="zoom:80%;" />

​		接着，输出像素坐标（**为什么不是整数？或许是因为插值，还请高人指点**）：

<img src="https://s2.loli.net/2023/05/12/bCNpFr3vsIiLnR6.png" alt="image-20230512002858656" style="zoom:80%;" />

​		(这里我只截图了部分，但实际输出就是九个一换行，是一一对应的)

​		最后，来一张我老师的标定板吧，这个是标准的标定板格式。

<img src="https://s2.loli.net/2023/05/12/485KaYW3ulXrMUo.png" alt="image-20230512003042241" style="zoom:80%;" />



# 鱼眼相机标定

​		在python里用cv2.fisheye.calibrate的时候是没有提示的，但是其实是有这个模块的。如果按照普通标定板，参考官网教程的话，它的objectpoints是(N,3)的：

<img src="https://s2.loli.net/2023/05/12/vwIBSyA2MEiF94n.png" alt="image-20230512105333290" style="zoom:80%;" />

​		但是如果你直接用这个points作鱼眼相机标定函数的参数的话，会报错：

```
opencv-python\opencv-python\opencv\modules\calib3d\src\fisheye.cpp:753: error: (-215:Assertion failed) objectPoints.type() == CV_32FC3 || objectPoints.type() == CV_64FC3 in function 'cv::fisheye::calibrate'
```

​		他会说你的数据类型不是CV_32FC3，这个意思是32float，3通道。而事实上，鱼眼相机标定要求的世界坐标系点是（N,1,3），**我们把objp的格式改成(N,1,3)就能运行了 （我也很懵b）**:

<img src="https://s2.loli.net/2023/05/12/DysHbiJAhPtM9Ru.png" alt="image-20230512110216903" style="zoom:80%;" />

​		比如这是修改前的，按照官方教程来的 角点的世界坐标和像素坐标下的shape：

<img src="https://s2.loli.net/2023/05/12/QpIXCscMAhP7Bu8.png" alt="image-20230512110443871" style="zoom:80%;" />

​		修改后上面就是90,1,3了。没想到官方文档还会坑人啊，真麻了。
