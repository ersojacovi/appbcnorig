cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
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
        "file": "plugins/cordova-plugin-geolocation/www/Coordinates.js",
        "id": "cordova-plugin-geolocation.Coordinates",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "Coordinates"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "id": "cordova-plugin-geolocation.PositionError",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "PositionError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/Position.js",
        "id": "cordova-plugin-geolocation.Position",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "Position"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/geolocation.js",
        "id": "cordova-plugin-geolocation.geolocation",
        "pluginId": "cordova-plugin-geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
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
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
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
        "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
        "id": "cordova-plugin-x-socialsharing.SocialSharing",
        "pluginId": "cordova-plugin-x-socialsharing",
        "clobbers": [
            "window.plugins.socialsharing"
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
        "file": "plugins/com.telerik.stripe/www/stripe.js",
        "id": "com.telerik.stripe.stripe",
        "pluginId": "com.telerik.stripe",
        "clobbers": [
            "stripe"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/charges.js",
        "id": "com.telerik.stripe.charges",
        "pluginId": "com.telerik.stripe",
        "clobbers": [
            "stripe.charges"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/customers.js",
        "id": "com.telerik.stripe.customers",
        "pluginId": "com.telerik.stripe",
        "clobbers": [
            "stripe.customers"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/recipients.js",
        "id": "com.telerik.stripe.recipients",
        "pluginId": "com.telerik.stripe",
        "clobbers": [
            "stripe.recipients"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/subscriptions.js",
        "id": "com.telerik.stripe.subscriptions",
        "pluginId": "com.telerik.stripe",
        "clobbers": [
            "stripe.subscriptions"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/transfers.js",
        "id": "com.telerik.stripe.transfers",
        "pluginId": "com.telerik.stripe",
        "clobbers": [
            "stripe.transfers"
        ]
    },
    {
        "file": "plugins/com.telerik.stripe/www/coupons.js",
        "id": "com.telerik.stripe.coupons",
        "pluginId": "com.telerik.stripe",
        "clobbers": [
            "stripe.coupons"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-device": "1.1.1",
    "cordova-plugin-file-opener2": "2.0.2",
    "cordova-plugin-geolocation": "2.0.1-dev",
    "cordova-plugin-globalization": "1.0.3-dev",
    "cordova-plugin-splashscreen": "3.0.0",
    "cordova-plugin-statusbar": "2.1.2",
    "cordova-plugin-whitelist": "1.2.0",
    "cordova-plugin-x-socialsharing": "5.0.10",
    "phonegap-plugin-barcodescanner": "4.0.1",
    "com.telerik.stripe": "1.0.6"
}
// BOTTOM OF METADATA
});