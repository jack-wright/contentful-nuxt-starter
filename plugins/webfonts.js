// import only in browser
if (process.browser) {
    var WebFont = require('webfontloader');

    WebFont.load({
        google: {
            families: ['Alegreya:400,700', 'Open Sans:400,700']
        }
    });
}