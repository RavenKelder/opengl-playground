package main

import (
	"log"

	"github.com/go-gl/gl/v4.1-core/gl"
	"github.com/go-gl/glfw/v3.0/glfw"
)

// initGlfw initialises GLFW with default properties.
func initGlfw() *glfw.Window {
	if err := glfw.Init(); !err {
		log.Println("Failed to initialise GLFW")
	}

	// Define global GLFW properties
	// glfw.WindowHint(glfw.Resizable, glfw.False)
	glfw.WindowHint(glfw.ContextVersionMajor, 4)
	glfw.WindowHint(glfw.ContextVersionMinor, 1)
	glfw.WindowHint(glfw.OpenglProfile, glfw.OpenglCoreProfile)
	glfw.WindowHint(glfw.OpenglForwardCompatible, glfw.True)

	monitor, err := glfw.GetPrimaryMonitor()
	if err != nil {
		log.Fatalf("Failed to get primary monitor: %v", err)
	}

	mode, err := monitor.GetVideoMode()
	if err != nil {
		log.Fatalf("Failed to get video mode: %v", err)
	}

	height, width := mode.Height, mode.Width

	glfw.WindowHint(glfw.RedBits, mode.RedBits)
	glfw.WindowHint(glfw.GreenBits, mode.GreenBits)
	glfw.WindowHint(glfw.BlueBits, mode.BlueBits)
	glfw.WindowHint(glfw.RefreshRate, mode.RefreshRate)
	// glfw.WindowHint(glfw.Decorated, glfw.False)

	window, err := glfw.CreateWindow(width, height, title, nil, nil)
	if err != nil {
		log.Fatalf("Failed to initialise GLFW window: %v", err)
	}

	// Bind window to current thread
	window.MakeContextCurrent()

	return window

}

// initOpenGL initialises OpenGL
func initOpenGL() uint32 {
	if err := gl.Init(); err != nil {
		log.Printf("Failed to initialise OpenGL: %v", err)
	}

	version := gl.GoStr(gl.GetString(gl.VERSION))
	log.Println("OpenGL version", version)

	vertexShader, err := compileShader(vertexShaderSource, gl.VERTEX_SHADER)
	if err != nil {
		panic(err)
	}
	fragmentShader, err := compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
	if err != nil {
		panic(err)
	}

	// Create a program, to draw on
	prog := gl.CreateProgram()
	gl.AttachShader(prog, vertexShader)
	gl.AttachShader(prog, fragmentShader)

	gl.LinkProgram(prog)

	return prog
}
