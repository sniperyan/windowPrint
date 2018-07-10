

import ReactDOM from 'react-dom';
/**
 * feature:去掉页面title和页脚的url
 * 
 * 如果 打印预览样式失效，很可能是css预编译如less层级造成的，复制到新窗口后少了父层级，解决
 * 办法是在原来页面中将父层级样式去掉
 * 
 * @param {*} refs 需要打印部分的引用，如果不传则打印整个页面
 */
export function wymPrint(refs) {
  if (refs) {
    let dom = ReactDOM.findDOMNode(refs); //dom节点
    let prnhtml = dom.innerHTML; //需要打印部分html
    // let oldHeadStr = document.head.innerHTML;
    // let styleSheets = ; // 原样式
    // let headstr = `<html><head><title>${title}</title></head><body>`;
    // let footstr = '</body></html>';
    let myWindow = window.open('', 'newwindow', 'fullscreen=yes,location=no,menubar=no,status=no,titlebar=no,toolbar=no');
    // let myWindow = window.open('', 'newwindow', );
    // document.head.title=title;
    myWindow.document.body.innerHTML =  prnhtml;  //设置body内容
    // let oldHeadHtml = window.document.head.innerHTML; //旧的头部
    // myWindow.document.head.innerHTML =  removeTitle(oldHeadHtml);  //设置头部,为了加载样式
    // myWindow.document.head.title.innerHTML = '';  //去掉头部标题
    // myWindow.CSSStyleSheet = styles;

    // addCSS( myWindow.document,'span{ color:red}');
    copyStyleSheet(myWindow.document, document.styleSheets); //把页面样式拷贝到新打开的页面中去
    myWindow.print();  //打印
    setTimeout(function() {
      myWindow.close();   //关闭窗口
    }, 300);
    
    
  } else {
    window.print();
  }
}

// function removeTitle(str) {
//   let startIdx = str.indexOf('<title>');
//   let endIdx = str.indexOf('</title>');
//   return str.substring(0, startIdx) + str.substring(endIdx + 8);

// }

// 拷贝 styleSheet到新的页面
function copyStyleSheet(doc, styleSheets) {
  for (let i = 0; i < styleSheets.length; i++) {
    if (styleSheets[i].cssRules.length > 0) {
      for (let ii = 0; ii < styleSheets[i].cssRules.length; ii++) {
        addCSS(doc, styleSheets[i].cssRules[ii].cssText);
      }
    }
  }
}

//创建style标签
function addCSS(doc, cssText) {
  let style = doc.createElement('style');  //创建一个style元素
  let head = doc.head || doc.getElementsByTagName('head')[0]; //获取head元素
  style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
  if (style.styleSheet) { //IE
    var func = function() {
      try { //防止IE中stylesheet数量超过限制而发生错误
        style.styleSheet.cssText = cssText;
      } catch (e) {
      }
    };
    //如果当前styleSheet还不能用，则放到异步中则行
    if (style.styleSheet.disabled) {
      setTimeout(func, 10);
    } else {
      func();
    }
  } else { //w3c
    //w3c浏览器中只要创建文本节点插入到style元素中就行了
    var textNode = doc.createTextNode(cssText);
    style.appendChild(textNode);
  }
  head.appendChild(style); //把创建的style元素插入到head中    
}


