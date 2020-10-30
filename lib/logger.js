
const vscode = require('vscode');
let outputConsole;

// Create/Show log channel of TizenTV
function createOutputPanel() {    
    if (!outputConsole || typeof (outputConsole) == 'undefined') {
        outputConsole = vscode.window.createOutputChannel('TizenTV');
        outputConsole.show();
    }
}
exports.createOutputPanel = createOutputPanel;

function showOutputPanel() {
    if(outputConsole && typeof (outputConsole) != 'undefined'){
        outputConsole.show();
    }
}
exports.showOutputPanel = showOutputPanel;

function log(moduleID, msg) {
    console.log(`${moduleID} :  ${msg}`);

    if(outputConsole) {
        outputConsole.appendLine(`${new Date().toLocaleTimeString()} ## ${moduleID} :  ${msg}`)
    }
}
exports.log = log;