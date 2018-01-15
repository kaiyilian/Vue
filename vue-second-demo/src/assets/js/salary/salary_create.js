/**
 * Created by Administrator on 2017/12/4.
 * 薪资-新建
 */

var $salary_create_container = $("section.salary_create_container");
var $step = $salary_create_container.find(".step");
var $step_list = $salary_create_container.find(".step_list");
var $tb_salary = $salary_create_container.find("#tb_salary");//table
var $payroll_preview_modal = $(".payroll_preview_modal");//工资单预览 modal

var salary_create = {


    salary_excel_id: null,//导入Excel 生成的id
    salary_excel_name: null,//导入的Excel name
    salary_excel_result: null,//导入的Excel result


    init: function () {

        salary_create.initStep1();//初始化 第一步

    },

    //初始化 第一步
    initStep1: function () {

        salary_create.initYear();//初始化 年份
        salary_create.initMonth();//初始化 月份

        $step_list.find(".step_1").removeClass("hide").siblings(".step_item").addClass("hide");
        $step.find("li").eq(0).addClass("active").siblings().removeClass("active");

    },
    //初始化 年份
    initYear: function () {

        var $year = $step_list.find(".step_1").find(".salary_info_container .year");
        $year.empty();

        var date = new Date();
        var y = date.getFullYear();

        for (var i = (y - 2); i <= y + 2; i++) {

            var $option = $("<option>");
            $option.val(i);
            $option.text(i + "年");
            $option.appendTo($year);

        }

        $year.val(y);

    },
    //初始化 月份
    initMonth: function () {

        var $month = $step_list.find(".step_1").find(".salary_info_container .month");
        $month.empty();

        var date = new Date();
        // var m = date.getMonth() + 1;
        // m = m < 10 ? "0" + m : m;
        var prev_month = date.getMonth();
        prev_month = prev_month < 10 ? "0" + prev_month : prev_month;

        for (var i = 1; i <= 12; i++) {
            var val = i < 10 ? "0" + i : i;

            var $option = $("<option>");
            $option.val(val);
            $option.text(i + "月");
            $option.appendTo($month);

        }

        //如果是第一个月，默认显示上一年的12月
        if (prev_month === "00") {

            var date = new Date();
            var y = date.getFullYear() - 1;

            var $year = $step_list.find(".step_1").find(".salary_info_container .year");
            $year.val(y);

            $month.val(12);

        }
        else{
            $month.val(prev_month);
        }

    },

    //预览格式
    previewShow: function () {
        //如果是正式环境，增加埋点需求
        if (checkEnvironment()) {
            _czc.push(["_trackEvent", "dianzigongzidan", "预览格式按钮"]);
        }

        $payroll_preview_modal.modal("show");
    },

    //是否代发
    salaryReplace: function () {

        var $step_1 = $step_list.find(".step_1");
        var $salary_info_container = $step_1.find(".salary_info_container");
        var $salary_corp_name_container = $salary_info_container.find(".salary_corp_name_container");

        var $btn_replace = $step_1.find(".btn_list .btn_replace");//代发
        if ($btn_replace.hasClass("active")) {
            $btn_replace.removeClass("active");
            $btn_replace.text("隐藏");
            $salary_corp_name_container.show().find("input").val("");
        }
        else {
            $btn_replace.addClass("active");
            $btn_replace.text("代发");
            $salary_corp_name_container.hide().find("input").val("");
        }

    },

    //选择文件 - 按钮点击
    ChooseFileClick: function () {

        //如果是正式环境，增加埋点需求
        if (checkEnvironment()) {
            _czc.push(["_trackEvent", "dianzigongzidan", "上传工资表按钮"]);
        }

        var $step_1 = $step_list.find(".step_1");
        var $salary_info_container = $step_1.find(".salary_info_container");
        var year_month = $salary_info_container.find(".year").val() + "-" +
            $salary_info_container.find(".month").val();//发薪年月
        var salary_name = $salary_info_container.find(".salary_name input").val();//薪资名称
        var salary_corp_name = $salary_info_container.find(".salary_corp_name input").val();//子公司名称

        if ($step_1.find(".upload_file")) {
            $step_1.find(".upload_file").remove();
        }
        //debugger
        var form = $("<form>");
        form.addClass("upload_file");
        form.attr("enctype", "multipart/form-data");
        form.appendTo($step_1);
        form.hide();

        // //用户id
        // var user_id_input = $("<input>");
        // user_id_input.attr("type", "text");
        // user_id_input.attr("name", "id");
        // user_id_input.val(salary_create.user_id);
        // user_id_input.appendTo(form);

        //该薪资的年月（2015-09）
        var year_month_input = $("<input>");
        year_month_input.attr("type", "text");
        year_month_input.attr("name", "time");
        year_month_input.val(year_month);
        year_month_input.appendTo(form);

        //薪资名称
        var salary_name_input = $("<input>");
        salary_name_input.attr("type", "text");
        salary_name_input.attr("name", "salaryName");
        salary_name_input.val(salary_name);
        salary_name_input.appendTo(form);

        //子公司名称
        var salary_corp_name_input = $("<input>");
        salary_corp_name_input.attr("type", "text");
        salary_corp_name_input.attr("name", "childCorpName");
        salary_corp_name_input.val(salary_corp_name);
        salary_corp_name_input.appendTo(form);

        //文件
        var file_input = $("<input>");
        file_input.attr("type", "file");
        file_input.attr("name", "file");
        file_input.change(function () {
            salary_create.ChooseFile(this);
        });
        file_input.appendTo(form);

        //上传文件的格式
        var file_suffix = $("<input>");
        file_suffix.addClass("file_suffix");
        file_suffix.attr("type", "text");
        file_suffix.attr("name", "suffix");
        file_suffix.val("");
        file_suffix.appendTo(form);

        file_input.click();

    },
    //选择文件 - 弹框显示
    ChooseFile: function (self) {
        console.log("上传表格：" + new Date().getTime());

        var $step_1 = $step_list.find(".step_1");

        //alert(self.files)
        if (self.files) {
            for (var i = 0; i < self.files.length; i++) {
                var file = self.files[i];

                //判断是否是excel格式
                if (/\.(xls|xlsx)$/.test(file.name)) {

                    loadingInit();

                    var type = file.name.split('.').splice(-1);
                    $step_1.find(".upload_file").find(".file_suffix").val(type);//赋值 文件 后缀名

                    $step_1.find(".upload_file").ajaxSubmit({
                        url: urlGroup.salary.create.file_upload,
                        type: 'post',
                        success: function (data) {
                            loadingRemove();
                            //alert(JSON.stringify(data))
                            //console.log(data);
                            // debugger;

                            if (data.code === RESPONSE_OK_CODE) {

                                // toastr.success("上传成功！");

                                salary_create.salary_excel_name = file.name;//
                                salary_create.salary_excel_result = null;//默认数据置空
                                salary_create.salary_excel_id = null;//

                                if (data.result) {

                                    salary_create.salary_excel_result = data.result;//
                                    salary_create.salary_excel_id = data.result.id ? data.result.id : null;//

                                }

                                salary_create.initStep2();    //初始化 第二步

                            }
                            else {
                                toastr.error(data.msg)
                            }

                        },
                        error: function (error) {
                            loadingRemove();
                            toastr.error(error);
                        }
                    });

                }
                else {
                    toastr.warning("请上传正确格式的excel");
                }
            }
        }

    },

    //初始化 第二步
    initStep2: function () {

        // console.log(salary_create.salary_excel_result);

        var $step_2 = $step_list.find(".step_2");
        $step_2.removeClass("hide").siblings(".step_item").addClass("hide");//
        $step.find("li").eq(1).addClass("active").siblings().removeClass("active");

        var $salary_excel_info = $step_2.find(".salary_excel_info");
        var $salary_excel_error = $step_2.find(".salary_excel_error");

        //如果可以解析 表格
        if (salary_create.salary_excel_result) {

            $salary_excel_info.removeClass("hide").siblings(".salary_excel_error").addClass("hide");//显示 表格信息
            $salary_excel_info.find(".file_name").html(salary_create.salary_excel_name); //显示表格名称

            salary_create.initDT();//初始化 表格信息
            salary_create.initTlCheck();//初始化 标题检验
            salary_create.initErrMsg();//初始化 错误提示

            $step_2.find(".btn_list").removeClass("hide");//显示 操作 按钮

            //判断是否可以 下一步
            if (salary_create.salary_excel_result.send) {
                $step_2.find(".btn_next").addClass("btn-orange").removeClass("btn-default");
            }
            else {
                $step_2.find(".btn_next").addClass("btn-default").removeClass("btn-orange");
            }

        }
        else {

            $salary_excel_error.removeClass("hide").siblings(".salary_excel_info").addClass("hide");
            $step_2.find(".btn_list").addClass("hide");//隐藏 操作 按钮

        }

    },
    //初始化 表格信息
    initDT: function () {
        console.log(salary_create.salary_excel_result);

        //初始化 column
        var columns = [];
        var header = salary_create.salary_excel_result.header;
        if (header && header.length > 0) {
            for (var i = 0; i < header.length; i++) {
                var $item = header[i];

                var key = $item.key;
                var title = $item.title ? $item.title : "";

                var obj = {
                    field: key,
                    title: title,
                    align: "center",
                    class: key,
                    // width: 200
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }
                        else {
                            html = "<div></div>";
                        }

                        return html;
                    }
                };

                columns.push(obj);

            }

        }

        //初始化 data
        var data = [];//
        var content = salary_create.salary_excel_result.content;
        if (content && content.length > 0) {
            for (var j = 0; j < content.length; j++) {
                var $item = content[j];

                var obj = {};//单条数据
                for (var k = 0; k < $item.length; k++) {

                    obj[$item[k].key] = $item[k].value;

                }

                data.push(obj);

            }
        }

        $tb_salary.bootstrapTable("destroy");
        //表格的初始化
        $tb_salary.bootstrapTable({

            undefinedText: "",                   //当数据为 undefined 时显示的字符
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）

            data: data,                         //直接从本地数据初始化表格
            uniqueId: "id",

            //分页
            pagination: false,                   //是否显示分页（*）
            onlyPagination: true,               //只显示分页 页码
            sidePagination: "client",           //分页方式：client 客户端分页，server 服务端分页（*）
            pageNumber: 1,                      //初始化加载第一页，默认第一页
            pageSize: 5,                       //每页的记录行数（*）
            pageList: [5, 10, 15],        //可供选择的每页的行数（*）

            //排序
            sortable: false,                     //所有列的排序 是否开启
            sortOrder: "desc",                   //排序方式

            width: "100%",
            height: 300,
            // selectItemName: 'parentItem',       //tbody中 radio or checkbox 的字段名（name='parentItem'）

            paginationPreText: "上一页",               //指定分页条中上一页按钮的图标或文字
            paginationNextText: "下一页",             //指定分页条中下一页按钮的图标或文字

            // detailView: true, //是否显示详情折叠

            rowStyle: function (row, index) {
                return {
                    classes: 'item'
                }
            },
            columns: columns

        });

    },
    //初始化 标题检验
    initTlCheck: function () {

        var $step_2 = $step_list.find(".step_2");

        var $tl_check_list = $step_2.find(".tl_check_container").find(".tl_check_list");
        $tl_check_list.empty();

        //初始化 标题检验
        for (var i = 0; i < salary_create.salary_excel_result.titleError.length; i++) {
            var arr = salary_create.salary_excel_result.titleError[i];

            var $item = $("<div>");
            $item.addClass("item");
            $item.appendTo($tl_check_list);

            //cellHeader
            var $tl = $("<div>");
            $tl.addClass("cellHeader");
            $tl.appendTo($item);
            $tl.text(arr.cellHeader);

            //icon
            var $icon = $("<div>");
            $icon.addClass("icon");
            $icon.appendTo($item);
            var $img = $("<img>");
            $img.attr("src", "image/icon_salary/icon_tl_check.png");
            $img.appendTo($icon);

            // realCellHeader
            var $msg = $("<div>");
            $msg.addClass("realCellHeader");
            $msg.appendTo($item);
            $msg.text(arr.realCellHeader);

            //如果是有错误信息
            if (!arr.verified) {
                $item.addClass("error");

                // error
                var $error_msg = $("<div>");
                $error_msg.addClass("error_msg");
                $error_msg.appendTo($item);
                $error_msg.text(arr.error);

            }

        }

    },
    //初始化 错误提示
    initErrMsg: function () {

        var $step_2 = $step_list.find(".step_2");

        var $err_msg_container = $step_2.find(".err_msg_container");
        var $err_msg_list = $err_msg_container.find(".err_msg_list");
        $err_msg_list.empty();

        //错误提示
        if (salary_create.salary_excel_result.contentError &&
            salary_create.salary_excel_result.contentError.length > 0) {

            $err_msg_container.removeClass("hide");

            var arr = salary_create.salary_excel_result.contentError;
            for (var i = 0; i < arr.length; i++) {

                var $item = $("<div>");
                $item.addClass("item");
                $item.appendTo($err_msg_list);
                $item.text(arr[i]);

            }

        }
        else {
            $err_msg_container.addClass("hide");
        }

    },
    //返回上一步重新上传
    stepPrevUpload: function () {

        //如果是正式环境，增加埋点需求
        if (checkEnvironment()) {
            _czc.push(["_trackEvent", "dianzigongzidan", "返回上一步重新上传"]);
        }

        salary_create.initStep1();//初始化 第一步

    },
    //下一步 发送
    stepNext: function () {

        //如果是正式环境，增加埋点需求
        if (checkEnvironment()) {
            _czc.push(["_trackEvent", "dianzigongzidan", "下一步发送"]);
        }

        var $btn_next = $step_list.find(".step_2").find(".btn_next");

        //不能下一步
        if ($btn_next.hasClass("btn-default")) {
            toastr.warning("内容有错误，不能下一步！");
        }
        else {
            salary_create.initStep3();
        }

    },

    //初始化 第三步
    initStep3: function () {

        //薪资名称
        var $step_1 = $step_list.find(".step_1");
        var $salary_info_container = $step_1.find(".salary_info_container");
        var year_month = $salary_info_container.find(".year").val() + "年" +
            $salary_info_container.find(".month").val() + "月";
        var name = $salary_info_container.find(".salary_name input").val();
        name = year_month + " " + (name ? name : "工资单");

        var $step_3 = $step_list.find(".step_3");
        $step_3.removeClass("hide").siblings(".step_item").addClass("hide");//
        $step.find("li").eq(2).addClass("active").siblings().removeClass("active");

        $step_3.find(".salary_name").html(name);//赋值 薪资名称

        // //显示 协议
        // $step_3.find(".user_agreement").show();
        // salary_create.initAgreement();//初始化 用户协议选择

        salary_create.userList();//获取 上传的用户列表

    },

    //获取 上传的用户列表
    userList: function () {
        var $step_3 = $step_list.find(".step_3");
        var $user_list = $step_3.find(".payroll_info .left_side .user_list");
        $user_list.empty();

        var obj = {
            salaryInfoId: salary_create.salary_excel_id
        };

        loadingInit();

        branPostRequest(
            urlGroup.salary.create.salary_info_by_excelId,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var list = "";
                        var arr = data.result.users ? data.result.users : [];
                        if (!arr || arr.length === 0) {
                        }
                        else {

                            for (var i = 0; i < arr.length; i++) {
                                var $item = arr[i];

                                var id = $item.id ? $item.id : "";//
                                var user_name = $item.name ? $item.name : "";//
                                var user_phone = $item.phone ? $item.phone : "";//

                                list +=
                                    "<div class='user_item' data-id='" + id + "'>" +
                                    "<span class='no'>" + (i + 1) + "</span>" +
                                    "&nbsp;&nbsp;" +
                                    "<span>" + user_name + "</span>" +
                                    "<div class='user_phone'>" + user_phone + "</div>" +
                                    "</div>"

                            }

                        }

                        $user_list.html(list);

                    }

                    salary_create.userListInit();   //用户列表 初始化

                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    },
    //用户列表 初始化
    userListInit: function () {

        var $step_3 = $step_list.find(".step_3");
        var $user_list = $step_3.find(".payroll_info .left_side .user_list");

        $user_list.find(".user_item").unbind("click").bind("click", function () {

            var $this = $(this);
            $this.addClass("active").siblings().removeClass("active");

            //获取 上传的 用户对应薪资信息
            salary_create.userSalaryDetail(this);

        });

        if ($user_list.find(".user_item").length > 0) {
            $user_list.find(".user_item").first().click();
        }

    },
    //获取 上传的 用户对应薪资信息
    userSalaryDetail: function (self) {

        var $step_3 = $step_list.find(".step_3");
        var $right_side = $step_3.find(".payroll_info .right_side");
        var $real_salary_container = $right_side.find(".real_salary_container");
        var $salary_detail = $right_side.find(".salary_detail");
        $salary_detail.empty();

        var obj = {
            salaryInfoId: salary_create.salary_excel_id,
            salaryUserId: $(self).attr("data-id")
        };

        loadingInit();

        branPostRequest(
            urlGroup.salary.detail.detail_by_userId,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var salary = data.result.salary ? data.result.salary : "";//
                        if (salary) {

                            var key = salary.title ? salary.title : "";//
                            var value = salary.value ? salary.value : "";//

                            $real_salary_container.find(".key").html(key + ":");
                            $real_salary_container.find(".value").html(value);

                        }

                        var other = data.result.other ? data.result.other : [];//
                        if (other && other.length > 0) {

                            var list = "";
                            for (var i = 0; i < other.length; i++) {
                                var $item = other[i];

                                var key = $item.title ? $item.title : "";//
                                var value = $item.value ? $item.value : "";//

                                list +=
                                    "<div class='item'>" +
                                    "<div class='key'>" + key + "</div>" +
                                    "<div class='value'>" + value + "</div>" +
                                    "</div>";

                            }

                            $salary_detail.html(list);

                        }

                    }

                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );


    },

    //返回上一步 重新编辑
    stepPrev: function () {

        //如果是正式环境，增加埋点需求
        if (checkEnvironment()) {
            _czc.push(["_trackEvent", "dianzigongzidan", "返回上一步"]);
        }

        salary_create.initStep2();

    },
    //发送
    payrollSend: function () {

        //如果是正式环境，增加埋点需求
        if (checkEnvironment()) {
            _czc.push(["_trackEvent", "dianzigongzidan", "发送工资单按钮"]);
        }

        // var $step_3 = $step_list.find(".step_3");

        var obj = {
            salaryInfoId: salary_create.salary_excel_id
        };

        loadingInit();

        branPostRequest(
            urlGroup.salary.create.salary_send,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result && data.result.id) {

                        toastr.success("发送成功！");
                        // var id = data.result.id ? data.result.id : "";

                        getInsidePageDiv(urlGroup.salary.history.index, 'salary_history', '工资单-历史');

                        //最近的 薪资月份id
                        // sessionStorage.setItem("recent_salary_month_id", id);
                        //
                        // location.href = "history.html";

                    }

                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    }

};

$(function () {
    salary_create.init();
});



