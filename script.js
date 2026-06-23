// script.js – Core Interactivity & Animations for MediCare

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

// ---------- DOM Utility Functions ----------
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ---------- Global State ----------
let currentLang = localStorage.getItem('lang') || 'ar';

// ---------- Translation Dictionary ----------
const translations = {
  en: {
    'logo-text': 'MediCare',
    'nav-home': 'Home',
    'nav-about': 'About',
    'nav-features': 'Features',
    'nav-services': 'Services',
    'nav-doctors': 'Doctors',
    'nav-assistant': 'AI Assistant',
    'nav-faq': 'FAQ',
    'nav-contact': 'Contact',
    'nav-testimonials': 'Testimonials',
    'hero-h1': 'Stay On Top of Your <span>Medications</span>',
    'hero-tagline': 'Smart scheduling, custom alerts, automated refills, AI diagnostics chat, and seamless doctor video appointments in one premium system.',
    'btn-features': 'Explore Features',
    'btn-get-started': 'Get Started',
    'why-title': 'Why Choose <span>MediCare</span>',
    'why-intro': 'Experience the next generation of healthcare reminder systems built with state-of-the-art interaction models.',
    'wh-1-title': 'Smart Notifications',
    'wh-1-desc': 'Adaptive reminders syncing with your phone and wearable devices. Never miss a single dose.',
    'wh-2-title': 'AI Health Assistant',
    'wh-2-desc': 'Interactive diagnostics assistant providing medical insights, dosing tips, and answering drug questions instantly.',
    'wh-3-title': 'Military-Grade Security',
    'wh-3-desc': 'End-to-end encrypted medical sync files and absolute GDPR / HIPAA compliance for total privacy.',
    'learn-more': 'Learn More',
    'chat-ai': 'Chat with AI',
    'view-security': 'View Security',
    'rev-title': 'Revolutionizing Daily <span>Wellness Habits</span>',
    'rev-desc': 'MediCare serves over a million patients globally, reinforcing medication adherence, reducing hospitalizations, and bridging the distance between doctors and patients.',
    'btn-story': 'Read Our Story',
    'stat-adh': 'Adherence Rate',
    'stat-usr': 'Active Users',
    'stat-doc': 'Verified Doctors',
    'stat-rat': 'App Store Rating',
    'footer-brand': 'MediCare © 2026',
    // Subpages
    'about-title': 'About <span>MediCare</span>',
    'about-intro': 'Empowering individuals to establish flawless health routines with advanced scheduling technology and expert care.',
    'mission-h3': 'Our Mission',
    'mission-p1': 'At MediCare, we believe consistency is the absolute foundation of recovery and long-term wellness. Our software is designed to emulate high-end SaaS applications, offering smooth user experiences, customizable schedulers, and zero complex interfaces.',
    'mission-p2': 'By integrating secure patient record syncs, smartwatch push notifications, and a responsive artificial intelligence bot, we support patients in maintaining compliance while keeping their medical practitioners updated in real time.',
    'why-h3': 'Why It Matters',
    'why-p1': 'Clinical studies show that missing medication doses accounts for over 10% of hospital readmissions. By providing interactive, smart reminders that adjust dynamically to calendar settings and daily habits, MediCare mitigates compliance failure rates by up to 85%.',
    'why-p2': 'Our HIPAA-compliant cloud ensures that family alerts, clinic updates, and prescription refills are synchronized across devices instantly.',
    'growth-title': 'Our Growth in <span>Numbers</span>',
    'growth-usr': 'Active Global Users',
    'growth-adh': 'Average Patient Adherence',
    'growth-saves': 'Doses Tracked Monthly',
    // Features
    'feat-title': 'Premium System <span>Features</span>',
    'feat-intro': 'A sleek suite of smart diagnostic utilities, compliance reminders, and security protections tailored to your well-being.',
    'feat-1-title': 'Smart Medication Reminder',
    'feat-1-desc': 'Intelligent, adaptive reminders based on your exact medical prescription schedules, custom dosages, and smart feedback logs.',
    'feat-2-title': 'AI Health Assistant',
    'feat-2-desc': 'Consult with our intelligent diagnostic agent. Retrieve quick dosing guidelines, medication info, and wellness suggestions.',
    'feat-3-title': 'Appointment Booking',
    'feat-3-desc': 'Direct integration with medical calendars. Schedule video consultations or clinic office visits with certified professionals.',
    'feat-4-title': 'Daily Schedule Sync',
    'feat-4-desc': 'A unified visual scheduler dashboard. Real-time synchronizations with local calendars, smartwatches, and medical wristbands.',
    'feat-5-title': 'Health Statistics',
    'feat-5-desc': 'Review comprehensive graphs detailing dose compliance ratios, recovery logs, physiological trackers, and vitals.',
    'feat-6-title': 'Emergency Contacts',
    'feat-6-desc': 'Configure single-tap family notifications, immediate doctor text triggers, and nearby hospital emergency dispatches.',
    'feat-7-title': 'Encrypted Cloud Sync',
    'feat-7-desc': 'Automatic background data synchronizations. Recover schedules instantly on any phone or desktop interface.',
    'feat-8-title': 'Military-Grade Security',
    'feat-8-desc': 'All prescription sheets, patient files, and chat messages are encrypted with advanced end-to-end cryptographic keys.',
    // Services
    'serv-title': 'Our Premium <span>Services</span>',
    'serv-intro': 'Personalized medical software and professional telehealth support custom-tailored for your health consistency.',
    'serv-1-title': 'Medication Management',
    'serv-1-desc': 'Full-scale dosing schedulers, side effect logs, and automated notification syncs across your devices.',
    'serv-2-title': 'Doctor Virtual Care',
    'serv-2-desc': 'Schedule secure in-app video consultation slots with certified physicians and retrieve instant digital scripts.',
    'serv-3-title': 'Vitals & Statistics',
    'serv-3-desc': 'Interactive compliance graphics, blood-sugar / pressure tracks, and weekly reports automatically shared with your clinic.',
    'serv-4-title': 'Cloud Security Vault',
    'serv-4-desc': 'Safeguard logs under certified end-to-end encryptions. Secure cross-device backups with complete profile recovery.',
    'sub-title': 'Subscription <span>Plans</span>',
    'sub-intro': 'Pick a tier that matches your medication tracking and clinic access requirements.',
    // Doctors
    'doc-title': 'Meet Our Expert <span>Doctors</span>',
    'doc-intro': 'Trusted clinical advisors and licensed professionals helping sync your scheduling routines and dosage needs.',
    'doc-1-spec': 'Cardiology Consultant',
    'doc-2-spec': 'Neurology Specialist',
    'doc-3-spec': 'General Practitioner',
    'doc-exp-12': '12+ Years Experience',
    'doc-exp-9': '9+ Years Experience',
    'doc-exp-7': '7+ Years Experience',
    'btn-visit': 'Book Virtual Visit',
    // AI Assistant Page
    'bot-title': 'AI Health <span>Assistant</span>',
    'bot-intro': 'Get immediate guidance on your dosages, drug interactions, and schedule with our intelligent, secure medical bot.',
    'bot-suggest': 'Suggested Inquiries',
    'bot-opt-1': 'Tracking medications',
    'bot-opt-2': 'Drug interactions',
    'bot-opt-3': 'Booking appointments',
    'bot-opt-4': 'Smartwatch sync',
    // FAQ
    'faq-title': 'Frequently Asked <span>Questions</span>',
    'faq-intro': 'Find answers to quick questions about reminders, security settings, AI diagnostics, and appointment handling.',
    // Contact
    'contact-title': 'Get in <span>Touch</span>',
    'contact-intro': 'Have questions about setting up reminders or linking clinical records? Send us a message, and our support team will reply within 24 hours.',
    'contact-send-h3': 'Send a Message',
    'lbl-name': 'Full Name',
    'lbl-email': 'Email Address',
    'lbl-subject': 'Subject',
    'lbl-message': 'Your Message',
    'btn-send': 'Send Message',
    'info-h3': 'Contact Information',
    'info-phone': 'Phone',
    'info-email': 'Email Support',
    'info-head': 'Headquarters',
    // Testimonials
    'test-title': 'What Our Users <span>Say</span>',
    'test-intro': 'Read feedback from patients and clinical practitioners using our medication scheduler globally.'
  },
  ar: {
    'logo-text': 'ميدي كير',
    'nav-home': 'الرئيسية',
    'nav-about': 'من نحن',
    'nav-features': 'الميزات',
    'nav-services': 'الخدمات',
    'nav-doctors': 'الأطباء',
    'nav-assistant': 'المساعد الذكي',
    'nav-faq': 'الأسئلة الشائعة',
    'nav-contact': 'اتصل بنا',
    'nav-testimonials': 'الآراء',
    'hero-h1': 'حافظ على انتظام <span>أدويتك</span>',
    'hero-tagline': 'جدولة ذكية، تنبيهات مخصصة، إعادة تعبئة تلقائية، دردشة تشخيصية ذكية، وحجز مواعيد مع الأطباء عبر الفيديو في نظام متكامل.',
    'btn-features': 'استكشف الميزات',
    'btn-get-started': 'ابدأ الآن',
    'why-title': 'لماذا تختار <span>ميدي كير</span>',
    'why-intro': 'اختبر الجيل القادم من أنظمة تذكير الرعاية الصحية المبنية على نماذج تفاعل متطورة.',
    'wh-1-title': 'التنبيهات الذكية',
    'wh-1-desc': 'تنبيهات متكيفة تتزامن مع هاتفك وأجهزتك القابلة للارتداء. لن تفوت أي جرعة.',
    'wh-2-title': 'المساعد الصحي بالذكاء الاصطناعي',
    'wh-2-desc': 'مساعد تشخيصي تفاعلي يقدم معلومات طبية وإرشادات الجرعات ويجيب عن الأسئلة فوراً.',
    'wh-3-title': 'أمن عسكري المستوى',
    'wh-3-desc': 'تشفير طرف إلى طرف لملفات المزامنة الطبية وامتثال تام لمعايير GDPR و HIPAA للخصوصية المطلقة.',
    'learn-more': 'معرفة المزيد',
    'chat-ai': 'تحدث مع الذكاء الاصطناعي',
    'view-security': 'عرض تفاصيل الأمان',
    'rev-title': 'إحداث ثورة في <span>العادات الصحية</span>',
    'rev-desc': 'يخدم ميدي كير أكثر من مليون مريض حول العالم، مما يعزز الالتزام بالأدوية، ويقلل دخول المستشفيات، ويقرب المسافات بين الأطباء والمرضى.',
    'btn-story': 'اقرأ قصتنا',
    'stat-adh': 'معدل الالتزام',
    'stat-usr': 'المستخدمين النشطين',
    'stat-doc': 'الأطباء المعتمدون',
    'stat-rat': 'تقييم المتجر',
    'footer-brand': 'ميدي كير © ٢٠٢٦',
    // Subpages
    'about-title': 'عن <span>ميدي كير</span>',
    'about-intro': 'تمكين الأفراد من بناء روتين صحي خالٍ من العيوب باستخدام تقنيات الجدولة المتقدمة والرعاية الطبية المتكاملة.',
    'mission-h3': 'مهمتنا',
    'mission-p1': 'في ميدي كير، نؤمن بأن الانتظام هو الأساس المتين للتعافي والعافية على المدى الطويل. تم تصميم برمجياتنا لتضاهي تطبيقات SaaS الفاخرة، وتقدم تجارب مستخدم سلسة وجداول قابلة للتخصيص.',
    'mission-p2': 'من خلال دمج مزامنة السجلات الطبية الآمنة، إشعارات الساعات الذكية، وروبوت الذكاء الاصطناعي، نساعد المرضى على الالتزام بالعلاج مع إبقاء الأطباء على اطلاع دائم.',
    'why-h3': 'لماذا هذا مهم؟',
    'why-p1': 'تشير الدراسات السريرية إلى أن نسيان جرعات الأدوية يتسبب في أكثر من ١٠٪ من حالات إعادة إدخال المستشفيات. يقلل نظام ميدي كير معدلات عدم الالتزام بنسبة تصل إلى ٨٥٪.',
    'why-p2': 'تضمن سحابتنا المتوافقة مع معايير HIPAA مزامنة تنبيهات العائلة، وتحديثات العيادة، وإعادة تعبئة الوصفات الطبية فورياً.',
    'growth-title': 'نمونا في <span>أرقام</span>',
    'growth-usr': 'المستخدمين النشطين عالمياً',
    'growth-adh': 'متوسط التزام المرضى',
    'growth-saves': 'الجرعات المتتبعة شهرياً',
    // Features
    'feat-title': 'ميزات النظام <span>الاستثنائية</span>',
    'feat-intro': 'مجموعة متميزة من الأدوات التشخيصية الذكية، وتنبيهات الالتزام، وحماية البيانات المصممة لعافيتك.',
    'feat-1-title': 'تذكير ذكي بالأدوية',
    'feat-1-desc': 'تنبيهات ذكية متكيفة تعتمد على مواعيد الوصفات الطبية الخاصة بك، والجرعات المحددة، وسجلات التفاعل.',
    'feat-2-title': 'مساعد الصحة الذكي',
    'feat-2-desc': 'استشر وكيلنا التشخيصي الذكي. احصل على إرشادات الجرعات السريعة، ومعلومات الأدوية، ونصائح العافية.',
    'feat-3-title': 'حجز المواعيد الطبية',
    'feat-3-desc': 'تكامل مباشر مع الجداول الطبية. احجز استشارات الفيديو الآمنة أو الزيارات العيادية مع أطباء معتمدين.',
    'feat-4-title': 'مزامنة الجدول اليومي',
    'feat-4-desc': 'لوحة تحكم موحدة للجدولة البصرية. مزامنة فورية مع التقويمات المحلية، والساعات الذكية، وأحزمة الرعاية.',
    'feat-5-title': 'الإحصاءات الصحية',
    'feat-5-desc': 'راجع رسوماً بيانية شاملة توضح نسب الالتزام بالجرعات، وسجلات التعافي، والمؤشرات الفسيولوجية.',
    'feat-6-title': 'جهات اتصال الطوارئ',
    'feat-6-desc': 'تخصيص إشعارات العائلة بنقرة واحدة، وإرسال رسائل فورية للأطباء، وطلب الطوارئ الطبية القريبة.',
    'feat-7-title': 'مزامنة سحابية مشفرة',
    'feat-7-desc': 'مزامنة خلفية تلقائية للبيانات. استرجع جداولك فورياً على أي هاتف أو متصفح كمبيوتر.',
    'feat-8-title': 'أمن عسكري المستوى',
    'feat-8-desc': 'جميع أوراق الوصفات الطبية، ملفات المرضى، ورسائل الدردشة مشفرة بمفاتيح تشفير متقدمة من طرف إلى طرف.',
    // Services
    'serv-title': 'خدماتنا <span>المميزة</span>',
    'serv-intro': 'برمجيات طبية مخصصة ودعم رعاية صحية افتراضي متكامل لضمان التزامك الصحي.',
    'serv-1-title': 'إدارة الأدوية',
    'serv-1-desc': 'جدولة جرعات كاملة، وسجلات الآثار الجانبية، ومزامنة تلقائية للإشعارات عبر أجهزتك.',
    'serv-2-title': 'الرعاية الافتراضية',
    'serv-2-desc': 'احجز استشارات فيديو آمنة مع أطباء معتمدين واحصل على وصفات طبية رقمية فورية.',
    'serv-3-title': 'المؤشرات والإحصاءات',
    'serv-3-desc': 'رسوم بيانية تفاعلية للالتزام، تتبع السكر والضغط، وتقارير أسبوعية تشارك تلقائياً مع عيادتك.',
    'serv-4-title': 'خزنة سحابية آمنة',
    'serv-4-desc': 'احمِ سجلاتك تحت تشفير طرف إلى طرف معتمد. نسخ احتياطي آمن وسهل لاستعادة الحساب.',
    'sub-title': 'خطط <span>الاشتراك</span>',
    'sub-intro': 'اختر الخطة المناسبة لاحتياجات تتبع أدويتك والوصول إلى الخدمات الطبية.',
    // Doctors
    'doc-title': 'أطباؤنا <span>الخبراء</span>',
    'doc-intro': 'مستشارون طبيون موثوقون وأخصائيون مرخصون لمساعدتك في تنظيم خطتك العلاجية وجرعاتك.',
    'doc-1-spec': 'استشاري أمراض القلب',
    'doc-2-spec': 'أخصائي أمراض المخ والأعصاب',
    'doc-3-spec': 'طبيب عام',
    'doc-exp-12': 'خبرة تزيد عن ١٢ عاماً',
    'doc-exp-9': 'خبرة تزيد عن ٩ أعوام',
    'doc-exp-7': 'خبرة تزيد عن ٧ أعوام',
    'btn-visit': 'احجز زيارة افتراضية',
    // AI Assistant Page
    'bot-title': 'مساعد الصحة <span>الذكي</span>',
    'bot-intro': 'احصل على إرشادات فورية بشأن جرعاتك، وتفاعلات الأدوية، وجدولك العلاجي عبر روبوتنا الآمن.',
    'bot-suggest': 'استفسارات مقترحة',
    'bot-opt-1': 'تتبع الأدوية',
    'bot-opt-2': 'تداخلات الأدوية',
    'bot-opt-3': 'حجز المواعيد',
    'bot-opt-4': 'مزامنة الساعة الذكية',
    // FAQ
    'faq-title': 'الأسئلة <span>الشائعة</span>',
    'faq-intro': 'اعثر على إجابات سريعة حول التذكيرات، إعدادات الأمان، تشخيصات الذكاء الاصطناعي، وإدارة المواعيد.',
    // Contact
    'contact-title': 'تواصل <span>معنا</span>',
    'contact-intro': 'لديك أسئلة حول إعداد التذكيرات أو ربط سجلاتك الطبية؟ أرسل لنا رسالة، وسيرد فريق الدعم خلال ٢٤ ساعة.',
    'contact-send-h3': 'أرسل رسالة',
    'lbl-name': 'الاسم الكامل',
    'lbl-email': 'البريد الإلكتروني',
    'lbl-subject': 'الموضوع',
    'lbl-message': 'رسالتك',
    'btn-send': 'إرسال الرسالة',
    'info-h3': 'معلومات الاتصال',
    'info-phone': 'الهاتف',
    'info-email': 'البريد الإلكتروني للدعم',
    'info-head': 'المقر الرئيسي',
    // Testimonials
    'test-title': 'ماذا يقول <span>مستخدمونا</span>',
    'test-intro': 'اقرأ آراء المرضى والممارسين الطبيين الذين يستخدمون نظام جدولة الأدوية حول العالم.'
  }
};

// ---------- Loading Screen ----------
window.addEventListener('load', () => {
  // Initialize auth state after other init functions
  applyAuthState();
  
  const loader = $('#loading-screen');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => loader.remove(), 600);
  }
  // Initialize dynamic components
  initTheme();
  initLanguage();
  initMobileMenu();
  initScrollProgress();
  initCounters();
  initTestimonials();
  initFAQ();
  initChatbot();
  initContactForm();
});

// ---------- Authentication Functions ----------
function initLoginModal() {
  const loginBtn = $('#login-btn');
  const loginModal = $('#login-modal');
  const overlay = $('#overlay');
  const loginForm = $('#login-form-modal');
  if (!loginBtn || !loginModal || !overlay || !loginForm) return;

  // Open modal
  loginBtn.addEventListener('click', () => {
    loginModal.classList.add('show');
    overlay.classList.add('show');
  });

  // Close modal when clicking overlay
  overlay.addEventListener('click', () => {
    loginModal.classList.remove('show');
    overlay.classList.remove('show');
  });

  // Form submission
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const phoneInput = $('#mobile-number');
    const phone = phoneInput.value.trim();
    const isValid = /^\d{6,15}$/.test(phone);
    if (!isValid) {
      showToast(currentLang === 'ar' ? 'الرجاء إدخال رقم هاتف صالح.' : 'Please enter a valid phone number.');
      return;
    }
    localStorage.setItem('userPhone', phone);
    applyAuthState();
    // Close modal
    loginModal.classList.remove('show');
    overlay.classList.remove('show');
  });
}

function applyAuthState() {
  const phone = localStorage.getItem('userPhone');
  const loginBtn = $('#login-btn');
  if (!loginBtn) return;
  if (phone) {
    // Logged in state
    loginBtn.textContent = currentLang === 'ar' ? 'تسجيل الخروج' : 'Logout';
    loginBtn.id = 'logout-btn';
    loginBtn.removeEventListener('click', initLoginModal);
    // Show manage buttons
    const manageElements = document.querySelectorAll('.manage-btn');
    manageElements.forEach(el => el.classList.add('show'));
    // Attach logout handler
    loginBtn.addEventListener('click', logoutHandler);
  } else {
    // Logged out state
    loginBtn.textContent = currentLang === 'ar' ? 'تسجيل الدخول' : 'Login';
    loginBtn.id = 'login-btn';
    loginBtn.removeEventListener('click', logoutHandler);
    // Hide manage buttons
    const manageElements = document.querySelectorAll('.manage-btn');
    manageElements.forEach(el => el.classList.remove('show'));
    // Reinitialize login modal on login button
    initLoginModal();
  }
}

function logoutHandler() {
  localStorage.removeItem('userPhone');
  applyAuthState();
}

// Initialize login modal on startup
initLoginModal();

// ---------- Dark/Light Mode ----------
function initTheme() {
  const themeToggle = $('#theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  function setTheme(isDark) {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (themeToggle) {
      themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.dataset.theme !== 'dark';
      setTheme(isDark);
    });
  }

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    setTheme(storedTheme === 'dark');
  } else {
    setTheme(prefersDark.matches);
  }
}

// ---------- RTL & Language Translation System ----------
function initLanguage() {
  const langToggle = $('#lang-toggle');
  if (!langToggle) return;

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    langToggle.textContent = lang === 'ar' ? 'EN' : 'AR';

    // Map translatable classes or IDs to key strings
    const mapping = {
      '.logo span': 'logo-text',
      '#nav-links a:nth-child(1)': 'nav-home',
      '#nav-links a:nth-child(2)': 'nav-about',
      '#nav-links a:nth-child(3)': 'nav-features',
      '#nav-links a:nth-child(4)': 'nav-services',
      '#nav-links a:nth-child(5)': 'nav-doctors',
      '#nav-links a:nth-child(6)': 'nav-assistant',
      '#nav-links a:nth-child(7)': 'nav-faq',
      '#nav-links a:nth-child(8)': 'nav-contact',
      '#nav-links a:nth-child(9)': 'nav-testimonials',
      '.hero-content h1': 'hero-h1',
      '.hero-content .tagline': 'hero-tagline',
      '.hero-content .btn-primary': 'btn-features',
      '.hero-content .btn-secondary': 'btn-get-started',
      '#features .section-title': 'feat-title',
      '#features .section-intro': 'feat-intro',
      '#features .features-grid article:nth-child(1) h3': 'feat-1-title',
      '#features .features-grid article:nth-child(1) p': 'feat-1-desc',
      '#features .features-grid article:nth-child(2) h3': 'feat-2-title',
      '#features .features-grid article:nth-child(2) p': 'feat-2-desc',
      '#features .features-grid article:nth-child(3) h3': 'feat-3-title',
      '#features .features-grid article:nth-child(3) p': 'feat-3-desc',
      '#features .features-grid article:nth-child(4) h3': 'feat-4-title',
      '#features .features-grid article:nth-child(4) p': 'feat-4-desc',
      '#features .features-grid article:nth-child(5) h3': 'feat-5-title',
      '#features .features-grid article:nth-child(5) p': 'feat-5-desc',
      '#features .features-grid article:nth-child(6) h3': 'feat-6-title',
      '#features .features-grid article:nth-child(6) p': 'feat-6-desc',
      '#features .features-grid article:nth-child(7) h3': 'feat-7-title',
      '#features .features-grid article:nth-child(7) p': 'feat-7-desc',
      '#features .features-grid article:nth-child(8) h3': 'feat-8-title',
      '#features .features-grid article:nth-child(8) p': 'feat-8-desc',
      // services
      'main #services h2.section-title:first-of-type': 'serv-title',
      'main #services p.section-intro:first-of-type': 'serv-intro',
      '.services-grid div:nth-child(1) h3': 'serv-1-title',
      '.services-grid div:nth-child(1) p': 'serv-1-desc',
      '.services-grid div:nth-child(2) h3': 'serv-2-title',
      '.services-grid div:nth-child(2) p': 'serv-2-desc',
      '.services-grid div:nth-child(3) h3': 'serv-3-title',
      '.services-grid div:nth-child(3) p': 'serv-3-desc',
      '.services-grid div:nth-child(4) h3': 'serv-4-title',
      '.services-grid div:nth-child(4) p': 'serv-4-desc',
      'main #services h2:nth-of-type(2)': 'sub-title',
      'main #services p:nth-of-type(2)': 'sub-intro',
      // home previews
      'main section:nth-of-type(2) h2.section-title': 'why-title',
      'main section:nth-of-type(2) p.section-intro': 'why-intro',
      'main section:nth-of-type(2) .grid-3 div:nth-child(1) h3': 'wh-1-title',
      'main section:nth-of-type(2) .grid-3 div:nth-child(1) p': 'wh-1-desc',
      'main section:nth-of-type(2) .grid-3 div:nth-child(1) a': 'learn-more',
      'main section:nth-of-type(2) .grid-3 div:nth-child(2) h3': 'wh-2-title',
      'main section:nth-of-type(2) .grid-3 div:nth-child(2) p': 'wh-2-desc',
      'main section:nth-of-type(2) .grid-3 div:nth-child(2) a': 'chat-ai',
      'main section:nth-of-type(2) .grid-3 div:nth-child(3) h3': 'wh-3-title',
      'main section:nth-of-type(2) .grid-3 div:nth-child(3) p': 'wh-3-desc',
      'main section:nth-of-type(2) .grid-3 div:nth-child(3) a': 'view-security',
      'main section:nth-of-type(3) h2': 'rev-title',
      'main section:nth-of-type(3) p': 'rev-desc',
      'main section:nth-of-type(3) a.btn': 'btn-story',
      'main section:nth-of-type(3) .stats-panel div:nth-child(1) .stat-label': 'stat-adh',
      'main section:nth-of-type(3) .stats-panel div:nth-child(2) .stat-label': 'stat-usr',
      'main section:nth-of-type(3) .stats-panel div:nth-child(3) .stat-label': 'stat-doc',
      'main section:nth-of-type(3) .stats-panel div:nth-child(4) .stat-label': 'stat-rat',
      // about
      '#about h2.section-title': 'about-title',
      '#about p.section-intro': 'about-intro',
      '#about .about-grid div:nth-child(1) h3': 'mission-h3',
      '#about .about-grid div:nth-child(1) p:nth-of-type(1)': 'mission-p1',
      '#about .about-grid div:nth-child(1) p:nth-of-type(2)': 'mission-p2',
      '#about .about-grid div:nth-child(2) h3': 'why-h3',
      '#about .about-grid div:nth-child(2) p:nth-of-type(1)': 'why-p1',
      '#about .about-grid div:nth-child(2) p:nth-of-type(2)': 'why-p2',
      '#about h3.section-title': 'growth-title',
      '#about .grid-3 div:nth-child(1) .stat-label': 'growth-usr',
      '#about .grid-3 div:nth-child(2) .stat-label': 'growth-adh',
      '#about .grid-3 div:nth-child(3) .stat-label': 'growth-saves',
      // doctors
      '#doctors h2.section-title': 'doc-title',
      '#doctors p.section-intro': 'doc-intro',
      '.doctors-grid div:nth-child(1) p': 'doc-1-spec',
      '.doctors-grid div:nth-child(1) span': 'doc-exp-12',
      '.doctors-grid div:nth-child(2) p': 'doc-2-spec',
      '.doctors-grid div:nth-child(2) span': 'doc-exp-9',
      '.doctors-grid div:nth-child(3) p': 'doc-3-spec',
      '.doctors-grid div:nth-child(3) span': 'doc-exp-7',
      '.doctors-grid a.btn': 'btn-visit',
      // assistant
      'main h2.section-title': 'bot-title',
      'main p.section-intro': 'bot-intro',
      '.assistant-sidebar h4': 'bot-suggest',
      '.assistant-sidebar button:nth-of-type(1) span': 'bot-opt-1',
      '.assistant-sidebar button:nth-of-type(2) span': 'bot-opt-2',
      '.assistant-sidebar button:nth-of-type(3) span': 'bot-opt-3',
      '.assistant-sidebar button:nth-of-type(4) span': 'bot-opt-4',
      // faq
      '#faq h2.section-title': 'faq-title',
      '#faq p.section-intro': 'faq-intro',
      // contact
      'main #contact-form': 'contact-send-h3', // header
      '#contact-form label[for="name"]': 'lbl-name',
      '#contact-form label[for="email"]': 'lbl-email',
      '#contact-form label[for="subject"]': 'lbl-subject',
      '#contact-form label[for="message"]': 'lbl-message',
      '#contact-form button': 'btn-send',
      'main h2.section-title': 'contact-title',
      'main p.section-intro': 'contact-intro',
      '.contact-grid div:nth-child(2) h3': 'info-h3',
      '.contact-grid div:nth-child(2) div:nth-child(2) h4': 'info-phone',
      '.contact-grid div:nth-child(2) div:nth-child(3) h4': 'info-email',
      '.contact-grid div:nth-child(2) div:nth-child(4) h4': 'info-head',
      // testimonials
      '#testimonials h2.section-title': 'test-title',
      '#testimonials p.section-intro': 'test-intro',
      // footers
      '.footer-brand span': 'footer-brand'
    };

    Object.keys(mapping).forEach(selector => {
      const el = $(selector);
      if (el) {
        const key = mapping[selector];
        const translation = translations[lang][key];
        if (translation) el.innerHTML = translation;
      }
    });
    
    // Update login btn text dynamically
    applyAuthState();
  }

  langToggle.addEventListener('click', () => {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    applyLanguage(nextLang);
  });

  applyLanguage(currentLang);
}

// ---------- Mobile Menu Drawer Toggle ----------
function initMobileMenu() {
  const toggle = $('#menu-toggle');
  const nav = $('#nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      toggle.innerHTML = nav.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== toggle) {
        nav.classList.remove('open');
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }
}

// ---------- Scroll Progress Bar Tracker ----------
function initScrollProgress() {
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    const progress = $('#scroll-progress');
    if (progress) progress.style.width = `${scrolled}%`;
  });
}

// ---------- Toast Notification Components ----------
function showToast(message) {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
  container.appendChild(toast);
  
  // Animation delay
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ---------- GSAP Hover Animations on Cards ----------
if (typeof gsap !== 'undefined') {
  const cards = $$('.glass-card, .doctor-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -8, scale: 1.015, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  });
}

// ---------- AOS Scroll Reveal Trigger ----------
if (typeof AOS !== 'undefined') {
  AOS.init({
    once: true,
    offset: 100,
    duration: 800,
    easing: 'ease-out-cubic'
  });
}

// ---------- Dynamic Intersection Counters ----------
function initCounters() {
  const statNumbers = $$('.stat-num');
  if (statNumbers.length === 0) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetStr = el.textContent.trim();
        const value = parseFloat(targetStr);
        if (isNaN(value)) return;

        const isDec = targetStr.includes('.');
        const decCount = isDec ? targetStr.split('.')[1].replace(/[^0-9]/g, '').length : 0;
        const nonNum = targetStr.replace(/[0-9.]/g, ''); // retrieve symbols like %, M, +

        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: value,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = counterObj.val.toFixed(decCount) + nonNum;
          }
        });
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));
}

// ---------- Testimonials Infinite Auto Carousel ----------
function initTestimonials() {
  const wrapper = $('#testimonial-wrapper');
  if (!wrapper) return;

  const cards = $$('#testimonial-wrapper .testimonial-card');
  if (cards.length === 0) return;

  // Seamless horizontal scroll marquee using GSAP
  gsap.to(wrapper, {
    xPercent: -50,
    ease: 'none',
    duration: 22,
    repeat: -1,
    runBackwards: false
  });

  // Pause on hover
  wrapper.addEventListener('mouseenter', () => {
    gsap.getTweensOf(wrapper).forEach(t => t.pause());
  });
  wrapper.addEventListener('mouseleave', () => {
    gsap.getTweensOf(wrapper).forEach(t => t.play());
  });
}

// ---------- Accordion Logic (FAQ) ----------
function initFAQ() {
  const faqQuestions = $$('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const parent = question.closest('.faq-item');
      const answer = parent.querySelector('.faq-answer');
      const isActive = parent.classList.contains('active');

      // Collapse all FAQ items
      $$('.faq-item').forEach(item => {
        item.classList.remove('active');
        const ans = item.querySelector('.faq-answer');
        if (ans) {
          gsap.to(ans, { height: 0, duration: 0.4, ease: 'power2.out' });
        }
      });

      if (!isActive) {
        parent.classList.add('active');
        // Retrieve natural height
        const height = answer.scrollHeight;
        gsap.to(answer, { height: height, duration: 0.4, ease: 'power2.out' });
      }
    });
  });
}

// ---------- AI Chatbot Simulator Panel ----------
function initChatbot() {
  const chatForm = $('#chat-form');
  const chatInput = $('#chat-input');
  const chatMessages = $('#chat-messages');
  if (!chatForm || !chatInput || !chatMessages) return;

  const botResponses = {
    track: currentLang === 'ar' 
      ? 'يتيح لك ميدي كير جدولة أدويتك، تحديد الجرعات، وتلقي إشعارات تنبيهية متزامنة مع هاتفك وساعتك الذكية فورياً.' 
      : 'MediCare allows you to set up pill schedules, dose settings, and receive adaptive alerts synced across your phone and smartwatch.',
    warning: currentLang === 'ar'
      ? 'يقوم نظام الأمان بمراجعة تفاعلات الأدوية التي تدخلها. في حال وجود تعارض، سيتم تحذيرك فوراً.'
      : 'Our safety engine cross-references drug interactions. If conflicts occur, a safety warnings banner will appear immediately.',
    appointment: currentLang === 'ar'
      ? 'يمكنك حجز موعد فيديو افتراضي أو زيارة عيادة مع أي من أطبائنا الخبراء مباشرة من صفحة الأطباء.'
      : 'You can book a virtual consultation slot or clinic visit directly from our Doctors page.',
    sync: currentLang === 'ar'
      ? 'ندعم المزامنة السحابية المباشرة مع أبل هيلث وجارمن وWearOS لتلقي التنبيهات على معصمك.'
      : 'We sync directly with Apple Health, Google Fit, and smartwatches to deliver alarms on your wrist.',
    default: currentLang === 'ar'
      ? 'هذا سؤال رائع! يهدف نظام ميدي كير إلى الحفاظ على التزامك بالعلاجات الطبية. يمكنك التواصل مع فريق الدعم أو حجز موعد طبي.'
      : 'That is an excellent inquiry! MediCare coordinates reminders and clinic schedules. Contact our support or book a doctor slot for detailed reviews.'
  };

  // ---------- Doctor Management ----------
  // Removed redundant initDoctorManagement implementation. Consolidated doctor management logic is defined later in the script.

    const addBtn = $('#add-doctor-btn');
    const modal = $('#doctor-modal');
    const overlay = $('#overlay');
    const form = $('#doctor-form');
    const grid = $('#doctors-grid');
    if (!addBtn || !modal || !overlay || !form || !grid) return;

    // Open modal
    addBtn.addEventListener('click', () => {
      modal.classList.add('show');
      overlay.classList.add('show');
    });

    // Close modal
    document.getElementById('close-doctor-modal').addEventListener('click', () => {
      modal.classList.remove('show');
      overlay.classList.remove('show');
    });
    overlay.addEventListener('click', () => {
      modal.classList.remove('show');
      overlay.classList.remove('show');
    });

    // Helper to create a card element
    function createDoctorCard(doctor) {
      const card = document.createElement('div');
      card.className = 'glass-card doctor-card';
      card.setAttribute('data-aos', 'zoom-in');
      card.innerHTML = `
        <div class="doctor-photo">
          <i class="fas fa-stethoscope"></i>
        </div>
        <h3>${doctor.name}</h3>
        <p>${doctor.specialty}</p>
        <span style="font-size:0.8rem; color: var(--text-secondary); margin:0.5rem 0 1.5rem; display:block;">خبرة ${doctor.experience} سنة${doctor.experience > 1 ? '&#x643;' : ''}</span>
        <a href="contact.html" class="btn btn-primary" style="padding:0.6rem 1.5rem; font-size:0.9rem; width:100%;">احجز زيارة افتراضية</a>
      `;
      return card;
    }

    // Load stored doctors
    function loadDoctors() {
      const stored = localStorage.getItem('doctors');
      if (stored) {
        try {
          const doctors = JSON.parse(stored);
          doctors.forEach(doc => grid.appendChild(createDoctorCard(doc)));
        } catch (e) { console.error('Failed to parse doctors', e); }
      }
    }

    // Save doctors array
    function saveDoctors(doctors) {
      localStorage.setItem('doctors', JSON.stringify(doctors));
    }

    // Form submission
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('input[name="name"]').value.trim();
      const specialty = form.querySelector('input[name="specialty"]').value.trim();
      const experience = form.querySelector('input[name="experience"]').value.trim();
      if (!name || !specialty || !experience) {
        showToast(currentLang === 'ar' ? 'يرجى ملء جميع الحقول.' : 'Please fill all fields.');
        return;
      }
      const doctor = { name, specialty, experience };
      // Append to UI
      grid.appendChild(createDoctorCard(doctor));
      // Persist
      const existing = JSON.parse(localStorage.getItem('doctors') || '[]');
      existing.push(doctor);
      saveDoctors(existing);
      // Close modal
      modal.classList.remove('show');
      overlay.classList.remove('show');
      form.reset();
      showToast(currentLang === 'ar' ? 'تمت إضافة الطبيب بنجاح.' : 'Doctor added successfully.');
    });

    // Initial load
    loadDoctors();
  }

  function appendMessage(text, type) {
    const bubble = document.createElement('div');
    bubble.className = `chat-message ${type}`;
    bubble.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(bubble);
    // Smooth scroll bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleBotReply(userText) {
    // Show typing bubble
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-message received typing-indicator';
    typingBubble.innerHTML = `<p><i class="fas fa-ellipsis" style="animation: pulse 1s infinite alternate;"></i></p>`;
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typingBubble.remove();
      const text = userText.toLowerCase();
      let reply = botResponses.default;
      
      if (text.includes('track') || text.includes('medication') || text.includes('تتبع') || text.includes('دواء')) {
        reply = botResponses.track;
      } else if (text.includes('warn') || text.includes('interact') || text.includes('تداخل') || text.includes('تعارض')) {
        reply = botResponses.warning;
      } else if (text.includes('appoint') || text.includes('doctor') || text.includes('حجز') || text.includes('طبيب')) {
        reply = botResponses.appointment;
      } else if (text.includes('sync') || text.includes('watch') || text.includes('ساعة') || text.includes('تزامن')) {
        reply = botResponses.sync;
      }

      appendMessage(reply, 'received');
    }, 1200);
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;

    appendMessage(query, 'sent');
    chatInput.value = '';

    handleBotReply(query);
  });

  // Sidebar suggested questions click
  const options = $$('.sidebar-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const query = opt.dataset.query;
      if (query) {
        appendMessage(query, 'sent');
        handleBotReply(query);
      }
    });
  });
}

// ---------- Contact Form validation ----------
function initContactForm() {
  const contactForm = $('#contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name');
    const email = $('#email');
    const message = $('#message');
    const subject = $('#subject');

    if (!name.value || !email.value || !message.value || !subject.value) {
      showToast(currentLang === 'ar' ? 'الرجاء تعبئة جميع الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      showToast(currentLang === 'ar' ? 'الرجاء إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }

    showToast(currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!');
    contactForm.reset();
  });
}
// ---------- Doctor Management (Add / Edit) ----------
function getDoctors(){
  return JSON.parse(localStorage.getItem('doctors')||'[]');
}
function setDoctors(arr){
  localStorage.setItem('doctors',JSON.stringify(arr));
}
function renderDoctors(){
  const container=document.querySelector('.doctors-grid');
  if(!container) return;
  container.innerHTML='';
  getDoctors().forEach(d=>{
    const card=document.createElement('div');
    card.className='glass-card doctor-card';
    card.innerHTML=`
      <div class="doctor-photo">
        <i class="fas fa-user-md"></i>
      </div>
      <h3>${d.name}</h3>
      <p>${d.specialty}</p>
      <span style="font-size:0.8rem; color: var(--text-secondary); margin:0.5rem 0 1.5rem; display:block;">
        ${currentLang==='ar'?'خبرة '+d.experience+' سنة':d.experience+' Years Experience'}
      </span>
      <button class="edit-doctor btn btn-secondary manage-btn ${localStorage.getItem('userPhone')?'show':''}" data-id="${d.id}">
        ${currentLang==='ar'?'تعديل':'Edit'}
      </button>
      <button class="delete-doctor btn btn-danger manage-btn ${localStorage.getItem('userPhone')?'show':''}" data-id="${d.id}">
        ${currentLang==='ar'?'حذف':'Delete'}
      </button>
      <a href="contact.html" class="btn btn-primary" style="padding:0.6rem 1.5rem; font-size:0.9rem; width:100%;">
        ${currentLang==='ar'?'احجز زيارة افتراضية':'Book Virtual Visit'}
      </a>`;
    container.appendChild(card);
  });
}


}
function openDoctorModal(editId=null){
  const modal=document.getElementById('doctor-modal');
  const overlay=document.getElementById('overlay');
  const form=document.getElementById('doctor-form');
  modal.classList.add('show');
  overlay.classList.add('show');
  if(editId){
    const doc=getDoctors().find(d=>d.id===editId);
    form.name.value=doc.name;
    form.specialty.value=doc.specialty;
    form.experience.value=doc.experience;
    form.dataset.editId=editId;
  } else {
    form.reset();
    delete form.dataset.editId;
  }
}
function closeDoctorModal(){
  document.getElementById('doctor-modal').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
}
// Event listeners for doctor UI
document.addEventListener('click',e=>{
  if(e.target.id==='add-doctor-btn') openDoctorModal();
  if(e.target.classList.contains('edit-doctor')){
    const id=Number(e.target.dataset.id);
    openDoctorModal(id);
  }
  if(e.target.id==='close-doctor-modal' || e.target.id==='overlay') closeDoctorModal();
});
// Form submit handling
const doctorForm=document.getElementById('doctor-form');
if(doctorForm){
  doctorForm.addEventListener('submit',e=>{
    e.preventDefault();
    const doctors=getDoctors();
    if(doctorForm.dataset.editId){
      const id=Number(doctorForm.dataset.editId);
      const idx=doctors.findIndex(d=>d.id===id);
      if(idx>-1){
        doctors[idx]={id,name:doctorForm.name.value,specialty:doctorForm.specialty.value,experience:doctorForm.experience.value};
      }
    } else {
      const newId=Date.now();
      doctors.push({id:newId,name:doctorForm.name.value,specialty:doctorForm.specialty.value,experience:doctorForm.experience.value});
    }
    setDoctors(doctors);
    renderDoctors();
    closeDoctorModal();
  });
}
// Initial render
renderDoctors();


// ---------- Three.js High-Fidelity Hero Scene ----------
let scene, camera, renderer, phoneGroup;

function initThree() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  
  // Scene Setup
  scene = new THREE.Scene();

  // Camera Setup
  camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  // Renderer Setup
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(5, 5, 10);
  scene.add(dirLight);

  // Glowing Point Light for Cyan Accents
  const pointLight = new THREE.PointLight(0x00f2fe, 2, 12);
  pointLight.position.set(-3, 2, 3);
  scene.add(pointLight);

  // Create Phone Group
  phoneGroup = new THREE.Group();

  // 1. Phone Body Geometry & Material
  const bodyGeo = new THREE.BoxGeometry(2.0, 4.0, 0.15);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.15,
    metalness: 0.85
  });
  const phoneBody = new THREE.Mesh(bodyGeo, bodyMat);
  phoneGroup.add(phoneBody);

  // 2. Phone Screen Geometry & Material (glowing blue screen)
  const screenGeo = new THREE.BoxGeometry(1.85, 3.85, 0.16);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x075985,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.35,
    roughness: 0.1,
    metalness: 0.1
  });
  const phoneScreen = new THREE.Mesh(screenGeo, screenMat);
  phoneGroup.add(phoneScreen);

  // 3. Medicine Capsule Group 1 (Floating left top)
  const capsule1 = createCapsuleMesh(0x0ea5e9, 0xffffff);
  capsule1.position.set(-2.2, 1.2, 1.0);
  capsule1.scale.set(0.8, 0.8, 0.8);
  capsule1.rotation.set(0.5, 0.5, 0.1);
  scene.add(capsule1);

  // 4. Medicine Capsule Group 2 (Floating right bottom)
  const capsule2 = createCapsuleMesh(0xef4444, 0xffffff);
  capsule2.position.set(2.2, -1.2, 0.8);
  capsule2.scale.set(0.65, 0.65, 0.65);
  capsule2.rotation.set(-0.6, 0.3, 0.5);
  scene.add(capsule2);

  scene.add(phoneGroup);

  // Animation Loop variables
  let clock = new THREE.Clock();

  function tick() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate the smartphone mockup slightly
    phoneGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.15;
    phoneGroup.rotation.x = Math.cos(elapsedTime * 0.5) * 0.08;

    // Float Capsule 1
    capsule1.position.y = 1.2 + Math.sin(elapsedTime * 1.5) * 0.15;
    capsule1.rotation.y += 0.01;
    capsule1.rotation.x += 0.005;

    // Float Capsule 2
    capsule2.position.y = -1.2 + Math.cos(elapsedTime * 1.2) * 0.12;
    capsule2.rotation.y -= 0.008;
    capsule2.rotation.z += 0.006;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick();

  // Mouse Parallax Influence
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;

    gsap.to(phoneGroup.rotation, {
      y: x * 0.4 + (Math.sin(clock.getElapsedTime() * 0.5) * 0.15),
      x: y * 0.4,
      duration: 0.8,
      ease: 'power1.out'
    });

    gsap.to(capsule1.position, {
      x: -2.2 - (x * 0.8),
      y: 1.2 - (y * 0.8) + (Math.sin(clock.getElapsedTime() * 1.5) * 0.15),
      duration: 1.2,
      ease: 'power1.out'
    });

    gsap.to(capsule2.position, {
      x: 2.2 - (x * 0.6),
      y: -1.2 - (y * 0.6) + (Math.cos(clock.getElapsedTime() * 1.2) * 0.12),
      duration: 1.2,
      ease: 'power1.out'
    });
  });

  // Window Resize Handle
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

// Helper to construct a dual-colored medicine capsule
function createCapsuleMesh(topColor, bottomColor) {
  const group = new THREE.Group();

  // Cylindrical body
  const bodyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 18);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: topColor,
    roughness: 0.1,
    metalness: 0.2
  });
  const capsuleBody = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(capsuleBody);

  // Top Cap Sphere
  const topGeo = new THREE.SphereGeometry(0.2, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2);
  const topMat = new THREE.MeshStandardMaterial({
    color: topColor,
    roughness: 0.1,
    metalness: 0.2
  });
  const topCap = new THREE.Mesh(topGeo, topMat);
  topCap.position.y = 0.2; // shift up
  group.add(topCap);

  // Bottom Cap Sphere
  const bottomGeo = new THREE.SphereGeometry(0.2, 18, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const bottomMat = new THREE.MeshStandardMaterial({
    color: bottomColor,
    roughness: 0.1,
    metalness: 0.2
  });
  const bottomCap = new THREE.Mesh(bottomGeo, bottomMat);
  bottomCap.position.y = -0.2; // shift down
  group.add(bottomCap);

  return group;
}

initThree();
