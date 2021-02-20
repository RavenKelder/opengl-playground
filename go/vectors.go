package main

import (
	"math"
	"time"
)

type vector interface {
	Coordinate() (float64, float64)
}

func newOscillatingVector(
	x float64,
	y float64,
	m float64,
	pX time.Duration,
	pY time.Duration,
) oscillatingVector {
	// Transform period to units of cycles per second
	periodX := float64(pX) * math.Pow10(-9) / (2 * math.Pi)
	periodY := float64(pY) * math.Pow10(-9) / (2 * math.Pi)
	return oscillatingVector{
		InitialX:   x,
		InitialY:   y,
		Multiplier: m,
		PeriodX:    periodX,
		PeriodY:    periodY,
		start:      time.Now(),
	}
}

type oscillatingVector struct {
	InitialX   float64
	InitialY   float64
	Multiplier float64
	PeriodX    float64
	PeriodY    float64
	start      time.Time
}

func (v oscillatingVector) Coordinate() (float64, float64) {
	t := time.Since(v.start)

	pX := v.PeriodX * float64(time.Second)
	pY := v.PeriodY * float64(time.Second)

	phaseX := float64(t) / pX
	phaseY := float64(t) / pY

	return v.InitialX + v.Multiplier*math.Sin(phaseX), v.InitialY + v.Multiplier*math.Cos(phaseY)
}

func newVector1(
	i float64,
	j float64,
	a float64,
	b float64,
	c float64,
	d float64,
	e float64,
	multiplier float64,
	t float64,
	stepSize float64,
) vector {
	return &vector1{
		i:          i,
		j:          j,
		a:          a,
		b:          b,
		c:          c,
		d:          d,
		e:          e,
		t:          t,
		stepSize:   stepSize,
		Multiplier: multiplier,
	}
}

type vector1 struct {
	i          float64
	j          float64
	a          float64
	b          float64
	c          float64
	d          float64
	e          float64
	t          float64
	stepSize   float64
	Multiplier float64
}

func (v *vector1) Coordinate() (float64, float64) {
	i, j, a, b, c, d, e, t := v.i, v.j, v.a, v.b, v.c, v.d, v.e, v.t
	x := i*math.Cos(a*t) - math.Cos(b*t)*math.Sin(c*t)
	y := j*math.Sin(d*t) - math.Sin(e*t)

	v.t = t + v.stepSize

	return x * v.Multiplier, y * v.Multiplier
}

func newBedheadAttractor(a float64, b float64, m float64) bedheadAttractor {
	return bedheadAttractor{
		A:          a,
		B:          b,
		x:          1,
		y:          1,
		Multiplier: m,
	}
}

type bedheadAttractor struct {
	A          float64
	B          float64
	x          float64
	y          float64
	Multiplier float64
	OffsetX float64 
	OffsetY float64
}

func (a *bedheadAttractor) ShiftX(amount float64) {
	a.OffsetX = a.OffsetX + amount / a.Multiplier
}

func (a *bedheadAttractor) ShiftY(amount float64) {
	a.OffsetY = a.OffsetY + amount / a.Multiplier
}

func (a *bedheadAttractor) ShiftA(amount float64) {
	a.A = a.A + amount
}

func (a *bedheadAttractor) ShiftB(amount float64) {
	a.B = a.B + amount
}

func (a *bedheadAttractor) ShiftM(amount float64) {
	a.Multiplier = a.Multiplier * amount
}

func (a *bedheadAttractor) Coordinate() (float64, float64) {
	xNew := math.Sin(a.x*a.y/a.B) + math.Cos(a.A*a.x-a.y)
	yNew := a.x + math.Sin(a.y)/a.B

	a.x = xNew
	a.y = yNew

	return a.Multiplier * xNew + a.OffsetX, a.Multiplier * yNew + a.OffsetY
}

func newGMAttractor(a float64, b float64, c float64, d float64, m float64) vector {
	return &jsAttractor{
		a:          a,
		b:          b,
		c:          c,
		d:          d,
		x:          0.1,
		y:          0.1,
		multiplier: m,
	}
}

type hplAttractor struct {
	a float64
	b float64
	c float64
	x float64
	y float64
	M float64
}

func (a *hplAttractor) Coordinate() (float64, float64) {
	xNew := a.y - 1 - math.Sqrt(math.Abs(a.b*a.x-1-a.c))*math.Sin(a.x-1)
	yNew := a.a - a.x - 1

	if max := math.Abs(xNew); max != 0 && max > 1/a.M {
		a.M = 1 / max
	}

	if max := math.Abs(yNew); max != 0 && max > 1/a.M {
		a.M = 1 / max
	}

	a.x = xNew
	a.y = yNew

	return a.M * xNew, a.M * yNew
}

type jsAttractor struct {
	a          float64
	b          float64
	c          float64
	d          float64
	x          float64
	y          float64
	multiplier float64
}

func (a *jsAttractor) Coordinate() (float64, float64) {
	xNew := a.d*math.Sin(a.x*a.a) - math.Sin(a.y*a.b)
	yNew := a.c*math.Cos(a.x*a.a) + math.Cos(a.y*a.b)

	a.x = xNew
	a.y = yNew

	return a.multiplier * xNew, a.multiplier * yNew
}
