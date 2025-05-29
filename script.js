// تابع اصلی برای نمایش پروکسی‌ها
async function displayProxies() {
    try {
        const proxyContainer = document.getElementById('proxyContainer');
        proxyContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                در حال بارگذاری لیست پروکسی‌ها...
            </div>
        `;
        
        // دریافت لیست پروکسی‌ها از فایل JSON
        const response = await fetch('proxies.json?v=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error('خطا در دریافت لیست پروکسی‌ها. کد وضعیت: ' + response.status);
        }
        
        const proxies = await response.json();
        
        // پاک کردن پیام در حال بارگذاری
        proxyContainer.innerHTML = '';
        
        // نمایش هر پروکسی
        proxies.forEach(proxy => {
            const proxyItem = document.createElement('div');
            proxyItem.className = 'proxy-item';
            
            if (!proxy.isActive) {
                proxyItem.classList.add('disabled');
                proxyItem.innerHTML = `
                    <div class="proxy-info">
                        <i class="fab fa-telegram proxy-icon"></i>
                        <span class="proxy-name">${proxy.name}</span>
                        <small class="status-badge">(غیرفعال)</small>
                    </div>
                    <button class="connect-button disabled" disabled>
                        <i class="fas fa-ban"></i>
                        ${proxy.message || 'موجود نیست'}
                    </button>
                `;
            } else {
                proxyItem.innerHTML = `
                    <div class="proxy-info">
                        <i class="fab fa-telegram proxy-icon"></i>
                        <span class="proxy-name">${proxy.name}</span>
                    </div>
                    <a href="${proxy.link}" class="connect-button" target="_blank">
                        <i class="fas fa-link"></i>
                        اتصال
                    </a>
                `;
            }
            
            proxyContainer.appendChild(proxyItem);
        });
        
    } catch (error) {
        console.error('خطا:', error);
        document.getElementById('proxyContainer').innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>خطا در بارگذاری لیست پروکسی‌ها</p>
                <small>لطفاً بعداً تلاش کنید یا صفحه را رفرش نمایید</small>
                <button onclick="location.reload()" class="refresh-button">
                    <i class="fas fa-sync-alt"></i> تلاش مجدد
                </button>
            </div>
        `;
    }
}

// رویدادهای صفحه
document.addEventListener('DOMContentLoaded', () => {
    // نمایش سال جاری در فوتر
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // بارگذاری پروکسی‌ها
    displayProxies();
    
    // برای SEO - تغییر عنوان صفحه
    document.addEventListener('visibilitychange', function() {
        document.title = document.hidden 
            ? "❗ پروکسی رایگان | برگردید!" 
            : "پروکسی تلگرام - فیلترشکن رایگان - فیلترشکن پرسرعت";
    });
    
    // افزودن افکت ripple به دکمه‌ها
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('connect-button') || 
            e.target.classList.contains('vpn-button') ||
            e.target.closest('.connect-button') || 
            e.target.closest('.vpn-button')) {
            
            const button = e.target.classList.contains('connect-button') || 
                          e.target.classList.contains('vpn-button') 
                          ? e.target 
                          : e.target.closest('.connect-button') || 
                            e.target.closest('.vpn-button');
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            
            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
            ripple.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
});