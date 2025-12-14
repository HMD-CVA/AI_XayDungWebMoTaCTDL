// Dgefines ONE vertex object
// Set styles in properties.js and the CSS files!!!

let GraphVertexText = function (text, subscriptedText = "") {
  // Yes, this is practically a pair, but would be useful if we ever extend this logic further.
  text = String(text);
  subscriptedText = String(subscriptedText);

  // I know this is a bit ugly, but now the semantics that this is immutable is clearer.
  this.text = function () { return text; }
  this.subscriptedText = function () { return subscriptedText; }
  this.valueOf = function () { return `${text}_${subscriptedText}`; }

  // Needed to make sure that the text can be contained fully in the vertex
  this.getAppropriateFontSize = function (isMediumScale = false) {
    // I didn't think too hard about these constants. Feel free to change them to whatever
    // you feel appropriate.
    let textLength = Math.round(text.length + subscriptedText.length / 3);
    if (textLength >= 6)
      textLength = 6;
    if (textLength === 0)
      textLength = 1;
    // We should refactor this logic later.
    return ((isMediumScale) ? graphVertexPropertiesMedium : graphVertexProperties)[VERTEX_SHAPE_CIRCLE]["text"]["font-sizes"][textLength - 1];
  }

  // workaround so that nodes created while in medium-scale mode would have proper offsets to their vertex numbers
  // when swtiching back to normal mode
  this.getAppropriateOffsetSize = function () {
    // here too.
    let textLength = Math.round(text.length + subscriptedText.length / 3);
    if (textLength >= 6)
      textLength = 6;
    if (textLength === 0)
      textLength = 1;
    return graphVertexProperties[VERTEX_SHAPE_CIRCLE]["text"]["font-sizes"][textLength - 1];
  }
}

const GraphVertexExtratextPosition = Object.freeze({
  TOP: Symbol("GVET_Top"),
  TOP_LEFT: Symbol("GVET_TopLeft"),
  TOP_RIGHT: Symbol("GVET_TopRight"),
  MID_LEFT: Symbol("GVET_MidLeft"),
  MID_RIGHT: Symbol("GVET_MidRight"),
  BOTTOM: Symbol("GVET_Bottom"),
  BOTTOM_LEFT: Symbol("GVET_BottLeft"),
  BOTTOM_RIGHT: Symbol("GVET_BottRight"),
});

/*
  The contract here is that the graph vertex shape type never changes post-construction.
  This is reasonable because their SVG constructors are distinct from one another.
*/
let GraphVertexShapeT = Object.freeze({
  CIRCLE: Symbol("GVType_Circle"),
  RECT: Symbol("GVType_Rect")
});

var GraphVertexWidget = function (cx, cy, vertexShape, vertexText, vertexClassNumber, isMediumScale, showVertexNumInMediumScale = true) { // 25 Apr modification, by default I want vertex number to still be shown by default...
  var self = this;
  var defaultAnimationDuration = 250; // millisecond

  let vertexShapeType = null;

  var innerVertex;
  var outerVertex;
  var text;
  var textSpan;
  var textSubscriptedSpan;
  var extratext;
  var id = vertexClassNumber;
  var cx = cx;
  var cy = cy;
  var isMediumScale = isMediumScale;
  var showVertexNumInMediumScale = showVertexNumInMediumScale;
  var vertexProperties;
  var hoverTextForeignObject;
  var hoverTextDiv;

  let isHidden = false;

  if (!(vertexText instanceof GraphVertexText)) {
    vertexText = new GraphVertexText(vertexText, "");
  }

  // We're memoizing the functions here because we want to disable them whenever a redraw is called.
  this.mouseoverFunc = null;
  this.mouseleaveFunc = null;
  this.mousemoveFunc = null;
  this.isCurrentlyAnimating = false;

  this.getId = function () { return id; };
  this.getCx = function () { return cx; };
  this.getCy = function () { return cy; };

  function getTypeOfShape(vertexShape) {
    if (vertexShape === VERTEX_SHAPE_RECT_LONG
      || vertexShape === VERTEX_SHAPE_RECT
      || vertexShape === VERTEX_SHAPE_SQUARE) {
      return GraphVertexShapeT.RECT;
    } else if (vertexShape === VERTEX_SHAPE_CIRCLE) {
      return GraphVertexShapeT.CIRCLE;
    } else {
      return null;
    }
  }

  var textYaxisOffset = vertexText.getAppropriateOffsetSize() / 3;
  // Needed to make sure that the text can be contained fully in the vertex

  var attributeList = {
    "innerVertex": {
      "class": null,
      "cx": null,
      "cy": null,
      "x": null,
      "y": null,
      "fill": null,
      "r": null,
      "width": null,
      "height": null,
      "stroke": null,
      "stroke-width": null
    },
    "outerVertex": {
      "class": null,
      "cx": null,
      "cy": null,
      "x": null,
      "y": null,
      "fill": null,
      "r": null,
      "width": null,
      "height": null,
      "stroke": null,
      "stroke-width": null
    },
    "text": {
      "class": null,
      "x": null,
      "y": null,
      "fill": null,
      "font-family": null,
      "font-weight": null,
      "font-size": null,
      "text-anchor": null,
      "text": null,
      "subscripted-text": null
    },
    "extratext": {
      "class": null,
      "position": null,
      "x": null,
      "y": null,
      "fill": null,
      "font-family": null,
      "font-weight": null,
      "font-size": null,
      "text-anchor": null,
      "text": null
    },
    "hovertextforeignobject": {
      "class": null,
    },
    "hovertextdiv": {
      "class": null,
    }
  }

  // JS object with IDs of all edges connected to this vertex as the key and boolean as the value
  // Everytime an edge is added, the value is set to true
  // Everytime an edge is deleted, the value is set to null
  var edgeList = {};

  function calculateVertexExtraTextPosition(position) {
    let newX = cx;
    let newY = cy + textYaxisOffset;

    let newXOffset = 0;
    let newYOffset = 0;

    let isInDictionary = false;

    if (vertexShape === VERTEX_SHAPE_CIRCLE) {
      newXOffset = attributeList["outerVertex"]["r"] + 10;
      newYOffset = attributeList["outerVertex"]["r"] + 10;
    } else if (vertexShape === VERTEX_SHAPE_RECT
      || vertexShape === VERTEX_SHAPE_RECT_LONG
      || vertexShape === VERTEX_SHAPE_SQUARE) {
      newXOffset = attributeList["outerVertex"]["width"] / 2 + 10;
      newYOffset = attributeList["outerVertex"]["height"] / 2 + 10;
    } else {
      console.error("Unknown vertex type in calculateVertexExtraTextPosition", position);
    }

    attributeList["extratext"]["text-anchor"] = "middle";

    if (position === GraphVertexExtratextPosition.BOTTOM
      || position === GraphVertexExtratextPosition.BOTTOM_LEFT
      || position === GraphVertexExtratextPosition.BOTTOM_RIGHT) {
      isInDictionary = true;
      newY += newYOffset;
    }

    if (position === GraphVertexExtratextPosition.TOP
      || position === GraphVertexExtratextPosition.TOP_LEFT
      || position === GraphVertexExtratextPosition.TOP_RIGHT) {
      isInDictionary = true;
      newY -= newYOffset;
    }

    if (position === GraphVertexExtratextPosition.MID_LEFT
      || position === GraphVertexExtratextPosition.TOP_LEFT
      || position === GraphVertexExtratextPosition.BOTTOM_LEFT
    ) {
      isInDictionary = true;
      newX -= newXOffset;
    }

    if (position === GraphVertexExtratextPosition.MID_RIGHT
      || position === GraphVertexExtratextPosition.TOP_RIGHT
      || position === GraphVertexExtratextPosition.BOTTOM_RIGHT
    ) {
      isInDictionary = true;
      newX += newXOffset;
    }

    if (position === GraphVertexExtratextPosition.MID_LEFT) {
      attributeList["extratext"]["text-anchor"] = "end";
    }
    if (position === GraphVertexExtratextPosition.MID_RIGHT) {
      attributeList["extratext"]["text-anchor"] = "start";
    }

    if (isInDictionary) {
      attributeList["extratext"]["x"] = newX;
      attributeList["extratext"]["y"] = newY;
    } else {
      calculateVertexExtraTextPosition(GraphVertexExtratextPosition.BOTTOM);
    }
  }

  this.getShapeType = function () {
    return vertexShapeType;
  }

  // Disables mouseover behavior during animation and re-enables them once completed.
  this.redraw = function (duration, keepMouseoverEnabled = false) {
    if (duration == null || isNaN(duration)) duration = defaultAnimationDuration;
    if (duration <= 0) duration = 1;

    if (!keepMouseoverEnabled) {
      this.isCurrentlyAnimating = true;
      this.disableMouseoverBehavior();
    }
    draw(duration);
    // I hate that I'm relying on a timeout here, but this will suffice... Hopefully.
    // If the drawing fails, this timeout will be a bit wonky, but hopefully won't be too wrong.
    // 
    // Why 2.5*? Because d3 doesnt exactly animate in the time that it promises...
    // 2.5 was the best one that doesnt violate our rule.
    // 
    // We could fix this by instead maintaining the d3 transition object within each vertex.
    // This allows us to chain transitions together. But not worth the effort for now.
    if (!keepMouseoverEnabled) {
      setTimeout(() => {
        this.isCurrentlyAnimating = false;
        this.enableMouseoverBehavior();
      }, duration * 2.5);
    }
  }

  this.toggleLOD = function () {
    isMediumScale = !isMediumScale;
    recalculateVertexShape();
    this.showVertex();
    if (isMediumScale) // ensure colours are readable when toggling between scales after animation finishes.
      attributeList["text"]["fill"] = attributeList["outerVertex"]["fill"];
    else {
      if (attributeList["innerVertex"]["fill"] == "#eee")
        attributeList["text"]["fill"] = attributeList["outerVertex"]["fill"];
      else
        attributeList["text"]["fill"] = "#fff";
    }
    this.redraw(defaultAnimationDuration);
  }

  this.toggleVertexNumber = function () {
    showVertexNumInMediumScale = !showVertexNumInMediumScale;
    this.showVertex();
    this.redraw(defaultAnimationDuration);
  }

  // Specifies the duration of the animation in milliseconds
  // If unspecified or illegal value, default duration applies.
  this.showVertex = function () {
    isHidden = false;
    attributeList["outerVertex"]["r"] = vertexProperties["outerVertex"]["r"];
    attributeList["outerVertex"]["width"] = vertexProperties["outerVertex"]["width"];
    attributeList["outerVertex"]["height"] = vertexProperties["outerVertex"]["height"];
    attributeList["outerVertex"]["stroke-width"] = vertexProperties["outerVertex"]["stroke-width"];

    attributeList["innerVertex"]["r"] = vertexProperties["innerVertex"]["r"];
    attributeList["innerVertex"]["width"] = vertexProperties["innerVertex"]["width"];
    attributeList["innerVertex"]["height"] = vertexProperties["innerVertex"]["height"];
    attributeList["innerVertex"]["stroke-width"] = vertexProperties["innerVertex"]["stroke-width"];

    // default first
    attributeList["text"]["font-size"] = vertexText.getAppropriateFontSize(isMediumScale);
    attributeList["text"]["x"] = cx;

    if (vertexShape == VERTEX_SHAPE_CIRCLE && isMediumScale) { // medium scale modifier is currently only for standard circle
      if (showVertexNumInMediumScale) {
        attributeList["text"]["font-size"] = 10;
        attributeList["text"]["y"] = cy - 9; // 14; // 9;
      }
      else {
        attributeList["text"]["font-size"] = 0;
        attributeList["text"]["y"] = cy;
      }
    }

    attributeList["extratext"]["font-size"] = vertexProperties["text"]["extra-text-size"];
    calculateVertexExtraTextPosition(attributeList["extratext"]["position"]);
  }

  this.hideVertex = function () {
    isHidden = true;
    attributeList["outerVertex"]["r"] = 0;
    attributeList["outerVertex"]["width"] = 0;
    attributeList["outerVertex"]["height"] = 0;
    attributeList["outerVertex"]["stroke-width"] = 0;

    attributeList["innerVertex"]["r"] = 0;
    attributeList["innerVertex"]["width"] = 0;
    attributeList["innerVertex"]["height"] = 0;
    attributeList["innerVertex"]["stroke-width"] = 0;

    attributeList["text"]["font-size"] = 0;
    attributeList["extratext"]["font-size"] = 0;
  }

  function recalculatePosition() {
    attributeList["outerVertex"]["cx"] = cx;
    attributeList["outerVertex"]["cy"] = cy;
    attributeList["outerVertex"]["x"] = cx - attributeList["outerVertex"]["width"] / 2;
    attributeList["outerVertex"]["y"] = cy - attributeList["outerVertex"]["height"] / 2;

    attributeList["innerVertex"]["cx"] = cx;
    attributeList["innerVertex"]["cy"] = cy;
    attributeList["innerVertex"]["x"] = cx - attributeList["innerVertex"]["width"] / 2;
    attributeList["innerVertex"]["y"] = cy - attributeList["innerVertex"]["height"] / 2;

    attributeList["text"]["x"] = cx;
    attributeList["text"]["y"] = cy + textYaxisOffset;

    calculateVertexExtraTextPosition(attributeList["extratext"]["position"]);

    var key;
    for (key in edgeList)
      edgeList[key].refreshPath();
  }

  this.isHidden = function () {
    return isHidden;
  }

  // Sets vertex properties based on the current [vertexShape].
  // Recalculates both position, and state.
  function recalculateVertexShape() {
    let prop_dict = isMediumScale ? graphVertexPropertiesMedium : graphVertexProperties;
    if (!(vertexShape in prop_dict)) {
      console.warn(`Vertex shape ${vertexShape} not available in the dictionary of properties. Defaulting to circle vertex shape...`);
      vertexShape = VERTEX_SHAPE_CIRCLE;
    }
    vertexProperties = prop_dict[vertexShape];

    for (let key of ["r", "width", "height", "stroke-width", "stroke"]) {
      attributeList["innerVertex"][key] = vertexProperties["innerVertex"][key];
    }

    for (let key of ["r", "width", "height", "stroke-width"]) {
      attributeList["outerVertex"][key] = vertexProperties["outerVertex"][key];
    }

    for (let key of ["font-family", "font-weight", "text-anchor"]) {
      attributeList["text"][key] = vertexProperties["text"][key];
      attributeList["extratext"][key] = vertexProperties["text"][key];
    }
    attributeList["extratext"]["font-size"] = vertexProperties["text"]["extra-text-size"];
    recalculatePosition();
  }

  this.moveVertex = function (cx, cy) {
    this.setVertexLocation(cx, cy);
    recalculatePosition();
  }

  this.setVertexLocation = function (newCx, newCy) {
    cx = newCx;
    cy = newCy;
  }

  this.changeText = function (newVertexText) {
    if (!(newVertexText instanceof GraphVertexText)) {
      newVertexText = new GraphVertexText(newVertexText, "");
    }
    vertexText = newVertexText;
    attributeList["text"]["text"] = newVertexText.text();
    attributeList["text"]["subscripted-text"] = newVertexText.subscriptedText();
    attributeList["text"]["font-size"] = newVertexText.getAppropriateFontSize(isMediumScale);
    if (showVertexNumInMediumScale && isMediumScale) { // && (vertexShape == VERTEX_SHAPE_CIRCLE)) {
      attributeList["text"]["font-size"] = 10;
      attributeList["text"]["y"] = attributeList["text"]["y"] - 14;
    }
  }

  this.changeExtraText = function (newVertexExtraText) {
    vertexExtraText = newVertexExtraText;
    attributeList["extratext"]["text"] = newVertexExtraText;
  }

  this.changeExtraTextPosition = function (newExtraTextPosition) {
    if (!(Object.values(GraphVertexExtratextPosition).includes(newExtraTextPosition))) {
      console.error("Unknown new extra text position", newExtraTextPosition, "Ignoring...");
      return;
    }
    attributeList["extratext"]["position"] = newExtraTextPosition;
    calculateVertexExtraTextPosition(attributeList["extratext"]["position"]);
  }

  this.changeTextFontSize = function (newTextSize) {
    if (newTextSize == null || isNaN(newTextSize)) return;
    attributeList["text"]["font-size"] = newTextSize;
  }

  this.changeExtraTextFontSize = function (newExtraTextSize) {
    if (newExtraTextSize == null || isNaN(newExtraTextSize)) return;
    attributeList["extratext"]["font-size"] = newExtraTextSize;
  }

  this.changeRadius = function (newRadiusInner, newRadiusOuter) {
    if (newRadiusInner == null || isNaN(newRadiusInner)) return;
    attributeList["innerVertex"]["r"] = newRadiusInner;
    if (newRadiusOuter == null || isNaN(newRadiusOuter)) return;
    attributeList["outerVertex"]["r"] = newRadiusOuter;
  }

  this.changeWidth = function (newWidthInner, newWidthOuter) {
    if (newWidthInner == null || isNaN(newWidthInner)) return;
    attributeList["innerVertex"]["width"] = newWidthInner;
    if (newWidthOuter == null || isNaN(newWidthOuter)) return;
    attributeList["outerVertex"]["width"] = newWidthOuter;
    recalculatePosition();
  }

  this.changeHeight = function (newHeightInner, newHeightOuter) {
    if (newHeightInner == null || isNaN(newHeightInner)) return;
    attributeList["innerVertex"]["height"] = newHeightInner;
    if (newHeightOuter == null || isNaN(newHeightOuter)) return;
    attributeList["outerVertex"]["height"] = newHeightOuter;
    recalculatePosition();
  }

  this.changeShape = function (newShape) {
    if (getTypeOfShape(newShape) !== vertexShapeType) {
      console.error("Attempted to change vertex to unknown shape. Ignored.", vertexClassNumber, newShape);
      return;
    }
    vertexShape = newShape;
    recalculateVertexShape();
  }

  this.changeStrokeWidth = function (newStrokeWidthInner, newStrokeWidthOuter) {
    if (newStrokeWidthInner == null || isNaN(newStrokeWidthInner)) return;
    attributeList["innerVertex"]["stroke-width"] = newStrokeWidthInner;
    if (newStrokeWidthOuter == null || isNaN(newStrokeWidthOuter)) return;
    attributeList["outerVertex"]["stroke-width"] = newStrokeWidthOuter;
  }

  // Removes the vertex (no animation)
  // If you want animation, hide & redraw the vertex first, then call this function
  this.removeVertex = function () {
    outerVertex.remove();
    innerVertex.remove();
    text.remove();
    extratext.remove();
  }

  this.stateVertex = function (stateName) {
    if (!(stateName in graphVertexStateProperties)) {
      console.warn("Attempted to set to unknown state: ", stateName, "Ignorning");
      stateName = VERTEX_DEFAULT;
    }

    if (isMediumScale) {
      attributeList["innerVertex"]["fill"] = graphVertexStateProperties[stateName]["fill-color"];
      attributeList["outerVertex"]["fill"] = graphVertexStateProperties[stateName]["stroke-color"];
      attributeList["outerVertex"]["stroke"] = graphVertexStateProperties[stateName]["stroke-color"];
      attributeList["text"]["fill"] = graphVertexStateProperties[stateName]["stroke-color"];
    } else {
      attributeList["innerVertex"]["fill"] = graphVertexStateProperties[stateName]["fill-color"];
      attributeList["outerVertex"]["fill"] = graphVertexStateProperties[stateName]["stroke-color"];
      attributeList["outerVertex"]["stroke"] = graphVertexStateProperties[stateName]["stroke-color"];
      attributeList["text"]["fill"] = graphVertexStateProperties[stateName]["text-color"];
    }
  }

  this.getAttributes = function () {
    return deepCopy(attributeList);
  }

  this.getClassNumber = function () {
    return vertexClassNumber;
  }

  this.addEdge = function (graphEdge) {
    edgeList[graphEdge.getAttributes()["id"]] = graphEdge;
  }

  this.removeEdge = function (graphEdge) {
    if (edgeList[graphEdge.getAttributes()["id"]] == null || edgeList[graphEdge.getAttributes()["id"]] == undefined)
      return;
    delete edgeList[graphEdge.getAttributes()["id"]];
  }

  this.getEdge = function () {
    var reply = [];
    var key;
    for (key in edgeList)
      reply.push(edgeList[key]);
    return reply;
  }

  this.addHoverText = function (hoverText, mouseoverOriginal, mousemoveOriginal, mouseleaveOriginal) {
    function mouseover(d) {
      if (mouseoverOriginal != null && mouseoverOriginal != undefined) {
        mouseoverOriginal();
      }
      hoverTextForeignObject
        .attr("height", attributeList["hovertextforeignobject"]["height"])
        .attr("width", attributeList["hovertextforeignobject"]["width"]);
      return hoverTextDiv
        .style("visibility", "visible");
    }

    function mousemove(d) {
      if (mousemoveOriginal != null && mousemoveOriginal != undefined) {
        mousemoveOriginal();
      }
      // need to offset w.r.t the viz svg since tooltips are anchored on the viz body, but vertices are anchored on the viz svg
      // so the values returned are off by the difference in sizes between the two parent divs
      // TODO: find a better way to extract the values: the path to the values (mainSvg[0][0]...) were extracted from console logging
      // let xOffset = (window.innerWidth - mainSvg[0][0].width.animVal.value) / 2;
      // let yOffset = (window.innerHeight - mainSvg[0][0].height.animVal.value) / 2;
      const xOffset = 20;
      hoverTextForeignObject
        .attr("x", d3.mouse(this)[0] + xOffset)
        .attr("y", d3.mouse(this)[1]);
      return hoverTextDiv;
      //return tooltipDiv
      //  .style("left", (d3.mouse(this)[0] + xOffset) + "px")
      //  .style("top", (d3.mouse(this)[1] + 20) + "px");
    }

    function mouseleave(d) {
      if (mouseleaveOriginal != null && mouseleaveOriginal != undefined) {
        mouseleaveOriginal();
      }
      // This is needed to prevent the foreign object from blocking other inner vertex components.
      // Blocking inner vertex component would cause the browser to fail to detect the mouseover over the vertex.
      hoverTextForeignObject
        .attr("height", 0)
        .attr("width", 0);
      return hoverTextDiv
        .style("visibility", "hidden");
    }

    if (hoverText == "" || hoverText == null) {
      // remove mouse event listeners
      this.addMouseOverBehaviour();
    } else {
      hoverTextDiv.attr("class", attributeList["hovertextdiv"]["class"])
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("display", "inline-block")
        .style("float", "left")
        .style("padding", "5px")
        .style("position", "relative")
        .style("visibility", "hidden")
        .style("z-index", 999)
        .text(hoverText);

      this.addMouseOverBehaviour(mouseover, mousemove, mouseleave);
    }
  }

  this.enableMouseoverBehavior = function () {
    outerVertex.on("mouseover", this.mouseoverFunc)
      .on("mousemove", this.mousemoveFunc)
      .on("mouseleave", this.mouseleaveFunc);

    innerVertex.on("mouseover", this.mouseoverFunc)
      .on("mousemove", this.mousemoveFunc)
      .on("mouseleave", this.mouseleaveFunc);

    text.on("mouseover", this.mouseoverFunc)
      .on("mousemove", this.mousemoveFunc)
      .on("mouseleave", this.mouseleaveFunc);
  }

  this.disableMouseoverBehavior = function () {
    outerVertex.on("mouseover", null)
      .on("mousemove", null)
      .on("mouseleave", null);

    innerVertex.on("mouseover", null)
      .on("mousemove", null)
      .on("mouseleave", null);

    text.on("mouseover", null)
      .on("mousemove", null)
      .on("mouseleave", null);
  }

  this.addMouseOverBehaviour = function (mouseoverFunc = null, mouseMoveFunc = null, mouseLeaveFunc = null) {
    this.mouseoverFunc = mouseoverFunc;
    this.mousemoveFunc = mouseMoveFunc;
    this.mouseleaveFunc = mouseLeaveFunc;

    if (!this.isCurrentlyAnimating) {
      this.enableMouseoverBehavior();
    }
  }

  // Initialize vertex and draw them, but the object will not be visible due to the radius of the vertex circle set to 0
  function init() {
    let svgShapeName = "";

    vertexShapeType = getTypeOfShape(vertexShape);
    if (vertexShapeType === null) {
      console.error("Unknown vertex shape passed to GraphVertexWidget. Defaulting to circle shape", vertexShape, vertexClassNumber);
      vertexShape = VERTEX_SHAPE_CIRCLE;
      vertexShapeType = getTypeOfShape(vertexShape);
    }

    if (vertexShapeType === GraphVertexShapeT.CIRCLE) {
      svgShapeName = "circle";
    } else if (vertexShapeType === GraphVertexShapeT.RECT) {
      svgShapeName = "rect";
    } else {
      console.error("Internal error: Unknown vertex type found", vertexShapeType);
    }

    outerVertex = vertexSvg.append(svgShapeName);
    innerVertex = vertexSvg.append(svgShapeName);
    text = vertexTextSvg.append("text");
    extratext = vertexTextSvg.append("text");
    tooltipDiv = d3.select("body").append("div");
    hoverTextForeignObject = d3.select("#hovertext").append("foreignObject");
    hoverTextDiv = hoverTextForeignObject.append("xhtml:div");

    textSpan = text.append("tspan");
    textSubscriptedSpan = text.append("tspan");

    attributeList["innerVertex"]["class"] = "v" + vertexClassNumber + " inner";

    attributeList["outerVertex"]["class"] = "v" + vertexClassNumber + " outer";

    attributeList["text"]["class"] = "v" + vertexClassNumber + " maintext";
    attributeList["text"]["text"] = vertexText.text();
    attributeList["text"]["subscripted-text"] = vertexText.subscriptedText();

    attributeList["extratext"]["class"] = "v" + vertexClassNumber + " extratext";
    attributeList["extratext"]["fill"] = "red";
    attributeList["extratext"]["position"] = GraphVertexExtratextPosition.BOTTOM;
    attributeList["extratext"]["text"] = "";

    attributeList["hovertextforeignobject"]["class"] = "v" + vertexClassNumber + " hovertext foreignobject";
    attributeList["hovertextforeignobject"]["height"] = 100;
    attributeList["hovertextforeignobject"]["width"] = 100;

    attributeList["hovertextdiv"]["class"] = "v" + vertexClassNumber + " hovertext";

    // Handles moving default properties from [properties.js] to [attributeList].
    recalculateVertexShape();

    // Set to default colors
    self.stateVertex(VERTEX_DEFAULT);

    // By default, we hide vertex post-initialization.
    self.hideVertex();


    // 25 Jan 2024: added inner and outer classes to the vertices to help make selection of vertices more specific
    // should hopefully not break anything
    innerVertex.attr("class", attributeList["innerVertex"]["class"]).classed("inner", true);
    outerVertex.attr("class", attributeList["outerVertex"]["class"]).classed("outer", true);
    text.attr("class", attributeList["text"]["class"]);
    extratext.attr("class", attributeList["extratext"]["class"]);

    textSpan.attr("class", attributeList["text"]["class"]);
    textSubscriptedSpan
      .attr("class", attributeList["text"]["class"] + " subscripted")
      .attr("font-size", "0.6em")
      .attr("dy", "0.4em");

    innerVertex.attr("cx", attributeList["innerVertex"]["cx"])
      .attr("cy", attributeList["innerVertex"]["cy"])
      .attr("x", attributeList["innerVertex"]["x"])
      .attr("y", attributeList["innerVertex"]["y"])
      .attr("fill", attributeList["innerVertex"]["fill"])
      .attr("r", attributeList["innerVertex"]["r"])
      .attr("width", attributeList["innerVertex"]["width"])
      .attr("height", attributeList["innerVertex"]["height"])
      .attr("stroke", attributeList["innerVertex"]["stroke"])
      .attr("stroke-width", attributeList["innerVertex"]["stroke-width"]);

    outerVertex.attr("cx", attributeList["outerVertex"]["cx"])
      .attr("cy", attributeList["outerVertex"]["cy"])
      .attr("x", attributeList["outerVertex"]["x"])
      .attr("y", attributeList["outerVertex"]["y"])
      .attr("fill", attributeList["outerVertex"]["fill"])
      .attr("r", attributeList["outerVertex"]["r"])
      .attr("width", attributeList["outerVertex"]["width"])
      .attr("height", attributeList["outerVertex"]["height"])
      .attr("stroke", attributeList["outerVertex"]["stroke"])
      .attr("stroke-width", attributeList["outerVertex"]["stroke-width"]);

    text.attr("x", attributeList["text"]["x"])
      .attr("y", attributeList["text"]["y"])
      .attr("fill", attributeList["text"]["fill"])
      .attr("font-family", attributeList["text"]["font-family"])
      .attr("font-size", attributeList["text"]["font-size"])
      .attr("font-weight", attributeList["text"]["font-weight"])
      .attr("text-anchor", attributeList["text"]["text-anchor"]);

    textSpan.text(function () { return attributeList["text"]["text"]; })
    textSubscriptedSpan.text(function () { return attributeList["text"]["subscripted-text"]; })

    extratext.attr("x", attributeList["extratext"]["x"])
      .attr("y", attributeList["extratext"]["y"])
      .attr("fill", attributeList["extratext"]["fill"])
      .attr("font-family", attributeList["extratext"]["font-family"])
      .attr("font-size", attributeList["extratext"]["font-size"])
      .attr("font-weight", attributeList["extratext"]["font-weight"])
      .attr("text-anchor", attributeList["extratext"]["text-anchor"])
      //.attr("z-index", "10") // see if this works
      .text(function () {
        return attributeList["extratext"]["text"];
      });

    hoverTextForeignObject.attr("class", attributeList["hovertextforeignobject"]["class"]);
    hoverTextDiv.attr("class", attributeList["hovertextdiv"]["class"]);
  }

  // Refreshes the vertex image
  // "dur" specifies the duration of the animation in milliseconds
  // If unspecified or illegal value, default duration applies.
  function draw(dur) {
    if (dur == null || isNaN(dur)) dur = defaultAnimationDuration;
    if (dur <= 0) dur = 1;

    innerVertex.transition()
      .duration(dur)
      .attr("cx", attributeList["innerVertex"]["cx"])
      .attr("cy", attributeList["innerVertex"]["cy"])
      .attr("x", attributeList["innerVertex"]["x"])
      .attr("y", attributeList["innerVertex"]["y"])
      .attr("fill", attributeList["innerVertex"]["fill"])
      .attr("r", attributeList["innerVertex"]["r"])
      .attr("width", attributeList["innerVertex"]["width"])
      .attr("height", attributeList["innerVertex"]["height"])
      .attr("stroke", attributeList["innerVertex"]["stroke"])
      .attr("stroke-width", attributeList["innerVertex"]["stroke-width"]);

    outerVertex.transition()
      .duration(dur)
      .attr("cx", attributeList["outerVertex"]["cx"])
      .attr("cy", attributeList["outerVertex"]["cy"])
      .attr("x", attributeList["outerVertex"]["x"])
      .attr("y", attributeList["outerVertex"]["y"])
      .attr("fill", attributeList["outerVertex"]["fill"])
      .attr("r", attributeList["outerVertex"]["r"])
      .attr("width", attributeList["outerVertex"]["width"])
      .attr("height", attributeList["outerVertex"]["height"])
      .attr("stroke", attributeList["outerVertex"]["stroke"])
      .attr("stroke-width", attributeList["outerVertex"]["stroke-width"]);

    text.transition()
      .duration(dur)
      .attr("x", attributeList["text"]["x"])
      .attr("y", attributeList["text"]["y"])
      .attr("fill", attributeList["text"]["fill"])
      .attr("font-family", attributeList["text"]["font-family"])
      .attr("font-size", attributeList["text"]["font-size"])
      .attr("font-weight", attributeList["text"]["font-weight"])
      .attr("text-anchor", attributeList["text"]["text-anchor"]);

    textSpan.transition()
      .duration(dur)
      .text(function () {
        return attributeList["text"]["text"];
      });

    textSubscriptedSpan.transition()
      .duration(dur)
      .text(function () {
        return attributeList["text"]["subscripted-text"];
      });

    extratext.transition()
      .duration(dur)
      .attr("x", attributeList["extratext"]["x"])
      .attr("y", attributeList["extratext"]["y"])
      .attr("fill", attributeList["extratext"]["fill"])
      .attr("font-family", attributeList["extratext"]["font-family"])
      .attr("font-size", attributeList["extratext"]["font-size"])
      .attr("font-weight", attributeList["extratext"]["font-weight"])
      .attr("text-anchor", attributeList["extratext"]["text-anchor"])
      .text(function () {
        return attributeList["extratext"]["text"];
      });
  }

  init();
}
