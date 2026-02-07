// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تحديث سنة حقوق النشر
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // تعريف العناصر
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const contactForm = document.getElementById('contactForm');
    
    // تبديل قائمة الهاتف
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });
    
    // إغلاق القائمة عند النقر على رابط
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.querySelector('i').classList.add('fa-bars');
            navToggle.querySelector('i').classList.remove('fa-times');
            
            // تحديث الرابط النشط
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // تصفية معرض الأعمال
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة النشط من كل الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة النشط للزر المختار
            this.classList.add('active');
            
            // الحصول على قيمة التصفية
            const filterValue = this.getAttribute('data-filter');
            
            // تصفية العناصر
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // إظهار/إخفاء زر العودة للأعلى
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
        
        // تحديث الرابط النشط في القائمة أثناء التمرير
        updateActiveNavLink();
    });
    
    // تحديث الرابط النشط في القائمة
    function updateActiveNavLink() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // إرسال نموذج التواصل (تجريبي)
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // في التطبيق الحقيقي، هنا نرسل البيانات للخادم
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // عرض رسالة نجاح
        alert(`شكرًا ${name}! تم استلام رسالتك بنجاح. سنتواصل معك على ${email} في أقرب وقت.`);
        
        // إعادة تعيين النموذج
        contactForm.reset();
    });
    
    // تحريك سلس للروابط
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
    
    // تأثيرات عند التمرير (لإضافة حركات عند ظهور العناصر)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر لإضافة تأثيرات
    document.querySelectorAll('.service-card, .portfolio-item, .timeline-item').forEach(el => {
        observer.observe(el);
    });
});
