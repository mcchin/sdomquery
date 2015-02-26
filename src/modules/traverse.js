(function () {
    "use strict";

    /* global window, global, self, navigator */

    var helper = require('./helper.js');

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

            return output;
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
                return output;
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

            return output;
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

            return output;
        };
        this.first = function() {
            if ( this.length ) {
                return [this[0]];
            }
            return;
        };
        this.last = function() {
            if ( this.length ) {
                return [this[this.length - 1]];
            }						
            return;
        };
        this.next = function(domSelector) {
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
        };
        this.prev = function(domSelector) {
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
        };
        this.get = function(idx) {
            if ( this.length && "undefined" !== this[idx] ) {
                return [this[idx]];
            }
            return;
        };
    }

    module.exports = new Traverse();
}());