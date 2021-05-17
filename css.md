# 伪类和伪元素
css3为了区分伪类和伪元素，伪元素采用双冒号写法
* 常见伪类  :hover, :link, :active, :target, :not(), :focus。
* 常见伪元素  ::first-letter, ::first-line, ::before, ::after, ::selection。   

## ::after和::before   
::before和::after下特有的content，用于在css渲染中向元素逻辑上的头部或尾部添加内容。   
这些添加不会出现在DOM中，不会改变文档内容，不可复制，仅仅是在css渲染层加入。    
所以不要用:before或:after展示有实际意义的内容，尽量使用它们显示修饰性内容，例如图标。
```
<style type="text/css">
    .phoneNumber::before {
      content: '\260E';
      font-size: 15px;
    }
  </style>
  <p class="phoneNumber">12345645654</p>
```
运行结果：  
![运行显示](./toc/images/css/伪类01.png)

### content属性
::before和::after必须配合content属性来使用，content用来定义插入的内容，content必须有值，至少是空。默认情况下，伪类元素的display是默认值inline，可以通过设置display:block来改变其显示。
content可以取以下值   

**1、String**   
```
<style type="text/css">
p::before{
    content: "《";
    color: blue;
}
p::after{
    content: "》";
    color: blue;
}
</style>
<p>平凡的世界</p>
```
运行结果：《平凡的世界》

**2、attr()**    
通过attr()调用当前元素的属性，比如将图片alt提示文字或者链接的href地址显示出来
```
<style type="text/css">
a::after{
    content: "(" attr(href) ")";
}
</style>
<a href="http://www.cnblogs.com/starof">starof</a>
```  
运行结果：starof（http://www.cnblogs.com/starof）

**3、url/uri()**  
用于引用媒体文件，例如“百度”前面给出图片，后面给出href属性   
```
<style>
a::before{
    content: url("https://www.baidu.com/img/baidu_jgylogo3.gif");
}
a::after{
    content:"("attr(href)")";
}
</style>
<a href="http://www.baidu.com">百度</a>
```
运行结果：   
![百度logo](https://www.baidu.com/img/baidu_jgylogo3.gif)百度(https://www.baidu.com/img/baidu_jgylogo3.gif)

### 使用   
1、清楚浮动
```
.row:after { 
	width:0;
	height:0;
	content:'';
	display: block;
	clear: both;
}
```
2、绘制图形效果
```
<style>
#star-six {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
  position: relative;
}
#star-six::after {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-top: 100px solid red;
  position: absolute;
  content: "";
  top: 30px;
  left: -50px;
}
</style>
<body>
<div id="star-six"></div>
</body>
```
![运行显示](./toc/images/css/伪类02.png)

## :before和::before的区别  

* 相同点   
    1. 都可以用来表示伪类对象，用来设置对象前的内容   
    2. :befor和::before写法是等效的   
* 不同点  
    1. :befor是Css2的写法，::before是Css3的写法   
    2. :before的兼容性要比::before好 ，不过在H5开发中建议使用::before比较好   
* 其它
    1. 伪类对象要配合content属性一起使用
    2. 伪类对象不会出现在DOM中，所以不能通过js来操作，仅仅是在 CSS 渲染层加入
    3. 伪类对象的特效通常要使用:hover伪类样式来激活
```
.test:hover::before { /* 这时animation和transition才生效 */ }
```

# 题库
## 问题
### 在页面上隐藏元素的方法有哪些    
* **占位:**   
    visibility: hidden;&emsp;&emsp;&emsp;页面会渲染只是不显示。  
    margin-left: -100%;    
    opacity: 0;&emsp;&emsp;&emsp;页面渲染，占据空间，引起重绘。   
    transform: scale(0);   
    z-index: -9999999999999  
    position: relative; left: -100%   
* **不占位:**  
    display: none;&emsp;&emsp;&emsp;页面不会渲染，可以减少首屏渲染的时间，但是会引起回流和重绘。  
    width: 0; height: 0; overflow: hidden;  
* **仅对块内文本元素:**  
    text-indent: -9999px;  
    font-size: 0;  

## 编程
### 圣杯布局和双飞翼布局   
> **作用：**    
圣杯布局和双飞翼布局解决的问题是相同的，就是两边顶宽，中间自适应的三栏布局，中间栏要在放在文档流前面以优先渲染。   

> **区别：**    
圣杯布局：为了让中间div内容不被遮挡，将中间div设置了左右padding-left和padding-right后，将左右两个div用相对布局position: relative并分别配合right和left属性，以便左右两栏div移动后不遮挡中间div。    
双飞翼布局：为了让中间div内容不被遮挡，直接在中间div内部创建子div用于放置内容，在该div里用margin-left和margin-right为左右两栏div留出位置。   

**圣杯布局**    
优点：不需要添加dom节点     
缺点：圣杯布局的缺点：正常情况下是没有问题的，但是特殊情况下就会暴露此方案的弊端，如果将浏览器无线放大时，「圣杯」将会「破碎」掉。如图：当middle部分的宽小于left部分时就会发生布局混乱。（middle<left即会变形）
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>圣杯布局</title>
        <style>
            #bd{
                padding: 0 200px 0 180px;
                height: 100px;
            }
            #middle{
                float: left;
                width: 100%;
                height: 500px;
                background:blue;
            }
            #left{
                float:left;
                width:180px;
                height:500px;
                margin-left:-100%;
                background: #0c9;
                position: relative;
                left: -180px;
            }
            #right{
                float: left;
                width: 200px;
                height: 500px;
                margin-left: -200px;
                background: #0c9;
                position: relative;
                right: -200px;
            }
        </style>
    </head>
    <body>
        <div id="bd">
            <div id="middle">middle</div>
            <div id="left">left</div>
            <div id="right">right</div>
        </div>
    </body>
</html>
```
**双飞翼布局**     
优点：不会像圣杯布局那样变形    
缺点是：多加了一层dom节点
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>双飞翼布局</title>
        <style>
            #center{
                float:left;
                width:100%;   
                height:100px;
            }
            #inside{
                margin:0 200px 0 180px;
                height:100px;
                background:blue;
            }
            #left{
                float:left;
                width:180px;
                height:100px;
                margin-left:-100%;
                background:#0c9;
            }
            #right{
                float:left;
                width:200px;
                height:100px;
                margin-left:-200px;
                background:#0c9;
            } 
        </style>
    </head>
    <body>
        <div id="center">
            <div id="inside">middle</div>
        </div>
        <div id="left">left</div>
        <div id="right">right</div>
    </body>
</html>
```
