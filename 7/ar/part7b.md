---
mainImage: ../../../images/part-7.svg
part: 7
letter: b
lang: ar
---

<div class="content">

سنتعرف في هذا القسم على المفاهيم الجوهرية لـ **تجميع الشيفرات (Bundling)** والترجمة البرمجية (Transpilation)، وكيف تعمل أداة **[Vite](https://vitejs.dev/)** تحت الغطاء، ونتعلم كيفية استخدام المجمّع فائق السرعة **[esbuild](https://esbuild.github.io/)** بدون أي طبقات تجريد إضافية.

---

### مفهوم تجميع الشيفرات (Bundling)

نكتب تطبيقاتنا مقسمة إلى وحدات (Modules) برمجية عديدة. يقوم مجمّع الشيفرات (Bundler) بتحليل شجرة الاعتماديات انطلاقاً من نقطة الدخول (Entry Point مثل `main.jsx`)، ودمج كافة الملفات والمكتبات في حزم محسنة ومضغوطة داخل مجلد `dist/` يستطيع المتصفح تحميلها بكفاءة.

---

### آلية عمل Vite المزدوجة

- **في بيئة التطوير (Development Mode)**: لا تقوم Vite بتجميع كود المشروع بالكامل! بل تشغل خادماً فورياً يقدم الملفات كـ Native ES Modules مباشرة للمتصفح. وتقوم أداة **esbuild** المدمجة بتجميع الحزم التابعة في `node_modules` مسبقاً وبسرعة فائقة.
- **في بيئة الإنتاج (Production Build)**: تستخدم Vite أداة **Rollup** لإنشاء حزم نهائية فائقة الكفاءة مستفيدة من تقنية **Tree-shaking** (حذف الأكواد غير المستخدمة)، مع استمرار esbuild في مهام الترجمة السريعة والضغط (Minification).

---

### بناء بيئة React كاملة من الصفر باستخدام esbuild

لنفهم ما يفعله المجمّع فعلياً، لننشئ مشروع React بدون Vite بالاعتماد على esbuild مباشرة:

```bash
npm init -y
npm install react react-dom
npm install --save-dev esbuild serve
```

نُنشئ ملف `dist/index.html`:

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <title>تطبيق esbuild</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./main.js"></script>
  </body>
</html>
```

نضيف الأوامر في `package.json`:

```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist",
    "dev": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic --servedir=./dist --watch"
  }
}
```

- **`--bundle`**: دمج كافة الوحدات والمكتبات المستوردة في ملف واحد.
- **`--minify`**: ضغط حجم الملف بإزالة المسافات والتعليقات واختصار أسماء المتغيرات (يقلص الحجم من 1.1MB إلى 190KB).
- **`--sourcemap`**: إنشاء ملف الخريطة `dist/main.js.map` لربط أخطاء المتصفح بأسطر الشيفرة الأصلية في ملفات `.jsx`.
- **`--jsx=automatic`**: الترجمة الفورية لـ JSX إلى دوال JavaScript قياسية دون الحاجة لأداة Babel.
- **`--watch` و `--servedir`**: مراقبة التعديلات وإعادة التجميع التلقائي وتقديم الملفات عبر خادم محلي.

---

### تخصيص إعدادات Vite (`vite.config.js`)

#### 1. إعداد البروكسي (Proxy) لتجنب أخطاء CORS محلياً:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

#### 2. متغيرات البيئة (Environment Variables):

تتطلب Vite أن تبدأ جميع المتغيرات الموجهة للمتصفح بالبادئة **`VITE_`** لحماية الأسرار:

```env
# .env.development
VITE_BACKEND_URL=http://localhost:3001/api/notes

# .env.production
VITE_BACKEND_URL=https://myapi.fly.dev/api/notes
```

وقراءتها في الكود عبر:

```js
const baseUrl = import.meta.env.VITE_BACKEND_URL
```

#### 3. دعم المتصفحات القديمة (Legacy Browsers):

```bash
npm install --save-dev @vitejs/plugin-legacy
```

```js
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({ targets: ['defaults', 'not IE 11'] })
  ]
})
```

</div>

