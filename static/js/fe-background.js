/**
 * JsTracker后台运行程序
 * @author xianliezhao@foxmail.com
 */
var BgPageInstance = (function () {

    /**
     * 通过这个方法来读取服务器端的CSS文件内容，要这样做，前提是在manifest.json中配置permissions为：http://
     * @param {String} link 需要读取的css文件
     * @param {Function} callback 回调方法，格式为：function(respData){}
     * @config {Object} respData 输出到客户端的内容，格式为{success:BooleanValue,content:StringValue}
     * @return {Undefined} 无返回值
     */
    var readFileContent = function(link,callback){
        //创建XMLHttpRequest对象，用原生的AJAX方式读取内容
        var xhr = new XMLHttpRequest();
        //处理细节
        xhr.onreadystatechange = function() {
            //后端已经处理完成，并已将请求response回来了
            if (xhr.readyState === 4) {
                //输出到客户端的内容，格式为{success:BooleanValue,content:StringValue}
                var respData;
                //判断status是否为OK
                if (xhr.status === 200 && xhr.responseText) {
                    //OK时回送给客户端的内容
                    respData = {
                        success : true,	//成功
                        type : 'link-tag',	//<link>标签
                        path : link,	//文件路径
                        content : xhr.responseText	//文件内容
                    };
                } else {	//失败
                    respData = {
                        success : false,	//失败
                        type : 'link-tag',	//<link>标签
                        path : link,	//文件路径
                        content : "JsTracker can't load such file."	//失败信息
                    };
                }
                //触发回调，并将结果回送
                callback(respData);
            }
        };
        //打开读通道
        xhr.open('GET', link, true);
        //设置HTTP-HEADER
        xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
        xhr.setRequestHeader("Access-Control-Allow-Origin","*");
        //开始进行数据读取
        xhr.send();
    };


    /**
     * 执行JS Tracker
     * @private
     */
    var _doJsTracker = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'deal-tracker'
            });

        });
    };


    /**
     * 接收来自content_scripts发来的消息
     */
    var _addExtensionListener = function () {
        chrome.runtime.onMessage.addListener(function (request, sender, callback) {
            //处理JS的请求
            if (request.type == 'get-js') {
                //直接AJAX获取JS文件内容
                readFileContent(request.link, callback);
            }
            return true;
        });

        chrome.browserAction.onClicked.addListener(function(tab){
            _doJsTracker();
        });
    };

    /**
     * 初始化
     */
    var _init = function () {
        _addExtensionListener();
    };

    return {
        init: _init
    };
})();

//初始化
BgPageInstance.init();
