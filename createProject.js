
// Imports
var vscode = require('vscode');
var os = require('os');
var fs = require('fs');
var async = require('async');
var path = require('path');
var Q = require('q');
var common = require('./common');
var logger = require('./logger');

// Path definition
var extensionPath = __dirname;
var defaultOutputDir = os.homedir() + path.sep + '.vscode';

// Templates' info
var selectedTmpPath = extensionPath + '/templates/Basic/Tizen_Blank/project';
var selectedTmpName = 'TV Basic App';

// Module name
var moduleName = 'Create Project';

// Handle 'Create Web Project' commands
function handleCommand() {

	logger.info(moduleName, '==============================Creat Web Project start!');

    // Create Web project by templates
	// New an 'FileContoller' instance
	// Execute App generation by steps
	var File = new FileController();
	File.showAllTemplates()
		//.then(File.enableWasmSupport)// todo move previous
		.then(File.inputDirOfApp)
		.then(File.updateOutputPath)
		.then(File.generateApp)
		.catch(function (err) {

			// Show message when an error happen
			if (err) {
				logger.debug(moduleName, err);
			}
			var errMsg = 'Create Web Project failed!';
			common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.ERROR, errMsg);
			logger.error(moduleName, errMsg);
		});

}
exports.handleCommand = handleCommand;

// Define FileController propotype
// Execute App generation by functions flow
var FileController = (function () {

    // Constructor
    function FileController() {
    }

	// Show App templates list
	FileController.prototype.showAllTemplates = function () {

        logger.info(moduleName, "App's tempalte list was showed");
		var deferred = Q.defer();

        // Notify msg
		var selectTip = 'Please select a template:';
		var options = {
			placeHolder: selectTip,
			ignoreFocusOut: true
		};
        logger.info(moduleName, selectTip);

        // Templates
		var choices = [
			{ label: 'Empty App', description: 'Empty Template.' },
			{ label: 'TV Basic App', description: 'Samsung TV Basic Template.' },
			{ label: 'Empty_AngularJS App', description: 'Caph Empty Template for AngularJS.' },
			{ label: 'Empty_jQuery App', description: 'Caph Empty Template for jQuery.' },
			{ label: 'MasterDetail App', description: 'jQuery Mobile Empty Template for MasterDetail.' },
			{ label: 'MultiPage App', description: 'jQuery Mobile Empty Template for MultiPage.' },
			{ label: 'NavigationView App', description: 'jQuery Mobile Empty Template for NavigationView.' },
			{ label: 'SinglePage App', description: 'jQuery Mobile Empty Template for SinglePage.' }
		];

        // Show App templates list
		vscode.window.showQuickPick(choices, options).then(function (choice) {

            // Cancel without selecting
			if (!choice) {

				var waringMsg = 'Cancelled the "Create Web App" without selecting template!';
        		logger.warning(moduleName, waringMsg);
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, waringMsg);
				throw waringMsg;
			}
			// Select 'Empty App'
			if (choice.label === 'Empty App') {

				selectedTmpName = 'Empty App';
				selectedTmpPath = extensionPath + '/templates/Basic/Empty/project';
				deferred.resolve(selectedTmpPath);
        		logger.info(moduleName, 'The "Empty App" is selected');
				return;
			}
			// Select 'TV Basic App'
			else if (choice.label === 'TV Basic App') {

				selectedTmpName = 'TV Basic App';
				selectedTmpPath = extensionPath + '/templates/Basic/Tizen_Blank/project';
				deferred.resolve(selectedTmpPath);
        		logger.info(moduleName, 'The "TV Basic App" is selected');
				return;
			}
			// Select 'Empty_AngularJS App'
			else if (choice.label === 'Empty_AngularJS App') {

				selectedTmpName = 'Empty_AngularJS App';
				selectedTmpPath = extensionPath + '/templates/Caph/Empty_AngularJS/project';
				deferred.resolve(selectedTmpPath);
        		logger.info(moduleName, 'The "Empty_AngularJS App" is selected');
				return;
			}
			// Select 'Empty_jQuery App'
			else if (choice.label === 'Empty_jQuery App') {

				selectedTmpName = 'Empty_jQuery App';
				selectedTmpPath = extensionPath + '/templates/Caph/Empty_jQuery/project';
				deferred.resolve(selectedTmpPath);
        		logger.info(moduleName, 'The "Empty_jQuery App" is selected');
				return;
			}
			else if (choice.label === 'MasterDetail App') {

				selectedTmpName = 'MasterDetail App';
				selectedTmpPath = extensionPath + '/templates/jQuery Mobile/MasterDetail/project';
				deferred.resolve(selectedTmpPath);
        		logger.info(moduleName, 'The "MasterDetail App" is selected');
				return;
			}
			// Select 'MultiPage App'
			else if (choice.label === 'MultiPage App') {

				selectedTmpName = 'MultiPage App';
				selectedTmpPath = extensionPath + '/templates/jQuery Mobile/MultiPage/project';
				deferred.resolve(selectedTmpPath);
        		logger.info(moduleName, 'The "MultiPage App" is selected');
				return;
			}
			// Select 'NavigationView App'
			else if (choice.label === 'NavigationView App') {

				selectedTmpName = 'NavigationView App';
				selectedTmpPath = extensionPath + '/templates/jQuery Mobile/NavigationView/project';
				deferred.resolve(selectedTmpPath);
        		logger.info(moduleName, 'The "NavigationView App" is selected');
				return;
			}
			// Select 'SinglePage App'
			else if (choice.label === 'SinglePage App') {

				selectedTmpName = 'SinglePage App';
				selectedTmpPath = extensionPath + '/templates/jQuery Mobile/SinglePage/project';
				deferred.resolve(selectedTmpPath);
        		logger.info(moduleName, 'The "SinglePage App" is selected');
				return;
			}
			// Use default 'TV Basic App'
			else {
				deferred.resolve(selectedTmpPath);
        		logger.info(moduleName, 'The default "TV Basic App" is selected');
				return;
			}
		});

		return deferred.promise;
	};
	/*
	// enable WebAssembly Support
    FileController.prototype.enableWasmSupport = function () {

        var deferred = Q.defer();
        // 
        vscode.window.showInputBox({
			ignoreFocusOut: true,
            prompt: 'Please configure WASM support: yes for enable, no for disable',
            value: ''
        }).then(function (bEnable) {
            if (!bEnable) {
				var dirNotDef = 'Cancelled the "Create Web App" without configuring enableWasmSupport!';
				logger.warning(moduleName, dirNotDef);
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, dirNotDef);
				throw dirNotDef;
            }
			
    		logger.info(moduleName, 'enableWasmSupport : ' + bEnable);

			if (bEnable === 'no')
			{
				deferred.resolve(bEnable);
			}
			else
			{
				// todo save configuration
				// todo can invoke configProject.js method???
		        var samplePath = process.platform === 'win32'?'"C:\\emsdkPath"  ':'"/home/emsdkPath"  ';
		        // Tip and default value
		        vscode.window.showInputBox({
					ignoreFocusOut: true,
		            prompt: 'Please input your emscripten sdk path, as ' + samplePath,
		            value: ''
		        }).then(function (emsdkPath) {
		            if (!emsdkPath) {
						var dirNotDef = 'Cancelled the "Configure Project" without inputting emscripten sdk path!';
						logger.warning(moduleName, dirNotDef);
						common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, dirNotDef);
						throw dirNotDef;
		            }
		    		logger.info(moduleName, 'Use inputed emscripten sdk path: ' + emsdkPath);

					// todo check
					
			        var samplePath = process.platform === 'win32'?'"C:\\emsdkCachePath"  ':'"/home/emsdkCachePath"  ';
			        // Tip and default value
			        vscode.window.showInputBox({
						ignoreFocusOut: true,
			            prompt: 'Please input your emscripten sdk cache path, as ' + samplePath,
			            value: ''
			        }).then(function (emsdkCachePath) {
			            if (!emsdkCachePath) {
							var dirNotDef = 'Cancelled the "Create Project" without inputting emscripten sdk cache path!';
							logger.warning(moduleName, dirNotDef);
							common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, dirNotDef);
							throw dirNotDef;
			            }
			    		logger.info(moduleName, 'Use inputed emscripten sdk cache path: ' + emsdkCachePath);

						// todo check

						deferred.resolve(emsdkCachePath);
						return;
			        });
					
					return;
		        });
			}	
        });
 
        return deferred.promise;
    };
	*/
	// Get the App's path/name
    FileController.prototype.inputDirOfApp = function () {

        var deferred = Q.defer();

        var samplePath = process.platform === 'win32'?'"C:\\workdir\\appname"  ':'"/home/workdir/appname"  ';
        // Tip and default value
        vscode.window.showInputBox({
			ignoreFocusOut: true,
            prompt: 'Please input your workspace, as ' + samplePath,
            value: ''

		// Use input name
        }).then(function (appDir) {

            if (appDir) {
                deferred.resolve(appDir);
        		logger.info(moduleName, 'Use inputed App directory: ' + appDir);
            }
			else {
				var dirNotDef = 'Cancelled the "Create Web App" without inputting App name!';
				logger.warning(moduleName, dirNotDef);
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, dirNotDef);
				throw dirNotDef;
			}
        });

        return deferred.promise;
    };

	// Confirm the App's path/name
    FileController.prototype.updateOutputPath = function (appDir) {

        logger.debug(moduleName, 'Get appdir: ' + appDir);
		var deferred = Q.defer();

		var fullPath = '';

		// In not input directory case
		if (appDir.indexOf(path.sep) == -1) {

			var warning_path = 'The inputted directory is invalid!';
			logger.warning(moduleName, warning_path);
			common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, warning_path);
			throw warning_path;

		// In inputed directory case
		} else {

			// Format the directory URL
			var pathArray = appDir.split(path.sep);
			var i = 0;
			var flag = false;
			var containerDir = '';
			for (i = 0; i < pathArray.length - 1; i++) {

				if (pathArray[i] != '') {
					nullFlag = true;
				}
				containerDir = containerDir + pathArray[i] + path.sep;
			}
			logger.debug(moduleName, "The App's container dir is " + appDir);

            // Correct OS path case
			if (fs.existsSync(containerDir)) {

                // If the App name not defined, add 'webapp' automatically
				if (pathArray[pathArray.length - 1] == '')
				{
					var warning_name = 'The input workspace name is invalid!';
					logger.warning(moduleName, warning_name);
					common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, warning_name);
					throw warning_name;
				}
				deferred.resolve(appDir);
				logger.info(moduleName, 'The App will be put in defined path: ' + appDir);

            // Invalid OS path case
			} else {

				var warningMsg = 'Inputed directory is invalid!';
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, warningMsg);
				logger.warning(moduleName, warningMsg);
				throw warningMsg;
			}
		}

		return deferred.promise;
    };


	// Generate App by inputed parameters
    FileController.prototype.generateApp = function(destPath) {

		logger.info(moduleName, 'App generating...');
        var deferred = Q.defer();

		// Copy template
		common.copyDir(selectedTmpPath, destPath, function (err) {

			// Copy failed
			if (err) {

				logger.warning(moduleName, 'Generate App failed for filesystem permission!');
				logger.debug(moduleName, err);
				throw err;

            // Copy sucesfully
			} else {

				logger.info(moduleName, 'Folder generated');
				var randomID = common.GetRandomNum(10);
				var WIDGETDID = path.basename(destPath);
				var applicationId = randomID + '.' + WIDGETDID;
				logger.info(moduleName, 'The random App ID is: ' + applicationId);

				common.writeConfigXml(applicationId, randomID, destPath + path.sep + 'config.xml');
				// add the <name> attribute in the config.xml
				common.writeConfigXmlNameAttr(WIDGETDID, destPath + path.sep + 'config.xml');
				logger.info(moduleName, 'The config.xml was updated');

				updateWorkspace(destPath);
				//deferred.resolve(destPath);
			}

			logger.info(moduleName, '==============================Creat Web Project end!');
        });

        return deferred.promise;
    };

    return FileController;
})();
exports.FileController = FileController;

// Open the generated App
function updateWorkspace (destPath) {

	// Format the uri
	var uri = vscode.Uri.file(destPath);
	vscode.commands.executeCommand('vscode.openFolder', uri);
}

