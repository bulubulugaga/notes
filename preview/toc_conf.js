var jquery_ztree_toc_opts = {
    debug: false,
    is_auto_number: true,
    documment_selector: '.markdown-body',
    ztreeStyle: {
        width: '326px',
        overflow: 'auto',
        position: 'fixed',
        'z-index': 2147483647,
        border: '0px none',
        left: () => {
            let winWidth = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
            if(winWidth <= 1440) {
                return 0;
            }
            else {
                return (winWidth - 1480) / 2 + 'px';
            }
        },
        top: '100px',
        'overflow-x': 'hidden',
        'height': $(window).height() - 120 + 'px',
    }
}
// console.log(document.querySelector('.header-container'));
var markdown_panel_style = {
    'width': '1066px',
    'margin-top': '100px',
    'margin-left': () => {
        let winWidth = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
        if(winWidth <= 1440) {
            return 400;
        }
        else {
            return (winWidth - 1500) / 2 + 420 + 'px';
        }
    }
};

function init() {
    // 初始化设置样式
    const body = document.querySelector('body');
    // 头部
    const oDiv = document.createElement('div');
    oDiv.innerHTML = `
        <style>
            .blue {color: #0088f5;}
            .f12 {font-size: 12px;}
            .f14 {font-size: 14px;}
            .f18 {font-size: 18px;}
            .f20 {font-size: 20px;}
            .f30 {font-size: 30px;}
            .FB {font-weight: bold;}
            .mt5 {margin-top: 5px;}
            .ml15 {margin-left: 15px;}
            .ml-auto {margin-left: auto;}
            .ellip {white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
            .flex-middle {display: flex; align-items: center;}
            .pointer:hover {cursor: pointer;}
            .header-bg {position: fixed;top: 0;left: 0;width: 100%; height: 61px;z-index: 999;background-color: rgba(255, 255, 255, .6); backdrop-filter: blur(5px);}
            .header-container {width: 1440px;height: 100%;margin: 0 auto;}
            .header-container-middle {list-style-type:none; margin-left: 100px;}
            .header-container-middle li {display:inline; margin-left: 20px;}
            .header-container-middle a {font-size: 14px;text-decoration: none;color: rgba(0, 0, 0, .54);}
            .header-container-middle a:hover {color: #0088f5;font-weight:bold;}
            .header-nav-active a {color: #0088f5;font-weight:bold;}
            .header-container-right {width: 168px;}
            .header-container-right .icon-m-play, .header-container-right .icon-m-vo {margin-top: 1px;}
            .header-container-right .iconfont, .header-container-right .music-name {opacity: .1;transition: opacity .1s, visibility .1s;}
            .header-container-right:hover .iconfont, .header-container-right:hover .music-name {opacity: .3;} 
            .header-container-right:hover .iconfont:hover, .header-container-right:hover .music-name:hover {opacity: .8;} 
            @font-face {
                font-family: 'iconfont';
                src: url('https://at.alicdn.com/t/font_2453886_6k6rqapers4.eot');
                src: url('https://at.alicdn.com/t/font_2453886_6k6rqapers4.eot?#iefix') format('embedded-opentype'),
                url('https://at.alicdn.com/t/font_2453886_6k6rqapers4.woff2') format('woff2'),
                url('https://at.alicdn.com/t/font_2453886_6k6rqapers4.woff') format('woff'),
                url('https://at.alicdn.com/t/font_2453886_6k6rqapers4.ttf') format('truetype'),
                url('https://at.alicdn.com/t/font_2453886_6k6rqapers4.svg#iconfont') format('svg');
              }
            .iconfont{
                font-family:"iconfont" !important;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
                -webkit-text-stroke-width: 0.2px;
                -moz-osx-font-smoothing: grayscale;
            }
        </style>
        <div style="position: fixed;top: 0;left: 0;width: 100vw;height: 100vw;z-index: -1;background-color: #eee;">
            <div style="position: absolute;width: 100vw;height: 100vw;opacity: .3;background-image: url(./toc/images/background.png);"></div>
        </div>
        <div class="header-bg">
            <div class="header-container flex-middle">
                <p class="blue f20 flex-middle FB"><i class="iconfont f30">&#xe693;</i>XIAOHUI</p>
                <p class="blue f14" style="margin-left: 20px;">入目无别人，四下皆是你</p>
                <ul class="header-container-middle">
                    <!-- 添加新链接时，文件名和类名需要保持一致 -->
                    <li class="html"><a href="./html.html">html</a><li>
                    <li class="css"><a href="./css.html">css</a><li>
                    <li class="js"><a href="./js.html">js</a><li>
                    <li class="vue"><a href="./vue.html">vue</a><li>
                    <li class="algorithm"><a href="./algorithm.html">算法</a><li>
                    <li class="other"><a href="./other.html">other</a><li>
                    <li class="markdown"><a href="./markdown.html">markdown</a><li>
                </ul>
                <div class="header-container-right ml-auto">
                    <p class="flex-middle">
                    <i class="iconfont icon-m-pre f18 pointer">&#xe60f;</i>
                    <i class="iconfont icon-m-play f12 ml15 pointer">&#xe690;</i>
                    <i class="iconfont icon-m-next f18 ml15 pointer">&#xe611;</i>
                    <i class="iconfont icon-m-vo f12 ml15 pointer">&#xe600;</i>
                    </p>
                    <p class="music-name w ellip f12 mt5 pointer">牵丝戏牵丝戏牵丝戏牵丝戏牵丝戏</p>
                </div>
            </div>
        </div>
    `
    body.appendChild(oDiv);
    if(location.href.indexOf('html.') !== -1) {
        $('.header-container-middle .html').addClass('header-nav-active');
    };
    let aLi = document.querySelectorAll('.header-container-middle li');
    for(let item of aLi) {
        if(item.className && item.className !== 'html') {
            if(location.href.indexOf(item.className) !== -1) {
                $('.header-container-middle .' + item.className).addClass('header-nav-active');
                return;
            };
        }
    }
}
init();
