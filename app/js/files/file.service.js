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
            getFile: getFile,
            getRootFolder: getRootFolder,
            getFolder: getFolder,
            getChildren: getChildren,
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
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    });
                }
            }
        }
    }
})();
