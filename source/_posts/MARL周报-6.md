---
uuid: 29e8f7e0-4819-11ee-86aa-851ac8d8bb77
title: MARL周报(6)
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: true
abbrlink: a186851b
date: 2023-08-25 00:12:20
updated:
description:
img:
top_img:
password:
summary:
tags:
  - Mean Field MARL
  - 论文阅读
categories:
  - MARL周报
copyright:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:
---

​		多智能体学习参考了[多智能体强化学习入门（六）——MFMARL算法（Mean Field Multi-Agent RL） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/56049023)系列专栏，但是感觉很难懂。。此外，找到了一篇关于MARL领域概述的论文：

[[2011.00583\] An Overview of Multi-Agent Reinforcement Learning from Game Theoretical Perspective (arxiv.org)](https://arxiv.org/abs/2011.00583)

​		论文一百多页，都写成教科书了。。慢慢看吧。

​		目前主要是对MF-MARL论文的阅读：[1802.05438v4.pdf (arxiv.org)](https://arxiv.org/pdf/1802.05438v4.pdf)。这是一篇比较新的论文，它应用了平均场的思想，当智能体规模庞大，维度变得巨大的时候，它将智能体群体的相互作用近似为中心智能体和邻居的近似作用；文章的证明写的比较迷，但是论文给的实验数据证明了MF-Q和MF-AC胜过独立Q-learning以及它们在大规模多智能体下的性能。

​		同时，对于代码也在逐行理解阅读（结合pdb库不断调试）。目前对于论文的理解见下（收敛性的证明太难了看不懂。。另外很想吐槽这论文向量有时候加粗有时候不加粗太过分了）：

​		首先，论文指出目前的MARL方法有数量限制，当智能体数量增加时，由于维度灾难和智能体交互的指数级增长，学习非常困难。因此本文提出平均场强化学习MFRL(Mean Field RL)，把智能体群体的交互近似为中心智能体 和 邻居智能体（或者整个群体，本顺便一提文的代码好像是这么写的）的平均作用 的交互。两个实体的相互作用是相互加强的（没说why？）；文章提出了MF-Q和MF-AC，并且在gaussian squeeze（我甚至搜不到这是啥）、Ising model（就是平均场物理模型）和Magent进行了实验。当然前两个不用看，我们的重心是Magent的代码。

​		传统的算法有独立Q学习，这是把其他智能体看作环境，让单个智能体和环境交互。理论上，这会失败，因为不具有收敛性，一个智能体的策略的改变会影响其他人的策略。研究表明，在许多场景下，了解联合行动效果的智能体比不了解的具有更好的性能，在实践中呢也确实很多情况下需要大量代理之间的策略交互（如MMO），但是直接求解纳什均衡具有极高的复杂性。因此本文提出了平均场RL（在平均场思想下，通过一系列智能体相互作用，任何一对智能体是可以全局连接的）。

​		在开始MF之前，我们要给出几个初步的式子。
$$
\nu_{\boldsymbol{\pi}}^{j}(s)=\nu^{j}(s;\boldsymbol{\pi})=\sum^{\infty}\gamma^{t}\mathbb{E}_{\boldsymbol{\pi},p}\big[r_{t}^{j}|s_{0}=s,\boldsymbol{\pi}\big].\quad\text{(1)}
$$
​		这个式子表明了在联结策略（joint policy）下，智能体j在状态s下的值函数。这个和单智体的定义差不多。然后，在联结动作下，智能体在联结策略下的Q函数就可以写成：
$$
Q_{\boldsymbol{\pi}}^j(s,\boldsymbol{a})=r^j(s,\boldsymbol{a})+\gamma\mathbb{E}_{s^{\prime}\sim p}[\nu_{\boldsymbol{\pi}}^j(s^{\prime})],\quad(2)
$$
​		那根据单智体的知识显然v和q就有如下等式：
$$
\nu_{\boldsymbol{\pi}}^j(s)=\mathbb{E}_{\boldsymbol{a}\sim\boldsymbol{\pi}}\big[Q_{\boldsymbol{\pi}}^j(s,\boldsymbol{a})\big].\quad\quad\quad(3)
$$
​		这里要指出，我们根据离散时间下的非合作设置下的随机博弈来指定MARL，并不考虑明确的联盟；每个智能体不知道别人的奖励函数，但是能够观察其他智能体之前的动作以及由动作得到的奖励。MARL中，智能体的目标就是得到纳什均衡下的最优策略以最大化其Q值，所谓纳什均衡就是任一智能体都不可能只改变自身策略而获得更大的v值：
$$
\nu^j(s;\boldsymbol{\pi}_*)=\nu^j(s;\boldsymbol{\pi}_*^j,\boldsymbol{\pi}_*^{-j})\geq\nu^j(s;\boldsymbol{\pi}^j,\boldsymbol{\pi}_*^{-j}).
$$
​		这里的-j就是表示除了自己的意思（这种表示法叫做compact notation，紧凑表示法）：$\boldsymbol{\pi}_{*}^{-j}\stackrel{\Delta}{=}[\pi_{*}^{1},\ldots,\pi_{*}^{j-1},\pi_{*}^{j+1},\ldots,\pi_{*}^{N}]$。给定一个纳什策略π，纳什Q值就是：$\boldsymbol\nu^{\mathrm{Nash}}(s)\triangleq[\nu_{\boldsymbol{\pi}_{*}}^{1}(s),\ldots,\nu_{\boldsymbol{\pi}_{*}}^{N}(s)]$。注意这玩意是个向量。

​		联合行动的维度随着智能体数量N成比例增长，所有智能体根据联合行动评估Q值，因此学习标准Q函数不可行。为此，论文使用成对的局部作用分解Q值：
$$
Q^{j}(s,\boldsymbol{a})=\frac{1}{N^{j}}\sum_{k\in\mathcal{N}(j)}Q^{j}(s,a^{j},a^{k}),\quad(5)
$$
​		这里的N^j是邻居数量。值得指出，智能体与邻居们的成对估计降低了复杂度，又保留了全局交互。在这个方程中，成对交互$Q^{j}(s,a^{j},a^{k})$可以用平均场理论估计（注意到此才有MF思想）。我们考虑离散动作空间，对j的采取的动作$a^j$，我们可以采取one-hot编码，比如四维离散空间采取动作3就表示为：[0,0,1,0]。也就是说，这里的a是个向量：$a^{j}\triangleq[a_{1}^{j},\ldots,a_{D}^{j}]$。我们可以计算出j的邻居们的平均动作$\bar{a}^{j}$（注意是平均，不是-j！论文也提到，这个平均动作看作是一个动作分布），然后以此表示出j每个邻居k的one-hot编码动作：
$$
a^k=\bar{a}^j+\delta a^{j,k},\quad\text{where}\ \ \ \bar{a}^j=\frac{1}{N^j}\sum_ka^k,\quad(6)
$$
​		就是说，比如俩智能体，一个动作[0,0,1]，一个动作[0,1,0]，那么平均动作就是[0,0.5,0.5]。而$\delta a^{j,k}$是一个小幅波动，你想嘛邻居和邻居们的平均值之间肯定有一个差的。在代码里，求平均代码是这么写的：

<img src="https://s2.loli.net/2023/09/02/iY4jknMxSu23qFG.png" alt="image-20230902111335984" style="zoom:80%;" />

​		根据泰勒展开，我们可以得到：
$$
\begin{aligned}
&Q^{j}(s,\boldsymbol{a})=\frac{1}{N^{j}}\sum_{k}Q^{j}(s,a^{j},a^{k}) \\
&=\frac{1}{N^{j}}\sum_{k}\left[Q^{j}(s,a^{j},\bar{a}^{j})+\nabla_{\bar{a}^{j}}Q^{j}(s,a^{j},\bar{a}^{j})\cdot\delta a^{j,k}\right. \\
&\left.+\frac{1}{2}\delta a^{j,k}\cdot\nabla_{\tilde{a}^{j,k}}^{2}Q^{j}(s,a^{j},\tilde{a}^{j,k})\cdot\delta a^{j,k}\right] \\
&=Q^{j}(s,a^{j},\bar{a}^{j})+\nabla_{\bar{a}j}Q^{j}(s,a^{j},\bar{a}^{j})\cdot\left[\frac{1}{N^{j}}\sum_{k}\delta a^{j,k}\right] \\
&+\frac{1}{2N^{j}}\sum_{k}\left[\delta a^{j,k}\cdot\nabla_{\tilde{a}j,k}^{2}Q^{j}(s,a^{j},\tilde{a}^{j,k})\cdot\delta a^{j,k}\right]\quad(7) \\
&=Q^j(s,a^j,\bar{a}^j)+\frac{1}{2N^j}\sum R_{s,a^j}^j(a^k)\approx Q^j(s,a^j,\bar{a}^j),\quad(8)
\end{aligned}
$$
​		注意这里$\sum_k\delta a^k=0$（这些波动误差肯定就彼此抵消了）。这样，两两成对的智能体的相互作用就被建模成了，一个中心实际智能体和周围邻居平均出来的虚拟智能体的相互作用。论文给出如下示意图：

<img src="https://s2.loli.net/2023/09/02/wYp7vlmq3NVcFdL.png" alt="image-20230902112345351" style="zoom:67%;" />

​		给定我们的经验为：$e=\begin{pmatrix}s,\{a^k\},\{r^j\},s^{\prime}\end{pmatrix}$，如同单智体的QL，我们的更新公式为：	
$$
Q_{t+1}^j(s,a^j,\bar{a}^j)=(1-\alpha)Q_t^j(s,a^j,\bar{a}^j)+\alpha[r^j+\gamma v_t^j(s^{\prime})],(9)
$$
​		与单智体类似。这里的平均场值函数定义为：
$$
v_{t}^{j}(s')=\sum_{-i}\pi_{t}^{j}\big(a^{j}|s',\bar{a}^{j}\big)\mathbb{E}_{\bar{a}^{j}(\boldsymbol{a}^{-j})\sim\boldsymbol{\pi}_{t}^{-j}}\Big[Q_{t}^{j}\big(s',\boldsymbol{a}^{j},\vec{a}^{j}\big)\Big],(10)
$$
​		这样就可以算策略了。在阶段博弈{$Q_t$}，首先依据当前策略算出每个$\bar{a}^j$，然后当前策略由于依赖$\bar{a}^j$发生了变化，我们用玻尔兹曼策略公式修改：
$$
\pi_t^j(a^j|s,\bar{a}^j)=\frac{\exp\left(-\beta Q_t^j(s,a^j,\bar{a}^j)\right)}{\sum_{a^{j'}\in\mathscr{A}^j}\exp\left(-\beta Q_t^j(s,a^{j'},\bar{a}^j)\right)}.\quad(12)
$$
​		这就是单智体一样的，平衡探索与利用用的。代码中的ValueNet有个temperature，就是控制这玩意的（应该吧），越高越探索。通过不断这样迭代，所有智能体的平均动作$\bar{a^j}$和相应策略π交替改进，最终收敛（**收敛的部分暂时看不懂！！这部分证明超出本科范围了。。**）。然后呢为了和方程10的MF value function分开，作者用平均场算子的形式表示了：
$$
\mathscr{H}^{\mathtt{MF}}\boldsymbol{Q}(s,\boldsymbol{a})=\mathbb{E}_{s^{\prime}\sim p}\left[\boldsymbol{r}(s,\boldsymbol{a})+\gamma\boldsymbol{v}^{\mathtt{MF}}(s^{\prime})\right].\quad(13)
$$
​		实际上这个算子形成了一个收缩映射（证明略。什么是收缩映射？参考：[强化学习(三):贝尔曼最优方程(BOE) | 雨白的博客小屋 (ameshiro77.cn)](https://www.ameshiro77.cn/posts/70521b50.html)），这样就会让MF Q最终收敛到Nash Q。

​		我们对于off-policy方法可以利用标准QL或DPG(这也说明ML可以应用到DDPG?把策略神经网络输出取平均应该更容易；另外PPO也有off版本的，应该也能应用？)，我们可以改造成MF -Q。损失函数为：
$$
\mathscr{L}(\phi^j)=\left(y^j-{Q}_{\phi^j}(s,a^j,\bar{a}^j)\right)^2,
$$
​		其中$y^{j}=r^{j}+\gamma\nu_{\phi^{j}_{-}}^{\mathrm{MF}}(s^{\prime}).$，是MF Value的目标值。求导就是：
$$
\nabla_{\phi^j}\mathscr{L}(\phi^j)=\left(y^j-Q_{\phi^j}(s,a^j,\bar{a}^j)\right)\nabla_{\phi^j}Q_{\phi^j}(s,a^j,\bar{a}^j),(14)
$$
​		(那个$\mathscr{L}$是L。)在MF-AC中，策略梯度也和单智体差不多，长这样：
$$
\nabla_{\theta^j}\mathscr{F}(\theta^j)\approx\nabla_{\theta^j}\left.\log\pi_{\theta^j}(s)Q_{\phi^j}(s,a^j,\bar{a}^j)\right|_{a=\pi_{\theta^j}(s)}
$$
​		那个$\mathscr{F}$是F。$\phi^{j}_{-}$，$\phi^{j}$，$\theta$都是神经网络的参数。MF-AC的critic与MF-Q同设置（依据方程（4））。

​		收敛部分太难了目前看不懂，算法如下：

<img src="https://s2.loli.net/2023/09/02/tzD6PbAWlCapJdM.png" alt="image-20230902175157865" style="zoom:67%;" />

$\tau$是QL更新目标网络时选取软更新方法的参数。硬更新可能不太稳定。
