/**
 * Created by Vladyslav_Mykhailenk on 12/25/2014.
 */
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


        $(document).ready(function() {
            $('.sidebar-btn').on('click', function() {
                //$('#gallery-holder').addClass('extend');
                $('.sidebar').stop().toggle({
                    effect: 'slide',
                    direction: 'right',
                    duration: 700,
                    easing: 'linear',
                    //progress: function() {
                    //    $('.bxslider').bxSlider().reloadSlider();
                    //},
                    complete: function() {
                        $('.open-sb-btn').fadeIn('slow');
                        $('input[name=cityname]').val("");
                        //$('.bxslider').bxSlider({slideWidth: $('#gallery-holder').width()});
                    }
                });
            });
            $('.open-sb-btn').on('click', function() {
                //$('#gallery-holder').removeClass('extend');
                $('.open-sb-btn').fadeOut('fast', function() {
                    $('.sidebar').stop().toggle({
                        effect: 'slide',
                        direction: 'right',
                        duration: 700,
                        easing: 'linear'
                        //progress: function() {
                        //    $('.bxslider').bxSlider().reloadSlider();
                        //},
                        /*complete: function() {
                            //$('.open-sb-btn').fadeIn('slow');
                            $('.bxslider').bxSlider({slideWidth: $('#gallery-holder').width()});
                        }*/
                    });
                });
            });
        });
    };

    return App;
});

