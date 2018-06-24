const path = require('path');
const Clean = require('clean-webpack-plugin');
const Uglify = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        'router': './src/js/router.js',
        'router.min': './src/js/router.js',
        'demo': './src/js/demo/demo.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/js')
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new Uglify({
            include: /\.min\.js$/
        })]
    },
    plugins: [
        new Clean(['dist/js'], {
            verbose: true
        })
    ]
}