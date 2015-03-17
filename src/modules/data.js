(function () {
    "use strict";

    /* global window, global, self, navigator, DomQuery */

    var helper = require('./helper.js');

    function Data() {
        this.data = function() {
            var i = 0,
                output = {},
                item;

            if ( this.length > 0 ) {
                if ( 1 === arguments.length && this.isPlainObject(arguments[0]) ) {
                    // Assign via object
                    for ( ; i < this.length ; i++ ) {
                        if ( "undefined" === typeof this[i][DomQuery.uuid]) {
                            this[i][DomQuery.uuid] = [];
                        }
                        for ( item in arguments[0] ) {
                            this[i][DomQuery.uuid].push({
                                guid: item,
                                type: 'data',
                                handler: arguments[0][item],
                                args: null, 	// For consistency
                                capture: null	// For consistency
                            });						
                        }
                    }
                } else if ( 1 === arguments.length ) {
                    // Return data from first object key
                    if ( "undefined" === typeof this[0][DomQuery.uuid]) {
                        this[0][DomQuery.uuid] = [];
                    }

                    for ( item in this[0][DomQuery.uuid] ) {
                        if ( this[0][DomQuery.uuid][item].guid === arguments[0] ) {
                            return this[0][DomQuery.uuid][item].handler;
                        }
                    }
                    return;
                } else if ( 2 === arguments.length ) {
                    // Assign using key value
                    for ( ; i < this.length ; i++ ) {
                        if ( "undefined" === typeof this[i][DomQuery.uuid]) {
                            this[i][DomQuery.uuid] = [];
                        }
                        this[i][DomQuery.uuid].push({
                            guid: arguments[0],
                            type: 'data',
                            handler: arguments[1],
                            args: null, 	// For consistency
                            capture: null	// For consistency
                        });
                    }
                } else {
                    // Return first object all data keys
                    for ( item in this[0][DomQuery.uuid] ) {
                        if ( 'data' === this[0][DomQuery.uuid][item].type ) {
                            output[this[0][DomQuery.uuid][item].guid] = this[0][DomQuery.uuid][item].handler;
                        }
                    }

                    return output;
                }
            }

            return this;
        };
    }

    module.exports = new Data();
}());