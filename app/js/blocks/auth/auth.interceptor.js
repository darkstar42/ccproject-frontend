(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = [
        'common',
        'AUTH_EVENTS'
    ];

    function authInterceptor(common, AUTH_EVENTS) {
        var interceptor = {
            responseError: responseError
        };

        return interceptor;

        function responseError(response) {
            common.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout
            }[response.status], response);

            return common.$q.reject(response);
        }
    }
})();
