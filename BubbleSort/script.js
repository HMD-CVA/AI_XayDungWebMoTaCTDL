// DOM Elements
const displayContainer = document.getElementById('display-container');
const displayArea = document.querySelector('.display-area');
const speedSlider = document.getElementById('animation-speed-slider');
const speedValue = document.getElementById('speed-value');
const btnCreateRandom = document.getElementById('btn-create-random');
const btnCustomInput = document.getElementById('btn-custom-input');
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const overlayCreateRandom = document.querySelector('.overlay-create-random');
const modalCreateRandom = document.querySelector('.modal-create-random');
const btnGo = document.getElementById('btn-go');
const overlayCustomInput = document.querySelector('.overlay-custom-input');
const modalCustomInput = document.querySelector('.modal-custom-input');
const btnCustomGo = document.getElementById('btn-custom-go');
const inputCustomData = document.getElementById('input-custom-data');
const inputN = document.querySelector('.number-n');
const pseudocodeContent = document.getElementById('pseudocode-content');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// State
let array = [];
let initialArray = []; // Store the initial state
let delay = 500;
let isSorting = false;
let abortSorting = false; // Flag to abort sorting

// Pseudocode
const bubbleSortPseudocode = `
<span id="line-1">procedure bubbleSort(list)</span>
<span id="line-2">   n = length(list)</span>
<span id="line-3">   repeat</span>
<span id="line-4">     swapped = false</span>
<span id="line-5">     for i = 1 to n-1 inclusive do</span>
<span id="line-6">       if list[i-1] > list[i] then</span>
<span id="line-7">         swap(list[i-1], list[i])</span>
<span id="line-8">         swapped = true</span>
<span id="line-9">       end if</span>
<span id="line-10">     end for</span>
<span id="line-11">     n = n - 1</span>
<span id="line-12">   until not swapped</span>
<span id="line-13">end procedure</span>
`;

// Initialize
pseudocodeContent.innerHTML = bubbleSortPseudocode;
updateSpeed(500);
generateArray(20);

// Event Listeners
speedSlider.addEventListener('input', (e) => {
    updateSpeed(e.target.value);
});

// Sidebar Controls
let sidebarVisible = false;
toggleSidebarBtn.onclick = () => {
    sidebarVisible = !sidebarVisible;
    if (sidebarVisible) {
        sidebarOverlay.classList.add('open');
        toggleSidebarBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
    } else {
        sidebarOverlay.classList.remove('open');
        toggleSidebarBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
    }
};

sidebarOverlay.addEventListener('click', (e) => {
    if (e.target === sidebarOverlay) {
        sidebarVisible = false;
        sidebarOverlay.classList.remove('open');
        toggleSidebarBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
    }
});

// Modal Controls - Create Random
btnCreateRandom.onclick = () => {
    if (isSorting) return;
    overlayCreateRandom.classList.add('active');

    requestAnimationFrame(() => {
        const rect = btnCreateRandom.getBoundingClientRect();
        const left = rect.left;
        const top = rect.bottom + 10;

        modalCreateRandom.style.left = `${left}px`;
        modalCreateRandom.style.top = `${top}px`;
    });
};

btnCustomInput.onclick = () => {
    if (isSorting) return;
    overlayCustomInput.style.display = 'block';

    requestAnimationFrame(() => {
        const rect = btnCustomInput.getBoundingClientRect();
        const left = rect.left;
        const top = rect.bottom + 10;

        modalCustomInput.style.left = `${left}px`;
        modalCustomInput.style.top = `${top}px`;
        inputCustomData.focus();
    });
};

overlayCreateRandom.onclick = (e) => {
    if (e.target === overlayCreateRandom) {
        overlayCreateRandom.classList.remove('active');
    }
};

overlayCustomInput.onclick = (e) => {
    if (e.target === overlayCustomInput) {
        overlayCustomInput.style.display = 'none';
    }
};

btnGo.onclick = () => {
    const n = parseInt(inputN.value);
    if (n >= 5 && n <= 50) {
        generateArray(n);
        overlayCreateRandom.classList.remove('active');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Kích thước không hợp lệ',
            text: 'Vui lòng nhập kích thước từ 5 đến 50.',
            confirmButtonColor: '#ff6b6b'
        });
    }
};

btnCustomGo.onclick = () => {
    const rawData = inputCustomData.value;
    const data = rawData.split(/[\s,]+/) // split by space or comma
        .filter(x => x.trim() !== '')
        .map(x => parseInt(x));

    // Validation
    if (data.length < 3 || data.length > 50) {
        Swal.fire({
            icon: 'error',
            title: 'Dữ liệu không hợp lệ',
            text: 'Vui lòng nhập từ 3 đến 50 số.',
            confirmButtonColor: '#ff6b6b'
        });
        return;
    }

    if (data.some(isNaN)) {
        Swal.fire({
            icon: 'error',
            title: 'Dữ liệu không hợp lệ',
            text: 'Vui lòng chỉ nhập số hợp lệ.',
            confirmButtonColor: '#ff6b6b'
        });
        return;
    }

    if (data.some(x => x < 0 || x > 200)) {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo giá trị',
            text: 'Để hiển thị tốt nhất, hãy nhập giá trị từ 0 đến 100.',
            confirmButtonColor: '#f1c40f'
        });
        // We still allow it? let's clamp or allow
    }

    // Generate from data
    array = data;
    initialArray = [...array]; // Save initial state
    renderArray(array);
    overlayCustomInput.style.display = 'none';
};

btnReset.onclick = () => {
    if (isSorting) {
        abortSorting = true;
    } else {
        // Just reset to initial array
        array = [...initialArray];
        renderArray(array);
    }
}

btnStart.onclick = async () => {
    if (isSorting) return;
    isSorting = true;
    abortSorting = false;
    disableControls(true);
    try {
        await bubbleSort();
        Swal.fire({
            icon: 'success',
            title: 'Đã Sắp Xếp!',
            text: 'Mảng đã được sắp xếp thành công.',
            confirmButtonColor: '#43e97b'
        });
    } catch (error) {
        if (error === 'SortingAborted') {
            console.log('Sorting aborted by user');
            // Reset to initial state after abort
            array = [...initialArray];
            renderArray(array);
            // Re-render highlight removal
            document.querySelectorAll('#pseudocode-content span').forEach(el => {
                el.style.backgroundColor = 'transparent';
                el.style.color = '#2c3e50';
            });
        } else {
            console.error(error);
        }
    } finally {
        isSorting = false;
        disableControls(false);
    }
};


// Functions

function updateSpeed(val) {
    delay = val;
    speedValue.innerText = `${val}ms`;
    document.documentElement.style.setProperty('--animation-duration', `${val}ms`);
}

function renderArray(data) {
    displayArea.innerHTML = '';
    array = data;
    const n = data.length;

    // Determine bar with based on N to fit container
    let containerWidth = displayArea.offsetWidth || 800;
    let barWidth = Math.floor((containerWidth - (n * 4)) / n); // 4px gap approx
    if (barWidth > 40) barWidth = 40;
    if (barWidth < 10) barWidth = 10;

    document.documentElement.style.setProperty('--bar-width', `${barWidth}px`);

    for (let i = 0; i < n; i++) {
        const value = data[i];

        const bar = document.createElement('div');
        bar.classList.add('array-bar');

        // Scale height: find max to normalize or just simple scale
        // Simple scale 3px per value good for 0-100.
        // If value is huge, we might need normalization logic, but let's keep simple for now
        let height = value * 3;
        if (height > 300) height = 300; // Cap height for visual
        if (height < 20) height = 20;   // Min height

        bar.style.height = `${height}px`;
        bar.innerText = value;
        bar.setAttribute('id', `bar-${i}`);

        displayArea.appendChild(bar);
    }
}

function generateArray(n) {
    const randomData = [];
    const min = 10;
    const max = 100;

    for (let i = 0; i < n; i++) {
        const value = Math.floor(Math.random() * (max - min + 1)) + min;
        randomData.push(value);
    }
    initialArray = [...randomData]; // Save initial state
    renderArray(randomData);
}

function disableControls(disable) {
    btnCreateRandom.disabled = disable;
    btnCustomInput.disabled = disable;
    btnStart.disabled = disable;
    inputN.disabled = disable;
    // We allow reset to reload page
}

async function highlightLine(lineId) {
    // remove previous highlight
    document.querySelectorAll('#pseudocode-content span').forEach(el => {
        el.style.backgroundColor = 'transparent';
        el.style.color = '#2c3e50';
    });

    if (lineId) {
        const el = document.getElementById(lineId);
        if (el) {
            el.style.backgroundColor = '#f1c40f';
            el.style.color = '#000';
        }
    }
}

async function wait() {
    if (abortSorting) throw 'SortingAborted';
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Bubble Sort Implementation
async function bubbleSort() {
    const bars = document.getElementsByClassName('array-bar');
    let n = array.length;

    await highlightLine('line-1');
    await wait();

    await highlightLine('line-3'); // repeat

    let swapped;
    do {
        swapped = false;
        await highlightLine('line-4');

        for (let i = 0; i < n - 1; i++) {
            await highlightLine('line-5'); // for loop

            // Highlight comparing
            bars[i].classList.add('compare');
            bars[i + 1].classList.add('compare');
            await highlightLine('line-6'); // if check
            await wait();

            const val1 = parseInt(bars[i].innerText);
            const val2 = parseInt(bars[i + 1].innerText);

            if (val1 > val2) {
                // Swap
                await highlightLine('line-7'); // swap

                bars[i].classList.remove('compare');
                bars[i + 1].classList.remove('compare');

                bars[i].classList.add('swap');
                bars[i + 1].classList.add('swap');

                // Visual swap
                await wait();

                let tempHeight = bars[i].style.height;
                let tempText = bars[i].innerText;

                bars[i].style.height = bars[i + 1].style.height;
                bars[i].innerText = bars[i + 1].innerText;

                bars[i + 1].style.height = tempHeight;
                bars[i + 1].innerText = tempText;

                swapped = true;
                await highlightLine('line-8'); // swapped = true
                await wait();

                bars[i].classList.remove('swap');
                bars[i + 1].classList.remove('swap');
            } else {
                bars[i].classList.remove('compare');
                bars[i + 1].classList.remove('compare');
            }
        }

        // Mark last element as sorted? In optimized bubble sort, we do n-- 
        // effectively locking the last analyzed element. 
        // The standard "repeat until not swapped" doesn't strictly lock n-th position 
        // unless we decrement n. The pseudocode says n = n - 1.

        await highlightLine('line-11');
        bars[n - 1].classList.add('sorted');
        n--;

        await highlightLine('line-12'); // until
    } while (swapped);

    // Mark remaining sorted
    for (let i = 0; i < array.length; i++) {
        bars[i].classList.add('sorted');
    }

    await highlightLine('line-13');
}

// --- Tutorial Logic ---

const btnTutorial = document.getElementById("btn-tutorial");
const guideModalEl = document.getElementById('guideModal');
let guideModal;

if (guideModalEl) {
    guideModal = new bootstrap.Modal(guideModalEl);
}

function setupTourOnClose() {
    if (!guideModalEl) return;
    const handleModalClose = function () {
        setTimeout(() => startTour(), 500);
        guideModalEl.removeEventListener('hidden.bs.modal', handleModalClose);
    }
    guideModalEl.addEventListener('hidden.bs.modal', handleModalClose);
}

// Event Listeners for Tutorial Button
if (btnTutorial && guideModal) {
    btnTutorial.onclick = () => {
        guideModal.show();
        setupTourOnClose();
    };
}



// --- Tour Guide Logic ---

const tourSteps = [
    {
        title: "Chào mừng đến với Bubble Sort!",
        content: "Công cụ này giúp bạn trực quan hóa thuật toán sắp xếp nổi bọt (Bubble Sort). Bong bóng lớn sẽ nổi lên trên cùng qua từng vòng lặp. Hãy cùng đi một vòng các chức năng nhé!",
        target: "center",
        position: "center"
    },
    {
        title: "Hướng dẫn Sử Dụng",
        content: "Click vào nút này để xem lại hướng dẫn chi tiết và lý thuyết về Bubble Sort bất cứ lúc nào.",
        target: "#btn-tutorial",
        position: "bottom"
    },
    {
        title: "Tạo Mảng Ngẫu Nhiên",
        content: "Tạo một mảng mới với các giá trị ngẫu nhiên. Bạn có thể tùy chỉnh kích thước mảng (số lượng phần tử) trong hộp thoại hiện ra.",
        target: "#btn-create-random",
        position: "bottom"
    },
    {
        title: "Nhập Dữ Liệu Tùy Chỉnh",
        content: "Cho phép bạn tự nhập dãy số của riêng mình (cách nhau bởi dấu phẩy, ví dụ: 5, 1, 4, 2, 8) để kiểm tra thuật toán với các trường hợp cụ thể.",
        target: "#btn-custom-input",
        position: "bottom"
    },
    {
        title: "Bắt Đầu Sắp Xếp",
        content: "Nhấn nút này để bắt đầu quá trình sắp xếp nổi bọt. Bạn sẽ thấy các phần tử di chuyển và so sánh với nhau.",
        target: "#btn-start",
        position: "bottom"
    },
    {
        title: "Làm Mới (Reset)",
        content: "Nếu muốn quay lại trạng thái ban đầu của mảng hiện tại hãy nhấn nút này.",
        target: "#btn-reset",
        position: "bottom"
    },
    {
        title: "Điều Khiển Tốc Độ",
        content: "Kéo thanh trượt để điều chỉnh tốc độ mô phỏng. Kéo sang trái để chậm lại (dễ quan sát), kéo sang phải để tăng tốc.",
        target: "#animation-speed-slider",
        position: "bottom"
    },
    {
        title: "Khu Vực Hiển Thị",
        content: `
            <p>Đây là nơi các cột (Bars) được vẽ:</p>
            <ul>
                <li>Chiều cao cột thể hiện giá trị số.</li>
                <li><span style="color: #ff9a9e; font-weight: bold;">Đỏ/Hồng:</span> Đang so sánh.</li>
                <li><span style="color: #a18cd1; font-weight: bold;">Tím:</span> Đang hoán đổi.</li>
                <li><span style="color: #43e97b; font-weight: bold;">Xanh lá:</span> Đã sắp xếp đúng vị trí.</li>
            </ul>
        `,
        target: "#display-container",
        position: "top"
    },
    {
        title: "Khu Vực Mã Giả (Pseudocode)",
        content: "Mã giả của thuật toán Bubble Sort. Khi chạy, dòng code đang thực thi sẽ được highlight màu vàng giúp bạn theo dõi logic.",
        target: "#toggle-sidebar",
        position: "left"
    }
];

let currentTourStep = 0;
const tourOverlay = document.getElementById("tourOverlay");
const tourSpotlight = document.getElementById("tourSpotlight");
const tourPopup = document.getElementById("tourPopup");
const tourTitle = document.getElementById("tourTitle");
const tourContent = document.getElementById("tourContent");
const tourStep = document.getElementById("tourStep");
const tourPrev = document.getElementById("tourPrev");
const tourNext = document.getElementById("tourNext");
const tourSkip = document.getElementById("tourSkip");

function startTour() {
    currentTourStep = 0;
    tourOverlay.style.display = "block";

    // Ensure popup is visible (reset opacity if needed)
    tourPopup.style.opacity = "0";

    setTimeout(() => {
        showTourStep(0);
        tourPopup.style.opacity = "1";
    }, 100);
}

function endTour() {
    tourOverlay.style.display = "none";
    localStorage.setItem("bubbleSort_V2_Completed", "true");
}

function showTourStep(index) {
    if (index < 0 || index >= tourSteps.length) return;

    currentTourStep = index;
    const step = tourSteps[index];

    // Update Content
    tourTitle.textContent = step.title;
    tourContent.innerHTML = step.content;
    tourStep.textContent = `${index + 1}/${tourSteps.length}`;

    // Update Buttons
    tourPrev.disabled = index === 0;
    tourNext.textContent = index === tourSteps.length - 1 ? "Hoàn thành" : "Tiếp";

    // Position Spotlight & Popup
    if (step.target === "center") {
        // Hide Spotlight
        tourSpotlight.style.width = "0";
        tourSpotlight.style.height = "0";
        tourSpotlight.style.top = "50%";
        tourSpotlight.style.left = "50%";
        tourSpotlight.style.boxShadow = "none"; // Remove spotlight effect for welcome screen, or keep full overlay
        tourSpotlight.style.boxShadow = "0 0 0 9999px rgba(0, 0, 0, 0.7)"; // Full dark overlay

        // Center Popup
        tourPopup.style.top = "50%";
        tourPopup.style.left = "50%";
        tourPopup.style.transform = "translate(-50%, -50%)";
    } else {
        const targetEl = document.querySelector(step.target);
        if (targetEl) {
            const rect = targetEl.getBoundingClientRect();

            // Set Spotlight
            tourSpotlight.style.width = `${rect.width + 10}px`;
            tourSpotlight.style.height = `${rect.height + 10}px`;
            tourSpotlight.style.top = `${rect.top - 5}px`;
            tourSpotlight.style.left = `${rect.left - 5}px`;
            // Restore spotlight shadow
            tourSpotlight.style.boxShadow = "0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 30px rgba(67, 97, 238, 0.8)";

            // Position Popup
            positionPopup(rect, step.position);
        } else {
            // Fallback if target not found
            console.warn("Tour target not found:", step.target);
            tourSpotlight.style.opacity = "0";
            tourPopup.style.top = "50%";
            tourPopup.style.left = "50%";
            tourPopup.style.transform = "translate(-50%, -50%)";
        }
    }
}

function positionPopup(targetRect, position) {
    // Reset transform used for centering
    tourPopup.style.transform = "none";

    const popupRect = tourPopup.getBoundingClientRect();
    // Default dimensions
    const popupWidth = 350;
    const popupHeight = tourPopup.offsetHeight || 200;

    const margin = 20;
    let top, left;

    // Simple positioning logic
    if (position === "bottom") {
        top = targetRect.bottom + margin;
        left = targetRect.left + (targetRect.width / 2) - (350 / 2); // Center horizontally
    } else if (position === "top") {
        top = targetRect.top - popupHeight - margin;
        left = targetRect.left + (targetRect.width / 2) - (350 / 2);
    } else if (position === "left") {
        top = targetRect.top + (targetRect.height / 2) - (popupHeight / 2);
        left = targetRect.left - 350 - margin;
    } else if (position === "right") {
        top = targetRect.top + (targetRect.height / 2) - (popupHeight / 2);
        left = targetRect.right + margin;
    }

    // Boundary checks (basic)
    if (left < 10) left = 10;
    if (left + 350 > window.innerWidth - 10) left = window.innerWidth - 350 - 10;
    if (top < 10) top = 10;
    if (top + popupHeight > window.innerHeight - 10) top = window.innerHeight - popupHeight - 10;

    tourPopup.style.top = `${top}px`;
    tourPopup.style.left = `${left}px`;
}

// Event Listeners for Tour


if (tourNext) {
    tourNext.onclick = () => {
        if (currentTourStep < tourSteps.length - 1) {
            showTourStep(currentTourStep + 1);
        } else {
            endTour();
        }
    };
}

if (tourPrev) {
    tourPrev.onclick = () => {
        if (currentTourStep > 0) {
            showTourStep(currentTourStep - 1);
        }
    };
}

if (tourSkip) {
    tourSkip.onclick = endTour;
}

// Auto-start (optional logic)
// Auto-start
window.addEventListener("load", () => {
    setTimeout(() => {
        if (guideModal) {
            guideModal.show();
            setupTourOnClose();
        }
    }, 500);
});

