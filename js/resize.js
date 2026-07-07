// =============================================
// resize.js - نسخه نهایی (بدون تداخل با انیمیشن‌های بازی)
// =============================================

function updateTilePositions() {
    const container = document.querySelector('.game-container');
    if (!container) return;

    // محاسبه اندازه واقعی کانتینر
    const containerRect = container.getBoundingClientRect();
    const size = Math.min(containerRect.width, containerRect.height);

    // دریافت padding و gap
    const padding = parseFloat(getComputedStyle(container).padding) || 15;
    const gap = 15; // فاصله بین سلول‌ها

    const innerSize = size - (padding * 2);
    const cellSize = (innerSize - (gap * 3)) / 4;

    // 1. به‌روزرسانی اندازه سلول‌های خالی (grid-cell)
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach((cell, index) => {
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        cell.style.marginRight = (index % 4 === 3) ? '0px' : gap + 'px';
    });

    // 2. به‌روزرسانی اندازه و فونت تایل‌های موجود
    const tiles = document.querySelectorAll('.tile .tile-inner');
    tiles.forEach(inner => {
        inner.style.width = cellSize + 'px';
        inner.style.height = cellSize + 'px';
        inner.style.lineHeight = cellSize + 'px';
        let fontSize = Math.min(cellSize * 0.5, 55);
        if (cellSize < 60) fontSize = cellSize * 0.35;
        inner.style.fontSize = fontSize + 'px';
    });

    // 3. به‌روزرسانی موقعیت تایل‌ها با تغییر قوانین CSS (مهم‌ترین بخش)
    // این کار باعث می‌شود انیمیشن‌های بازی (pop, merge) به‌درستی کار کنند
    let styleTag = document.getElementById('dynamic-tile-positions');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-tile-positions';
        document.head.appendChild(styleTag);
    }

    let cssRules = '';
    for (let y = 1; y <= 4; y++) {
        for (let x = 1; x <= 4; x++) {
            const translateX = (x - 1) * (cellSize + gap);
            const translateY = (y - 1) * (cellSize + gap);
            cssRules += `.tile.tile-position-${x}-${y} { transform: translate(${translateX}px, ${translateY}px); }\n`;
        }
    }
    styleTag.textContent = cssRules;
}

// ===== اجرا در زمان‌های مختلف =====

function safeResize() {
    if (document.querySelector('.game-container')) {
        updateTilePositions();
    }
}

// بارگذاری اولیه
window.addEventListener('load', function() {
    setTimeout(safeResize, 100);
});

// تغییر اندازه پنجره
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(safeResize, 150);
});

// چرخش صفحه در موبایل
window.addEventListener('orientationchange', function() {
    setTimeout(safeResize, 300);
});

// رصد تغییرات برای تایل‌های جدید (با MutationObserver)
let observerTimeout;
function setupObserver() {
    const tileContainer = document.querySelector('.tile-container');
    if (!tileContainer) {
        setTimeout(setupObserver, 200);
        return;
    }

    const observer = new MutationObserver(function() {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(safeResize, 50);
    });

    observer.observe(tileContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
}

window.addEventListener('load', function() {
    setTimeout(setupObserver, 300);
});