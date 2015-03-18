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
        model.prototype.constructor = function Folder(properties) {
            BaseModel.call(this, properties);
        };
        model.prototype.accessors = {
            get_filesize: function() {
                return 0;
            },
            get_icon: function() {
                return 'fa-folder';
            }
        };

        return model;
    }
})();
