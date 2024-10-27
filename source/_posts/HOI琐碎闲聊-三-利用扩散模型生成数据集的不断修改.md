---
uuid: 7b846d70-fbdb-11ee-bb63-ab4ea605d3ef
title: 'HOI琐碎闲聊(三):利用扩散模型生成数据集的不断修改'
author: Ameshiro
top: false
cover: 'https://s2.loli.net/2023/04/03/pvexKZFJ94oGbu8.jpg'
toc: true
mathjax: true
copyright_author: Ameshiro
hidden: false
abbrlink: '94217547'
date: 2024-04-16 18:24:18
updated:
description:
img:
top_img:
password:
summary:
tags:
  - CV
  - HICO-DET
  - 人/物交互检测
categories:
  - CV
copyright:
copyright_author_href:
copyright_url:
copyright_info:
aplayer:
highlight_shrink:
aside:

---

​		HICO-DET数据集有明显的长尾分布现象，因此一种直接的方式是利用文生图模型生成人造数据集。在最开始，我们所拥有的只有600个hoi三元组对应的短语（如：a photo of a person boarding a airplane）。

​		最开始，依据diffhoid论文给出的方法，生成人造数据集分为三步：第一步，生成提示词。把短语中的person替换成一个随机的人，race+human，比如asian boy、black man等等。然后再加上一些描述quality、details的词语，最终例子如：*a photo of a black young man reading a laptop,best quality,Vivid Colors,urban,4K,warm lighting,front view,iphone 12*。第二步，过滤。具体方法是：首先用一个先进的目标检测器（这里采用DINO）检测图中的人与物。遍历图中的物体（如果检测不出指定物体直接扔掉），找到与物体最近的人，然后：如果物体出现在指定的hoi三元组中，就分配对应的动作；否则，分配no interaction(第58个verb)。然后，遍历图中的人，如果该人没有被分配，则找到与它最近的物体，然后根据物体分配动作。第三步，标注。分配好后，按照HICO-DET的格式标注，存成json文件。最后，对于初步筛选后的这些图片手动筛选。

​		**但是，hoi的动词模糊性非常高，而且人和物之间可能有许多同时发生的动作。**首先为缓解后者，我从600个hoi三元组里提取了许多可能会同时发生的动作，并且把它们存储在了一个列表之中。比如列表项(267, 377, 378)，代表hold、cut with knife和cut cake。（当然，这种设计多物体的极少，只有这个和dry cat/dog and hold、operate drier，因为只有dry cat扩散模型根本生成不出来。）然后再修改一下prompt生成逻辑，比如：*a photo of a asian boy cutting a pizza,cutting with and holding a knife,best quality,Vivid Colors,urban,4K,blue hour,iphone 12*。

​	  此外，我们主要目的是解决长尾分布问题。我之前是从600个hoi里按权重随机抽取hoi，如果抽到的hoi可能会有别的同时发生的动作，就极大概率加上这些动作。后来，我修改了一下：首先统计HICO-DET+人造数据集中hoi的数量分布，然后从尾部里挑出最少的N个hoi，依次生成M个图片过滤。

​		但是SD1.5的生成效果不太理想，它似乎无法理解大多数hoi元组的含义。为此我加入CLIP进行过滤（见上一篇文章），但是过滤出来的效果还是不够好。归根结底，毕竟CLIP也应用在SD模型的文生图环节，效果不好也是可以预见的。以具体例子来说，就算指定stand on a chair，SD模型也总是生成一个椅子和站在地上的人；有些像stab a person这样的更是不可能通过出来（有安全检查机制）。此外，尽管我加了许多的负面提示词，依旧会生成不少恐怖诡异的图像。

### 2024/4/20

​		决定尝试diffusers的图生图，将调度器换成DDIM/DDPM。虽然把图像大小改成了800*800，但是经查阅得知：一是由于隐空间八倍降维，H和W要是8的倍数；二是SD1.x训练时用的是512x512，所以1.x指定512,2.x指定768x768最佳，所以决定依旧采用512x512。

​		从官网[Image-to-image (huggingface.co)](https://huggingface.co/docs/diffusers/api/pipelines/stable_diffusion/img2img)，我们需要先知道两个关键参数：

- **strength** (`float`, *optional*, defaults to 0.8) — Indicates extent to transform the reference `image`. Must be between 0 and 1. `image` is used as a starting point and more noise is added the higher the `strength`. The number of denoising steps depends on the amount of noise initially added. When `strength` is 1, added noise is maximum and the denoising process runs for the full number of iterations specified in `num_inference_steps`. A value of 1 essentially ignores `image`.
- **guidance_scale** (`float`, *optional*, defaults to 7.5) — A higher guidance scale value encourages the model to generate images closely linked to the text `prompt` at the expense of lower image quality. Guidance scale is enabled when `guidance_scale > 1`.

​		可以看出，stength是加噪的强度，所以越低越像原图。

​		

​		
