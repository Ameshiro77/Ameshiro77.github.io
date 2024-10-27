---
uuid: 5534c8c0-cef7-11ed-b078-bfed9470b022
title: Harris角点检测中的公式推导
author: Ameshiro
top: false
toc: true
mathjax: true
copyright_author: Ameshiro
description: Harries角点检测中的重要的公式推导
cover: 'https://s2.loli.net/2023/03/30/OT4ybauq68sAigm.jpg'
tags:
  - CV
  - 数学
categories:
  - CV
abbrlink: de1d57b1
date: 2023-03-30 20:35:20
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

​		在Harris角点检测中，我们要算两个窗口的差。首先，两个点之间的差为：
$$
S =f\left(x_{i}, y_{i}\right)-f\left(x_{i}+\Delta x, y_{i}+\Delta y\right)
$$
​		其中f是像素灰度值。为避免误差，取平方，之后在窗口内求和，得：

![image-20230330204656439](https://s2.loli.net/2023/03/30/NVcB7HOImwJlf84.png)

​		刚拿到这个式子，可能从①到②不知道怎么来的。其实这里是应用了泰勒展开，首先我们知道对于一维函数来说，其泰勒展开式子为：
$$
f(x+h)=f(x)+hf'(x)+\frac{h^2}{2!}f''(x)+o(h^2)
$$
​		一般来说，展开到两阶就行了。但是对于更普适的情况，令 $f(x)$ 是 $\mathbb{R^n}→R$ 的函数，则其泰勒展开式子为：
$$
f(\mathbf{x}+\mathbf{h})=f(\mathbf{x})+\mathbf{h}^T\nabla f(\mathbf{x})+
\frac{\mathbf{h}^T}{2!}\nabla^2 f(\mathbf{x})\mathbf{h}+o(||h||^2)
$$
​		可能会有同学觉得这不是h的转置乘以梯度吗，图里公式怎么是梯度的转置乘以h了？其实这两个是相等的，因为他们结果是标量，标量转置等于自己。

​		对于一阶梯度来说，其结果就是对每个自变量求偏导后组成新向量。而对于二阶梯度，其结果叫海森矩阵，其形式为：

![image-20230330210859073](https://s2.loli.net/2023/03/30/blZ3FrAfxyMUcVY.png)

​			之后的步骤都比较明显了，最后我们得到的M长这样：

![image-20230330211136239](https://s2.loli.net/2023/03/30/FR1GBCkO8E7Nqia.png)

​		M是一个半正定矩阵，证明请读者自行练习。
