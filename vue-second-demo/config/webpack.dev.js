/**
 * Created by Administrator on 2018/1/8.
 */

const webpack = require('webpack');
const merge = require('webpack-merge');//合并 webpack
const HtmlWebpackPlugin = require('html-webpack-plugin');//生成HTML 模板
const common = require('./webpack.common.js');
const path = require("path");
const rootPath = path.resolve(__dirname, "../");

// console.log(rootPath)

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

//开发环境
module.exports = merge(common, {

    // entry: {
    //     vendor: [
    //         'jquery',
    //         'tether',
    //         'bootstrap/dist/js/bootstrap.min.js'
    //     ]
    // },

    //bug 追踪
    devtool: 'inline-source-map',

    // 热重载
    devServer: {
        contentBase: path.resolve(rootPath, './dist'),
        compress: true,//一切服务都启用gzip 压缩
        // host: "192.168.12.139",//指定使用一个 host。默认是 localhost 192.168.12.139
        // port: 9000, //端口号
        host: "localhost",
        // port: "9000",
        open: true, //是否自动打开 浏览器
        // publicPath: "/as/", //此路径下的打包文件可在浏览器中访问
    },

    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve('static'),
            // 'assets': path.resolve(__dirname, '../src/assets'),
            'bootstrap': path.resolve('../static/bootstrap'),   //如果是自己手动导入的话需要加这一句，如果是 npm install bootstrap --save的话不需要写这个
        }

    },


    plugins: [
        new HtmlWebpackPlugin({
            // title: "devEnvironment",
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common' // 指定公共 bundle 的名称。
        // })
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery",
            "windows.jQuery": "jquery"
        })
    ],

    // //性能
    // performance: {
    //     hints: "warning",   //提示类型
    // }

});