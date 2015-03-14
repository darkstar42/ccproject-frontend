(function() {
    'use strict';

    angular
        .module('ccfrontend.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['$scope', 'common', 'authService', 'AUTH_EVENTS', '$state'];

    function Shell($scope, common, authService, AUTH_EVENTS, $state) {
        /*jshint validthis: true */
        var vm = this;

        var logger = common.logger;

        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = false;
        vm.isAuthenticated = authService.isAuthenticated;

        activate();

        function activate() {
            common.$on(AUTH_EVENTS.notAuthorized, handleNotAuthorized);
            common.$on(AUTH_EVENTS.notAuthenticated, handleNotAuthenticated);

            logger.success('CCFrontend loaded!', null);
            hideSplash();

            $state.go('dashboard');
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            common.$timeout(function () {
                vm.showSplash = false;
            }, 1000);
        }

        function handleNotAuthorized() {
            console.dir('not authorized');
        }

        function handleNotAuthenticated() {
            $state.go('login');
        }
    }
})();
