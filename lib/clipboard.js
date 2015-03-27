/* clipboard.js */

define(function (require, exports, module) {
    'use strict';
    
    var AppInit         = brackets.getModule('utils/AppInit'),
        ExtensionUtils  = brackets.getModule('utils/ExtensionUtils'),
        NodeConnection  = brackets.getModule('utils/NodeConnection'),
    
        _clipboard = null,
        _doneFn = function() {};
    
    function chain() {
        var functions = Array.prototype.slice.call(arguments, 0);
        if (functions.length > 0) {
            var firstFunction = functions.shift(),
                firstPromise = firstFunction.call();
            firstPromise.done(function () {
                chain.apply(null, functions);
            });
        }
    }
    
    AppInit.appReady(function() {
        var nodeConnection = new NodeConnection();
        
        function connect() {
            var connectionPromise = nodeConnection.connect(true);
            connectionPromise.fail(function (err) {
                console.error('[brackets-clipboard-node] failed to connect to node.', err);
            });
            return connectionPromise;
        }
        
        function loadClipboardDomain() {
            var path = ExtensionUtils.getModulePath(module, '../node/clipboard_domain'),
                loadPromise = nodeConnection.loadDomains([path], true);
            loadPromise.fail(function (err) {
                console.error('[brackets-clipboard-node] failed to load domain.', err);
            });
            return loadPromise;
        }
        
        function loadClipboard() {
            var loadPromise = nodeConnection.domains.clipboard.load();
            loadPromise.fail(function (err) {
                console.error('[brackets-clipboard-node] failed to run load.'. err);
            });
            loadPromise.done(function () {
                _clipboard = nodeConnection.domains.clipboard;
                _doneFn();
            });
            return loadPromise;
        }
        
        chain(connect, loadClipboardDomain, loadClipboard);
    });
    
    function done(fn) {
        if (typeof fn === 'function') {
            if (_clipboard) {
                fn();
            } else {
                _doneFn = fn;
            }
        }
    }
    
    function copy(data) {
        if (_clipboard && _clipboard.copy) {
            _clipboard.copy(data);
        }
    }
    
    exports.done = done;
    exports.copy = copy;
});