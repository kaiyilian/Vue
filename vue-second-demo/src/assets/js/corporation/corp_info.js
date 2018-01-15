/**
 * Created by CuiMengxin on 2016/12/19.
 * 企业管理
 */

var $body = $("body");

//厂车路线
var corp_route = {

    FileName: "",//文件名称
    currentUrl: "",//当前 文件上传后生成的 URL
    Url: "",//网页url
    containerName: "",

    //初始化
    init: function () {
        corp_route.containerName = ".corp_route_container";

        corp_route.initParam();//初始化 参数
        corp_route.getRoute();//获取厂车路线
    },
    //初始化 参数
    initParam: function () {
        corp_route.FileName = "";
        corp_route.currentUrl = "";//
        corp_route.Url = "";//
        $(corp_route.containerName).find(".file_name").html("选择本地文件");//

        var $upload_container = $(corp_route.containerName).find(".content")
            .find(".upload_container");
        var $btn_list = $upload_container.find(".btn_list");
        var $btn_preview = $btn_list.find(".btn_preview");
        var $btn_sure = $btn_list.find(".btn_sure");

        $btn_preview.addClass("btn-default").removeClass("btn-success");
        $btn_sure.addClass("btn-default").removeClass("btn-success");

    },

    //获取厂车路线
    getRoute: function () {

        branGetRequest(
            urlGroup.corp.info.route.query,
            function (data) {
                //alert(JSON.stringify(data))
                //console.log(data);

                if (data.code == 1000) {
                    corp_route.setLocalStorage("/admin/corporation/bus/html?suffix=.pdf");//赋值localStorage

                    if (data.result && data.result.url) {

                        corp_route.Url = data.result.url;

                    }

                }
                else {
                    branError(data.msg)
                }

            },
            function (error) {
                branError(error)
            }
        );

    },

    //选择文件 - 按钮点击
    chooseFileClick: function () {
        if ($body.find(".upload_file")) {
            $body.find(".upload_file").remove();
        }

        var form = $("<form>");
        form.addClass("upload_file");
        form.attr("enctype", "multipart/form-data");
        form.appendTo($body);
        form.hide();

        var input = $("<input>");
        input.attr("type", "file");
        input.attr("name", "file");
        input.change(function () {
            corp_route.chooseFile(this);
        });
        input.appendTo(form);

        input.click();

    },
    //选择文件 - 弹框显示
    chooseFile: function (self) {
        var $upload_container = $(corp_route.containerName).find(".content")
            .find(".upload_container");
        var $btn_list = $upload_container.find(".btn_list");
        var $btn_preview = $btn_list.find(".btn_preview");
        var $btn_sure = $btn_list.find(".btn_sure");

        if (self.files) {

            for (var i = 0; i < self.files.length; i++) {
                var file = self.files[i];

                //判断是否是图片格式
                if (/\.(doc|pdf)$/.test(file.name)) {
                    loadingInit();

                    //上传doc到预览 返回url
                    $body.find(".upload_file").ajaxSubmit({
                        url: urlGroup.corp.info.route.upload,
                        type: 'post',
                        dataType: 'json',
                        data: $body.find(".upload_file").fieldSerialize(),
                        success: function (data) {
                            loadingRemove();

                            if (data.code == 1000) {

                                if (data.result) {
                                    corp_route.setLocalStorage("/admin/corporation/bus/preview/html?suffix=.pdf");//赋值localStorage

                                    corp_route.FileName = data.result.name;//
                                    corp_route.currentUrl = data.result.url;//

                                    $upload_container.find(".file_name").html(file.name);
                                    $btn_preview.addClass("btn-success").removeClass("btn-default");
                                    $btn_sure.addClass("btn-success").removeClass("btn-default");

                                }

                            }
                            else {
                                branError(data.msg)
                            }

                        },
                        error: function (error) {
                            loadingRemove();
                            branError(error);
                        }
                    });
                }
                else {
                    toastr.warning("请上传指定格式文件");
                }
            }

        }
    },

    //预览 厂车路线
    corpRoutePreview: function () {

        if (!corp_route.checkIsLoad()) {
            return
        }

        corp_route.setLocalStorage({
            corp: "/admin/corporation/bus/preview/html?suffix=.pdf"
        });

        window.open(corp_route.currentUrl, 'newwindow',
            'height=400,width=600,top=100,left=100,toolbar=no,menubar=no,' +
            'scrollbars=no, resizable=no,location=no, status=no')
    },
    //保存 厂车路线
    corpRouteSave: function () {

        if (!corp_route.checkIsLoad()) {
            return;
        }

        operateMsgShow("是否确认上传厂车路线？", function () {

            loadingInit();

            var obj = {};
            obj.file_name = corp_route.FileName;//

            branPostRequest(
                urlGroup.corp.info.route.upload_confirm,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code == 1000) {
                        toastr.success("保存成功");
                        corp_route.init();//页面初始化
                    }
                    else {
                        branError(data.msg)
                    }

                },
                function (error) {
                    branError(error);
                }
            );

        });

    },
    //检查 是否已经选择文件
    checkIsLoad: function () {
        var flag = false;

        if (!corp_route.currentUrl) {
            toastr.warning("暂无厂车信息，请先选择文件！");
        }
        else {
            flag = true
        }

        return flag;

    },

    //浏览 厂车路线
    corpRouteBrowse: function () {
        if (!corp_route.Url) {
            toastr.warning("暂无厂车信息，请先选择文件！");
            return;
        }

        corp_route.setLocalStorage({
            corp: "/admin/corporation/bus/html?suffix=.pdf"
        });//赋值localStorage

        window.open(corp_route.Url, 'newwindow',
            'height=400,width=600,top=100,left=100,toolbar=no,menubar=no,' +
            'scrollbars=no, resizable=no,location=no, status=no')
    },

    //赋值 localStorage
    setLocalStorage: function (obj) {
        console.log("obj: " + obj);
        localStorage.setItem('pdfUrl', JSON.stringify(obj));
        localStorage.setItem('pdfUrlKey', "corp");
        console.log("pdf url: " + JSON.stringify(obj));
        localStorage.getItem("pdfUrl");
    }

};

//员工手册
var corp_handbook = {

    FileName: "",//文件名称
    currentUrl: "",//当前 文件上传后生成的 URL
    Url: "",//网页url
    containerName: "",//

    //初始化
    init: function () {
        corp_handbook.containerName = ".corp_handbook_container";

        corp_handbook.initParam();//初始化 参数
        corp_handbook.getHandbook();//获取 员工手册
    },
    //初始化 参数
    initParam: function () {
        corp_handbook.FileName = "";
        corp_handbook.currentUrl = "";//
        corp_handbook.Url = "";//
        $(corp_handbook.containerName).find(".file_name").html("选择本地文件");//

        var $upload_container = $(corp_handbook.containerName).find(".content")
            .find(".upload_container");
        var $btn_list = $upload_container.find(".btn_list");
        var $btn_preview = $btn_list.find(".btn_preview");
        var $btn_sure = $btn_list.find(".btn_sure");

        $btn_preview.addClass("btn-default").removeClass("btn-success");
        $btn_sure.addClass("btn-default").removeClass("btn-success");

    },

    //获取 员工手册
    getHandbook: function () {

        branGetRequest(
            urlGroup.corp.info.handbook.query,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {
                    if (data.result && data.result.url) {
                        corp_handbook.Url = data.result.url;
                    }

                }
                else {
                    branError(data.msg);
                }

            },
            function (error) {
                branError(error)
            }
        );

    },

    //选择文件 - 按钮点击
    chooseFileClick: function () {

        if ($body.find(".upload_file")) {
            $body.find(".upload_file").remove();
        }

        var form = $("<form>");
        form.addClass("upload_file");
        form.attr("enctype", "multipart/form-data");
        form.appendTo($body);
        form.hide();

        var input = $("<input>");
        input.attr("type", "file");
        input.attr("name", "file");
        input.change(function () {
            corp_handbook.chooseFile(this);
        });
        input.appendTo(form);

        input.click();

    },
    //选择文件 - 弹框显示
    chooseFile: function (self) {
        var $upload_container = $(corp_handbook.containerName).find(".content")
            .find(".upload_container");
        var $btn_list = $upload_container.find(".btn_list");
        var $btn_preview = $btn_list.find(".btn_preview");
        var $btn_sure = $btn_list.find(".btn_sure");

        if (self.files) {

            for (var i = 0; i < self.files.length; i++) {
                var file = self.files[i];

                //判断是否是图片格式
                if (/\.(doc|pdf)$/.test(file.name)) {
                    loadingInit();

                    //上传doc到预览 返回url
                    $body.find(".upload_file").ajaxSubmit({
                        url: urlGroup.corp.info.handbook.upload,
                        type: 'post',
                        dataType: 'json',
                        data: $body.find(".upload_file").fieldSerialize(),
                        success: function (data) {
                            loadingRemove();

                            if (data.code == 1000) {
                                if (data.result) {
                                    corp_handbook.FileName = data.result.name;//
                                    corp_handbook.currentUrl = data.result.url;//

                                    $upload_container.find(".file_name").html(file.name);

                                    $btn_preview.addClass("btn-success").removeClass("btn-default");
                                    $btn_sure.addClass("btn-success").removeClass("btn-default");
                                }
                            }
                            else {
                                branError(data.msg)
                            }

                        },
                        error: function (error) {
                            loadingRemove();
                            branError(error);
                        }
                    });


                }
                else {
                    //loadingRemove();
                    //toastr.warning("请上传word或pdf文档");
                    toastr.warning("请上传指定格式文件");
                }
            }
        }
    },

    //预览 员工手册
    corpHandbookPreview: function () {

        if (!corp_handbook.checkIsLoad()) {
            return
        }
        corp_handbook.setLocalStorage({handbook: "/admin/corporation/handbook/preview/html?suffix=.pdf"});//赋值localStorage
        window.open(corp_handbook.currentUrl, 'newwindow',
            'height=400,width=600,top=100,left=100,toolbar=no,menubar=no,' +
            'scrollbars=no, resizable=no,location=no, status=no');
    },
    //保存 员工手册
    corpHandbookSave: function () {

        if (!corp_handbook.checkIsLoad()) {
            return
        }

        operateMsgShow("是否确认上传员工手册？", function () {

            loadingInit();

            var obj = {};
            obj.file_name = corp_handbook.FileName;//

            branPostRequest(
                urlGroup.corp.info.handbook.upload_confirm,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))
                    if (data.code == 1000) {
                        toastr.success("保存成功");
                        corp_handbook.init();//重新获取 员工手册
                    }
                    else {
                        branError(data.msg)
                    }

                },
                function (error) {
                    branError(error)
                }
            );

        });

    },
    //检查 是否已经选择文件
    checkIsLoad: function () {
        var flag = false;

        if (!corp_handbook.currentUrl) {
            toastr.warning("暂无员工手册信息，请先选择文件");
        }
        else {
            flag = true;
        }

        return flag;

    },

    //浏览 员工手册
    corpHandbookBrowse: function () {
        if (!corp_handbook.Url) {
            toastr.warning("暂无员工手册信息，请先选择文件！");
            return;
        }
        corp_handbook.setLocalStorage({handbook: "/admin/corporation/handbook/html?suffix=.pdf"});
        window.open(corp_handbook.Url, 'newwindow',
            'height=400,width=600,top=100,left=100,toolbar=no,menubar=no,' +
            'scrollbars=no, resizable=no,location=no, status=no');
    },

    //赋值 localStorage
    setLocalStorage: function (obj) {
        localStorage.setItem('pdfUrl', JSON.stringify(obj));
        localStorage.setItem('pdfUrlKey', "handbook");
        console.log("pdfUrl: " + JSON.stringify(obj));
    }

};

//企业信息
var corp_info = {
    containerName: "",

    //初始化
    init: function () {
        corp_info.containerName = ".corp_info_container";

        corp_info.getCompanyInfo();//
    },

    //获取 公司 信息
    getCompanyInfo: function () {
        var $content = $(corp_info.containerName).find(".content");
        var $corp_info = $content.find(".company_info");
        var $row = $corp_info.find(".row");

        branGetRequest(
            urlGroup.corp.info.query,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    var item = data.result;

                    var img = item.images ? item.images[0] : "image/attachment_empty.jpg";//图片
                    var name = item.name ? item.name : "";//企业名称
                    var type = item.type ? item.type : "";//企业性质
                    var code = item.checkin_code ? item.checkin_code : "";//企业入职码
                    var address = item.address ? item.address : "";//企业地址
                    var phone = item.telephone ? item.telephone : "";//企业联系电话
                    var fax = item.fax ? item.fax : "";//企业传真
                    var email = item.email ? item.email : "";//企业邮箱
                    var qrCode_url = item.qrcode_url ? item.qrcode_url : "";//公司二维码


                    //公司图片
                    $content.find(".company_img img").attr("src", img);
                    if (!img) {
                        $content.find(".company_img").hide();
                    }

                    //公司二维码
                    $corp_info.find(".company_qrCode img").attr("src", qrCode_url);
                    if (!qrCode_url) {
                        $corp_info.find(".company_qrCode").hide();
                    }

                    $row.find(".company_name").html(name);
                    $row.find(".company_type").html(type);
                    $row.find(".company_checkin_code").html(code);
                    $corp_info.find(".company_address").html(address);
                    $corp_info.find(".company_phon").html(phone);
                    $corp_info.find(".company_fax").html(fax);
                    $corp_info.find(".company_email").html(email);

                    //var imgWidth = $content.find(".company_img").width();
                    //var imgHeight = imgWidth * 0.3;
                    //$content.find(".company_img").css("height", imgHeight);

                }
                else {
                    branError(data.msg)
                }

            },
            function (error) {
                branError(error);
            }
        );

    }

};

//企业公告
var corp_news = {
    containerName: "",

    //初始化
    init: function () {
        corp_news.containerName = ".corp_news_container";

        corp_news.getCorpNews();//获取 企业公告
    },

    //获取 企业公告
    getCorpNews: function () {
        var $content = $(corp_news.containerName).find(".content");
        var $table = $content.find(".table_container table");

        var obj = {
            page: 1,
            page_size: 10
        };
        var url = urlGroup.notification.list + "?" + jsonParseParam(obj);

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {

                    var list = "";//
                    var notification = data.result.notifications;
                    if (!notification || notification.length == 0) {
                        list = "<tr><td colspan='4'>暂无公告</td></tr>";
                    }
                    else {
                        for (var i = 0; i < notification.length; i++) {
                            var item = notification[i];

                            var name = item.poster_name ? item.poster_name : "";//
                            var dept_name = item.department_name ? item.department_name : "";//发布者 所属部门
                            var title = item.notification_title ? item.notification_title : "";//
                            var content = item.notification_content ? item.notification_content : "";//
                            content = content.length > 12 ? content.substr(0, 12) + "..." : content;
                            list +=
                                "<tr class='item'>" +
                                "<td class='news_title'>" + title + "</td>" +
                                "<td class='news_content'>" + content + "</td>" +
                                "<td class='news_dept'>" + dept_name + "</td>" +
                                "<td class='news_author'>" + name + "</td>" +
                                "</tr>";

                        }
                    }

                    $table.find("tbody").html(list);

                }
                else {
                    branError(data.msg)
                }

            },
            function (error) {
                branError(error);
            }
        );

    },

    //查看更多
    getNewsMore: function () {
        getInsidePageDiv(urlGroup.corp.notice.index, 'corp_notification', '消息中心');
    }
};

$(function () {
    corp_info.init();//企业信息
    corp_route.init();//厂车路线
    corp_handbook.init();//员工手册
    corp_news.init();//企业公告
});