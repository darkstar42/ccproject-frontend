(function() {
    'use strict';

    angular
        .module('ccfrontend.user')
        .factory('UserService', UserService);

    UserService.$inject = [
        '$http',
        'common',
        'config',
        'UserModel'
    ];

    function UserService($http, common, config, UserModel) {
        var users = {};

        var service = {
            getUserByName: getUserByName
        };

        return service;

        function getUserByName(name) {
            var deferred = common.$q.defer();

            // Check if the user is already available
            if (typeof users[name] === 'object') {
                deferred.resolve(users[name]);
            } else {
                $http
                    .get(config.apiBaseUrl + '/users;name=' + name)
                    .success(function(response) {
                        var user = new UserModel(response);
                        var name = user.get('name');

                        users[name] = user;

                        deferred.resolve(user);
                    })
                    .error(function(data, code) {
                        deferred.reject(data);
                    });
            }

            return deferred.promise;
        }
    }
})();
