---
mainImage: ../../../images/part-5.svg
part: 5
letter: b
lang: ar
---

<div class="content">

سنتعلم في هذا القسم كيفية تحسين تجربة المستخدم بإظهار النماذج فقط عند الحاجة، وفصل المكونات القابلة لإعادة الاستخدام باستخدام خاصية **`props.children`** والمراجع **`useRef`** و **`useImperativeHandle`** (في React 19).

---

### مكون التبديل القابل لإعادة الاستخدام (Togglable) و `props.children`

تتيح خاصية **`props.children`** في React تمرير عناصر ومكونات فرعية متداخلة بين وسمي الفتح والإغلاق للمكون:

```jsx
<Togglable buttonLabel="ملاحظة جديدة">
  <NoteForm createNote={addNote} />
</Togglable>
```

لنقم ببناء المكون `src/components/Togglable.jsx`:

```jsx
import { useState, useImperativeHandle } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // إتاحة الدالة للاستدعاء من المكون الأب عبر ref
  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>إلغاء</button>
      </div>
    </div>
  )
}

export default Togglable
```

---

### التحكم في حالة المكون الأبناء عبر `useRef`

لإخفاء نموذج الملاحظة تلقائياً بمجرد حفظ ملاحظة جديدة، نستخدم خطاف **`useRef`**:

```jsx
import { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

const App = () => {
  const [notes, setNotes] = useState([])
  const noteFormRef = useRef()

  const addNote = async (noteObject) => {
    // إخفاء النموذج فوراً باستدعاء الدالة المعرفة في Togglable
    noteFormRef.current.toggleVisibility()
    
    const returnedNote = await noteService.create(noteObject)
    setNotes(notes.concat(returnedNote))
  }

  return (
    <div>
      <h1>Notes</h1>
      {/* ... */}
      <Togglable buttonLabel="ملاحظة جديدة" ref={noteFormRef}>
        <NoteForm createNote={addNote} />
      </Togglable>
    </div>
  )
}
```

---

### فصل حالة النماذج (State of the forms)

بدلاً من إدارة نصوص حقول الإدخال في المكون الرئيسي `App`، نقوم بعزل حالة النموذج داخل مكون `NoteForm.jsx` نفسه، وتمرير دالة الإرسال `createNote` فقط كخاصية:

```jsx
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true,
    })
    setNewNote('')
  }

  return (
    <div>
      <h2>إنشاء ملاحظة جديدة</h2>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={({ target }) => setNewNote(target.value)}
        />
        <button type="submit">حفظ</button>
      </form>
    </div>
  )
}

export default NoteForm
```

---

### إعداد ESLint للواجهة الأمامية

نُنشئ ملف `eslint.config.js` في مجلد الواجهة الأمامية:

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off'
    }
  }
]
```

</div>

<div class="tasks">

<h3>التمارين 5.5 - 5.12: تحسين واجهة قائمة المدونات و ESLint</h3>

<h4>5.5: واجهة قائمة المدونات - الخطوة 5 (Blog List Frontend step 5)</h4>
اجعل نموذج إنشاء المدونة مخفياً افتراضياً، ويظهر فقط عند النقر على زر `create new blog`، ويختفي بعد إنشاء المدونة أو النقر على `cancel`.

![نموذج المدونة القابل للإخفاء](../../images/5/13be.png)

<h4>5.6: واجهة قائمة المدونات - الخطوة 6 (Blog List Frontend step 6)</h4>
افصل نموذج إنشاء المدونة في مكون مستقل `BlogForm.jsx` وانقل حالته الخاصة إليه.

<h4>5.7: واجهة قائمة المدونات - الخطوة 7 (Blog List Frontend step 7)</h4>
أضف زراً لكل مدونة للتحكم في إظهار وإخفاء تفاصيلها الكاملة (الرابط URL، وعدد الإعجابات Likes، واسم المستخدم الذي أضافها).

![تفاصيل المدونة](../../images/5/13ea.png)

<h4>5.8: واجهة قائمة المدونات - الخطوة 8 (Blog List Frontend step 8)</h4>
فعل زر الإعجاب (Like) بحيث يرسل طلب `HTTP PUT` لتحديث وزيادة عدد إعجابات المدونة في الخادم.

<h4>5.9: واجهة قائمة المدونات - الخطوة 9 (Blog List Frontend step 9)</h4>
تأكد من بقاء اسم صاحب المدونة ظاهراً بشكل سليم فور الضغط على زر الإعجاب دون الحاجة لإعادة تحميل الصفحة.

<h4>5.10: واجهة قائمة المدونات - الخطوة 10 (Blog List Frontend step 10)</h4>
رتب قائمة المدونات المعروضة تنازلياً حسب عدد الإعجابات (Likes) باستخدام دالة `sort()`.

<h4>5.11: واجهة قائمة المدونات - الخطوة 11 (Blog List Frontend step 11)</h4>
أضف زر حذف المدونة مع نافذة تأكيد `window.confirm`. واجعل زر الحذف يظهر فقط إذا كان المستخدم المسجل حالياً هو نفسه من قام بإنشاء المدونة.

![تأكيد الحذف](../../images/5/14ea.png)

<h4>5.12: واجهة قائمة المدونات - الخطوة 12 (Blog List Frontend step 12)</h4>
اضبط أداة ESLint في مشروع الواجهة الأمامية وأصلح كافة الأخطاء والتحذيرات.

</div>

