export default {
  page: {
    CANVAS_CONTAINER_ID: "canvasContainer",
    CANVAS_ID: "glCanvas",
  },
  shaders: {
    attributes: {
      VERTEX_POSITION: "aVertexPosition",
    },
    uniforms: {
      MODEL_VIEW_MATRIX: "uModelViewMatrix",
      PROJECTION_MATRIX: "uProjectionMatrix",
      POINT_SIZE: "pointSize",
      CLOCK: "clock",
    },
  },
};
