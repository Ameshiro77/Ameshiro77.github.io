---
uuid: 39dbef40-cbb8-11ee-9321-2b03b5960b64
title: '人-物交互检测(三):CDN'
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
description: hoi检测
tags:
  - CV
  - 论文阅读
  - 人/物交互检测
categories:
  - CV
abbrlink: c9a46c06
date: 2024-02-15 12:11:00
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

​		CDN的代码来自QPIC和DETR，然后衍生了GEN-ViKT，然后衍生成了Diffhoi。论文地址：[[2108.05077\] Mining the Benefits of Two-stage and One-stage HOI Detection (arxiv.org)](https://arxiv.org/abs/2108.05077)。这里的实验分为CDN-S和CDN-L，意思是小规模和大规模，后续几篇论文也是这样的，先看这篇吧。

# 摘要

​		近些年来两阶段方法一直主导着HOI检测(当然这篇论文是2021年的，现在已经是transformer的时代了)。近期，一阶段HOI检测方法也变得流行起来。这篇论文里，作者旨在挖掘两种方法的优缺点。作者发现，传统两阶段方法主要在定位正面(positive)交互对样本时有问题，一阶段在多任务学习时不好做出权衡，也就是目标检测和动作分类。因此，一个关键问题就是，如何从两种传统方法中扬长避短。为此，作者提出了一个新的单阶段框架，以级联的方式解开人物检测和交互分类。具体来说，作者首先基于先进的检测器，把它们的交互分类部分移除，以此设计了一个人/物对生成器。然后作者设计了一个相对独立的交互分类器来分类每个人/物对。这个架构里的两个级联的解码器关注于具体的任务。具体实现，作者采用一个基于transformer的HOI检测器作为基本模型。代码： [YueLiao/CDN: Code for "Mining the Benefits of Two-stage and One-stage HOI Detection" (github.com)](https://github.com/YueLiao/CDN)

# 简介

​		先是说了啥是HOI，然后说现在有两阶段和一阶段的方法来完成这个任务，作者要挖掘二者的好处。先贴个图：

<img src="https://s2.loli.net/2024/02/16/FCafcRDN29lriGe.png" alt="image-20240216120804422"  />

​		作者首先谈及传统的HOI检测器。两阶段方法通常是一个序列模型，如上图a。两阶段模型先检测人和物，然后用后续网络或手段一一检测每个人物对。这种方法只基于局部特征，会有大量负样本，因此会带来问题。而且，性能也会受到序列架构限制。为了解决这些问题，单阶段模型就被提出来直接预测HOI三元组，把HOI检测分开为多任务学习，也就是目标检测和交互分类，如上图b。因此，一阶段模型可以聚焦在交互人物对上，高效提取相应特征。然而，单个模型在多任务学习上很难权衡，因为模型要聚焦于不同的视觉特征。如上图c，尽管有些模型会设计两个平行的分支来检测示例和预测交互，交互分类的分支仍然需要回归额外的offsets来关联人物。也就是说，交互分支仍然需要在交互分类和人物定位之间作权衡。

​		因此，一个直接的想法就是从两种范式框架里扬长避短。作者就提出了一个一阶段的端到端框架，以级联的方式解开了人物(是人和物，不是person的人物)预测和交互分类，称作CDN,cascade disentangling network。初始想法是保有一阶段模型的优点，直接准确定位交互人物对，并且结合两阶段模型优点，解开人物检测和交互分类。如上图d，这个框架中作者基于一阶段范式设计了一个人物对decoder，移除了交互分类功能，这个解码器叫做HO-PD，之后接上一个单独的交互分类器。为了实现这个想法，作者就用之前的先进一阶段框架，HOTR和QPIC，对每个query而言移除了交互分类头，使得它们更专注于人物对的检测。此外，作者又设计了一个独立的HOI解码器来预测分类，使它不受人物检测的干扰。这样一来，又有一个关键问题：也就是如何把这两个人物对和对应动作类别链接起来。为了解决这问题，作者用HO-PD最后一层输出来初始化HOI解码器的query embedding。这样一来，HOI解码器就能在query embedding的指导下学习对应动作类别，并且不受人物检测影响。此外，作者还设计了一个解耦动态重加权方法（decoupling dynamic re-weighting manner）来处理数据长尾问题。

# 两阶段和一阶段HOI检测器分析

​		也还是那些东西，就不细说了。

## 两阶段HOI检测器

​		这一段就是说先预测M个人框，N个物框(这个物是包括人类类别的通用目标)；这M\*N个人物对里有K个true-positive样本，远远小于M\*N，这样带来三个问题：1.需要额外的计算复杂度，2.正负样本数量不均衡会让模型对负样本过拟合，因此模型需要给"no-interaction"这个类别分配很高的置信度，抑制对true-positive样本的检测，3.交互分类的精度受到非端到端pipeline的影响。因为交互分类主要依赖于区域特征，而前面检测器的核心又是回归bbox，更多的是聚焦于局部区域的边界，因此不是很好的用于交互分类的特征，需要更多上下文。但是，两阶段的好处是，目标检测和分类可以让各个stage专注于产出更好的结果。

## 一阶段HOI检测器

​		单阶段很大程度上缓解了上述三个问题，尤其复杂度降低了很多。大多数一阶段方法是交互驱动的，直接定位交互点或者交互人物对，因此介绍了负样本的干扰。但是把人物检测和交互分类耦合在一起会限制性能，因为很难为两种很不一样的任务生成一个统一特征表示。尽管有些方法把HOI检测分为两个parallel branches，他们的交互分支依旧受到多任务学习影响。

# 方法论

​		先给出框架图。猪一样有个经过Qd的虚线Xs，那个虚线跟Qd没关系，第一次看还有点没看懂那条虚线咋经过queries了。

<img src="https://s2.loli.net/2024/02/17/tkGAsIf9EndwTjq.png" alt="image-20240216133351961"  />

## 总览

​		给定一个图像x，先依据基于transformer的检测方法，把视觉特征提取成一个序列。然后用级联解码器检测HOI三元组，首先用Human-Object Pair Decoder，叫做HO-PD，基于一组可学习的queries预测一个人物框对集合；然后把HO-PD最后一层输出拿出来作为queries，用一个独立的交互解码器为每个query预测动作类别。

## 视觉特征提取器

​		跟DETR这些差不多，就是用了个CNN和TF编码器，加个位置编码。解码器输出被定义为一个$D_c$维的global ，memory。

## 级联的分解开的HOI解码器(Cascade Disentangling HOI Decoder)

​		由两部分组成，HOPD和交互解码器。两个解码器架构相同，权重独立。

### 基于TF的解码器

​		作者遵循DETR的基于tf的目标检测器来设计基本架构。作者应用N个tf解码器层，每个解码器层配备若干FFN头部以intermediate supervision（中继监督优化）。具体来说，每个解码器层包括一个自注意力模块和一个多头协同注意力模块。前向传播时，每个解码器层输入一组可学习的queries，先对所有queries用自注意力机制，然后在queries和序列化视觉特征间作协同注意力操作，输出一组更新的queries。对于FFN头部，每个都包括一或多个MLP分支，每个分支针对各自具体工作，比如分类和回归。所有queries共享相同的FFN头部。每个解码器可以被描述为:
$$
{\boldsymbol{P}}=f(Q,\boldsymbol{X}_{s},\boldsymbol{E}_{pos})
$$

### HO-PD

​		首先，作者设计HO-PD来从序列化视觉特征里预测一组人物对。为此，作者首先随机初始化一组可学习的queries ，$ Q_{d}\in\mathcal{R}^{ {N_{d}} * {C_{q}} }$，作为HO查询。然后作者用一个解码器，以Qd和视觉特征作为输入，用三个FFN头对每个查询预测人框，物框，物体类别，然后把这些组成一个人物对。作者依旧利用一个额外的交互分类(用二分类)来简单地判断人物对是否是一个交互性质的pair。这样一来，HO-PD被定义为：
$$
P_{ho}=f_{d}(Q_{d},\boldsymbol{X}_{s},\boldsymbol{E}_{pos})
$$
​		此外，作者把HO-PD最后一层输出的queries用到之后的步骤。

### Intreaction Decoder

​		然后，作者用交互解码器分类人-物 queries，分配一或多个动作。为此，作者用HO-PD的输出$\boldsymbol{Q_d^{out}}$来初始化$\boldsymbol{Q_c}$。这样的话，Qd可以提供先验知识来指导Qc对每个人-物query学习相应的动作分类。其他组件和输入与HO-PD相同。最后的输入是一个动作分类的集合，大小是Nd，记作：
$$
P_{cls}=f_{cls}(Q_{d}^{out},X_{s},E_{pos})
$$
​		这样一来，CDN的两个模块可以为对应的工作更专注于相关的特征。

### Decoupling Dynamic Re-weighting

​		HOI数据集通常对物体类别和动作类别都有长尾分布。为此，作者以一种解耦合的训练策略，设计了动态重加权机制来改善性能。具体来说，作者先用常规loss训练整个模型。之后，作者冻结视觉特征提取器的参数，然后用相对小的学习率和设计好的动态重加权损失来只训练级联的解码器。

​		在解耦合训练的每个迭代中，作者用两个相似的队列来累积每个物体类别或交互类别的数量。这些队列被用作memory banks，来累积训练样本，并以长度$L_Q$作为滑动窗口长度。具体来说，用长度为$L_Q^o$的$Q_o$来累积每个物体类别($C_O$个)的数量$N_i^o$，用长度为$L_Q^a$的$Q_a$来累积每个动作类别($C_a$个)的数量$N_i^a$。动态重加权的参数$\omega_{dynamic}$如下所示：
$$
\begin{aligned}w_i^a\big|_{i\in\{1,2,\cdots,C_a\}}&=\Big(\frac{\sum_{i=1}^{C_a}N_i}{N_i}\Big)^{p_a},\quad w_{bg}^a=\Big(\frac{\sum_{i=1}^{C_a}N_i}{N_{bg}^a}\Big)^{p_a},\\\\w_i^o\big|_{i\in\{1,2,\cdots,C_o\}}&=\Big(\frac{\sum_{i=1}^{C_o}N_i}{N_i}\Big)^{p_o},\quad w_{bg}^o=\Big(\frac{\sum_{i=1}^{C_o}N_i}{N_{bg}^o}\Big)^{p_o},\end{aligned}
$$
​		其中$N_i$是由Qo和Qa对于分类i累积的正样本的个数，$N_bg$是累积的背景样本的个数，C是类别数，指数p是一个超参数，来适应缓解幅度。具体来说，对于背景类的权重，$\omega_bg$，旨在平衡正负样本。为了动态重加权训练的稳定性，权重参数们使用物体和动作类别的静态数量由上式初始化为$w_{static}$。最终的动态权重定义为：$w=\gamma w_{static}+(1-\gamma)w_{dynamic}$，其中γ是一个平滑因子，被计算为$min(0.999^{L_Q},0.9)$。随着$L_Q$的增加，γ把$\omega$从static转化为dynamic的。最终，这些权重以传统方式用作分类损失，即每个系数乘以每个类，然后算总和。

### 训练和后处理

​		本小节介绍训练和推理的细节，并且推理时介绍作者提出的新方法PNMS,Pair-wise Non-Maximal Suppresion。

#### 训练

​		依据HOTR和QPIC，首先用匈牙利算法二分类匹配，为每个真实值匹配出它最佳的预测。然后匹配的预测和相应真实值之间的损失被计算出来用于反向传播。匹配时，作者将两个级联解码器的预测一起考虑。CDN的loss遵从QPIC，包括五部分：框回归损失$L_b$，IOU损失$L_{GIoU}$，交互得分损失$L_p$，物体分类损失$L_c^o$，动作分类损失$L_c^a$。目标函数写为：
$$
\begin{aligned}L=\sum_{k\in(h,o)}(\lambda_bL_b^k+\lambda_{GIoU}L_{GIoU}^k)+\lambda_pL_p+\lambda_oL_c^o+\lambda_aL_c^a,\end{aligned}
$$
​		其中五个λ都是超参数，调整损失权重。

#### 推理

​		推理过程是把实例相关FFNs输出和交互相关FFN的输出结合成HOI三元组。由于级联解码器使得instance queries和interaction queries是一一对应的，因此五元组<hb，ob，ocls，交互得分，alcs>在每个$N_d$维度的FFN头部是相似同源的（没看太懂，原句： By our cascade disentangling decoder architecture,

the instance queries and the interaction queries are one-to-one corresponding, therefore, the five

components <*human bounding box*, *object bounding box*, *object class*, *interactive score*, *action class*>

can be homologous in each of the $N_d$ dimensions per FFN head.）。形式上，作者生成第i个输出预测为：$<b_{i}^{h},b_{i}^{o},\mathrm{argmax}_{k}c_{i}^{hoi}(k)>.$,其中$c_{i}^{hoi}$由$c_i^ac_i^oc_i^p$得到，前两个是交互得分和物体分类得分，后一个是交互FFN头部对于query是否是一个ho pair的得分。

#### PNMS

​		在排序出$c_i^{hoi}$并生成top K个HOI三元组后，作者设计了一个成对非极大值抑制，即PNMS，进一步过滤出具有重叠视角的成对bbox对应的人物对。对于两个HOI三元组m和n，pair-wize overlap PIoU计算为：
$$
PIoU(m,n)=\Big(\frac{I(b_m^h,b_n^h)}{U(b_m^h,b_n^h)}\Big)^\alpha\Big(\frac{I(b_m^o,b_n^o)}{U(b_m^o,b_n^o)}\Big)^\beta
$$
​		运算符I和U是计算m和n中两个框的交和并。α和β是人/物间的平衡参数。

# 实验

​		数据集是HICO和VCOCO。模型有三种变体：CDN-S/B/L。CDN-S、CDN-B是用resnet50和六层tf编码器作为视觉特征提取器；前者解码器三层，后者解码器六层。CDN-L把resnet50换成了resnet101，其他与CDN-B一样。Dc设置为256，Nd对HICO设置为64，对VCOCO设置为100.
