(function () {
    "use strict";

    /* global window, global, self, navigator */

    var helper = require('./helper.js');

    var utils = new function() {
        this.each = function () {
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
        this.extend = function (mergeTarget) {
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
        };
        this.append = function(html) {
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
        };
        this.prepend = function(html) {
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
            return "object" === typeof obj && "Object" === obj.constructor.name;
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
    };

    module.exports = utils;
}());