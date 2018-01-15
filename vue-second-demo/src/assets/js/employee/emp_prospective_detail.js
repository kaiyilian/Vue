/**
 * Created by CuiMengxin on 2016/12/15.
 * 待入职员工 详情
 */

/**
 *  sessionStorage.setItem("entryDate", entryDate);//该员工入职时间
 */

var $entry_info_modal = $(".entry_info_modal");//同意入职弹框
var $body = $("body");

var emp_prospective_detail = {
	containerName: "",

	//初始化
	Init: function () {
		emp_prospective_detail.containerName = ".emp_prospective_detail_container";

		emp_detail.getEmpDetail(
			urlGroup.employee.prospective_detail.detail,
			emp_prospective_detail.containerName,
			function () {

			},
			function (error) {
				branError(error);
				$(emp_prospective_detail.containerName).hide();
			}
		);

	},

	//同意入职 (单个员工)
	entryOnly: function (self) {
		entry_info.AgreeArray = [];

		var $page_container = $("#page_" + sessionStorage.getItem("currentTabID"));
		$container = $page_container.find(emp_prospective_detail.containerName);

		var id = sessionStorage.getItem("CurrentEmployeeId");
		var version = $(self).closest(".detail_container").attr("data-version");
		var name = $container.find(".info_container .user_info .user_name").html();


		var obj = {
			"id": id,
			"version": version,
			"name": name
		};

		entry_info.AgreeArray.push(obj);

		var entryDate = sessionStorage.getItem("entryDate");//该员工入职时间

		//检查 入职时间是否是当天
		entry_info.checkIsToday(entryDate, function () {
			//debugger
			emp_prospective_detail.entryModalShow();//同意入职 弹框显示
		});

	},
	//同意入职 弹框显示
	entryModalShow: function () {
		$entry_info_modal.modal("show");

		//同意入职 弹框出现后执行方法

		entry_info.init();//初始化方法

		var $btn = $("<button>");
		$btn.addClass("btn");
		$btn.addClass("btn-success");
		$btn.addClass("btn_agree");
		$btn.html("确定");
		$btn.attr("onclick", "emp_prospective_detail.entryAgree()");

		$entry_info_modal.find(".modal-footer").html($btn);

	},
	//同意入职 确认
	entryAgree: function () {
		var $page_container = $("#page_" + sessionStorage.getItem("currentTabID"));
		$container = $page_container.find(emp_prospective_detail.containerName);

		$entry_info_modal.find(".btn_agree").removeAttr("onclick");
		setTimeout(function () {
			$entry_info_modal.find(".btn_agree")
				.attr("onclick", "emp_prospective_detail.entryAgree()");
		}, 2000);

		entry_info.entryAgree(
			function () {

				$container.find(".btn_degree").remove();//同意入职 弹框移除

			},
			function () {

			}
		);

	},

	//附件下载
	enclosureDown: function () {

		exportModalShow("确认下载员工资料吗？", function () {

			loadingInit();

			var $page_container = $("#page_" + sessionStorage.getItem("currentTabID"));
			$container = $page_container.find(emp_prospective_detail.containerName);

			var phone = $container.find(".info_container .user_info .user_phone").html();
			var user_phone = [];
			user_phone.push(phone);
			//userPhone = "['" + userPhone + "']";
			//userPhone = eval("(" + userPhone + ")");

			var type = 1;//1 待入职 2 在职

			if ($body.find(".enclosure_down").length > 0) {
				$body.find(".enclosure_down").remove();
			}

			var form = $("<form>");
			form.addClass("enclosure_down");
			form.attr("enctype", "multipart/form-data");
			form.attr("action", urlGroup.employee.prospective_detail.attachment_down);
			form.attr("method", "get");
			form.appendTo($body);
			form.hide();

			form.append($("<input>").attr("name", "employee_ids").attr("value", user_phone));
			form.append($("<input>").attr("name", "type").attr("value", type));

			loadingRemove();
			form.submit();

		});

	}

};

$(function () {
	emp_prospective_detail.Init();
});