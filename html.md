# 标签
## 链接
### 超链接target属性的取值和应用
| 取值 | 应用 |
| :----: | ----- |
| _self | 默认值，在当前窗口或者框架(包括iframe)中加载目标文档。 |
| _blank | 在新窗口中打开被链接文档，iframe中也是 |
| _parent |  在父框架中打开（比如你在页面中嵌套一个iframe1，再在iframe1里面嵌套一个iframe2，那么iframe2里的超链接就会在iframe1打开，并且会覆盖iframe1的所有内容），当a标签本身在顶层时，则与 _self 相同 |
| _top | 在浏览器的整个窗口显示内容，忽略掉所有的框架结构 |
| framename | 在指定的框架中打开被链接文档。 |
| 任意字符 | 若该链接不是已打开的页面，则在新窗口中打开，与_blank一致；若该链接已经打开，则跳转到该标签页并刷新页面。 |  
## 表单 
### label的属性和作用
```
<label for="name" accesskey="N">姓名：</label><input type="text" id="name" />
<label for="password" accesskey="P">密码</label><input type="password" id="password" />
```
FOR属性：表示Label标签要绑定的HTML元素，你点击这个标签的时候，所绑定的元素将获取焦点。    
ACCESSKEY属性：表示访问Label标签所绑定的元素的热键，当您按下热键，所绑定的元素将获取焦点。在这里必须指定for才能起作用。所设置的快捷键不能与浏览器的快捷键冲突，否则将优先激活浏览器的快捷键。  
## meta
### viewport
viewport 就是视区窗口，也就是浏览器中显示网页的部分。PC 端上基本等于设备显示区域，但在移动端上 viewport 会超出设备的显示区域（即会有横向滚动条出现），设备默认的 viewport 在 980 – 1024 之间。  

为了让移动端可以很好地显示页面，因此需要对 viewport 进行设置。相关的设置值如下：   

| 属性 | 作用 |
| :---: | :---: |
| width | 设置layout viewport 的宽度，为一个正整数，或字符串"width-device" |
| initial-scale | 设置页面的初始缩放值，为一个数字，可以带小数 |
| minimum-scale | 允许用户的最小缩放值，为一个数字，可以带小数 |
| maximum-scale | 允许用户的最大缩放值，为一个数字，可以带小数 |
| height | 设置layout viewport  的高度，这个属性对我们并不重要，很少使用 |
| user-scalable | 是否允许用户进行缩放，值为"no"或"yes", no 代表不允许，yes代表允许 |

代码演示：
```
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
```


# 题库
## 问题
### 页面导入样式时，使用link和@import有什么区别   
1. link是HTML标签，@import是css提供的。   
2. link引入的样式页面加载时同时加载，@import引入的样式需等页面加载完成后再加载。   
3. link没有兼容性问题，@import不兼容ie5以下。   
4. link可以通过js操作DOM动态引入样式表改变样式，而@import不可以。   

### HTML5的离线储存
* HTML5离线存储存储功能非常强大，它的作用（优点）是：在用户没有与因特网连接时，可以正常访问站点或应用，加快资源的加载速度，减少服务器负载，在用户与因特网连接时，自动更新缓存数据。   
* **使用：**   
首先，在html页面头部加入一个manifest的属性:
```
<!DOCTYPE HTML>
<html manifest = "cache.manifest">
...
</html>
```
然后创建manifest.appcache文件：
```
CACHE MANIFEST
#v0.11
CACHE:
js/app.js
css/style.css
NETWORK:
resourse/logo.png
FALLBACK:
offline.html
```
  * CACHE MANIFEST放在第一行
  * CACHE: 表示需要离线存储的资源列表，由于包含manifest文件的页面将被自动离线存储，所以不需要列出来
  * NETWORK: 表示在线才能访问的资源列表，如果CACHE列表里也存在，则CACHE优先级更高   
    可以使用 “*” 来指示所有其他资源/文件都需要因特网连接：
    > NETWORK: *
  * FALLBACK: 在此标题下列出的文件规定当页面无法访问时的回退页面。比如上面这个文件表示的就是如果访问根目录下任何一个资源失败了，那么就去访问offline.html。
* **原理：**   
HTML5的离线存储是基于一个新建的.appcache文件的，通过这个文件上的解析清单离线存储资源，这些资源就会像cookie一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。
* **浏览器如何解析manifest**    
在线情况：浏览器发现html头部有manifest属性，他会请求manifest文件，如果是第一次访问，那么浏览器会根据manifest文件的内容下载相应的资源并且进行离线存储.如果已经访问过并存储，那么浏览器使用离线的资源价值，然后对比新的文件，如果没有发生改变就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储   
离线情况：浏览器就直接使用离线存储资源  
* **注意**   
  * 站点离线存储的容量限制是5M
  * 如果manifest文件，或者内部列举的某一个文件不能正常下载，整个更新过程将视为失败，浏览器继续全部使用老的缓存
  * 引用manifest的html必须与manifest文件同源，在同一个域下
  * 在manifest中使用的相对路径，相对参照物为manifest文件
  * CACHE MANIFEST字符串硬在第一行，且必不可少
  * 系统会自动缓存引用清单文件的HTML文件
  * manifest文件中CACHE则与NETWORK，FALLBACK的位置顺序没有关系，如果是隐式声明需要在最前面
  * FALLBACK中的资源必须和manifest文件同源
  * 当一个资源被缓存后，该浏览器直接请求这个绝对路径也会访问缓存中的资源。站点中的其他页面即使没有设置manifest属性，请求的资源如果在缓存中也从缓存中访问
  * 当manifest文件发生改变时，资源请求本身也会触发更新  

其他相关参考[《HTML5的文件离线存储怎么使用,工作原理?》](https://juejin.cn/post/6844903902727372807)   
### 浏览器内多个标签页间的通信
总结：   
1. cookie + setInterval方式
2. localStorage方式
3. webSocket方式
4. SharedWorker方式     

详情: [《实现浏览器内多个标签页面之间通信的四种方法?》](https://blog.csdn.net/weixin_46399753/article/details/105211771)  

### 浏览器内核
浏览器内核主要分成两个部分：渲染引擎(layout engineer 或者 Rendering Engine)和JS引擎。   
**渲染引擎**：负责取得网页的内容(html，xml和图像等)，整理讯息(例如加入css)，以及计算网页的显示方式，然后输出到显示器或打印机。浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不同。所有网页浏览器、电子邮件客户端以及它需要编辑、显示网络内容的应用程序都需要内核。  
**JS引擎**：解析和执行JavaScript来实现网页的动态效果。  
最开始渲染引擎和JS引擎并没有区分的很明确，后来JS引擎越来越独立，内核就倾向于只指渲染引擎。 

**常用的浏览器内核**   
1、Trident(IE内核)   
国内很多的双核浏览器的其中一核便是 Trident，也有称"兼容模式"。   
代表：IE、腾讯TT、猎豹安全浏览器、360极速浏览器、百度浏览器等。Window10 发布后，IE 将其内置浏览器命名为 Edge，Edge 最显著的特点就是新内核 EdgeHTML。  
2、Gecko(firefox)   
Gecko(Firefox 内核)： Mozilla FireFox(火狐浏览器) 采用该内核，代码完全公开，因此，其可开发程度很高，但今年打开速度慢、升级频繁。   
3、webkit(Safari)   
Safari 是苹果公司开发的浏览器，所用浏览器内核的名称是大名鼎鼎的 WebKit。现在很多人错误地把 webkit 叫做 chrome内核（即使 chrome内核已经是 blink 了）。   
代表浏览器：傲游浏览器3、 Apple Safari (Win/Mac/iPhone/iPad)、Symbian手机浏览器、Android 默认浏览器。   
4、Chromium/Bink(chrome)   
Chromium 项目中研发 Blink 渲染引擎（即浏览器核心），内置于 Chrome 浏览器之中。Blink 其实是 WebKit 的分支。   
大部分国产浏览器最新版都采用Blink内核。    
5、Presto(Opera)   
Presto 是挪威产浏览器 opera 的 "前任" 内核，最新版已经与谷歌一致。    

**移动端的浏览器内核主要说的是系统内置浏览器的内核**
目前移动设备浏览器上常用的内核有 Webkit，Blink，Trident，Gecko 等，其中   
iPhone 和 iPad 等苹果 iOS 平台主要是 WebKit，    
Android 4.4 之前的 Android 系统浏览器内核是 WebKit，   
Android4.4 系统浏览器切换到了Chromium，内核是 Webkit 的分支 Blink，   
Windows Phone 8 系统浏览器内核是 Trident。  

[更多浏览器内核详细信息](https://www.cnblogs.com/chengzp/p/7757844.html)



## 编程