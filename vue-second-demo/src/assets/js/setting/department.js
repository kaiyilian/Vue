/**
 * Created by Jack on 2016/5/19.
 * 部门列表页面
 */

var $tree = $("#tree");
var $dept_add_modal = $(".dept_add_modal");
var $dept_edit_modal = $(".dept_edit_modal");

var department = {

    zTreeObj: Object,//
    zNodes: [
        //{id: 1, pId: 0, name: "父节点 1", open: true, cid: 1},
        //{id: 11, pId: 1, name: "叶子节点 1-1", cid: 11},
        //{id: 12, pId: 1, name: "叶子节点 1-2"},
        //{id: 13, pId: 1, name: "叶子节点 1-3"},
        //{id: 2, pId: 0, name: "父节点 2", open: true},
        //{id: 21, pId: 2, name: "叶子节点 2-1"},
        //{id: 22, pId: 2, name: "叶子节点 2-2"},
        //{id: 23, pId: 2, name: "叶子节点 2-3"},
        //{id: 3, pId: 0, name: "父节点 3", open: true},
        //{id: 31, pId: 3, name: "叶子节点 3-1"},
        //{id: 32, pId: 3, name: "叶子节点 3-2"},
        //{id: 33, pId: 3, name: "叶子节点 3-3"}
    ],//部门列表 数组
    setting: {},//ztree 设置参数
    DelArray: [],//删除的 数组
    treeNode: "",//当前操作的节点
    isRootNode: false,//是否是根节点
    containerName: "",//
    itemLength: 30,//单层部门数

    //初始化
    init: function () {
        department.DelArray = [];
        department.containerName = ".department_setting_container";

        //获取部门列表
        department.getDeptList(
            function (deptList) {
                //if (deptList.length == 0) {   //部门为空
                //	//deptList = [];
                //	$tree.hide();
                //	return
                //}

                department.zNodes = deptList;
                department.setting = {
                    view: {
                        selectedMulti: false,//禁止选择多项
                        dblClickExpand: false,//双击节点 不切换 展开状态
                        addHoverDom: department.addHoverDom,//当鼠标移动到节点上时，显示用户自定义控件
                        removeHoverDom: department.removeHoverDom //当鼠标移出到节点时，隐藏用户自定义控件
                    },
                    edit: {
                        enable: true,//是否可编辑
                        editNameSelectAll: true,//txt 内容是否为全选状态
                        showRemoveBtn: true,
                        removeTitle: "删除节点",
                        showRenameBtn: true,
                        renameTitle: "编辑节点名称"
                    },
                    callback: {
                        //编辑
                        beforeEditName: department.beforeEditName,

                        //删除
                        beforeRemove: department.beforeRemove,
                        onRemove: department.onRemove

                    },
                    data: {
                        simpleData: {   //简单数据格式
                            enable: true
                        }
                    }
                };

                department.zTreeObj = $.fn.zTree.init(
                    $tree,
                    department.setting,
                    department.zNodes
                );
                department.zTreeObj.expandAll(true);//全部展开

            },
            function (error) {
                branError(error)
            }
        );

        //新增节点 弹框显示
        $dept_add_modal.on("shown.bs.modal", function (e) {

            $dept_add_modal.find(".dept_name input").val("");

        });

        //编辑节点 弹框显示
        $dept_edit_modal.on("shown.bs.modal", function (e) {

            $dept_edit_modal.find(".dept_name input").val(department.treeNode.dept_name);

        })
    },

    //获取部门列表
    getDeptList: function (succFun, errFun) {
        loadingInit();

        branGetRequest(
            urlGroup.employee.department_structure.list,
            function (data) {
                //console.log("部门Tree：");
                //console.log(data);

                if (data.code == 1000) {

                    var deptList = [];//树列表
                    var result = data.result;
                    if (!result || result.length == 0) {
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];

                            var pId = item.parent_id;//

                            //是根节点
                            if (pId == "" || pId == null || pId == "null") {
                                pId = 0;
                            }
                            var id = item.department_id;//
                            var name = item.department_name ? item.department_name : "";//部门名称
                            var count = item.department_count ? item.department_count : 0;//部门人数
                            var showName = name + "(" + count + "人)";//显示的姓名
                            var version = item.version;//该部门version

                            //0 根节点 1 子节点
                            var iconSkin = pId == 0 ? "rootNode" : "subNode";

                            var obj = {
                                "id": id,
                                "pId": pId,
                                "name": showName,
                                "dept_name": name,
                                "dept_count": count,
                                "version": version,
                                "iconSkin": iconSkin
                            };

                            deptList.push(obj);

                            //if (deptList == "") {
                            //
                            //	//deptList += pid == 0 ?
                            //	//	(
                            //	//		"{'id':'" + id + "'" +
                            //	//		"," + "'pId':'" + pid + "'" +
                            //	//		"," + "'name':'" + name + "'" +
                            //	//		"," + "'version':'" + version + "'" +
                            //	//		"," + "'iconSkin':'rootNode'" +
                            //	//		"}"
                            //	//	) :
                            //	//	("{'id':'" + id + "','pId':'" + pid + "','name':'" + name +
                            //	//	"','version':'" + version + "','iconSkin':'subNode'}")
                            //}
                            //else {
                            //	deptList += pid == 0 ?
                            //		(",{'id':'" + id + "','pId':'" + pid + "','name':'" + name +
                            //		"','version':'" + version + "','iconSkin':'rootNode'}") :
                            //		(",{'id':'" + id + "','pId':'" + pid + "','name':'" + name +
                            //		"','version':'" + version + "','iconSkin':'subNode'}")
                            //}

                        }
                    }

                    succFun(deptList);//回掉

                }
                else {
                    //alert(data.msg)
                    errFun(data.msg)
                }

            },
            function (error) {
                errFun("error:" + JSON.stringify(error))
            })

    },

    //鼠标移到 部门上 显示添加按钮
    addHoverDom: function (treeId, treeNode) {
        var $addBtn = $("#addBtn_" + treeNode.tId);//新增 icon
        $addBtn.unbind("click").bind("click", function () {

            if (treeNode.level >= 4) {
                toastr.warning("最多只能添加5层部门！");
                return
            }

            var length = 0;
            var children = department.zTreeObj.getNodeByTId(treeNode.tId).children;
            if (children)
                length = children.length;

            if (length >= department.itemLength) {
                toastr.warning("每个部门下面最多添加" + department.itemLength + "个子部门！");
                return;
            }

            department.treeNode = treeNode;//赋值当前操作的节点
            department.isRootNode = false;//不是根节点

            department.deptAddModalShow();

        });

        var sObj = $("#" + treeNode.tId + "_span");//当前节点的 span

        if (treeNode.editNameFlag || $addBtn.length > 0) {
            return;
        }

        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='新增部门' onfocus='this.blur();'></span>";
        sObj.after(addStr);

    },
    //鼠标移出部门 ，添加按钮移除
    removeHoverDom: function (treeId, treeNode) {
        $("#addBtn_" + treeNode.tId).unbind().remove();
    },
    //编辑
    beforeEditName: function (treeId, treeNode) {

        department.treeNode = treeNode;//赋值当前操作的节点

        $dept_edit_modal.modal("show");

        return false;
    },
    //删除
    beforeRemove: function (treeId, treeNode) {
        //var flag = false;

        if (treeNode.isParent) {
            toastr.warning("不能删除父级部门，请先确认子部门已全部删除！");
        }
        else {
            department.treeNode = treeNode;
            department.deptRemove();//删除节点
        }

        return false;
    },

    //新增根节点
    addRootNode: function () {
        function filter(node) {
            return (node.level == 0);
        }

        var nodes = department.zTreeObj.getNodesByFilter(filter); // 查找根节点节点集合
        if (nodes.length >= department.itemLength) {
            toastr.warning("最多只能有" + department.itemLength + "个一级部门！");
            return
        }

        department.isRootNode = true;//是根节点
        department.deptAddModalShow();//新增节点弹框显示

    },
    //新增节点弹框显示
    deptAddModalShow: function () {
        $dept_add_modal.modal("show");
    },
    //新增节点 保存
    deptAddSave: function () {
        var name = $.trim($dept_add_modal.find(".dept_name input").val());
        if (name == "") {
            toastr.warning("部门名称不能为空！");
            return;
        }
        else if (name.length > 32) {
            toastr.warning("部门名称不能超过32位！");
            return;
        }

        var zTree = $.fn.zTree.getZTreeObj("tree");

        var pId;
        if (department.isRootNode) {    //是根节点
            pId = null;
        }
        else {
            pId = zTree.getNodeByTId(department.treeNode.tId).id;
        }

        var obj = {};
        obj.parent_id = pId;
        obj.department_name = name;

        loadingInit();

        branPostRequest(
            urlGroup.employee.department_structure.add,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {
                    toastr.success("新增成功！");
                    $dept_add_modal.modal("hide");
                    $tree.show();

                    var id = data.result.department_id;
                    var version = data.result.version;//

                    if (department.isRootNode) {     //根节点
                        zTree.addNodes(null, {
                            id: id,
                            pId: pId,
                            name: name,
                            version: version,
                            iconSkin: 'rootNode'
                        });
                    }
                    else {
                        zTree.addNodes(department.treeNode, {
                            id: id,
                            pId: pId,
                            name: name,
                            version: version,
                            iconSkin: 'subNode'
                        });
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

    //编辑节点 保存
    deptEditSave: function () {
        var zTree = $.fn.zTree.getZTreeObj("tree");

        var id = zTree.getNodeByTId(department.treeNode.tId).id;
        var version = zTree.getNodeByTId(department.treeNode.tId).version;
        var name = $dept_edit_modal.find(".dept_name input").val();

        if (name == "") {
            toastr.warning("部门名称不能为空！");
            return;
        }
        else if (name.length > 32) {
            toastr.warning("部门名称不能超过32位！");
            return;
        }

        var obj = {};
        obj.version = version;
        obj.department_id = id;
        obj.department_name = name;

        loadingInit();

        branPostRequest(
            urlGroup.employee.department_structure.edit,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code == 1000) {
                    toastr.success("编辑成功！");
                    $dept_edit_modal.modal("hide");

                    department.treeNode.dept_name = name;
                    var count = department.treeNode.dept_count ? department.treeNode.dept_count : 0;
                    department.treeNode.name = name + "(" + count + "人)";
                    zTree.getNodeByTId(department.treeNode.tId).version = data.result.version;
                    zTree.updateNode(department.treeNode);

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

    //删除 节点
    deptRemove: function () {

        delWarning("确定删除该部门吗？", function () {

            loadingInit();

            var id = department.zTreeObj.getNodeByTId(department.treeNode.tId).id;//该部门id
            var version = department.zTreeObj.getNodeByTId(department.treeNode.tId).version;//

            var obj = {};
            obj.department_id = id;
            obj.version = version;

            branPostRequest(
                urlGroup.employee.department_structure.del,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code == 1000) {
                        toastr.success("删除成功！");

                        department.zTreeObj.removeNode(department.treeNode);

                    }
                    else {
                        branError(data.msg);
                    }

                },
                function (error) {
                    branError(error);
                }
            );

        });

    },

    // echarts 导出
    export: function () {
        branGetRequest(
            urlGroup.employee.department_structure.excel_export,
            function (data) {
                if (data.code == 1000) {
                    console.log("data: " + data);
                    setTimeout(function () {
                        $(".dept_export_container").modal("show");
                    }, 0);

                    var
                        myChart = echarts.init(document.getElementById('dept_export_div')),

                        option = {
                            title: {
                                text: '部门架构'
                            },
                            animation: false,
                            toolbox: {
                                show: true,
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    restore: {show: true},
                                    saveAsImage: {
                                        show: true,
                                        title: '保存为图片',
                                        type: 'jpeg'
                                    }
                                }
                            },
                            series: [
                                {
                                    name: '树图',
                                    type: 'tree',
                                    orient: 'horizontal',  // vertical horizontal
                                    rootLocation: {x: 100, y: 230}, // 根节点位置  {x: 100, y: 'center'}
                                    nodePadding: 8,
                                    layerPadding: 200,
                                    hoverable: false,
                                    roam: true,
                                    symbolSize: 6,
                                    itemStyle: {
                                        normal: {
                                            color: '#4883b4',
                                            label: {
                                                show: true,
                                                position: 'right',
                                                formatter: "{b}",
                                                textStyle: {
                                                    color: '#000',
                                                    fontSize: 5
                                                }
                                            },
                                            lineStyle: {
                                                color: '#ccc',
                                                type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed'

                                            }
                                        },
                                        emphasis: {
                                            color: '#4883b4',
                                            label: {
                                                show: false
                                            },
                                            borderWidth: 0
                                        }
                                    },
                                    data: data.result || []
                                }
                            ]
                        };

                    // 为echarts对象加载数据
                    myChart.setOption(option);


                } else {
                    branError(data.msg)
                }
            },
            function (error) {
                branError("error:" + JSON.stringify(error))
            });
    }

};

$(function () {
    department.init();
});
