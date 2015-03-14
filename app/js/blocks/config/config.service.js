(function() {
    'use strict';

    angular
        .module('blocks.config')
        .factory('ConfigService', ConfigService);

    ConfigService.$inject = [
        '$http',
        'common',
        'config'
    ];

    function ConfigService($http, common, config) {
        var attributes = null;

        var service = {
            getConfig: getConfig
        };

        return service;

        function getConfig(configParam) {
            if (typeof configParam !== 'string') {
                throw new Error('Unable to get configuration value for an invalid parameter');
            }

            var deferred = common.$q.defer();

            // check if the folder is already available
            if (attributes === null) {
                $http
                    .get(config.apiBaseUrl + '/about')
                    .success(function (response) {
                        attributes = response;

                        var configValue = attributes[configParam];

                        deferred.resolve(configValue);
                    })
                    .error(function (msg, code) {
                        deferred.reject(msg);
                    });
            } else {
                var configValue = attributes[configParam];

                deferred.resolve(configValue);
            }

            return deferred.promise;
        }
    }
})();
