(function() {
    'use strict';

    angular
        .module('ccfrontend.dashboard')
        .run(routeConfig);

    routeConfig.$inject = ['routehelper', 'USER_ROLES'];

    /* @ngInject */
    function routeConfig(routehelper, USER_ROLES) {
        routehelper.configureRoutes(getRoutes());

        function getRoutes() {
            return [
                {
                    name: 'dashboard',
                    config: {
                        url: '/',
                        templateUrl: 'app/dashboard/dashboard.html',
                        title: 'Dashboard',
                        settings: {
                            nav: 1,
                            content: '<i class="fa fa-dashboard"></i> Dashboard',
                            authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                        }
                    }
                }
            ];
        }
    }
})();
