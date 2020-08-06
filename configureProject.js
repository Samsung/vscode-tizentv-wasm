var configureProject = (function(){

	// Imports
	var vscode = require('vscode');
	var os = require('os');
	var fs = require('fs');
	var path = require('path');
	var common = require('./common');
	var logger = require('./logger');
	var p12ToPem = require('./p12ToPem');
	var parseString = require('xml2js').parseString;

	// Module name
	var moduleName = 'Configure Project';

	//
	var bWasmEnabled = true;// todo

	var configWasm = function(){
        logger.info(moduleName, 'You can enable wasm support and set wasm sdk path');

		// todo get wasm enabled value
		
		if (bWasmEnabled)// wasm is enabled // todo
		{
			disableOrCfgWasmToolchain();
		}
		else// wasm is not enabled
		{
			enableAndCfgWasmToolchain();
		}
		return;
    };

	var enableAndCfgWasmToolchain = function(){
		
    	logger.info(moduleName, 'Enable Wasm Support');
		
        // 
        vscode.window.showInputBox({
			ignoreFocusOut: true,
            prompt: 'Please configure WASM support: yes for enable, no for disable',
            value: ''
        }).then(function (bEnable) {
            if (!bEnable) {
				var dirNotDef = 'Cancelled the "Configure Project" without configuring enableWasmSupport!';
				logger.warning(moduleName, dirNotDef);
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, dirNotDef);
				throw dirNotDef;
            }
			// todo save configuration
    		logger.info(moduleName, 'enableWasmSupport : ' + bEnable);

			if (bEnable === 'yes')
			{
				cfgWasmToolchain();
				return;
			}
			else
			{
				// end scene 1
	        	logger.info(moduleName, '==============================Configure Project end!');
				return;
			}

        });
		return;
	};

	var disableOrCfgWasmToolchain = function(){
		var selectTip = 'You can disable wasm or config wasm toolchain.';
		var options = {
			placeHolder: selectTip,
			ignoreFocusOut: true
		};
        logger.info(moduleName, selectTip);
		
		var choices = [
			{ label: 'Disable Wasm Support', description: 'Disable Wasm Support' },
			{ label: 'Config Wasm Toolchain', description: 'Config Wasm Toolchain'}
		];

		vscode.window.showQuickPick(choices, options).then(function (choice) {
            // Cancel without selecting
			if (!choice) {
				var waringMsg = 'Cancelled the "Configure Project" without selecting operation!';
        		logger.warning(moduleName, waringMsg);
				common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, waringMsg);
				throw waringMsg;
			}
			// Select 'Disable Wasm Support'
			if (choice.label === 'Disable Wasm Support') {
				logger.info(moduleName, 'The "Disable Wasm Support" is selected');
				// todo save configuration
				
				// end scene 2
	        	logger.info(moduleName, '==============================Configure Project end!');
				return;
			}
			// Select 'Config Wasm Toolchain'
			else if (choice.label === 'Config Wasm Toolchain') {
				logger.info(moduleName, 'The "Config Wasm Toolchain" is selected');
				cfgWasmToolchain();
				return;
			}
		});
		
		return;
	};
	
	var cfgWasmToolchain = function(){
		
    	logger.info(moduleName, 'Config Wasm toolchain');
		
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
					var dirNotDef = 'Cancelled the "Configure Project" without inputting emscripten sdk cache path!';
					logger.warning(moduleName, dirNotDef);
					common.showMsgOnWindow(common.ENUM_WINMSG_LEVEL.WARNING, dirNotDef);
					throw dirNotDef;
	            }
	    		logger.info(moduleName, 'Use inputed emscripten sdk cache path: ' + emsdkCachePath);

				// todo check

				// end scene  3
		        logger.info(moduleName, '==============================Configure Project end!');
				return;
	        });
					
			return;
        });

		return;
	};

	return {
        handleCommand:function() {
            logger.info(moduleName, '==============================Configure Project start!');
			
			// todo init
			
			configWasm();
			
        }
	};
})();

module.exports = configureProject;

