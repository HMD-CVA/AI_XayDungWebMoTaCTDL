import list from './linkedList.js'

const area = document.querySelector('.display-area')
const inputValue = document.querySelector('#input-value')
const inputValueModal = document.querySelector('#input-value-modal')
const btnAddHead = document.querySelector('#btn-add-head')
const btnAddTail = document.querySelector('#btn-add-tail')
const btnRemoveHead = document.querySelector('#btn-remove-head')
const btnRemoveTail = document.querySelector('#btn-remove-tail')
const btnRemoveNode = document.querySelector('#btn-remove-node')
const btnAddBefore = document.querySelector('#btn-add-before')
const btnAddAfter = document.querySelector('#btn-add-after')
const busyOverlayElement = document.querySelector('.busy-overlay')
const overlayElement = document.querySelector('.overlay')
const modalElement = document.querySelector('.modal')
const btnClear = document.querySelector('#btn-clear')
const btnCreateRandom = document.querySelector('#btn-create-random')
const overlayCreateRandom = document.querySelector('.overlay-create-random')
const modalCreateRandom = document.querySelector('.modal-create-random')
const numberN = document.querySelector('.number-n')
const btnGo = document.querySelector('#btn-go')

btnAddHead.onclick = () => addNode('addHead')
btnAddTail.onclick = () => addNode('addTail')
btnRemoveHead.onclick = () => removeNode('removeHead')
btnRemoveTail.onclick = () => removeNode('removeTail')
btnAddBefore.onclick = () => {
    {
        const nodeElement = document.querySelector('.node.active')
        const node = list.searchByID(nodeElement.dataset.id)
        addNode('addBefore', node)
    }
}
btnAddAfter.onclick = () => {
    const nodeElement = document.querySelector('.node.active')
    const node = list.searchByID(nodeElement.dataset.id)
    addNode('addAfter', node)
}

// save list to localstorage
function saveList() {
    let values = []
    let tmp = list.head
    while (tmp != null) {
        values.push(tmp.value)
        tmp = tmp.next
    }

    localStorage.setItem('linkedListData', JSON.stringify(values))
}

// load list
function loadList() {
    const data = localStorage.getItem('linkedListData')
    if (data) {
        const values = JSON.parse(data)
        list.clear()
        values.forEach((value) => {
            list.addTail(value)
        })
        renderList()
    }
}

loadList()

// render list
function renderList(timeOutRemoveBlock = 0) {
    area.innerHTML = `
        <div class="head-node">Head</div>
        <div class="arrow">
            <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
            <path d="M566.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L466.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l434.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/>
            </svg>
        </div>
    `

    let tmp = list.head

    while (tmp !== null) {
        const classList = tmp.isNew ? 'node new' : 'node'
        const classArrow =
            tmp.isNew || (tmp.next !== null && tmp.next.isNew)
                ? 'arrow new'
                : 'arrow'

        area.innerHTML += `
            <div class="${classList}" data-id="${tmp.id}" >
                <span class="node-value">${tmp.value}</span>
                <span class="node-next">Next</span>
            </div>
            <div class="${classArrow}">
                <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path d="M566.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L466.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l434.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/>
                </svg>
            </div>
        `

        tmp.isNew = false
        tmp = tmp.next
    }

    area.innerHTML += `<div class="tail-node">Tail</div>`

    // cho class new kịp tồn tại trước khi xóa
    setTimeout(() => {
        document.querySelectorAll('.node.new').forEach((node) => {
            node.classList.remove('new')
        })
    }, 10)

    setTimeout(() => {
        document.querySelectorAll('.arrow.new').forEach((arrow) => {
            arrow.classList.remove('new')
        })
    }, 510)

    setTimeout(() => {
        busyOverlayElement.classList.remove('block')
    }, timeOutRemoveBlock)
}

// handle add node
function addNode(method, node) {
    if (list.size() >= 20) {
        alert('Số node tối đa là 20')
        return
    }

    let value = inputValue.value

    if (document.querySelector('.modal').classList.contains('display'))
        value = inputValueModal.value

    value = value.trim()
    if (value === '') {
        alert('Vui lòng nhập giá trị!')
        inputValue.value = ''
        inputValue.focus()
        return
    }

    if (method === 'addHead') {
        list.addHead(value)
        list.head.isNew = true
    } else if (method === 'addTail') {
        list.addTail(value)
        list.tail.isNew = true
    } else if (method === 'addBefore') {
        const newNode = list.addBefore(node, value)
        newNode.isNew = true
        overlayElement.click()
    } else if (method === 'addAfter') {
        const newNode = list.addAfter(node, value)
        newNode.isNew = true
        overlayElement.click()
    } else {
        alert('Phương thức không hợp lệ!')
        return
    }

    busyOverlayElement.classList.add('block')
    inputValue.value = ''
    inputValue.focus()
    inputValueModal.value = ''
    saveList()
    renderList(1000)
}

// handle remove node
function removeNode(method, node) {
    if (list.head === null) return

    let nodeElement
    const arrowElements = []

    if (method === 'removeHead') {
        nodeElement = document.querySelector('.node')
        list.removeHead()
    } else if (method === 'removeTail') {
        nodeElement = document.querySelector(`.node[data-id="${list.tail.id}"]`)
        list.removeTail()
    } else if (method === 'node') {
        nodeElement = document.querySelector(`.node[data-id="${node.id}"]`)
        list.removeNode(node)
        overlayElement.click()
    } else {
        alert('Phương thức không hợp lệ!')
        return
    }

    if (nodeElement.previousElementSibling)
        arrowElements.push(nodeElement.previousElementSibling)

    if (nodeElement.nextElementSibling)
        arrowElements.push(nodeElement.nextElementSibling)

    busyOverlayElement.classList.add('block')
    inputValue.value = ''
    inputValue.focus()
    saveList()
    if (arrowElements.length !== 0) {
        arrowElements.forEach((element) => {
            element.classList.add('deleting')
        })
        setTimeout(() => {
            nodeElement.classList.add('deleting')
        }, 500)
    } else nodeElement.classList.add('deleting')

    setTimeout(renderList, 1000)
}

// hanlde select node
area.onclick = (e) => {
    const element = e.target.closest('.node')
    if (element) {
        // element là nodeElement
        element.classList.add('active')
        overlayElement.classList.add('active')
        const { x, y } = element.getBoundingClientRect()
        // const { clientWidth } = modalElement

        modalElement.style.left = `${x - 35}px`
        modalElement.style.top = `${y + 60}px`
        modalElement.classList.add('display')

        const node = list.searchByID(element.dataset.id)
        document.querySelector('.node-name').innerText = `Node ${node.value}`

        btnRemoveNode.onclick = () => {
            removeNode('node', node)
        }
    }
}

modalElement.onclick = (event) => {
    event.stopPropagation()
}

// hanlde overlay
overlayElement.onclick = () => {
    if (modalElement.classList.contains('display')) {
        const activeNode = document.querySelector('.node.active')
        activeNode.classList.remove('active')
        overlayElement.classList.remove('active')
        modalElement.classList.remove('display')
    }
}

// clear list
btnClear.onclick = () => {
    if (list === null) return
    const nodeElements = document.querySelectorAll('.node')
    nodeElements.forEach((node) => {
        node.classList.add('clear')
    })
    list.clear()
    saveList()
    setTimeout(renderList, 300)
}

// Create random
btnCreateRandom.onclick = () => {
    const { offsetLeft, offsetHeight } = btnCreateRandom
    modalCreateRandom.style.left = `${offsetLeft + 140}px`
    modalCreateRandom.style.top = `${offsetHeight + 40}px`
    overlayCreateRandom.classList.add('active')
}

modalCreateRandom.onclick = (event) => {
    event.stopPropagation()
}

overlayCreateRandom.onclick = () => {
    if (overlayCreateRandom.classList.contains('active')) {
        overlayCreateRandom.classList.remove('active')
    }
}

function generateRandomIntegers(n) {
    const min = 1
    const max = 100
    const randomNumbers = []

    for (let i = 0; i < n; i++) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
        randomNumbers.push(randomNumber)
    }

    return randomNumbers
}

btnGo.onclick = () => {
    const n = Number(numberN.value)
    if (n < 1 || n > 20) {
        alert('Số lượng node hợp lệ là từ 1 đến 20!')
        return
    }

    const numbersRandom = generateRandomIntegers(n)
    list.clear()
    numbersRandom.forEach((num) => {
        list.addTail(num)
    })
    overlayCreateRandom.click()
    saveList()
    renderList()
}

// chat
