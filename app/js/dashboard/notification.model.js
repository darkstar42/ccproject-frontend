(function() {
    'use strict';

    angular
        .module('ccfrontend.dashboard')
        .factory('NotificationModel', NotificationModel);

    NotificationModel.$inject = [
        'BaseModel'
    ];

    function NotificationModel(BaseModel) {
        var model = function() {
            BaseModel.apply(this, arguments);
        };

        model.prototype = Object.create(BaseModel.prototype);
        model.prototype.constructor = function Notification(properties) {
            BaseModel.call(this, properties);
        };
        model.prototype.accessors = {
        };

        return model;
    }
})();
