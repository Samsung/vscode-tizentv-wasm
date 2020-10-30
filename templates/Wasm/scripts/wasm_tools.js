/**
 * Example helper class to load a WASM module from the .wasm file.
 */
class ModuleLoader {
    /**
     * Constructor.
     *
     * @param path The path to the .wasm file to load.
     * @param module The module object (see its .js file, usually the first line of it)
     * @param canvas The canvas object from the referencing html document (index.html?)
     * @param output The output element from the referencing html document.
     *               Standard output from the native code would be redirected there.
     */
    constructor(path, module, canvas, output) {
        this.canvas = canvas;
        this.output = output;
        this.load(path, module);
    }

    // Not to be used from the outside - called from within the constructor.
    load(path, module) {
        this.path = path;
        fetch(path)
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
          .then(binary => {
                var moduleArgs = {
                  canvas: ( () => {
                      if (this.canvas) {
                          this.canvas.addEventListener(
                              "webglcontextlost", function(e) {
                                  alert('WebGL context lost. Reload the page.');
                                  e.preventDefault();
                              }, false);
                      }
                      return this.canvas;
                  })(),
                  print: ( () => {
                      if (this.output) this.output.value = ''; // clear browser cache
                      return (text) => {
                          console.log(text);
                          if (this.output) {
                              this.output.value += text + "\n";
                              this.output.scrollTop = this.output.scrollHeight; // focus on bottom
                          }
                      };
                  })(),
                };
                this.module = module(moduleArgs);
                // From now on the module is loaded and available from the outside
                console.log("Module loaded from " + this.path + " is ready to use");
          });
    }
}

/**
 * Can be used when accessing the ModuleLoader instance via a Proxy (see ECMAScript 6).
 * For example:
 * HelloWorld is the [##ModuleName##]
 * var hello_world = new Proxy(new ModuleLoader(
 *     'wasm_modules/HelloWorld/CurrentBin/HelloWorld.wasm',
 *     HelloWorld,
 *     document.getElementById('HelloWorld_canvas'),
 *     document.getElementById('HelloWorld_output')),
 *   ModuleLoaderProxyHandler);
 * The proxy redirects calls to the hello_world to the ModuleLoader instance:
 * hello_world.function_exported_from_c() => ModuleLoader.module.function_exported_from_c()
 */
var ModuleLoaderProxyHandler = {
    get: function(target, property) {
        return target.module[property];
    }
};