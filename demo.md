# 动态效果
## 液体加载
搬自b站&emsp;UID:35116390
```
<style>
  * {
    margin: 0;
    padding: 0;
  }
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    /* background: #010b10; */
  }
  svg {
    width: 0;
    height: 0;
  }
  .loader {
    position: relative;
    width: 200px;
    height: 200px;
    filter: url(#gooey);
  }
  .loader span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    animation: animate 4s ease-in-out infinite;
    animation-delay: calc(0.2s * var(--i));
  }
  .loader span:before {
    position: absolute;
    content: '';
    top: 0;
    left: calc(50% - 20px);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 0 30px #03a8f4;
    background: linear-gradient(#fce4ec, #03a8f4);
  }
  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }
    50%,100% {
      transform: rotate(360deg);
    }
  }
</style>
<div class="loader">
  <span style="--i:1;"></span>
  <span style="--i:2;"></span>
  <span style="--i:3;"></span>
  <span style="--i:4;"></span>
  <span style="--i:5;"></span>
  <span style="--i:6;"></span>
  <span style="--i:7;"></span>
</div>
<svg>
  <filter id="gooey">
    <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
    <feColorMatrix values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 20 -10
    " />
  </filter>
</svg>
```
![动画演示效果](./toc/images/demo/动画01.gif)