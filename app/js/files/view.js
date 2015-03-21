(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .controller('View', View);

    View.$inject = ['common', '$stateParams', '$sce', 'FileService'];

    function View(common, $stateParams, $sce, FileService) {
        /*jshint validthis: true */
        var vm = this;
        vm.entryId = $stateParams.entryId;

        vm.media = [];
        vm.config = {
            preload: "none",
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: false,
            sources: vm.media
        };

        vm.state = null;
        vm.API = null;
        vm.currentVideo = 0;
        vm.onPlayerReady = onPlayerReady;
        vm.onCompleteVideo = onCompleteVideo;
        vm.setVideo = setVideo;

        activate();

        function activate() {

        }

        function onPlayerReady(API) {
            vm.API = API;

            FileService
                .getFile(vm.entryId)
                .then(function(entry) {
                    vm.setVideo(entry);
                });
        }

        function onCompleteVideo() {
            vm.isCompleted = true;
        }

        function setVideo(entry) {
            vm.API.stop();

            var video = {
                src: $sce.trustAsResourceUrl(entry.get('downloadUrl')),
                type: entry.get('mimeType')
            };

            vm.media.push(video);

            vm.API.play.bind(vm.API);
        }
    }
})();
