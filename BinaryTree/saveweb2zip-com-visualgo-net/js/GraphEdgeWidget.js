// Defines ONE edge object
// Direction of edge is a -> b
// Set styles in properties.js and the CSS files!!!

/*
 * Constants for "type":
 * EDGE_TYPE_UDE = UnDirected Edge
 * EDGE_TYPE_DE = Directed Edge
 * EDGE_TYPE_BDE = BiDirectional Edge
 */

// GraphEdgeWidget object
// TODO: Better implementation of edge weight

const EPS = 1e-8;

var GraphEdgeWidget = function (graphVertexA, graphVertexB, edgeIdNumber, type, weight, isMediumScale, markerPosition = MARKER_POSITION_END, strokeWidth = 3, curveHeight = 0) {
  resetSVGMarkers();

  function isValidHeight(height) {
    return (typeof height === "number" && !isNaN(height));
  }

  if (weight == null || isNaN(weight)) weight = 1;
  if (!isValidHeight(curveHeight)) { console.warn("attempted to create an edge with curveHeight: " + curveHeight + ". Parameter ignored."); curveHeight = 0; }

  var self = this;
  var defaultAnimationDuration = 250; // millisecond
  var line;
  var weightText, weightTextPath, weightTextSpan
  var extraTextPath, extraTextSpan;
  var isMediumScale = isMediumScale;
  var edgeProperties = isMediumScale ? graphEdgePropertiesMedium : graphEdgeProperties;

  // Valid arguments are marker-end and marker-start, currently unchangeable once set. 
  var markerPosition = markerPosition;

  var strokeWidth = strokeWidth;

  // Yes, this is unused, but could be useful in the future.
  var straightEdgeGenerator = d3.svg.line()
    .x(function (d) { return d.x; })
    .y(function (d) { return d.y; })
    .interpolate("linear");

  var curvedEdgeGenerator = (points) => {
    console.assert(Array.isArray(points) && points.length === 3);
    return `M ${points[0].x} ${points[0].y} Q ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}`
  }

  // This function is used for [initCommand[]
  var singlePointGenerator = (point) => {
    return curvedEdgeGenerator([point, point, point]);
  }

  var lineCommand = curvedEdgeGenerator(calculateBezierCurve());
  var initCommand = singlePointGenerator(calculateBezierCurve()[0]);

  var attributeList = {
    "path": {
      "id": null,
      "class": null,
      "d": null,
      "stroke": null,
      "stroke-width": null,
    },
    "weight": {
      "id": null,
      "startOffset": null,
      "dy": null,
      "fill": null,
      "font-family": null,
      "font-weight": null,
      "font-size": null,
      "text-anchor": null,
      "text": null
    },
    "text": {
      "id": null,

    }
  };

  var mainSvg = mainSvg;

  updatePath();
  init();
  this.redraw = function (duration) {
    draw(duration);
  };

  this.animateHighlighted = function (duration) {
    if (duration == null || isNaN(duration)) duration = defaultAnimationDuration;
    if (duration <= 0) duration = 1;

    edgeSvg.append("path")
      .attr("id", "tempEdge" + line.attr("id"))
      .attr("stroke", edgeProperties["animateHighlightedPath"]["stroke"])
      .attr("stroke-width", edgeProperties["animateHighlightedPath"]["stroke-width"])
      .transition()
      .duration(duration)
      .each("start", function () {
        edgeSvg.select("#tempEdge" + line.attr("id"))
          .attr("d", initCommand);
      })
      .attr("d", lineCommand)
      .each("end", function () {
        line.attr("stroke", edgeProperties["path"]["highlighted"]["stroke"])
          .attr("stroke-width", edgeProperties["path"]["stroke-width"]);
        edgeSvg.select("#tempEdge" + line.attr("id"))
          .remove();
        draw(0);
      })
  }

  this.showEdge = function () {
    attributeList["path"]["d"] = lineCommand;
    attributeList["path"]["stroke-width"] = edgeProperties["path"]["stroke-width"];
  }

  this.hideEdge = function () {
    attributeList["path"]["d"] = initCommand;
  }

  this.showWeight = function () {
    attributeList["weight"]["font-size"] = edgeProperties["weight"]["font-size"];
  }

  this.hideWeight = function () {
    attributeList["weight"]["font-size"] = 0;
  }

  this.stateEdge = function (stateName) {
    var key;
    for (key in edgeProperties["path"][stateName])
      attributeList["path"][key] = edgeProperties["path"][stateName][key];
    for (key in edgeProperties["weight"][stateName])
      attributeList["weight"][key] = edgeProperties["weight"][stateName][key];
  }

  // Removes the edge (no animation)
  // If you want animation, hide & redraw the edge first, then call this function
  this.removeEdge = function () {
    graphVertexA.removeEdge(self);
    graphVertexB.removeEdge(self);
    line.remove();
    weightText.remove();
  }

  this.refreshPath = function () {
    var tempInit = initCommand;
    updatePath();
    if (attributeList["path"]["d"] == tempInit)
      attributeList["path"]["d"] = initCommand;
    else
      attributeList["path"]["d"] = lineCommand;
  }

  this.changeVertexA = function (newGraphVertexA) {
    var edgeDrawn = false;
    if (attributeList["path"]["d"] == lineCommand) edgeDrawn = true;

    graphVertexA.removeEdge(self);
    graphVertexA = newGraphVertexA;
    updatePath();

    lineCommand = curvedEdgeGenerator(calculateBezierCurve());
    initCommand = singlePointGenerator(calculateBezierCurve()[0]);
    attributeList["path"]["d"] = initCommand;
    graphVertexA.addEdge(self);

    if (edgeDrawn) attributeList["path"]["d"] = lineCommand;
  }

  this.changeVertexB = function (newGraphVertexB) {
    var edgeDrawn = false;
    if (attributeList["path"]["d"] == lineCommand) edgeDrawn = true;

    graphVertexB.removeEdge(self);
    graphVertexB = newGraphVertexB;
    updatePath();

    lineCommand = curvedEdgeGenerator(calculateBezierCurve());
    initCommand = singlePointGenerator(calculateBezierCurve()[0]);
    attributeList["path"]["d"] = initCommand;
    graphVertexB.addEdge(self);

    if (edgeDrawn) attributeList["path"]["d"] = lineCommand;
  }

  this.changeType = function (newType) {
    type = newType;
    updatePath();
    switch (type) {
      case EDGE_TYPE_UDE:
        attributeList["path"]["class"] = "ude";
        break;
      case EDGE_TYPE_DE:
        attributeList["path"]["class"] = "de";
        break;
      case EDGE_TYPE_BDE:
        attributeList["path"]["class"] = "bde";
        break;
      default:
        break;
    }
  }

  this.changeWeight = function (newWeight) {
    weight = newWeight;
    attributeList["weight"]["text"] = weight;
  }

  this.changeStrokeWidth = function (newStrokeWidth) {
    strokeWidth = newStrokeWidth;
    attributeList["path"]["stroke-width"] = newStrokeWidth;
  }

  this.changeCurveHeight = function (newHeight) {
    var edgeDrawn = false;
    if (attributeList["path"]["d"] == lineCommand) edgeDrawn = true;

    if (!isValidHeight(newHeight)) {
      console.warn("attempted to change curve height to " + newHeight + ". Invalid height.");
      return;
    }
    curveHeight = newHeight;
    updatePath();
    attributeList["path"]["d"] = initCommand;
    if (edgeDrawn) attributeList["path"]["d"] = lineCommand;
  }

  this.getVertex = function () {
    return [graphVertexA, graphVertexB];
  }

  this.getAttributes = function () {
    return deepCopy(attributeList["path"]);
  }

  this.getType = function () {
    return type;
  }

  this.toggleLOD = function () {
    isMediumScale = !isMediumScale;
    edgeProperties = isMediumScale ? graphEdgePropertiesMedium : graphEdgeProperties;
    // this.removeVertex();
    // init();
    if (attributeList["weight"]["font-size"] != 0) { // if unweighted, leave the font-size to 0
      attributeList["weight"]["font-size"] = edgeProperties["weight"]["font-size"];
    }
    weightText.attr("id", attributeList["weight"]["id"]);
    weightText.attr("fill", attributeList["weight"]["fill"])
      .attr("font-family", attributeList["weight"]["font-family"])
      .attr("font-size", attributeList["weight"]["font-size"])
      .attr("font-weight", attributeList["weight"]["font-weight"])
      .attr("text-anchor", attributeList["weight"]["text-anchor"]);
    updatePath();
    this.showEdge();
    this.redraw(defaultAnimationDuration);
  }

  // When medium scale is enabled, the pixel computations are changed, we scale it down accordingly to fix this issue.
  function getLODAdjustedCurveHeight() {
    return (isMediumScale) ? curveHeight / 2 : curveHeight;
  }

  // Helper Functions
  function resetSVGMarkers() {
    if (markerSvg.select("#arrow").empty()) {
      markerSvg.append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr('refX', ARROW_REFX)
        .attr("markerWidth", ARROW_MARKER_WIDTH)
        .attr("markerHeight", ARROW_MARKER_HEIGHT)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5 L10,0 L0,5")
        .attr('fill', ARROW_FILL);
    }
    if (markerSvg.select("#backwardArrow").empty()) {
      markerSvg.append("marker")
        .attr("id", "backwardArrow")
        .attr("viewBox", "-10 -5 10 10")
        .attr('refX', -1 * ARROW_REFX)
        .attr("markerWidth", ARROW_MARKER_WIDTH)
        .attr("markerHeight", ARROW_MARKER_HEIGHT)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5 L-10,0 L0,5")
        .attr('fill', ARROW_FILL);
    }
  }

  function init() {
    attributeList["path"]["id"] = "e" + edgeIdNumber;
    attributeList["path"]["d"] = initCommand;
    attributeList["path"]["stroke"] = edgeProperties["path"]["default"]["stroke"];
    attributeList["path"]["stroke-width"] = strokeWidth;
    attributeList["path"]["fill"] = edgeProperties["path"]["default"]["fill"];

    switch (type) {
      case EDGE_TYPE_UDE:
        attributeList["path"]["class"] = "ude";
        break;
      case EDGE_TYPE_DE:
        attributeList["path"]["class"] = "de";
        break;
      case EDGE_TYPE_BDE:
        attributeList["path"]["class"] = "bde";
        break;
      default:
        break;
    }

    attributeList["weight"]["id"] = "ew" + edgeIdNumber;
    attributeList["weight"]["startOffset"] = edgeProperties["weight"]["default"]["startOffset"];
    attributeList["weight"]["dy"] = edgeProperties["weight"]["default"]["dy"];
    attributeList["weight"]["fill"] = edgeProperties["weight"]["default"]["fill"];
    attributeList["weight"]["font-family"] = edgeProperties["weight"]["default"]["font-family"];
    attributeList["weight"]["font-size"] = 0;
    attributeList["weight"]["font-weight"] = edgeProperties["weight"]["default"]["font-weight"];
    attributeList["weight"]["text-anchor"] = edgeProperties["weight"]["default"]["text-anchor"];
    attributeList["weight"]["text"] = weight;

    line = edgeSvg.append("path");

    line.attr("id", attributeList["path"]["id"])
      .attr("class", attributeList["path"]["class"]);

    try {
      if (attributeList["path"]["d"] != "MNaN,NaNLNaN,NaN")
        line.attr("d", attributeList["path"]["d"])
          .attr("stroke", attributeList["path"]["stroke"])
          .attr("stroke-width", attributeList["path"]["stroke-width"])
          .attr("fill", attributeList["path"]["fill"]);
    }
    catch (err) {
    }

    extraTextPath = edgeExtraTextSvg.append("text")
      .append("textPath")
      .attr("text-anchor", "middle")
      .attr("startOffset", "50%")
      .attr("xlink:href", function () {
        return "#" + attributeList["path"]["id"];
      });

    extraTextSpan = extraTextPath
      .append("tspan")
      .attr("dy", -5)
      .text(function () { return ""; });

    weightText = edgeWeightSvg.append("text");
    weightText.attr("id", attributeList["weight"]["id"]);

    weightText.attr("fill", attributeList["weight"]["fill"])
      .attr("font-family", attributeList["weight"]["font-family"])
      .attr("font-size", attributeList["weight"]["font-size"])
      .attr("font-weight", attributeList["weight"]["font-weight"])
      .attr("text-anchor", attributeList["weight"]["text-anchor"]);

    weightTextPath = weightText.append("textPath")
      .attr("xlink:href", function () {
        return "#" + attributeList["path"]["id"];
      })
      .attr("startOffset", attributeList["weight"]["startOffset"]);

    weightTextSpan = weightTextPath.append("tspan")
      .attr("dy", attributeList["weight"]["dy"])
      .text(function () {
        return attributeList["weight"]["text"];
      });
  }

  function cxA() {
    if (graphVertexA)
      return parseFloat(graphVertexA.getAttributes()["outerVertex"]["cx"]);
  }

  function cyA() {
    if (graphVertexA)
      return parseFloat(graphVertexA.getAttributes()["outerVertex"]["cy"]);
  }

  function rA() {
    if (graphVertexA)
      return parseFloat(graphVertexA.getAttributes()["outerVertex"]["r"]);
  }

  function cxB() {
    if (graphVertexA)
      return parseFloat(graphVertexB.getAttributes()["outerVertex"]["cx"]);
  }

  function cyB() {
    if (graphVertexA)
      return parseFloat(graphVertexB.getAttributes()["outerVertex"]["cy"]);
  }

  function rB() {
    if (graphVertexA)
      return parseFloat(graphVertexB.getAttributes()["outerVertex"]["r"]);
  }

  /** Returns the (possibly adjusted) positions of the centers of vertA and vertB
      in the form [xA, yA, xB, yB];
  */
  function getCenters() {
    var x1, x2, y1, y2;
    var dx = cxB() - cxA();
    var dy = cyB() - cyA();
    var offsetX = dy / Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
    var offsetY = -dx / Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
    if (type == EDGE_TYPE_BDE) {

      // TODO: we should someday reconsider this logic to handle RECT objects.
      // Though we have not done so for now.
      if (isMediumScale) {
        x1 = cxA() + offsetX * rA() / 2; y1 = cyA() + offsetY * rA() / 2;
        x2 = cxB() + offsetX * rA() / 2; y2 = cyB() + offsetY * rB() / 2;
      } else {
        x1 = cxA() + offsetX * rA() / 4; y1 = cyA() + offsetY * rA() / 4;
        x2 = cxB() + offsetX * rA() / 4; y2 = cyB() + offsetY * rB() / 4;
      }
    } else {
      x1 = cxA(); y1 = cyA();
      x2 = cxB(); y2 = cyB();
    }
    return [x1, y1, x2, y2];
  }

  /**
   * Rotates point (x, y) by (angle) radians (ccw) from the center (cx, cy).
   * Returns in the form of an object with properties {"x", "y"}
   */
  function rotatePointByCenter(x, y, angle, cx, cy) {
    let xt = x - cx;
    let yt = y - cy;
    let rotated_xt = Math.cos(angle) * xt - Math.sin(angle) * yt;
    let rotated_yt = Math.sin(angle) * xt + Math.cos(angle) * yt;
    return {
      "x": rotated_xt + cx,
      "y": rotated_yt + cy
    }
  }

  // Creates a bezier curve that starts at (x1, y1), passes (x3, y3) in t = 0.5, then ends at (x2, y2).
  function getBezierCurve(x1, y1, x2, y2, x3, y3) {
    // Idea here is we find the apex of the curve
    // The formula to get the control point is based on
    // https://stackoverflow.com/questions/6711707/draw-a-quadratic-b%C3%A9zier-curve-through-three-given-points.

    let control_point = { "x": 2 * x3 - x1 / 2 - x2 / 2, "y": 2 * y3 - y1 / 2 - y2 / 2 };

    return [{ x: x1, y: y1 }, control_point, { x: x2, y: y2 }];
  }

  /**
   * Returns an array of three points [pA, control_p, pB]. Represents a
   * quadratic bezier curve starting at point pA to point pB using
   * the control point control_p
   */
  function calculateBezierCurve() {
    let [xA, yA, xB, yB] = getCenters();

    let vec_x = xB - xA;
    let vec_y = yB - yA;
    let vec_mag = Math.hypot(vec_x, vec_y);
    let unit_vec_x = vec_x / vec_mag;
    let unit_vec_y = vec_y / vec_mag;
    let perp_unit_vec = rotatePointByCenter(unit_vec_x, unit_vec_y, Math.PI / 2, 0, 0);
    let perp_vec_x = perp_unit_vec.x * getLODAdjustedCurveHeight();
    let perp_vec_y = perp_unit_vec.y * getLODAdjustedCurveHeight();

    let midX = (xA + xB) / 2;
    let midY = (yA + yB) / 2;

    let xC = midX + perp_vec_x;
    let yC = midY + perp_vec_y;


    // Start by getting bezier curve through center
    let curve = getBezierCurve(xA, yA, xB, yB, xC, yC);

    // Intersect with vertex to get new points
    let newLPoint = getVertexCurveIntersectionPoint(curve, graphVertexA);
    let newRPoint = getVertexCurveIntersectionPoint(curve, graphVertexB);

    return getBezierCurve(newLPoint.x, newLPoint.y, newRPoint.x, newRPoint.y, xC, yC);
  }

  // Solutions to ax^2 + bx + c = 0. Gives the [x] that satisfies.
  function getSolutionsToQuadraticEquation(a, b, c) {
    if (Math.abs(a) < EPS) {
      // We don't really care if a = b = 0.
      if (Math.abs(b) < EPS) return [];
      return [-c / b];
    }

    let D = b * b - 4 * a * c;
    let M = -b / (2 * a);
    if (Math.abs(D) < EPS) return [M];
    else if (D < 0) return [];
    else return [M - Math.sqrt(D) / (2 * a), M + Math.sqrt(D) / (2 * a)];
  }

  function getRectVertexCurveIntersectionPoint(curve, cx, cy, rectW, rectH) {
    let xRectL = cx - rectW / 2, xRectR = cx + rectW / 2, yRectL = cy - rectH / 2, yRectR = cy + rectH / 2;

    // Bezier curves are represented as P(t) = curve[0] * t^2 + 2 * curve[1] * t * (1 - t) + curve[2] * (1 - t)^2
    // Hence, let's write P(t)_x = Ax t^2 + Bx t + Cx and P(t)_y = Ay t^2 + By t + Cy

    let Ax = curve[0].x + curve[2].x - 2 * curve[1].x, Ay = curve[0].y + curve[2].y - 2 * curve[1].y;
    let Bx = 2 * curve[1].x - 2 * curve[2].x, By = 2 * curve[1].y - 2 * curve[2].y;
    let Cx = curve[2].x, Cy = curve[2].y;

    let boundSols = (sols) =>
      sols.filter((t) => (-EPS < t && t < 1 + EPS))
        .map((t) => {
          return { "x": Ax * t * t + Bx * t + Cx, "y": Ay * t * t + By * t + Cy }
        })
        .filter(({ x, y }) => (xRectL - EPS < x && x < xRectR + EPS) && (yRectL - EPS < y && y < yRectR + EPS));

    // We assume here that we always find a solution, and there is exactly one solution.
    // This should be reasonable based on our definitions and as long as the vertices are sufficiently far apart.
    // More importantly, we ignore the case where we draw edges if the vertices are intersecting.
    // Since that seems unreasonable in the first place.

    let xLSols = boundSols(getSolutionsToQuadraticEquation(Ax, Bx, Cx - xRectL));
    if (xLSols.length > 0) return xLSols[0];

    let xRSols = boundSols(getSolutionsToQuadraticEquation(Ax, Bx, Cx - xRectR));
    if (xRSols.length > 0) return xRSols[0];

    let yLSols = boundSols(getSolutionsToQuadraticEquation(Ay, By, Cy - yRectL));
    if (yLSols.length > 0) return yLSols[0];

    let yRSols = boundSols(getSolutionsToQuadraticEquation(Ay, By, Cy - yRectR));
    if (yRSols.length > 0) return yRSols[0];

    console.error("No solutions found in rect vertex curver intersection point", curve, cx, cy, rectW, rectH);
    return { x: cx, y: cy };
  }

  function getCircleLineSegmentIntersectionPoint(x1, y1, x2, y2, r, cx, cy) {
    let baX = x2 - x1; //pointB.x - pointA.x; horizontal distance
    let baY = y2 - y1; //pointB.y - pointA.y; vertical distance
    let caX = cx - x1; //center.x - pointA.x; horizontal distance from centre
    let caY = cy - y1; //center.y - pointA.y; vertical distance from centre

    let a = baX * baX + baY * baY;
    let bBy2 = baX * caX + baY * caY;
    let c = caX * caX + caY * caY - r * r;

    let pBy2 = bBy2 / a;
    let q = c / a;

    let disc = pBy2 * pBy2 - q;
    let tmpSqrt = Math.sqrt(disc);
    let abScalingFactor1 = -pBy2 + tmpSqrt;
    let abScalingFactor2 = -pBy2 - tmpSqrt;

    let r_x1 = x1 - baX * abScalingFactor1;
    let r_y1 = y1 - baY * abScalingFactor1;
    let r_x2 = x1 - baX * abScalingFactor2;
    let r_y2 = y1 - baY * abScalingFactor2;

    return [{ "x": r_x1, "y": r_y1 }, { "x": r_x2, "y": r_y2 }].filter(({ x, y }) => {
      return (Math.min(x1, x2) - EPS < x && x < Math.max(x1, x2) + EPS &&
        Math.min(y1, y2) - EPS < y && y < Math.max(y1, y2) + EPS);
    })
  }

  function getCircleVertexCurveIntersectionPoint(curve, r, cx, cy) {
    // Getting the actual circle-vertex curve is very painful.
    // We do the idea from this stackoverflow topic, 
    // https://stackoverflow.com/questions/51811935/point-of-intersection-between-bezier-curve-and-circle
    // where we just take the intersection from the circle to the control points.
    // This is a lot less painful to deal with.
    //
    // If you want to improve this solution, consider finding the quartic equation and then perform a few newton iterations on it
    // Should be sufficiently fast.

    let solsL = getCircleLineSegmentIntersectionPoint(curve[0].x, curve[0].y, curve[1].x, curve[1].y, r, cx, cy);
    if (solsL.length > 0) return solsL[0];

    let solsR = getCircleLineSegmentIntersectionPoint(curve[1].x, curve[1].y, curve[2].x, curve[2].y, r, cx, cy);
    if (solsR.length > 0) return solsR[0];

    console.error("No solutions found in circle vertex curver intersection point", curve, r, cx, cy);
    return { x: cx, y: cy };
  }

  function getVertexCurveIntersectionPoint(curve, vert) {
    if (vert.getShapeType() === GraphVertexShapeT.CIRCLE) {
      return getCircleVertexCurveIntersectionPoint(
        curve,
        Math.max(vert.getAttributes()["outerVertex"]["r"] - 2, 0),
        vert.getAttributes()["outerVertex"]["cx"],
        vert.getAttributes()["outerVertex"]["cy"]
      );
    } else if (vert.getShapeType() === GraphVertexShapeT.RECT) {
      return getRectVertexCurveIntersectionPoint(
        curve,
        vert.getAttributes()["outerVertex"]["cx"],
        vert.getAttributes()["outerVertex"]["cy"],
        Math.max(vert.getAttributes()["outerVertex"]["width"] - 2, 0),
        Math.max(vert.getAttributes()["outerVertex"]["height"] - 2, 0)
      )
    } else {
      throw new Error("Unknown vertex type in getVertexCurveIntersectionPoint");
    }
  }

  function draw(dur) {
    if (dur == null || isNaN(dur)) dur = defaultAnimationDuration;
    if (dur <= 0) dur = 1;

    line.attr("class", attributeList["path"]["class"]);
    line.transition()
      .duration(dur)
      .attr("d", attributeList["path"]["d"])
      .attr("stroke", attributeList["path"]["stroke"])
      .attr("stroke-width", attributeList["path"]["stroke-width"])
      .style("marker-start", function () {
        return null;
        // if (attributeList["path"]["d"] == initCommand)
        //   return null;
        // if (attributeList["path"]["class"] == "bde")
        //   return "url(#backwardArrow)";
        // return null;
      })
      .style(markerPosition, function () {
        if (attributeList["path"]["d"] == initCommand) {
          console.log('should NOT go here');
          return null;
        }
        if (attributeList["path"]["class"] == "de" || attributeList["path"]["class"] == "bde")
          return "url(#arrow)";
        console.log('or here');
        return null;
      });
    var weightColor = attributeList["weight"]["fill"];
    if (weight < 0) {
      weightColor = "#ff0000";
    }
    weightText.transition()
      .duration(dur)
      .attr("fill", weightColor)
      .attr("font-family", attributeList["weight"]["font-family"])
      .attr("font-size", attributeList["weight"]["font-size"])
      .attr("font-weight", attributeList["weight"]["font-weight"])
      .attr("text-anchor", attributeList["weight"]["text-anchor"])
      // TODO: Fix the rotation angle to make text upright again
      .attr("transform", function (d) {
        function toDecimal(percent) {
          return parseFloat(percent) / 100;
        }
        var weightDy = attributeList["weight"]["dy"]
        var weightfontsize = attributeList["weight"]["font-size"]
        var actualdyoffset = weightDy - weightfontsize / 2
        var offsetstart = toDecimal(attributeList["weight"]["startOffset"])

        var dx = cxB() - cxA();
        var dy = cyB() - cyA();
        var length = Math.sqrt(dx * dx + dy * dy)
        var actuallength = length - rA() - rB()
        var actualoffsetlength = actuallength * offsetstart + rA()


        var normdx = dx / length
        var normdy = dy / length
        var actualposX = normdx * actualoffsetlength + cxA()
        var actualposY = normdy * actualoffsetlength + cyA()

        var perpenX = actualdyoffset * -normdy
        var perpenY = actualdyoffset * normdx

        var xRot = actualposX + perpenX;
        var yRot = actualposY + perpenY;

        var angle = -Math.atan2(dy, dx) * 180 / Math.PI;
        return `rotate(${angle}, ${xRot}, ${yRot})`
      })

    weightTextSpan.transition()
      .duration(dur)
      .text(function () {
        return attributeList["weight"]["text"];
      });
  }

  function updatePath() {
    // calculatePath() now returns 3 points, every update should include 3 points
    lineCommand = curvedEdgeGenerator(calculateBezierCurve());
    initCommand = singlePointGenerator(calculateBezierCurve()[0]);
  }
}
