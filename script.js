// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تحديث سنة حقوق النشر
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('#currentYear');
    
    yearElements.forEach(element => {
        if (element) {
            element.textContent = currentYear;
        }
    });
    
    // تعريف العناصر
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    // تحديث الروابط النشطة
    function updateActiveLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // تحديث قائمة التنقل العلوية
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (currentPage === linkHref || 
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // تحديث الشريط الجانبي
        sidebarLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (currentPage === linkHref || 
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // تحديث الروابط عند تحميل الصفحة
    updateActiveLinks();
    
    // إضافة تأثيرات عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر لإضافة تأثيرات
    document.querySelectorAll('.feature-card, .work-item, .service-card, .step, .portfolio-item').forEach(el => {
        observer.observe(el);
    });
    
    // إضافة CSS للـ fade-in
    const fadeInStyles = `
        .fade-in {
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = fadeInStyles;
    document.head.appendChild(styleSheet);
    
    // تأثير سلس للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// دالة للتحقق من النموذج
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#f44336';
            
            // إزالة التأثير عند التركيز
            field.addEventListener('focus', function() {
                this.style.borderColor = 'var(--primary-color)';
            });
        }
    });
    
    if (!isValid) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return false;
    }
    
    return true;
                          }

// ==========================================
// 🎮 نظام الدخول السري الكامل - (أضف في نهاية script.js)
// ==========================================

(function() {
    'use strict';
    
    console.log('%c🔐 نظام الدخول السري نشط!', 'color: #ff5722; font-size: 14px; font-weight: bold;');
    console.log('%c💡 جرب: اضغط مطولاً على الصفحة الرئيسية', 'color: #4CAF50; font-size: 12px;');
    
    // ============================
    // 🔧 الإعدادات
    // ============================
    const SECRET_SETTINGS = {
        // الكود السري بالضغطات
        CLICK_CODE: ['home', 'home', 'cv', 'portfolio', 'portfolio'],
        
        // كلمات المرور
        PASSWORD: 'admin123',
        USERNAME: 'admin',
        
        // أوقات الضغط الطويل (بالملي ثانية)
        LONG_PRESS_TIME: 10000, // 10 ثواني للصفحة الرئيسية
        LOGO_PRESS_TIME: 3000,  // 3 ثواني للشعار
        
        // اختصارات لوحة المفاتيح
        KEYBOARD_SHORTCUT: 'Control+Shift+A', // Ctrl+Shift+A
        ALT_SHORTCUT: 'Alt+M+S' // Alt+M+S
    };
    
    // ============================
    // 📦 المتغيرات العامة
    // ============================
    let userClickSequence = [];
    let longPressTimer = null;
    let isLongPressing = false;
    let secretTriggered = false;
    
    // ============================
    // 🚀 تهيئة النظام
    // ============================
    function initSecretSystem() {
        // 1. تتبع الضغطات على الروابط
        setupClickTracking();
        
        // 2. إعداد الضغط الطويل على الصفحة الرئيسية
        setupLongPressOnHome();
        
        // 3. إعداد الضغط الطويل على الشعار
        setupLongPressOnLogo();
        
        // 4. إعداد اختصارات لوحة المفاتيح
        setupKeyboardShortcuts();
        
        // 5. إضافة تلميحات خفية
        addSecretHints();
        
        console.log('%c✅ نظام الدخول السري جاهز!', 'color: #4CAF50; font-size: 12px;');
    }
    
    // ============================
    // 🖱️ 1. تتبع الضغطات على الروابط
    // ============================
    function setupClickTracking() {
        const allLinks = document.querySelectorAll('a[href*=".html"], .nav-link, .page-link');
        
        allLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                let pageName = extractPageName(href);
                
                if (pageName) {
                    userClickSequence.push(pageName);
                    
                    // الاحتفاظ بآخر 7 ضغطات فقط
                    if (userClickSequence.length > 7) {
                        userClickSequence.shift();
                    }
                    
                    console.log(`📝 تسلسل الضغطات: ${userClickSequence.join(' ← ')}`);
                    
                    // التحقق من الكود السري
                    checkClickSequence();
                }
            });
        });
    }
    
    // ============================
    // ⏱️ 2. الضغط الطويل على الصفحة الرئيسية
    // ============================
    function setupLongPressOnHome() {
        // إذا كنا في الصفحة الرئيسية
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/' || 
            document.querySelector('body.home')) {
            
            const homePage = document.body;
            
            // بدء الضغط الطويل
            homePage.addEventListener('mousedown', startLongPress);
            homePage.addEventListener('touchstart', startLongPress);
            
            // إلغاء الضغط الطويل
            homePage.addEventListener('mouseup', cancelLongPress);
            homePage.addEventListener('mouseleave', cancelLongPress);
            homePage.addEventListener('touchend', cancelLongPress);
            homePage.addEventListener('touchcancel', cancelLongPress);
            
            // مؤشر الضغط الطويل
            createLongPressIndicator();
        }
    }
    
    function startLongPress() {
        if (isLongPressing || secretTriggered) return;
        
        isLongPressing = true;
        
        // بدء المؤشر
        showLongPressIndicator();
        
        // بدء العد التنازلي
        longPressTimer = setTimeout(() => {
            if (isLongPressing) {
                console.log('🎯 تم الضغط الطويل لمدة 10 ثواني!');
                showSecretLogin('🦆 بطه! لقد اكتشفت السر!');
                isLongPressing = false;
                secretTriggered = true;
                hideLongPressIndicator();
            }
        }, SECRET_SETTINGS.LONG_PRESS_TIME);
    }
    
    function cancelLongPress() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        isLongPressing = false;
        hideLongPressIndicator();
    }
    
    // ============================
    // 🏷️ 3. الضغط الطويل على الشعار
    // ============================
    function setupLongPressOnLogo() {
        const logo = document.querySelector('.logo, .site-logo, header h1, .navbar-brand, .brand');
        
        if (logo) {
            let logoPressTimer;
            
            logo.addEventListener('mousedown', function() {
                logoPressTimer = setTimeout(() => {
                    console.log('🏷️ تم الضغط على الشعار لمدة 3 ثواني!');
                    showSecretLogin('🔐 مدخل الشعار السري!');
                }, SECRET_SETTINGS.LOGO_PRESS_TIME);
            });
            
            logo.addEventListener('mouseup', function() {
                clearTimeout(logoPressTimer);
            });
            
            logo.addEventListener('touchstart', function() {
                logoPressTimer = setTimeout(() => {
                    console.log('🏷️ تم الضغط على الشعار لمدة 3 ثواني!');
                    showSecretLogin('🔐 مدخل الشعار السري!');
                }, SECRET_SETTINGS.LOGO_PRESS_TIME);
            });
            
            logo.addEventListener('touchend', function() {
                clearTimeout(logoPressTimer);
            });
        }
    }
    
    // ============================
    // ⌨️ 4. اختصارات لوحة المفاتيح
    // ============================
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl + Shift + A
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                console.log('⌨️ تم تفعيل Ctrl+Shift+A');
                showSecretLogin('⌨️ مدخل لوحة المفاتيح!');
            }
            
            // Alt + M + S
            if (e.altKey && e.key === 'm') {
                // ننتظر الضغط على S بعد M
                document.addEventListener('keydown', function sListener(e2) {
                    if (e2.key === 's') {
                        e2.preventDefault();
                        console.log('⌨️ تم تفعيل Alt+M+S');
                        showSecretLogin('🎮 مدخل المبرمج!');
                        document.removeEventListener('keydown', sListener);
                    }
                }, { once: true });
            }
            
            // Konami Code (للألعاب القديمة)
            const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                               'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                               'b', 'a'];
            let konamiIndex = 0;
            
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    console.log('🎮 Konami Code مفعل!');
                    showSecretLogin('🎮 الكود السري للألعاب!');
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }
    
    // ============================
    // 🔍 5. التلميحات الخفية
    // ============================
    function addSecretHints() {
        // إضافة تلميح في الكونسول
        console.log('%c🔍 تلميحات سرية:', 'color: #FF9800; font-weight: bold;');
        console.log('%c1. اضغط مرتين على الرئيسية، ثم السيرة، ثم مرتين على الأعمالي', 'color: #9C27B0;');
        console.log('%c2. اضغط مطولاً على الصفحة الرئيسية (10 ثواني)', 'color: #2196F3;');
        console.log('%c3. اضغط مطولاً على الشعار (3 ثواني)', 'color: #4CAF50;');
        console.log('%c4. اضغط Ctrl+Shift+A في أي مكان', 'color: #FF5722;');
        
        // تلميح خفي في الفوتر
        setTimeout(() => {
            const footer = document.querySelector('footer, .site-footer, .footer');
            if (footer && !document.querySelector('.secret-hint')) {
                const hint = document.createElement('div');
                hint.className = 'secret-hint';
                hint.innerHTML = `
                    <style>
                        .secret-hint {
                            text-align: center;
                            margin-top: 20px;
                            padding: 10px;
                            background: rgba(255, 87, 34, 0.1);
                            border-radius: 8px;
                            border: 1px dashed rgba(255, 87, 34, 0.3);
                            animation: pulse 2s infinite;
                        }
                        @keyframes pulse {
                            0% { opacity: 0.7; }
                            50% { opacity: 1; }
                            100% { opacity: 0.7; }
                        }
                    </style>
                    <p style="color: #ffcc80; font-size: 0.9rem; margin: 0;">
                        <i class="fas fa-lightbulb"></i> 
                        هل تعرف؟ جرب الضغط مطولاً على الصفحة...
                    </p>
                `;
                footer.appendChild(hint);
                
                // إخفاء التلميح بعد 30 ثانية
                setTimeout(() => {
                    hint.style.opacity = '0';
                    hint.style.transition = 'opacity 1s';
                    setTimeout(() => hint.remove(), 1000);
                }, 30000);
            }
        }, 5000);
    }
    
    // ============================
    // 🎯 التحقق من تسلسل الضغطات
    // ============================
    function checkClickSequence() {
        if (userClickSequence.length < SECRET_SETTINGS.CLICK_CODE.length) return;
        
        // التحقق من آخر 5 ضغطات
        const lastFive = userClickSequence.slice(-SECRET_SETTINGS.CLICK_CODE.length);
        
        if (JSON.stringify(lastFive) === JSON.stringify(SECRET_SETTINGS.CLICK_CODE)) {
            console.log('🎯 الكود السري صحيح!');
            showSecretLogin('🎮 لقد اكتشفت التسلسل السري!');
            userClickSequence = [];
            secretTriggered = true;
        }
    }
    
    // ============================
    // 🖼️ عرض نافذة الدخول السرية
    // ============================
    function showSecretLogin(title = '🚪 المدخل السري!') {
        if (document.querySelector('.secret-login-overlay')) return;
        
        // إنشاء الطبقة الخلفية
        const overlay = document.createElement('div');
        overlay.className = 'secret-login-overlay';
        
        // إنشاء نافذة الدخول
        const loginWindow = document.createElement('div');
        loginWindow.className = 'secret-login-window';
        
        // إضافة الأنيميشن
        const style = document.createElement('style');
        style.textContent = `
            .secret-login-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                backdrop-filter: blur(10px);
                z-index: 9998;
                animation: secretFadeIn 0.3s ease;
            }
            
            .secret-login-window {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                padding: 40px;
                border-radius: 20px;
                border: 3px solid #ff5722;
                z-index: 9999;
                width: 90%;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(255,87,34,0.4);
                animation: secretSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            @keyframes secretFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes secretSlideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -60%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            .secret-title {
                color: #ff5722;
                font-size: 1.8rem;
                margin-bottom: 10px;
            }
            
            .secret-input {
                width: 100%;
                padding: 15px;
                margin: 10px 0;
                background: rgba(255,255,255,0.1);
                border: 2px solid #444;
                border-radius: 10px;
                color: white;
                font-size: 1rem;
                font-family: 'Cairo', sans-serif;
                transition: all 0.3s;
            }
            
            .secret-input:focus {
                outline: none;
                border-color: #ff5722;
                background: rgba(255,255,255,0.15);
                box-shadow: 0 0 0 3px rgba(255,87,34,0.1);
            }
            
            .secret-btn {
                padding: 15px 30px;
                margin: 10px 5px;
                border: none;
                border-radius: 10px;
                font-family: 'Cairo', sans-serif;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .secret-btn-primary {
                background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%);
                color: white;
            }
            
            .secret-btn-secondary {
                background: #555;
                color: white;
            }
            
            .secret-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            }
            
            .secret-hint-box {
                margin-top: 25px;
                padding: 15px;
                background: rgba(255,87,34,0.1);
                border-radius: 10px;
                border: 1px dashed rgba(255,87,34,0.3);
                animation: hintPulse 2s infinite;
            }
            
            @keyframes hintPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .duck-animation {
                font-size: 4rem;
                animation: duckFloat 3s infinite ease-in-out;
            }
            
            @keyframes duckFloat {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(5deg); }
            }
        `;
        
        // محتوى النافذة
        loginWindow.innerHTML = `
            <div style="margin-bottom: 30px;">
                <div class="duck-animation">🦆</div>
                <h2 class="secret-title">${title}</h2>
                <p style="color: #aaa; margin-bottom: 5px;">أدخل بيانات الدخول للوصول إلى لوحة التحكم</p>
                <p style="color: #888; font-size: 0.9rem;">(admin / admin123)</p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <input type="text" 
                       id="secretUsername" 
                       class="secret-input" 
                       placeholder="اسم المستخدم"
                       value="admin">
                
                <input type="password" 
                       id="secretPassword" 
                       class="secret-input" 
                       placeholder="كلمة المرور"
                       value="admin123">
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="secretLoginBtn" class="secret-btn secret-btn-primary">
                    <i class="fas fa-sign-in-alt"></i> دخول
                </button>
                <button id="secretCancelBtn" class="secret-btn secret-btn-secondary">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
            
            <div class="secret-hint-box">
                <p style="color: #ffcc80; font-size: 0.9rem; margin: 0;">
                    <i class="fas fa-key"></i> 
                    الطرق السرية: 1) الضغطات 2) الضغط الطويل 3) Ctrl+Shift+A
                </p>
            </div>
        `;
        
        // إضافة العناصر للصفحة
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        document.body.appendChild(loginWindow);
        
        // التركيز على حقل كلمة المرور
        setTimeout(() => {
            document.getElementById('secretPassword').focus();
        }, 300);
        
        // أحداث الأزرار
        document.getElementById('secretLoginBtn').addEventListener('click', handleSecretLogin);
        document.getElementById('secretCancelBtn').addEventListener('click', closeSecretLogin);
        
        // إغلاق بالضغط على الخلفية
        overlay.addEventListener('click', closeSecretLogin);
        
        // إغلاق بالزر ESC
        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') {
                closeSecretLogin();
                document.removeEventListener('keydown', closeOnEsc);
            }
            
            // دخول بالزر Enter
            if (e.key === 'Enter') {
                handleSecretLogin();
            }
        });
        
        // صوت ممتع عند الظهور (اختياري)
        playSecretSound();
    }
    
    // ============================
    // 🔐 معالجة الدخول السري
    // ============================
    function handleSecretLogin() {
        const username = document.getElementById('secretUsername').value;
        const password = document.getElementById('secretPassword').value;
        
        if (username === SECRET_SETTINGS.USERNAME && password === SECRET_SETTINGS.PASSWORD) {
            // حفظ حالة الدخول
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminSecretAccess', 'true');
            localStorage.setItem('secretUnlockTime', new Date().toISOString());
            
            // رسالة نجاح
            showSuccessMessage();
            
            // الانتقال بعد ثانيتين
            setTimeout(() => {
                window.location.href = 'admin/';
            }, 2000);
        } else {
            // رسالة خطأ مع اهتزاز
            showErrorMessage();
        }
    }
    
    function showSuccessMessage() {
        const loginWindow = document.querySelector('.secret-login-window');
        if (loginWindow) {
            loginWindow.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 4rem; color: #4CAF50; margin-bottom: 20px;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2 style="color: #4CAF50;">✅ تم الدخول بنجاح!</h2>
                    <p style="color: #aaa;">جاري التحويل إلى لوحة التحكم...</p>
                    <div style="margin-top: 30px;">
                        <div style="width: 100%; height: 4px; background: #333; border-radius: 2px;">
                            <div id="progressBar" style="width: 0%; height: 100%; background: #4CAF50; border-radius: 2px; transition: width 2s linear;"></div>
                        </div>
                    </div>
                </div>
            `;
            
            // شريط التقدم
            setTimeout(() => {
                document.getElementById('progressBar').style.width = '100%';
            }, 100);
        }
    }
    
    function showErrorMessage() {
        const inputs = document.querySelectorAll('.secret-input');
        inputs.forEach(input => {
            input.style.animation = 'none';
            setTimeout(() => {
                input.style.animation = 'shake 0.5s';
            }, 10);
        });
        
        // إضافة أنيميشن الاهتزاز
        const shakeStyle = document.createElement('style');
        shakeStyle.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(shakeStyle);
        
        // عرض رسالة خطأ
        const errorMsg = document.createElement('div');
        errorMsg.innerHTML = `
            <div style="background: rgba(244, 67, 54, 0.2); color: #F44336; 
                        padding: 10px; border-radius: 8px; margin-top: 15px;
                        border: 1px solid rgba(244, 67, 54, 0.3);">
                <i class="fas fa-exclamation-circle"></i> بيانات الدخول غير صحيحة!
            </div>
        `;
        
        const hintBox = document.querySelector('.secret-hint-box');
        if (hintBox) {
            hintBox.parentNode.insertBefore(errorMsg, hintBox);
            
            // إزالة رسالة الخطأ بعد 3 ثواني
            setTimeout(() => {
                errorMsg.style.opacity = '0';
                errorMsg.style.transition = 'opacity 0.5s';
                setTimeout(() => errorMsg.remove(), 500);
            }, 3000);
        }
    }
    
    function closeSecretLogin() {
        const overlay = document.querySelector('.secret-login-overlay');
        const window = document.querySelector('.secret-login-window');
        
        if (overlay) overlay.remove();
        if (window) window.remove();
        
        // إعادة تعيين المتغير
        secretTriggered = false;
    }
    
    // ============================
    // ⏳ مؤشر الضغط الطويل
    // ============================
    function createLongPressIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'longPressIndicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: rgba(255, 87, 34, 0.2);
            border-radius: 50%;
            border: 3px solid rgba(255, 87, 34, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9997;
            backdrop-filter: blur(5px);
        `;
        indicator.innerHTML = `
            <div style="color: #ff5722; font-size: 1.5rem;">
                <i class="fas fa-hand-point-down"></i>
            </div>
            <div id="pressTimer" style="position: absolute; color: white; font-size: 0.8rem; font-weight: bold;">
                10s
            </div>
        `;
        document.body.appendChild(indicator);
    }
    
    function showLongPressIndicator() {
        const indicator = document.getElementById('longPressIndicator');
        const timerText = document.getElementById('pressTimer');
        
        if (indicator) {
            indicator.style.display = 'flex';
            
            // عد تنازلي
            let timeLeft = SECRET_SETTINGS.LONG_PRESS_TIME / 1000;
            const countdown = setInterval(() => {
                if (!isLongPressing) {
                    clearInterval(countdown);
                    return;
                }
                
                timeLeft--;
                if (timerText) {
                    timerText.textContent = `${timeLeft}s`;
                    timerText.style.color = timeLeft <= 3 ? '#ff5722' : 'white';
                }
                
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                }
            }, 1000);
        }
    }
    
    function hideLongPressIndicator() {
        const indicator = document.getElementById('longPressIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
    
    // ============================
    // 🔊 صوت سري (اختياري)
    // ============================
    function playSecretSound() {
        // يمكنك إضافة صوت إذا أردت
        console.log('🔊 صوت سري مفعل!');
    }
    
    // ============================
    // 🛠️ دوال مساعدة
    // ============================
    function extractPageName(href) {
        if (!href) return null;
        
        // استخراج اسم الصفحة من الرابط
        let page = href.replace('.html', '')
                      .replace('/', '')
                      .replace('#', '')
                      .toLowerCase();
        
        // تحويل الأسماء العربية
        const pageMap = {
            'index': 'home',
            'الرئيسية': 'home',
            'home': 'home',
            'about': 'about',
            'عن': 'about',
            'portfolio': 'portfolio',
            'أعمالي': 'portfolio',
            'works': 'portfolio',
            'cv': 'cv',
            'سيرة': 'cv',
            'السيرة': 'cv',
            'services': 'services',
            'خدماتي': 'services',
            'contact': 'contact',
            'اتصل': 'contact'
        };
        
        return pageMap[page] || page;
    }
    
    // ============================
    // 🚀 تشغيل النظام
    // ============================
    // الانتظار حتى تحميل الصفحة بالكامل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecretSystem);
    } else {
        initSecretSystem();
    }
    
})();
