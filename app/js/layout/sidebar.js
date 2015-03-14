(function() {
    'use strict';

    angular
        .module('ccfrontend.layout')
        .controller('Sidebar', Sidebar);

    Sidebar.$inject = [
        '$state', 'routehelper', 'authService'
    ];

    function Sidebar($state, routehelper, authService) {
        /*jshint validthis: true */
        var vm = this;

        vm.isCurrent = isCurrent;
        vm.routes = routehelper.getRoutes();
        vm.isAuthenticated = authService.isAuthenticated;

        activate();

        function activate() {
            getNavRoutes();
        }

        function getNavRoutes() {
            vm.navRoutes = vm.routes.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$state.current || !$state.current.title) {
                return '';
            }

            var menuName = route.title;
            return $state.current.title.substr(0, menuName.length) === menuName ? 'active' : '';
        }
    }
})();
