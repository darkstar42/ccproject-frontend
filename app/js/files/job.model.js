(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .factory('JobModel', JobModel);

    JobModel.$inject = [
        'BaseModel'
    ];

    function JobModel(BaseModel) {
        var model = function() {
            BaseModel.apply(this, arguments);
        };

        model.prototype = Object.create(BaseModel.prototype);
        model.prototype.constructor = function Job(properties) {
            BaseModel.call(this, properties);
        };
        model.prototype.accessors = {
            /* jshint camelcase: false */
            get_icon: function() {
                return 'fa-cog';
            }
        };

        return model;
    }
})();
