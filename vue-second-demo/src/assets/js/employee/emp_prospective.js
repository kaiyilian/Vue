/**
 * Created by CuiMengxin on 2016/12/12.
 * 待入职员工
 */

var $emp_prospective_container = $(".emp_prospective_container");//员工列表 container
var $emp_import_modal = $(".emp_import_modal");//导入modal
var $emp_add_modal = $(".emp_add_modal");//员工新增modal
var $entry_info_modal = $(".entry_info_modal");//同意入职弹框
var $body = $("body");

//员工导入
var emp_import = {
    ImportFileId: "",//上传文件 id
    ImportFileType: "",//上传文件 类型
    total_num: "0",//总条数
    fail_num: "0",//失败条数
    current_step: "1",//当前 步骤

    init: function () {

        //导入弹框 显示
        $emp_import_modal.on("show.bs.modal", function () {

            $emp_import_modal.find(".modal-title").html("导入本地Excel");

            emp_import.initParams();//初始化 参数
            emp_import.current_step = 1;//第一步
            emp_import.initStep();//初始化 步骤

            var $step_1 = $emp_import_modal.find(".step_1");
            var $step_2 = $emp_import_modal.find(".step_2");

            //初始化 第一步
            $step_1.find(".upload_container .txt").html("上传Excel");

            //初始化 第二步
            //$step_2.find(".emp_import_table tbody").empty();
            //$step_2.find(".prompt").empty();

        });

    },
    //初始化 参数
    initParams: function () {
        emp_import.ImportFileId = "";//文件id为空 初始化
        emp_import.ImportFileType = "";//文件类型为空 初始化
        emp_import.total_num = "";//总条数
        emp_import.fail_num = "";//失败条数
    },
    //初始化 步骤
    initStep: function () {
        var $step = $emp_import_modal.find("ul.step");
        var $step_1 = $emp_import_modal.find(".step_1");
        var $step_2 = $emp_import_modal.find(".step_2");
        var $foot = $emp_import_modal.find(".modal-footer");

        //第一步
        if (emp_import.current_step == 1) {

            $step.find("li").first().addClass("active")
                .siblings().removeClass("active");

            $step_1.show();
            $step_2.hide();

            $foot.find(".btn_next").show().siblings().hide();

        }

        //第二步
        if (emp_import.current_step == 2) {

            $step.find("li").last().addClass("active")
                .siblings().removeClass("active");

            $step_1.hide();
            $step_2.show();

            $foot.find(".btn_next").hide().siblings().show();
        }
    },

    //导入本地Excel 弹框显示
    empImportModalShow: function () {
        $emp_import_modal.modal("show");
    },

    //下载模板
    empImportTemplateDown: function () {

        if ($body.find(".download_excel")) {
            $body.find(".download_excel").remove();
        }

        var form = $("<form>");
        form.addClass("download_excel");
        form.attr("enctype", "multipart/form-data");
        form.attr("action", urlGroup.employee.prospective.download_template);
        form.appendTo($body);
        form.hide();

        form.submit();

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
            emp_import.chooseFile(this);
        });
        input.appendTo(form);

        input.click();

    },
    //选择文件
    chooseFile: function (self) {
        //alert(self.files)
        var $table = $emp_import_modal.find(".step_2").find(".emp_import_table")
            .find("table");


        if (self.files) {
            loadingInit();

            for (var i = 0; i < self.files.length; i++) {
                var file = self.files[i];

                //判断是否是图片格式
                if (/\.(xls|xlsx)$/.test(file.name)) {

                    //上传xls到预览 返回Json
                    $body.find(".upload_excel").ajaxSubmit({
                        url: urlGroup.employee.prospective.excel_import_check,
                        type: 'post',
                        success: function (data) {
                            //console.log("获取日志：");
                            //console.log(data);

                            loadingRemove();//加载中 弹框隐藏

                            if (data.code == 1000) {
                                $emp_import_modal.find(".step_1").find(".upload_container .txt")
                                    .html(file.name);

                                if (data.result) {

                                    var $result = data.result;

                                    emp_import.ImportFileId = $result.file_id ? $result.file_id : "";//
                                    emp_import.ImportFileType = $result.fileTypeStr ? $result.fileTypeStr : "";//
                                    emp_import.total_num = $result.total_count ? $result.total_count : "0";//
                                    emp_import.fail_num = $result.problems_count ? $result.problems_count : "0";//


                                    var employees = data.result.employees;
                                    var list = "";
                                    if (!employees || employees.length == 0) {
                                        list = "<tr><td colspan='8'>导入内容为空</td></tr>";
                                    }
                                    else {

                                        for (var i = 0; i < employees.length; i++) {
                                            var item = employees[i];

                                            var content = "";

                                            //姓名
                                            if (item.employee_name) {
                                                if (item.employee_name.flag == 1) {     //0 正确 1 错误
                                                    content += "<td class='isError'>" +
                                                        "<span>" + item.employee_name.err + "</span>" +
                                                        "</td>";
                                                }
                                                else {
                                                    content += "<td class='isRight'>" +
                                                        "<span>" + item.employee_name.value + "</span>" +
                                                        "</td>";
                                                }
                                            }
                                            else {
                                                content += "<td class='isError'>" +
                                                    "<span>" + "该字段为空" + "</span>" +
                                                    "</td>";
                                            }


                                            //职位
                                            if (item.position_name) {
                                                if (item.position_name.flag == 1) {     //0 正确 1 错误
                                                    content += "<td class='isError'>" +
                                                        "<span>" + item.position_name.err + "</span>" +
                                                        "</td>";
                                                }
                                                else {
                                                    content += "<td class='isRight'>" +
                                                        "<span>" + item.position_name.value + "</span>" +
                                                        "</td>";
                                                }
                                            }
                                            else {
                                                content += "<td class='isError'>" +
                                                    "<span>" + "该字段为空" + "</span>" +
                                                    "</td>";
                                            }

                                            //班组
                                            if (item.work_shift_name) {
                                                if (item.work_shift_name.flag == 1) {     //0 正确 1 错误
                                                    content += "<td class='isError'>" +
                                                        "<span>" + item.work_shift_name.err + "</span>" +
                                                        "</td>";
                                                }
                                                else {
                                                    content += "<td class='isRight'>" +
                                                        "<span>" + item.work_shift_name.value + "</span>" +
                                                        "</td>";
                                                }
                                            }
                                            else {
                                                content += "<td class='isError'>" +
                                                    "<span>" + "该字段为空" + "</span>" +
                                                    "</td>";
                                            }

                                            //工段
                                            if (item.work_line_name) {
                                                if (item.work_line_name.flag == 1) {     //0 正确 1 错误
                                                    content += "<td class='isError'>" +
                                                        "<span>" + item.work_line_name.err + "</span>" +
                                                        "</td>";
                                                }
                                                else {
                                                    content += "<td class='isRight'>" +
                                                        "<span>" + item.work_line_name.value + "</span>" +
                                                        "</td>";
                                                }
                                            }
                                            else {
                                                content += "<td class='isError'>" +
                                                    "<span>" + "该字段为空" + "</span>" +
                                                    "</td>";
                                            }

                                            //部门
                                            if (item.department_name) {
                                                if (item.department_name.flag == 1) {     //0 正确 1 错误
                                                    content += "<td class='isError'>" +
                                                        "<span>" + item.department_name.err + "</span>" +
                                                        "</td>";
                                                }
                                                else {
                                                    content += "<td class='isRight'>" +
                                                        "<span>" + item.department_name.value + "</span>" +
                                                        "</td>";
                                                }
                                            }
                                            else {
                                                content += "<td class='isError'>" +
                                                    "<span>" + "该字段为空" + "</span>" +
                                                    "</td>";
                                            }

                                            //手机
                                            if (item.phone_no) {
                                                if (item.phone_no.flag == 1) {     //0 正确 1 错误
                                                    content += "<td class='isError'>" +
                                                        "<span>" + item.phone_no.err + "</span>" +
                                                        "</td>";
                                                }
                                                else {
                                                    var msg = "";//
                                                    if (item.phone_no.tipMsg) {
                                                        if (item.phone_no.tipMsg != "") {
                                                            msg =
                                                                "<span class='phone_msg'>" +
                                                                item.phone_no.tipMsg +
                                                                "</span>";
                                                        }
                                                    }

                                                    content += "<td class='isRight'>" +
                                                        "<span>" + item.phone_no.value + "</span>" + msg +
                                                        "</td>";
                                                }
                                            }
                                            else {
                                                content += "<td class='isError'>" +
                                                    "<span>" + "该字段为空" + "</span>" +
                                                    "</td>";
                                            }

                                            //入职时间
                                            if (item.check_in_time) {
                                                if (item.check_in_time.flag == 1) {     //0 正确 1 错误
                                                    content += "<td class='isError'>" +
                                                        "<span>" + item.check_in_time.err + "</span>" +
                                                        "</td>";
                                                }
                                                else {
                                                    content += "<td class='isRight'>" +
                                                        "<span>" + item.check_in_time.value + "</span>" +
                                                        "</td>";
                                                }
                                            }
                                            else {
                                                content += "<td class='isError'>" +
                                                    "<span>" + "该字段为空" + "</span>" +
                                                    "</td>";
                                            }

                                            list += "<tr>" +
                                                "<td>" + (i + 1) + "</td>" +
                                                content + "</tr>";

                                        }

                                    }

                                    $table.find("tbody").html(list);
                                    emp_import.importFileInit();////导入的文件 初始化

                                }

                            }
                            else {
                                branError(data.msg);
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
        var $prompt = $emp_import_modal.find(".step_2").find(".prompt");
        var $table = $emp_import_modal.find(".step_2").find(".emp_import_table")
            .find("table");

        //显示 上传数量
        var prompt = "";
        if (emp_import.fail_num) {
            prompt = "本次导入" +
                "<span class='total_count clr_ff6600'>" + emp_import.total_num + "</span>" +
                "条，有" +
                "<span class='error_count clr_ff6600'>" + emp_import.fail_num + "</span>" +
                "条错误，请修改后重新导入！";
        }
        else {
            prompt = "本次导入" +
                "<span class='total_count clr_ff6600'>" + emp_import.total_num + "</span>" +
                "条";
        }
        $prompt.html(prompt);

        $table.find("tbody tr").each(function () {
            $(this).find("td").each(function () {
                if ($(this).hasClass("isError")) {
                    var img = "<img src='image/error_prompt.png'>";
                    $(this).append(img);
                }
            });
        });

    },

    //下一步
    stepNext: function () {
        if (!emp_import.ImportFileId) {
            toastr.warning("请先选择文件！");
            return
        }

        $emp_import_modal.find(".modal-title").html("查看员工信息表");

        emp_import.current_step = 2;//当前步骤 第二步
        emp_import.initStep();//初始化 步骤

    },
    //上一步
    stepPrev: function () {

        $emp_import_modal.find(".modal-title").html("导入本地Excel");

        emp_import.current_step = 1;//当前步骤 第1步
        emp_import.initStep();//初始化 步骤

    },
    //完成 导入excel
    empImportConfirm: function () {

        if (!emp_import.ImportFileId || !emp_import.ImportFileType) {
            toastr.warning("请先选择文件");
            return;
        }

        if ($emp_import_modal.find(".emp_import_table tbody").find(".isError").length > 0) {
            toastr.error("上传文件中有错误，请修改后重新提交");
            return;
        }

        loadingInit();

        var obj = {
            file_id: emp_import.ImportFileId,
            fileTypeStr: emp_import.ImportFileType
        };

        branPostRequest(
            urlGroup.employee.prospective.excel_import_confirm,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {
                    toastr.success("导入成功");
                    $emp_import_modal.modal("hide");
                    emp_import.initParams();//初始化 参数
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

//员工添加
var emp_add = {

    //初始化
    init: function () {

        $emp_add_modal.on("show.bs.modal", function () {

            $emp_add_modal.find(".modal-body table tbody").empty();

        });
    },

    //新增弹框 显示
    empAddModalShow: function () {
        $emp_add_modal.modal("show");
    },

    //新增员工信息 行-显示
    empAddLineShow: function () {
        var $modal_body = $emp_add_modal.find(".modal-body");
        var $tbody = $modal_body.find("table tbody");
        //var $modal_foot = $emp_add_modal.find(".modal-footer");

        //$modal_foot.find(".btn_add").removeAttr("onclick");
        //setTimeout(function () {
        //	$modal_foot.find(".btn_add").click(function () {
        //		//新增员工信息 行-显示
        //		emp_add.empAddLineShow();
        //	});
        //}, 2000);

        if ($tbody.find(".addLine").length > 0 || $tbody.find(".isModify").length > 0) {
            toastr.warning("有员工新增信息正在编辑，请先保存。");
            return
        }

        // //赋值 查询的URL
        // sessionStorage.setItem("get_dept_list", urlGroup.basic.department.prospective);
        // sessionStorage.setItem("get_workLine_list", urlGroup.basic.workLine.prospective);
        // sessionStorage.setItem("get_workShift_list", urlGroup.basic.workShift.prospective);
        // sessionStorage.setItem("get_post_list", urlGroup.basic.position.prospective);

        // getBasicList.getBasicList(
        //     function () {
        //
        //         //检查 部门、职位、班组、工段 列表 信息
        //         if (!getBasicList.checkBasicList()) {
        //             return;
        //         }
        //
        //         //已有的新增员工 no
        //         var itemIndex = $tbody.find(".item").length > 0 ?
        //             ($tbody.find(".item").last().find(".emp_no").html()) : 0;
        //         itemIndex = itemIndex * 1 + 1;
        //
        //         var addLine = "<tr class='addLine'>" +
        //             "<td class='emp_no'>" + itemIndex + "</td>" +
        //             "<td class='emp_name'>" +
        //             "<input type='text' class='form-control' placeholder='请输入姓名' maxlength='6'>" +
        //             "</td>" +
        //             "<td class='emp_phone'>" +
        //             "<input type='text' class='form-control' placeholder='请输入手机号' maxlength='11'>" +
        //             "</td>" +
        //             "<td class='emp_check_in_time'>" +
        //             "<input class='form-control layer-date' id='emp_check_in_time_add' placeholder='YYYY-MM-DD' " +
        //             "</td>" +
        //             "<td class='emp_post'>" +
        //             "<select class='form-control'>" + sessionStorage.getItem("postList") + "</select>" +
        //             "</td>" +
        //             "<td class='emp_workShift'>" +
        //             "<select class='form-control'>" + sessionStorage.getItem("workShiftList") + "</select>" +
        //             "</td>" +
        //             "<td class='emp_workLine'>" +
        //             "<select class='form-control'>" + sessionStorage.getItem("workLineList") + "</select>" +
        //             "</td>" +
        //             "<td class='emp_dept'>" +
        //             "<select class='form-control'>" + sessionStorage.getItem("deptList") + "</select>" +
        //             "</td>" +
        //             "<td class='operate'>" +
        //             "<button class='btn btn-sm btn-success btn_save' " +
        //             "onclick='emp_add.empInfoSaveByNew()'>保存</button>" +
        //             "<button class='btn btn-sm btn-success btn_cancel' " +
        //             "onclick='emp_add.empInfoAddCancel()'>取消</button>" +
        //             "</td>" +
        //             "</tr>";
        //
        //         if ($tbody.find(".addLine").length > 0) {
        //             $tbody.find(".addLine").remove();
        //         }
        //         $tbody.append(addLine);
        //
        //         //初始化 新增的时间
        //         laydate({
        //             elem: "#emp_check_in_time_add",
        //             event: 'focus', //触发事件
        //             format: 'YYYY-MM-DD',
        //             min: "", //设定最小日期为当前日期
        //             max: '', //最大日期
        //             istime: false,//是否开启时间选择
        //             istoday: false, //是否显示今天
        //             choose: function (datas) {
        //
        //             }
        //         });
        //
        //         //初始化 手机号码
        //         $tbody.find(".emp_phone input").keyup(function () {
        //             this.value = this.value.replace(/\D/g, '');
        //         });
        //
        //     },
        //     function (msg) {
        //         branError(msg);
        //     }
        // );

        Promise.all([
            getBasicList.departmentList(urlGroup.basic.department.prospective),
            getBasicList.workLineList(urlGroup.basic.workLine.prospective),
            getBasicList.workShiftList(urlGroup.basic.workShift.prospective),
            getBasicList.positionList(urlGroup.basic.position.prospective)
        ])
            .then(function (res) {

                var department_list = res[0] ? res[0] : "";
                var workLine_list = res[1] ? res[1] : "";
                var workShift_list = res[2] ? res[2] : "";
                var position_list = res[2] ? res[3] : "";

                //检查 部门、职位、班组、工段 列表 信息
                if (!getBasicList.checkBasicList()) {
                    return;
                }

                //已有的新增员工 no
                var itemIndex = $tbody.find(".item").length > 0 ?
                    ($tbody.find(".item").last().find(".emp_no").html()) : 0;
                itemIndex = itemIndex * 1 + 1;

                var addLine = "<tr class='addLine'>" +
                    "<td class='emp_no'>" + itemIndex + "</td>" +
                    "<td class='emp_name'>" +
                    "<input type='text' class='form-control' placeholder='请输入姓名' maxlength='6'>" +
                    "</td>" +
                    "<td class='emp_phone'>" +
                    "<input type='text' class='form-control' placeholder='请输入手机号' maxlength='11'>" +
                    "</td>" +
                    "<td class='emp_check_in_time'>" +
                    "<input class='form-control layer-date' id='emp_check_in_time_add' placeholder='YYYY-MM-DD' " +
                    "</td>" +
                    "<td class='emp_post'>" +
                    "<select class='form-control'>" + department_list + "</select>" +
                    "</td>" +
                    "<td class='emp_workShift'>" +
                    "<select class='form-control'>" + workShift_list + "</select>" +
                    "</td>" +
                    "<td class='emp_workLine'>" +
                    "<select class='form-control'>" + workLine_list + "</select>" +
                    "</td>" +
                    "<td class='emp_dept'>" +
                    "<select class='form-control'>" + position_list + "</select>" +
                    "</td>" +
                    "<td class='operate'>" +
                    "<button class='btn btn-sm btn-success btn_save' " +
                    "onclick='emp_add.empInfoSaveByNew()'>保存</button>" +
                    "<button class='btn btn-sm btn-success btn_cancel' " +
                    "onclick='emp_add.empInfoAddCancel()'>取消</button>" +
                    "</td>" +
                    "</tr>";

                if ($tbody.find(".addLine").length > 0) {
                    $tbody.find(".addLine").remove();
                }
                $tbody.append(addLine);

                //初始化 新增的时间
                laydate({
                    elem: "#emp_check_in_time_add",
                    event: 'focus', //触发事件
                    format: 'YYYY-MM-DD',
                    min: "", //设定最小日期为当前日期
                    max: '', //最大日期
                    istime: false,//是否开启时间选择
                    istoday: false, //是否显示今天
                    choose: function (datas) {

                    }
                });

                //初始化 手机号码
                $tbody.find(".emp_phone input").keyup(function () {
                    this.value = this.value.replace(/\D/g, '');
                });


            })
            .catch(function (err) {

                console.log("error in emp_prospective basic list:");
                console.error(err.message);

            });

    },

    //新增员工信息 保存
    empInfoSaveByNew: function () {

        if (!emp_add.checkParamByAdd()) {
            return;
        }

        var $modal_body = $emp_add_modal.find(".modal-body");
        var $tbody = $modal_body.find("table tbody");

        loadingInit();//加载中 弹框出现

        var $addLine = $tbody.find(".addLine");

        var obj = {};
        obj.employee_id = "";
        obj.name = $.trim($addLine.find(".emp_name input").val());
        obj.position_id = $addLine.find(".emp_post select option:selected").val();
        obj.work_shift_id = $addLine.find(".emp_workShift select option:selected").val();
        obj.work_line_id = $addLine.find(".emp_workLine select option:selected").val();
        obj.department_id = $addLine.find(".emp_dept select option:selected").val();
        obj.phone_no = $.trim($addLine.find(".emp_phone input").val());
        obj.check_in_time = new Date($.trim($addLine.find(".emp_check_in_time input").val())).getTime();

        branPostRequest(
            urlGroup.employee.prospective.add,
            obj,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code == 1000) {
                    toastr.success("新增成功！");

                    var version = data.result.version;//
                    var employee_id = data.result.employee_id;//
                    var msg = data.result.msg;//提示信息
                    if (msg) {
                        msg = "<span class='txt'>" + msg + "</span>";
                    }
                    else {
                        msg = "";
                    }


                    var itemIndex = $tbody.find(".item").length > 0 ?
                        ($tbody.find(".item").last().find(".emp_no").html()) : 0;
                    itemIndex = itemIndex * 1 + 1;

                    //新增员工信息 item
                    var emp_item =
                        "<tr class='item emp_item' data-id='" + employee_id +
                        "' data-version='" + version + "'>" +
                        "<td class='emp_no'>" + itemIndex + "</td>" +
                        "<td class='emp_name'>" + obj.name + "</td>" +
                        "<td class='emp_phone'>" +
                        "<span class='phone_no'>" + obj.phone_no + "</span>" + msg +
                        "</td>" +
                        "<td class='emp_check_in_time'>" +
                        $.trim($addLine.find(".emp_check_in_time input").val()) +
                        "</td>" +
                        "<td class='emp_post' data-postId='" + obj.position_id + "'>" +
                        $addLine.find(".emp_post select option:selected").text() +
                        "</td>" +
                        "<td class='emp_workShift' data-workShiftId='" + obj.work_shift_id + "'>" +
                        $addLine.find(".emp_workShift select option:selected").text() +
                        "</td>" +
                        "<td class='emp_workLine' data-workLineId='" + obj.work_line_id + "'>" +
                        $addLine.find(".emp_workLine select option:selected").text() +
                        "</td>" +
                        "<td class='emp_dept' data-deptId='" + obj.department_id + "'>" +
                        $addLine.find(".emp_dept select option:selected").text() +
                        "</td>" +
                        "<td class='operate'>" +
                        "<button class='btn btn-sm btn-success btn_modify' " +
                        "onclick='emp_add.empInfoModify(this)'>修改</button>" +
                        "<button class='btn btn-sm btn-success btn_del' " +
                        "onclick='emp_add.empInfoDel(this)'>删除</button>" +
                        "</td>" +
                        "</tr>";

                    $addLine.remove();//添加行 移除
                    $tbody.append(emp_item);//新增员工

                }
                else {
                    branError(data.msg)
                }

            },
            function (error) {
                branError(error);
            })
    },
    //新增员工信息时 检查参数
    checkParamByAdd: function () {

        var flag = false;
        var txt = "";//提示信息

        var $modal_body = $emp_add_modal.find(".modal-body");
        var $addLine = $modal_body.find("table tbody").find(".addLine");

        var name = $.trim($addLine.find(".emp_name input").val());
        var phone = $.trim($addLine.find(".emp_phone input").val());
        var check_in_time = $.trim($addLine.find(".emp_check_in_time input").val());

        if (name == "") {
            txt = "姓名不能为空";
        }
        else if (phone == "") {
            txt = "手机号不能为空";
        }
        else if (check_in_time == "") {
            txt = "入职时间不能为空";
        }
        else if (!phone_reg.test(phone)) {
            txt = "手机号输入错误";
        }
        else {
            flag = true;
        }


        if (txt != "") {
            toastr.warning(txt);
        }

        return flag

    },
    //新增员工信息 取消
    empInfoAddCancel: function () {
        var $modal_body = $emp_add_modal.find(".modal-body");
        var $addLine = $modal_body.find("table tbody").find(".addLine");
        $addLine.remove();//添加行 移除
    },

    //新增员工信息 修改
    empInfoModify: function (self) {
        var $item = $(self).closest(".item");//当前行
        var id = $item.attr("data-id");//
        $item.addClass("isModify");
        sessionStorage.setItem("emp_modify_Item_" + id, $item.html());

        var postId = $item.find(".emp_post").attr("data-postid");//当前 职位id
        var workShiftId = $item.find(".emp_workShift").attr("data-workshiftid");//当前 班组id
        var workLineId = $item.find(".emp_workLine").attr("data-worklineid");//当前 工段id
        var deptId = $item.find(".emp_dept").attr("data-deptid");//当前 部门id
        var emp_name = $item.find(".emp_name").html();//姓名
        var emp_phon = $item.find(".emp_phone .phone_no").html();//手机号
        var emp_check_in_time = $item.find(".emp_check_in_time").html();//入职时间


        //可更改区域
        $item.find(".emp_name").html(
            $("<input>").addClass("form-control").val(emp_name).attr("maxlength", "6")
        );
        $item.find(".emp_phone").html(
            $("<input>").addClass("form-control").val(emp_phon).attr("maxlength", 11)
                .keyup(function () {
                    this.value = this.value.replace(/\D/g, '');
                })
        );

        var dateInput = "<input class='form-control layer-date' placeholder='YYYY-MM-DD' " +
            "value='" + emp_check_in_time + "' " +
            "onclick='laydate({istime: true, format: \"YYYY-MM-DD\"})' >";
        $item.find(".emp_check_in_time").html(dateInput);

        $item.find(".emp_post").html(
            $("<select>").addClass("form-control").html(sessionStorage.getItem("postList")).val(postId)
        );
        $item.find(".emp_workShift").html(
            $("<select>").addClass("form-control").html(sessionStorage.getItem("workShiftList")).val(workShiftId)
        );
        $item.find(".emp_workLine").html(
            $("<select>").addClass("form-control").html(sessionStorage.getItem("workLineList")).val(workLineId)
        );
        $item.find(".emp_dept").html(
            $("<select>").addClass("form-control").html(sessionStorage.getItem("deptList")).val(deptId)
        );

        var btnList =
            "<button class='btn btn-sm btn-success btn_save' " +
            "onclick='emp_add.empInfoSaveByModify(this)'>保存</button>" +
            "<button class='btn btn-sm btn-success btn_cancel'" +
            " onclick='emp_add.empInfoModifyCancel(this)'>取消</button>";
        $item.find(".operate").html(btnList);
    },
    //新增员工信息 修改后保存
    empInfoSaveByModify: function (self) {

        if (!emp_add.checkParamByModify(self)) {
            return
        }

        var $item = $(self).closest(".item");

        var obj = {};
        obj.employee_id = $item.attr("data-id");
        obj.version = $item.attr("data-version");
        obj.name = $.trim($item.find(".emp_name input").val());
        obj.position_id = $item.find(".emp_post select option:selected").val();
        obj.work_shift_id = $item.find(".emp_workShift select option:selected").val();
        obj.work_line_id = $item.find(".emp_workLine select option:selected").val();
        obj.department_id = $item.find(".emp_dept select option:selected").val();
        obj.phone_no = $.trim($item.find(".emp_phone input").val());
        obj.check_in_time = new Date($.trim($item.find(".emp_check_in_time input").val())).getTime();

        loadingInit();//加载中 弹框出现

        branPostRequest(
            urlGroup.employee.prospective.update,
            obj,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code == 1000) {
                    toastr.success("修改成功！");
                    $item.removeClass("isModify");

                    //赋值版本信息
                    var version = data.result.version;
                    $item.attr("data-version", version);

                    //如果用户信息 有误，则显示在手机号中
                    var msg = data.result.msg;//提示信息
                    if (msg) {
                        msg = "<span class='txt'>" + msg + "</span>";
                    }
                    else {
                        msg = "";
                    }
                    var phone = "<span class='phone_no'>" + obj.phone_no + "</span>" + msg;


                    $item.find(".emp_name").html(obj.name);
                    $item.find(".emp_phone").html(phone);
                    $item.find(".emp_check_in_time").html(timeInit(obj.check_in_time));

                    $item.find(".emp_post").attr("data-postid", obj.position_id)
                        .html(
                            $item.find(".emp_post select option:selected").text()
                        );
                    $item.find(".emp_workShift").attr("data-workshiftid", obj.work_shift_id)
                        .html(
                            $item.find(".emp_workShift select option:selected").text()
                        );
                    $item.find(".emp_workLine").attr("data-worklineid", obj.work_line_id)
                        .html(
                            $item.find(".emp_workLine select option:selected").text()
                        );
                    $item.find(".emp_dept").attr("data-deptid", obj.department_id)
                        .html(
                            $item.find(".emp_dept select option:selected").text()
                        );

                    var btnList = "<button class='btn btn-sm btn-success btn_modify' " +
                        "onclick='emp_add.empInfoModify(this)'>修改</button>" +
                        "<button class='btn btn-sm btn-success btn_del' " +
                        "onclick='emp_add.empInfoDel(this)'>删除</button>";
                    $item.find(".operate").html(btnList);

                }
                else {
                    branError(data.msg);
                }


            },
            function (error) {
                branError(error);
            }
        )
    },
    //编辑员工信息时 检查参数
    checkParamByModify: function (self) {
        var flag = false;
        var txt = "";//提示信息

        var $item = $(self).closest(".item");
        var name = $.trim($item.find(".emp_name input").val());
        var phone = $.trim($item.find(".emp_phone input").val());
        var check_in_time = $.trim($item.find(".emp_check_in_time input").val());


        if (name == "") {
            txt = "姓名不能为空";
        }
        else if (phone == "") {
            txt = "手机号不能为空";
        }
        else if (check_in_time == "") {
            txt = "入职时间不能为空";
        }
        else if (!phone_reg.test(phone)) {
            txt = "手机号输入错误";
        }
        else {
            flag = true;
        }

        if (txt != "") {
            toastr.warning(txt);
        }

        return flag
    },
    //新增员工信息 修改后 取消修改操作
    empInfoModifyCancel: function (self) {
        var $item = $(self).closest(".item");//当前行
        var id = $item.attr("data-id");//
        $item.removeClass("isModify");
        $item.html(sessionStorage.getItem("emp_modify_Item_" + id));
    },

    //新增员工信息 删除
    empInfoDel: function (self) {

        delWarning("确认删除该员工吗？", function () {

            var $item = $(self).closest(".item");
            var id = $item.attr("data-id").toString();//员工id
            var version = $item.attr("data-version");

            var array = {};
            array[id] = version;

            var obj = {};
            obj.employee_id = array;

            loadingInit();

            branPostRequest(
                urlGroup.employee.prospective.del,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code == 1000) {
                        toastr.success("删除成功！");
                        $item.remove();//移除该项
                    }
                    else {
                        branError(data.msg);
                    }

                },
                function (error) {
                    branError(error);
                })

        });

    }

};

//待入职员工 列表
var emp_prospective = {
    containerName: "",
    totalPage: 0,//一共 的页数
    currentPage: 1,//当前页
    DelArray: {},//删除 用户id数组
    AgreeArray: [],//同意入职 用户id数组
    OnlyOrMore: "",//判断是 单个用户 或 多个用户 入职
    order: "",  //排序id 1 正序 2 倒序
    orderParam: "", //排序参数

    //初始化
    init: function () {

        emp_prospective.initParam();//初始化 参数
        emp_prospective.initTime();//初始化 时间

        Promise.all([
            getBasicList.departmentList(urlGroup.basic.department.prospective),
            getBasicList.workLineList(urlGroup.basic.workLine.prospective),
            getBasicList.workShiftList(urlGroup.basic.workShift.prospective),
            getBasicList.positionList(urlGroup.basic.position.prospective)
        ])
            .then(function (res) {

                // console.info("部门：");
                // console.log(sessionStorage.getItem("deptList"));
                // console.info("工段：");
                // console.log(sessionStorage.getItem("workLineList"));
                // console.info("班组：");
                // console.log(sessionStorage.getItem("workShiftList"));
                // console.info("职位：");
                // console.log(sessionStorage.getItem("postList"));
                // console.log(res);

                var department_list = res[0] ? res[0] : "";
                var workLine_list = res[1] ? res[1] : "";
                var workShift_list = res[2] ? res[2] : "";
                var position_list = res[2] ? res[3] : "";

                var $search_container = $emp_prospective_container.find(".search_container");

                //alert(1)
                var deptList = "<option value=''>选择</option>" + department_list;
                $search_container.find(".dept_container select").html(deptList);

                var workLineList = "<option value=''>选择</option>" + workLine_list;
                $search_container.find(".workLine_container select").html(workLineList);

                var workShiftList = "<option value=''>选择</option>" + workShift_list;
                $search_container.find(".workShift_container select").html(workShiftList);

                var postList = "<option value=''>选择</option>" + position_list;
                $search_container.find(".post_container select").html(postList);

                emp_prospective.getEmployee();//查询 满足条件的员工


            })
            .catch(function (err) {

                console.log("error in emp_prospective basic list:");
                console.error(err.message);

            });

    },
    //初始化 参数
    initParam: function () {
        emp_prospective.containerName = ".emp_prospective_container";

        emp_prospective.order = "";//
        emp_prospective.orderParam = "";//
        emp_prospective.DelArray = {};//
        emp_prospective.AgreeArray = [];//
    },
    //初始化 时间
    initTime: function () {

        var start = {
            elem: "#prospective_beginTime",
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

        var end = {
            elem: "#prospective_endTime",
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

    //查询按钮 点击事件
    btnSearchClick: function () {
        emp_prospective.currentPage = 1;
        //alert(url)
        emp_prospective.getEmployee();//查询 满足条件的员工
    },
    //清空 员工列表
    clearEmployeeList: function () {

        var $tbody = $emp_prospective_container.find("table tbody");
        var msg = "<tr><td colspan='13'>查询结果为空</td></tr>";

        $tbody.html(msg);

    },
    //查询 满足条件的员工
    getEmployee: function () {

        emp_prospective.clearEmployeeList();//清空 员工列表

        var $search_container = $emp_prospective_container.find(".search_container");
        //开始时间
        var startTime = $.trim($search_container.find(".beginTime").val());
        startTime = startTime == "" ? "" : new Date(startTime).getTime();
        //结束时间
        var endTime = $.trim($search_container.find(".endTime").val());
        endTime = endTime == "" ? "" : new Date(endTime).getTime();
        if (startTime != "" && endTime != "" && startTime > endTime) {
            toastr.warning("开始时间不能大于结束时间！");
            return;
        }

        var obj = {};
        obj.position_id = $search_container.find(".post_container select option:selected").val();
        obj.work_shift_id = $search_container.find(".workShift_container select option:selected").val();
        obj.work_line_id = $search_container.find(".workLine_container select option:selected").val();
        obj.department_id = $search_container.find(".dept_container select option:selected").val();
        obj.check_in_start_time = startTime;
        obj.check_in_end_time = endTime;
        obj.keyword = $.trim($search_container.find(".searchCondition").val());
        obj.page = emp_prospective.currentPage;
        obj.page_size = "10";
        obj.order = emp_prospective.order;//1正序，2倒序
        obj.order_param = emp_prospective.orderParam;//排序参数
        var url = urlGroup.employee.prospective.list + "?" + jsonParseParam(obj);

        loadingInit();

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code === RESPONSE_OK_CODE) {
                    emp_prospective.totalPage = data.result.pages ? data.result.pages : 0;//总页数
                    //如果当前页 大于 总页数
                    if (emp_prospective.currentPage > emp_prospective.totalPage) {
                        emp_prospective.currentPage -= 1;
                        emp_prospective.getEmployee();
                        return
                    }

                    var list = "";//员工列表
                    var arr = data.result.employees;
                    if (!arr || arr.length === 0) {
                    }
                    else {
                        for (var i = 0; i < arr.length; i++) {
                            var item = arr[i];

                            var emp_ver = item.version;//员工版本
                            var emp_id = item.employee_id;//员工id
                            var emp_name = item.name;//员工姓名
                            var post_id = item.position_id;//职位id
                            var post_name = item.position_name;//职位名称
                            var workShift_id = item.work_shift_id;//班组id
                            var workShift_name = item.work_shift_name;//班组名称
                            var workLine_id = item.work_line_id;//工段id
                            var workLine_name = item.work_line_name;//工段名称
                            var dept_id = item.department_id;//部门id
                            var dept_name = item.department_name;//部门名称
                            var emp_phone = item.phone_no;//手机号码
                            var check_in_time = item.check_in_time;//入职时间
                            check_in_time = timeInit(check_in_time);
                            var exam_id = item.exam_id;//体检id
                            var is_complete = item.is_profile_complete ? item.is_profile_complete : 0;//资料是否完成 0未完成，1已完成
                            var is_offer_accept = item.is_offer_accept ? item.is_offer_accept : 0;//资料是否可以查看 1 可查 0 不可查
                            var profile_progress = item.profile_progress ? item.profile_progress : "0%";//资料进度
                            var source = item.source ? item.source : "";//来源
                            var remark = item.face_match ? item.face_match : "";//备注信息

                            //体检信息
                            var physical_examination_td = "<td class='physical_examination'></td>";
                            if (exam_id) {
                                physical_examination_td = "<td class='physical_examination' " +
                                    "data-id='" + exam_id + "' " +
                                    "onclick='emp_prospective.getEmpPhysicalExamDetail(this)'>" +
                                    "<div class='txt clr_ff6600'>已提交</div>" +
                                    "</td>"
                            }

                            //备注信息
                            if (remark) {
                                switch (remark) {
                                    case 1:
                                        remark = "<div class='remark_info'>匹配度较低</div>";
                                        break;
                                    default:
                                        remark = "<div class='remark_info'>无匹配信息</div>";
                                        break;
                                }
                            }

                            list += "<tr class='item emp_item' " +
                                "data-id='" + emp_id + "' " +
                                "data-version='" + emp_ver + "' " +
                                ">" +
                                "<td class='choose_item' onclick='emp_prospective.chooseItem(this)'>" +
                                "<img src='image/UnChoose.png'/>" +
                                "</td>" +
                                "<td class='emp_name'>" + emp_name + "</td>" +
                                "<td class='emp_phone'>" + emp_phone + "</td>" +
                                "<td class='emp_check_in_time'>" + check_in_time + "</td>" +
                                "<td class='emp_post' data-postId='" + post_id + "'>" + post_name + "</td>" +
                                "<td class='emp_workShift' data-workShiftId='" + workShift_id + "'>" +
                                workShift_name +
                                "</td>" +
                                "<td class='emp_workLine' data-workLineId='" + workLine_id + "'>" +
                                workLine_name +
                                "</td>" +
                                "<td class='emp_dept' data-deptId='" + dept_id + "'>" + dept_name + "</td>" +
                                "<td class='emp_info_complete_degree' data-is_see='" + is_offer_accept + "'>" +
                                profile_progress +
                                "</td>" +
                                // "<td class='source'>" + source + "</td>" +
                                "<td class='remark'>" + remark + "</td>" +
                                physical_examination_td +
                                "<td class='operate emp_operate' data-is_complete='" + is_complete + "'>" +
                                "<span class='btn btn-sm btn-success btn_modify' onclick='emp_prospective.empInfoModify(this)'>修改</span>" +
                                "<span class='btn btn-sm btn-success btn_del' onclick='emp_prospective.empDelOnly(this)'>删除</span>" +
                                "<span class='btn btn-sm btn-default btn_agree' onclick='emp_prospective.entryOnly(this)'>同意入职</span>" +
                                "</td>" +
                                "</tr>"

                        }

                        $emp_prospective_container.find("table tbody").html(list);
                    }

                    emp_prospective.empListInit();//待入职员工列表 初始化
                }
                else {
                    branError(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        )
    },
    //待入职员工列表 初始化
    empListInit: function () {
        var $table = $emp_prospective_container.find(".table_container table");
        var $item = $table.find("tbody .item");
        var $page_container = $emp_prospective_container.find('.pager_container');

        if ($item.length <= 0) {
            $page_container.hide();
        }
        else {
            $item.each(function () {

                //是否可查员工信息 1 可查 0 不可查
                var is_see = $(this).find(".emp_info_complete_degree").attr("data-is_see");
                if (is_see == 0) {	//不可查
                    $(this).find(".emp_info_complete_degree").addClass("clr_ff6600")
                        .removeAttr("onclick");
                }
                else {

                    $(this).find(".emp_info_complete_degree").addClass("clr_1c84c6")
                        .click(function () {
                            emp_prospective.getEmpDetailPage(this);
                        });

                }

                //是否可以同意入职 0未完成，1已完成
                var is_complete = $(this).find(".emp_operate").attr("data-is_complete");
                if (is_complete == 1) {		//可以入职
                    $(this).find(".emp_operate .btn_agree").addClass("btn-success")
                        .removeClass("btn-default");
                }


            });

            var options = {
                bootstrapMajorVersion: 3, //版本  3是ul  2 是div
                //containerClass:"sdfsaf",
                //size: "small",//大小
                alignment: "left",//对齐方式
                currentPage: emp_prospective.currentPage, //当前页数
                totalPages: emp_prospective.totalPage, //总页数
                numberOfPages: 5,//每页显示的 页数
                useBootstrapTooltip: true,//是否使用 bootstrap 自带的提示框
                itemContainerClass: function (type, page, currentpage) {  //每项的类名
                    //alert(type + "  " + page + "  " + currentpage)
                    var classname = "p_item ";

                    switch (type) {
                        case "first":
                            classname += "p_first";
                            break;
                        case "last":
                            classname += "p_last";
                            break;
                        case "prev":
                            classname += "p_prev";
                            break;
                        case "next":
                            classname += "p_next";
                            break;
                        case "page":
                            classname += "p_page";
                            break;
                    }

                    if (page == currentpage) {
                        classname += " active "
                    }

                    return classname;
                },
                itemTexts: function (type, page, current) {  //
                    switch (type) {
                        case "first":
                            return "首页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        case "last":
                            return "末页";
                        case "page":
                            return page;
                    }
                },
                tooltipTitles: function (type, page, current) {
                    switch (type) {
                        case "first":
                            return "去首页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        case "last":
                            return "去末页";
                        case "page":
                            return page === current ? "当前页数 " + page : "前往第 " + page + " 页"
                    }
                },
                onPageClicked: function (event, originalEvent, type, page) { //点击事件
                    //alert(page)

                    var currentTarget = $(event.currentTarget);

                    emp_prospective.currentPage = page;
                    emp_prospective.getEmployee();//查询按钮 点击事件
                    //switch (type) {
                    //    case "first": currentTarget.bootstrapPaginator("show",1); break;
                    //    case "prev": currentTarget.bootstrapPaginator("showPrevious"); break;
                    //    case "next": currentTarget.bootstrapPaginator("showNext"); break;
                    //    case "last": currentTarget.bootstrapPaginator("showLast"); break;
                    //    case "page": currentTarget.bootstrapPaginator("show", page)
                    //}

                }

            };

            var ul = '<ul class="pagenation" style="float:right;"></ul>';
            $page_container.show();
            $page_container.html(ul);
            $page_container.find(".pagenation").bootstrapPaginator(options);
        }

        //是否 已经全部选择
        optChoose.isChooseAll(
            emp_prospective.containerName,
            function () {
                emp_prospective.checkIsChoose();//检查 是否选中
            }
        );

    },

    //选中当前行
    chooseItem: function (self) {

        optChoose.chooseItem(
            self,
            emp_prospective.containerName,
            function () {
                emp_prospective.checkIsChoose();//检查 是否选中
            }
        );

    },
    //选择全部
    chooseAll: function () {

        optChoose.chooseAll(
            emp_prospective.containerName,
            function () {
                emp_prospective.checkIsChoose();//检查 是否选中
            }
        );

    },
    //检查 是否选中
    checkIsChoose: function () {
        var $item_active = $emp_prospective_container.find(".table_container table tbody")
            .find(".item.active");
        var $btn_agree = $emp_prospective_container.find(".foot .btn_list").find(".btn_agree");
        var $btn_del = $emp_prospective_container.find(".foot .btn_list").find(".btn_del");

        if ($item_active.length > 0) {
            $btn_del.addClass("btn-success").removeClass("btn-default");
            $btn_agree.addClass("btn-success").removeClass("btn-default");
        }
        else {
            $btn_del.addClass("btn-default").removeClass("btn-success");
            $btn_agree.addClass("btn-default").removeClass("btn-success");
        }
    },

    //编辑 当前行
    empInfoModify: function (self) {
        if (!getBasicList.checkBasicList()) {
            return
        }

        var $item = $(self).closest(".item");//当前行
        $item.addClass("isModify");

        var id = $item.attr("data-id");//当前员工ID
        sessionStorage.setItem("emp_modify_Item_" + id, $item.html());

        var postId = $item.find(".emp_post").attr("data-postid");//当前 职位id
        var workShiftId = $item.find(".emp_workShift").attr("data-workshiftid");//当前 班组id
        var workLineId = $item.find(".emp_workLine").attr("data-worklineid");//当前 工段id
        var deptId = $item.find(".emp_dept").attr("data-deptid");//当前 部门id
        var emp_name = $item.find(".emp_name").html();//姓名
        var emp_phone = $item.find(".emp_phone").html();//手机号
        var emp_check_in_time = $item.find(".emp_check_in_time").html();//入职时间


        //可更改区域
        $item.find(".emp_name").html(
            $("<input>").addClass("form-control").val(emp_name).attr("maxlength", "6")
        );
        $item.find(".emp_phone").html(
            $("<input>").addClass("form-control").val(emp_phone).attr("maxlength", 11)
        );
        var dateInput = "<input class='form-control layer-date' placeholder='YYYY-MM-DD' " +
            "value='" + emp_check_in_time + "' " +
            "onclick='laydate({istime: true, format: \"YYYY-MM-DD\"})' >";
        $item.find(".emp_check_in_time").html(dateInput);
        $item.find(".emp_post").html(
            $("<select>").addClass("form-control").html(sessionStorage.getItem("postList")).val(postId)
        );
        $item.find(".emp_workShift").html(
            $("<select>").addClass("form-control").html(sessionStorage.getItem("workShiftList")).val(workShiftId)
        );
        $item.find(".emp_workLine").html(
            $("<select>").addClass("form-control").html(sessionStorage.getItem("workLineList")).val(workLineId)
        );
        $item.find(".emp_dept").html(
            $("<select>").addClass("form-control").html(sessionStorage.getItem("deptList")).val(deptId)
        );

        var btnList = "<button class='btn btn-sm btn-success btn_save'" +
            " onclick='emp_prospective.empInfoSaveByModify(this)'>保存</button>" +
            "<button class='btn btn-sm btn-success btn_cancel'" +
            " onclick='emp_prospective.empInfoCancel(this)'>取消</button>";

        $item.find(".emp_operate").html(btnList);
    },
    //保存 当前行
    empInfoSaveByModify: function (self) {

        if (!emp_prospective.checkParamByModify(self)) {
            return
        }

        var $item = $(self).closest(".item");
        var obj = {};
        obj.version = $item.attr("data-version");
        obj.employee_id = $item.attr("data-id");
        obj.name = $.trim($item.find(".emp_name input").val());
        obj.position_id = $item.find(".emp_post select option:selected").val();
        obj.work_shift_id = $item.find(".emp_workShift select option:selected").val();
        obj.work_line_id = $item.find(".emp_workLine select option:selected").val();
        obj.department_id = $item.find(".emp_dept select option:selected").val();
        obj.phone_no = $.trim($item.find(".emp_phone input").val());
        obj.check_in_time = new Date($.trim($item.find(".emp_check_in_time input").val())).getTime();

        loadingInit();

        branPostRequest(
            urlGroup.employee.prospective.update,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {
                    toastr.success("保存成功");
                    $item.removeClass("isModify");

                    var version = data.result.version;
                    $item.attr("data-version", version);

                    $item.find(".emp_name").html(obj.name);
                    $item.find(".emp_phone").html(obj.phone_no);
                    $item.find(".emp_check_in_time").html(timeInit(obj.check_in_time));

                    $item.find(".emp_post").attr("data-postid", obj.position_id)
                        .html(
                            $item.find(".emp_post select option:selected").text()
                        );
                    $item.find(".emp_workShift").attr("data-workshiftid", obj.work_shift_id)
                        .html(
                            $item.find(".emp_workShift select option:selected").text()
                        );
                    $item.find(".emp_workLine").attr("data-worklineid", obj.work_line_id)
                        .html(
                            $item.find(".emp_workLine select option:selected").text()
                        );
                    $item.find(".emp_dept").attr("data-deptid", obj.department_id)
                        .html(
                            $item.find(".emp_dept select option:selected").text()
                        );

                    var btnList = "<button class='btn btn-sm btn-success btn_modify' onclick='emp_prospective.empInfoModify(this)'>修改</>" +
                        "<button class='btn btn-sm btn-success btn_del' onclick='emp_prospective.empDelOnly(this)'>删除</button>" +
                        "<button class='btn btn-sm btn-default btn_agree' onclick='emp_prospective.entryOnly(this)'>同意入职</button>";

                    $item.find(".emp_operate").html(btnList);

                    emp_prospective.empListInit();//待入职员工列表 初始化

                }
                else {
                    branError(data.msg);
                }


            },
            function (error) {
                branError(error);
            }
        )

    },
    //编辑后 检查参数
    checkParamByModify: function (self) {
        var flag = false;
        var txt = "";//提示信息

        var $item = $(self).closest(".item");
        var name = $.trim($item.find(".emp_name input").val());
        var check_in_time = $.trim($item.find(".emp_check_in_time input").val());
        var phone = $.trim($item.find(".emp_phone input").val());

        if (name == "") {
            txt = "姓名不能为空";
        }
        else if (phone == "") {
            txt = "手机号不能为空";
        }
        else if (!phone_reg.test(phone)) {
            txt = "手机号输入错误";
        }
        else if (check_in_time == "") {
            txt = "入职时间不能为空";
        }
        else {
            flag = true;
        }

        if (txt != "") {
            toastr.warning(txt);
        }

        return flag;
    },
    //取消编辑 当前行
    empInfoCancel: function (self) {
        var $item = $(self).closest(".item");//当前行
        var id = $item.attr("data-id");//当前员工ID
        $item.removeClass("isModify");
        $item.html(sessionStorage.getItem("emp_modify_Item_" + id));
    },

    //删除 单个用户
    empDelOnly: function (self) {
        emp_prospective.DelArray = {};

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id").toString();//员工id
        var version = $item.attr("data-version");

        //var obj = {
        //	"id": id,
        //	"version": version
        //};
        //var obj = {};
        emp_prospective.DelArray[id] = version;
        //emp_prospective.DelArray.push(obj);

        emp_prospective.empInfoDel();//删除 用户
    },
    //删除 多个用户
    empDelMore: function () {
        emp_prospective.DelArray = {};//初始化
        var $item_active = $emp_prospective_container.find(".table_container table tbody")
            .find(".item.active");

        if ($item_active.length == 0) {
            toastr.warning("您没有选择用户");
            return
        }

        $item_active.each(function () {

            var id = $(this).attr("data-id");
            var version = $(this).attr("data-version");

            //var obj = {
            //	"id": id,
            //	"version": version
            //};
            var obj = {};
            emp_prospective.DelArray[id] = version;
            //emp_prospective.DelArray.push(obj);

        });

        emp_prospective.empInfoDel();//删除 用户
    },
    //删除 确认
    empInfoDel: function () {

        delWarning("确认删除选中的员工吗？", function () {

            loadingInit();

            var obj = {};
            obj.employee_id = emp_prospective.DelArray;

            branPostRequest(
                urlGroup.employee.prospective.del,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code == 1000) {
                        toastr.success("删除成功！");
                        emp_prospective.getEmployee();
                    }
                    else {
                        branError(data.msg);
                    }

                },
                function (error) {
                    branError(error);
                }
            )

        })

    },

    //同意入职 (单个员工)
    entryOnly: function (self) {

        entry_info.AgreeArray = [];
        var $item = $(self).closest(".item");

        //是否可以同意入职 0未完成，1已完成
        var is_complete = $item.find(".emp_operate").attr("data-is_complete");
        if (is_complete == 0) {  //未完成 不能同意入职
            toastr.warning("该员工暂时无法入职，请选择其他员工！");
            return;
        }

        var id = $item.data("id");
        var version = $item.attr("data-version");
        var name = $item.find(".emp_name").html();

        var obj = {
            "id": id,
            "version": version,
            "name": name
        };

        entry_info.AgreeArray.push(obj);

        var entryDate = $item.find(".emp_check_in_time").html();//员工入职时间

        //检查 入职时间是否是当天
        entry_info.checkIsToday(entryDate, function () {
            emp_prospective.entryModalShow();//同意入职 弹框显示
        });

    },
    //同意入职 (多个员工)
    entryMore: function () {
        entry_info.AgreeArray = [];//初始化

        var $item = $emp_prospective_container.find(".table_container")
            .find("table tbody").find(".item.active");

        if ($item.length == 0) {
            toastr.warning("您没有选择用户");
            return
        }
        else {

            var flag = true;
            for (var i = 0; i < $item.length; i++) {
                var is_complete = $item.eq(i).find(".operate").attr("data-is_complete");
                //0 未完成 - 无法入职
                if (is_complete == 0) {
                    flag = false;
                    break;
                }
            }

            if (!flag) {
                toastr.warning("有部分员工无法入职，请重新检查");
                return
            }

        }


        $item.each(function () {
            var id = $(this).attr("data-id");
            var version = $(this).attr("data-version");
            var name = $(this).find(".emp_name").html();

            var obj = {
                "id": id,
                "version": version,
                "name": name
            };

            entry_info.AgreeArray.push(obj);
        });

        var entryDate = $item.first().find(".emp_check_in_time").html();//员工入职时间

        //检查 入职时间是否是当天
        entry_info.checkIsToday(entryDate, function () {
            emp_prospective.entryModalShow();//同意入职 弹框显示
        });

    },
    //同意入职 弹框显示
    entryModalShow: function () {

        $entry_info_modal.modal("show");

        //同意入职 弹框出现后执行方法
        entry_info.init();//初始化方法

        var $btn = $("<div>");
        $btn.addClass("btn");
        $btn.addClass("btn-orange");
        $btn.addClass("btn_agree");
        $btn.html("确定");
        $btn.attr("onclick", "emp_prospective.entryAgree()");

        $entry_info_modal.find(".modal-footer").html($btn);


    },
    //同意入职 确认
    entryAgree: function () {

        $entry_info_modal.find(".btn_agree").removeAttr("onclick");
        setTimeout(function () {
            $entry_info_modal.find(".btn_agree").attr("onclick", "emp_prospective.entryAgree()");
        }, 2000);

        entry_info.entryAgree(
            function () {
                emp_prospective.getEmployee();//获取员工列表
            },
            function () {

            }
        );

    },

    //待入职员工 导出
    exportEmpList: function () {
        var $search_container = $emp_prospective_container.find(".search_container");
        var $table = $emp_prospective_container.find(".table_container table");
        var $item = $table.find("tbody").find(".item");

        if ($item.length == 0) {
            toastr.warning("没有数据，无法导出");
            return
        }

        exportModalShow("确定要导出待入职员工吗？", function () {

            loadingInit();

            //开始时间
            var startTime = $.trim($search_container.find(".beginTime").val());
            startTime = startTime == "" ? "" : new Date(startTime).getTime();
            //结束时间
            var endTime = $.trim($search_container.find(".endTime").val());
            endTime = endTime == "" ? "" : new Date(endTime).getTime();
            if (startTime && endTime && startTime > endTime) {
                toastr.warning("开始时间不能大于结束时间！");
                return;
            }

            var position_id = $search_container.find(".post_container select option:selected").val();
            var work_shift_id = $search_container.find(".workShift_container select option:selected").val();
            var work_line_id = $search_container.find(".workLine_container select option:selected").val();
            var department_id = $search_container.find(".dept_container select option:selected").val();
            var check_in_start_time = startTime;
            var check_in_end_time = endTime;
            var keyword = $search_container.find(".searchCondition").val();

            if ($body.find(".export_excel").length > 0) {
                $body.find(".export_excel").remove();
            }

            var form = $("<form>");
            form.addClass("export_excel");
            form.attr("enctype", "multipart/form-data");
            form.attr("action", urlGroup.employee.prospective.excel_export);
            form.attr("method", "get");
            form.appendTo($body);
            form.hide();

            form.append($("<input>").attr("name", "position_id").attr("value", position_id));
            form.append($("<input>").attr("name", "work_shift_id").attr("value", work_shift_id));
            form.append($("<input>").attr("name", "work_line_id").attr("value", work_line_id));
            form.append($("<input>").attr("name", "department_id").attr("value", department_id));
            form.append($("<input>").attr("name", "check_in_start_time").attr("value", check_in_start_time));
            form.append($("<input>").attr("name", "check_in_end_time").attr("value", check_in_end_time));
            form.append($("<input>").attr("name", "keyword").attr("value", keyword));

            loadingRemove();
            form.submit();

        });
    },

    //查询员工体检详情
    getEmpPhysicalExamDetail: function (self) {
        var exam_id = $(self).attr("data-id");
        if (!exam_id) {
            return;
        }

        var tabId = "emp_exam_" + exam_id;//tab中的id
        var pageName = $(self).closest(".item").find(".emp_name").html() + "的体检信息";

        sessionStorage.setItem("currentTabID", tabId);//当前 tab id
        sessionStorage.setItem("CurrentPhyExamId", exam_id);//当前体检id

        getInsidePageDiv(urlGroup.employee.physical_exam.index, tabId, pageName);
    },

    //查看 待入职员工 详情
    getEmpDetailPage: function (self) {
        var $item = $(self).closest(".item");

        var entryDate = $item.find(".emp_check_in_time").html();
        var id = $item.attr("data-id");
        var tabId = "emp_prospective_" + id;//tab中的id
        var pageName = $item.find(".emp_name").html() + "的个人资料";

        sessionStorage.setItem("entryDate", entryDate);//该员工入职时间
        sessionStorage.setItem("CurrentEmployeeId", id);//当前员工id
        sessionStorage.setItem("currentTabID", tabId);//当前 tab id

        getInsidePageDiv(urlGroup.employee.prospective_detail.index, tabId, pageName);
    }

};

//查询参数
var emp_prospective_query_param = {

    dept_id: "",//
    workLine_id: "",//工段
    workShift_id: "",//班组 id
    post_id: "",//
    entry_start_time: "",//
    entry_end_time: "",//
    key_word: ""

};

$(function () {
    emp_add.init();
    emp_import.init();//
    emp_prospective.init();
});