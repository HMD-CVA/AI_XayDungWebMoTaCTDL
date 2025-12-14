// first starting author: Koh Zi Chun
// add keyboard shortcut for animation

// Ivan: Most (if not all) functions will be changed to accomodate new library (D3.js)
//       Only the algorithm & high-level design will be retained

/*
 * TODO: Currently animation stuffs (play, pause, etc.) is tied to GraphWidget,
 *       which means visualizations notated to graphs cannot be animated
 *       Think of a way to separate the functions, preferably to another object
 *       (perhaps to the currently stub Widget.js?)
 *
 * TODO: There's currently GraphDSWidget.js built on top of this file which allows graph drawing
 *       Make graph drawing capabilities one of the backend library to allow visualizations
 *       requiring drawing capabilities to be built on it
 */

const GRAPH_WIDGET_DEFAULT_VIEWBOX = Object.freeze({
  minX: 0,
  maxX: MAIN_SVG_WIDTH,
  minY: 0,
  maxY: MAIN_SVG_HEIGHT
});

// Note that the readjustOnUpdate flag only applies when [updateGraph]
// is called for optimization purposes.
const GRAPH_WIDGET_DEFAULT_VIEWBOX_READJUSTMENT_CONFIG = Object.freeze({
  readjustOnUpdate: false,
  readjustOnAnimationStart: false,
  leftX: 200,
  rightX: 200,
  topY: 100,
  bottomY: 100
});

// Just a useful utility function.
const nullish_max = (x, y) => {
  if (x === null || x === undefined) return y;
  if (y === null || y === undefined) return x;
  return Math.max(x, y);
}

const nullish_min = (x, y) => {
  if (x === null || x === undefined) return y;
  if (y === null || y === undefined) return x;
  return Math.min(x, y);
}

const coerceDictionaries = function (current, def) {
  if (current === undefined || current === null) return def;
  return { ...def, ...current };
}

var GraphWidget = function (
  isMediumScale = false,
  showVertexNumInMediumScale = false,
  defaultViewbox = undefined,
  viewboxReadjustmentConfig = undefined) {

  defaultViewbox = coerceDictionaries(defaultViewbox, GRAPH_WIDGET_DEFAULT_VIEWBOX);
  viewboxReadjustmentConfig = coerceDictionaries(viewboxReadjustmentConfig, GRAPH_WIDGET_DEFAULT_VIEWBOX_READJUSTMENT_CONFIG);

  var self = this;
  var textList = {};
  var vertexList = {};
  var edgeList = {};
  var polygonList = {};
  var textUpdateList = {};
  var vertexUpdateList = {};
  var edgeUpdateList = {};
  var polygonUpdateList = {};

  var isMediumScale = isMediumScale;
  var isTreePage = false;
  var isConvexHullPage = false;
  var showVertexNumInMediumScale = showVertexNumInMediumScale;

  var currentIteration = NO_ITERATION;
  var animationStateList = NO_STATELIST;
  var animationStatus = ANIMATION_STOP;

  var animationDuration = 500; // Original value is 500, changed for testing
  var scaleFactor = 0.5;
  var anchorSet = false;

  /**
   * Readjusts the viewbox based on the viewbox configuration, an object containing
   * the following parameters:
   * 
   * @param {*} minX x-coordinate of the top left corner.
   * @param {*} minY y-coordinate of the top left corner.
   * @param {*} maxX x-coordinate of the bottom-right corner.
   * @param {*} maxY y-coordinate of the bottom-right corner.
   */
  this.readjustViewbox = function (viewboxConfig) {
    let { minX, minY, maxX, maxY } = viewboxConfig;
    mainSvg.attr("viewBox", [minX, minY, maxX - minX, maxY - minY].join(" "));
  }

  // On construction, immediately adjust viewbox to the given default viewbox.
  this.readjustViewbox(defaultViewbox);

  /**
   * Returns the viewbox as an object containing {minX, minY, maxX, maxY}.
   * Definitions follow {this.readjustViewbox}.
   */
  this.getViewbox = function () {
    let [minX, minY, widthX, widthY] = mainSvg.attr("viewBox").split(" ").map((x) => parseInt(x));
    return {
      minX,
      minY,
      maxX: minX + widthX,
      maxY: minY + widthY
    };
  }

  this.clearAll = function () {
    if (mainSvg.select("#polygon").empty())
      polygonSvg = mainSvg.append("g").attr("id", "polygon2");
    if (mainSvg.select("#edge").empty())
      edgeSvg = mainSvg.append("g").attr("id", "edge");
    if (mainSvg.select("#vertex").empty())
      vertexSvg = mainSvg.append("g").attr("id", "vertex");
    if (mainSvg.select("#vertexText").empty())
      vertexTextSvg = mainSvg.append("g").attr("id", "vertexText");
    if (mainSvg.select("#edgeWeight").empty())
      edgeWeightSvg = mainSvg.append("g").attr("id", "edgeWeight");
    if (mainSvg.select("#edgeExtraText").empty())
      edgeExtraTextSvg = mainSvg.append("g").attr("id", "edgeExtraText");
    if (mainSvg.select("#edgeWeightPath").empty())
      edgeWeightPathSvg = mainSvg.append("g").attr("id", "edgeWeightPath");
    if (mainSvg.select("#marker").empty())
      markerSvg = mainSvg.append("g").attr("id", "marker");
    if (mainSvg.select("#text").empty())
      markerSvg = mainSvg.append("g").attr("id", "text");
    if (mainSvg.select("#hovertext").empty())
      markerSvg = mainSvg.append("g").attr("id", "hovertext");
  }

  self.clearAll();

  this.addText = function (x, y, text, textIdNumber, show, colour = "#333") {
    var newText = new GraphTextWidget(x, y, text, textIdNumber, colour);

    textList[textIdNumber] = newText;
    textUpdateList[textIdNumber] = false;

    if (show == true) {
      textList[textIdNumber].showText();
      textList[textIdNumber].redraw();
    }

    return newText;
  }

  // Show: true means the element will immediately appear on the html page
  //       false means the element will remain hidden until told to appear
  // Duration: duration of the show animation, only used when show is true

  // Adds a CIRCLE vertex
  // TODO: Merge with addRectVertex
  this.addVertex = function (cx, cy, vertexText, vertexClassNumber, show, extraText) {
    if (show != false) show = true;

    var newVertex = new GraphVertexWidget(cx, cy, VERTEX_SHAPE_CIRCLE, vertexText, vertexClassNumber, isMediumScale, showVertexNumInMediumScale);
    if (extraText != "") newVertex.changeExtraText(extraText);

    vertexList[vertexClassNumber] = newVertex;
    vertexUpdateList[vertexClassNumber] = false;

    if (show == true) {
      vertexList[vertexClassNumber].showVertex();
      vertexList[vertexClassNumber].redraw();
    }
  }

  // Adds a RECTANGULAR vertex
  // TODO: Merge with addVertex
  // rx = horizontal position (left = 0), ry = vertical position (top = 0)
  this.addRectVertex = function (rx, ry, vertexText, vertexClassNumber, show, rect_type, extraText = "") {
    if (show != false) show = true;

    if (typeof (rect_type) == "undefined") rect_type = VERTEX_SHAPE_RECT;
    var newVertex = new GraphVertexWidget(rx, ry, rect_type, vertexText, vertexClassNumber, isMediumScale, showVertexNumInMediumScale);
    if (extraText != "") newVertex.changeExtraText(extraText);
    vertexList[vertexClassNumber] = newVertex;
    vertexUpdateList[vertexClassNumber] = false;

    if (show == true) {
      vertexList[vertexClassNumber].showVertex();
      vertexList[vertexClassNumber].redraw();
    }
    return newVertex;
  }

  // Default for weight is 1 and for type is EDGE_TYPE_UDE
  this.addEdge = function (vertexClassA, vertexClassB, edgeIdNumber, type, weight, show, showWeight, marker_position, strokeWidth, curveHeight) {
    try {
      if (show != false) show = true;
      if (showWeight != true) showWeight = false;
      if (type == null || isNaN(type)) type = EDGE_TYPE_UDE;
      if (weight == null || isNaN(weight)) weight = 1;
      if (strokeWidth == null || isNaN(strokeWidth)) strokeWidth = 3;
      if (curveHeight == null) curveHeight = 0;
      var vertexA = vertexList[vertexClassA];
      var vertexB = vertexList[vertexClassB];
      var newEdge = new GraphEdgeWidget(vertexA, vertexB, edgeIdNumber, type, weight, isMediumScale, marker_position, strokeWidth, curveHeight);

      edgeList[edgeIdNumber] = newEdge;
      edgeUpdateList[edgeIdNumber] = false;

      vertexList[vertexClassA].addEdge(newEdge);
      vertexList[vertexClassB].addEdge(newEdge);

      if (show == true) {
        edgeList[edgeIdNumber].showEdge();
        if (showWeight == true)
          edgeList[edgeIdNumber].showWeight();
        edgeList[edgeIdNumber].redraw();
      }
      return newEdge;
    }
    catch (err) {
    }
  }

  this.removeText = function (textIdNumber) {
    if (textList[textIdNumber] == null || textList[textIdNumber] == undefined) return;
    textList[textIdNumber].removeText();
    delete textList[textIdNumber];
    delete textUpdateList[textIdNumber];
  }

  this.removeEdge = function (edgeIdNumber) {
    if (edgeList[edgeIdNumber] == null || edgeList[edgeIdNumber] == undefined) return;
    edgeList[edgeIdNumber].removeEdge();
    delete edgeList[edgeIdNumber];
    delete edgeUpdateList[edgeIdNumber];
  }

  // Edges are assumed to have been removed
  this.removeVertex = function (vertexClassNumber) {
    if (vertexList[vertexClassNumber] == null || vertexUpdateList[vertexClassNumber] == undefined) return;
    vertexList[vertexClassNumber].removeVertex();
    delete vertexList[vertexClassNumber];
    delete vertexUpdateList[vertexClassNumber];
  }

  this.addPolygon = function (polygonId, pointList, show) {
    if (show != false) show = true;

    var newPolygon = new GraphPolygonWidget(polygonId, pointList);

    polygonList[polygonId] = newPolygon;
    polygonUpdateList[polygonId] = false;

    if (show == true) {
      polygonList[polygonId].showPolygon();
      polygonList[polygonId].redraw();
    }
  }

  this.removePolygon = function (polygonId) {
    if (polygonList[polygonId] == null || polygonUpdateList[polygonId] == undefined) return;

    polygonList[polygonId].removePolygon();
    delete polygonList[polygonId];
    delete polygonUpdateList[polygonId];
  }

  // graphState object is equivalent to one element of the statelist.
  // See comments below this function
  this.updateGraph = function (graphState, duration) {
    if (duration == null || isNaN(duration)) duration = animationDuration;
    updateDisplay(graphState, duration);
    if (viewboxReadjustmentConfig.readjustOnUpdate) {
      this.readjustViewboxUsingVertices();
    }
  }

  /**
   * Uses the vertices currently on the graph to rescale the viewbox accordingly.
   * If no configuration is provided, the configuration given in the constructor
   * will be utilized instead. If provided, the configuration should have the following
   * 4-parameters:
   * 
   * @param {*} leftX additional padding on the left.
   * @param {*} rightX additional padding on the right.
   * @param {*} topY additional padding on the top.
   * @param {*} bottomY additional padding on the bottom.
   */
  this.readjustViewboxUsingVertices = function (adjustmentConfig) {
    if (adjustmentConfig === undefined) {
      adjustmentConfig = viewboxReadjustmentConfig;
    }
    let { leftX, rightX, topY, bottomY } = adjustmentConfig;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let key in vertexList) {
      if (vertexList[key].isHidden()) continue;
      let x = vertexList[key].getAttributes()["outerVertex"]["cx"];
      let y = vertexList[key].getAttributes()["outerVertex"]["cy"];
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    // If vertex list is empty, put something by default so the svg does not glitch out.
    if (minX == Infinity || maxX == -Infinity || minY == Infinity || maxY == -Infinity) {
      minX = leftX; maxX = MAIN_SVG_WIDTH - rightX;
      minY = topY; maxY = MAIN_SVG_HEIGHT - bottomY;
    }

    minX -= leftX;
    maxX += rightX;
    minY -= topY;
    maxY += bottomY;

    this.readjustViewbox({ minX, minY, maxX, maxY });
  }

  /**
   * Uses the passed statelist to rescale the viewbox accordingly.
   * If no configuration is provided, the configuration given in the constructor
   * will be utilized instead. If provided, the configuration should have the following
   * 4-parameters:
   * 
   * @param {*} leftX additional padding on the left.
   * @param {*} rightX additional padding on the right.
   * @param {*} topY additional padding on the top.
   * @param {*} bottomY additional padding on the bottom.
   */
  this.readjustViewboxUsingStatelist = function (stateList, adjustmentConfig) {
    if (adjustmentConfig === undefined) {
      adjustmentConfig = viewboxReadjustmentConfig;
    }
    let { leftX, rightX, topY, bottomY } = adjustmentConfig;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let state of stateList) {
      if (!("vl" in state)) continue;
      for (let key in state["vl"]) {
        if (state["vl"][key]["state"] === OBJ_HIDDEN) continue;
        minX = [state["vl"][key]["cx"], state["vl"][key]["x"]].reduce(nullish_min, minX);
        maxX = [state["vl"][key]["cx"], state["vl"][key]["x"]].reduce(nullish_max, maxX);
        minY = [state["vl"][key]["cy"], state["vl"][key]["y"]].reduce(nullish_min, minY);
        maxY = [state["vl"][key]["cy"], state["vl"][key]["y"]].reduce(nullish_max, maxY);
      }
    }

    // If the statelist is empty, put something by default so the svg does not glitch out.
    if (minX == Infinity || maxX == -Infinity || minY == Infinity || maxY == -Infinity) {
      minX = leftX; maxX = MAIN_SVG_WIDTH - rightX;
      minY = topY; maxY = MAIN_SVG_HEIGHT - bottomY;
    }

    minX -= leftX;
    maxX += rightX;
    minY -= topY;
    maxY += bottomY;

    this.readjustViewbox({ minX, minY, maxX, maxY });
  }

  /*
   * stateList: List of JS object containing the states of the objects in the graph
   * Structure of stateList: List of JS object with the following keys and values:
   *                            - vl: JS object with vertex ID as keys and corresponding state positions and constants as value (NEW: another extra text)
   *                            - el: JS object with edge ID as keys and corresponding state connections constants as value
   *
   * Objects not present in the i-th iteration stateList will be hidden until the animation stops, where it will be removed
   * New objects present in the i-th iteration stateList will be automatically created
   *
   * State 0 should be the initial state, last state should be the end state
   */

  /*
   * Contents of "vl":
   * - cx
   * - cy
   * - text
   * - state
   *
   * Optional contents of "vl":
   * - inner-r  : Customize the vertex's inner radius!
   * - outer-r  : Customize the vertex's outer radius!
   * - inner-w  : Customize the vertex's inner width!
   * - outer-w  : Customize the vertex's outer width!
   * - inner-h  : Customize the vertex's inner height!
   * - outer-h  : Customize the vertex's outer height!
   * - inner-stroke-width : Customize the vertex's inner stroke width!
   * - outer-stroke-width : Customize the vertex's outer stroke width!
   * - text-font-size : Customize the vertex text's font size!
   * - extratext : Add a red extra text below each vertex
   * - hovertext : Add a tooltip which displays the text on mouse over;
   * - mouseover : A callable function which triggers when the cursor hovers over the vertex;
   * - mousemove : A callable function which triggers when the cursor moves (and stays) within the vertex;
   * - mouseleave : A callable function which triggers when the cursor leaves the vertex;
   */

  /*
   * Contents of "el":
   * - vertexA: id of vertex A
   * - vertexB: id of vertex B
   * - type
   * - weight
   * - state  : Display state
   * - animateHighlighted : Determines whether highlighted animation should be played. True or false
   *
   * Optional contents of "el":
   * - displayWeight  : Determines whether weight should be shown. True or false
   * - stroke-width   : Customize the edge's stroke width
   */

  /*
   * Notes:
   * - Vertex's elements will only affect vertexes that has that element
   *   (example: radius will only affect circular vertex, width and height will only affect rectangular vertex)
   *   Think of each vertex as an SVG element and see which components are present
   * - The optional contents has to be defined for EACH state objects
   *   For example, if you define a custom radius in state 1 and didn't define it in state 2,
   *   the vertex will revert to default radius upon reaching state 2
   */

  this.startAnimation = function (stateList, callback) {
    anchorSet = false;
    if (stateList != null) animationStateList = stateList;
    currentIteration = 0;

    if (viewboxReadjustmentConfig.readjustOnAnimationStart) {
      this.readjustViewboxUsingStatelist(stateList);
    }

    self.play(callback);
  }

  this.animate = function (callback) {
    if (currentIteration >= animationStateList.length && animationStatus != ANIMATION_STOP) animationStatus = ANIMATION_PAUSE;
    if (currentIteration == animationStateList.length - 1) {
      if (typeof callback === 'function') callback();
    }
    if (animationStatus == ANIMATION_PAUSE || animationStatus == ANIMATION_STOP) return;
    self.next(animationDuration);
    setTimeout(function () {
      self.animate(callback);
    }, animationDuration);
  }

  this.play = function (callback) {
    if (currentIteration < 0) currentIteration = 0;

    if (animationStatus == ANIMATION_STOP) {
      animationStatus = ANIMATION_PLAY;
      updateDisplay(animationStateList[currentIteration], animationDuration);
      setTimeout(function () {
        self.animate(callback);
      }, animationDuration);
    }
    else {
      animationStatus = ANIMATION_PLAY;
      self.animate(callback);
    }
  }

  this.pause = function () {
    animationStatus = ANIMATION_PAUSE;
  }

  this.stop = function () {
    self.jumpToIteration(animationStateList.length - 1, 0);

    currentIteration = animationStateList.length - 1;
    animationStatus = ANIMATION_STOP;

    var currentVertexState = animationStateList[currentIteration]["vl"];
    var currentEdgeState = animationStateList[currentIteration]["el"];

    var key;
    for (key in currentEdgeState) edgeUpdateList[key] = true;

    for (key in edgeUpdateList)
      if (edgeUpdateList[key] == false)
        self.removeEdge(key);

    for (key in currentVertexState) vertexUpdateList[key] = true;

    for (key in vertexUpdateList)
      if (vertexUpdateList[key] == false)
        self.removeVertex(key);

    for (key in edgeUpdateList) edgeUpdateList[key] = false;

    for (key in vertexUpdateList) vertexUpdateList[key] = false;

    animationStateList = NO_STATELIST;
    currentIteration = NO_ITERATION;
  }

  this.next = function (duration) {
    if (currentIteration < 0) currentIteration = 0;
    currentIteration++;
    if (currentIteration >= animationStateList.length) {
      currentIteration = animationStateList.length - 1;
      return;
    }
    updateDisplay(animationStateList[currentIteration], duration);
  }

  this.previous = function (duration) {
    if (currentIteration >= animationStateList.length) currentIteration = animationStateList.length - 1;
    currentIteration--;
    if (currentIteration < 0) return;
    updateDisplay(animationStateList[currentIteration], duration);
  }

  this.forceNext = function (duration) {
    self.pause();
    self.next(duration);
  }

  this.forcePrevious = function (duration) {
    self.pause();
    self.previous(duration);
  }

  this.jumpToIteration = function (iteration, duration) {
    currentIteration = iteration;
    if (currentIteration >= animationStateList.length) currentIteration = animationStateList.length - 1;
    if (currentIteration < 0) currentIteration = 0;
    updateDisplay(animationStateList[currentIteration], duration);
  }

  this.replay = function () {
    self.jumpToIteration(0, 0);
    setTimeout(function () {
      self.play()
    }, 500);
  }

  this.getCurrentIteration = function () {
    return currentIteration;
  }

  this.getTotalIteration = function () {
    return Object.keys(animationStateList).length;
  }

  this.getAnimationDuration = function () {
    return animationDuration;
  }

  // Get the current state object of the animation. Useful to reproduce the graph.
  // DO NOT CALL THIS FUNCTION WHEN ANIMATION IS NOT STARTED YET
  this.getCurrentState = function () {
    return animationStateList[currentIteration];
  }

  this.setAnimationDuration = function (duration) {
    animationDuration = duration;
  }

  this.removeAll = function () {
    var key;
    for (key in textList)
      textList[key].removeText();
    for (key in edgeList)
      edgeList[key].removeEdge();
    for (key in vertexList)
      vertexList[key].removeVertex();
    for (key in polygonList)
      polygonList[key].removePolygon();

    textList = {};
    edgeList = {};
    vertexList = {};
    polygonList = {};

    textUpdateList = {};
    vertexUpdateList = {};
    edgeUpdateList = {};
    polygonUpdateList = {};
  }

  this.redrawAllForMediumScale = function (isTree = false, isConvexHull = false) {

    this.clearAll();

    var key;
    var factorY = isMediumScale ? 2 : 0.5;
    var factorX = factorY;
    if (isTree) {
      factorX = 1;
      factorY = 1;
      isTreePage = true;
    }

    if (isConvexHull) {
      isConvexHullPage = true;
    }

    this.resizeEdges(factorX, factorY);

    for (key in textList)
      textList[key].toggleLOD();
    for (key in vertexList)
      vertexList[key].toggleLOD();
    for (key in edgeList)
      edgeList[key].toggleLOD();

    if (viewboxReadjustmentConfig.readjustOnUpdate) {
      this.readjustViewboxUsingVertices();
    }
  }

  this.setMediumScale = function (scale) { // scale here is a boolean
    isMediumScale = scale;
  }

  this.isMediumScale = function () {
    return isMediumScale;
  }

  this.toggleVertexNumber = function () {
    if (isMediumScale)
      for (key in vertexList)
        vertexList[key].toggleVertexNumber();
  }

  this.resizeEdges = function (factorX, factorY) {
    // select v0
    // calculate distances of all other vertices relative to v0
    // shrink by a factor (to be tested to find optimal shrinking factor)
    // save original positions somewhere for reverting?

    // Set the screen anchor to minimize to the first quadrant
    var anchorX = 50;
    var anchorY = 50;

    var key;
    var oldX;
    var oldY;
    var newX;
    var newY;
    // var firstIteration = true;
    for (key in vertexList) {
      // if (firstIteration) {
      //   anchorX = vertexList[key].getAttributes()["outerVertex"]["cx"];
      //   anchorY = vertexList[key].getAttributes()["outerVertex"]["cy"];
      //   firstIteration = false;
      // }
      oldX = vertexList[key].getAttributes()["outerVertex"]["cx"];
      oldY = vertexList[key].getAttributes()["outerVertex"]["cy"];
      newX = anchorX + (oldX - anchorX) * factorX;
      newY = anchorY + (oldY - anchorY) * factorY;
      vertexList[key].moveVertex(newX, newY);
      vertexList[key].setVertexLocation(newX, newY);
    }
  }

  function updateDisplayForVertices(currentVertexState, duration) {
    // Set the screen anchor to minimize to the first quadrant
    anchorSet = true;
    var key;
    var anchorX = 50;
    var anchorY = 50;
    for (key in currentVertexState) {

      if (!anchorSet && isMediumScale) {
        anchorX = currentVertexState[key]["cx"];
        anchorY = currentVertexState[key]["cy"];
        anchorSet = true;
      }

      if (vertexList[key] == null || vertexList[key] == undefined) {
        let shape = currentVertexState[key]["shape"];
        if (shape === VERTEX_SHAPE_RECT
          || shape === VERTEX_SHAPE_RECT_LONG
          || shape === VERTEX_SHAPE_SQUARE) {
          self.addRectVertex(
            currentVertexState[key]["cx"],
            currentVertexState[key]["cy"],
            currentVertexState[key]["text"],
            key,
            false,
            shape,
            currentVertexState[key]["extratext"]
          );
        } else if (isMediumScale && !isTreePage) {
          self.addVertex(
            anchorX + (currentVertexState[key]["cx"] - anchorX) * scaleFactor,
            anchorY + (currentVertexState[key]["cy"] - anchorY) * scaleFactor,
            currentVertexState[key]["text"],
            key, false
          );
        } else {
          self.addVertex(
            // TODO: test if putting a global multiplier here to account for medium scale works properly
            currentVertexState[key]["cx"],
            currentVertexState[key]["cy"],
            currentVertexState[key]["text"],
            key, false
          );
        }
      }

      var currentVertex = vertexList[key];
      currentVertex.showVertex();

      if (currentVertexState[key]["state"] == OBJ_HIDDEN)
        currentVertex.hideVertex();
      else if (currentVertexState[key]["state"] != null)
        currentVertex.stateVertex(currentVertexState[key]["state"]);
      else
        currentVertex.stateVertex(VERTEX_DEFAULT);

      currentVertex.moveVertex(currentVertexState[key]["cx"], currentVertexState[key]["cy"]);

      // the redundant moveVertex in Medium Scale visualisations is to ensure the graph
      // doesn't continuously shrink as iterations go by.
      if (!anchorSet && isMediumScale) {
        anchorX = currentVertex.getAttributes()["outerVertex"]["cx"];
        anchorY = currentVertex.getAttributes()["outerVertex"]["cy"];
        anchorSet = true;
      }
      if (isMediumScale && !isTreePage) {
        var oldX = currentVertex.getAttributes()["outerVertex"]["cx"];
        var oldY = currentVertex.getAttributes()["outerVertex"]["cy"];
        var newX = anchorX + (oldX - anchorX) * scaleFactor;
        var newY = anchorY + (oldY - anchorY) * scaleFactor;
        if (!isConvexHullPage) {
          currentVertex.moveVertex(newX, newY);
        }
      }

      if (currentVertexState[key]["state"] != OBJ_HIDDEN)
        currentVertex.changeText(currentVertexState[key]["text"]);
      if (currentVertexState[key]["text-font-size"] != null)
        currentVertex.changeTextFontSize(currentVertexState[key]["text-font-size"]);
      if (currentVertexState[key]["inner-r"] != null && currentVertexState[key]["outer-r"] != null)
        currentVertex.changeRadius(currentVertexState[key]["inner-r"], currentVertexState[key]["outer-r"]);
      if (currentVertexState[key]["inner-w"] != null && currentVertexState[key]["outer-w"] != null)
        currentVertex.changeWidth(currentVertexState[key]["inner-w"], currentVertexState[key]["outer-w"]);
      if (currentVertexState[key]["inner-h"] != null && currentVertexState[key]["outer-h"] != null)
        currentVertex.changeHeight(currentVertexState[key]["inner-h"], currentVertexState[key]["outer-h"]);
      if (currentVertexState[key]["inner-stroke-width"] != null && currentVertexState[key]["outer-stroke-width"] != null)
        currentVertex.changeStrokeWidth(currentVertexState[key]["inner-stroke-width"], currentVertexState[key]["outer-stroke-width"]);

      if (currentVertexState[key]["extratext"] == null)
        currentVertex.changeExtraText("");
      else
        currentVertex.changeExtraText(currentVertexState[key]["extratext"]);

      if (currentVertexState[key]["extratext-position"] != null)
        currentVertex.changeExtraTextPosition(currentVertexState[key]["extratext-position"]);
      // Not necessarily clear semantics, but this is the most sane default 
      // that agrees with prior implementations
      else
        currentVertex.changeExtraTextPosition(GraphVertexExtratextPosition.BOTTOM);

      if (currentVertexState[key]["extratext-font-size"] != null)
        currentVertex.changeExtraTextFontSize(currentVertexState[key]["extratext-font-size"]);

      // should be callables or null (null = do nothing)
      let mouseOver = currentVertexState[key]["mouseover"];
      let mouseMove = currentVertexState[key]["mousemove"];
      let mouseLeave = currentVertexState[key]["mouseleave"];
      if (currentVertexState[key]["hovertext"] != null) {
        // if text is available just add text hover tooltip
        currentVertex.addHoverText(currentVertexState[key]["hovertext"], mouseOver, mouseMove, mouseLeave);
      } else {
        // need to define functions for hover behaviour per state;
        currentVertex.addMouseOverBehaviour(mouseOver, mouseMove, mouseLeave);
      }
      currentVertex.redraw(duration);
      vertexUpdateList[key] = true;
    }

    for (key in vertexUpdateList) {
      if (vertexUpdateList[key] == false) {
        vertexList[key].hideVertex();
        vertexList[key].redraw(duration);
        vertexUpdateList[key] = true;
      }
    }

    for (key in vertexUpdateList) vertexUpdateList[key] = false;
  }

  this.getEdgeList = function () { return edgeList; }

  function updateDisplayForEdges(currentEdgeState, duration) {
    var key;

    for (key in currentEdgeState) { // currentEdgeState[key] gives the state of the specific edge

      // this edge has not been seen before (could be newly created)
      if (edgeList[key] === null || edgeList[key] === undefined)
        self.addEdge(currentEdgeState[key]["vertexA"], currentEdgeState[key]["vertexB"], key, currentEdgeState[key]["type"], currentEdgeState[key]["weight"], false);

      var currentEdge = edgeList[key];
      currentEdge.showEdge();

      if (currentEdgeState[key]["state"] == OBJ_HIDDEN)
        currentEdge.hideEdge();
      else if (currentEdgeState[key]["state"] != null)
        currentEdge.stateEdge(currentEdgeState[key]["state"]);
      else
        currentEdge.stateEdge(EDGE_DEFAULT);

      currentEdge.hideWeight();
      if (currentEdgeState[key]["state"] != OBJ_HIDDEN && currentEdgeState[key]["displayWeight"] != null && currentEdgeState[key]["displayWeight"])
        currentEdge.showWeight();

      currentEdge.changeVertexA(vertexList[currentEdgeState[key]["vertexA"]]);
      currentEdge.changeVertexB(vertexList[currentEdgeState[key]["vertexB"]]);
      if (currentEdgeState[key]["type"] == null)
        currentEdgeState[key]["type"] = EDGE_TYPE_UDE;
      currentEdge.changeType(currentEdgeState[key]["type"]);
      if (currentEdgeState[key]["weight"] != null)
        currentEdge.changeWeight(currentEdgeState[key]["weight"]);
      if (currentEdgeState[key]["stroke-width"] != null)
        currentEdge.changeStrokeWidth(currentEdgeState[key]["stroke-width"]);
      if (currentEdgeState[key]["curve-height"] != null)
        currentEdge.changeCurveHeight(currentEdgeState[key]["curve-height"]);
      currentEdge.refreshPath();
      if (currentEdgeState[key]["animateHighlighted"] == null || !currentEdgeState[key]["animateHighlighted"])
        currentEdge.redraw(duration);
      else
        currentEdge.animateHighlighted(duration * 0.9);

      edgeUpdateList[key] = currentEdgeState[key]["state"] !== OBJ_HIDDEN;
    }

    for (key in edgeUpdateList) {
      if (edgeUpdateList[key] == false) {
        edgeList[key].hideWeight(); // this is the dangling one?
        edgeList[key].hideEdge();
        edgeList[key].redraw(duration);
        edgeUpdateList[key] = true;
      }
    }
    for (key in edgeUpdateList) edgeUpdateList[key] = false;
  }

  function updateDisplayForPolygons(currentPolygonState, duration) {
    var key;
    for (key in currentPolygonState) {
      if (polygonList[key] == null || polygonList[key] == undefined) {
        self.addPolygon(key, currentPolygonState[key]["points"], false);
      }

      var currentPolygon = polygonList[key];
      currentPolygon.showPolygon();

      if (currentPolygonState[key]["state"] != null)
        currentPolygon.statePolygon(currentPolygonState[key]["state"]);
      else
        currentPolygon.statePolygon(POLYGON_DEFAULT);

      currentPolygon.redraw(duration);
      polygonUpdateList[key] = true;
    }

    for (key in polygonUpdateList) {
      if (polygonUpdateList[key] == false) {
        polygonList[key].hidePolygon();
        polygonList[key].redraw(duration);
        polygonUpdateList[key] = true;
      }
    }

    for (key in polygonUpdateList) polygonUpdateList[key] = false;
  }

  function updateDisplayForTexts(currentTextState, duration) {
    var key;
    for (key in currentTextState) {
      if (textList[key] == null || textList[key] == undefined) {
        self.addText(currentTextState[key]["x"], currentTextState[key]["y"], currentTextState[key]["text"], key, false);
      }

      var currentText = textList[key];
      currentText.showText();

      if (currentTextState[key]["state"] == OBJ_HIDDEN)
        currentText.hideText();
      else if (currentTextState[key]["state"] != null)
        currentText.stateText(currentTextState[key]["state"]);
      /* --- if uncommented, color will switch back to black even if user creates new text with another colour
      else
        currentText.stateText(TEXT_DEFAULT);
      */

      currentText.changeText(currentTextState[key]["text"]);

      // changes font-size/colour permanently
      if (currentTextState[key]["font-size"] != null || currentTextState[key]["font-size"] != undefined)
        currentText.changeFontSize(currentTextState[key]["font-size"]);
      if (currentTextState[key]["fill"] != null || currentTextState[key]["fill"] != undefined)
        currentText.changeColour(currentTextState[key]["fill"]);

      currentText.redraw(duration);
      textUpdateList[key] = true;
    }

    for (key in textUpdateList) {
      if (textUpdateList[key] == false) {
        textList[key].hideText();
        textList[key].redraw(duration);
        textUpdateList[key] = true;
      }
    }
    for (key in textUpdateList) textUpdateList[key] = false;
  }

  function updateStatus(statusText) {
    $('#status-subtitles p').html(statusText);
    $('#status p').html(statusText);
    $('#status-for-embed p').html(statusText);
  }

  /* We expose this function to allow direct mouseover animation.
     This bypasses the stateList behavior. 
  */
  function updateDisplay(graphState, duration, checkBDE = true) {
    if (checkBDE) {
      var directed_edges = new Set()
      for (e_key in graphState['el']) {
        if (graphState['el'][e_key]['type'] != 1) continue
        var u = graphState['el'][e_key]['vertexA']
        var v = graphState['el'][e_key]['vertexB']
        directed_edges.add(`${u}_${v}`)
      }
      for (e_key in graphState['el']) {
        if (graphState['el'][e_key]['type'] != 1) continue
        var u = graphState['el'][e_key]['vertexA']
        var v = graphState['el'][e_key]['vertexB']
        if (directed_edges.has(`${v}_${u}`)) {
          graphState['el'][e_key]['type'] = 2
        }
      }
    }

    // Add boolean flag for vertexes and edges that exists in the current visualization
    // Check the boolean flags each time this function is called
    // If there are objects that are not updated, it means that the object is removed
    // If there are new objects that currently not in the flags, it means the object is created this turn

    var lastIteration = Object.keys(animationStateList).length - 1;
    try {
      $('#progress-bar').slider("value", currentIteration);
      updateStatus(animationStateList[currentIteration]["status"]);
      $("#info").html(animationStateList[currentIteration]["info"]); // only /ufds has it, the rest error
      highlightLine(animationStateList[currentIteration]["lineNo"]);
      if (currentIteration == lastIteration) {
        pause(); //in html file

        var imgUrl = $('#play img').attr("src");
        if (imgUrl) {
          $('#play img').attr("src", imgUrl.replace('/play.png', '/replay.png').replace('/pause.png', '/replay.png'));
          $('#mobile-playback-play img').attr("src", imgUrl.replace('/play.png', '/replay.png').replace('/pause.png', '/replay.png'));
        }
        $('#play img').attr('alt', 'replay').attr('title', 'replay');
        $('#mobile-playback-play img').attr('alt', 'replay').attr('title', 'replay');
      } else {
        var imgUrl = $('#play img').attr("src");
        if (imgUrl) {
          $('#play img').attr("src", imgUrl.replace('/replay.png', '/play.png').replace('/pause.png', '/play.png'));
          $('#mobile-playback-play img').attr("src", imgUrl.replace('/replay.png', '/play.png').replace('/pause.png', '/play.png'));
        }
        $('#play img').attr('alt', 'play').attr('title', 'play');
        $('#mobile-playback-play img').attr('alt', 'play').attr('title', 'play');
      }
    }
    catch (error) {
      // Status has not been integrated in most of my animation, so leave it like this
      // 7 June 2023, same thing with "info"
    }

    updateDisplayForTexts(graphState["tl"], duration);
    updateDisplayForVertices(graphState["vl"], duration);
    updateDisplayForEdges(graphState["el"], duration);
    updateDisplayForPolygons(graphState["pl"], duration);
  }

  /*
    To be called externally for mouseover events, we ignore any mouseover changes to the graphState in this case.

    A vertex update is an object with keys being vertex ID-s and values are all parameters of the vertices that do not
    change position, but only the colors.
  */
  // TODO: Deduplicate this part with updateVertices.
  this.animateVertexUpdates = function (vertexUpdates, duration) {
    for (key in vertexUpdates) {
      if (vertexList[key] == null || vertexList[key] == undefined) {
        // If the vertex doesn't already exist, just ignore this update.
        continue;
      }

      var currentVertex = vertexList[key];
      currentVertex.showVertex();

      if (vertexUpdates[key]["state"] == OBJ_HIDDEN)
        currentVertex.hideVertex();
      else if (vertexUpdates[key]["state"] != null)
        currentVertex.stateVertex(vertexUpdates[key]["state"]);
      else
        currentVertex.stateVertex(VERTEX_DEFAULT);

      if (vertexUpdates[key]["state"] != OBJ_HIDDEN && vertexUpdates[key]["text"] != null)
        currentVertex.changeText(vertexUpdates[key]["text"]);
      if (vertexUpdates[key]["text-font-size"] != null)
        currentVertex.changeTextFontSize(vertexUpdates[key]["text-font-size"]);

      if (vertexUpdates[key]["inner-r"] != null && vertexUpdates[key]["outer-r"] != null)
        currentVertex.changeRadius(vertexUpdates[key]["inner-r"], vertexUpdates[key]["outer-r"]);
      if (vertexUpdates[key]["inner-w"] != null && vertexUpdates[key]["outer-w"] != null)
        currentVertex.changeWidth(vertexUpdates[key]["inner-w"], vertexUpdates[key]["outer-w"]);
      if (vertexUpdates[key]["inner-h"] != null && vertexUpdates[key]["outer-h"] != null)
        currentVertex.changeHeight(vertexUpdates[key]["inner-h"], vertexUpdates[key]["outer-h"]);
      if (vertexUpdates[key]["inner-stroke-width"] != null && vertexUpdates[key]["outer-stroke-width"] != null)
        currentVertex.changeStrokeWidth(vertexUpdates[key]["inner-stroke-width"], vertexUpdates[key]["outer-stroke-width"]);

      if (vertexUpdates[key]["extratext"] != null)
        currentVertex.changeExtraText(vertexUpdates[key]["extratext"]);

      if (vertexUpdates[key]["extratext-position"] != null)
        currentVertex.changeExtraTextPosition(vertexUpdates[key]["extratext-position"]);

      if (vertexUpdates[key]["extratext-font-size"] != null)
        currentVertex.changeExtraTextFontSize(currentVertexState[key]["extratext-font-size"]);

      currentVertex.redraw(duration, true);
    }
  }

  /*
    To be called externally for mouseover events, we ignore any mouseover changes to the graphState in this case.

    A vertex update is an object with keys being edge ID-s and values are all parameters of the vertices that do not
    change position / endpoints.
  */
  // TODO: Deduplicate this part with updateEdges.
  this.animateEdgeUpdates = function (edgeUpdates, duration) {
    for (key in edgeUpdates) {
      // If the edge doesn't exist, ignore this update.
      if (edgeList[key] == null || edgeList[key] == undefined)
        continue;

      var currentEdge = edgeList[key];
      currentEdge.showEdge();

      if (edgeUpdates[key]["state"] == OBJ_HIDDEN)
        currentEdge.hideEdge();
      else if (edgeUpdates[key]["state"] != null)
        currentEdge.stateEdge(edgeUpdates[key]["state"]);
      else
        currentEdge.stateEdge(EDGE_DEFAULT);

      if (edgeUpdates[key]["state"] != OBJ_HIDDEN && edgeUpdates[key]["displayWeight"] != null) {
        currentEdge.hideWeight();
        if (edgeUpdates[key]["displayWeight"])
          currentEdge.showWeight();
      }

      if (edgeUpdates[key]["type"] != null)
        currentEdge.changeType(edgeUpdates[key]["type"]);
      if (edgeUpdates[key]["weight"] != null)
        currentEdge.changeWeight(edgeUpdates[key]["weight"]);
      if (edgeUpdates[key]["stroke-width"] != null)
        currentEdge.changeStrokeWidth(edgeUpdates[key]["stroke-width"]);
      currentEdge.refreshPath();
      if (edgeUpdates[key]["animateHighlighted"] == null || !edgeUpdates[key]["animateHighlighted"])
        currentEdge.redraw(duration);
      else
        currentEdge.animateHighlighted(duration * 0.9);
    }
  }
}
