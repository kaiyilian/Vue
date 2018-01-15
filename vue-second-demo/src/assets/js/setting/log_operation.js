/**
 * Created by Administrator on 2016/6/21.
 * 操作 日志
 */

var log_operation = {
	containerName: "",
	currentPage: 1,//当前页面
	totalPage: 0,//总页数
	current_moduleId: "",//操作模块id
	current_typeId: "",//操作类型id

	init: function () {
		log_operation.containerName = ".log_operation_container";

		log_operation.initParam();//初始化 参数
		log_operation.initTime();//初始化 时间
		log_operation.getModuleList();//获取 操作模块 列表
		log_operation.getLogList();//获取 日志

	},
	//初始化 参数
	initParam: function () {
		log_operation.current_moduleId = "";//操作模块id
		log_operation.current_typeId = "";//操作类型id

		$(log_operation.containerName).find(".operation_type_container").hide();

	},
	//初始化 时间
	initTime: function () {
		//入职时间 开始
		var start = {
			elem: "#log_beginTime",
			event: 'focus', //触发事件
			format: 'YYYY-MM-DD',
			min: "", //设定最小日期为当前日期
			max: '', //最大日期
			istime: false,//是否开启时间选择
			istoday: false, //是否显示今天
			choose: function (datas) {

			}
		};

		//入职时间 结束
		var end = {
			elem: "#log_endTime",
			event: 'focus', //触发事件
			format: 'YYYY-MM-DD',
			min: "",
			max: "",
			istime: false,
			istoday: false,
			choose: function (datas) {
			}
		};

		laydate(start);
		laydate(end);

	},

	//获取 操作模块 列表
	getModuleList: function () {
		var $search_container = $(log_operation.containerName).find(".search_container");
		var $module_container = $search_container.find(".operation_module_container");

		loadingInit();

		branGetRequest(
			urlGroup.setting.log.module_list,
			function (data) {
				//alert(JSON.stringify(data));

				if (data.code == 1000) {

					var list = "<option value=''>请选择</option>";
					var modules = data.result.modules;
					if (!modules || modules.length == 0) {
					}
					else {
						for (var i = 0; i < modules.length; i++) {
							var item = modules[i];

							var id = item.id;//
							var name = item.name;//

							list += "<option value='" + id + "'>" + name + "</option>";

						}
					}
					$module_container.find("select").html(list);

					log_operation.getOpTypeList();//获取 操作类型 列表 （对应操作模块）
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
	//获取 操作类型 列表 （对应操作模块）
	getOpTypeList: function () {

		var $search_container = $(log_operation.containerName).find(".search_container");
		var $module_container = $search_container.find(".operation_module_container");
		var $operation_type_container = $search_container.find(".operation_type_container");

		log_operation.current_moduleId = $module_container.find("select")
			.find("option:selected").val();

		if (!log_operation.current_moduleId) {
			$operation_type_container.hide();
			return;
		}

		var obj = {};
		obj.module_id = log_operation.current_moduleId;
		var url = urlGroup.setting.log.type_list+ "?" + jsonParseParam(obj);

		loadingInit();

		branGetRequest(
			url,
			function (data) {
				//alert(JSON.stringify(data));

				if (data.code == 1000) {

					var list = "<option value=''>请选择</option>";
					var types = data.result.types;
					if (!types || types.length == 0) {
					}
					else {
						for (var i = 0; i < types.length; i++) {
							var item = types[i];

							var id = item.id;//
							var name = item.name;//

							list += "<option value='" + id + "'>" + name + "</option>";

						}
					}

					$operation_type_container.show().find("select").html(list);

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
	//更改 操作类型后
	opTypeListChange: function () {
		var $search_container = $(log_operation.containerName).find(".search_container");
		var $operation_type_container = $search_container.find(".operation_type_container");

		log_operation.current_typeId = $operation_type_container.find("select")
			.find("option:selected").val();
	},

	//查询按钮 点击事件
	btnSearchClick: function () {
		log_operation.currentPage = 1;//

		log_operation.getLogList();//查询 日志
	},
	//获取 日志
	getLogList: function () {
		var $search_container = $(log_operation.containerName).find(".search_container");
		var $table = $(log_operation.containerName).find(".table_container table");

		//开始时间
		var startTime = $.trim($search_container.find(".beginTime").val());
		startTime = startTime == "" ? "" : new Date(startTime).getTime();
		//结束时间
		var endTime = $.trim($search_container.find(".endTime").val());
		endTime = endTime == "" ? "" : new Date(endTime).getTime();
		if (startTime && endTime && startTime > endTime) {
			toastr.warning("开始时间不能大于结束时间！");
			return;
		}

		var obj = {};
		obj.module_id = log_operation.current_moduleId;
		obj.type_id = log_operation.current_typeId;
		obj.start_time = startTime;
		obj.end_time = endTime;
		obj.page = log_operation.currentPage;
		obj.page_size = '10';
		var url = urlGroup.setting.log.operation_list+ "?" + jsonParseParam(obj);

		loadingInit();

		branGetRequest(
			url,
			function (data) {
				//alert(JSON.stringify(data));

				if (data.code == 1000) {

					log_operation.totalPage = data.result.pages;//总页数
					if (log_operation.currentPage > log_operation.totalPage) {
						log_operation.currentPage -= 1;
						log_operation.getLogList();
						return;
					}

					var list = "";
					var logs = data.result.logs;
					if (!logs || logs.length == 0) {
						list = "<tr><td colspan='4'>暂无日志</td></tr>";
					}
					else {

						for (var i = 0; i < logs.length; i++) {
							var item = logs[i];

							var id = item.id;//
							var operator_id = item.operator_id;//
							var operator_name = item.operator_name;//
							var log_content = item.log;//
							var log_time = item.time;
							log_time = new Date(log_time).toLocaleString();

							list +=
								"<tr class='item log_item' data-id='" + id + "'>" +
								"<td>" + (i + 1) + "</td>" +
								"<td class='log_operator' " +
								"data-id='" + operator_id + "'>" +
								operator_name +
								"</td>" +
								"<td class='log_content'>" + log_content + "</td>" +
								"<td class='log_time'>" + log_time + "</td>" +
								"</tr>";

						}

					}

					$table.find("tbody").html(list);
					log_operation.logListInit();
				}
				else {
					branError(data.msg)
				}
			},
			function (error) {
				//alert(JSON.stringify(error))
				branError(error)
			}
		);

	},
	//列表 初始化
	logListInit: function () {
		var $table = $(log_operation.containerName).find(".table_container table");
		var $item = $table.find("tbody .item");
		var $pager_container = $(log_operation.containerName).find(".pager_container");

		if ($item.length == 0) {
			$pager_container.hide();
			return
		}
		var options = {
			bootstrapMajorVersion: 3, //版本  3是ul  2 是div
			//containerClass:"sdfsaf",
			//size: "small",//大小
			alignment: "right",//对齐方式
			currentPage: log_operation.currentPage, //当前页数
			totalPages: log_operation.totalPage, //总页数
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

				//var currentTarget = $(event.currentTarget);

				log_operation.currentPage = page;
				log_operation.getLogList();//查询按钮 点击事件

			}

		};

		var ul = '<ul class="pagenation" style="float:right;"></ul>';
		$pager_container.show();
		$pager_container.html(ul);
		$pager_container.find(".pagenation").bootstrapPaginator(options);
	}


};

$(function () {
	log_operation.init();
});