import list from './linkedList.js'

// Animation speed configuration (milliseconds)
let animationDelay = 500 // Thời gian delay cho animation

// Cập nhật CSS animation duration
function setAnimationSpeed(speed) {
    animationDelay = speed
    document.documentElement.style.setProperty('--animation-duration', `${speed}ms`)
}

// Khởi tạo animation speed
setAnimationSpeed(animationDelay)

const area = document.querySelector('.display-area')
// value input moved into Add modal
const inputValueAdd = document.querySelector('#input-value-add')
const inputValueModal = document.querySelector('#input-value-modal')
const btnAdd = document.querySelector('#btn-add')
const btnRemove = document.querySelector('#btn-remove')
const btnAddHead = document.querySelector('#btn-add-head')
const btnAddTail = document.querySelector('#btn-add-tail')
const btnAddIndex = document.querySelector('#btn-add-index')
const inputAddIndex = document.querySelector('#input-add-index')
const btnRemoveHead = document.querySelector('#btn-remove-head')
const btnRemoveTail = document.querySelector('#btn-remove-tail')
const btnRemoveIndex = document.querySelector('#btn-remove-index')
const inputRemoveIndex = document.querySelector('#input-remove-index')
const btnRemoveNode = document.querySelector('#btn-remove-node')
const btnAddBefore = document.querySelector('#btn-add-before')
const btnAddAfter = document.querySelector('#btn-add-after')
const busyOverlayElement = document.querySelector('.busy-overlay')
const overlayElement = document.querySelector('.overlay')
const modalElement = document.querySelector('.node-modal')
const overlayAdd = document.querySelector('.overlay-add')
const modalAdd = document.querySelector('.modal-add')
const overlayRemove = document.querySelector('.overlay-remove')
const modalRemove = document.querySelector('.modal-remove')
const btnClear = document.querySelector('#btn-clear')
// create random
const btnCreateRandom = document.querySelector('#btn-create-random')
const overlayCreateRandom = document.querySelector('.overlay-create-random')
const modalCreateRandom = document.querySelector('.modal-create-random')
const numberN = document.querySelector('.number-n')
const btnGo = document.querySelector('#btn-go')
// search value
const btnSearchValue = document.querySelector('#btn-search-value')
const overlaySearch = document.querySelector('.overlay-search')
const modalSearch = document.querySelector('.modal-search')
const inputSearchValue = document.querySelector('#input-search-value')
const inputSearchIndex = document.querySelector('#input-search-index')
const btnSearchByValue = document.querySelector('#btn-search-by-value')
const btnSearchByIndex = document.querySelector('#btn-search-by-index')
const animationSpeedSlider = document.querySelector('#animation-speed-slider')
const speedValueDisplay = document.querySelector('#speed-value')
const btnCheckEmpty = document.querySelector('#btn-check-empty')
const btnGetSize = document.querySelector('#btn-get-size')
const toggleSidebarBtn = document.querySelector('#toggle-sidebar')
const sidebarOverlay = document.querySelector('#sidebar-overlay')
let sidebarVisible = false

// Tutorial elements
const tutorialOverlay = document.querySelector('.tutorial-overlay')
const tutorialModal = document.querySelector('.tutorial-modal')
const tutorialTitle = document.querySelector('.tutorial-title')
const tutorialContent = document.querySelector('.tutorial-content')
const tutorialProgress = document.querySelector('.tutorial-progress')
const btnTutorial = document.querySelector('#btn-tutorial')
const btnNextTutorial = document.querySelector('#btn-next-tutorial')
const btnPreviousTutorial = document.querySelector('#btn-previous-tutorial')
const btnSkipTutorial = document.querySelector('#btn-skip-tutorial')

// Tutorial content
const tutorialSteps = [
    {
        title: 'Chào mừng đến với LinkedList!',
        content: `
            <p>Chào mừng bạn đến với công cụ trực quan hóa <strong>Linked List</strong>!</p>
            <p>Linked List là một cấu trúc dữ liệu tuyến tính, trong đó các phần tử không được lưu trữ liên tiếp trong bộ nhớ mà được liên kết với nhau thông qua con trỏ.</p>
            <h4><i class="bi bi-bullseye text-primary"></i> Mục tiêu của tutorial này:</h4>
            <ul>
                <li>Hiểu cấu trúc cơ bản của Linked List</li>
                <li>Nắm vững các thao tác cơ bản</li>
                <li>Trực quan hóa cách hoạt động của từng thao tác</li>
            </ul>
        `,
    },
    {
        title: 'Cấu trúc Linked List',
        content: `
            <p>Một Linked List bao gồm các <strong>Node</strong>, mỗi node có hai phần:</p>
            <h4><i class="bi bi-box text-primary"></i> Cấu trúc Node:</h4>
            <ul>
                <li><code>value</code>: Giá trị dữ liệu của node</li>
                <li><code>next</code>: Con trỏ trỏ đến node tiếp theo</li>
            </ul>
            <h4><i class="bi bi-link-45deg text-primary"></i> Đặc điểm:</h4>
            <ul>
                <li><strong>Head</strong>: Node đầu tiên của danh sách</li>
                <li><strong>Tail</strong>: Node cuối cùng của danh sách</li>
                <li>Node cuối cùng có <code>next = null</code></li>
            </ul>
        `,
    },
    {
        title: 'Thao tác Add (Thêm)',
        content: `
            <p>Có nhiều cách để thêm node vào Linked List:</p>
            <h4><i class="bi bi-plus-circle text-success"></i> Các phương thức Add:</h4>
            <ul>
                <li><strong>Add Head</strong>: Thêm node vào đầu danh sách - O(1)</li>
                <li><strong>Add Tail</strong>: Thêm node vào cuối danh sách - O(1)</li>
                <li><strong>Add at Index</strong>: Thêm node tại vị trí chỉ định - O(n)</li>
                <li><strong>Add Before/After</strong>: Thêm trước/sau một node cụ thể - O(n)</li>
            </ul>
            <p><i class="bi bi-lightbulb text-warning"></i> <em>Sử dụng nút <strong>Add</strong> trên toolbar để thực hành!</em></p>
        `,
    },
    {
        title: 'Thao tác Remove (Xóa)',
        content: `
            <p>Xóa node khỏi Linked List cũng có nhiều cách:</p>
            <h4><i class="bi bi-dash-circle text-danger"></i> Các phương thức Remove:</h4>
            <ul>
                <li><strong>Remove Head</strong>: Xóa node đầu tiên - O(1)</li>
                <li><strong>Remove Tail</strong>: Xóa node cuối cùng - O(n)</li>
                <li><strong>Remove at Index</strong>: Xóa node tại vị trí chỉ định - O(n)</li>
                <li><strong>Remove Node</strong>: Xóa một node cụ thể - O(n)</li>
            </ul>
            <p><i class="bi bi-lightbulb text-warning"></i> <em>Khi xóa node, cần liên kết lại các node còn lại bằng cách cập nhật con trỏ <code>next</code></em></p>
        `,
    },
    {
        title: 'Thao tác Search (Tìm kiếm)',
        content: `
            <p>Tìm kiếm trong Linked List luôn cần duyệt tuần tự từ đầu:</p>
            <h4><i class="bi bi-search text-info"></i> Các phương thức Search:</h4>
            <ul>
                <li><strong>Search by Value</strong>: Tìm node theo giá trị - O(n)</li>
                <li><strong>Search by Index</strong>: Lấy node tại vị trí - O(n)</li>
            </ul>
            <h4><i class="bi bi-stopwatch text-primary"></i> Độ phức tạp:</h4>
            <p>Không giống như mảng (Array), Linked List không hỗ trợ truy cập trực tiếp theo chỉ số. Phải duyệt từ <code>head</code> cho đến vị trí cần tìm.</p>
        `,
    },
    {
        title: 'Các chức năng khác',
        content: `
            <p>Ngoài Add, Remove, Search còn có các thao tác tiện ích:</p>
            <h4><i class="bi bi-tools text-primary"></i> Utility Functions:</h4>
            <ul>
                <li><strong>Random</strong>: Tạo danh sách ngẫu nhiên (1-25 nodes)</li>
                <li><strong>Clear</strong>: Xóa toàn bộ danh sách</li>
                <li><strong>Is Empty</strong>: Kiểm tra danh sách rỗng - O(1)</li>
                <li><strong>Size</strong>: Đếm số lượng node - O(n)</li>
            </ul>
            <h4><i class="bi bi-gear text-secondary"></i> Settings:</h4>
            <ul>
                <li><strong>Step Delay</strong>: Điều chỉnh tốc độ animation (100ms - 1000ms)</li>
            </ul>
        `,
    },
    {
        title: 'Sẵn sàng bắt đầu!',
        content: `
            <p><i class="bi bi-trophy text-warning"></i> Bạn đã hoàn thành tutorial cơ bản về Linked List!</p>
            <h4><i class="bi bi-hand-thumbs-up text-success"></i> Hãy bắt đầu thực hành:</h4>
            <ul>
                <li>Nhấn <strong>Random</strong> để tạo danh sách mẫu</li>
                <li>Thử các thao tác <strong>Add</strong>, <strong>Remove</strong>, <strong>Search</strong></li>
                <li>Quan sát animation để hiểu cách Linked List hoạt động</li>
                <li>Xem <strong>Pseudocode</strong> ở sidebar bên phải</li>
            </ul>
            <p><i class="bi bi-pin-angle text-danger"></i> <em>Bạn có thể mở lại tutorial bất cứ lúc nào bằng nút <strong>Tutorial</strong>!</em></p>
        `,
    },
]

let currentTutorialStep = 0

// Tutorial functions
function showTutorial(step) {
    if (step >= tutorialSteps.length) {
        closeTutorial()
        return
    }
    if (step < 0) {
        step = 0
    }

    currentTutorialStep = step
    const tutorialData = tutorialSteps[step]

    tutorialTitle.textContent = tutorialData.title
    tutorialContent.innerHTML = tutorialData.content
    tutorialProgress.textContent = `${step + 1} / ${tutorialSteps.length}`

    // Update Next button text
    if (step === tutorialSteps.length - 1) {
        btnNextTutorial.textContent = 'Finish'
    } else {
        btnNextTutorial.textContent = 'Next'
    }

    // Show/hide Previous button
    if (step === 0) {
        btnPreviousTutorial.style.display = 'none'
    } else {
        btnPreviousTutorial.style.display = 'block'
    }

    tutorialOverlay.classList.add('active')
}

function closeTutorial() {
    tutorialOverlay.classList.remove('active')
    localStorage.setItem('linkedListTutorialCompleted', 'true')
}

function startTutorial() {
    currentTutorialStep = 0
    showTutorial(0)
}

// Tutorial event listeners
btnTutorial.onclick = () => {
    startTutorial()
}

btnNextTutorial.onclick = () => {
    showTutorial(currentTutorialStep + 1)
}

btnPreviousTutorial.onclick = () => {
    showTutorial(currentTutorialStep - 1)
}

btnSkipTutorial.onclick = () => {
    closeTutorial()
}

tutorialOverlay.onclick = (e) => {
    if (e.target === tutorialOverlay) {
        closeTutorial()
    }
}

// Check if tutorial was completed, if not show it on first load
window.addEventListener('load', () => {
    const tutorialCompleted = localStorage.getItem('linkedListTutorialCompleted')
    if (!tutorialCompleted) {
        setTimeout(() => startTutorial(), 500)
    }
})

// Toggle sidebar
toggleSidebarBtn.onclick = () => {
    sidebarVisible = !sidebarVisible

    if (sidebarVisible) {
        sidebarOverlay.classList.add('open')
        toggleSidebarBtn.innerHTML = '<i class="bi bi-chevron-right"></i>'
    } else {
        sidebarOverlay.classList.remove('open')
        toggleSidebarBtn.innerHTML = '<i class="bi bi-chevron-left"></i>'
    }
}

// Close sidebar khi click outside
sidebarOverlay.addEventListener('click', (e) => {
    if (e.target === sidebarOverlay) {
        sidebarVisible = false
        sidebarOverlay.classList.remove('open')
        toggleSidebarBtn.innerHTML = '<i class="bi bi-chevron-left"></i>'
    }
})

// Event listener cho slider
animationSpeedSlider.addEventListener('input', (e) => {
    const speed = parseInt(e.target.value)
    setAnimationSpeed(speed)
    speedValueDisplay.textContent = `${speed}ms`
})

// Add Modal handlers
btnAdd.onclick = () => {
    overlayAdd.classList.add('active')
    requestAnimationFrame(() => {
        const rect = btnAdd.getBoundingClientRect()
        const modalWidth = modalAdd.offsetWidth || 200
        const left = rect.left
        const top = rect.bottom + 10

        modalAdd.style.left = `${left}px`
        modalAdd.style.top = `${top}px`
        modalAdd.style.transform = 'none'
    })
}

modalAdd.onclick = (event) => {
    event.stopPropagation()
}

overlayAdd.onclick = () => {
    if (overlayAdd.classList.contains('active')) {
        overlayAdd.classList.remove('active')
    }
}

// Remove Modal handlers
btnRemove.onclick = () => {
    overlayRemove.classList.add('active')
    requestAnimationFrame(() => {
        const rect = btnRemove.getBoundingClientRect()
        const modalWidth = modalRemove.offsetWidth || 200
        const left = rect.left
        const top = rect.bottom + 10

        modalRemove.style.left = `${left}px`
        modalRemove.style.top = `${top}px`
        modalRemove.style.transform = 'none'
    })
}

modalRemove.onclick = (event) => {
    event.stopPropagation()
}

overlayRemove.onclick = () => {
    if (overlayRemove.classList.contains('active')) {
        overlayRemove.classList.remove('active')
    }
}

// Pseudocode content
const pseudocodes = {
    addHead: `<span style="color: #0066cc; font-weight: bold;">addHead</span>(value):
  <span style="color: #008800;">// Thêm node mới vào đầu danh sách</span>
  <span style="color: #0066cc;">1.</span> Tạo node mới p với giá trị value
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">if</span> (head != null):
        p.next = head
        head = p
     <span style="color: #cc0066;">else</span>:
        head = tail = p
  <span style="color: #0066cc;">3.</span> <span style="color: #cc0066;">return</span> p`,

    addTail: `<span style="color: #0066cc; font-weight: bold;">addTail</span>(value):
  <span style="color: #008800;">// Thêm node mới vào cuối danh sách</span>
  <span style="color: #0066cc;">1.</span> Tạo node mới p với giá trị value
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">if</span> (head == null):
        head = tail = p
     <span style="color: #cc0066;">else</span>:
        tail.next = p
        tail = p
  <span style="color: #0066cc;">3.</span> <span style="color: #cc0066;">return</span> p`,

    removeHead: `<span style="color: #0066cc; font-weight: bold;">removeHead</span>():
  <span style="color: #008800;">// Xóa node đầu tiên</span>
  <span style="color: #0066cc;">1.</span> <span style="color: #cc0066;">if</span> (head == null):
        <span style="color: #cc0066;">return</span>
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">if</span> (head == tail):
        head = tail = null
     <span style="color: #cc0066;">else</span>:
        head = head.next`,

    removeTail: `<span style="color: #0066cc; font-weight: bold;">removeTail</span>():
  <span style="color: #008800;">// Xóa node cuối cùng</span>
  <span style="color: #0066cc;">1.</span> <span style="color: #cc0066;">if</span> (head == null):
        <span style="color: #cc0066;">return</span>
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">if</span> (head == tail):
        head = tail = null
     <span style="color: #cc0066;">else</span>:
        tmp = head
        <span style="color: #cc0066;">while</span> (tmp.next != tail):
            tmp = tmp.next
        tail = tmp
        tmp.next = null`,

    search: `<span style="color: #0066cc; font-weight: bold;">search</span>(value):
  <span style="color: #008800;">// Tìm kiếm node theo giá trị</span>
  <span style="color: #0066cc;">1.</span> tmp = head
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">while</span> (tmp != null):
        <span style="color: #cc0066;">if</span> (tmp.value == value):
            <span style="color: #cc0066;">return</span> tmp <span style="color: #008800;">// Tìm thấy</span>
        tmp = tmp.next
  <span style="color: #0066cc;">3.</span> <span style="color: #cc0066;">return</span> null <span style="color: #008800;">// Không tìm thấy</span>`,

    searchByIndex: `<span style="color: #0066cc; font-weight: bold;">get</span>(index):
  <span style="color: #008800;">// Lấy giá trị tại vị trí index</span>
  <span style="color: #0066cc;">1.</span> <span style="color: #cc0066;">if</span> (index < 0 || head == null):
        <span style="color: #cc0066;">return</span> null
  <span style="color: #0066cc;">2.</span> tmp = head
     count = 0
  <span style="color: #0066cc;">3.</span> <span style="color: #cc0066;">while</span> (tmp != null && count < index):
        tmp = tmp.next
        count++
  <span style="color: #0066cc;">4.</span> <span style="color: #cc0066;">return</span> tmp ? tmp.value : null`,

    isEmpty: `<span style="color: #0066cc; font-weight: bold;">isEmpty</span>():
  <span style="color: #008800;">// Kiểm tra danh sách rỗng</span>
  <span style="color: #0066cc;">1.</span> <span style="color: #cc0066;">return</span> (head == null)`,

    size: `<span style="color: #0066cc; font-weight: bold;">size</span>():
  <span style="color: #008800;">// Đếm số lượng node</span>
  <span style="color: #0066cc;">1.</span> count = 0
     p = head
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">while</span> (p != null):
        count++
        p = p.next
  <span style="color: #0066cc;">3.</span> <span style="color: #cc0066;">return</span> count`,

    clear: `<span style="color: #0066cc; font-weight: bold;">clear</span>():
  <span style="color: #008800;">// Xóa toàn bộ danh sách</span>
  <span style="color: #0066cc;">1.</span> <span style="color: #cc0066;">while</span> (head != null):
        removeHead()
  <span style="color: #0066cc;">2.</span> <span style="color: #008800;">// head và tail đã = null</span>`,

    removeNode: `<span style="color: #0066cc; font-weight: bold;">removeNode</span>(node):
  <span style="color: #008800;">// Xóa một node cụ thể khỏi danh sách</span>
  <span style="color: #0066cc;">1.</span> <span style="color: #cc0066;">if</span> (head == null):
        <span style="color: #cc0066;">return</span> null
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">if</span> (head == node):
        head = head.next
        <span style="color: #cc0066;">if</span> (tail == node):
            tail = null
        <span style="color: #cc0066;">return</span> node
  <span style="color: #0066cc;">3.</span> tmp = head
  <span style="color: #0066cc;">4.</span> <span style="color: #cc0066;">while</span> (tmp != null && tmp.next != node):
        tmp = tmp.next
  <span style="color: #0066cc;">5.</span> <span style="color: #cc0066;">if</span> (tmp != null):
        tmp.next = node.next
        <span style="color: #cc0066;">if</span> (tail == node):
            tail = tmp
        <span style="color: #cc0066;">return</span> node
  <span style="color: #0066cc;">6.</span> <span style="color: #cc0066;">return</span> null`,

    addBefore: `<span style="color: #0066cc; font-weight: bold;">addBefore</span>(node, value):
  <span style="color: #008800;">// Thêm node mới trước một node cụ thể</span>
  <span style="color: #0066cc;">1.</span> Tạo node mới p với giá trị value
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">if</span> (head == null):
        <span style="color: #cc0066;">return</span> null
  <span style="color: #0066cc;">3.</span> <span style="color: #cc0066;">if</span> (head == node):
        p.next = head
        head = p
        <span style="color: #cc0066;">return</span> p
  <span style="color: #0066cc;">4.</span> tmp = head
  <span style="color: #0066cc;">5.</span> <span style="color: #cc0066;">while</span> (tmp != null && tmp.next != node):
        tmp = tmp.next
  <span style="color: #0066cc;">6.</span> <span style="color: #cc0066;">if</span> (tmp != null):
        p.next = tmp.next
        tmp.next = p
  <span style="color: #0066cc;">7.</span> <span style="color: #cc0066;">return</span> p`,

    addAfter: `<span style="color: #0066cc; font-weight: bold;">addAfter</span>(node, value):
  <span style="color: #008800;">// Thêm node mới sau một node cụ thể</span>
  <span style="color: #0066cc;">1.</span> Tạo node mới p với giá trị value
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">if</span> (head == null || node == null):
        <span style="color: #cc0066;">return</span> null
  <span style="color: #0066cc;">3.</span> p.next = node.next
     node.next = p
  <span style="color: #0066cc;">4.</span> <span style="color: #cc0066;">if</span> (tail == node):
        tail = p
  <span style="color: #0066cc;">5.</span> <span style="color: #cc0066;">return</span> p`,

    addByIndex: `<span style="color: #0066cc; font-weight: bold;">addByIndex</span>(index, value):
  <span style="color: #008800;">// Thêm node tại vị trí index</span>
  <span style="color: #0066cc;">1.</span> <span style="color: #cc0066;">if</span> (index < 0):
        <span style="color: #cc0066;">return</span> null
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">if</span> (index == 0):
        <span style="color: #cc0066;">return</span> addHead(value)
  <span style="color: #0066cc;">3.</span> tmp = head
     count = 0
  <span style="color: #0066cc;">4.</span> <span style="color: #cc0066;">while</span> (tmp != null && count < index - 1):
        tmp = tmp.next
        count++
  <span style="color: #0066cc;">5.</span> <span style="color: #cc0066;">if</span> (tmp == null):
        <span style="color: #cc0066;">return</span> null
  <span style="color: #0066cc;">6.</span> Tạo node mới p và insert vào sau tmp
  <span style="color: #0066cc;">7.</span> <span style="color: #cc0066;">return</span> p`,

    removeByIndex: `<span style="color: #0066cc; font-weight: bold;">removeByIndex</span>(index):
  <span style="color: #008800;">// Xóa node tại vị trí index</span>
  <span style="color: #0066cc;">1.</span> <span style="color: #cc0066;">if</span> (index < 0 || head == null):
        <span style="color: #cc0066;">return</span> null
  <span style="color: #0066cc;">2.</span> <span style="color: #cc0066;">if</span> (index == 0):
        removed = head
        removeHead()
        <span style="color: #cc0066;">return</span> removed
  <span style="color: #0066cc;">3.</span> tmp = head
     count = 0
  <span style="color: #0066cc;">4.</span> <span style="color: #cc0066;">while</span> (tmp != null && count < index - 1):
        tmp = tmp.next
        count++
  <span style="color: #0066cc;">5.</span> <span style="color: #cc0066;">if</span> (tmp == null || tmp.next == null):
        <span style="color: #cc0066;">return</span> null
  <span style="color: #0066cc;">6.</span> removed = tmp.next
     tmp.next = tmp.next.next
  <span style="color: #0066cc;">7.</span> <span style="color: #cc0066;">return</span> removed`,

    default: `<span style="color: #008800;">// Chọn một chức năng để xem mã giả...</span>`,
}

function showPseudocode(type) {
    const content = pseudocodes[type] || 'Không có mã giả cho chức năng này.'
    document.getElementById('pseudocode-content').innerHTML = `<code>${content}</code>`
}

// Event listener cho Enter key trong các input
inputSearchValue.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnSearchByValue.click()
    }
})

inputSearchIndex.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnSearchByIndex.click()
    }
})

numberN.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnGo.click()
    }
})

inputAddIndex.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnAddIndex.click()
    }
})

inputRemoveIndex.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnRemoveIndex.click()
    }
})

btnAddHead.onclick = () => {
    showPseudocode('addHead')
    handleAddNode('addHead')
    overlayAdd.click()
}
btnAddTail.onclick = () => {
    showPseudocode('addTail')
    handleAddNode('addTail')
    overlayAdd.click()
}
btnAddIndex.onclick = async () => {
    const index = parseInt(inputAddIndex.value)
    if (isNaN(index) || index < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Vui lòng nhập index hợp lệ!',
            confirmButtonColor: '#3498db',
        })
        return
    }
    showPseudocode('addByIndex')
    await handleAddNode('addByIndex', index)
    overlayAdd.click()
    inputAddIndex.value = ''
}
btnRemoveHead.onclick = () => {
    showPseudocode('removeHead')
    handleRemoveNode('removeHead')
    overlayRemove.click()
}
btnRemoveTail.onclick = () => {
    showPseudocode('removeTail')
    handleRemoveNode('removeTail')
    overlayRemove.click()
}
btnRemoveIndex.onclick = async () => {
    const index = parseInt(inputRemoveIndex.value)
    if (isNaN(index) || index < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Vui lòng nhập index hợp lệ!',
            confirmButtonColor: '#3498db',
        })
        return
    }
    showPseudocode('removeByIndex')
    // Close the remove modal before executing deletion animation
    if (overlayRemove.classList.contains('active')) overlayRemove.classList.remove('active')
    if (modalRemove.classList.contains('display')) modalRemove.classList.remove('display')
    await handleRemoveNode('removeByIndex', index)
    inputRemoveIndex.value = ''
}
btnAddBefore.onclick = () => {
    showPseudocode('addBefore')
    {
        const nodeElement = document.querySelector('.node.active')
        const node = list.searchByID(nodeElement.dataset.id)
        handleAddNode('addBefore', node)
    }
}
btnAddAfter.onclick = () => {
    showPseudocode('addAfter')
    const nodeElement = document.querySelector('.node.active')
    const node = list.searchByID(nodeElement.dataset.id)
    handleAddNode('addAfter', node)
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
        const classArrow = tmp.isNew || (tmp.next !== null && tmp.next.isNew) ? 'arrow new' : 'arrow'

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
async function handleAddNode(method, node) {
    if (list.size() >= 25) {
        Swal.fire({
            icon: 'warning',
            title: 'Đã đầy!',
            text: 'Số node tối đa là 25',
            confirmButtonColor: '#3498db',
        })
        return
    }

    // pick value from Add modal when open, else from node modal if open
    let value = inputValueAdd ? inputValueAdd.value : ''
    if (!overlayAdd.classList.contains('active')) {
        // fallback to node modal value when adding before/after
        if (document.querySelector('.node-modal').classList.contains('display')) value = inputValueModal.value
    }

    value = value.trim()
    if (value === '') {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Vui lòng nhập giá trị!',
            confirmButtonColor: '#3498db',
        })
        if (inputValueAdd) inputValueAdd.value = ''
        if (inputValueAdd) inputValueAdd.focus()
        return
    }

    if (method === 'addHead') {
        list.addHead(value)
        list.head.isNew = true
    } else if (method === 'addTail') {
        list.addTail(value)
        list.tail.isNew = true
    } else if (method === 'addByIndex') {
        // Highlight traversal to index-1
        overlayAdd.click()
        busyOverlayElement.classList.add('block')
        let tmp = list.head
        let currentIndex = 0
        const targetPrevIndex = node - 1

        while (tmp !== null && currentIndex < targetPrevIndex) {
            const nodeElement = document.querySelector(`.node[data-id="${tmp.id}"]`)
            if (nodeElement) nodeElement.classList.add('active')
            await new Promise((resolve) => setTimeout(resolve, animationDelay))
            if (nodeElement) nodeElement.classList.remove('active')
            tmp = tmp.next
            currentIndex++
        }

        // Highlight the node right before index (prev node) before insertion
        if (targetPrevIndex >= 0) {
            const prevEl = tmp ? document.querySelector(`.node[data-id="${tmp.id}"]`) : null
            if (prevEl) {
                prevEl.classList.add('active')
                await new Promise((resolve) => setTimeout(resolve, animationDelay))
                prevEl.classList.remove('active')
            }
        }

        const newNode = list.addByIndex(node, value)
        if (newNode) {
            newNode.isNew = true
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Index không hợp lệ!',
                confirmButtonColor: '#3498db',
            })
            busyOverlayElement.classList.remove('block')
            return
        }
    } else if (method === 'addBefore') {
        const newNode = list.addBefore(node, value)
        newNode.isNew = true
        overlayElement.click()
    } else if (method === 'addAfter') {
        const newNode = list.addAfter(node, value)
        newNode.isNew = true
        overlayElement.click()
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Phương thức không hợp lệ!',
            confirmButtonColor: '#3498db',
        })
        return
    }

    busyOverlayElement.classList.add('block')
    if (inputValueAdd) inputValueAdd.value = ''
    if (inputValueAdd) inputValueAdd.focus()
    inputValueModal.value = ''
    saveList()
    renderList(1000)
}

// handle remove node
async function handleRemoveNode(method, node) {
    if (list.head === null) return

    let nodeElement
    const arrowElements = []

    if (method === 'removeHead') {
        nodeElement = document.querySelector('.node')
        list.removeHead()
    } else if (method === 'removeTail') {
        nodeElement = document.querySelector(`.node[data-id="${list.tail.id}"]`)
        list.removeTail()
    } else if (method === 'removeByIndex') {
        // Highlight traversal to index
        busyOverlayElement.classList.add('block')
        let tmp = list.head
        let currentIndex = 0
        while (tmp !== null && currentIndex < node) {
            const nodeElementTrav = document.querySelector(`.node[data-id="${tmp.id}"]`)
            if (nodeElementTrav) nodeElementTrav.classList.add('active')
            await new Promise((resolve) => setTimeout(resolve, animationDelay))
            if (nodeElementTrav) nodeElementTrav.classList.remove('active')
            tmp = tmp.next
            currentIndex++
        }

        // Highlight the target node at index before deletion
        const targetNode = tmp
        const targetEl = targetNode ? document.querySelector(`.node[data-id="${targetNode.id}"]`) : null
        if (targetEl) {
            targetEl.classList.add('active')
            await new Promise((resolve) => setTimeout(resolve, animationDelay))
            targetEl.classList.remove('active')
        }

        const removed = list.removeByIndex(node)
        if (!removed) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Index không hợp lệ!',
                confirmButtonColor: '#3498db',
            })
            busyOverlayElement.classList.remove('block')
            return
        }
        nodeElement = document.querySelector(`.node[data-id="${removed.id}"]`)
    } else if (method === 'node') {
        showPseudocode('removeNode')
        // Hide modal and selected node highlight before animation
        const selectedEl = document.querySelector(`.node[data-id="${node.id}"]`)
        if (selectedEl) selectedEl.classList.remove('active')
        if (overlayElement.classList.contains('active')) overlayElement.classList.remove('active')
        if (modalElement.classList.contains('display')) modalElement.classList.remove('display')

        // Highlight traversal from head to selected node
        busyOverlayElement.classList.add('block')
        let tmp = list.head
        while (tmp !== null && tmp.id !== node.id) {
            const nodeElementTrav = document.querySelector(`.node[data-id="${tmp.id}"]`)
            if (nodeElementTrav) nodeElementTrav.classList.add('active')
            await new Promise((resolve) => setTimeout(resolve, animationDelay))
            if (nodeElementTrav) nodeElementTrav.classList.remove('active')
            tmp = tmp.next
        }
        // Highlight the target node itself before deletion
        nodeElement = document.querySelector(`.node[data-id="${node.id}"]`)
        if (nodeElement) {
            nodeElement.classList.add('active')
            await new Promise((resolve) => setTimeout(resolve, animationDelay))
            nodeElement.classList.remove('active')
        }
        list.removeNode(node)
        // overlay already hidden above
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Phương thức không hợp lệ!',
            confirmButtonColor: '#3498db',
        })
        return
    }

    if (nodeElement && nodeElement.previousElementSibling) arrowElements.push(nodeElement.previousElementSibling)

    if (nodeElement && nodeElement.nextElementSibling) arrowElements.push(nodeElement.nextElementSibling)

    busyOverlayElement.classList.add('block')
    saveList()
    if (nodeElement) {
        if (arrowElements.length !== 0) {
            arrowElements.forEach((element) => {
                element.classList.add('deleting')
            })
            setTimeout(() => {
                nodeElement.classList.add('deleting')
            }, 500)
        } else nodeElement.classList.add('deleting')
    }

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
            handleRemoveNode('node', node)
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
        if (activeNode) activeNode.classList.remove('active')
        overlayElement.classList.remove('active')
        modalElement.classList.remove('display')
    }
}

// clear list
btnClear.onclick = () => {
    showPseudocode('clear')
    if (list === null) return
    const nodeElements = document.querySelectorAll('.node')
    nodeElements.forEach((node) => {
        node.classList.add('clear')
    })
    list.clear()
    saveList()
    setTimeout(renderList, 300)
}

// Check empty
btnCheckEmpty.onclick = () => {
    showPseudocode('isEmpty')
    const isEmpty = list.isEmpty()
    if (!isEmpty) {
        // Highlight head briefly to indicate check
        const headEl = document.querySelector('.node')
        if (headEl) {
            headEl.classList.add('active')
            setTimeout(() => headEl.classList.remove('active'), animationDelay)
        }
    }
    Swal.fire({
        icon: 'info',
        title: 'Kiểm tra rỗng',
        html: isEmpty ? '<p class="mb-0">Danh sách <strong class="text-success">RỖNG</strong></p>' : '<p class="mb-0">Danh sách <strong class="text-danger">KHÔNG RỖNG</strong></p>',
        confirmButtonColor: '#3498db',
    })
}

// Get size
btnGetSize.onclick = async () => {
    showPseudocode('size')
    // Traverse and highlight each node during count
    let tmp = list.head
    let count = 0
    busyOverlayElement.classList.add('block')
    while (tmp !== null) {
        const nodeElement = document.querySelector(`.node[data-id="${tmp.id}"]`)
        if (nodeElement) nodeElement.classList.add('active')
        await new Promise((resolve) => setTimeout(resolve, animationDelay))
        if (nodeElement) nodeElement.classList.remove('active')
        count++
        tmp = tmp.next
    }
    busyOverlayElement.classList.remove('block')
    const size = count
    Swal.fire({
        icon: 'info',
        title: 'Kích thước danh sách',
        html: `<p class="mb-0">Số lượng node: <strong class="text-primary fs-3">${size}</strong></p>`,
        confirmButtonColor: '#3498db',
    })
}

// Create random
btnCreateRandom.onclick = () => {
    showPseudocode('default')
    overlayCreateRandom.classList.add('active')

    // Tính toán vị trí sau khi modal đã hiển thị
    requestAnimationFrame(() => {
        const rect = btnCreateRandom.getBoundingClientRect()
        const modalWidth = modalCreateRandom.offsetWidth || 350
        const left = rect.left
        const top = rect.bottom + 10

        modalCreateRandom.style.left = `${left}px`
        modalCreateRandom.style.top = `${top}px`
        modalCreateRandom.style.transform = 'none'
    })
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

btnGo.onclick = async () => {
    showPseudocode('default')
    const n = Number(numberN.value)
    if (n < 1 || n > 25) {
        Swal.fire({
            icon: 'warning',
            title: 'Không hợp lệ!',
            text: 'Số lượng node hợp lệ là từ 1 đến 25!',
            confirmButtonColor: '#3498db',
        })
        return
    }

    overlayCreateRandom.click()

    if (list.head !== null) {
        const nodeElements = document.querySelectorAll('.node')
        nodeElements.forEach((node) => {
            node.classList.add('clear')
        })
        await new Promise((resolve) => setTimeout(resolve, animationDelay))
        list.clear()
    }

    // Tạo list với animation từng node
    const numbersRandom = generateRandomIntegers(n)
    busyOverlayElement.classList.add('block')

    for (let i = 0; i < numbersRandom.length; i++) {
        const node = list.addTail(numbersRandom[i])
        node.isNew = true
        renderList()
        await new Promise((resolve) => setTimeout(resolve, animationDelay))
    }

    busyOverlayElement.classList.remove('block')
    saveList()
}

// Search modal
btnSearchValue.onclick = () => {
    overlaySearch.classList.add('active')

    // Tính toán vị trí sau khi modal đã hiển thị
    requestAnimationFrame(() => {
        const rect = btnSearchValue.getBoundingClientRect()
        const modalWidth = modalSearch.offsetWidth || 400
        const left = rect.left
        const top = rect.bottom + 10

        modalSearch.style.left = `${left}px`
        modalSearch.style.top = `${top}px`
        modalSearch.style.transform = 'none'
    })
}

modalSearch.onclick = (event) => {
    event.stopPropagation()
}

overlaySearch.onclick = () => {
    if (overlaySearch.classList.contains('active')) {
        overlaySearch.classList.remove('active')
    }
}

// Search by value
btnSearchByValue.onclick = async () => {
    const value = inputSearchValue.value.trim()
    handleSearchByValue(value)
}

// Search by index
btnSearchByIndex.onclick = async () => {
    const index = Number(inputSearchIndex.value)
    handleSearchByIndex(index)
}

async function handleSearchByValue(value) {
    showPseudocode('search')
    if (value === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Thiếu thông tin!',
            text: 'Vui lòng nhập giá trị cần tìm!',
            confirmButtonColor: '#3498db',
        })
        return
    }

    if (list.head === null) {
        Swal.fire({
            icon: 'info',
            title: 'Danh sách rỗng!',
            text: 'Không có node nào để tìm kiếm.',
            confirmButtonColor: '#3498db',
        })
        return
    }

    // Xóa highlight cũ
    document.querySelectorAll('.node.active').forEach((node) => {
        node.classList.remove('active')
    })

    overlaySearch.click()
    busyOverlayElement.classList.add('block')

    let tmp = list.head

    while (tmp !== null) {
        const nodeElement = document.querySelector(`.node[data-id="${tmp.id}"]`)
        nodeElement.classList.add('active')

        await new Promise((resolve) => setTimeout(resolve, animationDelay))

        if (tmp.value == value) {
            busyOverlayElement.classList.remove('block')
            inputSearchValue.value = ''
            const foundNodeElement = nodeElement
            Swal.fire({
                icon: 'info',
                title: 'Tìm thấy!',
                text: `Giá trị "${value}" đã được tìm thấy!`,
                confirmButtonColor: '#3498db',
            }).then(() => {
                setTimeout(() => {
                    foundNodeElement.classList.remove('active')
                }, animationDelay * 2)
            })
            return
        }

        nodeElement.classList.remove('active')
        tmp = tmp.next
    }

    busyOverlayElement.classList.remove('block')
    inputSearchValue.value = ''
    Swal.fire({
        icon: 'info',
        title: 'Không tìm thấy!',
        text: `Không tìm thấy giá trị "${value}" trong danh sách.`,
        confirmButtonColor: '#3498db',
    })
}

async function handleSearchByIndex(index) {
    showPseudocode('searchByIndex')

    if (inputSearchIndex.value === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Thiếu thông tin!',
            text: 'Vui lòng nhập index!',
            confirmButtonColor: '#3498db',
        })
        return
    }

    if (index < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Index phải lớn hơn hoặc bằng 0!',
            confirmButtonColor: '#3498db',
        })
        return
    }

    if (list.head === null) {
        Swal.fire({
            icon: 'info',
            title: 'Danh sách rỗng!',
            text: 'Không có node nào để tìm kiếm.',
            confirmButtonColor: '#3498db',
        })
        return
    }

    const size = list.size()
    if (index >= size) {
        Swal.fire({
            icon: 'warning',
            title: 'Index không hợp lệ!',
            text: `Index vượt quá kích thước danh sách! (0 - ${size - 1})`,
            confirmButtonColor: '#3498db',
        })
        return
    }

    // Xóa highlight cũ
    document.querySelectorAll('.node.active').forEach((node) => {
        node.classList.remove('active')
    })

    overlaySearch.click()
    busyOverlayElement.classList.add('block')

    let tmp = list.head
    let currentIndex = 0

    while (tmp !== null) {
        const nodeElement = document.querySelector(`.node[data-id="${tmp.id}"]`)
        nodeElement.classList.add('active')

        await new Promise((resolve) => setTimeout(resolve, animationDelay))

        if (currentIndex === index) {
            busyOverlayElement.classList.remove('block')
            inputSearchIndex.value = ''
            const foundNodeElement = nodeElement
            Swal.fire({
                icon: 'info',
                title: 'Tìm thấy!',
                text: `Node tại index ${index} có giá trị "${tmp.value}"`,
                confirmButtonColor: '#3498db',
            }).then(() => {
                setTimeout(() => {
                    foundNodeElement.classList.remove('active')
                }, animationDelay * 2)
            })
            return
        }

        nodeElement.classList.remove('active')
        tmp = tmp.next
        currentIndex++
    }

    busyOverlayElement.classList.remove('block')
    inputSearchIndex.value = ''
}
