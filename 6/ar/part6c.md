---
mainImage: ../../../images/part-6.svg
part: 6
letter: c
lang: ar
---

<div class="content">

سنتعلم في هذا القسم نمطين حديثين لإدارة الحالة في تطبيقات React:
1. **مكتبة TanStack Query (React Query)**: المتخصصة في جلب ومزامنة وتخزين مؤقت (Caching) لبيانات الخادم (Server State).
2. **سياق React Context وخطاف `useContext`**: لإدارة الحالة العامة ومشاركتها بين المكونات لتجنب مشكلة تمرير الخصائص المضني (Prop Drilling).

---

### إدارة حالة الخادم باستخدام TanStack Query (React Query)

تُعد مكتبة **[TanStack Query](https://tanstack.com/query/latest)** الأداة القياسية لإدارة العمليات غير المتزامنة بين العميل والخادم.

نثبت المكتبة:

```bash
npm install @tanstack/react-query
```

في `main.jsx`، نُغلف التطبيق بـ `QueryClientProvider`:

```jsx
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

---

### جلب البيانات عبر `useQuery`

نُنشئ ملف طلبات الخادم `src/requests.js`:

```js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}
```

وفي المكون:

```jsx
import { useQuery } from '@tanstack/react-query'
import { getNotes } from './requests'

const App = () => {
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false,
  })

  if (result.isPending) {
    return <div>جاري تحميل البيانات...</div>
  }

  if (result.isError) {
    return <div>تعذر الاتصال بالخادم الخلفي!</div>
  }

  const notes = result.data

  return (
    <div>
      <h2>تطبيق الملاحظات</h2>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

### تعديل وحفظ البيانات عبر الطفرات `useMutation` وإبطال الكاش

لإرسال وتعديل البيانات في الخادم، نستخدم **الطفرات (Mutations)**:

```js
// requests.js
export const createNote = async (newNote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote),
  })
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  return await response.json()
}
```

وفي المكون، نستخدم `useMutation` مع `queryClient.invalidateQueries` لإعادة جلب البيانات الحديثة تلقائياً:

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from './requests'

const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // إبطال كاش الملاحظات ليقوم TanStack Query بإعادة جلب القائمة المحدثة
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.reset()
    newNoteMutation.mutate({ content, important: true })
  }

  // ...
}
```

---

### تحسين الأداء والتحديث التفاؤلي / اليدوي (Direct Cache Update)

يمكن تحديث الكاش المحلي فوراً دون إرسال طلب `GET` إضافي:

```js
const newNoteMutation = useMutation({
  mutationFn: createNote,
  onSuccess: (newNote) => {
    const notes = queryClient.getQueryData(['notes'])
    queryClient.setQueryData(['notes'], notes.concat(newNote))
  },
})
```

---

### استخراج المنطق في خطاف مخصص `useNotes`

```js
// hooks/useNotes.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, updateNote } from '../requests'

export const useNotes = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false,
  })

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    }
  })

  return {
    notes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addNote: (content) => newNoteMutation.mutate({ content, important: true }),
  }
}
```

---

### سياق React Context API لتجنب Prop Drilling

يوفر **Context API** طريقة لتمرير البيانات عبر شجرة المكونات دون الحاجة لتمرير الخصائص يدوياً عبر كل مستوى.

```jsx
// src/CounterContext.jsx
import { createContext, useState, useContext } from 'react'

const CounterContext = createContext()

export const CounterContextProvider = ({ children }) => {
  const [counter, setCounter] = useState(0)

  const increment = () => setCounter(counter + 1)
  const decrement = () => setCounter(counter - 1)
  const zero = () => setCounter(0)

  return (
    <CounterContext.Provider value={{ counter, increment, decrement, zero }}>
      {children}
    </CounterContext.Provider>
  )
}

export const useCounter = () => useContext(CounterContext)
```

وفي المكونات الفرعية البعيدة:

```jsx
import { useCounter } from './CounterContext'

const Display = () => {
  const { counter } = useCounter()
  return <div>{counter}</div>
}

const Controls = () => {
  const { increment, decrement, zero } = useCounter()
  return (
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={zero}>0</button>
    </div>
  )
}
```

---

### مقارنة حلول إدارة الحالة: متى نستخدم كل حل؟

- **`useState`**: مناسب للحالة المحلية المعزولة داخل مكون واحد (مثل حقول النماذج البسيطة).
- **`TanStack Query`**: الحل الأمثل والافتراضي لإدارة حالة الخادم (Server State) والتخزين المؤقت والمزامنة.
- **`React Context`**: مناسب للحالة العامة الخفيفة مثل سمة المظهر (Dark/Light mode) أو لغة الواجهة أو بيانات المستخدم المسجل.
- **`Zustand`**: الخيار الأفضل لإدارة الحالة العامة المعقدة للعميل (Client State) بسرعة وسهولة دون تعقيدات Redux.

</div>

<div class="tasks">

<h3>التمارين 6.16 - 6.22: TanStack Query و Context API</h3>

<h4>6.16: طرائف TanStack Query - الخطوة 1 (Query Anecdotes step 1)</h4>
قم بجلب الطرائف من الخادم باستخدام `useQuery`. أظهر رسالة خطأ ملائمة في حال تعذر الاتصال بالخادم.

![رسالة تعذر الاتصال بالخادم](../../images/6/65new.png)

<h4>6.17: طرائف TanStack Query - الخطوة 2 (Query Anecdotes step 2)</h4>
نفذ إضافة طرفة جديدة باستخدام `useMutation` وتحديث قائمة الطرائف في الواجهة تلقائياً.

<h4>6.18: طرائف TanStack Query - الخطوة 3 (Query Anecdotes step 3)</h4>
نفذ التصويت على الطرائف باستخدام `useMutation` وعكس زيادة عدد الأصوات فوراً على الشاشة.

<h4>6.19: طرائف TanStack Query - الخطوة 4 (Query Anecdotes step 4)</h4>
اعزل استدعاءات TanStack Query داخل خطاف مخصص `useAnecdotes`.

<h4>6.20: إدارة الإشعارات بـ Context API (Notification Context)</h4>
أدر حالة رسائل التنبيه (Notification) باستخدام React Context API بحيث تظهر رسالة التنبيه لمدة 5 ثوانٍ عند التصويت أو إضافة طرفة جديدة.

![إشعار نجاح الإضافة](../../images/6/66new.png)

<h4>6.21: معالجة الأخطاء في الطفرات (Mutation Error Handling)</h4>
إذا كان نص الطرفة أقل من 5 أحرف، يرفض الخادم الطلب. اعرض رسالة تنبيه تفيد بالخطأ للمستخدم باستخدام دالة رد النداء `onError` في الطفرة.

![إشعار الخطأ](../../images/6/67new.png)

<h4>6.22: عزل سياق التنبيهات في خطاف مخصص `useNotify`</h4>
انقل سياق التنبيهات إلى ملف مستقل `NotificationContext.jsx` وأنشئ خطافاً مخصصاً `useNotify` لتسهيل استخدامه في كافة المكونات.

هذا هو التمرين الأخير في هذا الجزء. ارفع حلولك إلى GitHub وسجل إنجازك في نظام التسليم.

</div>
