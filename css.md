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
![运行显示](./toc/images/css01.png)

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
![运行显示](./toc/images/css02.png)

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

