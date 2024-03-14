module.exports = {
  appUrl: ['/settings/learning-resources', '/openshift/learning-resources'],
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  sassPrefix: '.learning-resources, .learningResources',
  /**
   * Change to false after your app is registered in configuration files
   */
  interceptChromeConfig: false,
  hotReload: true,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
};