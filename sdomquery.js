! function(e) {
    var obj;
    "undefined" !== typeof window ? obj = window : "undefined" !== typeof global ? obj = global : "undefined" !== typeof self && (obj = self), obj.sDomQuery = obj.$ = e();
} (function() {
    return (function loadModule(moduleList, initFunction, api) {		
        $ = moduleList[initFunction].call(api, moduleList, api);
        return $;
    })({
        modules: {
            css: function() {
                return {
                    act1: function() {
                        // testing
                        console.log('act1');
                        console.log(this);
                        this['each'](this, function(ele) {
                            console.log(ele.style);
                        });						
                        return this;
                    },
                    act2: function(domObject) {
                        // testing
                        console.log('act2');
                        return this;
                    }
                };
            },
            utils: function() {
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
                                    callback.call(null, elements[i], i, elements);
                                }
                            }
                        }
                        return elements;
                    }
                }
            }
        },
        selector: function(api, functionList) {

            var runOnce = false;

            if ( !runOnce ) {
                sDomQuery.prototype = functionList;
                runOnce = true;
            }

            function sDomQuery(foundObjects) {
                this.length = foundObjects ? foundObjects.length : 0;

                if ( foundObjects ) {
                    for(var i = 0 ; i < foundObjects.length ; i++ ) {
                        this[i] = foundObjects[i];
                    } 
                } 
            }

            return function(domSelector) {
                var foundObjects = null,
                    regHtml = /^$/,
                    regID = /^$/,
                    regClass = /^$/;

                // if html append
                // if instance return instance
                if ( domSelector ) {
                    foundObjects = document.querySelectorAll(domSelector);
                }

                return (function() {
                    return new sDomQuery(foundObjects);
                })();
            };
        },
        init: function(moduleList, api) {
            var functionList = {},
                importList = null,
                $ = null;

            for ( var _key in moduleList['modules']) {
                importList = moduleList['modules'][_key]();
                for ( var _func in importList ) {
                    if ( "undefined" === typeof functionList[_func] ) {
                        functionList[_func] = importList[_func];
                    }
                }
            }

            $ = moduleList['selector'](api, functionList);
            return $;
        }
    }, 'init', { /* Default, config, or other imports */ });
});