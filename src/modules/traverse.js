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