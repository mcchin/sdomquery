! function(sDomQuery) {
    var obj;
    "undefined" !== typeof window ? obj = window : "undefined" !== typeof global ? obj = global : "undefined" !== typeof self && (obj = self), obj.sDomQuery = obj.$ = sDomQuery();
} (function() {

    var domEventListener = "undefined" !== typeof document.addEventListener ? document.addEventListener : "undefined" !== typeof document.attachEvent ? document.attachEvent : null;
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
                    }
                };
            },
            position: function(tools) {
                return {
                    height: function() {
                        return this;
                    },
                    width: function() {
                        return this;
                    },
                    offset: function() {
                        return this;
                    },
                    position: function() {
                        return this;
                    }
                }
            },
            traverse: function(tools) {
                return {
                    find: function() {
                        return this;
                    },
                    has: function() {
                        return this;
                    },
                    children: function(domSelector) {
                        return this;	
                    },
                    parent: function(domSelector) {

                        if ( "undefined" !== this[0].parentNode ) {
                            console.log(JSON.stringify(this[0].parentNode));
                            return new sDomQuery(this[0].parentNode)
                        }
                        return false
                    },
                    first: function() {
                        return this;
                    },
                    last: function() {
                        return this;
                    },
                    next: function() {
                        return this;
                    },
                    prev: function() {
                        return this;
                    }					
                }
            },
            manipulation: function(tools) {
                return {
                    remove: function() {
                        return this;
                    },
                    empty: function() {
                        var i = 0;

                        for ( ; i < this.length ; i++ ) {
                            this[i].innerHTML = '';
                        }

                        return this;
                    },
                    attr: function() {
                        return this;
                    }
                }
            },
            events: function(tools) {
                return {
                    ready: function( callback ) {
                        //callback.apply(this, arguments);
                    },
                    click: function() {
                        return this;
                    },
                    dblclick: function() {
                        return this;
                    },
                    mouseover: function() {
                        return this;
                    },
                    hover: function() {
                        return this;
                    },
                    mouseup: function() {
                        return this;
                    },	
                    mousedown: function() {
                        return this;
                    },
                    mouseleave: function() {
                        return this;
                    },
                    mouseenter: function() {
                        return this;
                    }
                }
            }
        },
        tools: function() {
            // Internal functions 
            return {
                matchString: function( haystack, needle ) {
                    return null !== haystack.match(new RegExp('(\\s|^)'+needle+'(\\s|$)'))
                },
                stringNotBlank : function( str ) {
                    return str && "" !== str.trim() 
                },
                camelCase: function( str ) {
                    return str.replace( /^-/, "" ) // Remove first hyphen
                              .replace( /-([\da-z])/gi, function(all, letter) { 
                                return "" !== letter ? letter.toUpperCase() : "" 
                              })
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
                isNumeric: function() {

                },
                isFunction: function(obj) {
                    return "function" === typeof obj
                },
                isArray: function(obj) {
                    return Array.isArray(obj)
                },
                isPlainObject: function() {

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

            return $
        }
    }, 'init'); 
});