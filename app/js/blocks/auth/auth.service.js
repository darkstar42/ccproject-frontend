(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .provider('authServiceConfig', authServiceConfig)
        .factory('authService', authService);

    function authServiceConfig() {
        /* jshint validthis:true */
        this.config = {
            // These are the properties we need to set
            // $routeProvider: undefined
            // docTitle: ''
            // resolveAlways: { ready: function() {} }
        };

        this.$get = function() {
            return {
                config: this.config
            };
        };

        init();

        function init() {
        }
    }

    authService.$inject = [
        '$http',
        'config',
        'common',
        'AUTH_EVENTS',
        'USER_ROLES',
        'localStorageService',
        'jwtHelper',
        'jwtInterceptor',
        'authServiceConfig'
    ];

    function authService(
        $http, config, common, AUTH_EVENTS, USER_ROLES,
        localStorageService, jwtHelper, jwtInterceptor, authServiceConfig) {

        var currentUser = null;
        var tokenIdentifier = 'JWTAuthToken';

        var service = {
            register: register,
            login: login,
            logout: logout,
            getUser: getUser,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized
        };

        init();

        return service;

        function init() {
            var authToken = localStorageService.get(tokenIdentifier);

            if (authToken !== null) {
                var isExpired = jwtHelper.isTokenExpired(authToken);

                if (isExpired) {
                    localStorageService.remove(tokenIdentifier);
                } else {
                    var payload = jwtHelper.decodeToken(authToken);

                    currentUser = parseJWTToken(authToken);
                }
            }

            angular
                .module('blocks.auth')
                .config(function(jwtInterceptorProvider) {
                    jwtInterceptorProvider.tokenGetter = ['localStorageService', function(localStorageService) {
                        return localStorageService.get(tokenIdentifier);
                    }];
                })
                .config(function($httpProvider) {
                    $httpProvider.interceptors.push(
                        'jwtInterceptor',
                        [
                            '$injector',
                            function($injector) {
                                return $injector.get('AuthInterceptor');
                            }
                        ]
                    )
                });
        }

        function register(credentials, success, error) {
            $http
                .post(config.apiBaseUrl + '/auth/register', credentials)
                .success(function(data) {
                    return success();
                })
                .error(function(data) {
                    return error(data);
                });
        }

        function login(credentials, success, error) {
            $http
                .post(config.apiBaseUrl + '/auth', credentials)
                .success(function(data) {
                    var authToken = data.auth;

                    if (typeof authToken === 'undefined') {
                        return error({message: 'No auth token retrieved'});
                    }

                    localStorageService.set(tokenIdentifier, authToken);

                    var authInfo = parseJWTToken(authToken);
                    currentUser = authInfo;

                    common.$broadcast(AUTH_EVENTS.loginSuccess);

                    return success(authInfo);
                })
                .error(function(data) {
                    common.$broadcast(AUTH_EVENTS.loginFailed);

                    return error(data);
                });
        }

        function logout() {
            localStorageService.remove(tokenIdentifier);
            currentUser = null;

            common.$broadcast(AUTH_EVENTS.logoutSuccess);
        }

        function getUser() {
            return currentUser;
        }

        function isAuthenticated() {
            return !!currentUser;
        }

        function isAuthorized(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }

            if (authorizedRoles.indexOf(USER_ROLES.all) !== -1) {
                return true;
            }

            if (isAuthenticated()) {
                return authorizedRoles.indexOf(getUser().role) !== -1;
            } else {
                return authorizedRoles.indexOf(USER_ROLES.guest) !== -1;
            }
        }

        function parseJWTToken(authToken) {
            var payload = jwtHelper.decodeToken(authToken);

            return {
                user: payload.user,
                role: payload.role
            };
        }
    }
})();
