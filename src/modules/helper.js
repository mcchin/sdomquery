(function () {
    "use strict";

    /* global window */

    function Helper() {
        this.matchString = function(haystack, needle) {
            return null !== haystack.match(new RegExp('(\\s|^)'+needle+'(\\s|$)'));
        };
        this.stringNotBlank = function(str) {
            return str && "" !== str.trim();
        };
        this.camelCase = function(str) {
            return str.replace( /^-/, "" ) // Remove first hyphen
                      .replace( /-([\da-z])/gi, function(all, letter) { 
                        return "" !== letter ? letter.toUpperCase() : "";
                      });
        };
        this.pushUniq = function(list, item) {
            var i = 0;

            for ( ; i < list.length ; i++ ) {
                if ( list[i] === item ) { 
                    return; 
                }
            }

            list.push(item);
        };
        this.wrapper = function(newObjects) {
            /* global DomQuery */
            return new DomQuery(newObjects);
        };
        this.getStyles = function(obj) {
            if ( "undefined" !== window.getComputedStyle ) {
                return window.getComputedStyle(obj);
            } else if ( "undefined" !== obj.currentStyle ) {
                return obj.currentStyle;
            }
        };
        this.findOffset = function(obj) {
            var l = 0,
                t = 0;
            if ( obj.offsetParent ) {
                do { 
                    t += obj.offsetTop;
                    l += obj.offsetLeft;
                    obj = obj.offsetParent;
                } while ( obj );
            }

            return {
                top: t,
                left: l
            };
        };
        this.unbindEvent = function(ele, eventName, callback) {
            /* global DomQuery */
            var i = 0,
                eventObj = null;

            if ( "undefined" !== typeof ele[DomQuery.uuid] && 
                 "undefined" !== typeof ele.removeEventListener ) {
                
                eventObj = ele[DomQuery.uuid];

                do {
                    if ( !callback || 
                         (!callback && !eventName) || 
                         (!callback && eventName === eventObj[i].eventName) || 
                         (callback.guid === eventObj[i].guid && eventName === eventObj[i].eventName) ) {

                        ele.removeEventListener(eventObj[i].eventName, eventObj[i].handler, eventObj[i].capture);
                        eventObj.splice(i,1);
                    } else {
                        i++;
                    }
                } while ( i < eventObj.length && eventObj.length );
            }
        };
        this.bindEvent = function(that, eventName, helper, argsEvent) {
            /* global DomQuery */
            var	output = [],
                callback = null,
                callbackStore = null,
                args = null,
                i = 0;

            if ( argsEvent.length === 2 ) {
                argsEvent = argsEvent[0];
                callback = argsEvent[1];
            } else if ( argsEvent.length === 1 ) {
                callback = argsEvent[0];
            }

            if ( that.length > 0 && 
                 argsEvent.length > 0 && 
                 that.isFunction(callback) ) {

                if ( "undefined" === typeof callback.guid ) {
                    callback.guid = ++DomQuery.guid;
                }

                for ( ; i < that.length ; i++ ) {
                    if ( that[i].addEventListener ) {
                        if ( "undefined" === typeof that[i][DomQuery.uuid]) {
                            that[i][DomQuery.uuid] = [];
                        }							

                        if ( null !== args ) {
                            callbackStore = callback.bind(that[i], args);
                        } else {
                            callbackStore = callback.bind(that[i]);
                        }

                        that[i][DomQuery.uuid].push({
                            guid: callback.guid,
                            eventName: eventName,
                            handler: callbackStore,
                            args: args,
                            capture: false
                        });

                        that[i].addEventListener(eventName, callbackStore, false);

                        output.push(that[i]);
                    }
                }
            }

            return output;
        };
        this.matchesSelector = function( ele, domSelector ) {
            if ("function" === typeof ele.oMatchesSelector) {
                return ele.oMatchesSelector(domSelector);
            }
            else if ("function" === typeof ele.msMatchesSelector) {
                return ele.msMatchesSelector(domSelector);
            }
            else if ("function" === typeof ele.webkitMatchesSelector) {
                return ele.webkitMatchesSelector(domSelector);
            }
            else if ("function" === typeof ele.mozMatchesSelector) {
                return ele.mozMatchesSelector(domSelector);
            }
            else {
                var matches = (ele.document || ele.ownerDocument).querySelectorAll(domSelector);
                var i = 0;

                while (matches[i] && matches[i] !== ele) {
                    i++;
                }

                return matches[i] ? true : false;
            }
            return false;
        };
    }

    module.exports = new Helper();
})();