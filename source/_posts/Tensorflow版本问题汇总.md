---
uuid: 2ec3e760-3f23-11ee-847f-f33279885d58
title: Tensorflow版本问题汇总
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
abbrlink: 200f7c02
date: 2023-08-20 14:31:23
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

​		纯折磨，不评价，如果在大点的项目硬是要在tf2用tf1我只能说祝你好运，哥们已经麻了。（tf和py版本也是有关的，详见：[在 Windows 环境中从源代码构建  | TensorFlow (google.cn)](https://tensorflow.google.cn/install/source_windows?hl=zh-cn#cpu)）

# 各种has no attribute

使用这个：

```python
import tensorflow.compat.v1 as tf
```

# cannot import name ‘dtensor‘ from ‘tensorflow.compat.v2.experimental

​		tensorflow与Keras版本不匹配，把keras降成TensorFlow一样的版本，比如tf2.6.0的话，就pip install keras==2.6.0.

# RuntimeError: tf.placeholder() is not compatible with eager execution

[RuntimeError: tf.placeholder() is not compatible with eager execution.（亲测有效）_调皮李小怪的博客-CSDN博客](https://blog.csdn.net/qq_38388811/article/details/116232512) 

这个文章真的有用，有问题看看这个。

# If this call came from a _pb2.py file, your generated code is out of date and must be regenerated with protoc >= 3.19.0.

​			嗯..这个好像和tf关系不大，顺便放这里吧。这个就是版本问题，注意pip install的不是protoc，而是protobuf。。
