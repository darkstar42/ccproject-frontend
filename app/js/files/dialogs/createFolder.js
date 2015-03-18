(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .controller('CreateFolderController', CreateFolderController);

    CreateFolderController.$inject = ['$modalInstance'];

    function CreateFolderController($modalInstance, data) {
        /*jshint validthis: true */
        var vm = this;
        vm.cancel = cancel;
        vm.save = save;
        vm.hitEnter = hitEnter;

        vm.folder = {name: ''};

        function cancel() {
            $modalInstance.dismiss('Canceled');
        }

        function save() {
            $modalInstance.close(vm.folder.name);
        }

        function hitEnter(evt) {
            if (angular.equals(evt.keyCode, 13) &&
                !(angular.equals(vm.folder.name, null) ||
                angular.equals(vm.folder.name, ''))) {
                vm.save();
            }
        }
    }
})();
