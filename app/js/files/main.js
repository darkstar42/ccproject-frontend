(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .controller('Main', Main);

    Main.$inject = ['common', '$state', '$stateParams', 'FileService', '$scope'];

    function Main(common, $state, $stateParams, FileService, $scope) {
        /*jshint validthis: true */
        var vm = this;

        vm.rootFolder = null;
        vm.currentFolderId = $stateParams.entryId;
        vm.children = [];
        vm.upload = FileService.upload;

        var logger = common.logger;

        activate();

        function activate() {
            initRootFolder();
            updateChildren();

            $scope.$watch('vm.files', function () {
                vm.upload(vm.currentFolderId, vm.files);
            });
        }

        function initRootFolder() {
            FileService
                .getRootFolder()
                .then(function(rootFolder) {
                    vm.rootFolder = rootFolder;

                    if (vm.currentFolderId === '') {
                        $state.go('files-entryId', {entryId: rootFolder.get('entryId')});
                    }
                });
        }

        function updateChildren() {
            if (vm.currentFolderId !== '') {
                FileService
                    .getChildren(vm.currentFolderId)
                    .then(function(children) {
                        vm.children = children;
                    });
            }
        }
    }
})();
