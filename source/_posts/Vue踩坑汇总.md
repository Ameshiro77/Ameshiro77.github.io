---
uuid: a0277e40-f341-11ed-ae88-af97eea8451a
title: Vue+Node.js踩坑汇总
author: Ameshiro
top: false
toc: true
mathjax: true
copyright_author: Ameshiro
description: 只用来记录自己用vue踩的坑 非教程
img: 
tags:
  - Node.js
  - Vue
  - 前端
categories:
  - Vue
abbrlink: 6ec3ee5e
date: 2023-05-16 00:57:50
updated:
cover: https://s2.loli.net/2023/05/16/o9tnP5G4qQgDMXS.jpg
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

​		**开发前端后端太折磨了。本博客只是个人用来记录用Vue踩的坑，并非是教程向。**

# 由于奇异字符引起的'MODULE_NOT_FOUND'

​		我们知道，学计算机最忌讳的事情之一就是用中文命名文件夹。但是，如果你的文件夹包括了像“&”这样的奇葩符号，也会因为这个掉坑里（别的符号我不知道，这个坑我是踩麻了）。

​		报错表现为：

```vue
node:internal/modules/cjs/loader:959
  throw err;
```

​		然后会说你  'MODULE_NOT_FOUND'。如果您不想修改文件名(**前提是您文件名含的不是中文，而是一些奇异的符号，鬼知道中文还能弄出来什么东西**,**我试了下，用中文的时候此法无用**)，您可以采用以下解决方法，当然我不保证正确性，反正我用起来是好的：

​		进入./node_modules文件夹，再进入./bin，然后找到vue-cli-service.cmd，我们把里面的原本的IF-ELSE代码修改如下：

​		原先是：

```
IF EXIST "%dp0%\node.exe" (
	 SET "_prog=%dp0%\node.exe"
) ELSE (
 SET "_prog=node"
 SET PATHEXT=%PATHEXT:;.JS;=;%
)
```

​		修改成：

```
@IF EXIST "%~dp0\node.exe" (
 "%~dp0\node.exe"  "%~dp0\..\@vue\cli-service\bin\vue-cli-service.js" %*
) ELSE (
 @SETLOCAL
 @SET PATHEXT=%PATHEXT:;.JS;=;%
 node  "%~dp0\..\@vue\cli-service\bin\vue-cli-service.js" %*
)
```

​		不保证正确性，反正我用的没问题。

# Node版本问题：sass无法npm install

​		当你使用npm install的时候，有时候或许会发生如图的错误：

<img src="https://s2.loli.net/2023/05/16/PMr96iTbJfyaR2Z.png" alt="image-20230516010559985" style="zoom:80%;" />

​		我们知道npm install是根据package.json里的东西安装的，这种错误说明package.json里对应包的版本和你当前node版本不符合。就比如我这个，node是16.0+版本，查询得知要求的sass版本要6.0+才行。

​		**特别注意，你改了sass版本后，还要给对应sass_loader的版本，不然照样报错。**

# el-upload的action接口

​		由于本人是vue+flask，flask开在端口8080，vue开在端口8081，所以前端掉后端接口掉的是8080。上传东西时，我们可以选用el-upload，在action中指定端口：

<img src="https://s2.loli.net/2023/05/23/vUeaTnEk4iF8xho.png" alt="image-20230523000145039" style="zoom:80%;" />

​		这里的action的端口最好详细给出，如果不写清楚端口号的话，以我这个为例，他会调8081的api，所以会发生错误。

# v-for的ref，以及"调子组件函数与渲染页面"的顺序问题

​		现在是这么一个场景：我们要用v-for渲染一组图片，代码如下：

<img src="https://s2.loli.net/2023/05/23/9IjEROD5fpzbo18.png" alt="image-20230523000622225" style="zoom:80%;" />

​		responseImage是我们点击搜索按钮后，返回的图像数据。

## 问题1：ref问题

​		对于v-for的ref，我们不能直接用this->$refs.imageCard.f() (f是子组件里的函数) 来调用子组件的函数f，因为这里的refs.imageCard是一个数组，所以我们要用索引方式调用。也就是refs.imageCard[0].f().

(别问我为啥不写$，会和前面的符号合并懒得处理了。。)

## 问题2：渲染问题

​		我们父组件里有这么一个函数，也就是上传后的函数：

<img src="https://s2.loli.net/2023/05/23/jOHcC4Iwy3uVlWE.png" alt="image-20230523001040027" style="zoom:80%;" />

​		上传成功后，responseImage会更新。但是，如果我们在这里去打印出v-for里的item的话，此时得到的是更新前的response。具体渲染机制我不太了解，但如果我们要在父组件的函数里，在这时去调用子组件的函数的话，子组件此时的数据（我这个例子里是imageUrl）还是未更新过的，所以做操作的话会慢一步。

​		解决办法：在子组件里加个watch函数，监视imageUrl。
