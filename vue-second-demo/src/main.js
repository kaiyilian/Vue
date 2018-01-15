
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App.vue'
import Login from './Login.vue'
import router from './router'

// require("jquery")
import "../static/bootstrap/css/bootstrap.min.css"
import "../static/bootstrap/js/bootstrap.min.js"


Vue.config.productionTip = false;
Vue.config.devtools = true;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: a => a(Login)
    // template: '<App/>',
    // components: {
    //     App
    // }
});


