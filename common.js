
// Imports
var vscode = require('vscode');
var os = require('os');
var fs = require('fs');
var path = require('path');
var innerProcess = require('child_process');
var SDB_NAME = (process.platform == 'win32') ? 'sdb.exe' : 'sdb';

var extensionPath = __dirname;

var async = require('async');
var Q = require('q');
var logger = require('./logger');

var extensionRootPath = path.normalize(__dirname + path.sep + '..');
exports.extensionRootPath = extensionRootPath;

var extensionCertPath = __dirname + path.sep + 'resource' + path.sep + 'certificate-generator' + path.sep + 'data' + path.sep + 'tools' + path.sep + 'certificate-generator' + path.sep + 'certificates';
exports.extensionCertPath = extensionCertPath;

// Random ID generator
var PSEUDO_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z'];


/**
   Functions perform mode:
   COMMAND: Using when <Debug on ...> etc. commands
   DEBUGGER: Using when other commands except debug
**/
var ENUM_FUNCTION_MODE = {
    'COMMAND': 0,                       // Run on TV 2.4
    'DEBUGGER': 1,                      // Debug on TV 3.0
	'WEB_INSPECTOR_ON_TV': 2,             // Web Inspector Debug on TV
	'WEB_INSPECTOR_ON_EMULATOR': 3,    // Web Inspector Debug on Emulator
	'RUNNING_TIZEN2_4_EMULATOR': 4,      // Run on Emulator 2.4
    'DEBUGGER_TIZEN3_0_EMULATOR': 5    // Debug on Emulator 3.0
};
exports.ENUM_COMMAND_MODE = ENUM_FUNCTION_MODE;
var functionMode = ENUM_FUNCTION_MODE.COMMAND;


/**
   Window message level:
   ERROR: Show error message on window
   INFO: Show information message on window
**/
var ENUM_WINMSG_LEVEL = {
    'ERROR': 0,
    'WARNING': 1,
    'INFO': 2
};
exports.ENUM_WINMSG_LEVEL = ENUM_WINMSG_LEVEL;


/**
   Extension states:
   STOPPED: The State bfore SDB etc. tools started
   INITIALIZED: The State when tools running
   RUNNING: <not used>
**/
var ENUM_EXTENSION_STATE = {
    'STOPPED': 0,
    'INITIALIZED': 1,
    'RUNNING': 2
};
exports.ENUM_EXTENSION_STATE = ENUM_EXTENSION_STATE;
var extention_state = ENUM_EXTENSION_STATE.STOPPED;

var moduleName = 'Common';

// Alert an information message 
function showMsgOnWindow(msgLevel, msg) {

    if (functionMode != ENUM_FUNCTION_MODE.DEBUGGER && functionMode != ENUM_FUNCTION_MODE.DEBUGGER_TIZEN3_0_EMULATOR) {
        //vscode = require('vscode');

        if (msgLevel == ENUM_WINMSG_LEVEL.INFO) {
            vscode.window.showInformationMessage(msg);
        }
        else if (msgLevel == ENUM_WINMSG_LEVEL.WARNING) {
            vscode.window.showWarningMessage(msg);
        }
        else if (msgLevel == ENUM_WINMSG_LEVEL.ERROR) {
            vscode.window.showErrorMessage(msg);
        }
        else {
            // Do nothing
        }
    }
    else {
        // TODO: logic when debug
    }
}
exports.showMsgOnWindow = showMsgOnWindow;

// Get the directory path of workspace
function getWorkspacePath() {

    if (functionMode != ENUM_FUNCTION_MODE.DEBUGGER && functionMode != ENUM_FUNCTION_MODE.DEBUGGER_TIZEN3_0_EMULATOR) {
        //vscode = require('vscode');
        return vscode.workspace.rootPath;
    }
    else {
        // TODO: logic when debug
    }
}
exports.getWorkspacePath = getWorkspacePath;

// Get tizen-studio sdb path 
function getTizenStudioSdbPath(){
    if (functionMode != ENUM_FUNCTION_MODE.DEBUGGER && functionMode != ENUM_FUNCTION_MODE.DEBUGGER_TIZEN3_0_EMULATOR) {
        //vscode = require('vscode');
        var sdbPath = vscode.workspace.getConfiguration('tizentv')['tizenStudioLocation'] + '/tools/' + SDB_NAME;
        return sdbPath;
    }else {
        // TODO: logic when debug
    }

}
exports.getTizenStudioSdbPath = getTizenStudioSdbPath;


// Get target device's IP and port
function getTargetIp() {

    if (functionMode != ENUM_FUNCTION_MODE.DEBUGGER && functionMode != ENUM_FUNCTION_MODE.DEBUGGER_TIZEN3_0_EMULATOR) {
        //vscode = require('vscode');
        return vscode.workspace.getConfiguration('tizentv')['targetDeviceAddress'];
    }
    else {
        // TODO: logic when debug
    }
}
exports.getTargetIp = getTargetIp;

// Generate random Web App's package ID
function GetRandomNum(n) {

    var res = '';

    for (var i = 0; i < n; i++) {
        var id = Math.round(Math.random() * 61);
        res += PSEUDO_CHARS[id];
    }
    return res;
}
exports.GetRandomNum = GetRandomNum;

// Insert ID into 'config.xml' of App
function writeConfigXml(applicationid, packageid, path) {

    var data = fs.readFileSync(path, 'utf-8');
    var updatedData = '';

    if (data) {
        var idPos = data.indexOf('application id=');
        var packagePos = data.indexOf('package=');
        var substring1 = data.substring(0, idPos + 16);
        var substring2 = data.substring(packagePos - 2, packagePos + 9);
        var substring3 = data.substring(packagePos + 9, data.length);
        updatedData = substring1 + applicationid + substring2 + packageid + substring3;
    }
    fs.writeFileSync(path, updatedData, 'utf-8');

}
exports.writeConfigXml = writeConfigXml;

//Read web app id from config.xml file
function getConfAppID(xmlfile) {

    var applicationID = '';

    if (fs.existsSync(xmlfile)) {

        var data = fs.readFileSync(xmlfile, 'utf-8');
        //console.log(data);   
        if (data) {
            var id_pos = data.indexOf('application id');
            var package_pos = data.indexOf('package');
            applicationID = data.substring(id_pos + 16, package_pos - 2);
            console.log('applicationID=' + applicationID);
        }

    } else {

        // vscode.window.showInformationMessage('No config.xml file in the current app');    
    }

    return applicationID;
}
exports.getConfAppID = getConfAppID;

// Get package ID by remove postfix of App ID
function getPackageID(appId) {

    var packageID = '';
    var packageIDArray = appId.split('.');
    var packageID = '';

    if (packageIDArray) {
        packageID = packageIDArray[0];
    }

    return packageID;
}
exports.getPackageID = getPackageID;

// Get the Tizen version of target device
function getTargetVersion(command) {

    var targetversion = '';

    try {

        var data = innerProcess.execSync(command);
        //console.log('cat result:' + data);
        if (data.indexOf('platform_version:2.4') >= 0) {
            targetversion = '2.4';
        }else if(data.indexOf('platform_version:3.0') >= 0) {
            targetversion = '3.0';
        }else{
            targetversion = '3.0';
        }
    } catch (ex) {     
        showMsgOnWindow(ENUM_WINMSG_LEVEL.ERROR, 'Get target version Error occured , Please check');
        console.log('-------Error:---------' + ex);
        throw ex;
    }

    return targetversion;
}
exports.getTargetVersion = getTargetVersion;

// Set functions mode, Command or Debugger
function setFuncMode(mode) {

    functionMode = mode;
}
exports.setFuncMode = setFuncMode;

// Get functions mode, Command or Debugger
function getFuncMode() {

    return functionMode;
}
exports.getFuncMode = getFuncMode;

// Set the Running state of Extension
function setExtensionState(flag) {

    extention_state = flag;
}
exports.setExtensionState = setExtensionState;

// Get the running state of Extension
function getExtensionState() {

    return extention_state;
}
exports.getExtensionState = getExtensionState;

// Sleep a time in milli seconds
function sleepMs(milliSeconds) {

    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);

}
exports.sleepMs = sleepMs;

//Read web app id from config.xml file
function getConfStartHtml(xmlfile) {

    var configuredStartHtml = '';

    if (fs.existsSync(xmlfile)) {

        var data = fs.readFileSync(xmlfile, 'utf-8');
        //console.log(data);   
        if (data) {
            var pro_pos = data.indexOf('content src');
            var start_pos = data.indexOf('\"', pro_pos);
            if (start_pos >= 0)
            {
                var end_pos = data.indexOf('\"', start_pos + 1);
                if (end_pos > 0)
                {
                    configuredStartHtml = data.substring(start_pos + 1, end_pos);   
                }
            }

            console.log('configuredStartHtml=' + configuredStartHtml);
        }

    } else {

        // vscode.window.showInformationMessage('No config.xml file in the current app');    
    }

    return configuredStartHtml;
}
exports.getConfStartHtml = getConfStartHtml;


// Insert <name> value into 'config.xml' of App
function writeConfigXmlNameAttr(nameId, path) {    

	if (fs.existsSync(path)) {
		var data = fs.readFileSync(path, 'utf-8');
		var updatedData = '';
	
		if (data) {
			var nameStartPos = data.indexOf('<name>');
			var nameEndPos = data.indexOf('</name>');
			var substring1 = data.substring(0, nameStartPos + 6);
			var substring2 = data.substring(nameEndPos, data.length);
			updatedData = substring1 + nameId + substring2;
		}
		fs.writeFileSync(path, updatedData, 'utf-8');
	}
}
exports.writeConfigXmlNameAttr = writeConfigXmlNameAttr;


// Insert css content into 'style.css'
function writeCssContent(bCanvasEnabled, bTextareaEnabled, wasmModuleName, cssPath) {
	logger.info('Common', 'writeCssContent');
	// todo catch exception
	// 1.0 add div
	var str;
	str = fs.readFileSync(extensionPath + '/templates/Wasm/css/module_div.css', 'utf-8');
	
	// 2.0 add canvas
	if (bCanvasEnabled)
	{
		str = str + fs.readFileSync(extensionPath + '/templates/Wasm/css/module_canvas.css', 'utf-8');
	}
	
	// 3.0 add textarea
	if (bTextareaEnabled)
	{
		str = str + fs.readFileSync(extensionPath + '/templates/Wasm/css/module_textarea.css', 'utf-8');
	}
	
	// 4.0 replace module_name
	// [##ModuleName##] -> wasmModuleName
	str = str.replace(/\[\#\#ModuleName\#\#\]/g, wasmModuleName);
	
	// 5.0 write data to .css file	
	if (fs.existsSync(cssPath)) {
		var data = fs.readFileSync(cssPath, 'utf-8');
		if (data)
		{
			data = data + str;
		}
		fs.writeFileSync(cssPath, data, 'utf-8');
	}
}
exports.writeCssContent = writeCssContent;

// Insert <script scr="wasm_modules/scripts/wasm_tools.js"></script>
// into index.html head element
function writeHtmlScript(htmlPath) {
	logger.info('Common', 'writeHtmlScript');
	if (fs.existsSync(htmlPath)) {
		var data = fs.readFileSync(htmlPath, 'utf-8');
		if (data) {
			var headEndPos = data.indexOf('</head>');
			var substring1 = data.substring(0, headEndPos-1);
			var substring2 = data.substring(headEndPos, data.length);
			data = substring1 
				  + '\n    <script src="wasm_modules/scripts/wasm_tools.js"></script>\n' 
				  + substring2;
		}
		fs.writeFileSync(htmlPath, data, 'utf-8');
	}
}
exports.writeHtmlScript = writeHtmlScript;

// Insert html content into '*.html'
function writeHtmlContent(bCanvasEnabled, bTextareaEnabled,  width, height, rows, cols, wasmModuleName, htmlPath) {
	logger.info('Common', 'writeHtmlContent');
	// 1.0 set source html file name
	var htmlFile;
	if (bCanvasEnabled)
	{
		if (bTextareaEnabled)
		{
			htmlFile = extensionPath + '/templates/Wasm/html/module_embed_code_both.html';
		}
		else
		{
			htmlFile = extensionPath + '/templates/Wasm/html/module_embed_code_canvas.html';
		}
	}
	else
	{
		if (bTextareaEnabled)
		{
			htmlFile = extensionPath + '/templates/Wasm/html/module_embed_code_textarea.html';
		}
		else
		{
			htmlFile = extensionPath + '/templates/Wasm/html/module_embed_code_null.html';
		}
	}
	var str;
	str = fs.readFileSync(htmlFile, 'utf-8');
	
	// 2.0 replace 
	// [##ModuleName##] -> wasmModuleName
	str = str.replace(/\[\#\#ModuleName\#\#\]/g, wasmModuleName);
	// [##CANVAS_WIDTH##] -> width
	str = str.replace(/\[\#\#CANVAS_WIDTH\#\#\]/g, width);
	// [##CANVAS_HEIGHT##] -> height
	str = str.replace(/\[\#\#CANVAS_HEIGHT\#\#\]/g, height);
	// [##TEXTAREA_ROWS##] -> rows
	str = str.replace(/\[\#\#TEXTAREA_ROWS\#\#\]/g, rows);
	// [##TEXTAREA_COLS##] -> cols
	str = str.replace(/\[\#\#TEXTAREA_COLS\#\#\]/g, cols);
		
	// 3.0 write data to body element in .html file	
	if (fs.existsSync(htmlPath)) {
		var data = fs.readFileSync(htmlPath, 'utf-8');
		if (data) {
			var bodyEndPos = data.indexOf('</body>');
			var substring1 = data.substring(0, bodyEndPos-2);
			var substring2 = data.substring(bodyEndPos - 1, data.length);
			data = substring1 + str + substring2;
		}
		fs.writeFileSync(htmlPath, data, 'utf-8');
	}
}
exports.writeHtmlContent = writeHtmlContent;


function getWasmFiles(){
	var wasmModuleNames = [];
	//  wasmModulesPath : **/appname/wasm_modules
	var wasmModulesPath = getWorkspacePath() + '/wasm_modules';
	if (fs.existsSync(wasmModulesPath)){
		logger.info(moduleName, 'Get Wasm Files from  : ' + wasmModulesPath);
        try{
			// get wasmModuleNames
			// files[0...n] : scripts / wasmModule1 / wasmModule2
			var files = fs.readdirSync(wasmModulesPath);
			for(var i = files.length - 1 ;i >= 0; i--) {
				logger.info(moduleName, 'files[' + i + ']  : ' + files[i]);
				if ( files[i] == 'scripts' )// ignore scripts
				{
					continue;
				}

				// fullname :  **/appname/wasm_modules/wasmModule1 or file
				var fullname = path.join(wasmModulesPath, files[i]);
				logger.info(moduleName, 'fullname  : ' + fullname);
				var stats = fs.statSync(fullname);
				if ( stats.isFile() ) // ignore file
				{
					logger.info(moduleName, 'fullname is file ');
					continue;
				}

				// in **/appname/wasm_modules and is directory
				var srcPath = path.join(fullname, 'src');
				logger.info(moduleName, 'srcPath  : ' + srcPath);
				var srcFiles = fs.readdirSync(srcPath);

				// get fileNames for each wasmModule
				var fileNames = [];
				// fileNames[0] = wasmModuleName
				fileNames.push(files[i]);
				for(var j = srcFiles.length - 1; j >= 0; j--) {
					logger.info(moduleName, 'srcFiles[' + j + ']  : ' + srcFiles[j]);
					if ( (srcFiles[j].indexOf('.c') != -1)
						|| (srcFiles[j].indexOf('.cpp') != -1)){
						fileNames.push(srcFiles[j]);// short name
					}
				}

				// fileNames save into wasmModuleNames
				wasmModuleNames.push(fileNames);

				continue;
			}
        } catch (ex) {
            logger.info(moduleName, ex.message);
            throw ex;
        }
    }else{
        logger.info(moduleName, wasmModulesPath + ' does not exist');
    }
    return wasmModuleNames;
}
exports.getWasmFiles = getWasmFiles;

function createDir(dirPath){
    if (!fs.existsSync(dirPath)){
        console.log('Create dir path:'+dirPath);
        try{        
            fs.mkdirSync(dirPath);           
        } catch (ex) {
            console.log(ex.message);
            throw ex;
        }
        
    }else{
        console.log(dirPath+' is exist');
    }
}
exports.createDir = createDir;

// Make dir
function mkdirs(p, mode, f, made) {

	if (typeof mode === 'function' || mode === undefined) {
		f = mode;
		mode = 0777 & (~process.umask());
	}
	if (!made)
		made = null;

	var cb = f || function () { };
	if (typeof mode === 'string')
		mode = parseInt(mode, 8);
	p = path.resolve(p);

	fs.mkdir(p, mode, function (er) {
		if (!er) {
			made = made || p;
			return cb(null, made);
		}
		switch (er.code) {
			case 'ENOENT':
				mkdirs(path.dirname(p), mode, function (er, made) {
					if (er) {
						cb(er, made);
					} else {
						mkdirs(p, mode, cb, made);
					}
				});
				break;

			// In the case of any other error, just see if there's a dir
			// there already.  If so, then hooray!  If not, then something
			// is borked.
			default:
				fs.stat(p, function (er2, stat) {
					// if the stat fails, then that's super weird.
					// let the original error be the failure reason.
					if (er2 || !stat.isDirectory()) {
						cb(er, made);
					} else {
						cb(null, made);
					}
				});
				break;
		}
	});
}
exports.mkdirs = mkdirs;

// Count the files that need to be copied
function _ccoutTask(from, to, cbw) {

	async.waterfall([
		function (callback) {
			fs.stat(from, callback);
		},
		function (stats, callback) {
			if (stats.isFile()) {
				cbw.addFile(from, to);
				callback(null, []);
			} else if (stats.isDirectory()) {
				fs.readdir(from, callback);
			}
		},
		function (files, callback) {
			if (files.length) {
				for (var i = 0; i < files.length; i++) {
					_ccoutTask(path.join(from, files[i]), path.join(to, files[i]), cbw.increase());
				}
			}
			callback(null);
		}
	], cbw);
}
exports._ccoutTask = _ccoutTask;

// wrap the callback before counting
function ccoutTask(from, to, cb) {
	var files = [];
	var count = 1;

	function wrapper(err) {
		count--;
		if (err || count <= 0) {
			cb(err, files);
		}
	}
	wrapper.increase = function () {
		count++;
		return wrapper;
	};
	wrapper.addFile = function (file, dir) {
		files.push({
			file: file,
			dir: dir
		});
	};

	_ccoutTask(from, to, wrapper);
}
exports.ccoutTask = ccoutTask;

// Copy a single file
function copyFile(file, toDir, cb) {
	async.waterfall([
		function (callback) {
			fs.exists(toDir, function (exists) {
				if (exists) {
					callback(null, false);
				} else {
					callback(null, true);
				}
			});
		}, function (need, callback) {
			if (need) {
				mkdirs(path.dirname(toDir), callback);
			} else {
				callback(null, true);
			}
		}, function (p, callback) {
			var reads = fs.createReadStream(file);
			var writes = fs.createWriteStream(path.join(path.dirname(toDir), path.basename(file)));
			reads.pipe(writes);
			//don't forget close the  when  all the data are read
			reads.on('end', function () {
				writes.end();
				callback(null);
			});
			reads.on('error', function (err) {
				logger.error(moduleName, 'error occur in reads');
				callback(true, err);
			});

		}
	], cb);

}
exports.copyFile = copyFile;

//copy a directory
function copyDir(from, to, cb) {
    if (!cb) {
		cb = function () { };
	}
	async.waterfall([
		function (callback) {
			fs.exists(from, function (exists) {
				if (exists) {
					callback(null, true);
				} else {
					logger.warning(from + ' not exists');
					callback(true);
				}
			});
		},
		function (exists, callback) {
			fs.stat(from, callback);
		},
		function (stats, callback) {
			if (stats.isFile()) {
				// one file copy
				copyFile(from, to, function (err) {
					if (err) {
						// break the waterfall
						callback(true);
					} else {
						callback(null, []);
					}
				});
			} else if (stats.isDirectory()) {
				ccoutTask(from, to, callback);
			}
		},
		function (files, callback) {
			// prevent reaching to max file open limit
			async.mapLimit(files, 10, function (f, cb) {
				copyFile(f.file, f.dir, cb);
			}, callback);
		}
	], cb);
}
exports.copyDir = copyDir;

//return certificate-generator config.json content
function getCertConfig() {
	var content = {};
	var configPath = extensionPath + path.sep + 'resource' + path.sep + 'config.json';
	if(!fs.existsSync(configPath)) {
		logger.error(moduleName, "There is no config file exist!!");
		return content;
	}

	//exist
	var jsonStr = fs.readFileSync(configPath, 'utf-8');
	content = JSON.parse(jsonStr);
	return content;
}

//get certificate-generator name
function getCertGeneratorName() {
	return getCertConfig().name;
}
exports.getCertGeneratorName = getCertGeneratorName;

function getCertGeneratorVer() {
	return getCertConfig().version;
}
exports.getCertGeneratorVer = getCertGeneratorVer;

function getCertDownloadUrlPrefix() {
	return getCertConfig().downloadUrlPrefix;
}
exports.getCertDownloadUrlPrefix = getCertDownloadUrlPrefix;

function getCertDownloadUrlSuffix() {
	return getCertConfig().downloadUrlSuffix;
}
exports.getCertDownloadUrlSuffix = getCertDownloadUrlSuffix;

function getDeveloperCaName() {
	return getCertConfig().developerCA;
}
exports.getDeveloperCaName = getDeveloperCaName;

function getDeveloperSignerName() {
	return getCertConfig().developerSigner;
}
exports.getDeveloperSignerName = getDeveloperSignerName;

function getDeveloperSignerPKCS() {
	return getCertConfig().developerSignerPKCS;
}
exports.getDeveloperSignerPKCS = getDeveloperSignerPKCS;

function getDistributorCaName() {
	return getCertConfig().distributorCA;
}
exports.getDistributorCaName = getDistributorCaName;

function getDistributorSigner() {
	return getCertConfig().distributorSigner;
}
exports.getDistributorSigner = getDistributorSigner;

function getDistributorSignerPKCS() {
	return getCertConfig().distributorSignerPKCS;
}
exports.getDistributorSignerPKCS = getDistributorSignerPKCS;