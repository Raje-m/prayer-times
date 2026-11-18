<div align="center">

# 🕌 تطبيق مواقيت الصلاة والأذان | Prayer Times & Adhan PWA

**تطبيق ويب تقدمي (PWA) حديث وسريع لعرض مواقيت الصلاة بدقة، مع تنبيهات الأذان الصوتي، والتقويم الشهري، ودعم كامل للعمل بدون إنترنت.**

**A modern, fast, offline-first Progressive Web App (PWA) for accurate prayer times, audio Adhan notifications, and a monthly prayer calendar.**

[🔗 المعاينة المباشرة | Live Demo](https://islamic-prayer-times-pi.vercel.app)

</div>

---

## 🌟 المميزات الرئيسية | Key Features

### 🇸🇦 بالعربية
- **العمل الكامل بدون إنترنت (Offline-First PWA):** تخزين ذكي لمواقيت الشهر بالكامل وملف الأذان الصوتي (`adhan.mp3`) عبر Workbox و `localStorage` ليعمل التطبيق بكفاءة لمدة 30 يوماً متواصلة دون الحاجة للاتصال بالإنترنت.
- **تنبيهات وصوت الأذان التلقائي:** تشغيل صوت الأذان تلقائياً عند دخول وقت كل صلاة مع إشعارات النظام (Web Notifications) وزر لاختبار الصوت أو إيقافه يدوياً.
- **العداد التنازلي للصلاة القادمة:** حساب دقيق ومباشر للوقت المتبقي للصلاة القادمة، مع معالجة ذكية لصلاة الفجر بعد منتصف الليل.
- **تحديد الموقع التلقائي واختيار المدن:** دعم تحديد الموقع الجغرافي عبر GPS أو الاختيار من قائمة المدن العربية والعالمية، مع حفظ اختيار المستخدم تلقائياً.
- **التقويم الشهري التفاعلي:** عرض مواقيت الصلاة للشهر الميلادي والهجري بالكامل، مع التمرير التلقائي (Auto-Scroll) لصف اليوم الحالي والتنقل السلس بين الأشهر.
- **قابل للتثبيت وتحديثات فورية:** إمكانية تثبيت التطبيق على الشاشة الرئيسية لهواتف iPhone و Android وأجهزة سطح المكتب، مع إشعار فوري للمستخدم عند توفر تحديث جديد.
- **إدارة ذكية لذاكرة التخزين:** تنظيف تلقائي لبيانات الأيام والشهور السابقة من `localStorage` للحفاظ على أداء وسرعة الجهاز.

### 🇬🇧 In English
- **Offline-First PWA Architecture:** Caches full monthly prayer schedules and the Adhan audio file (`adhan.mp3`) using Workbox and `localStorage`, ensuring uninterrupted offline functionality for up to 30 days.
- **Automated Adhan Audio & System Notifications:** Plays the full Adhan audio upon prayer time arrival alongside native push/system notifications, complete with manual audio test and stop controls.
- **Live Next-Prayer Countdown:** Real-time countdown timer to the next prayer, accurately handling overnight transitions to Fajr.
- **Geolocation (GPS) & City Selector:** Supports automatic coordinate-based prayer times via GPS or manual city selection, persisting user preferences in `localStorage`.
- **Interactive Monthly Calendar:** Displays full Gregorian and Hijri monthly schedules with automatic scrolling (`Auto-Scroll`) to the current day and smooth month-to-month navigation.
- **Installable & Instant Updates:** Installable on iOS, Android, and Desktop home screens with a custom install prompt and an in-app update banner (`ReloadPrompt`) when new versions are deployed.
- **Automatic Cache Cleanup:** Automatically purges expired daily and monthly cache entries from `localStorage` to keep device storage clean.

---

## 🛠️ التقنيات المستخدمة | Tech Stack

- **Frontend Framework:** React 18 + Vite
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Styling & Icons:** Tailwind CSS + Lucide React
- **PWA & Offline Caching:** `vite-plugin-pwa` (Workbox with Range Requests support for iOS audio)
- **HTTP Client & API:** Axios + [Aladhan Prayer Times API](https://aladhan.com/prayer-times-api)
- **Deployment:** Vercel

---

## 🚀 التشغيل المحلي | Local Setup

1. **استنساخ المستودع | Clone the repository:**
   ```bash
   git clone [https://github.com/Raje-m/prayer-times.git](https://github.com/Raje-m/prayer-times)
   cd prayer-times
   npm install
   npm run dev
   