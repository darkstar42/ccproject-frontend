(function() {
    'use strict';

    angular
        .module('ccfrontend.layout')
        .controller('TopNav', TopNav);

    TopNav.$inject = [
        'authService'
    ];

    function TopNav(authService) {
        /*jshint validthis: true */
        var vm = this;

        vm.isAuthenticated = authService.isAuthenticated;

        activate();

        function activate() {
        }
    }
})();
