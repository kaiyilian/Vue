/**
 * Created by Jack on 2016/5/26.
 * 获取 部门、工段、班组、职位、离职原因 列表
 * sessionStorage.getItem("get_dept_list")
 * sessionStorage.getItem("get_workLine_list")
 * sessionStorage.getItem("get_workShift_list")
 * sessionStorage.getItem("get_post_list")
 */

var getBasicList = {

    //获取 部门、工段、班组、职位 列表
    getBasicList: function (succFun, errFun) {
        getBasicList.getDeptList(succFun, errFun);//获取 部门 列表
    },

    //获取 部门 列表
    getDeptList: function (succFun, errFun) {

        branGetRequest(
            sessionStorage.getItem("get_dept_list"),
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {

                    var list = "";//部门列表
                    var result = data.result;
                    if (result == null || result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];
                            var dept_id = item.department_id;//
                            var dept_name = item.department_name;//
                            list += "<option value='" + dept_id + "'>" + dept_name +
                                "</option>";
                        }
                    }
                    sessionStorage.setItem("deptList", list);//部门列表

                    getBasicList.getWorkLineList(succFun, errFun);//获取 工段 列表
                }
                else {
                    errFun(data.msg);
                }
            },
            function (error) {
                errFun("error:" + JSON.stringify(error))
            }
        );

    },
    //获取 工段 列表
    getWorkLineList: function (succFun, errFun) {

        branGetRequest(
            sessionStorage.getItem("get_workLine_list"),
            function (data) {
                //alert(JSON.stringify(data))
                if (data.code == 1000) {

                    var list = "";//工段列表
                    var result = data.result;
                    if (result == null || result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var workLine_id = item.work_line_id;//
                            var workLine_name = item.work_line_name;//
                            list += "<option value='" + workLine_id + "'>" +
                                workLine_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("workLineList", list);//工段列表

                    getBasicList.getWorkShiftList(succFun, errFun);//获取 班组 列表
                }
                else {
                    errFun(data.msg);
                }
            },
            function (error) {
                errFun("error:" + JSON.stringify(error))
            }
        );

    },
    //获取 班组 列表
    getWorkShiftList: function (succFun, errFun) {

        branGetRequest(
            sessionStorage.getItem("get_workShift_list"),
            function (data) {
                //alert(JSON.stringify(data))
                if (data.code == 1000) {

                    var list = "";//班组列表
                    var result = data.result;//
                    if (result == null || result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var workShift_id = item.work_shift_id;//
                            var workShift_name = item.work_shift_name;//
                            list += "<option value='" + workShift_id + "'>" + workShift_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("workShiftList", list);//班组列表

                    getBasicList.getPostList(succFun, errFun);//获取 职位 列表
                }
                else {
                    errFun(data.msg);
                }
            },
            function (error) {
                errFun("error:" + JSON.stringify(error))
            }
        );

    },
    //获取 职位 列表
    getPostList: function (succFun, errFun) {

        branGetRequest(
            sessionStorage.getItem("get_post_list"),
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {

                    var list = "";//职位列表
                    var result = data.result;
                    if (!result || result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var post_id = item.position_id;//
                            var post_name = item.position_name;//
                            list += "<option value='" + post_id + "'>" + post_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("postList", list);//职位列表

                    succFun();
                }
                else {
                    errFun(data.msg);
                }
            },
            function (error) {
                errFun("error:" + JSON.stringify(error))
            }
        );

    },

    //检查 部门、工段、班组、职位 列表 信息
    checkBasicList: function () {
        var flag = false;

        if (!sessionStorage.getItem("deptList")) {
            toastr.warning("部门列表为空，请先去'设置中心'-'部门' 添加数据！");
        }
        else if (!sessionStorage.getItem("workShiftList")) {
            toastr.warning("班组 列表为空，请先去'设置中心'-'班组' 添加数据！");
        }
        else if (!sessionStorage.getItem("workLineList")) {
            toastr.warning("工段 列表为空，请先去'设置中心'-'工段' 添加数据！");
        }
        else if (!sessionStorage.getItem("postList")) {
            toastr.warning("职位 列表为空，请先去'设置中心'-'职位' 添加数据！");
        }
        else {
            flag = true
        }

        return flag;

    },

    //获取 离职原因 列表
    getLeaveReasonList: function (leaveReason_url, succFun, errFun) {

        branGetRequest(
            leaveReason_url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {

                    var list = "";//离职原因 列表
                    var result = data.result;
                    if (!result || result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var id = item.leave_reason_id;//
                            var name = item.leave_reason_name;//
                            var isBad = item.is_not_good;// 0 正常原因 1 不良原因

                            if (isBad == 0) {
                                list += "<option value='" + id + "'>" + name + "</option>";
                            }
                            else {
                                list += "<option class='isBad' value='" + id + "'>" +
                                    name + "</option>";
                            }
                        }
                    }

                    sessionStorage.setItem("leaveReasonList", list);//离职原因列表

                    succFun();

                }
                else {
                    errFun(data.msg)
                }

            },
            function (error) {
                errFun("error:" + JSON.stringify(error))
            }
        )

    },

    //获取省份列表
    ProvinceList: function (url, succFun, errFun) {

        var obj = new Object();
        obj.id = "";
        obj.type = 0;
        //0 查询所有的省(如果type 0 id可以不传)
        //1 根据父id查询所有的子

        url += "?" + jsonParseParam(obj);
        branGetRequest(url, function (data) {
            //alert(JSON.stringify(data));
            //console.log();

            if (data.code == 1000) {

                var province_list = "";
                for (var i = 0; i < data.result.models.length; i++) {
                    var item = data.result.models[i];

                    var id = item.id;
                    var name = item.name;//
                    var version = item.version;//

                    province_list += "<option value='" + id + "' " +
                        "data-version='" + version + "'>" + name + "</option>";
                }
                sessionStorage.setItem("province_list", province_list);
                succFun();
            }
            else {
                branError(data.msg);
                errFun();
            }

        }, function (error) {
            branError(error);
            errFun();
        });

    },
    //获取城市列表
    CityList: function (url, province_id, succFun, errFun) {
        var obj = new Object();
        obj.id = province_id;
        obj.type = 1;
        //0 查询所有的省(如果type 0 id可以不传)
        //1 根据父id查询所有的子

        url += "?" + jsonParseParam(obj);
        branGetRequest(url, function (data) {
            //alert(JSON.stringify(data));

            if (data.code == 1000) {

                var city_list = "";
                for (var i = 0; i < data.result.models.length; i++) {
                    var item = data.result.models[i];

                    var id = item.id;
                    var name = item.name;//
                    var version = item.version;//

                    city_list += "<option value='" + id + "' " +
                        "data-version='" + version + "'>" + name + "</option>";
                }

                sessionStorage.setItem("city_list", city_list);
                succFun();
            }
            else {
                branError(data.msg);
                errFun();
            }

        }, function (error) {
            branError(error);
            errFun();
        });

    },
    //获取省份列表
    AreaList: function (url, city_id, succFun, errFun) {
        var obj = new Object();
        obj.id = city_id;
        obj.type = 1;
        //0 查询所有的省(如果type 0 id可以不传)
        //1 根据父id查询所有的子

        url += "?" + jsonParseParam(obj);
        branGetRequest(url, function (data) {
            //alert(JSON.stringify(data));

            if (data.code == 1000) {

                var area_list = "";
                for (var i = 0; i < data.result.models.length; i++) {
                    var item = data.result.models[i];

                    var id = item.id;
                    var name = item.name;//
                    var version = item.version;//

                    area_list += "<option value='" + id + "' " +
                        "data-version='" + version + "'>" + name + "</option>";
                }

                sessionStorage.setItem("area_list", area_list);
                succFun();
            }
            else {
                branError(data.msg);
                errFun();
            }

        }, function (error) {
            branError(error);
            errFun();
        });

    },

    /**
     *    测试promise 的方法
     */

    //ajax get方法
    ajGet: function (url) {
        return new Promise(function (resolve) {

            ajaxSetup();
            $.ajax({
                url: url,
                method: 'GET',
                success: function (data, status, jqXHR) {
                    resolve(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrow) {
                    ajax_msg(XMLHttpRequest);//判断ajax 异常错误
                }
            });

        });
    },

    //部门列表
    departmentList: function (url) {

        return getBasicList.ajGet(url)
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
                else if (data.code === RESPONSE_OK_CODE) {

                    var list = "";//部门列表
                    var result = data.result;
                    if (!result || result.length === 0) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];
                            var dept_id = item.department_id;//
                            var dept_name = item.department_name;//
                            list += "<option value='" + dept_id + "'>" + dept_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("deptList", list);//部门列表

                    return list;

                }
                else {
                    toastr.warning(data.msg);
                }


            })
            .catch(function (err) {

                console.log("ajax get method error in department:");
                console.error(err.message);

            });

    },

    //工段 列表
    workLineList: function (url) {

        return getBasicList.ajGet(url)
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
                else if (data.code === RESPONSE_OK_CODE) {

                    var list = "";//工段列表
                    var result = data.result;
                    if (!result || result.length === 0) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var workLine_id = item.work_line_id;//
                            var workLine_name = item.work_line_name;//
                            list += "<option value='" + workLine_id + "'>" +
                                workLine_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("workLineList", list);//工段列表

                    return list;

                }
                else {
                    toastr.warning(data.msg);
                }

            })
            .catch(function (err) {

                console.log("ajax get method error in workLine:");
                console.error(err.message);

            });

    },

    //班组 列表
    workShiftList: function (url) {

        return getBasicList.ajGet(url)
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
                else if (data.code === RESPONSE_OK_CODE) {

                    var list = "";//班组列表
                    var result = data.result;//
                    if (!result || result.length === 0) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var workShift_id = item.work_shift_id;//
                            var workShift_name = item.work_shift_name;//
                            list += "<option value='" + workShift_id + "'>" + workShift_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("workShiftList", list);//班组列表

                    return list;
                }
                else {
                    toastr.warning(data.msg);
                }

            })
            .catch(function (err) {

                console.log("ajax get method error in workShift:");
                console.error(err.message);

            });

    },

    //职位列表
    positionList: function (url) {

        return getBasicList.ajGet(url)
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
                else if (data.code === RESPONSE_OK_CODE) {

                    var list = "";//职位列表
                    var result = data.result;
                    if (!result || result.length === 0) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {

                            var item = result[i];
                            var post_id = item.position_id;//
                            var post_name = item.position_name;//
                            list += "<option value='" + post_id + "'>" + post_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("postList", list);//职位列表

                    return list;
                }
                else {
                    toastr.warning(data.msg);
                }

            })
            .catch(function (err) {

                console.log("ajax get method error in position:");
                console.error(err.message);

            });

    }

};

var debug = {
    /**
     *   debugger 旧方法
     * */

    get_depturl: "",
    get_worklineurl: "",
    get_workshifturl: "",
    get_posturl: "",

    //获取 部门、工段、班组、职位 列表
    GetBasicList: function (depturl, worklineurl, workshifturl, posturl, succFun, errFun) {
        getBasicList.get_depturl = depturl;
        getBasicList.get_worklineurl = worklineurl;
        getBasicList.get_workshifturl = workshifturl;
        getBasicList.get_posturl = posturl;

        getBasicList.GetDeptList(succFun, errFun);//获取 部门 列表
    },
    //获取 部门 列表
    GetDeptList: function (succFun, errFun) {
        //获取部门信息
        branGetRequest(getBasicList.get_depturl, function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {

                    var deptList = "";//部门列表
                    if (data.result == null || data.result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < data.result.length; i++) {
                            var item = data.result[i];
                            var dept_id = item.department_id;//
                            var dept_name = item.department_name;//
                            deptList += "<option value='" + dept_id + "'>" + dept_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("deptList", deptList);//部门列表

                    getBasicList.GetWorkLineList(succFun, errFun);//获取 工段 列表
                }
                else {
                    errFun(data.msg);
                }
            },
            function (error) {
                errFun("error:" + JSON.stringify(error))
            })
    },
    //获取 工段 列表
    GetWorkLineList: function (succFun, errFun) {
        branGetRequest(getBasicList.get_worklineurl, function (data) {
                //alert(JSON.stringify(data))
                if (data.code == 1000) {

                    var workLineList = "";//工段列表
                    if (data.result == null || data.result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < data.result.length; i++) {

                            var item = data.result[i];
                            var workLine_id = item.work_line_id;//
                            var workLine_name = item.work_line_name;//
                            workLineList += "<option value='" + workLine_id + "'>" +
                                workLine_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("workLineList", workLineList);//工段列表

                    getBasicList.GetWorkShiftList(succFun, errFun);//获取 班组 列表
                }
                else {
                    errFun(data.msg);
                }
            },
            function (error) {
                errFun("error:" + JSON.stringify(error))
            })
    },
    //获取 班组 列表
    GetWorkShiftList: function (succFun, errFun) {
        branGetRequest(getBasicList.get_workshifturl, function (data) {
                //alert(JSON.stringify(data))
                if (data.code == 1000) {

                    var workShiftList = "";//班组列表
                    if (data.result == null || data.result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < data.result.length; i++) {

                            var item = data.result[i];
                            var workShift_id = item.work_shift_id;//
                            var workShift_name = item.work_shift_name;//
                            workShiftList += "<option value='" + workShift_id + "'>" + workShift_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("workShiftList", workShiftList);//班组列表

                    getBasicList.GetPostList(succFun, errFun);//获取 职位 列表
                }
                else {
                    errFun(data.msg);
                }
            },
            function (error) {
                errFun("error:" + JSON.stringify(error))
            })
    },
    //获取 职位 列表
    GetPostList: function (succFun, errFun) {
        branGetRequest(getBasicList.get_posturl, function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {

                    var postList = "";//职位列表
                    if (data.result == null || data.result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < data.result.length; i++) {

                            var item = data.result[i];
                            var post_id = item.position_id;//
                            var post_name = item.position_name;//
                            postList += "<option value='" + post_id + "'>" + post_name + "</option>";
                        }
                    }
                    sessionStorage.setItem("postList", postList);//职位列表

                    succFun();
                }
                else {
                    errFun(data.msg);
                }
            },
            function (error) {
                errFun("error:" + JSON.stringify(error))
            })
    },
    //获取 离职原因 列表
    GetLeaveReasonList: function (leaveReason_url, succFun, errFun) {

        branGetRequest(leaveReason_url, function (data) {
            //alert(JSON.stringify(data))

            if (data.code == 1000) {

                var leaveReasonList = "";//
                if (data.result == null || data.result.length == 0) {
                }
                else {
                    for (var i = 0; i < data.result.length; i++) {

                        var item = data.result[i];
                        var id = item.leave_reason_id;//
                        var name = item.leave_reason_name;//
                        var isBad = item.is_not_good;// 0 正常原因 1 不良原因

                        if (isBad == 0) {
                            leaveReasonList += "<option value='" + id + "'>" + name + "</option>";
                        }
                        else {
                            leaveReasonList += "<option class='isBad' value='" + id + "'>" +
                                name + "</option>";
                        }
                    }
                }
                sessionStorage.setItem("leaveReasonList", leaveReasonList);//离职原因列表

                succFun();

            }
            else {
                errFun(data.msg)
            }

        }, function (error) {
            errFun("error:" + JSON.stringify(error))
        })

    },


    //检查 部门、工段、班组、职位 列表 信息
    CheckBasicList: function () {
        var flag = false;

        if (!sessionStorage.getItem("deptList")) {
            toastr.warning("部门列表为空，请先去'设置中心'-'部门' 添加数据！");
        }
        else if (!sessionStorage.getItem("workShiftList")) {
            toastr.warning("班组 列表为空，请先去'设置中心'-'班组' 添加数据！");
        }
        else if (!sessionStorage.getItem("workLineList")) {
            toastr.warning("工段 列表为空，请先去'设置中心'-'工段' 添加数据！");
        }
        else if (!sessionStorage.getItem("postList")) {
            toastr.warning("职位 列表为空，请先去'设置中心'-'职位' 添加数据！");
        }
        else {
            flag = true
        }

        return flag;

    },
};

