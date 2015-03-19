(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .factory('FileModel', FileModel);

    FileModel.$inject = [
        'BaseModel'
    ];

    function FileModel(BaseModel) {
        var model = function() {
            BaseModel.apply(this, arguments);
        };

        model.prototype = Object.create(BaseModel.prototype);
        model.prototype.constructor = function File(properties) {
            BaseModel.call(this, properties);
        };
        model.prototype.accessors = {
            /* jshint camelcase: false */
            get_icon: function() {
                return 'fa-file';
            }
        };

        return model;
    }
})();
