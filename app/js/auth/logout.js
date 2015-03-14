(function() {
    'use strict';

    angular
        .module('ccfrontend.auth')
        .controller('Logout', Logout);

    Logout.$inject = ['authService', '$state'];

    function Logout(authService, $state) {
        /*jshint validthis: true */
        var vm = this;

        activate();

        function activate() {
            authService.logout();
            $state.go('login');
        }
    }
})();
