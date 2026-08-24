---
mainImage: ../../../images/part-6.svg
part: 6
letter: b
lang: ar
---

<div class="content">

سنواصل في هذا القسم توسيع تطبيق الملاحظات المعتمد على **Zustand** عبر إضافة تصفية الملاحظات (Filtering)، والاتصال بالخادم عبر واجهة **Fetch API** الأصلية، والإجراءات غير المتزامنة (Async Actions)، والبرمجيات الوسيطة (Middlewares)، وكتابة اختبارات مخازن Zustand.

---

### إدارة الحالة المعقدة وتصفية الملاحظات (Visibility Filter)

نضيف خاصية `filter` وإجراء `setFilter` إلى مخزن Zustand:

```js
// src/store.js
import { create } from 'zustand'

const useNoteStore = create(set => ({
  notes: [],
  filter: 'all',
  actions: {
    add: note => set(state => ({
      notes: state.notes.concat(note)
    })),
    toggleImportance: id => set(state => ({
      notes: state.notes.map(note =>
        note.id === id ? { ...note, important: !note.important } : note
      )
    })),
    setFilter: value => set(() => ({ filter: value })),
    initialize: notes => set(() => ({ notes })),
  }
}))

export const useNotes = () => {
  const notes = useNoteStore(state => state.notes)
  const filter = useNoteStore(state => state.filter)

  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)
  return notes
}

export const useFilter = () => useNoteStore(state => state.filter)
export const useNoteActions = () => useNoteStore(state => state.actions)
```

تتولى الدالة المخصصة `useNotes` إرجاع قائمة الملاحظات المصفاة مباشرة، دون حاجة مكون `NoteList` لمعرفة تفاصيل التصفية:

```jsx
// src/components/VisibilityFilter.jsx
import { useNoteActions } from '../store'

const VisibilityFilter = () => {
  const { setFilter } = useNoteActions()

  return (
    <div>
      <input type="radio" name="filter" onChange={() => setFilter('all')} defaultChecked /> الكل
      <input type="radio" name="filter" onChange={() => setFilter('important')} /> الهامة
      <input type="radio" name="filter" onChange={() => setFilter('nonimportant')} /> غير الهامة
    </div>
  )
}

export default VisibilityFilter
```

---

### التواصل مع الخادم عبر واجهة Fetch API الأصلية

بدلاً من تثبيت مكتبات خارجية مثل Axios، يمكننا استخدام واجهة المتصفح و Node.js المدمجة **`fetch()`**:

```js
// src/services/notes.js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

const createNew = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, important: false }),
  }

  const response = await fetch(baseUrl, options)
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  return await response.json()
}

const update = async (id, note) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })
  if (!response.ok) {
    throw new Error('Failed to update note')
  }
  return await response.json()
}

export default { getAll, createNew, update }
```

---

### الإجراءات غير المتزامنة داخل مخزن Zustand (Async Actions)

لعزل الاتصال بالخادم بعيداً عن مكونات الواجهة، نُعرف دوال الاتصال كدوال غير متزامنة `async` داخل كائن `actions` في المخزن:

```js
import { create } from 'zustand'
import noteService from './services/notes'

const useNoteStore = create((set, get) => ({
  notes: [],
  filter: 'all',
  actions: {
    initialize: async () => {
      const notes = await noteService.getAll()
      set(() => ({ notes }))
    },
    add: async (content) => {
      const newNote = await noteService.createNew(content)
      set(state => ({ notes: state.notes.concat(newNote) }))
    },
    toggleImportance: async (id) => {
      const note = get().notes.find(n => n.id === id)
      const updated = await noteService.update(id, {
        ...note,
        important: !note.important,
      })
      set(state => ({
        notes: state.notes.map(n => n.id === id ? updated : n)
      }))
    },
    setFilter: value => set(() => ({ filter: value })),
  }
}))
```

- يتيح المعامل **`get()`** الوصول الآمن للحالة الحالية داخل دوال المخزن.

---

### البرمجيات الوسيطة (Middlewares) وأداة Redux DevTools

تدعم Zustand تغليف المخزن ببرمجيات وسيطة لتسجيل التغييرات أو ربطها بأدوات المطورين:

```js
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useNoteStore = create(devtools((set, get) => ({
  notes: [],
  // ...
})))
```

---

### اختبار مخازن Zustand عبر Vitest و React Testing Library

يمكن اختبار المخزن مباشرة عبر `useNoteStore.getState()` أو باختبار الخطافات المخصصة عبر `renderHook` و `act`:

```js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useNoteStore, { useNotes, useNoteActions } from './store'
import noteService from './services/notes'

vi.mock('./services/notes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
  }
}))

beforeEach(() => {
  useNoteStore.setState({ notes: [], filter: 'all' })
  vi.clearAllMocks()
})

describe('useNoteActions', () => {
  it('initialize loads notes from service', async () => {
    const mockNotes = [{ id: 1, content: 'Test note', important: false }]
    noteService.getAll.mockResolvedValue(mockNotes)

    const { result } = renderHook(() => useNoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: notesResult } = renderHook(() => useNotes())
    expect(notesResult.current).toEqual(mockNotes)
  })
})
```

</div>

<div class="tasks">

<h3>التمارين 6.6 - 6.15: تصفية الطرائف، التواصل مع الخادم والاختبارات</h3>

<h4>6.6: الطرائف البرمجية - الخطوة 5 (Anecdotes step 5)</h4>
أضف ميزة تصفية الطرائف المعروضة (Filter) بناءً على النص المكتوب في حقل التصفية.

![تصفية الطرائف بالبحث](../../images/6/u3.png)

<h4>6.7: الطرائف البرمجية - الخطوة 6 (Anecdotes step 6)</h4>
اجلب الطرائف الأولية من خادم JSON Server عند تشغيل التطبيق باستخدام Fetch API وحفظها في مخزن Zustand.

<h4>6.8: الطرائف البرمجية - الخطوة 7 (Anecdotes step 7)</h4>
احفظ الطرائف الجديدة المنشأة في خادم JSON Server عبر طلب `POST` باستخدام Fetch API.

<h4>6.9: الطرائف البرمجية - الخطوة 8 (Anecdotes step 8)</h4>
قم بتحديث عدد الأصوات في الخادم الخلفي عند النقر على زر التصويت عبر طلب `PUT`.

<h4>6.10: الطرائف البرمجية - الخطوة 9 (Anecdotes step 9)</h4>
ابنِ مخزناً مستقلاً للإشعارات التنبيهية (Notifications) لعرض رسالة تفيد بنجاح التصويت أو إنشاء طرفة لمدة 5 ثوانٍ ثم إخفائها تلقائياً.

![إشعار التصويت](../../images/6/8eb.png)

<h4>6.11: الطرائف البرمجية - الخطوة 10 (Anecdotes step 10)</h4>
أضف زراً ومساراً لحذف الطرائف التي لم تحصل على أي صوت (0 أصوات) من الخادم والمخزن.

<h4>6.12 - 6.15: اختبارات مخزن الطرائف (Anecdotes tests)</h4>
- **6.12**: اكتب اختباراً يتحقق من تهيئة الحالة بالطرائف المستلمة من الخادم.
- **6.13**: اكتب اختباراً يتحقق من إرجاع الطرائف مرتبة تنازلياً حسب عدد الأصوات.
- **6.14**: اكتب اختباراً يتحقق من تطبيق التصفية النصية بصورة صحيحة.
- **6.15**: اكتب اختباراً يتحقق من زيادة عدد الأصوات عند استدعاء إجراء التصويت.

</div>

