(function() {
    'use strict';

    angular
        .module('ccfrontend.layout')
        .controller('TopNav', TopNav);

    TopNav.$inject = [
        '$location', '$route', 'config', 'routehelper'
    ];

    function TopNav($location, $route, config, routehelper) {
        /*jshint validthis: true */
        var vm = this;

        vm.isAuthenticated = isAuthenticated;

        activate();

        function activate() {
        }

        function isAuthenticated() {
            return true;
        }
    }
})();
