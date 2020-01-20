const path = require('path');

module.exports = {
    entry: './src/sketch.ts',
    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "var",
        library: "at",
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [
            "node_modules",
            path.resolve(__dirname, "lib")
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    mode: 'development'
};