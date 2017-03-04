define([
    'vendor',
    'text!components/settings/settings.tpl',
    'utils/sliders/slider.range.days',
    'utils/sliders/slider.range.update'
], function (Vendor, settingsTemplate, daysRangeSlider, updateRangeSlider) {
    'use strict';

    var $ = Vendor.$,
        _ = Vendor._,
        emitter = Vendor.util.EventEmitter,
        Class = Vendor.util.Class,
        SettingsView;

    SettingsView = Class.extend({
        defaultOptions: {

        },
        constructor: function (options) {
            this.options = _.extend({}, this.defaultOptions, options);
            this.tpl = _.template(settingsTemplate);
            this.initialize();
            this.render();
            this.addEventListeners();
        },
        initialize: function () {
            this.collectElements();
            daysRangeSlider();
            updateRangeSlider();
        },
        collectElements: function () {
            this.$holder = $(this.options.rootHolder);
        },
        render: function (){
            this.$holder.append(this.tpl());
        },
        addEventListeners: function() {
            $('.fahrenheit, .celsius').click(function(event) {
                emitter.trigger('transformDegrees', event);
            });
        }
    });

    return SettingsView;
});