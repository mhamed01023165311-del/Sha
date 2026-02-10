// ============================
// 📤 رفع الملفات
// ============================
function handleImageUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const file = input.files[0];
    
    if (!file) return;
    
    // التحقق من نوع الملف
    if (!CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        showMessage('❌ نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, GIF, WebP)', 'error');
        return;
    }
    
    // التحقق من حجم الملف
    if (file.size > CONFIG.MAX_IMAGE_SIZE) {
        showMessage(`❌ حجم الصورة كبير جداً. الحد الأقصى: ${CONFIG.MAX_IMAGE_SIZE / 1024 / 1024}MB`, 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // عرض المعاينة
        const preview = document.getElementById(previewId);
        if (preview) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            
            // إظهار زر الحذف
            const deleteBtn = preview.nextElementSibling;
            if (deleteBtn && deleteBtn.classList.contains('btn-delete')) {
                deleteBtn.style.display = 'inline-flex';
            }
        }
        
        // حفظ الصورة في البيانات
        saveImageToData(previewId, e.target.result);
        
        showMessage('✅ تم رفع الصورة بنجاح', 'success');
        unsavedChanges = true;
    };
    
    reader.readAsDataURL(file);
}

function handleBackgroundUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const file = input.files[0];
    
    if (!file) return;
    
    if (!CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        showMessage('❌ نوع الملف غير مدعوم', 'error');
        return;
    }
    
    if (file.size > CONFIG.MAX_IMAGE_SIZE) {
        showMessage(`❌ حجم الصورة كبير جداً`, 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        if (preview) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        
        // حفظ خلفية الصفحة الرئيسية
        if (!siteData.home) siteData.home = {};
        siteData.home.background = e.target.result;
        
        showMessage('✅ تم رفع خلفية الصفحة الرئيسية', 'success');
        unsavedChanges = true;
    };
    
    reader.readAsDataURL(file);
}

function handleMultipleUpload(inputId, previewContainerId) {
    const input = document.getElementById(inputId);
    const files = input.files;
    const container = document.getElementById(previewContainerId);
    
    if (!files.length) return;
    
    container.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        if (!CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
            showMessage(`❌ ملف ${file.name} غير مدعوم`, 'error');
            return;
        }
        
        if (file.size > CONFIG.MAX_IMAGE_SIZE) {
            showMessage(`❌ ملف ${file.name} كبير جداً`, 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgDiv = document.createElement('div');
            imgDiv.style.cssText = `
                width: 120px;
                height: 120px;
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                border: 2px solid #333;
            `;
            
            imgDiv.innerHTML = `
                <img src="${e.target.result}" 
                     style="width: 100%; height: 100%; object-fit: cover;">
                <button onclick="this.parentElement.remove()" 
                        style="position: absolute; top: 5px; left: 5px; 
                               background: rgba(244,67,54,0.9); color: white; 
                               border: none; border-radius: 50%; width: 25px; 
                               height: 25px; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
                <div style="position: absolute; bottom: 0; width: 100%; 
                            background: rgba(0,0,0,0.7); color: white; 
                            padding: 5px; font-size: 0.8rem; text-align: center;">
                    ${file.name.substring(0, 15)}${file.name.length > 15 ? '...' : ''}
                </div>
            `;
            
            container.appendChild(imgDiv);
            
            // حفظ الصور في الأعمال
            saveWorkImage(file.name, e.target.result);
        };
        
        reader.readAsDataURL(file);
    });
    
    if (files.length > 0) {
        showMessage(`✅ تم رفع ${files.length} صورة`, 'success');
        unsavedChanges = true;
    }
}

function handleVideoUpload(inputId, previewContainerId) {
    const input = document.getElementById(inputId);
    const file = input.files[0];
    
    if (!file) return;
    
    if (!CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type)) {
        showMessage('❌ نوع الفيديو غير مدعوم. يرجى اختيار MP4 أو WebM', 'error');
        return;
    }
    
    const maxVideoSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxVideoSize) {
        showMessage('❌ حجم الفيديو كبير جداً', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const container = document.getElementById(previewContainerId);
        
        const videoDiv = document.createElement('div');
        videoDiv.style.cssText = `
            margin-top: 15px;
            background: rgba(255,255,255,0.05);
            padding: 15px;
            border-radius: 10px;
            border: 2px solid #333;
        `;
        
        videoDiv.innerHTML = `
            <video controls style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
                <source src="${e.target.result}" type="${file.type}">
                المتصفح لا يدعم تشغيل الفيديو
            </video>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #aaa; font-size: 0.9rem;">
                    <i class="fas fa-video"></i> ${file.name} (${formatBytes(file.size)})
                </span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #F44336; color: white; border: none; 
                               padding: 5px 15px; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `;
        
        container.appendChild(videoDiv);
        
        // حفظ الفيديو في البيانات
        if (!siteData.videos) siteData.videos = [];
        siteData.videos.push({
            name: file.name,
            url: e.target.result,
            size: file.size,
            type: file.type
        });
        
        showMessage('✅ تم رفع الفيديو بنجاح', 'success');
        unsavedChanges = true;
    };
    
    reader.readAsDataURL(file);
}

function saveImageToData(previewId, imageData) {
    switch(previewId) {
        case 'profileImagePreview':
            if (!siteData.profile) siteData.profile = {};
            siteData.profile.photo = imageData;
            break;
        // يمكن إضافة حالات أخرى هنا
    }
}

function saveWorkImage(filename, imageData) {
    if (!siteData.portfolio) siteData.portfolio = {};
    if (!siteData.portfolio.workImages) siteData.portfolio.workImages = [];
    
    siteData.portfolio.workImages.push({
        name: filename,
        data: imageData,
        uploadDate: new Date().toISOString()
    });
}

function removeImage(previewId) {
    const preview = document.getElementById(previewId);
    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
        
        // إخفاء زر الحذف
        const deleteBtn = preview.nextElementSibling;
        if (deleteBtn && deleteBtn.classList.contains('btn-delete')) {
            deleteBtn.style.display = 'none';
        }
        
        // إزالة الصورة من البيانات
        removeImageFromData(previewId);
        
        showMessage('🗑️ تم حذف الصورة', 'info');
        unsavedChanges = true;
    }
}

function removeImageFromData(previewId) {
    switch(previewId) {
        case 'profileImagePreview':
            if (siteData.profile) {
                delete siteData.profile.photo;
            }
            break;
        case 'homeBgPreview':
            if (siteData.home) {
                delete siteData.home.background;
            }
            break;
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ============================
// 💼 إدارة الأعمال
// ============================
function addNewWork() {
    const worksList = document.getElementById('worksList');
    
    if (!worksList) return;
    
    const newWorkId = Date.now(); // استخدام الطابع الزمني كمعرف فريد
    
    const newWorkHTML = `
        <div class="item-card" data-id="${newWorkId}">
            <div class="item-header">
                <input type="text" class="work-title" 
                       placeholder="عنوان المشروع" 
                       style="background: transparent; border: none; 
                              color: white; font-size: 1.3rem; 
                              font-weight: bold; width: 70%;">
                <div class="item-actions">
                    <button class="btn-save" onclick="saveWork(${newWorkId})">
                        <i class="fas fa-save"></i> حفظ
                    </button>
                    <button class="btn-delete" onclick="deleteWork(${newWorkId})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
            
            <textarea class="work-description" 
                      placeholder="وصف المشروع..." 
                      style="width: 100%; min-height: 100px; 
                             background: rgba(255,255,255,0.05); 
                             border: 1px solid #444; border-radius: 8px; 
                             padding: 12px; color: white; margin: 10px 0;"></textarea>
            
            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 8px; color: #aaa;">
                    التقنيات المستخدمة (افصل بفواصل)
                </label>
                <input type="text" class="work-technologies" 
                       placeholder="React, Node.js, MongoDB" 
                       style="width: 100%; padding: 10px; 
                              background: rgba(255,255,255,0.05); 
                              border: 1px solid #444; border-radius: 8px; 
                              color: white;">
            </div>
            
            <div style="display: flex; gap: 15px; margin-top: 15px;">
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 8px; color: #aaa;">
                        رابط المشروع
                    </label>
                    <input type="url" class="work-link" 
                           placeholder="https://example.com" 
                           style="width: 100%; padding: 10px; 
                                  background: rgba(255,255,255,0.05); 
                                  border: 1px solid #444; border-radius: 8px; 
                                  color: white;">
                </div>
                
                <div style="flex: 1;">
                    <label style="display: block; margin-bottom: 8px; color: #aaa;">
                        التاريخ
                    </label>
                    <input type="date" class="work-date" 
                           style="width: 100%; padding: 10px; 
                                  background: rgba(255,255,255,0.05); 
                                  border: 1px solid #444; border-radius: 8px; 
                                  color: white;">
                </div>
            </div>
            
            <div style="margin-top: 15px;">
                <label style="display: block; margin-bottom: 8px; color: #aaa;">
                    صورة المشروع
                </label>
                <input type="file" class="work-image" accept="image/*" 
                       onchange="previewWorkImage(this, ${newWorkId})"
                       style="width: 100%; padding: 10px; 
                              background: rgba(255,255,255,0.05); 
                              border: 1px dashed #555; border-radius: 8px; 
                              color: white;">
                <div id="workImagePreview-${newWorkId}" style="margin-top: 10px;"></div>
            </div>
        </div>
    `;
    
    worksList.insertAdjacentHTML('afterbegin', newWorkHTML);
    showMessage('➕ تمت إضافة مشروع جديد', 'info');
}

function saveWork(workId) {
    const workCard = document.querySelector(`.item-card[data-id="${workId}"]`);
    if (!workCard) return;
    
    const title = workCard.querySelector('.work-title')?.value || 'مشروع بدون عنوان';
    const description = workCard.querySelector('.work-description')?.value || '';
    const technologies = workCard.querySelector('.work-technologies')?.value || '';
    const link = workCard.querySelector('.work-link')?.value || '';
    const date = workCard.querySelector('.work-date')?.value || new Date().toISOString().split('T')[0];
    
    // تحويل التقنيات إلى مصفوفة
    const techArray = technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
    
    // إنشاء أو تحديث بيانات العمل
    if (!siteData.portfolio) siteData.portfolio = {};
    if (!siteData.portfolio.works) siteData.portfolio.works = [];
    
    // البحث عن العمل الموجود أو إنشاء جديد
    let workIndex = siteData.portfolio.works.findIndex(w => w.id === workId);
    
    if (workIndex === -1) {
        // عمل جديد
        siteData.portfolio.works.unshift({
            id: workId,
            title: title,
            description: description,
            technologies: techArray,
            link: link,
            date: date,
            featured: true,
            image: '' // سيتم إضافة الصورة لاحقاً
        });
        workIndex = 0;
    } else {
        // تحديث العمل الموجود
        siteData.portfolio.works[workIndex] = {
            ...siteData.portfolio.works[workIndex],
            title: title,
            description: description,
            technologies: techArray,
            link: link,
            date: date
        };
    }
    
    // تحديث العرض
    updateWorkDisplay(workCard, workId, title, description, techArray);
    
    // حفظ البيانات
    saveSiteData();
    showMessage('✅ تم حفظ المشروع', 'success');
    unsavedChanges = true;
}

function updateWorkDisplay(workCard, workId, title, description, technologies) {
    workCard.innerHTML = `
        <div class="item-header">
            <h4>${title}</h4>
            <div class="item-actions">
                <button class="btn-edit" onclick="editWork(${workId})">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn-delete" onclick="deleteWork(${workId})">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        </div>
        <p style="color: #aaa; margin-bottom: 15px;">${description}</p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            ${technologies.map(tech => `
                <span style="background: rgba(255,87,34,0.2); color: #ff5722; 
                      padding: 5px 12px; border-radius: 20px; font-size: 0.9rem;">
                    ${tech}
                </span>
            `).join('')}
        </div>
    `;
}

function editWork(workId) {
    if (!siteData.portfolio?.works) return;
    
    const work = siteData.portfolio.works.find(w => w.id === workId);
    if (!work) return;
    
    // إعادة تحميل محرر الأعمال مع تفعيل التعديل
    loadEditor('works');
    
    // بعد تحميل المحرر، نقوم بتفعيل وضع التعديل
    setTimeout(() => {
        const workCard = document.querySelector(`.item-card[data-id="${workId}"]`);
        if (workCard) {
            workCard.innerHTML = `
                <div class="item-header">
                    <input type="text" class="work-title" value="${work.title}" 
                           style="background: transparent; border: none; 
                                  color: white; font-size: 1.3rem; 
                                  font-weight: bold; width: 70%;">
                    <div class="item-actions">
                        <button class="btn-save" onclick="saveWork(${workId})">
                            <i class="fas fa-save"></i> حفظ
                        </button>
                        <button class="btn-delete" onclick="deleteWork(${workId})">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
                
                <textarea class="work-description" 
                          style="width: 100%; min-height: 100px; 
                                 background: rgba(255,255,255,0.05); 
                                 border: 1px solid #444; border-radius: 8px; 
                                 padding: 12px; color: white; margin: 10px 0;">${work.description || ''}</textarea>
                
                <div style="margin: 15px 0;">
                    <label style="display: block; margin-bottom: 8px; color: #aaa;">
                        التقنيات المستخدمة (افصل بفواصل)
                    </label>
                    <input type="text" class="work-technologies" 
                           value="${work.technologies?.join(', ') || ''}" 
                           style="width: 100%; padding: 10px; 
                                  background: rgba(255,255,255,0.05); 
                                  border: 1px solid #444; border-radius: 8px; 
                                  color: white;">
                </div>
                
                <div style="display: flex; gap: 15px; margin-top: 15px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 8px; color: #aaa;">
                            رابط المشروع
                        </label>
                        <input type="url" class="work-link" 
                               value="${work.link || ''}" 
                               style="width: 100%; padding: 10px; 
                                      background: rgba(255,255,255,0.05); 
                                      border: 1px solid #444; border-radius: 8px; 
                                      color: white;">
                    </div>
                    
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 8px; color: #aaa;">
                            التاريخ
                        </label>
                        <input type="date" class="work-date" 
                               value="${work.date || new Date().toISOString().split('T')[0]}" 
                               style="width: 100%; padding: 10px; 
                                      background: rgba(255,255,255,0.05); 
                                      border: 1px solid #444; border-radius: 8px; 
                                      color: white;">
                    </div>
                </div>
            `;
        }
    }, 100);
}

function deleteWork(workId) {
    if (!confirm('هل تريد حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.')) {
        return;
    }
    
    // إزالة من العرض
    const workCard = document.querySelector(`.item-card[data-id="${workId}"]`);
    if (workCard) {
        workCard.remove();
    }
    
    // إزالة من البيانات
    if (siteData.portfolio?.works) {
        siteData.portfolio.works = siteData.portfolio.works.filter(w => w.id !== workId);
    }
    
    // حفظ التغييرات
    saveSiteData();
    showMessage('🗑️ تم حذف المشروع', 'info');
    unsavedChanges = true;
}

function previewWorkImage(input, workId) {
    const file = input.files[0];
    if (!file) return;
    
    if (!CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        showMessage('❌ نوع الصورة غير مدعوم', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewDiv = document.getElementById(`workImagePreview-${workId}`);
        if (previewDiv) {
            previewDiv.innerHTML = `
                <img src="${e.target.result}" 
                     style="max-width: 200px; border-radius: 10px; border: 2px solid #444;">
                <div style="margin-top: 10px; color: #aaa; font-size: 0.9rem;">
                    <i class="fas fa-image"></i> ${file.name} (${formatBytes(file.size)})
                </div>
            `;
        }
        
        // حفظ الصورة في بيانات العمل
        if (siteData.portfolio?.works) {
            const work = siteData.portfolio.works.find(w => w.id === workId);
            if (work) {
                work.image = e.target.result;
            }
        }
        
        showMessage('✅ تم رفع صورة المشروع', 'success');
        unsavedChanges = true;
    };
    
    reader.readAsDataURL(file);
}

// ============================
// 💾 النسخ الاحتياطي
// ============================
function createBackup() {
    try {
        const backup = {
            timestamp: new Date().toISOString(),
            data: JSON.parse(JSON.stringify(siteData))
        };
        
        const backups = JSON.parse(localStorage.getItem('backups') || '[]');
        backups.unshift(backup);
        
        // الاحتفاظ بـ 10 نسخ فقط
        if (backups.length > 10) {
            backups.pop();
        }
        
        localStorage.setItem('backups', JSON.stringify(backups));
        
        // إعادة تحميل محرر النسخ الاحتياطي
        loadEditor('backup');
        
        showMessage('💾 تم إنشاء نسخة احتياطية جديدة', 'success');
        
    } catch (error) {
        console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
        showMessage('❌ فشل في إنشاء النسخة الاحتياطية', 'error');
    }
}

function restoreBackup(index) {
    if (!confirm('هل تريد استعادة هذه النسخة؟ سيتم استبدال جميع البيانات الحالية.')) {
        return;
    }
    
    try {
        const backups = JSON.parse(localStorage.getItem('backups') || '[]');
        const backup = backups[index];
        
        if (!backup || !backup.data) {
            showMessage('❌ النسخة الاحتياطية غير صالحة', 'error');
            return;
        }
        
        // استعادة البيانات
        siteData = JSON.parse(JSON.stringify(backup.data));
        
        // حفظ البيانات المستعادة
        saveSiteData();
        
        // إعادة تحميل المحرر الحالي
        loadEditor(currentEditor);
        
        showMessage('🔄 تم استعادة النسخة الاحتياطية', 'success');
        
        // تحديث المعاينة
        setTimeout(refreshPreview, 1000);
        
    } catch (error) {
        console.error('خطأ في استعادة النسخة الاحتياطية:', error);
        showMessage('❌ فشل في استعادة النسخة الاحتياطية', 'error');
    }
}

function deleteBackup(index) {
    if (!confirm('هل تريد حذف هذه النسخة الاحتياطية؟')) {
        return;
    }
    
    try {
        const backups = JSON.parse(localStorage.getItem('backups') || '[]');
        backups.splice(index, 1);
        localStorage.setItem('backups', JSON.stringify(backups));
        
        // إعادة تحميل محرر النسخ الاحتياطي
        loadEditor('backup');
        
        showMessage('🗑️ تم حذف النسخة الاحتياطية', 'info');
        
    } catch (error) {
        console.error('خطأ في حذف النسخة الاحتياطية:', error);
        showMessage('❌ فشل في حذف النسخة الاحتياطية', 'error');
    }
}

function exportData() {
    try {
        const dataStr = JSON.stringify(siteData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // إنشاء رابط للتحميل
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mohamedshehab-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        // إضافة الرابط ونقره ثم إزالته
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // تحرير الذاكرة
        URL.revokeObjectURL(url);
        
        showMessage('📥 تم تصدير البيانات بنجاح', 'success');
        
    } catch (error) {
        console.error('خطأ في تصدير البيانات:', error);
        showMessage('❌ فشل في تصدير البيانات', 'error');
    }
}

function importData() {
    const input = document.getElementById('importFile');
    const file = input.files[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
        showMessage('❌ يرجى اختيار ملف JSON فقط', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // التحقق من صحة البيانات
            if (!importedData || typeof importedData !== 'object') {
                throw new Error('ملف غير صالح');
            }
            
            if (confirm('هل تريد استيراد هذه البيانات؟ سيتم استبدال جميع البيانات الحالية.')) {
                // استيراد البيانات
                siteData = importedData;
                saveSiteData();
                
                // إعادة تحميل المحرر الحالي
                loadEditor(currentEditor);
                
                showMessage('📤 تم استيراد البيانات بنجاح', 'success');
                
                // تحديث المعاينة
                setTimeout(refreshPreview, 1000);
            }
            
        } catch (error) {
            console.error('خطأ في استيراد البيانات:', error);
            showMessage('❌ ملف غير صالح أو تالف', 'error');
        }
    };
    
    reader.readAsText(file);
    
    // إعادة تعيين حقل الملف
    input.value = '';
}

// ============================
// 🔄 المعاينة والتحكم
// ============================
function refreshPreview() {
    const iframe = document.getElementById('livePreview');
    if (iframe) {
        // إضافة طابع زمني لمنع التخزين المؤقت
        const timestamp = new Date().getTime();
        iframe.src = `../index.html?preview=${timestamp}`;
        
        showMessage('🔄 جاري تحديث المعاينة...', 'info');
    }
}

function startAutoSave() {
    // إيقاف أي حفظ تلقائي سابق
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    // بدء حفظ تلقائي جديد
    autoSaveInterval = setInterval(() => {
        if (unsavedChanges) {
            saveChanges();
        }
    }, CONFIG.SAVE_DELAY);
    
    console.log('💾 الحفظ التلقائي مفعل كل', CONFIG.SAVE_DELAY / 1000, 'ثانية');
}

function updateLastUpdate() {
    const lastUpdate = localStorage.getItem('lastSaveTime') || new Date().toISOString();
    const date = new Date(lastUpdate);
    const formattedDate = date.toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = formattedDate;
    }
}

// ============================
// 📱 خدمات مساعدة
// ============================
function showMessage(text, type = 'info') {
    // إزالة أي رسالة سابقة
    const existingMsg = document.querySelector('.message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // إنشاء رسالة جديدة
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${getMessageIcon(type)}"></i>
        <span>${text}</span>
    `;
    
    // إضافة الرسالة
    const editorArea = document.querySelector('.editor-area');
    if (editorArea) {
        editorArea.insertBefore(messageDiv, editorArea.firstChild);
    } else {
        document.body.appendChild(messageDiv);
    }
    
    // إزالة الرسالة بعد 5 ثواني
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 500);
        }
    }, 5000);
}

function getMessageIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

function showLoading() {
    // إزالة أي تحميل سابق
    hideLoading();
    
    // إنشاء عنصر التحميل
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'adminLoading';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    loadingDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 4rem; color: #ff5722; margin-bottom: 20px;">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <h2 style="color: white; margin-bottom: 10px;">جاري التحميل...</h2>
            <p style="color: #aaa;">يرجى الانتظار</p>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('adminLoading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// ============================
// 🎮 اختصارات لوحة المفاتيح
// ============================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + S لحفظ
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveChanges();
        }
        
        // Ctrl + R لتحديث المعاينة
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            refreshPreview();
        }
        
        // Ctrl + L لتسجيل الخروج
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            logout();
        }
        
        // F1 للمساعدة
        if (e.key === 'F1') {
            e.preventDefault();
            showHelp();
        }
        
        // Esc لإغلاق النوافذ
        if (e.key === 'Escape') {
            // يمكن إضافة منطق لإغلاق النوافذ المنبثقة
        }
    });
}

function showHelp() {
    const helpContent = `
        <div style="padding: 20px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #ff5722; margin-bottom: 20px;">
                <i class="fas fa-question-circle"></i> مساعدة لوحة التحكم
            </h2>
            
            <h3 style="color: white; margin: 15px 0 10px 0;">اختصارات لوحة المفاتيح:</h3>
            <ul style="color: #aaa; list-style: none; padding: 0;">
                <li style="margin-bottom: 8px;">
                    <span style="background: #333; padding: 3px 8px; border-radius: 4px; margin-left: 10px;">
                        Ctrl + S
                    </span>
                    حفظ التغييرات
                </li>
                <li style="margin-bottom: 8px;">
                    <span style="background: #333; padding: 3px 8px; border-radius: 4px; margin-left: 10px;">
                        Ctrl + R
                    </span>
                    تحديث المعاينة
                </li>
                <li style="margin-bottom: 8px;">
                    <span style="background: #333; padding: 3px 8px; border-radius: 4px; margin-left: 10px;">
                        Ctrl + L
                    </span>
                    تسجيل الخروج
                </li>
                <li style="margin-bottom: 8px;">
                    <span style="background: #333; padding: 3px 8px; border-radius: 4px; margin-left: 10px;">
                        F1
                    </span>
                    عرض المساعدة
                </li>
            </ul>
            
            <h3 style="color: white; margin: 20px 0 10px 0;">معلومات مهمة:</h3>
            <ul style="color: #aaa; list-style: none; padding: 0;">
                <li style="margin-bottom: 8px;">
                    <i class="fas fa-save" style="color: #4CAF50;"></i>
                    يتم الحفظ تلقائياً كل 30 ثانية
                </li>
                <li style="margin-bottom: 8px;">
                    <i class="fas fa-image" style="color: #2196F3;"></i>
                    حجم الصور الأقصى: 5MB
                </li>
                <li style="margin-bottom: 8px;">
                    <i class="fas fa-database" style="color: #FF9800;"></i>
                    يتم حفظ 10 نسخ احتياطية
                </li>
            </ul>
        </div>
    `;
    
    // إنشاء نافذة المساعدة
    const helpOverlay = document.createElement('div');
    helpOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;
    
    helpOverlay.innerHTML = helpContent;
    
    // زر الإغلاق
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        background: #ff5722;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
    `;
    
    closeBtn.onclick = function() {
        helpOverlay.remove();
    };
    
    helpOverlay.appendChild(closeBtn);
    document.body.appendChild(helpOverlay);
    
    // إغلاق عند النقر خارج المحتوى
    helpOverlay.addEventListener('click', function(e) {
        if (e.target === helpOverlay) {
            helpOverlay.remove();
        }
    });
}

// ============================
// 🚀 تهيئة النظام
// ============================
function initAdminPanel() {
    // التحقق من الدخول أولاً
    if (!checkAdminAccess()) {
        return;
    }
    
    // تهيئة نظام لوحة المفاتيح
    initKeyboardShortcuts();
    
    // تحميل البيانات
    loadSiteData();
    
    // بدء الحفظ التلقائي
    startAutoSave();
    
    // تحديث تاريخ التعديل الأخير
    updateLastUpdate();
    
    // رسالة ترحيبية
    setTimeout(() => {
        console.log('%c🚀 لوحة تحكم محمد شهاب جاهزة!', 
                   'color: #4CAF50; font-size: 16px; font-weight: bold;');
        console.log('%c💡 تلميح: اضغط F1 للمساعدة', 
                   'color: #2196F3; font-size: 14px;');
    }, 1000);
}

// ============================
// 📦 تصدير الدوال للاستخدام العام
// ============================
window.login = login;
window.logout = logout;
window.loadEditor = loadEditor;
window.saveChanges = saveChanges;
window.resetForm = resetForm;
window.refreshPreview = refreshPreview;
window.handleImageUpload = handleImageUpload;
window.handleBackgroundUpload = handleBackgroundUpload;
window.handleMultipleUpload = handleMultipleUpload;
window.handleVideoUpload = handleVideoUpload;
window.removeImage = removeImage;
window.addNewWork = addNewWork;
window.saveWork = saveWork;
window.editWork = editWork;
window.deleteWork = deleteWork;
window.selectColor = selectColor;
window.createBackup = createBackup;
window.restoreBackup = restoreBackup;
window.deleteBackup = deleteBackup;
window.exportData = exportData;
window.importData = importData;

// ============================
// 🚀 تشغيل النظام
// ============================
// الانتظار حتى تحميل الصفحة بالكامل
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPanel);
} else {
    initAdminPanel();
}

// التحذير قبل مغادرة الصفحة مع تغييرات غير محفوظة
window.addEventListener('beforeunload', function(e) {
    if (unsavedChanges) {
        const message = 'هناك تغييرات غير محفوظة. هل تريد حقاً مغادرة الصفحة؟';
        e.returnValue = message; // معيار قديم
        return message; // معيار جديد
    }
});
