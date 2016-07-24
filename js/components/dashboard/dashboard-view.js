define([
    'vendor',
    'text!components/dashboard/dashboard.tpl',
    'utils/gallery/jquery.bxslider.min'
], function (Vendor, dashboardTemplate) {
    'use strict';

    var $ = Vendor.$,
        _ = Vendor._,
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
        },
        render: function (){
            this.$holder = $(this.options.rootHolder);
            this.$holder.append(this.tpl());
        }
    });


    return DashboardView;
});