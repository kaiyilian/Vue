/**
 * Created by Administrator on 2017/12/4.
 * 薪资-详情
 */

var $salary_detail_container = $(".salary_detail_container");
var $salary_info_container = $salary_detail_container.find(".salary_info_container");//薪资用户列表、薪资详情 container

var salary_detail = {

    batch_id: "",//当前批次 id
    salary_user_id: "",//薪资详情 用户id
    userArrByBatch: [],//当前批次 导入的用户信息 数组

    init: function () {

        //批次id
        salary_detail.batch_id = sessionStorage.getItem("salaryBatchId");
        salary_detail.batch_id = salary_detail.batch_id ? salary_detail.batch_id : "";

        if (!salary_detail.batch_id) {

            toastr.warning("该批次id为空，无法查询到明细！");
            getInsidePageDiv(urlGroup.salary.history.index, 'salary_history', '工资单-历史');

            return
        }

        salary_detail.salaryInfo();//获取 某一批次的工资单信息

    },
    //获取 某一批次的工资单信息
    salaryInfo: function () {
        console.log("获取某一批次的工资单信息：" + new Date().getTime());

        loadingInit();

        var obj = {
            salaryInfoId: salary_detail.batch_id
        };

        branPostRequest(
            urlGroup.salary.detail.info_by_salaryId,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var $item = data.result;
                        var salaryMonthDesc = $item.salaryMonthDesc ? $item.salaryMonthDesc : "";//月份名称
                        var sendDate = $item.sendDate ? $item.sendDate : "";// 发送的时间
                        sendDate = timeInit2(sendDate);
                        salary_detail.userArrByBatch = $item.users ? $item.users : [];//当前批次 导入的用户信息 数组
                        var corpName = $item.corpName ? $item.corpName : "";//代发公司名称

                        //检查该批次是否有 用户
                        //如果没有用户，直接返回列表页
                        if (!salary_detail.userArrByBatch || salary_detail.userArrByBatch.length <= 0) {

                            toastr.warning("该批次没有用户！");
                            getInsidePageDiv(urlGroup.salary.history.index, 'salary_history', '工资单-历史');

                            return
                        }

                        var $left_side = $salary_info_container.find(".left_side");
                        var $right_side = $salary_info_container.find(".right_side");

                        //薪资 月份名称
                        $left_side.find(".head .name").html(salaryMonthDesc);
                        //薪资 发送时间
                        $left_side.find(".head .salary_send_time").html(sendDate);
                        $right_side.find(".salary_prompt .send_time").html(sendDate);
                        //代发公司名称
                        if (corpName) {
                            $right_side.find(".head .salary_corp_name_container").removeClass("hide")
                                .find(".salary_corp_name").html(corpName).attr("title", corpName);
                        }
                        else {
                            $right_side.find(".head .salary_corp_name_container").addClass("hide");
                        }

                        //初始化 搜索条件 用户列表chosen
                        salary_detail.initSearch();

                        //获取 员工列表
                        salary_detail.userList(salary_detail.userArrByBatch);

                        salary_detail.IsChooseAll();//是否 已经全部选择

                    }
                    else {
                        toastr.warning(data.msg);
                    }

                }
                else {
                    //跳转薪资历史页面
                    getInsidePageDiv(urlGroup.salary.history.index, 'salary_history', '工资单-历史');
                    // toastr.warning(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    },

    //初始化 搜索条件 用户列表chosen
    initSearch: function () {

        var $left_side = $salary_info_container.find(".left_side");
        var $user_list_search = $left_side.find(".search_container").find(".user_list_search");
        $user_list_search.empty();

        //移除 搜索插件
        if ($user_list_search.siblings(".chosen-container").length > 0) {
            $user_list_search.chosen("destroy");
        }

        $.each(salary_detail.userArrByBatch, function (i, $item) {

            var id = $item.id ? $item.id : "";//
            var name = $item.name ? $item.name : "";//
            var phone = $item.phone ? $item.phone : "";//

            var $option = $("<option>");
            $option.attr("value", id);
            $option.text(name + " - " + phone);
            $option.appendTo($user_list_search);

        });

        //初始化 搜索插件
        $user_list_search.chosen({
            allow_single_deselect: true,//选择之后 是否可以取消
            max_selected_options: 1,//最多只能选择1个
            width: "100%",//select框 宽度
            no_results_text: "找不到 " //输入的 内容查询不到时的提示信息
        });

        //搜索 用户事件
        $user_list_search.chosen().unbind("change").on("change", function (evt, params) {

            var id = params.selected;
            if (!id) {

                //获取 员工列表
                salary_detail.userList(salary_detail.userArrByBatch);

                return;
            }

            var obj = {
                empUserId: id,
                salaryInfoId: salary_detail.batch_id
            };

            loadingInit();

            branPostRequest(
                urlGroup.salary.detail.user_search,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code === RESPONSE_OK_CODE) {

                        if (data.result) {

                            var users = [];
                            users.push(data.result);

                            //获取 员工列表
                            salary_detail.userList(users);

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
    //获取 员工列表
    userList: function (users) {

        var $left_side = $salary_info_container.find(".left_side");
        var $user_list = $left_side.find(".user_list");
        $user_list.empty();

        $.each(users, function (i, $item) {

            var id = $item.id ? $item.id : "";//
            var name = $item.name ? $item.name : "";//
            var phone = $item.phone ? $item.phone : "";//
            var isSign = $item.isSign ? $item.isSign : 0;//0 未签收 1 已签收

            //item
            var $user_item = $("<div>");
            $user_item.addClass("item");
            $user_item.attr("data-id", id);
            $user_item.appendTo($user_list);
            $user_item.unbind("click").bind("click", function () {

                var $this = $(this);

                salary_detail.salary_user_id = $this.attr("data-id");
                $this.addClass("active").siblings(".item").removeClass("active");

                var $right_side = $salary_info_container.find(".right_side");
                var $salary_detail_container = $right_side.find(".salary_detail_container");
                var $salary_detail = $salary_detail_container.find(".salary_detail");

                //如果工资条详情 已显示
                if (!$salary_detail.hasClass("hide")) {
                    $salary_detail.addClass("hide");
                    $salary_detail.slideUp("slow");
                }

                //赋值 用户姓名
                var name = $this.find(".name").html();
                $right_side.find(".head .name").attr("title", name).html(name);

            });

            //choose_item
            var $choose_item = $("<div>");
            $choose_item.addClass("choose_item");
            $choose_item.appendTo($user_item);
            $choose_item.unbind("click").bind("click", function (e) {

                e.stopPropagation();
                // salary_detail.chooseItem(this);    //单选

                var $item = $(this).closest(".item");

                if ($item.hasClass("is_choose")) {
                    $item.removeClass("is_choose");
                    $item.find("img").attr("src", "image/icon_salary/icon_Unchecked.png")
                }
                else {
                    $item.addClass("is_choose");
                    $item.find("img").attr("src", "image/icon_salary/icon_checked.png")
                }

                salary_detail.IsChooseAll();//是否 已经全部选择

            });

            var $img = $("<img>");
            $img.attr("src", "image/icon_salary/icon_Unchecked.png");
            $img.appendTo($choose_item);

            //no
            var $no = $("<div>");
            $no.addClass("no");
            $no.text((i + 1) + ".");
            $no.appendTo($user_item);

            //name
            var $name = $("<div>");
            $name.addClass("name");
            $name.attr("title", name);
            $name.text(name);
            $name.appendTo($user_item);

            //isSign
            var $isSign = $("<div>");
            $isSign.addClass("isSign");
            $isSign.appendTo($user_item);

            //已签收
            if (isSign) {
                $isSign.addClass("c_orange");
                $isSign.text("已签收");
            }
            else {
                $isSign.text("未签收");
            }

        });

        //如果 有用户，默认 选择第一个 用户
        if ($user_list.find(".item").length > 0) {
            $user_list.find(".item").first().click();
        }

    },

    //全选
    chooseAll: function () {

        var $left_side = $salary_info_container.find(".left_side");
        var $user_item = $left_side.find(".user_list").find(".item");
        var $choose_container = $left_side.find(".operate_container .choose_item");

        if ($choose_container.hasClass("is_choose")) {   //已经选中
            $choose_container.removeClass("is_choose");
            $choose_container.find("img").attr("src", "image/icon_salary/icon_Unchecked.png");

            $user_item.removeClass("is_choose");
            $user_item.find("img").attr("src", "image/icon_salary/icon_Unchecked.png");

        }
        else {
            $choose_container.addClass("is_choose");
            $choose_container.find("img").attr("src", "image/icon_salary/icon_checked.png");

            $user_item.addClass("is_choose");
            $user_item.find("img").attr("src", "image/icon_salary/icon_checked.png");
        }

    },
    //是否 已经全部选择
    IsChooseAll: function () {

        var $left_side = $salary_info_container.find(".left_side");
        var $item = $left_side.find(".user_list").find(".item");
        var $choose_container = $left_side.find(".operate_container .choose_item");

        var chooseNo = 0;//选中的个数
        for (var i = 0; i < $item.length; i++) {
            if ($item.eq(i).hasClass("is_choose")) { //如果 是选中的
                chooseNo += 1;
            }
        }

        //没有全部选中
        if (chooseNo === 0 || chooseNo < $item.length) {
            $choose_container.removeClass("is_choose");
            $choose_container.find("img").attr("src", "image/icon_salary/icon_Unchecked.png");
        }
        else {
            $choose_container.addClass("is_choose");
            $choose_container.find("img").attr("src", "image/icon_salary/icon_checked.png");
        }

    },

    //删除
    userDel: function () {
        console.log("删除用户：" + new Date().getTime());

        //判断是否选择了 用户
        var $left_side = $salary_info_container.find(".left_side");
        var $user_item = $left_side.find(".user_list").find(".item.is_choose");

        if ($user_item.length <= 0) {
            toastr.warning("请选择用户！");
            return;
        }

        delWarning(
            "删除后该工资条将彻底从服务器上删除，且不可撤销！",
            function () {

                loadingInit();

                var arr = [];//已选择 用户数组
                for (var i = 0; i < $user_item.length; i++) {
                    var id = $user_item.eq(i).attr("data-id");
                    arr.push(id);
                }

                var obj = {
                    salaryInfoId: salary_detail.batch_id,
                    empId: arr
                };

                branPostRequest(
                    urlGroup.salary.detail.user_del,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {

                            toastr.success("删除成功！");

                            var $left_side = $salary_info_container.find(".left_side");
                            var $user_item = $left_side.find(".user_list").find(".item.is_choose");

                            $user_item.remove();

                            salary_detail.salaryInfo();//获取 某一批次的工资单信息

                            // salary_detail.IsChooseAll();//是否 已经全部选择


                            // //如果 是局部删除
                            // if ($left_side.find(".user_list").find(".item").length > 0) {
                            //     salary_detail.salaryInfoByMonth();//
                            // }
                            // else {
                            //     salary_detail.salaryYearList();
                            // }

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
        );

    },

    //获取 员工详情
    userDetail: function () {
        console.log("获取用户详情：" + new Date().getTime());

        var $left_side = $salary_info_container.find(".left_side");
        var $user_list = $left_side.find(".user_list");
        var $item = $user_list.find(".item.active");

        var $right_side = $salary_info_container.find(".right_side");
        var $salary_detail_container = $right_side.find(".salary_detail_container");
        var $salary_detail = $salary_detail_container.find(".salary_detail");

        if ($item.length <= 0) {
            toastr.warning("请先选择用户！");
            return;
        }

        //如果工资条详情 已显示
        if ($salary_detail.hasClass("hide")) {

            var obj = {
                salaryInfoId: salary_detail.batch_id,
                salaryUserId: salary_detail.salary_user_id
            };

            loadingInit();

            branPostRequest(
                urlGroup.salary.detail.detail_by_userId,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code === RESPONSE_OK_CODE) {

                        if (data.result) {

                            //清空
                            $salary_detail.empty();

                            var salary = data.result.salary ? data.result.salary : "";//
                            if (salary) {

                                var key = salary.title ? salary.title : "";//
                                var value = salary.value ? salary.value : "";//

                                var $row = $("<div>");
                                $row.appendTo($salary_detail);
                                $row.addClass("row");

                                //key
                                var $key = $("<div>");
                                $key.appendTo($row);
                                $key.addClass("key");
                                $key.addClass("col-xs-3");
                                $key.text(key);

                                //value
                                var $value = $("<div>");
                                $value.appendTo($row);
                                $value.addClass("value");
                                $value.addClass("pull-right");
                                $value.addClass("col-xs-9");
                                $value.text(value);

                            }

                            var other = data.result.other ? data.result.other : [];//
                            $.each(other, function (i, $item) {

                                var key = $item.title ? $item.title : "";//
                                var value = $item.value ? $item.value : "";//

                                var $row = $("<div>");
                                $row.appendTo($salary_detail);
                                $row.addClass("row");

                                //key
                                var $key = $("<div>");
                                $key.appendTo($row);
                                $key.addClass("key");
                                $key.addClass("col-xs-3");
                                $key.text(key);

                                //value
                                var $value = $("<div>");
                                $value.appendTo($row);
                                $value.addClass("value");
                                $value.addClass("pull-right");
                                $value.addClass("col-xs-9");
                                $value.text(value);

                            });

                            $salary_detail.removeClass("hide");
                            $salary_detail.slideDown("slow");

                        }
                        else {
                            toastr.warning(data.msg);
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
        else {

            $salary_detail.addClass("hide");
            $salary_detail.slideUp("slow");

        }

    }


};

$(function () {
    salary_detail.init();
});


