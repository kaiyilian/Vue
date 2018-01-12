// 1.0 导入vue核心包
import Vue from 'vue';
// 2.0 导入App.vue的vue对象
import App from './App.vue';

// 3.0 将 vue-route 集成到这个项目中来
import VueRouter from 'vue-router';
// 3.0.1 将 vueRoute 对象绑定到vue对象上
Vue.use(VueRouter);
// 3.0.2 导入路由规则对应的组件对象
import home from './components/Home.vue';
import shopCar from './components/shopcar/car.vue';

// 3.0.3 定义路由规则
let router = new VueRouter({
    // linkActiveClass: 'mui-active',
    routes: [
        {path: '/', redirect: '/home'},
        {path: '/home', component: home},
        {path: '/shopCar', component: shopCar},
    ]
});


// 3.0 利用Vue对象进行解析渲染
let vm = new Vue({
    el: '#app_t',
    router: router,
    render: c => c(App)
});



