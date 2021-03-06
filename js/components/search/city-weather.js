define(['vendor'], function (Vendor) {
    'use strict';

    var _ = Vendor._,
        Class = Vendor.util.Class,
        CityWeather;

    CityWeather = Class.extend({
        constructor: function (options) {
            _.assign(this, options);
            this.initialize();
        },
        initialize: function () {
        },
        convertToCelsius: function(fahrenheits) {
            return Math.round((fahrenheits - 32)/1.8);
        }
    });

    return CityWeather;
});