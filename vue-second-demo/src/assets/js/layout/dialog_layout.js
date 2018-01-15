/**
 * Created by CuiMengxin on 2016/10/12.
 */

var $entry_info_modal = $(".entry_info_modal");//同意入职弹框

var entry_info = {

    AgreeArray: [],//同意入职员工列表

    //初始化方法
    init: function () {
        //alert(1);
        entry_info.initTime();//初始化 同意入职弹框内 时间格式
        entry_info.initWorkSnList();//初始化 同意入职弹框内 起始工号列表
        entry_info.initChooseEndDate();//初始化 选择结束日期
        entry_info.initProbationDate();//初始化 试用期
        entry_info.initCustomInfo();//初始化 自定义选项

        $entry_info_modal.find(".interview_source").val("");//供应来源
        $entry_info_modal.find(".employee_nature").val("");//员工性质

    },
    //初始化 同意入职弹框内 时间格式
    initTime: function () {
        var $row = $entry_info_modal.find(".modal-body .row");

        //开始时间 click
        $row.find(".entry_info_begin_time").html("").attr("data-time", "");
        $row.find(".entry_info_begin_time").click(function () {
            chooseBeginTime();
        });
        $row.find(".icon_begin").click(function () {
            chooseBeginTime();
        });

        //结束时间 click
        $row.find(".entry_info_end_time").html("").attr("data-time", "");
        $row.find(".entry_info_end_time").click(function () {
            chooseEndTime();
        });
        $row.find(".icon_end").click(function () {
            chooseEndTime();
        });

        //面试日期 click
        $row.find(".entry_info_interview_time").html("").attr("data-time", "");
        $row.find(".entry_info_interview_time").click(function () {
            chooseInterviewTime();
        });
        $row.find(".icon_interview").click(function () {
            chooseInterviewTime();
        });

        var chooseBeginTime = function () {
            var opt = {
                elem: "#entry_info_begin_time",
                istoday: false, //是否显示今天
                choose: function (date) { //选择日期完毕的回调
                    var time = new Date(date).getTime();
                    $row.find(".entry_info_begin_time").attr("data-time", time);

                    //合同结束日期 初始化
                    $row.find(".entry_info_end_time").attr("data-time", "");//
                    $row.find(".entry_info_end_time").html("");
                    //取消选中状态
                    $row.find(".entry_end_date_list").find(".active").removeClass("active");
                    $row.find(".entry_end_date_list").find("img")
                        .attr("src", "image/UnChoose.png");

                }
            };

            laydate(opt);
        };

        var chooseEndTime = function () {
            var opt = {
                elem: "#entry_info_end_time",
                istoday: false, //是否显示今天
                choose: function (date) { //选择日期完毕的回调
                    var time = new Date(date).getTime();
                    $row.find(".entry_info_end_time").attr("data-time", time);//

                    //取消选中状态
                    $row.find(".entry_end_date_list").find(".active").removeClass("active");
                    $row.find(".entry_end_date_list").find("img")
                        .attr("src", "image/UnChoose.png");
                }
            };

            laydate(opt)
        };

        var chooseInterviewTime = function () {
            var opt = {
                elem: "#entry_info_interview_time",
                istoday: false, //是否显示今天
                choose: function (date) { //选择日期完毕的回调
                    var time = new Date(date).getTime();
                    $row.find(".entry_info_interview_time").attr("data-time", time);
                }
            };

            laydate(opt)
        };

    },
    //初始化 同意入职弹框内 起始工号列表
    initWorkSnList: function () {

        var $row = $entry_info_modal.find(".modal-body .default_info .row");

        branGetRequest(
            urlGroup.employee.setting.job_num_prefix.list,
            function (data) {
                //console.log(data);

                if (data.code == 1000) {

                    var workSn = data.result.models;
                    var workSn_list = "<option value='empty'>不使用工号前缀</option>";//
                    if (!workSn || workSn.length == 0) {

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

                    //起始工号
                    var beginSn = $row.find(".employee_no_begin select")
                        .find("option:selected").attr("data-lastsn");
                    if (!beginSn) beginSn = "";

                    //获取工号 后缀
                    entry_info.GetWorkSn(
                        beginSn,
                        function () {
                            $row.find(".employee_no_begin").removeClass("isBad");
                        },
                        function () {
                            $row.find(".employee_no_begin").addClass("isBad");
                        }
                    );

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
    //初始化 选择结束日期
    initChooseEndDate: function () {

        //置为初始状态
        $entry_info_modal.find(".entry_end_date_list").find(".active").removeClass("active");
        $entry_info_modal.find(".entry_end_date_list").find("img").attr("src", "image/UnChoose.png");

        //选择结束日期
        $entry_info_modal.find(".entry_end_date_list > span")
            .attr("onclick", "entry_info.chooseEndDate(this)");
        //$entry_info_modal.find(".entry_end_date_list > span").click(function () {
        //	return
        //});

    },
    //选择结束日期
    chooseEndDate: function (self) {
        var begin = $entry_info_modal.find(".entry_info_begin_time").html();
        if (!begin) {
            toastr.info("请先选择开始日期！");
            return
        }

        $(self).addClass("active").siblings(".item").removeClass("active");
        $(self).find("img").attr("src", "image/Choosed.png");
        $(self).siblings(".item").find("img").attr("src", "image/UnChoose.png");


        var date = parseInt($(self).data("time"));//选择的日期
        var end_time = "";//结束日期
        var time = "";//结束日期的 时间戳

        //无期限
        if (date == 0) {
            end_time = "无期限";
            time = "253402185600000";//写死 默认的的 无期限时间戳
        }
        else {
            begin = new Date(begin);
            end_time = new Date(begin);
            end_time.setFullYear(end_time.getFullYear() + date);
            end_time.setDate(end_time.getDate() - 1);
            end_time = new Date(end_time);

            var year = end_time.getFullYear();//计算 结束日期年份
            var month = end_time.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            var day = end_time.getDate();//结束日期 天
            day = day < 10 ? "0" + day : day;

            end_time = year + "-" + month + "-" + day;//
            time = new Date(end_time).getTime();

        }

        $entry_info_modal.find(".entry_info_end_time").html(end_time);
        $entry_info_modal.find(".entry_info_end_time").attr("data-time", time);
    },
    //初始化 试用期
    initProbationDate: function () {

        var list = "";
        for (var i = 0; i <= 6; i++) {
            list += "<option value=" + i + ">" + i + "个月</option>";
        }

        $entry_info_modal.find(".probation_expire_container select").html(list);
    },
    //获取 自定义选项
    initCustomInfo: function () {

        branGetRequest(
            urlGroup.employee.setting.roster_custom.list,
            function (data) {
                //alert(JSON.stringify(data))
                //console.log(data);

                if (data.code == 1000) {

                    var list = "";//
                    if (data.result == null || data.result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < data.result.length; i++) {

                            var item = data.result[i];
                            var version = item.version;//版本
                            var id = item.id;//
                            var name = item.colName;//

                            list +=
                                "<div class='row' data-id='" + id + "' data-version='" + version + "' >" +
                                "<span class='col-xs-3 txt'>" +
                                "<span class='custom_key'>" + name + "</span>" +
                                "：</span>" +
                                "<span class='col-xs-9'>" +
                                "<input class='form-control custom_val' maxlength='32' placeholder=''>" +
                                "</span>" +
                                "</div>"

                        }
                    }

                    $entry_info_modal.find(".custom_info").html(list);

                    if (list == "") {
                        $entry_info_modal.find(".modal-body").removeClass("custom_info_active");
                        //$entry_info_modal.find(".default_info").css("width", "100%");
                        //$entry_info_modal.find(".custom_info").css("width","50%");
                    }
                    else {
                        $entry_info_modal.find(".modal-body").addClass("custom_info_active");
                        //$entry_info_modal.find(".default_info").css("width", "55%");
                        //$entry_info_modal.find(".custom_info").css("width", "40%");
                    }

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


    //根据 起始工号、分配总数 获取工号
    GetWorkSn: function (worksn_start, SuccessFunc, ErrorFunc) {

        var $modal = $entry_info_modal.find(".modal-body");
        var $modal_line = $modal.find(".line");

        //配置工号前缀 参数
        var $work_sn = $modal.find(".employee_no_begin select").find("option:selected");

        var count = entry_info.AgreeArray.length;//同意入职员工数量
        $modal_line.find(".employee_no_count").html(count);//工号数量

        //单个用户 入职
        if (count == 1) {
            $modal_line.find(".entry_more").hide().siblings(".entry_only").show();//
            var name = entry_info.AgreeArray[0].name;
            $modal_line.find(".entry_only .employee_name").html(name);
        }
        //多个用户 入职
        if (count > 1) {
            $modal_line.find(".entry_only").hide().siblings(".entry_more").show();

            var name_start = entry_info.AgreeArray[0].name;//第一个员工姓名
            var name_end = entry_info.AgreeArray[count - 1].name;//最后一个员工姓名
            $modal_line.find(".entry_more .start_people").html(name_start);
            $modal_line.find(".entry_more .end_people").html(name_end);
        }

        var work_sn_prefix_id = $work_sn.val();//工号前缀 id
        var version = $work_sn.data("version");//工号前缀 version
        if (!version) version = "";

        var obj = {};
        obj.beginWorkSn = worksn_start;
        obj.count = count.toString();
        obj.id = work_sn_prefix_id;
        obj.version = version;
        obj.empId = "";//员工id  默认为空

        branPostRequest(
            urlGroup.employee.prospective.work_sn,
            obj,
            function (data) {
                //console.log("获取工号：");
                //console.log(data);

                if (data.code == 1000) {

                    var id = data.result.id;//工号前缀 id
                    var beginWorkSn = data.result.beginWorkSn ? data.result.beginWorkSn : "";
                    var endWorkSn = data.result.endWorkSn ? data.result.endWorkSn : "";
                    var version = data.result.version;
                    var workSnPrefix = "";//工号前缀 文本

                    //如果有 工号前缀
                    if (id != "empty") {
                        workSnPrefix = $work_sn.text();//工号前缀 文字
                    }

                    if (count == 1) {		//只有一个用户入职
                        $modal_line.find(".entry_only").find(".employee_no")
                            .html(workSnPrefix + beginWorkSn);
                    }
                    else {
                        $modal_line.find(".entry_more").find(".start_work_sn")
                            .html(workSnPrefix + beginWorkSn);
                        $modal_line.find(".entry_more").find(".end_work_sn")
                            .html(workSnPrefix + endWorkSn);
                    }

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
            });
    },

    //工号前缀 发生改变 ，重新获取 工号
    WorkSnChange: function () {
        var $modal = $entry_info_modal.find(".modal-body");
        var beginSn = $modal.find(".employee_no_begin select").find("option:selected").data("lastsn");

        entry_info.GetWorkSn(
            beginSn,
            function () {
                $modal.find(".employee_no_begin").removeClass("isBad");
            },
            function () {
                $modal.find(".employee_no_begin").addClass("isBad");
            });
    },
    //工号后缀 发生改变，重新获取工号
    CheckWorkSnIsRight: function () {
        var $modal = $entry_info_modal.find(".modal-body");
        var start = $modal.find(".employee_no_begin input").val();

        entry_info.GetWorkSn(
            start,
            function () {
                //alert(11)
                $modal.find(".employee_no_begin").removeClass("isBad");
            },
            function () {
                //alert(22)
                $modal.find(".employee_no_begin").addClass("isBad");
            });

    },

    //检查 入职时间是否是当天
    checkIsToday: function (entryDate, succFunc) {
        //入职时间
        entryDate = new Date(entryDate).toLocaleDateString();
        entryDate = new Date(entryDate).getTime();

        //今天
        var today = new Date().toLocaleDateString();
        today = new Date(today).getTime();

        if (entryDate != today) {	//如果时间不是同一天
            swal({
                title: "",
                text: "入职时间不是今天，确定要同意入职！",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#ff6600",
                confirmButtonText: "确定",
                closeOnConfirm: true
            }, function () {
                succFunc();//回调
            });
        }
        else {
            succFunc();//回调
        }
    },

    //同意入职 - 调用接口
    entryAgree: function (succFunc, errFunc) {

        if (!entry_info.CheckParamByEntry()) {
            return
        }

        loadingInit();

        //工号前缀
        var $work_sn = $entry_info_modal.find(".employee_no_begin select");
        var work_sn_prefix_id = "";
        var work_sn_prefix_name = "";
        if ($work_sn.attr("data-isNull") != 0) {		//如果工号前缀 不为空
            work_sn_prefix_id = $work_sn.find("option:selected").val();
            work_sn_prefix_name = $work_sn.find("option:selected").text();
        }

        //自定义 选项
        var userDefinedCols = [];
        $entry_info_modal.find(".custom_info > .row").each(function () {
            var obj = {};
            obj.colsId = $(this).attr("data-id");
            obj.colName = $(this).find(".custom_key").html();
            obj.colValue = $(this).find(".custom_val").val();

            userDefinedCols.push(obj);

        });

        var obj = {};
        obj.idVersions = entry_info.AgreeArray;
        obj.contract_start_time = $entry_info_modal.find(".entry_info_begin_time").attr("data-time");
        obj.contract_end_time = $entry_info_modal.find(".entry_info_end_time").attr("data-time");
        obj.interview_date = $entry_info_modal.find(".entry_info_interview_time ").attr("data-time");
        obj.count = entry_info.AgreeArray.length;
        obj.start_work_sn = $entry_info_modal.find(".employee_no_begin input").val();
        obj.end_work_sn = $entry_info_modal.find(".line .entry_only").is(":hidden")
            ? ($entry_info_modal.find(".line .entry_more .employee_no end_work_sn").html())
            : obj.start_work_sn;
        obj.work_sn_prefix_id = work_sn_prefix_id;
        obj.work_sn_prefix_name = work_sn_prefix_name;
        obj.probation = $entry_info_modal.find(".probation_expire_container select option:selected").val();
        obj.source_of_supply = $entry_info_modal.find(".interview_source").val();
        obj.employee_nature = $entry_info_modal.find(".employee_nature").val();
        obj.userDefinedCols = userDefinedCols;

        branPostRequest(
            urlGroup.employee.prospective.accept,
            obj,
            function (data) {
                //alert(JSON.stringify(data));
                //console.log("入职结果：");
                //console.log(data);

                if (data.code == 1000) {
                    $entry_info_modal.modal("hide");
                    toastr.success("入职成功！");

                    succFunc();
                }
                else {
                    branError(data.msg);
                    errFunc();
                }

            },
            function (error) {
                branError(error);
                errFunc();
            })


    },
    //同意入职 - 检查参数
    CheckParamByEntry: function () {
        var flag = false;
        var txt = "";

        var beginTime = $entry_info_modal.find(".entry_info_begin_time").attr("data-time");
        var endTime = $entry_info_modal.find(".entry_info_end_time").attr("data-time");
        var interview_time = $entry_info_modal.find(".entry_info_interview_time").attr("data-time");
        var employee_no = $.trim($entry_info_modal.find(".employee_no_begin input").val());

        if (employee_no == "") {
            txt = "请输入工号";
            $entry_info_modal.find(".employee_no_begin input").focus();
        }
        else if (employee_no.length > 8) {
            txt = "工号长度不能超过8位";
        }
        else if ($entry_info_modal.find(".modal-body .row .employee_no_begin").hasClass("isBad")) {
            txt = "起始工号 输入错误，请重新输入";
        }
        else if (!beginTime) {
            txt = "请选择开始时间";
        }
        else if (!endTime) {
            txt = "请选择结束时间";
        }
        //else if (!interview_time) {
        //	txt = "请选择面试时间";
        //}
        else if (beginTime >= endTime) {
            txt = "开始时间不能大于或等于结束时间";
        }
        else if (interview_time && interview_time > beginTime) {
            txt = "面试日期不能大于合同开始日期";
        }
        else {
            flag = true;
        }

        if (txt) {
            toastr.warning(txt);
        }

        return flag;

    }

};

$(function (global) {

    global.modal = {
        entry_info_modal: ".entry_info_modal",//同意入职弹框
        //entry_info_modal: $(".entry_info_modal"),//同意入职弹框
    };

}(window));
