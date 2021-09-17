const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/Maths/Math.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: 'build'
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: 'ts-loader',
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, 'src'),
                ]
            }
        ]
    },
    resolve: {
        extensions: [
            'ts'
        ]
    },
    optimization: {
        minimize: false,
    }
}