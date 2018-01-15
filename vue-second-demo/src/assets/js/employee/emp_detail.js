/**
 * Created by CuiMengxin on 2016/12/15.
 * 员工详情 公用js
 */


var $container = "";//当前页面 的container
var $employeeId = "";//当前员工id

var emp_detail = {

    //获取详情
    getEmpDetail: function (url, containerName, succFun, errFun) {

        var $page_container = $("#page_" + sessionStorage.getItem("currentTabID"));
        $container = $page_container.find(containerName);
        $employeeId = sessionStorage.getItem("CurrentEmployeeId");

        var obj = {};
        obj.employee_id = $employeeId;
        url += "?" + jsonParseParam(obj);

        branGetRequest(
            url,
            function (data) {
                //console.log("员工详情页面：");
                //console.log(data);

                if (data.code == 1000) {
                    $container.attr("data-version", data.result.version);

                    var profile_progress = data.result.profile_progress;//资料进度
                    if (!profile_progress) profile_progress = "0%";
                    var is_profile_complete = data.result.is_profile_complete;//:'资料是否完成'，0未完成，1已完成，用于是否可以同意入职,

                    //资料未完成 "同意入职" 不显示
                    if (is_profile_complete == 0) {
                        $container.find(".btn_degree").remove();
                    }
                    $container.find(".completed_degree").css("width", profile_progress);//完成程度
                    $container.find(".completed_degree").html(profile_progress);

                    //员工 基本信息
                    var userInfo = data.result.profile;
                    if (userInfo) {
                        emp_detail.initUserInfo(userInfo);//初始化 员工信息
                    }

                    //花名册自定义内容
                    var custom_info = data.result.userDefinedResults;
                    if (custom_info) {
                        emp_detail.initCustomInfo(custom_info);//初始化 花名册自定义内容
                    }

                    //工作经验
                    var workExperience = data.result.career;
                    if (workExperience) {
                        emp_detail.initWorkExperience(workExperience);//初始化 工作经验
                    }

                    //教育经历
                    var eduExperience = data.result.education;
                    if (eduExperience) {
                        emp_detail.initEduExperience(eduExperience);//初始化 教育经历
                    }

                    //附件功能区
                    var enclosure = data.result.attachment;
                    if (enclosure) {
                        emp_detail.initEnclosure(enclosure);//初始化 附件区
                    }

                    //离职 功能区
                    var leave = data.result.leave_reason;
                    if (leave) {
                        emp_detail.initLeaveReason(leave);//初始化 离职功能区
                    }
                    else {
                        $container.find(".leave_container").remove();
                    }

                }
                else {
                    errFun(data.msg);
                }

            },
            function (error) {
                errFun(error);
            }
        )

    },

    //初始化 员工信息
    initUserInfo: function (userInfo) {
        //console.log(userInfo);

        emp_info.userInfo.user_name = userInfo.name ? userInfo.name : "";//员工姓名
        emp_info.userInfo.user_sex = userInfo.sex ? userInfo.sex : "";//员工性别
        emp_info.userInfo.user_age = userInfo.age ? userInfo.age : "";//员工年龄
        emp_info.userInfo.user_nation = userInfo.nation ? userInfo.nation : "";//员工民族
        emp_info.userInfo.user_phone = userInfo.phone_no ? userInfo.phone_no : "";//员工手机号码
        emp_info.userInfo.user_idCard = userInfo.idcard_no ? userInfo.idcard_no : "";//员工身份证号码


        emp_info.userInfo.user_face_url = userInfo.face_url ? userInfo.face_url :
            "image/face_empty.jpg";//员工图片

        emp_info.userInfo.user_origin_district = userInfo.origin_district
            ? userInfo.origin_district : "";//员工户籍地址
        emp_info.userInfo.user_address = userInfo.address ? userInfo.address : "";//员工居住地
        emp_info.userInfo.user_interview_time = userInfo.interviewDate
            ? userInfo.interviewDate : "";//员工面试时间
        emp_info.userInfo.user_interview_time = timeInit(emp_info.userInfo.user_interview_time);
        emp_info.userInfo.bus_address = userInfo.busAddress ? userInfo.busAddress : "";//班车点


        emp_info.userInfo.user_urgent_contact = userInfo.urgent_contact
            ? userInfo.urgent_contact : "";//员工紧急联系人
        emp_info.userInfo.user_urgent_contact_phone = userInfo.urgent_contact_phone
            ? userInfo.urgent_contact_phone : "";//员工紧急联系人手机号码
        emp_info.userInfo.user_interview_source = userInfo.sourceOfSupply
            ? userInfo.sourceOfSupply : "";//招聘来源
        emp_info.userInfo.user_nature = userInfo.employeeNature
            ? userInfo.employeeNature : "";//员工性质

        emp_info.userInfo.user_bank_info = userInfo.bankAccount ? userInfo.bankAccount : "";//银行卡 开户行信息
        emp_info.userInfo.user_bank_card_no = userInfo.bankNum ? userInfo.bankNum : "";//银行卡 卡号


        var $user_info = $container.find(".info_container .user_info");

        $user_info.find(".user_name").html(emp_info.userInfo.user_name);
        $user_info.find(".user_sex").html(emp_info.userInfo.user_sex);
        $user_info.find(".user_age").html(emp_info.userInfo.user_age);
        $user_info.find(".user_nation").html(emp_info.userInfo.user_nation);
        $user_info.find(".user_phone").html(emp_info.userInfo.user_phone);
        $user_info.find(".user_idCard").html(emp_info.userInfo.user_idCard);

        $user_info.find(".user_face_img img").attr("src", emp_info.userInfo.user_face_url);

        $user_info.find(".user_domicile").html(emp_info.userInfo.user_origin_district);
        $user_info.find(".user_urgent_contact").html(emp_info.userInfo.user_urgent_contact);
        $user_info.find(".user_bank_info").html(emp_info.userInfo.user_bank_info);
        $user_info.find(".user_address").html(emp_info.userInfo.user_address);
        $user_info.find(".user_urgent_contact_phone").html(emp_info.userInfo.user_urgent_contact_phone);
        $user_info.find(".user_bank_card_no").html(emp_info.userInfo.user_bank_card_no);

        $user_info.find(".user_interview_time").html(emp_info.userInfo.user_interview_time);
        $user_info.find(".user_interview_source").html(emp_info.userInfo.user_interview_source);
        $user_info.find(".user_bus_address").html(emp_info.userInfo.bus_address);
        $user_info.find(".user_nature").html(emp_info.userInfo.user_nature);

    },
    //初始化 花名册自定义内容
    initCustomInfo: function (custom_info) {
        var $user_info = $container.find(".info_container .user_info");
        var $custom_info = $user_info.find(".content").find(".custom_info");

        var list = "";

        for (var i = 0; i < custom_info.length; i++) {
            var $item = custom_info[i];

            var id = $item.detailsId;//
            var colName = $item.colName ? $item.colName : "";//
            var colValue = $item.colValue ? $item.colValue : "";//

            list +=
                "<span class='row' data-id='" + id + "'>" +
                "<span class='txt'>" + colName + "：</span>" +
                "<span class='txtInfo' title='" + colValue + "'>" + colValue + "</span>" +
                "</span>"

        }

        $custom_info.html(list);

    },

    //初始化 工作经验
    initWorkExperience: function (workExperience) {

        var work_experience_list = "";//

        if (workExperience.length > 0) {
            for (var i = 0; i < workExperience.length; i++) {
                var item = workExperience[i];//

                //var work_start_time = item.start_time == null
                //	? "" : item.start_time;//'开始时间'，unix时间戳
                //if (work_start_time != "")
                //	work_start_time = timeInit1(work_start_time);
                //var work_end_time = item.end_time == null
                //	? "" : item.end_time;//'结束时间'，unix时间戳
                //if (work_end_time != "")
                //	work_end_time = timeInit1(work_end_time);
                var work_time = item.work_time == null
                    ? "" : item.work_time;//'总工作时间'，拼接好字符串，例如“3年5个月”
                if (work_time != "")
                    work_time = "[" + work_time + "]";
                var company_name = item.company_name == null ? "" : item.company_name;//'公司名称'，
                //var company_introduce = item.company_introduce == null
                //	? "" : item.company_introduce;//公司简短介绍
                var work_post_name = item.position_name == null ? "" : item.position_name;//职位名称
                //var work_dept_name = item.department_name == null ? "" : item.department_name;//部门名称
                //var industry_name = item.industry_name == null ? "" : item.industry_name;//行业类别名称

                work_experience_list +=
                    "<tr>" +
                    "<td>" + company_name + "</td>" +
                    "<td>" + work_post_name + "</td>" +
                    "<td>" + work_time + "</td>" +
                    "</tr>";

                //work_experience_list +=
                //	"<div class='work_experience_item'>" +
                //	"<div class='row'>" +
                //	"<span class='time_container'>" +
                //	"<span class='begin_time'>" + work_start_time + "</span>" +
                //	"<span>---</span>" +
                //	"<span class='end_time'>" + work_end_time + "</span>" +
                //	"<span>：</span>" +
                //	"</span>" +
                //	"<span class='company_name'>" + company_name + "</span>" +
                //	"<span class='work_time'>" + work_time + "</span>" +
                //	"</div>" +
                //	"<div class='row'>" +
                //	"<span class='item'>" +
                //	"<span class='txt'>职位名称：</span>" +
                //	"<span class='post_name'>" + work_post_name + "</span>" +
                //	"</span>" +
                //	"<span class='item'>" +
                //	"<span class='txt'>部门：</span>" +
                //	"<span class='post_name'>" + work_dept_name + "</span>" +
                //	"</span>" +
                //	"<span class='item'>" +
                //	"<span class='txt'>行业：</span>" +
                //	"<span class='post_name'>" + industry_name + "</span>" +
                //	"</span>" +
                //	"</div>" +
                //	"</div>"
            }
        }
        else {
            work_experience_list = "<tr><td colspan='3'>暂无数据</td></tr>"
        }

        $container.find(".info_container .work_experience .content tbody")
            .html(work_experience_list);
    },

    //初始化 教育经历
    initEduExperience: function (eduExperience) {

        //'开始时间'，unix时间戳
        var edu_start_time = eduExperience.start_time ? timeInit1(eduExperience.start_time) : "";
        //'结束时间'，unix时间戳
        var edu_end_time = eduExperience.end_time ? timeInit1(eduExperience.end_time) : "";

        var school_name = eduExperience.school_name ? eduExperience.school_name : "";//学校名称
        var major_name = eduExperience.major_name ? eduExperience.major_name : "";//专业名称
        var education_name = eduExperience.education_name ? eduExperience.education_name : "";//学历名称

        var edu_Experience =
            "<tr>" +
            "<td>" + school_name + "</td>" +
            "<td>" + major_name + "</td>" +
            "<td>" + education_name + "</td>" +
            "<td>" + edu_start_time + " -- " + edu_end_time + "</td>" +
            "</tr>";
        //var edu_Experience = "<div class='education_experience_item'>" +
        //	"<span class='time_container'>" +
        //	"<span class='begin_time'>" + edu_start_time + "</span>" +
        //	"<span>---</span>" +
        //	"<span class='end_time'>" + edu_end_time + "</span>" +
        //	"</span>" +
        //	"<span class='college_name'>" + school_name + "</span>" +
        //	"<span class='major'>" + major_name + "</span>" +
        //	"<span class='education'>" + education_name + "</span>" +
        //	"</div>";

        $container.find(".info_container .education_experience .content tbody")
            .html(edu_Experience);

    },

    //初始化 附件区
    initEnclosure: function (enclosure) {
        var enclosure_info = "";

        for (var i = 0; i < enclosure.length; i++) {
            var item = enclosure[i];

            var enclosure_idcard_face = item.idcard_face ? item.idcard_face : "image/attachment_empty.jpg";//证件照URL
            var enclosure_idcard_front = item.idcard_front ? item.idcard_front : "image/attachment_empty.jpg";//身份证正面照片URL
            var enclosure_idcard_back = item.idcard_back ? item.idcard_back : "image/attachment_empty.jpg";//身份证反面照片URL
            var enclosure_leave_cert = item.leave_cert ? item.leave_cert : "image/attachment_empty.jpg";//离职证明照片URL
            var enclosure_education_cert = item.education_cert ? item.education_cert : "image/attachment_empty.jpg";//学历照片URL
            var bank_card = item.bank_card ? item.bank_card : "image/attachment_empty.jpg";//银行卡

            if (enclosure_idcard_face != null) {
                enclosure_info += "<span class='item'>" +
                    "<img src='" + enclosure_idcard_face + "'>" +
                    "</span>";
            }

            if (enclosure_idcard_front != null) {
                enclosure_info += "<span class='item'>" +
                    "<img src='" + enclosure_idcard_front + "'>" +
                    "</span>";
            }

            if (enclosure_idcard_back != null) {
                enclosure_info += "<span class='item'>" +
                    "<img src='" + enclosure_idcard_back + "'>" +
                    "</span>";
            }

            if (enclosure_leave_cert != null) {
                enclosure_info += "<span class='item'>" +
                    "<img src='" + enclosure_leave_cert + "'>" +
                    "</span>";
            }

            if (enclosure_education_cert != null) {
                enclosure_info += "<span class='item'>" +
                    "<img src='" + enclosure_education_cert + "'>" +
                    "</span>";
            }

            if (bank_card) {
                enclosure_info += "<span class='item'>" +
                    "<img src='" + bank_card + "'>" +
                    "</span>";
            }

        }

        $container.find(".enclosure_container .content").html(enclosure_info);

        //图片 初始化
        $container.find(" .content .enclosure_container .content .item").each(function () {
            var imgWidth = $(this).width();
            var imgHeight = imgWidth * 18 / 31;
            $(this).height(imgHeight);

            //alert(imgWidth + "\n\n" + imgHeight)

        })
    },

    //初始化 离职功能区
    initLeaveReason: function (leave) {

        var leave_reason = leave.reason;//离职原因
        var leave_time = leave.leave_time;//'离职时间'，unix时间戳
        //alert(leave_time)
        leave_time = timeInit(leave_time);
        //alert(leave_time)
        var leave_memo = leave.memo;//备注
        if (!leave_memo) leave_memo = "无";
        //alert(leave_reason)

        var leave_info =
            "<div class='row'>" +
            "<span class='txt'>离职原因：</span>" +
            "<span class='leave_reason'>" + leave_reason + "</span>" +
            "</div>" +
            "<div class='row'>" +
            "<span class='txt'>离职时间：</span>" +
            "<span class='leave_time'>" + leave_time + "</span>" +
            "</div>" + "" +
            "<div class='row'>" +
            "<span class='txt'>备注：</span>" +
            "<span class='remark'>" + leave_memo + "</span>" +
            "</div>";

        $container.find(".leave_container .content").html(leave_info);

    }

};

var emp_info = {

    //用户信息
    userInfo: {
        user_name: "",//员工姓名
        user_sex: "",//员工性别
        user_age: "",//员工年龄
        user_nation: "",//员工民族
        user_phone: "",//员工手机号码
        user_idCard: "",//员工身份证号码

        user_face_url: "",//员工图片

        user_origin_district: "",//员工户籍地址
        user_address: "",//员工居住地
        user_interview_time: "",//员工面试时间
        bus_address: "",//班车点

        user_urgent_contact: "",//员工紧急联系人
        user_urgent_contact_phone: "",//员工紧急联系人手机号码
        user_interview_source: "",//招聘来源
        user_nature: "",//员工性质

        user_bank_info: "",//银行卡 开户行信息
        user_bank_card_no: "",//银行卡 卡号

        user_birth: "",//员工出生日期
        user_marriage: "",//员工婚姻状况
        user_email: "",//员工邮箱
        user_politics_status: "" //员工政治面貌


    }

};
