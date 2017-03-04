define([
    'vendor',
    'components/dashboard/dashboard-controller',
    'components/search/search-controller',
    'components/settings/settings-controller',
    'components/search/city-weather'
], function(Vendor, DashboardController, SearchController, SettingsController, CityWeather) {
    'use strict';

    var _ = Vendor._,
        modernizr = Vendor.Modernizr;

    var App = function() {
        //var emitter = Vendor.util.EventEmitter;
        var dashboardController = new DashboardController();
        var searchController = new SearchController();
        var settingsController = new SettingsController();
    };

    return App;
});

