/**
 * Created by Administrator on 2017/7/10.
 */


var app1 = new Vue({
    el: '#app-1',
    data: {
        message: 'Hello Vue！'
    }
});

// app20.message = 'new message'; // 更改数据
// app20.$el.textContent === 'new message' // false
// Vue.nextTick(function () {
//     vm.$el.textContent === 'new message' // true
// })

var app6 = new Vue({
    el: '#app-6',
    data: {
        message: 'Hello Vue!'
    }
});

Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{ todo.text }}</li>'
});

var app7 = new Vue({
    el: '#app-7',
    data: {
        groceryList: [
            {id: 0, text: '蔬菜'},
            {id: 1, text: '奶酪'},
            {id: 2, text: '随便其他什么人吃的东西'}
        ]
    }
});

Vue.component("app-nav", {
    template: "<div>aaa</div>"
});


var app8 = new Vue({
    el: "#app-8",
    data: {},
    methods: {}
});

var app9 = new Vue({
    el: '#app-9',
    data: {
        message: 'Hello'
    },
    computed: {
        // a computed getter
        reversedMessage: function () {
            // `this` points to the vm instance
            return Date.now()
            // return this.message.split('').reverse().join('')
        }
    },
    methods: {
        reversedMessage1: function () {
            // `this` points to the vm instance
            return Date.now()
        }
    }
});

var app10 = new Vue({
    el: '#app-10',
    data: {
        firstName: 'Foo',
        lastName: 'Bar',
        fullName: 'Foo Bar'
    },
    watch: {
        firstName: function (val) {
            this.fullName = val + ' ' + this.lastName
        },
        lastName: function (val) {
            this.fullName = this.firstName + ' ' + val
        }
    }
});

var app11 = new Vue({
    el: '#app-11',
    data: {
        firstName: 'Foo',
        lastName: 'Bar'
    },
    computed: {
        fullName: function () {
            return this.firstName + ' ' + this.lastName
        }
    }
});

var app12 = new Vue({
    el: '#app-12',
    data: {
        firstName: 'A',
        lastName: 'B'
    },
    computed: {
        fullName: {
            // getter
            get: function () {
                // debugger
                return this.firstName + ' ' + this.lastName
            },
            // setter
            set: function (newValue) {
                // debugger
                var names = newValue.split(' ');
                this.firstName = names[0];
                this.lastName = names[names.length - 1]
            }
        }
    },
    watch: {
        firstName: function (val) {
            // debugger
            this.fullName = val + ' ' + this.lastName
        },
        lastName: function (val) {
            // debugger
            this.fullName = this.firstName + ' ' + val
        }
    }
});

var app13 = new Vue({
    el: "#app-13",
    data: {
        isActive: true,
        errorClass: "class_b",
        activeClass: "aa"
    }
});

var app14 = new Vue({
    el: '#app-14',
    data: {
        object: {
            firstName: 'John',
            lastName: 'Doe',
            age: 30
        }
    }
});

var app15 = new Vue({
    el: '#app-15',
    data: {
        items: [
            {message: 'Foo'},
            {message: 'Bar'}
        ]
    }
});

var app16 = new Vue({
    el: '#app-16',
    data: {
        object: {
            firstName: 'John',
            lastName: 'Doe',
            age: 30
        }
    }
});
var app17 = new Vue({
    el: "#app-17",
    methods: {
        showInfo: function (message) {
            alert(message);
        },
        //默认 阻止冒泡
        doThis: function (message) {
//                event.stopPropagation();
//                if (event)
//                    event.preventDefault();
            alert(message)
        },
        //enter键 提交
        submit: function () {
//                alert($this.val());
        }
    }
});
var app18 = new Vue({
    el: '#app-18',
    data: {
        selected: 'df',
        toggle: false,
        a: false,
        b: true,
        age: "124"
    }
});

var app19 = new Vue({
    // el:"",
    data: {
        a: 1213,
        obj: {a: 12}
    }
});
// Vue.set(app19.o, "b", 2);
// app19.$set(app19.o, "b", 1234);
// 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
// app19.obj = Object.assign({}, app19.obj, {b: 2});



//
// Vue.component('example', {
//     template: '<span>{{ message }}</span>',
//     data: function () {
//         return {
//             message: '没有更新'
//         }
//     },
//     methods: {
//         updateMessage: function () {
//             this.message = '更新完成'
//             console.log(this.$el.textContent) // => '没有更新'
//             this.$nextTick(function () {
//                 console.log(this.$el.textContent) // => '更新完成'
//             })
//         }
//     }
// })

