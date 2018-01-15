/**
 * Created by Administrator on 2017/10/17.
 * 考勤打卡
 */

var $attendance_setting_container = $(".attendance_setting_container");//考勤设置container
var $attendance_clock_container = $attendance_setting_container.find("#attendance_clock");

var $clock_by_area = $attendance_clock_container.find(".clock_by_area");//打卡地点 container
var $tb_clock_by_area = $clock_by_area.find("#tb_clock_by_area");
var $clock_by_wifi = $attendance_clock_container.find(".clock_by_wifi");//打卡wifi container
var $tb_clock_by_wifi = $clock_by_wifi.find("#tb_clock_by_wifi");

var $clock_area_modal = $(".clock_area_modal");//打卡地点设置 modal
var $clock_wifi_modal = $(".clock_wifi_modal");//打卡wifi设置 modal
var map;//打卡地点 modal 地图

//考勤 打卡
var attendance_clock = {

    init: function () {

        attendance_clock.clockAreaList();//获取考勤地点 列表
        attendance_clock.clockWiFiList();//获取考勤wifi 列表

        //考勤地址 modal
        $clock_area_modal.on("shown.bs.modal", function () {

            clock_area.initParam();//初始化 参数
            clock_area.initMap();//初始化 地图
            clock_area.initEffectDistance();//初始化 有效范围
            clock_area.initWorkShift();//初始化 班组

            $clock_area_modal.find(".area_name input").val("");
            $clock_area_modal.find(".area_detail_name input").val("");

        });
        //考勤地址 modal
        $clock_area_modal.on("shown.bs.modal", function () {

            //如果是 编辑
            if (clock_area.id) {
                attendance_clock.clockAreaDetail();
            }

        });

        //考勤wifi modal
        $clock_wifi_modal.on("show.bs.modal", function () {

            $clock_wifi_modal.find(".wifi_name input").val("");
            $clock_wifi_modal.find(".mac_name input").val("");

            clock_wifi.initWorkShift();//初始化 班组

        });
        //考勤wifi modal
        $clock_wifi_modal.on("shown.bs.modal", function () {

            //如果是 编辑
            if (clock_wifi.id) {
                attendance_clock.clockWiFiDetail();
            }

        });


    },

    //获取考勤地点 列表
    clockAreaList: function () {

        $tb_clock_by_area.bootstrapTable("destroy");
        //表格的初始化
        $tb_clock_by_area.bootstrapTable({

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
                    field: "shortAddress",
                    title: "考勤地址",
                    align: "center",
                    class: "shortAddress",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";
                        if (value) {
                            html = "<div title='" + row.address + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "range",
                    title: "考勤范围",
                    align: "center",
                    class: "range",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "-";
                        if (value) {
                            html = "<div title='" + row.range + "'>" + value + "米</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "workShifts",
                    title: "班组",
                    align: "center",
                    class: "workShifts",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";

                        //班组 列表
                        for (var j = 0; j < value.length; j++) {
                            var item = value[j];

                            // var w_id = item.workShiftId ? item.workShiftId : "";//
                            var w_name = item.shiftName ? item.shiftName : "";//

                            html += html ? "，" + w_name : w_name;

                        }

                        return html;
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
                        html += "<div class='btn btn-success btn-sm btn_del'>删除</div>";

                        html += "</div>";

                        return html;

                    },
                    events: {

                        //编辑
                        "click .btn_modify": function (e, value, row, index) {

                            clock_area.id = row.id;
                            $clock_area_modal.modal("show");

                        },
                        //删除
                        "click .btn_del": function (e, value, row, index) {

                            delWarning("确认删除该考勤地址吗？", function () {

                                loadingInit();

                                var obj = {
                                    id: row.id
                                };

                                branPostRequest(
                                    urlGroup.attendance.setting.clock.area.del,
                                    obj,
                                    function (data) {
                                        //console.info("获取日志：");
                                        //console.log(data);

                                        if (data.code === RESPONSE_OK_CODE) {
                                            toastr.success("删除成功！");

                                            //删除对应数据
                                            $tb_clock_by_area.bootstrapTable('remove', {
                                                field: 'id',
                                                values: [row.id]
                                            });

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

                        }

                    }
                }

            ],

            sidePagination: "server",           //分页方式：client 客户端分页，server 服务端分页（*）
            method: "get",
            contentType: "application/x-www-form-urlencoded",
            url: urlGroup.attendance.setting.clock.area.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数

                var obj = {
                    page: params.pageNumber,
                    page_size: params.pageSize
                };

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

                        var arr = res.result.officeLocations;
                        if (arr && arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var item = arr[i];

                                var id = item.id ? item.id : "";//
                                var workShifts = item.workShifs ? item.workShifs : [];//
                                var range = item.range ? item.range : "";//
                                var shortAddress = item.shortAddress ? item.shortAddress : "";//
                                var address = item.address ? item.address : "";//


                                var obj = {
                                    id: id,
                                    workShifts: workShifts,
                                    range: range,
                                    shortAddress: shortAddress,

                                    address: address
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

            }

        });

    },
    //新增 考勤地点 弹框显示
    clockAreaModalShow: function () {
        $clock_area_modal.modal("show");

        clock_area.id = "";//
    },
    //考勤地点 获取详情
    clockAreaDetail: function () {

        var obj = {
            office_location_id: clock_area.id
        };
        var url = urlGroup.attendance.setting.clock.area.detail + "?" + jsonParseParam(obj);

        loadingInit();

        branGetRequest(
            url,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {
                        var item = data.result;

                        clock_area.id = item.officeLocationId ? item.officeLocationId : "";//
                        clock_area.workShiftIds = item.workShiftIds ? item.workShiftIds : [];//
                        clock_area.longitude = item.longitude ? item.longitude : "";//
                        clock_area.latitude = item.latitude ? item.latitude : "";//
                        clock_area.range = item.range ? item.range : "";//
                        clock_area.shortAddress = item.shortAddress ? item.shortAddress : "";//
                        clock_area.address = item.address ? item.address : "";//

                        //办公地点 考勤详情 赋值
                        clock_area.clockAreaDetailInit();
                    }

                }
                else {
                    toastr.warning(data.msg)
                }

            },
            function (error) {
                toastr.error(error)
            }
        );

    },
    //考勤地点 保存
    clockAreaSave: function () {

        if (!attendance_clock.checkParamByClockAreaSave()) {
            return;
        }

        loadingInit();

        var obj = {
            id: clock_area.id,
            workShiftIds: clock_area.workShiftIds,
            longitude: clock_area.longitude,
            latitude: clock_area.latitude,
            range: clock_area.range,
            shortAddress: clock_area.shortAddress,
            address: clock_area.address
        };


        branPostRequest(
            urlGroup.attendance.setting.clock.area.save,
            obj,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {
                    toastr.success("保存成功！");

                    $clock_area_modal.modal("hide");

                    attendance_clock.clockAreaList();//获取考勤地点 列表
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
    //检查参数 考勤地点 保存
    checkParamByClockAreaSave: function () {
        var flag = false;
        var txt = "";

        //班组
        clock_area.workShiftIds = [];
        $clock_area_modal.find(".work_shift_list .btn").each(function () {
            var $this = $(this);

            if ($this.hasClass("active")) {
                var id = $this.attr("data-id");

                clock_area.workShiftIds.push(id);
            }

        });

        //考勤范围
        clock_area.range = $clock_area_modal.find(".effect_distance select").val();

        //考勤地址
        clock_area.shortAddress = $.trim($clock_area_modal.find(".area_name input").val());
        clock_area.address = $.trim($clock_area_modal.find(".area_detail_name input").val());

        //console.log(clock_area);

        if (clock_area.workShiftIds.length === 0) {
            txt = "请选择班组！";
        }
        else if (!clock_area.shortAddress || !clock_area.longitude
            || !clock_area.latitude) {
            txt = "请选择地址！";
        }
        else if (!clock_area.address) {
            txt = "请输入详细地址！";
        }
        else {
            flag = true;
        }

        if (txt) {
            toastr.warning(txt);
        }

        return flag;

    },

    //获取 考勤wifi 列表
    clockWiFiList: function () {

        $tb_clock_by_wifi.bootstrapTable("destroy");
        //表格的初始化
        $tb_clock_by_wifi.bootstrapTable({

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
                    title: "名称",
                    align: "center",
                    class: "name",
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
                    field: "macAddress",
                    title: "MAC地址",
                    align: "center",
                    class: "macAddress",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "-";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "workShifts",
                    title: "班组",
                    align: "center",
                    class: "workShifts",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "";

                        //班组 列表
                        for (var j = 0; j < value.length; j++) {
                            var item = value[j];

                            // var w_id = item.workShiftId ? item.workShiftId : "";//
                            var w_name = item.shiftName ? item.shiftName : "";//

                            html += html ? "，" + w_name : w_name;

                        }

                        return html;
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
                        html += "<div class='btn btn-success btn-sm btn_del'>删除</div>";

                        html += "</div>";

                        return html;

                    },
                    events: {

                        //编辑
                        "click .btn_modify": function (e, value, row, index) {

                            clock_wifi.id = row.id;
                            $clock_wifi_modal.modal("show");

                        },
                        //删除
                        "click .btn_del": function (e, value, row, index) {

                            delWarning("确认删除该考勤wifi吗？", function () {

                                loadingInit();

                                var obj = {
                                    id: row.id
                                };

                                branPostRequest(
                                    urlGroup.attendance.setting.clock.wifi.del,
                                    obj,
                                    function (data) {
                                        //console.info("获取日志：");
                                        //console.log(data);

                                        if (data.code === RESPONSE_OK_CODE) {
                                            toastr.success("删除成功！");

                                            //删除对应数据
                                            $tb_clock_by_wifi.bootstrapTable('remove', {
                                                field: 'id',
                                                values: [row.id]
                                            });
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

                        }

                    }
                }

            ],

            sidePagination: "server",           //分页方式：client 客户端分页，server 服务端分页（*）
            method: "get",
            contentType: "application/x-www-form-urlencoded",
            url: urlGroup.attendance.setting.clock.wifi.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数

                var obj = {
                    page: params.pageNumber,
                    page_size: params.pageSize
                };

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

                        var arr = res.result.officeWifiAttendances;
                        if (arr && arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var item = arr[i];

                                var id = item.id ? item.id : "";//
                                var name = item.name ? item.name : "";//
                                var macAddress = item.macAddress ? item.macAddress : "";//
                                var workShifts = item.workShifts ? item.workShifts : [];//

                                var obj = {
                                    id: id,
                                    name: name,
                                    macAddress: macAddress,
                                    workShifts: workShifts
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

            }

        });

    },
    //新增 考勤wifi 弹框显示
    clockWiFiModalShow: function () {
        $clock_wifi_modal.modal("show");

        clock_wifi.id = "";//
    },
    //考勤wifi 获取详情
    clockWiFiDetail: function () {

        var obj = {
            office_wifi_id: clock_wifi.id
        };
        var url = urlGroup.attendance.setting.clock.wifi.detail + "?" + jsonParseParam(obj);

        branGetRequest(
            url,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);
                //debugger
                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {
                        var item = data.result;

                        clock_wifi.id = item.id ? item.id : "";//
                        clock_wifi.workShiftIds = item.workShiftIds ? item.workShiftIds : [];//
                        clock_wifi.wifi_name = item.name ? item.name : "";//
                        clock_wifi.mac_name = item.macAddress ? item.macAddress : "";//

                        //办公wifi 考勤详情 赋值
                        clock_wifi.clockWiFiDetailInit();

                    }

                }
                else {
                    toastr.warning(data.msg)
                }

            },
            function (error) {
                toastr.error(error)
            }
        );

    },
    //考勤wifi 保存
    clockWiFiSave: function () {

        if (!attendance_clock.checkParamByClockWiFiSave()) {
            return;
        }

        var obj = {
            id: clock_wifi.id,
            workShiftIds: clock_wifi.workShiftIds,
            name: clock_wifi.wifi_name,
            macAddress: clock_wifi.mac_name
        };

        loadingInit();

        branPostRequest(
            urlGroup.attendance.setting.clock.wifi.save,
            obj,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code === RESPONSE_OK_CODE) {
                    toastr.success("保存成功！");

                    $clock_wifi_modal.modal("hide");

                    attendance_clock.clockWiFiList();//获取 考勤wifi 列表

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
    //检查参数 考勤wifi 保存
    checkParamByClockWiFiSave: function () {
        var flag = false;
        var txt = "";

        //班组
        clock_wifi.workShiftIds = [];
        $clock_wifi_modal.find(".work_shift_list .btn").each(function () {
            var $this = $(this);

            if ($this.hasClass("active")) {
                var id = $this.attr("data-id");

                clock_wifi.workShiftIds.push(id);
            }

        });

        //wifi name
        clock_wifi.wifi_name = $.trim($clock_wifi_modal.find(".wifi_name input").val());
        clock_wifi.mac_name = $.trim($clock_wifi_modal.find(".mac_name input").val());
        clock_wifi.mac_name = clock_wifi.mac_name.toLowerCase();

        var mac_reg = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/;

        //console.log(clock_wifi);

        if (clock_wifi.workShiftIds.length === 0) {
            txt = "请选择班组！";
        }
        else if (!clock_wifi.wifi_name) {
            txt = "请输入WiFi名称！";
        }
        else if (!clock_wifi.mac_name) {
            txt = "请输入MAC地址！";
        }
        else if (!mac_reg.test(clock_wifi.mac_name)) {
            txt = "MAC地址格式错误！";
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

//根据 办公地点 打卡
var clock_area = {
    id: "",//办公地点 id
    workShiftIds: [],
    longitude: "",//经度
    latitude: "",//纬度
    range: "",//范围
    shortAddress: "",//地址
    address: "",//详细地址

    //初始化 参数
    initParam: function () {

        clock_area.workShiftIds = [];
        clock_area.longitude = "";
        clock_area.latitude = "";
        clock_area.range = "";
        clock_area.shortAddress = "";
        clock_area.address = "";

    },
    //初始化 地图
    initMap: function () {

        map = new BMap.Map("area-map");
        map.reset();
        map.centerAndZoom("苏州", 12);      // 初始化地图,设置城市和地图级别。
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

        clock_area.addSearchInput();//添加搜索框

        //建立一个自动完成的对象
        var ac = new BMap.Autocomplete({

            "input": document.getElementById("area_short_name"),
            "location": map

        });

        var myValue;
        ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件

            loadingInit();
            //console.log(e);
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            //console.log(myValue)
            //G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

            setPlace();
        });

        function setPlace() {
            //debugger
            map.clearOverlays();    //清除地图上所有覆盖物

            //赋值 经纬度，增加覆盖物
            function myFun() {
                //debugger
                var address_info = local.getResults().getPoi(0);
                if (address_info && address_info.point) {
                    var pp = address_info.point;    //获取第一个智能搜索的结果
                    map.centerAndZoom(pp, 18);
                    map.addOverlay(new BMap.Marker(pp));    //添加标注

                    //赋值 经纬度
                    clock_area.longitude = pp.lng;
                    clock_area.latitude = pp.lat;

                    //详细地址
                    var address_detail = myValue + address_info.address;
                    $clock_area_modal.find(".area_name input").val(myValue);
                    $clock_area_modal.find(".area_detail_name input").val(address_detail);

                    loadingRemove();

                    ////设置半径圆
                    //clock_area.addRadius();

                }
                else {
                    toastr.warning("该地址无法获取经纬度！");
                    loadingRemove();
                }
            }

            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });

            local.search(myValue);

        }

    },
    //添加搜索框
    addSearchInput: function () {

        // 定义一个控件类,即function
        function ZoomControl() {
            this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
            this.defaultOffset = new BMap.Size(10, 10);
        }

        // 通过JavaScript的prototype属性继承于BMap.Control
        ZoomControl.prototype = new BMap.Control();

        // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
        // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
        ZoomControl.prototype.initialize = function (map) {
            // 创建一个DOM元素
            var div = document.createElement("div");
            div.innerHTML = '<div id="r-result">' +
                '搜索地址:' +
                '<input type="text" id="area_short_name" />' +
                '</div>';

            // 添加DOM元素到地图中
            map.getContainer().appendChild(div);
            // 将DOM元素返回
            return div;
        };

        // 创建控件
        var myZoomCtrl = new ZoomControl();
        // 添加到地图当中
        map.addControl(myZoomCtrl);

    },
    //设置半径圆
    addRadius: function () {

        var point = new BMap.Point(clock_area.longitude, clock_area.latitude);

        //半径
        var range = $clock_area_modal.find(".effect_distance select").val();
        var radius = (range / 1000 ) * ( 1 / 111);

        //console.log(radius);

        //centre:椭圆中心点,X:横向经度,Y:纵向纬度
        function add_oval(centre, x, y) {
            var assemble = new Array();
            var angle;
            var dot;
            var tangent = x / y;
            for (var i = 0; i < 36; i++) {
                angle = (2 * Math.PI / 36) * i;
                dot = new BMap.Point(centre.lng + Math.sin(angle) * y * tangent, centre.lat + Math.cos(angle) * y);
                assemble.push(dot);
            }
            return assemble;
        }

        var oval = new BMap.Polygon(add_oval(point, radius, radius),
            {strokeColor: "blue", strokeWeight: 3, strokeOpacity: 0.5});
        map.addOverlay(oval);

    },
    //初始化 有效范围
    initEffectDistance: function () {

        var distance = [
            {
                key: "200",
                name: "200米"
            },
            {
                key: "300",
                name: "300米"
            },
            {
                key: "500",
                name: "500米"
            },
            {
                key: "1000",
                name: "1000米"
            }
        ];

        var $select = $clock_area_modal.find(".effect_distance select");
        $select.empty();

        $.each(distance, function (index, item) {

            var key = item.key ? item.key : "";//
            var name = item.name ? item.name : "";//

            var $option = $("<option>");
            $option.attr("value", key);
            $option.text(name);
            $option.appendTo($select);

        });

    },
    //初始化 班组
    initWorkShift: function () {

        //初始化 全部按钮
        $clock_area_modal.find(".btn_all").removeClass("active");

        branGetRequest(
            urlGroup.attendance.setting.workShift_list,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code == 1000) {

                    var w_shift = data.result ? data.result : [];//

                    var $work_shift = $clock_area_modal.find(".work_shift_list");
                    $work_shift.empty();

                    $.each(w_shift, function (index, item) {

                        var id = item.work_shift_id ? item.work_shift_id : "";//
                        var name = item.work_shift_name ? item.work_shift_name : "";//

                        var $btn = $("<div>");
                        $btn.addClass("btn");
                        $btn.addClass("btn-sm");
                        $btn.addClass("btn-default");
                        $btn.attr("data-id", id);
                        $btn.text(name);
                        $btn.bind("click", function () {
                            //选择 单个 班组
                            clock_area.chooseWorkShiftOne(this);
                        });
                        $btn.appendTo($work_shift);

                    });

                }
                else {
                    toastr.warning(data.msg)
                }

            },
            function (error) {
                toastr.error(error)
            }
        );

    },

    //选择 单个 班组
    chooseWorkShiftOne: function (self) {

        var $self = $(self);
        //如果 已经选中
        if ($self.hasClass("active")) {
            $self.removeClass("active");
        }
        else {
            $self.addClass("active");
        }

        //检查 班组 是否被 全选
        clock_area.checkIsChooseAll();
    },
    //选择 全部 班组
    chooseWorkShiftAll: function () {
        var $container = $clock_area_modal.find(".work_shift_container");
        var $btn_all = $container.find(".btn_all");//全选  按钮
        var $btn = $container.find(".work_shift_list .btn");//班组 item

        //如果已经 全选了
        if ($btn_all.hasClass("active")) {
            $btn_all.removeClass("active");
            $btn.removeClass("active");
        }
        else {
            $btn_all.addClass("active");
            $btn.addClass("active");
        }
    },
    //检查 班组 是否被 全选
    checkIsChooseAll: function () {
        var $container = $clock_area_modal.find(".work_shift_container");
        var $btn_all = $container.find(".btn_all");//全选  按钮
        var $btn = $container.find(".work_shift_list .btn");//班组 item
        var $btn_active = $container.find(".work_shift_list .btn.active");//班组 已选中

        if ($btn.length == $btn_active.length) {
            $btn_all.addClass("active");
        }
        else {
            $btn_all.removeClass("active");
        }

    },

    //办公地点 考勤详情 赋值
    clockAreaDetailInit: function () {

        loadingInit();

        //赋值
        setTimeout(function () {

            $clock_area_modal.find(".work_shift_list .btn").each(function () {
                var $this = $(this);

                var id = $this.attr("data-id");

                if (clock_area.workShiftIds.indexOf(id) > -1) {
                    $this.addClass("active");
                }

            });
            clock_area.checkIsChooseAll();//检查 班组 是否被 全选

            $clock_area_modal.find(".effect_distance select").val(clock_area.range);
            $clock_area_modal.find(".area_name input").val(clock_area.shortAddress);
            $clock_area_modal.find(".area_detail_name input").val(clock_area.address);

            // 百度地图API功能 设置覆盖物
            var point = new BMap.Point(clock_area.longitude, clock_area.latitude);//120.746369, 31.27089
            map.centerAndZoom(point, 18);
            var marker = new BMap.Marker(point);  // 创建标注
            map.addOverlay(marker);               // 将标注添加到地图中
            ////设置半径圆
            //clock_area.addRadius();

            loadingRemove();

        }, 500);

    }

};

var clock_wifi = {
    id: "",
    workShiftIds: [],
    wifi_name: "",
    mac_name: "",

    //初始化 班组
    initWorkShift: function () {

        //初始化 全部按钮
        $clock_wifi_modal.find(".btn_all").removeClass("active");

        branGetRequest(
            urlGroup.attendance.setting.workShift_list,
            function (data) {
                //console.info("获取日志：");
                //console.log(data);

                if (data.code == 1000) {

                    var w_shift = data.result ? data.result : [];//

                    var $work_shift = $clock_wifi_modal.find(".work_shift_list");
                    $work_shift.empty();

                    $.each(w_shift, function (index, item) {

                        var id = item.work_shift_id ? item.work_shift_id : "";//
                        var name = item.work_shift_name ? item.work_shift_name : "";//

                        var $btn = $("<div>");
                        $btn.addClass("btn");
                        $btn.addClass("btn-sm");
                        $btn.addClass("btn-default");
                        $btn.attr("data-id", id);
                        $btn.text(name);
                        $btn.bind("click", function () {
                            //选择 单个 班组
                            clock_wifi.chooseWorkShiftOne(this);
                        });
                        $btn.appendTo($work_shift);

                    });

                }
                else {
                    toastr.warning(data.msg)
                }

            },
            function (error) {
                toastr.error(error)
            }
        );


    },

    //选择 单个 班组
    chooseWorkShiftOne: function (self) {

        var $self = $(self);
        //如果 已经选中
        if ($self.hasClass("active")) {
            $self.removeClass("active");
        }
        else {
            $self.addClass("active");
        }

        //检查 班组 是否被 全选
        clock_wifi.checkIsChooseAll();
    },
    //选择 全部 班组
    chooseWorkShiftAll: function () {
        var $container = $clock_wifi_modal.find(".work_shift_container");
        var $btn_all = $container.find(".btn_all");//全选  按钮
        var $btn = $container.find(".work_shift_list .btn");//班组 item

        //如果已经 全选了
        if ($btn_all.hasClass("active")) {
            $btn_all.removeClass("active");
            $btn.removeClass("active");
        }
        else {
            $btn_all.addClass("active");
            $btn.addClass("active");
        }

    },
    //检查 班组 是否被 全选
    checkIsChooseAll: function () {
        var $container = $clock_wifi_modal.find(".work_shift_container");
        var $btn_all = $container.find(".btn_all");//全选  按钮
        var $btn = $container.find(".work_shift_list .btn");//班组 item
        var $btn_active = $container.find(".work_shift_list .btn.active");//班组 已选中

        if ($btn.length == $btn_active.length && $btn.length > 0) {
            $btn_all.addClass("active");
        }
        else {
            $btn_all.removeClass("active");
        }

    },

    //办公wifi 考勤详情 赋值
    clockWiFiDetailInit: function () {

        loadingInit();

        setTimeout(function () {

            $clock_wifi_modal.find(".work_shift_list .btn").each(function () {
                var $this = $(this);

                var id = $this.attr("data-id");

                if (clock_wifi.workShiftIds.indexOf(id) > -1) {
                    $this.addClass("active");
                }

            });
            clock_wifi.checkIsChooseAll();//检查 班组 是否被 全选

            $clock_wifi_modal.find(".wifi_name input").val(clock_wifi.wifi_name);
            $clock_wifi_modal.find(".mac_name input").val(clock_wifi.mac_name);

            loadingRemove();

        }, 500);

    }

};

$(function () {

    attendance_clock.init();

});

