
// The module 'vscode' contains the VS Code extensibility API
// Imports
var vscode = require('vscode');
var logger = require('./logger');

// Import js object for commands implement
var buildPackage = require('./buildPackage');         // Tizen TV: Build Package
var launchSimulator = require('./launchSimulator');   // Tizen TV: Run on TV Simulator 
//var launchTarget = require('./launchTarget');         // Tizen TV: Run on TV

var createProject = require('./createProject');       // Create Web project

var common = require('./common');
//var launchEmulatorApp = require('./launchEmulatorApp');            // Tizen TV: Run on TV Emulator
var launchEmulatorManager = require('./launchEmulatorManager');    // Tizen TV: Run TV Emulator Manager
var certificateManager = require('./certificateManager');
var setExceptionPath = require('./setExceptionPath');
const launcher = require('./appLauncher');

var installSimulator = require('./installSimulator');     // Tizen TV: Run TV Emulator Manager
var openTerminal = require('./openTerminal');             // Tizen TV: SDB Command Prompt

var childProcess = require('child_process');

var configureProject = require('./configureProject');
var addWasmModule = require('./addWasmModule');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // chmod sdb_config.txt 
    var chmodCommand = 'chmod -R 777 ' + __dirname;
    try
    {
        childProcess.execSync(chmodCommand);
    } catch(ex)
    {
        // Do nothing when windows
    }

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, extension "tizentvwasm" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    // Initialize log module
    logger.createOutputPanel();
    openTerminal.setSdbConfig();

    // Tizen TV: Create Web Project
    var disposable = vscode.commands.registerCommand('extension.createProject', function () {
        
        openTerminal.hideTerminal();
        logger.showOutputPanel();
        createProject.handleCommand();

    });

    // Tizen TV: Build Package
    var disposable = vscode.commands.registerCommand('extension.buildPackage', function () {
        openTerminal.hideTerminal();
        logger.showOutputPanel();
        buildPackage.handleCommand();

    });

    // Tizen TV: Run on TV Simulator
    var disposable = vscode.commands.registerCommand('extension.runSimulatorApp', function () {
        openTerminal.hideTerminal();
        logger.showOutputPanel();
        launchSimulator.handleCommand();

    });

    // Tizen TV: Run on TV
    var disposable = vscode.commands.registerCommand('extension.runApp', function () {
        openTerminal.hideTerminal();
	    //common.setFuncMode(common.ENUM_COMMAND_MODE.COMMAND);
        logger.showOutputPanel();
        //launchTarget.handleCommand();
        launcher.launchAppOnTV(common.getWorkspacePath());
    });

    // Tizen TV: Run on TV Emulator
    var disposable = vscode.commands.registerCommand('extension.runEmulatorApp', function () {
        openTerminal.hideTerminal();
		//common.setFuncMode(common.ENUM_COMMAND_MODE.RUNNING_TIZEN2_4_EMULATOR);
        logger.showOutputPanel();
        //launchEmulatorApp.handleCommand();
        launcher.launchAppOnEmualtor(common.getWorkspacePath());
    });

    // Tizen TV: Run TV Emulator Manager
    var disposable = vscode.commands.registerCommand('extension.runEmulatorManager', function () {
        openTerminal.hideTerminal();
        logger.showOutputPanel();
        launchEmulatorManager.handleCommand();

    });

    // Tizen TV:Install WebSimulator
    var disposable = vscode.commands.registerCommand('extension.installSimulator', function () {
        openTerminal.hideTerminal();
        logger.showOutputPanel();
        installSimulator.handleCommand();

    });

    // Tizen TV: SDB Command Prompt
    var disposable = vscode.commands.registerCommand('extension.openTerminal', function () {

        openTerminal.handleCommand();

    });
	
	// Tizen TV: Web Inspector On TV
    var disposable = vscode.commands.registerCommand('extension.debugApp', function () {
        openTerminal.hideTerminal();
	    //common.setFuncMode(common.ENUM_COMMAND_MODE.WEB_INSPECTOR_ON_TV);
        logger.showOutputPanel();
        //launchTarget.handleCommand();
        launcher.debugAppOnTV(common.getWorkspacePath());
    });
	
	// Tizen TV: Web Inspector On Emulator
    var disposable = vscode.commands.registerCommand('extension.debugEmulatorApp', function () {
        openTerminal.hideTerminal();
	    //common.setFuncMode(common.ENUM_COMMAND_MODE.WEB_INSPECTOR_ON_EMULATOR);
        logger.showOutputPanel();
        //launchEmulatorApp.handleCommand();
        launcher.debugAppOnEmualtor(common.getWorkspacePath());
    });

    // Tizen TV: Certificate Manager
    var disposable = vscode.commands.registerCommand('extension.runCertificateManager', function () {
        openTerminal.hideTerminal();
        logger.showOutputPanel();
        certificateManager.handleCommand();

    });

    // Tizen TV: Set Exception Path
    var disposable = vscode.commands.registerCommand('extension.runsetExceptionPath', function () {
        openTerminal.hideTerminal();
        logger.showOutputPanel();
        setExceptionPath.handleCommand();

    });
	
    // Tizen TV: Configure Project
    var disposable = vscode.commands.registerCommand('extension.configureProject', function () {
        openTerminal.hideTerminal();
        logger.showOutputPanel();
        configureProject.handleCommand();

    });
    
    // Tizen TV: Add Wasm Module
    var disposable = vscode.commands.registerCommand('extension.addWasmModule', function () {
        openTerminal.hideTerminal();
        logger.showOutputPanel();
        addWasmModule.handleCommand();

    });


    context.subscriptions.push(disposable);
}
exports.activate = activate;

// This method is called when your extension is deactivated
function deactivate() {
    // Do nothing
}
exports.deactivate = deactivate;
