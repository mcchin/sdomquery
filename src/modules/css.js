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