require.config({
    baseUrl: 'js',
    paths: {
        'jquery': 'libs/jquery-2.1.3.min',
        'jqueryui': 'libs/jquery-ui',
        'jquerytouchpunch': 'libs/jquery.ui.touch-punch.min',
        'lodash': 'libs/lodash.min',
        'text': 'libs/text',
        'geoservice': 'services/google.maps.service',
        'forecastioservice': 'services/forecastio.service',
        'modernizr': 'libs/modernizr.min',
        'granim': 'libs/granim.min'
    },
    shim: {
        'jqueryui': {
            deps: ['jquery']
        },
        'jquerytouchpunch': {
            deps: ['jquery',
                   'jqueryui']
        },
        'utils/gallery/jquery.bxslider.min': {
            deps: ['jquery',
                   'jqueryui']
        },
        'utils/sliders/slider.scrollbar': {
            deps: ['jquery',
                   'jqueryui']
        },
        'libs/jquery.mCustomScrollbar': {
            deps: ['jquery',
                   'jqueryui']
        },
        'utils/gallery/bxslider': {
            deps: ['utils/gallery/jquery.bxslider.min']
        },
        'components/dashboard/dashboard-view': {
            deps: ['utils/gallery/jquery.bxslider.min']
        },
        'components/search/search-view': {
            deps: ['libs/jquery.mCustomScrollbar']
        },
        'app/app': {
            deps: ['components/dashboard/dashboard-view']
        }
    },
    packages: [ 'vendor' ]
});

require(['vendor',
         'app/app',
         'jquerytouchpunch'
    ], function(Vendor, App) {

    'use strict';

    Vendor.$(function() {
        new App();
    });

});