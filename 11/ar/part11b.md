---
mainImage: ../../../images/part-11.svg
part: 11
letter: b
lang: ar
---

<div class="content">

سنتعلم في هذا القسم كتابة أول مسار عمل (Workflow) باستخدام **[GitHub Actions](https://github.com/features/actions)**، وأتمتة فحص وتجميع واختبار تطبيق Pokedex المتكامل.

---

### مفاهيم GitHub Actions الأساسية

- **مسار العمل (Workflow)**: عملية مؤتمتة مُعرّفة داخل ملف YAML في المسار `.github/workflows/`.
- **الأحداث (Events)**: المشغلات التي تُطلق مسار العمل (مثل `push` أو `pull_request` أو وفق جدول زمني `schedule`).
- **المهام (Jobs)**: مجموعة من الخطوات تنفذ على جهاز افتراضي موحد (Runner مثل `ubuntu-latest`).
- **الخطوات (Steps)**: المهام الفردية داخل الـ Job، إما تشغيل أوامر shell (`run`) أو إجراءات جاهزة (`uses`).
- **الإجراءات الجاهزة (Actions)**: وحدات برمجية قابلة لإعادة الاستخدام من GitHub Marketplace (مثل `actions/checkout` و `actions/setup-node`).

---

### ملف مسار عمل متكامل: `.github/workflows/pipeline.yml`

```yaml
name: Deployment pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches: [main]
    types: [opened, synchronize]

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Check style (Lint)
        run: npm run eslint

      - name: Build production bundle
        run: npm run build

      - name: Run unit tests
        run: npm test

      - name: Run e2e tests (Playwright)
        run: npx playwright test
        env:
          CI: true
```

![نجاح مسار عمل GitHub Actions باللون الأخضر](../../images/11/9.png)

</div>

<div class="tasks">

<h3>التمارين 11.3 - 11.9: بناء خط أنابيب الاختبار لـ Pokedex</h3>

استخدم مستودع تطبيق Pokedex كنقطة بداية: `https://github.com/fullstack-hy2020/full-stack-open-pokedex`.

<h4>11.3: إعداد المستودع المحلي (Fork and clone)</h4>
انسخ المستودع، وثبت الحزم التابعة، وتأكد من تشغيل التطبيق محلياً وبنائه بنجاح عبر `npm run build`.

<h4>11.4: فحص الكود (Linting step)</h4>
أضف خطوة فحص الأنماط `npm run eslint` إلى مسار GitHub Actions وتأكد من عملها.

<h4>11.5: البناء والاختبار (Build and test steps)</h4>
أضف خطوات البناء `npm run build` واختبارات الوحدات `npm test` إلى خط الأنابيب.

<h4>11.6: فحص الأخطاء التلقائي (Testing failure detection)</h4>
تعمد كسر اختبار أو مخالفة قواعد ESLint في كوميت تجريبي للتأكد من أن GitHub Actions يفشل ويمنع استكمال المسار (يعطي علامة حمراء ❌).

<h4>11.7: الاختبارات الشاملة (E2E testing in CI)</h4>
أضف خطوة تشغيل اختبارات Playwright أو Cypress في بيئة GitHub Actions للتأكد من سلامة الواجهة والتنقل بين صفحات البوكيمون.

<h4>11.8: إضافة اختبارات شاملة جديدة (More E2E tests)</h4>
اكتب اختباراً إضافياً يتحقق من إمكانية فتح صفحة بوكيمون معين (مثل Ivysaur) والتأكد من ظهور قدراته وإحصائياته على الشاشة.

<h4>11.9: حماية الفروع (Branch protection rules)</h4>
اضبط قواعد حماية الفرع `main` في إعدادات GitHub بحيث تشترط نجاح مسار عمل GitHub Actions قبل السماح بدمج أي Pull Request.

</div>
