// plugins/svg-sprite-loader.js

// import only in browser
if (process.browser) {
    // import all svgs
    var files = require.context('../assets/svg', false, /\.svg$/)
    files.keys().forEach(files)
}
  