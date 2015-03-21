(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .controller('RenameEntryController', RenameEntryController);

    RenameEntryController.$inject = ['$modalInstance', 'data'];

    function RenameEntryController($modalInstance, entry) {
        /*jshint validthis: true */
        var vm = this;
        vm.cancel = cancel;
        vm.save = save;
        vm.hitEnter = hitEnter;
        vm.entry = entry;

        function cancel() {
            $modalInstance.dismiss('Canceled');
        }

        function save() {
            $modalInstance.close(vm.entry);
        }

        function hitEnter(evt) {
            if (angular.equals(evt.keyCode, 13) &&
                !(angular.equals(vm.entry.properties.title, null) ||
                angular.equals(vm.entry.properties.title, ''))) {
                vm.save();
            }
        }
    }
})();
