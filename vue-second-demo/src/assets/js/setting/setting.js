/**
 * Created by CuiMengxin on 2016/12/20.
 * 员工配置
 */

var $param_name_container = $(".param_name_container");
var $param_add_container = $(".param_add_container");
var $prompt_container = $param_add_container.find(".prompt");
var $param_content_container = $(".param_content_container");
var $list_container = $param_content_container.find(".list_container");

var itemLimit = 90;//限制 输入的数量

//通用设置
var general = {

    containerName: "",

    //初始化
    init: function () {
        general.containerName = ".general_container";

        general.initDay();//初始化 天
        general.initHour();//初始化 时

        general.entryInfoGet();//获取入职消息提醒
    },
    //初始化 天
    initDay: function () {
        //设置天数
        var dayList = "";//
        for (var i = 1; i < 11; i++) {
            dayList += "<option value='" + i + "'>" + i + "</option>";
        }

        $(general.containerName).find(".day_container select").html(dayList);

    },
    //初始化 时
    initHour: function () {
        //设置时数
        var hourList = "";//
        for (var j = 6; j < 22; j++) {
            hourList += "<option value='" + j + "'>" + j + "</option>";
        }
        $(general.containerName).find(".hour_container select").html(hourList);

    },

    //获取入职消息提醒
    entryInfoGet: function () {
        loadingInit();

        branGetRequest(
            urlGroup.employee.setting.entry_remind,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {

                    var item = data.result;
                    var version = item.version;//版本
                    var content = item.message_content ? item.message_content :
                        "苏州不木提醒您，距离2016-05-31入职还有2天";
                    var day = item.before_check_in_day ? item.before_check_in_day : 1;
                    var hour = item.post_hour ? item.post_hour : 8;
                    var isWorking = item.is_working;//0 不启用 1 启用

                    $(general.containerName).attr("data-version", version);
                    $(general.containerName).find(".entry_prompt_info").html(content);
                    $(general.containerName).find(".day_container select").val(day);
                    $(general.containerName).find(".hour_container select").val(hour);

                    if (isWorking == 1) {
                        $(general.containerName).find(".choose_item").addClass("active")
                            .find("img").attr("src", "image/Choosed.png")
                    }
                    else {
                        $(general.containerName).find(".choose_item").removeClass("active")
                            .find("img").attr("src", "image/UnChoose.png");
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
    //选中行
    chooseItem: function (self) {
        //已经选中
        if ($(self).hasClass("active")) {
            $(self).removeClass("active");
            $(self).find("img").attr("src", "image/UnChoose.png");
        }
        else {
            $(self).addClass("active");
            $(self).find("img").attr("src", "image/Choosed.png")
        }
    },
    //提交
    entryInfoSubmit: function () {

        loadingInit();

        var obj = new Object();
        obj.version = $(general.containerName).attr("data-version");
        obj.message_content = $(general.containerName).find(".entry_prompt_info").text();
        obj.is_working = $(general.containerName).find(".choose_item").hasClass("active") ? 1 : 0;//0 不启用 1 启用
        obj.before_check_in_day = $(general.containerName).find(".day_container select")
            .find("option:selected").val();
        obj.post_hour = $(general.containerName).find(".hour_container select")
            .find("option:selected").val();

        branPostRequest(
            urlGroup.employee.setting.entry_msg_save,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {
                    toastr.success("提交成功");
                    general.init();
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

//工段
var setting_workLine = {

    //初始化
    init: function () {
        $param_add_container.find(".name_add input").attr("placeholder", "请输入工段名称");
        $param_add_container.find(".btn_add").attr("onclick", "setting_workLine.workLineAdd()");
        setting.init();//初始化

        setting_workLine.getWorkLineList();//获取工段 列表

    },

    //获取工段 列表
    getWorkLineList: function () {
        loadingInit();

        branGetRequest(
            urlGroup.employee.setting.workLine.list,
            function (data) {
                //alert(JSON.stringify(data))
                //console.log(data);

                if (data.code == 1000) {

                    var list = "";//
                    var result = data.result;
                    if (!result || result.length == 0) {
                        list = "<div class='param_none'>暂无字段！</div>";
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var version = item.version;//
                            var id = item.work_line_id;//
                            var name = item.work_line_name;//

                            list += "<div class='item' " +
                                "data-id='" + id + "' " +
                                "data-version='" + version + "'>" +
                                "<div class='name'>" + name + "</div>" +
                                "</div>";
                        }

                    }

                    $list_container.html(list);
                    setting_workLine.workLineListInit();//工段列表 初始化

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
    //工段列表 初始化
    workLineListInit: function () {

        setting.paramListInit(
            function (self) {
                setting_workLine.workLineSave(self);
            },
            function (self) {
                setting_workLine.workLineDel(self);
            }
        );

    },

    //新增 工段
    workLineAdd: function () {

        if (!setting.checkParam()) {
            return;
        }

        var obj = {
            work_line_name: setting.name
        };

        setting.paramAdd(
            urlGroup.employee.setting.workLine.add,
            obj,
            function () {
                setting_workLine.getWorkLineList();
            }
        );

    },

    //保存字段
    workLineSave: function (self) {
        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var name = $item.find(".name").find("input").val();
        var version = $item.attr("data-version");

        var obj = {
            work_line_id: id,
            work_line_name: name,
            version: version
        };

        setting.paramSave(
            urlGroup.employee.setting.workLine.modify,
            obj,
            function (data) {
                $item.addClass("active").removeClass("is_modify");

                var version = data.result.version;
                $item.attr("data-version", version);
                $item.find(".name").html(name);
            }
        );

    },

    //删除 工段
    workLineDel: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var version = $item.attr("data-version");

        var obj = {
            work_line_id: id,
            version: version
        };

        setting.paramDel(
            urlGroup.employee.setting.workLine.del,
            obj,
            function (data) {
                $item.remove();
            }
        );

    }

};

//班组
var setting_workShift = {

    //初始化
    init: function () {
        $param_add_container.find(".name_add input").attr("placeholder", "请输入班组名称");
        $param_add_container.find(".btn_add").attr("onclick", "setting_workShift.workShiftAdd()");
        setting.init();//初始化

        //初始化 提示信息
        setting_workShift.initPrompt();

        setting_workShift.getWorkShiftList();//获取班组 列表
    },
    //初始化 提示信息
    initPrompt: function () {

        var content = "<div class='row'>" +
            "<i class='icon icon-prompt'></i>" +
            "此字段设置，要与排班字段相匹配" +
            "</div>";

        $prompt_container.html(content);

    },

    //获取班组 列表
    getWorkShiftList: function () {
        loadingInit();

        branGetRequest(
            urlGroup.employee.setting.workShift.list,
            function (data) {

                if (data.code == 1000) {

                    var list = "";//
                    var result = data.result;
                    if (!result || result.length == 0) {
                        list = "<div class='param_none'>暂无字段！</div>";
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var id = item.work_shift_id;//
                            var version = item.version;//
                            var name = item.work_shift_name;//

                            list += "<div class='item' " +
                                "data-id='" + id + "' " +
                                "data-version='" + version + "'>" +
                                "<div class='name'>" + name + "</div>" +
                                "</div>"
                        }
                    }

                    $list_container.html(list);
                    setting_workShift.workShiftListInit();//班组列表 初始化

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
    //班组列表 初始化
    workShiftListInit: function () {

        setting.paramListInit(
            function (self) {
                setting_workShift.workShiftSave(self);
            },
            function (self) {
                setting_workShift.workShiftDel(self);
            }
        );

    },

    //新增 班组
    workShiftAdd: function () {

        if (!setting.checkParam()) {
            return;
        }

        var obj = {
            work_shift_name: setting.name
        };

        setting.paramAdd(
            urlGroup.employee.setting.workShift.add,
            obj,
            function () {
                setting_workShift.getWorkShiftList();
            }
        );

    },

    //班组 编辑后保存
    workShiftSave: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var name = $item.find(".name").find("input").val();
        var version = $item.attr("data-version");

        var obj = {
            work_shift_id: id,
            work_shift_name: name,
            version: version
        };

        setting.paramSave(
            urlGroup.employee.setting.workShift.modify,
            obj,
            function (data) {
                $item.addClass("active").removeClass("is_modify");

                var version = data.result.version;
                $item.attr("data-version", version);
                $item.find(".name").html(name);
            }
        );

    },

    //删除 班组
    workShiftDel: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var version = $item.attr("data-version");

        var obj = {
            work_shift_id: id,
            version: version
        };

        setting.paramDel(
            urlGroup.employee.setting.workShift.del,
            obj,
            function (data) {
                $item.remove();
            }
        );

    }

};

//职位
var setting_position = {

    //初始化
    init: function () {
        $param_add_container.find(".name_add input").attr("placeholder", "请输入职位名称");
        $param_add_container.find(".btn_add").attr("onclick", "setting_position.positionAdd()");
        setting.init();//初始化

        setting_position.getPositionList();//获取 职位列表

    },

    //获取 职位列表
    getPositionList: function () {
        loadingInit();

        branGetRequest(
            urlGroup.employee.setting.position.list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {

                    var list = "";//
                    var result = data.result;
                    if (!result || result.length == 0) {
                        list = "<div class='param_none'>暂无字段！</div>";
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var version = item.version;//版本
                            var id = item.position_id;//
                            var name = item.position_name;//

                            list += "<div class='item' " +
                                "data-id='" + id + "' " +
                                "data-version='" + version + "'>" +
                                "<div class='name'>" + name + "</div>" +
                                "</div>";
                        }
                    }

                    $list_container.html(list);
                    setting_position.positionListInit();//职位列表 初始化

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
    //职位列表 初始化
    positionListInit: function () {

        setting.paramListInit(
            function (self) {
                setting_position.positionSave(self);
            },
            function (self) {
                setting_position.positionDel(self);
            }
        );

    },

    //新增 职位
    positionAdd: function () {

        if (!setting.checkParam()) {
            return;
        }

        var obj = {
            position_name: setting.name
        };

        setting.paramAdd(
            urlGroup.employee.setting.position.add,
            obj,
            function () {
                setting_position.getPositionList();
            }
        );

    },

    //职位 保存
    positionSave: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var name = $item.find(".name").find("input").val();
        var version = $item.attr("data-version");

        var obj = {
            position_id: id,
            position_name: name,
            version: version
        };

        setting.paramSave(
            urlGroup.employee.setting.position.modify,
            obj,
            function (data) {
                $item.addClass("active").removeClass("is_modify");

                var version = data.result.version;
                $item.attr("data-version", version);
                $item.find(".name").html(name);
            }
        );

    },

    //删除 职位
    positionDel: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var version = $item.attr("data-version");

        var obj = {
            position_id: id,
            version: version
        };

        setting.paramDel(
            urlGroup.employee.setting.position.del,
            obj,
            function (data) {
                $item.remove();
            }
        );

    }
};

//工号前缀
var setting_job_num = {

    //初始化
    init: function () {
        $param_add_container.find(".name_add input").attr("placeholder", "请输入工号前缀名称");
        $param_add_container.find(".btn_add").attr("onclick", "setting_job_num.jobNumAdd()");
        setting.init();//初始化

        setting_job_num.getJobNumList();//获取 工号列表

    },

    //获取 工号列表
    getJobNumList: function () {
        loadingInit();

        branGetRequest(
            urlGroup.employee.setting.job_num_prefix.list,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code == 1000) {

                    var list = "";//
                    var result = data.result.models;
                    if (!result || result.length == 0) {
                        list = "<div class='param_none'>暂无字段！</div>";
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var id = item.id;//
                            var name = item.name;//
                            var version = item.version;//版本

                            list += "<div class='item' " +
                                "data-id='" + id + "' " +
                                "data-version='" + version + "'>" +
                                "<div class='name'>" + name + "</div>" +
                                "</div>"
                        }
                    }

                    $list_container.html(list);
                    setting_job_num.jobNumListInit();//工号列表 初始化

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
    //工号列表 初始化
    jobNumListInit: function () {

        setting.paramListInit(
            function (self) {
                setting_job_num.jobNumSave(self);
            },
            function (self) {
                setting_job_num.jobNumDel(self);
            }
        );

    },

    //新增 工号
    jobNumAdd: function () {

        if (!setting.checkParam()) {
            return;
        }

        var obj = {
            name: setting.name
        };

        setting.paramAdd(
            urlGroup.employee.setting.job_num_prefix.add,
            obj,
            function () {
                setting_job_num.getJobNumList();
            }
        );

    },

    //工号 保存
    jobNumSave: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var name = $item.find(".name").find("input").val();
        var version = $item.attr("data-version");

        var obj = {
            id: id,
            name: name,
            version: version
        };

        setting.paramSave(
            urlGroup.employee.setting.job_num_prefix.modify,
            obj,
            function (data) {
                $item.addClass("active").removeClass("is_modify");

                var version = data.result.version;
                $item.attr("data-version", version);
                $item.find(".name").html(name);
            }
        );

    },

    //删除 工号
    jobNumDel: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var version = $item.attr("data-version");

        var obj = {
            idVersions: [
                {
                    id: id,
                    version: version
                }
            ]
        };

        setting.paramDel(
            urlGroup.employee.setting.job_num_prefix.del,
            obj,
            function (data) {
                $item.remove();
            }
        );

    }
};

//离职原因
var setting_leave_reason = {

    //初始化
    init: function () {

        $param_add_container.find(".name_add input").attr("placeholder", "请输入离职原因名称");
        $param_add_container.find(".btn_add").attr("onclick", "setting_leave_reason.leaveReasonAdd()");
        setting.init();//初始化

        //初始化 提示信息
        setting_leave_reason.initPrompt();

        setting_leave_reason.getLeaveReasonList();//获取 离职原因 列表

    },
    //初始化 提示信息
    initPrompt: function () {

        var content = "<div class='row is_bad_container' onclick='setting_leave_reason.chooseReasonType(this)'>" +
            "<div class='choose_item f_left'>" +
            "<img src='image/UnChoose.png'/>" +
            "</div>" +
            "<div class='txt'>是否为不良离职原因</div>" +
            "</div>" +
            "<div class='row clr_red'>" +
            "<span>*</span>" +
            "<span class='txt'>红色字体代表不良原因</span>" +
            "</div>";

        $prompt_container.html(content);

    },

    //获取 离职原因 列表
    getLeaveReasonList: function () {
        loadingInit();

        branGetRequest(
            urlGroup.employee.setting.leave_reason.list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {

                    var list = "";//
                    var result = data.result;
                    if (!result || result.length == 0) {
                        list = "<div class='param_none'>暂无字段！</div>";
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];

                            var id = item.leave_reason_id;//
                            var version = item.version;//
                            var name = item.leave_reason_name;//
                            var isBad = item.is_not_good;//0 正常  1 不良原因

                            list += "<div class='item' " +
                                "data-id='" + id + "' " +
                                "data-isBad='" + isBad + "' " +
                                "data-version='" + version + "'>" +
                                "<div class='name'>" + name + "</div>" +
                                "</div>"
                        }
                    }

                    $list_container.html(list);
                    setting_leave_reason.leaveReasonListInit();//离职原因列表 初始化
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
    //离职原因列表 初始化
    leaveReasonListInit: function () {

        $list_container.find(".item").each(function () {

            var isBad = $(this).attr("data-isBad");
            if (isBad == 1) {   //不良原因
                $(this).addClass("is_bad")
            }

        });

        setting.paramListInit(
            function (self) {
                setting_leave_reason.leaveReasonSave(self);
            },
            function (self) {
                setting_leave_reason.leaveReasonDel(self);
            }
        );

    },

    //选中 是否为不良离职原因
    chooseReasonType: function (self) {
        //已经选为不良原因
        if ($(self).hasClass("active")) {
            $(self).removeClass("active");
            $(self).find("img").attr("src", "image/UnChoose.png");
        }
        else {
            $(self).addClass("active");
            $(self).find("img").attr("src", "image/Choosed.png")
        }
    },

    //新增 离职原因
    leaveReasonAdd: function () {

        if (!setting.checkParam()) {
            return;
        }

        var is_not_good = $prompt_container.find(".is_bad_container").hasClass("active") ? 1 : 0;
        var obj = {
            leave_reason_name: setting.name,
            is_not_good: is_not_good
        };

        setting.paramAdd(
            urlGroup.employee.setting.leave_reason.add,
            obj,
            function () {
                setting_leave_reason.init();
            }
        );

    },

    //离职原因 保存
    leaveReasonSave: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var name = $item.find(".name").find("input").val();
        var version = $item.attr("data-version");
        var is_bad = $item.hasClass("is_bad") ? 1 : 0;//是否是不良离职原因 0不是，1是

        var obj = {
            leave_reason_id: id,
            leave_reason_name: name,
            version: version,
            is_not_good: is_bad
        };

        setting.paramSave(
            urlGroup.employee.setting.leave_reason.modify,
            obj,
            function (data) {
                $item.addClass("active").removeClass("is_modify");

                var version = data.result.version;
                $item.attr("data-version", version);
                $item.find(".name").html(name);
            }
        );

    },

    //删除 离职原因
    leaveReasonDel: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var version = $item.attr("data-version");

        var obj = {
            leave_reason_id: id,
            version: version
        };

        setting.paramDel(
            urlGroup.employee.setting.leave_reason.del,
            obj,
            function (data) {
                $item.remove();
            }
        );

    }

};

//花名册 自定义
var setting_roster_custom = {

    //初始化
    init: function () {
        $param_add_container.find(".name_add input").attr("placeholder", "请输入自定义名称");
        $param_add_container.find(".btn_add").attr("onclick",
            "setting_roster_custom.rosterCustomAdd()");
        setting.init();//初始化

        setting_roster_custom.getRosterCustomList();//获取 自定义 列表
    },

    //获取 自定义 列表
    getRosterCustomList: function () {
        loadingInit();

        branGetRequest(
            urlGroup.employee.setting.roster_custom.list,
            function (data) {
                //alert(JSON.stringify(data))
                //console.log(data);

                if (data.code == 1000) {

                    var list = "";//
                    var result = data.result;
                    if (!result || result.length == 0) {
                        list = "<div class='param_none'>暂无字段！</div>";
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var version = item.version;//版本
                            var id = item.id;//
                            var name = item.colName;//

                            list += "<div class='item' " +
                                "data-id='" + id + "' " +
                                "data-version='" + version + "'>" +
                                "<div class='name'>" + name + "</div>" +
                                "</div>";
                        }
                    }

                    $list_container.html(list);
                    setting_roster_custom.rosterCustomListInit();//花名册列表 初始化

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
    //花名册列表 初始化
    rosterCustomListInit: function () {

        setting.paramListInit(
            function (self) {
                setting_roster_custom.rosterCustomSave(self);
            },
            function (self) {
                setting_roster_custom.rosterCustomDel(self);
            }
        );

    },

    //新增 自定义
    rosterCustomAdd: function () {

        if (!setting.checkParam()) {
            return;
        }

        var obj = {
            colName: setting.name
        };

        setting.paramAdd(
            urlGroup.employee.setting.roster_custom.add,
            obj,
            function () {
                setting_roster_custom.init();
            }
        );

    },

    //自定义 保存
    rosterCustomSave: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var name = $item.find(".name").find("input").val();
        var version = $item.attr("data-version");

        var obj = {
            id: id,
            colName: name,
            version: version
        };

        setting.paramSave(
            urlGroup.employee.setting.roster_custom.modify,
            obj,
            function (data) {
                $item.addClass("active").removeClass("is_modify");

                var version = data.result.version;
                $item.attr("data-version", version);
                $item.find(".name").html(name);
            }
        );

    },

    //删除 自定义
    rosterCustomDel: function (self) {

        var $item = $(self).closest(".item");

        var id = $item.attr("data-id");
        var version = $item.attr("data-version");

        var obj = {
            id: id,
            version: version
        };

        setting.paramDel(
            urlGroup.employee.setting.roster_custom.del,
            obj,
            function (data) {
                $item.remove();
            }
        );

    }

};

//公共方法
var setting = {
    name: "",//当前设置的名称

    //初始化
    init: function () {
        $param_add_container.find(".name_add input").val("");
        $prompt_container.empty();//清空
        $list_container.empty();//清空
    },

    //列表 初始化
    paramListInit: function (saveFunc, delFunc) {

        $list_container.find(".item").each(function () {

            //字段编辑
            var $btn_modify = $("<i>");
            $btn_modify.addClass("glyphicon");
            $btn_modify.addClass("glyphicon-pencil");
            $btn_modify.addClass("btn_modify");
            $btn_modify.click(function (e) {
                e.stopImmediatePropagation();

                setting.paramModify($(this));
            });
            $btn_modify.appendTo($(this));

            //字段删除
            var $btn_del = $("<i>");
            $btn_del.addClass("glyphicon");
            $btn_del.addClass("glyphicon-minus");
            $btn_del.addClass("btn_del");
            $btn_del.click(function (e) {
                e.stopImmediatePropagation();

                delFunc(this);
                //setting.paramDel(this, delUrl);
            });
            $btn_del.appendTo($(this));

            //字段保存
            var $btn_save = $("<i>");
            $btn_save.addClass("glyphicon");
            $btn_save.addClass("glyphicon-ok");
            $btn_save.addClass("btn_save");
            $btn_save.click(function (e) {
                e.stopImmediatePropagation();

                saveFunc(this);
                //setting.paramSave(this, saveUrl);
            });
            $btn_save.appendTo($(this));

            //取消编辑
            var $btn_cancel = $("<i>");
            $btn_cancel.addClass("glyphicon");
            $btn_cancel.addClass("glyphicon-remove");
            $btn_cancel.addClass("btn_cancel");
            $btn_cancel.click(function (e) {
                e.stopImmediatePropagation();

                setting.paramCancel(this);//
            });
            $btn_cancel.appendTo($(this));

            $(this).click(function () {

                //如果 当前 item 正在编辑
                if ($(this).hasClass("is_modify")) {
                    return;
                }

                //正在编辑的 参数内容
                var length = $list_container.find(".is_modify").length;
                if (length > 0) {
                    toastr.warning("有部分内容正在编辑，请编辑完成后再次操作！");
                    return;
                }

                //如果 当前 item 没有被选中
                if (!$(this).hasClass("active")) {

                    $(this).addClass("active").siblings(".item").removeClass("active");

                }

            });

        });

    },

    //新增字段
    paramAdd: function (addUrl, obj, successFunc) {

        loadingInit();

        branPostRequest(
            addUrl,
            obj,
            function (data) {

                if (data.code == 1000) {
                    toastr.success("新增成功！");
                    $param_add_container.find(".name_add input").val("");

                    successFunc();
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

    //保存字段
    paramSave: function (saveUrl, obj, successFunc) {
        loadingInit();

        branPostRequest(
            saveUrl,
            obj,
            function (data) {
                //alert(JSON.stringify(data));

                if (data.code == 1000) {
                    toastr.success("保存成功");

                    successFunc(data);

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

    //删除字段
    paramDel: function (delUrl, obj, successFunc) {

        delWarning("确定要删除吗？", function () {

            loadingInit();

            branPostRequest(
                delUrl,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code == 1000) {
                        toastr.success("删除成功！");
                        successFunc(data);
                    }
                    else {
                        branError(data.msg);
                    }

                },
                function (error) {
                    branError(error);
                }
            );

        });

    },

    //编辑字段
    paramModify: function (self) {

        var $item = $(self).closest(".item");
        $item.addClass("is_modify").removeClass("active");

        setting.name = $item.find(".name").html();
        var input = $("<input />");
        input.attr("value", setting.name);
        input.attr("maxlength", "32");
        input.attr("placeholder", "请输入名称");
        $item.find(".name").html(input);
        $item.find(".name").find("input").focus();

    },

    //取消 编辑
    paramCancel: function (self) {

        var $item = $(self).closest(".item");
        $item.addClass("active").removeClass("is_modify");

        $item.find(".name").html(setting.name);

    },

    //新增参数 检查
    checkParam: function () {
        var flag = false;
        var txt = "";

        //输入名称
        setting.name = $.trim($param_add_container.find(".name_add input").val());

        //如果已有的 数量 达到了限制
        if ($list_container.find(".item").length >= itemLimit) {
            txt = "数量超过最大限制！最多设置" + itemLimit + "个";
        }
        else if (setting.name == "") {
            txt = "名称不能为空";
        }
        else if (setting.name.length > 32) {
            txt = "名称不能超过32个字";
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

$(function () {
    general.init();//通用设置
    setting_workLine.init();//工段

    //参数名称
    $param_name_container.find(".item").each(function () {
        $(this).click(function () {
            $(this).addClass("active").siblings(".item").removeClass("active");
        });
    });

});