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
