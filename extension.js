const vscode = require('vscode');
const createProject = require('./lib/createProject');
const buildPackage = require('./lib/buildPackage');
const certificateManager = require('./lib/certificateManager');
const launchWits = require('./lib/witsLauncher');
const launchApplication = require('./lib/launchApplication');
const excludeFiles = require('./lib/excludeFiles');
const addWasmModule = require('./lib/addWasmModule');
const buildWasmModule = require('./lib/buildWasmModule');
const logger = require('./lib/logger');

function activate(context) {
    //logger
    logger.createOutputPanel();

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.createProject', async () => createProject())
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.buildPackage', () => buildPackage())
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.certificateManager', async () => certificateManager())
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.launchApplication', async () => launchApplication(false))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.debugApplication', async () => launchApplication(true))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.witsStart', async () => launchWits('start'))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.witsWatch', async () => launchWits('watch'))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.witsStop', async () => launchWits('stop'))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.excludeFiles',async (uri) => excludeFiles(uri))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.addWasmModule', async () => addWasmModule())
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.buildWasmModule', async () => buildWasmModule())
    );
}
exports.activate = activate;

// This method is called when your extension is deactivated
function deactivate() {
    // Do nothing
}
exports.deactivate = deactivate;