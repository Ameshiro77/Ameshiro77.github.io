---
uuid: 2db99680-b7d1-11ef-92d7-f7b68b95b7e5
title: 论文阅读-针对异构、长尾数据的CLIP引导的FL
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
categories:
  - 论文阅读
abbrlink: 667e3ef3
date: 2024-12-09 23:04:11
updated:
description:
img:
top_img:
password:
summary:
tags:
copyright:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:
---

[[2312.08648\] CLIP-guided Federated Learning on Heterogeneous and Long-Tailed Data](https://arxiv.org/abs/2312.08648)，AAAI-24。

# 摘要

​	本文考虑的是图像分类任务。本文考虑的问题是：FL的挑战除了用户异质性，还有类别数目不均衡（也就是长尾问题，研究异质性多但是长尾的比较少）。由于CLIP在这种few/zero shot的任务上有成功的经验，于是作者就用CLIP来优化联邦学习。

​	具体来说，对于客户端的学习，是通过知识蒸馏使客户端模型与CLIP对齐，以提升客户端特征表示的能力。对于服务端，则根据客户端的梯度生成联邦特征来重训服务器模型。

# 简介

​	论文是在一个叫CReFF的工作基础上做的，引入了CLIP做语义监督。主要是考虑了两个问题和解法。1.如何利用CLIP提升客户端模型的特征表示能力？方法：CLIP当做教师，客户端当做教师，用知识蒸馏的思想传递知识来提高表示能力。2.如何利用CLIP缓解服务器模型的异质性和长尾问题？方法：在CLIP的语义监督下，通过客户端梯度生成联邦特征，使这些特征尽可能避免异质性和类别不均衡。然后，用这些特征重新训练平衡的服务器模型。

# 方法

## 问题建模

​	有一个中央服务器和K个客户端模型,客户端数据集为$D^1:D^K$。全体数据集$D$有$C$个类别且分布为长尾的。本地模型和服务器模型都是分类模型，都包括两部分：一个特征提取器$f_{\theta}$和线性分类器$g_{\phi}$。对于一个样本x，特征提取器会输出d维的表示$z=f(x)$，然后经过分类头输出logit向量p。

​	在实验中，特征提取器用的ResNet-8；并添加了一层MLP以对齐CLIP输出特征的维度。

## CLIP2FL框架

​	本文方法主要专注于本地模型训练和服务端模型聚合。

![image](https://raw.githubusercontent.com/Ameshiro77/BlogPicture/main/pic/image-20241212001747519.png)

### 客户端学习

​	CLIP包括一个图像编码器和文本编码器。给定一个图像x和标签label，我们可以得到其视觉特征和文本特征。为了缓解异构性和长尾问题，客户端模型必须迫使其输出与CLIP输出一致。为此，本地训练损失函数为：
$$
L_{loc}=L_{ce}(y,p_{k}^{t})+\beta\cdot KL(q_{k}^{t}\|p_{k}^{t}),
$$
​	p就是上面说过的logit输出，做交叉熵是促进分类效果；q则是CLIP模型的特征输出，用来让客户端模型像CLIP对齐。利用这一损失的梯度下降，就可以更新本地模型。

### 服务端学习

​	服务端学习要复杂一点。这一过程包括：聚合服务端分类器梯度、生成联邦特征、重训模型。

#### 梯度聚合

​	作者要计算服务端分类器$\hat{\varphi}$的梯度，以此优化联邦特征来重训一个平衡的服务端分类器。具体来说，用当前的服务端分类头替换第k个客户端的分类头，然后从其本地数据集重新采样，这个新客户端模型就产出了针对每个类别c的d维的“真实样本特征”{$z^k_{c,i:n^k_c}$}。基于此可以计算第c类的真实梯度：
$$
g_c^k=\frac{1}{n_c^k}\sum_{i=1}^{n_c^k}\nabla_{\hat{\varphi}^t}L_{ce}\left(z_{c,i}^k,y_i\right)
$$
​	之后这个梯度就上传到服务器。

#### 联邦特征生成

​	首先，服务端对每一类别平均聚合真实梯度：$g_c^{agg}=\frac{1}{|\Omega_c^t|}\sum_{k=1}^{|\Omega_c^t|}g_c^k,$。这个Ω就是包含类别c的客户端。

​		之后，在t轮里，对每个类别要生成一系列d维度的联邦特征$V^t_c$。联邦特征要有两种约束：1.服务器分类头在'联邦特征上计算的梯度'要与在'真实特征上计算的梯度'一致；2.联邦特征应该与CLIP的文本编码器生成的类别原型（class prototypes，应该是用text embedding当原型向量）相似。 由于类别之间区分性很高，作者认为原型有助于缓解强bias问题。

​	对于第一个约束，使用服务端分类头生成对应类别的联邦特征的梯度：
$$
g_c^v=\frac{1}{m}\sum_{i=1}^m\nabla_{\hat{\varphi}^t}L_{ce}\left(v_{c,i}^t,y_i\right)
$$
​	这是用联邦特征和logit输出做了交叉熵然后平均。为了进一步确保联邦特征和真实特征的一致性，用一种梯度匹配损失去测量服务端分类头在两种特征下生成的梯度：
$$
\begin{aligned}
L_{grad}=D\left(g_{c}^{v},g_{c}^{agg}\right) =\frac{1}{C}\sum_{j=1}^C\left(1-\frac{g_c^v[j]\cdot g_c^{agg}[j]}{\|g_c^v[j]\|\times\|g_c^{agg}[j]\|}\right)
\end{aligned}
$$
​	对于第二个约束，就要用CLIP的文本编码器输出的具有语义监督信息的原型（就是那个text embedding）来引导联邦特征生成。因为这样的原型有益于区分不同联邦向量。这里，作者采用了原型对比学习的方法。

​	现在我们有：联邦特征$V^t_c$、类内特征原型$f_r^c$、类间联邦特征（就是不同类别之间的特征差异）。$V^t_c$和$f_r^c$是正样本对，和类间特征是负样本对（即对比学习的思想，要最大化正样本对相似度，最小化负样本对的）。损失函数为：
$$
L_{pcl}=\sum_{i=1}^{C\times m}-\log\frac{\exp\left(\left\langle v_{c,i},f_r^c\right\rangle/\tau\right)}{\sum_{j=1}^{C\times m}1_{[j\neq i]}\exp\left(\left\langle v_{c,i},v_j\right\rangle/\tau\right)},
$$
​	为获取最优的联邦特征（即与原型最像又彼此区分度很高）的损失就通过：$L_{total}=L_{grad}+\eta\cdot L_{pcl}$获得。

#### 分类器重新训练

​	看了半天，这里的重训练指的是把全局模型拷贝一份，然后固定住特征提取器，用联邦特征去重新训练分类头参数，记作${\hat{\varphi}}^{t+1}$。这个参数算出来后，是不参与任何更新、传输的。（就像强化学习DQN里两个网络一样，一个就是target网络只更新不参与训练，另一个要参与训练）

​	联邦特征$V^t_c$经过上面的损失函数优化后，更新的$V^{t+1}_c$用于重新训练分类器。服务端模型采用一种加权平均的办法更新，其中具体某一类别的权重是其数据比例：$w^{t+1}=\sum_{k\in\Omega^t}\frac{\left|\mathcal{D}^k\right|}{\sum_{k\in\Omega^t}\left|\mathcal{D}^k\right|}w_k^{t+1}.$。这里的参数是要参与联邦学习过程的。然后要冻住特征提取器，训练分类头参数：$\hat{\varphi}^{t+1}\leftarrow\hat{\varphi}^t-\eta\nabla_{\hat{\varphi}}L_{ce}\left(v_i^t,y_i\right)$。

![image](https://raw.githubusercontent.com/Ameshiro77/BlogPicture/main/pic/image-20241212124206781.png)

# 实验

​	作者使用了三种常用的，存在长尾现象的数据集：CIFAR-10/100-LT和ImageNet-LT。对于前两个数据集，用一种不平衡因子采样，并在客户端之间形成异构的数据集。

![image](https://raw.githubusercontent.com/Ameshiro77/BlogPicture/main/pic/image-20241212123450942.png)

​	这是作者实验结果。
