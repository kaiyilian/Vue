// const path = require("path");
//
// const rootPath = path.resolve(__dirname, "../");

// console.log(__dirname);
// console.log(rootPath);
// console.log(path.resolve(rootPath, "dist"));
// console.log(path.resolve(rootPath, "./dist"));


// const HOST = process.env.HOST
// const PORT = process.env.PORT && Number(process.env.PORT)
// console.log("--------------");
// console.log(HOST);
// console.log("--------------");
// console.log(PORT);
// console.log("--------------");
// console.log(process.env);


// import _ from "lodash"
//
// function component() {
//     let element = document.createElement('div');
//
//     // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
//     element.innerHTML = _.join(['Hello', 'webpack', "啊ttttt"], ' ');
//     element.classList.add("hello");
//
//     let br = document.createElement("br");
//     element.appendChild(br);
//     //
//     // let btn = document.createElement("button");
//     // btn.innerHTML = "click me";
//     // btn.onclick = printMe;
//     // element.appendChild(btn);
//
//
//     // let element = document.createElement("pre");
//     // element.innerHTML = [
//     //     "hello webpack!",
//     //     "5 cubed is equal to " + cube(2)
//     // ];
//
//
//     return element;
// }
//
// document.body.appendChild(component());


// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import Login from './Login.vue'
import router from './router'

// Vue.config.productionTip = false;
// Vue.config.devtools = true;

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


