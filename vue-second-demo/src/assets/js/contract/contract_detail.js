/**
 * Created by Administrator on 2017/6/22.
 */

var $contract_detail_container = $(".contract_detail_container");
var $examine_reject_modal = $(".examine_reject_modal");//审核驳回 弹框
var $contract_resend_modal = $(".contract_resend_modal");//重新发送 弹框

var contract_detail = {

    contract_id: "",//合同id
    contract_status: "",//合同状态
    contract_effective_date: "0",//合同签署 有效期
    contract_type_map: null,//合同类型 map
    type_a_arr: [],//甲方 显示内容
    type_b_arr: [],//乙方 显示内容

    init: function () {

        contract_detail.contract_id = sessionStorage.getItem("contract_id");

        contract_detail.initContractType(); //初始化 合同类型
        contract_detail.contractDetail(); //获取详情

        //审核驳回 弹框显示
        $examine_reject_modal.on("show.bs.modal", function () {
            $examine_reject_modal.find(".reject_reason").val("");
        });

    },
    //初始化 合同类型
    initContractType: function () {

        var type_arr = [
            {
                key: "0",
                name: "劳动合同"
            }
        ];

        contract_detail.contract_type_map = new Map();

        $.each(type_arr, function (index, item) {

            var key = item.key ? item.key : "";//
            var name = item.name ? item.name : "";//

            contract_detail.contract_type_map.put(key, name);

        });

    },

    //获取详情
    contractDetail: function () {

        var obj = {
            id: contract_detail.contract_id
        };
        var url = urlGroup.e_contract.detail.detail+ "?" + jsonParseParam(obj);

        loadingInit();

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var $item = data.result;//
                        var contractNo = $item.contractNo ? $item.contractNo : "";//
                        var contractType = $item.contractType ? $item.contractType : "0";//
                        contractType = contract_detail.contract_type_map.get(contractType);
                        var createTime = $item.createTime ? $item.createTime : "";//
                        createTime = timeInit2(createTime);
                        var contractState = $item.contractState ? $item.contractState : "0";//
                        var loopsKeyValues = $item.loopsKeyValues ? $item.loopsKeyValues : [];//
                        contract_detail.contract_effective_date = $item.validDays ? $item.validDays : "0";//合同签署有效期

                        contract_detail.contract_status = contractState;//
                        $.each(loopsKeyValues, function (i, $item) {

                            var type = $item.writerType ? $item.writerType : 0;
                            //乙方
                            if (type) {
                                contract_detail.type_b_arr.push($item);
                            }
                            else {
                                contract_detail.type_a_arr.push($item);
                            }

                        });

                        // console.log(contract_detail.type_b_arr);

                        var $head = $contract_detail_container.find(".head");
                        $head.find(".contract_no").html(contractNo);
                        $head.find(".contract_create_time").html(createTime);
                        $head.find(".contract_type").html(contractType);

                        //甲方
                        var $singer_a = $contract_detail_container.find(".signer_a").find(".user_fill_content");
                        $singer_a.empty();
                        $.each(contract_detail.type_a_arr, function (i, $item) {

                            var key = $item.key ? $item.key : "";//
                            var value = $item.value ? $item.value : "";//
                            var keyParam = $item.keyParam ? $item.keyParam : "";//

                            var $div = $("<div>");
                            $div.addClass("col-xs-6");
                            $div.appendTo($singer_a);

                            //key
                            var $key = $("<span>");
                            $key.text(key + "：");
                            $key.appendTo($div);

                            //value
                            var $val = $("<span>");
                            $val.appendTo($div);

                            //如果是 印章图片
                            if (keyParam && keyParam === "url") {
                                var $img = $("<img>");
                                $img.addClass("seal_img");
                                $img.attr("src", value);
                                $img.appendTo($val);
                            }
                            else {
                                $val.text(value);
                            }

                            // var $img = $("<img>");
                            // $img.addClass("seal_img");
                            // $img.attr("src", "image/icon_contract/icon_eContract.png");
                            // $img.appendTo($val);

                        });

                        //乙方
                        var $singer_b = $contract_detail_container.find(".signer_b").find(".user_fill_content");
                        $singer_b.empty();
                        $.each(contract_detail.type_b_arr, function (i, $item) {

                            var key = $item.key ? $item.key : "";//
                            var value = $item.value ? $item.value : "";//

                            var $div = $("<div>");
                            $div.addClass("col-xs-6");
                            $div.appendTo($singer_b);

                            //key
                            var $key = $("<span>");
                            $key.text(key + "：");
                            $key.appendTo($div);

                            //value
                            var $val = $("<span>");
                            $val.text(value);
                            $val.appendTo($div);

                        });

                        //初始化 操作状态
                        contract_detail.initOperate();

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

    //初始化 操作状态
    initOperate: function () {

        contract_detail.contract_status = contract_detail.contract_status.toString();
        // debugger

        var $operate = $contract_detail_container.find(".btn_operate");
        $operate.empty();

        //再次编辑
        var $btn_modify = $("<div>");
        $btn_modify.addClass("btn");
        $btn_modify.addClass("btn-sm");
        $btn_modify.addClass("btn-success");
        $btn_modify.addClass("btn_modify");
        $btn_modify.attr("data-show", "false");
        $btn_modify.text("再次编辑");
        $btn_modify.bind("click", function () {
            contract_detail.contractModify();
        });
        $btn_modify.appendTo($operate);

        //作废
        var $btn_invalid = $("<div>");
        $btn_invalid.addClass("btn");
        $btn_invalid.addClass("btn-sm");
        $btn_invalid.addClass("btn-success");
        $btn_invalid.addClass("btn_invalid");
        $btn_invalid.attr("data-show", "false");
        $btn_invalid.text("作废");
        $btn_invalid.bind("click", function () {
            contract_detail.contractInvalid();
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
            contract_detail.contractSend();
        });
        $btn_send.appendTo($operate);

        //审核通过
        var $btn_examine_pass = $("<div>");
        $btn_examine_pass.addClass("btn");
        $btn_examine_pass.addClass("btn-sm");
        $btn_examine_pass.addClass("btn-success");
        $btn_examine_pass.addClass("btn_examine_pass");
        $btn_examine_pass.attr("data-show", "false");
        $btn_examine_pass.text("审核通过");
        $btn_examine_pass.bind("click", function () {
            contract_detail.contractExaminePass();
        });
        $btn_examine_pass.appendTo($operate);

        //审核驳回
        var $btn_examine_reject = $("<div>");
        $btn_examine_reject.addClass("btn");
        $btn_examine_reject.addClass("btn-sm");
        $btn_examine_reject.addClass("btn-success");
        $btn_examine_reject.addClass("btn_examine_reject");
        $btn_examine_reject.attr("data-show", "false");
        $btn_examine_reject.text("审核驳回");
        $btn_examine_reject.bind("click", function () {
            $examine_reject_modal.modal("show");
        });
        $btn_examine_reject.appendTo($operate);

        //重新发送
        var $btn_resend = $("<div>");
        $btn_resend.addClass("btn");
        $btn_resend.addClass("btn-sm");
        $btn_resend.addClass("btn-success");
        $btn_resend.addClass("btn_resend");
        $btn_resend.attr("data-show", "false");
        $btn_resend.text("重新发送");
        $btn_resend.bind("click", function () {

            $contract_resend_modal.modal("show");
            $contract_resend_modal.find(".effective_date").html(contract_detail.contract_effective_date);

        });
        $btn_resend.appendTo($operate);

        //删除
        var $btn_del = $("<div>");
        $btn_del.addClass("btn");
        $btn_del.addClass("btn-sm");
        $btn_del.addClass("btn-success");
        $btn_del.addClass("btn_del");
        $btn_del.attr("data-show", "false");
        $btn_del.text("删除");
        $btn_del.bind("click", function () {
            contract_detail.contractDel();
        });
        $btn_del.appendTo($operate);

        switch (contract_detail.contract_status) {
            case "0": 	//未发送
                $operate.find(".btn_modify").attr("data-show", "true");
                $operate.find(".btn_invalid").attr("data-show", "true");
                $operate.find(".btn_send").attr("data-show", "true");
                break;
            case "1":		//已发送
                $operate.find(".btn_invalid").attr("data-show", "true");
                break;
            case "2":		//待审核
                $operate.find(".btn_invalid").attr("data-show", "true");
                $operate.find(".btn_examine_pass").attr("data-show", "true");
                $operate.find(".btn_examine_reject").attr("data-show", "true");
                break;
            case "3":		//已生效

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

        var $img = $("<img>");
        $img.addClass("icon_status");

        //如果是 已生效
        if (contract_detail.contract_status === "3") {

            $img.attr("src", "image/icon_contract/icon_effective.png");
            $img.appendTo($operate);

        }
        //如果是 已作废
        if (contract_detail.contract_status === "5") {

            $img.attr("src", "image/icon_contract/icon_invalid.png");
            $img.appendTo($operate);

        }

    },

    //再次编辑
    contractModify: function () {

        var tabId = "contract_create";//tab中的id
        var pageName = "新建合同";

        getInsidePageDiv(urlGroup.e_contract.create.index, tabId, pageName);

    },
    //作废
    contractInvalid: function () {

        operateMsgShow(
            "确认要作废该条合同吗？",
            function () {
                loadingInit();

                var obj = {
                    id: contract_detail.contract_id,
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

                            //进入 合同管理页面
                            getInsidePageDiv(urlGroup.e_contract.manage.index, 'contract_manage', '合同管理');
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
        );

    },
    //审核通过
    contractExaminePass: function () {

        operateMsgShow(
            "是否确定审核通过？",
            function () {
                loadingInit();

                var obj = {
                    id: contract_detail.contract_id,
                    state: 1,
                    reject_reason: ""
                };

                branPatchRequest(
                    urlGroup.e_contract.manage.state_change,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {
                            toastr.success("操作成功！");

                            //进入 合同管理页面
                            getInsidePageDiv(urlGroup.e_contract.manage.index, 'contract_manage', '合同管理');
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
            "该合同一旦审核通过，即不可撤回"
        );

    },
    //审核驳回
    contractExamineReject: function () {

        loadingInit();

        var obj = {
            id: contract_detail.contract_id,
            state: 2,
            reject_reason: $examine_reject_modal.find(".reject_reason").val()
        };

        branPatchRequest(
            urlGroup.e_contract.manage.state_change,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {
                    $examine_reject_modal.modal("hide");
                    toastr.success("操作成功！");

                    loadingInit();

                    setTimeout(function () {
                        loadingRemove();
                        // contract_detail.contractModify();

                        //进入 合同管理页面
                        getInsidePageDiv(urlGroup.e_contract.manage.index, 'contract_manage', '合同管理');
                    }, 1000);


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
    //发送
    contractSend: function () {

        operateMsgShow(
            "确认要发送该条合同吗？",
            function () {
                loadingInit();

                var obj = {
                    batch: [
                        {
                            id: contract_detail.contract_id
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

                            //进入 合同管理页面
                            getInsidePageDiv(urlGroup.e_contract.manage.index, 'contract_manage', '合同管理');
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
                    id: contract_detail.contract_id
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

                    loadingInit();

                    setTimeout(function () {
                        loadingRemove();

                        //进入 合同管理页面
                        getInsidePageDiv(urlGroup.e_contract.manage.index, 'contract_manage', '合同管理');

                    }, 1000);


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
                            id: contract_detail.contract_id
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

                            //进入 合同管理页面
                            getInsidePageDiv(urlGroup.e_contract.manage.index, 'contract_manage', '合同管理');

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
            contract_detail.contractModify();
        }, 1000);
    },

    //预览合同
    contractPreview: function () {

        var obj = {
            id: contract_detail.contract_id
        };
        var url = urlGroup.e_contract.manage.preview + "?" + jsonParseParam(obj);

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {
                        var url = data.result;

                        window.open(url, 'newwindow',
                            'height=400,width=600,top=100,left=100,toolbar=no,menubar=no,' +
                            'scrollbars=no, resizable=no,location=no, status=no');

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

};

$(function () {
    contract_detail.init();
});
