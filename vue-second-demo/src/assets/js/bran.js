/**
 * Created by CuiMengxin on 2015/11/3.
 */
/**
 *  sessionStorage.setItem("CurrentEmployeeId",id);//当前员工id
 *  sessionStorage.setItem("deptList",deptList);//部门列表
 *  sessionStorage.setItem("workLineList",workLineList);//工段列表
 *  sessionStorage.setItem("workShiftList",workShiftList);//班组列表
 *  sessionStorage.setItem("postList",postList);//职位列表
 *
 *
 */


var DATATABLES_CHINESE_LANGUAGE = "json/Chinese.json";
var RESPONSE_OK_CODE = "1000";
var PERMISSION_DENIED_CODE = "2003";
var SESSION_TIMEOUT_CODE = "2004";
var ALL_COUNTRY = "100000";
//var phone_reg = /^(13[0-9]|14[5|7]|15[^4]|17[0-9]|18[0-9])[0-9]{8}$/;
var phone_reg = /^1[0-9]{10}$/;

var timeOut = "2000";//按钮click之后，移除click事件，timeout之后，重新赋值click事件
var ajaxSetup = function () {
    $.ajaxSetup({
        accept: 'application/json',
        cache: false,
        contentType: 'application/json;charset=UTF-8'
    });
};


/**
 * POST方法
 * Parmas:
 * url请求路径，
 * params参数，
 * successFunc请求成功回调方法，
 * errorFunc请求失败回调方法
 */
var branPostRequest = function (url, params, successFunc, errorFunc, token) {

    new Promise(function (resolve, reject) {

        if (token) {
            $.ajaxSetup({
                headers: {
                    token: token
                }
            });
        }
        ajaxSetup();

        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(params),
            beforeSend: function (xhr) {
                //xhr.setRequestHeader('X-Test-Header', 'test-value');
            },
            success: function (data, status, jqXHR) {

                setTimeout(function () {
                    loadingRemove();//加载中 - 移除logo
                }, 500);

                resolve(data);

            },
            error: function (XMLHttpRequest, textStatus, errorThrow) {

                setTimeout(function () {
                    loadingRemove();//加载中 - 移除logo
                }, 500);

                reject(XMLHttpRequest, textStatus, errorThrow);

            }
        });

    })
        .then(function (data) {

            if (typeof data === "string") {
                data = eval("(" + data + ")");
            }

            if (data["code"] === PERMISSION_DENIED_CODE) {
                branError("接口没有访问权限");
            }
            else if (data["code"] === SESSION_TIMEOUT_CODE) {
                location.href = "login";
            }
            else {
                if (successFunc)
                    successFunc(data);
            }

        })
        .catch(function (XMLHttpRequest, textStatus, errorThrow) {

            var flag = ajax_msg(XMLHttpRequest);//判断ajax 异常错误

            if (flag) {

                if (errorFunc)
                    errorFunc();
            }

        });

};

/**
 * GET方法
 * Parmas:
 * url请求路径，
 * successFunc请求成功回调方法，
 * errorFunc请求失败回调方法
 */
var branGetRequest = function (url, successFunc, errorFunc, ajaxParam) {

    new Promise(function (resolve, reject) {

        if (ajaxParam) {
            $.ajaxSetup(ajaxParam);
        }

        ajaxSetup();

        $.ajax({
            url: url,
            method: 'GET',
            // async: false,
            success: function (data, status, jqXHR) {

                setTimeout(function () {
                    loadingRemove();//加载中 - 移除logo
                }, 500);

                resolve(data);

            },
            error: function (XMLHttpRequest, textStatus, errorThrow) {

                setTimeout(function () {
                    loadingRemove();//加载中 - 移除logo
                }, 500);

                var flag = ajax_msg(XMLHttpRequest);//判断ajax 异常错误

                if (flag) {

                    if (errorFunc)
                        errorFunc();
                }

            }
        });

    })
        .then(function (data) {

            // if (jqXHR.readyState === 0 && jqXHR.status === 0) {
            //     toastr.warning("请求未发送！");
            // }

            if (typeof data === "string") {
                data = eval("(" + data + ")");
            }

            if (data["code"] === PERMISSION_DENIED_CODE) {
                branError("接口没有访问权限");
            }
            else if (data["code"] === SESSION_TIMEOUT_CODE) {
                location.href = "login";
            }
            else {
                if (successFunc) {
                    successFunc(data);
                }
            }

        })
        .catch(function (err) {

            console.log("ajax get method error:");
            console.log(err.message);

        });

};

/**
 * PUT方法 - 全部更新
 * Parmas:
 * url请求路径，
 * successFunc请求成功回调方法，
 * errorFunc请求失败回调方法
 */
var branPutRequest = function (url, params, successFunc, errorFunc, ajaxParam) {

    new Promise(function (resolve, reject) {

        if (ajaxParam) {
            $.ajaxSetup(ajaxParam);
        }

        ajaxSetup();
        $.ajax({
            url: url,
            method: 'PUT',
            data: JSON.stringify(params),
            success: function (data, status, jqXHR) {

                setTimeout(function () {
                    loadingRemove();//加载中 - 移除logo
                }, 500);

                resolve(data);

            },
            error: function (XMLHttpRequest, textStatus, errorThrow) {
                setTimeout(function () {
                    loadingRemove();//加载中 - 移除logo
                }, 500);

                reject(XMLHttpRequest);
            }
        });

    })
        .then(function (data) {

            // if (jqXHR && jqXHR.readyState === 0 && jqXHR.status === 0) {	//
            //     console.log("请求未发送！");
            // }

            if (typeof data === "string") {
                data = eval("(" + data + ")");
            }

            if (data["code"] === PERMISSION_DENIED_CODE) {
                branError("接口没有访问权限");
            }
            else if (data["code"] === SESSION_TIMEOUT_CODE) {
                location.href = "login";
            }
            else {
                if (successFunc) {
                    successFunc(data);
                }
            }

        })
        .catch(function (XMLHttpRequest) {

            var flag = ajax_msg(XMLHttpRequest);//判断ajax 异常错误

            if (flag) {

                if (errorFunc)
                    errorFunc();
            }

        });

};

/**
 * PATCH方法 - 局部更新
 * Parmas:
 * url请求路径，
 * successFunc请求成功回调方法，
 * errorFunc请求失败回调方法
 */
var branPatchRequest = function (url, params, successFunc, errorFunc) {

    new Promise(function (resolve, reject) {

        ajaxSetup();
        $.ajax({
            url: url,
            method: 'PATCH',
            data: JSON.stringify(params),
            success: function (data, status, jqXHR) {
                setTimeout(function () {
                    loadingRemove();//加载中 - 移除logo
                }, 500);

                resolve(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrow) {
                setTimeout(function () {
                    loadingRemove();//加载中 - 移除logo
                }, 500);

                reject(XMLHttpRequest);

            }
        });

    })
        .then(function (data) {

            if (typeof data === "string") {
                data = eval("(" + data + ")");
            }

            if (data["code"] === PERMISSION_DENIED_CODE) {
                branError("接口没有访问权限");
            }
            else if (data["code"] === SESSION_TIMEOUT_CODE) {
                location.href = "login";
            }
            else {
                if (successFunc) {
                    successFunc(data);
                }
            }

        })
        .catch(function (XMLHttpRequest) {

            var flag = ajax_msg(XMLHttpRequest);//判断ajax 异常错误

            if (flag) {

                if (errorFunc)
                    errorFunc();
            }

        });

};

/**
 * DELETE方法
 * Parmas:
 * url请求路径，
 * successFunc请求成功回调方法，
 * errorFunc请求失败回调方法
 */
var branDeleteRequest = function (url, params, successFunc, errorFunc) {

    new Promise(function (resolve, reject) {

        ajaxSetup();
        $.ajax({
            url: url,
            method: 'DELETE',
            data: JSON.stringify(params),
            success: function (data, status, jqXHR) {
                setTimeout(function () {
                    loadingRemove();//加载中 - 移除logo
                }, 500);

                resolve(data);

            },
            error: function (XMLHttpRequest, textStatus, errorThrow) {
                setTimeout(function () {
                    loadingRemove();//加载中 - 移除logo
                }, 500);

                reject(XMLHttpRequest);

            }
        });

    })
        .then(function (data) {

            if (typeof data === "string") {
                data = eval("(" + data + ")");
            }

            if (data["code"] === PERMISSION_DENIED_CODE) {
                branError("接口没有访问权限");
            }
            else if (data["code"] === SESSION_TIMEOUT_CODE) {
                location.href = "login";
            }
            else {
                if (successFunc) {
                    successFunc(data);
                }
            }

        })
        .catch(function (XMLHttpRequest) {

            var flag = ajax_msg(XMLHttpRequest);//判断ajax 异常错误

            if (flag) {

                if (errorFunc)
                    errorFunc();
            }

        });

};

//判断ajax 异常错误
var ajax_msg = function (req) {

    console.info("请求失败：状态码 ---- " + req.status);
    // console.log(req);

    var status = req.status;
    var msg = "";

    switch (status) {
        case 200:
            msg = "";
            break;
        case 0:
            msg = "网络请求异常！";
            break;
        case 404:
            msg = "接口无法请求(url不对)！";
            break;
        case 500:
            msg = "系统错误！";
            break;
        default:
            msg = "接口请求失败！";//
            break;
    }

    if (msg) {
        toastr.warning(msg);
        return false;
    }
    else {
        return true;
    }

};

//加载中 - logo出现
var loadingInit = function () {

    if ($("body").find(".load-container").length > 0) {
        $("body").find(".load-container").remove();
    }
    var $load = $("<div>").addClass("load-container").addClass("load");
    var $loader = $("<div>").addClass("loader");
    $loader.appendTo($load);
    $load.appendTo($("body"));

};

//加载中 - 移除logo
var loadingRemove = function () {
    $("body").find(".load-container").remove();
};

//json格式转换为字符串
var jsonParseParam = function (param, key) {
    var paramStr = "";

    if (param instanceof String || param instanceof Number || param instanceof Boolean) {
        paramStr += "&" + key + "=" + encodeURIComponent(param);
    }
    else {
        $.each(param, function (i) {
            var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
            paramStr += '&' + jsonParseParam(this, k);
        });
    }

    return paramStr.substr(1);


};

//将 时间戳转换格式 为 YYYY-MM-DD
var timeInit = function (time) {
    if (!time) {
        return "";
    }
    //debugger
    var time = new Date(time).toLocaleDateString();//转换为 YYYY/MM/DD

    time = time.split("/");
    var timeList = "";
    for (var i = 0; i < time.length; i++) {
        if (parseInt(time[i]) < 10) {
            time[i] = "0" + time[i];
        }
        timeList += timeList === "" ? time[i] : ("-" + time[i]);
    }

    //alert(timeList)
    return timeList;

};

//将 时间戳转换格式 为 YYYY-MM
var timeInit1 = function (time) {
    if (!time) {
        return " - ";
    }
    //debugger
    var time = new Date(time).toLocaleDateString();//转换为 YYYY/MM/DD

    time = time.split("/");
    var timeList = "";
    for (var i = 0; i < time.length - 1; i++) {
        if (parseInt(time[i]) < 10) {
            time[i] = "0" + time[i];
        }
        timeList += timeList == "" ? time[i] : ("-" + time[i]);
    }

    if (timeList.indexOf("9999") > -1) {
        timeList = "至今";
    }
    //alert(timeList)
    return timeList;

};

//将 时间戳转换格式 为 YYYY-MM-DD MM:dd:ss
var timeInit2 = function (time) {
    var timeList = "";

    if (!time) {
    }
    else {
        //var time = new Date(time).toLocaleString();//转换为 YYYY/MM/DD
        var time = new Date(time);//.toLocaleString();//转换为 YYYY/MM/DD

        var year = time.getFullYear();
        var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) :
            (time.getMonth() + 1);
        var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();

        var hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
        var min = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
        var sec = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();

        timeList = year +
            "-" + month +
            "-" + day +
            " " + hour +
            ":" + min +
            ":" + sec;

    }

    //alert(timeList)
    return timeList;

};

//将时间戳 转为 当天0时0分0秒 的时间戳
var timeInit3 = function (time) {

    if (time) {
        time = new Date(time);//.toLocaleString();//转换为 YYYY/MM/DD

        var year = time.getFullYear();
        var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) :
            (time.getMonth() + 1);
        var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();

        time = year + "/" + month + "/" + day + " 00:00:00";
        time = new Date(time).getTime();
    }
    else {
        time = "";
    }

    // console.log("时间：" + time);
    return time;

};

//将时间戳 转为 当天23时59分59秒 的时间戳
var timeInit4 = function (time) {

    if (time) {
        time = new Date(time);//.toLocaleString();//转换为 YYYY/MM/DD

        var year = time.getFullYear();
        var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) :
            (time.getMonth() + 1);
        var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();

        time = year + "/" + month + "/" + day + " 23:59:59";
        time = new Date(time).getTime();
    }
    else {
        time = "";
    }

    // console.log("时间：" + time);
    return time;

};

//将 时间戳转换格式 为 2015年02月15日
var timeInit5 = function (time) {

    var timeList = "";

    if (time) {

        var time = new Date(time);//.toLocaleString();//转换为 YYYY/MM/DD

        var year = time.getFullYear();
        var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) :
            (time.getMonth() + 1);
        var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();

        // var hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
        // var min = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
        // var sec = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();

        timeList = year + "年" +
            month + "月" +
            day + "日";

    }

    //alert(timeList)
    return timeList;
};

//检查是否是 正式环境
var checkEnvironment = function () {

    var host = location.host;

    //如果是正式环境
    if (host.indexOf("bumuyun") > -1) {
        return true
    }
    else {
        return false;
    }

};

//错误提示
var branError = function (obj) {
    //alert(obj)
    if (typeof obj == "undefined") {
        toastr.error("请求异常,请联系管理员");
    }
    else if (typeof obj == "string") {
        toastr.warning(obj);
        //toastr.error("系统错误：" + obj);
    }
    else {
        if (obj.status) {
            if (obj.status == 500) {
                toastr.error("系统错误，请联系管理员！");
            }
            else if (obj.status == 302) {
                toastr.error("网络连接已断开！");
            }
            else if (obj.status === 404) {
                toastr.error("请求URL不存在！");
            }
            else {
                toastr.error("请求异常");
            }
        }
        else {
            toastr.error(JSON.stringify(obj))
        }
    }
};

//显示页面加载动画
var showPageLoadHUD = function (divId) {
    if (divId) {

        //页面加载动画
        var pageLoadHUD = $("<div></div>");
        pageLoadHUD.addClass("sk-spinner sk-spinner-wave");
        pageLoadHUD.attr("style", "margin-top:200px;width:100px;");
        for (var i = 1; i < 6; i++) {
            var div = $("<div></div>").appendTo(pageLoadHUD);
            div.addClass("sk-rect" + i);
            pageLoadHUD.append("&nbsp;");
        }

        $(divId).html(pageLoadHUD);
    }
};

//显示提示信息
var toastrMsg = function (type, msg) {
    toastr.options = {
        positionClass: "toast-bottom-right",
    };

    if (type == "warning") {        //橙色
        toastr.warning(msg);
    }
    if (type == "info") {       //淡蓝
        toastr.info(msg);
    }
    if (type == "success") {        //淡绿
        toastr.success(msg);
    }
    if (type == "error") {      //红
        toastr.error(msg);
    }
};


//删除提示
var delWarning = function (name, func) {
    swal({
        title: name,
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e85d00",
        //cancelButtonColor: "#ff6600",
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        //confirmButtonClass: 'btn btn-success',
        //cancelButtonClass: 'btn btn-danger',
        closeOnConfirm: true
    }, function () {
        if (func) {
            func();
        }
    });
};

//导出 弹框
var exportModalShow = function (name, func) {
    //if (name.indexOf("确定要导出") < 0) {	//如果没有前缀
    //	name = "确定要导出  \"" + name + "\"  吗";
    //}

    swal({
        title: name,
        //text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonColor: "#e85d00",
        confirmButtonText: "确定",
        closeOnConfirm: true
    }, function () {
        if (func) {
            func();
        }
    });
};

//消息 提示
var msgShow = function (name) {
    swal({
            title: name,
            //text: txt,
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#337ab7",
            confirmButtonText: "关闭",
            closeOnConfirm: true
        }
    );
};

//操作 提示
var operateMsgShow = function (name, func, txt) {

    if (!txt) {
        txt = "";
    }

    swal({
            title: name,
            text: txt,
            type: "warning",
            showCancelButton: true,
            cancelButtonText: "取消",
            confirmButtonColor: "#e85d00",
            confirmButtonText: "确定",
            closeOnConfirm: true
        },
        function () {
            if (func) {
                func();
            }
        }
    );
};


/////////////////////////暂时不用///////////////////////////////////////////


//组件加载动画
var componentLoadHUD = $("<div></div>");
componentLoadHUD.addClass("sk-spinner sk-spinner-circle");
for (var i = 1; i <= 12; i++) {
    var div = $("<div></div>").appendTo(componentLoadHUD);
    div.addClass("sk-circle" + i + " sk-circle");
}

//隐藏组件加载动画
var dismissHUD = function (divId) {
    if (divId)
        $(divId).empty();
};

//显示组件加载动画
var showHUD = function (divId) {
    if (divId) {
        dismissHUD(divId);
        $(divId).append(componentLoadHUD);
    }
};


/**
 * 清除表单中内容
 * @param ele
 */
function clearForm(ele) {
    $(ele).find(':input').each(function () {
        switch (this.type) {
            case 'text':
                $(this).val('');
                break;
            case 'hidden':
                $(this).val('');
                break;
            case 'password':
                $(this).val('');
                break;
            case 'textarea':
                $(this).val('');
                break;
            case 'radio':
                this.checked = false;
            case 'checkbox':
                this.checked = false;
            case 'select-multiple':
            case 'select-one':
        }
    });
}


//删除警告
var deleteWarning = function (func) {
    swal({
        title: "确定要删除吗？",
        text: "删除后将无法恢复，请谨慎操作！",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "删除",
        closeOnConfirm: true
    }, function () {
        if (func) {
            func();
        }
    });
};
