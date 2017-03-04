define([
    'vendor',
    'text!components/dashboard/dashboard.tpl',
    'utils/gallery/jquery.bxslider.min'
], function (Vendor, dashboardTemplate) {
    'use strict';

    var $ = Vendor.$,
        _ = Vendor._,
        Granim = Vendor.Granim,
        Class = Vendor.util.Class,
        DashboardView;

    DashboardView = Class.extend({
        defaultOptions: {

        },
        constructor: function (options) {
            this.options = _.extend({}, this.defaultOptions, options);
            this.tpl = _.template(dashboardTemplate);
            this.render();
            this.initialize();
        },
        initialize: function () {
            //this.collectElements();

            window.granimInstance = new Granim({
                element: '#sun',
                name: 'radial-gradient',
                direction: 'radial',
                opacity: [0, .5, 1],
                isPausedWhenNotInView: true,
                states : {
                    "default-state": {
                        gradients: [
                            ['#FFF000', '#FFF000', '#FFF000'],
                            ['#FF5400', '#FF5400', '#FFF000']
                        ],
                        transitionSpeed: 5000
                    }
                }
            });

            this.addEventListeners();
        },
        render: function (){
            this.$holder = $(this.options.rootHolder);
            this.$holder.append(this.tpl());
        },
        addEventListeners: function() {
            $('.open-sb-btn').on('click', function() {
                $(this).removeClass('fadeInWithDelay').addClass('fadeOut');
                $('.sidebar').removeClass('slideOutRight').addClass('slideInRight');
            });
        }
    });


    return DashboardView;
});