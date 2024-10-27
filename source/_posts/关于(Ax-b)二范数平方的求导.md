---
uuid: a509a2d0-cd85-11ed-b6f9-71d0cfc449ec
title: 关于(Ax-b)二范数平方的求导
tags:
  - 数学
  - 计算机视觉
categories:
  - CV
description: 计算机视觉课上留的练习题
cover: 'https://s2.loli.net/2023/03/29/SnKZPFfCUqAXpJz.jpg'
img: 'https://s2.loli.net/2023/03/29/5OEYBDxXTZ7Nv1s.jpg'
toc: true
copyright_author: Ameshiro
mathjax: true
abbrlink: 3e5cc5a1
date: 2023-03-25 15:39:25
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
## 其实是一个基础问题

​		在CV的全景拼接中，遇到个一个向量微分的问题，也就是关于矩阵的最小二乘，虽然第一次做的时候茫然无措，但它实际上就是一个标量对矢量的求导。

​		现在要求这个式子：
$$
\dfrac{\mathrm{d}||\mathbf{Ax}-\mathbf{b}||^2_2}{\mathrm{d}\mathbf{x}}
$$
​		虽然分子看着吓人，但他其实就是个由  $ \mathrm x$ 向量中的各个元素组合成的多项式的值。对于二范数的平方，其值就等于：
$$
||\mathbf{Ax}-\mathbf{b}||^2_2=(\mathbf{Ax}-\mathbf{b})^{T}\hspace{+0.1em} (\mathbf{Ax}-\mathbf{b})
$$
​		运用转置相关知识：
$$
(\mathbf{Ax}-\mathbf{b})^{T}=\mathbf{x}^T\mathbf{A}^T-\mathbf{b}^T
$$
​		之后矩阵乘法：
$$
||\mathbf{Ax}-\mathbf{b}||^2_2=\mathbf{x}^T\mathbf{A}^T\mathbf{Ax}-\mathbf{x}^T\mathbf{A}^T\mathbf{b}-\mathbf{b}^T\mathbf{Ax}+\mathbf{b}^T\mathbf{b}
$$
​	    注意到，$\mathbf{x}^T\mathbf{A}^T\mathbf{b}=\mathbf{b}^T\mathbf{Ax}$ , 因为它们最后的结果是一个数，数的转置就是他自己，所以这个等式成立。这样，等式就变成了：
$$
||\mathbf{Ax}-\mathbf{b}||^2_2=\mathbf{x}^T\mathbf{A}^T\mathbf{Ax}-2\mathbf{x}^T\mathbf{A}^T\mathbf{b}+\mathbf{b}^T\mathbf{b}
$$
​	    这时需要引出两条特别重要的结论：
$$
① \hspace{1.em}\dfrac{\mathrm{d}(\mathbf{x}^T\mathbf{Ax})}{\mathrm{d}\mathbf{x}} = (\mathbf{A}+\mathbf{A}^T )\hspace{0.2em}\mathbf{x}
$$

$$
\hspace{1.1em}②\hspace{1em} \dfrac{\mathrm{d}(\mathbf{a}^T\mathbf{x})}{\mathrm{d}\mathbf{x}} = \dfrac{\mathrm{d}(\mathbf{x}^T\mathbf{a})}{\mathrm{d}\mathbf{x}}= \mathbf{a}
$$

​		

​		两个的证明其实不难，因为分子都是标量，本质就是把这个标量用 $\mathbf{x}$ 中的分量表示出来，然后利用标量对矢量求导的定义就行了。我们把这两条规则代入：
$$
\dfrac{\mathrm{d}(\mathbf{x}^T\mathbf{A}^T\mathbf{Ax})}{\mathrm{d}\mathbf{x}} = (\mathbf{A}^T\mathbf{A}+(\mathbf{A}^T\mathbf{A})^T)\hspace{0.2em}\mathbf{x} = 2\mathbf{A}^T\mathbf{A}\mathbf{x}
$$

$$
\dfrac{\mathrm{d}(2\mathbf{x}^T\mathbf{A}^T\mathbf{b})}{\mathrm{d}\mathbf{x}}=2 \dfrac{\mathrm{d}(\mathbf{b}^T\mathbf{A}\mathbf{x})}{\mathrm{d}\mathbf{x}} = 2\mathbf{A}^T\mathbf{b}
$$



​		由于 $\mathbf{b}^T\mathbf{b}$ 与 $\mathbf{x}$ 是无关的，所以求导为零。这样，就得到了：
$$
\dfrac{\mathrm{d}||\mathbf{Ax}-\mathbf{b}||^2_2}{\mathrm{d}\mathbf{x}} = 2\mathbf{A}^T\mathbf{A}\mathbf{x} - 2\mathbf{A}^T\mathbf{b}
$$


​		由于 $ ||\mathbf{Ax}-\mathbf{b}||^2_2 $ 是凸函数（证明海森矩阵半正定，一阶导数我们已经求出来了），所以极值点就是极小值点，也就是说令导数为零，最终得到的结果就是我们要找的结果：


$$
\mathbf{x}=(\mathbf{A}^T\mathbf{A})^{-1}\mathbf{A}^T\mathbf{b}
$$

----

​		由于两年前学的线代几乎全忘光了，也没有接触过向量函数的微分，所以第一次见到它的时候就有点懵逼。不过感谢一些大佬的帮忙，让我对此有点入门；同时也感谢amekui教我怎么用latex写公式，这篇博客是我第一次接触latex，全篇都是自己手打出来的，感觉好累T^T (hexo竟然不能\newline 害的我又改了一下)
