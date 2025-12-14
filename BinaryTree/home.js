// ============================================================================
// BST VISUALIZATION - Theo kiến trúc VisuAlgo 100%
// ============================================================================

// ==================== CONSTANTS ====================
const VERTEX_SHAPE_CIRCLE = "circle";
const VERTEX_DEFAULT = "default";
const VERTEX_HIGHLIGHTED = "highlighted";
const VERTEX_TRAVERSED = "traversed";
const VERTEX_RESULT = "result";
const VERTEX_LEFT_CHILD = "left-child";
const VERTEX_RIGHT_CHILD = "right-child";
const VERTEX_SELECTED = "selected";

const ANIMATION_DURATION = 500;
const OBJ_HIDDEN = "hidden";

// ==================== PROPERTIES ====================
const graphVertexStateProperties = {
    [VERTEX_DEFAULT]: {
        "fill-color": "#eee",
        "stroke-color": "#333",
        "text-color": "#333"
    },
    [VERTEX_HIGHLIGHTED]: {
        "fill-color": "#ff8a27",
        "stroke-color": "#ff8a27",
        "text-color": "#fff"
    },
    [VERTEX_TRAVERSED]: {
        "fill-color": "#eee",
        "stroke-color": "#ff8a27",
        "text-color": "#ff8a27"
    },
    [VERTEX_RESULT]: {
        "fill-color": "#52bc69",
        "stroke-color": "#52bc69",
        "text-color": "#fff"
    },
    [VERTEX_LEFT_CHILD]: {
        "fill-color": "#4cc9f0",
        "stroke-color": "#333",
        "text-color": "#fff"
    },
    [VERTEX_RIGHT_CHILD]: {
        "fill-color": "#4361ee",
        "stroke-color": "#333",
        "text-color": "#fff"
    },
    [VERTEX_SELECTED]: {
        "fill-color": "#f72585",
        "stroke-color": "#f72585",
        "text-color": "#fff"
    }
};

const graphVertexProperties = {
    "innerVertex": {
        "r": 22,
        "stroke-width": 0,
        "stroke": "#fff"
    },
    "outerVertex": {
        "r": 26,
        "stroke-width": 3
    },
    "text": {
        "font-size": 16,
        "font-sizes": [18, 17, 16, 14, 12, 10],
        "extra-text-size": 14,
        "font-family": "'Segoe UI', sans-serif",
        "font-weight": "bold",
        "text-anchor": "middle"
    }
};

const graphVertexPropertiesMedium = {
    "innerVertex": {
        "r": 10,
        "stroke-width": 0,
        "stroke": "#fff"
    },
    "outerVertex": {
        "r": 12,
        "stroke-width": 2
    },
    "text": {
        "font-size": 10,
        "font-sizes": [10, 10, 9, 8, 7, 6],
        "extra-text-size": 10,
        "font-family": "'Segoe UI', sans-serif",
        "font-weight": "bold",
        "text-anchor": "middle"
    }
};

// ==================== VERTEX WIDGET CLASS - Theo VisuAlgo ====================
class GraphVertexWidget {
    constructor(cx, cy, vertexText, vertexId, isMediumScale = false) {
        this.id = vertexId;
        this.cx = cx;
        this.cy = cy;
        this.vertexText = String(vertexText);
        this.isMediumScale = isMediumScale;
        this.isHidden = false;
        this.isCurrentlyAnimating = false;
        
        // Attribute list - theo VisuAlgo pattern
        this.attributeList = {
            innerVertex: {
                cx: cx,
                cy: cy,
                r: 0,
                fill: "#eee",
                stroke: "#fff",
                "stroke-width": 0
            },
            outerVertex: {
                cx: cx,
                cy: cy,
                r: 0,
                fill: "#333",
                stroke: "#333",
                "stroke-width": 0
            },
            text: {
                x: cx,
                y: cy + 6,
                fill: "#333",
                "font-family": "'Segoe UI', sans-serif",
                "font-size": 16,
                "font-weight": "bold",
                "text-anchor": "middle",
                text: vertexText
            },
            extratext: {
                x: cx,
                y: cy + 40,
                fill: "red",
                "font-size": 14,
                "text-anchor": "middle",
                text: ""
            }
        };
        
        // SVG elements
        this.innerVertex = null;
        this.outerVertex = null;
        this.textElement = null;
        this.extratextElement = null;
        
        this.vertexProperties = isMediumScale ? graphVertexPropertiesMedium : graphVertexProperties;
        
        this.init();
    }
    
    init() {
        const svg = d3.select('#treeSVG');
        let g = svg.select('g');
        
        // Ensure g exists
        if (g.empty()) {
            g = svg.append('g').attr('transform', 'translate(0,0) scale(1)');
        }
        
        // Tạo outer vertex (viền) - append LAST so it's on top
        this.outerVertex = g.append('circle')
            .attr('class', `vertex-outer v${this.id}`)
            .attr('cx', this.cx)
            .attr('cy', this.cy)
            .attr('r', 0)
            .style('pointer-events', 'all');
        
        // Tạo inner vertex (lõi)
        this.innerVertex = g.append('circle')
            .attr('class', `vertex-inner v${this.id}`)
            .attr('cx', this.cx)
            .attr('cy', this.cy)
            .attr('r', 0)
            .style('pointer-events', 'none');
        
        // Tạo text
        this.textElement = g.append('text')
            .attr('class', `vertex-text v${this.id}`)
            .attr('x', this.cx)
            .attr('y', this.cy + 6)
            .attr('text-anchor', 'middle')
            .attr('font-size', 0)
            .style('pointer-events', 'none')
            .text(this.vertexText);
        
        // Tạo extratext
        this.extratextElement = g.append('text')
            .attr('class', `vertex-extratext v${this.id}`)
            .attr('x', this.cx)
            .attr('y', this.cy + 40)
            .attr('text-anchor', 'middle')
            .attr('font-size', 0)
            .style('pointer-events', 'none');
        
        // Set initial properties
        this.recalculateVertexShape();
        this.stateVertex(VERTEX_DEFAULT);
        this.hideVertex();
        
        // Add click handler only on outer vertex
        const self = this;
        this.outerVertex.on('click', function() { self.onClick(); });
    }
    
    recalculateVertexShape() {
        this.vertexProperties = this.isMediumScale ? graphVertexPropertiesMedium : graphVertexProperties;
        
        this.attributeList.innerVertex.r = this.vertexProperties.innerVertex.r;
        this.attributeList.innerVertex["stroke-width"] = this.vertexProperties.innerVertex["stroke-width"];
        this.attributeList.innerVertex.stroke = this.vertexProperties.innerVertex.stroke;
        
        this.attributeList.outerVertex.r = this.vertexProperties.outerVertex.r;
        this.attributeList.outerVertex["stroke-width"] = this.vertexProperties.outerVertex["stroke-width"];
        
        this.attributeList.text["font-family"] = this.vertexProperties.text["font-family"];
        this.attributeList.text["font-weight"] = this.vertexProperties.text["font-weight"];
        this.attributeList.text["text-anchor"] = this.vertexProperties.text["text-anchor"];
        this.attributeList.text["font-size"] = this.getAppropriateFontSize();
        
        this.attributeList.extratext["font-size"] = this.vertexProperties.text["extra-text-size"];
    }
    
    getAppropriateFontSize() {
        let textLength = Math.round(this.vertexText.length);
        if (textLength >= 6) textLength = 6;
        if (textLength === 0) textLength = 1;
        return this.vertexProperties.text["font-sizes"][textLength - 1];
    }
    
    moveVertex(cx, cy) {
        this.cx = cx;
        this.cy = cy;
        this.attributeList.innerVertex.cx = cx;
        this.attributeList.innerVertex.cy = cy;
        this.attributeList.outerVertex.cx = cx;
        this.attributeList.outerVertex.cy = cy;
        this.attributeList.text.x = cx;
        this.attributeList.text.y = cy + 6;
        this.attributeList.extratext.x = cx;
        this.attributeList.extratext.y = cy + 40;
    }
    
    changeText(newText) {
        this.vertexText = String(newText);
        this.attributeList.text.text = this.vertexText;
        this.attributeList.text["font-size"] = this.getAppropriateFontSize();
    }
    
    changeExtraText(newExtraText) {
        this.attributeList.extratext.text = newExtraText;
    }
    
    showVertex() {
        this.isHidden = false;
        this.attributeList.outerVertex.r = this.vertexProperties.outerVertex.r;
        this.attributeList.outerVertex["stroke-width"] = this.vertexProperties.outerVertex["stroke-width"];
        
        this.attributeList.innerVertex.r = this.vertexProperties.innerVertex.r;
        this.attributeList.innerVertex["stroke-width"] = this.vertexProperties.innerVertex["stroke-width"];
        
        this.attributeList.text["font-size"] = this.getAppropriateFontSize();
        this.attributeList.extratext["font-size"] = this.vertexProperties.text["extra-text-size"];
    }
    
    hideVertex() {
        this.isHidden = true;
        this.attributeList.outerVertex.r = 0;
        this.attributeList.outerVertex["stroke-width"] = 0;
        this.attributeList.innerVertex.r = 0;
        this.attributeList.innerVertex["stroke-width"] = 0;
        this.attributeList.text["font-size"] = 0;
        this.attributeList.extratext["font-size"] = 0;
    }
    
    stateVertex(stateName) {
        if (!(stateName in graphVertexStateProperties)) {
            stateName = VERTEX_DEFAULT;
        }
        
        const stateProps = graphVertexStateProperties[stateName];
        
        if (this.isMediumScale) {
            this.attributeList.innerVertex.fill = stateProps["fill-color"];
            this.attributeList.outerVertex.fill = stateProps["stroke-color"];
            this.attributeList.outerVertex.stroke = stateProps["stroke-color"];
            this.attributeList.text.fill = stateProps["stroke-color"];
        } else {
            this.attributeList.innerVertex.fill = stateProps["fill-color"];
            this.attributeList.outerVertex.fill = stateProps["stroke-color"];
            this.attributeList.outerVertex.stroke = stateProps["stroke-color"];
            this.attributeList.text.fill = stateProps["text-color"];
        }
    }
    
    redraw(duration = ANIMATION_DURATION) {
        if (duration <= 0) duration = 1;
        
        this.isCurrentlyAnimating = true;
        
        // Animate outer vertex
        this.outerVertex.transition()
            .duration(duration)
            .attr('cx', this.attributeList.outerVertex.cx)
            .attr('cy', this.attributeList.outerVertex.cy)
            .attr('r', this.attributeList.outerVertex.r)
            .attr('fill', this.attributeList.outerVertex.fill)
            .attr('stroke', this.attributeList.outerVertex.stroke)
            .attr('stroke-width', this.attributeList.outerVertex["stroke-width"]);
        
        // Animate inner vertex
        this.innerVertex.transition()
            .duration(duration)
            .attr('cx', this.attributeList.innerVertex.cx)
            .attr('cy', this.attributeList.innerVertex.cy)
            .attr('r', this.attributeList.innerVertex.r)
            .attr('fill', this.attributeList.innerVertex.fill)
            .attr('stroke', this.attributeList.innerVertex.stroke)
            .attr('stroke-width', this.attributeList.innerVertex["stroke-width"]);
        
        // Animate text
        this.textElement.transition()
            .duration(duration)
            .attr('x', this.attributeList.text.x)
            .attr('y', this.attributeList.text.y)
            .attr('fill', this.attributeList.text.fill)
            .attr('font-family', this.attributeList.text["font-family"])
            .attr('font-size', this.attributeList.text["font-size"])
            .attr('font-weight', this.attributeList.text["font-weight"])
            .attr('text-anchor', this.attributeList.text["text-anchor"])
            .text(this.attributeList.text.text);
        
        // Animate extratext
        this.extratextElement.transition()
            .duration(duration)
            .attr('x', this.attributeList.extratext.x)
            .attr('y', this.attributeList.extratext.y)
            .attr('fill', this.attributeList.extratext.fill)
            .attr('font-size', this.attributeList.extratext["font-size"])
            .attr('text-anchor', this.attributeList.extratext["text-anchor"])
            .text(this.attributeList.extratext.text);
        
        setTimeout(() => {
            this.isCurrentlyAnimating = false;
        }, duration * 2.5);
    }
    
    toggleLOD() {
        this.isMediumScale = !this.isMediumScale;
        this.recalculateVertexShape();
        this.showVertex();
        this.redraw(ANIMATION_DURATION);
    }
    
    removeVertex() {
        if (this.outerVertex) this.outerVertex.remove();
        if (this.innerVertex) this.innerVertex.remove();
        if (this.textElement) this.textElement.remove();
        if (this.extratextElement) this.extratextElement.remove();
    }
    
    onClick() {
        if (window.onVertexClick) {
            window.onVertexClick(this);
        }
    }
    
    getCx() { return this.cx; }
    getCy() { return this.cy; }
    getId() { return this.id; }
}

// ==================== TREE NODE ====================
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.widget = null;
        this.depth = 0;
        this.finalX = 0;
        this.relativeX = 0;
        this.mod = 0;
    }
}

// ==================== BST CLASS ====================
class BinarySearchTree {
    constructor() {
        this.root = null;
        this.selectedNode = null;
        this.nodeId = 0;
    }
    
    insert(value) {
        const newNode = new TreeNode(value);
        if (this.root === null) {
            this.root = newNode;
            newNode.depth = 0;
        } else {
            this.insertNode(this.root, newNode, 1);
        }
        return newNode;
    }
    
    insertNode(node, newNode, depth) {
        newNode.depth = depth;
        if (newNode.value < node.value) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode, depth + 1);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode, depth + 1);
            }
        }
    }
    
    find(value) {
        return this.findNode(this.root, value);
    }
    
    findNode(node, value) {
        if (node === null) return null;
        if (value < node.value) return this.findNode(node.left, value);
        if (value > node.value) return this.findNode(node.right, value);
        return node;
    }
    
    delete(value) {
        this.root = this.deleteNode(this.root, value);
    }
    
    deleteNode(node, value) {
        if (node === null) return null;
        
        if (value < node.value) {
            node.left = this.deleteNode(node.left, value);
            return node;
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value);
            return node;
        } else {
            if (node.left === null && node.right === null) {
                return null;
            }
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;
            
            const minNode = this.findMinNode(node.right);
            node.value = minNode.value;
            node.right = this.deleteNode(node.right, minNode.value);
            return node;
        }
    }
    
    findMinNode(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }
    
    getHeight(node = this.root) {
        if (node === null) return 0;
        return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }
    
    countNodes(node = this.root) {
        if (node === null) return 0;
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }
    
    inOrder(node = this.root, result = []) {
        if (node !== null) {
            this.inOrder(node.left, result);
            result.push(node);
            this.inOrder(node.right, result);
        }
        return result;
    }
}

// ==================== GRAPH WIDGET ====================
class GraphWidget {
    constructor() {
        this.vertexList = {};
        this.edgeList = {};
        this.isMediumScale = false;
        this.vertexIdCounter = 0;
        
        this.initSVG();
    }
    
    initSVG() {
        const svg = d3.select('#treeSVG');
        svg.selectAll('*').remove();
        svg.append('g')
            .attr('transform', 'translate(0,0) scale(1)');
    }
    
    addVertex(cx, cy, vertexText, show = true) {
        const vertexId = this.vertexIdCounter++;
        const newVertex = new GraphVertexWidget(cx, cy, vertexText, vertexId, this.isMediumScale);
        
        this.vertexList[vertexId] = newVertex;
        
        if (show) {
            newVertex.showVertex();
            newVertex.redraw(0);
        }
        
        return newVertex;
    }
    
    removeVertex(vertexId) {
        if (this.vertexList[vertexId]) {
            this.vertexList[vertexId].removeVertex();
            delete this.vertexList[vertexId];
        }
    }
    
    clearAll() {
        for (let key in this.vertexList) {
            this.vertexList[key].removeVertex();
        }
        this.vertexList = {};
        this.edgeList = {};
        this.initSVG();
    }
    
    toggleLOD() {
        this.isMediumScale = !this.isMediumScale;
        for (let key in this.vertexList) {
            this.vertexList[key].toggleLOD();
        }
    }
    
    updateGraph(stateList, duration = ANIMATION_DURATION) {
        // Update all vertices based on state list
        for (let key in stateList.vl) {
            const state = stateList.vl[key];
            const vertex = this.vertexList[key];
            
            if (vertex) {
                if (state.state === OBJ_HIDDEN) {
                    vertex.hideVertex();
                } else {
                    vertex.showVertex();
                    if (state.cx !== undefined) vertex.moveVertex(state.cx, state.cy);
                    if (state.text !== undefined) vertex.changeText(state.text);
                    if (state.extratext !== undefined) vertex.changeExtraText(state.extratext);
                    if (state.state !== undefined) vertex.stateVertex(state.state);
                }
                vertex.redraw(duration);
            }
        }
    }
}

// ==================== VISUALIZATION ====================
const bst = new BinarySearchTree();
const graphWidget = new GraphWidget();
let selectedNode = null;
let zoomLevel = 1;
let translateX = 0;
let translateY = 0;
let isAnimating = false;
let edgeList = [];

// Walker Algorithm for tree layout - ĐÚNG CHUẨN
function calculateTreeLayout() {
    if (!bst.root) return { stateList: { vl: {} }, edges: [] };
    
    const nodeCount = bst.countNodes();
    const treeHeight = bst.getHeight();
    
    // Spacing parameters - tính toán lại để góc lệch đối xứng
    const baseNodeSpacing = 80;
    const levelHeight = 100;
    const STANDARD_OFFSET = 2; // Offset chuẩn cho góc lệch đối xứng
    
    let nextPos = 0; // Counter for leaf positioning
    
    // PHASE 1: Post-order traversal - tính toán vị trí với góc đối xứng
    function firstWalk(node, depth = 0) {
        if (!node) return;
        
        node.depth = depth;
        node.mod = 0;
        
        if (!node.left && !node.right) {
            // Leaf node - assign sequential position
            node.prelim = nextPos;
            nextPos += STANDARD_OFFSET;
        } else {
            // Process children first (post-order)
            if (node.left) firstWalk(node.left, depth + 1);
            if (node.right) firstWalk(node.right, depth + 1);
            
            if (!node.left && node.right) {
                // Chỉ có con phải
                // Con phải phải ở bên PHẢI parent đúng STANDARD_OFFSET
                node.prelim = node.right.prelim - STANDARD_OFFSET;
                node.mod = 0;
            } else if (node.left && !node.right) {
                // Chỉ có con trái
                // Con trái phải ở bên TRÁI parent đúng STANDARD_OFFSET
                node.prelim = node.left.prelim + STANDARD_OFFSET;
                node.mod = 0;
            } else {
                // Có cả 2 con
                // Parent phải ở CHÍNH GIỮA 2 con
                // 2 con phải lệch đều 2 bên
                const leftPrelim = node.left.prelim;
                const rightPrelim = node.right.prelim;
                
                // Tính vị trí giữa
                const midPoint = (leftPrelim + rightPrelim) / 2;
                node.prelim = midPoint;
                
                // Đảm bảo 2 con cách đều parent ít nhất STANDARD_OFFSET
                const leftDist = midPoint - leftPrelim;
                const rightDist = rightPrelim - midPoint;
                
                const minDist = STANDARD_OFFSET;
                
                if (leftDist < minDist) {
                    // Đẩy con trái sang trái
                    const shift = minDist - leftDist;
                    node.left.mod -= shift;
                    node.prelim += shift / 2;
                }
                
                if (rightDist < minDist) {
                    // Đẩy con phải sang phải
                    const shift = minDist - rightDist;
                    node.right.mod += shift;
                    node.prelim -= shift / 2;
                }
            }
            
            // Check for conflicts with siblings' subtrees
            fixSubtreeConflicts(node);
        }
    }
    
    // Fix conflicts between left and right subtrees
    function fixSubtreeConflicts(node) {
        if (!node.left || !node.right) return;
        
        const minDist = STANDARD_OFFSET;
        
        // Get contours (biên ngoài của subtree)
        function getRightContour(n, modSum = 0, values = []) {
            if (!n) return values;
            values.push(n.prelim + modSum);
            if (n.right) return getRightContour(n.right, modSum + n.mod, values);
            if (n.left) return getRightContour(n.left, modSum + n.mod, values);
            return values;
        }
        
        function getLeftContour(n, modSum = 0, values = []) {
            if (!n) return values;
            values.push(n.prelim + modSum);
            if (n.left) return getLeftContour(n.left, modSum + n.mod, values);
            if (n.right) return getLeftContour(n.right, modSum + n.mod, values);
            return values;
        }
        
        const leftContour = getRightContour(node.left, node.left.mod);
        const rightContour = getLeftContour(node.right, node.right.mod);
        
        let maxShift = 0;
        const depth = Math.min(leftContour.length, rightContour.length);
        
        // Check từng level xem có conflict không
        for (let i = 0; i < depth; i++) {
            const gap = rightContour[i] - leftContour[i];
            if (gap < minDist) {
                maxShift = Math.max(maxShift, minDist - gap);
            }
        }
        
        // Shift cả 2 subtree đều nhau để giữ parent ở giữa
        if (maxShift > 0) {
            node.left.mod -= maxShift / 2;
            node.right.mod += maxShift / 2;
            // Parent vẫn ở giữa, không cần thay đổi prelim
        }
    }
    
    // PHASE 2: Pre-order traversal - calculate final positions
    function secondWalk(node, modSum = 0) {
        if (!node) return;
        
        node.finalX = node.prelim + modSum;
        
        if (node.left) secondWalk(node.left, modSum + node.mod);
        if (node.right) secondWalk(node.right, modSum + node.mod);
    }
    
    // Execute Walker's algorithm
    nextPos = 0;
    firstWalk(bst.root, 0);
    secondWalk(bst.root, 0);
    
    // Find bounds
    let minX = Infinity, maxX = -Infinity;
    function findBounds(node) {
        if (!node) return;
        minX = Math.min(minX, node.finalX);
        maxX = Math.max(maxX, node.finalX);
        findBounds(node.left);
        findBounds(node.right);
    }
    findBounds(bst.root);
    
    // Calculate final positions
    const container = document.getElementById('graphContainer');
    const svgWidth = Math.max(container.clientWidth, 1200);
    const svgHeight = Math.max(container.clientHeight, 800);
    
    const treeWidth = (maxX - minX) * baseNodeSpacing;
    const offsetX = (svgWidth - treeWidth) / 2 - minX * baseNodeSpacing;
    const startY = 80;
    
    const stateList = { vl: {} };
    const edges = [];
    let nodeId = 0;
    
    function assignPositions(node) {
        if (!node) return;
        
        const cx = node.finalX * baseNodeSpacing + offsetX;
        const cy = node.depth * levelHeight + startY;
        
        let state = VERTEX_DEFAULT;
        if (node === bst.root) {
            state = VERTEX_DEFAULT;
        } else if (node === selectedNode) {
            state = VERTEX_SELECTED;
        } else if (node.value < node.parent?.value) {
            state = VERTEX_LEFT_CHILD;
        } else {
            state = VERTEX_RIGHT_CHILD;
        }
        
        stateList.vl[nodeId] = {
            cx: cx,
            cy: cy,
            text: node.value,
            state: state
        };
        
        node.widgetId = nodeId;
        node.cx = cx;
        node.cy = cy;
        
        // Create edges to children
        if (node.left) {
            edges.push({
                from: nodeId,
                to: nodeId + 1,
                type: 'left',
                x1: cx,
                y1: cy,
                node: node.left
            });
        }
        
        nodeId++;
        assignPositions(node.left);
        assignPositions(node.right);
        
        // Edge to right child
        if (node.right) {
            edges.push({
                from: node.widgetId,
                to: node.right.widgetId,
                type: 'right',
                x1: cx,
                y1: cy,
                x2: node.right.cx,
                y2: node.right.cy
            });
        }
    }
    
    // Track parent
    function trackParent(node, parent = null) {
        if (!node) return;
        node.parent = parent;
        trackParent(node.left, node);
        trackParent(node.right, node);
    }
    trackParent(bst.root);
    
    assignPositions(bst.root);
    
    // Fix edge coordinates
    edges.forEach(edge => {
        if (edge.node) {
            edge.x2 = edge.node.cx;
            edge.y2 = edge.node.cy;
        }
    });
    
    return { stateList, edges };
}

function updateTree() {
    if (!bst.root) {
        graphWidget.clearAll();
        updateInfoPanel();
        return;
    }
    
    const { stateList, edges } = calculateTreeLayout();
    
    // Remove old widgets that don't exist anymore
    const newIds = Object.keys(stateList.vl).map(k => parseInt(k));
    const oldIds = Object.keys(graphWidget.vertexList).map(k => parseInt(k));
    
    oldIds.forEach(id => {
        if (!newIds.includes(id)) {
            graphWidget.removeVertex(id);
        }
    });
    
    // Create new vertices (only if they don't exist)
    for (let key in stateList.vl) {
        if (!graphWidget.vertexList[key]) {
            const state = stateList.vl[key];
            graphWidget.addVertex(state.cx, state.cy, state.text, false);
        }
    }
    
    // Draw edges
    const svg = d3.select('#treeSVG');
    const g = svg.select('g');
    
    // Remove old edges
    g.selectAll('.link').remove();
    
    // Draw new edges BEFORE updating vertices
    edges.forEach(edge => {
        g.insert('line', ':first-child') // Insert at beginning so edges are behind
            .attr('x1', edge.x1)
            .attr('y1', edge.y1)
            .attr('x2', edge.x2)
            .attr('y2', edge.y2)
            .attr('class', `link link-${edge.type}`)
            .attr('stroke', edge.type === 'left' ? '#4cc9f0' : '#4361ee')
            .attr('stroke-width', 2.5)
            .attr('stroke-linecap', 'round')
            .attr('opacity', 0.8);
    });
    
    // Update vertices with animation
    graphWidget.updateGraph(stateList, ANIMATION_DURATION);
    updateInfoPanel();
}

// ==================== UI FUNCTIONS ====================
function createTreeFromInput() {
    const nodeCountInput = document.getElementById('nodeCount');
    const nodeValuesInput = document.getElementById('nodeValues');
    
    const nodeCount = parseInt(nodeCountInput.value);
    const valuesText = nodeValuesInput.value.trim();
    
    if (!nodeCount || nodeCount < 1 || !valuesText) {
        alert('Vui lòng nhập số lượng node và giá trị hợp lệ!');
        return;
    }
    
    const values = valuesText.split(',').map(val => parseInt(val.trim())).filter(val => !isNaN(val));
    
    bst.root = null;
    selectedNode = null;
    
    for (const value of values) {
        if (!bst.find(value)) {
            bst.insert(value);
        }
    }
    
    updateTree();
}

function createRandomTree() {
    const nodeCount = parseInt(document.getElementById('nodeCount').value) || 10;
    
    bst.root = null;
    selectedNode = null;
    
    const values = new Set();
    while (values.size < nodeCount) {
        values.add(Math.floor(Math.random() * 200) - 99);
    }
    
    for (const value of values) {
        bst.insert(value);
    }
    
    document.getElementById('nodeValues').value = Array.from(values).join(', ');
    updateTree();
}

function insertNode() {
    const value = parseInt(document.getElementById('nodeValue').value);
    
    if (isNaN(value)) {
        alert('Vui lòng nhập giá trị hợp lệ!');
        return;
    }
    
    if (bst.find(value)) {
        alert('Giá trị đã tồn tại!');
        return;
    }
    
    bst.insert(value);
    document.getElementById('nodeValue').value = '';
    updateTree();
}

function findNode() {
    const value = parseInt(document.getElementById('nodeValue').value);
    
    if (isNaN(value)) {
        alert('Vui lòng nhập giá trị cần tìm!');
        return;
    }
    
    const node = bst.find(value);
    if (node) {
        selectedNode = node;
        updateTree();
        alert(`Tìm thấy node ${value}!`);
    } else {
        alert(`Không tìm thấy node ${value}!`);
    }
}

function deleteSelectedNode() {
    if (!selectedNode) {
        alert('Vui lòng chọn một node để xóa!');
        return;
    }
    
    bst.delete(selectedNode.value);
    selectedNode = null;
    updateTree();
}

function clearTree() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ cây?')) {
        bst.root = null;
        selectedNode = null;
        updateTree();
    }
}

function balanceTree() {
    const nodes = bst.inOrder().map(n => n.value);
    
    function buildBalanced(arr, start, end) {
        if (start > end) return null;
        const mid = Math.floor((start + end) / 2);
        const node = new TreeNode(arr[mid]);
        node.left = buildBalanced(arr, start, mid - 1);
        node.right = buildBalanced(arr, mid + 1, end);
        return node;
    }
    
    bst.root = buildBalanced(nodes, 0, nodes.length - 1);
    updateTree();
}

function traverseTree(type) {
    let nodes = [];
    if (type === 'inorder') nodes = bst.inOrder();
    alert(`Duyệt cây: ${nodes.map(n => n.value).join(' → ')}`);
}

function zoomIn() {
    zoomLevel = Math.min(3, zoomLevel + 0.1);
    d3.select('#treeSVG g').attr('transform', `translate(${translateX},${translateY}) scale(${zoomLevel})`);
}

function zoomOut() {
    zoomLevel = Math.max(0.1, zoomLevel - 0.1);
    d3.select('#treeSVG g').attr('transform', `translate(${translateX},${translateY}) scale(${zoomLevel})`);
}

function resetZoom() {
    zoomLevel = 1;
    translateX = 0;
    translateY = 0;
    d3.select('#treeSVG g').attr('transform', 'translate(0,0) scale(1)');
}

function toggleControls() {
    const controlBar = document.getElementById('controlBar');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleText = document.getElementById('toggleText');
    
    controlBar.classList.toggle('collapsed');
    
    if (controlBar.classList.contains('collapsed')) {
        toggleIcon.textContent = '►';
        toggleText.textContent = 'Mở Rộng Controls';
    } else {
        toggleIcon.textContent = '▼';
        toggleText.textContent = 'Thu Nhỏ Controls';
    }
}

function toggleInfoPanel() {
    const infoPanel = document.getElementById('infoPanel');
    const toggleInfoBtn = document.getElementById('toggleInfoBtn');
    
    infoPanel.classList.toggle('collapsed');
    
    if (infoPanel.classList.contains('collapsed')) {
        toggleInfoBtn.innerHTML = '<span>▲</span> Thuật Toán';
    } else {
        toggleInfoBtn.innerHTML = '<span>▼</span> Thuật Toán';
    }
}

function toggleLOD() {
    graphWidget.toggleLOD();
}

function updateInfoPanel() {
    document.getElementById('nodeCountDisplay').textContent = bst.countNodes();
    document.getElementById('treeHeight').textContent = bst.getHeight();
    document.getElementById('selectedValue').textContent = selectedNode ? selectedNode.value : '-';
    document.getElementById('balanceStatus').textContent = '✓';
}

// Vertex click handler
window.onVertexClick = function(widget) {
    // Find corresponding node
    function findNodeByWidget(node) {
        if (!node) return null;
        if (node.widgetId === widget.getId()) return node;
        return findNodeByWidget(node.left) || findNodeByWidget(node.right);
    }
    
    selectedNode = findNodeByWidget(bst.root);
    updateTree();
};

// Event listeners
document.getElementById('nodeValue').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') insertNode();
});

// Initialize
function initializeSampleTree() {
    const sampleValues = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
    
    document.getElementById('nodeCount').value = sampleValues.length;
    document.getElementById('nodeValues').value = sampleValues.join(', ');
    
    sampleValues.forEach(value => bst.insert(value));
    updateTree();
}

initializeSampleTree();
