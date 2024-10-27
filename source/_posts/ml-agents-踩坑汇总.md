---
uuid: 9acad3b0-3db6-11ee-ac8d-41f511f14097
title: ml-agents 踩坑汇总
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
abbrlink: 4982421f
date: 2023-08-18 19:01:38
updated:
description:
img:
top_img:
password:
summary:
tags:
categories:
copyright:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:
---

​		ml-agents是一个应用于unity的MARL环境，但是用起来怪怪的，emm 以此贴记录踩坑汇总。 首先我想说一下这些环境安装起来太离谱了，各种包之间依赖关系非常混乱，版本问题也是让人头皮发麻，比如numpy在1.24后就没有np.float等等东西了，比如TensorFlow的1.x和2.x带来的巨多问题。。

# Unable to convert function return value to a Python type!

报错信息为：

![](https://s2.loli.net/2023/08/18/OE8ZoNgjCnRc31v.png)

但其实如果你往上自己看的话，他会先报一个numpy的错误。其实这个问题就是numpy和TensorFlow不兼容导致的，我也是搜外网才搜到的！！找了几个英语的和日语的，给出的解决方案是：

<img src="https://s2.loli.net/2023/08/18/nEJaxmU9fBoAeql.png" alt="image-20230818191650505" style="zoom:67%;" />

至于numpy和TensorFlow的对应兼容关系我找不到合理的，给大家提供一下我的作为参考吧：numpy1.21.6 ； TensorFlow2.6.0

再运行终于成功了：

<img src="https://s2.loli.net/2023/08/18/qfvx6hAt72glByp.png" alt="image-20230818191756319" style="zoom:67%;" />

真不容易啊，在TensorFlow手上不知道吃多少亏了，真的麻了。之前搞个MARL环境，忘了叫啥，因为原论文搞得1.x的版本还是啥，直接给我搞崩溃了（2.x变了一大堆东西）。
