/**
 * Created by Administrator on 2017/7/10.
 */

var my_component = {
    template: "<div @click='add()' v-bind:data-id='row_id'>这个是测试的my-component,哈哈哈{{count}}</div>",
    data: function () {
        return {
            count: 1
        }
    },
    computed: {
        row_id: function () {
            return "adf_" + this.count
        }
    },
    methods: {
        add: function () {
            return this.count += 1
        }
    }
};

var child_1 = {
    // camelCase in JavaScript
    props: ['myMessage'],
    template: '<span>{{ myMessage }}</span>',
    data: function () {
        return {
            counter: this.myMessage
        }
    }
};

var app1 = new Vue({
    el: "#app-1",
    data: {
        parentMsg: "hello，parentMsg"
    },
    components: {
        "my-component": my_component,
        "child": child_1
    }
});

var buttonCounter = {
    template: '<button v-on:click="increment">{{ counter }}</button>',
    data: function () {
        return {
            counter: 0
        }
    },
    methods: {
        increment: function () {
            this.counter += 1;
            this.$emit('increment');
        }
    }
    // props:["increment"]
};

var testCom = {
    template: "<div>测试</div>"
};

var countEvent = new Vue({
    el: "#counter-event-example",
    data: {
        total: 0
    },
    methods: {
        incrementTotal: function () {
            this.total += 1
        },
        doTheThing: function () {
            alert("父组件 方法")
        }
    },
    components: {
        "button-counter": buttonCounter,
        "test-component": testCom
    }
});


Vue.component("my-component", {
    template: "<div>\
    <h2>我是子组件的标题</h2>\
    <slot name='aa'>\
    只有在没有要分发的内容时才会显示。\ffsa\
</slot>\
\    <slot>\
    只有在没有要分发的内容时才会显示。\ffsa\
</slot>\
</div>"
});


var app2 = new Vue({
    el: "#app-2",
    data: {}
});

var MyComponent = Vue.extend({
    template: '<div>Hello!</div>'
});

var app3 = new Vue({
    components: {
        "blog-post": {
            render: function (h) {
                var header = this.$slots.header
                var body = this.$slots.default
                var footer = this.$slots.footer
                return h('div', [
                    h('header', header),
                    h('main', body),
                    h('footer', footer)
                ])
            }
        }
    },
    aa: "a测试",
    bb: "b测试",
    cc: "c测试",
});
app3.$mount("#app-3");


var todo_item = {
    template: '\
    <li>\
      {{ todo.id }} -----  {{ todo.title }}\
      <button @click="$emit(\'remove\')">X</button>\
    </li>\
  ',
    props: ['todo']
};

var todo_simple = new Vue({
    el: "#todo_simple",
    data: {
        todo_text: "",
        todos: [
            {
                id: 1,
                title: "这是第1个"
            },
            {
                id: 2,
                title: "这是第2个"
            },
            {
                id: 3,
                title: "这是第3个"
            }
        ]
    },
    methods: {
        addNewTodo: function () {
            console.log(this.todo_text);

            todo_simple.todos.push({
                id: todo_simple.todos.length + 1,
                title: todo_simple.todo_text
            });

            todo_simple.todo_text = "";

        },
        // remove:function () {
        //     debugger
        //     todo_simple.todos.splice(index, 1);
        // }
    },
    components: {
        "todo-item": todo_item
    }

});





