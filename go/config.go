package main

import (
	"time"
)

const (
	title = "OpenGL Project"

	// Size of vectors passed to shaders
	vectorSize = 2

	// Size of array of objects being passed to shader
	bufferSize = 100000

	// Size of each 'grouping' of objects passed to shaders.
	// e.g. gl.POINTS are sized 1; gl.LINES are sized 2; gl.TRIANGLES are sized 3
	groupSize = 1

	// Time interval between every calculation of next point
	genDelay = time.Nanosecond * 100

	// Frame rate of the rendering
	frameRate = 60

	// Time interval between every frame refresh
	frameDelay = time.Second / frameRate

	// Base values for vector
	baseA float64 = -0.81
	baseB float64 = -0.92
	baseM float64 = 0.2

	// Multiplier for moving, due to different framerates
	movementMultiplier float64 = float64(60) / float64(frameRate)
)

var (
	// Maintains the current aspect ratio, so output values can be transformed accordingly
	aspectRatio float64 = 1
)
