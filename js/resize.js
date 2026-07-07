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
    const gap = 15; // همان grid-spacing در CSS

    // محاسبه‌ی اندازه‌ی هر سلول بر اساس عرض و ارتفاع
    const innerSize = size - (padding * 2);
    const cellSize = (innerSize - (gap * (4 - 1))) / 4;

    // به‌روزرسانی اندازه‌ی grid-cell‌ها
    gridCells.forEach(cell => {
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        cell.style.marginRight = gap + 'px';
    });

    // حذف margin-right از آخرین سلول هر ردیف (با استفاده از کلاس)
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
            // تنظیم فونت بر اساس اندازه‌ی سلول
            let fontSize = Math.min(cellSize * 0.5, 55);
            if (cellSize < 60) fontSize = cellSize * 0.35;
            inner.style.fontSize = fontSize + 'px';
        }
        // به‌روزرسانی موقعیت تایل‌ها (با استفاده از کلاس‌های position)
        // این کار توسط خود بازی انجام می‌شود، اما ما اطمینان حاصل می‌کنیم که transform صحیح است
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

    // به‌روزرسانی موقعیت‌های تایل‌ها (اگر تایل جدیدی اضافه شد)
    // این کار توسط خود بازی انجام می‌شود، اما ما یک بار دیگر موقعیت‌ها را تنظیم می‌کنیم
}

// بارگذاری اولیه بعد از اتمام بارگذاری صفحه
window.addEventListener('load', function() {
    // کمی تاخیر برای اطمینان از رندر شدن بازی
    setTimeout(resizeTiles, 100);
});

// تنظیم مجدد در هنگام تغییر اندازه‌ی پنجره
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeTiles, 150);
});

// همچنین در هنگام چرخش صفحه در موبایل
window.addEventListener('orientationchange', function() {
    setTimeout(resizeTiles, 300);
});