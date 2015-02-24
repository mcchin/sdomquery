! function(sDomQuery) {
    var obj;
    "undefined" !== typeof window ? obj = window : "undefined" !== typeof global ? obj = global : "undefined" !== typeof self && (obj = self), obj.sDomQuery = obj.$ = sDomQuery();
} (function() {
    var isReady = false,
        readyCallback = null;

    return (function loadModule(moduleList, initFunction) {
        return moduleList[initFunction].call(this, moduleList);
    })({
        modules: {
            css: function(tools) {
                return {
                    addClass: function(className) {
                        var i = 0;

                        if ( tools.stringNotBlank(className) ) {
                            for ( ; i < this.length ; i++ ) {
                                if ( !tools.matchString(this[i].className, className) ) {
                                    this[i].className += " " + className;
                                }
                            }
                        }				

                        return this;
                    },
                    removeClass: function(className) {
                        var i = 0;

                        if ( tools.stringNotBlank(className) ) {
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

                        if ( tools.stringNotBlank(className) ) {
                            for ( ; i < this.length ; i++ ) {
                                if ( this[i].className 
                                     && tools.matchString(this[i].className, className) ) {
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

                        if ( 1 === arguments.length && "string" === typeof arguments[0] ) {
                            return this[0].style[tools.camelCase(arguments[0])];
                        } else if ( 1 === arguments.length && this.isArray(arguments[0]) ) {
                            for ( ; i < arguments[0].length ; i++ ) {
                                output[arguments[0][i]] = this[0].style[tools.camelCase(arguments[0][i])];
                            }
                            return output;
                        } else if ( 1 === arguments.length && "object" === typeof arguments[0] ) {
                            for ( var prop in arguments[0] ) {
                                styles[tools.camelCase(prop)] = arguments[0][prop];
                            }
                        } else if ( 2 === arguments.length ) {
                            styles[tools.camelCase(arguments[0])] = arguments[1];
                        }

                        for ( var prop in styles ) {
                            for ( i = 0 ; i < this.length ; i++ ) {
                                this[i].style[prop] = styles[prop];
                            }
                        }

                        return this;
                    },
                    styles: function() {
                        if ( this.length > 0 ) {
                            return tools.getStyles(this[0])
                        }

                        return
                    }
                };
            },
            position: function(tools) {
                return {
                    height: function() {
                        var styles = null;

                        if ( this.length > 0 ) {
                            styles = tools.getStyles(this[0]);

                            return parseFloat(styles.height)
                        }

                        return
                    },
                    width: function() {
                        var styles = null;

                        if ( this.length > 0 ) {
                            styles = tools.getStyles(this[0]);
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
                            styles = tools.getStyles(this[0]);

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
                            styles = tools.getStyles(this[0]);

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
                                return tools.findOffset(this[0])
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
            traverse: function(tools) {
                return {
                    find: function(domSelector) {
                        var output = [],
                            i = 0,
                            j = 0,
                            child = null;

                        if ( tools.stringNotBlank(domSelector) ) {
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

                        return tools.wrapper(output);
                    },
                    has: function(domSelector) {
                        var output = [],
                            i = 0,
                            child = null;

                        if ( tools.stringNotBlank(domSelector) ) {
                            for ( ; i < this.length ; i++ ) {
                                if ( "undefined" !== this[i].childNodes ) {
                                    child = this[i].querySelectorAll(domSelector);
                                    if ( child.length ) {
                                        output.push(this[i]);
                                    }
                                }
                            }
                            return tools.wrapper(output);
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
                                if ( tools.stringNotBlank(domSelector) ) {
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

                        return tools.wrapper(output);
                    },
                    parent: function(domSelector) {
                        var output = [],
                            parent = null,
                            child = null,
                            i = 0,
                            j = 0;

                        for ( ; i < this.length ; i++ ) {
                            // Need more efficient logic here
                            if ( tools.stringNotBlank(domSelector) ) {
                                parent = this[i].parentNode;
                                if ( "undefined" !== parent.parentNode
                                     && 1 === parent.parentNode.nodeType ) {
                                    child = parent.parentNode.querySelectorAll(domSelector);
                                    if ( child.length ) {
                                        for(var j = 0 ; j < child.length ; j++ ) {
                                            if ( child[j].parentNode === parent.parentNode ) {
                                                if (child[j] === parent ) {
                                                    tools.pushUniq(output, child[j]);
                                                }
                                            }
                                        } 
                                    }										
                                }						
                            } else {									
                                tools.pushUniq(output, this[i].parentNode)
                            }
                        }

                        return tools.wrapper(output);
                    },
                    first: function() {
                        if ( this.length ) {
                            return tools.wrapper([this[0]])
                        }
                        return 
                    },
                    last: function() {
                        if ( this.length ) {
                            return tools.wrapper([this[this.length - 1]])
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
                                         || (tools.stringNotBlank(domSelector) && tools.matchesSelector(nextSibling, domSelector)) ) {
                                        tools.pushUniq(output, nextSibling)
                                    }
                                }
                                nextSibling = nextSibling.nextSibling;
                            }
                        }

                        return tools.wrapper(output);
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
                                         || (tools.stringNotBlank(domSelector) && tools.matchesSelector(prevSibling, domSelector)) ) {									
                                        tools.pushUniq(output, prevSibling)
                                    }
                                }
                                prevSibling = prevSibling.previousSibling;
                            }
                        }

                        return tools.wrapper(output);
                    },
                    get: function(idx) {
                        if ( this.length && "undefined" !== this[idx] ) {
                            return tools.wrapper([this[idx]])
                        }
                        return 
                    }				
                }
            },
            manipulation: function(tools) {
                return {
                    remove: function(domSelector) {
                        var i = 0;

                        for ( ; i < this.length ; i++ ) {
                            if ( !domSelector 
                                 || (tools.stringNotBlank(domSelector) && tools.matchesSelector(this[i], domSelector)) ) {
                                this[i].parentNode.removeChild(this[i])
                            }							
                            
                        }

                        return this;
                    },
                    empty: function(domSelector) {
                        var i = 0;

                        for ( ; i < this.length ; i++ ) {
                            if ( !domSelector 
                                 || (tools.stringNotBlank(domSelector) && tools.matchesSelector(this[i], domSelector)) ) {
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
            events: function(tools) {
                return {
                    ready: function( callback ) {
                        if ( sDomQuery.isFunction(callback) ) {
                            readyCallback = callback;
                            if ( isReady ) {
                                callback.apply(sDomQuery)
                            } else {
                                setTimeout(sDomQuery.ready, 1)
                            }
                        }
                    },
                    click: function() {
                        return
                    },
                    dblclick: function() {
                        return
                    },
                    mouseover: function() {
                        return
                    },
                    hover: function() {
                        return
                    },
                    mouseup: function() {
                        return
                    },	
                    mousedown: function() {
                        return
                    },
                    mouseleave: function() {
                        return
                    },
                    mouseenter: function() {
                        return
                    }
                }
            }
        },
        tools: function() {
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
        utils: function(tools) {
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
        selector: function(functionList, utilityList, tools) {
            var runOnce = false;

            if ( !runOnce ) {
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
                tools = {},
                importList = null,
                $ = null;

            // Get all the functions defined - Tools - Internal/private functions 
            importList = moduleList['tools']();
            for ( var _func in importList ) {
                if ( "undefined" === typeof tools[_func] ) {
                    tools[_func] = importList[_func];
                }
            }

            // Get all the functions defined - Modules 
            for ( var _key in moduleList['modules']) {
                importList = moduleList['modules'][_key](tools);
                for ( var _func in importList ) {
                    if ( "undefined" === typeof functionList[_func] ) {
                        functionList[_func] = importList[_func];
                    }
                }
            }

            // Get all the functions defined - Utils - This is to expose util for $
            importList = moduleList['utils'](tools);
            for ( var _func in importList ) {
                if ( "undefined" === typeof utilityList[_func] ) {
                    utilityList[_func] = importList[_func];
                }
            }

            $ = moduleList['selector'].call(this, functionList, utilityList, tools);

            DOMReady = function() {
                if ( document.addEventListener ) {
                    document.removeEventListener("DOMContentLoaded", DOMReady, false);
                } else if ( document.attachEvent ) {
                    document.detachEvent("onreadystatechange", DOMReady);
                }

                if ( null !== readyCallback ) {
                    readyCallback.apply($)
                }

                isReady = true;
            }

            if ( "undefined" !== typeof document.addEventListener ) {
                document.addEventListener("DOMContentLoaded", DOMReady, false)
            } else if ( "undefined" !== typeof document.attachEvent ) {
                document.attachEvent("onreadystatechange", DOMReady)
            }

            return $
        }
    }, 'init'); 
});