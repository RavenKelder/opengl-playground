package main

import (
	"fmt"
	"strings"

	"github.com/go-gl/gl/v4.1-core/gl"
)

const (
	vertexShaderSource = `
#version 410

in vec2 coordinate;

uniform float aspect_ratio;

void main() {
		// Maintains aspect ratio, by transforming the width appropriately
		gl_Position = vec4(coordinate.x / aspect_ratio, coordinate.y, 0.0, 1.0);
}
` + "\x00"

	fragmentShaderSource = `
#version 410

#define M_PI 3.1415926535897932384626433832795

out vec4 frag_colour;

uniform float seed;

// rainbow produces a vec4 to represent a colour, from a seed.
// Intended to take a value that changes for 0 to 2 PI consistently
// to produce a rainbow effect
vec4 rainbow(in float seed) {
	float mapped_time = seed;

	float red_osc = cos(mapped_time);
	float green_osc = cos(mapped_time + M_PI * 2.0 / 3.0);
	float blue_osc = cos(mapped_time + M_PI * 4.0 / 3.0);

	float red_val = red_osc / 2.0 + 0.5;
	float green_val = green_osc / 2.0 + 0.5;
	float blue_val = blue_osc / 2.0 + 0.5;

	return(vec4(red_val, green_val, blue_val, 1));
}	

void main() {
	frag_colour = rainbow(seed);
}
` + "\x00"
)

func compileShader(source string, shaderType uint32) (uint32, error) {
	shader := gl.CreateShader(shaderType)

	csources, free := gl.Strs(source)
	gl.ShaderSource(shader, 1, csources, nil)
	free()
	gl.CompileShader(shader)

	var status int32
	gl.GetShaderiv(shader, gl.COMPILE_STATUS, &status)
	if status == gl.FALSE {
		var logLength int32
		gl.GetShaderiv(shader, gl.INFO_LOG_LENGTH, &logLength)

		log := strings.Repeat("\x00", int(logLength+1))
		gl.GetShaderInfoLog(shader, logLength, nil, gl.Str(log))

		return 0, fmt.Errorf("failed to compile %v: %v", source, log)
	}

	return shader, nil
}
