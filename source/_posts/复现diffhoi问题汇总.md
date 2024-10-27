---
uuid: 3586f6e0-cf43-11ee-8336-0f5daace093b
title: 复现diffhoi问题汇总
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
abbrlink: d96c5b01
date: 2024-02-20 00:23:26
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

​		我已经昏迷了。

# 环境根据sd的git配，此外您需要额外装的包：

termcolor,addict,yapf=0.40.1,timm，这四个，pip就行，yapf别版本太高，会有bug，新版本FormatCode函数没有关键字参数verify了。

然后，按照diffhoi源代码，别忘了安装CLIP，编译可变形注意力机制的CUDA运算。否则，您会遇到没有模块MultiScaleDeformableAttention的错误。

# 测试时说有的数据在cpu有的在gpu上

​		engine.py里evaluate_hoi里在经过model前面加一句：

```python
targets = [{k: v.to(device) for k, v in t.items() if (k != 'filename' and k != 'id') } for t in targets]
```

​		这是因为，targets也就是标签信息里有很多tensor。从dataloader的collate_fn函数得知，targets其实是一个batch的元组，和samples还不一样，后者是一个自定义nestedtensor。然后训练和测试时targets里标签字典也不太一样，测试时还多了个id。

​		**但是注意，我们之后还要用到targets里的id算mAP**。因此，建议这里得到的targets换个变量名，只作为一个副本用于算后面的outputs。否则后面会说没有id报错的。或者也可以自己换种写法：使得得到的结果里，id和filename保留，且tensor放到gpu上。反正bug就是这么个bug。

# RuntimeError: CUDA error: CUBLAS_STATUS_NOT_INITIALIZED when calling `cublasCreate(handle)`

​		这个真的有点见鬼，我之前在RTX4000A上能跑，结果几天后就报这个错了。然后我换到RTX3080上跑，它又能跑了，我没绷住。然后我重开了个机，它又能跑了... 建议重开机器或者换显卡，或者也有可能是数据对不上。

# 测试显存一直上升然后爆炸

用该语句检测问题在哪：

```python
print("已分配存储：", torch.cuda.memory_allocated() / (1024.0 * 1024.0), "MB")
```

最终，发现问题在engine.py，检测函数里的：

```python
gts.extend(list(itertools.chain.from_iterable(utils.all_gather(copy.deepcopy(targets)))))
```

​		它会用expend扩展这些数组(preds和gts)，且这些数组（内容是字典）内含的值是放到gpu上的，所以就越来越大。一种解决办法是：我们把它们放到cpu上。代码如下：

```python
results_wout_tensor = [{k:v.to('cpu') for k,v in t.items()} for t in results] preds.extend(list(itertools.chain.from_iterable([results_wout_tensor])))
```

```
targets_wout_tensor = [{k:v.to('cpu') for k,v in t.items()} for t in copy.deepcopy(targets)]
gts.extend(list(itertools.chain.from_iterable([targets_wout_tensor])))
```

​    但是我32G的CPU，也不能承担，跑了四分之三就killed了。建议是测一半图片吧，烂咯。

​	**后续更新：之后的某一天我测试的时候又没有这个问题了，我真昏迷了 气笑了**

# 产出黑图或绿图：Potential NSFW content was detected in one or more images. A black image will be returned instead. Try again with a different prompt and/or seed.

​    在用diffusers库的时候出现了这个问题。有的帖子会说，去diffusers源码注释掉safe_checker，无效。由于我是下载到本地的模型，用的fp16，后来在github的issue里找到了问题和答案：[Disabling safety-model or fixing false positives? · Issue #239 · CompVis/stable-diffusion (github.com)](https://github.com/CompVis/stable-diffusion/issues/239)。究其原因，是我用的GTX1650Ti不支持半精度计算。

# ImportError: cannot import name '_new_empty_tensor' from 'torchvision.ops'

直接注释掉misc.py里引用这玩意的地方，因为根本用不到。

```python
# if float(torchvision.__version__[:3]) < 0.7:
  # from torchvision.ops import _new_empty_tensor
  # from torchvision.ops.misc import _output_size
```

