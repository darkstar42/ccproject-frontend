(function() {
    'use strict';

    angular
        .module('ccfrontend.auth')
        .controller('Login', Login);

    Login.$inject = ['$scope', 'common', 'authService', 'AUTH_EVENTS', '$state'];

    function Login($scope, common, authService, AUTH_EVENTS, $state) {
        /*jshint validthis: true */
        var vm = this;

        var logger = common.logger;

        vm.credentials = {};
        vm.loginForm = {};
        vm.doLogin = doLogin;
        vm.submit = submit;

        function doLogin(credentials) {
            vm.error = false;
            vm.errorMessage = '';

            authService.login(credentials, function(authInfo) {
                $state.go('dashboard');
            }, function(err) {
                vm.submitted = false;
                vm.error = true;
                vm.errorMessage = err.message || 'Something went wrong';
            });
        }

        function submit() {
            if (!vm.loginForm.$invalid) {
                vm.$submitted = true;
                vm.doLogin(vm.credentials);
            } else {
                vm.error = true;
                vm.errorMessage = 'Invalid form input';
            }
        }
    }
})();
