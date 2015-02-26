(function () {
    "use strict";

    /* global window, global, self, navigator */
    var isReady = false,
        readyCallback = null;

    var helper = require('./helper.js');

    function Events() {
        this.ready = function(callback) {
            /* global DomQuery, readyCallback, isReady */
            if ( DomQuery.isFunction(callback) ) {
                readyCallback = callback;
                if ( isReady ) {
                    callback.apply(this[0]);
                } else {
                    setTimeout(this.ready, 1);
                }
            }
        };
        this.click = function() {
            var output = helper.bindEvent(this, 'click', helper, arguments);
            return output;
        };
        this.dblclick = function() {
            var output = helper.bindEvent(this, 'dblclick', helper, arguments);
            return output;
        };
        this.mousemove = function() {
            var output = helper.bindEvent(this, 'mousemove', helper, arguments);
            return output;
        };
        this.mouseover = function() {
            var output = helper.bindEvent(this, 'mouseover', helper, arguments);
            return output;
        };
        this.mouseout = function() {
            var output = helper.bindEvent(this, 'mouseout', helper, arguments);
            return output;
        };
        this.mouseup = function() {
            var output = helper.bindEvent(this, 'mouseup', helper, arguments);
            return output;
        };
        this.mousedown = function() {
            var output = helper.bindEvent(this, 'mousedown', helper, arguments);
            return output;
        };
        this.mouseleave = function() {
            var output = helper.bindEvent(this, 'mouseleave', helper, arguments);
            return output;
        };
        this.mouseenter = function() {
            var output = helper.bindEvent(this, 'mouseenter', helper, arguments);
            return output;
        };
        this.hover = function() {
            var output = [],
                callbackIn = null,
                callbackOut = null;

            if ( arguments.length === 2) {
                callbackIn = arguments[0];
                callbackOut = arguments[1];
            } else if ( arguments.length === 1 ) {
                callbackIn = arguments[0];
                callbackOut = arguments[0];
            }

            if ( arguments.length ) {
                output = helper.bindEvent(this, 'mouseleave', helper, [callbackIn]);
                helper.bindEvent(this, 'mouseenter', helper, [callbackOut]);
            }

            return output;
        };
        this.keyup = function() {
            return helper.bindEvent(this, 'keyup', helper, arguments);
        };
        this.keydown = function() {
            return helper.bindEvent(this, 'keydown', helper, arguments);
        };
        this.keypress = function() {
            return helper.bindEvent(this, 'keypress', helper, arguments);
        };
        this.change = function() {
            return helper.bindEvent(this, 'change', helper, arguments);
        };
        this.blur = function() {
            return helper.bindEvent(this, 'blur', helper, arguments);
        };
        this.focus = function() {
            return helper.bindEvent(this, 'focus', helper, arguments);
        };
        this.focusin = function() {
            return helper.bindEvent(this, 'focusin', helper, arguments);
        };
        this.focusout = function() {
            return helper.bindEvent(this, 'focusout', helper, arguments);
        };
        this.unload = function() {
            return helper.bindEvent(this, 'unload', helper, arguments);
        };
        this.select = function() {
            return helper.bindEvent(this, 'select', helper, arguments);
        };
        this.submit = function() {
            return helper.bindEvent(this, 'submit', helper, arguments);
        };
        this.scroll = function() {
            return helper.bindEvent(this, 'scroll', helper, arguments);
        };
        this.resize = function() {
            return helper.bindEvent(this, 'resize', helper, arguments);
        };
        this.off = function() {
            // 0 - event, 1 - selector, 2 - handler
            var eventName = null,
                domSelector = null,
                handler = null,
                i = 0,
                output = [];

            if ( this.length > 0 ) {
                if ( arguments.length === 3 && 
                     "function" === typeof arguments[2]) {
                    eventName = arguments[0];
                    domSelector = arguments[1];
                    handler = arguments[2];
                } else if ( arguments.length === 2 ) {
                    eventName = arguments[0];
                    domSelector = arguments[1];
                } else if ( arguments.length === 1 ) {
                    eventName = arguments[0];
                } 

                for ( ; i < this.length ; i++ ) {
                    if ( !domSelector || 
                         (helper.stringNotBlank(domSelector) && helper.matchesSelector(this[i], domSelector)) ) {
                        if ( "undefined" !== typeof this[i].removeEventListener ) {
                            helper.unbindEvent(this[i], eventName ? eventName : null, handler ? handler : null);
                            output.push(this[i]);
                        } 
                    }
                }							

            }

            return output;
        };
        this.trigger = function(eventName) {
            /* global DomQuery */
            var i = 0,
                j = 0,
                params = [],
                output = [];

            if ( this.length > 0 ) {
                if ( helper.stringNotBlank(eventName) ) {
                    params = Array.prototype.slice.call(arguments, 1);
                    for ( ; i < this.length ; i++ ) {
                        for ( j = 0 ; j < this[i][DomQuery.uuid].length ; j++ ) {
                            if ( eventName === this[i][DomQuery.uuid][j].eventName ) {
                                this[i][DomQuery.uuid][j].handler.apply(this[i], params);
                                output.push(this[i]);
                            }
                        }
                    }
                }
            }
            return output;
        };
    }

    var DOMReady = function() {
        if ( "undefined" !== typeof document.removeEventListener ) {
            document.removeEventListener("DOMContentLoaded", DOMReady, false);
        } 

        if ( null !== readyCallback ) {
            readyCallback.apply(this);
        }

        isReady = true;
    };

    if ( "undefined" !== typeof document.addEventListener ) {
        document.addEventListener("DOMContentLoaded", DOMReady, false);
    }

    module.exports = new Events();
}());