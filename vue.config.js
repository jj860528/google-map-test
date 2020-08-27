module.exports = {
    publicPath: '/gmap-test',
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    }
}