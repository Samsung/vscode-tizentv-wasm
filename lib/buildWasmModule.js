const { exec } = require('child_process');
//const child_process = require('child_process');
const { StepController } = require('./inputStepController');
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
//const { stderr, stdout } = require('process');
const platform = require('os').platform();
const logger = require('./logger');

const moduleID = 'BuildWasm';
const workspaceRootPath = vscode.workspace.rootPath;


const DEPENDENCY_NAMES = ['SDL2', 'libpng', 'bzip2', 'regal', 'boost', 'HarfBuzz', 'SDL2_mixer', 'SDL2_image', 'Cocos2d', 'FreeType', 'asio', 'SDL2_net', 'SDL2_ttf', 'Vorbis', 'Ogg', 'Bullet', 'zlib'];

const DEPENDENCY_MAP = {
    'SDL2' : 'https://github.com/emscripten-ports/SDL2',
    'libpng' : 'https://github.com/emscripten-ports/libpng',
    'bzip2' : 'https://github.com/emscripten-ports/bzip2',
    'regal' : 'https://github.com/emscripten-ports/regal',
    'boost' : 'https://github.com/emscripten-ports/boost',
    'HarfBuzz' : 'https://github.com/emscripten-ports/HarfBuzz',
    'SDL2_mixer' : 'https://github.com/emscripten-ports/SDL2_mixer',
    'SDL2_image' : 'https://github.com/emscripten-ports/SDL2_image',
    'Cocos2d' : 'https://github.com/emscripten-ports/Cocos2d',
    'FreeType' : 'https://github.com/emscripten-ports/FreeType',
    'asio' : 'https://github.com/emscripten-ports/asio',
    'SDL2_net' : 'https://github.com/emscripten-ports/SDL2_net',
    'SDL2_ttf' : 'https://github.com/emscripten-ports/SDL2_ttf',
    'Vorbis' : 'https://github.com/emscripten-ports/Vorbis',
    'Ogg' : 'https://github.com/emscripten-ports/Ogg',
    'Bullet' : 'https://github.com/emscripten-ports/Bullet',
    'zlib' : 'https://github.com/emscripten-ports/zlib'
}

module.exports = async function buildWasmModule() {

    let controller = new StepController();

    //1.set debug/release mode
    controller.addStep({
        title: 'Set Build Configurations',
		totalSteps: 1,
		step: 1,
		placeholder: 'Set Build Configurations',
		prompt: 'Set Build Configurations',
		items: [{label : 'Debug'}, {label : 'Release'}]
    });

    let buildMode = (await controller.start()).shift();
    //console.log('buildMode = ' + buildMode);
    logger.log(moduleID, 'buildMode = ' + buildMode);

    controller.reset();

    let builtFiles = await getAllWasmFiles();

    //2. add addtional build option
    //2.1 get additional C compiler option
    let cOptions = vscode.workspace.getConfiguration('tizentv').get('emscriptenCCompiler');
    let cCmd = '';
    if(cOptions.length !== 0) {
        for(let option of cOptions) {
            cCmd += ` ${option} `;
        }
    }
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>cCmd = ' + cCmd);

    //2.2 get additional CPP compiler option
    let cppOptions = vscode.workspace.getConfiguration('tizentv').get('emscriptenCPPCompiler');
    let cppCmd = '';
    if(cppOptions.length !== 0) {
        for(let option of cppOptions) {
            cppCmd += ` ${option} `;
        }
    }
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>cppCmd = ' + cppCmd);

    //2.3 get additinal linker 
    let linkerOptions = vscode.workspace.getConfiguration('tizentv').get('emscriptenLinker');
    let linkCmd = '';
    let linkCmdArr = [];
    let i = 0;
    if(linkerOptions.length !== 0) {
        for(let module of builtFiles) {
            linkCmdArr[i] = '';
            for(let option of linkerOptions) {
                if(option === '-s EXPORT_NAME') {
                    linkCmdArr[i] += ` ${option}=${module.wasmModuleName} `;
                } else {
                    linkCmdArr[i] += ` ${option} `;
                }
            }

            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>linkCmd = ' + linkCmdArr[i]);
            i++;
        }
    }

    //3.clear emscripten cache
    //await execCmd(`emcc --clear-cache`);

    //4.get all .cpp files need be built
    console.log('-----------------------------------builtFiles----------------------------------');
    console.log(builtFiles);

    if(builtFiles === null || builtFiles.length === 0) {
        logger.log(moduleID, `No wasm module should be built!!`);
        vscode.window.showWarningMessage(`No wasm module should be built!!`);
        return;
    }

    //5.build each wasm module
    i = 0;
    for(let buildModule of builtFiles) {

        //console.log('----------------------------------------Build Wasm Module : ' + buildModule.wasmModuleName + ' ----------------------------------');
        logger.log(moduleID, '----------------------------------------Build Wasm Module : ' + buildModule.wasmModuleName + ' ----------------------------------');
        
        try {
            if(linkCmdArr.length !== 0) {
                await buildEachWasmModule(buildModule, buildMode, cCmd, cppCmd, linkCmdArr[i]);
            } else {
                await buildEachWasmModule(buildModule, buildMode, cCmd, cppCmd, linkCmd);
            }
        } catch(error) {

            logger.log(moduleID, error);

            //check dependency
            let url = await getLibUrl(error);
            if(url !== '') {
                let msg = `Please download dependency from github : ${url}`;
                logger.log(moduleID, msg);
            }

            vscode.window.showErrorMessage('Build Wasm Module Fail, Please Check!');

            return;

        }

        //console.log('----------------------------------------Finished building Wasm Module : ' + buildModule.wasmModuleName + ' ----------------------------------');
        logger.log(moduleID, '----------------------------------------Finished building Wasm Module : ' + buildModule.wasmModuleName + ' ----------------------------------');
        i++;
    }

    vscode.window.showInformationMessage(`build all wasm module success!!`);
    //console.log('build all wasm module success!!');
    logger.log(moduleID, 'build all wasm module success!!');
}

function _execAsync(cmd, outCheck) {
    return new Promise(function(resolve, reject) {
        //console.log(`Build Wasm Module: ${cmd}`);
        logger.log(moduleID, `Build Wasm Module: ${cmd}`);
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(`${err.name}: ${err.message}`);
            }
            else {
                if (outCheck) {
                    outCheck(stdout, resolve, reject);
                }
                else {
                    resolve();
                }
            }
        });
    });
}

async function getAllWasmFiles() {
    let builtFiles = [];

    //1.get all dirs under workspace/wasm_modules/ path
    let wasmModulePath = path.join(workspaceRootPath, 'wasm_modules');
    if(!fs.existsSync(wasmModulePath)) {    //not exist
        console.log('no wasm module need to be built!!');
        return null;
    }

    //exist
    let dirs = fs.readdirSync(wasmModulePath);
    for(let dirName of dirs) {
        console.log(dirName);
        if(dirName === 'scripts') {
            continue;
        }

        //
        let builtObj = {
            wasmModuleName : '',
            wasmModulePath : '',
            builtFiles : [],
        };

        //2. get all files under each wasm module src dir
        let libDir = path.join(wasmModulePath, dirName);
        console.log('libDir = ' + libDir);

        //2.1 ignore file
        if(fs.statSync(libDir).isFile()) {
            console.log(libDir + 'is a file, should ignore');
            continue;
        }

        builtObj.wasmModuleName = dirName;
        builtObj.wasmModulePath = libDir;

        //2.2 get all files in src directory
        let srcPath = path.join(libDir, 'src');
        let files = fs.readdirSync(srcPath);
        console.log('files under ' + srcPath);
        for(let fileName of files) {
            console.log(fileName);
            //judge if fileName include '.c' or '.cpp'
            if(fileName.indexOf('.c') != -1 || 
                fileName.indexOf('.cpp') != -1) {
                    builtObj.builtFiles.push(fileName);
                }
        }

        builtFiles.push(builtObj);
        //console.log(builtObj);

    }

    return builtFiles;
}

async function execCmd(cmd) {
    return _execAsync(cmd);

    // console.log(`Build Wasm Module: ${cmd}`);
    // return child_process.execSync(cmd);
}

async function buildEachWasmModule(buildModule, buildMode, cCmd, cppCmd, linkCmd) {

    if(buildModule === null) {
        return;
    }

    try {
        //1. clean
        let currentBin = path.join(buildModule.wasmModulePath, 'CurrentBin');
        let cleanCmd = '';
        if(fs.existsSync(currentBin)) { //exist
            if(platform === 'win32') {
                cleanCmd = `rd /S/Q ${currentBin}`;
            } else {
                cleanCmd = `rm -rf ${currentBin}`;
            }

            await execCmd(cleanCmd);
        }

        //2.create CurrentBin directory
        await execCmd(`mkdir ${currentBin}`);

        //3.create CurrentBin/src directory
        let src = path.join(currentBin, 'src');
        await execCmd(`mkdir ${src}`);


        //4.0 link cmd prefix
        let linkerCmd = '';
        let tmpCmd = '';
        let binPath = path.join(buildModule.wasmModulePath, 'CurrentBin');
        if(platform === 'win32') {
            tmpCmd = `cd /D ${binPath} && `;
        } else {
            tmpCmd = `cd ${binPath} ; `;
        }
        
        if(buildMode === 'Debug') {
            linkerCmd = `${tmpCmd} emcc${linkCmd} -g4 --bind -o ${buildModule.wasmModuleName}.js `;
        } else if(buildMode === 'Release') {
            linkerCmd = `${tmpCmd} emcc${linkCmd} -O3 --bind -o ${buildModule.wasmModuleName}.js `;
        }
        
        //4. cd to each wasm module/src
        let cmd = '';
        let srcPath = path.join(buildModule.wasmModulePath, 'src');
        if(platform === 'win32') {
            cmd = `cd /D ${srcPath} && `;
        } else {
            cmd = `cd ${srcPath} ; `;
        }

        //console.log('**** Build of configuration ' + buildMode + ' for project ' + buildModule.wasmModuleName + ' ****');
        //console.log('make all');
        logger.log(moduleID, '**** Build of configuration ' + buildMode + ' for project ' + buildModule.wasmModuleName + ' ****');
        logger.log(moduleID, 'make all');

        //5.build .c or .cpp file
        for(let file of buildModule.builtFiles) {
            let builtPath = path.join('./', 'src', file);
            console.log('Building file : ' + builtPath);
            
            let compilerCmd = '';
            let index = file.indexOf('.');
            let shortFileName = file.slice(0, index);
            
            if(file.indexOf('.cpp') != -1 || file.indexOf('.cc') != -1) {
                //console.log('Invoking : Emscripten C++ Compiler');
                logger.log(moduleID, 'Invoking : Emscripten C++ Compiler');

                if(buildMode === 'Debug') {
                    compilerCmd = `${cmd} emcc -O0 -g4 -Wall -c -fmessage-length=0 ${cppCmd} -I../inc --bind`;  //cpp debug
                } else if(buildMode === 'Release') {
                    compilerCmd = `${cmd} emcc -Oz -O3 -Wall -c -fmessage-length=0 ${cppCmd} -I../inc --bind`;   //cpp release
                }

            } else if(file.indexOf('.c') != -1) {
                //console.log('Invoking : Emscripten C Compiler');
                logger.log(moduleID, 'Invoking : Emscripten C Compiler');

                if(buildMode === 'Debug') {
                    compilerCmd = `${cmd} emcc -O0 -g4 -Wall -c -fmessage-length=0 ${cCmd} -I../inc --bind`;   //c debug
                } else if(buildMode === 'Release') {
                    compilerCmd = `${cmd} emcc -Oz -O3 -Wall -c -fmessage-length=0 ${cCmd} -I../inc --bind`;    //c release
                }
            }

            //
            let destSrcPath = path.join('..', 'CurrentBin', 'src');
            let finalCompilerCmd = `${compilerCmd} -MMD -MP -MF "${destSrcPath}${path.sep}${shortFileName}.d" -MT "${destSrcPath}${path.sep}${shortFileName}.o" -o "${destSrcPath}${path.sep}${shortFileName}.o" "${file}"`;

            console.log('-------------------------------------------------finalCompilerCmd------------------------------');
            await execCmd(finalCompilerCmd);

            linkerCmd += ` "src${path.sep}${shortFileName}.o" `;
        }

        //6.build .js file => export wasm module
        //console.log('Building target : ' + buildModule.wasmModuleName + '.js')
        //console.log('Invoking: Emscripten Linker');
        logger.log(moduleID, 'Building target : ' + buildModule.wasmModuleName + '.js');
        logger.log(moduleID, 'Invoking: Emscripten Linker');

        await execCmd(linkerCmd);

        //console.log('Finished building target : ' + buildModule.wasmModuleName + '.js');
        logger.log(moduleID, 'Finished building target : ' + buildModule.wasmModuleName + '.js')

    } catch(error) {
        console.log(error);
        throw error;      

        //vscode.window.showErrorMessage('Build Wasm Moule Fail, Please Check!');
    }
}

async function getLibUrl(error) {
    //build command : emcc -O2 --js-opts 0 -g4 testdraw2.c -I../include ../build/.libs/libSDL2.a ../build/libSDL2_test.a -o a.html
    //shared:ERROR: ../build/.libs/libSDL2.a: No such file or directory ("../build/.libs/libSDL2.a" was expected to be an input file, based on the commandline arguments provided)
    
    let url = '';

    if(error.indexOf('No such file or directory') == -1) {
        console.log('Other Build Error!')
        return url;
    }

    //lack file or directory build error
    //check which file lack, if any dependency lacks
    DEPENDENCY_NAMES.forEach((name, index) => {
        //console.log(`index = ${index}, name = ${name}`);
        if(error.indexOf(name) != -1) { //exist
            url = DEPENDENCY_MAP[name];
            //console.log(url);
            return url;
        }
    });

    console.log('No releated dependency url to get!!');
    return url;
}
