/**
 * Created by Administrator on 2018/1/8.
 */

// const webpack = require('webpack');
// const merge = require('webpack-merge');//合并 webpack
// const common = require('./webpack.common.js');
// const HtmlWebpackPlugin = require('html-webpack-plugin');//生成HTML 模板
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');//删除 未引用的 代码
//
// //正式环境
// module.exports = merge(common, {
//
//     devtool: 'source-map',
//
//     plugins: [
//         new HtmlWebpackPlugin({
//             title: "Production"
//         }),
//         new UglifyJSPlugin({
//             sourceMap: true
//         }),
//         new webpack.DefinePlugin({
//             'process.env.NODE_ENV': JSON.stringify('production')
//         })
//     ]
//
// });