class Node {
    constructor(value) {
        this.value = value
        this.next = null
        this.id = crypto.randomUUID()
    }
}

class LinkedList {
    constructor() {
        this.head = null
        this.tail = null
    }

    addHead(value) {
        const p = new Node(value)
        if (this.head) {
            p.next = this.head
            this.head = p
        } else {
            this.head = this.tail = p
        }

        return p
    }

    addTail(value) {
        const p = new Node(value)

        if (this.head === null) {
            this.head = this.tail = p
        } else {
            this.tail.next = p
            this.tail = p
        }

        return p
    }

    addBefore(node, value) {
        if (node === null) return
        if (node === this.head) return this.addHead(value)

        const preNode = this.searchPreNode(node)
        const p = new Node(value)
        p.next = node
        preNode.next = p
        return p
    }

    addAfter(node, value) {
        if (node === null) return

        let tmp = this.head

        while (tmp !== null && tmp != node) tmp = tmp.next

        if (tmp === null) return

        if (tmp === this.tail) {
            return this.addTail(value)
        }

        let p = new Node(value)

        p.next = tmp.next
        tmp.next = p

        return p
    }

    removeHead() {
        if (this.head === null) return
        else if (this.head === this.tail) this.head = this.tail = null
        else this.head = this.head.next
    }

    removeTail() {
        if (this.head === null) return
        else if (this.head === this.tail) this.head = this.tail = null
        else {
            let tmp = this.head
            while (tmp.next != this.tail) tmp = tmp.next
            this.tail = tmp
            tmp.next = null
        }
    }

    removeNode(node) {
        if (node === this.head) this.removeHead()
        else if (node === this.tail) this.removeTail()
        else {
            let tmp = this.head
            while (tmp.next !== null && tmp.next !== node) tmp = tmp.next
            if (tmp.next === null) return
            tmp.next = node.next
        }
    }

    searchByValue(value) {
        let tmp = this.head
        while (tmp !== null && tmp.value !== value) tmp = tmp.next
        return tmp
    }

    searchPreNode(node) {
        let tmp = this.head
        while (tmp !== null && tmp.next !== node) tmp = tmp.next
        return tmp
    }

    searchByID(id) {
        let tmp = this.head
        while (tmp !== null && tmp.id !== id) tmp = tmp.next
        return tmp
    }

    display() {
        let p = this.head
        while (p !== null) {
            console.log(p.value)
            p = p.next
        }
    }

    clear() {
        while (this.head !== null) this.removeHead()
    }

    size() {
        let n = 0
        let p = this.head
        while (p !== null) {
            n++
            p = p.next
        }
        return n
    }
}

export default new LinkedList()
