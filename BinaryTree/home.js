
// Lớp Node cho BST
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.id = `node_${value}_${Date.now()}`;
        this.x = 0;
        this.y = 0;
        this.depth = 0;
        this.side = 'root';
        this.width = 1;
        this.position = 0;
    }
}

// Lớp Binary Search Tree
class BinarySearchTree {
    constructor() {
        this.root = null;
        this.selectedNode = null;
    }

    insert(value) {
        const newNode = new TreeNode(value);
        if (this.root === null) {
            this.root = newNode;
            newNode.depth = 0;
            newNode.side = 'root';
        } else {
            this.insertNode(this.root, newNode, 1);
        }
        return newNode;
    }

    insertNode(node, newNode, depth) {
        newNode.depth = depth;
        if (newNode.value < node.value) {
            newNode.side = 'left';
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode, depth + 1);
            }
        } else {
            newNode.side = 'right';
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

            if (node.left === null) {
                return node.right;
            } else if (node.right === null) {
                return node.left;
            }

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

    isValidBST(node = this.root, min = -Infinity, max = Infinity) {
        if (node === null) return true;
        if (node.value <= min || node.value >= max) return false;
        return this.isValidBST(node.left, min, node.value) && 
                this.isValidBST(node.right, node.value, max);
    }

    calculateTreeLayout(node = this.root) {
        if (node === null) return { width: 0, position: 0 };
        
        const left = this.calculateTreeLayout(node.left);
        const right = this.calculateTreeLayout(node.right);
        
        node.width = 1 + left.width + right.width;
        node.position = left.width;
        
        return {
            width: node.width,
            position: node.position
        };
    }

    // Các phương thức duyệt cây
    inOrder(node = this.root, result = []) {
        if (node !== null) {
            this.inOrder(node.left, result);
            result.push(node);
            this.inOrder(node.right, result);
        }
        return result;
    }

    preOrder(node = this.root, result = []) {
        if (node !== null) {
            result.push(node);
            this.preOrder(node.left, result);
            this.preOrder(node.right, result);
        }
        return result;
    }

    postOrder(node = this.root, result = []) {
        if (node !== null) {
            this.postOrder(node.left, result);
            this.postOrder(node.right, result);
            result.push(node);
        }
        return result;
    }
}

// Biến toàn cục
const bst = new BinarySearchTree();
const svg = d3.select('#treeSVG');
let selectedNode = null;
let zoomLevel = 1;
let svgWidth = 0;
let svgHeight = 0;
let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;
let lastAddedNode = null;
let nodesToRemove = [];
let isAnimating = false;

// Tính toán vị trí các node với khoảng cách tối ưu
function calculateNodePositions() {
    if (!bst.root) return { nodes: [], links: [] };
    
    const nodes = [];
    const links = [];
    
    bst.calculateTreeLayout();
    
    const nodeCount = bst.countNodes();
    const treeHeight = bst.getHeight();
    
    // Tăng kích thước cây
    const baseNodeSpacing = 150;
    const levelHeight = 180;
    
    // Tính toán kích thước SVG dựa trên số node
    const container = document.getElementById('graphContainer');
    const availableWidth = Math.max(3000, nodeCount * baseNodeSpacing);
    const availableHeight = Math.max(1500, treeHeight * levelHeight);
    
    svgWidth = availableWidth;
    svgHeight = availableHeight;
    
    svg.attr('width', svgWidth)
        .attr('height', svgHeight);
    
    function assignPositions(node, xMin, xMax, y) {
        if (!node) return;
        
        const availableWidth = xMax - xMin;
        const nodeX = xMin + availableWidth * (node.position + 0.5) / node.width;
        
        node.x = nodeX;
        node.y = y;
        nodes.push(node);
        
        const leftWidth = node.left ? node.left.width : 0;
        const rightWidth = node.right ? node.right.width : 0;
        
        const leftXMax = xMin + availableWidth * leftWidth / node.width;
        const rightXMin = xMax - availableWidth * rightWidth / node.width;
        
        if (node.left) {
            assignPositions(node.left, xMin, leftXMax, y + levelHeight);
            links.push({
                source: node,
                target: node.left,
                type: 'left'
            });
        }
        
        if (node.right) {
            assignPositions(node.right, rightXMin, xMax, y + levelHeight);
            links.push({
                source: node,
                target: node.right,
                type: 'right'
            });
        }
    }
    
    assignPositions(bst.root, 0, svgWidth, 150);
    
    return { nodes, links };
}

// Cập nhật hiển thị cây
function updateTree() {
    svg.selectAll('*').remove();

    if (!bst.root) {
        updateInfoPanel();
        return;
    }

    const { nodes, links } = calculateNodePositions();

    const g = svg.append('g')
        .attr('transform', `translate(${translateX},${translateY}) scale(${zoomLevel})`);

    // Vẽ các đường kết nối
    const linkElements = g.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

    // Vẽ các node
    const nodeElements = g.selectAll('.node')
        .data(nodes)
        .enter().append('g')
        .attr('class', d => {
            let className = 'node';
            if (d === selectedNode) className += ' selected';
            else if (d.side === 'left') className += ' left-node';
            else if (d.side === 'right') className += ' right-node';
            
            // Thêm lớp animation nếu là node mới
            if (d === lastAddedNode) {
                className += ' node-added';
                lastAddedNode = null;
            }
            
            // Thêm lớp animation nếu node sắp bị xóa
            if (nodesToRemove.includes(d.value)) {
                className += ' node-removed';
            }
            
            return className;
        })
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .on('click', function(event, d) {
            if (!isAnimating) {
                selectedNode = d;
                updateTree();
            }
        });

    // Tăng kích thước node
    nodeElements.append('circle')
        .attr('r', 24);

    nodeElements.append('text')
        .text(d => d.value)
        .attr('text-anchor', 'middle')
        .attr('dy', 6)
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('font-size', '16px');

    // Xóa các node đã được đánh dấu để xóa khỏi danh sách
    nodesToRemove = [];

    updateInfoPanel();
}

// Tạo hiệu ứng mũi tên duyệt cây
function animateTraversal(path, callback) {
    if (path.length === 0) {
        if (callback) callback();
        return;
    }

    isAnimating = true;
    const g = svg.select('g');
    const duration = 800;

    // Tạo mũi tên lớn hơn
    const arrow = g.append('path')
        .attr('class', 'traversal-arrow')
        .attr('d', d3.symbol().type(d3.symbolTriangle).size(150))
        .attr('transform', `translate(${path[0].x},${path[0].y}) rotate(90)`)
        .attr('opacity', 0.9);

    let i = 0;

    function animateNext() {
        if (i >= path.length) {
            // Kết thúc animation
            arrow.transition()
                .duration(300)
                .attr('opacity', 0)
                .remove();
            
            // Xóa lớp node-visited khỏi tất cả các node
            g.selectAll('.node-visited').classed('node-visited', false);
            g.selectAll('.node-current').classed('node-current', false);
            
            isAnimating = false;
            if (callback) callback();
            return;
        }

        const currentNode = path[i];
        
        // Đánh dấu node hiện tại
        g.selectAll('.node').filter(d => d === currentNode)
            .classed('node-visited', true)
            .classed('node-current', true);

        // Di chuyển mũi tên đến node tiếp theo
        arrow.transition()
            .duration(duration)
            .attr('transform', `translate(${currentNode.x},${currentNode.y}) rotate(90)`)
            .on('end', function() {
                // Bỏ đánh dấu node hiện tại
                g.selectAll('.node-current').classed('node-current', false);
                i++;
                animateNext();
            });
    }

    animateNext();
}

// Tìm đường đi từ root đến node có giá trị value
function findPathToNode(value) {
    const path = [];
    let currentNode = bst.root;
    
    while (currentNode !== null) {
        path.push(currentNode);
        if (value === currentNode.value) {
            break;
        } else if (value < currentNode.value) {
            currentNode = currentNode.left;
        } else {
            currentNode = currentNode.right;
        }
    }
    
    return path;
}

// Tạo cây từ input
function createTreeFromInput() {
    if (isAnimating) return;
    
    const nodeCountInput = document.getElementById('nodeCount');
    const nodeValuesInput = document.getElementById('nodeValues');
    
    const nodeCount = parseInt(nodeCountInput.value);
    const valuesText = nodeValuesInput.value.trim();
    
    if (!nodeCount || nodeCount < 1) {
        alert('Vui lòng nhập số lượng node hợp lệ!');
        return;
    }
    
    if (!valuesText) {
        alert('Vui lòng nhập các giá trị!');
        return;
    }
    
    const values = valuesText.split(',').map(val => parseInt(val.trim())).filter(val => !isNaN(val));
    
    if (values.length > nodeCount) {
        alert(`Bạn đã nhập ${values.length} giá trị, nhiều hơn ${nodeCount} giá trị yêu cầu!`);
        return;
    }
    
    // Xóa cây hiện tại
    bst.root = null;
    selectedNode = null;
    lastAddedNode = null;
    
    // Thêm các giá trị vào cây
    let addedCount = 0;
    let duplicateCount = 0;
    
    for (const value of values) {
        if (!bst.find(value)) {
            const newNode = bst.insert(value);
            if (addedCount === 0) {
                lastAddedNode = newNode;
            }
            addedCount++;
        } else {
            duplicateCount++;
        }
    }
    
    if (duplicateCount > 0) {
        alert(`Đã tạo cây với ${addedCount} node, ${duplicateCount} giá trị trùng đã bỏ qua.`);
    } else {
        alert(`Đã tạo cây với ${addedCount} node.`);
    }
    
    updateTree();
}

// Tạo cây ngẫu nhiên
function createRandomTree() {
    if (isAnimating) return;
    
    const nodeCountInput = document.getElementById('nodeCount');
    const nodeCount = parseInt(nodeCountInput.value);
    
    if (!nodeCount || nodeCount < 1) {
        alert('Vui lòng nhập số lượng node hợp lệ!');
        return;
    }
    
    // Xóa cây hiện tại
    bst.root = null;
    selectedNode = null;
    lastAddedNode = null;
    
    // Tạo các giá trị ngẫu nhiên không trùng
    const values = new Set();
    while (values.size < nodeCount) {
        const value = Math.floor(Math.random() * 200) - 99;
        values.add(value);
    }
    
    // Thêm các giá trị vào cây
    let firstNode = null;
    for (const value of values) {
        const newNode = bst.insert(value);
        if (!firstNode) {
            firstNode = newNode;
        }
    }
    
    lastAddedNode = firstNode;
    
    // Cập nhật ô nhập giá trị
    document.getElementById('nodeValues').value = Array.from(values).join(', ');
    
    alert(`Đã tạo cây ngẫu nhiên với ${nodeCount} node.`);
    updateTree();
}

// Thêm node mới
function insertNode() {
    if (isAnimating) return;
    
    const valueInput = document.getElementById('nodeValue');
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) {
        alert('Vui lòng nhập giá trị hợp lệ!');
        return;
    }

    if (bst.find(value)) {
        alert('Giá trị đã tồn tại trong cây!');
        return;
    }

    // Tìm đường đi đến vị trí chèn
    const path = findPathToNode(value);
    
    // Thực hiện animation
    animateTraversal(path, () => {
        // Sau khi animation kết thúc, thêm node mới
        lastAddedNode = bst.insert(value);
        valueInput.value = '';
        updateTree();
    });
}

// Tìm node
function findNode() {
    if (isAnimating) return;
    
    const valueInput = document.getElementById('nodeValue');
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) {
        alert('Vui lòng nhập giá trị cần tìm!');
        return;
    }

    const path = findPathToNode(value);
    const foundNode = path.length > 0 && path[path.length - 1].value === value;
    
    // Thực hiện animation
    animateTraversal(path, () => {
        if (foundNode) {
            selectedNode = path[path.length - 1];
            updateTree();
            alert(`Tìm thấy node ${value} trong cây!`);
        } else {
            alert(`Không tìm thấy node ${value} trong cây!`);
        }
    });
}

// Xóa node đang chọn
function deleteSelectedNode() {
    if (isAnimating) return;
    
    if (!selectedNode) {
        alert('Vui lòng chọn một node để xóa!');
        return;
    }

    const value = selectedNode.value;
    const path = findPathToNode(value);
    
    // Thực hiện animation
    animateTraversal(path, () => {
        // Đánh dấu node để thêm hiệu ứng xóa
        nodesToRemove.push(value);
        
        // Cập nhật cây trước để hiển thị hiệu ứng
        updateTree();
        
        // Đợi hiệu ứng hoàn tất trước khi xóa thực sự
        setTimeout(() => {
            bst.delete(value);
            selectedNode = null;
            updateTree();
        }, 600);
    });
}

// Xóa toàn bộ cây
function clearTree() {
    if (isAnimating) return;
    
    if (confirm('Bạn có chắc muốn xóa toàn bộ cây?')) {
        bst.root = null;
        selectedNode = null;
        lastAddedNode = null;
        updateTree();
    }
}

// Cân bằng cây
function balanceTree() {
    if (isAnimating) return;
    
    const nodes = [];
    
    function inOrderTraversal(node) {
        if (node === null) return;
        inOrderTraversal(node.left);
        nodes.push(node);
        inOrderTraversal(node.right);
    }
    
    inOrderTraversal(bst.root);
    
    function buildBalancedTree(nodes, start, end) {
        if (start > end) return null;
        
        const mid = Math.floor((start + end) / 2);
        const node = nodes[mid];
        
        node.left = buildBalancedTree(nodes, start, mid - 1);
        node.right = buildBalancedTree(nodes, mid + 1, end);
        
        return node;
    }
    
    bst.root = buildBalancedTree(nodes, 0, nodes.length - 1);
    updateTree();
}

// Duyệt cây
function traverseTree(type) {
    if (isAnimating) return;
    
    let traversalNodes = [];
    
    switch (type) {
        case 'inorder':
            traversalNodes = bst.inOrder();
            break;
        case 'preorder':
            traversalNodes = bst.preOrder();
            break;
        case 'postorder':
            traversalNodes = bst.postOrder();
            break;
        default:
            return;
    }
    
    // Thực hiện animation duyệt cây
    animateTraversal(traversalNodes, () => {
        alert(`Đã hoàn thành duyệt cây theo thứ tự ${type}`);
    });
}

// Zoom functions
function zoomIn() {
    if (isAnimating) return;
    
    zoomLevel = Math.min(3, zoomLevel + 0.1);
    updateTree();
}

function zoomOut() {
    if (isAnimating) return;
    
    zoomLevel = Math.max(0.1, zoomLevel - 0.1);
    updateTree();
}

function resetZoom() {
    if (isAnimating) return;
    
    zoomLevel = 1;
    translateX = 0;
    translateY = 0;
    updateTree();
}

// UI Control functions
function toggleControls() {
    if (isAnimating) return;
    
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

// Cập nhật bảng thông tin
function updateInfoPanel() {
    document.getElementById('nodeCountDisplay').textContent = bst.countNodes();
    document.getElementById('treeHeight').textContent = bst.getHeight();
    document.getElementById('selectedValue').textContent = selectedNode ? selectedNode.value : '-';
    
    const balanceStatus = document.getElementById('balanceStatus');
    if (bst.isValidBST()) {
        balanceStatus.textContent = '✓';
        balanceStatus.style.color = '#4cc9f0';
    } else {
        balanceStatus.textContent = '✗';
        balanceStatus.style.color = '#f72585';
    }
}

// Xử lý sự kiện nhấn Enter
document.getElementById('nodeValue').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        insertNode();
    }
});

// Thêm sự kiện kéo thả
const graphContainer = document.getElementById('graphContainer');

graphContainer.addEventListener('mousedown', function(e) {
    if (isAnimating || e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    isDragging = true;
    graphContainer.classList.add('dragging');
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
});

document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    
    updateTree();
});

document.addEventListener('mouseup', function() {
    isDragging = false;
    graphContainer.classList.remove('dragging');
});

// Khởi tạo với một vài node mẫu
function initializeSampleTree() {
    const sampleValues = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 85];
    
    // Cập nhật input
    document.getElementById('nodeCount').value = sampleValues.length;
    document.getElementById('nodeValues').value = sampleValues.join(', ');
    
    // Tạo cây
    sampleValues.forEach(value => {
        bst.insert(value);
    });
    
    updateTree();
}

// Khởi chạy
initializeSampleTree();