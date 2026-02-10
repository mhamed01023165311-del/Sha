// بيانات الموقع
let siteData = {};
let currentPage = 'profile';

// أوامر لوحة التحكم
const adminCommands = {
    // تحميل الصفحة المطلوبة
    loadPage: function(page) {
        currentPage = page;
        updateEditorTitle(page);
        loadEditorContent(page);
    },
    
    // حفظ التغييرات
    saveChanges: function() {
        if (!confirm('هل تريد حفظ التغييرات؟')) return;
        
        showMessage('جاري حفظ التغييرات...', 'info');
        
        // جمع البيانات من النموذج
        const formData = collectFormData();
        
        // تحديث البيانات
        updateSiteData(formData);
        
        // حفظ في localStorage
        localStorage.setItem('siteData', JSON.stringify(siteData));
        
        // تحديث المعاينة
        refreshPreview();
        
        showMessage('✅ تم حفظ التغييرات بنجاح', 'success');
        
        // تحديث تاريخ التعديل
        updateLastUpdate();
    },
    
    // رفع صورة
    uploadImage: function(inputId, previewId) {
        const input = document.getElementById(inputId);
        const file = input.files[0];
        
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('❌ الرجاء اختيار صورة فقط');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // عرض المعاينة
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            
            // حفظ الصورة مؤقتاً
            const imageKey = `${currentPage}_${inputId}`;
            localStorage.setItem(imageKey, e.target.result);
            
            showMessage('✅ تم رفع الصورة بنجاح', 'success');
        };
        
        reader.readAsDataURL(file);
    },
    
    // رفع فيديو
    uploadVideo: function(inputId, previewId) {
        const input = document.getElementById(inputId);
        const file = input.files[0];
        
        if (!file) return;
        
        if (!file.type.startsWith('video/')) {
            alert('❌ الرجاء اختيار فيديو فقط');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // عرض المعاينة
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            
            // حفظ الفيديو مؤقتاً
            const videoKey = `${currentPage}_${inputId}`;
            localStorage.setItem(videoKey, e.target.result);
            
            showMessage('✅ تم رفع الفيديو بنجاح', 'success');
        };
        
        reader.readAsDataURL(file);
    },
    
    // إضافة عنصر جديد (مثل مشروع أو خدمة)
    addNewItem: function(type) {
        const template = getItemTemplate(type);
        const container = document.getElementById(`${type}List`);
        
        if (container) {
            container.insertAdjacentHTML('beforeend', template);
            showMessage(`✅ تم إضافة ${type} جديد`, 'success');
        }
    },
    
    // حذف عنصر
    deleteItem: function(button, type, id) {
        if (!confirm('هل تريد حذف هذا العنصر؟')) return;
        
        const item = button.closest(`.${type}-item`);
        if (item) {
            item.remove();
            showMessage('🗑️ تم الحذف بنجاح', 'info');
        }
    },
    
    // تحديث المعاينة الحية
    refreshPreview: function() {
        const iframe = document.getElementById('livePreview');
        if (iframe) {
            iframe.contentWindow.location.reload();
        }
    },
    
    // تصدير البيانات
    exportData: function() {
        const dataStr = JSON.stringify(siteData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'site-data-backup.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showMessage('📥 تم تصدير نسخة احتياطية', 'success');
    },
    
    // استيراد البيانات
    importData: function(inputId) {
        const input = document.getElementById(inputId);
        const file = input.files[0];
        
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                siteData = importedData;
                localStorage.setItem('siteData', JSON.stringify(siteData));
                
                showMessage('✅ تم استيراد البيانات بنجاح', 'success');
                location.reload();
            } catch (error) {
                alert('❌ ملف غير صالح');
            }
        };
        
        reader.readAsText(file);
    }
};

// دعم اختصارات لوحة المفاتيح
document.addEventListener('keydown', function(e) {
    // Ctrl + S لحفظ التغييرات
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        adminCommands.saveChanges();
    }
    
    // F5 لتحديث المعاينة
    if (e.key === 'F5') {
        e.preventDefault();
        adminCommands.refreshPreview();
    }
    
    // Ctrl + E للتصدير
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        adminCommands.exportData();
    }
});

// تهيئة لوحة التحكم عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تحميل البيانات المخزنة
    loadSiteData();
    
    // إضافة أحداث لأزرار القائمة الجانبية
    document.querySelectorAll('.sidebar-btn').forEach(button => {
        button.addEventListener('click', function() {
            // إزالة التفعيل من جميع الأزرار
            document.querySelectorAll('.sidebar-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // تفعيل الزر المحدد
            this.classList.add('active');
            
            // تحميل الصفحة المحددة
            const page = this.getAttribute('data-page');
            adminCommands.loadPage(page);
        });
    });
    
    // تحديث المعاينة كل دقيقة
    setInterval(() => {
        if (document.getElementById('dashboard') && 
            !document.getElementById('dashboard').classList.contains('hidden')) {
            adminCommands.refreshPreview();
        }
    }, 60000);
    
    // الحفظ التلقائي كل 30 ثانية
    setInterval(() => {
        if (document.getElementById('dashboard') && 
            !document.getElementById('dashboard').classList.contains('hidden')) {
            autoSave();
        }
    }, 30000);
});

// وظائف مساعدة
function loadSiteData() {
    const savedData = localStorage.getItem('siteData');
    if (savedData) {
        siteData = JSON.parse(savedData);
    } else {
        // تحميل البيانات الافتراضية
        fetchDefaultData();
    }
}

async function fetchDefaultData() {
    try {
        const response = await fetch('data/site.json');
        siteData = await response.json();
        localStorage.setItem('siteData', JSON.stringify(siteData));
    } catch (error) {
        console.error('Error loading default data:', error);
        siteData = {};
    }
}

function updateEditorTitle(page) {
    const titles = {
        'profile': '👤 تعديل الملف الشخصي',
        'social': '🔗 روابط التواصل الاجتماعي',
        'skills': '⭐ المهارات والخبرات',
        'photos': '📸 الصور الشخصية',
        'works': '💼 أعمالي ومشاريعي',
        'videos': '🎬 الفيديوهات',
        'home': '🏠 الصفحة الرئيسية',
        'services': '🛠️ الخدمات',
        'cv': '📄 السيرة الذاتية',
        'settings': '⚙️ إعدادات الموقع',
        'security': '🔐 الأمان والصلاحيات'
    };
    
    document.getElementById('editorTitle').textContent = titles[page] || 'تعديل المحتوى';
}

function loadEditorContent(page) {
    const editor = document.getElementById('editorContent');
    editor.innerHTML = getEditorTemplate(page);
}

function getEditorTemplate(page) {
    // قوالب التحرير لكل صفحة
    const templates = {
        'profile': `
            <div class="form-group">
                <label>الاسم الكامل</label>
                <input type="text" id="profileName" value="${siteData.profile?.name || ''}" placeholder="أدخل اسمك الكامل">
            </div>
            
            <div class="form-group">
                <label>المسمى الوظيفي</label>
                <input type="text" id="profileTitle" value="${siteData.profile?.job_title || ''}" placeholder="مطور واجهات أمامية">
            </div>
            
            <div class="form-group">
                <label>نبذة عنك</label>
                <textarea id="profileBio" placeholder="اكتب نبذة مختصرة عنك...">${siteData.profile?.bio || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" id="profileEmail" value="${siteData.profile?.email || ''}" placeholder="email@example.com">
            </div>
            
            <div class="form-group">
                <label>رقم الهاتف</label>
                <input type="tel" id="profilePhone" value="${siteData.profile?.phone || ''}" placeholder="+201234567890">
            </div>
            
            <div class="form-group">
                <label>العنوان</label>
                <input type="text" id="profileLocation" value="${siteData.profile?.location || ''}" placeholder="المدينة، الدولة">
            </div>
            
            <div class="form-group">
                <label>صورة البروفايل</label>
                <div class="upload-area" onclick="document.getElementById('profileImageUpload').click()">
                    <div class="upload-icon">
                        <i class="fas fa-camera"></i>
                    </div>
                    <p>انقر لرفع صورة جديدة</p>
                    <input type="file" id="profileImageUpload" accept="image/*" style="display:none" 
                           onchange="adminCommands.uploadImage('profileImageUpload', 'profileImagePreview')">
                </div>
                <img id="profileImagePreview" class="preview-image" 
                     src="${siteData.profile?.photo || ''}" 
                     style="${siteData.profile?.photo ? '' : 'display:none'}">
            </div>
        `,
        
        'works': `
            <div class="section-title">أعمالي ومشاريعي</div>
            
            <button class="btn-add" onclick="adminCommands.addNewItem('work')">
                <i class="fas fa-plus"></i> إضافة مشروع جديد
            </button>
            
            <div id="workList" class="items-list">
                ${renderWorksList()}
            </div>
            
            <div class="form-group">
                <label>ترتيب العرض</label>
                <select id="worksOrder">
                    <option value="newest">الأحدث أولاً</option>
                    <option value="oldest">الأقدم أولاً</option>
                    <option value="featured">المميز أولاً</option>
                </select>
            </div>
        `,
        
        'settings': `
            <div class="form-group">
                <label>اسم الموقع</label>
                <input type="text" id="siteTitle" value="${siteData.site?.title || ''}">
            </div>
            
            <div class="form-group">
                <label>وصف الموقع</label>
                <textarea id="siteDescription">${siteData.site?.description || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>لون الموقع الرئيسي</label>
                <div class="color-picker">
                    <div class="color-option" style="background:#ff5722;" onclick="selectColor('#ff5722')"></div>
                    <div class="color-option" style="background:#2196F3;" onclick="selectColor('#2196F3')"></div>
                    <div class="color-option" style="background:#4CAF50;" onclick="selectColor('#4CAF50')"></div>
                    <div class="color-option" style="background:#9C27B0;" onclick="selectColor('#9C27B0')"></div>
                    <div class="color-option" style="background:#FF9800;" onclick="selectColor('#FF9800')"></div>
                    <div class="color-option" style="background:#607D8B;" onclick="selectColor('#607D8B')"></div>
                </div>
                <input type="text" id="siteColor" value="${siteData.site?.theme_color || '#ff5722'}" readonly>
            </div>
            
            <div class="form-group">
                <label>وضع الموقع</label>
                <select id="siteMode">
                    <option value="online" ${siteData.site?.maintenance_mode ? '' : 'selected'}>متاح للجميع</option>
                    <option value="maintenance" ${siteData.site?.maintenance_mode ? 'selected' : ''}>وضع الصيانة</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>تصدير البيانات</label>
                <button class="btn-export" onclick="adminCommands.exportData()">
                    <i class="fas fa-download"></i> تصدير نسخة احتياطية
                </button>
            </div>
            
            <div class="form-group">
                <label>استيراد البيانات</label>
                <input type="file" id="importFile" accept=".json" 
                       onchange="adminCommands.importData('importFile')">
            </div>
        `
    };
    
    return templates[page] || '<p>قاعدة تحميل قريباً...</p>';
}

function renderWorksList() {
    if (!siteData.portfolio?.works) return '<p>لا توجد أعمال بعد</p>';
    
    return siteData.portfolio.works.map(work => `
        <div class="work-item">
            <div class="work-header">
                <h4>${work.title}</h4>
                <button class="btn-delete" onclick="adminCommands.deleteItem(this, 'work', ${work.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <p>${work.description}</p>
            <div class="work-actions">
                <button class="btn-edit" onclick="editWork(${work.id})">
                    <i class="fas fa-edit"></i> تعديل
                </button>
            </div>
        </div>
    `).join('');
}

function collectFormData() {
    const data = {};
    const page = currentPage;
    
    // جمع البيانات حسب الصفحة الحالية
    switch(page) {
        case 'profile':
            data.profile = {
                name: document.getElementById('profileName')?.value || '',
                job_title: document.getElementById('profileTitle')?.value || '',
                bio: document.getElementById('profileBio')?.value || '',
                email: document.getElementById('profileEmail')?.value || '',
                phone: document.getElementById('profilePhone')?.value || '',
                location: document.getElementById('profileLocation')?.value || '',
                photo: siteData.profile?.photo || ''
            };
            break;
            
        case 'settings':
            data.site = {
                title: document.getElementById('siteTitle')?.value || '',
                description: document.getElementById('siteDescription')?.value || '',
                theme_color: document.getElementById('siteColor')?.value || '#ff5722',
                maintenance_mode: document.getElementById('siteMode')?.value === 'maintenance'
            };
            break;
    }
    
    return data;
}

function updateSiteData(newData) {
    // دمج البيانات الجديدة مع القديمة
    siteData = { ...siteData, ...newData };
}

function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        animation: fadeInOut 3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function updateLastUpdate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('lastUpdate').textContent = dateStr;
}

function autoSave() {
    const formData = collectFormData();
    updateSiteData(formData);
    localStorage.setItem('siteData', JSON.stringify(siteData));
    
    // عرض مؤشر الحفظ التلقائي
    const autoSaveIndicator = document.querySelector('.auto-save');
    if (autoSaveIndicator) {
        const originalText = autoSaveIndicator.innerHTML;
        autoSaveIndicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> جاري الحفظ...';
        
        setTimeout(() => {
            autoSaveIndicator.innerHTML = originalText;
        }, 2000);
    }
}

// جعل الدوال متاحة عالمياً
window.adminCommands = adminCommands;
window.checkLogin = function() {
    const password = document.getElementById('adminPass').value;
    if (password === 'admin123') {
        localStorage.setItem('adminAuth', 'true');
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        adminCommands.loadPage('profile');
    } else {
        alert('كلمة السر غير صحيحة');
    }
};
window.logout = function() {
    localStorage.removeItem('adminAuth');
    location.reload();
};
window.saveChanges = adminCommands.saveChanges;
window.refreshPreview = adminCommands.refreshPreview;
window.resetForm = function() {
    if (confirm('هل تريد التراجع عن التغييرات غير المحفوظة؟')) {
        loadEditorContent(currentPage);
    }
};
