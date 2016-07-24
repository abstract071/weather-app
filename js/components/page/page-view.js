/**
 * Created by Vlad on 15.01.2015.
 */
define([
    'vendor',
    'text!components/page/page.tpl',
    'utils/sliders/slider.scrollbar'
], function (Vendor, pageTemplate, scrollbarSlider) {
    'use strict';

    var $ = Vendor.$,
        _ = Vendor._,
        emitter = Vendor.util.EventEmitter,
        Class = Vendor.util.Class,
        PageView;

    PageView = Class.extend({
        defaultOptions: {

        },
        constructor: function (options) {
            this.options = _.extend({}, this.defaultOptions, options);
            this.tpl = _.template(pageTemplate);
            this.initialize();
        },

        initialize: function () {
            this.collectElements();
            this.initTimer();
        },
        setTime: function () {
            var date = new Date();
            $('.subheader .time').text(date.getHours() + ':' + date.getMinutes());
        },
        initTimer: function () {
            var self = this;
            setInterval(function() {
                self.setTime();
            }, 60000);
        },
        collectElements: function () {
            this.$holder = $(this.options.rootHolder);
        },
        renderSearchResult: function (cityData, typeOfDegrees){
            var pageTpl = this.tpl({ cityData: cityData, typeOfDegrees: typeOfDegrees });
            this.$holder.append(pageTpl);
            this.setTime();
            return $(pageTpl).data('city-name');
        },
        removeSlides: function(cityName) {
            emitter.trigger('removeSlides', cityName);
        },
        renderTemperatureRanges: function() {
            emitter.trigger('renderTemperatureRanges');
        }

    });

    return PageView;
});