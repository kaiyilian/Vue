/**
 * Created by Administrator on 2017/9/18.
 * 班次管理
 */

var $schedule_manage_container = $(".schedule_manage_container");
var $tb_schedule_manage = $schedule_manage_container.find("#tb_schedule_manage");//班次 table
var $rest_info_modal = $(".rest_info_modal");//休息时段 弹框
var $absenteeism_info_modal = $(".absenteeism_info_modal");//旷工设置 弹框
var $overTime_info_modal = $(".overTime_info_modal");//加班设置 弹框

var schedule_manage = {

    init: function () {

        schedule_manage.scheduleList();
        // schedule_manage.initTbData([]);	//列表初始化

    },

    //班次列表
    scheduleList: function () {

        loadingInit();

        branGetRequest(
            urlGroup.attendance.schedule.list,
            function (data) {
                // console.info("获取日志：");
                // console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    var tb_data = [];

                    if (data.result && data.result.length > 0) {

                        var arr = data.result;

                        for (var i = 0; i < arr.length; i++) {

                            var $item = arr[i];

                            var id = $item.id ? $item.id : "";//
                            var name = $item.name ? $item.name : "";//
                            var shortName = $item.shortName ? $item.shortName : "";//
                            var color = $item.color ? $item.color : "";//
                            var beginTime = $item.beginTime ? $item.beginTime : "";//
                            var endTime = $item.endTime ? $item.endTime : "";//
                            var isNextDay = $item.isNextDay ? $item.isNextDay : 0;//
                            var restOpen = $item.restOpen ? $item.restOpen : 0;//
                            var restCount = $item.restCount ? $item.restCount : 0;//
                            var lateOpen = $item.lateOpen ? $item.lateOpen : 0;//
                            var lateCount = $item.lateCount ? $item.lateCount : 0;//
                            var leaveEarlyOpen = $item.leaveEarlyOpen ? $item.leaveEarlyOpen : 0;//
                            var leaveEarlyCount = $item.leaveEarlyCount ? $item.leaveEarlyCount : 0;//
                            var absenteeismOpen = $item.absenteeismOpen ? $item.absenteeismOpen : 0;//
                            var overTimeOpen = $item.overTimeOpen ? $item.overTimeOpen : 0;//
                            var isUse = $item.isUse ? $item.isUse : 0;//


                            var obj = {

                                id: id,          //班次id string
                                name: name,        //名称 string
                                shortName: shortName,   //简称 string
                                color: color,       //颜色 string
                                beginTime: beginTime,   //开始时间 string
                                endTime: endTime,     //结束时间 string
                                isNextDay: isNextDay,    //是否次日 0 否 1 是
                                restOpen: restOpen,      //休息 是否开启 0 否 1 是
                                restCount: restCount,    //休息次数
                                lateOpen: lateOpen,     //迟到 是否开启 0 否 1 是
                                lateCount: lateCount,    //迟到 时间
                                leaveEarlyOpen: leaveEarlyOpen,//早退 是否开启 0 否 1 是
                                leaveEarlyCount: leaveEarlyCount,//早退 时间
                                absenteeismOpen: absenteeismOpen,//旷工 是否开启 0 否 1 是
                                overTimeOpen: overTimeOpen,//加班 是否开启 0 否 1 是
                                isUse: isUse            //该班次 是否使用  0 否 1 是

                            };

                            tb_data.push(obj);

                        }

                    }

                    //dataTable 初始化
                    schedule_manage.initTbData(tb_data);	//列表初始化

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
    //dataTable 初始化
    initTbData: function (data) {

        // data = [
        //     {
        //
        //         id: "3",          //班次id string
        //         name: "全称",        //名称 string
        //         shortName: "简称",   //简称 string
        //         color: "#F6BB43",       //颜色 string
        //         beginTime: "9:00",   //开始时间 string
        //         endTime: "18:00",     //结束时间 string
        //         isNextDay: 0,    //是否次日 0 否 1 是
        //         restOpen: 1,      //休息 是否开启 0 否 1 是
        //         restCount: 2,    //休息次数
        //         lateOpen: 0,     //迟到 是否开启 0 否 1 是
        //         lateCount: 10,    //迟到 分钟
        //         leaveEarlyOpen: 1,//早退 是否开启 0 否 1 是
        //         leaveEarlyCount: 12,//早退 分钟
        //         absenteeismOpen: 0,//旷工 是否开启 0 否 1 是
        //         overTimeOpen: 1,//加班 是否开启 0 否 1 是
        //         isUse: 0            //该班次 是否使用  0 否 1 是
        //
        //     }
        // ];

        $tb_schedule_manage.bootstrapTable("destroy");
        //表格的初始化
        $tb_schedule_manage.bootstrapTable({

            undefinedText: "",                   //当数据为 undefined 时显示的字符
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）

            data: data,                         //直接从本地数据初始化表格
            uniqueId: "id",

            //分页
            pagination: true,                   //是否显示分页（*）
            onlyPagination: true,               //只显示分页 页码
            sidePagination: "client",           //分页方式：client 客户端分页，server 服务端分页（*）
            pageNumber: 1,                      //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [5, 10, 15],        //可供选择的每页的行数（*）

            //排序
            sortable: true,                     //所有列的排序 是否开启
            sortOrder: "desc",                   //排序方式

            width: "100%",
            height: 400,
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
                    field: "name",
                    title: "班次名称",
                    align: "center",
                    class: "name",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            html = "<div>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "shortName",
                    title: "班次简称",
                    align: "center",
                    class: "shortName",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        if (value) {
                            html = "<div>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "color",
                    title: "班次颜色",
                    align: "center",
                    class: "color",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        if (value) {
                            html = "<div style='background-color: " + value + "'></div>";
                        }

                        return html;
                    }
                },
                {
                    field: "schedule_time",
                    title: "班次时间",
                    align: "center",
                    class: "schedule_time",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";

                        if (!row.beginTime && !row.endTime) {
                        }
                        else {

                            //开始时间
                            if (row.beginTime) {
                                html += row.beginTime;
                            }

                            html += " ~ ";

                            //结束时间
                            if (row.endTime) {
                                html += row.endTime;
                            }

                            if (row.isNextDay) {
                                html += "（次）";
                            }

                        }

                        return html;
                    }
                },
                {
                    field: "rest",
                    title: "休息时段",
                    align: "center",
                    class: "rest",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        //是否开启
                        if (row.restOpen) {
                            html = "<div class='txt'>" + row.restCount + "次</div>";
                        }
                        else {
                            html = "<div>未开启</div>"
                        }

                        return html;
                    },
                    events: {

                        //点击显示 休息时间 弹框
                        "click .txt": function (e, value, row, index) {

                            var obj = {
                                id: row.id
                            };

                            loadingInit();

                            branPostRequest(
                                urlGroup.attendance.schedule.rest_info,
                                obj,
                                function (data) {
                                    //alert(JSON.stringify(data))

                                    if (data.code === RESPONSE_OK_CODE) {

                                        $rest_info_modal.modal("show");

                                        var $ul = $rest_info_modal.find("ul");
                                        $ul.empty();

                                        var arr = data.result;
                                        if (arr && arr.length > 0) {

                                            for (var i = 0; i < arr.length; i++) {
                                                var $item = arr[i];

                                                var startTime = $item.startTime ? $item.startTime : "";
                                                var isStartNextDay = $item.isStartNextDay ? $item.isStartNextDay : 0;
                                                var endTime = $item.endTime ? $item.endTime : "";
                                                var isEndNextDy = $item.isEndNextDy ? $item.isEndNextDy : 0;

                                                var msg = startTime;
                                                if (isStartNextDay)
                                                    msg += "（次）";
                                                msg += "至";
                                                msg += endTime;
                                                if (isEndNextDy)
                                                    msg += "（次）";
                                                msg += "  休息";

                                                if (msg) {
                                                    var $li = $("<li>");
                                                    $li.appendTo($ul);
                                                    $li.html(msg);
                                                }

                                            }

                                        }
                                        else {
                                            var msg = "<div class='msg_none'>暂无休息信息</div>";
                                            $ul.html(msg);
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

                    }
                },
                {
                    field: "late",
                    title: "允许迟到",
                    align: "center",
                    class: "late",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        //是否开启
                        if (row.lateOpen) {
                            html = "<div>" + row.lateCount + "分钟</div>";
                        }
                        else {
                            html = "<div>未开启</div>"
                        }

                        return html;
                    }
                },
                {
                    field: "leaveEarly",
                    title: "允许早退",
                    align: "center",
                    class: "leaveEarly",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        //是否开启
                        if (row.leaveEarlyOpen) {
                            html = "<div>" + row.leaveEarlyCount + "分钟</div>";
                        }
                        else {
                            html = "<div>未开启</div>"
                        }

                        return html;
                    }
                },
                {
                    field: "absenteeism",
                    title: "旷工设置",
                    align: "center",
                    class: "absenteeism",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        //是否开启
                        if (row.absenteeismOpen) {
                            html = "<div class='txt'>预览</div>";
                        }
                        else {
                            html = "<div>未开启</div>"
                        }

                        return html;
                    },
                    events: {

                        //点击显示 旷工信息 弹框
                        "click .txt": function (e, value, row, index) {

                            var obj = {
                                id: row.id
                            };

                            loadingInit();

                            branPostRequest(
                                urlGroup.attendance.schedule.absenteeism_info,
                                obj,
                                function (data) {
                                    //alert(JSON.stringify(data))

                                    if (data.code === RESPONSE_OK_CODE) {
                                        $absenteeism_info_modal.modal("show");

                                        var $ul = $absenteeism_info_modal.find("ul");
                                        $ul.empty();

                                        var arr = data.result;
                                        if (arr && arr.length > 0) {

                                            for (var i = 0; i < arr.length; i++) {
                                                var $item = arr[i];

                                                //旷工类型 0:迟到 1:早退 2:上班缺卡 3:下班缺卡 4:一天缺卡
                                                var absentType = $item.absentType ? $item.absentType : 0;
                                                var isUse = $item.isUse ? $item.isUse : 0;
                                                var timeMin = $item.timeMin ? $item.timeMin : "";
                                                var lackTimeDay = $item.lackTimeDay ? $item.lackTimeDay : "";

                                                var msg = "";

                                                if (absentType === 0) {
                                                    if (isUse) {
                                                        msg = "迟到旷工：迟到" + timeMin + "分钟记为旷工" + lackTimeDay + "天";
                                                    }
                                                    else {
                                                        msg = "未开启";
                                                    }
                                                }
                                                else if (absentType === 1) {
                                                    if (isUse) {
                                                        msg = "早退旷工：早退" + timeMin + "分钟记为旷工" + lackTimeDay + "天";
                                                    }
                                                    else {
                                                        msg = "未开启";
                                                    }
                                                }
                                                else if (absentType === 2) {
                                                    if (isUse) {
                                                        msg = "缺卡旷工：上班缺卡记为旷工" + lackTimeDay + "天";
                                                    }
                                                }
                                                else if (absentType === 3) {
                                                    if (isUse) {
                                                        msg = "缺卡旷工：下班缺卡记为旷工" + lackTimeDay + "天";
                                                    }
                                                }
                                                else if (absentType === 4) {
                                                    if (isUse) {
                                                        msg = "缺卡旷工：一天缺卡记为旷工" + lackTimeDay + "天";
                                                    }
                                                }

                                                if (msg) {
                                                    var $li = $("<li>");
                                                    $li.appendTo($ul);
                                                    $li.html(msg);
                                                }

                                            }

                                        }
                                        else {
                                            var msg = "<div class='msg_none'>暂无旷工信息</div>";
                                            $ul.html(msg);
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

                    }
                },
                {
                    field: "overTime",
                    title: "加班设置",
                    align: "center",
                    class: "overTime",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        //是否开启
                        if (row.overTimeOpen) {
                            html = "<div class='txt'>预览</div>";
                        }
                        else {
                            html = "<div>未开启</div>"
                        }

                        return html;
                    },
                    events: {

                        //点击显示 旷工信息 弹框
                        "click .txt": function (e, value, row, index) {

                            var obj = {
                                id: row.id
                            };

                            loadingInit();

                            branPostRequest(
                                urlGroup.attendance.schedule.overTime_info,
                                obj,
                                function (data) {
                                    //alert(JSON.stringify(data))

                                    if (data.code === RESPONSE_OK_CODE) {
                                        $overTime_info_modal.modal("show");

                                        var $txt = $overTime_info_modal.find(".modal-body .txt");
                                        $txt.empty();

                                        if (data.result) {
                                            var $item = data.result;

                                            var notesTime = $item.notesTime ? $item.notesTime : "";
                                            var intervalTime = $item.intervalTime ? $item.intervalTime : "";
                                            var type = $item.type ? $item.type : 0;//0 不计入加班  1 计入加班

                                            var msg = "下班后" + notesTime + "分钟开始计算加班，" +
                                                "加班累计间隔" + intervalTime + "分钟";

                                            if (type) {
                                                msg += "，该" + notesTime + "分钟计入加班时间"
                                            }
                                            else {
                                                msg += "，该" + notesTime + "分钟不计入加班时间"
                                            }

                                            $txt.html(msg);

                                        }
                                        else {
                                            var msg = "<div class='msg_none'>暂无加班信息</div>";
                                            $txt.html(msg);
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

                        //编辑
                        html += "<div class='btn btn-success btn-sm btn_modify'>编辑</div>";

                        //删除
                        if (row.isUse) {
                            html += "<div class='btn btn-default btn-sm btn_del'>删除</div>";
                        }
                        else {
                            html += "<div class='btn btn-success btn-sm btn_del'>删除</div>";
                        }

                        html += "</div>";

                        return html;

                    },
                    events: {

                        //编辑
                        "click .btn_modify": function (e, value, row, index) {

                            sessionStorage.setItem("schedule_id", row.id);//班次id 为空
                            getInsidePageDiv(urlGroup.attendance.schedule_detail.index, 'schedule_detail');

                        },
                        //删除
                        "click .btn_del": function (e, value, row, index) {

                            //判断当前班次 是否使用
                            if (row.isUse) {
                                toastr.warning("该班次正在使用中，无法删除！");
                                return;
                            }

                            delWarning(
                                "确定要删除该班次吗？",
                                function () {

                                    var obj = {
                                        id: row.id
                                    };

                                    loadingInit();

                                    branPostRequest(
                                        urlGroup.attendance.schedule.del,
                                        obj,
                                        function (data) {
                                            //alert(JSON.stringify(data))

                                            if (data.code === RESPONSE_OK_CODE) {
                                                toastr.success("删除成功！");

                                                //删除对应数据
                                                $tb_schedule_manage.bootstrapTable('remove', {
                                                    field: 'id',
                                                    values: [row.id]
                                                });


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
                            )

                        }

                    }
                }

            ]

        });

    },

    //进入 班次详情 页面
    goScheduleDetailPage: function () {

        sessionStorage.setItem("schedule_id", "");//新增情况下，班次id 为空
        getInsidePageDiv(urlGroup.attendance.schedule_detail.index, 'schedule_detail');

    }


};

$(function () {
    schedule_manage.init();
});

