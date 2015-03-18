(function() {
    'use strict';

    angular.module('ccfrontend.files', [
        'blocks.config', 'blocks.model', 'blocks.logger',

        'ui.bootstrap', 'angularFileUpload', 'ui.bootstrap.contextMenu', 'dialogs.main'
    ]);
})();
