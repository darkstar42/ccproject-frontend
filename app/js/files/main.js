(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .controller('Main', Main);

    Main.$inject = ['common', '$state', '$stateParams', 'FileService', 'dialogs', '$scope'];

    function Main(common, $state, $stateParams, FileService, dialogs, $scope) {
        /*jshint validthis: true */
        var vm = this;

        var menuOptions = [
            ['Select', function ($itemScope) {
            }],
            null,
            ['Remove', function ($itemScope) {
                var entry = $itemScope.entry;
                var entryId = entry.get('entryId');
                var kind = entry.get('kind');

                switch (kind) {
                    case 'file':
                        deleteFile(entryId);
                        break;
                    case 'folder':
                        deleteFolder(entryId);
                        break;
                }
            }]
        ];

        vm.rootFolder = null;
        vm.currentFolderId = $stateParams.entryId;
        vm.children = [];
        vm.upload = FileService.upload;
        vm.menuOptions = menuOptions;
        vm.showCreateFolderModal = showCreateFolderModal;

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

        function deleteFile(entryId) {
            FileService
                .deleteFile(entryId)
                .then(function(response) {
                    console.dir(response);
                });
        }

        function deleteFolder(entryId) {
            FileService
                .deleteFolder(entryId)
                .then(function(response) {
                    console.dir(response);
                });
        }

        function showCreateFolderModal() {
            console.dir('show');

            var dialog = dialogs
                .create(
                    'app/files/dialogs/createFolder.html',
                    'CreateFolderController as vm',
                    {},
                    {
                        size:'sm',
                        keyboard: true,
                        backdrop: false
                    }
            );

            dialog.result
                .then(function(name) {
                    var folder = FileService.createFolder(vm.currentFolderId, name);

                    FileService
                        .saveFolder(folder)
                        .then(function(response) {
                            //console.dir(response);
                        });
                }, function() {
                    // do nothing
                });
        }
    }
})();
