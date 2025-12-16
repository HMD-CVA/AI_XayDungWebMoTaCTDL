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
let delay = 500;
let isSorting = false;

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
            title: 'Inavlid Size',
            text: 'Please enter a size between 5 and 50.',
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
            title: 'Invalid Input',
            text: 'Please enter between 3 and 50 numbers.',
            confirmButtonColor: '#ff6b6b'
        });
        return;
    }

    if (data.some(isNaN)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please enter valid numbers only.',
            confirmButtonColor: '#ff6b6b'
        });
        return;
    }

    if (data.some(x => x < 0 || x > 200)) {
        Swal.fire({
            icon: 'warning',
            title: 'Value Warning',
            text: 'For best visualization, try values between 0 and 100.',
            confirmButtonColor: '#f1c40f'
        });
        // We still allow it? let's clamp or allow
    }

    // Generate from data
    array = data;
    renderArray(array);
    overlayCustomInput.style.display = 'none';
};

btnReset.onclick = () => {
    if (isSorting) {
        // Reload page to stop sorting nicely
        location.reload();
    } else {
        generateArray(array.length);
    }
}

btnStart.onclick = async () => {
    if (isSorting) return;
    isSorting = true;
    disableControls(true);
    await bubbleSort();
    isSorting = false;
    disableControls(false);
    Swal.fire({
        icon: 'success',
        title: 'Sorted!',
        text: 'The array has been sorted successfully.',
        confirmButtonColor: '#43e97b'
    });
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

const tutorialOverlay = document.querySelector(".tutorial-overlay");
const tutorialModal = document.querySelector(".tutorial-modal");
const tutorialTitle = document.querySelector(".tutorial-title");
const tutorialContent = document.querySelector(".tutorial-content");
const tutorialProgress = document.querySelector(".tutorial-progress");
const btnTutorial = document.getElementById("btn-tutorial");
const btnNextTutorial = document.getElementById("btn-next-tutorial");
const btnPreviousTutorial = document.getElementById("btn-previous-tutorial");
const btnSkipTutorial = document.getElementById("btn-skip-tutorial");

const tutorialSteps = [
    {
        title: "Chào mừng đến với Bubble Sort Visualizer!",
        content: `
            <p>Xin chào! Công cụ này sẽ giúp bạn trực quan hóa và hiểu thuật toán <strong>Bubble Sort (Sắp xếp nổi bọt)</strong>.</p>
            <p>Bubble Sort là một trong những thuật toán sắp xếp đơn giản nhất để hiểu và cài đặt.</p>
            <h4><i class="bi bi-bullseye text-primary"></i> Mục tiêu:</h4>
            <ul>
                <li>Hiểu cách Bubble Sort so sánh và hoán đổi các phần tử.</li>
                <li>Hình dung hiệu ứng "nổi bọt" của các phần tử lớn nhất.</li>
                <li>Nắm vững độ phức tạp thời gian và logic hoạt động.</li>
            </ul>
        `
    },
    {
        title: "Bubble Sort là gì?",
        content: `
            <p><strong>Bubble Sort</strong> là một thuật toán dựa trên so sánh.</p>
            <h4><i class="bi bi-gear text-primary"></i> Cơ chế:</h4>
            <ul>
                <li>Nó lặp đi lặp lại qua danh sách.</li>
                <li>So sánh các phần tử liền kề (các cặp).</li>
                <li><strong>Hoán đổi</strong> chúng nếu chúng sai thứ tự (ví dụ: trái > phải).</li>
            </ul>
            <p>Qua từng lượt, phần tử chưa được sắp xếp lớn nhất sẽ "nổi" lên vị trí đúng của nó ở cuối danh sách.</p>
        `
    },
    {
        title: "Trực quan hóa",
        content: `
            <p>Trong trình trực quan hóa này:</p>
            <ul>
                <li><strong>Cột (Bars)</strong> đại diện cho các số trong mảng.</li>
                <li><strong>Chiều cao</strong> tương ứng với giá trị (cao hơn = lớn hơn).</li>
                <li><span style="color: #ff9a9e; font-weight: bold;">Hồng/Đỏ</span> nghĩa là các phần tử đang được <strong>so sánh</strong>.</li>
                <li><span style="color: #a18cd1; font-weight: bold;">Tím</span> nghĩa là các phần tử đang được <strong>hoán đổi</strong>.</li>
                <li><span style="color: #43e97b; font-weight: bold;">Xanh lá</span> nghĩa là phần tử đã được <strong>sắp xếp</strong>.</li>
            </ul>
        `
    },
    {
        title: "Điều khiển & Tính năng",
        content: `
            <p>Khám phá thanh công cụ để điều khiển quá trình mô phỏng:</p>
            <ul>
                <li><strong>Random Array</strong>: Tạo mới một tập hợp các cột ngẫu nhiên.</li>
                <li><strong>Custom Input</strong>: Nhập các số cụ thể của bạn để sắp xếp.</li>
                <li><strong>Start Sort</strong>: Bắt đầu chạy mô phỏng.</li>
                <li><strong>Speed Slider</strong>: Điều chỉnh tốc độ sắp xếp nhanh hay chậm.</li>
                <li><strong>Reset</strong>: Dừng và đặt lại mảng.</li>
            </ul>
        `
    },
    {
        title: "Sidebar Mã giả",
        content: `
            <p>Ở bên phải (hoặc nh click vào mũi tên <i class="bi bi-chevron-left"></i>), bạn sẽ thấy <strong>Mã giả (Pseudocode)</strong>.</p>
            <p>Khi mô phỏng chạy, dòng mã hiện tại đang được thực thi sẽ được <span style="background-color: #f1c40f; padding: 2px 4px; border-radius: 4px;">highlight</span>.</p>
            <p>Điều này giúp bạn kết nối hành động trực quan với logic thuật toán!</p>
        `
    },
    {
        title: "Sẵn sàng sắp xếp?",
        content: `
            <p>Bạn đã sẵn sàng! <i class="bi bi-rocket-takeoff text-success"></i></p>
            <p>Hãy thử tạo mảng ngẫu nhiên hoặc nhập trường hợp khó (như danh sách giảm dần) và xem Bubble Sort xử lý.</p>
            <p>Nh nhấn <strong>Start Sort</strong> bất cứ khi nào bạn sẵn sàng.</p>
            <p><em>Bạn luôn có thể mở lại hướng dẫn này bằng cách nhấn nút <strong>Tutorial</strong>.</em></p>
        `
    }
];

let currentTutorialStep = 0;

function showTutorial(step) {
    if (step >= tutorialSteps.length) {
        closeTutorial();
        return;
    }
    if (step < 0) step = 0;

    currentTutorialStep = step;
    const data = tutorialSteps[step];

    tutorialTitle.textContent = data.title;
    tutorialContent.innerHTML = data.content;
    tutorialProgress.textContent = `${step + 1} / ${tutorialSteps.length}`;

    // Update buttons
    if (step === tutorialSteps.length - 1) {
        btnNextTutorial.textContent = "Finish";
    } else {
        btnNextTutorial.textContent = "Next";
    }

    if (step === 0) {
        btnPreviousTutorial.style.display = "none";
    } else {
        btnPreviousTutorial.style.display = "block";
    }

    tutorialOverlay.classList.add("active");
}

function closeTutorial() {
    tutorialOverlay.classList.remove("active");
    localStorage.setItem("bubbleSortTutorialCompleted", "true");
}

function startTutorial() {
    currentTutorialStep = 0;
    showTutorial(0);
}

// Event Listeners for Tutorial
if (btnTutorial) {
    btnTutorial.onclick = startTutorial;
}

if (btnNextTutorial) {
    btnNextTutorial.onclick = () => showTutorial(currentTutorialStep + 1);
}

if (btnPreviousTutorial) {
    btnPreviousTutorial.onclick = () => showTutorial(currentTutorialStep - 1);
}

if (btnSkipTutorial) {
    btnSkipTutorial.onclick = closeTutorial;
}

if (tutorialOverlay) {
    tutorialOverlay.onclick = (e) => {
        if (e.target === tutorialOverlay) {
            closeTutorial();
        }
    };
}

// Auto-start tutorial if not completed before
window.addEventListener("load", () => {
    const completed = localStorage.getItem("bubbleSortTutorialCompleted");
    if (!completed) {
        setTimeout(startTutorial, 1000);
    }
});

