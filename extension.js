const vscode = require('vscode');
const path = require('path');
const { checkTizenStudioDataDirectory } = require('./lib/common');
const createProject = require('./lib/createProject');
const buildPackage = require('./lib/buildPackage');
const certificateManager = require('./lib/certificateManager');
const launchWits = require('./lib/witsLauncher');
const launchApplication = require('./lib/launchApplication');
const excludeFiles = require('./lib/excludeFiles');
const addWasmModule = require('./lib/addWasmModule');
const buildWasmModule = require('./lib/buildWasmModule');
const sdburiInstaller = require('./lib/sdburi/sdbUriInstaller');
const {
  getWitsOutputCommand,
  getTizenTvOutputCommand,
} = require('./lib/outputCommander');
const apiMapping = require('./lib/apiMapping');

function activate(context) {

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.createProject', async () => createProject()),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.buildPackage', () => buildPackage()),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.certificateManager', async () => certificateManager()),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.launchApplication', async (file) => {
      if (file && file.fsPath && path.extname(file.fsPath) === '.wgt') {
        launchApplication(false, file.fsPath);
      } else {
        launchApplication(false);
      }
    }),
        );
    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.debugApplication', async (file) => {
      if (file && file.fsPath && path.extname(file.fsPath) === '.wgt') {
        launchApplication(true, file.fsPath);
      } else {
        launchApplication(true);
      }
    }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.witsStart', async () => launchWits('start')),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.witsWatch', async () => launchWits('watch')),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.witsStop', async () => launchWits('stop')),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.excludeFiles',async (uri) => excludeFiles(uri)),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.addWasmModule', async () => addWasmModule()),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentvwasm.buildWasmModule', async () => buildWasmModule()),
    );
    context.subscriptions.push(
    vscode.commands.registerCommand('tizentvwasm.witsShowOutput', async () => getWitsOutputCommand().show()),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('tizentvwasm.tizentvShowOutput', async () => getTizenTvOutputCommand().show()),
  );

    //mouse hover prompt
    context.subscriptions.push(apiMapping.ApiMapping());
    sdburiInstaller.installSdburi();
    checkTizenStudioDataDirectory();
}
exports.activate = activate;

// This method is called when your extension is deactivated
function deactivate() {
    // Do nothing
}
exports.deactivate = deactivate;
