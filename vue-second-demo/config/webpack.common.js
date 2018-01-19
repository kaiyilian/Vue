/**
 * Created by Administrator on 2018/1/8.
 */

const path = require("path");
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');//清空文件夹

const rootPath = path.resolve(__dirname, "../");
// console.log("rootPath:-----------" + rootPath)
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

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
            },
        ]
    },

    resolve: {
        extensions: ['.json', '.js', '.vue'],
        // fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components'),

            // 2. 定义别名和插件位置
            // webpack 使用 jQuery，如果是自行下载的
            // 'jquery': path.resolve(__dirname, '../src/assets/libs/jquery/jquery.min'),
            // 如果使用NPM安装的jQuery
            'jquery': 'jquery'
        }
    },

    //插件
    plugins: [
        new CleanWebpackPlugin(['../dist']),//清空文件夹

        // new webpack.NameModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new UglifyJSPlugin()
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery",
            "windows.jQuery": "jquery"
        })
    ]

};