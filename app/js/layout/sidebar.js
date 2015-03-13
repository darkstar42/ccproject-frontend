(function() {
    'use strict';

    angular
        .module('ccfrontend.layout')
        .controller('Sidebar', Sidebar);

    Sidebar.$inject = [
        '$location', '$route', 'config', 'routehelper', 'authService'
    ];

    function Sidebar($location, $route, config, routehelper, authService) {
        /*jshint validthis: true */
        var vm = this;

        var keyCodes = config.keyCodes;

        vm.isCurrent = isCurrent;
        vm.routes = routehelper.getRoutes();
        vm.search = search;
        vm.searchText = '';
        vm.wip = [];
        vm.wipChangedEvent = config.events.storage.wipChanged;

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
            if (!route.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.searchText = '';
                return;
            }
            if ($event.type === 'click' || $event.keyCode === keyCodes.enter) {
                var route = '/sessions/search/';
                $location.path(route + vm.searchText);
            }
        }
    }
})();
