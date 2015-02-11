! function(sDomQuery) {
    var obj;
    "undefined" !== typeof window ? obj = window : "undefined" !== typeof global ? obj = global : "undefined" !== typeof self && (obj = self), obj.sDomQuery = obj.$ = sDomQuery();
} (function() {
    return (function loadModule(moduleList, initFunction) {
        return moduleList[initFunction].call(this, moduleList);
    })({
        modules: {
            css: function() {
                return {
                    act1: function() {
                        // testing
                        console.log('act1');
                        console.log(this);
                        this['each'](this, function(ele, idx) {
                            console.log(ele.style);
                            console.log(idx);
                        });						
                        return this;
                    },
                    act2: function(domObject) {
                        // testing
                        console.log('act2');
                        return this;
                    }
                };
            }
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
                  return mergeTarget;
                }
            }
        },  
        selector: function(functionList, utilityList) {
            var runOnce = false;

            if ( !runOnce ) {
                //utilityList.extend(functionList, utilityList);
                sDomQuery.prototype = utilityList;
                utilityList.extend(sDomQuery.prototype, functionList);
                utilityList.extend(wrapper, utilityList);
                runOnce = true;
            }

            function sDomQuery(domSelector) {
                var foundObjects = null,
                    regHtml = /^$/,
                    regID = /^$/,
                    regClass = /^$/;

                // if html append
                // if instance return instance
                if ( domSelector ) {
                    foundObjects = document.querySelectorAll(domSelector);
                }

                this.length = foundObjects ? foundObjects.length : 0;

                if ( foundObjects ) {
                    for(var i = 0 ; i < foundObjects.length ; i++ ) {
                        this[i] = foundObjects[i];
                    } 
                } 

                return this;
            }      

            function wrapper(domSelector) {
                return new sDomQuery(domSelector);
            }          

            return wrapper;
        },
        init: function(moduleList) {
            var functionList = {},
                utilityList = {},
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

            importList = moduleList['utils']();
            for ( var _func in importList ) {
                if ( "undefined" === typeof utilityList[_func] ) {
                    utilityList[_func] = importList[_func];
                }
            }

            $ = moduleList['selector'].call(this, functionList, utilityList);

            return $;
        }
    }, 'init');
});