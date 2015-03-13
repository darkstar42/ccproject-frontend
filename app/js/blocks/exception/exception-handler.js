(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .provider('exceptionConfig', exceptionConfigProvider)
        .config(exceptionConfig);

    // Must configure the service and set its
    // events via the exceptionConfigProvider
    function exceptionConfigProvider() {
        /* jshint validthis:true */
        this.config = {
            //appErrorPrefix: ''
        };

        this.$get = function() {
            return {
                config: this.config
            };
        };
    }

    exceptionConfig.$inject = ['$provide'];

    // Configure by setting an optional string value for appErrorPrefix
    // Accessible via config.appErrorPrefix
    function exceptionConfig($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', 'exceptionConfig', 'logger'];

    // Extend the $exceptionHandler service to also display a toast
    function extendExceptionHandler($delegate, exceptionConfig, logger) {
        var appErrorPrefix = exceptionConfig.config.appErrorPrefix || '';

        return function(exception, cause) {
            $delegate(exception, cause);

            var errorData = {
                exception: exception,
                cause: cause
            };
            var msg = appErrorPrefix + exception.message;

            logger.error(msg, errorData);
        };
    }
})();
