(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .factory('JobService', JobService);

    JobService.$inject = [
        '$http',
        '$upload',
        'common',
        'config',
        'JobModel',
        'ConfigService'
    ];

    function JobService($http, $upload, common, config, JobModel, ConfigService) {
        var logger = common.logger;

        var service = {
            createJob: createJob,
            enqueueJob: enqueueJob
        };

        return service;

        function enqueueJob(job) {
            if (!job || job === null) {
                throw new Error('Unable to enqueue the given job');
            }

            var deferred = common.$q.defer();

            $http
                .post(config.apiBaseUrl + '/jobs', {job: job.properties})
                .success(function(response) {
                    console.dir(response);

                    deferred.resolve(response.job);
                })
                .error(function(msg, error) {
                    deferred.reject(msg);
                });

            return deferred.promise;
        }

        function createJob(image, cmd, fileId, folderId) {
            var data = {
                image: image,
                cmd: cmd,
                src: fileId,
                dst: folderId
            };

            return new JobModel(data);
        }
    }
})();
