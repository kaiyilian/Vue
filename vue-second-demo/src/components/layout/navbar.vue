<template>

    <nav class="navbar-default navbar-static-side" role="navigation" id="navbar_layout">

        <div class="sidebar-collapse">

            <ul class="nav" id="side-menu">

                <li class="active">

                    <a href="">
                        <i class="fa icon-index"></i>
                        <span class="nav-label" onclick="getInsidePageDiv(urlGroup.home.index,'index')">
						首页
					</span>
                    </a>

                </li>

                <li>

                    <a href="">
                        <i class="fa icon-emp-manage"></i>
                        <span class="nav-label">员工管理</span>
                        <span class="fa arrow"></span>
                    </a>

                    <ul class="nav nav-second-level">

                        <li>
                            <a class="J_menuItem" data-id="emp_prospective_list"
                               onclick="getInsidePageDiv(urlGroup.employee.prospective.index,
                           'emp_prospective_list','员工入职')">
                                员工入职
                            </a>
                        </li>


                        <li>
                            <a class="J_menuItem" data-id="emp_roster_list"
                               onclick="getInsidePageDiv(urlGroup.employee.roster.index,
                           'emp_roster_list', '花名册')">花名册</a>
                        </li>


                        <li>
                            <a class="J_menuItem" data-id="emp_leave_list"
                               onclick="getInsidePageDiv(urlGroup.employee.leave.index,
                           'emp_leave_list', '离职员工')">离职员工</a>
                        </li>


                        <li>
                            <a class="J_menuItem" data-id="department_structure"
                               onclick="getInsidePageDiv(
							   urlGroup.employee.department_structure.index,'department_structure',
							   '部门')">组织架构</a>
                        </li>

                        <li>
                            <a class="J_menuItem" data-id="common_setting"
                               onclick="getInsidePageDiv(
							   urlGroup.employee.setting.index,'common_setting',
							   '设置')">员工配置</a>
                        </li>

                    </ul>

                </li>

                <li>
                    <a href="">
                        <i class="fa icon-schedule-manage"></i>
                        <span class="nav-label">考勤管理</span>
                        <span class="fa arrow"></span>
                    </a>
                    <ul class="nav nav-second-level">


                        <li>
                            <a class="J_menuItem" data-id="schedule_manage"
                               onclick="getInsidePageDiv(urlGroup.attendance.schedule.index,
							   'schedule_manage','班次管理')">班次管理</a>
                        </li>


                        <li>
                            <a class="J_menuItem" data-id="schedule_rule"
                               onclick="getInsidePageDiv(urlGroup.attendance.schedule_rule.index,
							   'schedule_rule')">排班规律</a>
                        </li>


                        <li>
                            <a class="J_menuItem" data-id="schedule_view"
                               onclick="getInsidePageDiv(urlGroup.attendance.schedule_view.index,
						   'schedule_view','排班视图')">排班视图</a>
                        </li>


                        <li>
                            <a class="J_menuItem" data-id="attendance_detail"
                               onclick="getInsidePageDiv(urlGroup.attendance.attendance_detail.index,
                    'attendance_detail','出勤明细')">
                                出勤明细
                            </a>
                        </li>


                        <li>
                            <a class="J_menuItem" data-id="attendance_summary"
                               onclick="getInsidePageDiv(urlGroup.attendance.summary.index,
						   'attendance_summary','出勤汇总')">
                                出勤汇总
                            </a>
                        </li>


                        <li>
                            <a class="J_menuItem" data-id="approval_manage"
                               onclick="getInsidePageDiv(urlGroup.attendance.approval.index,
							   'approval_manage','审批管理')">
                                审批管理
                            </a>
                        </li>

                        <li>
                            <a class="J_menuItem" data-id="attendance_setting"
                               onclick="getInsidePageDiv(urlGroup.attendance.setting.index,
						   'attendance_setting','出勤配置')">
                                出勤配置
                            </a>
                        </li>

                    </ul>
                </li>

                <li>
                    <a href="">
                        <i class="fa icon-salary-manage"></i>
                        <span class="nav-label">薪资管理</span>
                        <span class="fa arrow"></span>
                    </a>
                    <ul class="nav nav-second-level">

                        <li>
                            <a class="J_menuItem" data-id="salary_create"
                               onclick="getInsidePageDiv(urlGroup.salary.create.index,
								   'salary_create','导入薪资单')">
                                导入薪资单
                            </a>
                        </li>


                        <li>
                            <a class="J_menuItem" data-id="salary_history"
                               onclick="getInsidePageDiv(urlGroup.salary.history.index,'salary_history','历史薪资单')">
                                历史薪资单
                            </a>
                        </li>

                    </ul>
                </li>

                <li>
                    <a href="">
                        <i class="fa icon-contract-manage"></i>
                        <span class="nav-label">电子合同</span>
                        <span class="fa arrow"></span>
                    </a>
                    <ul class="nav nav-second-level">
                        <li>
                            <a class="J_menuItem" data-id="contract_manage"
                               onclick="getInsidePageDiv(urlGroup.e_contract.manage.index,
							   'contract_manage','合同管理')">
                                合同管理
                            </a>
                        </li>


                    </ul>
                </li>

            </ul>

        </div>

    </nav>

</template>

<script>
    import "../../assets/lib/metisMenu/jquery.metisMenu"
    import "../../assets/lib/slimscroll/jquery.slimscroll.min"
    import "../../assets/js/hplus.min"

    export default {
        name: "navbar",
        data() {
            return {}
        },
        created: function () {
            // this.toastr.warning("222");
            // toastr.warning("333");
            // console.log($);
            // console.log($(window));
            this.$nextTick(function () {

                // alert(124)
            });
        },
        mounted:function () {
            // import("../../assets/lib/metisMenu/jquery.metisMenu");
            // import("../../assets/lib/slimscroll/jquery.slimscroll.min");
            // import("../../assets/js/hplus.min")
        }
    }

</script>

<style scoped>

    body.canvas-menu .navbar-static-side, body.fixed-sidebar .navbar-static-side {
        width: 176px;
        background-color: #333645;
    }

    .nav > li > a i {
    }

    #navbar_layout {

    }

    #navbar_layout .sidebar-collapse {
        padding-bottom: 130px;
        /*position: relative;*/
        height: 100%;
        width: auto;
    }

    #side-menu {
        background-color: #333645;
    }

    #side-menu > li {
        border-bottom: 1px solid #3c414f;
    }

    #side-menu > li > a {
        position: relative;
        background-color: #333645;
        height: 50px;
        line-height: 50px;
        padding: 0 20px 0 25px;
    }

    #side-menu > li > a:hover {
        background-color: #ff6600;
    }

    #side-menu > li > a:hover .nav-label {
        color: #fff;
    }

    .nav > li > a {
        font-weight: 400;
    }

    /* navbar 图片 ---s--- */

    #side-menu > li > a i.fa {
        position: absolute;
        width: 20px;
        height: 20px;
        top: 15px;
        left: 25px;
        margin: 0;
        background: url("../../assets/image/icon_navbar/icon_navbar.png") no-repeat;
    }

    #side-menu > li > a i.icon-index {
        background-position: 0 -1px;
    }

    #side-menu > li > a i.icon-emp-manage {
        background-position: 0 -20px;
    }

    #side-menu > li:hover > a i.icon-emp-manage,
    #side-menu > li.active > a i.icon-emp-manage {
        background-position: -20px -20px;
    }

    #side-menu > li > a i.icon-schedule-manage {
        background-position: 0 -40px;
    }

    #side-menu > li:hover > a i.icon-schedule-manage,
    #side-menu > li.active > a i.icon-schedule-manage {
        background-position: -20px -40px;
    }

    #side-menu > li > a i.icon-salary-manage {
        background-position: 0 -60px;
    }

    #side-menu > li:hover > a i.icon-salary-manage,
    #side-menu > li.active > a i.icon-salary-manage {
        background-position: -20px -60px;
    }

    #side-menu > li > a i.icon-corp-manage {
        background-position: 0 -80px;
    }

    #side-menu > li:hover > a i.icon-corp-manage,
    #side-menu > li.active > a i.icon-corp-manage {
        background-position: -20px -80px;
    }

    #side-menu > li > a i.icon-setting-manage {
        background-position: 0 -100px;
    }

    #side-menu > li:hover > a i.icon-setting-manage,
    #side-menu > li.active > a i.icon-setting-manage {
        background-position: -20px -100px;
    }

    #side-menu > li > a i.icon-jurisdiction-manage {
        background-position: 0 -120px;
    }

    #side-menu > li:hover > a i.icon-jurisdiction-manage,
    #side-menu > li.active > a i.icon-jurisdiction-manage {
        background-position: -20px -120px;
    }

    #side-menu > li > a i.icon-contract-manage {
        background-position: 0 -160px;
    }

    #side-menu > li:hover > a i.icon-contract-manage,
    #side-menu > li.active > a i.icon-contract-manage {
        background-position: -20px -160px;
    }

    /* navbar 图片 ---e--- */

    #side-menu > li > a .nav-label {
        font-size: 14px;
        display: block;
        color: #aca9a7;
        width: 100%;
        text-align: center;
    }

    #side-menu > li > a .arrow {
        position: absolute;
        right: 20px;
        top: 0;
        height: 100%;
        text-align: center;
        font-size: 20px;
        line-height: 50px;
    }

    #side-menu > li > ul {
        background-color: #333645;
    }

    #side-menu > li > ul li {
    }

    #side-menu > li > ul li a.J_menuItem {
        height: 56px;
        line-height: 56px;
        font-size: 12px;
        color: #a8a8a8;
    }

    #side-menu > li.active {
        /*background-color: transparent;*/
        border-left: 0;
        color: #fff;
    }

    #side-menu > li.active > a {
        background-color: #ff6600;
    }

    #side-menu > li.active > a .nav-label {
        color: #fff;
    }

    #side-menu > li.active > ul.nav-second-level {
        /*background-color: #fff;*/
    }

    #side-menu > li.active > ul.nav-second-level li {
        position: relative;
        /*height: 40px;*/
        /*line-height: 40px;*/
        background-color: #1e202c;
        padding: 0;
    }

    #side-menu > li.active > ul.nav-second-level li:not(:last-child) {
        /*border-bottom: 1px solid #d7e3ec !important;*/
    }

    #side-menu > li.active > ul.nav-second-level li:last-child {
        margin-bottom: 0;
    }

    #side-menu > li.active > ul.nav-second-level li a {
        position: relative;
        display: block;
        padding: 0 0 0 50px;
    }

    #side-menu > li.active > ul.nav-second-level li a:hover {
        color: #ff6600;
    }

    #side-menu > li.active > ul.nav-second-level li.active a {
        color: #ff6600;
    }

</style>