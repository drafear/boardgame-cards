const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

module.exports = {
    entry: {
      index: './src/index.ts',
      indexLess: './src/less/index.less',
      cards: './src/cards.ts',
      cardsLess: './src/less/cards.less',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions:['.ts','.js']
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
            },
            {
              test: /\.less$/i,
              use: [
                // compiles Less to CSS
                "style-loader",
                "css-loader",
                "less-loader",
              ],
            },
            {
              test: /\.bnf$/,
              use: "./bnf-loader",
            },
        ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(env)
      })
    ],
}