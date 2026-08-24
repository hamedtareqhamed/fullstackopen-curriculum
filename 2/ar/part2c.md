---
mainImage: ../../../images/part-2.svg
part: 2
letter: c
lang: ar
---

<div class="content">

حتى الآن، كان كامل تركيزنا منصباً على الواجهة الأمامية (Frontend)، أي العمل داخل بيئة المتصفح لدى العميل. سنبدأ بالتعمق في بناء الواجهات الخلفية (Backend) وبرمجة الخوادم في [الجزء 3](/ar/part3) من هذه الدورة. ومع ذلك، سنتعرف الآن على كيفية تواصل كود جافاسكريبت المنفذ في المتصفح مع خادم الويب لجلب البيانات وتخزينها.

سنستخدم أداة مساعدة مخصصة لمرحلة التطوير تسمى **[JSON Server](https://github.com/typicode/json-server)** لتعمل كخادم خلفي تجريبي لتطبيقنا.

أنشئ ملفاً باسم `db.json` في المجلد الجذري للمشروع بالمحتوى التالي:

```json
{
  "notes": [
    {
      "id": "1",
      "content": "HTML is easy",
      "important": true
    },
    {
      "id": "2",
      "content": "Browser can execute only JavaScript",
      "important": false
    },
    {
      "id": "3",
      "content": "GET and POST are the most important methods of HTTP protocol",
      "important": true
    }
  ]
}
```

يمكنك تشغيل خادم JSON Server باستخدام أداة `npx` على المنفذ 3001 بتنفيذ الأمر:

```bash
npx json-server --port 3001 db.json
```

افتح العنوان <http://localhost:3001/notes> في المتصفح لرؤية الملاحظات معروضة بصيغة JSON:

![الملاحظات بصيغة JSON على الخادم المحلي](../../images/2/14new.png)

يقوم `json-server` بحفظ البيانات في ملف `db.json`. وفي التطبيقات الإنتاجية الحقيقية تُحفظ البيانات داخل قواعد بيانات فعلية، إلا أن هذه الأداة توفر بيئة مثالية لمحاكاة الخادم الخلفي بدون كتابة كود الخادم بعد.

---

### المتصفح كبيئة تشغيل غير متزامنة (The browser as a runtime environment)

تعمل محركات JavaScript في المتصفح وفق **النموذج غير المتزامن ([Asynchronous event-loop model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop))** وبخيط تنفيذ أحادي (**Single-threaded**).

هذا يعني أن محرك JavaScript لا يستطيع تنفيذ الأكواد بالتوازي على خيوط متعددة؛ وبالتالي، فإن كافة عمليات الإدخال والإخراج (I/O) وطلبات الشبكة تُنفذ بنمط **غير حاجب (Non-blocking)**. فعند إرسال طلب جلب بيانات، لا يتوقف المتصفح عن الاستجابة بانتظار الرد، بل يواصل تنفيذ بقية الأكواد فوراً، ويستدعي دالة رد النداء (Callback) أو معالج الوعد (Promise) فور وصول الاستجابة من الخادم.

---

### إدارة الحزم وتثبيت المكتبات عبر npm

تستخدم كافة مشاريع JavaScript الحديثة مدير الحزم **[npm](https://docs.npmjs.com/about-npm)**، ويتم تعريف تبعيات المشروع في ملف `package.json`.

سنستخدم مكتبة **[Axios](https://github.com/axios/axios)** للتواصل مع الخادم عبر HTTP. لنقم بتثبيتها بتنفيذ الأمر في المجلد الجذري للمشروع:

```bash
npm install axios
```

كما نثبت `json-server` كحزمة خاصة ببيئة التطوير (Development dependency):

```bash
npm install json-server --save-dev
```

ونضيف أمر تشغيل الخادم في قسم `scripts` داخل ملف `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "server": "json-server -p 3001 db.json"
  }
}
```

يمكنك الآن تشغيل خادم البيانات بسهولة عبر الأمر:

```bash
npm run server
```

> **ملاحظة**: لتشغيل خادم التطوير `npm run dev` وخادم البيانات `npm run server` في نفس الوقت، ستحتاج لفتح نافذتي طرفية (Terminal windows) مستقلتين.

---

### مكتبة Axios والوعود (Axios and Promises)

تُرجع دالة `axios.get()` كائناً من نوع **وعد ([Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise))**.

الوعد هو كائن يمثل القيمة النهائية لعملية غير متزامنة، وله ثلاث حالات:
1. **قيد الانتظار (Pending)**: العملية جارية ولم تنتهِ بعد.
2. **مكتمل / مُحقق (Fulfilled)**: تمت العملية بنجاح والقيمة جاهزة.
3. **مرفوض (Rejected)**: فشلت العملية وحدث خطأ ما (مثل تعذر الاتصال أو عنوان غير موجود).

![طباعة الوعود في الكونسول](../../images/2/16new.png)

للوصول إلى نتيجة الوعد عند اكتماله، نسجل دالة رد نداء عبر أسلوب **`then`**:

```js
import axios from 'axios'

axios
  .get('http://localhost:3001/notes')
  .then(response => {
    const notes = response.data
    console.log(notes)
  })
```

يقوم كائن `response` باحتواء البيانات `response.data`، ورمز الحالة `response.status`، وترويسات الاستجابة `response.headers`.

---

### خطاف الآثار الجانبية `useEffect` (Effect-hooks)

وفق توثيق React الرسمي:
> *تتيح الآثار الجانبية (Effects) للمكون الاتصال والمزامنة مع أنظمة خارجية؛ مثل شبكة الاتصال، الـ DOM، والمكتبات الخارجية.*

يُعد خطاف **[`useEffect`](https://react.dev/reference/react/useEffect)** الأداة القياسية لجلب البيانات من الخوادم في React:

```js
import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])

  console.log('render', notes.length, 'notes')

  // ...
}
```

يستقبل `useEffect` معاملين:
1. **دالة الأثر (Effect function)**: الكود الذي يقوم بإرسال طلب `axios.get` وتحديث الحالة عند استلام الرد.
2. **مصفوفة التبعيات (Dependency array)**: عند تمرير مصفوفة فارغة `[]`، يُنفذ الأثر **مرة واحدة فقط** عند أول تصيير للمكون على الشاشة (Initial render).

تسلسل التنفيذ في الكونسول:
```text
render 0 notes
effect
promise fulfilled
render 3 notes
```

---

### هيكلية بيئة التشغيل أثناء التطوير

![مخطط مكونات التطبيق أثناء التطوير](../../images/2/18e.png)

- **خادم Vite التطويري (المنفذ 5173)**: يخدم ملفات JavaScript و JSX ويحولها للمتصفح.
- **تطبيق React في المتصفح**: يُنفذ الأكواد ويرسل طلبات HTTP عبر Axios.
- **خادم JSON Server (المنفذ 3001)**: يستقبل طلبات الـ API ويقرأ ويكتب على ملف `db.json`.

</div>

<div class="tasks">

<h3>تمرين 2.11</h3>

<h4>2.11: دليل الهاتف - الخطوة 6 (The Phonebook Step 6)</h4>

1. احفظ الحالة الأولية لدليل الهاتف داخل ملف `db.json` في المجلد الجذري للمشروع:

```json
{
  "persons":[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
  ]
}
```

2. شغل `json-server` على المنفذ 3001 للتأكد من استرجاع البيانات عبر <http://localhost:3001/persons>.
3. عدل تطبيق دليل الهاتف ليقوم بجلب قائمة جهات الاتصال الأولية من الخادم عبر مكتبة `axios` وخطاف `useEffect`.

</div>

