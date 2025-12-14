/*
 * Contains visualization properties (SVG objects size, color, etc.)
 * Make sure to add the corresponding constants to the constant.js file
 */

/*
 * Widget
 */

const MAIN_SVG_WIDTH = 1000;
const MAIN_SVG_HEIGHT = 600;
const PSEUDOCODE_SVG_WIDTH = 300;
const PSEUDOCODE_SVG_HEIGHT = 400;

/*
* Color constants
*/
const COLOR_HIGHLIGHTED = "#ff8a27";
const COLOR_BLACK = "#000";

/*
 * GraphVertexState
 */
const graphVertexStateProperties = {
  [VERTEX_DEFAULT]: {
    "fill-color": "#eee",
    "stroke-color": "#333",
    "text-color": "#333"
  },
  [VERTEX_LEAF_DEFAULT]: {
    "fill-color": "#ff0",
    "stroke-color": "#333",
    "text-color": "#333"
  },
  [VERTEX_NORMAL_BLUE]: {
    "fill-color": "#2ebbd1",
    "stroke-color": "#333",
    "text-color": "#fff"
  },
  [VERTEX_NORMAL_GREEN]: {
    "fill-color": "#ff0",
    "stroke-color": "#333",
    "text-color": "#333"
  },
  [VERTEX_HIGHLIGHTED]: {
    "fill-color": "#ff8a27",
    "stroke-color": "#ff8a27",
    "text-color": "#fff"
  },
  // TODO: We should remove all [RECT] types and genericize this soon.
  [VERTEX_HIGHLIGHTED_RECT]: {
    "fill-color": "#ff8a27",
    "stroke-color": "#333",
    "text-color": "#fff"
  },
  [VERTEX_TRAVERSED]: {
    "fill-color": "#eee",
    "stroke-color": "#ff8a27",
    "text-color": "#ff8a27"
  },
  [VERTEX_RESULT]: {
    "fill-color": "#f7e81e",
    "stroke-color": "#f7e81e",
    "text-color": "#fff"
  },
  [VERTEX_RESULT_RECT]: {
    "fill-color": "#52bc69",
    "stroke-color": "#333",
    "text-color": "#fff"
  },
  [VERTEX_RECT]: {
    "fill-color": "#eee",
    "stroke-color": "#333",
    "text-color": "#333"
  },
  [VERTEX_BLUE_FILL]: {
    "fill-color": "#2ebbd1",
    "stroke-color": "#2ebbd1",
    "text-color": "#fff"
  },
  [VERTEX_BLUE_OUTLINE]: {
    "fill-color": "#eee",
    "stroke-color": "#2ebbd1",
    "text-color": "#2ebbd1"
  },
  [VERTEX_GREEN_FILL]: {
    "fill-color": "#52bc69",
    "stroke-color": "#52bc69",
    "text-color": "#fff"
  },
  [VERTEX_GREEN_OUTLINE]: {
    "fill-color": "#eee",
    "stroke-color": "#52bc69",
    "text-color": "#52bc69"
  },
  [VERTEX_GREY_FILL]: {
    "fill-color": "#cccccc",
    "stroke-color": "#cccccc",
    "text-color": "#fff"
  },
  [VERTEX_GREY_OUTLINE]: {
    "fill-color": "#eee",
    "stroke-color": "#cccccc",
    "text-color": "#cccccc"
  },
  [VERTEX_PINK_FILL]: {
    "fill-color": "#ed5a7d",
    "stroke-color": "#ed5a7d",
    "text-color": "#fff"
  },
  [VERTEX_PINK_OUTLINE]: {
    "fill-color": "#eee",
    "stroke-color": "#ed5a7d",
    "text-color": "#ed5a7d"
  },
  [VERTEX_RED_FILL]: {
    "fill-color": "#d9513c",
    "stroke-color": "#d9513c",
    "text-color": "#fff"
  },
  [VERTEX_RED_OUTLINE]: {
    "fill-color": "#eee",
    "stroke-color": "#d9513c",
    "text-color": "#d9513c"
  },
  [VERTEX_ORANGE_FILL]: {
    "fill-color": "#ffcc27",
    "stroke-color": "#ffcc27",
    "text-color": "#fff"
  },
  [VERTEX_ORANGE_OUTLINE]: {
    "fill-color": "#eee",
    "stroke-color": "#ffcc27",
    "text-color": "#ffcc27"
  },
  [VERTEX_PURPLE_FILL]: {
    "fill-color": "#8b00ff",
    "stroke-color": "#8b00ff",
    "text-color": "#fff"
  },
  [VERTEX_PURPLE_OUTLINE]: {
    "fill-color": "#eee",
    "stroke-color": "#8b00ff",
    "text-color": "#8b00ff"
  },
  [VERTEX_DARK_GREY_FILL]: {
    "fill-color": "#6c757d",
    "stroke-color": "#6c757d",
    "text-color": "#fff"
  },
  [VERTEX_DARK_GREY_OUTLINE]: {
    "fill-color": "#eee",
    "stroke-color": "#6c757d",
    "text-color": "#6c757d"
  },
};

/*
 * GraphVertexWidget
 */

const graphVertexCircleProperties = {
  "innerVertex": {
    "r": 14,
    "width": 0,
    "height": 0,
    "stroke-width": 0,
    "stroke": "#fff",
  },
  "outerVertex": {
    "r": 16,
    "width": 0,
    "height": 0,
    "stroke-width": 2
  },
  "text": {
    "font-size": 16,
    "font-sizes": [16, 16, 15, 13, 9, 9],
    "extra-text-size": 16,
    "font-family": "'PT Sans', sans-serif",
    "font-weight": "bold",
    "text-anchor": "middle"
  },
  "label": {
    "font-size": 16,
    "font-family": "'PT Sans', sans-serif",
    "font-weight": "bold",
    "text-anchor": "middle"
  }
};

const graphVertexRectProperties = {
  "innerVertex": {
    "r": 0,
    "width": 78,
    "height": 32,
    "stroke-width": 0,
    "stroke": "#fff",
  },
  "outerVertex": {
    "r": 0,
    "width": 80,
    "height": 34,
    "stroke-width": 2
  },
  "text": {
    "font-size": 16,
    "font-sizes": [16, 16, 15, 13, 9, 9],
    "extra-text-size": 16,
    "font-family": "'PT Sans', sans-serif",
    "font-weight": "bold",
    "text-anchor": "middle"
  },
  "label": {
    "font-size": 16,
    "font-family": "'PT Sans', sans-serif",
    "font-weight": "bold",
    "text-anchor": "middle"
  }
};

const graphVertexRectLongProperties = {
  "innerVertex": {
    "r": 0,
    "width": 198,
    "height": 32,
    "stroke-width": 0,
    "stroke": "#fff",
  },
  "outerVertex": {
    "r": 0,
    "width": 200,
    "height": 34,
    "stroke-width": 2
  },
  "text": {
    "font-size": 16,
    "font-sizes": [16, 16, 15, 13, 9, 9],
    "extra-text-size": 16,
    "font-family": "'PT Sans', sans-serif",
    "font-weight": "bold",
    "text-anchor": "middle"
  },
  "label": {
    "font-size": 16,
    "font-family": "'PT Sans', sans-serif",
    "font-weight": "bold",
    "text-anchor": "middle"
  }
};

const graphVertexSquareProperties = {
  "innerVertex": {
    "r": 0,
    "width": 32,
    "height": 32,
    "stroke-width": 0,
    "stroke": "#fff",
  },
  "outerVertex": {
    "r": 0,
    "width": 34,
    "height": 34,
    "stroke-width": 2
  },
  "text": {
    "font-size": 16,
    "font-sizes": [16, 16, 15, 13, 9, 9],
    "extra-text-size": 16,
    "font-family": "'PT Sans', sans-serif",
    "font-weight": "bold",
    "text-anchor": "middle"
  },
  "label": {
    "font-size": 16,
    "font-family": "'PT Sans', sans-serif",
    "font-weight": "bold",
    "text-anchor": "middle"
  }
}

const graphVertexProperties = {
  [VERTEX_SHAPE_CIRCLE]: graphVertexCircleProperties,
  [VERTEX_SHAPE_RECT]: graphVertexRectProperties,
  [VERTEX_SHAPE_RECT_LONG]: graphVertexRectLongProperties,
  [VERTEX_SHAPE_SQUARE]: graphVertexSquareProperties
};

const graphVertexCirclePropertiesMedium = { //medium scale
  "innerVertex": {
    "r": 0,
    "width": 0,
    "height": 0,
    "stroke-width": 0,
    "stroke": "#fff"
  },
  "outerVertex": {
    "r": 5,
    "width": 0,
    "height": 0,
    "stroke-width": 1,
  },
  "text": {
    "font-size": 0,
    "font-sizes": [0, 0, 0, 0, 0, 0],
    "extra-text-size": 10,
    "font-family": "'PT Sans', sans-serif",
    "font-weight": "bold",
    "text-anchor": "middle"
  },
  "label": {
    "font-size": 0,
    "font-family": "'PT Sans', sans-serif",
    "font-weight": "bold",
    "text-anchor": "middle"
  }
};

const graphVertexPropertiesMedium = {
  // We plan to phase this logic out eventually, so no implementations for other shapes.
  [VERTEX_SHAPE_CIRCLE]: graphVertexCirclePropertiesMedium
};

/*
 * GraphEdgeWidget
 */
const offsets = 5
const startOffset = "75%"
const graphEdgeProperties = {
  "animateHighlightedPath": {
    "stroke": "#ff8a27",
    "stroke-width": 5,
    "fill": "transparent"
  },
  "path": {
    "stroke-width": 3,
    "default": {
      "stroke": "#333",
      "fill": "transparent"
    },
    "highlighted": {
      "stroke": "#ff8a27",
      "fill": "transparent"
    },
    "traversed": {
      "stroke": "#ff8a27",
      "fill": "transparent"
    },
    "green": {
      "stroke": "#52bc69",
      "fill": "transparent"
    },
    "pink": {
      "stroke": "#ed5a7d",
      "fill": "transparent"
    },
    "blue": {
      "stroke": "#2ebbd1",
      "fill": "transparent"
    },
    "red": {
      "stroke": "#d9513c",
      "fill": "transparent"
    },
    "grey": {
      "stroke": "#cccccc",
      "fill": "transparent"
    }
  },
  "weight": {
    "font-size": 16,
    "default": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#333",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "highlighted": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#ff8a27",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "traversed": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#ff8a27",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "purple": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#8b00ff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "green": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#52bc69",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "pink": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#ed5a7d",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "blue": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#2ebbd1",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "red": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#d9513c",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "grey": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#cccccc",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    }
  }
};

const graphEdgePropertiesMedium = {
  "animateHighlightedPath": {
    "stroke": "#ff8a27",
    "stroke-width": 5,
    "fill": "transparent"
  },
  "path": {
    "stroke-width": 2,
    "default": {
      "stroke": "#333",
      "fill": "transparent"
    },
    "highlighted": {
      "stroke": "#ff8a27",
      "fill": "transparent"
    },
    "traversed": {
      "stroke": "#ff8a27",
      "fill": "transparent"
    },
    "green": {
      "stroke": "#52bc69",
      "fill": "transparent"
    },
    "pink": {
      "stroke": "#ed5a7d",
      "fill": "transparent"
    },
    "blue": {
      "stroke": "#2ebbd1",
      "fill": "transparent"
    },
    "red": {
      "stroke": "#d9513c",
      "fill": "transparent"
    },
    "grey": {
      "stroke": "#cccccc",
      "fill": "transparent"
    }
  },
  "weight": {
    "font-size": 11,
    "default": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#333",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "highlighted": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#ff8a27",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "traversed": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#ff8a27",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "purple": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#8b00ff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "green": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#52bc69",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "pink": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#ed5a7d",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "blue": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#2ebbd1",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "red": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#d9513c",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "grey": {
      "startOffset": startOffset,
      "dy": -offsets,
      "fill": "#cccccc",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    }
  }
}

/*
 * GraphPolygonWidget
 */

const graphPolygonProperties = {
  "polygon": {
    "stroke-width": 0,
    "default": {
      "fill": "#eee",
      "opacity": 1.0
    },
    "hidden": {
      "fill": "#fff",
      "opacity": 0.0
    },
    "purpleFill": {
      "fill": "#8b00ff",
      "opacity": 1.0
    },
    "purpleTransparent": {
      "fill": "#8b00ff",
      "opacity": 0.5
    },
    "greenFill": {
      "fill": "#52bc69",
      "opacity": 1.0
    },
    "greenTransparent": {
      "fill": "#52bc69",
      "opacity": 0.5
    },
    "pinkFill": {
      "fill": "#ed5a7d",
      "opacity": 1.0
    },
    "pinkTransparent": {
      "fill": "#ed5a7d",
      "opacity": 0.5
    },
    "blueFill": {
      "fill": "#2ebbd1",
      "opacity": 1.0
    },
    "blueTransparent": {
      "fill": "#2ebbd1",
      "opacity": 0.5
    },
    "redFill": {
      "fill": "#d9513c",
      "opacity": 1.0
    },
    "orangeFill": {
      "fill": "#ffcc27",
      "opacity": 1.0
    },
    "orangeTransparent": {
      "fill": "#ffcc27",
      "opacity": 0.5
    },
    "redTransparent": {
      "fill": "#d9513c",
      "opacity": 0.5
    },
    "greyFill": {
      "fill": "#cccccc",
      "opacity": 1.0
    },
    "greyTransparent": {
      "fill": "#cccccc",
      "opacity": 0.5
    }
  }
};

/*
 * GraphTextWidget
 */
const graphTextProperties = {
  "text": {
    "fill": "#333",
    "font-size": 16,
    "font-sizes": [16, 16, 15, 13, 9, 9],
    "extra-text-size": 16,
    "default": {
      "fill": "#333",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "leaf-default": {
      "fill": "#333",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "lazy": {
      "fill": "#ffffff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "leaf-lazy": {
      "fill": "#ffffff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "normal_blue": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "highlighted": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "highlighted_rect": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "left"
    },
    "traversed": {
      "fill": "#ff8a27",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "result": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "rect": {
      "fill": "#333",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "left"
    },
    "result_rect": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "left"
    },
    "purpleFill": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "purpleOutline": {
      "fill": "#8b00ff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "greenFill": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "greenOutline": {
      "fill": "#52bc69",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "pinkFill": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "pinkOutline": {
      "fill": "#ed5a7d",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "blueFill": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "blueOutline": {
      "fill": "#2ebbd1",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "redFill": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "orangeFill": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "redOutline": {
      "fill": "#d9513c",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "greyFill": {
      "fill": "#fff",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    },
    "greyOutline": {
      "fill": "#cccccc",
      "font-family": "'PT Sans', sans-serif",
      "font-weight": "bold",
      "text-anchor": "middle"
    }
  },
};

/*
 * marker.js
 * Currently this file doesn't exist; markers are placed in GraphEdgeWidget.js
 */

const ARROW_MARKER_WIDTH = 3;
const ARROW_MARKER_HEIGHT = 3;
const ARROW_REFX = 9;
const ARROW_FILL = "#333";
