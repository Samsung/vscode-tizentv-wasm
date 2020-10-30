#include "functions.h"
#include <emscripten/bind.h>

#include <time.h>

namespace helloworld {

time_t time() {
    return ::time(0);
}

}

/*
 * This way the function may be called from the JavaScript code.
 * (see the updated index.html file of the parent project,
 * starting from the tag: "WASM MODULE START: HelloWorld")
 */
EMSCRIPTEN_BINDINGS(helloworld_module) {
    emscripten::function("time", helloworld::time);
}
