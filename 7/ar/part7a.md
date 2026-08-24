---
mainImage: ../../../images/part-7.svg
part: 7
letter: a
lang: ar
---

<div class="content">

تختلف التمارين في هذا الجزء من الدورة قليلاً عن التمارين السابقة. كالمعتاد، هناك بعض التمارين المتعلقة بالجانب النظري لهذا الفصل. أما الفصول الأخرى من هذا الجزء فلا تحتوي على تمارين منفصلة.

بالإضافة إلى ذلك، يحتوي هذا الجزء على سلسلة تمارين أكبر توسّع تطبيق قائمة المدونات (BlogList) الذي تم بناؤه في الجزأين 4 و 5. يمكنك العثور على تلك التمارين [هنا](/ar/part7/exercises_extending_the_bloglist).

### خطافات ريأكت (React Hooks)

توفّر مكتبة React نحو 18 [خطافاً مدمجاً (Built-in Hooks)](https://react.dev/reference/react/hooks) مختلفاً، وأكثرها استخداماً وشعبية هما الخطافان [useState](https://react.dev/reference/react/useState) و [useEffect](https://react.dev/reference/react/useEffect) اللذان استخدمناهما بالفعل بكثافة.

في [الجزء الخامس](/ar/part5/props_children_and_component_refs#references-to-components-with-ref) استخدمنا [useRef](https://react.dev/reference/react/useRef) و [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle) اللذين أتاحا للمكوّن توفير وصول لدواله إلى مكوّنات أخرى. وفي [الجزء السادس](/ar/part6/react_query_use_reducer_and_the_context) استخدمنا [useContext](https://react.dev/reference/react/useContext) لتطبيق حالة عامة (Global State).

خلال العامين الماضيين، أصبحت الخطافات الطريقة القياسية للمكتبات لكشف واجهات برمجة التطبيقات (APIs) الخاصة بها. وطوال هذه الدورة رأينا بالفعل عدة أمثلة على ذلك: توفر مكتبة [Zustand](https://zustand-demo.pmnd.rs/) الخطاف <i>useStore</i> للوصول إلى الحالة العامة، وتكشف مكتبة [React Router](https://reactrouter.com/) عن <i>useNavigate</i> و <i>useParams</i> للتنقل البرمجي والوصول إلى معلمات المسار في الـ URL، وتوفر [React Query](https://tanstack.com/query/latest) الخطافين <i>useQuery</i> و <i>useMutation</i> لإدارة حالة الخادم.

كما ذكرنا في [الجزء الأول](/ar/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks)، فإن الخطافات ليست دوالاً عادية، وعند استخدامها يجب علينا الالتزام بـ [قواعد أو قيود](https://react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks) معينة. دعنا نستعرض قواعد استخدام الخطافات مجدداً، منقولة بدقة من وثائق React الرسمية:

**لا تستدعِ الخطافات داخل الحلقات التكرارية (Loops)، أو الشروط (Conditions)، أو الدوال المتداخلة (Nested Functions).** بدلاً من ذلك، استخدم دائماً الخطافات في المستوى الأعلى (Top Level) من دالة مكوّن React الخاصة بك.

**يمكنك فقط استدعاء الخطافات أثناء قيام React بتصيير مكوّن دالي (Function Component):**

- استدعِها في المستوى الأعلى داخل جسم المكوّن الدالي.
- استدعِها في المستوى الأعلى داخل جسم خطاف مخصص (Custom Hook).

توجد إضافة جاهزة لـ ESLint هي [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) يمكن استخدامها للتحقق من أن التطبيق يستخدم الخطافات بشكل صحيح:

![vscode error useState being called conditionally](../../images/7/60ea.png)

بالإضافة إلى الخطافات التي استخدمناها بالفعل، توفر React العديد من الخطافات المدمجة الأخرى التي تستحق المعرفة. في هذا القسم سنلقي نظرة على اثنين منها: <i>useMemo</i> و <i>useCallback</i> وكلاهما يختص بتحسين الأداء (Performance Optimization). بعد ذلك سننتقل إلى الخطافات المخصصة (Custom Hooks)، والتي تتيح لك تجميع أي توليفة من الخطافات داخل دالة مخصصة خاصة بك قابلة لإعادة الاستخدام.

### useMemo

في كل مرة يعاد فيها تصيير (Re-render) مكوّن React، يُنفّذ جسم الدالة بأكمله مرة أخرى. بالنسبة لمعظم المكوّنات، لا يمثل هذا أي مشكلة، ولكن في بعض الأحيان ينفذ المكوّن عملية حسابية مكلفة، مثل تصفية قائمة ضخمة، أو فرز البيانات، أو اشتقاق قيمة معقدة، وتكرار هذه العملية في كل تصيير يؤدي إلى هدر الوقت والموارد.

يتيح لك [useMemo](https://react.dev/reference/react/useMemo) حفظ نتيجة العملية الحسابية في الذاكرة المؤقتة (Cache) بين عمليات التصيير. يستقبل الخطاف دالة تقوم بالحساب ومصفوفة تبعيات (Dependency Array). تقوم React بإعادة تشغيل الدالة فقط عند تغير إحدى التبعيات؛ خلاف ذلك، فإنها تُرجع النتيجة المخزنة مؤقتاً مسبقاً.

تأمل مكوّناً يُصيّر قائمة كبيرة من العناصر المصفاة بناءً على مصطلح بحث:

```js
import { useState } from 'react'

const expensiveCalculation = () => {
  let sum = 0
  for (let i = 0; i < 100000; i++) sum += i
  return sum
}

const ITEMS = Array.from({ length: 10000 }, (_, i) => `item ${i + 1}`)

const FilteredList = () => {
  const [filter, setFilter] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  console.log('filtering...')
  const filtered = ITEMS.filter(item => {
    expensiveCalculation()
    return item.includes(filter)
  })

  return (
    <div style={{ background: darkMode ? '#333' : '#fff' }}>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="filter items"
      />
      <button onClick={() => setDarkMode(!darkMode)}>toggle dark mode</button>
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

export default FilteredList
```

تستغرق عملية تصفية القائمة الآن بعض الوقت، ويرجع الفضل في ذلك جزئياً إلى عملية التباطؤ المصطنعة التي أضفناها.

مشكلة هذا المكوّن هي أن النقر فوق زر الوضع الداكن (Dark Mode) سيعيد تصفية جميع العناصر البالغ عددها 10,000 عنصر على الرغم من أن نص الفلترة لم يتغير على الإطلاق.

يمكننا إصلاح ذلك باستخدام <i>useMemo</i>:

```js
import { useState, useMemo } from 'react' // highlight-line

const FilteredList = () => {
  const [filter, setFilter] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const filtered = useMemo(() => {  // highlight-line
    console.log('filtering...')
    return ITEMS.filter(item => {
      expensiveCalculation()
      return item.includes(filter)
    })
  }, [filter])  // highlight-line

  return (
    <div style={{ background: darkMode ? '#333' : '#fff' }}>
      //...
    </div>
  )
}
```

باستخدام <i>useMemo</i>، لا تعمل عملية الفلترة المكلفة إلا عند تغير <i>filter</i>. يؤدي تبديل الوضع الداكن فقط إلى تحديث لون الخلفية، ويتم إرجاع قائمة العناصر المصفاة المخزنة مؤقتاً على الفور.

تعمل مصفوفة التبعيات تماماً مثل تلك الموجودة في <i>useEffect</i>: تقارن React كل قيمة بالقيم في التصيير السابق. إذا كانت جميع القيم متطابقة، يُعاد استخدام الناتج المخزن (Memoized). إذا اختلفت أي قيمة، يُعاد تشغيل الدالة وتُحفظ النتيجة الجديدة في الذاكرة المؤقتة للتصيير التالي.

يمكن أيضاً استخدام <i>useMemo</i> لحفظ الكائنات والمصفوفات التي يتم تمريرها كخصائص (Props)، مما يمنع عمليات إعادة التصيير غير الضرورية للمكوّنات الأبناء التي تعتمد على مساواة المرجع (Reference Equality). على سبيل المثال:

```js
const App = () => {
  const [filter, setFilter] = useState('')

  // Without useMemo, 'options' is a new object on every render even if filter hasn't changed
  const options = useMemo(() => ({ caseSensitive: false, filter }), [filter]) // highlight-line

  return <SearchResults options={options} />
}
```

يُعد <i>useMemo</i> أداة لتحسين الأداء، لذا لا ينبغي أن تلجأ إليه افتراضياً في كل مكان. فالتحسين المسبق لأوانه ([Premature Optimization](https://wiki.c2.com/?PrematureOptimization)) يضيف تعقيداً للشيفرة دون فائدة عندما تكون العملية الحسابية سريعة بالفعل. قم بقياس الأداء أولاً، وأضف <i>useMemo</i> فقط عندما تتأكد من أن عملية حسابية معينة تشكل عنق زجاجة حقيقياً للأداء.

### React.memo

بينما يحفظ <i>useMemo</i> نتيجة عملية حسابية داخل مكوّن، يتبع [React.memo](https://react.dev/reference/react/memo) زاوية مختلفة: فهو يحفظ ناتج التصيير للمكوّن بأكمله. إن <i>React.memo</i> ليس خطافاً بل هو مكوّن عالي الرتبة (Higher-Order Component)، ونحن نغطيه هنا لأنه يكمل <i>useMemo</i> بشكل رائع. عندما يتم تغليف مكوّن بواسطة <i>React.memo</i>، تتخطى React إعادة تصييره إذا لم تتغير خصائصه (Props) منذ آخر عملية تصيير.

```js
const MyComponent = React.memo(({ value }) => {
  console.log('rendered')
  return <div>{value}</div>
})
```

بدون <i>React.memo</i>، يعاد تصيير <i>MyComponent</i> في كل مرة يُصيّر فيها المكوّن الأب، حتى لو كانت قيمة <i>value</i> هي نفسها تماماً. أما عند استخدامه، تقارن React الخصائص القديمة والجديدة باستخدام المساواة السطحية (Shallow Equality)، ولا تعيد التصيير إلا إذا تغير شيء ما بالفعل.

لاحظ أن <i>React.memo</i> يتحقق فقط من الخصائص (Props). إذا كان المكوّن يستخدم قيمة سياق (Context) أو حالته الخاصة (State)، فسيظل يعاد تصييره عندما تتغير تلك القيم.

يتكامل <i>React.memo</i> بشكل طبيعي مع <i>useMemo</i>، حيث يمنع <i>useMemo</i> العمليات الحسابية المكلفة من إعادة التشغيل، بينما يمنع <i>React.memo</i> المكوّن نفسه من إعادة التصيير.

إذا استقبل مكوّن تم حفظه عبر memo مرجع دالة أو كائن جديد في كل تصيير، فستفشل عملية الحفظ (Memoization)، وهنا يأتي دور <i>useCallback</i>.

### useCallback

تُعاد كتابة وإنشاء الدوال المعرفة داخل المكوّن ككائنات جديدة في كل عملية تصيير. هذا الأمر غير ضار في العادة، ولكنه يصبح مشكلة في حالتين محددتين:

- عندما يستقبل مكوّن ابن مغلّف بـ [React.memo](https://react.dev/reference/react/memo) دالة كخاصية (Prop). نظراً لأن الدالة عبارة عن كائن جديد في كل مرة، فإن المكوّن الابن يرى دائماً خاصية متغيرة ويعيد تصيير نفسه على أي حال، مما يبطل الغرض من استخدام memo.
- عندما تُدرج دالة كتبعية داخل <i>useEffect</i> أو <i>useMemo</i>. إنشاء دالة جديدة في كل تصيير يعني أن التأثير (Effect) أو التخزين المؤقت (Memo) سيعاد تشغيله في كل تصيير.

يحل [useCallback](https://react.dev/reference/react/useCallback) هذه المشكلة عن طريق حفظ الدالة نفسها في الذاكرة المؤقتة بين عمليات التصيير، وإرجاع نفس كائن الدالة طالما لم تتغير تبعياتها. يستقبل دالة ومصفوفة تبعيات، وهو مطابق تماماً في البنية لـ <i>useMemo</i>.

إليك مثالاً ملموساً. لدينا مكوّن <i>NoteList</i> مكلف في التصيير، لذا نغلفه بـ <i>React.memo</i>:

```js
// React.memo makes this component skip re-rendering if its props haven't changed
const NoteList = memo(({ onDelete, notes }) => {
  console.log('NoteList rendered')
  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>
          {note.content}
          <button onClick={() => onDelete(note.id)}>delete</button>
        </li>
      ))}
    </ul>
  )
})

const App = () => {
  const [notes, setNotes] = useState([
    { id: 1, content: 'Learn React' },
    { id: 2, content: 'Learn hooks' },
    { id: 3, content: 'Learn useMemo' },
    { id: 4, content: 'Learn useCallback' },
    { id: 5, content: 'Build something cool' },
  ])
  const [newNote, setNewNote] = useState('')

  const handleDelete = (id) => {
    setNotes(notes => notes.filter(note => note.id !== id))
  }

  const handleAdd = () => {
    setNotes(notes => [...notes, { id: Date.now(), content: newNote }])
    setNewNote('')
  }

  return (
    <div>
      <input value={newNote} onChange={e => setNewNote(e.target.value)} />
      <button onClick={handleAdd}>add</button>
      <NoteList notes={notes} onDelete={handleDelete} />
    </div>
  )
}
```

المشكلة هنا هي أن دالة <i>handleDelete</i> معرفة كدالة عادية داخل <i>App</i>. في كل مرة يعاد فيها تصيير <i>App</i> (وهو ما يحدث عند كل ضغطة زر داخل حقل إدخال الملاحظة)، يتم إنشاء كائن دالة جديد تماماً وتمريره إلى <i>NoteList</i> كخاصية <i>onDelete</i>.

من وجهة نظر <i>React.memo</i>، لقد تغيرت الخاصية، وبالتالي يعاد تصيير <i>NoteList</i> على الرغم من أن القائمة نفسها لم تتغير:

![many rerenders...](../../images/7/h1.png)

يمكننا إصلاح ذلك باستخدام <i>useCallback</i>، الذي يرجع نفس كائن الدالة بين عمليات التصيير طالما لم تتغير تبعياته:

```js
import { useState, useCallback, memo } from 'react'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

// highlight-start
  const handleDelete = useCallback((id) => { // highlight-line
    setNotes(notes => notes.filter(note => note.id !== id))
  }, []) // no external dependencies: this function never needs to change
// highlight-end

  // ...
  return (
    // ...
  )
}
```

الآن أصبحت دالة <i>handleDelete</i> مستقرة: تُرجع React نفس كائن الدالة تماماً في كل تصيير، لذلك لا يرى <i>React.memo</i> أي تغيير في الخاصية <i>onDelete</i> ويتخطى إعادة تصيير <i>NoteList</i> بالكامل.

تماماً مثل <i>useMemo</i>، لا تلجأ إلى <i>useCallback</i> إلا عندما تواجه مشكلة ملموسة، مثل مكوّن ابن محفوظ عبر memo يعيد تصيير نفسه بدون داعٍ أو خطاف <i>useEffect</i> يعمل بتكرار مفرط بسبب تبعية تعتمد على دالة. إن إضافتها في كل مكان تجعل قراءة الشيفرة أكثر صعوبة دون تقديم أي فائدة حقيقية للأداء.

### الخطافات المخصصة (Custom hooks)

تتيح React إمكانية إنشاء خطافات [مخصصة](https://react.dev/learn/reusing-logic-with-custom-hooks). وفقاً لـ React، فإن الغرض الأساسي من الخطافات المخصصة هو تسهيل إعادة استخدام المنطق البرمجي المستخدم داخل المكوّنات.

> <i>يتيح لك بناء خطافاتك الخاصة استخراج منطق المكوّنات إلى دوال قابلة لإعادة الاستخدام.</i>

الخطافات المخصصة هي دوال JavaScript عادية يمكنها استخدام أي خطافات أخرى، طالما أنها تلتزم بـ [قواعد الخطافات](/ar/part1/a_more_complex_state_debugging_react_apps#rules-of-hooks). بالإضافة إلى ذلك، يجب أن يبدأ اسم الخطاف المخصص بالبادئة <i>use</i>.

الرؤية الجوهرية هنا هي أن أي منطق قائم على الحالة (Stateful Logic) تجد نفسك تكرره عبر مكوّنات متعددة يُعد مرشحاً مثالياً للاستخراج داخل خطاف مخصص. ينشئ كل استدعاء لنفس الخطاف قطعة حالة مستقلة تماماً. وهذا هو ما يميز الخطاف المخصص عن الدالة المساعدة العادية (Utility Function).

لقد قمنا بالفعل بتنفيذ العديد من الخطافات المخصصة في الجزء السادس. تم إنشاء الخطافين <i>useNotes</i> و <i>useNoteActions</i> في قسم [Zustand](/ar/part6/flux_architecture_and_zustand#zustand-notes)، وتم تعريف <i>useCounter</i> في قسم [React Query و Context](/ar/part6/react_query_context_api#defining-the-counter-context-in-its-own-file).

#### خطاف العداد (Counter hook)

قمنا بتطبيق تطبيق عداد في [الجزء الأول](/ar/part1/component_state_event_handlers#event-handling) يمكن زيادة قيمته، أو إنقاصها، أو تصفيرها. شيفرة التطبيق كانت على النحو التالي:

```js  
import { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(counter - 1)}>
        minus
      </button>      
      <button onClick={() => setCounter(0)}>
        zero
      </button>
    </div>
  )
}
```

دعنا نستخرج منطق العداد داخل خطاف مخصص. شيفرة هذا الخطاف كالتالي:

```js
const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value, 
    increase,
    decrease,
    zero
  }
}
```

يستخدم خطافنا المخصص خطاف <i>useState</i> داخلياً لإنشاء حالته الخاصة. يُرجع الخطاف كائناً تشتمل خصائصه على قيمة العداد ودوال للتعديل على هذه القيمة.

يمكن لمكوّنات React استخدام الخطاف كما هو موضح أدناه:

```js
const App = () => {
  const counter = useCounter()

  return (
    <div>
      <div>{counter.value}</div>
      <button onClick={counter.increase}>
        plus
      </button>
      <button onClick={counter.decrease}>
        minus
      </button>      
      <button onClick={counter.zero}>
        zero
      </button>
    </div>
  )
}
```

من خلال القيام بذلك، يمكننا استخراج حالة المكوّن <i>App</i> والتعديل عليها بالكامل داخل الخطاف <i>useCounter</i>. أصبحت إدارة حالة ومنطق العداد الآن من مسؤولية هذا الخطاف المخصص.

يمكن <i>إعادة استخدام</i> نفس الخطاف في التطبيق الذي كان يتتبع عدد النقرات على الزرين الأيسر والأيمن:

```js

const App = () => {
  const left = useCounter()
  const right = useCounter()

  return (
    <div>
      {left.value}
      <button onClick={left.increase}>
        left
      </button>
      <button onClick={right.increase}>
        right
      </button>
      {right.value}
    </div>
  )
}
```

يُنشئ التطبيق عدادين منفصلين تماماً. تم تعيين الأول للمتغير <i>left</i> والآخر للمتغير <i>right</i>. ينشئ كل استدعاء لـ <i>useCounter</i> جزءاً مستقلاً تماماً من الحالة الخاصة به.

#### الخطافات المخصصة وإعادة تصيير المكوّن

السؤال الطبيعي الذي يطرح نفسه هنا هو: متى يُعاد تصيير المكوّن الذي يستخدم خطافاً مخصصاً بالفعل؟

الإجابة واضحة بمجرد أن تفهم ما هو الخطاف المخصص حقاً. الخطاف المخصص ليس كياناً منفصلاً من منظور المكوّن؛ إنه مجرد جزء من المنطق الخاص بالمكوّن نفسه تم نقله إلى دالة منفصلة. هذا يعني أن جميع الحالات والتأثيرات المعرفة داخل الخطاف تنتمي إلى المكوّن الذي يستدعي الخطاف، وليس إلى الخطاف نفسه.

نتيجة لذلك، فإن قواعد إعادة التصيير هي نفسها تماماً كما هو الحال مع الخطافات المدمجة. يُعاد تصيير المكوّن عند تغير الحالة المدارة داخل الخطاف، أو عند تغير قيمة سياق (Context) يشترك فيه الخطاف، أو عندما يتسبب أي خطاف يستدعيه الخطاف المخصص داخلياً في إعادة التصيير.

من ناحية أخرى، فإن أشياء مثل إعادة تعيين المتغيرات العادية داخل الخطاف، أو تغير المعاملات الممررة إلى الخطاف بحد ذاتها، لا تسبب إعادة التصيير مباشرة.

ومع ذلك، فإن المعاملات تستحق نظرة فاحصة. تمرير قيمة جديدة إلى خطاف لا يجدول بحد ذاته إعادة تصيير، ولكن إذا استخدم الخطاف هذا المعامل كتبعية داخل <i>useEffect</i> أو <i>useMemo</i>، فإن التغيير في المعامل سيؤدي إلى إعادة تشغيل التأثير أو الحفظ المؤقت، وإذا استدعى ذلك بدوره دالة تعديل الحالة (State Setter)، فسيُعاد تصيير المكوّن.

طريقة مفيدة للتفكير في الأمر: تخيل أنك قمت بنسخ ولصق كافة الشيفرات من داخل خطافك المخصص مباشرة في المكوّن. سيكون سلوك إعادة التصيير متطابقاً تماماً. الخطاف هو مجرد وسيلة لتنظيم تلك الشيفرة، وليس حداً تعامله React بشكل خاص واستثنائي.

```js
const useCounter = () => {
  const [count, setCount] = useState(0) // this state belongs to the calling component
  return { count, increment: () => setCount(c => c + 1) }
}

const MyComponent = () => {
  const { count, increment } = useCounter()
  // re-renders whenever the count state inside the hook is updated
}
```

#### خطاف حقول النماذج (Form field hook)

يُعد التعامل مع النماذج في React أمراً معقداً نوعاً ما. يقدم التطبيق التالي للمستخدم نموذجاً يطلب منه إدخال اسمه وتاريخ ميلاده وطوله:

```js
const App = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [height, setHeight] = useState('')

  return (
    <div>
      <form>
        name: 
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)} 
        /> 
        <br/> 
        birthdate:
        <input
          type='date'
          value={born}
          onChange={(event) => setBorn(event.target.value)}
        />
        <br /> 
        height:
        <input
          type='number'
          value={height}
          onChange={(event) => setHeight(event.target.value)}
        />
      </form>
      <div>
        {name} {born} {height} 
      </div>
    </div>
  )
}
```

لكل حقل في النموذج حالته الخاصة. للحفاظ على مزامنة حالة النموذج مع البيانات التي يقدمها المستخدم، يجب علينا تسجيل معالج <i>onChange</i> مناسب لكل عنصر من عناصر <i>input</i>. النمط متطابق لكل حقل، والشيء الوحيد الذي يختلف هو اسم متغير الحالة. هذا هو بالضبط نوع التكرار الذي صُممت الخطافات المخصصة للقضاء عليه.

دعنا نعرّف خطاف <i>useField</i> المخصص لتبسيط إدارة حالة النموذج:

```js
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}
```

تستقبل دالة الخطاف نوع حقل الإدخال كمعامل. وتُرجع جميع السمات التي يتطلبها عنصر <i>input</i>: نوعه، وقيمته، ومعالج onChange الخاص به.

يمكن استخدام الخطاف بالطريقة التالية:

```js
const App = () => {
  const name = useField('text')
  // ...

  return (
    <div>
      <form>
        <input
          type={name.type}
          value={name.value}
          onChange={name.onChange} 
        /> 
        // ...
      </form>
// ...
      <div>
        {name.value} {born} {height}  // highlight-line
      </div>      
    </div>
  )
}
```

### سمات النشر (Spread attributes)

يمكننا تبسيط الأمور أكثر من ذلك. نظراً لأن كائن <i>name</i> يحتوي تماماً على كافة السمات التي يتوقع عنصر <i>input</i> استلامها كخصائص (Props)، فيمكننا تمرير هذه الخصائص إلى العنصر باستخدام [بناء جملة النشر (Spread Syntax)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) بالطريقة التالية:

```js
<input {...name} /> 
```

كما يوضح [المثال](https://react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax) في وثائق React، فإن الطريقتين التاليتين لتمرير الخصائص إلى المكوّن تحققان نفس النتيجة تماماً:

```js
<Greeting firstName='Arto' lastName='Hellas' />

const person = {
  firstName: 'Arto',
  lastName: 'Hellas'
}

<Greeting {...person} />
```

يصبح التطبيق مبسطاً بالصيغة التالية:

```js
const App = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    <div>
      <form>
        name: 
        <input  {...name} /> 
        <br/> 
        birthdate:
        <input {...born} />
        <br /> 
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  )
}
```

يصبح التعامل مع النماذج مبسطاً للغاية عندما يتم تغليف التفاصيل الدقيقة والمزعجة المتعلقة بمزامنة حالة النموذج داخل خطافنا المخصص.

#### حفظ الحالة عبر خطاف مخصص (Persisting state with a custom hook)

يمكن للخطافات المخصصة دمج العديد من الخطافات المدمجة لتغليف سلوك أكثر تعقيداً. من الميزات الشائعة والمطلوبة بكثرة حفظ الحالة في <i>localStorage</i> حتى تظل موجودة بعد تحديث الصفحة (Refresh). إليك خطاف <i>useLocalStorage</i> الذي يغلّف <i>useState</i> ويحافظ على تزامن القيمة مع localStorage:

```js
import { useState } from 'react'

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
```

يستقبل الخطاف مفتاح التخزين وقيمة أولية. في أول تصيير، يقرأ من localStorage، ويعود إلى <i>initialValue</i> إذا لم يكن هناك شيء مخزن بعد. وتقوم دالة التعيين المرجعة بتحديث كل من حالة React وموقع localStorage في نفس الوقت.

يبدو المكوّن الذي يستخدمه تماماً مثل المكوّن الذي يستخدم <i>useState</i> البسيط:

```js
const App = () => {
  const [name, setName] = useLocalStorage('name', '')

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p>Hello, {name}! (your name is stored in localStorage)</p>
    </div>
  )
}
```

ليس لدى المكوّن أي فكرة عن مشاركة localStorage في العملية. فهذا الاهتمام مخفي تماماً داخل الخطاف.

### المزيد عن الخطافات

الخطافات المخصصة ليست مجرد أداة لإعادة استخدام الشيفرات؛ إنها توفر أيضاً طريقة أفضل لتقسيم الشيفرة البرمجية إلى أجزاء معيارية (Modular) أصغر وأوضح.

بدأت شبكة الإنترنت تمتلئ بالمزيد والمزيد من المواد المفيدة المتعلقة بالخطافات. المصادر التالية تستحق الاطلاع والمتابعة:

- [Awesome React Hooks Resources](https://github.com/rehooks/awesome-react-hooks)
- [وصفات مفيدة وسهلة لخطافات ريأكت بقلم Gabe Ragland](https://usehooks.com/)

</div>

<div class="tasks">

### التمارين 7.1.-7.6.

دعنا نعود مرة أخرى للعمل مع تطبيق الطرائف (Anecdotes). استخدم التطبيق الموجود في المستودع https://github.com/fullstack-hy2020/routed-anecdotes كنقطة انطلاق للتمارين.

إذا قمت بنسخ (Clone) المشروع داخل مستودع git موجود مسبقاً، فتذكر حذف إعدادات git للتطبيق المنسوخ:

```bash
cd routed-anecdotes   // go first to directory of the cloned repository
rm -rf .git
```

يبدأ التطبيق بالطريقة المعتادة، ولكن أولاً، تحتاج إلى تثبيت التبعيات الخاصة به:

```bash
npm install
npm run dev
```

#### 7.1: خطاف useField

انسخ خطاف <i>useField</i> المخصص في الملف <i>src/hooks/index.js</i>. يجب أن يدير الخطاف حالة حقل إدخال نموذج واحد ويُرجع كائناً بالخصائص التالية: <i>type</i> و <i>value</i> و <i>onChange</i>.

إذا استخدمت [التصدير المُسمّى (Named Export)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#Description) بدلاً من التصدير الافتراضي (Default Export):

```js
import { useState } from 'react'

export const useField = (type) => { // highlight-line
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// modules can have several named exports
export const useAnotherHook = () => { // highlight-line
  // ...
}
```

فإن [الاستيراد (Importing)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) يتم بالطريقة التالية:

```js
import  { useField } from './hooks'

const App = () => {
  // ...
  const username = useField('text')
  // ...
}
```

استخدم الخطاف في نموذج إنشاء الطرفة.

#### 7.2: useField مع التصفير (Reset)

أضف زراً إلى النموذج يمسح كافة حقول الإدخال:

![browser anecdotes with reset button](../../images/7/e2.png)

قم بتوسيع خطاف <i>useField</i> بحيث يكشف عن دالة <i>reset</i> لمسح قيمة الحقل.

اعتماداً على الحل الذي تقدمه، قد ترى التحذير التالي في لوحة التحكم (Console):

![devtools console warning invalid value for reset prop](../../images/7/62ea.png)

سنعود إلى هذا التحذير في التمرين التالي.

#### 7.3: إصلاح مشكلة النشر (Fixing the spread issue)

إذا لم يتسبب حلك في ظهور تحذير في وحدة التحكم، فأنت بالفعل قد أنهيت هذا التمرين.

إذا رأيت التحذير <i>Invalid value for prop \`reset\` on \<input\> tag</i> في وحدة التحكم، فقم بإجراء التغييرات اللازمة للتخلص منه.

سبب هذا التحذير هو أنه بعد إجراء التغييرات على تطبيقك، فإن التعبير التالي:

```js
<input {...content}/>
```

هو في الأساس مطابق تماماً لهذا:

```js
<input
  value={content.value} 
  type={content.type}
  onChange={content.onChange}
  reset={content.reset} // highlight-line
/>
```

لا ينبغي إعطاء عنصر <i>input</i> سمة باسم <i>reset</i>.

أحد الحلول البسيطة هو عدم استخدام بناء جملة النشر وكتابة كافة النماذج على هذا النحو:

```js
<input
  value={username.value} 
  type={username.type}
  onChange={username.onChange}
/>
```

إذا فعلنا ذلك، فسنفقد الكثير من الفائدة التي يوفرها خطاف <i>useField</i>. بدلاً من ذلك، ابتكر حلاً يعالج المشكلة مع الحفاظ على سهولة الاستخدام مع بناء جملة النشر (Spread Syntax).

#### 7.4: useAnecdotes، الخطوة 1

يحتوي المشروع على خادم JSON مُعد مسبقاً. يمكنك تشغيله باستخدام:

```bash
npm run server
```

يبدأ هذا خادم JSON خلفياً يعرض مجموعة الطرائف كمورد REST على الرابط <i>http://localhost:3001/anecdotes</i>.

يحتوي ملف <i>services/anecdotes.js</i> الحالي على الدوال اللازمة للتواصل مع الخادم الخلفي (باستثناء التمرين الأخير). لاحظ أن الخدمة تستخدم [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) بدلاً من Axios لطلبات HTTP. إذا لم تكن معتاداً على Fetch، فألقِ نظرة على [الجزء السادس](/ar/part6/complex_state_fetch_testing#fetch-api) قبل المتابعة.

النمط النموذجي لجلب البيانات من الخادم في React يبدو كما يلي:

```js
import { useState, useEffect } from 'react'
import anecdoteService from './services/anecdotes'

const App = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  // ...
}
```

قم بتنفيذ خطاف مخصص <i>useAnecdotes</i> يغلّف هذا الاتصال بالخادم. بالنسبة لهذا التمرين، يكفي أن يقوم الخطاف بجلب كافة الطرائف. ويمكن التعامل مع إضافة طرائف جديدة في التمرين التالي.

يجب أن يُستخدم الخطاف بهذا الشكل:

```js
// ...
import { useAnecdotes } from './hooks' // highlight-line

const App = () => {
  const { anecdotes } = useAnecdotes() // highlight-line

  const addAnecdote = () => {} // a dummy function to keep code from breaking

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addAnecdote={addAnecdote} />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
```

**تلميح:** تم ذكر ما يلي سابقاً:

> طريقة مفيدة للتفكير في الأمر (أي كيفية عمل الخطاف): تخيل أنك قمت بنسخ ولصق كافة الشيفرات من داخل خطافك المخصص مباشرة في المكوّن.

لذا عليك الآن القيام بالعكس تقريباً: انسخ والصق الشيفرة ذات الصلة من المكوّن إلى الخطاف. يتضمن ذلك كلاً من الخطافين <i>useState</i> و <i>useEffect</i>.

#### 7.5: useAnecdotes، الخطوة 2

قم بتوسيع خطاف <i>useAnecdotes</i> بحيث يدعم أيضاً إنشاء طرائف جديدة. يجب أن يكشف الخطاف عن دالة <i>addAnecdote</i> ترسل الطرفة الجديدة إلى الخادم وتحدّث الحالة المحلية.

يجب أن يكون الخطاف قابلاً للاستخدام الآن على هذا النحو:

```js
const { anecdotes, addAnecdote } = useAnecdotes()
```

قم بتحديث المكوّن <i>App</i> لتمرير <i>addAnecdote</i> إلى المكوّن <i>CreateNew</i> بدلاً من الدالة الوهمية (Dummy function).

#### 7.6: useAnecdotes، الخطوة 3

قم بتوسيع خطاف <i>useAnecdotes</i> بدالة <i>deleteAnecdote</i> التي تحذف طرفة من الخادم وتحدّث الحالة المحلية. أضف زر حذف بجانب كل طرفة في القائمة.

أعد أيضاً هيكلة (Refactor) التطبيق بحيث لا يتم تمرير بيانات الطرائف ولا دوال الخطاف كخصائص (Props). بدلاً من ذلك، يجب على المكوّنات التي تحتاج إليها استدعاء <i>useAnecdotes</i> مباشرة. هذا يعني أن <i>App</i> لم يعد بحاجة للعمل كوسيط يمرر البيانات والدوال الاسترجاعية عبر شجرة المكوّنات.

بعد إعادة الهيكلة، يجب أن يبدو <i>App</i> على هذا النحو:

```js
const App = () => {
  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Routes>
          <Route path="/" element={<AnecdoteList />} />
          <Route path="/create" element={<CreateNew />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}
```

</div>
