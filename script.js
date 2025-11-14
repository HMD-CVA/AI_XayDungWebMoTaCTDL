class Node {
    constructor(value) {
        this.value = value
        this.next = null
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
    }

    addTail(value) {
        const p = new Node(value)

        if (this.head === null) {
            this.head = this.tail = p
        } else {
            this.tail.next = p
            this.tail = p
        }
    }

    addAfter(node, value) {
        if (node === null) return

        let tmp = this.head

        while (tmp !== null && tmp != node) tmp = tmp.next

        if (tmp === null) return

        if (tmp === this.tail) {
            this.addTail(value)
            return
        }

        let p = new Node(value)

        p.next = tmp.next
        tmp.next = p
    }

    deleteHead() {
        if (this.head === null) return
        else if (this.head === this.tail) this.head = this.tail = null
        else this.head = this.head.next
    }

    deleteTail() {
        if (this.head === null) return
        else if (this.head === this.tail) this.head = this.tail = null
        else {
            let tmp = this.head
            while (tmp.next != this.tail) tmp = tmp.next
            this.tail = tmp
            tmp.next = null
        }
    }

    search(value) {
        let tmp = this.head
        while (tmp !== null && tmp.value !== value) tmp = tmp.next
        return tmp
    }

    searchPre(node) {
        let tmp = this.head
        while (tmp !== null && tmp.next !== node) tmp = tmp.next
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
        while (this.head !== null) this.deleteHead()
    }
}

let list = new LinkedList()

function renderList() {
    const area = document.querySelector('#display-area')

    area.innerHTML = ''

    let tmp = list.head
    while (tmp != null) {
        area.innerHTML += `
            <div class="node">${tmp.value}</div>
        `

        if (tmp.next != null) {
            area.innerHTML += `
                <div class="arrow">--></div>
            `
        }

        tmp = tmp.next
    }
}

const btnAddHead = document.querySelector('#add-head')
const btnAddTail = document.querySelector('#add-tail')
const inputValue = document.querySelector('#input-value')

btnAddHead.onclick = () => addValue('addHead')
btnAddTail.onclick = () => addValue('addTail')

function addValue(method) {
    let value = inputValue.value
    value = value.trim()
    if (value === '') {
        alert('Vui lòng nhập giá trị!')
        inputValue.value = ''
        inputValue.focus()
        return
    }
    if (method === 'addHead') list.addHead(value)
    else if (method === 'addTail') list.addTail(value)
    else {
        alert('Phương thức không hợp lệ!')
        return
    }

    inputValue.value = ''
    renderList()
}
