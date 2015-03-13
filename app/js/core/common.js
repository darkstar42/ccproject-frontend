(function() {
    'use strict';

    angular
        .module('ccfrontend.core')
        .factory('common', common);

    common.$inject = ['$location', '$q', '$rootScope', '$timeout', 'logger'];

    /* @ngInject */
    function common($location, $q, $rootScope, $timeout, logger) {
        var service = {
            // Common angular dependencies
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,

            // Generic
            isNumber: isNumber,
            logger: logger,
            textContains: textContains
        };

        return service;

        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        function isNumber(val) {
            return (/^[-]?\d+$/).test(val);
        }

        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }
    }
})();
