module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/domathome/'
    : '/',

  pwa: {
    name: 'Dom at Home',
    themeColor: '#53b45a',
    appleMobileWebAppCapable: 'yes'
  }
}