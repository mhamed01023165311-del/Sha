<?php
// إعدادات البريد الإلكتروني
$to = "ahmed@example.com"; // ضع بريدك الإلكتروني هنا
$site_name = "بورتفوليو أحمد علي";

// التحقق من إرسال النموذج
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // تنظيف المدخلات
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $phone = htmlspecialchars(trim($_POST['phone']));
    $subject = htmlspecialchars(trim($_POST['subject']));
    $service = htmlspecialchars(trim($_POST['service']));
    $message = htmlspecialchars(trim($_POST['message']));
    
    // التحقق من الحقول المطلوبة
    if (empty($name) || empty($email) || empty($message)) {
        echo "<script>
            alert('الرجاء ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، الرسالة)');
            window.history.back();
        </script>";
        exit;
    }
    
    // التحقق من صحة البريد الإلكتروني
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<script>
            alert('البريد الإلكتروني غير صالح');
            window.history.back();
        </script>";
        exit;
    }
    
    // إذا لم يكن هناك موضوع، استخدم موضوع افتراضي
    if (empty($subject)) {
        $subject = "رسالة جديدة من موقع $site_name";
    }
    
    // بناء نص الرسالة
    $email_message = "تفاصيل الرسالة:\n";
    $email_message .= "==============================\n\n";
    $email_message .= "الاسم: $name\n";
    $email_message .= "البريد الإلكتروني: $email\n";
    $email_message .= "الهاتف: " . ($phone ? $phone : "غير محدد") . "\n";
    $email_message .= "الخدمة المطلوبة: " . ($service ? $service : "غير محدد") . "\n";
    $email_message .= "الموضوع: " . ($subject ? $subject : "غير محدد") . "\n\n";
    $email_message .= "الرسالة:\n";
    $email_message .= "------------------------------\n";
    $email_message .= "$message\n";
    $email_message .= "------------------------------\n\n";
    $email_message .= "تم الإرسال في: " . date("Y-m-d H:i:s") . "\n";
    $email_message .= "من IP: " . $_SERVER['REMOTE_ADDR'];
    
    // إعداد رأس البريد
    $headers = "From: $site_name <noreply@ahmedali.com>\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // إرسال البريد
    if (mail($to, $subject, $email_message, $headers)) {
        // حفظ البيانات في ملف (اختياري)
        $log_data = date("Y-m-d H:i:s") . " | $name | $email | $phone | $service | $subject\n";
        file_put_contents("contact_log.txt", $log_data, FILE_APPEND);
        
        // معالجة الملف المرفوع إذا وجد
        if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
            $upload_dir = "uploads/";
            $file_name = time() . "_" . basename($_FILES['file']['name']);
            $target_file = $upload_dir . $file_name;
            
            // إنشاء المجلد إذا لم يكن موجوداً
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            
            // نقل الملف المرفوع
            if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
                $log_data = date("Y-m-d H:i:s") . " | تم رفع الملف: $file_name\n";
                file_put_contents("upload_log.txt", $log_data, FILE_APPEND);
            }
        }
        
        // رسالة النجاح
        echo "<!DOCTYPE html>
        <html lang='ar' dir='rtl'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>تم الإرسال بنجاح</title>
            <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'>
            <link href='https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap' rel='stylesheet'>
            <style>
                body {
                    font-family: 'Cairo', sans-serif;
                    background-color: #121212;
                    color: white;
                    text-align: center;
                    padding: 50px 20px;
                    direction: rtl;
                }
                .success-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #1e1e1e;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                .success-icon {
                    font-size: 4rem;
                    color: #4CAF50;
                    margin-bottom: 20px;
                }
                h1 {
                    color: #ff5722;
                    margin-bottom: 20px;
                }
                p {
                    color: #b0b0b0;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                .btn {
                    display: inline-block;
                    background-color: #ff5722;
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .btn:hover {
                    background-color: #e64a19;
                    transform: translateY(-3px);
                }
            </style>
        </head>
        <body>
            <div class='success-container'>
                <div class='success-icon'>
                    <i class='fas fa-check-circle'></i>
                </div>
                <h1>تم إرسال رسالتك بنجاح!</h1>
                <p>شكرًا لك <strong>$name</strong> على تواصلك معنا.<br>لقد استلمنا رسالتك وسنتواصل معك على <strong>$email</strong> في أقرب وقت ممكن.</p>
                <p>عادةً ما يتم الرد خلال 24 ساعة عمل.</p>
                <a href='index.html' class='btn'>
                    <i class='fas fa-home'></i> العودة للصفحة الرئيسية
                </a>
            </div>
        </body>
        </html>";
    } else {
        echo "<script>
            alert('عذرًا، حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى أو التواصل عبر الهاتف.');
            window.history.back();
        </script>";
    }
} else {
    // إذا تم الوصول للصفحة مباشرة بدون نموذج
    header("Location: contact.html");
    exit;
}
?>
