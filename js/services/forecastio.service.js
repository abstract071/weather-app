define(/*'components/dashboard/dashboard-view', */[
    'vendor'
], function (Vendor) {
    'use strict';

    var $ = Vendor.$,
        _ = Vendor._,
        emitter = Vendor.util.EventEmitter,
        Class = Vendor.util.Class;

    var ForecastIO = (function () {

        //https://api.forecast.io/forecast/5454479574cce92c82b460be661b3441/37.8267,-122.423
        var forecastURL = "https://api.forecast.io/forecast/";
        var forecastAPIKEY = "5454479574cce92c82b460be661b3441/";

        return {
            getForecastIOResponse: function(latitude, longitude, cityName) {
                var forecastDeferred = $.Deferred();
                $.getJSON(forecastURL + forecastAPIKEY + latitude + ',' + longitude + '?callback=?', function (data, forecastStatus) {
                    if (cityName) {
                        forecastDeferred.resolve(cityName, data);
                    } else {
                        forecastDeferred.resolve(data);
                    }
                });
                return forecastDeferred;
            }
        };

    })();


    return ForecastIO;
});