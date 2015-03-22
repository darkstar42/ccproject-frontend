(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .factory('NotificationService', NotificationService);

    NotificationService.$inject = [
        '$http',
        'common',
        'config',
        'NotificationModel'
    ];

    function NotificationService($http, common, config, NotificationModel) {
        var logger = common.logger;

        var service = {
            getNotifications: getNotifications
        };

        return service;

        function getNotifications() {
            var deferred = common.$q.defer();

            logger.info('Retrieve notifications');

            $http
                .get(config.apiBaseUrl + '/notifications')
                .success(function (response) {
                    var notifications = [];
                    for (var i = 0; i < response.notifications.length; i++) {
                        var notificationData = response.notifications[i];
                        var notification = new NotificationModel(notificationData);

                        notifications.push(notification);
                    }

                    deferred.resolve(notifications);
                })
                .error(function (msg, error) {
                    logger.error('Error while retrieving notifications');
                    deferred.reject(msg);
                });

            return deferred.promise;
        }
    }
})();
