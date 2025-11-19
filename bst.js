class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor () {
        this.root = null;
    }
    printNLR(Node) {
        if (Node === null) return;
        console.log(Node.value, '->');
        this.printNLR(Node.left);
        this.printNLR(Node.right);
    }
    printLNR(Node) {
        if (Node === null) return;
        this.printLNR(Node.left);
        console.log(Node.value, '->');
        this.printLNR(Node.right);
    }
    printLRN(Node) {
        if (Node === null) return;
        this.printLRN(Node.left);
        this.printLRN(Node.right);
        console.log(Node.value, '->');
    }
    insert (value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        let currentNode = this.root;
        while (true) {
            if (value < currentNode.value) {
                if (!currentNode.left) {
                    currentNode.left = newNode;
                    return;
                }
                currentNode = currentNode.left;
            }
            else {
                if (!currentNode.right) {
                    currentNode.right = newNode;
                    return;
                }
                currentNode = currentNode.right;
            }
        }
    }
    search (value) {
        if (!this.root) return null;
        let currentNode = this.root;
        while (true) {
            console.log(currentNode.value,' ');
            if (currentNode.value === value) return true;
            if (value < currentNode.value) {
                if (!currentNode.left)  return false;
                currentNode = currentNode.left;
            }
            else {
                if (!currentNode.right) return false;
                currentNode = currentNode.right;
            }
        }
    }
    searchMax() {
        if (!this.root) return null;
        let currentNode = this.root;
        while (currentNode.right) {
            console.log(currentNode.value,' ');
            currentNode = currentNode.right;
        }
        return currentNode.value;
    }
    searchMin() {
        if (!this.root) return null;
        let currentNode = this.root;
        while (currentNode.left) {
            console.log(currentNode.value,' ');
            currentNode = currentNode.left;
        }
        return currentNode.value;
    }
}

const bst = new BST();
// bst.insert(10);
// bst.insert(5);
// bst.insert(15);
// bst.insert(3);
// bst.insert(7);

// console.log("Duyệt cây theo Pre-order (NLR):");
// bst.printNLR(bst.root);
// bst.printLNR(bst.root);
// bst.printLRN(bst.root);

// console.log(bst.search(7));