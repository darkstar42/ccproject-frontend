(function() {
    'use strict';

    angular.module('ccfrontend.files', [
        'blocks.config', 'blocks.model', 'blocks.logger',

        'ui.bootstrap', 'angularFileUpload', 'ui.bootstrap.contextMenu', 'dialogs.main',

        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.buffering'
    ]);
})();
