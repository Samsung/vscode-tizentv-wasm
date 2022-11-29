const path = require('path');
const fs = require('fs');
const { logger } = require('./logger');

const templateSets = [
    {name: 'Empty', defaultName: 'Empty', src: path.resolve(__dirname, '..', 'templates', 'Basic', 'Empty')},
    {name: 'Basic Project', defaultName: 'BasicProject', src: path.resolve(__dirname, '..', 'templates', 'Basic', 'Tizen_Blank')},
    {name: 'Caph-Empty Template for AngularJS', defaultName: 'CaphEmptyTemplateforAngularJS', src: path.resolve(__dirname, '..', 'templates', 'Caph', 'Empty_AngularJS')},
    {name: 'Caph-Empty Template for jQuery', defaultName: 'CaphEmptyTemplateforjQuery', src: path.resolve(__dirname, '..', 'templates', 'Caph', 'Empty_jQuery')},
    {name: 'jQuery Navigation', defaultName: 'jQueryNavigation', src: path.resolve(__dirname, '..', 'templates', 'jQuery Mobile', 'NavigationView')}
];

const wasmLanguageSets = [
    {name : 'C Language', defaultName: 'C Language'},
    {name : 'C++ Language', defaultName: 'C++ Language'}
];

const wasmModeSets = [
    {name : 'Empty Module', defaultName: 'Empty Module'},
    {name : 'Template', defaultName: 'Template'}
];

const wasmTemplateSets = [
    {name: 'Empty', defaultName: 'Empty', src: path.resolve(__dirname, '..', 'templates', 'Basic', 'Empty')},
];

function _copyDirs(curDir, destDir) {
    logger.log('templateHelper[_copyDirs]: start(${curDir},${destDir})');
    let dirent = fs.readdirSync(curDir, {withFileTypes: true});
    dirent.forEach((item) => {
        if (item.isDirectory()) {
            fs.mkdirSync(path.resolve(destDir, item.name), {recursive: true});
            _copyDirs(path.resolve(curDir, item.name), path.resolve(destDir, item.name));
        }
        else {
            fs.copyFileSync(path.resolve(curDir, item.name), path.resolve(destDir, item.name));
        }
    });
}

function getDefualtName(tempName) {
    logger.log('templateHelper[getDefualtName]:start(${tempName})');
    return templateSets.find(temp =>  tempName == temp.name ).defaultName;
}
exports.getDefualtName = getDefualtName;

function existsTemplate(tempName) {
    logger.log('templateHelper[existsTemplate]:start(${tempName})');
    return templateSets.find(temp =>  tempName == temp.name ) == undefined ? false : true;
}
exports.existsTemplate = existsTemplate;

function getTemplateList() {
    logger.log('templateHelper[getTemplateList]:start');
    return templateSets.map(template => template.name);
}
exports.getTemplateList = getTemplateList;

function copyTemplate(tempName, prjPath) {
    logger.log('templateHelper[copyTemplate]:start(${tempName},${prjPath})');
    let fileSrc = templateSets.find(template => template.name === tempName).src + `${path.sep}project`;

    if (!fs.existsSync(prjPath)) {
        fs.mkdirSync(prjPath, {recursive: true});
    }
    _copyDirs(fileSrc, prjPath);
}
exports.copyTemplate = copyTemplate;

function getWasmLanguageList(){
    return wasmLanguageSets.map(language => language.name);
}
exports.getWasmLanguageList = getWasmLanguageList;

function getWasmModeList(){
    return wasmModeSets.map(mode => mode.name);
}
exports.getWasmModeList = getWasmModeList;
