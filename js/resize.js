// =============================================
// resize.js - تنظیم پویای اندازه‌ی تایل‌ها برای 2048
// =============================================

function resizeTiles() {
    const container = document.querySelector('.game-container');
    const gridContainer = document.querySelector('.grid-container');
    const tileContainer = document.querySelector('.tile-container');
    const gridCells = document.querySelectorAll('.grid-cell');
    const tiles = document.querySelectorAll('.tile');

    if (!container || !gridContainer || !tileContainer) return;

    // محاسبه‌ی اندازه‌ی واقعی کانتینر (با احتساب padding)
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    const size = Math.min(containerWidth, containerHeight);

    // فضای داخلی (padding) و فاصله‌ی بین سلول‌ها (gap)
    const padding = parseFloat(getComputedStyle(container).padding) || 15;
    const gap = 15;

    // محاسبه‌ی اندازه‌ی هر سلول بر اساس عرض و ارتفاع
    const innerSize = size - (padding * 2);
    const cellSize = (innerSize - (gap * (4 - 1))) / 4;

    // به‌روزرسانی اندازه‌ی grid-cell‌ها
    gridCells.forEach(cell => {
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        cell.style.marginRight = gap + 'px';
    });

    // حذف margin-right از آخرین سلول هر ردیف
    gridCells.forEach((cell, index) => {
        if ((index + 1) % 4 === 0) {
            cell.style.marginRight = '0px';
        }
    });

    // به‌روزرسانی اندازه‌ی تایل‌ها
    tiles.forEach(tile => {
        const inner = tile.querySelector('.tile-inner');
        if (inner) {
            inner.style.width = cellSize + 'px';
            inner.style.height = cellSize + 'px';
            inner.style.lineHeight = cellSize + 'px';
            let fontSize = Math.min(cellSize * 0.5, 55);
            if (cellSize < 60) fontSize = cellSize * 0.35;
            inner.style.fontSize = fontSize + 'px';
        }
        // به‌روزرسانی موقعیت تایل‌ها
        const classes = tile.className.split(' ');
        const posClass = classes.find(c => c.startsWith('tile-position-'));
        if (posClass) {
            const parts = posClass.split('-');
            const x = parseInt(parts[2]) - 1;
            const y = parseInt(parts[3]) - 1;
            const translateX = x * (cellSize + gap);
            const translateY = y * (cellSize + gap);
            tile.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    });
}

// ===== اجرای resize در زمان‌های مختلف =====

// ۱. بارگذاری اولیه
window.addEventListener('load', function() {
    setTimeout(resizeTiles, 100);
});

// ۲. تغییر اندازه‌ی پنجره
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeTiles, 150);
});

// ۳. چرخش صفحه در موبایل
window.addEventListener('orientationchange', function() {
    setTimeout(resizeTiles, 300);
});

// ===== ۴. رصد تغییرات تایل‌ها با MutationObserver =====
// این قسمت باعث می‌شود هر زمان تایل جدیدی ساخته شد، resize دوباره اجرا شود

let observerTimeout;

function setupMutationObserver() {
    const tileContainer = document.querySelector('.tile-container');
    if (!tileContainer) {
        // اگر تایل‌کانتینر هنوز ساخته نشده، دوباره تلاش کن
        setTimeout(setupMutationObserver, 200);
        return;
    }

    // یک observer برای تغییرات در tile-container
    const observer = new MutationObserver(function(mutations) {
        // فقط اگر تایل جدیدی اضافه شده یا تغییری کرده
        let shouldResize = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldResize = true;
            }
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                shouldResize = true;
            }
        });
        if (shouldResize) {
            clearTimeout(observerTimeout);
            observerTimeout = setTimeout(resizeTiles, 50);
        }
    });

    // شروع رصد تغییرات در tile-container و زیرالمان‌هایش
    observer.observe(tileContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
}

// راه‌اندازی observer بعد از بارگذاری کامل
window.addEventListener('load', function() {
    setTimeout(setupMutationObserver, 200);
});