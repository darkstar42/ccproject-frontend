(function() {
    'use strict';

    angular
        .module('ccfrontend.dashboard')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['common', '$state', '$stateParams', 'NotificationService', 'dialogs', '$scope'];

    function Dashboard(common, $state, $stateParams, NotificationService, dialogs, $scope) {
        /*jshint validthis: true */
        var vm = this;

        vm.notifications = [];

        var logger = common.logger;

        activate();

        function activate() {
            NotificationService
                .getNotifications()
                .then(function(notifications) {
                    vm.notifications = notifications;
                });
        }
    }
})();
