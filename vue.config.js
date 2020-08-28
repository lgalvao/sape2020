module.exports = {
    publicPath: '/',
    lintOnSave: false,
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/variaveis.scss";`
            }
        }
    }
};