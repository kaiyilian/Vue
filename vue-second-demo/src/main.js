// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import main from './main.vue'
// import App from './App.vue'
import router from './router'

import "./assets/lib/bootstrap/css/font-awesome.min.css"
import "./assets/lib/bootstrap/css/style.min.css"
import "./assets/lib/bootstrap/css/animate.min.css"

import "./assets/lib/bootstrap/css/bootstrap.min.css"
import "./assets/lib/bootstrap/js/bootstrap.min"

// 日期
import layer from "laydate"

// import "./assets/lib/layer/laydate/need/laydate.css"
// import "./assets/lib/layer/laydate/skins/default/laydate.css"
// import layer from "./assets/lib/layer/layer.min"
// import layerdate from "./assets/lib/layer/laydate/laydate"
// Vue.prototype.layer = layer;
// Vue.prototype.layerdate = layerdate;


import "./assets/lib/toastr/toastr.min.css"
import toastr from "./assets/lib/toastr/toastr.min"

Vue.prototype.toastr = toastr;


// 通用样式
import "./assets/css/bran.css"

Vue.config.productionTip = false;
Vue.config.devtools = true;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: c => c(main)
    // template: '<App/>',
    // components: {
    //     App
    // }
});


