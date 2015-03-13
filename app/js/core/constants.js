/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('ccfrontend.core')
        .constant('moment', moment)
        .constant('toastr', toastr);
})();
