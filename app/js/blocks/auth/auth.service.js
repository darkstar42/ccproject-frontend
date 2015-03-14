(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .provider('authServiceConfig', authServiceConfig)
        .factory('authService', authService);

    var tokenIdentifier = 'JWTAuthToken';

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
            angular
                .module('blocks.auth')
                .config(function(localStorageServiceProvider) {
                    localStorageServiceProvider
                        .setPrefix('ccfrontend')
                        .setStorageType('sessionStorage');
                })
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
                                return $injector.get('authInterceptor');
                            }
                        ]
                    );
                });
        }
    }

    authService.$inject = [
        '$http',
        'config',
        'common',
        'AUTH_EVENTS',
        'USER_ROLES',
        'localStorageService',
        'jwtHelper'
    ];

    function authService(
        $http, config, common, AUTH_EVENTS, USER_ROLES,
        localStorageService, jwtHelper) {

        var currentUser = null;

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

            common.$on('$stateChangeStart', function(event, toState) {
                var authorizedRoles = toState.settings.authorizedRoles;

                if (!service.isAuthorized(authorizedRoles)) {
                    event.preventDefault();

                    if (service.isAuthenticated()) {
                        // User is not allowed
                        common.$broadcast(AUTH_EVENTS.notAuthorized);
                    } else {
                        // User is not logged in
                        common.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }
                }
            });
        }

        function register(credentials, success, error) {
            $http
                .post(config.apiBaseUrl + '/auth/register', credentials)
                .success(function(data) {
                    return success();
                })
                .error(function(data, status) {
                    return error(status);
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
                .error(function(data, status) {
                    common.$broadcast(AUTH_EVENTS.loginFailed);

                    return error(status);
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
