var jquery_ztree_toc_opts = {
    debug:false,
    is_auto_number:true,
    documment_selector:'.markdown-body',
    ztreeStyle: {
        width:'326px',
        overflow: 'auto',
        position: 'fixed',
        'z-index': 2147483647,
        border: '0px none',
        left: '0px',
        top: '100px',
				// 'overflow-x': 'hidden',
				'height': $(window).height() + 'px'
    }
}
var markdown_panel_style = {
    'width':'70%',
    'margin-top':'100px',
    'margin-left':'25%'
};

function header() {
    const body = document.querySelector('body');
    const oDiv = document.createElement('div');
    oDiv.innerHTML = `<div style="
                            background: lightblue;
                            position: fixed; 
                            top: 0; 
                            left: 0;
                            width: 100%;
                            height: 100px;
                        ">
        asdf
    </div>
    <div style="
        background: lightblue;
        position: fixed; 
        top: 0; 
        left: 0;
        width: 100%;
        height: 100px;
    >
        
    </div>`
    body.appendChild(oDiv);
}
header();