(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .controller('View', View);

    View.$inject = ['common', '$stateParams', '$sce', 'FileService', 'file'];

    function View(common, $stateParams, $sce, FileService, file) {
        /*jshint validthis: true */
        var vm = this;
        vm.entryId = $stateParams.entryId;

        this.config = {
            preload: "none",
            sources: [
                {src: $sce.trustAsResourceUrl(file.get('downloadUrl')), type: file.get('mimeType')}
            ]
        };
    }
})();
