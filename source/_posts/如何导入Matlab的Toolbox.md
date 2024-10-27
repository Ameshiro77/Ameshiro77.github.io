---
uuid: 31c7c9d0-d14c-11ed-8d7b-8df791c66c0b
title: 如何在Matlab中导入toolbox
author: Ameshiro
top: false
toc: true
mathjax: true
copyright_author: Ameshiro
description: 关于matlab工具箱导入
cover: https://s2.loli.net/2023/04/02/SoD4wEqIc1iu3hQ.jpg
abbrlink: a836a3e9
date: 2023-04-02 19:47:50
updated:
img:
top_img:
password:
summary:
tags:
  - Matlab
categories:
  - Matlab
copyright:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:
---

​		跑老师给的demo的时候遇到了一个问题：无法解析名称 'vision.internal.partialSort'

​		显然是缺少对应工具箱导致的，这个工具箱是计算机视觉相关的。但是网上找了好多都是说从外部离线下载，其实在matlab内部就内解决。

<img src="https://s2.loli.net/2023/04/02/xposAMQnzkXwR9r.png" alt="image-20230402195007567" style="zoom:67%;" />

​		在主页——附加功能 进去 “获取附加功能”，搜索Computer Vision Toolbox然后安装即可，可能要稍微等一会，这个下载需要费点时间。

​		matlab版本：R2022b
