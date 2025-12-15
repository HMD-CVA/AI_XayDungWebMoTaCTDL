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
        this.hidden = false; // Để ẩn/hiện node khi prev/next
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
            // Tìm thấy node cần xóa
            
            // Trường hợp 0: Node không có con (lá)
            if (node.left === null && node.right === null) {
                return null;
            }

            // ===== TRƯỜNG HỢP 1: NODE CÓ 1 CON =====
            // Nếu chỉ có con trái: con trái lên thay thế vị trí node
            if (node.left !== null && node.right === null) {
                return node.left;
            }
            // Nếu chỉ có con phải: con phải lên thay thế vị trí node
            if (node.left === null && node.right !== null) {
                return node.right;
            }

            // ===== TRƯỜNG HỢP 2: NODE CÓ 2 CON =====
            // Tìm node lớn nhất bên trái (max của cây con trái)
            // Copy giá trị của node đó lên, rồi xóa node đó
            const maxNode = this.findMaxNode(node.left);
            node.value = maxNode.value;
            node.left = this.deleteNode(node.left, maxNode.value);
            return node;
        }
    }

    findMinNode(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    findMaxNode(node) {
        while (node.right !== null) {
            node = node.right;
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

    // Thuật toán tính layout theo Reingold-Tilford
    // Tính toán bottom-up: mỗi node biết chính xác không gian nó cần
    calculateTreeLayout(node = this.root) {
        if (node === null) return { width: 0, position: 0 };
        
        const left = this.calculateTreeLayout(node.left);
        const right = this.calculateTreeLayout(node.right);
        
        // Mỗi node cần khoảng cách tối thiểu giữa các cây con
        const minSeparation = 1; // Tối thiểu 1 đơn vị giữa hai cây con
        
        // Tổng chiều rộng = cây trái + cây phải + khoảng cách
        node.width = left.width + right.width + minSeparation;
        
        // Vị trí của node trong cây con của nó (relative position)
        // Node nằm giữa cây trái và cây phải
        node.position = left.width;
        
        // Lưu thêm thông tin để xử lý sau
        node.leftWidth = left.width;
        node.rightWidth = right.width;
        node.mod = 0; // Modifier for positioning
        
        return {
            width: node.width,
            position: node.position
        };
    }

    // Tính chiều rộng thực tế của cây ở mỗi level
    getWidthAtLevel(node = this.root, level = 0, widths = {}) {
        if (node === null) return widths;
        
        widths[level] = (widths[level] || 0) + 1;
        this.getWidthAtLevel(node.left, level + 1, widths);
        this.getWidthAtLevel(node.right, level + 1, widths);
        
        return widths;
    }

    // Tính hệ số cân bằng của cây (0-1, 1 là hoàn toàn cân bằng)
    getBalanceFactor(node = this.root) {
        if (node === null) return 1;
        
        const leftHeight = this.getHeight(node.left);
        const rightHeight = this.getHeight(node.right);
        const diff = Math.abs(leftHeight - rightHeight);
        const maxHeight = Math.max(leftHeight, rightHeight) || 1;
        
        return 1 - (diff / maxHeight);
    }

    // Tính mật độ cây con (số node / chiều cao)
    getSubtreeDensity(node) {
        if (node === null) return 0;
        const nodeCount = this.countNodes(node);
        const height = this.getHeight(node);
        return nodeCount / (height || 1);
    }

    // Tính độ phức tạp của cây con (kết hợp số node và chiều cao)
    getSubtreeComplexity(node) {
        if (node === null) return 0;
        const nodeCount = this.countNodes(node);
        const height = this.getHeight(node);
        return nodeCount * Math.log2(height + 1);
    }

    // Tính chiều rộng thực tế cần thiết cho cây con ở mỗi level
    getSubtreeWidthsAtLevels(node, currentLevel = 0, widths = {}) {
        if (node === null) return widths;
        
        // Tăng số node ở level hiện tại
        if (!widths[currentLevel]) widths[currentLevel] = 0;
        widths[currentLevel]++;
        
        // Đệ quy cho các node con
        this.getSubtreeWidthsAtLevels(node.left, currentLevel + 1, widths);
        this.getSubtreeWidthsAtLevels(node.right, currentLevel + 1, widths);
        
        return widths;
    }

    // Tính chiều rộng tối đa cần thiết cho cây con (max nodes ở bất kỳ level nào)
    getMaxSubtreeWidth(node) {
        if (node === null) return 0;
        const widths = this.getSubtreeWidthsAtLevels(node);
        return Math.max(...Object.values(widths));
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

    // Cập nhật side và depth cho toàn bộ cây
    updateNodeProperties(node = this.root, depth = 0, side = 'root') {
        if (node === null) return;
        
        node.depth = depth;
        node.side = side;
        
        this.updateNodeProperties(node.left, depth + 1, 'left');
        this.updateNodeProperties(node.right, depth + 1, 'right');
    }

    // Tìm giá trị nhỏ nhất trong cây
    findMin(node = this.root) {
        if (node === null) return null;
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    // Tìm giá trị lớn nhất trong cây
    findMax(node = this.root) {
        if (node === null) return null;
        while (node.right !== null) {
            node = node.right;
        }
        return node;
    }

    // Tìm lower_bound: giá trị nhỏ nhất >= target
    lowerBound(target, node = this.root, result = null) {
        if (node === null) return result;
        
        if (node.value >= target) {
            // Node hiện tại có thể là lower_bound, nhưng cần kiểm tra bên trái
            result = node;
            return this.lowerBound(target, node.left, result);
        } else {
            // Giá trị nhỏ hơn target, tìm bên phải
            return this.lowerBound(target, node.right, result);
        }
    }

    // Tìm upper_bound: giá trị nhỏ nhất > target
    upperBound(target, node = this.root, result = null) {
        if (node === null) return result;
        
        if (node.value > target) {
            // Node hiện tại có thể là upper_bound, nhưng cần kiểm tra bên trái
            result = node;
            return this.upperBound(target, node.left, result);
        } else {
            // Giá trị <= target, tìm bên phải
            return this.upperBound(target, node.right, result);
        }
    }
}

// Biến toàn cục
const bst = new BinarySearchTree();
const svg = d3.select('#treeSVG');
let selectedNode = null;
let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;
let lastAddedNode = null;
let nodesToRemove = [];
let isAnimating = false;

// Animation control variables
let animationState = {
    isPaused: false,
    currentStep: 0,
    totalSteps: 0,
    path: [],
    callback: null,
    algorithmType: null,
    searchValue: null,
    animationSpeed: 400,
    timeoutId: null,
    arrow: null,
    isActive: false,
    subStep: 0,
    subStepsPerNode: 0,
    deletedNodeInfo: null,  // Lưu thông tin về node đã xóa {value, parent, isLeftChild, replacementValue, replacementOldParent, replacementIsLeftChild}
    deleteSteps: []  // Array chứa snapshots của cây qua từng step delete
};

// Danh sách các timeout để có thể clear
let activeTimeouts = [];
let activeTransitions = [];

// Sử dụng D3.js tree layout - mạnh mẽ và tối ưu nhất
let treeLayout = d3.tree();
let zoomBehavior = d3.zoom()
    .scaleExtent([0.1, 3])
    .on('zoom', (event) => {
        if (!isDragging) {
            d3.select('#treeGroup').attr('transform', event.transform);
        }
    });

svg.call(zoomBehavior);

// Chuyển đổi BST sang D3 hierarchy format
function convertToD3Hierarchy(node) {
    if (!node) return null;
    
    const result = {
        data: node,
        _side: node.side  // Lưu thông tin side để xử lý sau
    };
    
    // Tạo children array
    const children = [];
    
    if (node.left) {
        children.push(convertToD3Hierarchy(node.left));
    }
    if (node.right) {
        children.push(convertToD3Hierarchy(node.right));
    }
    
    if (children.length > 0) {
        result.children = children;
    }
    
    return result;
}

// Tính toán layout - Thuật toán đơn giản cho BST
function calculateNodePositions() {
    if (!bst.root) return { nodes: [], links: [] };
    
    // CRITICAL: Cập nhật lại side và depth cho toàn bộ cây trước khi vẽ
    bst.updateNodeProperties();
    
    const container = document.getElementById('graphContainer');
    const viewportWidth = container.clientWidth;
    const viewportHeight = container.clientHeight;
    
    const nodeCount = bst.countNodes();
    const treeHeight = bst.getHeight();
    
    // Tính toán spacing - giảm width và height xuống
    const baseSpacing = Math.max(50, Math.min(90, viewportWidth / (nodeCount * 0.8))) * 0.7;
    const verticalSpacing = 70;
    
    // Thuật toán layout đơn giản cho BST - in-order traversal với spacing
    let currentX = baseSpacing; // Bắt đầu với offset
    const nodes = [];
    const links = [];
    
    // In-order traversal để tính vị trí x (đảm bảo thứ tự left < parent < right)
    function inOrderLayout(node, depth = 0) {
        if (!node) return;
        
        // Xử lý cây con trái
        inOrderLayout(node.left, depth + 1);
        
        // Xử lý node hiện tại (bỏ qua node hidden)
        if (!node.hidden) {
            node.x = currentX;
            node.y = depth * verticalSpacing + 50;
            currentX += baseSpacing;
            
            nodes.push(node);
        }
        
        // Xử lý cây con phải  
        inOrderLayout(node.right, depth + 1);
    }
    
    // Tính layout
    inOrderLayout(bst.root);
    
    // Thu thập links
    function collectLinks(node) {
        if (!node || node.hidden) return;
        
        if (node.left && !node.left.hidden) {
            links.push({
                source: node,
                target: node.left,
                type: 'left'
            });
            collectLinks(node.left);
        }
        
        if (node.right && !node.right.hidden) {
            links.push({
                source: node,
                target: node.right,
                type: 'right'
            });
            collectLinks(node.right);
        }
    }
    
    collectLinks(bst.root);
    
    // Tìm bounds và căn giữa
    let minX = Infinity, maxX = -Infinity;
    nodes.forEach(n => {
        if (n.x < minX) minX = n.x;
        if (n.x > maxX) maxX = n.x;
    });
    
    const treeWidth = Math.max(viewportWidth, maxX - minX + baseSpacing * 3);
    const treeHeightCalc = Math.max(viewportHeight * 0.9, treeHeight * verticalSpacing + 150);
    const offsetX = (treeWidth - (maxX - minX)) / 2 - minX;
    
    // Áp dụng offset
    nodes.forEach(n => {
        n.x += offsetX;
    });
    
    svg.attr('width', treeWidth)
        .attr('height', treeHeightCalc);
    
    return { nodes, links };
}

// Cập nhật hiển thị cây với D3.js
function updateTree(animate = false) {
    if (!bst.root) {
        svg.selectAll('*').remove();
        svg.append('g').attr('id', 'treeGroup');
        updateInfoPanel();
        return;
    }

    const { nodes, links } = calculateNodePositions();
    
    // Tạo hoặc lấy group
    let g = svg.select('#treeGroup');
    if (g.empty()) {
        svg.selectAll('*').remove();
        g = svg.append('g').attr('id', 'treeGroup');
    }

    // Tìm link đến node mới được thêm (nếu có)
    const newNodeLink = lastAddedNode ? links.find(l => l.target === lastAddedNode) : null;

    // D3 Update Pattern cho links
    const linkSelection = g.selectAll('.link')
        .data(links, d => `${d.source.id}-${d.target.id}`);
    
    // EXIT: Xóa links không còn
    linkSelection.exit()
        .transition()
        .duration(400)
        .ease(d3.easeCubicOut)
        .attr('opacity', 0)
        .remove();
    
    // ENTER: Thêm links mới
    const linkEnter = linkSelection.enter()
        .append('line')
        .attr('class', d => `link ${d.type}-link`)
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.source.x)
        .attr('y2', d => d.source.y)
        .attr('opacity', 0)
        .lower(); // Đảm bảo links luôn ở phía sau nodes
    
    // UPDATE: Cập nhật links hiện có + mới với animation mượt
    linkEnter.merge(linkSelection)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('opacity', 1);

    // D3 Update Pattern cho nodes
    const nodeSelection = g.selectAll('.node')
        .data(nodes, d => d.id);
    
    // EXIT: Xóa nodes không còn với hiệu ứng scale và fade
    nodeSelection.exit()
        .transition()
        .duration(400)
        .ease(d3.easeCubicOut)
        .attr('opacity', 0)
        .attr('transform', function(d) {
            const currentTransform = d3.select(this).attr('transform');
            const match = currentTransform.match(/translate\(([\d.]+),([\d.]+)\)/);
            if (match) {
                return `translate(${match[1]},${match[2]}) scale(0)`;
            }
            return `translate(${d.x},${d.y}) scale(0)`;
        })
        .remove();
    
    // ENTER: Thêm nodes mới với hiệu ứng xuất hiện
    const nodeEnter = nodeSelection.enter()
        .append('g')
        .attr('class', d => {
            let className = 'node';
            if (d === selectedNode) className += ' selected';
            
            if (nodesToRemove.includes(d.value)) {
                className += ' node-removed';
            }
            
            return className;
        })
        .attr('transform', d => `translate(${d.x},${d.y}) scale(0)`)
        .attr('opacity', 0)
        .raise() // Đảm bảo nodes luôn ở phía trước links
        .on('click', function(event, d) {
            // Cho phép click khi đang animation để có thể select node khác
            selectedNode = d;
            updateTree();
            event.stopPropagation();
        });
    
    // UPDATE với sequence animation
    const nodeUpdate = nodeEnter.merge(nodeSelection);
    
    // Bước 1: Di chuyển các nodes CŨ đến vị trí mới trước
    const isAddingNewNode = lastAddedNode !== null;
    
    if (isAddingNewNode) {
        // Di chuyển nodes cũ trước
        nodeSelection
            .transition()
            .duration(400)
            .ease(d3.easeCubicInOut)
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .on('end', function() {
                // Bước 2: Sau khi di chuyển xong, hiện node mới
                nodeEnter
                    .transition()
                    .duration(300)
                    .ease(d3.easeBackOut)
                    .attr('transform', d => `translate(${d.x},${d.y}) scale(1)`)
                    .attr('opacity', 1)
                    .on('end', function() {
                        // Bước 3: Sau khi node mới xuất hiện, vẽ link
                        if (newNodeLink) {
                            linkEnter.filter(d => d.target === lastAddedNode)
                                .transition()
                                .duration(300)
                                .ease(d3.easeCubicOut)
                                .attr('x2', d => d.target.x)
                                .attr('y2', d => d.target.y)
                                .attr('opacity', 1);
                        }
                    });
            });
        
        // Di chuyển TẤT CẢ links (cả cũ và mới ngoại trừ link đến node mới) cùng lúc với nodes
        linkEnter.filter(d => d.target !== lastAddedNode)
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .attr('opacity', 1);
            
        linkEnter.merge(linkSelection).filter(d => d.target !== lastAddedNode)
            .transition()
            .duration(400)
            .ease(d3.easeCubicInOut)
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .attr('opacity', 1);
    } else {
        // Không có node mới, chỉ update bình thường
        nodeUpdate
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr('transform', d => `translate(${d.x},${d.y}) scale(1)`)
            .attr('opacity', 1);
            
        linkEnter.merge(linkSelection)
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .attr('opacity', 1);
    }
    
    // Kích thước node - tăng bán kính
    const nodeRadius = Math.max(28, Math.min(42, 35 / Math.sqrt(nodes.length / 10 + 1)));
    const fontSize = Math.max(16, Math.min(24, nodeRadius * 0.65));
    
    // Thêm circle và text cho nodes mới
    nodeEnter.append('circle')
        .attr('r', nodeRadius);
    
    nodeEnter.append('text')
        .text(d => d.value)
        .attr('text-anchor', 'middle')
        .attr('dy', fontSize * 0.35)
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('font-size', `${fontSize}px`);
    
    // Reset lastAddedNode
    if (lastAddedNode) {
        lastAddedNode = null;
    }

    // Xóa các node đã được đánh dấu để xóa khỏi danh sách
    nodesToRemove = [];

    updateInfoPanel();
}

// Tạo hiệu ứng mũi tên duyệt cây
function animateTraversal(path, callback, algorithmType = null, searchValue = null) {
    if (path.length === 0) {
        if (callback) callback();
        return;
    }

    isAnimating = true;
    
    // Clear tất cả highlight trước khi bắt đầu animation mới
    const g = svg.select('g');
    g.selectAll('.node-visited').classed('node-visited', false);
    g.selectAll('.node-current').classed('node-current', false);
    g.selectAll('.link-visited').classed('link-visited', false);
    g.selectAll('.link-current').classed('link-current', false);
    
    // Tính số sub-steps cho mỗi node dựa trên algorithmType
    let subStepsPerNode;
    switch(algorithmType) {
        case 'search':
        case 'insert':
        case 'delete':
        case 'balance':
            subStepsPerNode = 2; // Substep 0: điều kiện, Substep 1: hành động
            break;
        case 'lowerBound':
        case 'upperBound':
            subStepsPerNode = 2; // 2 substeps: điều kiện và hành động
            break;
        case 'findMin':
        case 'findMax':
            subStepsPerNode = 1; // Chỉ cần 1 step: di chuyển đến node
            break;
        case 'preorder':
        case 'inorder':
        case 'postorder':
            subStepsPerNode = 1; // Duyệt: chỉ cần 1 step
            break;
        default:
            subStepsPerNode = 2;
    }
    
    // Setup animation state
    animationState.path = path;
    animationState.callback = callback;
    animationState.algorithmType = algorithmType;
    animationState.searchValue = searchValue;
    animationState.currentStep = 0;
    // Thêm 1 step cho callback cuối (delete thực sự)
    // Với balance, dùng tổng số balanceSnapshots đã tạo
    if (algorithmType === 'balance') {
        animationState.totalSteps = animationState.balanceSnapshots ? animationState.balanceSnapshots.length : 0;
    } else if (algorithmType === 'delete') {
        animationState.totalSteps = path.length * subStepsPerNode + 1;
    } else {
        animationState.totalSteps = path.length * subStepsPerNode;
    }
    animationState.isPaused = false;
    animationState.subStep = 0;
    animationState.subStepsPerNode = subStepsPerNode;
    
    // Show control bar
    showControlBar();
    updateControlBar();

    // Xác định xem path có phải là array nodeInfo không
    const hasNodeInfo = path[0] && typeof path[0] === 'object' && path[0].node !== undefined;
    const firstNode = hasNodeInfo ? path[0].node : path[0];

    // Tạo mũi tên lớn hơn - bắt đầu từ opacity 0 và sẽ fade in
    // Không tạo arrow nếu firstNode là null hoặc không có tọa độ (rotation step)
    let arrow = null;
    if (firstNode !== null && firstNode.x !== undefined && firstNode.y !== undefined) {
        arrow = g.append('path')
            .attr('class', 'traversal-arrow')
            .attr('d', d3.symbol().type(d3.symbolTriangle).size(150))
            .attr('transform', `translate(${firstNode.x},${firstNode.y - 35}) rotate(180)`)
            .attr('opacity', 0);
        
        // Fade in arrow ngay lập tức
        arrow.transition()
            .duration(200)
            .attr('opacity', 0.9);
    }
    
    animationState.arrow = arrow;

    let i = 0;
    let subStep = 0;

    function animateNext() {
        // Check if paused
        if (animationState.isPaused) {
            animationState.timeoutId = setTimeout(animateNext, 100);
            return;
        }
        
        // Lấy duration mới nhất từ animationState để cập nhật theo thời gian thực
        const duration = animationState.animationSpeed;
        
        // Với balance, dùng trực tiếp step làm index vào snapshot
        if (algorithmType === 'balance') {
            if (animationState.currentStep >= animationState.totalSteps) {
                // Kết thúc animation
                if (arrow) {
                    arrow.transition()
                        .duration(300)
                        .attr('opacity', 0)
                        .remove();
                }
                
                g.selectAll('.node-current')
                    .classed('node-current', false)
                    .classed('node-visited', true);
                g.selectAll('.link-current').classed('link-current', false);
                
                isAnimating = false;
                if (callback) callback();
                return;
            }
            
            // Hiển thị snapshot tương ứng
            const snapshot = animationState.balanceSnapshots[animationState.currentStep];
            const prevSnapshot = animationState.currentStep > 0 ? animationState.balanceSnapshots[animationState.currentStep - 1] : null;
            
            if (snapshot) {
                // Chỉ xóa links khi là bước xoay
                if (snapshot.isRotationStep) {
                    g.selectAll('.link').remove();
                }
                
                bst.root = cloneTreeStructure(snapshot.tree);
                updateTree();
                
                // Di chuyển arrow đến node highlight hoặc ẩn nếu cần
                if (arrow) {
                    if (snapshot.hideArrow) {
                        // Ẩn mũi tên
                        arrow.transition()
                            .duration(300)
                            .attr('opacity', 0);
                    } else if (snapshot.nodeHighlight) {
                        const targetNode = findNodeInTree(bst.root, snapshot.nodeHighlight.value);
                        if (targetNode && targetNode.x !== undefined && targetNode.y !== undefined) {
                            arrow.transition()
                                .duration(duration)
                                .ease(d3.easeCubicInOut)
                                .attr('transform', `translate(${targetNode.x},${targetNode.y - 35}) rotate(180)`)
                                .attr('opacity', 0.9);
                            
                            // Highlight edge từ node trước đến node hiện tại (nếu không phải bước xoay)
                            if (prevSnapshot && prevSnapshot.nodeHighlight && !snapshot.isRotationStep) {
                                const prevNode = findNodeInTree(bst.root, prevSnapshot.nodeHighlight.value);
                                if (prevNode) {
                                    g.selectAll('.link-current').classed('link-current', false);
                                    g.selectAll('.link')
                                        .filter(d => 
                                            (d.source === prevNode && d.target === targetNode) ||
                                            (d.source === targetNode && d.target === prevNode)
                                        )
                                        .classed('link-current', true)
                                        .classed('link-visited', true);
                                }
                            }
                        }
                    }
                }
                
                // Clear và apply highlights
                g.selectAll('.node-visited').classed('node-visited', false);
                g.selectAll('.node-current').classed('node-current', false);
                
                if (snapshot.nodeHighlight) {
                    g.selectAll('.node').filter(d => d.value === snapshot.nodeHighlight.value)
                        .classed('node-current', true);
                }
                
                if (snapshot.algoLines) {
                    highlightAlgorithmLine(snapshot.algoLines);
                }
                
                const resultContent = document.getElementById('resultContent');
                if (resultContent && snapshot.resultText) {
                    resultContent.textContent = snapshot.resultText;
                }
            }
            
            animationState.currentStep++;
            updateControlBar();
            
            // Nếu snapshot có pauseAfter, thêm delay dài hơn
            const extraDelay = snapshot && snapshot.pauseAfter ? animationState.animationSpeed * 2.5 : 0;
            animationState.timeoutId = setTimeout(animateNext, animationState.animationSpeed + extraDelay);
            return;
        }
        
        let nodeIndex = Math.floor(animationState.currentStep / animationState.subStepsPerNode);
        let currentSubStep = animationState.currentStep % animationState.subStepsPerNode;
        
        // Nếu là step đầu tiên, thêm delay nhỏ để arrow fade in trước
        const isFirstStep = animationState.currentStep === 0;
        const initialDelay = isFirstStep ? 200 : 0;
        
        if (nodeIndex >= path.length) {
            // Kết thúc animation
            arrow.transition()
                .duration(300)
                .attr('opacity', 0)
                .remove();
            
            // Chuyển node-current cuối cùng thành node-visited trước khi kết thúc
            g.selectAll('.node-current')
                .classed('node-current', false)
                .classed('node-visited', true);
            g.selectAll('.link-current').classed('link-current', false);
            
            isAnimating = false;
            // Giữ control bar hiển thị sau khi hoàn thành
            // hideControlBar();
            if (callback) callback();
            return;
        }

        const currentNode = hasNodeInfo ? path[nodeIndex].node : path[nodeIndex];
        const isVisited = hasNodeInfo ? path[nodeIndex].visited : false;

        // Xử lý trường hợp null node (cho search/insert thất bại)
        if (currentNode === null) {
            // Chỉ highlight code cho null check, không có visual animation
            highlightCodeLine(algorithmType, nodeIndex, null, searchValue, path, currentSubStep);
            
            // Tăng currentStep nhưng không vượt quá totalSteps - 1
            const isLastStep = animationState.currentStep >= animationState.totalSteps - 1;
            if (!isLastStep) {
                animationState.currentStep++;
            }
            updateControlBar();
            
            // Nếu đã đến step cuối, kết thúc animation
            if (isLastStep) {
                if (arrow) {
                    arrow.transition()
                        .duration(300)
                        .attr('opacity', 0)
                        .remove();
                }
                
                isAnimating = false;
                if (callback) callback();
                return;
            }
            
            // Gọi lại animateNext để xử lý substep tiếp theo
            animationState.timeoutId = setTimeout(animateNext, animationState.animationSpeed + initialDelay);
            return;
        }

        if (currentSubStep === 0) {
            // Substep 0: Arrow đến node, highlight node và điều kiện
            
            // Di chuyển mũi tên đến node hiện tại (trên đầu node) - chỉ nếu node có tọa độ
            if (arrow && currentNode.x !== undefined && currentNode.y !== undefined) {
                arrow.transition()
                    .duration(duration)
                    .ease(d3.easeCubicInOut)
                    .attr('transform', `translate(${currentNode.x},${currentNode.y - 35}) rotate(180)`);
            }

            // Xóa node-current cũ, chuyển thành node-visited
            g.selectAll('.node-current')
                .classed('node-current', false)
                .classed('node-visited', true);
            
            // Highlight node hiện tại là node-current (không thêm node-visited)
            g.selectAll('.node')
                .filter(d => d === currentNode)
                .classed('node-current', true);
            
            // Highlight điều kiện (if)
            if (algorithmType) {
                highlightCodeLine(algorithmType, nodeIndex, currentNode, searchValue, path, 0);
            }
            
            // Lưu highlight cho delete animation ngay sau khi highlight substep 0
            if (algorithmType === 'delete' && animationState.deleteHighlights) {
                setTimeout(() => {
                    animationState.deleteHighlights.push(captureHighlightState());
                    animationState.deleteAlgorithmLines.push(captureAlgorithmHighlights());
                    const resultContent = document.getElementById('resultContent');
                    animationState.deleteResultTexts.push(resultContent ? resultContent.textContent : '');
                }, 200);
            }
            
            // Lưu highlight cho balance animation
            if (algorithmType === 'balance' && animationState.balanceHighlights) {
                setTimeout(() => {
                    animationState.balanceHighlights.push(captureHighlightState());
                    animationState.balanceAlgorithmLines.push(captureAlgorithmHighlights());
                    const resultContent = document.getElementById('resultContent');
                    animationState.balanceResultTexts.push(resultContent ? resultContent.textContent : '');
                }, 200);
            }
            
        } else if (currentSubStep === 1) {
            // Substep 1: Highlight action và cạnh sẽ đi
            
            // Highlight action (chọn nhánh)
            if (algorithmType) {
                highlightCodeLine(algorithmType, nodeIndex, currentNode, searchValue, path, 1);
            }
            
            // Lưu highlight cho delete animation sau substep 1
            if (algorithmType === 'delete' && animationState.deleteHighlights) {
                setTimeout(() => {
                    animationState.deleteHighlights.push(captureHighlightState());
                    animationState.deleteAlgorithmLines.push(captureAlgorithmHighlights());
                    const resultContent = document.getElementById('resultContent');
                    animationState.deleteResultTexts.push(resultContent ? resultContent.textContent : '');
                }, 200);
            }
            
            // Balance không cần lưu highlight vì đã có snapshots
            
            // Highlight cạnh đến node tiếp theo (nếu không phải node cuối)
            const isTraversal = algorithmType === 'preorder' || algorithmType === 'inorder' || algorithmType === 'postorder';
            
            if (nodeIndex < path.length - 1 && !isTraversal) {
                const nextItem = path[nodeIndex + 1];
                const nextNode = hasNodeInfo ? nextItem.node : nextItem;
                
                // Xóa link-current cũ
                g.selectAll('.link-current').classed('link-current', false);
                
                // Highlight cạnh đến node tiếp theo
                g.selectAll('.link')
                    .filter(d => 
                        (d.source === currentNode && d.target === nextNode) ||
                        (d.source === nextNode && d.target === currentNode)
                    )
                    .classed('link-current', true)
                    .classed('link-visited', true);
            }
        }

        // Tăng currentStep để tiếp tục animation
        animationState.currentStep++;
        updateControlBar();
        // Sử dụng animationState.animationSpeed + initialDelay trực tiếp để cập nhật theo thời gian thực
        animationState.timeoutId = setTimeout(animateNext, animationState.animationSpeed + initialDelay);
    }

    // Bắt đầu animation với delay nhỏ để arrow fade in trước
    setTimeout(animateNext, 200);
}

// Hiển thị thông báo HTML trong result panel
function showResultMessage(htmlContent) {
    const resultContent = document.getElementById('resultContent');
    if (!resultContent) return;
    resultContent.innerHTML = htmlContent;
}

// Update result panel with step info
function updateStepResult(algorithmType, nodeIndex, currentNode, searchValue, path, subStep = 0) {
    const resultContent = document.getElementById('resultContent');
    if (!resultContent) return;
    
    let resultText = '';
    
    if (algorithmType === 'search' || algorithmType === 'insert' || algorithmType === 'delete') {
        if (currentNode.value === searchValue) {
            resultText += `✅ So sánh: ${currentNode.value} == ${searchValue}\n`;
            if (algorithmType === 'delete') {
                resultText += `➜ Tìm thấy node cần xóa!`;
            } else {
                resultText += `➜ Tìm thấy node cần tìm!`;
            }
        } else if (currentNode.value > searchValue) {
            resultText += `📊 So sánh: ${currentNode.value} > ${searchValue}\n`;
            resultText += `⬅️ Chuyển sang nhánh trái`;
        } else {
            resultText += `📊 So sánh: ${currentNode.value} < ${searchValue}\n`;
            resultText += `➡️ Chuyển sang nhánh phải`;
        }
    } else if (algorithmType === 'lowerBound') {
        if (currentNode.value >= searchValue) {
            resultText += `📊 So sánh: ${currentNode.value} >= ${searchValue}\n`;
            resultText += `✅ Cập nhật kết quả: ${currentNode.value}\n`;
            resultText += `⬅️ Tiếp tục tìm giá trị nhỏ hơn ở nhánh trái`;
        } else {
            resultText += `📊 So sánh: ${currentNode.value} < ${searchValue}\n`;
            resultText += `➡️ Chuyển sang nhánh phải`;
        }
    } else if (algorithmType === 'upperBound') {
        if (currentNode.value > searchValue) {
            resultText += `📊 So sánh: ${currentNode.value} > ${searchValue}\n`;
            resultText += `✅ Cập nhật kết quả: ${currentNode.value}\n`;
            resultText += `⬅️ Tiếp tục tìm giá trị nhỏ hơn ở nhánh trái`;
        } else {
            resultText += `📊 So sánh: ${currentNode.value} <= ${searchValue}\n`;
            resultText += `➡️ Chuyển sang nhánh phải`;
        }
    } else if (algorithmType === 'balance') {
        const bf = getBalanceFactor(currentNode);
        if (Math.abs(bf) > 1) {
            resultText += `📍 Node: ${currentNode.value} (Độ lệch: ${bf})\n`;
            resultText += `⚠️ Node mất cân bằng, cần xoay!`;
        } else {
            resultText += `📍 Node: ${currentNode.value} (Độ lệch: ${bf})\n`;
            resultText += `✅ Node cân bằng, tiếp tục kiểm tra`;
        }
    } else if (algorithmType === 'findMin') {
        if (currentNode.left !== null) {
            resultText += `⬅️ Có nhánh trái, tiếp tục đi xuống\n`;
            resultText += `➜ Giá trị nhỏ nhất nằm ở nhánh trái`;
        } else {
            resultText += `✅ Không có nhánh trái\n`;
            resultText += `➜ ${currentNode.value} là giá trị nhỏ nhất`;
        }
    } else if (algorithmType === 'findMax') {
        if (currentNode.right !== null) {
            resultText += `➡️ Có nhánh phải, tiếp tục đi xuống\n`;
            resultText += `➜ Giá trị lớn nhất nằm ở nhánh phải`;
        } else {
            resultText += `✅ Không có nhánh phải\n`;
            resultText += `➜ ${currentNode.value} là giá trị lớn nhất`;
        }
    } else if (algorithmType === 'preorder') {
        resultText += `📝 Duyệt Pre-order (Gốc-Trái-Phải)\n`;
        resultText += `✅ Thăm node: ${currentNode.value}`;
    } else if (algorithmType === 'inorder') {
        resultText += `📝 Duyệt In-order (Trái-Gốc-Phải)\n`;
        resultText += `✅ Thăm node: ${currentNode.value}`;
    } else if (algorithmType === 'postorder') {
        resultText += `📝 Duyệt Post-order (Trái-Phải-Gốc)\n`;
        resultText += `✅ Thăm node: ${currentNode.value}`;
    }
    
    resultContent.textContent = resultText;
}

// Highlight code line dựa trên algorithm type và state
function highlightCodeLine(algorithmType, nodeIndex, currentNode, searchValue, path, subStep = 0) {
    if (!algorithmType) return;
    
    // Xử lý trường hợp null node (search/insert thất bại)
    if (currentNode === null) {
        if (algorithmType === 'search' || algorithmType === 'insert') {
            highlightAlgorithmLine([0, 1]); // if this == null, return null
            const resultContent = document.getElementById('resultContent');
            if (algorithmType === 'search') {
                resultContent.textContent = `❌ Kiểm tra: this == null\n➜ Không tìm thấy node trong cây`;
            } else {
                resultContent.textContent = `✅ Kiểm tra: this == null\n➜ Tạo node mới tại đây`;
            }
        }
        return;
    }
    
    // Update result panel
    updateStepResult(algorithmType, nodeIndex, currentNode, searchValue, path, subStep);
    
    let lineToHighlight = null;
    
    if (algorithmType === 'search') {
        if (subStep === 0) {
            // Highlight điều kiện (if)
            if (currentNode.value === searchValue) {
                highlightAlgorithmLine(2); // else if this key == search value
            } else if (searchValue < currentNode.value) {
                highlightAlgorithmLine(6); // else if this key > search value
            } else {
                highlightAlgorithmLine(4); // else if this key < search value
            }
        } else {
            // Highlight hành động (chuyển nhánh)
            if (currentNode.value === searchValue) {
                highlightAlgorithmLine(3); // return this
            } else if (searchValue < currentNode.value) {
                highlightAlgorithmLine(7); // search left
            } else {
                highlightAlgorithmLine(5); // search right
            }
        }
    } else if (algorithmType === 'insert') {
        if (subStep === 0) {
            // Highlight điều kiện (if)
            if (searchValue < currentNode.value) {
                highlightAlgorithmLine(2); // if insert value < this key
            } else if (searchValue > currentNode.value) {
                highlightAlgorithmLine(4); // else if insert value > this key
            } else {
                highlightAlgorithmLine(6); // else
            }
        } else {
            // Highlight hành động (chuyển nhánh)
            if (searchValue < currentNode.value) {
                highlightAlgorithmLine(3); // chèn vào trái
            } else if (searchValue > currentNode.value) {
                highlightAlgorithmLine(5); // chèn vào phải
            } else {
                highlightAlgorithmLine(7); // giá trị đã tồn tại
            }
        }
    } else if (algorithmType === 'delete') {
        // Tìm index của node cần xóa trong path
        const deleteNodeIndex = path.findIndex(node => node && node.value === searchValue);
        const isSearchingForReplacement = nodeIndex > deleteNodeIndex && deleteNodeIndex !== -1;
        
        if (subStep === 0) {
            // Highlight điều kiện
            if (currentNode.value === searchValue) {
                // Tìm thấy node - chỉ highlight trường hợp của nó
                const node = currentNode;
                if (node.left === null && node.right === null) {
                    highlightAlgorithmLine(3); // else if delete value là node lá
                } else if (node.left === null || node.right === null) {
                    highlightAlgorithmLine(5); // else if delete value có 1 node con
                } else {
                    highlightAlgorithmLine(7); // else (2 children)
                }
            } else if (currentNode === null) {
                highlightAlgorithmLine(1); // if delete value == null
            } else if (isSearchingForReplacement) {
                highlightAlgorithmLine(8); // đang tìm node thay thế
            } else {
                highlightAlgorithmLine(0); // search for delete value (đang tìm)
            }
        } else {
            // Highlight hành động
            if (currentNode.value === searchValue) {
                const node = currentNode;
                if (node.left === null && node.right === null) {
                    highlightAlgorithmLine(4); // xóa node lá
                } else if (node.left === null || node.right === null) {
                    highlightAlgorithmLine(6); // nối node con với cha
                } else {
                    highlightAlgorithmLine(8); // thay thế bằng node thay thế
                }
            } else if (currentNode === null) {
                highlightAlgorithmLine(2); // return null
            } else if (isSearchingForReplacement) {
                highlightAlgorithmLine(8); // đang tìm node thay thế
            } else {
                highlightAlgorithmLine(0); // search for delete value (tiếp tục tìm)
            }
        }
    } else if (algorithmType === 'lowerBound') {
        if (subStep === 0) {
            // Substep 0: Highlight điều kiện (if)
            if (currentNode === null) {
                highlightAlgorithmLine(0); // if this == null
            } else if (currentNode.value >= searchValue) {
                highlightAlgorithmLine(2); // if this key >= target
            } else {
                highlightAlgorithmLine(5); // else
            }
        } else {
            // Substep 1: Highlight hành động
            if (currentNode === null) {
                highlightAlgorithmLine(1); // return result
            } else if (currentNode.value >= searchValue) {
                highlightAlgorithmLine([3, 4]); // cập nhật result, tìm trái
            } else {
                highlightAlgorithmLine(6); // tìm phải
            }
        }
    } else if (algorithmType === 'upperBound') {
        if (subStep === 0) {
            // Substep 0: Highlight điều kiện (if)
            if (currentNode === null) {
                highlightAlgorithmLine(0); // if this == null
            } else if (currentNode.value > searchValue) {
                highlightAlgorithmLine(2); // if this key > target
            } else {
                highlightAlgorithmLine(5); // else
            }
        } else {
            // Substep 1: Highlight hành động
            if (currentNode === null) {
                highlightAlgorithmLine(1); // return result
            } else if (currentNode.value > searchValue) {
                highlightAlgorithmLine([3, 4]); // cập nhật result, tìm trái
            } else {
                highlightAlgorithmLine(6); // tìm phải
            }
        }
    } else if (algorithmType === 'balance') {
        // Đang duyệt đến node mất cân bằng
        if (subStep === 0) {
            highlightAlgorithmLine([0, 1]); // tìm node mất cân bằng, tính độ lệch
        } else {
            highlightAlgorithmLine(2); // kiểm tra độ lệch
        }
    } else if (algorithmType === 'findMin') {
        // line 0: if this == null, line 1: return null
        // line 2: while this.left != null, line 3: đi sang trái
        if (currentNode.left !== null) {
            highlightAlgorithmLine([2, 3]); // while check true, đi sang trái
        } else {
            highlightAlgorithmLine(2); // while check false, kết thúc
        }
    } else if (algorithmType === 'findMax') {
        // line 0: if this == null, line 1: return null
        // line 2: while this.right != null, line 3: đi sang phải
        if (currentNode.right !== null) {
            highlightAlgorithmLine([2, 3]); // while check true, đi sang phải
        } else {
            highlightAlgorithmLine(2); // while check false, kết thúc
        }
    } else if (algorithmType === 'preorder' || algorithmType === 'inorder' || algorithmType === 'postorder') {
        // Lấy position metadata từ path
        const currentItem = path[nodeIndex];
        const position = (currentItem && typeof currentItem === 'object' && currentItem.position) ? currentItem.position : 'root';
        
        if (currentNode === null) {
            highlightAlgorithmLine(0); // if this == null
        } else {
            // Highlight dựa trên vị trí node trong tree
            if (algorithmType === 'preorder') {
                // PreOrder: line 2=duyệt this(gốc), 3=duyệt trái, 4=duyệt phải
                if (position === 'left') {
                    highlightAlgorithmLine(3); // duyệt trái
                } else if (position === 'right') {
                    highlightAlgorithmLine(4); // duyệt phải
                } else {
                    highlightAlgorithmLine(2); // duyệt this (gốc)
                }
            } else if (algorithmType === 'inorder') {
                // InOrder: line 2=duyệt trái, 3=duyệt this(gốc), 4=duyệt phải
                if (position === 'left') {
                    highlightAlgorithmLine(2); // duyệt trái
                } else if (position === 'right') {
                    highlightAlgorithmLine(4); // duyệt phải
                } else {
                    highlightAlgorithmLine(3); // duyệt this (gốc)
                }
            } else if (algorithmType === 'postorder') {
                // PostOrder: line 2=duyệt trái, 3=duyệt phải, 4=duyệt this(gốc)
                if (position === 'left') {
                    highlightAlgorithmLine(2); // duyệt trái
                } else if (position === 'right') {
                    highlightAlgorithmLine(3); // duyệt phải
                } else {
                    highlightAlgorithmLine(4); // duyệt this (gốc)
                }
            }
        }
    }
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

// Tìm đường đi đến lower bound
function findPathToLowerBound(target) {
    const fullPath = [];
    let currentNode = bst.root;
    let result = null;
    let resultPath = [];
    
    while (currentNode !== null) {
        fullPath.push(currentNode);
        
        if (currentNode.value >= target) {
            result = currentNode;
            resultPath = [...fullPath]; // Lưu path đến kết quả tốt nhất hiện tại
            currentNode = currentNode.left;
        } else {
            currentNode = currentNode.right;
        }
    }
    
    // Chỉ trả về path đến kết quả, tất cả nodes đều satisfy
    const path = resultPath.map(node => ({ node, satisfies: true }));
    
    return { path, result };
}

// Tìm đường đi đến upper bound
function findPathToUpperBound(target) {
    const fullPath = [];
    let currentNode = bst.root;
    let result = null;
    let resultPath = [];
    
    while (currentNode !== null) {
        fullPath.push(currentNode);
        
        if (currentNode.value > target) {
            result = currentNode;
            resultPath = [...fullPath]; // Lưu path đến kết quả tốt nhất hiện tại
            currentNode = currentNode.left;
        } else {
            currentNode = currentNode.right;
        }
    }
    
    // Chỉ trả về path đến kết quả, tất cả nodes đều satisfy
    const path = resultPath.map(node => ({ node, satisfies: true }));
    
    return { path, result };
}

// Tìm đường đi đến Min
function findPathToMin() {
    const path = [];
    let currentNode = bst.root;
    
    while (currentNode !== null) {
        path.push(currentNode);
        if (currentNode.left === null) {
            break;
        }
        currentNode = currentNode.left;
    }
    
    return path;
}

// Tìm đường đi đến Max
function findPathToMax() {
    const path = [];
    let currentNode = bst.root;
    
    while (currentNode !== null) {
        path.push(currentNode);
        if (currentNode.right === null) {
            break;
        }
        currentNode = currentNode.right;
    }
    
    return path;
}

// Tạo cây theo kiểu
function buildTreeByType(values, treeType) {
    if (values.length === 0) return;
    
    // Sắp xếp các giá trị
    const sortedValues = [...values].sort((a, b) => a - b);
    
    switch (treeType) {
        case 'unbalanced':
            // Cây không cân bằng: chèn ngẫu nhiên
            const shuffledValues = [...values].sort(() => Math.random() - 0.5);
            for (const value of shuffledValues) {
                bst.insert(value);
            }
            break;
            
        case 'balanced':
            // Cây cân bằng: chèn từ giữa ra ngoài
            buildBalancedFromArray(sortedValues, 0, sortedValues.length - 1);
            break;
            
        case 'perfect':
            // Cây cân bằng hoàn hảo: yêu cầu 2^n - 1 node
            const perfectCount = Math.pow(2, Math.floor(Math.log2(values.length + 1))) - 1;
            if (perfectCount !== values.length) {
                buildBalancedFromArray(sortedValues, 0, sortedValues.length - 1);
            } else {
                buildBalancedFromArray(sortedValues, 0, sortedValues.length - 1);
            }
            break;
            
        case 'minavl':
            // MinAVL: cây AVL với chiều cao tối thiểu
            buildMinAVLTree(sortedValues);
            break;
            
        case 'right-skewed':
            // Cây lệch phải: tất cả nodes chỉ có con phải
            for (const value of sortedValues) {
                bst.insert(value);
            }
            break;
            
        case 'left-skewed':
            // Cây lệch trái: tất cả nodes chỉ có con trái
            for (let i = sortedValues.length - 1; i >= 0; i--) {
                bst.insert(sortedValues[i]);
            }
            break;
            
        default:
            for (const value of values) {
                bst.insert(value);
            }
    }
}

// Xây dựng cây cân bằng từ mảng đã sắp xếp
function buildBalancedFromArray(arr, start, end) {
    if (start > end) return;
    
    const mid = Math.floor((start + end) / 2);
    bst.insert(arr[mid]);
    
    buildBalancedFromArray(arr, start, mid - 1);
    buildBalancedFromArray(arr, mid + 1, end);
}

// Xây dựng cây MinAVL (cây AVL với chiều cao tối thiểu cho số node cho trước)
function buildMinAVLTree(sortedValues) {
    // Sử dụng thuật toán Day-Stout-Warren để tạo cây AVL tối thiểu
    // Ở đây đơn giản hóa: tạo cây cân bằng nhưng ưu tiên độ cao thấp nhất
    
    function buildMinAVL(arr, start, end) {
        if (start > end) return;
        
        const n = end - start + 1;
        
        // Tính vị trí root tối ưu cho AVL
        // Với n node, ta muốn cây trái và phải gần bằng nhau nhất có thể
        const leftSize = Math.floor((n - 1) / 2);
        const mid = start + leftSize;
        
        bst.insert(arr[mid]);
        
        buildMinAVL(arr, start, mid - 1);
        buildMinAVL(arr, mid + 1, end);
    }
    
    buildMinAVL(sortedValues, 0, sortedValues.length - 1);
}

// Tạo cây từ input
async function createTreeFromInput() {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    clearHighlight(); // Xóa highlight cũ
    
    // Ẩn algorithm và result panel, mở stats panel
    const algorithmPanel = document.getElementById('algorithmPanel');
    const resultPanel = document.getElementById('resultPanel');
    const statsPanel = document.getElementById('statsPanel');
    if (algorithmPanel) algorithmPanel.classList.add('collapsed');
    if (resultPanel) {
        resultPanel.classList.add('collapsed');
        resultPanel.style.right = '-450px';
    }
    if (statsPanel && statsPanel.classList.contains('collapsed')) statsPanel.classList.remove('collapsed');
    
    const nodeValuesInput = document.getElementById('nodeValues');
    const treeTypeSelect = document.getElementById('treeType');
    
    const valuesText = nodeValuesInput.value.trim();
    const treeType = treeTypeSelect.value;
    
    if (!valuesText) {
        return;
    }
    
    let values = valuesText.split(',').map(val => parseInt(val.trim())).filter(val => !isNaN(val));
    
    if (values.length === 0) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Vui lòng nhập giá trị hợp lệ!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        }
        return;
    }
    
    // Kiểm tra trùng lặp
    const uniqueValues = new Set();
    const duplicates = [];
    values.forEach(val => {
        if (uniqueValues.has(val)) {
            if (!duplicates.includes(val)) {
                duplicates.push(val);
            }
        } else {
            uniqueValues.add(val);
        }
    });
    
    if (duplicates.length > 0) {
        // Tô đỏ input và hiện cảnh báo
        nodeValuesInput.style.border = '2px solid #dc3545';
        nodeValuesInput.style.boxShadow = '0 0 5px rgba(220, 53, 69, 0.5)';
        
        // Luôn hiện alert, fallback nếu Swal chưa load
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: `Giá trị trùng lặp: ${duplicates.join(', ')}`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        } else {
            alert(`Giá trị trùng lặp: ${duplicates.join(', ')}`);
        }
        return;
    }
    
    // Xóa border đỏ nếu không có lỗi
    nodeValuesInput.style.border = '';
    nodeValuesInput.style.boxShadow = '';
    
    values = [...uniqueValues];
    
    if (values.length > 20) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Tối đa 20 nodes!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        } else {
            alert('Tối đa 20 nodes!');
        }
        return;
    }
    
    // Xóa cây hiện tại
    bst.root = null;
    selectedNode = null;
    lastAddedNode = null;
    
    // Tạo cây theo kiểu được chọn
    buildTreeByType(values, treeType);
    
    updateTree(true);
}

// Tạo cây ngẫu nhiên
async function createRandomTree() {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    clearHighlight(); // Xóa highlight cũ
    
    // Ẩn algorithm và result panel, mở stats panel
    const algorithmPanel = document.getElementById('algorithmPanel');
    const resultPanel = document.getElementById('resultPanel');
    const statsPanel = document.getElementById('statsPanel');
    if (algorithmPanel) algorithmPanel.classList.add('collapsed');
    if (resultPanel) {
        resultPanel.classList.add('collapsed');
        resultPanel.style.right = '-450px';
    }
    if (statsPanel && statsPanel.classList.contains('collapsed')) statsPanel.classList.remove('collapsed');
    
    const nodeCountInput = document.getElementById('nodeCount');
    const treeTypeSelect = document.getElementById('treeType');
    const nodeCount = parseInt(nodeCountInput.value);
    const treeType = treeTypeSelect.value;
    
    if (!nodeCount || nodeCount < 1) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Vui lòng nhập số lượng nodes!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        }
        return;
    }
    
    if (nodeCount > 20) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Tối đa 20 nodes!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        } else {
            alert('Tối đa 20 nodes!');
        }
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
    
    const valuesArray = Array.from(values);
    
    // Cập nhật ô nhập giá trị
    document.getElementById('nodeValues').value = valuesArray.join(', ');
    
    // Tạo cây theo kiểu được chọn
    buildTreeByType(valuesArray, treeType);
    
    updateTree(true);
}

// Xóa tất cả highlight
function clearHighlight() {
    const g = svg.select('#treeGroup');
    if (!g.empty()) {
        g.selectAll('.node-visited').classed('node-visited', false);
        g.selectAll('.node-current').classed('node-current', false);
        g.selectAll('.link-visited').classed('link-visited', false);
        g.selectAll('.link-current').classed('link-current', false);
        
        // Xóa inline style của edges (từ insertNode callback)
        g.selectAll('.link')
            .style('stroke', null)
            .style('stroke-width', null)
            .style('opacity', null);
    }
}

// Đưa cây về trạng thái thực (unhide tất cả node, xóa pending delete)
function restoreTreeToRealState() {
    // Nếu đang có animation chưa xong, jump về step cuối để callback được gọi
    if (animationState.isActive && animationState.totalSteps > 0) {
        const finalStep = animationState.totalSteps - 1;
        if (animationState.currentStep < finalStep) {
            jumpToStep(finalStep, true); // skipPause = true để không pause
        }
    }
    
    // Unhide tất cả các node trong cây
    function unhideAllNodes(node) {
        if (!node) return;
        node.hidden = false;
        unhideAllNodes(node.left);
        unhideAllNodes(node.right);
    }
    unhideAllNodes(bst.root);
    
    // Delete đã xóa thật trong callback hoặc jumpToStep, không cần xử lý thêm
    
    // Reset các state liên quan đến insert/delete
    animationState.pendingInsertValue = undefined;
    animationState.pendingDeleteValue = undefined;
    animationState.insertedNodeValue = undefined;
    animationState.deletedNode = null;
    animationState.nodeExistsBeforeInsert = false;
    animationState.treeBeforeDelete = null;
}

// Hiển thị thuật toán
function showAlgorithm(type, value = null) {
    const codeElement = document.getElementById('algorithmCode');
    
    const algorithms = {
        search: {
            title: 'Thuật Toán Tìm Kiếm',
            lines: [
                '  if this == null',
                '    return null',
                '  else if this key == search value',
                '    return this',
                '  else if this key < search value',
                '    tìm nhánh phải',
                '  else if this key > search value',
                '    tìm nhánh trái'
            ]
        },
        insert: {
            title: 'Thuật Toán Thêm Node',
            lines: [
                '  if this == null',
                '    tạo node mới',
                '  if insert value < this key',
                '    chèn vào trái',
                '  else if insert value > this key',
                '    chèn vào phải',
                '  else',
                '    giá trị đã tồn tại'
            ]
        },
        delete: {
            title: 'Thuật Toán Xóa Node',
            lines: [
                '  tìm kiếm delete value',
                '  if delete value == null',
                '    return null',
                '  else if delete value là node lá',
                '    xóa node lá',
                '  else if delete value có 1 node con',
                '    nối node con với cha của delete value',
                '  else',
                '    thay thế delete value bằng node thay thế'
            ]
        },
        lowerBound: {
            title: 'Thuật Toán Lower Bound',
            lines: [
                '  if this == null',
                '    return result',
                '  if this key >= target',
                '    cập nhật result = this',
                '    tìm tiếp ở trái',
                '  else',
                '    tìm tiếp ở phải'
            ]
        },
        upperBound: {
            title: 'Thuật Toán Upper Bound',
            lines: [
                '  if this == null',
                '    return result',
                '  if this key > target',
                '    cập nhật result = this',
                '    tìm tiếp ở trái',
                '  else',
                '    tìm tiếp ở phải'
            ]
        },
        findMin: {
            title: 'Thuật Toán Tìm Min',
            lines: [
                '  if this == null',
                '    return null',
                '  while this.left != null',
                '    đi sang trái'
            ]
        },
        findMax: {
            title: 'Thuật Toán Tìm Max',
            lines: [
                '  if this == null',
                '    return null',
                '  while this.right != null',
                '    đi sang phải'
            ]
        },
        preorder: {
            title: 'Thuật Toán Duyệt Pre-order',
            lines: [
                '  if this == null',
                '    return',
                '  duyệt this (gốc)',
                '  duyệt trái',
                '  duyệt phải'
            ]
        },
        inorder: {
            title: 'Thuật Toán Duyệt In-order',
            lines: [
                '  if this == null',
                '    return',
                '  duyệt trái',
                '  duyệt this (gốc)',
                '  duyệt phải'
            ]
        },
        postorder: {
            title: 'Thuật Toán Duyệt Post-order',
            lines: [
                '  if this == null',
                '    return',
                '  duyệt trái',
                '  duyệt phải',
                '  duyệt this (gốc)'
            ]
        },
        balance: {
            title: 'Thuật Toán Cân Bằng Cây',
            lines: [
                '  tìm node mất cân bằng',
                '  tính độ lệch (height_left - height_right)',
                '  if độ lệch > 1',
                '    xoay phải (LL hoặc LR)',
                '  else if độ lệch < -1',
                '    xoay trái (RR hoặc RL)',
                '  cập nhật cây sau khi xoay'
            ]
        }
    };
    
    const algo = algorithms[type];
    if (algo) {
        // Tạo HTML với từng dòng code có thể highlight
        if (algo.lines) {
            codeElement.innerHTML = algo.lines.map((line, index) => 
                `<span class="code-line" data-line="${index}">${line}</span>`
            ).join('\n');
        } else {
            codeElement.textContent = algo.code;
        }
        
        // Tự động mở algorithm panel và result panel
        const panel = document.getElementById('algorithmPanel');
        const resultPanel = document.getElementById('resultPanel');
        panel.classList.remove('collapsed');
        resultPanel.classList.remove('collapsed');
        
        // Reset result content
        const resultContent = document.getElementById('resultContent');
        resultContent.textContent = 'Bắt đầu thực hiện thuật toán...';
        
        // Cập nhật vị trí result panel sau khi nội dung thay đổi
        setTimeout(() => updateResultPanelPosition(), 50);
    }
}

// Cập nhật vị trí result panel dựa trên chiều cao của algorithm panel
function updateResultPanelPosition() {
    const algorithmPanel = document.getElementById('algorithmPanel');
    const resultPanel = document.getElementById('resultPanel');
    const toggleBtn = document.querySelector('.toggle-result-btn');
    
    if (!algorithmPanel || !resultPanel) return;
    
    // Lấy chiều cao và chiều rộng thực tế của algorithm panel
    const algorithmHeight = algorithmPanel.offsetHeight;
    const algorithmWidth = algorithmPanel.offsetWidth;
    const algorithmBottom = 10; // bottom position của algorithm panel
    const algorithmRight = 10; // right position của algorithm panel
    const gap = 10; // khoảng cách giữa 2 panel
    
    // Nếu algorithm panel bị ẩn thì cũng ẩn result panel
    if (algorithmPanel.classList.contains('collapsed')) {
        if (!resultPanel.classList.contains('collapsed')) {
            resultPanel.classList.add('collapsed');
            resultPanel.style.right = '-450px';
        }
        if (toggleBtn) {
            toggleBtn.style.right = '';
        }
        return;
    }
    
    // Tính và đặt vị trí mới cho result panel
    const newRight = algorithmRight + algorithmWidth + gap;
    resultPanel.style.bottom = '30px';
    resultPanel.style.right = `${newRight}px`;
    
    // Đặt vị trí toggle button cạnh toggle-algorithm-btn
    if (toggleBtn) {
        const toggleBtnRight = algorithmRight + 50; // 50px = khoảng cách từ algorithm toggle button
        toggleBtn.style.right = `${toggleBtnRight}px`;
    }
}

// Reset toàn bộ animation và state
// Jump về step cuối rồi mới reset (dùng khi bắt đầu animation mới)
async function jumpToEndAndReset(callback) {
    if (animationState.totalSteps > 0) {
        // Jump về step cuối (kể cả khi đang pause) - jumpToStep đã restore và vẽ cây
        await jumpToStep(animationState.totalSteps - 1, true);
        // Đợi thêm một chút để đảm bảo UI đã cập nhật xong
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Reset animation state
    resetAnimation();
    
    // Thực hiện callback nếu có
    if (callback) callback();
}

function resetAnimation() {
    // Clear tất cả timeouts
    activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeTimeouts = [];
    
    // Stop tất cả transitions
    const g = svg.select('#treeGroup');
    g.selectAll('.node').interrupt();
    g.selectAll('.link').interrupt();
    g.selectAll('.arrow-group').interrupt();
    
    // Clear animation state
    if (animationState.timeoutId) {
        clearTimeout(animationState.timeoutId);
        animationState.timeoutId = null;
    }
    
    // Remove arrow nếu tồn tại
    if (animationState.arrow) {
        animationState.arrow.remove();
        animationState.arrow = null;
    }
    
    animationState.isActive = false;
    animationState.isPaused = false;
    animationState.currentStep = 0;
    animationState.totalSteps = 0;
    animationState.path = [];
    
    // Đưa cây về trạng thái thực trước khi reset
    if (animationState.algorithmType) {
        // Unhide tất cả các node trong cây (duyệt toàn bộ cây)
        function unhideAllNodes(node) {
            if (!node) return;
            node.hidden = false;
            unhideAllNodes(node.left);
            unhideAllNodes(node.right);
        }
        unhideAllNodes(bst.root);
        
        // Xử lý delete: cây hiện tại đã ở trạng thái đúng từ jumpToStep
        // Không cần delete lại nữa, chỉ cần clear state
        
        // Reset các state liên quan đến insert/delete
        animationState.pendingInsertValue = undefined;
        animationState.pendingDeleteValue = undefined;
        animationState.insertedNodeValue = undefined;
        animationState.deletedNode = null;
        animationState.nodeExistsBeforeInsert = false;
        animationState.treeBeforeDelete = null;
        animationState.deleteTreeBeforeDelete = null;
        animationState.deleteTreeAfterDelete = null;
        animationState.deleteHighlights = [];
        animationState.deleteAlgorithmLines = [];
        animationState.deleteResultTexts = [];
        animationState.balanceTreeBefore = null;
        animationState.balanceTreeAfter = null;
        animationState.balanceHighlights = [];
        animationState.balanceAlgorithmLines = [];
        animationState.balanceResultTexts = [];
        
        // Update tree để hiển thị lại các node đã unhide
        updateTree();
    }
    
    isAnimating = false;
    
    // Remove all arrows (cả arrow-group và traversal-arrow)
    g.selectAll('.arrow-group').remove();
    g.selectAll('.traversal-arrow').remove();
    
    // Clear tất cả highlights và classes
    g.selectAll('.node-visited').classed('node-visited', false);
    g.selectAll('.node-current').classed('node-current', false);
    g.selectAll('.link-visited').classed('link-visited', false);
    g.selectAll('.link-current').classed('link-current', false);
    
    // Ẩn các panels trực tiếp
    const algorithmPanel = document.getElementById('algorithmPanel');
    const resultPanel = document.getElementById('resultPanel');
    if (algorithmPanel) {
        algorithmPanel.classList.add('collapsed');
    }
    if (resultPanel) {
        resultPanel.classList.add('collapsed');
        resultPanel.style.right = '-450px'; // Force ẩn
    }
    
    // Ẩn animation control bar
    hideControlBar();
    
    // Clear code highlight
    const codeElement = document.getElementById('algorithmCode');
    if (codeElement) {
        codeElement.querySelectorAll('.code-line').forEach(line => {
            line.classList.remove('highlight');
        });
    }
    
    // Reset opacity của tất cả links
    g.selectAll('.link').style('opacity', 1);
}

// Highlight dòng code trong thuật toán
function highlightAlgorithmLine(lineIndexes) {
    const codeElement = document.getElementById('algorithmCode');
    // Xóa highlight cũ
    codeElement.querySelectorAll('.code-line').forEach(line => {
        line.classList.remove('highlight');
    });
    
    // Chuyển thành array nếu là single value
    const indexes = Array.isArray(lineIndexes) ? lineIndexes : [lineIndexes];
    
    // Thêm highlight mới cho tất cả các dòng
    indexes.forEach(lineIndex => {
        if (lineIndex !== null && lineIndex !== undefined) {
            const line = codeElement.querySelector(`[data-line="${lineIndex}"]`);
            if (line) {
                line.classList.add('highlight');
            }
        }
    });
    
    // Scroll đến dòng đầu tiên
    if (indexes.length > 0 && indexes[0] !== null && indexes[0] !== undefined) {
        const firstLine = codeElement.querySelector(`[data-line="${indexes[0]}"]`);
        if (firstLine) {
            firstLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Thêm node mới
async function insertNode() {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    // Đưa cây về trạng thái thực
    restoreTreeToRealState();
    updateTree();
    
    clearHighlight(); // Xóa highlight cũ
    
    const valueInput = document.getElementById('nodeValue');
    const value = parseInt(valueInput.value);
    
    // Kiểm tra điều kiện trước khi hiển thị thuật toán
    if (isNaN(value)) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Vui lòng nhập giá trị hợp lệ!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        }
        return;
    }
    
    if (bst.countNodes() >= 20) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Cây đã đầy (tối đa 20 nodes)!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        } else {
            alert('Cây đã đầy (tối đa 20 nodes)!');
        }
        return;
    }

    const nodeExists = bst.find(value);
    
    // Hiển thị thuật toán sau khi đã check hợp lệ
    showAlgorithm('insert', value);

    // Tìm đường đi đến vị trí chèn
    const path = findPathToNode(value);
    
    // Lưu thông tin insert vào animationState để jumpToStep xử lý
    animationState.pendingInsertValue = value;
    animationState.pendingInsertPath = path;
    animationState.nodeExistsBeforeInsert = nodeExists;
    
    // Thực hiện animation với highlight code
    animateTraversal(path, () => {
        console.log('Insert callback called, nodeExists:', nodeExists);
        const resultContent = document.getElementById('resultContent');
        
        if (nodeExists) {
            // Node đã tồn tại - thất bại
            const g = svg.select('#treeGroup');
            g.selectAll('.node').filter(d => d.value === value)
                .classed('node-visited', true);
            
            resultContent.textContent = `📌 Thêm node (${value})\n✖️ Giá trị đã tồn tại trong cây`;
        } else {
            // Insert node thật khi animation chạy tự động đến cuối
            lastAddedNode = bst.insert(value);
            lastAddedNode.hidden = false; // Đảm bảo node không bị ẩn
            animationState.insertedNodeValue = value;
            
            valueInput.value = '';
            updateTree();
            
            // Highlight node mới
            setTimeout(() => {
                const g = svg.select('#treeGroup');
                g.selectAll('.node').filter(d => d.value === value)
                    .classed('node-visited', true);
                
                if (path.length >= 1) {
                    const parentNode = path[path.length - 1];
                    g.selectAll('.link')
                        .filter(d => d.source === parentNode && d.target.value === value)
                        .classed('link-visited', true);
                }
            }, 350);
            
            resultContent.textContent = `📌 Thêm node (${value})\n✔️ Đã thêm thành công vào cây`;
            
            // Cập nhật input
            const nodeCount = bst.countNodes();
            document.getElementById('nodeCount').value = nodeCount;
            const allValues = bst.inOrder().map(n => n.value).join(', ');
            document.getElementById('nodeValues').value = allValues;
            
            const statsPanel = document.getElementById('statsPanel');
            if (statsPanel && statsPanel.classList.contains('collapsed')) {
                statsPanel.classList.remove('collapsed');
            }
        }
    }, 'insert', value);
}

// Tìm node
async function findNode() {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    // Đưa cây về trạng thái thực
    restoreTreeToRealState();
    updateTree();
    
    clearHighlight(); // Xóa highlight cũ
    
    // Ẩn stats panel
    const statsPanel = document.getElementById('statsPanel');
    if (!statsPanel.classList.contains('collapsed')) {
        statsPanel.classList.add('collapsed');
    }
    
    const valueInput = document.getElementById('nodeValue');
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Vui lòng nhập giá trị hợp lệ!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        }
        return;
    }
    
    showAlgorithm('search', value); // Hiển thị thuật toán sau khi check

    const path = findPathToNode(value);
    const foundNode = path.length > 0 && path[path.length - 1].value === value;
    
    if (!foundNode) {
        // Trường hợp không tìm thấy: chạy animation đến node cuối, sau đó thêm 1 step để highlight null check
        // Thêm một "virtual node" để tạo thêm 2 substeps cho null check
        const pathWithNullCheck = [...path, null];
        
        animateTraversal(pathWithNullCheck, () => {
            const resultContent = document.getElementById('resultContent');
            // Highlight dòng "if this == null" và "return null" khi thất bại
            highlightAlgorithmLine([0, 1]);
            resultContent.textContent = `📌 Tìm node (${value})\n✖️ Không tìm thấy trong cây (this == null)`;
        }, 'search', value);
        return;
    }
    
    // Thực hiện animation khi tìm thấy
    animateTraversal(path, () => {
        const resultContent = document.getElementById('resultContent');
        selectedNode = path[path.length - 1];
        updateTree();
        
        // Highlight node tìm thấy
        const g = svg.select('#treeGroup');
        g.selectAll('.node').filter(d => d.value === value)
            .classed('node-visited', true);
        
        resultContent.textContent = `📌 Tìm node (${value})\n✔️ Đã tìm thấy trong cây`;
    }, 'search', value);
}

// Xóa node người dùng nhập và nối edges tới node thay thế
// Hàm clone toàn bộ cấu trúc cây (deep copy)
function cloneTreeStructure(node) {
    if (!node) return null;
    
    const clonedNode = new TreeNode(node.value);
    clonedNode.id = node.id;
    clonedNode.x = node.x;
    clonedNode.y = node.y;
    clonedNode.depth = node.depth;
    clonedNode.side = node.side;
    clonedNode.width = node.width;
    clonedNode.position = node.position;
    clonedNode.hidden = node.hidden;
    
    clonedNode.left = cloneTreeStructure(node.left);
    clonedNode.right = cloneTreeStructure(node.right);
    
    return clonedNode;
}

// Hàm capture algorithm line highlights
function captureAlgorithmHighlights() {
    const codeElement = document.getElementById('algorithmCode');
    if (!codeElement) return [];
    
    const highlightedLines = [];
    const lines = codeElement.querySelectorAll('.code-line');
    lines.forEach(line => {
        if (line.classList.contains('highlight')) {
            const lineNum = line.getAttribute('data-line');
            if (lineNum !== null) {
                highlightedLines.push(parseInt(lineNum));
            }
        }
    });
    return highlightedLines;
}

// Hàm áp dụng algorithm line highlights
function applyAlgorithmHighlights(lineIndexes) {
    const codeElement = document.getElementById('algorithmCode');
    if (!codeElement) return;
    
    // Xóa tất cả highlights cũ
    codeElement.querySelectorAll('.code-line').forEach(line => {
        line.classList.remove('highlight');
    });
    
    // Thêm highlights mới
    if (Array.isArray(lineIndexes)) {
        lineIndexes.forEach(lineIndex => {
            const line = codeElement.querySelector(`[data-line="${lineIndex}"]`);
            if (line) {
                line.classList.add('highlight');
            }
        });
    }
}

// Hàm lưu trạng thái highlight (nodes và edges)
function captureHighlightState() {
    const g = svg.select('#treeGroup');
    
    const highlightedNodes = {
        visited: [],
        current: []
    };
    
    const highlightedEdges = {
        visited: [],
        current: []
    };
    
    // Lấy nodes được highlight
    g.selectAll('.node-visited').each(function(d) {
        highlightedNodes.visited.push(d.value);
    });
    
    g.selectAll('.node-current').each(function(d) {
        highlightedNodes.current.push(d.value);
    });
    
    // Lấy edges được highlight
    g.selectAll('.link-visited').each(function(d) {
        highlightedEdges.visited.push({
            source: d.source.value,
            target: d.target.value
        });
    });
    
    g.selectAll('.link-current').each(function(d) {
        highlightedEdges.current.push({
            source: d.source.value,
            target: d.target.value
        });
    });
    
    return {
        nodes: highlightedNodes,
        edges: highlightedEdges
    };
}

// Hàm áp dụng lại trạng thái highlight
function applyHighlightState(highlightState) {
    if (!highlightState) return;
    
    const g = svg.select('#treeGroup');
    
    // Clear highlights cũ
    g.selectAll('.node-visited').classed('node-visited', false);
    g.selectAll('.node-current').classed('node-current', false);
    g.selectAll('.link-visited').classed('link-visited', false);
    g.selectAll('.link-current').classed('link-current', false);
    
    // Áp dụng node highlights
    if (highlightState.nodes) {
        highlightState.nodes.visited.forEach(value => {
            g.selectAll('.node').filter(d => d.value === value)
                .classed('node-visited', true);
        });
        
        highlightState.nodes.current.forEach(value => {
            g.selectAll('.node').filter(d => d.value === value)
                .classed('node-current', true);
        });
    }
    
    // Áp dụng edge highlights
    if (highlightState.edges) {
        highlightState.edges.visited.forEach(edge => {
            g.selectAll('.link').filter(d => 
                d.source.value === edge.source && d.target.value === edge.target
            ).classed('link-visited', true);
        });
        
        highlightState.edges.current.forEach(edge => {
            g.selectAll('.link').filter(d => 
                d.source.value === edge.source && d.target.value === edge.target
            ).classed('link-current', true);
        });
    }
}

// Hàm restore cây từ snapshot
// Hàm insert node vào đúng vị trí chỉ định (dùng để restore node đã xóa)
function insertNodeAtPosition(value, parentValue, isLeftChild) {
    const newNode = new TreeNode(value);
    
    if (parentValue === null) {
        // Node sẽ là root
        bst.root = newNode;
        return newNode;
    }
    
    // Tìm parent node
    const parent = bst.find(parentValue);
    if (!parent) {
        console.error('Parent node not found:', parentValue);
        return null;
    }
    
    // Insert vào đúng vị trí - chỉ thay đổi edge, không xóa node
    if (isLeftChild) {
        parent.left = newNode;
    } else {
        parent.right = newNode;
    }
    
    return newNode;
}

// Hàm di chuyển node từ vị trí hiện tại sang vị trí mới
function moveNodeToPosition(value, newParentValue, isLeftChild) {
    // Tìm node cần di chuyển và parent hiện tại của nó
    let nodeToMove = null;
    let currentParent = null;
    let isCurrentLeft = false;
    
    const findNode = (node, parent, isLeft) => {
        if (!node) return;
        
        if (node.value === value) {
            nodeToMove = node;
            currentParent = parent;
            isCurrentLeft = isLeft;
            return;
        }
        
        findNode(node.left, node, true);
        findNode(node.right, node, false);
    };
    
    findNode(bst.root, null, false);
    
    if (!nodeToMove) {
        console.error('Node to move not found:', value);
        return null;
    }
    
    // Ngắt kết nối với parent cũ - chỉ xóa edge, giữ nguyên node
    if (currentParent) {
        if (isCurrentLeft) {
            currentParent.left = null;  // Chỉ xóa edge
        } else {
            currentParent.right = null;  // Chỉ xóa edge
        }
    }
    
    // Tìm parent mới và kết nối
    const newParent = newParentValue ? bst.find(newParentValue) : null;
    
    if (!newParent && newParentValue !== null) {
        console.error('New parent not found:', newParentValue);
        return null;
    }
    
    if (newParent) {
        if (isLeftChild) {
            newParent.left = nodeToMove;
        } else {
            newParent.right = nodeToMove;
        }
    } else {
        // Di chuyển lên root
        bst.root = nodeToMove;
    }
    
    return nodeToMove;
}

function deleteOneNode(value) {
    const deleteRecursive = (node, parent, isLeft) => {
        if (node === null) return null;
        
        if (node.value === value) {
            // Tìm thấy node cần xóa
            
            // Trường hợp 1: Node có 2 con
            if (node.left !== null && node.right !== null) {
                // Tìm max node trong subtree trái và parent của nó
                let maxParent = node;
                let maxNode = node.left;
                
                while (maxNode.right !== null) {
                    maxParent = maxNode;
                    maxNode = maxNode.right;
                }
                
                // Xóa max node khỏi vị trí cũ
                if (maxParent === node) {
                    // Max node là left child trực tiếp
                    maxParent.left = maxNode.left;
                } else {
                    // Max node ở sâu hơn bên phải
                    maxParent.right = maxNode.left;
                }
                
                // Đưa max node lên vị trí node cần xóa
                maxNode.left = node.left;
                maxNode.right = node.right;
                
                // Reconnect parent với max node
                if (parent === null) {
                    return maxNode;
                }
                
                if (isLeft) {
                    parent.left = maxNode;
                } else {
                    parent.right = maxNode;
                }
                
                return maxNode;
            }
            
            // Trường hợp 2: Node có 0 hoặc 1 con
            const child = node.left !== null ? node.left : node.right;
            
            if (parent === null) {
                return child;
            }
            
            if (isLeft) {
                parent.left = child;
            } else {
                parent.right = child;
            }
            
            return child;
        }
        
        if (value < node.value) {
            deleteRecursive(node.left, node, true);
        } else {
            deleteRecursive(node.right, node, false);
        }
        
        return node;
    };
    
    bst.root = deleteRecursive(bst.root, null, false);
}

// Xóa node theo giá trị nhập vào
async function deleteSelectedNode() {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    // Đưa cây về trạng thái thực
    restoreTreeToRealState();
    updateTree();
    
    clearHighlight(); // Xóa highlight cũ
    
    // Lấy giá trị từ textbox
    const valueInput = document.getElementById('nodeValue');
    const value = parseInt(valueInput.value);
    
    if (isNaN(value)) {
        return;
    }
    
    showAlgorithm('delete', value); // Hiển thị thuật toán
    const path = findPathToNode(value);
    const foundNode = path.length > 0 && path[path.length - 1].value === value;
    
    if (!foundNode) {
        // Trường hợp không tìm thấy: chạy animation đến node cuối, sau đó thêm 1 step để highlight null check
        const pathWithNullCheck = [...path, null];
        
        animationState.pendingDeleteValue = value;
        animationState.pendingDeletePath = pathWithNullCheck;
        animationState.deletedNode = null;
        animationState.treeBeforeDelete = null;
        
        animateTraversal(pathWithNullCheck, () => {
            const resultContent = document.getElementById('resultContent');
            // Highlight dòng "if this == null" khi thất bại
            highlightAlgorithmLine([0, 1]);
            resultContent.textContent = `📌 Xóa node (${value})\n✖️ Node không tồn tại trong cây (this == null)`;
        }, 'delete', value);
        return;
    }
    
    // Lưu node cần xóa và trạng thái cây ban đầu
    const nodeToDelete = bst.find(value);
    const treeSnapshot = bst.inOrder().map(n => n.value);
    
    // Tìm parent của node cần xóa
    let parentOfDeleted = null;
    let isDeletedLeftChild = false;
    
    const findParent = (node, parent, isLeft) => {
        if (!node) return;
        if (node.value === value) {
            parentOfDeleted = parent;
            isDeletedLeftChild = isLeft;
            return;
        }
        findParent(node.left, node, true);
        findParent(node.right, node, false);
    };
    findParent(bst.root, null, false);
    
    // Kiểm tra node có 2 con không
    const hasTwoChildren = nodeToDelete.left !== null && nodeToDelete.right !== null;
    
    // Lưu thông tin về replacement node nếu có
    let replacementValue = null;
    let replacementOldParent = null;
    let replacementIsLeftChild = false;
    
    if (hasTwoChildren) {
        // Tìm max node bên trái và parent của nó
        let maxParent = nodeToDelete;
        let maxNode = nodeToDelete.left;
        
        while (maxNode.right !== null) {
            maxParent = maxNode;
            maxNode = maxNode.right;
        }
        
        replacementValue = maxNode.value;
        replacementOldParent = maxParent.value;
        replacementIsLeftChild = (maxParent === nodeToDelete);  // Nếu parent là node bị xóa thì là left child
    }
    
    // Lưu thông tin để có thể restore
    animationState.deletedNodeInfo = {
        value: value,
        parent: parentOfDeleted ? parentOfDeleted.value : null,
        isLeftChild: isDeletedLeftChild,
        leftChild: nodeToDelete.left ? nodeToDelete.left.value : null,
        rightChild: nodeToDelete.right ? nodeToDelete.right.value : null,
        replacementValue: replacementValue,
        replacementOldParent: replacementOldParent,
        replacementIsLeftChild: replacementIsLeftChild
    };
    let fullPath = [...path];
    
    if (hasTwoChildren) {
        // Trường hợp 2: Node có 2 con - cần tìm max bên trái
        // Tạo path đến max node bên trái
        let maxNode = nodeToDelete.left;
        fullPath.push(maxNode); // Đi sang trái
        while (maxNode.right !== null) {
            maxNode = maxNode.right;
            fullPath.push(maxNode); // Tiếp tục đi phải đến max
        }
    }
    // Trường hợp 1: Node có 1 con hoặc không có con - chỉ cần path đến node đó
    
    animationState.pendingDeleteValue = value;
    animationState.pendingDeletePath = fullPath;
    animationState.deletedNode = null;
    animationState.treeBeforeDelete = treeSnapshot;
    animationState.hasTwoChildren = hasTwoChildren;
    
    // Tối ưu: Lưu cây chỉ 2 lần (trước và sau delete), highlights cho mỗi step
    animationState.deleteSteps = [];
    animationState.deleteTreeBeforeDelete = cloneTreeStructure(bst.root); // Lưu tree ban đầu 1 lần
    animationState.deleteTreeAfterDelete = null; // Sẽ lưu sau khi delete thật
    animationState.deleteHighlights = []; // Mảng highlights cho từng step
    animationState.deleteAlgorithmLines = []; // Mảng algorithm line highlights
    animationState.deleteResultTexts = []; // Mảng result content
    
    // Highlight ban đầu (step 0)
    animationState.deleteHighlights.push({ nodes: { visited: [], current: [] }, edges: { visited: [], current: [] } });
    animationState.deleteAlgorithmLines.push([]);
    animationState.deleteResultTexts.push('');
    
    // Thực hiện animation với highlight code
    animateTraversal(fullPath, () => {
        const resultContent = document.getElementById('resultContent');
        const g = svg.select('#treeGroup');
        
        // Bước 1: Xóa các edge xung quanh node cần xóa
        resultContent.textContent = `📌 Xóa node (${value})\n🔄 Bước 1: Xóa các edge của node ${value}`;
        
        g.selectAll('.link')
            .filter(d => d.source.value === value || d.target.value === value)
            .transition()
            .duration(500)
            .style('opacity', 0);
        
        // Bước 2: Xóa node cần xóa (fade out)
        setTimeout(() => {
            resultContent.textContent = `📌 Xóa node (${value})\n🔄 Bước 2: Xóa node ${value}`;
            
            g.selectAll('.node')
                .filter(d => d.value === value)
                .transition()
                .duration(500)
                .style('opacity', 0);
            
            // Bước 3: Tạo edges mới nối tới node thay thế (nếu có 2 con)
            setTimeout(() => {
                // Tìm giá trị thay thế trước khi xóa
                let replacementValue = null;
                
                if (hasTwoChildren) {
                    const nodeToDelete = bst.find(value);
                    if (nodeToDelete && nodeToDelete.left) {
                        const maxNode = bst.findMaxNode(nodeToDelete.left);
                        replacementValue = maxNode.value;
                    }
                }
                
                if (replacementValue !== null) {
                    resultContent.textContent = `📌 Xóa node (${value})\n🔄 Bước 3: Xóa edge từ cha đến node ${replacementValue}`;
                    
                    // Chỉ xóa edge từ parent đến node thay thế, giữ lại edge đến children của nó
                    g.selectAll('.link')
                        .filter(d => d.target.value === replacementValue)
                        .transition()
                        .duration(500)
                        .style('opacity', 0);
                    
                    // Bước 4: Di chuyển node thay thế
                    setTimeout(() => {
                        resultContent.textContent = `📌 Xóa node (${value})\n🔄 Bước 4: Di chuyển node ${replacementValue} lên vị trí mới`;
                        
                        // Lấy vị trí của node gốc (node sẽ bị xóa)
                        const deletedNodeData = g.selectAll('.node').filter(d => d.value === value).data()[0];
                        const targetX = deletedNodeData ? deletedNodeData.x : 0;
                        const targetY = deletedNodeData ? deletedNodeData.y : 0;
                        
                        // Di chuyển node thay thế lên vị trí node gốc
                        g.selectAll('.node')
                            .filter(d => d.value === replacementValue)
                            .transition()
                            .duration(500)
                            .attr('transform', `translate(${targetX}, ${targetY})`);
                        
                        // Sau khi animation xong, cập nhật cây thực
                        setTimeout(() => {
                            // Xóa node
                            deleteOneNode(value);
                            animationState.deletedNode = value;
                            
                            // Vẽ lại cây
                            updateTree();
                            
                            // Set result text TRƯỜC
                            resultContent.textContent = `📌 Xóa node (${value})\n✅ Đã xóa và di chuyển node ${replacementValue}`;
                            
                            // Cập nhật input
                            const nodeCount = bst.countNodes();
                            document.getElementById('nodeCount').value = nodeCount;
                            const allValues = bst.inOrder().map(n => n.value).join(', ');
                            document.getElementById('nodeValues').value = allValues;
                            
                            const statsPanel = document.getElementById('statsPanel');
                            if (statsPanel && statsPanel.classList.contains('collapsed')) {
                                statsPanel.classList.remove('collapsed');
                            }
                            
                            // Lưu tree sau delete và highlight cuối cùng (SAU khi set result)
                            setTimeout(() => {
                                if (animationState.deleteHighlights) {
                                    animationState.deleteTreeAfterDelete = cloneTreeStructure(bst.root);
                                    animationState.deleteHighlights.push(captureHighlightState());
                                    animationState.deleteAlgorithmLines.push(captureAlgorithmHighlights());
                                    const resultContent = document.getElementById('resultContent');
                                    animationState.deleteResultTexts.push(resultContent ? resultContent.textContent : '');
                                }
                            }, 100);
                        }, 500);
                    }, 500);
                } else {
                    // Trường hợp không có 2 con
                    resultContent.textContent = `📌 Xóa node (${value})\n🔄 Bước 3: Nối lại cây`;
                    
                    // Xóa node
                    deleteOneNode(value);
                    animationState.deletedNode = value;
                    
                    // Vẽ lại cây
                    updateTree();
                    
                    // Set result text TRƯỜC
                    resultContent.textContent = `📌 Xóa node (${value})\n✅ Đã xóa và nối lại cây`;
                    
                    // Cập nhật input
                    const nodeCount = bst.countNodes();
                    document.getElementById('nodeCount').value = nodeCount;
                    const allValues = bst.inOrder().map(n => n.value).join(', ');
                    document.getElementById('nodeValues').value = allValues;
                    
                    const statsPanel = document.getElementById('statsPanel');
                    if (statsPanel && statsPanel.classList.contains('collapsed')) {
                        statsPanel.classList.remove('collapsed');
                    }
                    
                    // Lưu tree sau delete và highlight cuối cùng (SAU khi set result)
                    setTimeout(() => {
                        if (animationState.deleteHighlights) {
                            animationState.deleteTreeAfterDelete = cloneTreeStructure(bst.root);
                            animationState.deleteHighlights.push(captureHighlightState());
                            animationState.deleteAlgorithmLines.push(captureAlgorithmHighlights());
                            const resultContent = document.getElementById('resultContent');
                            animationState.deleteResultTexts.push(resultContent ? resultContent.textContent : '');
                        }
                    }, 100);
                }
            }, 500);
        }, 500);
    }, 'delete', value);
}

// Xóa toàn bộ cây
function clearTree() {
    // Reset animation toàn bộ (bao gồm cả ẩn panels và control bar)
    resetAnimation();
    
    clearHighlight(); // Xóa highlight cũ
    
    // Ẩn algorithm và result panel, mở stats panel
    const algorithmPanel = document.getElementById('algorithmPanel');
    const resultPanel = document.getElementById('resultPanel');
    const statsPanel = document.getElementById('statsPanel');
    if (algorithmPanel) algorithmPanel.classList.add('collapsed');
    if (resultPanel) {
        resultPanel.classList.add('collapsed');
        resultPanel.style.right = '-450px';
    }
    if (statsPanel && statsPanel.classList.contains('collapsed')) statsPanel.classList.remove('collapsed');
    
    bst.root = null;
    selectedNode = null;
    lastAddedNode = null;
    
    updateTree();
}

// Tính balance factor của node
function getBalanceFactor(node) {
    if (!node) return 0;
    const leftHeight = getNodeHeight(node.left);
    const rightHeight = getNodeHeight(node.right);
    return leftHeight - rightHeight;
}

function getNodeHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(getNodeHeight(node.left), getNodeHeight(node.right));
}

// Tìm tất cả các node mất cân bằng
function findUnbalancedNodes(node, unbalancedNodes = []) {
    if (!node) return unbalancedNodes;
    
    const balanceFactor = getBalanceFactor(node);
    if (Math.abs(balanceFactor) > 1) {
        unbalancedNodes.push({
            node: node,
            balanceFactor: balanceFactor
        });
    }
    
    findUnbalancedNodes(node.left, unbalancedNodes);
    findUnbalancedNodes(node.right, unbalancedNodes);
    
    return unbalancedNodes;
}

// Xoay trái (Left Rotation) - RR case
function leftRotate(node, parent) {
    const rightChild = node.right;
    node.right = rightChild.left;
    rightChild.left = node;
    
    // Cập nhật side
    if (node.right) node.right.side = 'right';
    node.side = 'left';
    
    return rightChild;
}

// Xoay phải (Right Rotation) - LL case
function rightRotate(node, parent) {
    const leftChild = node.left;
    node.left = leftChild.right;
    leftChild.right = node;
    
    // Cập nhật side
    if (node.left) node.left.side = 'left';
    node.side = 'right';
    
    return leftChild;
}

// Xác định loại mất cân bằng và thực hiện rotation
function performRotation(node, parent, rotationType) {
    let newNode;
    
    switch(rotationType) {
        case 'LL': // Right rotation
            newNode = rightRotate(node, parent);
            break;
        case 'RR': // Left rotation
            newNode = leftRotate(node, parent);
            break;
        case 'LR': // Left-Right rotation
            node.left = leftRotate(node.left, node);
            newNode = rightRotate(node, parent);
            break;
        case 'RL': // Right-Left rotation
            node.right = rightRotate(node.right, node);
            newNode = leftRotate(node, parent);
            break;
    }
    
    return newNode;
}

// Xác định loại rotation cần thiết
function getRotationType(node) {
    const bf = getBalanceFactor(node);
    
    if (bf > 1) {
        // Left heavy
        const leftBf = getBalanceFactor(node.left);
        if (leftBf >= 0) {
            return 'LL'; // Left-Left case
        } else {
            return 'LR'; // Left-Right case
        }
    } else if (bf < -1) {
        // Right heavy
        const rightBf = getBalanceFactor(node.right);
        if (rightBf <= 0) {
            return 'RR'; // Right-Right case
        } else {
            return 'RL'; // Right-Left case
        }
    }
    return null;
}

// Animation cho single rotation (LL hoặc RR)
function animateSingleRotation(targetNode, parent, rotationType, callback) {
    const g = svg.select('#treeGroup');
    const stepDuration = 800;
    
    // Lưu vị trí cũ của TẤT CẢ nodes
    const oldPositions = new Map();
    function savePositions(node) {
        if (!node) return;
        oldPositions.set(node.value, { x: node.x, y: node.y });
        savePositions(node.left);
        savePositions(node.right);
    }
    savePositions(bst.root);
    
    // Highlight các node tham gia rotation
    const affectedNodes = [targetNode];
    if (rotationType === 'LL' && targetNode.left) {
        affectedNodes.push(targetNode.left);
    } else if (rotationType === 'RR' && targetNode.right) {
        affectedNodes.push(targetNode.right);
    }
    
    const validNodes = affectedNodes.filter(n => n != null);
    
    validNodes.forEach(node => {
        g.selectAll('.node').filter(d => d === node)
            .classed('node-current', true);
    });
    
    showResultMessage(`<strong>Xoay ${rotationType}:</strong> ${rotationType === 'LL' ? 'Xoay phải' : 'Xoay trái'}<br>` +
                     `Node gốc: ${targetNode.value}` +
                     (validNodes.length > 1 ? `<br>Node con: ${validNodes[1].value}` : ''));
    
    const timeout1 = setTimeout(() => {
        // Xóa hết các cạnh liên quan đến nodes tham gia xoay
        g.selectAll('.link')
            .filter(function(d) {
                return validNodes.includes(d.source) || validNodes.includes(d.target);
            })
            .transition()
            .duration(300)
            .style('opacity', 0)
            .remove();
        
        const timeout2 = setTimeout(() => {
            // Thực hiện rotation
            const newNode = performRotation(targetNode, parent, rotationType);
            
            if (parent === null) {
                bst.root = newNode;
                newNode.side = null;
            } else {
                if (parent.left === targetNode) {
                    parent.left = newNode;
                    newNode.side = 'left';
                } else {
                    parent.right = newNode;
                    newNode.side = 'right';
                }
            }
            
            updateTree(false);
            
            // Animate nodes di chuyển
            const timeout3 = setTimeout(() => {
                let animationCount = 0;
                let completedCount = 0;
                
                validNodes.forEach(node => {
                    if (node && oldPositions.has(node.value)) {
                        const old = oldPositions.get(node.value);
                        const newPos = { x: node.x, y: node.y };
                        
                        if (!old || isNaN(old.x) || isNaN(old.y) || isNaN(newPos.x) || isNaN(newPos.y)) {
                            return;
                        }
                        
                        const distance = Math.sqrt(Math.pow(newPos.x - old.x, 2) + Math.pow(newPos.y - old.y, 2));
                        
                        if (distance < 1) {
                            return;
                        }
                        
                        animationCount++;
                        
                        const centerX = (old.x + newPos.x) / 2;
                        const centerY = (old.y + newPos.y) / 2;
                        const arcHeight = Math.min(distance * 0.5, 100);
                        
                        const dx = newPos.x - old.x;
                        const dy = newPos.y - old.y;
                        const perpX = -dy / distance;
                        const perpY = dx / distance;
                        
                        const controlX = centerX + perpX * arcHeight;
                        const controlY = centerY + perpY * arcHeight;
                        
                        g.selectAll('.node')
                            .filter(d => d === node)
                            .transition()
                            .duration(stepDuration * 1.5)
                            .ease(d3.easeCubicInOut)
                            .attrTween('transform', function() {
                                return function(t) {
                                    const x = Math.pow(1-t, 2) * old.x + 
                                             2 * (1-t) * t * controlX + 
                                             Math.pow(t, 2) * newPos.x;
                                    const y = Math.pow(1-t, 2) * old.y + 
                                             2 * (1-t) * t * controlY + 
                                             Math.pow(t, 2) * newPos.y;
                                    
                                    return `translate(${x},${y})`;
                                };
                            })
                            .on('end', function() {
                                completedCount++;
                                if (completedCount === animationCount) {
                                    // TẤT CẢ animation nodes xong, giờ mới vẽ lại edges
                                    createEdgesAfterRotation();
                                }
                            });
                    }
                });
                
                // Animate subtrees
                function animateSubtree(node) {
                    if (!node || validNodes.includes(node)) return;
                    
                    if (oldPositions.has(node.value)) {
                        const old = oldPositions.get(node.value);
                        const newPos = { x: node.x, y: node.y };
                        
                        if (!old || !newPos || isNaN(old.x) || isNaN(old.y) || isNaN(newPos.x) || isNaN(newPos.y)) {
                            animateSubtree(node.left);
                            animateSubtree(node.right);
                            return;
                        }
                        
                        if (old.x !== newPos.x || old.y !== newPos.y) {
                            g.selectAll('.node')
                                .filter(d => d === node)
                                .transition()
                                .duration(stepDuration * 1.5)
                                .ease(d3.easeCubicInOut)
                                .attr('transform', `translate(${newPos.x},${newPos.y})`);
                        }
                    }
                    
                    animateSubtree(node.left);
                    animateSubtree(node.right);
                }
                animateSubtree(bst.root);
                
                // Nếu không có animation nào (edge case), vẫn cần tạo edges
                if (animationCount === 0) {
                    createEdgesAfterRotation();
                }
                
                // Function để tạo lại edges sau khi animation xong
                function createEdgesAfterRotation() {
                    // Update lại tree để vẽ lại edges
                    updateTree(false);
                    
                    // Fade in các edges mới
                    g.selectAll('.link')
                        .style('opacity', 0)
                        .transition()
                        .duration(400)
                        .style('opacity', 1);
                    
                    setTimeout(() => {
                        g.selectAll('.node-current').classed('node-current', false);
                        
                        if (callback) callback(newNode);
                    }, 500);
                }
            }, 100);
        activeTimeouts.push(timeout3);
        }, 500);
        activeTimeouts.push(timeout2);
    }, 500);
    activeTimeouts.push(timeout1);
}

// Animation xoay để học cách hoạt động của AVL rotation
function animateRotation(targetNode, parent, rotationType, callback) {
    // Kiểm tra targetNode
    if (!targetNode) {
        if (callback) callback(null);
        return;
    }
    
    // Nếu là LR hoặc RL, thực hiện 2 lần xoay riêng biệt
    if (rotationType === 'LR') {
        showResultMessage(`<strong>Xoay kép LR:</strong> Cần 2 bước xoay<br>` +
                         `Node gốc: ${targetNode.value}<br>` +
                         `Bước 1: Xoay trái ở node con ${targetNode.left.value}<br>` +
                         `Bước 2: Xoay phải ở node gốc ${targetNode.value}`);
        
        // Bước 1: Left rotation ở left child
        const timeoutLR1 = setTimeout(() => {
            const leftChild = targetNode.left;
            animateSingleRotation(leftChild, targetNode, 'RR', (newLeftChild) => {
                // Bước 2: Right rotation ở parent
                const timeoutLR2 = setTimeout(() => {
                    animateSingleRotation(targetNode, parent, 'LL', callback);
                }, 1000);
                activeTimeouts.push(timeoutLR2);
            });
        }, 1500);
        activeTimeouts.push(timeoutLR1);
        return;
    }
    
    if (rotationType === 'RL') {
        showResultMessage(`<strong>Xoay kép RL:</strong> Cần 2 bước xoay<br>` +
                         `Node gốc: ${targetNode.value}<br>` +
                         `Bước 1: Xoay phải ở node con ${targetNode.right.value}<br>` +
                         `Bước 2: Xoay trái ở node gốc ${targetNode.value}`);
        
        // Bước 1: Right rotation ở right child
        const timeoutRL1 = setTimeout(() => {
            const rightChild = targetNode.right;
            animateSingleRotation(rightChild, targetNode, 'LL', (newRightChild) => {
                // Bước 2: Left rotation ở parent
                const timeoutRL2 = setTimeout(() => {
                    animateSingleRotation(targetNode, parent, 'RR', callback);
                }, 1000);
                activeTimeouts.push(timeoutRL2);
            });
        }, 1500);
        activeTimeouts.push(timeoutRL1);
        return;
    }
    
    // Nếu là LL hoặc RR, thực hiện xoay đơn
    animateSingleRotation(targetNode, parent, rotationType, callback);
}

// Animation xoay cũ (deprecated, giữ lại để tránh lỗi)
// Cân bằng cây với animation xoay từng bước
async function balanceTree() {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    clearHighlight();
    showAlgorithm('balance');
    
    if (!bst.root) return;
    
    // Tìm các node mất cân bằng
    const unbalancedNodes = findUnbalancedNodes(bst.root);
    
    if (unbalancedNodes.length === 0) {
        showResult('✅ Cây đã cân bằng\nKhông có node nào mất cân bằng');
        return;
    }
    
    // Tìm đường đi từ root đến node mất cân bằng đầu tiên
    const targetNode = unbalancedNodes[0].node;
    const path = findPathToNodeDirect(targetNode);
    
    // Tạo snapshot system cho balance
    animationState.balanceTreeBefore = cloneTreeStructure(bst.root);
    animationState.balanceTreeAfter = null;
    animationState.balanceHighlights = [];
    animationState.balanceAlgorithmLines = [];
    animationState.balanceResultTexts = [];
    animationState.balanceSnapshots = []; // Array chứa toàn bộ tree snapshots
    
    const rotationType = getRotationType(targetNode);
    const bf = unbalancedNodes[0].balanceFactor;
    
    // Tạo tất cả snapshots TRƯỚC KHI animation bắt đầu
    // 1. Snapshots cho các bước tìm kiếm node mất cân bằng
    for (let i = 0; i < path.length; i++) {
        const currentBf = getBalanceFactor(path[i]);
        const isUnbalanced = Math.abs(currentBf) > 1;
        
        // Bước 1: Kiểm tra node và tính độ lệch
        animationState.balanceSnapshots.push({
            tree: cloneTreeStructure(bst.root),
            resultText: `📍 Kiểm tra node ${path[i].value}\nĐộ lệch: ${currentBf}`,
            algoLines: [0, 1],
            nodeHighlight: path[i]
        });
        
        // Bước 2: Nếu mất cân bằng, highlight dòng if tương ứng
        if (isUnbalanced) {
            animationState.balanceSnapshots.push({
                tree: cloneTreeStructure(bst.root),
                resultText: `⚠️ Phát hiện mất cân bằng!\nNode ${path[i].value} (Độ lệch: ${currentBf})`,
                algoLines: currentBf > 1 ? [2] : [4],
                nodeHighlight: path[i],
                hideArrow: true // Ẩn mũi tên khi đã tìm thấy node mất cân bằng
            });
        }
    }
    
    // 2. Xác định loại xoay - highlight dòng rotate cụ thể
    // Lấy thông tin chi tiết về cấu trúc sẽ xoay
    let childNode = null;
    let grandchildNode = null;
    if (rotationType === 'LL') {
        childNode = targetNode.left;
        grandchildNode = childNode ? childNode.left : null;
    } else if (rotationType === 'RR') {
        childNode = targetNode.right;
        grandchildNode = childNode ? childNode.right : null;
    } else if (rotationType === 'LR') {
        childNode = targetNode.left;
        grandchildNode = childNode ? childNode.right : null;
    } else if (rotationType === 'RL') {
        childNode = targetNode.right;
        grandchildNode = childNode ? childNode.left : null;
    }
    
    // Giải thích chi tiết về loại xoay
    let rotationExplanation = '';
    if (rotationType === 'LL') {
        rotationExplanation = `Cây lệch trái (độ lệch: ${bf} > 1)\nCon trái nặng → Xoay phải`;
    } else if (rotationType === 'RR') {
        rotationExplanation = `Cây lệch phải (độ lệch: ${bf} < -1)\nCon phải nặng → Xoay trái`;
    } else if (rotationType === 'LR') {
        rotationExplanation = `Cây lệch trái (độ lệch: ${bf} > 1)\nCon phải của trái nặng → Xoay trái-phải`;
    } else if (rotationType === 'RL') {
        rotationExplanation = `Cây lệch phải (độ lệch: ${bf} < -1)\nCon trái của phải nặng → Xoay phải-trái`;
    }
    
    animationState.balanceSnapshots.push({
        tree: cloneTreeStructure(bst.root),
        resultText: `🔍 Xác định loại xoay\n${rotationExplanation}`,
        algoLines: bf > 1 ? [3] : [5],
        nodeHighlight: targetNode,
        hideArrow: true
    });
    
    // 3. Chuẩn bị xoay - highlight dòng rotate tương ứng
    const childValue = childNode ? childNode.value : '?';
    const grandchildValue = grandchildNode ? grandchildNode.value : '?';
    animationState.balanceSnapshots.push({
        tree: cloneTreeStructure(bst.root),
        resultText: `🔧 Chuẩn bị xoay ${rotationType}\nNode gốc: ${targetNode.value}\nCon: ${childValue}\nCháu: ${grandchildValue}`,
        algoLines: bf > 1 ? [3] : [5],
        nodeHighlight: targetNode,
        hideArrow: true
    });
    
    // 4. Thực hiện xoay thật
    let parent = null;
    let current = bst.root;
    while (current && current !== targetNode) {
        parent = current;
        if (targetNode.value < current.value) {
            current = current.left;
        } else {
            current = current.right;
        }
    }
    
    // Với LR/RL, thực hiện xoay 2 lần và tạo snapshot cho mỗi lần
    let newNode;
    if (rotationType === 'LR') {
        // Bước 1: Xoay trái node con trái
        animationState.balanceSnapshots.push({
            tree: cloneTreeStructure(bst.root),
            resultText: `⏳ Xoay trái con trái\n${childValue} → ${grandchildValue}`,
            algoLines: [3],
            nodeHighlight: childNode,
            isRotationStep: true, // Đánh dấu step xoay
            hideArrow: true
        });
        
        targetNode.left = leftRotate(targetNode.left, targetNode);
        updateTree();
        
        const afterFirstRotateIndex = animationState.balanceSnapshots.length;
        animationState.balanceSnapshots.push({
            tree: cloneTreeStructure(bst.root),
            resultText: `✓ Hoàn tất xoay trái\nTiếp tục xoay phải node gốc`,
            algoLines: [3],
            nodeHighlight: targetNode,
            pauseAfter: true, // Đánh dấu cần delay sau step này
            hideArrow: true
        });
        
        // Bước 2: Xoay phải node gốc
        newNode = rightRotate(targetNode, parent);
        
    } else if (rotationType === 'RL') {
        // Bước 1: Xoay phải node con phải
        animationState.balanceSnapshots.push({
            tree: cloneTreeStructure(bst.root),
            resultText: `⏳ Xoay phải con phải\n${childValue} → ${grandchildValue}`,
            algoLines: [5],
            nodeHighlight: childNode,
            isRotationStep: true, // Đánh dấu step xoay
            hideArrow: true
        });
        
        targetNode.right = rightRotate(targetNode.right, targetNode);
        updateTree();
        
        animationState.balanceSnapshots.push({
            tree: cloneTreeStructure(bst.root),
            resultText: `✓ Hoàn tất xoay phải\nTiếp tục xoay trái node gốc`,
            algoLines: [5],
            nodeHighlight: targetNode,
            pauseAfter: true, // Đánh dấu cần delay sau step này
            hideArrow: true
        });
        
        // Bước 2: Xoay trái node gốc
        newNode = leftRotate(targetNode, parent);
        
    } else {
        // LL hoặc RR - xoay đơn
        newNode = performRotation(targetNode, parent, rotationType);
    }
    
    if (parent === null) {
        bst.root = newNode;
    } else if (parent.left === targetNode) {
        parent.left = newNode;
    } else {
        parent.right = newNode;
    }
    updateTree();
    
    // 5. Snapshot đang xoay cuối cùng - highlight dòng rotate tương ứng
    animationState.balanceTreeAfter = cloneTreeStructure(bst.root);
    animationState.balanceSnapshots.push({
        tree: cloneTreeStructure(bst.root),
        resultText: rotationType === 'LR' || rotationType === 'RL' ? 
            `⏳ Đang xoay ${rotationType === 'LR' ? 'phải' : 'trái'} node gốc...\n${targetNode.value} → ${newNode.value}` :
            `⏳ Đang xoay ${rotationType}...\n${targetNode.value} → ${newNode.value}\nRoot mới: ${newNode.value}`,
        algoLines: bf > 1 ? [3] : [5],
        nodeHighlight: newNode,
        isRotationStep: true, // Đánh dấu step xoay
        hideArrow: true
    });
    
    // 6. Snapshot hoàn tất - highlight dòng return
    const newBf = getBalanceFactor(newNode);
    const isBalanced = Math.abs(newBf) <= 1;
    const balanceStatus = isBalanced ? '✔️ Đã cân bằng' : '⚠️ CẦN XOAY THÊM!';
    const warningNote = !isBalanced ? '\n\n⚠️ Cây vẫn chưa cân bằng\nCần tiếp tục cân bằng các node khác' : '';
    
    animationState.balanceSnapshots.push({
        tree: cloneTreeStructure(bst.root),
        resultText: `✅ Xoay ${rotationType} thành công!\n${targetNode.value} → ${newNode.value}\nĐộ lệch mới: ${newBf}\n\n${balanceStatus}${warningNote}`,
        algoLines: [6],
        nodeHighlight: newNode,
        hideArrow: true
    });
    
    // Reset về tree ban đầu để animation bắt đầu
    bst.root = cloneTreeStructure(animationState.balanceTreeBefore);
    updateTree();
    
    // Bây giờ chạy animation qua các snapshots
    animateTraversal(path, null, 'balance');
}

// Tìm node trong tree theo value
function findNodeInTree(root, value) {
    if (!root) return null;
    if (root.value === value) return root;
    
    const leftResult = findNodeInTree(root.left, value);
    if (leftResult) return leftResult;
    
    return findNodeInTree(root.right, value);
}

// Tìm đường đi trực tiếp đến một node cụ thể
function findPathToNodeDirect(targetNode) {
    const path = [];
    
    function findPath(node) {
        if (!node) return false;
        
        path.push(node);
        
        if (node === targetNode) return true;
        
        if (findPath(node.left) || findPath(node.right)) {
            return true;
        }
        
        path.pop();
        return false;
    }
    
    findPath(bst.root);
    return path;
}

// Duyệt cây
// Tạo đường đi đầy đủ cho traversal (bao gồm cả việc đi lên và đi xuống)
// Tạo traversal path với metadata về position
const createTraversalPath = (node, type, position = 'root') => {
    if (!node) return [];
    
    const path = [];
    
    if (type === 'preorder') {
        path.push({ node, position }); // Visit node first
        path.push(...createTraversalPath(node.left, type, 'left'));
        path.push(...createTraversalPath(node.right, type, 'right'));
    } else if (type === 'inorder') {
        path.push(...createTraversalPath(node.left, type, 'left'));
        path.push({ node, position }); // Visit node middle
        path.push(...createTraversalPath(node.right, type, 'right'));
    } else if (type === 'postorder') {
        path.push(...createTraversalPath(node.left, type, 'left'));
        path.push(...createTraversalPath(node.right, type, 'right'));
        path.push({ node, position }); // Visit node last
    }
    
    return path;
};

async function traverseTree(type) {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    clearHighlight(); // Xóa highlight cũ
    
    // Ẩn stats panel
    const statsPanel = document.getElementById('statsPanel');
    if (!statsPanel.classList.contains('collapsed')) {
        statsPanel.classList.add('collapsed');
    }
    
    showAlgorithm(type); // Hiển thị thuật toán
    
    // Tạo path với metadata về position
    const traversalPath = createTraversalPath(bst.root, type);
    const traversalNodes = traversalPath.map(item => item.node);
    
    // Thực hiện animation duyệt cây - chỉ highlight các node thực sự được visit
    animateTraversal(traversalPath, () => {
        const resultContent = document.getElementById('resultContent');
        const orderNames = {
            'preorder': 'Pre-order (Gốc-Trái-Phải)',
            'inorder': 'In-order (Trái-Gốc-Phải)',
            'postorder': 'Post-order (Trái-Phải-Gốc)'
        };
        const values = traversalNodes.map(n => n.value).join(' → ');
        resultContent.textContent = `✅ THÀNH CÔNG\n\n📌 Thao tác: Duyệt cây ${orderNames[type]}\n📝 Thứ tự: ${values}\n✔️ Trạng thái: Đã duyệt ${traversalNodes.length} node`;
    }, type, null);
}

// Tìm lower bound
async function findLowerBound() {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    clearHighlight(); // Xóa highlight cũ
    
    // Ẩn stats panel
    const statsPanel = document.getElementById('statsPanel');
    if (!statsPanel.classList.contains('collapsed')) {
        statsPanel.classList.add('collapsed');
    }
    
    const valueInput = document.getElementById('boundValue');
    const value = parseInt(valueInput.value);
    
    showAlgorithm('lowerBound', value); // Hiển thị thuật toán
    
    if (isNaN(value)) {
        return;
    }
    
    if (!bst.root) {
        return;
    }
    
    const { path, result } = findPathToLowerBound(value);
    
    if (result) {
        animateTraversal(path, () => {
            selectedNode = result;
            updateTree();
            
            // Highlight node kết quả
            const g = svg.select('#treeGroup');
            g.selectAll('.node').filter(d => d.value === result.value)
                .classed('node-visited', true);
            
            const resultContent = document.getElementById('resultContent');
            resultContent.textContent = `📌 Tìm Lower Bound (${value})\n✔️ Đã tìm thấy: ${result.value}\n(Giá trị nhỏ nhất >= ${value})`;
        }, 'lowerBound', value);
    } else {
        animateTraversal(path, () => {
            const resultContent = document.getElementById('resultContent');
            resultContent.textContent = `📌 Tìm Lower Bound (${value})\n✖️ Không có giá trị nào >= ${value}`;
        }, 'lowerBound', value);
    }
}

// Tìm upper bound
async function findUpperBound() {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    clearHighlight(); // Xóa highlight cũ
    
    // Ẩn stats panel
    const statsPanel = document.getElementById('statsPanel');
    if (!statsPanel.classList.contains('collapsed')) {
        statsPanel.classList.add('collapsed');
    }
    
    const valueInput = document.getElementById('boundValue');
    const value = parseInt(valueInput.value);
    
    showAlgorithm('upperBound', value); // Hiển thị thuật toán
    
    if (isNaN(value)) {
        return;
    }
    
    if (!bst.root) {
        return;
    }
    
    const { path, result } = findPathToUpperBound(value);
    
    if (result) {
        animateTraversal(path, () => {
            selectedNode = result;
            updateTree();
            
            // Highlight node kết quả
            const g = svg.select('#treeGroup');
            g.selectAll('.node').filter(d => d.value === result.value)
                .classed('node-visited', true);
            
            const resultContent = document.getElementById('resultContent');
            resultContent.textContent = `📌 Tìm Upper Bound (${value})\n✔️ Đã tìm thấy: ${result.value}\n(Giá trị nhỏ nhất > ${value})`;
        }, 'upperBound', value);
    } else {
        animateTraversal(path, () => {
            const resultContent = document.getElementById('resultContent');
            resultContent.textContent = `📌 Tìm Upper Bound (${value})\n✖️ Không có giá trị nào > ${value}`;
        }, 'upperBound', value);
    }
}

// Tìm Min và Max
async function findMin() {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    clearHighlight(); // Xóa highlight cũ
    
    // Ẩn stats panel
    const statsPanel = document.getElementById('statsPanel');
    if (!statsPanel.classList.contains('collapsed')) {
        statsPanel.classList.add('collapsed');
    }
    
    showAlgorithm('findMin');
    
    if (!bst.root) {
        return;
    }
    
    const minNode = bst.findMin();
    const minPath = findPathToMin();
    
    if (minNode) {
        animateTraversal(minPath, () => {
            const g = svg.select('#treeGroup');
            g.selectAll('.node').filter(d => d === minNode)
                .classed('node-visited', true);
            
            const resultContent = document.getElementById('resultContent');
            resultContent.textContent = `📌 Tìm giá trị nhỏ nhất\n✔️ Đã tìm thấy: ${minNode.value}`;
        }, 'findMin', null);
    }
}

async function findMax() {
    // Reset animation cũ nếu đang chạy
    if (isAnimating || animationState.totalSteps > 0) {
        await jumpToEndAndReset();
    }
    
    clearHighlight(); // Xóa highlight cũ
    
    // Ẩn stats panel
    const statsPanel = document.getElementById('statsPanel');
    if (!statsPanel.classList.contains('collapsed')) {
        statsPanel.classList.add('collapsed');
    }
    
    showAlgorithm('findMax');
    
    if (!bst.root) {
        return;
    }
    
    const maxNode = bst.findMax();
    const maxPath = findPathToMax();
    
    if (maxNode) {
        animateTraversal(maxPath, () => {
            const g = svg.select('#treeGroup');
            g.selectAll('.node').filter(d => d === maxNode)
                .classed('node-visited', true);
            
            const resultContent = document.getElementById('resultContent');
            resultContent.textContent = `📌 Tìm giá trị lớn nhất\n✔️ Đã tìm thấy: ${maxNode.value}`;
        }, 'findMax', null);
    }
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
    
    const appHeader = document.getElementById('appHeader');
    const controlBar = document.getElementById('controlBar');
    const showControlsContainer = document.getElementById('showControlsContainer');
    const toggleIcon = document.getElementById('toggleIcon');
    
    appHeader.classList.toggle('collapsed');
    controlBar.classList.toggle('collapsed');
    showControlsContainer.classList.toggle('visible');
    
    if (controlBar.classList.contains('collapsed')) {
        toggleIcon.textContent = '▼'; // Mũi tên xuống
    } else {
        toggleIcon.textContent = '▲'; // Mũi tên lên
    }
}

// Toggle Result Panel
function toggleResultPanel() {
    const panel = document.getElementById('resultPanel');
    const isCurrentlyCollapsed = panel.classList.contains('collapsed');
    
    panel.classList.toggle('collapsed');
    
    // Nếu đang mở và sắp đóng, set inline style để ẩn
    if (!isCurrentlyCollapsed) {
        panel.style.right = '-450px';
    } else {
        // Nếu đang đóng và sắp mở, xóa inline style để CSS class hoạt động
        panel.style.right = '';
    }
    
    setTimeout(() => updateResultPanelPosition(), 50);
}

// Show Result
function showResult(message) {
    const resultContent = document.getElementById('resultContent');
    const resultPanel = document.getElementById('resultPanel');
    
    resultContent.textContent = message;
    resultPanel.classList.remove('collapsed');
}

// Toggle Algorithm Panel
function toggleAlgorithmPanel() {
    const panel = document.getElementById('algorithmPanel');
    const resultPanel = document.getElementById('resultPanel');
    const isCollapsing = !panel.classList.contains('collapsed');
    
    panel.classList.toggle('collapsed');
    
    // Nếu đang ẩn algorithm panel và result panel đang mở thì ẩn result panel
    if (isCollapsing && resultPanel && !resultPanel.classList.contains('collapsed')) {
        toggleResultPanel();
    }
    
    // Cập nhật vị trí result panel sau khi toggle
    setTimeout(() => updateResultPanelPosition(), 350);
}

// Toggle Stats Panel
function toggleStatsPanel() {
    const panel = document.getElementById('statsPanel');
    panel.classList.toggle('collapsed');
}

// Cập nhật bảng thông tin
function updateInfoPanel() {
    const nodeCount = bst.countNodes();
    const treeHeight = bst.getHeight();
    
    document.getElementById('nodeCountDisplay').textContent = nodeCount;
    document.getElementById('treeHeight').textContent = treeHeight;
    document.getElementById('selectedValue').textContent = selectedNode ? selectedNode.value : '-';
    
    const balanceStatus = document.getElementById('balanceStatus');
    if (bst.isValidBST()) {
        const balanceFactor = bst.getBalanceFactor();
        const balancePercent = Math.round(balanceFactor * 100);
        balanceStatus.textContent = `✓ ${balancePercent}%`;
        balanceStatus.style.color = balanceFactor > 0.7 ? '#4cc9f0' : '#f8961e';
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

// Animation Control Functions
function showControlBar() {
    const controlBar = document.getElementById('animationControlBar');
    controlBar.classList.add('active');
    animationState.isActive = true;
}

function hideControlBar() {
    const controlBar = document.getElementById('animationControlBar');
    controlBar.classList.remove('active');
    animationState.isActive = false;
}

function updateControlBar() {
    const stepIndicator = document.getElementById('stepIndicator');
    const timelineSlider = document.getElementById('timelineSlider');
    const timeDisplay = document.getElementById('timeDisplay');
    
    // Giới hạn hiển thị không vượt quá totalSteps
    const displayStep = Math.min(animationState.currentStep + 1, animationState.totalSteps);
    stepIndicator.textContent = `${displayStep}/${animationState.totalSteps}`;
    timelineSlider.value = animationState.currentStep;
    timelineSlider.max = animationState.totalSteps - 1;
    
    const currentTime = Math.floor(animationState.currentStep * animationState.animationSpeed / 1000);
    const totalTime = Math.floor(animationState.totalSteps * animationState.animationSpeed / 1000);
    timeDisplay.textContent = `${currentTime}:${String(currentTime % 60).padStart(2, '0')}`;
    
    // Enable/disable buttons
    document.getElementById('prevStepBtn').disabled = animationState.currentStep <= 0;
    document.getElementById('nextStepBtn').disabled = animationState.currentStep >= animationState.totalSteps - 1;
    timelineSlider.disabled = animationState.totalSteps === 0;
}

function togglePlayPause() {
    animationState.isPaused = !animationState.isPaused;
    const icon = document.getElementById('playPauseIcon');
    icon.textContent = animationState.isPaused ? '▶️' : '⏸️';
    
    if (!animationState.isPaused && animationState.currentStep < animationState.totalSteps) {
        resumeAnimation();
    }
}

function prevStep() {
    if (animationState.currentStep > 0) {
        animationState.currentStep--;
        jumpToStep(animationState.currentStep);
    }
}

function nextStep() {
    if (animationState.currentStep < animationState.totalSteps) {
        animationState.currentStep++;
        jumpToStep(animationState.currentStep);
    }
}

async function jumpToStep(step, skipPause = false) {
    animationState.currentStep = step;
    if (!skipPause) {
        animationState.isPaused = true;
        document.getElementById('playPauseIcon').textContent = '▶️';
    }
    
    // Tính nodeIndex và subStep từ step
    const nodeIndex = Math.floor(step / animationState.subStepsPerNode);
    const currentSubStep = step % animationState.subStepsPerNode;
    
    // Xử lý insert node: chỉ ẩn/hiện node, không insert/delete thật
    const isInsertAlgo = animationState.algorithmType === 'insert';
    const isAtFinalStep = step >= animationState.totalSteps - 1;
    const hasPendingInsert = animationState.pendingInsertValue !== undefined;
    
    if (isInsertAlgo && hasPendingInsert && !animationState.nodeExistsBeforeInsert) {
        const nodeToInsert = bst.find(animationState.pendingInsertValue);
        
        if (isAtFinalStep && nodeToInsert && nodeToInsert.hidden) {
            // Ở step cuối và node đang ẩn: hiện node
            nodeToInsert.hidden = false;
            animationState.insertedNodeValue = animationState.pendingInsertValue;
            updateTree();
        } else if (!isAtFinalStep && nodeToInsert && !nodeToInsert.hidden) {
            // Không phải step cuối và node đang hiện: ẩn node
            nodeToInsert.hidden = true;
            animationState.insertedNodeValue = undefined;
            updateTree();
        }
    }
    
    // Xử lý delete - rebuild cây từ snapshot
    const isDeleteAlgo = animationState.algorithmType === 'delete';
    const hasPendingDelete = animationState.pendingDeleteValue !== undefined;
    let snapshotRestored = false;
    
    if (isDeleteAlgo && hasPendingDelete && animationState.deleteTreeBeforeDelete && animationState.deleteHighlights.length > 0) {
        // Sử dụng tree snapshot + highlights tối ưu
        // totalSteps = path.length * 2 + 1 (thêm 1 step cuối cho callback)
        // Snapshots: ban đầu + sau mỗi substep + sau callback = totalSteps + 1
        
        let highlightIndex;
        if (step >= animationState.totalSteps - 1) {
            // Step cuối: dùng snapshot cuối cùng (sau callback)
            highlightIndex = animationState.deleteHighlights.length - 1;
        } else {
            // Các step trước: map theo step
            highlightIndex = Math.min(step, animationState.deleteHighlights.length - 1);
        }
        
        console.log('jumpToStep:', {
            step,
            totalSteps: animationState.totalSteps,
            highlightIndex,
            highlightsLength: animationState.deleteHighlights.length,
            algorithmLinesLength: animationState.deleteAlgorithmLines.length,
            resultTextsLength: animationState.deleteResultTexts.length,
            resultText: animationState.deleteResultTexts[highlightIndex]
        });
        
        // Xác định tree nào được dùng
        if (step >= animationState.totalSteps - 1 && animationState.deleteTreeAfterDelete) {
            // Step cuối: dùng tree sau khi delete
            bst.root = cloneTreeStructure(animationState.deleteTreeAfterDelete);
            animationState.deletedNode = animationState.pendingDeleteValue;
        } else {
            // Các step trước: dùng tree ban đầu
            bst.root = cloneTreeStructure(animationState.deleteTreeBeforeDelete);
            animationState.deletedNode = null;
        }
        
        updateTree();
        
        // Áp dụng highlights tương ứng - đợi để đảm bảo updateTree hoàn tất
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (highlightIndex >= 0 && highlightIndex < animationState.deleteHighlights.length) {
            applyHighlightState(animationState.deleteHighlights[highlightIndex]);
        }
        
        // Restore algorithm highlights
        if (highlightIndex >= 0 && highlightIndex < animationState.deleteAlgorithmLines.length) {
            applyAlgorithmHighlights(animationState.deleteAlgorithmLines[highlightIndex]);
        }
        
        // Restore result content
        if (highlightIndex >= 0 && highlightIndex < animationState.deleteResultTexts.length) {
            const resultContent = document.getElementById('resultContent');
            if (resultContent) {
                resultContent.textContent = animationState.deleteResultTexts[highlightIndex];
                console.log('Restored result:', animationState.deleteResultTexts[highlightIndex]);
            }
        }
        
        snapshotRestored = true;
    }
    
    // Xử lý balance - rebuild cây từ snapshot
    const isBalanceAlgo = animationState.algorithmType === 'balance';
    
    if (isBalanceAlgo && animationState.balanceSnapshots && animationState.balanceSnapshots.length > 0) {
        // Trực tiếp dùng step làm index vào snapshot array
        const snapshotIndex = step;
        const snapshot = animationState.balanceSnapshots[Math.min(snapshotIndex, animationState.balanceSnapshots.length - 1)];
        
        if (snapshot) {
            // Restore tree
            bst.root = cloneTreeStructure(snapshot.tree);
            updateTree();
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Clear highlights
            const g = svg.select('#treeGroup');
            g.selectAll('.node-visited').classed('node-visited', false);
            g.selectAll('.node-current').classed('node-current', false);
            
            // Highlight node
            if (snapshot.nodeHighlight) {
                g.selectAll('.node').filter(d => d.value === snapshot.nodeHighlight.value)
                    .classed('node-current', true);
            }
            
            // Restore algorithm highlights
            if (snapshot.algoLines) {
                highlightAlgorithmLine(snapshot.algoLines);
            }
            
            // Restore result content
            const resultContent = document.getElementById('resultContent');
            if (resultContent && snapshot.resultText) {
                resultContent.textContent = snapshot.resultText;
            }
            
            snapshotRestored = true;
        }
    }
    
    // Clear current node/link highlights (but NOT code highlights)
    // Chỉ clear nếu KHÔNG phải delete hoặc chưa restore snapshot
    const g = svg.select('#treeGroup');
    if (!snapshotRestored) {
        g.selectAll('.node-visited').classed('node-visited', false);
        g.selectAll('.node-current').classed('node-current', false);
        g.selectAll('.link-visited').classed('link-visited', false);
        g.selectAll('.link-current').classed('link-current', false);
    }
    
    // Với 1 substep per node, arrow luôn ở vị trí node
    const shouldMoveArrow = true;
    
    // Highlight all COMPLETED nodes (nodes where arrow has moved past)
    const hasNodeInfo = animationState.path[0] && typeof animationState.path[0] === 'object' && animationState.path[0].node !== undefined;
    
    // Với insert: chỉ highlight 1 node duy nhất (node hiện tại hoặc node mới)
    // Với search/traversal: highlight tất cả nodes đã qua
    const isInsert = animationState.algorithmType === 'insert';
    
    // Nếu đã restore snapshot (delete), bỏ qua việc re-highlight
    if (!isInsert && !snapshotRestored) {
        // Logic cũ cho search/traversal: highlight tất cả nodes đã qua
        const completedNodeIndex = shouldMoveArrow ? nodeIndex - 1 : nodeIndex - 1;
        
        for (let i = 0; i <= completedNodeIndex && i < animationState.path.length; i++) {
            const currentItem = animationState.path[i];
            const currentNode = hasNodeInfo ? currentItem.node : currentItem;
            const isVisited = hasNodeInfo ? currentItem.visited : false;
            
            // Chỉ đánh dấu node-visited nếu đây là node thực sự được visit
            if (!hasNodeInfo || isVisited) {
                g.selectAll('.node').filter(d => d === currentNode)
                    .classed('node-visited', true);
            }
            
            // Highlight edge từ parent đến node này
            if (i > 0) {
                const parentItem = animationState.path[i - 1];
                const parentNode = hasNodeInfo ? parentItem.node : parentItem;
                
                const isTraversal = animationState.algorithmType === 'preorder' || 
                                  animationState.algorithmType === 'inorder' || 
                                  animationState.algorithmType === 'postorder';
                
                if (!isTraversal) {
                    g.selectAll('.link')
                        .filter(d => 
                            (d.source === parentNode && d.target === currentNode) ||
                            (d.source === currentNode && d.target === parentNode)
                        )
                        .classed('link-visited', true);
                }
            }
        }
    }
    
    // Ensure algorithm and result panels are visible
    const algorithmPanel = document.getElementById('algorithmPanel');
    const resultPanel = document.getElementById('resultPanel');
    if (algorithmPanel && algorithmPanel.classList.contains('collapsed')) {
        algorithmPanel.classList.remove('collapsed');
    }
    if (resultPanel && resultPanel.classList.contains('collapsed')) {
        resultPanel.classList.remove('collapsed');
    }
    
    // Highlight current node and code line (bỏ qua nếu đã restore snapshot)
    if (nodeIndex < animationState.path.length && !snapshotRestored) {
        const currentItem = animationState.path[nodeIndex];
        const currentNode = hasNodeInfo ? currentItem.node : currentItem;
        
        // Kiểm tra xem có phải đang ở bước tạo node mới không
        // Bước tạo node mới là khi: đã insert xong (có insertedNodeValue) VÀ đang ở step cuối cùng (currentStep = totalSteps - 1)
        const isCreatingNewNode = isInsert && animationState.insertedNodeValue && 
                                 animationState.currentStep >= animationState.totalSteps - 1;
        
        // Nếu arrow đã di chuyển đến node này, mark as current
        if (shouldMoveArrow && !isCreatingNewNode) {
            // Với insert: chỉ highlight node hiện tại màu vàng (visited)
            if (isInsert) {
                g.selectAll('.node').filter(d => d === currentNode)
                    .classed('node-visited', true);
            } else {
                // Với search/traversal: highlight màu đỏ (current)
                g.selectAll('.node').filter(d => d === currentNode)
                    .classed('node-current', true);
            }
            
            // Highlight link-current đến node này
            if (nodeIndex > 0) {
                const prevItem = animationState.path[nodeIndex - 1];
                const prevNode = hasNodeInfo ? prevItem.node : prevItem;
                
                const isTraversal = animationState.algorithmType === 'preorder' || 
                                  animationState.algorithmType === 'inorder' || 
                                  animationState.algorithmType === 'postorder';
                
                if (!isTraversal) {
                    g.selectAll('.link')
                        .filter(d => 
                            (d.source === prevNode && d.target === currentNode) ||
                            (d.source === currentNode && d.target === prevNode)
                        )
                        .classed('link-visited', true);
                }
            }
        }
        
        // Move arrow to current node (trên đầu node) - luôn luôn hiển thị arrow tại node đang xử lý
        // Không di chuyển arrow nếu currentNode là null (trường hợp search/insert thất bại)
        if (animationState.arrow && shouldMoveArrow && currentNode) {
            animationState.arrow
                .attr('transform', `translate(${currentNode.x},${currentNode.y - 35}) rotate(180)`);
        }
        
        // Highlight code line and update result - hỗ trợ cả null node
        if (animationState.algorithmType) {
            // Highlight code line tương ứng với substep hiện tại
            highlightCodeLine(animationState.algorithmType, nodeIndex, currentNode, animationState.searchValue, animationState.path, currentSubStep);
        }
        
        // Nếu là insert, ở step cuối và node đã được insert, highlight node mới
        if (animationState.algorithmType === 'insert' && animationState.insertedNodeValue && 
            animationState.currentStep >= animationState.totalSteps - 1 &&
            bst.find(animationState.insertedNodeValue)) {
            // Xóa highlight node cuối cũ
            g.selectAll('.node-visited').classed('node-visited', false);
            g.selectAll('.node-current').classed('node-current', false);
            
            // Chỉ highlight node mới màu vàng
            g.selectAll('.node').filter(d => d.value === animationState.insertedNodeValue)
                .classed('node-visited', true);
            
            // Highlight edge đến node mới
            if (animationState.path.length >= 1) {
                const parentNode = animationState.path[animationState.path.length - 1];
                g.selectAll('.link')
                    .filter(d => d.source === parentNode && d.target.value === animationState.insertedNodeValue)
                    .classed('link-visited', true);
            }
        }
        
        // Nếu ở substep 1, cần highlight cạnh đến node tiếp theo
        if (currentSubStep === 1 && nodeIndex < animationState.path.length - 1) {
            const nextItem = animationState.path[nodeIndex + 1];
            const nextNode = hasNodeInfo ? nextItem.node : nextItem;
            
            const isTraversal = animationState.algorithmType === 'preorder' || 
                              animationState.algorithmType === 'inorder' || 
                              animationState.algorithmType === 'postorder';
            
            if (!isTraversal) {
                g.selectAll('.link')
                    .filter(d => 
                        (d.source === currentNode && d.target === nextNode) ||
                        (d.source === nextNode && d.target === currentNode)
                    )
                    .classed('link-current', true)
                    .classed('link-visited', true);
            }
        }
    }
    
    updateControlBar();
}

function resumeAnimation() {
    if (animationState.currentStep >= animationState.totalSteps - 1) {
        // Đã ở cuối, không thể resume
        return;
    }
    
    // Continue from current step
    animationState.isPaused = false;
    
    // Tạo hàm animateNext động để tiếp tục từ bất kỳ step nào
    const continueAnimation = () => {
        if (animationState.isPaused) {
            animationState.timeoutId = setTimeout(continueAnimation, 100);
            return;
        }
        
        if (animationState.currentStep >= animationState.totalSteps - 1) {
            // Kết thúc animation
            if (animationState.arrow) {
                animationState.arrow.transition()
                    .duration(300)
                    .attr('opacity', 0)
                    .remove();
            }
            
            const g = svg.select('#treeGroup');
            g.selectAll('.node-current')
                .classed('node-current', false)
                .classed('node-visited', true);
            g.selectAll('.link-current').classed('link-current', false);
            
            isAnimating = false;
            
            // Chỉ gọi callback nếu chưa insert node (tránh insert lặp khi resume)
            if (animationState.callback && !animationState.insertedNodeValue) {
                animationState.callback();
            }
            return;
        }
        
        // Tăng step và chuyển sang step tiếp theo
        animationState.currentStep++;
        jumpToStep(animationState.currentStep, true); // skipPause = true để không set isPaused = true
        
        // Tiếp tục animation
        animationState.timeoutId = setTimeout(continueAnimation, animationState.animationSpeed);
    };
    
    // Bắt đầu animation
    continueAnimation();
}

function continueFromStep(startStep) {
    // This will be called from animateTraversal when implementing step-by-step
    nextStep();
    if (!animationState.isPaused && animationState.currentStep < animationState.totalSteps) {
        animationState.timeoutId = setTimeout(() => continueFromStep(animationState.currentStep), animationState.animationSpeed);
    }
}

function changeSpeed() {
    const speedSelect = document.getElementById('speedSelect');
    animationState.animationSpeed = parseInt(speedSelect.value);
}

// Timeline slider event
document.getElementById('timelineSlider').addEventListener('input', function(e) {
    const step = parseInt(e.target.value);
    jumpToStep(step);
});

// Khởi chạy
initializeSampleTree();