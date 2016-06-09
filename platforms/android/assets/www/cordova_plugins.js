cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
        "id": "cordova-plugin-globalization.GlobalizationError",
        "pluginId": "cordova-plugin-globalization",
        "clobbers": [
            "window.GlobalizationError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/globalization.js",
        "id": "cordova-plugin-globalization.globalization",
        "pluginId": "cordova-plugin-globalization",
        "clobbers": [
            "navigator.globalization"
        ]
    },
    {
        "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
        "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
        "pluginId": "phonegap-plugin-barcodescanner",
        "clobbers": [
            "cordova.plugins.barcodeScanner"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file-opener2/www/plugins.FileOpener2.js",
        "id": "cordova-plugin-file-opener2.FileOpener2",
        "pluginId": "cordova-plugin-file-opener2",
        "clobbers": [
            "cordova.plugins.fileOpener2"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
        "id": "cordova-plugin-x-socialsharing.SocialSharing",
        "pluginId": "cordova-plugin-x-socialsharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/stripe.js",
        "id": "com.telerik.stripe.stripe",
        "clobbers": [
            "stripe"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/charges.js",
        "id": "com.telerik.stripe.charges",
        "clobbers": [
            "stripe.charges"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/customers.js",
        "id": "com.telerik.stripe.customers",
        "clobbers": [
            "stripe.customers"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/recipients.js",
        "id": "com.telerik.stripe.recipients",
        "clobbers": [
            "stripe.recipients"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/subscriptions.js",
        "id": "com.telerik.stripe.subscriptions",
        "clobbers": [
            "stripe.subscriptions"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/transfers.js",
        "id": "com.telerik.stripe.transfers",
        "clobbers": [
            "stripe.transfers"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/coupons.js",
        "id": "com.telerik.stripe.coupons",
        "clobbers": [
            "stripe.coupons"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-globalization": "1.0.3-dev",
    "phonegap-plugin-barcodescanner": "4.0.1",
    "cordova-plugin-splashscreen": "3.0.0",
    "cordova-plugin-whitelist": "1.2.0",
    "cordova-plugin-file-opener2": "2.0.2",
    "cordova-plugin-x-socialsharing": "5.0.10",
    "cordova-plugin-device": "1.1.1",
    "cordova-plugin-statusbar": "2.1.2",
    "com.telerik.stripe": "1.0.6"
};
// BOTTOM OF METADATA
});