// 最新文章
hexo.extend.helper.register('newPost', function() {
    let name, time;
    hexo.locals.get('posts').map((item, index) => {
        if (index == 0) name = item.title, time = item.date
        else if (item.date > time) { name = item.title, time = item.date }
    });
    return name
})