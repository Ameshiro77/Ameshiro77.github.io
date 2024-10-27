---
uuid: 96220300-d970-11ee-a0c2-07863690c253
title: 'HOI琐碎闲聊(一):HICO-DET数据集标注的内容到底是啥'
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
tags:
  - CV
  - HICO-DET
  - 人/物交互检测
categories:
  - CV
abbrlink: 152e909a
date: 2024-03-03 23:13:27
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

​		在复现论文的时候，数据集这块肯定是要关注的。人物交互检测主要用两个数据集：HICO-DET和V-COCO。原初的HICO-DET标注是matlab格式的；从QPIC到之后的DiffHOI，数据集标注就成了JSON格式。之前没仔细关注过这个标注格式，但是看源代码的时候，由于json转化来的字典的一堆键看不懂啥意思，就顺着去研究数据集格式了。我们打开训练集json，看蓝色部分：

![image-20240303231622884](https://s2.loli.net/2024/03/03/VsYogup6IDGwSJa.png)

​	这个字典有四个键：文件名，图像id，annotations，hoi_annotation。前面两个就不说了，这个annotations代表的是图像里的实例，也就是COCO数据集八十个类代表的物体。可以看到，这里的annotations长度为3，代表了图里有三个实例，给出了三个实例的类别和标注框。这张图片长这样：

![image-20240303231847564](https://s2.loli.net/2024/03/03/iLJDYzvahQyPFH3.png)

​		但是啊，这里有个比较坑的点。我们原始的HICO-DET数据集，它的objects的排序是这样的：

![image-20240303231956745](https://s2.loli.net/2024/03/03/fbyKElO2AYtwaTg.png)

​		你看这id为1的，图里哪里出现飞机场了嘛！事实上，这个id代表的是coco数据集的object，id为1是coco数据集里的人，且coco数据集是不连续的，详见[coco2017数据集80类别名称与id号的对应关系_coco数据集类别编号-CSDN博客](https://blog.csdn.net/Dreaming_of_you/article/details/102756445)。

​		然后就是下面的hoi_annotation。这也是一个列表，说明了图中发生HOI的区域。那个subject_id和object_id我看了好久，终于看懂了：subject_id和object_id表示的是在annotations里面的索引。subject_id是0、2，就代表了annotations[0]和[2]。category_id表示的是HICO数据集的117个动词的序号索引，113代表watch，即：

![image-20240303232419462](https://s2.loli.net/2024/03/03/EH3GtyxMsZ6gJhK.png)

​		hoi_category_id就代表了600个hoi类别的序号索引。197是watch tv，即：

![image-20240303232524969](https://s2.loli.net/2024/03/03/Z1yjvfAQLiUh6lw.png)

​		ok，这样就搞清楚了关系了！网上基本找不到相关资料，我也是自己研究了一会，最早是QPIC应用的似乎，QPIC说来自iCAN但是我也找不到具体说明。

​		需要注意，QPIC用的这个处理后的标注不完全。原数据集38152个，标签只有37633个。
