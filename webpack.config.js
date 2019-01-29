const path = require('path');
import webpack from 'webpack';

module.exports = {
    entry: {
        Bundle: "./src/js/Bundle.js",
        Vendor: "./src/js/Vendor.js"
    },
    output: {
        path: path.resolve(__dirname, "./dist/scripts"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['env'],
                },
            },
        ],
    },
    plugins:[
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
          })
    ],
};