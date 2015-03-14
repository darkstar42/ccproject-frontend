(function() {
    'use strict';

    angular
        .module('ccfrontend.files')
        .controller('Main', Main);

    Main.$inject = ['common', 'FileService'];

    function Main(common, FileService) {
        /*jshint validthis: true */
        var vm = this;

        vm.rootFolder = null;

        var logger = common.logger;

        activate();

        function activate() {
            initRootFolder();
        }

        function initRootFolder() {
            FileService
                .getRootFolder()
                .then(function(rootFolder) {
                    console.dir(rootFolder);
                    vm.rootFolder = rootFolder;
                });
        }
    }
})();
