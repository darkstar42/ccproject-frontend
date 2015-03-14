(function() {
    'use strict';

    angular
        .module('ccfrontend.auth')
        .controller('Register', Register);

    Register.$inject = ['common', 'authService', '$state'];

    function Register(common, authService, $state) {
        /*jshint validthis: true */
        var vm = this;

        var logger = common.logger;

        vm.credentials = {};
        vm.registerForm = {};
        vm.doRegister = doRegister;
        vm.submit = submit;

        function doRegister(credentials) {
            vm.error = false;
            vm.errorMessage = '';

            authService.register(credentials, function(authInfo) {
                $state.go('login');
            }, function(err) {
                vm.submitted = false;
                vm.error = true;
                vm.errorMessage = err.message || 'Something went wrong';
            });
        }

        function submit() {
            if (!vm.registerForm.$invalid) {
                vm.$submitted = true;
                vm.doRegister(vm.credentials);
            } else {
                vm.error = true;
                vm.errorMessage = 'Invalid form input';
            }
        }
    }
})();
