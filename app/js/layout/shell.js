(function() {
    'use strict';

    angular
        .module('ccfrontend.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['common'];

    function Shell(common) {
        /*jshint validthis: true */
        var vm = this;

        var logger = common.logger;

        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = false;

        activate();

        function activate() {
            logger.success('CCFrontend loaded!', null);
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            common.$timeout(function () {
                vm.showSplash = false;
            }, 1000);
        }
    }
})();
