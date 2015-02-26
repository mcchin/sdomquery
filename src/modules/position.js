(function () {
    "use strict";

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
            var output = [],
                dim = {
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

                        output.push(this[i]);
                    }
                    
                    return output;
                } else {
                    return helper.findOffset(this[0]);
                }
            }

            return;
        };
        this.position = function(coords) {
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
        };
        this.scrollTop = function(top) {
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
        };
        this.scrollLeft = function(left) {
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
        };
    }

    module.exports = new Position();
}());	