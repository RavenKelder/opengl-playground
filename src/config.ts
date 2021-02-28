/** Configuration values for the site */
const config = {
  /** DOM element configuration */
  page: {
    CANVAS_CONTAINER_ID: "canvasContainer",
    CANVAS_ID: "glCanvas",
  },

  /** GLSL shader values */
  shaders: {
    attributes: {
      VERTEX_POSITION: "aVertexPosition",
    },
    uniforms: {
      MODEL_VIEW_MATRIX: "uModelViewMatrix",
      PROJECTION_MATRIX: "uProjectionMatrix",
      POINT_SIZE: "pointSize",
      CLOCK: "clock",
      EYE_POSITION: "eye_position",
      VIEW_DISTANCE: "viewDistance",
    },
  },
};

export default config;
