(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .run(routeConfig);

    routeConfig.$inject = ['routehelper', 'USER_ROLES'];

    /* @ngInject */
    function routeConfig(routehelper, USER_ROLES) {
        routehelper.configureRoutes(getRoutes());

        function getRoutes() {
            return [
                {
                    name: 'files',
                    config: {
                        url: '/files',
                        templateUrl: 'app/files/main.html',
                        title: 'Files',
                        settings: {
                            nav: 2,
                            content: '<i class="fa fa-hdd-o"></i> Files',
                            authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                        }
                    }
                }
            ];
        }
    }
})();
