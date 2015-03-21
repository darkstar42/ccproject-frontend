(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .controller('CreateJobController', CreateJobController);

    CreateJobController.$inject = ['$modalInstance', 'data'];

    function CreateJobController($modalInstance, entry) {
        /*jshint validthis: true */
        var vm = this;
        vm.cancel = cancel;
        vm.save = save;
        vm.hitEnter = hitEnter;
        vm.entry = entry;

        vm.job = {
            image: 'ffmpeg',
            cmd: 'ffmpeg -i ' + entry.get('entryId') + ' ' + entry.get('title'),
            src: entry.get('entryId'),
            dst: entry.get('parentId')
        };

        function cancel() {
            $modalInstance.dismiss('Canceled');
        }

        function save() {
            $modalInstance.close(vm.job);
        }

        function hitEnter(evt) {
            if (angular.equals(evt.keyCode, 13) &&
                !(angular.equals(vm.job.image, null) ||
                angular.equals(vm.job.image, '')) &&
                !(angular.equals(vm.job.cmd, null) ||
                angular.equals(vm.job.cmd, ''))
            ) {
                vm.save();
            }
        }
    }
})();
