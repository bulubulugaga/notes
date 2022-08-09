# 踩坑系列
## 兼容性
### ios input输入框
ios 输入框颜色默认是灰色，已输入内容也是灰色，需要手动设置color，但是disable状态下设置color好像没有效果
### ios拍照上传图片
在小程序中只要当前页面有onShow(){}，无论其中是否有逻辑处理，使用wx.chooseImage()都会导致选择图片或拍照之后返回页面刷新     
小程序嵌套h5时(web-view)，使用原生 < input accept="image/*" > 上传图片，选择图片时没有问题，拍照上传时候也会刷新页面导致之前的数据丢失    
### canvas
在使用canvas压缩图片时，ios会报错，但是一直查不到原因，猜测是因为canvas宽高过大，导致重新生成图片有问题，然后报错
### ios底部安全区
ios部分机型底部有黑线，有些底部固定dom如按钮，需要留出这个安全区域
```
bottom: calc(0px + constant(safe-area-inset-bottom));
bottom: calc(0px + env(safe-area-inset-bottom));
```