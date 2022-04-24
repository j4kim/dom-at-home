module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/domathome/'
    : '/',

  pwa: {
    name: 'Dom at Home',
    themeColor: '#6eacd6',
    appleMobileWebAppCapable: 'yes'
  }
}