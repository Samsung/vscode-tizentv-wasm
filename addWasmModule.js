
// Imports
var vscode = require('vscode');
var os = require('os');
var fs = require('fs');
var async = require('async');
var path = require('path');
var Q = require('q');
var common = require('./common');
var logger = require('./logger');

// Module name
var moduleName = 'Add Wasm Module';


var selectedLanName = 'C++ Language';
var selectedModuleName = 'Sample';
var selectedSampleName = 'Hello World';
var wasmModuleName;

// Empty Module configuration
var bCanvasEnabled;
var bTextareaEnabled;
var canvasWidth = 100;
var canvasHeight = 100;
var textAreaCol = 40;
var textAreaRows = 25;

// wasm module template path
var extensionPath = __dirname;
var srcScriptsPath = extensionPath + '/templates/Wasm/scripts';//wasm_helpers.js
var srcPath = extensionPath + '/templates/Wasm/templates';// todo
var wsPath = common.getWorkspacePath();


// Handle 'Add Wasm Module' command
function handleCommand() {
    logger.info(moduleName, '==============================Add Wasm Module start!');
	
	// New an 'FileContoller' instance
	var File = new FileController();
	File.checkWasmEnabled()
		.then(File.selectLanguage)
		.then(File.selectSampleOrEmpty)
		.then(File.cfgInfoForCPPSample)
		.then(File.cfgInfoForCSample)
		.then(File.cfgInfoForEmptyCanvas)
		.then(File.cfgInfoForEmptyTextarea)
		.then(File.setWasmModuleName)
		.then(File.addModule)
		.catch(function (err) {
			// Show message when an error happen
			if (err) {
				logger.debug(moduleName, err);
			}
			var errMsg = 'Add Wasm Module failed!';
			common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.ERROR, errMsg);
			logger.error(moduleName, errMsg);
		});

}
exports.handleCommand = handleCommand;

// Define FileController propotype
var FileController = (function () {

    // Constructor
    function FileController() {
    }

	// 1.0 
	FileController.prototype.checkWasmEnabled = function () {
        logger.info(moduleName, 'Check Wasm Enabled');
		var deferred = Q.defer();
		// init
		bCanvasEnabled = false;
		bTextareaEnabled = false;
		canvasWidth = 100;
		canvasHeight = 100;
		textAreaCol = 40;
		textAreaRows = 25;

		srcPath = extensionPath + '/templates/Wasm/templates';
		
		deferred.resolve();
		return deferred.promise;
	};
	
	// 2.0 
	FileController.prototype.selectLanguage = function () {
		var deferred = Q.defer();

        // Notify msg
		var selectTip = 'Please select a Language:';
		var options = {
			placeHolder: selectTip,
			ignoreFocusOut: true
		};
        logger.info(moduleName, selectTip);

	    // languages
		var choices = [
			{ label: 'C++ Language', description: 'C++ language.' },
			{ label: 'C Language', description: 'C language.' }
		];

        // Show languages list
		vscode.window.showQuickPick(choices, options)
			.then(function (choice) {

            // Cancel without selecting
			if (!choice) {
				var waringMsg = 'Cancelled the "Add Wasm Module" without selecting language!';
        		logger.warning(moduleName, waringMsg);
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, waringMsg);
				throw waringMsg;
			}
			
			// Select 'C Language'
			if (choice.label === 'C Language') {
				selectedLanName = 'C Language';
				deferred.resolve(selectedLanName);
	    		logger.info(moduleName, 'The "C Language" is selected');
				return;
			}
			// Select 'C++ Language'
			// (choice.label === 'C++ Language') or default
			else{
				selectedLanName = 'C++ Language';
				deferred.resolve(selectedLanName);
	    		logger.info(moduleName, 'The "C++ Language" is selected');
				return;
			}
			
		});

		return deferred.promise;
	};

	// 3.0 
	FileController.prototype.selectSampleOrEmpty = function () {
		var deferred = Q.defer();

        // Notify msg
		var selectTip = 'Please select Sample Or Empty :';
		var options = {
			placeHolder: selectTip,
			ignoreFocusOut: true
		};
        logger.info(moduleName, selectTip);

        // sample Or Empty
		var choices = [
			{ label: 'Sample', description: 'A simple example that writes to standard output and calls a function exported from C++ code.' },
			{ label: 'Empty Module', description: 'An empty template that may be used to create a new WebAssembly module.' }
		];

        // Show Sample Or Empty Modules list
		vscode.window.showQuickPick(choices, options)
			.then(function (choice) {

            // Cancel without selecting
			if (!choice) {
				var waringMsg = 'Cancelled the "Add Wasm Module" without selecting item!';
        		logger.warning(moduleName, waringMsg);
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, waringMsg);
				throw waringMsg;
			}
			
			// Select 'Empty Module'
			if (choice.label === 'Empty Module') {
				selectedModuleName = 'Empty Module';
				deferred.resolve(selectedModuleName);
        		logger.info(moduleName, 'The "Empty Module" is selected');
				return;
			}
			// Select 'Sample'
			// (choice.label === 'Sample')  or default
			else {
				selectedModuleName = 'Sample';
				deferred.resolve(selectedModuleName);
        		logger.info(moduleName, 'The "Sample" is selected');
				return;
			}
			
		});

		return deferred.promise;		
	};

	// 4.1
	FileController.prototype.cfgInfoForCPPSample = function () {
			
		var deferred = Q.defer();

		// Sample && C++ Language
		if ( (selectedModuleName === 'Sample')
			&& (selectedLanName === "C++ Language") )
		{
			logger.info(moduleName, 'Configure CPP Sample Info');
		    // Notify msg
			var selectTip = 'Please select Sample:';
			var options = {
				placeHolder: selectTip,
				ignoreFocusOut: true
			};
		    logger.info(moduleName, selectTip);

			// samples list
			var choices = [
				{ label: 'Hello World', description: 'A simple sample named "Hello World".' }
			];

		    // Show Samples list
			vscode.window.showQuickPick(choices, options)
				.then(function (choice) {
		        // Cancel without selecting
				if (!choice) {
					var waringMsg = 'Cancelled the "Add Wasm Module" without selecting sample!';
		    		logger.warning(moduleName, waringMsg);
					common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, waringMsg);
					throw waringMsg;
				}
				
				// Select 'Hello World'
				if (choice.label === 'Hello World') {
					selectedSampleName = 'Hello World';
					
					bCanvasEnabled = true;
					bTextareaEnabled = true;
					canvasWidth = 400;
					canvasHeight = 200;
					textAreaCol = 80;
					textAreaRows = 24;

					srcPath = srcPath + '/HelloWorld';

					deferred.resolve(selectedSampleName);
		    		logger.info(moduleName, 'The "Hello World" is selected');
					return;
				}
			});
		}
		else
		{
			deferred.resolve(selectedSampleName);
		}
	
		return deferred.promise;
	};

	// 4.2
	FileController.prototype.cfgInfoForCSample = function () {
		var deferred = Q.defer();

		// Sample && C Language
		if ( (selectedModuleName === 'Sample')
			&& (selectedLanName === "C Language") )
		{
			logger.info(moduleName, 'Configure C Sample Info After Select');
		    
		    // Notify msg
			var selectTip = 'Please select Sample:';
			var options = {
				placeHolder: selectTip,
				ignoreFocusOut: true
			};
		    logger.info(moduleName, selectTip);

			// samples list
			var choices = [
				{ label: 'Hello Triangle', description: 'A simple sample named "Hello Triangle".' }
			];

		    // Show Samples list
			vscode.window.showQuickPick(choices, options)
				.then(function (choice) {
		        // Cancel without selecting
				if (!choice) {
					var waringMsg = 'Cancelled the "Add Wasm Module" without selecting sample!';
		    		logger.warning(moduleName, waringMsg);
					common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, waringMsg);
					throw waringMsg;
				}
				
				// Select 'Hello Triangle'
				if (choice.label === 'Hello Triangle') {
					selectedSampleName = 'Hello Triangle';
					
					bCanvasEnabled = true;
					bTextareaEnabled = false;
					canvasWidth = 320;
					canvasHeight = 240;
					
					srcPath = srcPath + '/HelloTriangle';
					
					deferred.resolve(selectedSampleName);
		    		logger.info(moduleName, 'The "Hello Triangle" is selected');
					return;
				}
				
			});
		}
		else
		{
			deferred.resolve(selectedModuleName);
		}
	
		return deferred.promise;
	};
	
	// 4.3
	FileController.prototype.cfgInfoForEmptyCanvas = function () {	
		var deferred = Q.defer();

		// Empty Module - canvas
		if (selectedModuleName === 'Empty Module')
		{
			// set srcPath for Empty Module
			if (selectedLanName === "C++ Language")
			{
				logger.info(moduleName, 'Configure CPP Empty Module Info After Select');
				srcPath = srcPath + '/Empty_CPP';
			}
			else
			{
				logger.info(moduleName, 'Configure C Empty Module Info After Select');
				srcPath = srcPath + '/Empty_C';
			}
			
		    // Notify msg
			var selectTip = 'Do you want to set canvas?';
			var options = {
				placeHolder: selectTip,
				ignoreFocusOut: true
			};
		    logger.info(moduleName, selectTip);

			var choices = [
				{ label: 'Yes' },
				{ label: 'No'}
			];

			vscode.window.showQuickPick(choices, options)
				.then(function (choice) {
		        // Cancel without selecting
				if (!choice) {
					var waringMsg = 'Cancelled the "Add Wasm Module" without selecting Yes or No to confirm!';
		    		logger.warning(moduleName, waringMsg);
					common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, waringMsg);
					throw waringMsg;
				}
				
				// Select 'No'
				if (choice.label === 'No') {
		    		logger.info(moduleName, 'The "No" is selected');
					bCanvasEnabled = false;
					deferred.resolve(bCanvasEnabled);
				}
				// Select 'Yes'
				else{ //if (choice.label === 'Yes') 
		    		logger.info(moduleName, 'The "Yes" is selected');
						
					bCanvasEnabled = true;
			        // set canvas width
			        vscode.window.showInputBox({
						ignoreFocusOut: true,
			            prompt: 'Please configure Canvas width: default value is 100px',
			            value: ''
			        })
			        .then(function (width) {
			            if (!width) {
							var notCfg = 'Cancelled the "Create Web App" without configuring canvas width!';
							logger.warning(moduleName, notCfg);
							common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, notCfg);
							throw notCfg;
			            }
		        		logger.info(moduleName, 'set canvas width = ' + width);
						canvasWidth = width;

		        		// set canvas height
				        vscode.window.showInputBox({
							ignoreFocusOut: true,
				            prompt: 'Please configure Canvas Height: default value is 100px',
				            value: ''
				        }).then(function (height) {
				            if (!height) {
								var notCfg = 'Cancelled the "Create Web App" without configuring canvas height!';
								logger.warning(moduleName, notCfg);
								common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, notCfg);
								throw notCfg;
				            }
			        		logger.info(moduleName, 'set canvas height = ' + height);
							canvasHeight = height;
							
							deferred.resolve(bCanvasEnabled);
							return;
				        });
						return;
			        });
				}
				return;
			});		
		}
		else
		{
			deferred.resolve(selectedModuleName);
		}
	
		return deferred.promise;
	};
	
	// 4.4
	FileController.prototype.cfgInfoForEmptyTextarea = function () {
		var deferred = Q.defer();

		// Empty Module - textarea
		if (selectedModuleName === 'Empty Module')
		{
		    // Notify msg
			var selectTip = 'Do you want to set textarea?';
			var options = {
				placeHolder: selectTip,
				ignoreFocusOut: true
			};
		    logger.info(moduleName, selectTip);

			var choices = [
				{ label: 'Yes' },
				{ label: 'No'}
			];

			vscode.window.showQuickPick(choices, options)
				.then(function (choice) {
		        // Cancel without selecting
				if (!choice) {
					var waringMsg = 'Cancelled the "Add Wasm Module" without selecting Yes or No to confirm!';
		    		logger.warning(moduleName, waringMsg);
					common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, waringMsg);
					throw waringMsg;
				}
				
				// Select 'No'
				if (choice.label === 'No') {
		    		logger.info(moduleName, 'The "No" is selected');
					bTextareaEnabled = false;
					deferred.resolve(bTextareaEnabled);
				}
				// Select 'Yes'
				else{ //if (choice.label === 'Yes') 
		    		logger.info(moduleName, 'The "Yes" is selected');						
					bTextareaEnabled = true;
					
			        // set textarea columns
			        vscode.window.showInputBox({
						ignoreFocusOut: true,
			            prompt: 'Please configure textarea columns: default value is 40',
			            value: ''
			        })
			        .then(function (columns) {
			        	if (!columns) {
							var notCfg = 'Cancelled the "Create Web App" without configuring textarea columns!';
							logger.warning(moduleName, notCfg);
							common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, notCfg);
							throw notCfg;
			        	}
						
		        		logger.info(moduleName, 'set textarea columns = ' + columns);
						textAreaCol = columns;

		        		// set textarea rows
				        vscode.window.showInputBox({
							ignoreFocusOut: true,
				            prompt: 'Please configure textarea rows: default value is 25',
				            value: ''
				        }).then(function (rows) {
				            if (!rows) {
								var notCfg = 'Cancelled the "Create Web App" without configuring textarea rows!';
								logger.warning(moduleName, notCfg);
								common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, notCfg);
								throw notCfg;
				            }
							
			        		logger.info(moduleName, 'set textarea rows = ' + rows);
							textAreaRows = rows;
							
							deferred.resolve(bTextareaEnabled);
							
							return;
				        });
			            
						return;
			        });
						
				}

				return;				
			});	
		}
		else
		{
			deferred.resolve(selectedModuleName);
		}
	
		return deferred.promise;
	};

	// 5.0 
	FileController.prototype.setWasmModuleName = function () {		
        logger.info(moduleName, 'Please set Wasm Module Name');
        var deferred = Q.defer();
		
        vscode.window.showInputBox({
			ignoreFocusOut: true,
            prompt: 'Please set WASM module name: ',
            value: ''
        }).then(function (name) {
            if (!name) {
				var dirNotDef = 'Cancelled the "Add Wasm Module" without setting wasm module name!';
				logger.warning(moduleName, dirNotDef);
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, dirNotDef);
				throw dirNotDef;
            }
			// todo duplicated name checking
			wasmModuleName = name;
            deferred.resolve(name);
    		logger.info(moduleName, 'WASM module name : ' + name);
        });
 
        return deferred.promise;
	};

	// 6.0 
	FileController.prototype.addModule = function () {
        logger.info(moduleName, 'Adding Module...');
		var deferred = Q.defer();

		// 1.0 handle .html file
		var htmlPath = wsPath + '/index.html';// todo
		logger.info(moduleName, 'htmlPath = ' + htmlPath);
		common.writeHtmlContent(bCanvasEnabled, bTextareaEnabled, canvasWidth, canvasHeight, textAreaRows, textAreaCol, wasmModuleName, htmlPath);

		// 2.0 handle .css file
		var cssPath = wsPath + '/css/style.css';
		logger.info(moduleName, 'cssPath = ' + cssPath);
		common.writeCssContent(bCanvasEnabled, bTextareaEnabled, wasmModuleName, cssPath);

		// 3.0 copy scripts wasm_tools.js : templates/Wasm/scripts
		var destPath = wsPath + '/wasm_modules/scripts';
		if (!fs.existsSync(destPath+'/wasm_tools.js')) {
			// add wasm_tools.js to index.html head scripts
			common.writeHtmlScript(htmlPath);
			
			common.copyDir(srcScriptsPath, destPath, function (err) {
				// Copy failed
				if (err) {
					logger.warning(moduleName, 'Add wasm module failed for filesystem permission!');
					logger.debug(moduleName, err);
					throw err;
				}
				// Copy sucesfully
				// logger.info(moduleName, 'Scripts generated');
			});
		}

		// 4.0 Copy template, including inc/src directory
		destPath = wsPath + '/wasm_modules/' + wasmModuleName;
		common.copyDir(srcPath, destPath, function (err) {
			// Copy failed
			if (err) {
				logger.warning(moduleName, 'Add wasm module failed for filesystem permission!');
				logger.debug(moduleName, err);
				throw err;
			}
			// Copy sucesfully
			//logger.info(moduleName, 'Folder generated');

			//deferred.resolve();// todo
		});
		deferred.resolve();
		
		logger.info(moduleName, '==============================Add Wasm Module end!');
		
		return deferred.promise;
	};
	
    return FileController;
})();

exports.FileController = FileController;


