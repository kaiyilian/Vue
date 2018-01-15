/**
 * Created by Administrator on 2017/11/9.
 * 花名册
 */

var $body = $("body");
var $emp_roster_container = $(".emp_roster_container");
var $tb_emp_roster = $emp_roster_container.find("#tb_emp_roster");//花名册员工 table id
var $emp_dismiss_modal = $(".emp_dismiss_modal");//退工modal
var $emp_renew_modal = $(".emp_renew_modal");//续约 modal
var $emp_roster_info_modify_modal = $(".emp_roster_info_modify_modal");// 员工编辑 modal
var $emp_roster_import_modal = $(".emp_roster_import_modal");// 花名册导入 modal

//花名册 - 员工导入
var emp_roster_import = {

    ImportFileId: "",//上传文件 id
    ImportFileType: "",//上传文件 类型
    total_num: 0,//总条数
    fail_num: 0,//失败条数
    current_step: 1,//当前 步骤
    tb_data: [],//上传表格 获得data

    init: function () {

        //导入弹框 显示
        $emp_roster_import_modal.on("show.bs.modal", function () {

            $emp_roster_import_modal.find(".modal-title").html("导入本地Excel");

            emp_roster_import.initParams();//初始化 参数
            emp_roster_import.initStep();//初始化 步骤

            var $step_1 = $emp_roster_import_modal.find(".step_1");
            // var $step_2 = $emp_roster_import_modal.find(".step_2");

            //初始化 第一步
            $step_1.find(".upload_container .txt").html("上传Excel");

            //初始化 第二步
            //$step_2.find(".emp_roster_import_table tbody").empty();
            //$step_2.find(".prompt").empty();

        });

    },
    //初始化 参数
    initParams: function () {
        emp_roster_import.ImportFileId = "";//文件id为空 初始化
        emp_roster_import.ImportFileType = "";//文件类型为空 初始化
        emp_roster_import.total_num = 0;//总条数
        emp_roster_import.fail_num = 0;//失败条数
        emp_roster_import.current_step = 1;//第一步
    },
    //初始化 步骤
    initStep: function () {
        var $step = $emp_roster_import_modal.find("ul.step");
        var $step_1 = $emp_roster_import_modal.find(".step_1");
        var $step_2 = $emp_roster_import_modal.find(".step_2");
        var $foot = $emp_roster_import_modal.find(".modal-footer");

        //第一步
        if (emp_roster_import.current_step === 1) {

            $step.find("li").first().addClass("active")
                .siblings().removeClass("active");

            $step_1.show();
            $step_2.hide();

            $foot.find(".btn_next").show().siblings().hide();

        }

        //第二步
        if (emp_roster_import.current_step === 2) {

            $step.find("li").last().addClass("active")
                .siblings().removeClass("active");

            $step_1.hide();
            $step_2.show();

            $foot.find(".btn_next").hide().siblings().show();

        }

    },

    //导入本地Excel 弹框显示
    empImportModalShow: function () {
        $emp_roster_import_modal.modal("show");
    },

    //下载模板
    empImportTemplateDown: function () {

        branGetRequest(
            urlGroup.employee.roster.download_template,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var url = data.result.url ? data.result.url : "";
                        if (!url) {
                            toastr.warning("无法下载，下载链接为空！");
                            return;
                        }

                        toastr.success("下载成功！");

                        var aLink = document.createElement('a');
                        aLink.download = "";
                        aLink.href = url;
                        aLink.click();

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

        // if ($body.find(".download_excel")) {
        //     $body.find(".download_excel").remove();
        // }
        //
        // var form = $("<form>");
        // form.addClass("download_excel");
        // form.attr("enctype", "multipart/form-data");
        // form.attr("action", urlGroup.emp_roster_download_template);
        // form.appendTo($body);
        // form.hide();
        //
        // form.submit();

    },
    //选择文件 - 按钮点击
    chooseFileClick: function () {

        if ($body.find(".upload_excel")) {
            $body.find(".upload_excel").remove();
        }

        var form = $("<form>");
        form.addClass("upload_excel");
        form.attr("enctype", "multipart/form-data");
        form.appendTo($body);
        //form.attr("method", "get");
        form.hide();

        var input = $("<input>");
        input.attr("type", "file");
        input.attr("name", "file");
        input.change(function () {
            emp_roster_import.chooseFile(this);
        });
        input.appendTo(form);

        input.click();

    },
    //选择文件
    chooseFile: function (self) {
        //alert(self.files)
        // var $table = $emp_roster_import_modal.find(".step_2").find(".emp_roster_import_table").find("table");

        if (self.files) {
            loadingInit();

            for (var i = 0; i < self.files.length; i++) {
                var file = self.files[i];

                //判断是否是图片格式
                if (/\.(xls|xlsx)$/.test(file.name)) {

                    //上传xls到预览 返回Json
                    $body.find(".upload_excel").ajaxSubmit({
                        url: urlGroup.employee.roster.excel_import,
                        type: 'post',
                        success: function (data) {
                            //console.log("获取日志：");
                            //console.log(data);

                            loadingRemove();//加载中 弹框隐藏

                            if (data.code === RESPONSE_OK_CODE) {

                                $emp_roster_import_modal.find(".step_1").find(".upload_container .txt").html(file.name);

                                if (data.result) {

                                    var $result = data.result;

                                    emp_roster_import.ImportFileId = $result.file_id ? $result.file_id : "";//
                                    emp_roster_import.ImportFileType = $result.fileTypeStr ? $result.fileTypeStr : "";//
                                    emp_roster_import.total_num = $result.total_count ? $result.total_count : 0;//
                                    emp_roster_import.fail_num = $result.problems_count ? $result.problems_count : 0;//
                                    emp_roster_import.importFileInit();//导入的文件 初始化

                                    emp_roster_import.tb_data = $result.employees ? $result.employees : [];
                                    // emp_roster_import.initTbImport();    //初始化 导入的表格

                                }

                            }
                            else {
                                branError(data.msg);

                                emp_roster_import.initParams();//初始化 参数

                                var $step_1 = $emp_roster_import_modal.find(".step_1");
                                //初始化 第一步
                                $step_1.find(".upload_container .txt").html("上传Excel");

                            }

                        },
                        error: function (error) {
                            loadingRemove();//加载中 弹框隐藏

                            if (error.readyState == 0 && error.status == 0) {
                                toastr.error("网络请求异常！");
                            }
                            else {
                                branError(error);
                            }

                        }
                    });

                }
                else {
                    loadingRemove();//加载中 弹框隐藏
                    toastr.warning("请上传excel文档")
                }
            }
        }
    },
    //导入的文件 初始化
    importFileInit: function () {
        var $prompt = $emp_roster_import_modal.find(".step_2").find(".prompt");

        //显示 上传数量
        var prompt = "";
        if (emp_roster_import.fail_num) {

            prompt = "本次导入" +
                "<span class='total_count clr_ff6600'>" + emp_roster_import.total_num + "</span>" +
                "条，有" +
                "<span class='error_count clr_ff6600'>" + emp_roster_import.fail_num + "</span>" +
                "条错误，请修改后重新导入！";

        }
        else {

            prompt = "本次导入" +
                "<span class='total_count clr_ff6600'>" + emp_roster_import.total_num + "</span>" +
                "条";

        }

        $prompt.html(prompt);

    },
    //初始化 导入的表格
    initTbImport: function () {
        // console.log(data);
// debugger
        var $tb = $emp_roster_import_modal.find("#tb_emp_roster_import");

        $tb.bootstrapTable("destroy");
        //表格的初始化
        $tb.bootstrapTable({

            undefinedText: "",                   //当数据为 undefined 时显示的字符
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）

            data: emp_roster_import.tb_data,     //直接从本地数据初始化表格
            uniqueId: "id",

            //分页
            pagination: false,                   //是否显示分页（*）
            onlyPagination: true,               //只显示分页 页码
            pageNumber: 1,                      //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [5, 10, 15],              //可供选择的每页的行数（*）

            //排序
            sortable: true,                     //所有列的排序 是否开启
            sortOrder: "asc",                   //排序方式

            width: "100%",
            height: 500,
            // selectItemName: 'parentItem',       //tbody中 radio or checkbox 的字段名（name='parentItem'）

            paginationPreText: "上一页",               //指定分页条中上一页按钮的图标或文字
            paginationNextText: "下一页",             //指定分页条中下一页按钮的图标或文字

            // detailView: true, //是否显示详情折叠

            rowStyle: function (row, index) {
                return {
                    classes: 'item'
                }
            },
            columns: [

                {
                    field: "realName",
                    title: "姓名",
                    align: "center",
                    class: "realName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return emp_roster_import.initTbColumnObj(value);
                    }
                },
                {
                    field: "idCardNo",
                    title: "身份证",
                    align: "center",
                    class: "idCardNo",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return emp_roster_import.initTbColumnObj(value);
                    }
                },
                {
                    field: "registerAccount",
                    title: "注册账号",
                    align: "center",
                    class: "registerAccount",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return emp_roster_import.initTbColumnObj(value);
                    }
                },
                {
                    field: "prefixName",
                    title: "工号前缀",
                    align: "center",
                    class: "prefixName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return emp_roster_import.initTbColumnObj(value);
                    }
                },
                {
                    field: "workSn",
                    title: "工号",
                    align: "center",
                    class: "workSn",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return emp_roster_import.initTbColumnObj(value);
                    }
                },

                {
                    field: "departmentName",
                    title: "部门",
                    align: "center",
                    class: "departmentName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return emp_roster_import.initTbColumnObj(value);
                    }
                },
                {
                    field: "positionName",
                    title: "职位",
                    align: "center",
                    class: "positionName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return emp_roster_import.initTbColumnObj(value);
                    }
                },
                {
                    field: "workShiftName",
                    title: "班组",
                    align: "center",
                    class: "workShiftName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return emp_roster_import.initTbColumnObj(value);
                    }
                },
                {
                    field: "workLineName",
                    title: "工段",
                    align: "center",
                    class: "workLineName",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return emp_roster_import.initTbColumnObj(value);
                    }
                },
                {
                    field: "checkinTime",
                    title: "入职日期",
                    align: "center",
                    class: "checkinTime",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        return emp_roster_import.initTbColumnObj(value);
                    }
                },

                {
                    field: "other",
                    title: "其他",
                    align: "center",
                    class: "other",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        var obj = value;

                        if (obj) {

                            var val = obj.value ? obj.value : "";//值
                            var flag = obj.flag ? obj.flag : 0;//值是否正确 0 正确 1 错误
                            var err = obj.err ? obj.err : "";//错误提示

                            if (flag === 1) {     //0 正确 1 错误
                                html = "<div class='isError'>" + err +
                                    "<img src='image/error_prompt.png'>" +
                                    "</div>";
                            }
                            else {
                                html = "<div class='isRight'>" + val + "</div>";
                            }
                        }
                        else {
                            html = "<div class='isRight'></div>";
                        }

                        return html;
                    }
                }

            ]

        });

        //检查是否有错误，完成 按钮是否可点击
        if ($emp_roster_import_modal.find("#tb_emp_roster_import").find(".isError").length > 0 ||
            emp_roster_import.fail_num > 0) {
            $emp_roster_import_modal.find(".btn_confirm").addClass("btn-default").removeClass("btn-orange");
        }
        else {
            $emp_roster_import_modal.find(".btn_confirm").addClass("btn-orange").removeClass("btn-default");
        }

    },
    //每列文字 初始化
    initTbColumnObj: function (obj) {
        var html = "";

        if (obj) {

            var val = obj.value ? obj.value : "";//值
            var flag = obj.flag ? obj.flag : 0;//值是否正确 0 正确 1 错误
            var err = obj.err ? obj.err : "";//错误提示

            if (flag === 1) {     //0 正确 1 错误
                html = "<div class='isError'>" + err +
                    "<img src='image/error_prompt.png'>" +
                    "</div>";
            }
            else {
                html = "<div class='isRight'>" + val + "</div>";
            }
        }
        else {
            html += "<div class='isError'>" + "该字段为空" +
                "<img src='image/error_prompt.png'>" +
                "</div>";
        }

        return html;

    },

    //下一步
    stepNext: function () {

        if (!emp_roster_import.ImportFileId) {
            toastr.warning("请先选择文件！");
            return
        }

        $emp_roster_import_modal.find(".modal-title").html("查看员工信息表");

        emp_roster_import.current_step = 2;//当前步骤 第二步
        emp_roster_import.initStep();//初始化 步骤
        emp_roster_import.initTbImport();    //初始化 导入的表格

    },
    //上一步
    stepPrev: function () {

        $emp_roster_import_modal.find(".modal-title").html("导入本地Excel");

        emp_roster_import.current_step = 1;//当前步骤 第1步
        emp_roster_import.initStep();//初始化 步骤

    },
    //完成 导入excel
    empImportConfirm: function () {

        if (!emp_roster_import.ImportFileId || !emp_roster_import.ImportFileType) {
            toastr.warning("请先选择文件");
            return;
        }

        if ($emp_roster_import_modal.find("#tb_emp_roster_import").find(".isError").length > 0 ||
            emp_roster_import.fail_num > 0) {
            toastr.warning("上传文件中有错误，请返回修改信息重新上传！");
            return;
        }

        loadingInit();

        var obj = {
            file_id: emp_roster_import.ImportFileId,
            fileTypeStr: emp_roster_import.ImportFileType
        };

        branPostRequest(
            urlGroup.employee.roster.excel_import_confirm,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    toastr.success("导入成功");
                    $emp_roster_import_modal.modal("hide");
                    emp_roster_import.initParams();//初始化 参数
                    emp_roster.btnSearchClick();//查询

                }
                else {
                    branError(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    }

};

//花名册 - 员工列表
var emp_roster = {

    DismissArray: null,//退工数组
    RenewArray: null,//续约数组

    init: function () {
        $("[data-toggle='tooltip']").tooltip();

        emp_roster.initTime();//初始化 时间
        emp_roster.initUserList();//初始化 用户列表
        emp_roster.initRenewTime();//初始化 续签时间
        emp_roster.initWorkSnList();//初始化 工号前缀(获取)

        Promise.all([
            getBasicList.departmentList(urlGroup.basic.department.roster),
            getBasicList.workLineList(urlGroup.basic.workLine.roster),
            getBasicList.workShiftList(urlGroup.basic.workShift.roster),
            getBasicList.positionList(urlGroup.basic.position.roster)
        ])
            .then(function (res) {

                // console.log(res);

                var department_list = res[0] ? res[0] : "";
                var workLine_list = res[1] ? res[1] : "";
                var workShift_list = res[2] ? res[2] : "";
                var position_list = res[2] ? res[3] : "";

                var $search_container = $emp_roster_container.find(".search_container");

                //alert(1)
                var deptList = "<option value=''>选择</option>" + department_list;
                $search_container.find(".dept_container select").html(deptList);

                var workLineList = "<option value=''>选择</option>" + workLine_list;
                $search_container.find(".workLine_container select").html(workLineList);

                var workShiftList = "<option value=''>选择</option>" + workShift_list;
                $search_container.find(".workShift_container select").html(workShiftList);

                var postList = "<option value=''>选择</option>" + position_list;
                $search_container.find(".post_container select").html(postList);

                emp_roster.empRosterList();//员工列表

            })
            .catch(function (err) {

                console.log("error in emp_prospective basic list:");
                console.error(err.message);

            });

        // //赋值 查询的URL
        // sessionStorage.setItem("get_dept_list", urlGroup.basic.department.roster);
        // sessionStorage.setItem("get_workLine_list", urlGroup.basic.workLine.roster);
        // sessionStorage.setItem("get_workShift_list", urlGroup.basic.workShift.roster);
        // sessionStorage.setItem("get_post_list", urlGroup.basic.position.roster);
        //
        // getBasicList.getBasicList(
        //     function () {
        //         var $search_container = $emp_roster_container.find(".search_container");
        //
        //         var deptList = "<option value=''>选择</option>" + sessionStorage.getItem("deptList");
        //         $search_container.find(".dept_container select").html(deptList);
        //
        //         var workLineList = "<option value=''>选择</option>" + sessionStorage.getItem("workLineList");
        //         $search_container.find(".workLine_container select").html(workLineList);
        //
        //         var workShiftList = "<option value=''>选择</option>" + sessionStorage.getItem("workShiftList");
        //         $search_container.find(".workShift_container select").html(workShiftList);
        //
        //         var postList = "<option value=''>选择</option>" + sessionStorage.getItem("postList");
        //         $search_container.find(".post_container select").html(postList);
        //
        //         emp_roster.empRosterList();//员工列表
        //
        //     },
        //     function (msg) {
        //         branError(msg)
        //     }
        // );

        // 退工弹框 - 显示后初始化
        $emp_dismiss_modal.on('shown.bs.modal', function (e) {

            //初始化 离职原因
            emp_roster.initLeaveReason();

            $emp_dismiss_modal.find(".dismiss_time input").val("");
            $emp_dismiss_modal.find(".dismiss_remark textarea").val("");

        });

        // 续约弹框 - 显示后初始化
        $emp_renew_modal.on('show.bs.modal', function (e) {

            var $row = $emp_renew_modal.find(".modal-body .row");

            //合同结束时间
            var data = $tb_emp_roster.bootstrapTable("getAllSelections");
            var renew_begin_time = data[0].contract_end_time;
            renew_begin_time += 86400000;
            renew_begin_time = timeInit(renew_begin_time);

            //赋值 开始时间
            $row.find(".begin_time input").val(renew_begin_time);

            //结束时间 置空
            $row.find(".end_time input").val("");

        });

    },
    //初始化 时间
    initTime: function () {

        //入职时间 开始
        var start = {
            elem: "#roster_beginTime",
            event: 'focus', //触发事件
            format: 'YYYY-MM-DD',
            min: "", //设定最小日期为当前日期
            max: '', //最大日期
            istime: false,//是否开启时间选择
            istoday: false, //是否显示今天
            choose: function (datas) {
                //end.min = datas; //开始日选好后，重置结束日的最小日期
                //end.start = datas;//将结束日的初始值设定为开始日
            }
        };

        //入职时间 结束
        var end = {
            elem: "#roster_endTime",
            event: 'focus', //触发事件
            format: 'YYYY-MM-DD',
            min: "",
            max: "",
            istime: false,
            istoday: false,
            choose: function (datas) {
                //start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };

        //退工时间 初始化
        var dismiss_time = {
            elem: "#emp_dismiss_time",
            event: 'focus', //触发事件
            format: 'YYYY-MM-DD',
            min: "",
            max: "",
            istime: false,
            istoday: false,
            choose: function (datas) {

            }
        };

        laydate(start);
        laydate(end);
        laydate(dismiss_time);

    },
    //初始化 用户列表
    initUserList: function () {
        var $search_container = $emp_roster_container.find('.search_container');
        var $user_list = $search_container.find(".user_list");
        $user_list.empty();

        loadingInit();

        branGetRequest(
            urlGroup.employee.roster.search_user_list,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    //清空 员工选择框
                    if ($user_list.siblings(".chosen-container").length > 0) {
                        $user_list.chosen("destroy");
                    }

                    var users = data.result ? data.result : [];

                    $.each(users, function (index, item) {

                        var id = item.id ? item.id : "";//在职员工 id
                        var name = item.name ? item.name : "";//
                        var workSn = item.workSn ? item.workSn : "";//
                        var workLineName = item.workLineName ? item.workLineName : "";//

                        var $option = $("<option>");
                        $option.attr("value", id);
                        $option.text(name + " - " + workSn + " - " + workLineName);
                        $option.appendTo($user_list);

                    });

                    $user_list.chosen({
                        allow_single_deselect: true,//选择之后 是否可以取消
                        max_selected_options: 1,//最多只能选择1个
                        width: "100%",//select框 宽度
                        no_results_text: "找不到 " //输入的 内容查询不到时的提示信息
                    });

                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                toastr.error(error)
            }
        );

    },
    //初始化 续约时间
    initRenewTime: function () {
        //入职时间 开始
        var start = {
            elem: "#emp_contract_begin_time",
            event: 'focus', //触发事件
            format: 'YYYY-MM-DD',
            min: "", //设定最小日期为当前日期
            max: '', //最大日期
            istime: false,//是否开启时间选择
            istoday: false, //是否显示今天
            choose: function (datas) {
                //end.min = datas; //开始日选好后，重置结束日的最小日期
                //end.start = datas;//将结束日的初始值设定为开始日
            }
        };

        //入职时间 结束
        var end = {
            elem: "#emp_contract_end_time",
            event: 'focus', //触发事件
            format: 'YYYY-MM-DD',
            min: "",
            max: "",
            istime: false,
            istoday: false,
            choose: function (datas) {
                //start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };

        laydate(start);
        laydate(end);
    },
    //初始化 离职原因
    initLeaveReason: function () {

        getBasicList.getLeaveReasonList(
            urlGroup.employee.roster.leave_reason_list,
            function () {

                if (!sessionStorage.getItem("leaveReasonList")) {
                    toastr.warning("离职原因为空，请先去'设置中心'-'离职原因' 添加数据！");
                    return
                }

                $emp_dismiss_modal.find(".leave_reason_list select").html(
                    sessionStorage.getItem("leaveReasonList")
                );

            },
            function (msg) {
                branError(msg)
            }
        );
    },
    //初始化 工号前缀(获取)
    initWorkSnList: function () {
        var $row = $emp_roster_info_modify_modal.find(".modal-body .row");

        //alert(url)
        branGetRequest(
            urlGroup.employee.setting.job_num_prefix.list,
            function (data) {
                //alert(JSON.stringify(data));
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    var workSn = data.result.models;
                    var workSn_list = "<option value='empty'>无</option>";//
                    if (!workSn || workSn.length === 0) {

                    }
                    else {
                        for (var i = 0; i < workSn.length; i++) {

                            var item = workSn[i];
                            var id = item.id;//
                            var name = item.name;//
                            var version = item.version;//版本
                            var latestSn = item.latestSn;//最近一次未分配的工号

                            workSn_list += "<option value='" + id + "' " +
                                "data-version='" + version + "' " +
                                "data-lastSn='" + latestSn + "' " +
                                ">" + name + "</option>";
                        }
                    }

                    $row.find(".employee_no_begin select").html(workSn_list);

                }
                else {
                    branError(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    },

    //查询按钮 点击事件
    btnSearchClick: function () {
        emp_roster.empRosterList();//员工列表
    },
    //员工列表
    empRosterList: function () {

        emp_roster_query_param.paramSet();//参数 设置

        if (emp_roster_query_param.check_in_start_time && emp_roster_query_param.check_in_end_time &&
            emp_roster_query_param.check_in_start_time > emp_roster_query_param.check_in_end_time) {
            toastr.warning("开始时间不能大于结束时间！");
            return;
        }

        loadingInit();

        $tb_emp_roster.bootstrapTable("destroy");
        //表格的初始化
        $tb_emp_roster.bootstrapTable({

            undefinedText: "",                   //当数据为 undefined 时显示的字符
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）

            // data: data,                         //直接从本地数据初始化表格
            uniqueId: "id",

            //分页
            pagination: true,                   //是否显示分页（*）
            onlyPagination: true,               //只显示分页 页码
            pageNumber: 1,                      //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [5, 10, 15],              //可供选择的每页的行数（*）

            //排序
            sortable: true,                     //所有列的排序 是否开启
            sortOrder: "asc",                   //排序方式
            // silentSort: false,                   //排序方式
            // sortName: "emp_work_sn",                    //定义排序列,通过url方式获取数据填写字段名，否则填写下标

            width: "100%",
            height: 600,
            // selectItemName: 'parentItem',       //tbody中 radio or checkbox 的字段名（name='parentItem'）

            paginationPreText: "上一页",               //指定分页条中上一页按钮的图标或文字
            paginationNextText: "下一页",             //指定分页条中下一页按钮的图标或文字

            // detailView: true, //是否显示详情折叠

            rowStyle: function (row, index) {
                return {
                    classes: 'item'
                }
            },
            columns: [

                {
                    checkbox: true
                },
                {
                    field: "emp_work_sn",
                    title: "工号",
                    align: "center",
                    sortable: true,
                    class: "emp_work_sn",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "emp_name",
                    title: "姓名",
                    align: "center",
                    sortable: true,
                    class: "emp_name",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "emp_register_account",
                    title: "注册账号",
                    align: "center",
                    sortable: true,
                    class: "emp_register_account",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {

                            if (row.emp_is_bind) {
                                html = "<div>" + value + "（已绑）</div>"
                            }
                            else {
                                html = "<div>" + value + "（未绑）</div>"
                            }
                        }

                        return html;
                    }
                },

                {
                    field: "department_name",
                    title: "部门",
                    align: "center",
                    sortable: true,
                    class: "department_name",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "position_name",
                    title: "职位",
                    align: "center",
                    sortable: true,
                    class: "position_name",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "work_shift_name",
                    title: "班组",
                    align: "center",
                    sortable: true,
                    class: "work_shift_name",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "work_line_name",
                    title: "工段",
                    align: "center",
                    sortable: true,
                    class: "work_line_name",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },

                {
                    field: "contract_start_time",
                    title: "合同开始时间",
                    align: "center",
                    sortable: true,
                    class: "contract_start_time",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            value = timeInit(value);
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "contract_end_time",
                    title: "合同结束时间",
                    align: "center",
                    sortable: true,
                    class: "contract_end_time",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            value = timeInit(value);

                            var year = value.split("-")[0];
                            if (year === "9999")
                                value = "无期限";

                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "check_in_time",
                    title: "入职时间",
                    align: "center",
                    sortable: true,
                    class: "check_in_time",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            value = timeInit(value);
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },

                {
                    field: "attendance_no",
                    title: "打卡号",
                    align: "center",
                    sortable: true,
                    class: "attendance_no",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "attendance_add_state",
                    title: "打卡状态",
                    align: "center",
                    sortable: true,
                    class: "attendance_add_state",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var attendance_status = "";//打卡状态
                        switch (value) {
                            case "initial":
                                attendance_status = "未录入";
                                break;
                            case "success":
                                attendance_status = "已录入";
                                break;
                            case "fail":
                                attendance_status = "录入失败";
                                break;
                            case "wait":
                                attendance_status = "录入等待";
                                break;
                            default:
                                attendance_status = "未录入";
                        }

                        return "<div title='" + attendance_status + "'>" + attendance_status + "</div>";

                    }
                },

                {
                    field: "operate",
                    title: "操作",
                    align: "center",
                    class: "operate",
                    formatter: function (value, row, index) {

                        var html = "";
                        html += "<div class='operate'>";

                        //查看明细
                        html += "<div class='btn btn-success btn-sm btn_detail'>查看明细</div>";

                        //编辑
                        html += "<div class='btn btn-success btn-sm btn_modify'>编辑</div>";

                        //退工
                        html += "<div class='btn btn-success btn-sm btn_dismiss'>退工</div>";

                        html += "</div>";

                        return html;

                    },
                    events: {

                        //查看明细
                        "click .btn_detail": function (e, value, row, index) {

                            var id = row.id;
                            var tabId = "emp_roster_" + id;//tab中的id
                            var pageName = row.emp_name + "的个人资料";

                            sessionStorage.setItem("CurrentEmployeeId", id);//当前员工id
                            sessionStorage.setItem("currentTabID", tabId);//当前 tab id

                            getInsidePageDiv(urlGroup.employee.roster_detail.index, tabId, pageName);

                        },
                        //编辑
                        "click .btn_modify": function (e, value, row, index) {

                            emp_roster_modify.row = {
                                id: row.id
                            };
                            $emp_roster_info_modify_modal.modal("show");

                        },
                        //退工
                        "click .btn_dismiss": function (e, value, row, index) {

                            emp_roster.DismissArray = {};
                            emp_roster.DismissArray[row.id] = row.version;

                            $emp_dismiss_modal.modal("show");

                        }

                    }
                }

            ],

            sidePagination: "server",           //分页方式：client 客户端分页，server 服务端分页（*）
            method: "get",
            contentType: "application/x-www-form-urlencoded",
            url: urlGroup.employee.roster.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数

                // console.log(params);
                var order = params.sortOrder === "asc" ? 1 : 0;//升序 1  倒序 0
                var orderParam = "";//排序的字段
                switch (params.sortName) {
                    case "emp_work_sn":
                        orderParam = "workSn";
                        break;
                    case "emp_name":
                        orderParam = "realName";
                        break;
                    case "emp_register_account":
                        orderParam = "registerAccount";
                        break;
                    case "department_name":
                        orderParam = "departmentId";
                        break;
                    case "position_name":
                        orderParam = "positionId";
                        break;
                    case "work_shift_name":
                        orderParam = "workShiftId";
                        break;
                    case "work_line_name":
                        orderParam = "workLineId";
                        break;
                    case "contract_start_time":
                        orderParam = "startTime";
                        break;
                    case "contract_end_time":
                        orderParam = "endTime";
                        break;
                    case "check_in_time":
                        orderParam = "checkinTime";
                        break;
                    case "attendance_no":
                        orderParam = "workAttendanceNo";
                        break;
                    case "attendance_add_state":
                        orderParam = "workAttendanceAddState";
                        break;
                    default:
                        orderParam = "";
                        break
                }

                var obj = {
                    page: params.pageNumber,
                    page_size: params.pageSize,
                    orderParam: orderParam,
                    order: order,

                    position_id: emp_roster_query_param.position_id,
                    work_shift_id: emp_roster_query_param.work_shift_id,
                    work_line_id: emp_roster_query_param.work_line_id,
                    department_id: emp_roster_query_param.department_id,

                    check_in_start_time: emp_roster_query_param.check_in_start_time,
                    check_in_end_time: emp_roster_query_param.check_in_end_time,
                    emp_id: emp_roster_query_param.emp_id

                };

                // console.log(obj);
                return obj;
            },
            onLoadSuccess: function () {  //加载成功时执行

                // toastr.success("成功！");

            },
            onLoadError: function () {  //加载失败时执行
                debugger
                // layer.msg("加载数据失败", {time: 1500, icon: 2});
            },
            responseHandler: function (res) {

                setTimeout(function () {
                    loadingRemove();
                }, 500);

                var tb_data = [];
                var total_rows = 0;//总条数

                if (res.code === RESPONSE_OK_CODE) {

                    if (res.result) {
                        total_rows = res.result.total_rows ? res.result.total_rows : 0;//总条数

                        var arr = res.result.employees;
                        if (arr && arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var item = arr[i];

                                var version = item.version;//
                                var emp_id = item.employee_id ? item.employee_id : "";//员工id
                                var emp_work_sn = item.work_sn ? item.work_sn : "";//员工 工号
                                var emp_name = item.name ? item.name : "";//员工姓名
                                var emp_register_account = item.registerAccount ? item.registerAccount : "";//注册账号
                                var emp_is_bind = item.isBinding ? item.isBinding : 0;//是否使用企业入职码绑定

                                var department_id = item.department_id ? item.department_id : "";//部门id
                                var department_name = item.department_name ? item.department_name : "";//部门名称
                                var position_id = item.position_id ? item.position_id : "";//职位id
                                var position_name = item.position_name ? item.position_name : "";//职位名称
                                var work_shift_id = item.work_shift_id ? item.work_shift_id : "";//班组id
                                var work_shift_name = item.work_shift_name ? item.work_shift_name : "";//班组名称
                                var work_line_id = item.work_line_id ? item.work_line_id : "";//工段id
                                var work_line_name = item.work_line_name ? item.work_line_name : "";//工段名称

                                var contract_start_time = item.contract_start_time ? item.contract_start_time : 0;//合同开始时间
                                // contract_start_time = timeInit(contract_start_time);
                                var contract_end_time = item.contract_end_time ? item.contract_end_time : 0;//合同结束时间
                                // contract_end_time = timeInit(contract_end_time);
                                var check_in_time = item.check_in_time ? item.check_in_time : 0;//入职时间
                                // check_in_time = timeInit(check_in_time);

                                var attendance_no = item.attendance_no ? item.attendance_no : "";//打卡号
                                var attendance_add_state = item.attendance_add_state ? item.attendance_add_state : "0";//录入状态

                                var obj = {

                                    id: emp_id,
                                    version: version,
                                    emp_work_sn: emp_work_sn,
                                    emp_name: emp_name,
                                    emp_register_account: emp_register_account,
                                    emp_is_bind: emp_is_bind,

                                    department_id: department_id,
                                    department_name: department_name,
                                    position_id: position_id,
                                    position_name: position_name,
                                    work_shift_id: work_shift_id,
                                    work_shift_name: work_shift_name,
                                    work_line_id: work_line_id,
                                    work_line_name: work_line_name,

                                    contract_start_time: contract_start_time,
                                    contract_end_time: contract_end_time,
                                    check_in_time: check_in_time,
                                    attendance_no: attendance_no,
                                    attendance_add_state: attendance_add_state

                                };
                                tb_data.push(obj);

                            }

                        }


                    }

                }
                else {
                    toastr.warning(res.msg);
                }

                return {
                    total: total_rows,
                    rows: tb_data
                };

            },

            //选中单行
            onCheck: function (row) {
                emp_roster.checkIsChoose();
            },
            onUncheck: function (row) {
                emp_roster.checkIsChoose();
            },
            onCheckAll: function (rows) {
                emp_roster.checkIsChoose();
            },
            onUncheckAll: function (rows) {
                emp_roster.checkIsChoose();
            },

            formatNoMatches: function () {
                return '花名册暂无员工';
            },

        });

    },
    //检查 是否选中
    checkIsChoose: function () {
        var data = $tb_emp_roster.bootstrapTable("getAllSelections");

        var $btn_list = $emp_roster_container.find(".foot .btn_list");
        var $btn_dismiss = $btn_list.find(".btn_dismiss");//退工
        var $btn_renew = $btn_list.find(".btn_renew");//续约
        var $btn_down = $btn_list.find(".btn_down");//下载附件

        //退工、续签 按钮 初始化
        if (data.length > 0) {
            $btn_dismiss.addClass("btn-success").removeClass("btn-default");
            $btn_renew.addClass("btn-success").removeClass("btn-default");
            $btn_down.addClass("btn-success").removeClass("btn-default");
        }
        else {
            $btn_dismiss.addClass("btn-default").removeClass("btn-success");
            $btn_renew.addClass("btn-default").removeClass("btn-success");
            $btn_down.addClass("btn-default").removeClass("btn-success");
        }
    },

    //退工 多个员工
    dismissMore: function () {
        emp_roster.DismissArray = {};//初始化

        var data = $tb_emp_roster.bootstrapTable("getAllSelections");

        if (data.length === 0) {
            toastr.warning("您没有选择用户");
            return
        }

        $.each(data, function (i, item) {
            emp_roster.DismissArray[item.id] = item.version;
        });

        $emp_dismiss_modal.modal("show");//退工弹框显示
    },
    //退工
    dismiss: function () {

        if (!emp_roster.checkParamByDismiss()) {
            return;
        }

        var $row = $emp_dismiss_modal.find(".modal-body .row");
        var leave_reason_id = $row.find(".leave_reason_list select option:selected").val();
        var time = $.trim($row.find(".dismiss_time input").val());
        time = time ? new Date(time).getTime() : "";
        var remark = $.trim($row.find(".dismiss_remark textarea").val());

        var obj = {
            employee_id: emp_roster.DismissArray,
            leave_reason_id: leave_reason_id,
            leave_time: time,
            remarks: remark
        };

        loadingInit();

        branPostRequest(
            urlGroup.employee.roster.leave,
            obj,
            function (data) {

                if (data.code === RESPONSE_OK_CODE) {

                    toastr.success("退工成功！");
                    $emp_dismiss_modal.modal("hide");

                    emp_roster.empRosterList();//员工列表
                    emp_roster.checkIsChoose();//

                }
                else {
                    branError(data.msg);
                }
            },
            function (error) {
                branError(error);
            }
        );

    },
    //检查 退工参数
    checkParamByDismiss: function () {
        var flag = false;
        var txt = "";

        var $row = $emp_dismiss_modal.find(".modal-body .row");

        var time = $.trim($row.find(".dismiss_time input").val());
        //var remark = $.trim($row.find(".dismiss_remark textarea").val());

        if (!time) {
            txt = "请选择退工时间";
        }
        else {
            flag = true;
        }

        if (txt) {
            toastr.warning(txt);
        }

        return flag;

    },

    //续约 弹框显示
    renewModalShow: function () {
        emp_roster.RenewArray = [];//初始化

        var data = $tb_emp_roster.bootstrapTable("getAllSelections");
        if (data.length === 0) {
            toastr.warning("您没有选择用户");
            return
        }

        var end_time_different_count = 0;//判断选中的 员工结束时间 不相同的数量
        var permanent_count = 0;//判断无期限的 员工数量
        var first_end_date = data[0].contract_end_time;//第一个选择的员工 合同结束时间
        first_end_date = timeInit(first_end_date);//

        $.each(data, function (i, item) {

            var end_date = item.contract_end_time;
            end_date = timeInit(end_date);

            //如果是 无期限
            if (end_date.split("-")[0] === "9999") {
                permanent_count += 1;
            }
            //如果有合同 结束时间不相同
            if (end_date !== first_end_date) {
                end_time_different_count += 1;
            }

            var obj = {
                id: item.id,
                version: item.version
            };
            emp_roster.RenewArray.push(obj);

        });

        if (permanent_count > 0) {
            toastr.warning("有员工合同结束时间为 无期限！");
        }
        else if (end_time_different_count > 0) {
            toastr.warning("有员工合同结束时间不一致！请重新选择");
        }
        else
            $emp_renew_modal.modal("show");

    },
    //续约
    renew: function () {
        var $row = $emp_renew_modal.find(".modal-body .row");

        var beginTime = $.trim($row.find(".begin_time input").val());
        var endTime = $.trim($row.find(".end_time input").val());

        if (!beginTime || !endTime) {
            toastr.warning("请选择时间");
            return
        }

        beginTime = new Date(beginTime).getTime();
        endTime = new Date(endTime).getTime();
        if (beginTime >= endTime) {
            toastr.warning("开始时间要小于结束时间");
            return
        }

        var obj = {
            idVersions: emp_roster.RenewArray,
            contract_start_time: beginTime,
            contract_end_time: endTime
        };

        loadingInit();

        branPostRequest(
            urlGroup.employee.roster.contract_extension,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {
                    toastr.success("续约成功！");
                    $emp_renew_modal.modal("hide");

                    emp_roster.empRosterList();//员工列表
                    emp_roster.checkIsChoose();//

                }
                else {
                    branError(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    },

    //在职员工 导出
    exportEmpList: function () {

        var data = $tb_emp_roster.bootstrapTable("getData");//所有数据

        if (data.length === 0) {
            toastr.warning("没有数据，无法导出");
            return
        }

        exportModalShow("确认导出花册员工吗？", function () {

            loadingInit();

            var obj = {
                position_id: emp_roster_query_param.position_id,
                work_shift_id: emp_roster_query_param.work_shift_id,
                work_line_id: emp_roster_query_param.work_line_id,
                department_id: emp_roster_query_param.department_id,

                check_in_start_time: emp_roster_query_param.check_in_start_time,
                check_in_end_time: emp_roster_query_param.check_in_end_time,
                emp_id: emp_roster_query_param.emp_id
            };
            var url = urlGroup.employee.roster.excel_export + "?" + jsonParseParam(obj);

            branGetRequest(
                url,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code === RESPONSE_OK_CODE) {

                        if (data.result) {

                            var url = data.result.url ? data.result.url : "";
                            if (!url) {
                                toastr.warning("无法下载，下载链接为空！");
                                return;
                            }

                            toastr.success("导出成功！");

                            var aLink = document.createElement('a');
                            aLink.download = "";
                            aLink.href = url;
                            aLink.click();

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

        });

    },
    //下载附件
    enclosureDown: function () {
        var data = $tb_emp_roster.bootstrapTable("getAllSelections");

        if (data.length === 0) {
            toastr.warning("您没有选择用户，请先选择用户！");
            return
        }

        exportModalShow("确定要下载附件吗？", function () {

            loadingInit();

            var ids = [];
            $.each(data, function (i, item) {
                ids.push(item.id);
            });

            if ($body.find(".enclosure_down").length > 0) {
                $body.find(".enclosure_down").remove();
            }

            var form = $("<form>");
            form.addClass("enclosure_down");
            form.attr("enctype", "multipart/form-data");
            form.attr("action", urlGroup.employee.roster.attachment_down);
            form.attr("method", "get");
            form.appendTo($body);
            form.hide();

            form.append($("<input>").attr("name", "employee_ids").attr("value", ids));
            form.append($("<input>").attr("name", "type").attr("value", 2));

            loadingRemove();
            form.submit();

        });

    },

    //同步考勤机
    attendPut: function () {

        operateMsgShow("是否确定要同步？", function () {

            loadingInit();

            branGetRequest(
                urlGroup.employee.roster.attend_put,
                function (data) {
                    //console.info("获取日志：");
                    //console.log(data);

                    if (data.code === RESPONSE_OK_CODE) {
                        toastr.success("考勤机同步中......！");

                        var data = $tb_emp_roster.bootstrapTable("getData");//所有数据

                        $.each(data, function (i, item) {

                            var status = item.attendance_add_state;//录入状态

                            //如果是 未录入、录入失败 更改为 等待录入
                            if (status === "initial" || status === "fail" || !status) {

                                $tb_emp_roster.bootstrapTable("updateRow", {
                                    index: i,
                                    row: {
                                        attendance_add_state: "wait"
                                    }
                                });

                            }

                        });

                        // var $table = $(emp_roster.containerName).find(".table_container table");
                        //
                        // $table.find("tr.item").each(function () {
                        //     var $this = $(this);
                        //     var status = $this.find(".emp_attendance_status").attr("data-status")
                        //
                        //     if (status == "initial" || status == "fail") {
                        //         $this.find(".emp_attendance_status").html("等待同步");
                        //     }
                        //
                        // });

                    }
                    else {
                        toastr.warning(data.msg);
                    }

                },
                function (error) {
                    toastr.error(error);
                }
            );

        });

    }

};
//花名册 查询参数
var emp_roster_query_param = {
    position_id: null,
    work_shift_id: null,    //班组
    work_line_id: null,//   工段
    department_id: null,
    check_in_start_time: null,
    check_in_end_time: null,
    emp_id: null,

    paramSet: function () {

        var $search_container = $emp_roster_container.find(".search_container");

        emp_roster_query_param.position_id = $search_container.find(".post_container select option:selected").val();
        emp_roster_query_param.work_shift_id = $search_container.find(".workShift_container select option:selected").val();
        emp_roster_query_param.work_line_id = $search_container.find(".workLine_container select option:selected").val();
        emp_roster_query_param.department_id = $search_container.find(".dept_container select option:selected").val();

        emp_roster_query_param.check_in_start_time = $.trim($search_container.find(".beginTime").val());
        emp_roster_query_param.check_in_start_time = emp_roster_query_param.check_in_start_time
            ? new Date(emp_roster_query_param.check_in_start_time).getTime() : "";

        emp_roster_query_param.check_in_end_time = $.trim($search_container.find(".endTime").val());
        emp_roster_query_param.check_in_end_time = emp_roster_query_param.check_in_end_time
            ? new Date(emp_roster_query_param.check_in_end_time).getTime() : "";

        //用户 id
        emp_roster_query_param.emp_id = $search_container.find(".user_list").val()
            ? $search_container.find(".user_list").val()[0] : "";

    }
};

//花名册 - 员工编辑
var emp_roster_modify = {

    row: null,//员工行 信息

    init: function () {

        // 编辑员工信息 - 显示后初始化
        $emp_roster_info_modify_modal.on('shown.bs.modal', function (e) {

            var $modal_body = $emp_roster_info_modify_modal.find(".modal-body");
            var $personal_info = $modal_body.find(".personal_info");
            //合同结束时间 是否是无限期
            $personal_info.find(".emp_contract_end_time_permanent").unbind("click").bind("click", function () {

                var $this = $(this);

                if ($this.hasClass("active")) {
                    $this.removeClass("active").find("img").attr("src", "image/UnChoose.png");
                    $this.siblings(".emp_contract_end_time").find("input").removeAttr("disabled");
                }
                else {
                    $this.addClass("active").find("img").attr("src", "image/Choosed.png");
                    $this.siblings(".emp_contract_end_time").find("input").val("").attr("disabled", "disabled");
                }

            });

            loadingInit();

            var obj = {
                id: emp_roster_modify.row.id
            };
            var url = urlGroup.employee.roster.info_by_id + "?" + jsonParseParam(obj);

            branGetRequest(
                url,
                function (data) {
                    //console.log("员工详细信息：");
                    //console.log(data);

                    if (data.code === RESPONSE_OK_CODE) {

                        var $item = data.result;

                        emp_roster_modify.row["isBinding"] = $item.isBinding ? $item.isBinding : 0;//是否绑定
                        emp_roster_modify.row["version"] = $item.version ? $item.version : "";//版本
                        emp_roster_modify.row["emp_register_account"] = $item.registerAccount ? $item.registerAccount : "";//注册账号
                        emp_roster_modify.row["emp_name"] = $item.realName ? $item.realName : "";//姓名
                        emp_roster_modify.row["emp_idCard"] = $item.idCardNo ? $item.idCardNo : "";//身份证
                        emp_roster_modify.row["emp_work_sn_prefix_id"] = $item.workSnPrefixId ? $item.workSnPrefixId : "";//工号前缀
                        emp_roster_modify.row["emp_work_sn"] = $item.workSn ? $item.workSn : "";//工号 后缀

                        emp_roster_modify.row["department_id"] = $item.departmentId ? $item.departmentId : "";//部门
                        emp_roster_modify.row["position_id"] = $item.positionId ? $item.positionId : "";//职位
                        emp_roster_modify.row["work_shift_id"] = $item.workShiftId ? $item.workShiftId : "";//班组
                        emp_roster_modify.row["work_line_id"] = $item.workLineId ? $item.workLineId : "";//工段

                        emp_roster_modify.row["emp_sex"] = $item.sex ? $item.sex : 0;//性别 0男 1女
                        emp_roster_modify.row["emp_marry"] = $item.marriage ? $item.marriage : "1";//婚姻状况
                        emp_roster_modify.row["emp_nation"] = $item.nation ? $item.nation : "";//民族
                        emp_roster_modify.row["emp_register_address"] = $item.idcardAddress ? $item.idcardAddress : "";//户籍地
                        emp_roster_modify.row["emp_contact_phone"] = $item.telephone ? $item.telephone : "";//联系方式
                        emp_roster_modify.row["province_id"] = $item.provinceId ? $item.provinceId : "";//省
                        emp_roster_modify.row["city_id"] = $item.cityId ? $item.cityId : "";//市
                        emp_roster_modify.row["area_id"] = $item.countyId ? $item.countyId : "";//区
                        emp_roster_modify.row["emp_address"] = $item.address ? $item.address : "";//详细地址
                        emp_roster_modify.row["emp_urgent_contact"] = $item.urgentContact ? $item.urgentContact : "";//紧急联系人
                        emp_roster_modify.row["emp_urgent_contact_phone"] = $item.urgentContactPhone ? $item.urgentContactPhone : "";//紧急联系手机

                        emp_roster_modify.row["bus_address"] = $item.busAddress ? $item.busAddress : "";//班车点
                        emp_roster_modify.row["emp_interview_date"] = $item.interviewDate ? $item.interviewDate : "";//面试时间
                        emp_roster_modify.row["emp_interview_date"] = timeInit(emp_roster_modify.row["emp_interview_date"]);
                        emp_roster_modify.row["emp_check_in_date"] = $item.checkinTime ? $item.checkinTime : "";//入职时间
                        emp_roster_modify.row["emp_check_in_date"] = timeInit(emp_roster_modify.row["emp_check_in_date"]);
                        emp_roster_modify.row["emp_contract_start_time"] = $item.startTime ? $item.startTime : "";//合同开始
                        emp_roster_modify.row["emp_contract_start_time"] = timeInit(emp_roster_modify.row["emp_contract_start_time"]);
                        emp_roster_modify.row["emp_contract_end_time"] = $item.endTime ? $item.endTime : "";//合同结束
                        emp_roster_modify.row["emp_contract_end_time"] = timeInit(emp_roster_modify.row["emp_contract_end_time"]);
                        emp_roster_modify.row["emp_contract_end_time_is_permanent"] = $item.isNolimit ? $item.isNolimit : 0;//合同结束 是否是无限期
                        emp_roster_modify.row["emp_interview_source"] = $item.sourceOfSupply ? $item.sourceOfSupply : "";//供应来源
                        emp_roster_modify.row["emp_nature"] = $item.employeeNature ? $item.employeeNature : "";//员工性质
                        emp_roster_modify.row["emp_bank_info"] = $item.bankAccount ? $item.bankAccount : "";//开户行信息
                        emp_roster_modify.row["emp_bank_card_no"] = $item.bankNum ? $item.bankNum : "";//银行卡号

                        emp_roster_modify.row["custom_list"] = $item.userDefined_details ? $item.userDefined_details : [];//自定义列表

                        $emp_roster_info_modify_modal.find(".modal-title").html(emp_roster_modify.row.emp_name + "的资料修改");

                        emp_roster_modify.empInfoSet();//员工信息 获取后 赋值

                        emp_roster_modify.initUserAddress();//初始化 用户的省市区

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

    //员工信息 获取后 赋值row
    empInfoSet: function (data) {
        //console.log("员工详情：");
        //console.log(data);

        var $modal_body = $emp_roster_info_modify_modal.find(".modal-body");

        var $basic_info = $modal_body.find(".basic_info");
        var $personal_info = $modal_body.find(".personal_info");
        var $custom_info = $modal_body.find(".custom_info");
        $custom_info.find(".content").empty();

        //基本信息
        $basic_info.find(".register_account input").val(emp_roster_modify.row.emp_register_account);
        $basic_info.find(".emp_name input").val(emp_roster_modify.row.emp_name);
        $basic_info.find(".emp_idCard input").val(emp_roster_modify.row.emp_idCard);
        $basic_info.find(".employee_no_begin select").val(emp_roster_modify.row.emp_work_sn_prefix_id);
        $basic_info.find(".employee_no_begin input").val(emp_roster_modify.row.emp_work_sn);

        $basic_info.find(".department_list select").html(sessionStorage.getItem("deptList"));
        $basic_info.find(".department_list select").val(emp_roster_modify.row.department_id);
        $basic_info.find(".position_list select").html(sessionStorage.getItem("postList"));
        $basic_info.find(".position_list select").val(emp_roster_modify.row.position_id);
        $basic_info.find(".work_shift_list select").html(sessionStorage.getItem("workShiftList"));
        $basic_info.find(".work_shift_list select").val(emp_roster_modify.row.work_shift_id);
        $basic_info.find(".work_line_list select").html(sessionStorage.getItem("workLineList"));
        $basic_info.find(".work_line_list select").val(emp_roster_modify.row.work_line_id);

        //是否绑定
        if (emp_roster_modify.row.isBinding) {
            $basic_info.find(".register_account input").attr("disabled", "disabled");
        }
        else {
            $basic_info.find(".register_account input").removeAttr("disabled");
        }

        //个人信息
        $personal_info.find(".emp_sex select").val(emp_roster_modify.row.emp_sex);
        $personal_info.find(".emp_marry select").val(emp_roster_modify.row.emp_marry);
        $personal_info.find(".emp_nation input").val(emp_roster_modify.row.emp_nation);
        $personal_info.find(".emp_register_address input").val(emp_roster_modify.row.emp_register_address);
        $personal_info.find(".emp_contact_phone input").val(emp_roster_modify.row.emp_contact_phone);
        $personal_info.find(".emp_address input").val(emp_roster_modify.row.emp_address);
        $personal_info.find(".emp_urgent_contact input").val(emp_roster_modify.row.emp_urgent_contact);
        $personal_info.find(".emp_urgent_contact_phone input").val(emp_roster_modify.row.emp_urgent_contact_phone);

        $personal_info.find(".bus_address input").val(emp_roster_modify.row.bus_address);
        $personal_info.find(".emp_interview_date input").val(emp_roster_modify.row.emp_interview_date);
        $personal_info.find(".emp_check_in_date input").val(emp_roster_modify.row.emp_check_in_date);
        $personal_info.find(".emp_contract_start_time input").val(emp_roster_modify.row.emp_contract_start_time);
        $personal_info.find(".emp_contract_end_time input").val(emp_roster_modify.row.emp_contract_end_time);
        $personal_info.find(".emp_interview_source input").val(emp_roster_modify.row.emp_interview_source);
        $personal_info.find(".emp_nature input").val(emp_roster_modify.row.emp_nature);
        $personal_info.find(".emp_bank_info input").val(emp_roster_modify.row.emp_bank_info);
        $personal_info.find(".emp_bank_card_no input").val(emp_roster_modify.row.emp_bank_card_no);

        //合同结束时间 是否是无限期
        //如果是无限期
        if (emp_roster_modify.row.emp_contract_end_time_is_permanent) {

            $personal_info.find(".emp_contract_end_time_permanent").addClass("active")
                .find("img").attr("src", "image/Choosed.png");
            //合同结束时间输入框 禁止输入
            $personal_info.find(".emp_contract_end_time input").val("").attr("disabled", "disabled");

        }
        else {

            $personal_info.find(".emp_contract_end_time_permanent").removeClass("active")
                .find("img").attr("src", "image/UnChoose.png");
            $personal_info.find(".emp_contract_end_time input").removeAttr("disabled");

        }

        //其他信息
        if (emp_roster_modify.row.custom_list && emp_roster_modify.row.custom_list.length > 0) {
            $custom_info.show();

            $.each(emp_roster_modify.row.custom_list, function (i, $item) {

                var id = $item.detailsId ? $item.detailsId : "";//
                var name = $item.colName ? $item.colName : "";//
                var val = $item.colValue ? $item.colValue : "";//

                var $custom_item = $("<div>");
                $custom_item.addClass("col-xs-6");
                $custom_item.addClass("custom_item");
                $custom_item.attr("data-id", id);
                $custom_item.appendTo($custom_info.find(".content"));

                var $left = $("<div>");
                $left.addClass("col-xs-3");
                $left.addClass("txt");
                $left.addClass("custom_key");
                $left.text(name);
                $left.appendTo($custom_item);

                //
                var $right = $("<div>");
                $right.addClass("col-xs-9");
                $right.addClass("txt_info");
                $right.addClass("custom_val");
                $right.appendTo($custom_item);

                var $npt = $("<input>");
                $npt.addClass("form-control");
                $npt.attr("maxlength", "32");
                $npt.val(val);
                $npt.appendTo($right);

            });

        }
        else {
            $custom_info.hide();
        }

        //点击 展开详细、隐藏详细
        $personal_info.find(".head .txt").removeClass("show").html("展开详细↓");
        $personal_info.find(".content").hide();
        $personal_info.find(".head .txt").unbind("click").bind("click", function () {

            var $this = $(this);

            if ($this.hasClass("show")) {
                $this.removeClass("show").html("展开详细↓");
                $this.closest(".head").siblings(".content").hide();
            }
            else {
                $this.addClass("show").html("隐藏详细↑");
                $this.closest(".head").siblings(".content").show();
            }

        });

        $custom_info.find(".head .txt").removeClass("show").html("展开详细↓");
        $custom_info.find(".content").hide();
        $custom_info.find(".head .txt").unbind("click").bind("click", function () {

            var $this = $(this);

            if ($this.hasClass("show")) {
                $this.removeClass("show").html("展开详细↓");
                $this.closest(".head").siblings(".content").hide();
            }
            else {
                $this.addClass("show").html("隐藏详细↑");
                $this.closest(".head").siblings(".content").show();
            }

        });

    },
    //初始化 用户的省市区
    initUserAddress: function () {
        var $modal_body = $emp_roster_info_modify_modal.find(".modal-body");

        //赋值 省市区
        getBasicList.ProvinceList(
            urlGroup.basic.province_list,
            function () {

                var province_list = sessionStorage.getItem("province_list");
                $modal_body.find(".province_list").html(province_list);

                //如果 省份id不为空
                if (emp_roster_modify.row.province_id) {
                    $modal_body.find(".province_list").val(emp_roster_modify.row.province_id);

                    getBasicList.CityList(
                        urlGroup.basic.city_list,
                        emp_roster_modify.row.province_id,
                        function () {

                            var city_list = sessionStorage.getItem("city_list");
                            $modal_body.find(".city_list").html(city_list);

                            if (emp_roster_modify.row.city_id) {
                                $modal_body.find(".city_list").val(emp_roster_modify.row.city_id);

                                getBasicList.AreaList(
                                    urlGroup.basic.area_list,
                                    emp_roster_modify.row.city_id,
                                    function () {

                                        var area_list = sessionStorage.getItem("area_list");
                                        $modal_body.find(".area_list").html(area_list);

                                        if (emp_roster_modify.row.area_id) {
                                            $modal_body.find(".area_list").val(emp_roster_modify.row.area_id);
                                        }

                                    },
                                    function (error) {
                                        branError(error);
                                    }
                                );
                            }
                            else {
                                //获取 默认的数值
                                emp_roster_modify.CityChange();
                            }

                        },
                        function (error) {
                            branError(error);
                        }
                    );

                }
                else {
                    //获取 默认的数值
                    emp_roster_modify.ProvinceChange();
                }

            },
            function () {
            }
        );

    },
    //省份改变
    ProvinceChange: function () {
        var $modal_body = $emp_roster_info_modify_modal.find(".modal-body");

        var province_id = $modal_body.find(".province_list").find("option:selected").val();

        getBasicList.CityList(
            urlGroup.basic.city_list,
            province_id,
            function () {

                var city_list = sessionStorage.getItem("city_list");
                $modal_body.find(".city_list").html(city_list);

                emp_roster_modify.CityChange();

            },
            function (error) {
                branError(error);
            }
        );

    },
    //城市改变
    CityChange: function () {
        var $modal_body = $emp_roster_info_modify_modal.find(".modal-body");

        var city_id = $modal_body.find(".city_list").find("option:selected").val();

        getBasicList.AreaList(
            urlGroup.basic.area_list,
            city_id,
            function () {

                var area_list = sessionStorage.getItem("area_list");
                $modal_body.find(".area_list").html(area_list);

            },
            function (error) {
                branError(error);
            }
        );

    },

    //根据 起始工号、分配总数 获取工号
    GetWorkSn: function (worksn_start, SuccessFunc, ErrorFunc) {

        loadingInit();

        var $modal = $emp_roster_info_modify_modal.find(".modal-body");
        //配置工号前缀 参数
        var $work_sn = $modal.find(".employee_no_begin select").find("option:selected");
        var work_sn_prefix_id = $work_sn.val();
        var version = $work_sn.data("version") ? $work_sn.data("version") : "";

        var obj = {
            id: work_sn_prefix_id,
            beginWorkSn: worksn_start,
            version: version,
            empId: emp_roster_modify.row.id,
            count: 1
        };

        branPostRequest(
            urlGroup.employee.roster.work_sn,
            obj,
            function (data) {
                //console.log("获取工号：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    //var id = data.result.id;//工号前缀 id
                    var beginWorkSn = data.result.beginWorkSn ? data.result.beginWorkSn : "0";
                    //var endWorkSn = data.result.endWorkSn ? data.result.endWorkSn : "";
                    var version = data.result.version ? data.result.version : "";

                    $modal.find(".employee_no_begin input").val(beginWorkSn);
                    $work_sn.attr("data-version", version);

                    SuccessFunc();

                }
                else {
                    branError(data.msg);
                    ErrorFunc();
                }

            },
            function (error) {
                branError(error);
                ErrorFunc();
            }
        );

    },
    //工号前缀 发生改变 ，重新获取 工号
    WorkSnChange: function () {

        var $modal = $emp_roster_info_modify_modal.find(".modal-body");
        //该工号前缀内 最后一次未分配的工号后缀
        var beginSn = $modal.find(".employee_no_begin select option:selected").attr("data-lastsn");
        if (!beginSn) beginSn = "";

        emp_roster_modify.GetWorkSn(
            beginSn,
            function () {
                $modal.find(".employee_no_begin").removeClass("isBad");
            },
            function () {
                $modal.find(".employee_no_begin").addClass("isBad");
            }
        );

    },
    //工号发生改变，自动检测工号
    CheckWorkSnIsRight: function () {
        var $modal = $emp_roster_info_modify_modal.find(".modal-body");
        var start = $modal.find(".employee_no_begin input").val();

        emp_roster_modify.GetWorkSn(
            start,
            function () {
                //alert(11)
                $modal.find(".employee_no_begin").removeClass("isBad");
            },
            function () {
                //alert(22)
                $modal.find(".employee_no_begin").addClass("isBad");
            }
        );

    },

    //编辑员工信息 确认修改
    empInfoSaveByModify: function () {

        emp_roster_modify_param.paramSet();//赋值保存参数

        if (!emp_roster_modify.checkParamByEmpModify()) {
            return;
        }

        loadingInit();

        var obj = {
            id: emp_roster_modify.row.id,
            version: emp_roster_modify.row.version,
            registerAccount: emp_roster_modify_param.emp_register_account,
            realName: emp_roster_modify_param.emp_name,
            idCardNo: emp_roster_modify_param.emp_idCard,
            workSnPrefixId: emp_roster_modify_param.emp_work_sn_prefix_id,
            workSn: emp_roster_modify_param.emp_work_sn,
            departmentId: emp_roster_modify_param.department_id,
            positionId: emp_roster_modify_param.position_id,
            workShiftId: emp_roster_modify_param.work_shift_id,
            workLineId: emp_roster_modify_param.work_line_id,

            sex: emp_roster_modify_param.emp_sex,
            marriage: emp_roster_modify_param.emp_marry,
            nation: emp_roster_modify_param.emp_nation,
            idcardAddress: emp_roster_modify_param.emp_register_address,
            telephone: emp_roster_modify_param.emp_contact_phone,
            provinceId: emp_roster_modify_param.province_id,
            cityId: emp_roster_modify_param.city_id,
            countyId: emp_roster_modify_param.area_id,
            address: emp_roster_modify_param.emp_address,
            urgentContact: emp_roster_modify_param.emp_urgent_contact,
            urgentContactPhone: emp_roster_modify_param.emp_urgent_contact_phone,

            busAddress: emp_roster_modify_param.bus_address,
            interviewDate: emp_roster_modify_param.emp_interview_date,
            checkinTime: emp_roster_modify_param.emp_check_in_date,
            startTime: emp_roster_modify_param.emp_contract_start_time,
            endTime: emp_roster_modify_param.emp_contract_end_time,
            isNolimit: emp_roster_modify_param.emp_contract_end_time_is_permanent,
            sourceOfSupply: emp_roster_modify_param.emp_interview_source,
            employeeNature: emp_roster_modify_param.emp_nature,
            bankAccount: emp_roster_modify_param.emp_bank_info,
            bankNum: emp_roster_modify_param.emp_bank_card_no,

            userDefined_details: emp_roster_modify_param.custom_list


        };

        // var $modify_modal_row = $emp_roster_info_modify_modal.find(".modal-body .row");
        // //面试时间
        // var interview_time = $.trim($modify_modal_row.find(".employee_interview_date input").val());
        // if (interview_time)
        //     interview_time = new Date(interview_time).getTime();
        //
        // //自定义 选项
        // var userDefinedCols = [];
        // $emp_roster_info_modify_modal.find(".custom_info > .row").each(function () {
        //     var obj = {};
        //     obj.detailsId = $(this).attr("data-id");
        //     obj.colName = $(this).find(".custom_key").html();
        //     obj.colValue = $(this).find(".custom_val").val();
        //
        //     userDefinedCols.push(obj);
        //
        // });

        // var obj = {
        //
        // };
        // obj.id = roster_employee_info.employeeid;
        // obj.version = roster_employee_info.version;
        // obj.department_id = $modify_modal_row.find(".dept_list option:selected").val();
        // obj.department_name = $modify_modal_row.find(".dept_list option:selected").text();
        // obj.position_id = $modify_modal_row.find(".post_list option:selected").val();
        // obj.position_name = $modify_modal_row.find(".post_list option:selected").text();
        // obj.workline_id = $modify_modal_row.find(".work_line_list option:selected").val();
        // obj.workline_name = $modify_modal_row.find(".work_line_list option:selected").text();
        // obj.workshit_id = $modify_modal_row.find(".work_shift_list option:selected").val();
        // obj.workshit_name = $modify_modal_row.find(".work_shift_list option:selected").text();
        // obj.province_id = $modify_modal_row.find(".province_list option:selected").val();
        // obj.city_id = $modify_modal_row.find(".city_list option:selected").val();
        // obj.area_id = $modify_modal_row.find(".area_list option:selected").val();
        // obj.address = $.trim($modify_modal_row.find(".employee_address input").val());
        // obj.marriage = $modify_modal_row.find(".marry_status option:selected").val();
        // obj.phone_no = $.trim($modify_modal_row.find(".employee_phone input").val());
        // obj.urgent_contact = $.trim($modify_modal_row.find(".employee_urgent_contact input").val());
        // obj.urgent_contact_phone = $.trim($modify_modal_row.find(".employee_urgent_contact_phone input").val());
        //
        // obj.workSnPrefixId = $.trim($modify_modal_row
        //     .find(".employee_no_begin select option:selected").val());//工号前缀(非必填项)
        // obj.workSnPrefixName = $.trim($modify_modal_row
        //     .find(".employee_no_begin select option:selected").text());//工号前缀(非必填项)
        // obj.workSnNum = $.trim($modify_modal_row.find(".employee_no_begin input").val());
        // obj.bank_account = $.trim($modify_modal_row.find(".employee_bank_info input").val());
        // obj.bank_num = $.trim($modify_modal_row.find(".employee_bank_card_no input").val());
        // obj.bus_address = $.trim($modify_modal_row.find(".bus_address input").val());
        // obj.interview_date = interview_time;
        // obj.source_of_supply = $.trim($modify_modal_row.find(".interview_source input").val());
        // obj.employee_nature = $.trim($modify_modal_row.find(".employee_nature input").val());
        // obj.userDefinedCols = userDefinedCols;

        branPostRequest(
            urlGroup.employee.roster.modify,
            obj,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code === RESPONSE_OK_CODE) {
                    toastr.success("保存成功！");
                    $emp_roster_info_modify_modal.modal("hide");

                    emp_roster.empRosterList();//
                }
                else {
                    branError(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    },
    //编辑员工 确认修改 - 检查参数
    checkParamByEmpModify: function () {
        var flag = false;
        var txt = "";

        console.log(emp_roster_modify_param);

        var $modify_modal_row = $emp_roster_info_modify_modal.find(".modal-body .row");

        if (!emp_roster_modify_param.emp_name) {
            txt = "员工姓名不能为空！";
        }
        else if (!phone_reg.test(emp_roster_modify_param.emp_register_account)) {
            txt = "注册账号格式错误！";
        }
        else if (!emp_roster_modify_param.emp_idCard) {
            txt = "员工身份证不能为空！";
        }
        else if (!emp_roster_modify_param.emp_work_sn) {
            txt = "员工工号不能为空！";
            // $modify_modal_row.find(".employee_no_begin input").focus();
        }
        else if ($modify_modal_row.find(".employee_no_begin").hasClass("isBad")) {
            txt = "该工号已存在，请重新输入！";
        }
        else if (!emp_roster_modify_param.department_id) {
            txt = "请选择部门！";
        }
        else if (!emp_roster_modify_param.position_id) {
            txt = "请选择职位！";
        }
        else if (!emp_roster_modify_param.work_shift_id) {
            txt = "请选择班组！";
        }
        else if (!emp_roster_modify_param.work_line_id) {
            txt = "请选择工段！";
        }
        else if (!emp_roster_modify_param.emp_sex) {
            txt = "请选择性别！";
        }
        else if (emp_roster_modify_param.emp_contact_phone &&
            !phone_reg.test(emp_roster_modify_param.emp_contact_phone)) {
            txt = "联系方式格式错误！";
        }
        else if (emp_roster_modify_param.emp_urgent_contact_phone &&
            !phone_reg.test(emp_roster_modify_param.emp_urgent_contact_phone)) {
            txt = "紧急联系人手机号格式错误！";
        }
        else if (!emp_roster_modify_param.emp_check_in_date) {
            txt = "请输入入职时间！";
        }
        else if (emp_roster_modify_param.emp_interview_date &&
            emp_roster_modify_param.emp_interview_date > emp_roster_modify_param.emp_check_in_date) {
            txt = "面试时间不能大于入职时间！";
        }
        else if ((emp_roster_modify_param.emp_contract_start_time && !emp_roster_modify_param.emp_contract_end_time && !emp_roster_modify_param.emp_contract_end_time_is_permanent) ||
            (emp_roster_modify_param.emp_contract_end_time && !emp_roster_modify_param.emp_contract_start_time) ||
            (emp_roster_modify_param.emp_contract_end_time_is_permanent && !emp_roster_modify_param.emp_contract_start_time)) {
            txt = "请输入合同时间！";
        }
        else if (emp_roster_modify_param.emp_contract_start_time && emp_roster_modify_param.emp_contract_end_time &&
            emp_roster_modify_param.emp_contract_start_time > emp_roster_modify_param.emp_contract_end_time) {
            txt = "合同开始时间不能大于结束时间！";
        }
        // else if (!emp_roster_modify_param.emp_nation) {
        //     txt = "请输入民族！";
        // }
        // else if (!emp_roster_modify_param.emp_register_address) {
        //     txt = "请输入户籍地！";
        // }
        // else if (!emp_roster_modify_param.emp_contact_phone) {
        //     txt = "联系方式不能为空！";
        // }
        // else if (!phone_reg.test(emp_roster_modify_param.emp_contact_phone)) {
        //     txt = "联系方式格式错误！";
        // }
        // else if (!emp_roster_modify_param.emp_address) {
        //     txt = "现居地详细地址不能为空！";
        // }
        // else if (!emp_roster_modify_param.emp_urgent_contact) {
        //     txt = "紧急联系人不能为空！";
        // }
        // else if (!emp_roster_modify_param.emp_urgent_contact_phone) {
        //     txt = "紧急联系人手机号不能为空！";
        // }
        // else if (!phone_reg.test(emp_roster_modify_param.emp_urgent_contact_phone)) {
        //     txt = "紧急联系人手机号格式错误！";
        // }
        // else if (!emp_roster_modify_param.bus_address) {
        //     txt = "请输入班车点！";
        // }
        // else if (!emp_roster_modify_param.emp_interview_date) {
        //     txt = "请输入面试时间！";
        // }

        // else if (!emp_roster_modify_param.emp_contract_start_time) {
        //     txt = "请输入合同开始时间！";
        // }
        // else if (!emp_roster_modify_param.emp_contract_end_time) {
        //     txt = "请输入合同结束时间！";
        // }
        // else if (emp_roster_modify_param.emp_interview_date > emp_roster_modify_param.emp_check_in_date) {
        //     txt = "面试时间不能大于入职时间！";
        // }
        // else if (emp_roster_modify_param.emp_interview_date > emp_roster_modify_param.emp_contract_start_time) {
        //     txt = "面试时间不能大于合同开始时间！";
        // }
        // else if (emp_roster_modify_param.emp_contract_start_time > emp_roster_modify_param.emp_contract_end_time) {
        //     txt = "合同开始时间不能大于合同结束时间！";
        // }
        // else if (!emp_roster_modify_param.emp_interview_source) {
        //     txt = "请输入供应来源！";
        // }
        // else if (!emp_roster_modify_param.emp_nature) {
        //     txt = "请输入员工性质！";
        // }
        // else if (!emp_roster_modify_param.emp_bank_info) {
        //     txt = "请输入开户行信息！";
        // }
        // else if (!emp_roster_modify_param.emp_bank_card_no) {
        //     txt = "请输入银行卡号！";
        // }
        else {
            flag = true;
        }

        if (txt) {
            toastr.warning(txt);
        }

        return flag;

    }

};
//花名册 - 员工编辑 参数
var emp_roster_modify_param = {

    emp_register_account: null,         //注册手机
    emp_name: null,                     //员工姓名
    emp_idCard: null,                   //身份证
    emp_work_sn_prefix_id: null,        //工号前缀id
    emp_work_sn: null,                  //工号后缀

    department_id: null,                //部门id
    position_id: null,                  //职位id
    work_shift_id: null,                //班组id
    work_line_id: null,                 //工段id

    emp_sex: null,                      //性别
    emp_marry: null,                    //婚姻状况
    emp_nation: null,                   //民族
    emp_register_address: null,         //户籍地址
    emp_contact_phone: null,            //联系方式
    province_id: null,                  //省份id
    city_id: null,                      //城市id
    area_id: null,                      //地区id
    emp_address: null,                  //详细地址
    emp_urgent_contact: null,           //紧急联系人
    emp_urgent_contact_phone: null,     //紧急联系方式

    bus_address: null,                   //厂车点
    emp_interview_date: null,            //面试日期
    emp_check_in_date: null,             //入职日期
    emp_contract_start_time: null,       //合同开始日期
    emp_contract_end_time: null,         //合同结束日期
    emp_contract_end_time_is_permanent: null,         //合同结束日期 是否是无限期
    emp_interview_source: null,          //来源
    emp_nature: null,                    //性质
    emp_bank_info: null,                 //银行卡信息
    emp_bank_card_no: null,              //银行卡号

    custom_list: null,                  //其他信息（花名册自定义）

    paramSet: function () {

        var $modal_body = $emp_roster_info_modify_modal.find(".modal-body");

        var $basic_info = $modal_body.find(".basic_info");
        var $personal_info = $modal_body.find(".personal_info");
        var $custom_info = $modal_body.find(".custom_info");

        //基本信息
        emp_roster_modify_param.emp_register_account = $basic_info.find(".register_account input").val();
        emp_roster_modify_param.emp_name = $basic_info.find(".emp_name input").val();
        emp_roster_modify_param.emp_idCard = $basic_info.find(".emp_idCard input").val();
        emp_roster_modify_param.emp_work_sn_prefix_id = $basic_info.find(".employee_no_begin select").val();
        emp_roster_modify_param.emp_work_sn = $basic_info.find(".employee_no_begin input").val();

        emp_roster_modify_param.department_id = $basic_info.find(".department_list select").val();
        emp_roster_modify_param.position_id = $basic_info.find(".position_list select").val();
        emp_roster_modify_param.work_shift_id = $basic_info.find(".work_shift_list select").val();
        emp_roster_modify_param.work_line_id = $basic_info.find(".work_line_list select").val();

        //个人信息
        emp_roster_modify_param.emp_sex = $personal_info.find(".emp_sex select").val();
        emp_roster_modify_param.emp_marry = $personal_info.find(".emp_marry select").val();
        emp_roster_modify_param.emp_nation = $personal_info.find(".emp_nation input").val();
        emp_roster_modify_param.emp_register_address = $personal_info.find(".emp_register_address input").val();
        emp_roster_modify_param.emp_contact_phone = $personal_info.find(".emp_contact_phone input").val();
        emp_roster_modify_param.province_id = $personal_info.find(".province_list").val();
        emp_roster_modify_param.city_id = $personal_info.find(".city_list").val();
        emp_roster_modify_param.area_id = $personal_info.find(".area_list").val();
        emp_roster_modify_param.emp_address = $personal_info.find(".emp_address input").val();
        emp_roster_modify_param.emp_urgent_contact = $personal_info.find(".emp_urgent_contact input").val();
        emp_roster_modify_param.emp_urgent_contact_phone = $personal_info.find(".emp_urgent_contact_phone input").val();

        emp_roster_modify_param.bus_address = $personal_info.find(".bus_address input").val();
        emp_roster_modify_param.emp_interview_date = $personal_info.find(".emp_interview_date input").val();
        emp_roster_modify_param.emp_interview_date = emp_roster_modify_param.emp_interview_date ?
            new Date(emp_roster_modify_param.emp_interview_date).getTime() : "";
        emp_roster_modify_param.emp_check_in_date = $personal_info.find(".emp_check_in_date input").val();
        emp_roster_modify_param.emp_check_in_date = emp_roster_modify_param.emp_check_in_date ?
            new Date(emp_roster_modify_param.emp_check_in_date).getTime() : "";
        emp_roster_modify_param.emp_contract_start_time = $personal_info.find(".emp_contract_start_time input").val();
        emp_roster_modify_param.emp_contract_start_time = emp_roster_modify_param.emp_contract_start_time ?
            new Date(emp_roster_modify_param.emp_contract_start_time).getTime() : "";
        emp_roster_modify_param.emp_contract_end_time = $personal_info.find(".emp_contract_end_time input").val();
        emp_roster_modify_param.emp_contract_end_time = emp_roster_modify_param.emp_contract_end_time ?
            new Date(emp_roster_modify_param.emp_contract_end_time).getTime() : "";
        emp_roster_modify_param.emp_contract_end_time_is_permanent =
            $personal_info.find(".emp_contract_end_time_permanent").hasClass("active") ? 1 : 0;
        emp_roster_modify_param.emp_interview_source = $personal_info.find(".emp_interview_source input").val();
        emp_roster_modify_param.emp_nature = $personal_info.find(".emp_nature input").val();
        emp_roster_modify_param.emp_bank_info = $personal_info.find(".emp_bank_info input").val();
        emp_roster_modify_param.emp_bank_card_no = $personal_info.find(".emp_bank_card_no input").val();

        //自定义 选项
        emp_roster_modify_param.custom_list = [];
        $custom_info.find(".content > .custom_item").each(function () {

            var $this = $(this);

            var obj = {
                detailsId: $this.attr("data-id"),
                colName: $this.find(".custom_key").html(),
                colValue: $this.find(".custom_val input").val()
            };

            emp_roster_modify_param.custom_list.push(obj);

        });

    }

};

$(function () {
    emp_roster_import.init();
    emp_roster.init();
    emp_roster_modify.init();
});



