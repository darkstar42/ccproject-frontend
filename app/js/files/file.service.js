(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .factory('FileService', FileService);

    FileService.$inject = [
        '$http',
        'common',
        'config',
        'FolderModel',
        'ConfigService'
    ];

    function FileService($http, common, config, FolderModel, ConfigService) {
        var folders = {};
        var logger = common.logger;

        var service = {
            getRootFolder: getRootFolder,
            getFolder: getFolder,
            getChildren: getChildren
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
                        var folder = new FolderModel(response);

                        folders[entryId] = folder;

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

            $http
                .get(config.apiBaseUrl + '/folders/' + entryId + '/children')
                .success(function(response) {
                    // TODO - Create domain objects
                    deferred.resolve(response);
                })
                .error(function(msg, error) {
                    logger.error('Error while retrieving children for: ' + entryId);
                    deferred.reject(msg);
                });

            return deferred.promise;
        }
    }
})();
