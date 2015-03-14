(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .factory('FolderModel', FolderModel);

    FolderModel.$inject = [
        'BaseModel'
    ];

    function FolderModel(BaseModel) {
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
