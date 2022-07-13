# 以管理员身份打开某文件
**以hosts文件为例**

**某些文件直接修改会提示没有权限，此时可以用管理员身份进行修改**

1. hosts文件一般在c:window/system32/drivers/etc，打开至此文件
2. 点击左上角文件选项卡
3. 鼠标移至打开window powershell，选择以管理员身份打开
4. 输入notepad hosts，打开之后就能修改该文件。

**win+x可以直接打开快捷菜单，也能打开powershell面板**

# 某些外网打开失败
**以github为例**

1. 准备修改hosts文件
2. 查询github网址：<https://github.com.ipaddress.com/>   
  ![ip实例](./toc/images/other/管理员01.png)   
3. 文件最后附上即可
> 140.82.112.4 github.com
4. 本条参照<https://zhuanlan.zhihu.com/p/158938544>

**github--->加速器**   
<a href="http://www.oniongeeker.com/2021/05/08/git-slow/" target="_blank">http://www.oniongeeker.com/2021/05/08/git-slow/</a>

# 常用快捷键

| 快捷键 | 说明 |
| --- | --- |
| win + R | 打开运行对话框(可打开cmd等面板) |
| win + Tab | 显示所有已经打开的窗口 |
| win + Alt | 切换打开的窗口 |
| Ctrl + Shift + Esc | 打开任务管理器 |
| win + v | 多重剪切板 |   

# 软技能
## 问题
### CRLF是什么
<a href="https://developer.mozilla.org/zh-CN/docs/Glossary/CRLF" target="_blank">MDN</a>解释：    
回车符（CR）和换行符（LF）是文本文件用于标记换行的控制字符（control characters）或字节码（bytecode）。    

CR = Carriage Return，回车符号（\r，十六进制 ascii 码为0x0D，十进制 ascii 码为13），用于将鼠标移动到行首，并不前进至下一行。   
LF = Line Feed，换行符号（ \n, 十六进制 ascii 码为 0x0A，十进制 ascii 码为10）。   
紧邻的 CR 和 LF（组成 CRLF，\r\n，或十六进制 0x0D0A）将鼠标移动到下一行行首。（Windows 操作系统默认的文本换行符为 CRLF；Linux 以及 macOS 系统默认使用 LF，早期的 mac os 系统使用 CR 换行。）

# 相关链接
## 前端学习
<a href="https://developer.mozilla.org/zh-CN/" target="_blank">MDN</a><br />
<a href="https://www.yuque.com/kenguba" target="_blank" style="color: red">语雀·一缕清风(强推)</a><br />
<a href="https://www.cnblogs.com/onepixel/" target="_blank">一像素(偏个人文章类)</a><br />
<a href="https://www.pipipi.net/" target="_blank">犀牛部落(文章教程含代码)</a><br />
<a href="http://caibaojian.com/" target="_blank">caibaojian</a><br />
<a href="https://juejin.cn/post/6844903896637259784" target="_blank" style="color: red">学习文章推荐(强推)</a><br />
<a href="https://blog.csdn.net/qq_40126542/article/details/80292310" target="_blank">学习资源统计</a><br />
<a href="https://juejin.cn/post/6844903750293782541" target="_blank">常见缩写(感觉更合理一些)</a><br />
<a href="https://dablelv.blog.csdn.net/article/details/102625814#32__86" target="_blank">常见缩写</a><br />

## css
<a href="https://juejin.cn/post/6844903902123393032#heading-0" target="_blank">小知识点(一些属性)</a><br />
<a href="https://lhammer.cn/You-need-to-know-css/#/zh-cn/introduce?v=1" target="_blank">You-need-to-know-css(有小demo)</a><br />

## js
<a href="https://zh.javascript.info/" target="_blank">现代js教程</a><br />
<a href="https://juejin.cn/post/7002248038529892383" target="_blank">实现js原生方法</a><br />
<a href="https://www.jianshu.com/p/2975c25e4d71" target="_blank">函数柯里化</a><br />
<a href="https://www.cnblogs.com/dhui/p/12982452.html" target="_blank">构造函数、原型和原型链</a><br />
<a href="https://zhuanlan.zhihu.com/p/88592583" target="_blank">自有属性、继承属性、枚举属性、不可枚举属性</a><br />
<a href="https://juejin.cn/post/6844904077537574919#heading-0" target="_blank">promise题</a><br />
<a href="https://juejin.cn/post/6994594642280857630#heading-0" target="_blank">手写promise</a><br />
<a href="https://juejin.cn/post/6995334897065787422#heading-0" target="_blank">ES6+小技巧</a><br />
<a href="https://juejin.cn/post/6981588276356317214" target="_blank">js垃圾回收机制</a><br />
<a href="https://zhuanlan.zhihu.com/p/133251955" target="_blank">js动画库</a><br />

## vue
<a href="https://juejin.cn/post/6981031288803164173" target="_blank">vue后台管理权限校验与动态路由</a><br />
<a href="https://juejin.cn/post/6906028995133833230#heading-8" target="_blank">vue实用自定义指令</a><br />
<a href="https://panjiachen.github.io/vue-element-admin-site/zh/guide/" target="_blank">vue + elementui后台</a><br />

## 面试
### 系统
<a href="https://juejin.cn/post/6982524029341007879#heading-0" target="_blank" style="color: red">面试知识点（主js和算法）</a><br />
<a href="https://juejin.cn/post/6987549240436195364?from=main_page#heading-0" target="_blank">偏各项理论（包括工程和一些业务思考）</a><br />

### js
<a href="https://www.yuque.com/kenguba/upkpls/zaktcz" target="_blank">语雀·一缕清风(强推)</a><br />

### vue
<a href="https://juejin.cn/post/6961222829979697165" target="_blank" style="color: red">vue面试题</a><br />
<a href="https://juejin.cn/post/6844903918753808398" target="_blank">vue面试题</a><br />

## http
<a href="https://www.runoob.com/http/http-tutorial.html" target="_blank">菜鸟联盟手册</a>

## git
<a href="https://www.cnblogs.com/wbl001/p/11495110.html" target="_blank">git指令</a>

## 其他小东西
<a href="http://www.51pptmoban.com/ppt/" target="_blank">免费ppt模板</a><br />
<a href="https://www.aconvert.com/cn/video/" target="_blank">文档转换（包括视频转图片）</a><br />
<a href="https://www.bypass.cn/" target="_blank">分流抢票</a><br />
<a href="http://www.templatesy.com/" target="_blank">网站模板</a><br />
<a href="https://www.17sucai.com/pins/tag/1148.html" target="_blank">网站模板</a><br />



# git
## 相关报错
**1、git warning: LF will be replaced by CRLF in 文件名**   
windows中的换行符为 CRLF， 而在Linux下的换行符为LF，所以在执行add . 时出现提示警告    
> 删除文件.git  
  git config --global core.autocrlf false  
  重新执行git init和git add .
## 添加ssh
cmd 下执行 ssh-keygen -t rsa -C "your@email.com"   
在 c盘 下 user 文件中生成两个文件：id_rsa、id_rsa.pub，复制 .pub 下内容粘贴至 github ssh设置中

