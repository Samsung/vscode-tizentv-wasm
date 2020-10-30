#ifndef FUNCTIONS_H
#define FUNCTIONS_H

#include <sys/types.h>

namespace helloworld {

/**
 * For the quick WASM demonstration purpose we create a simple wrapper
 * of the time() function.
 */
time_t time();

}

#endif
