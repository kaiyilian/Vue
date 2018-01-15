/**
 * Created by Administrator on 2018/1/8.
 */

const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin');//清空文件夹

const rootPath = path.resolve(__dirname, "../");
// console.log("rootPath:-----------" + rootPath)

module.exports = {

    //入口
    entry: {
        main: "./src/main.js"
    },

    //出口
    output: {
        path: path.resolve(rootPath, "dist"),
        filename: "js/[name].bundle.js",
        // publicPath: "/static/", //此路径下的打包文件可在浏览器中访问
    },

    //module
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(png|jpg|svg)$/,
                use: [
                    "file-loader"
                ]
            },
            {
                test: /.vue$/,  // 解析 .vue 组件页面文件
                use: [
                    "vue-loader"
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    // name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },

    //插件
    plugins: [
        new CleanWebpackPlugin(['../dist']),//清空文件夹

        // new webpack.NameModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new UglifyJSPlugin()
    ]

};