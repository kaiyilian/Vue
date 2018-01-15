/**
 * Created by CuiMengxin on 2016/8/3.
 * pc端体检信息
 */

var phy_exam = {

	$report_container: "",//报告单 container
	$detail_container: "",//详情
	physical_exam_id: "",//体检id

	Init: function () {
		var $page = $("#page_" + sessionStorage.getItem("currentTabID"));
		phy_exam.$report_container = $page.find(".physical_examination_report");
		phy_exam.$detail_container = $page.find(".physical_examination_detail");

		phy_exam.physical_exam_id = sessionStorage.getItem("CurrentPhyExamId");//

		phy_exam.PhysicalExamDetail();
	},
	//获取体检详情
	PhysicalExamDetail: function () {
		var obj = new Object();
		obj.exam_id = phy_exam.physical_exam_id;

		var url = urlGroup.employee.physical_exam.detail+ "?" + jsonParseParam(obj);

		branGetRequest(url, function (data) {
			//alert(JSON.stringify(data));

			if (data.code == 1000) {

				var $result = data.result;
				var examId = $result.examId;//体检单唯一标识
				var name = $result.name;//姓名
				var examTime = $result.examTime;//体检时间
				var examCode = $result.examCode;//体检单号
				var cardNumber = $result.cardNumber;//身份证/护照
				var examResult = $result.examResult;//体检结果
				var examAdvise = $result.examAdvise;//体检建议

				var $user_info_container = phy_exam.$report_container.find(".user_info_container");
				$user_info_container.find(".user_name").html(name);
				$user_info_container.find(".physical_examination_date").html(examTime);
				$user_info_container.find(".physical_examination_no").html(examCode);

				var $phy_exam_result_container = phy_exam.$report_container.find(".physical_examination_result_container");
				$phy_exam_result_container.find(".physical_examination_result").html(examResult);
				$phy_exam_result_container.find(".physical_examination_advice").html(examAdvise);

				var detail_list = "";
				for (var i = 0; i < $result.items.length; i++) {
					var item = $result.items[i];

					var category = item.category;//分类,

					var content_list = "";//每个分类 对应的 内容
					for (var j = 0; j < item.details.length; j++) {
						var detail_item = item.details[j];

						var itemName = detail_item.itemName;//分类项
						var result = detail_item.result;//分类结果
						if (!result) {
							result = "- -"
						}
						var unit = detail_item.unit;//分类单位
						if (!unit) {
							unit = "- -"
						}
						var range = detail_item.range;//分类标准
						if (!range) {
							range = "- -"
						}
						var qualified = detail_item.qualified;//0  正常范围 1 超出范围


						content_list +=
							"<div class='row item' data-qualified='" + qualified + "'>" +
							"<div class='col-xs-3 name'>" + itemName + "</div>" +
							"<div class='col-xs-3 result'>" + result + "</div>" +
							"<div class='col-xs-3 standard'>" + range + "</div>" +
							"<div class='col-xs-3 unit'>" + unit + "</div>" +
							"</div>";
					}

					detail_list +=
						"<div class='block item_container col-xs-12'>" +
						"<div class='title'>" + category + "</div>" +
						"<div class='head col-xs-12'>" +
						"<div class='col-xs-3'>项目</div>" +
						"<div class='col-xs-3'>结果</div>" +
						"<div class='col-xs-3'>参考标准</div>" +
						"<div class='col-xs-3'>单位</div>" +
						"</div>" +
						"<div class='content col-xs-12'>" + content_list + "</div>" +
						"</div>"

				}
				phy_exam.$detail_container.html(detail_list);

				phy_exam.PhysicalExamInit();//体检详情 初始化
			}
			else {
				branError(data.msg)
			}

		}, function (error) {
			branError(error)
		})
	},
	//体检详情 初始化
	PhysicalExamInit: function () {
		phy_exam.$detail_container.find(".block").each(function () {
			$(this).find(".content .item").each(function () {
				var qualified = $(this).attr("data-qualified");//0  正常范围 1 超出范围

				if (qualified == 1) {
					$(this).addClass("is_bad");
				}

			});
		});
	}
};

$(function () {
	phy_exam.Init();
});