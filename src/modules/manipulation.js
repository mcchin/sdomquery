(function () {
    "use strict";

    /* global window, global, self, navigator */

    var helper = require('./helper.js');

    var manipulation = new function() {
        this.remove = function(domSelector) {
            var i = 0;

            for ( ; i < this.length ; i++ ) {
                if ( !domSelector || 
                     (helper.stringNotBlank(domSelector) && helper.matchesSelector(this[i], domSelector)) ) {
                    this[i].parentNode.removeChild(this[i]);
                }							
                
            }

            return this;
        };
        this.empty = function(domSelector) {
            var i = 0;

            for ( ; i < this.length ; i++ ) {
                if ( !domSelector || 
                     (helper.stringNotBlank(domSelector) && helper.matchesSelector(this[i], domSelector)) ) {
                    this[i].innerHTML = '';
                }							
                
            }

            return this;
        };
        this.attr = function() {
            var attrs = {},
                output = {},
                prop = null,
                i = 0;

            if ( arguments.length === 1 && typeof arguments[0] === "string" ) {
                return this[0].getAttribute(arguments[0]);
            } else if ( arguments.length === 1 && this.isArray(arguments[0]) ) {
                for ( ; i < arguments[0].length ; i++ ) {
                    output[arguments[0][i]] = this[0].getAttribute(arguments[0][i]);
                }
                return output;
            } else if ( arguments.length === 1 && typeof arguments[0] === "object" ) {
                for ( prop in arguments[0] ) {
                    attrs[prop] = arguments[0][prop];
                }
            } else if ( arguments.length === 2 ) {
                attrs[arguments[0]] = arguments[1];
            } else {
                // Return all attributes
                for ( ; i < this[0].attributes.length ; i++ ) {
                    output[this[0].attributes[i].nodeName] = this[0].attributes[i].value;
                }							
                return output;
            }

            for ( prop in attrs ) {
                for ( i = 0 ; i < this.length ; i++ ) {
                    this[i].setAttribute(prop, attrs[prop]);
                }
            }

            return this;
        };
    };

    module.exports = manipulation;
}());