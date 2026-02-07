// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تحديث سنة حقوق النشر
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // تعريف العناصر
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const bottomNavLinks = document.querySelectorAll('.bottom-nav a');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // تبديل قائمة الهاتف
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // إغلاق القائمة عند النقر على رابط
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) {
                    navToggle.querySelector('i').classList.add('fa-bars');
                    navToggle.querySelector('i').classList.remove('fa-times');
                }
            }
            
            // تحديث الرابط النشط
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // تحديد الصفحة النشطة في الشريط الجانبي
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    sidebarLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentPage === linkHref || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage.includes(linkHref.replace('.html', ''))) ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // نفس الشيء للبوتوم ناف
    bottomNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentPage === linkHref || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage.includes(linkHref.replace('.html', ''))) ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // تحديث الرابط النشط في قائمة التنقل العلوية
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentPage === linkHref || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage.includes(linkHref.replace('.html', ''))) ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // إضافة تأثيرات عند التمرير (اختياري)
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
    document.querySelectorAll('.feature-card, .work-item').forEach(el => {
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
});
