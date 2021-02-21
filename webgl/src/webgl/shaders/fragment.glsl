#define M_PI 3.1415926535897932384626433832795

precision mediump float;
uniform float clock;

float redOffset = 0.0;
float greenOffset = (2.0 / 3.0) * M_PI;
float blueOffset = (4.0 / 3.0) * M_PI;

void main() {
  float normalised = clock * 2.0 * M_PI;
  float redVal = sin(normalised + redOffset) / 2.0 + 0.5;
  float greenVal = sin(normalised + greenOffset) / 2.0 + 0.5;
  float blueVal = sin(normalised + blueOffset) / 2.0 + 0.5;

  gl_FragColor = vec4(redVal, greenVal, blueVal, 1.0);
}