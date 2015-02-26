(function () {
    "use strict";

    /* global window, global, self */

    var glob = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" && self,
        runOnce = false;

    var utils = require('./modules/utils.js'),
        css = require('./modules/css.js'),
        position = require('./modules/position.js'),
        traverse = require('./modules/traverse.js'),
        manipulation = require('./modules/manipulation.js'),
        events = require('./modules/events.js');
    console.log(utils);
    if ( !runOnce ) {
        // Attach uniq ID - This is to keep reference to bind / unbind events
        wrapper.uuid = 'DomQuery' + String(Math.random()).substring(2) + Date.now();
        wrapper.guid = 0;

        // Attach utils and other functions to the core
        utils.extend(wrapper, utils);
        utils.extend(DomQueryWrapper.prototype, utils, css, position, traverse, manipulation, events);

        runOnce = true;
    }

    function DomQueryWrapper(domSelector) {
        var foundObjects = [];
            //regExpHtml = /^$/,
            //regExpID = /^$/,
            //regExpClass = /^$/;

        // Depending on regExp
        // if html append and pass back
        // if instance return instance
        if ( "string" === typeof domSelector ) {
            foundObjects = document.querySelectorAll(domSelector);
        } else if ( utils.isArray(domSelector) ) {
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

        return this;
    }      
    
    function wrapper(domSelector) {
        return new DomQueryWrapper(domSelector);
    }          
    
    glob.DomQuery = glob.$ = wrapper;
})();