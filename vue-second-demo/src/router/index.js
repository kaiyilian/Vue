import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '../components/HelloWorld.vue'
// import HelloWorld from '@/components/HelloWorld'
Vue.use(Router);

import Login from "../Login.vue"
import header from "../components/layout/header.vue"
import navbar from "../components/layout/navbar.vue"
import footer from "../components/layout/footer.vue"
import foo from "../components/foo.vue"
import bar from "../components/bar.vue"

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: "/login"
        },
        {
            path: '/login',
            name: 'login',
            components: {
                login: Login
            }
        },
        {
            path: '/main',
            components: {
                header: header,
                navbar: navbar,
                footer: footer
            }
        },
        {
            path: '/foo',
            component: foo
        },
        {
            path: '/bar',
            component: bar
        }
    ]
});

// router.beforeEach((to, from, next) => {
//     debugger
//     // ...
// });

export default router;
