(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .constant('USER_ROLES', {
            all: '*',
            admin: 'admin',
            user: 'user',
            guest: 'guest'
        })
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        });
})();
