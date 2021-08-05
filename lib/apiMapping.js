const vscode = require('vscode');
const path = require('path');

//all category and reference url are from http://wiki.vd.sec.samsung.net/display/SRCNJWEB/Mapping+APIs
//SDL : https://wiki.libsdl.org/APIByCategory
//emscripten : https://emscripten.org/docs/api_reference/index.html
const MAP_NAME = [
  'AudioConfig',
  'AudioBuffer',
  'Audio',
  'FileIO',
  'FileRef',
  'FileSystem',
  'InputEvent',
  'MouseInputEvent',
  'WheelInputEvent',
  'KeyboardInputEvent',
  'TouchInputEvent',
  'IMEInputEvent',
  'MouseCursor',
  'MouseLock',
  'TextInputController',
  'Console',
  'Core',
  'Fullscreen',
  'View',
  'Instance',
  'Graphics2D',
  'Graphics3D',
  'ImageData',
  'OpenGLES2',
  'MediaStreamAudioTrack',
  'MediaStreamVideoTrack',
  'VideoDecoder',
  'VideoEncoder',
  'VideoFrame',
  'MessageLoop',
  'Messaging',
  'MessageHandler',
  'URLLoader',
  'URLRequestInfo',
  'URLResponseInfo',
  'Var',
  'VarArray',
  'VarArrayBuffer',
  'VarDictionary',
  'WebSocket'
];

const MAP_TABLE = {
  'AudioConfig' : 'https://wiki.libsdl.org/CategoryAudio',
  'AudioBuffer' : 'https://wiki.libsdl.org/CategoryAudio',
  'Audio' : 'https://wiki.libsdl.org/CategoryAudio',

  'FileIO' : 'https://emscripten.org/docs/api_reference/Filesystem-API.html',
  'FileRef' : 'https://emscripten.org/docs/api_reference/Filesystem-API.html',
  'FileSystem' : 'https://emscripten.org/docs/api_reference/Filesystem-API.html',

  'InputEvent' : 'https://wiki.libsdl.org/CategoryEvents',
  'MouseInputEvent' : 'https://wiki.libsdl.org/CategoryMouse',
  'WheelInputEvent' : 'https://wiki.libsdl.org/CategoryJoystick',
  'KeyboardInputEvent' : 'https://wiki.libsdl.org/CategoryKeyboard',
  'TouchInputEvent' : 'https://wiki.libsdl.org/CategoryEvents',
  'IMEInputEvent' : 'https://wiki.libsdl.org/CategoryEvents',
  'MouseCursor' : 'https://wiki.libsdl.org/CategoryMouse',
  'MouseLock' : 'https://wiki.libsdl.org/CategoryMouse',
  'TextInputController' : 'https://wiki.libsdl.org/CategoryKeyboard',

  'Console' : 'https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.utime',

  'Core' : 'https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.utime',

  'Fullscreen' : 'https://fullscreen.spec.whatwg.org/',
  'View' : 'https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html',
  'Instance' : 'N/A',

  'Graphics2D' : 'https://wiki.libsdl.org/CategoryRender',
  'Graphics3D' : 'https://wiki.libsdl.org/CategoryRender',
  'ImageData' : 'https://wiki.libsdl.org/CategoryRender',
  'OpenGLES2' : 'https://wiki.libsdl.org/CategoryRender',

  'MediaStreamAudioTrack' : 'N/A',
  'MediaStreamVideoTrack' : 'N/A',
  'VideoDecoder' : 'N/A',
  'VideoEncoder' : 'N/A',
  'VideoFrame' : 'N/A',

  'MessageLoop' : 'N/A',
  'Messaging' : 'N/A',
  'MessageHandler' : 'N/A',

  'URLLoader' : 'https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html',
  'URLRequestInfo' : 'https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html',
  'URLResponseInfo' : 'https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html',

  'Var' : 'https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html',
  'VarArray' : 'https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html',
  'VarArrayBuffer' : 'https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html',
  'VarDictionary' : 'https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html',

  'WebSocket' : 'N/A'
}

async function ApiMapping() {
  let disposable = vscode.languages.registerHoverProvider('cpp', {provideHover});

  return disposable;
}
exports.ApiMapping = ApiMapping;

async function provideHover(document, position, token) {

  let word = document.getText(document.getWordRangeAtPosition(position));
  let url = await getUrl(word);
  if(url != '') {
    return new vscode.Hover(`* **PPAPI**: ${word}\n Please refer ${url}`);
  }
}

async function getUrl(word)
{
  let returnUrl = '';

  if(word == '') {
    return returnUrl;
  }

  MAP_NAME.forEach((name, index) => {
    //console.log(`index = ${index}, name = ${name}`);

    if(word == name) {
      returnUrl = MAP_TABLE[name];
      //console.log(returnUrl);
      return returnUrl;
    }
  });

  return returnUrl;
}