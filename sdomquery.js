! function(sDomQuery) {
    var obj;
    "undefined" !== typeof window ? obj = window : "undefined" !== typeof global ? obj = global : "undefined" !== typeof self && (obj = self), obj.sDomQuery = obj.$ = sDomQuery();
} (function() {
    var //domEventListener = "undefined" !== typeof document.addEventListener ? document.addEventListener : "undefined" !== typeof document.attachEvent ? document.attachEvent : null,
        //removeDomEventListener = "undefined" !== typeof document.removeEventListener ? document.removeEventListener : "undefined" !== typeof document.detachEvent ? document.detachEvent : null,
        isReady = false,
        readyCallback = null;

    return (function loadModule(moduleList, initFunction, extendList) {
        return moduleList[initFunction].call(this, moduleList);
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
                                if ( this[i].className 
                                     && helper.matchString(this[i].className, className) ) {
                                    return true;
                                }
                            }
                        }

                        return false;
                    },
                    css: function() {
                        var styles = {},
                            output = {},
                            i = 0;

                        if ( this.length > 0 ) {
                            if ( 1 === arguments.length && "string" === typeof arguments[0] ) {
                                return this[0].style[helper.camelCase(arguments[0])];
                            } else if ( 1 === arguments.length && this.isArray(arguments[0]) ) {
                                for ( ; i < arguments[0].length ; i++ ) {
                                    output[arguments[0][i]] = this[0].style[helper.camelCase(arguments[0][i])];
                                }
                                return output;
                            } else if ( 1 === arguments.length && "object" === typeof arguments[0] ) {
                                for ( var prop in arguments[0] ) {
                                    styles[helper.camelCase(prop)] = arguments[0][prop];
                                }
                            } else if ( 2 === arguments.length ) {
                                styles[helper.camelCase(arguments[0])] = arguments[1];
                            }

                            for ( var prop in styles ) {
                                for ( i = 0 ; i < this.length ; i++ ) {
                                    this[i].style[prop] = styles[prop];
                                }
                            }
                        }

                        return this;
                    },
                    styles: function() {
                        if ( this.length > 0 ) {
                            return helper.getStyles(this[0])
                        }

                        return
                    }
                };
            },
            position: function(helper) {
                return {
                    height: function() {
                        var styles = null;

                        if ( this.length > 0 ) {
                            styles = helper.getStyles(this[0]);

                            return parseFloat(styles.height)
                        }

                        return
                    },
                    width: function() {
                        var styles = null;

                        if ( this.length > 0 ) {
                            styles = helper.getStyles(this[0]);
                            return parseFloat(styles.width)
                        }

                        return
                    },
                    innerHeight: function() {
                        if ( this.length > 0 ) {
                            return this[0].scrollHeight
                        }

                        return
                    },
                    innerWidth: function() {
                        if ( this.length > 0 ) {
                            return this[0].scrollWidth
                        }

                        return
                    },
                    outerHeight: function() {
                        var styles = null;

                        if ( this.length > 0 ) {
                            styles = helper.getStyles(this[0]);

                            return parseFloat(styles.height) 
                                   + parseFloat(styles.paddingTop) 
                                   + parseFloat(styles.paddingBottom) 
                                   + parseFloat(styles.borderTopWidth) 
                                   + parseFloat(styles.borderBottomWidth) 
                        }

                        return
                    },
                    outerWidth: function() {
                        var styles = null;

                        if ( this.length > 0 ) {
                            styles = helper.getStyles(this[0]);

                            return parseFloat(styles.width) 
                                   + parseFloat(styles.paddingLeft) 
                                   + parseFloat(styles.paddingRight) 
                                   + parseFloat(styles.borderLeftWidth) 
                                   + parseFloat(styles.borderRightWidth) 
                        }

                        return
                    },
                    offset: function(coords) {
                        var output = [],
                            parentLeft = parentTop = l = t = 0,
                            obj = null,						
                            i = 0;

                        if ( this.length > 0 ) {
                            if ( this.isFunction(coords) ) {
                                coords = coords.call(this)
                            }

                            if ( this.isPlainObject(coords) ) {
                                for ( ; i < this.length ; i++ ) {
                                    if ( 'absolute' !== $(this[i]).css('position') 
                                         && 'fixed' !== $(this[i]).css('position') ) {
                                        $(this[i]).css('position', 'relative')
                                    }

                                    coords.top = this.isNumeric(coords.top) ? coords.top + 'px' : coords.top;
                                    coords.left = this.isNumeric(coords.left) ? coords.left + 'px' : coords.left;

                                    if ( this[i].offsetParent &&
                                         'fixed' !== $(this[i]).css('position') ) {
                                        obj = this[i].offsetParent;
                                        do { 
                                            parentTop += obj.offsetTop;// + (parseFloat(obj.style.top) || 0);
                                            parentLeft += obj.offsetLeft;// + (parseFloat(obj.style.left) || 0);
                                        } while ( obj = obj.offsetParent )
                                    }

                                    // Considering scrollTop, scrollLeft?

                                    // Need to find way to convert %, rem, em, and etc to px
                                    $(this[i]).css(coords);
                                    t = parseFloat($(this[i]).css('top')) || 0;
                                    l = parseFloat($(this[i]).css('left')) || 0;

                                    $(this[i]).css({
                                        top: (parseFloat(t - parentTop) || 0) + 'px', 
                                        left: (parseFloat(l - parentLeft) || 0) + 'px'
                                    });

                                    output.push(this[i])
                                }
                                
                                return output
                            } else {
                                return helper.findOffset(this[0])
                            }
                        }

                        return
                    },
                    position: function(coords) {
                        var output = [],
                            i = 0;

                        if ( this.length > 0 ) {
                            if ( this.isFunction(coords) ) {
                                coords = coords.call(this)
                            }

                            if ( this.isPlainObject(coords) ) {
                                for ( ; i < this.length ; i++ ) {
                                    if ( 'absolute' !== $(this[i]).css('position') 
                                         && 'fixed' !== $(this[i]).css('position') ) {
                                        $(this[i]).css('position', 'relative')
                                    }

                                    coords.top = this.isNumeric(coords.top) ? coords.top + 'px' : coords.top;
                                    coords.left = this.isNumeric(coords.left) ? coords.left + 'px' : coords.left;

                                    $(this[i]).css(coords);
                                    output.push(this[i])
                                }
                                
                                return output
                            } else {
                                return {
                                    top: this[0].offsetTop,
                                    left: this[0].offsetLeft
                                }
                            }
                        }

                        return
                    },
                    scrollTop: function(top) {
                        if ( this.length > 0 ) {
                            if ( top ) {
                                if ( this.isNumeric(top) ) {
                                    this[0].scrollTop = parseFloat(top) || 0;
                                }
                                return [this[0]]
                            } else {
                                return parseFloat(this[0].scrollTop) || 0
                            }
                        }	
                        return
                    },
                    scrollLeft: function(left) {

                        if ( this.length > 0 ) {
                            if ( left ) {
                                if ( this.isNumeric(left) ) {
                                    this[0].scrollLeft = parseFloat(left) || 0;
                                }
                                return [this[0]]
                            } else {
                                return parseFloat(this[0].scrollLeft) || 0	
                            }							
                        }	
                        return
                    }
                }
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
                                        for(var j = 0 ; j < child.length ; j++ ) {
                                            output.push(child[j]);
                                        } 
                                    }	
                                }
                            }
                        }

                        return helper.wrapper(output);
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
                            return helper.wrapper(output);
                        }

                        return 
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
                                        for(var j = 0 ; j < child.length ; j++ ) {
                                            // Only direct child
                                            if ( child[j].parentNode === this[i] ) {
                                                output.push(child[j]);
                                            }
                                        } 
                                    } 									
                                } else {							
                                    for ( child in this[i].childNodes ) {
                                        if ( 1 === this[i].childNodes[child].nodeType ) {
                                            output.push(this[i].childNodes[child]);
                                        }
                                    }
                                }
                            }
                        }

                        return helper.wrapper(output);
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
                                if ( "undefined" !== parent.parentNode
                                     && 1 === parent.parentNode.nodeType ) {
                                    child = parent.parentNode.querySelectorAll(domSelector);
                                    if ( child.length ) {
                                        for(var j = 0 ; j < child.length ; j++ ) {
                                            if ( child[j].parentNode === parent.parentNode ) {
                                                if (child[j] === parent ) {
                                                    helper.pushUniq(output, child[j]);
                                                }
                                            }
                                        } 
                                    }										
                                }						
                            } else {									
                                helper.pushUniq(output, this[i].parentNode)
                            }
                        }

                        return helper.wrapper(output);
                    },
                    first: function() {
                        if ( this.length ) {
                            return helper.wrapper([this[0]])
                        }
                        return 
                    },
                    last: function() {
                        if ( this.length ) {
                            return helper.wrapper([this[this.length - 1]])
                        }						
                        return 
                    },
                    next: function(domSelector) {
                        var output = [],
                            nextSibling = null,
                            i = 0;

                        for( ; i < this.length ; i++ ) {
                            nextSibling = this[i].nextSibling;

                            while ( null !== nextSibling ) {
                                if ( 1 === nextSibling.nodeType ) {
                                    if ( !domSelector 
                                         || (helper.stringNotBlank(domSelector) && helper.matchesSelector(nextSibling, domSelector)) ) {
                                        helper.pushUniq(output, nextSibling)
                                    }
                                }
                                nextSibling = nextSibling.nextSibling;
                            }
                        }

                        return helper.wrapper(output);
                    },
                    prev: function(domSelector) {
                        var output = [],
                            prevSibling = null,
                            i = 0;

                        for( ; i < this.length ; i++ ) {
                            prevSibling = this[i].previousSibling;

                            while ( null !== prevSibling ) {
                                if ( 1 === prevSibling.nodeType ) {
                                    if ( !domSelector 
                                         || (helper.stringNotBlank(domSelector) && helper.matchesSelector(prevSibling, domSelector)) ) {									
                                        helper.pushUniq(output, prevSibling)
                                    }
                                }
                                prevSibling = prevSibling.previousSibling;
                            }
                        }

                        return helper.wrapper(output);
                    },
                    get: function(idx) {
                        if ( this.length && "undefined" !== this[idx] ) {
                            return helper.wrapper([this[idx]])
                        }
                        return 
                    }				
                }
            },
            manipulation: function(helper) {
                return {
                    remove: function(domSelector) {
                        var i = 0;

                        for ( ; i < this.length ; i++ ) {
                            if ( !domSelector 
                                 || (helper.stringNotBlank(domSelector) && helper.matchesSelector(this[i], domSelector)) ) {
                                this[i].parentNode.removeChild(this[i])
                            }							
                            
                        }

                        return this;
                    },
                    empty: function(domSelector) {
                        var i = 0;

                        for ( ; i < this.length ; i++ ) {
                            if ( !domSelector 
                                 || (helper.stringNotBlank(domSelector) && helper.matchesSelector(this[i], domSelector)) ) {
                                this[i].innerHTML = ''
                            }							
                            
                        }

                        return this;
                    },
                    attr: function() {
                        var attrs = {},
                            attr = '',
                            output = {},
                            i = 0;

                        if ( 1 === arguments.length && "string" === typeof arguments[0] ) {
                            return this[0].getAttribute(arguments[0])
                        } else if ( 1 === arguments.length && this.isArray(arguments[0]) ) {
                            for ( ; i < arguments[0].length ; i++ ) {
                                output[arguments[0][i]] = this[0].getAttribute(arguments[0][i]);
                            }
                            return output;
                        } else if ( 1 === arguments.length && "object" === typeof arguments[0] ) {
                            for ( var prop in arguments[0] ) {
                                attrs[prop] = arguments[0][prop];
                            }
                        } else if ( 2 === arguments.length ) {
                            attrs[arguments[0]] = arguments[1];
                        } else {
                            // Return all attributes
                            for ( ; i < this[0].attributes.length ; i++ ) {
                                output[this[0].attributes[i].nodeName] = this[0].attributes[i].value;
                            }							
                            return output;
                        }

                        for ( var prop in attrs ) {
                            for ( i = 0 ; i < this.length ; i++ ) {
                                this[i].setAttribute(prop, attrs[prop]);
                            }
                        }

                        return this;
                    }
                }
            },
            events: function(helper) {
                return {
                    ready: function(callback) {
                        if ( sDomQuery.isFunction(callback) ) {
                            readyCallback = callback;
                            if ( isReady ) {
                                callback.apply(this[0])
                            } else {
                                setTimeout(this.ready, 1)
                            }
                        }
                    },
                    click: function() {
                        var output = helper.bindEvent(this, 'click', helper, arguments);
                        return output
                    },
                    dblclick: function() {
                        var output = helper.bindEvent(this, 'dblclick', helper, arguments);
                        return output
                    },
                    mousemove: function() {
                        var output = helper.bindEvent(this, 'mousemove', helper, arguments);
                        return output
                    },
                    mouseover: function() {
                        var output = helper.bindEvent(this, 'mouseover', helper, arguments);
                        return output
                    },
                    mouseout: function() {
                        var output = helper.bindEvent(this, 'mouseout', helper, arguments);
                        return output
                    },
                    mouseup: function() {
                        var output = helper.bindEvent(this, 'mouseup', helper, arguments);
                        return output
                    },	
                    mousedown: function() {
                        var output = helper.bindEvent(this, 'mousedown', helper, arguments);
                        return output
                    },
                    mouseleave: function() {
                        var output = helper.bindEvent(this, 'mouseleave', helper, arguments);
                        return output
                    },
                    mouseenter: function() {
                        var output = helper.bindEvent(this, 'mouseenter', helper, arguments);
                        return output
                    },
                    hover: function() {
                        var output = [],
                            callbackIn = null,
                            callbackOut = null;

                        if ( 2 === arguments.length ) {
                            callbackIn = arguments[0];
                            callbackOut = arguments[1];
                        } else if ( 1 === arguments.length ) {
                            callbackIn = arguments[0];
                            callbackOut = arguments[0];
                        }

                        if ( arguments.length ) {
                            output = helper.bindEvent(this, 'mouseleave', helper, [callbackIn]);
                            helper.bindEvent(this, 'mouseenter', helper, [callbackOut]);
                        }

                        return output
                    },
                    keyup: function() {
                        var output = helper.bindEvent(this, 'keyup', helper, arguments);
                        return
                    },
                    keydown: function() {
                        var output = helper.bindEvent(this, 'keydown', helper, arguments);
                        return
                    },
                    keypress: function() {
                        var output = helper.bindEvent(this, 'keypress', helper, arguments);
                        return
                    },
                    change: function() {
                        var output = helper.bindEvent(this, 'change', helper, arguments);
                        return
                    },
                    blur: function() {
                        var output = helper.bindEvent(this, 'blur', helper, arguments);
                        return
                    },
                    focus: function() {
                        var output = helper.bindEvent(this, 'focus', helper, arguments);
                        return
                    },
                    focusin: function() {
                        var output = helper.bindEvent(this, 'focusin', helper, arguments);
                        return
                    },
                    focusout: function() {
                        var output = helper.bindEvent(this, 'focusout', helper, arguments);
                        return
                    },
                    unload: function() {
                        var output = helper.bindEvent(this, 'unload', helper, arguments);
                        return
                    },
                    select: function() {
                        var output = helper.bindEvent(this, 'select', helper, arguments);
                        return
                    },
                    submit: function() {
                        var output = helper.bindEvent(this, 'submit', helper, arguments);
                        return
                    },
                    scroll: function() {
                        var output = helper.bindEvent(this, 'scroll', helper, arguments);
                        return
                    },
                    resize: function() {
                        var output = helper.bindEvent(this, 'resize', helper, arguments);
                        return
                    },
                    off: function() {
                        // 0 - event, 1 - selector, 2 - handler
                        var eventName = null,
                            domSelector = null,
                            handler = null,
                            i = 0,
                            output = [];

                        if ( this.length > 0 ) {
                            if ( 3 === arguments.length 
                                 && "function" === typeof arguments[2]) {
                                eventName = arguments[0];
                                domSelector = arguments[1];
                                handler = arguments[2];
                            } else if ( 2 === arguments.length ) {
                                eventName = arguments[0];
                                domSelector = arguments[1];
                            } else if ( 1 === arguments.length ) {
                                eventName = arguments[0];
                            } 

                            for ( ; i < this.length ; i++ ) {
                                if ( !domSelector 
                                     || (helper.stringNotBlank(domSelector) && helper.matchesSelector(this[i], domSelector)) ) {
                                    if ( "undefined" !== typeof this[i].removeEventListener ) {
                                        helper.unbindEvent(this[i], eventName ? eventName : null, handler ? handler : null);
                                        output.push(this[i])
                                    } 
                                }
                            }							

                        }

                        return output
                    },
                    trigger: function(eventName) {
                        var i = 0,
                            j = 0,
                            params = [],
                            output = [];

                        if ( this.length > 0 ) {
                            if ( helper.stringNotBlank(eventName) ) {
                                params = Array.prototype.slice.call(arguments, 1);
                                for ( ; i < this.length ; i++ ) {
                                    for ( j = 0 ; j < this[i][sDomQuery.uuid].length ; j++ ) {
                                        if ( eventName === this[i][sDomQuery.uuid][j].eventName ) {
                                            this[i][sDomQuery.uuid][j].handler.apply(this[i], params);
                                            output.push(this[i])
                                        }
                                    }
                                }
                            }
                        }

                        return output
                    }
                }
            }
        },
        helper: function() {
            // Internal functions 
            return {
                matchString: function(haystack, needle) {
                    return null !== haystack.match(new RegExp('(\\s|^)'+needle+'(\\s|$)'))
                },
                stringNotBlank : function(str) {
                    return str && "" !== str.trim() 
                },
                camelCase: function(str) {
                    return str.replace( /^-/, "" ) // Remove first hyphen
                              .replace( /-([\da-z])/gi, function(all, letter) { 
                                return "" !== letter ? letter.toUpperCase() : "" 
                              })
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
                    return new sDomQuery(newObjects)
                },
                getStyles: function(obj) {
                    if ( "undefined" !== window.getComputedStyle ) {
                        return window.getComputedStyle(obj)
                    } else if ( "undefined" !== obj.currentStyle ) {
                        return obj.currentStyle
                    }
                },
                findOffset: function(obj) {
                    var l = t = 0;
                    if ( obj.offsetParent ) {
                        do { 
                            t += obj.offsetTop;
                            l += obj.offsetLeft;
                        } while ( obj = obj.offsetParent )
                    }

                    return {
                        top: t,
                        left: l
                    }
                },
                unbindEvent: function(ele, eventName, callback, capture) {
                    var i = 0,
                        remove = [],
                        eventObj = null;

                    if ( "undefined" !== typeof ele[sDomQuery.uuid]
                         && "undefined" !== typeof ele.removeEventListener ) {
                        
                        eventObj = ele[sDomQuery.uuid];

                        do {
                            if ( !callback 
                                 || (!callback && !eventName)
                                 || (!callback && eventName === eventObj[i].eventName)
                                 || (callback.guid === eventObj[i].guid && eventName === eventObj[i].eventName) ) {

                                ele.removeEventListener(eventObj[i].eventName, eventObj[i].handler, eventObj[i].capture);
                                eventObj.splice(i,1);
                            } else {
                                i++;
                            }
                        } while ( i < eventObj.length && eventObj.length )
                    }
                },
                bindEvent: function(that, eventName, helper, arguments) {
                    var	output = [],
                        callback = null,
                        callbackStore = null,
                        args = null,
                        i = 0;

                    if ( 2 === arguments.length ) {
                        args = arguments[0];
                        callback = arguments[1];
                    } else if ( 1 === arguments.length ) {
                        callback = arguments[0];
                    }

                    if ( that.length > 0 
                         && arguments.length > 0
                         && that.isFunction(callback) ) {

                        if ( "undefined" === typeof callback.guid ) {
                            callback.guid = ++sDomQuery.guid;
                        }

                        for ( ; i < that.length ; i++ ) {
                            if ( that[i].addEventListener ) {
                                if ( "undefined" === typeof that[i][sDomQuery.uuid]) {
                                    that[i][sDomQuery.uuid] = [];
                                }							

                                if ( null !== args ) {
                                    callbackStore = callback.bind(that[i], args);
                                } else {
                                    callbackStore = callback.bind(that[i]);
                                }

                                that[i][sDomQuery.uuid].push({
                                    guid: callback.guid,
                                    eventName: eventName,
                                    handler: callbackStore,
                                    args: args,
                                    capture: false
                                });

                                that[i].addEventListener(eventName, callbackStore, false);

                                output.push(that[i])
                            }
                        }
                    }

                    return output
                },
                matchesSelector: function( ele, domSelector ) {
                    if ("function" === typeof ele.oMatchesSelector) 
                        return ele.oMatchesSelector(domSelector)  
                    else if ("function" === typeof ele.msMatchesSelector)
                        return ele.msMatchesSelector(domSelector)
                    else if ("function" === typeof ele.webkitMatchesSelector)
                        return ele.webkitMatchesSelector(domSelector) 
                    else if ("function" === typeof ele.mozMatchesSelector)
                        return ele.mozMatchesSelector(domSelector) 
                    else {
                        var matches = (ele.document || ele.ownerDocument).querySelectorAll(domSelector);
                        var i = 0;

                        while (matches[i] && matches[i] !== ele) {
                            i++;
                        }

                        return matches[i] ? true : false;
                    }
                    return false
                }
            }
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
                    return elements
                },
                extend: function (mergeTarget) {
                  var otherObjects = [];

                  for (var _key = 1; _key < arguments.length; _key++) {
                    otherObjects[_key - 1] = arguments[_key];
                  }

                  for (var _key = 0; _key < otherObjects.length; _key++) {
                    for (var objProp in otherObjects[_key]) {
                      mergeTarget[objProp] = otherObjects[_key][objProp];
                    }
                  };

                  return mergeTarget
                },
                append: function () {

                },
                prepend: function() {

                },
                isNumeric: function(obj) {
                    return 0 === (obj - parseFloat(obj))
                },
                isFunction: function(obj) {
                    return "function" === typeof obj
                },
                isArray: function(obj) {
                    return Array.isArray(obj)
                },
                isPlainObject: function(obj) {
                    // Check if variable is a {}
                    return "object" === typeof obj && "Object" === obj.constructor.name
                }
            }
        },  
        selector: function(functionList, utilityList, helper) {
            var runOnce = false;

            if ( !runOnce ) {
                // Attach uniq ID
                wrapper.uuid = 'sDomQuery' + String(Math.random()).substring(2) + Date.now();
                wrapper.guid = 0;

                // Attach utils and other functions to the core
                utilityList.extend(wrapper, utilityList);
                utilityList.extend(sDomQuery.prototype, functionList, utilityList);
                runOnce = true;
            }

            function sDomQuery(domSelector) {
                var foundObjects = [],
                    regExpHtml = /^$/,
                    regExpID = /^$/,
                    regExpClass = /^$/;

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

                return this
            }      
            
            function wrapper(domSelector) {
                return new sDomQuery(domSelector)
            }          

            return wrapper
        },
        init: function(moduleList) {
            var functionList = {},
                utilityList = {},
                helper = {},
                importList = null,
                $ = null;

            // Get all the functions defined - helper - Internal/private functions 
            importList = moduleList['helper']();
            for ( var _func in importList ) {
                if ( "undefined" === typeof helper[_func] ) {
                    helper[_func] = importList[_func];
                }
            }

            // Get all the functions defined - Modules 
            for ( var _key in moduleList['modules']) {
                importList = moduleList['modules'][_key](helper);
                for ( var _func in importList ) {
                    if ( "undefined" === typeof functionList[_func] ) {
                        functionList[_func] = importList[_func];
                    }
                }
            }

            // Get all the functions defined - Utils - This is to expose util for $
            importList = moduleList['utils'](helper);
            for ( var _func in importList ) {
                if ( "undefined" === typeof utilityList[_func] ) {
                    utilityList[_func] = importList[_func];
                }
            }

            $ = moduleList['selector'].call(this, functionList, utilityList, helper);

            DOMReady = function() {
                if ( "undefined" !== typeof document.removeEventListener ) {
                    document.removeEventListener("DOMContentLoaded", DOMReady, false);
                } 

                if ( null !== readyCallback ) {
                    readyCallback.apply(this)
                }

                isReady = true;
            }

            if ( "undefined" !== typeof document.addEventListener ) {
                document.addEventListener("DOMContentLoaded", DOMReady, false)
            }

            return $
        }
    }, 'init', {}); 
});