// =============================================
// resize.js - نسخه نهایی با رصد محدود
// =============================================

let lastContainerSize = 0;

function updateTilePositions() {
    const container = document.querySelector('.game-container');
    if (!container) return;

    // محاسبه اندازه واقعی کانتینر
    const containerRect = container.getBoundingClientRect();
    const size = Math.min(containerRect.width, containerRect.height);

    // اگر اندازه تغییر نکرده، کاری نکن (از لرزش جلوگیری میکنه)
    if (Math.abs(size - lastContainerSize) < 1 && lastContainerSize !== 0) {
        return;
    }
    lastContainerSize = size;

    const padding = parseFloat(getComputedStyle(container).padding) || 15;
    const gap = 15;
    const innerSize = size - (padding * 2);
    const cellSize = (innerSize - (gap * 3)) / 4;

    // به‌روزرسانی grid-cell‌ها
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach((cell, index) => {
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        cell.style.marginRight = (index % 4 === 3) ? '0px' : gap + 'px';
    });

    // به‌روزرسانی اندازه تایل‌های موجود
    const tiles = document.querySelectorAll('.tile .tile-inner');
    tiles.forEach(inner => {
        inner.style.width = cellSize + 'px';
        inner.style.height = cellSize + 'px';
        inner.style.lineHeight = cellSize + 'px';
        let fontSize = Math.min(cellSize * 0.5, 55);
        if (cellSize < 60) fontSize = cellSize * 0.35;
        inner.style.fontSize = fontSize + 'px';
    });

    // به‌روزرسانی موقعیت تایل‌ها با CSS Rules
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

// ===== فقط در زمان تغییر اندازه یا اضافه شدن تایل جدید =====

// بارگذاری اولیه
window.addEventListener('load', function() {
    setTimeout(updateTilePositions, 100);
});

// تغییر اندازه پنجره
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateTilePositions, 150);
});

// چرخش صفحه در موبایل
window.addEventListener('orientationchange', function() {
    setTimeout(updateTilePositions, 300);
});

// ===== رصد تغییرات با MutationObserver (فقط childList) =====
function setupObserver() {
    const tileContainer = document.querySelector('.tile-container');
    if (!tileContainer) {
        setTimeout(setupObserver, 200);
        return;
    }

    const observer = new MutationObserver(function(mutations) {
        // فقط زمانی resize کن که تایل جدید اضافه شده باشد (نه تغییر attribute)
        let hasNewTile = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                hasNewTile = true;
                break;
            }
        }
        if (hasNewTile) {
            // با تاخیر کم، تا انیمیشن بازی اول انجام بشه
            setTimeout(updateTilePositions, 30);
        }
    });

    observer.observe(tileContainer, {
        childList: true,
        subtree: true
        // attributes رو حذف کردیم تا فقط روی اضافه شدن تایل جدید واکنش نشون بده
    });
}

window.addEventListener('load', function() {
    setTimeout(setupObserver, 300);
});