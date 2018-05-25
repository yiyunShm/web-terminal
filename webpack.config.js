const path = require('path');

module.exports = {
    entry: "./static/js/app.js",
    output: {
        path: path.join(__dirname, './dist'),
        filename: "bundle.js"
    },
    module: {
        rules: [
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};