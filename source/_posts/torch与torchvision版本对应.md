---
uuid: 60f398a0-754e-11ee-b16a-a92042bada65
title: pytorch问题汇总
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
tags:
  - pytorch
categories:
  - pytorch
abbrlink: b91ac2cb
date: 2023-10-28 12:56:38
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

仅用于记录平时碰到的问题。

## torch与torchvision版本不对应

[极智AI | torch与torchvision版本对应关系速查 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/644096706)

## Input type (torch.FloatTensor) and weight type (torch.cuda.FloatTensor) should be the same or input should be a MKLDNN tensor and weight is a dense tensor

不要直接tensor.to，要tensor=tensor.to，见[问题解决：Input type (torch.cuda.FloatTensor) and weight type (torch.FloatTensor) should be the-CSDN博客](https://blog.csdn.net/qq_38832757/article/details/113630383)
