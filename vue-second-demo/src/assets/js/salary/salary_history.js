/**
 * Created by Administrator on 2017/12/4.
 * 薪资 - 历史
 */

var $salary_history_container = $(".salary_history_container");
var $tb_salary_history = $salary_history_container.find("#tb_salary_history");//表格id
var $salary_validity_modal = $(".salary_validity_modal");//有效期设置 弹框

var salary_history = {
    validity: "0",//有效期

    init: function () {

        salary_history.initTB();//初始化 表格
        salary_history.initValidity();//初始化 获取有效期

        $salary_validity_modal.on("shown.bs.modal", function () {

            $salary_validity_modal.find(".salary_validity select").val(salary_history.validity);

        });

    },
    //初始化 表格
    initTB: function () {

        $tb_salary_history.bootstrapTable("destroy");
        //表格的初始化
        $tb_salary_history.bootstrapTable({

            undefinedText: "",                   //当数据为 undefined 时显示的字符
            striped: false,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）

            // data: tb_data,                         //直接从本地数据初始化表格
            uniqueId: "id",

            //分页
            pagination: true,                   //是否显示分页（*）
            onlyPagination: true,               //只显示分页 页码
            pageNumber: 1,                      //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [5, 10, 15],              //可供选择的每页的行数（*）

            //排序
            sortable: true,                     //所有列的排序 是否开启
            sortOrder: "asc",                   //排序方式
            // silentSort: false,                   //排序方式
            // sortName: "emp_work_sn",                    //定义排序列,通过url方式获取数据填写字段名，否则填写下标

            width: "100%",
            height: 600,
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
                    field: "salary_month",
                    title: "",
                    align: "center",
                    class: "salary_month",
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
                    field: "salary_name",
                    title: "发薪名称",
                    align: "center",
                    class: "salary_name",
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
                    field: "salary_user_count",
                    title: "发薪人数",
                    align: "center",
                    class: "salary_user_count",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "<div>0</div>";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "salary_sign_count",
                    title: "签收人数",
                    align: "center",
                    class: "salary_sign_count",
                    formatter: function (value, row, index) {
                        // console.log(value);

                        var html = "<div>0</div>";
                        if (value) {
                            html = "<div title='" + value + "'>" + value + "</div>";
                        }

                        return html;
                    }
                },
                {
                    field: "salary_send_time",
                    title: "发送时间",
                    align: "center",
                    class: "salary_send_time",
                    formatter: function (value, row, index) {
                        // console.log(value);
                        var html = "";
                        if (value) {
                            value = timeInit2(value);
                            html = "<div title='" + value + "'>" + value + "</div>";
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

                        //查看明细
                        html += "<div class='btn btn-success btn-sm btn_detail'>查看明细</div>";

                        //导出签收表
                        html += "<div class='btn btn-success btn-sm btn_export'>导出签收表</div>";

                        html += "</div>";

                        return html;

                    },
                    events: {

                        //查看明细
                        "click .btn_detail": function (e, value, row, index) {

                            // var id = row.id;
                            // var tabId = "emp_roster_" + id;//tab中的id
                            // var pageName = row.emp_name + "的个人资料";

                            console.log("查看明细：" + new Date().getTime());

                            if (row.id)
                                sessionStorage.setItem("salaryBatchId", row.id);//批次id

                            getInsidePageDiv(urlGroup.salary.detail.index, 'salary_detail');

                        },
                        //导出签收表
                        "click .btn_export": function (e, value, row, index) {

                            operateMsgShow(
                                "是否确定要导出签收表？",
                                function () {

                                    var obj = {
                                        salaryInfoId: row.id
                                    };

                                    loadingInit();

                                    branPostRequest(
                                        urlGroup.salary.history.excel_export,
                                        obj,
                                        function (data) {
                                            //alert(JSON.stringify(data))

                                            if (data.code === RESPONSE_OK_CODE) {

                                                if (data.result) {

                                                    var url = data.result.url ? data.result.url : "";
                                                    if (!url) {
                                                        toastr.warning("无法下载，下载链接为空！");
                                                        return;
                                                    }

                                                    toastr.success("导出成功！");

                                                    var aLink = document.createElement('a');
                                                    aLink.download = "";
                                                    aLink.href = url;
                                                    aLink.click();

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
                                ""
                            )

                        }

                    }
                }

            ],

            sidePagination: "server",           //分页方式：client 客户端分页，server 服务端分页（*）
            method: "get",
            contentType: "application/x-www-form-urlencoded",
            url: urlGroup.salary.history.list,
            //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
            //设置为limit可以获取limit, offset, search, sort, order
            queryParamsType: "undefined",
            queryParams: function queryParams(params) {   //设置查询参数

                // console.log(params);

                var obj = {
                    page: params.pageNumber,
                    page_size: params.pageSize
                };

                // console.log(obj);
                return obj;
            },
            onLoadSuccess: function () {  //加载成功时执行

                var data = $tb_salary_history.bootstrapTable('getData', true);
                //合并单元格
                salary_history.mergeCells(data, "salary_month", 1, $tb_salary_history);

            },
            onLoadError: function () {  //加载失败时执行
                debugger
                // layer.msg("加载数据失败", {time: 1500, icon: 2});
            },
            responseHandler: function (res) {
                console.log("获取薪资单历史：" + new Date().getTime());

                setTimeout(function () {
                    loadingRemove();
                }, 500);

                var tb_data = [];
                var s = [
                    {
                        salary_month: "2017年06月",
                        salary_name: "春节福利",
                        salary_time: "2017-09-09 10:40:00"
                    },
                    {
                        salary_month: "2017年06月",
                        salary_name: "春节福利",
                        salary_time: "2017-09-09 10:40:00"
                    },
                    {
                        salary_month: "2017年06月",
                        salary_name: "春节福利",
                        salary_time: "2017-09-09 10:40:00"
                    },
                    {
                        salary_month: "2017年06月",
                        salary_name: "春节福利",
                        salary_time: "2017-09-09 10:40:00"
                    },
                    {
                        salary_month: "2017年06月",
                        salary_name: "春节福利",
                        salary_time: "2017-09-09 10:40:00"
                    },
                    {
                        salary_month: "2017年06月",
                        salary_name: "春节福利",
                        salary_time: "2017-09-09 10:40:00"
                    },
                    {
                        salary_month: "2017年07月",
                        salary_name: "春节福利",
                        salary_time: "2017-09-09 10:40:00"
                    },
                    {
                        salary_month: "2017年07月",
                        salary_name: "春节福利",
                        salary_time: "2017-09-09 10:40:00"
                    },
                    {
                        salary_month: "2017年07月",
                        salary_name: "春节福利",
                        salary_time: "2017-09-09 10:40:00"
                    }
                ];
                var total_rows = 0;//总条数

                if (res.code === RESPONSE_OK_CODE) {

                    if (res.result) {
                        total_rows = res.result.total_rows ? res.result.total_rows : 0;//总条数

                        var arr = res.result.result;
                        if (arr && arr.length > 0) {

                            for (var i = 0; i < arr.length; i++) {
                                var item = arr[i];

                                var id = item.id ? item.id : "";//发薪年份
                                var infoYear = item.infoYear ? item.infoYear : "";//发薪年份
                                var infoMonth = item.infoMonth ? item.infoMonth : "";//发薪月份
                                var salaryName = item.salaryName ? item.salaryName : "";//发薪名称
                                var sendCount = item.sendCount ? item.sendCount : 0;//发薪人数
                                var signCount = item.signCount ? item.signCount : 0;//签收人数
                                var sendTime = item.sendTime ? item.sendTime : "";//发送时间

                                var obj = {

                                    id: id,
                                    salary_month: infoYear + "年" + infoMonth + "月",
                                    salary_name: salaryName,
                                    salary_user_count: sendCount,
                                    salary_sign_count: signCount,
                                    salary_send_time: sendTime

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

            },

            formatNoMatches: function () {
                return '暂无历史薪资';
            }

        });

    },
    //初始化 获取有效期
    initValidity: function () {
        loadingInit();

        branPostRequest(
            urlGroup.salary.history.validity,
            {},
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {
                        salary_history.validity = data.result.validity ? data.result.validity : "0";
                    }
                    else {
                        toastr.warning(data.msg);
                    }

                    //判断 薪资单有效期
                    var txt = parseInt(salary_history.validity) ? parseInt(salary_history.validity) : "";
                    txt = txt ? txt + "个月" : "永久";

                    $salary_history_container.find(".salary_validity").html(txt);

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

    //有效期 弹框显示
    salaryValidityModalShow: function () {
        $salary_validity_modal.modal("show");
    },
    //有效期保存
    salaryValiditySave: function () {

        var validity = $salary_validity_modal.find(".salary_validity select").val();

        var obj = {
            salaryCorpUserId: localStorage.getItem("user_id"),
            validityStatus: validity
        };

        loadingInit();

        branPostRequest(
            urlGroup.salary.history.validity_save,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    toastr.success("保存成功！");
                    $salary_validity_modal.modal("hide");
                    salary_history.initValidity();//初始化 获取有效期

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

    /**
     * 合并单元格
     * @param data  原始数据（在服务端完成排序）
     * @param fieldName 合并属性名称
     * @param colspan   合并列
     * @param target    目标表格对象
     */
    mergeCells: function (data, fieldName, colspan, target) {

        //声明一个map计算相同属性值在data对象出现的次数和
        var sortMap = {};
        for (var i = 0; i < data.length; i++) {

            //遍历item中的每一项
            for (var prop in data[i]) {

                //如果是对应的属性
                if (prop === fieldName) {

                    var key = data[i][prop];//根据key获取value，并赋值给map中作为key

                    if (sortMap.hasOwnProperty(key)) {
                        sortMap[key] = sortMap[key] * 1 + 1;
                    }
                    else {
                        sortMap[key] = 1;
                    }
                    break;

                }

            }

        }
        // for (var prop in sortMap) {
        //     console.log(prop, sortMap[prop])
        // }
        var index = 0;
        for (var prop in sortMap) {
            var count = sortMap[prop] * 1;
            $(target).bootstrapTable('mergeCells', {index: index, field: fieldName, colspan: colspan, rowspan: count});
            index += count;
        }
    }

};

$(function () {
    salary_history.init();
});

