---
uuid: 344050f0-cd88-11ed-a4a1-4de0f5eb6ac9
title: 关于(Ax-b)二范数平方为凸函数的证明
tags:
  - 数学
  - 计算机视觉
categories:
  - CV
description: 计算机视觉课上留的练习题
cover: 'https://s2.loli.net/2023/03/29/5OEYBDxXTZ7Nv1s.jpg'
toc: true
copyright_author: Ameshiro
mathjax: true
abbrlink: b560505
date: 2023-03-28 18:39:25
updated:
keywords:
top_img:
comments:
toc_number:
toc_style_simple:
copyright:
copyright_author_href:
copyright_url:
copyright_info:
katex:
aplayer:
highlight_shrink:
aside:
---

​	上文我们求出了
$$
\dfrac{\mathrm{d}||\mathbf{Ax}-\mathbf{b}||^2_2}{\mathrm{d}\mathbf{x}} = 2\mathbf{A}^T\mathbf{A}\mathbf{x} - 2\mathbf{A}^T\mathbf{b}
$$
​	回想高数中，证明凸函数就是看二阶导数（如果存在）大于等于零。映射到矩阵，就是看其海森矩阵是否半正定。

​	海森矩阵也就是对这个结果进一步求导，结果显然是 $\mathbf{2A}^T\mathbf{A}$ , 而如果一个矩阵能够被写成  $\mathbf{A}^T\mathbf{A}$ 或  $\mathbf{A}\mathbf{A}^T$ ,那么他就是半正定的。

