---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: ar
---

<div class="content">

اتبعنا حتى الآن التوصية القياسية في React برفع الحالة المشتركة إلى المكون الأب الأعلى (Lifting state up) وتمريرها عبر الخصائص (Props). يعمل هذا النمط جيداً في التطبيقات البسيطة، لكن مع تعقد التطبيق وتعدد المستويات يصبح تمرير الخصائص مرهقاً ومربكاً (Prop Drilling).

### معمارية Flux (Flux Architecture)

طورت فيسبوك معمارية **Flux** لفصل إدارة الحالة بالكامل في **مخازن خارجية (Stores)** خارج مكونات React:

![Action -> Dispatcher -> Store -> View](../../images/6/flux1.png)

لا يتم تعديل الحالة مباشرة، بل عبر إجراءات (**Actions**) تُحدث المخزن، مما يؤدي إلى إعادة تصيير الواجهات المشتركة تلقائياً.

---

### مكتبة Zustand لإدارة الحالة الحديثة

ظلت مكتبة Redux مهيمنة لسنوات، لكنها كانت تعاني من تعقيد الإعداد وكثرة الكود المكرر. أما اليوم، فتُعد مكتبة **[Zustand](https://zustand.docs.pmnd.rs/)** الخيار الأحدث والأسرع والأكثر تفضيلاً في مجتمع React.

لنقم بتثبيت Zustand:

```bash
npm install zustand
```

---

### إنشاء المخزن (Store) وتطبيقه على عداد بسيط

نُنشئ المخزن المركزي باستخدام دالة **`create`**:

```js
import { create } from 'zustand'

const useCounterStore = create(set => ({
  counter: 0,
  increment: () => set(state => ({ counter: state.counter + 1 })),
  decrement: () => set(state => ({ counter: state.counter - 1 })),
  zero: () => set(() => ({ counter: 0 })),
}))
```

- **دالة `set`**: دالة مساعدة تقدمها Zustand لتحديث الحالة بطريقة غير قابلة للتغيير (Immutable).
- **المحددات (Selectors)**: تتيح للمكونات اختيار الجزء الذي تحتاجه فقط من الحالة، مما يمنع إعادة تصيير المكونات غير المعنية بتغييرات الأجزاء الأخرى:

```jsx
const Display = () => {
  const counter = useCounterStore(state => state.counter)
  return <div>{counter}</div>
}

const Controls = () => {
  const increment = useCounterStore(state => state.increment)
  const decrement = useCounterStore(state => state.decrement)
  const zero = useCounterStore(state => state.zero)

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

### تنظيم المخزن وخطافات التخصيص (Custom Hooks)

من أفضل الممارسات تنظيم الإجراءات داخل كائن `actions` وتصدير خطافات مخصصة نظيفة:

```js
// store.js
import { create } from 'zustand'

const useCounterStore = create(set => ({
  counter: 0,
  actions: {
    increment: () => set(state => ({ counter: state.counter + 1 })),
    decrement: () => set(state => ({ counter: state.counter - 1 })),
    zero: () => set(() => ({ counter: 0 })),
  }
}))

export const useCounter = () => useCounterStore(state => state.counter)
export const useCounterControls = () => useCounterStore(state => state.actions)
```

وفي المكونات:

```jsx
import { useCounter, useCounterControls } from './store'

const Display = () => {
  const counter = useCounter()
  return <div>{counter}</div>
}

const Controls = () => {
  const { increment, decrement, zero } = useCounterControls()
  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrement}>minus</button>
      <button onClick={zero}>zero</button>
    </div>
  )
}
```

---

### تحديث الحالة بطريقة غير قابلة للتغيير (Immutability)

يجب ألا نعدل مصفوفات وكائنات الحالة الأصلية مباشرة (مثل `push` أو `splice`). بدلاً من ذلك، نستخدم دوال تُرجع نسخاً جديدة مثل `concat` أو `map` أو نشر المصفوفات `[...state.notes, newNote]`:

```js
const useNoteStore = create(set => ({
  notes: [],
  actions: {
    add: note => set(state => ({
      notes: state.notes.concat(note)
    })),
    toggleImportance: id => set(state => ({
      notes: state.notes.map(note =>
        note.id === id ? { ...note, important: !note.important } : note
      )
    }))
  }
}))
```

---

### النماذج غير الموجهة (Uncontrolled Forms)

يمكن قراءة قيم الحقول مباشرة من كائن الحدث `event.target.note.value` دون الحاجة لربطها بـ `useState`:

```jsx
const NoteForm = () => {
  const { add } = useNoteActions()

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    add({ id: Date.now(), content, important: false })
    event.target.reset()
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">إضافة</button>
    </form>
  )
}
```

</div>

<div class="tasks">

<h3>التمارين 6.1 - 6.5: إدارة الحالة مع Zustand</h3>

<h4>6.1: تطبيق Unicafe مع Zustand (Unicafe revisited)</h4>
أعد بناء تطبيق تقييم Unicafe (جيد Good، محايد Ok، سيئ Bad، الإجمالي All، المتوسط Average، النسبة الإيجابية Positive) بالاعتماد الكامل على مخزن Zustand لإدارة الحالة.

![تطبيق Unicafe](../../images/1/16e.png)

<h4>6.2: الطرائف البرمجية - الخطوة 1 (Anecdotes step 1)</h4>
ابنِ نظام التصويت على الطرائف البرمجية (Anecdotes) بحيث تُحفظ وتُعدل الأصوات في مخزن Zustand.

![تطبيق الطرائف مع التصويت](../../images/6/u2.png)

<h4>6.3: الطرائف البرمجية - الخطوة 2 (Anecdotes step 2)</h4>
أضف إمكانية إضافة طرفة جديدة باستخدام نموذج غير موجه (Uncontrolled form) وحفظها في مخزن Zustand.

<h4>6.4: الطرائف البرمجية - الخطوة 3 (Anecdotes step 3)</h4>
افصل مكونات التطبيق إلى: `AnecdoteForm` (لإضافة الطرفة) و `AnecdoteList` (لعرض القائمة والتصويت).

<h4>6.5: الطرائف البرمجية - الخطوة 4 (Anecdotes step 4)</h4>
رتب الطرائف المعروضة تنازلياً حسب عدد الأصوات باستخدام الدالة غير المعدلة للأصل `Array.toSorted()` للحفاظ على عدم قابلية الحالة للتغيير (Immutability).

</div>

