/* clipboard_domain */

(function () {
    "use strict";
    
    var node_copy_paste = require('copy-paste');
    
    function cmdLoad() {}
    
    function cmdCopy(data) {
        
        node_copy_paste.copy(data);
    }

    function init(DomainManager) {
        if (!DomainManager.hasDomain("clipboard")) {
            DomainManager.registerDomain("clipboard", {major: 0, minor: 1});
        }
        
        DomainManager.registerCommand(
            "clipboard",    // domain name
            "copy",     // command name
            cmdCopy,    // command handler function
            false,          // this command is synchronous
            "copies to clipboard",
            [{name: "data", type: "string", description: "data to be copied"}],            
            []
        );
        
        DomainManager.registerCommand(
            "clipboard",       // domain name
            "load",    // command name
            cmdLoad,   // command handler function
            false,          // this command is synchronous
            "Loads clipboard",
            [],             // no parameters
            []
        );
    }
    
    exports.init = init;
    
}());
