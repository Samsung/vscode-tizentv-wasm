<h1 align="center">
  <br>
    <img src="https://github.sec.samsung.net/VD-WebPlatform/WebAssembly/blob/master/vscode-extension-tizentvwasm/images/icon.png" alt="logo" width="200">
  <br>
  VS Code - Tizen TV WASM
  <br>
  <br>
</h1>

<h4 align="center">Generate/Edit/Package/Run/Debug your webassembly applications with Tizen Targets</h4>

<p align="center">
  <a href="https://github.com/samsung/vscode-extension-tizentv"><img src="https://github.sec.samsung.net/VD-WebPlatform/WebAssembly/blob/master/vscode-extension-tizentvwasm/images/buildpassing.png" alt="Source"></a>
  <a href="https://github.com/samsung/vscode-extension-tizentv/releases"><img src="https://github.sec.samsung.net/VD-WebPlatform/WebAssembly/blob/master/vscode-extension-tizentvwasm/images/release.png" alt="Release"></a>
  <a href="https://github.com/samsung/vscode-extension-tizentv/wiki"><img src="https://github.sec.samsung.net/VD-WebPlatform/WebAssembly/blob/master/vscode-extension-tizentvwasm/images/chatter.png" alt="Wiki"></a>
</p>

'Tizen TV WASM' is a VS Code extension that provides a lightweight IDE for Tizen Webassembly application developers, helps to generate, update and package an application, also run and debug an application on Tizen targets.

![Demo](https://github.sec.samsung.net/VD-WebPlatform/WebAssembly/blob/master/vscode-extension-tizentvwasm/images/demo.gif)

## Supported features
* Tizen TV WASM: Create Web Project  
  Create a Tizen web application based on templates
* Tizen TV WASM: Add Wasm Module  
  Add one or more Wasm Module to a Tizen web application，including C++ HelloWorld / C HelloTriangle / C++ Empty / C Empty
* Tizen TV WASM: Build Package  
  Build all wasm modules and package the Tizen application into a Tizen package, the package will be located in workspace's root
* Tizen TV WASM: Certificate Manager  
  Create/Retrieve/Update/Delete an author's profile by Tizen TV WASM
* Tizen TV WASM: Run on TV  
  Run Tizen application on tizen TV, please configure the target address in user setting, also set TV as developer mode
* Tizen TV WASM: Run on TV Simulator  
  Run Tizen wasm application on TV Simulator, please configure simultor's executable location in user setting
* Tizen TV WASM: Run TV Emulator Manager & Tizen TV: Run on TV Emulator  
  Run Tizen wasm application on TV Emulator, please configure Tizen Studio's location, and a Emulator instance should be started
* Tizen TV WASM: SDB Command Promote  
  Open SDB in shell to help execute the SDB commands you want
* Tizen TV WASM: Web Inspector on Emulator & Tizen TV: Web Inspector on TV  
  Use google-chrome to debug with web inspector, please configure the chrome executable's path in user setting
* Tizen TV WASM: Set Exception Path  
  Set Exception Path for package

## Getting Started
The extension supports most of the basic features required to develop a Tizen TV wasm app. It supports to create application using predefined templates, package the application, sign the application using certificate profile, launch a command prompt to execute sdb commands, run or debug application on TV Simulator, Emulator and Tizen TV.

### Setup Environment  
1. Install Emscripten Tool  
   *https://developer.samsung.com/smarttv/develop/extension-libraries/webassembly/getting-started/downloading-and-installing.html*  
2. Install latest VS Code release  
   *https://code.visualstudio.com*  
   *https://code.visualstudio.com/docs/setup/setup-overview* 
3. Execute *ext install tizentvwasm* in command pallete(or clone tizentvwasm-1.0.0.vsix from github, install with terminal command)  
   *#code --install-extension tizentvwasm-1.0.0.vsix*  
4. Start/Restart VS Code  
5. Use F1 to open the palette and input *>Tizen* to find commands like format : *Tizen TV WASM: Create Web Project*  
6. Use F5 to find debuggers  
<p><img src="https://github.sec.samsung.net/VD-WebPlatform/WebAssembly/blob/master/vscode-extension-tizentvwasm/images/featurelist.png" alt="feature list"></p>  

### Command Configuration  
For running/debugging an app, please configure one of below items:  
File > Preferences > Settings  
* tizentv.simulatorExecutable  
  Configuration of TV simulator's executable location  
* tizentv.tizenStudioLocation  
  Configuration of Tizen Studio's location  
* tizentv.chromeExecutable  
  Configuration of chrome executable's path  
* tizentv.targetDeviceAddress  
  Configuration of target TV's IP and port  
* tizentv.certificateManager 
  Opitional parameters for creating certification profile 
<p><img src="https://github.sec.samsung.net/VD-WebPlatform/WebAssembly/blob/master/vscode-extension-tizentvwasm/images/setting.png" alt="setting"></p>

### Debugger Configuration  
If the launch.json is not yet configured, please configure the launching item  
* runtimeLocation  
  Set the TV Simulator's location for debug on TV simulator  
* targetIp  
  Set the target TV's IP for debug on TV  
<p><img src="https://github.sec.samsung.net/VD-WebPlatform/WebAssembly/blob/master/vscode-extension-tizentvwasm/images/debugsetting.png" alt="debug setting"></p>


## F.A.Q
Please get contact points at below:  
  *jie1013.wu@samsung.com*  
  *mv.kulkarni@samsung.com*  

