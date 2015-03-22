(function () {
    'use strict';

    angular
        .module('ccfrontend.files')
        .controller('Main', Main);

    Main.$inject = ['common', '$state', '$stateParams', 'FileService', 'JobService', 'dialogs', '$scope'];

    function Main(common, $state, $stateParams, FileService, JobService, dialogs, $scope) {
        /*jshint validthis: true */
        var vm = this;

        var menuOptions = [
            ['Create Job', function ($itemScope) {
                var entry = $itemScope.entry;

                showCreateJobModal(entry);
            }],
            null,
            ['Rename', function ($itemScope) {
                var entry = $itemScope.entry;

                showRenameEntryModal(entry);
            }],
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
        vm.breadcrumbEntries = [];
        vm.upload = FileService.upload;
        vm.menuOptions = menuOptions;
        vm.showCreateFolderModal = showCreateFolderModal;
        vm.showRenameEntryModal = showRenameEntryModal;
        vm.showCreateJobModal = showCreateJobModal;

        var logger = common.logger;

        activate();

        function activate() {
            initRootFolder();
            updateChildren();
            updateBreadcrumb();

            $scope.$watch('vm.files', function () {
                vm.upload(vm.currentFolderId, vm.files);
            });
        }

        function initRootFolder() {
            FileService
                .getRootFolder()
                .then(function (rootFolder) {
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
                    .then(function (children) {
                        vm.children = children;
                    });
            }
        }

        function updateBreadcrumb() {
            if (vm.currentFolderId !== '') {
                FileService
                    .getFolder(vm.currentFolderId)
                    .then(function (folder) {
                        fetchBreadcrumbParent(folder);
                    });
            }
        }

        function fetchBreadcrumbParent(folder) {
            vm.breadcrumbEntries.push(folder);

            if (folder.get('parentId') !== null) {
                FileService
                    .getFolder(folder.get('parentId'))
                    .then(fetchBreadcrumbParent);
            }
        }

        function deleteFile(entryId) {
            FileService
                .deleteFile(entryId)
                .then(function (response) {
                    logger.success('File sucessfully deleted!', null);
                });
        }

        function deleteFolder(entryId) {
            FileService
                .deleteFolder(entryId)
                .then(function (response) {
                    logger.success('Folder sucessfully deleted!', null);
                });
        }

        function showCreateFolderModal() {
            var dialog = dialogs
                .create(
                'app/files/dialogs/createFolder.html',
                'CreateFolderController as vm',
                {},
                {
                    size: 'sm',
                    keyboard: true,
                    backdrop: false
                }
            );

            dialog.result
                .then(function (name) {
                    var folder = FileService.createFolder(vm.currentFolderId, name);

                    FileService
                        .saveFolder(folder)
                        .then(function (response) {
                            logger.success('Folder sucessfully created!', null);
                        });
                }, function () {
                    // do nothing
                });
        }

        function showRenameEntryModal(entry) {
            var dialog = dialogs
                .create(
                'app/files/dialogs/renameEntry.html',
                'RenameEntryController as vm',
                entry,
                {
                    size: 'sm',
                    keyboard: true,
                    backdrop: false
                }
            );

            dialog.result
                .then(function (entry) {
                    var kind = entry.get('kind');

                    switch (kind) {
                        case 'file':
                            FileService
                                .saveFile(entry)
                                .then(function (response) {
                                    logger.success('File sucessfully renamed!', null);
                                });
                            break;
                        case 'folder':
                            FileService
                                .saveFolder(entry)
                                .then(function (response) {
                                    logger.success('Folder sucessfully renamed!', null);
                                });
                            break;
                    }
                }, function () {
                    // do nothing
                });
        }

        function showCreateJobModal(entry) {
            var dialog = dialogs
                .create(
                'app/files/dialogs/createJob.html',
                'CreateJobController as vm',
                entry,
                {
                    size: 'md',
                    keyboard: true,
                    backdrop: false
                }
            );

            dialog.result
                .then(function (jobData) {
                    var job = JobService.createJob(jobData.image, jobData.cmd, jobData.src, jobData.dst);

                    JobService
                        .enqueueJob(job)
                        .then(function (response) {
                            console.dir(response);
                            logger.success('Job sucessfully enqueued!', null);
                        });
                }, function () {
                    // do nothing
                });
        }
    }
})();
