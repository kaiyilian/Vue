/**
 * Created by Administrator on 2016/7/11.
 * 用户 账号管理
 */

var $user_account_add_modal = $(".user_account_add_modal");
var $user_account_modify_modal = $(".user_account_modify_modal");

var account_manage = {

	totalPage: 10,//一共 的页数
	currentPage: 1,//当前页
	DelArray: [],//删除 用户id数组
	containerName: "",

	//初始化
	init: function () {

		account_manage.initParam();//初始化 参数
		account_manage.getUserList();	//获取 用户列表

		$user_account_add_modal.on('shown.bs.modal', function () {

			var $modal_body = $user_account_add_modal.find(".modal-body");
			$modal_body.find(".account_no_add input").val("");
			$modal_body.find(".account_pwd_add input").val("");
			$modal_body.find(".account_pwd_sure input").val("");

		});

		$user_account_modify_modal.on('shown.bs.modal', function () {

			var $modal_body = $user_account_modify_modal.find(".modal-body");
			$modal_body.find(".account_new_pwd input").val("");
			$modal_body.find(".account_new_pwd_sure input").val("");

		});

	},
	//初始化 参数
	initParam: function () {
		account_manage.containerName = ".account_manage_container";
		account_manage.DelArray = [];
	},

	//获取 用户列表
	getUserList: function () {
		var $table = $(account_manage.containerName).find(".table_container table");

		var obj = {};
		obj.page = account_manage.currentPage;
		obj.page_size = "10";

		var url = urlGroup.perm.account.list+ "?" + jsonParseParam(obj);

		loadingInit();

		branGetRequest(
			url,
			function (data) {
				//alert(JSON.stringify(data))

				if (data.code == 1000) {

					account_manage.totalPage = data.result.total_page;//
					if (account_manage.currentPage > account_manage.totalPage) {
						account_manage.currentPage -= 1;
						account_manage.getUserList();
						return;
					}

					if (data.result) {

						var list = "";//
						var users = data.result.result;
						if (!users || users.length == 0) {
							list = "<tr><td colspan='5'>查询结果为空</td></tr>";
						}
						else {
							for (var i = 0; i < users.length; i++) {
								var item = users[i];

								var version = item.version;//
								var user_id = item.userId;//
								var account_no = item.name;//
								var account_create_time = item.createTime;//
								account_create_time = timeInit(account_create_time);
								var last_login_time = item.lastLoginTime;//
								last_login_time = timeInit(last_login_time);

								list +=
									"<tr class='item account_item' " +
									"data-id='" + user_id + "' " +
									"data-version='" + version + "'>" +
									"<td class='choose_item' onclick='account_manage.chooseItem(this)'>" +
									"<img src='image/UnChoose.png'/>" +
									"</td>" +
									"<td class='account_no'>" + account_no + "</td>" +
									"<td class='create_time'>" + account_create_time + "</td>" +
									"<td class='last_login_time'>" + last_login_time + "</td>" +
									"<td class='operate'>" +
									"<span class='btn btn-sm btn-success' " +
									"onclick='account_manage.accountModifyModalShow(this)'>密码重置</span>" +
									"</td>" +
									"</tr>"
							}

						}

						$table.find("tbody").html(list);
						account_manage.userListInit();//

					}
				}
				else {
					branError(data.msg);
				}

			},
			function (error) {
				branError(error);
			}
		);

	},
	//用户列表 初始化
	userListInit: function () {
		var $table = $(account_manage.containerName).find(".table_container table");
		var $item = $table.find("tbody .item");
		var $pager_container = $(account_manage.containerName).find('.pager_container');

		if ($item.length == 0) {
			$pager_container.hide();
		}
		else {
			var options = {
				bootstrapMajorVersion: 3, //版本  3是ul  2 是div
				//containerClass:"sdfsaf",
				//size: "small",//大小
				alignment: "left",//对齐方式
				currentPage: account_manage.currentPage, //当前页数
				totalPages: account_manage.totalPage, //总页数
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

					var currentTarget = $(event.currentTarget);
					account_manage.currentPage = page;
					account_manage.getUserList();

				}
			};

			var ul = "<ul class='pagenation' style='float:right;'></ul>";
			$pager_container.show();
			$pager_container.html(ul);
			$pager_container.find('ul').bootstrapPaginator(options);
		}

		//是否 已经全部选择
		optChoose.isChooseAll(
			account_manage.containerName,
			function () {
				account_manage.checkIsChoose();//检查 是否选中
			}
		);

	},

	//选择单行
	chooseItem: function (self) {

		optChoose.chooseItem(
			self,
			account_manage.containerName,
			function () {
				account_manage.checkIsChoose();//检查 是否选中
			}
		);

	},
	//选择全部
	chooseAll: function () {

		optChoose.chooseAll(
			account_manage.containerName,
			function () {
				account_manage.checkIsChoose();//检查 是否选中
			}
		);

	},
	//检查 是否选中
	checkIsChoose: function () {
		var $table = $(account_manage.containerName).find(".table_container table");
		var $item_active = $table.find("tbody .item.active");
		var $btn_del = $(account_manage.containerName).find(".foot .btn_del");

		if ($item_active.length > 0) {
			$btn_del.addClass("btn-success").removeClass("btn-default");
		}
		else {
			$btn_del.addClass("btn-default").removeClass("btn-success");
		}
	},

	//删除账号 多项删除
	accountDelMore: function () {
		account_manage.DelArray = [];

		var $table = $(account_manage.containerName).find(".table_container table");
		var $item_active = $table.find("tbody .item.active");

		if ($item_active.length == 0) {
			toastr.warning("您没有选择用户");
			return
		}

		for (var i = 0; i < $item_active.length; i++) {
			var id = $item_active.eq(i).attr("data-id");
			var version = $item_active.eq(i).attr("data-version");

			var obj = {
				"id": id,
				"version": version
			};

			account_manage.DelArray.push(obj);

		}

		account_manage.accountDel();//删除账号

	},
	//删除账号
	accountDel: function () {

		delWarning("确认要删除选中的用户吗？", function () {

			loadingInit();

			var obj = new Object();
			obj.ids = account_manage.DelArray;

			branPostRequest(
                urlGroup.perm.account.del,
				obj,
				function (data) {
					//alert(JSON.stringify(data))

					if (data.code == 1000) {
						toastr.success("删除成功！");
						account_manage.getUserList();
					}
					else {
						branError(data.msg)
					}
				},
				function (error) {
					branError(error)
				}
			);

		});

	},

	//新增用户 弹框显示
	accountAddModalShow: function () {
		$user_account_add_modal.modal("show");
	},
	//新增用户
	accountAdd: function () {
		$user_account_add_modal.find(".btn_save").removeAttr("onclick");
		setTimeout(function () {
			$user_account_add_modal.find(".btn_save").click(function () {
				account_manage.accountAdd()();
			});
		}, 2000);

		if (!account_manage.checkParamByAccountAdd()) {
			return
		}

		var $modal_body = $user_account_add_modal.find(".modal-body");

		var obj = {};
		obj.name = $.trim($modal_body.find(".account_no_add input").val());//用户名
		obj.password = $.trim($modal_body.find(".account_pwd_add input").val());//密码
		obj.confirmPassword = $.trim($modal_body.find(".account_pwd_sure input").val());//确认密码

		loadingInit();

		branPostRequest(
			urlGroup.perm.account.add,
			obj,
			function (data) {
				//alert(JSON.stringify(data))

				if (data.code == 1000) {
					toastr.success("新增成功！");
					$user_account_add_modal.modal("hide");
					account_manage.getUserList();
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
	//新增用户 - 检查参数
	checkParamByAccountAdd: function () {
		var flag = false;
		var txt = "";

		var $modal_body = $user_account_add_modal.find(".modal-body");
		var $add_no = $.trim($modal_body.find(".account_no_add input").val());
		var $add_pwd = $.trim($modal_body.find(".account_pwd_add input").val());
		var $add_pwd_sure = $.trim($modal_body.find(".account_pwd_sure input").val());

		if ($add_no == "") {
			txt = "账号不能为空！";
		}
		else if ($add_pwd == "") {
			txt = "密码不能为空！";
		}
		else if ($add_pwd_sure == "") {
			txt = "确认密码不能为空！";
		}
		else if ($add_pwd_sure != $add_pwd) {
			txt = "两次密码输入不一致，请重新输入！";
		}
		else {
			flag = true;
		}

		if (txt) {
			toastr.warning(txt);
		}

		return flag;

	},

	//修改用户密码 弹框显示
	accountModifyModalShow: function (self) {
		var $item = $(self).closest(".item");

		current_user.id = $item.attr("data-id");
		current_user.version = $item.attr("data-version");

		$user_account_modify_modal.modal("show");
	},
	//修改用户密码 确认
	AccountModifySure: function () {

		if (!account_manage.checkParamByAccountModify()) {
			return
		}

		var $modal_body = $user_account_modify_modal.find(".modal-body");

		var obj = new Object();
		obj.id = current_user.id;//用户id
		obj.version = current_user.version;//当前的版本号,用于锁定
		obj.password = $.trim($modal_body.find(".account_new_pwd input").val());//新密码
		obj.confirmPassword = $.trim($modal_body.find(".account_new_pwd_sure input").val());//确认密码

		loadingInit();

		branPostRequest(
            urlGroup.perm.account.modify,
			obj,
			function (data) {
				//alert(JSON.stringify(data))

				if (data.code == 1000) {
					toastr.success("密码修改成功！");
					$user_account_modify_modal.modal("hide");

					account_manage.getUserList();
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
	//修改用户密码 - 检查参数
	checkParamByAccountModify: function () {
		var flag = false;
		var txt = "";

		var $modal_body = $user_account_modify_modal.find(".modal-body");
		var $modify_new_pwd = $.trim($modal_body.find(".account_new_pwd input").val());
		var $modify_new_pwd_sure = $.trim($modal_body.find(".account_new_pwd_sure input").val());

		if ($modify_new_pwd == "") {
			txt = "请输入新密码！";
		}
		else if ($modify_new_pwd_sure == "") {
			txt = "请输入确认密码！";
		}
		else if ($modify_new_pwd_sure != $modify_new_pwd) {
			txt = "两次密码输入不一致，请重新输入！";
		}
		else {
			flag = true;
		}

		if (txt) {
			toastr.warning(txt);
		}

		return flag;

	}


};

var current_user = {
	id: "",
	version: ""
};

$(function () {
	account_manage.init();
});