(function(DomQuery) {
    /* global window, global, self */
    var obj;
    obj = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" && self; 
    obj.DomQuery = obj.$ = new DomQuery();
} (function() {
    var isReady = false,
        readyCallback = null;

    return (function loadModule(moduleList, initFunction, extensions) {
        return moduleList[initFunction].call(this, moduleList, extensions);
    })({
        modules: {
            css: function(helper) {
                return {
                    addClass: function(className) {
                        var i = 0;

                        if ( helper.stringNotBlank(className) ) {
                            for ( ; i < this.length ; i++ ) {
                                if ( !helper.matchString(this[i].className, className) ) {
                                    this[i].className += " " + className;
                                }
                            }
                        }				

                        return this;
                    },
                    removeClass: function(className) {
                        var i = 0;

                        if ( helper.stringNotBlank(className) ) {
                            for ( ; i < this.length ; i++ ) {
                                if ( this[i].className ) {
                                    this[i].className = this[i].className
                                                               .replace(
                                                                    new RegExp('(\\s|^)'+className+'(\\s|$)')
                                                                );
                                }
                            }
                        }

                        return this;
                    },
                    hasClass: function(className) {
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
                    },
                    css: function() {
                        var styles = {},
                            output = {},
                            prop = null,
                            i = 0;

                        if ( this.length > 0 ) {
                            if ( arguments.length === 1 && typeof arguments[0] === "string" ) {
                                return this[0].style[helper.camelCase(arguments[0])];
                            } else if ( arguments.length === 1 && this.isArray(arguments[0]) ) {
                                for ( ; i < arguments[0].length ; i++ ) {
                                    output[arguments[0][i]] = this[0].style[helper.camelCase(arguments[0][i])];
                                }
                                return output;
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
                    },
                    styles: function() {
                        if ( this.length > 0 ) {
                            return helper.getStyles(this[0]);
                        }

                        return;
                    }
                };
            },
            position: function(helper) {
                return {
                    height: function() {
                        var styles = null;

                        if ( this.length > 0 ) {
                            styles = helper.getStyles(this[0]);

                            return parseFloat(styles.height);
                        }

                        return;
                    },
                    width: function() {
                        var styles = null;

                        if ( this.length > 0 ) {
                            styles = helper.getStyles(this[0]);
                            return parseFloat(styles.width);
                        }

                        return;
                    },
                    innerHeight: function() {
                        if ( this.length > 0 ) {
                            return this[0].scrollHeight;
                        }

                        return;
                    },
                    innerWidth: function() {
                        if ( this.length > 0 ) {
                            return this[0].scrollWidth;
                        }

                        return;
                    },
                    outerHeight: function() {
                        var styles = null;

                        if ( this.length > 0 ) {
                            styles = helper.getStyles(this[0]);

                            return parseFloat(styles.height) +
                                   parseFloat(styles.paddingTop) +
                                   parseFloat(styles.paddingBottom) +
                                   parseFloat(styles.borderTopWidth) +
                                   parseFloat(styles.borderBottomWidth);
                        }

                        return;
                    },
                    outerWidth: function() {
                        var styles = null;

                        if ( this.length > 0 ) {
                            styles = helper.getStyles(this[0]);

                            return parseFloat(styles.width) +
                                   parseFloat(styles.paddingLeft) +
                                   parseFloat(styles.paddingRight) +
                                   parseFloat(styles.borderLeftWidth) +
                                   parseFloat(styles.borderRightWidth);
                        }

                        return;
                    },
                    offset: function(coords) {
                        var output = [],
                            parentLeft = 0,
                            parentTop = 0,
                            newLeft = 0,
                            newTop = 0,
                            obj = null,						
                            i = 0;

                        if ( this.length > 0 ) {
                            if ( this.isFunction(coords) ) {
                                coords = coords.call(this);
                            }

                            if ( this.isPlainObject(coords) ) {
                                for ( ; i < this.length ; i++ ) {
                                    parentLeft = 0;
                                    parentTop = 0;

                                    if ( 'absolute' !== $(this[i]).css('position') && 
                                         'fixed' !== $(this[i]).css('position') ) {
                                        $(this[i]).css('position', 'relative');
                                    }

                                    coords.top = this.isNumeric(coords.top) ? coords.top + 'px' : coords.top;
                                    coords.left = this.isNumeric(coords.left) ? coords.left + 'px' : coords.left;

                                    if ( this[i].offsetParent &&
                                         'fixed' !== $(this[i]).css('position') ) {
                                        obj = this[i];
                                        do { 
                                            parentTop += obj.offsetTop - (parseFloat(obj.style.top) || 0);
                                            parentLeft += obj.offsetLeft - (parseFloat(obj.style.left) || 0);
                                            obj = obj.offsetParent;
                                        } while ( obj );
                                    }

                                    // Considering scrollTop, scrollLeft?

                                    // Need to find way to convert %, rem, em, and etc to px
                                    $(this[i]).css(coords);
                                    newTop = parseFloat($(this[i]).css('top')) || 0;
                                    newLeft = parseFloat($(this[i]).css('left')) || 0;

                                    $(this[i]).css({
                                        top: (parseFloat(newTop - parentTop) || 0) + 'px', 
                                        left: (parseFloat(newLeft - parentLeft) || 0) + 'px'
                                    });

                                    output.push(this[i]);
                                }
                                
                                return output;
                            } else {
                                return helper.findOffset(this[0]);
                            }
                        }

                        return;
                    },
                    position: function(coords) {
                        var output = [],
                            i = 0;

                        if ( this.length > 0 ) {
                            if ( this.isFunction(coords) ) {
                                coords = coords.call(this);
                            }

                            if ( this.isPlainObject(coords) ) {
                                for ( ; i < this.length ; i++ ) {
                                    if ( 'absolute' !== $(this[i]).css('position') && 
                                         'fixed' !== $(this[i]).css('position') ) {
                                        $(this[i]).css('position', 'relative');
                                    }

                                    coords.top = this.isNumeric(coords.top) ? coords.top + 'px' : coords.top;
                                    coords.left = this.isNumeric(coords.left) ? coords.left + 'px' : coords.left;

                                    $(this[i]).css(coords);
                                    output.push(this[i]);
                                }
                                
                                return output;
                            } else {
                                return {
                                    top: this[0].offsetTop,
                                    left: this[0].offsetLeft
                                };
                            }
                        }

                        return;
                    },
                    scrollTop: function(top) {
                        if ( this.length > 0 ) {
                            if ( top ) {
                                if ( this.isNumeric(top) ) {
                                    this[0].scrollTop = parseFloat(top) || 0;
                                }
                                return [this[0]];
                            } else {
                                return parseFloat(this[0].scrollTop) || 0;
                            }
                        }	
                        return;
                    },
                    scrollLeft: function(left) {

                        if ( this.length > 0 ) {
                            if ( left ) {
                                if ( this.isNumeric(left) ) {
                                    this[0].scrollLeft = parseFloat(left) || 0;
                                }
                                return [this[0]];
                            } else {
                                return parseFloat(this[0].scrollLeft) || 0;	
                            }							
                        }	
                        return;
                    }
                };
            },
            traverse: function(helper) {
                return {
                    find: function(domSelector) {
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

                        return output;
                    },
                    has: function(domSelector) {
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
                            return output;
                        }

                        return;
                    },
                    children: function(domSelector) {
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

                        return output;
                    },
                    parent: function(domSelector) {
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

                        return output;
                    },
                    first: function() {
                        if ( this.length ) {
                            return [this[0]];
                        }
                        return;
                    },
                    last: function() {
                        if ( this.length ) {
                            return [this[this.length - 1]];
                        }						
                        return;
                    },
                    next: function(domSelector) {
                        var output = [],
                            nextSibling = null,
                            i = 0;

                        for( ; i < this.length ; i++ ) {
                            nextSibling = this[i].nextSibling;

                            while ( null !== nextSibling ) {
                                if ( nextSibling.nodeType === 1 ) {
                                    if ( !domSelector || 
                                         (helper.stringNotBlank(domSelector) && helper.matchesSelector(nextSibling, domSelector)) ) {
                                        helper.pushUniq(output, nextSibling);
                                    }
                                }
                                nextSibling = nextSibling.nextSibling;
                            }
                        }

                        return output;
                    },
                    prev: function(domSelector) {
                        var output = [],
                            prevSibling = null,
                            i = 0;

                        for( ; i < this.length ; i++ ) {
                            prevSibling = this[i].previousSibling;

                            while ( null !== prevSibling ) {
                                if ( prevSibling.nodeType === 1 ) {
                                    if ( !domSelector || 
                                         (helper.stringNotBlank(domSelector) && helper.matchesSelector(prevSibling, domSelector)) ) {									
                                        helper.pushUniq(output, prevSibling);
                                    }
                                }
                                prevSibling = prevSibling.previousSibling;
                            }
                        }

                        return output;
                    },
                    get: function(idx) {
                        if ( this.length && "undefined" !== this[idx] ) {
                            return [this[idx]];
                        }
                        return;
                    }				
                };
            },
            manipulation: function(helper) {
                return {
                    remove: function(domSelector) {
                        var i = 0;

                        for ( ; i < this.length ; i++ ) {
                            if ( !domSelector || 
                                 (helper.stringNotBlank(domSelector) && helper.matchesSelector(this[i], domSelector)) ) {
                                this[i].parentNode.removeChild(this[i]);
                            }							
                            
                        }

                        return this;
                    },
                    empty: function(domSelector) {
                        var i = 0;

                        for ( ; i < this.length ; i++ ) {
                            if ( !domSelector || 
                                 (helper.stringNotBlank(domSelector) && helper.matchesSelector(this[i], domSelector)) ) {
                                this[i].innerHTML = '';
                            }							
                            
                        }

                        return this;
                    },
                    attr: function() {
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
                    }
                };
            },
            events: function(helper) {
                return {
                    ready: function(callback) {
                        /* global DomQuery */
                        if ( DomQuery.isFunction(callback) ) {
                            readyCallback = callback;
                            if ( isReady ) {
                                callback.apply(this[0]);
                            } else {
                                setTimeout(this.ready, 1);
                            }
                        }
                    },
                    click: function() {
                        var output = helper.bindEvent(this, 'click', helper, arguments);
                        return output;
                    },
                    dblclick: function() {
                        var output = helper.bindEvent(this, 'dblclick', helper, arguments);
                        return output;
                    },
                    mousemove: function() {
                        var output = helper.bindEvent(this, 'mousemove', helper, arguments);
                        return output;
                    },
                    mouseover: function() {
                        var output = helper.bindEvent(this, 'mouseover', helper, arguments);
                        return output;
                    },
                    mouseout: function() {
                        var output = helper.bindEvent(this, 'mouseout', helper, arguments);
                        return output;
                    },
                    mouseup: function() {
                        var output = helper.bindEvent(this, 'mouseup', helper, arguments);
                        return output;
                    },	
                    mousedown: function() {
                        var output = helper.bindEvent(this, 'mousedown', helper, arguments);
                        return output;
                    },
                    mouseleave: function() {
                        var output = helper.bindEvent(this, 'mouseleave', helper, arguments);
                        return output;
                    },
                    mouseenter: function() {
                        var output = helper.bindEvent(this, 'mouseenter', helper, arguments);
                        return output;
                    },
                    hover: function() {
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
                    },
                    keyup: function() {
                        return helper.bindEvent(this, 'keyup', helper, arguments);
                    },
                    keydown: function() {
                        return helper.bindEvent(this, 'keydown', helper, arguments);
                    },
                    keypress: function() {
                        return helper.bindEvent(this, 'keypress', helper, arguments);
                    },
                    change: function() {
                        return helper.bindEvent(this, 'change', helper, arguments);
                    },
                    blur: function() {
                        return helper.bindEvent(this, 'blur', helper, arguments);
                    },
                    focus: function() {
                        return helper.bindEvent(this, 'focus', helper, arguments);
                    },
                    focusin: function() {
                        return helper.bindEvent(this, 'focusin', helper, arguments);
                    },
                    focusout: function() {
                        return helper.bindEvent(this, 'focusout', helper, arguments);
                    },
                    unload: function() {
                        return helper.bindEvent(this, 'unload', helper, arguments);
                    },
                    select: function() {
                        return helper.bindEvent(this, 'select', helper, arguments);
                    },
                    submit: function() {
                        return helper.bindEvent(this, 'submit', helper, arguments);
                    },
                    scroll: function() {
                        return helper.bindEvent(this, 'scroll', helper, arguments);
                    },
                    resize: function() {
                        return helper.bindEvent(this, 'resize', helper, arguments);
                    },
                    off: function() {
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
                    },
                    trigger: function(eventName) {
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
                    }
                };
            }
        },
        helper: function() {
            // Internal functions 
            return {
                matchString: function(haystack, needle) {
                    return null !== haystack.match(new RegExp('(\\s|^)'+needle+'(\\s|$)'));
                },
                stringNotBlank : function(str) {
                    return str && "" !== str.trim();
                },
                camelCase: function(str) {
                    return str.replace( /^-/, "" ) // Remove first hyphen
                              .replace( /-([\da-z])/gi, function(all, letter) { 
                                return "" !== letter ? letter.toUpperCase() : "";
                              });
                },
                pushUniq: function(list, item) {
                    var i = 0;

                    for ( ; i < list.length ; i++ ) {
                        if ( list[i] === item ) { 
                            return; 
                        }
                    }

                    list.push(item);
                },
                wrapper: function(newObjects) {
                    /* global DomQuery */
                    return new DomQuery(newObjects);
                },
                getStyles: function(obj) {
                    if ( "undefined" !== window.getComputedStyle ) {
                        return window.getComputedStyle(obj);
                    } else if ( "undefined" !== obj.currentStyle ) {
                        return obj.currentStyle;
                    }
                },
                findOffset: function(obj) {
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
                },
                unbindEvent: function(ele, eventName, callback) {
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
                },
                bindEvent: function(that, eventName, helper, argsEvent) {
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
                },
                matchesSelector: function( ele, domSelector ) {
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
                }
            };
        },
        utils: function(helper) {
            // General utility functions
            return {
                each: function each() {
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
                },
                extend: function (mergeTarget) {
                    var otherObjects = [],
                          _key = null,
                          objProp = null;

                    for (_key = 1; _key < arguments.length; _key++) {
                        otherObjects[_key - 1] = arguments[_key];
                    }

                    for (_key = 0; _key < otherObjects.length; _key++) {
                        for (objProp in otherObjects[_key]) {
                            mergeTarget[objProp] = otherObjects[_key][objProp];
                        }
                    }

                    return mergeTarget;
                },
                append: function(html) {
                    var i = 0,
                        output = [];

                    if ( this.length > 0 && 
                         helper.stringNotBlank(html) ) {

                        for ( ; i < this.length ; i++ ) {
                            this[i].innerHTML += html;
                            output.push(this[i]);
                        }
                    }

                    return output;
                },
                prepend: function(html) {
                    var i = 0,
                        output = [],
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
                            output.push(this[i]);
                        }
                    }
                    
                    return output;
                },
                isNumeric: function(obj) {
                    return (obj - parseFloat(obj)) === 0;
                },
                isFunction: function(obj) {
                    return "function" === typeof obj;
                },
                isArray: function(obj) {
                    return Array.isArray(obj);
                },
                isPlainObject: function(obj) {
                    // Check if variable is a {}
                    return "object" === typeof obj && "Object" === obj.constructor.name;
                },
                isEmpty: function(obj) {
                    var _key;

                    if ( obj.length > 0 ) { return false; }
                    if ( obj.length === 0 ) { return true; }
                    for ( _key in obj ) {
                        if ( Object.prototype.hasOwnProperty.call(obj, _key) ) {
                            return false;
                        }
                    }
                    return true;
                },
                // Source: [http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser]
                // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
                isOpera: !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
                // Firefox 1.0+
                isFirefox: typeof InstallTrigger !== 'undefined',   
                // At least Safari 3+: "[object HTMLElementConstructor]"
                isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,	
                // Chrome 1+
                isChrome: !!window.chrome && !this.isOpera, 
                // At least IE6
                isIE: /*@cc_on!@*/false || !!document.documentMode,
                // IE8 and below
                isOldIE: navigator.userAgent.match(/MSIE\s(?!9.0)/) ? true : false
            };
        },  
        selector: function(functionList, utilityList) {
            var runOnce = false;

            if ( !runOnce ) {
                // Attach uniq ID
                wrapper.uuid = 'DomQuery' + String(Math.random()).substring(2) + Date.now();
                wrapper.guid = 0;

                // Attach utils and other functions to the core
                utilityList.extend(wrapper, utilityList);
                utilityList.extend(DomQueryWrapper.prototype, functionList, utilityList);
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
                } else if ( utilityList.isArray(domSelector) ) {
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
                /* global DomQuery */
                return new DomQueryWrapper(domSelector);
            }          

            return wrapper;
        },
        init: function(moduleList) {
            var functionList = {},
                utilityList = {},
                helper = {},
                importList = null,
                _func = null,
                _key = null,
                $ = null;

            // Get all the functions defined - helper - Internal/private functions 
            if ( Object.prototype.hasOwnProperty.call(moduleList, 'helper') ) {
                importList = moduleList.helper();
                for ( _func in importList ) {
                    if ( "undefined" === typeof helper[_func] ) {
                        helper[_func] = importList[_func];
                    }
                }
            }

            // Get all the functions defined - Modules 
            if ( Object.prototype.hasOwnProperty.call(moduleList, 'modules') ) {
                for ( _key in moduleList.modules) {
                    importList = moduleList.modules[_key](helper);
                    for ( _func in importList ) {
                        if ( "undefined" === typeof functionList[_func] ) {
                            functionList[_func] = importList[_func];
                        }
                    }
                }
            }

            if ( Object.prototype.hasOwnProperty.call(moduleList, 'utils') ) {
                // Get all the functions defined - Utils - This is to expose util for $
                importList = moduleList.utils(helper);
                for ( _func in importList ) {
                    if ( "undefined" === typeof utilityList[_func] ) {
                        utilityList[_func] = importList[_func];
                    }
                }
            }

            $ = moduleList.selector.call(this, functionList, utilityList);

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

            return $;
        }
    }, 'init', {}); 
}));