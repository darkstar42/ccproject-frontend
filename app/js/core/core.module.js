(function() {
    'use strict';

    angular.module('ccfrontend.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ngRoute', 'ngSanitize',

        /*
         * Reusable cross app code modules
         */
        'blocks.exception', 'blocks.logger', 'blocks.router',

        /*
         * 3rd party modules
         */
        'ui.bootstrap', 'ngplus'
    ]);
})();
