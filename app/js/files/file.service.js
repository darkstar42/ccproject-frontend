(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .factory('FileService', FileService);

    FileService.$inject = [
        '$http',
        '$upload',
        'common',
        'config',
        'FileModel',
        'FolderModel',
        'ConfigService'
    ];

    function FileService($http, $upload, common, config, FileModel, FolderModel, ConfigService) {
        var folders = {};
        var files = {};
        var children = {};
        var logger = common.logger;

        var service = {
            createFolder: createFolder,
            deleteFile: deleteFile,
            deleteFolder: deleteFolder,
            getFile: getFile,
            getRootFolder: getRootFolder,
            getFolder: getFolder,
            getChildren: getChildren,
            saveFile: saveFile,
            saveFolder: saveFolder,
            upload: upload
        };

        return service;

        function getRootFolder() {
            var deferred = common.$q.defer();

            ConfigService
                .getConfig('rootFolderId')
                .then(rootFolderIdCallback, rootFolderErrorCallback);

            return deferred.promise;

            function rootFolderIdCallback(rootFolderId) {
                service
                    .getFolder(rootFolderId)
                    .then(rootFolderSuccessCallback, rootFolderErrorCallback);
            }

            function rootFolderSuccessCallback(rootFolder) {
                logger.info('Root folder: ' + rootFolder.get('entryId'));
                deferred.resolve(rootFolder);
            }

            function rootFolderErrorCallback(err) {
                logger.error('Root folder could not be loaded');
                deferred.reject(err);
            }
        }

        function deleteFile(entryId) {
            if (entryId === null) {
                throw new Error('Unable to delete a file with invalid entry id');
            }

            var deferred = common.$q.defer();

            $http
                .delete(config.apiBaseUrl + '/files/' + entryId)
                .success(function(response) {
                    var file = _getFile(response.file);
                    var parentId = file.get('parentId');
                    var parentChildren = children[parentId];

                    var index = parentChildren.indexOf(file);

                    if (index !== -1) {
                        parentChildren.splice(index, 1);
                    }

                    deferred.resolve(response);
                })
                .error(function(msg, error) {
                    deferred.reject(msg);
                });

            return deferred.promise;
        }

        function deleteFolder(entryId) {
            if (entryId === null) {
                throw new Error('Unable to delete a folder with invalid entry id');
            }

            var deferred = common.$q.defer();

            $http
                .delete(config.apiBaseUrl + '/folders/' + entryId)
                .success(function(response) {
                    var folder = _getFolder(response.folder);
                    var parentId = folder.get('parentId');
                    var parentChildren = children[parentId];

                    var index = parentChildren.indexOf(folder);

                    if (index !== -1) {
                        parentChildren.splice(index, 1);
                    }

                    deferred.resolve(response);
                })
                .error(function(msg, error) {
                    deferred.reject(msg);
                });

            return deferred.promise;
        }

        function saveFolder(folder) {
            if (!folder || folder === null) {
                throw new Error('Unable to save the given folder');
            }

            var isNewFolder = folder.get('entryId') === null;
            var deferred = common.$q.defer();

            $http
                .post(config.apiBaseUrl + '/folders', {folder: folder.properties})
                .success(function(response) {
                    var responseFolder = _getFolder(response.folder);
                    var parentId = responseFolder.get('parentId');
                    var parentChildren = children[parentId];

                    if (isNewFolder) {
                        parentChildren.push(responseFolder);
                    } else {
                        for (var i = 0; i < parentChildren.length; i++) {
                            var child = parentChildren[i];
                            if (child.get('entryId') === responseFolder.get('entryId')) {
                                parentChildren.splice(i, 1);
                                parentChildren.push(new FolderModel(response.folder));
                                break;
                            }
                        }
                    }

                    deferred.resolve(responseFolder);
                })
                .error(function(msg, error) {
                    deferred.reject(msg);
                });

            return deferred.promise;
        }

        function saveFile(file) {
            if (!file || file === null) {
                throw new Error('Unable to save the given file');
            }

            var isNewFile = file.get('entryId') === null;
            var deferred = common.$q.defer();

            $http
                .post(config.apiBaseUrl + '/files', {file: file.properties})
                .success(function(response) {
                    var responseFile = _getFile(response.file);
                    var parentId = responseFile.get('parentId');
                    var parentChildren = children[parentId];

                    if (isNewFile) {
                        parentChildren.push(responseFile);
                    } else {
                        for (var i = 0; i < parentChildren.length; i++) {
                            var child = parentChildren[i];
                            if (child.get('entryId') === responseFile.get('entryId')) {
                                parentChildren.splice(i, 1);
                                parentChildren.push(new FileModel(response.file));
                                break;
                            }
                        }
                    }

                    deferred.resolve(responseFile);
                })
                .error(function(msg, error) {
                    deferred.reject(msg);
                });

            return deferred.promise;
        }

        function getFile(entryId) {
            if (entryId === null) {
                throw new Error('Unable to get file with invalid entry id');
            }

            var deferred = common.$q.defer();

            // Check if the file is already available
            if (typeof files[entryId] === 'object') {
                logger.info('Get file from cache: ' + entryId);

                var file = files[entryId];
                deferred.resolve(file);
            } else {
                logger.info('Retrieve file: ' + entryId);
                $http
                    .get(config.apiBaseUrl + '/files/' + entryId)
                    .success(function(response) {
                        var file = _getFile(response);

                        deferred.resolve(file);
                    })
                    .error(function(msg, error) {
                        deferred.reject(msg);
                    });
            }

            return deferred.promise;
        }

        function getFolder(entryId) {
            if (entryId === null) {
                throw new Error('Unable to get folder with invalid entry id');
            }

            var deferred = common.$q.defer();

            // check if the folder is already available
            if (typeof folders[entryId] === 'object') {
                logger.info('Get folder from cache: ' + entryId);

                var folder = folders[entryId];
                deferred.resolve(folder);
            } else {
                logger.info('Retrieve folder: ' + entryId);
                $http
                    .get(config.apiBaseUrl + '/folders/' + entryId)
                    .success(function(response) {
                        var folder = _getFolder(response);

                        deferred.resolve(folder);
                    })
                    .error(function(msg, error) {
                        deferred.reject(msg);
                    });
            }

            return deferred.promise;
        }

        function getChildren(entryId) {
            if (entryId === null) {
                throw new Error('Unable to get children for an invalid entry id');
            }

            var deferred = common.$q.defer();

            // Check if the children are already available
            if (children[entryId] && Object.prototype.toString.call(children[entryId]) === '[object Array]') {
                logger.info('Get children from cache: ' + entryId);

                deferred.resolve(children[entryId]);
            } else {
                logger.info('Retrieve children for folder: ' + entryId);

                $http
                    .get(config.apiBaseUrl + '/folders/' + entryId + '/children')
                    .success(function (response) {
                        var childEntries = [];
                        for (var i = 0; i < response.length; i++) {
                            var entry = response[i];

                            switch (entry.kind) {
                                case 'folder':
                                    var folder = _getFolder(entry);
                                    childEntries.push(folder);
                                    break;
                                case 'file':
                                    var file = _getFile(entry);
                                    childEntries.push(file);
                                    break;
                                default:
                                    break;
                            }
                        }

                        children[entryId] = childEntries;

                        deferred.resolve(childEntries);
                    })
                    .error(function (msg, error) {
                        logger.error('Error while retrieving children for: ' + entryId);
                        deferred.reject(msg);
                    });
            }

            return deferred.promise;
        }

        function _getFolder(data) {
            var entryId = data.entryId;

            if (typeof folders[entryId] === 'object') {
                return folders[entryId];
            } else {
                var folder = new FolderModel(data);

                folders[entryId] = folder;

                return folder;
            }
        }

        function _getFile(data) {
            var entryId = data.entryId;

            if (typeof files[entryId] === 'object') {
                return files[entryId];
            } else {
                var file = new FileModel(data);

                files[entryId] = file;

                return file;
            }
        }

        function upload(entryId, files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    $upload.upload({
                        url: config.apiBaseUrl + '/upload',
                        fields: {'folderId': entryId},
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (response, status, headers, config) {
                        var responseFile = _getFolder(response.file);
                        var parentId = responseFile.get('parentId');
                        var parentChildren = children[parentId];

                        parentChildren.push(responseFile);
                    });
                }
            }
        }

        function createFolder(parentId, title) {
            var data = {
                kind: 'folder',
                entryId: null,
                parentId: parentId,
                title: title,
                createdDate: new Date(),
                modifiedDate: new Date()
            };

            return new FolderModel(data);
        }
    }
})();
