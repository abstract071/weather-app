define('vendor', [
    'vendor/core',
    'utils/util'
], function(core, util) {
    'use strict';

    return {
        '$': core.$,
        '_': core._,
        'Modernizr': core.Modernizr,
        'Granim': core.Granim,
        'util': util
    };
});