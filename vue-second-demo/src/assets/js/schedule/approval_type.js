/**
 * Created by Administrator on 2017/11/23.
 * 审批类型
 */

var approval_type = {

    //初始化 审批明细类型map
    initApprovalTypeMap: function () {

        var map = new Map();
        map.put("", "无");
        map.put(0, "调休");
        map.put(1, "事假");
        map.put(2, "年假");
        map.put(3, "病假");
        map.put(4, "产检假");
        map.put(5, "工伤假");
        map.put(6, "婚假");
        map.put(7, "产假");
        map.put(8, "哺乳假");
        map.put(9, "丧假");
        map.put(10, "工作日加班");
        map.put(11, "休息日加班");
        map.put(12, "节假日加班");

        return map;

    },

    //初始化 假期列表（所有）
    initHolidayListAll: function (successFun, errorFun) {

        loadingInit();

        branGetRequest(
            urlGroup.attendance.setting.holiday.list_all,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result && data.result.length > 0) {
                        successFun(data.result);
                    }
                    else {
                        errorFun();
                    }

                }
                else {
                    toastr.warning(data.msg);
                    errorFun();
                }

            },
            function (error) {
                branError(error);
                errorFun();
            }
        );

    },

    //初始化 假期列表（已选择的）
    initHolidayListChoosed: function (successFun, errorFun) {

        loadingInit();

        branGetRequest(
            urlGroup.attendance.setting.holiday.list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result && data.result.length > 0) {
                        successFun(data.result);
                    }
                    else {
                        errorFun();
                    }

                }
                else {
                    toastr.warning(data.msg);
                    errorFun();
                }

            },
            function (error) {
                branError(error);
                errorFun();
            }
        );

    },

    //初始化 加班列表（所有）
    initOverTimeListAll: function (successFun, errorFun) {

        loadingInit();

        branGetRequest(
            urlGroup.attendance.setting.overTime.list_all,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result && data.result.length > 0) {
                        successFun(data.result);
                    }
                    else {
                        errorFun();
                    }

                }
                else {
                    toastr.warning(data.msg);
                    errorFun();
                }

            },
            function (error) {
                branError(error);
                errorFun();
            }
        );

    },

    //初始化 加班列表（已选择的）
    initOverTimeListChoosed: function (successFun, errorFun) {

        loadingInit();

        branGetRequest(
            urlGroup.attendance.setting.overTime.list,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result && data.result.length > 0) {
                        successFun(data.result);
                    }
                    else {
                        errorFun();
                    }

                }
                else {
                    toastr.warning(data.msg);
                    errorFun();
                }

            },
            function (error) {
                branError(error);
                errorFun();
            }
        );

    },

};