---
mainImage: ../../../images/part-3.svg
part: 5
letter: c
lang: ar
---

<div class="content">

سنتعلم في هذا القسم كيفية كتابة اختبارات آلية لمكونات React باستخدام أحدث أدوات الاختبار: **[Vitest](https://vitest.dev/)** ومكتبة **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)** ومحاكي المتصفح **[jsdom](https://github.com/jsdom/jsdom)**.

---

### تثبيت وإعداد بيئة الاختبارات في React

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

1. نُنشئ ملف الإعداد `testSetup.js` في جذر المشروع:

```js
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
```

2. نُحدّث ملف `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
  }
})
```

3. نضيف أمر التشغيل في `package.json`: `"test": "vitest run"`.

---

### اختبار تصيير المكونات (Component Rendering Tests)

نكتب الاختبار في `src/components/Note.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})
```

- تقوم الدالة **`render(<Note />)`** بتصيير المكون في بيئة الاختبار.
- يُستخدم الكائن **`screen`** للبحث عن النصوص والعناصر عبر:
  - `screen.getByText(...)`: يبحث عن عنصر يحتوي على النص ويطلق خطأ إذا لم يعثر عليه.
  - `screen.getByRole('textbox')` أو `screen.getByPlaceholderText(...)`: للبحث في حقول النماذج.
  - `screen.queryByText(...)`: مفيد للتحقق من **عدم وجود** عنصر في الشاشة `expect(element).toBeNull()`.
  - `screen.debug()`: لطباعة بنية الـ HTML للمكون في الكونسول لتسهيل التنقيح (Debugging).

---

### محاكاة نقرات الأزرار وإدخال النصوص (userEvent)

باستخدام مكتبة **`@testing-library/user-event`** والدوال الوهمية **`vi.fn()`**:

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }
  
  const mockHandler = vi.fn()

  render(<Note note={note} toggleImportance={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

---

### اختبار النماذج وتعبئة الحقول

```jsx
import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByPlaceholderText('write note content here')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

---

### نسبة تغطية الاختبارات (Test Coverage)

يمكن فحص التغطية الشاملة لكود الواجهة الأمامية بتنفيذ:

```bash
npm test -- --coverage
```

يتم إنشاء تقرير مرئي مفصل في مجلد `coverage/` يوضح الأسطر البرمجية التي لم تخضع للاختبار.

</div>

<div class="tasks">

<h3>التمارين 5.13 - 5.16: اختبارات واجهة تطبيق قائمة المدونات</h3>

<h4>5.13: اختبارات قائمة المدونات - الخطوة 1 (Blog List tests step 1)</h4>
اكتب اختباراً يتحقق من أن مكون عرض المدونة `Blog` يُظهر العنوان والكاتب افتراضياً، ولا يُظهر الرابط URL أو عدد الإعجابات.

<h4>5.14: اختبارات قائمة المدونات - الخطوة 2 (Blog List tests step 2)</h4>
اكتب اختباراً يتحقق من ظهور الرابط وعدد الإعجابات عند النقر على زر إظهار التفاصيل `view`.

<h4>5.15: اختبارات قائمة المدونات - الخطوة 3 (Blog List tests step 3)</h4>
اكتب اختباراً يتحقق من أنه عند النقر على زر الإعجاب (Like) مرتين، يتم استدعاء دالة معالج الحدث (Mock function) مرتين.

<h4>5.16: اختبارات قائمة المدونات - الخطوة 4 (Blog List tests step 4)</h4>
اكتب اختباراً لنموذج إضافة المدونة الجديدة `BlogForm` للتأكد من استدعاء الدالة الممررة بالبيانات الصحيحة عند إرسال النموذج.

</div>

