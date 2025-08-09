const path = require('path');
module.exports = {
    entry: {
        main: './src/app.ts',
        css: './src/less/index.less',
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
                test:/\.ts$/, loader:'ts-loader'
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
        ]
    }
}