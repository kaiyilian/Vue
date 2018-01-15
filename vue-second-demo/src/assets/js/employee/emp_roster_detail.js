/**
 * Created by CuiMengxin on 2016/12/15.
 * 花名册详情
 */

var $body = $("body");

var emp_roster_detail = {
	containerName: "",//

	//初始化
	init: function () {
		emp_roster_detail.containerName = ".emp_roster_detail_container";

		emp_detail.getEmpDetail(
			urlGroup.employee.roster_detail.detail,
			emp_roster_detail.containerName,
			function () {

			},
			function (error) {
				branError(error);
				$(emp_roster_detail.containerName).hide();
			});


	},

	//附件下载
	enclosureDown: function () {

		exportModalShow("确认下载员工资料吗？", function () {

			loadingInit();

			var id = sessionStorage.getItem("CurrentEmployeeId");//员工id
			var ids = [];
			ids.push(id);

			var type = 2;//1 待入职 2 在职

			if ($body.find(".enclosure_down").length > 0) {
				$body.find(".enclosure_down").remove();
			}

			var form = $("<form>");
			form.addClass("enclosure_down");
			form.attr("enctype", "multipart/form-data");
			form.attr("action", urlGroup.employee.roster.attachment_down);
			form.attr("method", "get");
			form.appendTo($body);
			form.hide();

			form.append($("<input>").attr("name", "employee_ids").attr("value", ids));
			form.append($("<input>").attr("name", "type").attr("value", type));

			loadingRemove();
			form.submit();

		});
	}

};

$(function () {
	emp_roster_detail.init();
});