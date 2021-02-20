package main

import (
	"math"
	"time"

	"github.com/go-gl/gl/v4.1-core/gl"
	"github.com/go-gl/glfw/v3.0/glfw"
)

func draw(
	vao uint32,
	window *glfw.Window,
	program uint32,
	size int32,
	seedLocation int32,
) {
	// Remove anything from previous frame
	gl.Clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	// Use the defined program to draw on
	gl.UseProgram(program)

	currentTime := time.Now().UnixNano() / 4

	mappedTime := float64(currentTime%int64(math.Pow10(9))) * math.Pow10(-9) * math.Pi * 2

	gl.Uniform1f(int32(seedLocation), float32(mappedTime))

	gl.BindVertexArray(vao)
	gl.DrawArrays(gl.POINTS, 0, size)

	// Swap buffers applies the buffer onto the program
	window.SwapBuffers()
}

// makeVao initializes and returns a vertex array from the points provided.
func makeVao(points []float32) uint32 {
	// Make vertex buffer object
	var vbo uint32
	gl.GenBuffers(1, &vbo)
	gl.BindBuffer(gl.ARRAY_BUFFER, vbo)
	// Size is 4 times the length of points; 32bit floats are sized 4 bytes
	gl.BufferData(gl.ARRAY_BUFFER, 4*len(points), gl.Ptr(points), gl.STATIC_DRAW)

	// Make the vertex array object
	var vao uint32
	gl.GenVertexArrays(1, &vao)
	gl.BindVertexArray(vao)
	gl.EnableVertexAttribArray(0)
	gl.BindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.VertexAttribPointer(0, int32(vectorSize), gl.FLOAT, false, 0, nil)

	return vao
}
