---
mainImage: ../../../images/part-12.svg
part: 12
letter: b
lang: ar
---

<div class="content">

سنتعلم في هذا القسم كتابة ملفات **Dockerfile** لبناء صور مخصصة لتطبيقاتنا، واستخدام تقنية **البناء متعدد المراحل (Multi-stage Builds)** لتقليص حجم الصور الإنتاجية، واستخدام **وسائط التخزين (Volumes)** والربط المباشر **(Bind Mounts)** للتطوير الحي السريع.

---

### كتابة ملف `Dockerfile` لتطبيق Node.js

```dockerfile
# استخدام صورة Node.js الأساسية
FROM node:20

# تعيين مجلد العمل داخل الحاوية
WORKDIR /usr/src/app

# نسخ ملفات الحزم أولاً للاستفادة من كاش الطبقات (Docker Layer Caching)
COPY package*.json ./

# تثبيت الحزم التابعة
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# تعيين متغير البيئة للإنتاج
ENV NODE_ENV=production

# فتح المنفذ داخل الحاوية
EXPOSE 3000

# الأمر الافتراضي لتشغيل التطبيق
CMD ["npm", "start"]
```

بناء الصورة وتشغيلها:

```bash
docker build -t my-node-app .
docker run -p 3000:3000 my-node-app
```

---

### البناء متعدد المراحل (Multi-stage Builds) لتطبيقات الواجهة الأمامية

تتطلب تطبيقات React أدوات تطوير ضخمة للبناء (مثل Vite و Node.js)، لكن النسخة الإنتاجية النهائية لا تحتاج سوى خادم ويب خفيف جداً (مثل Nginx) لتقديم ملفات HTML و JS الساكنة:

```dockerfile
# المرحلة الأولى: بناء المشروع (Build Stage)
FROM node:20 AS build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# المرحلة الثانية: الإنتاج (Production Stage)
FROM nginx:alpine
# نسخ ملفات dist المبنية فقط من مرحلة البناء الأولى
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

بهذه الطريقة، ينخفض حجم الصورة النهائية من **1 جيجابايت** إلى **25 ميجابايت** فقط!

---

### التطوير الحي مع الربط المباشر (Bind Mounts)

لتحديث كود التطبيق داخل الحاوية فور حفظ الملفات على جهازك المضيف دون الحاجة لإعادة بناء الصورة:

```bash
docker run -p 3000:3000 -v $(pwd):/usr/src/app my-node-app npm run dev
```

</div>

<div class="tasks">

<h3>التمارين 12.6 - 12.11: بناء صور Docker وتطبيق الملاحظات والمدونات</h3>

<h4>12.6: كتابة Dockerfile لتطبيق الواجهة الأمامية (Frontend Dockerfile)</h4>
اكتب ملف `Dockerfile` لتطبيق React في بيئة التطوير مع تثبيت الحزم وتشغيل خادم Vite.

<h4>12.7: كتابة Dockerfile لخادم Express الخلفي (Backend Dockerfile)</h4>
اكتب ملف `Dockerfile` لخادم الملاحظات الخلفي لتشغيله في بيئة التطوير.

<h4>12.8: التطوير الحي بالربط المباشر (Live development with bind-mounts)</h4>
شغل حاوية الواجهة والخادم باستخدام خيار `-v` وتأكد من عمل التحديث التلقائي الفوري (Hot Reload) عند تعديل الملفات من محرر الكود على جهازك.

<h4>12.9: البناء متعدد المراحل لتطبيق الواجهة (Multi-stage build frontend)</h4>
اكتب ملف `Dockerfile` للإنتاج يطبق البناء متعدد المراحل ويقدم ملفات الواجهة الأمامية عبر خادم Nginx خفيف.

<h4>12.10: بناء صورة الإنتاج للخادم (Production build backend)</h4>
اكتب ملف `Dockerfile` لإنتاج صورة الخادم الخلفي مع تشغيل `npm start` والعمل تحت بيئة `NODE_ENV=production`.

<h4>12.11: تحسين التخزين المؤقت للطبقات (Optimizing layer caching)</h4>
تأكد من نسخ `package.json` وتشغيل `npm install` قبل نسخ باقي الكود لمنع إعادة تثبيت الحزم عند كل تعديل بسيط في الأكواد.

</div>
