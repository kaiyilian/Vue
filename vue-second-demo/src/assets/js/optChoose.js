/**
 * Created by CuiMengxin on 2016/12/20.
 * 选择 操作
 */

//选择 item(操作)
var optChoose = {

	//选择单项
	chooseItem: function (self, containerName, successFunc) {
		var $item = $(self).closest(".item");

		if ($item.hasClass("active")) { //如果选中行
			$item.removeClass("active");
			$(self).find("img").attr("src", "image/UnChoose.png")
		}
		else { //如果未选中
			$item.addClass("active");
			$(self).find("img").attr("src", "image/Choosed.png")
		}

		optChoose.isChooseAll(containerName, successFunc);//是否 已经全部选择
	},

	//选择全部
	chooseAll: function (containerName, successFunc) {
		var $table = $(containerName).find(".table_container table");
		var $item = $table.find("tbody .item");
		var $choose_container = $(containerName).find(".foot")
			.find(".choose_container");

		if ($choose_container.hasClass("active")) {   //已经选中
			$choose_container.removeClass("active")
				.find("img").attr("src", "image/UnChoose.png");
			$item.removeClass("active").find("img").attr("src", "image/UnChoose.png");
		}
		else {
			$choose_container.addClass("active")
				.find("img").attr("src", "image/Choosed.png");
			$item.addClass("active").find("img").attr("src", "image/Choosed.png");
		}

		successFunc();//回调
	},

	//是否 已经全部选择
	isChooseAll: function (containerName, successFunc) {
		var $table = $(containerName).find(".table_container table");
		var $item = $table.find("tbody .item");
		var $item_active = $table.find("tbody .item.active");
		var $choose_container = $(containerName).find(".foot")
			.find(".choose_container");

		//没有全部选中
		if ($item_active.length == 0 || $item_active.length < $item.length) {
			$choose_container.removeClass("active")
				.find("img").attr("src", "image/UnChoose.png");
		}
		else {
			$choose_container.addClass("active")
				.find("img").attr("src", "image/Choosed.png");
		}

		successFunc();//回调
	}

};
