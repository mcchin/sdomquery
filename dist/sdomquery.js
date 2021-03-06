(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function () {
    "use strict";

    /* global window, global, self */

    var glob = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" && self,
        runOnce = false;

    var utils = require('./modules/utils.js'),
        css = require('./modules/css.js'),
        position = require('./modules/position.js'),
        traverse = require('./modules/traverse.js'),
        manipulation = require('./modules/manipulation.js'),
        events = require('./modules/events.js'),
        data = require('./modules/data.js');
    
    if ( !runOnce ) {
        // Attach uniq ID - This is to keep reference to bind / unbind events and reference for data cache
        wrapper.uuid = 'DomQuery' + String(Math.random()).substring(2) + Date.now();
        wrapper.guid = 0;

        // Attach utils and other functions to the core
        utils.extend(wrapper, utils);
        // Can remove unwanted functions here if needed, but utils is compulsory
        utils.extend(DomQueryWrapper.prototype, utils, css, position, traverse, manipulation, events, data);

        // This is to emulate jQuery plugin, hopefully able to import some jQuery plugins this way
        wrapper.fn = DomQueryWrapper.prototype;

        runOnce = true;
    }

    function DomQueryWrapper(domSelector) {
        var foundObjects = [];
            //regExpHtml = /^$/,
            //regExpID = /^$/,
            //regExpClass = /^$/;

        // Depending on regExp
        // if html append and pass back
        // if instance return instance
        if ( "string" === typeof domSelector ) {
            foundObjects = document.querySelectorAll(domSelector);
        } else if ( utils.isArray(domSelector) ) {
            foundObjects = domSelector;
        } else if ( "object" === typeof domSelector ) {
            foundObjects.push(domSelector);
        } else {
            return this;
        }

        // Attach objects found 
        this.length = foundObjects ? foundObjects.length : 0;

        if ( foundObjects ) {
            for(var i = 0 ; i < foundObjects.length ; i++ ) {
                this[i] = foundObjects[i];
            } 
        } 

        return this;
    }      
    
    function wrapper(domSelector) {
        return new DomQueryWrapper(domSelector);
    }          
    
    glob.DomQuery = glob.$ = wrapper;
})();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./modules/css.js":2,"./modules/data.js":3,"./modules/events.js":4,"./modules/manipulation.js":6,"./modules/position.js":7,"./modules/traverse.js":8,"./modules/utils.js":9}],2:[function(require,module,exports){
(function () {
    "use strict";

    /* global DomQuery */
    
    var helper = require('./helper.js');

    function Css() {
        this.addClass = function(className) {
            var i = 0;

            if ( helper.stringNotBlank(className) ) {
                for ( ; i < this.length ; i++ ) {
                    if ( !helper.matchString(this[i].className, className) ) {
                        this[i].className += " " + className;
                    }
                }
            }				

            return this;
        };
        this.removeClass = function(className) {
            var i = 0;


            if ( helper.stringNotBlank(className) ) {
                for ( ; i < this.length ; i++ ) {
                    if ( this[i].className ) {
                        this[i].className = this[i].className
                                                   .replace(
                                                        new RegExp('(\\s|^)'+className+'(\\s|$)'), ""
                                                    );
                    }
                }
            }

            return this;
        };
        this.hasClass = function(className) {
            var i = 0;

            if ( helper.stringNotBlank(className) ) {
                for ( ; i < this.length ; i++ ) {
                    if ( this[i].className && 
                         helper.matchString(this[i].className, className) ) {
                        return true;
                    }
                }
            }

            return false;
        };
        this.css = function() {
            var styles = {},
                outputStyles = {},
                prop = null,
                i = 0;

            if ( this.length > 0 ) {
                if ( arguments.length === 1 && typeof arguments[0] === "string" ) {
                    return this[0].style[helper.camelCase(arguments[0])];
                } else if ( arguments.length === 1 && this.isArray(arguments[0]) ) {
                    for ( ; i < arguments[0].length ; i++ ) {
                        outputStyles[arguments[0][i]] = this[0].style[helper.camelCase(arguments[0][i])];
                    }
                    return outputStyles;
                } else if ( arguments.length === 1 && typeof arguments[0] === "object" ) {
                    for ( prop in arguments[0] ) {
                        styles[helper.camelCase(prop)] = arguments[0][prop];
                    }
                } else if ( arguments.length === 2 ) {
                    styles[helper.camelCase(arguments[0])] = arguments[1];
                }

                for ( prop in styles ) {
                    for ( i = 0 ; i < this.length ; i++ ) {
                        this[i].style[prop] = styles[prop];
                    }
                }
            }

            return this;
        };
        this.styles = function() {
            if ( this.length > 0 ) {
                return helper.getStyles(this[0]);
            }

            return;
        };
    }

    module.exports = new Css();
}());
},{"./helper.js":5}],3:[function(require,module,exports){
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
},{"./helper.js":5}],4:[function(require,module,exports){
(function () {
    "use strict";

    /* global DomQuery */
    
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
            helper.bindEvent(this, 'click', helper, arguments);
            return this;
        };
        this.dblclick = function() {
            helper.bindEvent(this, 'dblclick', helper, arguments);
            return this;
        };
        this.mousemove = function() {
            helper.bindEvent(this, 'mousemove', helper, arguments);
            return this;
        };
        this.mouseover = function() {
            helper.bindEvent(this, 'mouseover', helper, arguments);
            return this;
        };
        this.mouseout = function() {
            helper.bindEvent(this, 'mouseout', helper, arguments);
            return this;
        };
        this.mouseup = function() {
            helper.bindEvent(this, 'mouseup', helper, arguments);
            return this;
        };
        this.mousedown = function() {
            helper.bindEvent(this, 'mousedown', helper, arguments);
            return this;
        };
        this.mouseleave = function() {
            helper.bindEvent(this, 'mouseleave', helper, arguments);
            return this;
        };
        this.mouseenter = function() {
            helper.bindEvent(this, 'mouseenter', helper, arguments);
            return this;
        };
        this.hover = function() {
            var callbackIn = null,
                callbackOut = null;

            if ( arguments.length === 2) {
                callbackIn = arguments[0];
                callbackOut = arguments[1];
            } else if ( arguments.length === 1 ) {
                callbackIn = arguments[0];
                callbackOut = arguments[0];
            }

            if ( arguments.length ) {
                helper.bindEvent(this, 'mouseleave', helper, [callbackIn]);
                helper.bindEvent(this, 'mouseenter', helper, [callbackOut]);
            }

            return this;
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
                i = 0;

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
                        } 
                    }
                }							

            }

            return this;
        };
        this.trigger = function(eventName) {
            /* global DomQuery */
            var i = 0,
                j = 0,
                params = [];

            if ( this.length > 0 ) {
                if ( helper.stringNotBlank(eventName) ) {
                    params = Array.prototype.slice.call(arguments, 1);
                    for ( ; i < this.length ; i++ ) {
                        for ( j = 0 ; j < this[i][DomQuery.uuid].length ; j++ ) {
                            if ( eventName === this[i][DomQuery.uuid][j].eventName ) {
                                this[i][DomQuery.uuid][j].handler.apply(this[i], params);
                            }
                        }
                    }
                }
            }
            return this;
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
},{"./helper.js":5}],5:[function(require,module,exports){
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
                         (!callback && eventName === eventObj[i].type) || 
                         (callback.guid === eventObj[i].guid && eventName === eventObj[i].type) ) {

                        ele.removeEventListener(eventObj[i].type, eventObj[i].handler, eventObj[i].capture);
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
                            guid: callback.guid, // or data key for data cache
                            type: eventName,	 // event name or "data" for data cache
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
},{}],6:[function(require,module,exports){
(function () {
    "use strict";

    /* global DomQuery */
    
    var helper = require('./helper.js');

    function Manipulation() {
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
    }

    module.exports = new Manipulation();
}());
},{"./helper.js":5}],7:[function(require,module,exports){
(function () {
    "use strict";

    /* global DomQuery */

    var helper = require('./helper.js');

    function getOuterDimension(styles) {
        var outerHeight = 0,
            outerWidth = 0;

        if ( styles ) {
            outerHeight = parseFloat(styles.height) +
                          parseFloat(styles.paddingTop) +
                          parseFloat(styles.paddingBottom) +
                          parseFloat(styles.borderTopWidth) +
                          parseFloat(styles.borderBottomWidth);

            outerWidth = parseFloat(styles.width) +
                         parseFloat(styles.paddingLeft) +
                         parseFloat(styles.paddingRight) +
                         parseFloat(styles.borderLeftWidth) +
                         parseFloat(styles.borderRightWidth);  
        }

        return { outerHeight: outerHeight, outerWidth: outerWidth };
    }

    function getScrollDimension(that, px, direction) {
        if ( px ) {
            if ( $.isNumeric(px) ) {
                if ( direction ) {
                    that.scrollTop = parseFloat(px) || 0;    
                }   else {
                    that.scrollLeft = parseFloat(px) || 0;    
                }
            }
            return that;
        } else {
            return (direction ? parseFloat(that.scrollTop) : parseFloat(that.scrollLeft)) || 0;
        }        
    }

    function setRelative(that) {
        if ( 'absolute' !== $(that).css('position') && 
             'fixed' !== $(that).css('position') ) {
            $(that).css('position', 'relative');
        }        
    }

    function Position() {
        this.height = function() {
            if ( this.length > 0 ) {
                return parseFloat(helper.getStyles(this[0]).height) || 0;
            }

            return;
        };
        this.width = function() {
            if ( this.length > 0 ) {
                return parseFloat(helper.getStyles(this[0]).width) || 0;
            }

            return;
        };
        this.innerHeight = function() {
            if ( this.length > 0 ) {
                return this[0].scrollHeight;
            }

            return;
        };
        this.innerWidth = function() {
            if ( this.length > 0 ) {
                return this[0].scrollWidth;
            }

            return;
        };
        this.outerHeight = function() {
            if ( this.length > 0 ) {
                return getOuterDimension(helper.getStyles(this[0])).outerHeight;
            }

            return;
        };
        this.outerWidth = function() {
            if ( this.length > 0 ) {
                return getOuterDimension(helper.getStyles(this[0])).outerWidth;
            }

            return;
        };
        this.offset = function(coords) {
            var dim = {
                    parentLeft: 0,
                    parentTop: 0,
                    newLeft: 0,
                    newTop: 0,
                },
                obj = null,						
                i = 0;

            if ( this.length > 0 ) {
                if ( this.isFunction(coords) ) {
                    coords = coords.call(this);
                }

                if ( this.isPlainObject(coords) ) {
                    for ( ; i < this.length ; i++ ) {
                        dim.parentLeft = 0;
                        dim.parentTop = 0;

                        setRelative(this[i]);
                        
                        coords.top = this.isNumeric(coords.top) ? coords.top + 'px' : coords.top;
                        coords.left = this.isNumeric(coords.left) ? coords.left + 'px' : coords.left;

                        if ( this[i].offsetParent &&
                             'fixed' !== $(this[i]).css('position') ) {
                            obj = this[i];
                            do { 
                                dim.parentTop += obj.offsetTop - (parseFloat(obj.style.top) || 0);
                                dim.parentLeft += obj.offsetLeft - (parseFloat(obj.style.left) || 0);
                                obj = obj.offsetParent;
                            } while ( obj );
                        }

                        // Considering scrollTop, scrollLeft?

                        // Need to find way to convert %, rem, em, and etc to px
                        $(this[i]).css(coords);
                        dim.newTop = parseFloat($(this[i]).css('top')) || 0;
                        dim.newLeft = parseFloat($(this[i]).css('left')) || 0;

                        $(this[i]).css({
                            top: (parseFloat(dim.newTop - dim.parentTop) || 0) + 'px', 
                            left: (parseFloat(dim.newLeft - dim.parentLeft) || 0) + 'px'
                        });

                    }
                    
                    return this;
                } else {
                    return helper.findOffset(this[0]);
                }
            }

            return;
        };
        this.position = function(coords) {
            var i = 0;

            if ( this.length > 0 ) {
                if ( this.isFunction(coords) ) {
                    coords = coords.call(this);
                }

                if ( this.isPlainObject(coords) ) {
                    for ( ; i < this.length ; i++ ) {
                        setRelative(this[i]);
                        
                        coords.top = this.isNumeric(coords.top) ? coords.top + 'px' : coords.top;
                        coords.left = this.isNumeric(coords.left) ? coords.left + 'px' : coords.left;

                        $(this[i]).css(coords);
                    }
                    
                    return this;
                } else {
                    return {
                        top: this[0].offsetTop,
                        left: this[0].offsetLeft
                    };
                }
            }

            return;
        };
        this.scrollTop = function(top) {
            if ( this.length > 0 ) {
                return getScrollDimension(this[0], top, true);
            }	
            return;
        };
        this.scrollLeft = function(left) {
            if ( this.length > 0 ) {
                return getScrollDimension(this[0], left, false);
            }	
            return;
        };
    }

    module.exports = new Position();
}());	
},{"./helper.js":5}],8:[function(require,module,exports){
(function () {
    "use strict";

    /* global DomQuery */

    var helper = require('./helper.js');

    function traverseSibling(that, domSelector, direction) {
        var output = [],
            sibling = null,
            i = 0;

        for( ; i < that.length ; i++ ) {
            if ( direction ) {
                sibling = that[i].nextSibling;
            } else {
                sibling = that[i].previousSibling;
            }

            while ( null !== sibling ) {
                if ( sibling.nodeType === 1 ) {
                    if ( !domSelector || 
                         (helper.stringNotBlank(domSelector) && helper.matchesSelector(sibling, domSelector)) ) {
                        helper.pushUniq(output, sibling);
                    }
                }
                if ( direction ) {
                    sibling = sibling.nextSibling;
                } else {
                    sibling = sibling.previousSibling;
                }
            }
        }

        return new DomQuery(output);        
    }

    function Traverse() {
        this.find = function(domSelector) {
            var output = [],
                i = 0,
                j = 0,
                child = null;

            if ( helper.stringNotBlank(domSelector) ) {
                for ( ; i < this.length ; i++ ) {
                    if ( "undefined" !== this[i].childNodes ) {
                        child = this[i].querySelectorAll(domSelector);
                        if ( child ) {
                            for( j = 0 ; j < child.length ; j++ ) {
                                output.push(child[j]);
                            } 
                        }	
                    }
                }
            }

            return new DomQuery(output);
        };
        this.has = function(domSelector) {
            var output = [],
                i = 0,
                child = null;

            if ( helper.stringNotBlank(domSelector) ) {
                for ( ; i < this.length ; i++ ) {
                    if ( "undefined" !== this[i].childNodes ) {
                        child = this[i].querySelectorAll(domSelector);
                        if ( child.length ) {
                            output.push(this[i]);
                        }
                    }
                }
                return new DomQuery(output);
            }

            return;
        };
        this.children = function(domSelector) {
            var output = [],
                i = 0,
                j = 0,
                child = null;

            for ( ; i < this.length ; i++ ) {
                if ( "undefined" !== this[i].childNodes ) {
                    if ( helper.stringNotBlank(domSelector) ) {
                        child = this[i].querySelectorAll(domSelector);
                        if ( child.length ) {
                            for( j = 0 ; j < child.length ; j++ ) {
                                // Only direct child
                                if ( child[j].parentNode === this[i] ) {
                                    output.push(child[j]);
                                }
                            } 
                        } 									
                    } else {							
                        for ( child in this[i].childNodes ) {
                            if ( this[i].childNodes[child].nodeType === 1) {
                                output.push(this[i].childNodes[child]);
                            }
                        }
                    }
                }
            }

            return new DomQuery(output);
        };
        this.parent = function(domSelector) {
            var output = [],
                parent = null,
                child = null,
                i = 0,
                j = 0;

            for ( ; i < this.length ; i++ ) {
                // Need more efficient logic here
                if ( helper.stringNotBlank(domSelector) ) {
                    parent = this[i].parentNode;
                    if ( "undefined" !== parent.parentNode && 
                         parent.parentNode.nodeType === 1 ) {
                        child = parent.parentNode.querySelectorAll(domSelector);
                        if ( child.length ) {
                            for( j = 0 ; j < child.length ; j++ ) {
                                if ( child[j].parentNode === parent.parentNode ) {
                                    if (child[j] === parent ) {
                                        helper.pushUniq(output, child[j]);
                                    }
                                }
                            } 
                        }										
                    }						
                } else {									
                    helper.pushUniq(output, this[i].parentNode);
                }
            }

            return new DomQuery(output);
        };
        this.first = function() {
            if ( this.length ) {
                return new DomQuery(this[0]);
            }
            return;
        };
        this.last = function() {
            if ( this.length ) {
                return new DomQuery(this[this.length - 1]);
            }						
            return;
        };
        this.next = function(domSelector) {
            return traverseSibling(this, domSelector, true);
        };
        this.prev = function(domSelector) {
            return traverseSibling(this, domSelector, false);
        };
        this.get = function(idx) {
            if ( this.length && "undefined" !== this[idx] ) {
                return new DomQuery(this[idx]);
            }
            return;
        };
    }

    module.exports = new Traverse();
}());
},{"./helper.js":5}],9:[function(require,module,exports){
(function () {
    "use strict";

    /* global window, global, self, navigator, DomQuery */

    var helper = require('./helper.js');

    function Utils() {
        this.each = function() {
            var elements = null,
                callback = function() {};

            if ( arguments.length > 0 ) {
                if ( "function" === typeof arguments[0] ) {
                    callback = arguments[0];
                    elements = this;
                } else if ( arguments.length > 1 && "function" === typeof arguments[1] ) {
                    elements = arguments[0];
                    callback = arguments[1];
                }

                var length = elements.length;
                if ("undefined" !== length) {
                    for (var i = 0; i < length; i++) {
                        callback.call(elements[i], elements[i], i, elements);
                    }
                }
            }
            return elements;
        };
        this.extend = function(mergeTarget) {
            var otherObjects = [],
                  _key = null,
                  objProp = null;

            if ( 1 === arguments.length ) {
                // Merge to this.prototype
                this.extend(
                    this.fn,
                    arguments[0]
                );
            } else {
                for (_key = 1; _key < arguments.length; _key++) {
                    otherObjects[_key - 1] = arguments[_key];
                }				
            }

            for (_key = 0; _key < otherObjects.length; _key++) {
                for (objProp in otherObjects[_key]) {
                    mergeTarget[objProp] = otherObjects[_key][objProp];
                }
            }

            return mergeTarget;
        };
        this.append = function(html) {
            var i = 0;

            if ( this.length > 0 && 
                 helper.stringNotBlank(html) ) {

                for ( ; i < this.length ; i++ ) {
                    this[i].innerHTML += html;
                }
            }

            return this;
        };
        this.prepend = function(html) {
            var i = 0,
                tmpElement = null;					
            
            if ( this.length > 0 && 
                 helper.stringNotBlank(html) ) {

                for ( ; i < this.length ; i++ ) {
                    tmpElement = document.createElement('div');
                    tmpElement.innerHTML = html;
                    tmpElement = tmpElement.firstChild;

                    if ( !this[i].firstChild ) {
                        this[i].appendChild(tmpElement);
                    } else {
                        this[i].insertBefore(tmpElement, this[i].firstChild);
                    }
                }
            }
            
            return this;
        };
        this.isNumeric = function(obj) {
            return (obj - parseFloat(obj)) === 0;
        };
        this.isFunction = function(obj) {
            return "function" === typeof obj;
        };
        this.isArray = function(obj) {
            return Array.isArray(obj);
        };
        this.isPlainObject = function(obj) {
            // Check if variable is a {}
            return "object" === typeof obj && ("Object" === obj.constructor.name || "[object Object]" === Object.prototype.toString.call(obj));
        };
        this.isEmpty = function(obj) {
            var _key;

            if ( obj.length > 0 ) { return false; }
            if ( obj.length === 0 ) { return true; }
            for ( _key in obj ) {
                if ( Object.prototype.hasOwnProperty.call(obj, _key) ) {
                    return false;
                }
            }
            return true;
        };
        // Source: [http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser]
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        this.isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Firefox 1.0+
        this.isFirefox = typeof InstallTrigger !== 'undefined';  
        // At least Safari 3+: "[object HTMLElementConstructor]"
        this.isSafari =Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;	
        // Chrome 1+
        this.isChrome = !!window.chrome && !this.isOpera;
        // At least IE6
        this.isIE = /*@cc_on!@*/false || !!document.documentMode;
        // IE8 and below
        this.isOldIE = navigator.userAgent.match(/MSIE\s(?!9.0)/) ? true : false;
    }

    module.exports = new Utils();
}());
},{"./helper.js":5}]},{},[1]);
