define([
    'vendor',
    'text!components/search/search.tpl',
    'text!components/search/search-result.tpl',
    'libs/jquery.mCustomScrollbar'
], function (Vendor, searchWrapperTemplate, searchResultTemplate) {
    'use strict';

    var $ = Vendor.$,
        _ = Vendor._,
        emitter = Vendor.util.EventEmitter,
        Class = Vendor.util.Class,
        SearchView;

    SearchView = Class.extend({
        defaultOptions: {

        },
        constructor: function (options) {
            this.options = _.extend({}, this.defaultOptions, options);
            this.wrapperTpl = _.template(searchWrapperTemplate);
            this.searchResultTpl = _.template(searchResultTemplate);
            this.render();
            this.initialize();
        },
        initialize: function () {
            $("#myMCS").mCustomScrollbar({ scrollButtons: { enable: false } });

            this.addEventListeners();
        },
        render: function (){
            this.$holder = $(this.options.rootHolder);
            this.$holder.append(this.wrapperTpl());
            this.$searchResultHolder = this.$holder.find(this.options.rootSearchResultHolder);
        },
        renderSearchResult: function (cityElement, isChecked, typeOfDegrees){

            this.$searchResultHolder.append(this.searchResultTpl({ cityElement: cityElement, isChecked: isChecked, typeOfDegrees: typeOfDegrees }));
        },
        clearSearchResult: function () {
            this.$searchResultHolder.empty();
        },
        addEventListeners: function() {
            $('input[name=cityname]').on('input', function() {
                emitter.trigger('searchStateHasChanged');
            });

            $('.icon-add').on('click', function() {
                emitter.trigger('addCityToCollection');
            });

            $('.sidebar-btn').on('click', function() {
                $('.open-sb-btn').removeClass('fadeOut').addClass('fadeInWithDelay');
                $('.sidebar').removeClass('slideInRight').addClass('slideOutRight');
            });
        }
    });

    return SearchView;
});