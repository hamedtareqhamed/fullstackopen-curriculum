---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: ar
---

<div class="content">

سنتعلم في هذا القسم اختبار النظام بأكمله ككتلة واحدة من البداية إلى النهاية عبر **الاختبارات الشاملة (End-to-End - E2E Testing)**.

تُحاكي اختبارات E2E سلوك المستخدم الحقيقي بدقة متناهية من خلال تشغيل متصفح حقيقي (أو Headless Browser) والنقر على الأزرار وتعبئة النماذج ومراقبة ردود فعل الواجهة وقاعدة البيانات.

تُعد أداة **[Playwright](https://playwright.dev/)** الأداة الحديثة الرائدة والأكثر تفوقاً وشعبية في عالم اختبارات E2E.

---

### تهيئة مشروع Playwright

نُنشئ مجلداً مستقلاً لاختبارات E2E وننفذ بداخله:

```bash
npm init playwright@latest
```

نختار JavaScript، ونضع مجلد الاختبارات في `tests`، ونقوم بتثبيت المتصفحات الافتراضية (Chromium و Firefox و Webkit).

نُعدل ملف `playwright.config.js`:

```js
import { defineConfig } from '@playwright/test'

export default defineConfig({
  timeout: 3000,
  fullyParallel: false,
  workers: 1, // تشغيل متسلسل لتجنب تضارب قاعدة البيانات
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
})
```

---

### التحكم في حالة قاعدة البيانات (Testing API Endpoints)

تتطلب اختبارات E2E أن تبدأ قاعدة البيانات من حالة أولية نظيفة وموحدة قبل كل اختبار. ولتحقيق ذلك، نُنشئ مساراً خاصاً في الخادم الخلفي في `controllers/testing.js` لا يتم تفعيله إلا في بيئة الاختبار (`NODE_ENV === 'test'`):

```js
const router = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})
  response.status(204).end()
})

module.exports = router
```

---

### كتابة اختبارات E2E

نُنشئ ملف الدوال المساعدة `tests/helper.js`:

```js
const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
  await page.getByText(content).waitFor()
}

export { loginWith, createNote }
```

ونكتب الاختبارات في `tests/note_app.spec.js`:

```js
const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    // تصفير قاعدة البيانات وإضافة مستخدم اختباري
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    test('importance can be changed', async ({ page }) => {
      await createNote(page, 'first note')
      const noteElement = page.getByText('first note').locator('..')
      await noteElement.getByRole('button', { name: 'make not important' }).click()
      await expect(noteElement.getByText('make important')).toBeVisible()
    })
  })
})
```

---

### تنقيح وتشغيل اختبارات Playwright

- تشغيل كافة الاختبارات: `npx playwright test`
- تشغيل واجهة المستخدم المرئية التفاعلية: `npx playwright test --ui`
- وضع التنقيح خطوة بخطوة مع إيقاف مؤقت: `npx playwright test --debug` (أو وضع `await page.pause()`).
- عرض تقرير HTML المفصل: `npx playwright show-report`

![واجهة تنقيح Playwright المرئية](../../images/5/play4.png)

</div>

<div class="tasks">

<h3>التمارين 5.17 - 5.23: الاختبارات الشاملة (E2E) لتطبيق قائمة المدونات</h3>

<h4>5.17: اختبارات E2E للمدونات - الخطوة 1 (Blog List E2E step 1)</h4>
هيئ مشروع Playwright وتأكد من أن الصفحة الرئيسية تعرض نموذج تسجيل الدخول افتراضياً.

<h4>5.18: اختبارات E2E للمدونات - الخطوة 2 (Blog List E2E step 2)</h4>
اكتب اختبارات تسجيل الدخول للتحقق من نجاح الدخول بالبيانات الصحيحة وفشله مع إظهار رسالة خطأ بالبيانات الخاطئة.

<h4>5.19: اختبارات E2E للمدونات - الخطوة 3 (Blog List E2E step 3)</h4>
اكتب اختباراً يتحقق من قدرة المستخدم المسجل على إضافة مدونة جديدة وظهورها في القائمة.

<h4>5.20: اختبارات E2E للمدونات - الخطوة 4 (Blog List E2E step 4)</h4>
اكتب اختباراً يتحقق من إمكانية النقر على زر الإعجاب (Like) وزيادة عدد إعجابات المدونة المعروضة.

<h4>5.21: اختبارات E2E للمدونات - الخطوة 5 (Blog List E2E step 5)</h4>
اكتب اختباراً يتحقق من قدرة كاتب المدونة على حذف مدونته مع التعامل مع نافذة التأكيد.

<h4>5.22: اختبارات E2E للمدونات - الخطوة 6 (Blog List E2E step 6)</h4>
اكتب اختباراً يتحقق من أن زر حذف المدونة يظهر **فقط** للمستخدم الذي أنشأها ولا يظهر للمستخدمين الآخرين.

<h4>5.23: اختبارات E2E للمدونات - الخطوة 7 (Blog List E2E step 7)</h4>
اكتب اختباراً يتحقق من ترتيب المدونات في الصفحة تلقائياً حسب عدد الإعجابات، بحيث تظهر المدونة الأكثر إعجاباً في أعلى القائمة.

هذا هو التمرين الأخير في هذا الجزء. ارفع حلولك إلى GitHub وسجل إنجاز التمارين في نظام التسليم.

</div>
