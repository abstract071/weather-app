/**
 * Created by Vladyslav_Mykhailenk on 1/6/2015.
 */
define([
    'vendor',
    'components/settings/settings-view'
], function (Vendor, SettingsView) {
    'use strict';

    var $ = Vendor.$,
        _ = Vendor._,
        modernizr = Vendor.Modernizr,
        emitter = Vendor.util.EventEmitter,
        Class = Vendor.util.Class,
        SettingsController;

    SettingsController = Class.extend({
        defaultOptions: {

        },
        constructor: function (options) {
            this.options = _.extend({}, this.defaultOptions, options);
            this.initialize();
        },
        initialize: function () {
            this.settingsView = new SettingsView({ rootHolder: '.sidebar' });
            //emitter.on('transformDegrees', this.transformDegrees, this);
            this.setUpdateTimer();
        },
        setUpdateTimer: function () {
            setInterval(function() {
                if (modernizr.localstorage && localStorage['citiesNames']) {
                    var citiesNames = JSON.parse(localStorage['citiesNames']);
                }
                emitter.trigger('updateSlides', citiesNames);
            }, 60000);
        }
    });

    return SettingsController;
});