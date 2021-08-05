const path = require('path');
const fs = require('fs');
const async = require('async');
const templateHelper = require('./templateHelper');
const { StepController } = require('./inputStepController');
const { InputValidator } = require('./inputValidator');
const vscode = require('vscode');

const extensionRootPath = path.resolve(__dirname, '..');
const workspaceRootPath = vscode.workspace.rootPath;

module.exports = async function addWasmModule(){
    console.log('========start add wasm modules');
    //0.
    let params = {};
    params.bCanvasEnabled = true;
    params.bTextareaEnabled = true;
    params.canvasWidth = 250;
    params.canvasHeight = 250;
    params.textAreaRows = 25;
    params.textAreaCols = 40;
    params.wasmModuleName = '';
    params.srcTemplatePath = '';
    params.htmlPath = '';
    params.cssPath = '';


    let controller = new StepController();

    //step1:select language c/c++
    controller.addStep({
        title : 'Define WASM Module properties',
        totalSteps : 3,
        step : 1,
        placeholder : 'Select Wasm Module Language',
        prompt : 'Select Wasm Module Language',
        items : templateHelper.getWasmLanguageList().map(label => ({label}))
    });

    //step2:Set Wasm Module Name
    controller.addStep({
        title : 'Define WASM Module properties',
        totalSteps : 3,
        step : 2,
        placeholder : 'Set Wasm Module Name',
        prompt : 'Set Wasm Module Name'
    });

    //step3:select template/empty
    controller.addStep({
        title : 'Define WASM Module properties',
        totalSteps : 3,
        step : 3,
        placeholder : 'Select Wasm Module Mode',
        prompt : 'Select Wasm Module Mode',
        items : templateHelper.getWasmModeList().map(label => ({label}))
    });


    let results = await controller.start();
    console.log(results);

    let language = results.shift();
    params.wasmModuleName = results.shift();
    let mode = results.shift();

    controller.reset();

    if(language === 'C Language'){  //select C
        if(mode === 'Empty Module') {   //c empty

            //1. set srcTemplatePath
            params.srcTemplatePath = path.join(extensionRootPath, 'templates', 'Wasm', 'templates', 'Empty_C');

            //2. set canvas
            await setCanvasAttribute(params);

            //3. set textarea
            await setTextareaAttribute(params);
            
            //console.log(params);

            await setWasmModule(params);


        } else if(mode === 'Template') {    //c template (Hello Triangle)
            controller.addStep({
                title : 'Select C Wasm Module Template',
                totalSteps : 1,
                step : 1,
                placeholder : 'Select C Wasm Module Template',
                prompt : 'Select C Wasm Module Template',
                items : [{label : 'Hello Triangle', description : 'An OpenGL "Hello Triangle" application'}]
            });

            results = await controller.start();
            console.log(results);

            let selectedSampleName = results.shift();

            controller.reset();

            if(selectedSampleName === 'Hello Triangle') {
                params.srcTemplatePath = path.join(extensionRootPath, 'templates', 'Wasm', 'templates', 'HelloTriangle');
            }

            await setWasmModule(params);
        }

    } else if(language === 'C++ Language') {    //select c++
        if(mode === 'Empty Module') {   //c++ empty
            //1. set srcTemplatePath
            params.srcTemplatePath = path.join(extensionRootPath, 'templates', 'Wasm', 'templates', 'Empty_CPP');

            //2. set canvas
            await setCanvasAttribute(params);

            //3. set textarea
            await setTextareaAttribute(params);

            console.log(params);

            await setWasmModule(params);

        } else if(mode === 'Template') {    //c++ tempate (Hello World)
            controller.addStep({
                title : 'Select C++ Wasm Module Template',
                totalSteps : 1,
                step : 1,
                placeholder : 'Select C++ Wasm Module Template',
                prompt : 'Select C++ Wasm Module Template',
                items : [{label : 'Hello World', description : 'A "Hello World" application'}]
            });

            results = await controller.start();
            console.log(results);

            let selectedSampleName = results.shift();

            controller.reset();

            if(selectedSampleName === 'Hello World') {
                params.srcTemplatePath = path.join(extensionRootPath, 'templates', 'Wasm', 'templates', 'HelloWorld');
            }

            await setWasmModule(params);
        }
    }

    vscode.window.showInformationMessage(`add wasm module success!!`);
}

async function setCanvasAttribute(params) {

    let controller = new StepController();

    controller.addStep({
        title : 'Set Empty Module attributes',
        totalSteps : 1,
        step : 1,
        placeholder : 'Set C Empty Module Canvas attribute',
        prompt : 'Do you want to set canvas?',
        items : [{label : 'yes'}, {label : 'no'}]
    });

    results = await controller.start();
    let isSetCanvas = results.shift();

    controller.reset();

    if(isSetCanvas === 'yes') {
        params.bCanvasEnabled = true;

        //set canvas width
        controller.addStep({
            title : 'Set Empty Module attributes',
            totalSteps : 2,
            step : 1,
            placeholder : 'Please config Canvas Width : deafult value is 250px',
            prompt : 'Set Canvas Width',
            validator : InputValidator.checkNumber
        });

        controller.addStep({
            title : 'Set Empty Module attributes',
            totalSteps : 2,
            step : 1,
            placeholder : 'Please config Canvas Height : deafult value is 250px',
            prompt : 'Set Canvas Height',
            validator : InputValidator.checkNumber
        });

        results = await controller.start();
        console.log(results);

        let width = results.shift();
        let height = results.shift();
        if(width !== '' && width !== undefined) {
            params.canvasWidth = width;
        }
        if(height !== '' && height !== undefined) {
            params.canvasHeight = height;
        }
        //console.log('params.canvasWidth = ' + params.canvasWidth + ' params.canvasHeight = ' + params.canvasHeight);

    } else {    //no
        params.bCanvasEnabled = false;
    }
}

async function setTextareaAttribute(params) {

    let controller = new StepController();

    controller.addStep({
        title : 'Set Empty Module attributes',
        totalSteps : 1,
        step : 1,
        placeholder : 'Set C Empty Module Textarea attribute',
        prompt : 'Do you want to set textarea?',
        items : [{label : 'yes'}, {label : 'no'}]
    });

    results = await controller.start();
    let isSetTextarea = results.shift();

    controller.reset();

    if(isSetTextarea === 'yes') {
        params.bTextareaEnabled = true;

        //set textarea width
        controller.addStep({
            title : 'Set Empty Module attributes',
            totalSteps : 2,
            step : 1,
            placeholder : 'Please config Textarea Rows : deafult value is 25',
            prompt : 'Set Textarea Rows',
            validator : InputValidator.checkNumber
        });

        controller.addStep({
            title : 'Set Empty Module attributes',
            totalSteps : 2,
            step : 1,
            placeholder : 'Please config Canvas Cols : deafult value is 40',
            prompt : 'Set Canvas Cols',
            validator : InputValidator.checkNumber
        });

        results = await controller.start();
        console.log(results);

        let rows = results.shift();
        let cols = results.shift();
        if(rows !== '' && rows !== undefined) {
            params.textAreaRows = rows;
        }
        if(cols !== '' && cols !== undefined) {
            params.textAreaCols = cols;
        }

    } else {
        params.bTextareaEnabled = false;
    }
}


async function setWasmModule(params) {
    //1. handle .html file
    let htmlPath = path.join(workspaceRootPath, 'index.html');
    //console.log('htmlPath = ' + htmlPath);
    params.htmlPath = htmlPath;
    await addHtmlContent(params);

    //2. handle .css file
    let cssPath = path.join(workspaceRootPath, 'css', 'style.css');
    //console.log('cssPath = ' + cssPath);
    params.cssPath = cssPath;
    await addCssContent(params);

    //3. copy scripts wasm_tools.js to 
    let destPath = path.join(workspaceRootPath, 'wasm_modules', 'scripts', 'wasm_tools.js');
    if(!fs.existsSync(destPath)) {  //not exist
        //3.1 add wasm_tools.js to index.html head scripts
        await addScriptToHead(params);

        //3.2 copy wasm_tools.js to destPath
        const src = path.join(extensionRootPath, 'templates', 'Wasm', 'scripts');
        const dest = path.join(workspaceRootPath, 'wasm_modules', 'scripts');
        copyDir(src, dest, error => {
            //copy fail
            if(error) {
                console.log('Add wasm module failed for filesystem permission!!');
                throw error;
            }

            //copy success
            console.log('scripts generated!');
        });
    }

    //4. copy template both inc/src directory
    destPath = path.join(workspaceRootPath, 'wasm_modules', params.wasmModuleName);
    copyDir(params.srcTemplatePath, destPath, err => {
        //copy fail
        if(error) {
            console.log('Add wasm module failed for filesystem permission!!');
            throw error;
        }

        //copy success
        console.log('folder generated!');
    });


    console.log('add wasm module success!!');
}

async function addHtmlContent(params) {
    //0.check wasmModuleName && htmlPath
    if(params.wasmModuleName === '' ||
        !fs.existsSync(params.htmlPath)
    ) {
        console.error(wasmModuleName + ' should not null!! || ' + htmlPath + ' file is not exist!!');
        return;
    }

    //1.choose source html file name
    let htmlFile;
    if(params.bCanvasEnabled) {
        if(params.bTextareaEnabled) {
            htmlFile = path.join(extensionRootPath, 'templates', 'Wasm', 'html', 'module_embed_code_both.html');
        } else {
            htmlFile = path.join(extensionRootPath, 'templates', 'Wasm', 'html', 'module_embed_code_canvas.html'); 
        }
    } else {
        if(params.bTextareaEnabled) {
            htmlFile = path.join(extensionRootPath, 'templates', 'Wasm', 'html', 'module_embed_code_textarea.html');
        } else {
            htmlFile = path.join(extensionRootPath, 'templates', 'Wasm', 'html', 'module_embed_code_null.html'); 
        }
    }
    //console.log('htmlFile = ' + htmlFile);

    //2.read htmlFile content
    let content = fs.readFileSync(htmlFile, 'utf-8');
    //console.log(content);

    //3.replace
    //3.1 [##ModuleName##]
    content = content.replace(/\[\#\#ModuleName\#\#\]/g, params.wasmModuleName);
    //3.2 [##CANVAS_WIDTH##]
    content = content.replace(/\[\#\#CANVAS_WIDTH\#\#\]/g, params.canvasWidth);
    //3.3 [##CANVAS_HEIGHT##]
    content = content.replace(/\[\#\#CANVAS_HEIGHT\#\#\]/g, params.canvasHeight);
    //3.4 [##TEXTAREA_ROWS##]
    content = content.replace(/\[\#\#TEXTAREA_ROWS\#\#\]/g, params.textAreaRows);
    //3.5 [##TEXTAREA_COLS##]
    content = content.replace(/\[\#\#TEXTAREA_COLS\#\#\]/g, params.textAreaCols);

    //console.log(content);

    //4.write content to htmlPath
    let data = fs.readFileSync(params.htmlPath, 'utf-8');
    if(data) {
        let bodyEndPos = data.indexOf('</body>');
        let subStr1 = data.substring(0, bodyEndPos - 2);
        let subStr2 = data.substring(bodyEndPos - 1, data.length);

        data = subStr1 + content + subStr2;
    }

    //4.2 write back data to htmlPath
    fs.writeFileSync(params.htmlPath, data, 'utf-8');
}

async function addCssContent(params) {
    //0. check cssPath
    if(!fs.existsSync(params.cssPath))
    {
        console.error(params.cssPath + 'file is not exist!!');
        return;
    }

    let finalStr;

    //1. add div
    let cssDivFile = path.join(extensionRootPath, 'templates', 'Wasm', 'css', 'module_div.css');
    finalStr = fs.readFileSync(cssDivFile, 'utf-8');

    //2.add canvas
    if(params.bCanvasEnabled) {
        let cssCanvasFile = path.join(extensionRootPath, 'templates', 'Wasm', 'css', 'module_canvas.css');
        finalStr += fs.readFileSync(cssCanvasFile, 'utf-8');
    }

    //3.add textarea
    if(params.bTextareaEnabled) {
        let cssTextFile = path.join(extensionRootPath, 'templates', 'Wasm', 'css', 'module_textarea.css');
        finalStr += fs.readFileSync(cssTextFile, 'utf-8');
    }

    //4.replace [##ModuleName##]
    finalStr = finalStr.replace(/\[\#\#ModuleName\#\#\]/g, params.wasmModuleName);

    //5.write finalStr to css file
    let data = fs.readFileSync(params.cssPath, 'utf-8');
    data += finalStr;
    fs.writeFileSync(params.cssPath, data, 'utf-8');
}

async function addScriptToHead(params) {
    if(!fs.existsSync(params.htmlPath))
    {
        console.error(params.htmlPath + 'file not exist!!');
        return;
    }

    //
    let data = fs.readFileSync(params.htmlPath, 'utf-8');
    if(data) {
        let headEndPos = data.indexOf('</head>');
        let subStr1 = data.substring(0, headEndPos - 1);
        let subStr2 = data.substring(headEndPos, data.length);

        data = `${subStr1}
    <script src="wasm_modules/scripts/wasm_tools.js"></script>
${subStr2}`;
    }

    fs.writeFileSync(params.htmlPath, data, 'utf-8');
}

function copyDir(from, to, cb) {
    if (!cb) {
		cb = function () { };
	}
	async.waterfall([
		function (callback) {
			fs.exists(from, async function (exists) {
				if (exists) {
					callback(null, true);
				} else {
					console.log(from + ' not exists');
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
				copyFile(from, to, async function (err) {
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
			async.mapLimit(files, 10, async function (f, cb) {
				copyFile(f.file, f.dir, cb);
			}, callback);
		}
	], cb);
}

// Copy a single file
function copyFile(file, toDir, cb) {
	async.waterfall([
		function (callback) {
			fs.exists(toDir, exists => {
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
			reads.on('end', async () => {
				writes.end();
				callback(null);
			});
			reads.on('error', async err => {
				console.log('error occur in reads');
				callback(true, err);
			});
		}
	], cb);
}

//mkdir
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

	fs.mkdir(p, mode, er => {
		if (!er) {
			made = made || p;
			return cb(null, made);
		}
		switch (er.code) {
			case 'ENOENT':
				mkdirs(path.dirname(p), mode, (er, made) => {
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
				fs.stat(p, (er2, stat) => {
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
