/**
 * Created by CuiMengxin on 2016/10/11.
 * 同意入职 提醒
 */

var $entry_info_modal = $(".entry_info_modal");//同意入职弹框

var entry_expire_manage = {

	totalPage: 10,//一共 的页数
	currentPage: 1,//当前页
	containerName: "",

	Init: function () {

		entry_expire_manage.containerName = ".entry_expire_container";
		entry_expire_manage.getEmpList();//获取 同意入职员工列表

	},

	//获取 同意入职员工列表
	getEmpList: function () {
		var $table = $(entry_expire_manage.containerName).find(".table_container table");

		var obj = {};
		obj.page = entry_expire_manage.currentPage;
		obj.page_size = "10";

		loadingInit();

		branPostRequest(
			urlGroup.home.entry_expire.list,
			obj,
			function (data) {
				//alert(JSON.stringify(data));
				//console.log(data);

				if (data.code == 1000) {

					entry_expire_manage.totalPage = data.result.totalPage;//总页数
					if (entry_expire_manage.currentPage > entry_expire_manage.totalPage) {
						entry_expire_manage.currentPage -= 1;
						entry_expire_manage.getEmpList();
						return;
					}

					var list = "";
					var employees = data.result.models;
					if (!employees || employees.length == 0) {
						list = "<tr><td colspan='12'>暂无可同意入职员工</td></tr>";
					}
					else {
						for (var i = 0; i < employees.length; i++) {
							var item = employees[i];

							var emp_id = item.id;//员工id
							var emp_version = item.version;//员工版本
							var emp_name = item.fullName;//员工姓名
							var emp_phone = item.phoneNo;//手机号码
							var check_in_time = item.checkinTime;//入职时间
							check_in_time = timeInit(check_in_time);
							var post_name = item.positionName;//职位名称
							var workShift_name = item.workShiftName;//班组名称
							var workLine_name = item.workLineName;//工段名称
							var dept_name = item.departmentName;//部门名称
							var exam_id = item.examId;//体检id
							var remark = item.face_match ? item.face_match : "";//备注信息

							//体检信息
							var physical_examination_td = "<td class='physical_examination'></td>";
							if (exam_id) {
								physical_examination_td = "<td class='physical_examination' " +
									"data-id='" + exam_id + "' " +
									"onclick='entry_expire_manage.getEmpPhysicalExamDetail(this)'>" +
									"<div class='txt clr_ff6600'>已提交</div>" +
									"</td>"
							}

							//备注
							if (remark) {
								switch (remark) {
									case 1:
										remark = "<div class='remark_info'>匹配度较低</div>";
										break;
									default:
										remark = "<div class='remark_info'>无匹配信息</div>";
										break;
								}
							}

							list += "<tr class='item emp_item' " +
								"data-id='" + emp_id + "' " +
								"data-version='" + emp_version + "' >" +
								"<td class='choose_item' onclick='entry_expire_manage.chooseItem(this)'>" +
								"<img src='image/UnChoose.png'/>" +
								"</td>" +
								"<td class='emp_no'>" + (i + 1) + "</td>" +
								"<td class='emp_name'>" + emp_name + "</td>" +
								"<td class='emp_phone'>" + emp_phone + "</td>" +
								"<td class='emp_check_in_time'>" + check_in_time + "</td>" +
								"<td class='emp_post'>" + post_name + "</td>" +
								"<td class='emp_workShift'>" + workShift_name + "</td>" +
								"<td class='emp_workLine'>" + workLine_name + "</td>" +
								"<td class='emp_dept'>" + dept_name + "</td>" +
								"<td class='remark'>" + remark + "</td>" +
								physical_examination_td +
								"<td class='operate'>" +
								"<span class='btn btn-sm btn-success btn_agree'>同意入职</span>" +
								"<span class='btn btn-sm btn-success btn_detail'>查看详情</span>" +
								"</td>" +
								"</tr>"

						}
					}

					$table.find("tbody").html(list);
					entry_expire_manage.empListInit();//员工列表 初始化

				}
				else {
					branError(data.msg);
				}

			},
			function (error) {
				branError(error);
			});

	},
	//员工列表 初始化
	empListInit: function () {
		var $table = $(entry_expire_manage.containerName).find(".table_container table");
		var $item = $table.find("tbody .item");
		var $page_container = $(entry_expire_manage.containerName).find('.pager_container');

		if ($item.length == 0) {
			$page_container.hide();
		}
		else {
			$item.each(function () {

				//同意入职
				$(this).find(".btn_agree").click(function () {
					entry_expire_manage.entryOnly(this);
				});

				//查看详情
				$(this).find(".btn_detail").click(function () {
					entry_expire_manage.getEmpDetail(this);
				});

			});

			var options = {
				bootstrapMajorVersion: 3, //版本  3是ul  2 是div
				//containerClass:"sdfsaf",
				//size: "small",//大小
				alignment: "left",//对齐方式
				currentPage: entry_expire_manage.currentPage, //当前页数
				totalPages: entry_expire_manage.totalPage, //总页数
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

					//var currentTarget = $(event.currentTarget);
					entry_expire_manage.currentPage = page;
					entry_expire_manage.getEmpList();

				}
			};

			var ul = '<ul class="pagenation" style="float:right;"></ul>';
			$page_container.show();
			$page_container.html(ul);
			$page_container.find("ul").bootstrapPaginator(options);
		}

		//是否 已经全部选择
		optChoose.isChooseAll(
			entry_expire_manage.containerName,
			function () {
				entry_expire_manage.checkIsChoose();//检查 是否选中
			}
		);

	},

	//选中当前行
	chooseItem: function (self) {

		optChoose.chooseItem(
			self,
			entry_expire_manage.containerName,
			function () {
				entry_expire_manage.checkIsChoose();//检查 是否选中
			}
		);

	},
	//选择全部
	chooseAll: function () {

		optChoose.chooseAll(
			entry_expire_manage.containerName,
			function () {
				entry_expire_manage.checkIsChoose();//检查 是否选中
			}
		);

	},
	//检查 是否选中
	checkIsChoose: function () {
		var $table = $(entry_expire_manage.containerName).find(".table_container table");
		var $item_active = $table.find("tbody .item.active");
		var $btn_agree = $(entry_expire_manage.containerName).find(".foot .btn_agree");

		if ($item_active.length > 0) {
			$btn_agree.addClass("btn-success").removeClass("btn-default");
		}
		else {
			$btn_agree.addClass("btn-default").removeClass("btn-success");
		}

	},

	//同意入职 (单个员工)
	entryOnly: function (self) {
		entry_info.AgreeArray = [];

		var $item = $(self).closest(".item");

		var id = $item.attr("data-id");
		var version = $item.attr("data-version");
		var name = $item.find(".emp_name").html();

		var obj = {
			"id": id,
			"version": version,
			"name": name
		};

		entry_info.AgreeArray.push(obj);

		var entryDate = $item.find(".emp_check_in_time").html();//员工入职时间

		//检查 入职时间是否是当天
		entry_info.checkIsToday(entryDate, function () {
			entry_expire_manage.entryModalShow();//同意入职 弹框显示
		});

	},
	//同意入职 (多个员工)
	entryMore: function () {
		entry_info.AgreeArray = [];//初始化

		var $item_active = $(entry_expire_manage.containerName).find(".table_container")
			.find("table tbody").find(".item.active");

		if ($item_active.length == 0) {
			toastr.warning("您没有选择用户");
			return
		}
		else {
			$item_active.each(function () {

				var id = $(this).attr("data-id");
				var version = $(this).attr("data-version");
				var name = $(this).find(".emp_name").html();

				var obj = {
					"id": id,
					"version": version,
					"name": name
				};

				entry_info.AgreeArray.push(obj);

			});
		}

		var entryDate = $item_active.first().find(".emp_check_in_time").html();//员工入职时间

		//检查 入职时间是否是当天
		entry_info.checkIsToday(entryDate, function () {
			entry_expire_manage.entryModalShow();//同意入职 弹框显示
		});

	},
	//同意入职 弹框显示
	entryModalShow: function () {
		$entry_info_modal.modal("show");

		//同意入职 弹框出现后执行方法

		entry_info.init();//初始化方法

		var $btn = $("<div>");
		$btn.addClass("btn");
		$btn.addClass("btn-orange");
		$btn.addClass("btn_agree");
		$btn.html("确定");
		$btn.attr("onclick", "entry_expire_manage.entryAgree()");

		$entry_info_modal.find(".modal-footer").html($btn);

	},
	//同意入职 确认
	entryAgree: function () {

		$entry_info_modal.find(".btn_agree").removeAttr("onclick");
		setTimeout(function () {
			$entry_info_modal.find(".btn_agree").attr("onclick", "entry_expire_manage.entryAgree()");
		}, 2000);

		entry_info.entryAgree(
			function () {
				entry_expire_manage.getEmpList();//获取 同意入职员工列表
			},
			function () {

			}
		);

	},

	//查询员工体检详情
	getEmpPhysicalExamDetail: function (self) {
		var exam_id = $(self).attr("data-id");
		if (!exam_id) {
			return;
		}

		var tabId = "emp_exam_" + exam_id;//tab中的id
		var pageName = $(self).closest(".item").find(".emp_name").html() + "的体检信息";

		sessionStorage.setItem("currentTabID", tabId);//当前 tab id
		sessionStorage.setItem("CurrentPhyExamId", exam_id);//当前体检id

		getInsidePageDiv(urlGroup.employee.physical_exam.index, tabId, pageName);
	},

	//查看员工详情 - 待入职员工列表
	getEmpDetail: function (self) {
		var $item = $(self).closest(".item");

		var entryDate = $item.find(".emp_check_in_time").html();
		var id = $item.attr("data-id");
		var tabId = "emp_prospective_" + id;//tab中的id
		var pageName = $item.find(".emp_name").html() + "的个人资料";

		sessionStorage.setItem("entryDate", entryDate);//该员工入职时间
		sessionStorage.setItem("CurrentEmployeeId", id);//当前员工id
		sessionStorage.setItem("currentTabID", tabId);//当前 tab id

		getInsidePageDiv(urlGroup.employee.prospective_detail.index, tabId, pageName);

	}

};

$(function () {
	entry_expire_manage.Init();
});

