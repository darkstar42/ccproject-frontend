(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routehelperConfig', routehelperConfig)
        .factory('routehelper', routehelper);

    // Must configure via the routehelperConfigProvider
    function routehelperConfig() {
        /* jshint validthis:true */
        var self = this;

        /* jshint validthis:true */
        this.config = {
            // These are the properties we need to set
            // $routeProvider: undefined
            // docTitle: ''
            // resolveAlways: { ready: function() {} }
        };

        angular
            .module('ccfrontend.core')
            .config(function($locationProvider, $stateProvider, $urlRouterProvider) {
                $locationProvider.html5Mode(true);
                $urlRouterProvider.otherwise('/');

                self.config.stateProvider = $stateProvider;
                self.config.urlRouterProvider = $urlRouterProvider;
            });

        this.$get = function() {
            return {
                config: this.config
            };
        };
    }

    routehelper.$inject = [
        'common',
        '$location',
        '$state',
        '$rootScope',
        'logger',
        'routehelperConfig'
    ];

    function routehelper(common, $location, $state, $rootScope, logger, routehelperConfig) {
        var handlingRouteChangeError = false;
        var routeCounts = {
            errors: 0,
            changes: 0
        };
        var routes = [];
        var stateProvider = routehelperConfig.config.stateProvider;
        var urlRouterProvider = routehelperConfig.config.urlRouterProvider;

        var service = {
            configureRoutes: configureRoutes,
            getRoutes: getRoutes,
            routeCounts: routeCounts
        };

        init();

        return service;

        function configureRoutes(routes) {
            routes.forEach(function(route) {
                /*
                route.config.resolve = angular.extend(
                    route.config.resolve || {},
                    routehelperConfig.config.resolveAlways
                );
                */

                stateProvider.state(route.name, route.config);
            });

            urlRouterProvider.otherwise('/');
        }

        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard
            // Provide an exit clause if it tries to do it twice
            $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
                if (handlingRouteChangeError) {
                    return;
                }

                routeCounts.errors++;
                handlingRouteChangeError = true;

                var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                    'unknown target';
                var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');

                logger.warning(msg, [current]);
                $location.path('/');
            });
        }

        function init() {
            handleRoutingErrors();
            updateDocTitle();
        }

        function getRoutes() {
            var states = $state.get();
            var routes = [];

            for (var idx = 0; idx < states.length; idx++) {
                var state = states[idx];

                var isRoute = !!state.title;

                if (isRoute) {
                    routes.push(state);
                }
            }

            return routes;
        }

        function updateDocTitle() {
            common.$on('$stateChangeSuccess', function(event, toState) {
                var stateTitle = toState.title;
                var docTitle = routehelperConfig.config.docTitle;

                routeCounts.changes++;
                handlingRouteChangeError = false;

                $rootScope.title = docTitle + ' ' + (stateTitle || '');
            });
        }
    }
})();
