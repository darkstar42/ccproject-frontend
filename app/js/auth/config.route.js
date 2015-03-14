(function() {
    'use strict';

    angular
        .module('ccfrontend.auth')
        .run(routeConfig);

    routeConfig.$inject = ['routehelper', 'USER_ROLES'];

    /* @ngInject */
    function routeConfig(routehelper, USER_ROLES) {
        routehelper.configureRoutes(getRoutes());

        function getRoutes() {
            return [
                {
                    name: 'login',
                    config: {
                        url: '/login',
                        templateUrl: 'app/auth/login.html',
                        title: 'Login',
                        settings: {
                            authorizedRoles: [USER_ROLES.guest]
                        }
                    }
                },
                {
                    name: 'logout',
                    config: {
                        url: '/logout',
                        controller: 'Logout as vm',
                        title: 'Logout',
                        settings: {
                            nav: 99,
                            content: '<i class="fa fa-dashboard"></i> Logout',
                            authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                        }
                    }
                },
                {
                    name: 'register',
                    config: {
                        url: '/register',
                        templateUrl: 'app/auth/register.html',
                        title: 'Register',
                        settings: {
                            authorizedRoles: [USER_ROLES.guest]
                        }
                    }
                }
            ];
        }
    }
})();
