package main

import (
	"fmt"
	"runtime"
	"time"

	"github.com/go-gl/gl/v4.1-core/gl"
	"github.com/go-gl/glfw/v3.0/glfw"
)

func main() {
	// Execute in same OS thread; GLFW must be called from
	// same thread it was initialised on
	runtime.LockOSThread()

	window := initGlfw()
	defer glfw.Terminate()

	program := initOpenGL()

	aspectRatioLocation := gl.GetUniformLocation(
		program,
		gl.Str("aspect_ratio\x00"),
	)

	// Set viewport when window resizes
	window.SetSizeCallback(func(w *glfw.Window, width int, height int) {
		aspectRatio = float64(width) / float64(height)

		gl.Uniform1f(aspectRatioLocation, float32(aspectRatio))
		gl.Viewport(0, 0, int32(width), int32(height))
	})

	var render []float32
	trailIndex := 0

	for i := 0; i < bufferSize*vectorSize*groupSize; i++ {
		render = append(render, 0)
	}

	var v bedheadAttractor = newBedheadAttractor(baseA, baseB, baseM)
	myVector := &v

	// goroutine to generate points and add them to the buffer
	go func() {
		done := false
		prevX, prevY := myVector.Coordinate()
		size := vectorSize * groupSize

		for !(window.ShouldClose() || done) {
			nextX, nextY := myVector.Coordinate()

			trailIndex = trailIndex % bufferSize
			renderIndex := (trailIndex) * size
			trailIndex++

			render[renderIndex+0] = float32(prevX)
			render[renderIndex+1] = float32(prevY)

			prevX, prevY = nextX, nextY

			if genDelay > 0 {
				time.Sleep(genDelay)
			}
		}
	}()

	seedLocation := gl.GetUniformLocation(program, gl.Str("seed\x00"))

	lastFrame := time.Now()

	lastSecond := time.Now()
	fps := 0

	// goroutine to handle rendering and handling inputs for the glfw window
	for !window.ShouldClose() {
		currentVao := makeVao(render)
		draw(
			currentVao,
			window,
			program,
			int32(len(render)/vectorSize),
			seedLocation,
		)
		listen(window, myVector, baseA, baseB, baseM)

		if nextDelay := frameDelay - time.Since(lastFrame); nextDelay > 0 {
			time.Sleep(nextDelay)
		}

		lastFrame = time.Now()

		fps++
		if time.Since(lastSecond) >= time.Second {
			lastSecond = time.Now()
			fmt.Println("FPS:", fps)
			fps = 0
		}
	}
}
