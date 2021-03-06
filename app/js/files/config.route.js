(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .run(routeConfig);

    routeConfig.$inject = ['routehelper', 'USER_ROLES', 'FileService'];

    /* @ngInject */
    function routeConfig(routehelper, USER_ROLES, FileService) {
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

                            authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                        }
                    }
                },
                {
                    name: 'files-entryId',
                    config: {
                        url: '/files/:entryId',
                        templateUrl: 'app/files/main.html',
                        title: 'Files',
                        settings: {
                            nav: 2,
                            content: '<i class="fa fa-hdd-o"></i> Files',
                            authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                        }
                    }
                },
                {
                    name: 'view-entryId',
                    config: {
                        url: '/files/view/:entryId',
                        templateUrl: 'app/files/view.html',
                        title: 'View',
                        controller: 'View as vm',
                        settings: {
                            authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                        },
                        resolve: {
                            file: function($stateParams) {
                                return FileService.getFile($stateParams.entryId);
                            }
                        }
                    }
                }
            ];
        }
    }
})();
