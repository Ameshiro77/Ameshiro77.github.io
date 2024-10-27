！！！使用须知：

必须依次执行：git pull；然后hexo new post 下文章；然后git add .，git commit -m / ,git push origin hexo;

最后再hexo cl && hexo g && hexo d.

[如何实现hexo博客的不同电脑间的迁移和同步_hexo异地同步-CSDN博客](https://blog.csdn.net/weixin_44008788/article/details/108325786#:~:text=如何实现hexo博客的不同电脑间的迁移和同步 1 在原电脑上操作，给 username.github.io 博客仓库创建hexo分支，并设为默认分支。 2 随便一个目录下，命令行执行 git,"--"， git push origin hexo，把刚才删除操作引起的本地仓库变化更新到远程，此时刷新下 github 端博客hexo分支，应该已经被清空了。 更多项目)

所有东西推送到了hexo分支上，实际网页部署部署在main分支。