# OpenGL Golang

Playground for the Go binding for OpenGL and GLFW

## Install notes (Ubuntu)

Requires [GLFW](https://www.glfw.org/). Run `cmake -DBUILD_SHARED_LIBS=ON .`
in the folder, after extraction, then run `sudo make install` (dependent
programs can import it easily). Add the line `/usr/local/lib` to the file
`/etc/ld.so.conf`.
