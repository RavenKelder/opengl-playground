package main

import (
	"fmt"
	"reflect"

	"github.com/go-gl/glfw/v3.0/glfw"
)

func listen(
	window *glfw.Window,
	myVector *bedheadAttractor,
	baseA float64, baseB float64, baseM float64,
) {
	glfw.PollEvents()

	m := movementMultiplier

	// Get input, and quit on escape
	action := window.GetKey(glfw.KeyEscape)
	if action == glfw.Press {
		window.SetShouldClose(true)
	}

	if tUp := window.GetKey(glfw.KeyW); tUp == glfw.Press {
		myVector.ShiftY(-0.01 * m)
	}

	if tDown := window.GetKey(glfw.KeyS); tDown == glfw.Press {
		myVector.ShiftY(0.01 * m)
	}

	if tLeft := window.GetKey(glfw.KeyA); tLeft == glfw.Press {
		myVector.ShiftX(0.01 * m)
	}

	if tRight := window.GetKey(glfw.KeyD); tRight == glfw.Press {
		myVector.ShiftX(-0.01 * m)
	}

	shiftUp := window.GetKey(glfw.KeyUp)
	if shiftUp == glfw.Press {
		myVector.ShiftA(0.01 * m)
	}

	shiftDown := window.GetKey(glfw.KeyDown)
	if shiftDown == glfw.Press {
		myVector.ShiftA(-0.01 * m)
	}

	if shiftRight := window.GetKey(glfw.KeyRight); shiftRight == glfw.Press {
		myVector.ShiftB(0.01 * m)
	}

	if shiftLeft := window.GetKey(glfw.KeyLeft); shiftLeft == glfw.Press {
		myVector.ShiftB(-0.01 * m)
	}

	if zoomIn := window.GetKey(glfw.KeyPeriod); zoomIn == glfw.Press {
		myVector.ShiftM(1 + (0.01 * m))
	}

	if zoomOut := window.GetKey(glfw.KeyComma); zoomOut == glfw.Press {
		myVector.ShiftM(1 - (0.01 * m))
	}

	if snapshot := window.GetKey(glfw.KeyEnter); snapshot == glfw.Press {
		fmt.Printf("Rendering vector %v\n", reflect.TypeOf(myVector))
		fmt.Printf("%+v\n", myVector)
	}

	if reset := window.GetKey(glfw.KeyR); reset == glfw.Press {
		myVector.A = baseA
		myVector.B = baseB
		myVector.Multiplier = baseM
	}
}
