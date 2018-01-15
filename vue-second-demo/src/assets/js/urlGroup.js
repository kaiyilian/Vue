/**
 * Created by Administrator on 2018/1/9.
 */

//var $host = "http://192.168.13.248:8015/bran-admin/";//测试服务器
var $host = "";//本地

//默认头部
var host_list = {

    //不做权限控制
    no_permission: $host + "admin/no_permission/",

    /**
     *    员工管理
     */
    employee: {

        prospective: $host + "admin/employee/prospective/",//待入职员工
        roster: $host + "admin/employee/roster/",//花名册员工
        leave: $host + "admin/employee/leave/",//离职员工
        department_structure: $host + "admin/employee/structure/department/",//组织架构
        setting: $host + "admin/employee/setting/"//员工配置

    },

    /**
     *    考勤管理
     * */
    attendance: {

        workShiftType: $host + "admin/attendance/schedule/workShiftType/",//班次管理
        schedule_rule: $host + "admin/attendance/schedule/rule/",//排班规律
        view: $host + "admin/attendance/schedule/view/",//排班视图
        summary: $host + "admin/attendance/summary/",//出勤汇总

        approval: $host + "admin/attendance/approval/",//审批管理
        setting: $host + "admin/attendance/setting/",//出勤配置
        setting_cycle: $host + "admin/attendance/setting/cycle/",//出勤配置 - 周期设置
        setting_over_time: $host + "admin/attendance/setting/over_time/",//出勤配置 - 加班设置
        setting_holiday: $host + "admin/attendance/setting/holiday/",//出勤配置 - 假期设置
        setting_range: $host + "admin/attendance/setting/range/",//出勤配置 - 考勤打卡

    },

    /**
     *    薪资管理
     * */
    salary: {

        common: $host + "admin/salary/"     //薪资单
        // create: $host + "",
        // history: $host + "",
        // detail: $host + ""

    },

    /**
     *    电子合同
     * */
    e_contract: {
        common: $host + "admin/e_contract/"
    },

    /**
     *    企业管理
     * */
    corp: {

        info: $host + "admin/corporation/info/",   //企业信息
        notice: $host + "admin/corporation/notification/"  //企业公告

    },

    /**
     *    设置中心
     * */
    setting: {
        log: $host + "admin/setting/log/"
    },

    /**
     *    权限管理
     * */
    perm: {
        account: $host + "admin/permission/account/"
    }

};

var urlGroup = {

    // //不做权限控制的 url
    // no_permission: {
    //
    //
    //     //获取加班工时
    //     over_time_get: "admin/no_permission/attendance/setting/over_time/get",
    //     //获取所有的加班工时 列表
    //     over_time_all: "admin/no_permission/attendance/setting/over_time/all",
    //
    //
    // },

    //基本配置
    basic: {

        //修改密码
        pwd_modify: "admin/user/pwd/change",
        //退出登录
        Login_Out: "admin/signout",
        //获取省份 列表
        province_list: host_list.no_permission + "location",
        //获取 城市 列表
        city_list: host_list.no_permission + "location",
        //获取 地区 列表
        area_list: host_list.no_permission + "location",

        //获取部门列表
        department: {
            prospective: host_list.no_permission + "employee/prospective/manage/department/list",
            roster: host_list.no_permission + "employee/roster/manage/department/list",
            leave: host_list.no_permission + "employee/leave/manage/department/list"
        },

        //获取工段列表
        workLine: {
            prospective: host_list.no_permission + "employee/prospective/manage/work_line/list",
            roster: host_list.no_permission + "employee/roster/manage/work_line/list",
            leave: host_list.no_permission + "employee/leave/manage/work_line/list"
        },

        //获取班组列表
        workShift: {
            prospective: host_list.no_permission + "employee/prospective/manage/work_shift/list",
            roster: host_list.no_permission + "employee/roster/manage/work_shift/list",
            leave: host_list.no_permission + "employee/leave/manage/work_shift/list"
        },

        //获取职位列表
        position: {
            prospective: host_list.no_permission + "employee/prospective/manage/position/list",
            roster: host_list.no_permission + "employee/roster/manage/position/list",
            leave: host_list.no_permission + "employee/leave/manage/position/list"
        }

    },

    /**
     * 消息中心
     */
    notification: {
        index: "admin/msg/center/manager/index",
        //消息中心 - 列表
        list: "admin/msg_center",
        //消息中心 - 设置状态 已读
        state_change: "admin/msg_center/set/state"
    },


    /**
     * 首页 模块
     **/
    home: {

        //首页 - 页面
        index: "admin/index",
        //获取登录用户个人信息
        userInfo_by_home: "admin/home/user/info/detail",

        //合同到期
        contract_expire: {

            //页面
            index: "admin/home/expiration/detail",
            //列表 （首页调用）
            list_by_home: "admin/home/employee/roster/manage/expiration",
            //列表
            list: "admin/employee/roster/manage/expiration"

        },

        //试用期到期
        probation_expire: {

            //页面
            index: "admin/home/probation/detail",
            //受理
            accept: "admin/employee/roster/manage/probation/process",
            //列表（首页调用）
            list_by_home: "admin/home/employee/roster/manage/probation",
            //试用期到期 - 列表
            list: "admin/employee/roster/manage/probation"

        },

        //同意入职
        entry_expire: {

            //页面
            index: "admin/home/acceptOffer/detail",
            //列表（首页调用）
            list_by_home: "admin/home/employee/roster/manage/acceptOfferUsers",
            //列表
            list: "admin/employee/roster/manage/acceptOfferUsers"

        },

        //排班管理
        schedule: {

            //列表（首页调用）
            list_by_home: "admin/home/index/schedule/view"

        }

    },

    /**
     *    员工管理
     */
    employee: {

        common: {},

        //体检
        physical_exam: {

            //员工体检详情页面
            index: host_list.employee.prospective + "examination/index",
            //员工体检详情
            detail: host_list.employee.prospective + "examination/result/querybyid"

        },

        //待入职员工
        prospective: {

            //页面
            index: host_list.employee.prospective + "list/index",
            //待入职员工名单 - 分页查询
            list: host_list.employee.prospective + "manage/list",
            //待入职员工 - 同意入职
            accept: host_list.employee.prospective + "manage/accept",

            //员工 - 获取工号
            work_sn: host_list.employee.prospective + "work_sn_prefix/get/id",
            //员工 - 保存（新增）
            add: host_list.employee.prospective + "add/save",
            //员工 - 保存（修改）
            update: host_list.employee.prospective + "add/update",
            //待入职员工 - 删除
            del: host_list.employee.prospective + "add/delete",

            //待入职员工 - 名单导出
            excel_export: host_list.employee.prospective + "manage/export",
            //Excel模板 下载
            download_template: host_list.employee.prospective + "download",
            //Excel导入 检查
            excel_import_check: host_list.employee.prospective + "import/check",
            //Excel确认导入
            excel_import_confirm: host_list.employee.prospective + "import/confirm"


        },
        //待入职员工 详情
        prospective_detail: {

            //待入职员工 - 详情页面
            index: host_list.employee.prospective + "manage/detail/index",
            //待入职员工详情 - 获取
            detail: host_list.employee.prospective + "manage/detail",
            //待入职员工 - 下载附件
            attachment_down: host_list.employee.prospective + "manage/attachment/download"

        },

        //花名册
        roster: {

            //页面
            index: host_list.employee.roster + "manage/index",
            //初始化 用戶列表
            search_user_list: host_list.employee.roster + "branCorp/list",
            //初始化 离职原因
            leave_reason_list: host_list.employee.roster + "setting/leave_reason/list",
            //花名册 - 查询员工
            list: host_list.employee.roster + "manage/list",
            //在职员工 - 获取员工信息（编辑时）
            info_by_id: host_list.employee.roster + "manage/get/id",
            //获取员工工号
            work_sn: host_list.employee.roster + "work_sn_prefix/get/id",

            //在职员工 - 信息修改
            modify: host_list.employee.roster + "manage/update",
            //在职员工 - 退工
            leave: host_list.employee.roster + "manage/leave",
            //在职员工 - 续签
            contract_extension: host_list.employee.roster + "manage/contract/extension",
            //在职员工 - 导出
            excel_export: host_list.employee.roster + "manage/export",

            //在职员工 - 下载附件
            attachment_down: host_list.employee.roster + "manage/attachment/download",

            //正式员工一键录入考勤机
            attend_put: host_list.employee.roster + "work_attendance/put",

            //花名册 Excel模板 下载
            download_template: host_list.employee.roster + "import/download",
            //花名册 导入验证
            excel_import: host_list.employee.roster + "import/verify",
            //花名册 确认导入
            excel_import_confirm: host_list.employee.roster + "import/confirm"

        },
        //花名册 详情
        roster_detail: {

            //在职员工详情页面
            index: host_list.employee.roster + "manage/detail/index",
            //在职员工详情 - 获取
            detail: host_list.employee.roster + "manage/detail"

        },

        // 离职员工
        leave: {

            //离职员工 - 列表页面
            index: host_list.employee.leave + "index",
            //离职员工 - 列表
            list: host_list.employee.leave + "list",
            //离职员工 - 删除
            del: host_list.employee.leave + "delete",
            //离职员工 - 名单导出
            excel_export: host_list.employee.leave + "export"

        },
        //离职员工详情
        leave_detail: {

            //离职员工详情页面
            index: host_list.employee.leave + "detail/index",
            //离职员工详情 - 获取
            detail: host_list.employee.leave + "detail"

        },

        //组织架构、部门结构
        department_structure: {

            //组织架构 - 页面
            index: host_list.employee.department_structure + "index",
            //组织架构 - 列表
            list: host_list.employee.department_structure + "list",
            //组织架构 - 添加
            add: host_list.employee.department_structure + "add",
            //组织架构 - 编辑
            edit: host_list.employee.department_structure + "update",
            //组织架构 - 删除
            del: host_list.employee.department_structure + "delete",
            //组织架构 - 导出
            excel_export: host_list.employee.department_structure + "export"

        },

        //员工配置
        setting: {

            //设置 - 页面
            index: host_list.employee.setting + "general/index",

            //入职消息提醒 - 获取
            entry_remind: host_list.employee.setting + "general/message/check_in",
            //入职消息提醒 - 保存
            entry_msg_save: host_list.employee.setting + "general/message/check_in/update",

            //工段
            workLine: {

                //列表
                list: host_list.employee.setting + "work_line/list",
                //添加
                add: host_list.employee.setting + "work_line/add",
                //删除
                del: host_list.employee.setting + "work_line/delete",
                //编辑
                modify: host_list.employee.setting + "work_line/update"

            },

            //班组
            workShift: {

                //列表
                list: host_list.employee.setting + "work_shift/list",
                //添加
                add: host_list.employee.setting + "work_shift/add",
                //删除
                del: host_list.employee.setting + "work_shift/delete",
                //编辑
                modify: host_list.employee.setting + "work_shift/update"

            },

            //职位
            position: {
                //列表
                list: host_list.employee.setting + "position/list",
                //添加
                add: host_list.employee.setting + "position/add",
                //删除
                del: host_list.employee.setting + "position/delete",
                //编辑
                modify: host_list.employee.setting + "position/update"

            },

            //离职原因
            leave_reason: {
                //列表
                list: host_list.employee.setting + "leave_reason/list",
                //添加
                add: host_list.employee.setting + "leave_reason/add",
                //删除
                del: host_list.employee.setting + "leave_reason/delete",
                //编辑
                modify: host_list.employee.setting + "leave_reason/update"

            },

            //工号前缀
            job_num_prefix: {

                //工号前缀 - 列表
                list: host_list.no_permission + "employee/setting/work_sn_prefix/get",
                //添加
                add: host_list.employee.setting + "work_sn_prefix/add",
                //删除
                del: host_list.employee.setting + "work_sn_prefix/del",
                //编辑
                modify: host_list.employee.setting + "work_sn_prefix/update"

            },

            //花名册自定义
            roster_custom: {


                //列表
                list: host_list.no_permission + "employee/setting/roster_custom/all",
                //添加
                add: host_list.employee.setting + "roster_custom/add",
                //删除
                del: host_list.employee.setting + "roster_custom/delete",
                //编辑 后保存
                modify: host_list.employee.setting + "roster_custom/update"

            }

        }

    },

    /**
     *    考勤管理
     * */
    attendance: {

        //公共
        common: {},

        //班次管理
        schedule: {

            //页面
            index: host_list.attendance.workShiftType + "main/index/new",
            //列表 GET
            list: host_list.attendance.workShiftType + "get",
            //班次 休息时间 列表 POST
            rest_info: host_list.attendance.workShiftType + "get/rest",
            //班次 旷工信息 POST
            absenteeism_info: host_list.attendance.workShiftType + "get/abs",
            //班次 加班信息 POST
            overTime_info: host_list.attendance.workShiftType + "get/overtime",
            //班次 删除 POST
            del: host_list.attendance.workShiftType + "delete"

        },
        //班次详情
        schedule_detail: {

            //页面
            index: host_list.attendance.workShiftType + "main/detail/index",
            //颜色列表
            colors_list: host_list.attendance.workShiftType + "colors",
            //班次详情 获取GET
            detail: host_list.attendance.workShiftType + "get/id",
            //班次详情 保存  POST
            save: host_list.attendance.workShiftType + "add"

        },

        //排班规律、班組規律
        schedule_rule: {

            //页面
            index: host_list.attendance.schedule_rule + "index/new",
            //列表获取    GET
            list: host_list.attendance.schedule_rule + "query/list",
            //查看所有的排班规律    POST
            list_type: host_list.attendance.schedule_rule + "query/list/type",
            //排班规律 删除         POST
            del: host_list.attendance.schedule_rule + "delete",
            //排班规律 启用/禁用         POST
            status_modify: host_list.attendance.schedule_rule + "set/use"

        },
        //排班信息、班組信息
        schedule_rule_info: {

            //页面
            index: host_list.attendance.schedule_rule + "info/index",
            //班次列表(默认的)
            shift_list: host_list.attendance.schedule_rule + "workShiftType/get/default",
            //获取可用的班组列表      GET
            enable_work_shift: host_list.attendance.schedule_rule + "available/workShift/list",
            //获取班组员工列表   GET
            work_shift_user: host_list.attendance.schedule_rule + "available/workShift/emp/list",
            //获取排班规律详情      GET
            detail: host_list.attendance.schedule_rule + "details",
            //设置排班规律      POST
            set: host_list.attendance.schedule_rule + "set"

        },

        //排班视图
        schedule_view: {

            //页面
            index: host_list.attendance.view + "index",
            //排班视图 - 获取 GET
            list: host_list.attendance.view + "list",
            //排班视图 - 班次列表
            shift_list: host_list.attendance.view + "workShiftType/get/default",
            //个人排班按天修改 PUT
            modify_one_day: host_list.attendance.view + "one/day",
            //恢复初始排班 DELETE
            revert: host_list.attendance.view + "revert",
            //排班规则 - 发布
            release: host_list.attendance.view + "publish",

            //获取所有 在职员工
            emp_roster_list: host_list.attendance.view + "emp_list",
            //获取所有 离职员工
            emp_leave_list: host_list.attendance.view + "leave_emp_list"

        },

        //出勤汇总
        summary: {

            //页面
            index: host_list.attendance.summary + "manager/index/new",
            //出勤周期 列表 GET
            cycle_list: host_list.attendance.summary + "get/config",
            //考勤配置（请假、加班分类） GET
            columns_list: host_list.attendance.summary + "get/approval/config",
            //考勤汇总 - 列表 GET
            list: host_list.attendance.summary + "list",
            //出勤汇总 - 导出 GET
            excel_export: host_list.attendance.summary + "new/export",
            //出勤汇总 - 发布	POST
            publish: host_list.attendance.summary + "new/publish",

            //出勤汇总 - 请假 GET
            leave_list: host_list.attendance.summary + "leave/list",
            //出勤汇总 - 迟到 GET
            late_list: host_list.attendance.summary + "late/list",
            //出勤汇总 - 早退 GET
            unFull_list: host_list.attendance.summary + "no_full/list",
            //出勤汇总 - 旷工 GET
            absent_list: host_list.attendance.summary + "absent/list",
            //出勤汇总 - 缺卡 GET
            lack_list: host_list.attendance.summary + "lack/list",

            //获取所有 在职员工
            emp_roster_list: host_list.attendance.summary + "emp_list",
            //获取所有 离职员工
            emp_leave_list: host_list.attendance.summary + "leave_emp_list"

        },
        //出勤明细
        attendance_detail: {

            //页面
            index: host_list.attendance.summary + "detail/index",
            //班次列表
            shift_list: host_list.attendance.summary + "workShiftType/get/default",
            //出勤明细 - 列表 GET
            list: host_list.attendance.summary + "employ/month/data/list",
            //出勤明细 - 导出 GET
            excel_export: host_list.attendance.summary + "export",
            //出勤明细 - 获取考勤记录 GET
            attendance_record: host_list.attendance.summary + "view",
            //出勤明细 - 编辑考勤记录 POST
            attendance_record_update: host_list.attendance.summary + "update",
            //出勤明细 - 清空考勤   POST
            clear: host_list.attendance.summary + "clean"

        },

        //审批管理
        approval: {

            //页面
            index: host_list.attendance.approval + "index",
            //审批管理 - 列表 GET
            list: host_list.attendance.approval + "list",
            //审批管理 - 审批类型 GET
            type_list: host_list.attendance.approval + "type",
            //审批管理 - 审批详情类型 GET
            detail_type_list: host_list.attendance.approval + "detail/type",
            //审批管理 - 审批详情 GET
            detail: host_list.attendance.approval + "detail",

            //审批管理 - 不通过    PUT
            fail: host_list.attendance.approval + "batch/fail",
            //审批管理 - 通过 PUT
            pass: host_list.attendance.approval + "batch/pass",

            //获取所有 在职员工
            emp_roster_list: host_list.attendance.approval + "emp_list",
            //获取所有 离职员工
            emp_leave_list: host_list.attendance.approval + "leave_emp_list"

        },

        //出勤配置
        setting: {

            //页面
            index: host_list.attendance.setting + "index",
            //班组列表
            workShift_list: host_list.attendance.setting + "work_shift/list",

            //出勤周期
            cycle: {

                //出勤周期 - 列表
                list: host_list.attendance.setting_cycle + "get/list",
                //出勤周期 - 明细
                detail: host_list.attendance.setting_cycle + "get/detail",
                //出勤周期 - 保存
                save: host_list.attendance.setting_cycle + "save",
                //出勤周期 - 删除
                del: host_list.attendance.setting_cycle + "delete",
                //出勤周期 - 可用班组
                workShift_enable: host_list.attendance.setting_cycle + "get/available/work_shift/list",
                //查询考勤反馈绑定的管理员
                manager_info: host_list.attendance.setting_cycle + "manager/get",
                //绑定考勤反馈管理员
                manager_bind: host_list.attendance.setting_cycle + "manager/bind"

            },

            //假期设置
            holiday: {

                //假期设置 - 获取列表 GET
                list_all: host_list.attendance.setting_holiday + "all",
                //假期设置 - 获取列表（已经保存的） GET
                list: host_list.attendance.setting_holiday,
                //假期设置 - 保存 POST
                set: host_list.attendance.setting_holiday

            },

            //加班设置
            overTime: {

                //加班设置 - 获取列表 GET
                list_all: host_list.no_permission + "attendance/setting/over_time/all",
                //加班设置 - 获取列表（已经保存的） GET
                list: host_list.no_permission + "attendance/setting/over_time/get",
                //加班设置 - 保存 POST
                set: host_list.attendance.setting_over_time

            },

            //考勤打卡
            clock: {

                //办公地点
                area: {

                    //考勤打卡 - 办公地点列表 GET
                    list: host_list.attendance.setting_range + "office/location/list",
                    //考勤打卡 - 办公地点 详情 GET
                    detail: host_list.attendance.setting_range + "office/location/detail",
                    //考勤打卡 - 办公地点 删除 POST
                    del: host_list.attendance.setting_range + "office/location/delete",
                    //考勤打卡 - 办公地点 保存 POST
                    save: host_list.attendance.setting_range + "office/location/save"

                },

                //wifi 打卡
                wifi: {

                    //考勤打卡 - wifi 列表 GET
                    list: host_list.attendance.setting_range + "office/wifi/list",
                    //考勤打卡 - wifi 详情 GET
                    detail: host_list.attendance.setting_range + "office/wifi/detail",
                    //考勤打卡 - wifi 删除 POST
                    del: host_list.attendance.setting_range + "office/wifi/delete",
                    //考勤打卡 - wifi 保存 POST
                    save: host_list.attendance.setting_range + "office/wifi/save"

                }

            }


        }


    },

    /**
     *    薪资管理
     * */
    salary: {

        //新建
        create: {

            //页面
            index: host_list.salary.common + "create/index",
            //上传文件 POST
            file_upload: host_list.salary.common + "file/upload",
            //工资单详情 POST 获取本次导入的员工
            salary_info_by_excelId: host_list.salary.common + "getuser",
            //发送薪资
            salary_send: host_list.salary.common + "send"

        },

        //历史
        history: {

            //页面
            index: host_list.salary.common + "history/index",
            //历史薪资单 - 批次列表   POST
            list: host_list.salary.common + "history",
            //历史薪资单 - 导出 签收表 POST
            excel_export: host_list.salary.common + "export",
            //获取有效期
            validity: host_list.salary.common + "validity/get",
            //保存有效期
            validity_save: host_list.salary.common + "validity"

        },

        //历史详情
        detail: {

            //页面
            index: host_list.salary.common + "history/detail/index",
            //搜索用户 POST
            user_search: host_list.salary.common + "history/getempuser",
            //工资单详情 GET 根据工资单id获取 该工资单员工列表、发薪时间、发薪名称
            info_by_salaryId: host_list.salary.common + "history/getalluser",
            //工资单详情 GET 根据userID获取 个人工资详情
            detail_by_userId: host_list.salary.common + "getsalary",
            //删除 用户
            user_del: host_list.salary.common + "history/user/delete"

        }

    },

    /**
     *    电子合同
     * */
    e_contract: {

        //合同管理
        manage: {

            //合同操作 获取GET 新增POST 删除DELETE 更新PUT
            operate: host_list.e_contract.common,

            //合同管理 - 页面
            index: host_list.e_contract.common + "manager/index",
            //合同下载 GET
            contract_download: host_list.e_contract.common + "download",
            //合同预览 GET
            preview: host_list.e_contract.common + "preview",
            //合同发送 PATCH
            send: host_list.e_contract.common + "send",
            //合同状态 改变 PATCH
            state_change: host_list.e_contract.common + "setState"

        },

        //合同详情
        detail: {

            //合同详情 - 页面
            index: host_list.e_contract.common + "detail/index",
            //合同详情 GET
            detail: host_list.e_contract.common + "detail",
            //合同详情 GET（编辑时，获取详情）
            detail_for_modify: host_list.e_contract.common + "info"

        },

        //新建合同
        create: {

            //新建合同 - 页面
            index: host_list.e_contract.common + "create/index",
            //合同模板列表 获取 GET
            temp_list: host_list.e_contract.common + "template",
            //合同模板 loops获取 GET
            temp_loops: host_list.e_contract.common + "template/loops",
            //印章列表 GET
            seal_list: host_list.e_contract.common + "seal"

        }

    },

    /**
     *    企业管理
     * */
    corp: {

        //企业信息
        info: {

            //企业信息 - 页面
            index: host_list.corp.info + "index",
            //企业信息 - 获取
            query: host_list.corp.info + "detail",

            //厂车路线
            route: {

                //厂车路线 - 查询
                query: host_list.corp.info + "bus/html/url",
                //厂车路线 - 上传
                upload: host_list.corp.info + "bus/preview/upload",
                //厂车路线- 确认导入
                upload_confirm: host_list.corp.info + "bus/upload/confirm"

            },

            //员工手册
            handbook: {

                //查询
                query: host_list.corp.info + "handbook/html/url",
                //员工手册 - 上传
                upload: host_list.corp.info + "handbook/upload",
                //员工手册- 确认导入
                upload_confirm: host_list.corp.info + "handbook/upload/confirm"

            }

        },

        //企业公告
        notice: {

            //企业公告 - 页面
            index: host_list.corp.notice + "index",
            //企业公告 - 列表
            list: host_list.corp.notice + "list",
            //企业公告 - 获取部门
            dept_list: host_list.corp.notice + "department/list",
            //企业公告 - 删除
            del: host_list.corp.notice + "delete",
            //企业公告 - 发布
            release: host_list.corp.notice + "post"

        }

    },

    /**
     *    设置中心
     * */
    setting: {

        //日志
        log: {

            //界面
            index: host_list.setting.log + "operation/index",
            //操作模块 列表
            module_list: host_list.setting.log + "operation/module/list",
            //操作类型 列表
            type_list: host_list.setting.log + "operation/type/list",
            //操作日志 列表
            operation_list: host_list.setting.log + "operation"

        }

    },

    /**
     *    权限管理
     * */
    perm: {

        //账号管理
        account: {

            //页面
            index: host_list.perm.account + "index",
            //列表
            list: host_list.perm.account + "get",
            //新增
            add: host_list.perm.account + "add",
            //编辑
            modify: host_list.perm.account + "update",
            //删除
            del: host_list.perm.account + "delete/ids"

        }

    }

};