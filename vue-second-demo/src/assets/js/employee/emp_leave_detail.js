/**
 * Created by CuiMengxin on 2016/12/15.
 * 离职员工 详情
 */

var emp_leave_detail = {

	containerName: "",//

	//初始化
	init: function () {
		emp_leave_detail.containerName = ".emp_leave_detail_container";

		emp_detail.getEmpDetail(
			urlGroup.employee.leave_detail.detail,
			emp_leave_detail.containerName,
			function () {
			},
			function (error) {
				branError(error);
				$(emp_leave_detail.containerName).hide();
			});

	}

};

$(function () {
	emp_leave_detail.init();
});
