const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'source'),
    entry: {
        app: path.resolve(__dirname, 'source/js', 'app.js'),
    },
    output: {
        filename: 'bundle.[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: path.join('images', '[name].[ext]'),
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            scriptLoading: 'blocking',
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'main.css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'source/favicon.ico'),
                    to: path.resolve(__dirname, 'dist'),
                },
                {
                    from: path.resolve(__dirname, 'readme.md'),
                    to: path.resolve(__dirname, 'dist'),
                },
                {
                    from: path.resolve(__dirname, '.gitignore'),
                    to: path.resolve(__dirname, 'dist'),
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true,
                        },
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpg|jpeg|webp$)/,
                generator: {
                    filename: 'images/[name].[ext]',
                },
                type: 'asset/resource',
            },
            {
                test: /\.(ttf|woff|woff2|eoc$)/,
                generator: {
                    filename: 'fonts/[name].[ext]',
                },
                type: 'asset/resource',
            },
            {
                test: /\.ico/,
                generator: {
                    filename: 'favicon.ico',
                },
                type: 'asset/resource',
            },
        ],
    },
    devServer: {
        port: 4300,
        hot: true,
        watchFiles: path.resolve(__dirname, 'source'),
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserJSPlugin(), new OptimizeCSSPlugin()],
    },
};
