const vscode = require('vscode');
const path = require('path');

const MAP_TABLE = {
  'AudioConfig' : 'https://wiki.libsdl.org/CategoryAudio',
  'AudioBuffer' : 'https://wiki.libsdl.org/CategoryAudio',
  'Audio' : 'https://wiki.libsdl.org/CategoryAudio',

  'FileIO' : 'https://emscripten.org/docs/api_reference/Filesystem-API.html',
  'FileRef' : 'https://emscripten.org/docs/api_reference/Filesystem-API.html',
  'FileSystem' : 'https://emscripten.org/docs/api_reference/Filesystem-API.html',

  'InputEvent' : 'https://wiki.libsdl.org/CategoryEvents',
  'MouseInputEvent' : 'https://wiki.libsdl.org/CategoryMouse',
  'WheelInputEvent' : '#####',
  'KeyboardInputEvent' : 'https://wiki.libsdl.org/CategoryKeyboard',
  'TouchInputEvent' : '#####',
  'IMEInputEvent' : '#####',
  'MouseCursor' : 'https://wiki.libsdl.org/CategoryMouse',
  'MouseLock' : '#####',
  'TextInputController' : 'https://wiki.libsdl.org/CategoryKeyboard',

  'Console' : '#####',

  'Core' : '#####',

  'Fullscreen' : '#####',
  'View' : '#####',
  'Instance' : '#####',

  'Graphics2D' : '#####',
  'Graphics3D' : '#####',
  'ImageData' : '#####',
  'OpenGLES2' : '#####',

  'MediaStreamAudioTrack' : '#####',
  'MediaStreamVideoTrack' : '#####',
  'VideoDecoder' : '#####',
  'VideoEncoder' : '#####',
  'VideoFrame' : '#####',

  'MessageLoop' : '#####',
  'Messaging' : '#####',
  'MessageHandler' : '#####',

  'URLLoader' : '#####',
  'URLRequestInfo' : '#####',
  'URLResponseInfo' : '#####',

  'Var' : '#####',
  'VarArray' : '#####',
  'VarArrayBuffer' : '#####',
  'VarDictionary' : '#####',

  'WebSocket' : '#####'
}

async function ApiMapping() {
  let disposable = vscode.languages.registerHoverProvider('cpp', {provideHover});

  return disposable;
}
exports.ApiMapping = ApiMapping;

async function provideHover(document, position, token) {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>hover success!!');
  console.log(document);
  console.log(position);
  console.log(token);

  let word = document.getText(document.getWordRangeAtPosition(position));
  console.log(word);

  if(word === 'AudioConfig') {
    return new vscode.Hover(`* **PPAPI**: AudioConfig\n Please refer ${MAP_TABLE['AudioConfig']}`);
  }
  else {
    return {
      contents : ['Hello Hover!!']
    };
  }




  // return {
  //   contents : ['Hover Content One']
  // };
}