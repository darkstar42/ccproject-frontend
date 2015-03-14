(function() {
    'use strict';

    angular
        .module('ccfrontend.user')
        .factory('UserModel', UserModel);

    UserModel.$inject = [
        'BaseModel'
    ];

    function UserModel(BaseModel) {
        var model = function() {
            BaseModel.apply(this, arguments);
        };

        model.prototype = Object.create(BaseModel.prototype);
        model.prototype.constructor = function User(properties) {
            BaseModel.call(this, properties);
        };
        model.prototype.accessors = {};

        return model;
    }
})();
