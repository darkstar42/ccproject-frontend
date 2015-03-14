(function() {
    'use strict';

    angular
        .module('blocks.model')
        .factory('BaseModel', BaseModel);

    BaseModel.$inject = [
        'logger'
    ];

    function BaseModel(logger) {
        var __slice = [].slice;

        var model = function BaseModel(properties) {
            this.update(properties);
        };

        model.defaults = defaults;
        model.prototype.accessors = {};
        model.prototype.get = get;
        model.prototype.set = set;
        model.prototype.update = update;
        model.prototype._getOrCallProperty = _getOrCallProperty;

        return model;

        function defaults() {
            return angular.copy({});
        }

        function get(propertyName) {
            /* jshint validthis:true */
            return this._getOrCallProperty(propertyName);
        }

        function set() {
            var propertyName = arguments[0];
            var values = (2 <= arguments.length) ? __slice.call(arguments, 1) : [];
            /* jshint validthis:true */
            var setterMethod = this.accessors["set_" + propertyName];

            if (setterMethod !== null) {
                /* jshint validthis:true */
                return setterMethod.apply(this, values);
            } else {
                if (values.length > 1) {
                    throw "Cannot provide multiple values for a singular property";
                }

                /* jshint validthis:true */
                this.properties[propertyName] = values[0];

                return values[0];
            }
        }

        function update(properties) {
            var defaults;
            var _base;
            var _ref;

            if (properties === null) {
                properties = {};
            }

            if (!angular.isObject(properties)) {
                throw "'" +
                    /* jshint validthis:true */
                    ((_ref = this.constructor) != null ? _ref.name : void 0) +
                    "' properties must be contructed with an object '{}'";
            }

            this.properties = this.properties || {};

            if (!angular.equals(angular.copy(this.properties), properties)) {
                defaults = (typeof (_base = this.constructor).defaults === "function" ?
                    _base.defaults() : void 0) || {};
                this.properties = angular.extend(defaults, properties);

                return this.properties;
            }
        }

        function _getOrCallProperty(propertyName) {
            var _ref, _ref1;
            /* jshint validthis:true */
            var readerMethod = (_ref = this.accessors) != null ? _ref["get_" + propertyName] : void 0;

            if (readerMethod != null) {
                return readerMethod.apply(this);
            } else if (this.properties.hasOwnProperty(propertyName)) {
                return this.properties[propertyName];
            } else {
                logger.error("PropertyNotFound: '" + propertyName + "' on " +
                    ((_ref1 = this.constructor) != null ? _ref1.name : void 0) + " Model");

                return null;
            }
        }
    }
})();
