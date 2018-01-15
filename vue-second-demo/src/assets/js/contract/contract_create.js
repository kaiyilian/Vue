/**
 * Created by Administrator on 2017/6/16.
 */

var $page1 = $(".contract_create_container").find(".page1");
var $page2 = $(".contract_create_container").find(".page2");
var $seal_temp_modal = $(".seal_temp_modal");//印章模板 弹框

var contract_create = {

    //合同创建 初始化
    init: function () {
        $("[data-toggle='tooltip']").tooltip();
        contract_param.contractParamInit();//初始化 参数（置空）

        //编辑状态
        if (sessionStorage.getItem("contract_id")) {

            contract_param.contract_id = sessionStorage.getItem("contract_id");

            //获取详情
            contract_create.contractDetail(
                function () {
                    contract_create.initContractType(); //初始化 合同类型
                    contract_create.contractTempList(); //合同模板 列表
                    contract_create.initContractItem();//初始化 合同填写项
                },
                function () {

                }
            );

        }
        //新增状态
        else {
            contract_create.initContractType(); //初始化 合同类型
            contract_create.contractTempList(); //合同模板 列表
            contract_create.initContractItem();//初始化 合同填写项
        }

    },
    //初始化 合同类型
    initContractType: function () {
        var $contract_type_container = $page1.find(".contract_type_container");

        $contract_type_container.find(".contract_type_item").each(function () {
            var $this = $(this);

            //点击合同类型
            $this.unbind("click").bind("click", function () {

                $this.addClass("active").siblings(".contract_type_item").removeClass("active");
                contract_param.contract_type_id = $this.attr("data-type");//
                contract_create.contractTempList(); //合同模板列表 获取

            });

        });

    },

    //合同模板列表 清空
    clearContractTempList: function () {
        var $contract_temp_container = $page1.find(".contract_temp_container");

        var msg = "<div class='msg_none'>暂无模板</div>";
        $contract_temp_container.html(msg);
    },
    //合同模板列表 获取
    contractTempList: function () {

        //合同模板列表 清空
        contract_create.clearContractTempList();

        var $contract_temp_container = $page1.find(".contract_temp_container");

        var url = urlGroup.e_contract.create.temp_list;

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var list = "";//列表
                        var arr = data.result ? data.result : [];
                        if (!arr || arr.length === 0) {

                        }
                        else {

                            $.each(arr, function (i, $item) {

                                var id = $item.id ? $item.id : "";//
                                var url = $item.url ? $item.url : "";//

                                list +=
                                    "<div class='item contract_temp_item' " +
                                    "data-id='" + id + "' " +
                                    "data-url='" + url + "'" +
                                    ">" +
                                    "<img src='image/icon_contract/icon_contract_temp.png' class='temp_img'>" +
                                    "<img src='image/icon_contract/icon_preview.png' class='icon_preview'>" +
                                    "<div class='icon_choose_bg'>" +
                                    "<img src='image/icon_contract/icon_choose.png'>" +
                                    "</div>" +
                                    "</div>"

                            });

                            $contract_temp_container.html(list);

                        }

                        contract_create.contractTempListInit();// 初始化

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
    //合同模板列表 初始化
    contractTempListInit: function () {
        var $contract_temp_container = $page1.find(".contract_temp_container");
        var $contract_temp_item = $contract_temp_container.find(".contract_temp_item");

        $contract_temp_item.each(function () {

            var $this = $(this);
            var id = $this.attr("data-id");//合同模板 id
            var url = $this.attr("data-url");//合同模板 url

            $this.bind({
                mouseover: function () {
                    $this.find(".icon_preview").show();

                    $this.find(".icon_preview").unbind("click").bind("click", function (e) {

                        e.stopPropagation();
                        // contract_create.contractPreview();//合同预览

                        window.open(url, 'newwindow',
                            'height=400,width=600,top=100,left=100,toolbar=no,menubar=no,' +
                            'scrollbars=no, resizable=no,location=no, status=no');

                    });

                },
                mouseleave: function () {
                    $this.find(".icon_preview").hide();
                },
                click: function (e) {
                    e.stopPropagation();

                    if ($this.hasClass("active")) {
                        $this.removeClass("active");
                        $this.find(".icon_choose_bg").hide();
                    }
                    else {
                        $this.addClass("active");
                        $this.find(".icon_choose_bg").show();
                        $this.siblings().removeClass("active").find(".icon_choose_bg").hide();
                    }
                }
            });

            /**
             * 如果是编辑合同状态
             * 选择合同模板id相同的赋值class为active
             **/
            if (contract_param.contract_temp_id && id === contract_param.contract_temp_id) {
                $this.addClass("active");
                $this.find(".icon_choose_bg").show();
                $this.siblings().removeClass("active").find(".icon_choose_bg").hide();
            }

        });

    },

    //初始化 合同填写项
    initContractItem: function () {

        var $table_container = $page1.find(".table_container");
        var $tbody = $table_container.find("tbody");
        $tbody.empty();

        /**
         * 如果是编辑合同状态
         * 赋值 合同签署人
         **/
        if (contract_param.contract_sign_arr) {

            for (var i = 0; i < contract_param.contract_sign_arr.length; i++) {

                var $param = contract_param.contract_sign_arr[i];

                var tel = $param.tel ? $param.tel : "";//签署人 手机
                var validDays = $param.validDays ? $param.validDays : "0";//签署 有效期
                var name = $param.name ? $param.name : "";//签署人 姓名

                //新增 一行填写项
                contract_create.addContractItem();

                var $item = $tbody.find("tr.item").eq(i);
                $item.find(".signer_phone").find("input").val(tel);
                $item.find(".effective_date").find("input").val(validDays);
                $item.find(".signer_name").find("input").val(name);

            }

        }
        //如果是 新增合同状态
        else {
            for (var i = 0; i < 1; i++) {
                //新增 一行填写项
                contract_create.addContractItem();
            }
        }

        $tbody.find("tr.item").first().find(".btn").remove();

    },
    //新增 一行填写项
    addContractItem: function () {

        var $table_container = $page1.find(".table_container");
        var $tbody = $table_container.find("tbody");

        if ($tbody.find("tr.item").length >= 30) {
            toastr.warning("最多只能新增30个签署人！");
            return;
        }

        var $tr = $("<tr>");
        $tr.addClass("item");
        $tr.appendTo($tbody);

        //signer_phone
        var $td_1 = $("<td>");
        $td_1.addClass("signer_phone");
        $td_1.appendTo($tr);
        var $div_1 = $("<div>");
        $div_1.appendTo($td_1);
        var $input_1 = $("<input>");
        $input_1.addClass("form-control");
        $input_1.attr({
            "placeholder": "请输入手机号",
            "maxlength": "11"
        });
        $input_1.bind("keyup", function () {
            this.value = this.value.replace(/\D/g, '');
        });
        $input_1.appendTo($div_1);

        //effective_date
        var $td_2 = $("<td>");
        $td_2.addClass("effective_date");
        $td_2.appendTo($tr);
        var $div_2 = $("<div>");
        $div_2.appendTo($td_2);
        var $input_2 = $("<input>");
        $input_2.addClass("form-control");
        $input_2.attr("maxlength", "3");
        $input_2.bind("keyup", function () {
            this.value = this.value.replace(/\D/g, '');
        });
        $input_2.appendTo($div_2);
        var $spn_2 = $("<span>");
        $spn_2.text("天");
        $spn_2.appendTo($div_2);

        //signer_name
        var $td_3 = $("<td>");
        $td_3.addClass("signer_name");
        $td_3.appendTo($tr);
        var $div_3 = $("<div>");
        $div_3.appendTo($td_3);
        var $input_3 = $("<input>");
        $input_3.addClass("form-control");
        $input_3.attr({
            "placeholder": "请输入签署人姓名",
            "maxlength": "8"
        });
        $input_3.appendTo($div_3);

        //删除
        var $td_4 = $("<td>");
        $td_4.addClass("operate");
        $td_4.appendTo($tr);
        var $div_4 = $("<div>");
        $div_4.addClass("btn");
        $div_4.addClass("btn-sm");
        $div_4.addClass("btn-danger");
        $div_4.addClass("btn_del");
        $div_4.text("删除");
        $div_4.unbind("click").bind("click", function () {
            contract_create.delContractItem(this);
        });
        $div_4.appendTo($td_4);

    },
    //删除 一行填写项
    delContractItem: function (self) {

        delWarning("确定要删除吗？", function () {

            var $item = $(self).closest(".item");
            $item.remove();

        });

    },

    //下一步
    stepNext: function () {

        var flag = false;
        var txt;

        var $contract_type_container = $page1.find(".contract_type_container");
        var $contract_temp_container = $page1.find(".contract_temp_container");

        contract_param.contract_type_id = $contract_type_container.find(".contract_type_item.active").attr("data-type");
        contract_param.contract_temp_id = $contract_temp_container.find(".contract_temp_item.active").attr("data-id");

        contract_param.contract_sign_arr = [];//
        var contract_item = $page1.find(".table_container").find("tbody tr.item");
        var length = 0;//输入项 是否正确
        for (var i = 0; i < contract_item.length; i++) {
            var $item = contract_item.eq(i);

            var signer_phone = $.trim($item.find(".signer_phone").find("input").val());
            if (signer_phone === "") {
                $item.find(".signer_phone").find("input").focus();
                length++;
                txt = "合同签署人手机号不能为空！";
                break;
            }
            if (!phone_reg.test(signer_phone)) {
                $item.find(".signer_phone").find("input").focus();
                length++;
                txt = "合同签署人手机号格式不对！";
                break
            }
            var effective_date = $.trim($item.find(".effective_date").find("input").val());
            if (effective_date === "") {
                $item.find(".effective_date").find("input").focus();
                length++;
                txt = "合同签署有效期不能为空！";
                break;
            }
            if (parseInt(effective_date) === 0) {
                $item.find(".effective_date").find("input").focus();
                length++;
                txt = "合同签署有效期要大于0！";
                break;
            }
            var signer_name = $.trim($item.find(".signer_name").find("input").val());
            if (signer_name === "") {
                $item.find(".signer_name").find("input").focus();
                length++;
                txt = "合同签署姓名不能为空！";
                break;
            }

            var obj = {
                tel: signer_phone,
                name: signer_name,
                validDays: effective_date
            };
            contract_param.contract_sign_arr.push(obj);

        }

        if ($contract_temp_container.find(".contract_temp_item").length === 0) {
            txt = "暂无合同模板，请先设置合同模板！";
        }
        else if (!contract_param.contract_temp_id) {
            txt = "请选择合同模板！";
        }
        else if (length > 0) {
        }
        else {
            flag = true;
        }


        if (txt) {
            toastr.warning(txt);
        }

        if (flag) {
            contract_create.initContractContent();//初始化 合同内容
            contract_create.initSealTempContainer();//初始化 印章模板
        }

    },


    /**
     * page2 内容操作
     **/

    //初始化 合同内容
    initContractContent: function () {
        $page2.show();
        $page1.hide();

        /**
         * 如果是编辑合同状态 并且 合同模板ID是 原合同中的 合同模板ID
         * 赋值 合同内容
         **/
        if (contract_param.sign_info && contract_param.contract_temp_id === contract_param.contract_temp_id_by_modify) {

            var $fill_content = $page2.find(".fill_content");
            $fill_content.empty();

            var list = '';
            $.each(contract_param.sign_info, function (i, $item) {

                var id = $item.id ? $item.id : "";//
                var key = $item.key ? $item.key : "";//
                var value = $item.value ? $item.value : "";//

                list +=
                    "<div class='col-xs-12 item' data-id='" + id + "'>" +
                    "<div class='col-xs-3 txt'>" + key + "：</div>" +
                    "<div class='col-xs-9'>" +
                    "<input class='form-control' value='" + value + "'>" +
                    "</div>" +
                    "</div>";

            });

            $fill_content.html(list);

        }
        //新增状态 或者 再次编辑时 合同模板ID 变了
        else {
            //根据 合同模板id 获取loops数组
            contract_create.loopsArrByContractId();
        }

    },
    //根据 合同模板id 获取loops数组
    loopsArrByContractId: function () {

        var $fill_content = $page2.find(".fill_content");
        $fill_content.empty();

        var obj = {
            id: contract_param.contract_temp_id
        };
        var url = urlGroup.e_contract.create.temp_loops+ "?" + jsonParseParam(obj);

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var list = "";//列表
                        var arr = data.result ? data.result : [];
                        if (!arr || arr.length === 0) {

                        }
                        else {

                            $.each(arr, function (i, $item) {

                                var id = $item.id ? $item.id : "";//
                                var key = $item.key ? $item.key : "";//

                                list +=
                                    "<div class='col-xs-12 item' data-id='" + id + "'>" +
                                    "<div class='col-xs-3 txt'>" + key + "：</div>" +
                                    "<div class='col-xs-9'>" +
                                    "<input class='form-control'>" +
                                    "</div>" +
                                    "</div>";

                            });

                            $fill_content.html(list);
                        }

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

    //初始化 印章模板container
    initSealTempContainer: function () {

        var $seal_img_container = $page2.find(".seal_img_container");
        $seal_img_container.empty();

        /**
         * 如果有印章img（编辑状态下）
         **/
        if (contract_param.seal_temp_img_url) {

            var $seal_img = $("<div>");
            $seal_img.addClass("seal_img");
            $seal_img.unbind("click").bind("click", function () {
                contract_create.sealTempModalShow();//印章模板 弹框显示
            });
            $seal_img.appendTo($seal_img_container);

            var $img = $("<img>");
            $img.attr("src", contract_param.seal_temp_img_url);
            $img.appendTo($seal_img);

        }
        //新增 状态
        else {

            var $add_container = $("<div>");
            $add_container.addClass("add_container");
            $add_container.unbind("click").bind("click", function () {
                contract_create.sealTempModalShow();//印章模板 弹框显示
            });
            $add_container.appendTo($seal_img_container);

            var $img_add = $("<img>");
            $img_add.attr("src", "image/icon_contract/icon_seal_add.png");
            $img_add.appendTo($add_container);

            var $txt = $("<div>");
            $txt.text("从模板库中选择");
            $txt.appendTo($add_container);

        }

    },
    //印章模板 弹框显示
    sealTempModalShow: function () {
        $seal_temp_modal.modal("show");
        contract_create.sealTempListInModal();//印章列表 获取（弹框中）
    },
    //印章列表 清空（弹框中）
    clearSealTempListInModal: function () {

        var $seal_temp_container = $seal_temp_modal.find(".seal_temp_container");
        var msg = "<div class='seal_none'>暂无印章</div>";
        $seal_temp_container.html(msg);

    },
    //印章列表 获取（弹框中）
    sealTempListInModal: function () {

        //印章列表 清空（弹框中）
        contract_create.clearSealTempListInModal();

        var url = urlGroup.e_contract.create.seal_list;

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var list = "";//列表
                        var arr = data.result ? data.result : [];
                        if (!arr || arr.length === 0) {

                        }
                        else {

                            $.each(arr, function (i, $item) {

                                var id = $item.id ? $item.id : "";//
                                var seal_img_url = $item.url ? $item.url : "";//

                                list +=
                                    "<div class='item' data-id='" + id + "'>" +
                                    "<img src='" + seal_img_url + "' class='seal_img'>" +
                                    "<div class='icon_choose_bg'>" +
                                    "<img src='image/icon_contract/icon_choose.png'>" +
                                    "</div>" +
                                    "</div>"

                            });

                            $seal_temp_modal.find(".seal_temp_container").html(list);

                        }

                        //印章列表 初始化（弹框中）
                        contract_create.sealTempListInitInModal();

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
    //印章列表 初始化（弹框中）
    sealTempListInitInModal: function () {
        var $item = $seal_temp_modal.find(".seal_temp_container").find(".item");

        if ($item.length > 0) {

            $item.each(function () {

                var $this = $(this);
                var id = $this.attr("data-id");

                /**
                 * 如果有印章图片ID（编辑时）
                 **/
                if (contract_param.seal_temp_id && contract_param.seal_temp_id === id) {
                    $this.addClass("active");
                }

                $this.unbind("click").bind("click", function () {
                    //印章模板 选择（弹框中）
                    contract_create.sealTempChoose(this);
                });

            });

        }

    },
    //印章模板 选择（弹框中）
    sealTempChoose: function (self) {
        var $self = $(self);

        $self.hasClass("active") ? $self.removeClass("active") :
            (
                $self.addClass("active"), $self.siblings().removeClass("active")
            )

    },
    //印章模板 保存（弹框中）
    sealTempSave: function () {

        var $item = $seal_temp_modal.find(".seal_temp_container").find(".item.active");
        if ($item.length > 0) {
            contract_param.seal_temp_id = $item.attr("data-id");
            contract_param.seal_temp_img_url = $item.find("img").attr("src");
            $seal_temp_modal.modal("hide");

            //显示印章图片
            var $seal_img_container = $page2.find(".seal_img_container");
            $seal_img_container.empty();

            var $seal_img = $("<div>");
            $seal_img.addClass("seal_img");
            $seal_img.unbind("click").bind("click", function () {
                contract_create.sealTempModalShow();//印章模板 弹框显示
            });
            $seal_img.appendTo($seal_img_container);

            var $img = $("<img>");
            $img.attr("src", contract_param.seal_temp_img_url);
            $img.appendTo($seal_img);

        }
        else {
            toastr.warning("请选择印章！");
        }

    },

    //上一步
    stepPrev: function () {
        $page2.hide();
        $page1.show();
    },
    //保存
    contractSave: function (state) {

        //检查 保存参数
        if (!contract_create.checkParamBySave()) {
            return;
        }

        var name;
        var txt;
        var send = false;

        if (state === 0) {
            name = "确认要保存吗？";
        }
        else {
            name = "确认要保存并发送吗？";
            txt = "该合同一旦发送成功，即不可撤回";
            send = true;
        }

        operateMsgShow(
            name,
            function () {

                loadingInit();
                var obj = {
                    eContractTemplateId: contract_param.contract_temp_id,
                    signers: contract_param.contract_sign_arr,
                    values: contract_param.sign_info,
                    eContractSealId: contract_param.seal_temp_id,
                    send: send
                };

                //编辑
                if (contract_param.contract_id) {

                    obj["id"] = contract_param.contract_id;

                    branPutRequest(
                        urlGroup.e_contract.manage.operate,
                        obj,
                        function (data) {
                            //alert(JSON.stringify(data))

                            if (data.code === RESPONSE_OK_CODE) {
                                toastr.success("保存成功！");

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

                }
                //新增保存
                else {

                    branPostRequest(
                        urlGroup.e_contract.manage.operate,
                        obj,
                        function (data) {
                            //alert(JSON.stringify(data))

                            if (data.code === RESPONSE_OK_CODE) {

                                toastr.success("保存成功！");

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
                }

            },
            txt
        );

    },
    //检查 保存参数
    checkParamBySave: function () {
        var flag = true;
        var txt;

        contract_param.sign_info = [];
        $page2.find(".fill_content").find(".item").each(function () {
            var $this = $(this);

            var id = $this.attr("data-id");
            var value = $.trim($this.find("input").val());

            if (value === "") {
                var name = $this.find(".txt").html();
                name = name.split("：")[0];

                txt = name + "不能为空！";
                $this.find("input").focus();
                flag = false;
                return false;
            }

            var obj = {
                eContractTemplateLoopsId: id,
                value: value
            };
            contract_param.sign_info.push(obj);

        });

        if (!contract_param.seal_temp_id && flag) {
            txt = "公司印章未选择！";
            flag = false;
        }

        if (txt) {
            toastr.warning(txt);
        }

        return flag;
    },

    //获取合同详情
    contractDetail: function (succFunc, errFunc) {

        loadingInit();

        var obj = {
            id: contract_param.contract_id
        };
        var url = urlGroup.e_contract.detail.detail_for_modify+ "?" + jsonParseParam(obj);

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var $item = data.result;

                        contract_param.contract_type_id = 0;//默认劳动合同
                        contract_param.contract_temp_id = $item.eContractTemplateId ? $item.eContractTemplateId : "";//电子合同模板ID
                        contract_param.contract_temp_id_by_modify = $item.eContractTemplateId ? $item.eContractTemplateId : "";//电子合同模板ID
                        contract_param.contract_sign_arr = $item.signers ? $item.signers : [];//合同签署人
                        contract_param.sign_info = $item.values ? $item.values : [];// 电子合同填写项
                        contract_param.seal_temp_id = $item.eContractSealId ? $item.eContractSealId : "";// 印章文件ID
                        contract_param.seal_temp_img_url = $item.eContractSealUrl ? $item.eContractSealUrl : "";// 印章文件url

                        if (succFunc)
                            succFunc();
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

//合同 参数
var contract_param = {
    contract_id: null,//合同ID （编辑时有值，新增时为空）

    contract_type_id: null,//合同类型 id
    contract_temp_id: null,//合同模板 id
    contract_temp_id_by_modify: null,//再次编辑时 （原合同中的 合同模板 ID）
    contract_sign_arr: null,//合同签署 数组

    sign_info: null,//合同签署 信息
    seal_temp_id: null,//印章 id
    seal_temp_img_url: null,//印章 url


    //初始化 参数（置空）
    contractParamInit: function () {
        contract_param.contract_id = null;
        contract_param.contract_type_id = null;
        contract_param.contract_temp_id = null;
        contract_param.contract_sign_arr = null;
        contract_param.sign_info = null;
        contract_param.seal_temp_id = null;
    }

};

$(function () {
    contract_create.init();
});
