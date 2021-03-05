module.exports = {
    publicPath: "./",
    indexPath: "index.html",
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        "/sasac": {
            // target: "http://172.16.207.95:8050/",
            // target: "http://172.16.5.7:18930/mock/5fd6cca75a7012132ecaa2f3/",
            target:   "http://172.16.5.120:8050/",
            pathRewrite: {
                "^/sasac": "/v1"
            },
            changeOrigin: true,
            ws: false
        }
    }
};