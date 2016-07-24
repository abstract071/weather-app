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

            $('.delete-btn').click(function() {
                $('.cities input[type=checkbox]').each(function(obj) {
                    //console.log($(this));
                    if ($(this).is(':checked')) {
                        var cityName = $(this).parent().find('.city-text').text();
                        searchController.weatherDataCollection.removeCityData(cityName);
                        dashboardController.pageController.pageView.removeSlides(cityName);
                    }
                });
                $('.cities').empty();

                _(searchController.weatherDataCollection.weatherDataArray).forEach(function (cityData) {
                    searchController.searchView.renderSearchResult(cityData, false, $('.degrees.active').data('identifier'));
                });
            });


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

