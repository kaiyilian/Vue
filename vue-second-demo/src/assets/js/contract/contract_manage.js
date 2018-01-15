/**
 * Created by CuiMengxin on 2017/5/24.
 */

var $contract_manage_container = $(".contract_manage_container");
var $contract_resend_modal = $(".contract_resend_modal");

var contract_manage = {

    /**
     * status    合同状态
     * ''    全部
     * 0    未发送
     * 1    已发送
     * 2    待审核
     * 3    已生效
     * 4    已过期
     * 5    已作废
     */
    contract_status_map: null,//合同状态 map
    contract_type_map: null,//合同类型 map
    currentPage: 1,//当前页
    totalPage: 10,//一共 的页数

    init: function () {

        //显示 提示框
        $("[data-toggle='tooltip']").tooltip();

        contract_manage.initTime();//初始化 时间
        contract_manage.initContractType();//初始化 合同类型
        contract_manage.initContractStatus();//初始化 合同状态
        contract_manage.btnSearchClick();//查询按钮 点击事件

    },
    //初始化 合同类型
    initContractType: function () {

        var type_arr = [
            {
                key: "0",
                name: "劳动合同"
            }
        ];

        var $search_container = $contract_manage_container.find(".search_container");
        var $type = $search_container.find(".contract_type");
        $type.empty();

        contract_manage.contract_type_map = new Map();

        $.each(type_arr, function (index, item) {

            var key = item.key ? item.key : "";//
            var name = item.name ? item.name : "";//

            var $option = $("<option>");
            $option.attr("value", key);
            $option.text(name);
            $option.appendTo($type);

            contract_manage.contract_type_map.put(key, name);

        });

    },
    //初始化 合同状态
    initContractStatus: function () {

        var status_arr = [
            {
                key: "",
                name: "全部"
            },
            {
                key: "0",
                name: "未发送"
            },
            {
                key: "1",
                name: "已发送"
            },
            {
                key: "2",
                name: "待审核"
            },
            {
                key: "3",
                name: "已生效"
            },
            {
                key: "4",
                name: "已过期"
            },
            {
                key: "5",
                name: "已作废"
            }
        ];

        var $search_container = $contract_manage_container.find(".search_container");
        var $status = $search_container.find(".contract_status");
        $status.empty();

        contract_manage.contract_status_map = new Map();

        $.each(status_arr, function (index, item) {

            var key = item.key ? item.key : "";//
            var name = item.name ? item.name : "";//

            var $option = $("<option>");
            $option.attr("value", key);
            $option.text(name);
            $option.appendTo($status);

            contract_manage.contract_status_map.put(key, name);

        });

    },
    //初始化 时间
    initTime: function () {

        var start = {
            elem: "#contract_create_beginTime",
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
            elem: "#contract_create_endTime",
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

    //清空 列表
    clearContractList: function () {
        var $table = $contract_manage_container.find(".table_container table");

        var list = "<tr><td colspan='8'>查询结果为空</td></tr>";
        $table.find("tbody").html(list);

    },
    //查询按钮 点击事件
    btnSearchClick: function () {
        contract_manage.currentPage = 1;//

        contract_manage.contractList();//查询
    },
    //查询
    contractList: function () {

        //清空 列表
        contract_manage.clearContractList();
        //赋值参数
        contract_manage_param.paramSet();

        var $table = $contract_manage_container.find(".table_container table");

        var obj = {
            start: contract_manage_param.beginTime,
            end: contract_manage_param.endTime,
            contract_type: contract_manage_param.contract_type,
            contract_state: contract_manage_param.contract_status,
            tel: contract_manage_param.user_phone,
            page: contract_manage.currentPage,
            page_size: "10"
        };

        var url = urlGroup.e_contract.manage.operate + "?" + jsonParseParam(obj);

        loadingInit();

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        contract_manage.totalPage = data.result.pages ? data.result.pages : 1;//总页数
                        if (contract_manage.currentPage > contract_manage.totalPage) {
                            contract_manage.currentPage -= 1;
                            contract_manage.contractList();
                            return;
                        }

                        var list = "";//列表
                        var arr = data.result.result ? data.result.result : [];
                        if (!arr || arr.length === 0) {

                        }
                        else {

                            $.each(arr, function (i, $item) {

                                var id = $item.id ? $item.id : "";//
                                var contractNo = $item.contractNo ? $item.contractNo : "";//合同编号
                                var validDays = $item.validDays ? $item.validDays : "0";//合同签署有效期
                                var contractType = $item.contractType ? $item.contractType : "0";//合同类型
                                contractType = contract_manage.contract_type_map.get(contractType);
                                var contractUserName = $item.contractUserName ? $item.contractUserName : "";//合同接收人
                                var tel = $item.tel ? $item.tel : "";//
                                var createTime = $item.createTime ? $item.createTime : "";//
                                createTime = timeInit2(createTime);
                                var contractState = $item.contractState ? $item.contractState : "0";//合同状态
                                var status_msg = contract_manage.contract_status_map.get(contractState);

                                list +=
                                    "<tr class='item' " +
                                    "data-id='" + id + "' " +
                                    "data-status='" + contractState + "' " +
                                    "data-validDays='" + validDays + "' " +
                                    ">" +
                                    "<td class='choose_item'>" +
                                    "<img src='image/UnChoose.png'/>" +
                                    "</td>" +
                                    "<td class='contract_no'>" + contractNo + "</td>" +
                                    "<td class='contract_type'>" + contractType + "</td>" +
                                    "<td class='contract_receipt'>" + contractUserName + "</td>" +
                                    "<td class='user_phone'>" + tel + "</td>" +
                                    "<td class='create_time'>" + createTime + "</td>" +
                                    "<td class='contract_status'>" + status_msg + "</td>" +
                                    "<td class='operate'></td>" +
                                    "</tr>";

                            });

                            $table.find("tbody").html(list);

                        }

                        contract_manage.contractListInit();// 初始化

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
    //初始化
    contractListInit: function () {

        var $table = $contract_manage_container.find(".table_container table");
        var $item = $table.find("tbody .item");
        var $pager_container = $contract_manage_container.find(".pager_container");

        if ($item.length === 0) {
            $pager_container.hide();
        }
        else {

            $item.each(function () {

                //选择 item
                $item.find(".choose_item").unbind("click").bind("click", function () {
                    contract_manage.chooseItem(this, event);
                });

                //初始化 操作按钮
                contract_manage.btnInit(this);

            });

            var options = {
                bootstrapMajorVersion: 3, //版本  3是ul  2 是div
                //containerClass:"sdfsaf",
                //size: "small",//大小
                alignment: "right",//对齐方式
                currentPage: contract_manage.currentPage, //当前页数
                totalPages: contract_manage.totalPage, //总页数
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

                    contract_manage.currentPage = page;
                    contract_manage.contractList();//查询 满足条件的员工

                }

            };

            var ul = '<ul class="pagenation" style="float:right;"></ul>';
            $pager_container.show();
            $pager_container.html(ul);
            $pager_container.find(".pagenation").bootstrapPaginator(options);
        }

    },
    //初始化 操作按钮
    btnInit: function (self) {

        var $this = $(self);

        var status = $this.attr("data-status");//合同状态
        var $operate = $this.find(".operate");
        $operate.empty();
        // debugger
        var status_name = contract_manage.contract_status_map.get(status);
        $this.find(".contract_status").html(status_name);

        //查看详情
        var $btn_detail = $("<div>");
        $btn_detail.addClass("btn");
        $btn_detail.addClass("btn-sm");
        $btn_detail.addClass("btn-success");
        $btn_detail.addClass("btn_detail");
        $btn_detail.attr("data-show", "true");
        $btn_detail.text("查看详情");
        $btn_detail.bind("click", function () {
            contract_manage_param.id = $(this).closest(".item").attr("data-id");

            contract_manage.contractDetail();
        });
        $btn_detail.appendTo($operate);

        //作废
        var $btn_invalid = $("<div>");
        $btn_invalid.addClass("btn");
        $btn_invalid.addClass("btn-sm");
        $btn_invalid.addClass("btn-success");
        $btn_invalid.addClass("btn_invalid");
        $btn_invalid.attr("data-show", "false");
        $btn_invalid.text("作废");
        $btn_invalid.bind("click", function () {

            contract_manage_param.id = $(this).closest(".item").attr("data-id");

            contract_manage.contractInvalid();
        });
        $btn_invalid.appendTo($operate);

        //发送
        var $btn_send = $("<div>");
        $btn_send.addClass("btn");
        $btn_send.addClass("btn-sm");
        $btn_send.addClass("btn-success");
        $btn_send.addClass("btn_send");
        $btn_send.attr("data-show", "false");
        $btn_send.text("发送");
        $btn_send.bind("click", function () {

            contract_manage_param.id = $(this).closest(".item").attr("data-id");

            contract_manage.contractSend();
        });
        $btn_send.appendTo($operate);

        //删除
        var $btn_del = $("<div>");
        $btn_del.addClass("btn");
        $btn_del.addClass("btn-sm");
        $btn_del.addClass("btn-success");
        $btn_del.addClass("btn_del");
        $btn_del.attr("data-show", "false");
        $btn_del.text("删除");
        $btn_del.bind("click", function () {
            contract_manage_param.id = $(this).closest(".item").attr("data-id");

            contract_manage.contractDel();
        });
        $btn_del.appendTo($operate);

        //下载
        var $btn_down = $("<div>");
        $btn_down.addClass("btn");
        $btn_down.addClass("btn-sm");
        $btn_down.addClass("btn-success");
        $btn_down.addClass("btn_down");
        $btn_down.attr("data-show", "false");
        $btn_down.text("下载");
        $btn_down.bind("click", function () {
            contract_manage_param.id = $(this).closest(".item").attr("data-id");

            contract_manage.contractDown();
        });
        $btn_down.appendTo($operate);

        //审核
        var $btn_examine = $("<div>");
        $btn_examine.addClass("btn");
        $btn_examine.addClass("btn-sm");
        $btn_examine.addClass("btn-success");
        $btn_examine.addClass("btn_examine");
        $btn_examine.attr("data-show", "false");
        $btn_examine.text("审核");
        $btn_examine.bind("click", function () {
            contract_manage_param.id = $(this).closest(".item").attr("data-id");

            contract_manage.contractExamine();
        });
        $btn_examine.appendTo($operate);

        //重新发送
        var $btn_resend = $("<div>");
        $btn_resend.addClass("btn");
        $btn_resend.addClass("btn-sm");
        $btn_resend.addClass("btn-success");
        $btn_resend.addClass("btn_resend");
        $btn_resend.attr("data-show", "false");
        $btn_resend.text("重新发送");
        $btn_resend.bind("click", function () {
            contract_manage_param.id = $(this).closest(".item").attr("data-id");

            var date = $(this).closest(".item").attr("data-validDays");

            $contract_resend_modal.modal("show");
            $contract_resend_modal.find(".effective_date").html(date);
        });
        $btn_resend.appendTo($operate);

        switch (status) {
            case "0": 	//未发送
                $operate.find(".btn_invalid").attr("data-show", "true");
                $operate.find(".btn_send").attr("data-show", "true");
                break;
            case "1":		//已发送
                $operate.find(".btn_invalid").attr("data-show", "true");
                break;
            case "2":		//待审核
                $operate.find(".btn_invalid").attr("data-show", "true");
                $operate.find(".btn_examine").attr("data-show", "true");
                break;
            case "3":		//已生效
                $operate.find(".btn_down").attr("data-show", "true");
                break;
            case "4":		//已过期
                $operate.find(".btn_invalid").attr("data-show", "true");
                $operate.find(".btn_resend").attr("data-show", "true");
                break;
            case "5":		//已作废
                $operate.find(".btn_del").attr("data-show", "true");
                break;
            default:
                break;
        }

        $operate.find(".btn").each(function () {
            var $this = $(this);

            var isShow = $this.attr("data-show");
            if (isShow === "false") {
                $this.remove();
            }

        });

    },

    //查看详情
    contractDetail: function () {
        contract_manage.sessionSet();//赋值 session

        var tabId = "contract_detail_" + contract_manage_param.id;//tab中的id
        var pageName = "合同详情";

        getInsidePageDiv(urlGroup.e_contract.detail.index, tabId, pageName);


    },
    //作废
    contractInvalid: function () {

        operateMsgShow(
            "确认要作废该条合同吗？",
            function () {
                loadingInit();

                var obj = {
                    id: contract_manage_param.id,
                    state: 0,
                    reject_reason: ""
                };

                branPatchRequest(
                    urlGroup.e_contract.manage.state_change,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {
                            toastr.success("操作成功！");

                            contract_manage.contractList();//查询
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
            "合同一旦作废将会失效"
        )

    },
    //审核
    contractExamine: function () {

        contract_manage.sessionSet();//赋值 session

        var tabId = "contract_detail_" + contract_manage_param.id;//tab中的id
        var pageName = "合同详情";

        getInsidePageDiv(urlGroup.e_contract.detail.index, tabId, pageName);

    },
    //下载
    contractDown: function () {

        operateMsgShow(
            "确认要下载该条合同吗？",
            function () {
                loadingInit();

                if ($contract_manage_container.find(".file_down").length > 0) {
                    $contract_manage_container.find(".file_down").remove();
                }


                var $form = $("<form>");
                $form.addClass("file_down");
                $form.attr("enctype", "multipart/form-data");
                $form.hide();

                $form.append(
                    $("<input>").attr("name", "id").attr("value", contract_manage_param.id)
                );

                $form.ajaxSubmit({
                    url: urlGroup.e_contract.manage.contract_download,
                    type: 'get',
                    clearForm: true,  //成功提交后，清除所有表单元素的值
                    resetForm: true, //成功提交后，重置所有表单元素的值
                    // data: $form.serialize(),
                    success: function (data) {
                        // debugger
                        loadingRemove();

                        if (data.code === RESPONSE_OK_CODE) {

                            var url = data.result ? data.result : "";

                            if (!url) {
                                toastr.warning("无法下载，下载链接为空！");
                                return;
                            }

                            var aLink = document.createElement('a');
                            aLink.download = "";
                            aLink.href = url;
                            aLink.click();

                        }
                        else {
                            toastr.warning(data.msg);
                        }

                    },
                    error: function (error) {
                        loadingRemove();
                        debugger
                        toastr.error(error);
                    }
                });

            }
        );


    },
    //发送
    contractSend: function () {

        operateMsgShow(
            "确认要发送该条合同吗？",
            function () {
                loadingInit();

                var obj = {
                    batch: [
                        {
                            id: contract_manage_param.id
                        }
                    ]
                };

                branPatchRequest(
                    urlGroup.e_contract.manage.send,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {
                            toastr.success("发送成功！");
                            contract_manage.contractList();//查询
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
            "该合同一旦发送成功，即不可撤回"
        );

    },
    //重新发送
    contractResend: function () {

        loadingInit();

        var obj = {
            batch: [
                {
                    id: contract_manage_param.id
                }
            ]
        };

        branPatchRequest(
            urlGroup.e_contract.manage.send,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    toastr.success("发送成功！");
                    $contract_resend_modal.modal("hide");

                    contract_manage.contractList();//查询

                    // $contract_resend_modal.modal("hide");
                    // loadingInit();
                    //
                    // setTimeout(function () {
                    //     loadingRemove();
                    //
                    //     var tabId = "contract_create";//tab中的id
                    //     var pageName = "新建合同";
                    //
                    //     getInsidePageDiv(urlGroup.contract_create_index, tabId, pageName);
                    //
                    // }, 1000);

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
    //删除
    contractDel: function () {

        operateMsgShow(
            "确认要删除该条合同吗？",
            function () {
                loadingInit();

                var obj = {
                    batch: [
                        {
                            id: contract_manage_param.id
                        }
                    ]
                };

                branDeleteRequest(
                    urlGroup.e_contract.manage.operate,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {

                            toastr.success("删除成功！");
                            contract_manage.contractList();//查询

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
            "该合同一旦删除将不可找回"
        )

    },
    //我要先编辑
    contractModifyFirst: function () {
        $contract_resend_modal.modal("hide");
        loadingInit();

        setTimeout(function () {
            loadingRemove();
            contract_manage.sessionSet();//

            var tabId = "contract_create";//tab中的id
            var pageName = "新建合同";

            getInsidePageDiv(urlGroup.e_contract.create.index, tabId, pageName);

        }, 1000);

    },

    //选择
    chooseItem: function (self, event) {
        event.stopImmediatePropagation();

        var $item = $(self).closest(".item");

        if ($item.hasClass("active")) { //如果选中行
            $item.removeClass("active");
            $(self).find("img").attr("src", "image/UnChoose.png");
        }
        else { //如果未选中
            $item.addClass("active");
            $(self).find("img").attr("src", "image/Choosed.png");
        }

        contract_manage.checkBatchOperate();//检查 批量操作 按钮

    },
    //选择当前页 全部
    chooseCurAll: function () {
        var $table_container = $contract_manage_container.find(".table_container");
        var $cur = $table_container.find("thead .choose_item");//thead choose_item
        var $item = $table_container.find("tbody .item");//tbody item
        var $choose_item = $table_container.find(".choose_item");//table choose_item

        if ($cur.hasClass("active")) { //如果选中
            $cur.removeClass("active");//
            $item.removeClass("active");//tbody item移除active
            $choose_item.find("img").attr("src", "image/UnChoose.png");
        }
        else { //如果未选中
            $cur.addClass("active");
            $item.addClass("active");//tbody item加上active
            $choose_item.find("img").attr("src", "image/Choosed.png");
        }

        contract_manage.checkBatchOperate();//检查 批量操作 按钮

    },

    //检查 批量操作 按钮
    checkBatchOperate: function () {
        var $table_container = $contract_manage_container.find(".table_container");
        var $item_active = $table_container.find("tbody .item.active");//tbody item
        var $batch_operate = $table_container.find(".batch_operate");

        if ($item_active.length > 0) {

            var send_ope = true;//发送操作
            var del_ope = true;//刪除操作

            $item_active.each(function () {

                var status = $(this).attr("data-status");
                status = parseInt(status);

                //如果状态 不是 未发送，则不能批量发送
                if (status !== 0) {
                    send_ope = false;
                }

                //如果状态 不是 已作废，则不能批量删除
                if (status !== 5) {
                    del_ope = false;
                }

            });

            //批量发送
            if (send_ope) {
                $batch_operate.find(".send_operate").removeAttr("disabled");
            }
            else {
                $batch_operate.find(".send_operate").attr("disabled", "disabled");
            }

            //批量删除
            if (del_ope) {
                $batch_operate.find(".del_operate").removeAttr("disabled");
            }
            else {
                $batch_operate.find(".del_operate").attr("disabled", "disabled");
            }

        }
        else {
            $batch_operate.find(".send_operate").attr("disabled", "disabled");
            $batch_operate.find(".del_operate").attr("disabled", "disabled");
        }

    },
    //批量操作
    batchOperate: function (self) {

        var arr = [];//
        var $table = $contract_manage_container.find(".table_container table");
        var $item_active = $table.find("tbody .item.active");
        $item_active.each(function () {

            var id = $(this).attr("data-id");

            var obj = {
                id: id
            };
            arr.push(obj);

        });


        var val = $(self).val();

        if (val === "1") {
            contract_manage.batchSend(arr);//批量发送
        }
        if (val === "2") {
            contract_manage.batchDel(arr);//批量删除
        }


    },
    //批量删除
    batchDel: function (arr) {

        operateMsgShow("确认要批量删除吗？", function () {

            loadingInit();

            var obj = {
                batch: arr
            };

            branDeleteRequest(
                urlGroup.e_contract.manage.operate,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code === RESPONSE_OK_CODE) {

                        toastr.success("删除成功！");
                        contract_manage.contractList();//查询

                    }
                    else {
                        toastr.warning(data.msg);
                    }

                },
                function (error) {
                    branError(error);
                }
            );

        })

    },
    //批量发送
    batchSend: function (arr) {

        operateMsgShow("确认要批量发送吗？", function () {

            loadingInit();

            var obj = {
                batch: arr
            };

            branPatchRequest(
                urlGroup.e_contract.manage.send,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code === RESPONSE_OK_CODE) {

                        toastr.success("发送成功！");
                        contract_manage.contractList();//查询

                    }
                    else {
                        toastr.warning(data.msg);
                    }

                },
                function (error) {
                    branError(error);
                }
            );

        })

    },


    //新建合同 页面
    goNewContractPage: function () {

        var tabId = "contract_create";//tab中的id
        var pageName = "新建合同";
        sessionStorage.removeItem("contract_id");

        getInsidePageDiv(urlGroup.e_contract.create.index, tabId, pageName);

    },

    //赋值 contract_id到sessionStorage
    sessionSet: function () {
        sessionStorage.setItem("contract_id", contract_manage_param.id);
    }

};

var contract_manage_param = {
    id: "",
    contract_type: "",
    contract_status: "",
    user_phone: "",
    beginTime: "",
    endTime: "",

    //赋值参数
    paramSet: function () {
        var $search_container = $contract_manage_container.find(".search_container");

        // contract_manage_param.id = "";
        contract_manage_param.contract_type = $search_container.find(".contract_type").val();
        contract_manage_param.contract_status = $search_container.find(".contract_status").val();
        contract_manage_param.user_phone = $.trim($search_container.find(".user_phone").val());
        contract_manage_param.beginTime = $.trim($search_container.find(".beginTime").val());
        contract_manage_param.beginTime = timeInit3(contract_manage_param.beginTime);
        contract_manage_param.endTime = $.trim($search_container.find(".endTime").val());
        contract_manage_param.endTime = timeInit4(contract_manage_param.endTime);

        // console.log(contract_manage_param.beginTime);
        // console.log(contract_manage_param.endTime);

    }
};

$(function () {
    contract_manage.init();
});