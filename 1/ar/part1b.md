---
mainImage: ../../../images/part-1.svg
part: 1
letter: b
lang: ar
---

<div class="content">

خلال هذه الدورة، لدينا هدف وحاجة أساسية لتعلم قدر وافٍ ومتين من لغة جافاسكريبت (JavaScript) إلى جانب تطوير تطبيقات الويب.

تطورت لغة JavaScript بسرعة فائقة في السنوات الأخيرة، ونحن نعتمد في هذه الدورة على أحدث الميزات في المعايير القياسية. الاسم الرسمي لمعيار لغة جافاسكريبت هو **[ECMAScript](https://en.wikipedia.org/wiki/ECMAScript)**.

لا تدعم كافة المتصفحات بصورة كاملة أحدث ميزات اللغة فور صدورها؛ ولهذا السبب يتم **التحويل البرمجي العكسي ([Transpiled](https://en.wikipedia.org/wiki/Source-to-source_compiler))** للكود المكتوب من الإصدارات الأحدث إلى إصدارات سابقة متوافقة مع المتصفحات القديمة بواسطة أدوات مثل **[Babel](https://babeljs.io/)**. وتتولى أداة *Vite* إعداد وتفعيل هذا التحويل تلقائياً.

تعتبر بيئة **[Node.js](https://nodejs.org/en/)** بيئة تشغيل لجافاسكريبت تعتمد على محرك [Google V8](https://developers.google.com/v8/) الشهير، وتعمل في كل مكان من الخوادم إلى الهواتف الذكية. تفهم الإصدارات الحديثة من Node أحدث مواصفات JavaScript مباشرة دون حاجة لتحويل مسبق.

تُكتب الشيفرات في ملفات بامتداد `.js` ويتم تشغيلها بالأمر `node filename.js`.

تتشابه JavaScript ظاهرياً في الاسم وبعض التراكيب مع لغة Java، إلا أن الآليات الجوهرية للغتين مختلفتان تماماً.

---

### المتغيرات والثوابت (Variables)

في JavaScript توجد طرق متعددة لتعريف المتغيرات:

```js
const x = 1
let y = 5

console.log(x, y)   // يطبع: 1 5
y += 10
console.log(x, y)   // يطبع: 1 15
y = 'sometext'
console.log(x, y)   // يطبع: 1 sometext
x = 4               // خطأ: لا يمكن تعديل قيمة الثابت
```

- **[`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)**: تُعرّف *ثابتاً* لا يمكن إعادة تعيين قيمته بعد الإسناد الأولي.
- **[`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)**: تُعرّف متغيراً عادياً يمكن تعديل قيمته ونوعه أثناء التنفيذ.
- كانت الكلمة القديمة **`var`** هي الطريقة الوحيدة لتعريف المتغيرات قبل معيار ES6 (عام 2015). تعمل `var` بنطاق وظيفي يسبب أخطاء غير مقصودة، ولذلك **يُحظر تماماً استخدام `var` في هذه الدورة** ويجب الالتزام بـ `const` و `let`.

---

### المصفوفات (Arrays)

تعتبر [المصفوفات](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) من أهم الهياكل في اللغة:

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // يطبع: 4
console.log(t[1])     // يطبع: -1

t.forEach(value => {
  console.log(value)  // يطبع كل رقم في سطر مستقل
})
```

> **ملاحظة جوهرية**: على الرغم من تعريف المصفوفة `t` باستخدام `const`، إلا أنه يمكن تعديل محتويات الكائن الداخلي للمصفوفة. فالثابت `const` يضمن ثبات المرجع (Reference) وليس ثبات البيانات التي يشير إليها.

تستقبل دالة `forEach` دالة سهمية وتستدعيها لكل عنصر في المصفوفة ممررة العنصر كمعامل.

في React والبرمجة الوظيفية، نعتمد على **البيانات غير القابلة للتغيير المباشر ([Immutable objects](https://en.wikipedia.org/wiki/Immutable_object))**. لذلك نفضل استخدام دالة **[`concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)** التي تُنشئ مصفوفة جديدة تحتوي على العنصر الإضافي وتترك المصفوفة الأصلية سالمة:

```js
const t = [1, -1, 3]

const t2 = t.concat(5)  // إنشاء مصفوفة جديدة

console.log(t)  // [1, -1, 3] (المصفوفة الأصلية لم تتغير)
console.log(t2) // [1, -1, 3, 5]
```

#### دالة التحويل `map`

تُنشئ دالة **[`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)** مصفوفة جديدة كلياً بناءً على تطبيق دالة معينة على كل عنصر في المصفوفة الأصلية:

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // يطبع: [2, 4, 6]

// تحويل الأرقام إلى وسوم HTML
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// يطبع: [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ]
```

سنرى في [الجزء 2](/ar/part2) أن دالة `map` تُستخدم بكثرة فائقة في React لتصيير القوائم والمجموعات.

#### التفكيك (Destructuring assignment)

يمكن استخراج عناصر المصفوفة بسهولة باستخدام صيغة التفكيك:

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // يطبع: 1 2
console.log(rest)          // يطبع: [3, 4, 5]
```

---

### الكائنات (Objects)

تُعرّف الكائنات باستخدام [الكائنات الحرفية (Object literals)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#object_literals) بحصر الخصائص وقيمها بين أقواس معقوفة `{ }`:

```js
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
}

const object2 = {
  name: 'Full Stack web application development',
  level: 'intermediate studies',
  size: 5,
}

const object3 = {
  name: {
    first: 'Dan',
    last: 'Abramov',
  },
  grades: [2, 3, 5, 3],
  department: 'Stanford University',
}
```

يتم الوصول للخصائص عبر النقطة (Dot notation) أو الأقواس المعقوفة (Brackets):

```js
console.log(object1.name)         // يطبع: Arto Hellas
const fieldName = 'age'
console.log(object1[fieldName])    // يطبع: 35
```

ويمكن إضافة خصائص جديدة ديناميكياً:

```js
object1.address = 'Helsinki'
object1['secret number'] = 12341
```

---

### الدوال (Functions)

الصيغة الكاملة لتعريف **الدوال السهمية (Arrow Functions)**:

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}

const result = sum(1, 5)
console.log(result) // 6
```

إذا كانت الدالة تستقبل معاملاً واحداً فقط، يمكن حذف الأقواس المحيطة به:

```js
const square = p => {
  console.log(p)
  return p * p
}
```

وإذا كانت الدالة تحتوي على تعبير إرجاع وحيد، يمكن الاستغناء عن الأقواس المعقوفة وكلمة `return`:

```js
const square = p => p * p
```

هذه الصيغة المختصرة مفيدة جداً عند التعامل مع دوال المصفوفات مثل `map`:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p) // [1, 4, 9]
```

---

### أساليب الكائنات والكلمة المحجوزة "this"

في JavaScript، تختلف الدوال السهمية عن الدوال العادية المعرفة بكلمة `function` في كيفية تعاملها مع الكلمة المحجوزة **[`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)** التي تشير إلى الكائن نفسه:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

arto.greet()  // يطبع: hello, my name is Arto Hellas
```

عند تخزين مرجع الدالة في متغير واستدعائها من خلاله:

```js
const referenceToGreet = arto.greet
referenceToGreet() // يطبع: hello, my name is undefined
```

يفقد الكائن سياق `this` الأصلي لأن قيمة `this` في JavaScript تتحدد وفق **كيفية وطريقة استدعاء الدالة**.

عند تمرير الدالة لمؤقت مثل `setTimeout(arto.greet, 1000)`، تستدعي بيئة التشغيل الدالة بحيث تشير `this` إلى الكائن العام (Global object). ولتثبيت المرجع نستخدم دالة **[`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)**:

```js
setTimeout(arto.greet.bind(arto), 1000)
```

في هذه الدورة، نتجنب كافة هذه المشاكل لأننا نكتب جافاسكريبت معتمدة على **خطافات React (Hooks)** والمكونات الوظيفية دون استخدام `this`.

---

### الفئات (Classes)

أضاف معيار ES6 صيغة الفئات (`class`) لتسهيل نمط البرمجة كائنية التوجه (OOP):

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  greet() {
    console.log('hello, my name is ' + this.name)
  }
}

const adam = new Person('Adam Ondra', 33)
adam.greet()
```

وعلى الرغم من تشابهها مع لغات مثل Java، إلا أنها مبنية في جوهرها على **الوراثة بالنماذج الأولية ([Prototypal inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance))**.

---

### مراجع ومصادر لتعلم JavaScript

- [دليل لغة جافاسكريبت من موزيلا (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_overview).
- سلسلة الكتب المجانية المتقدمة [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).
- الموقع التعليمي الشهير [javascript.info](https://javascript.info).
- كتاب [Eloquent JavaScript](https://eloquentjavascript.net).

</div>

<div class="tasks">

<h3>التمارين 1.3 - 1.5</h3>

<i>سنواصل في هذه التمارين تطوير نفس تطبيق معلومات الدورة الذي بدأناه في التمارين السابقة.</i>

> **نصيحة احترافية**: عندما تواجه مشكلة في هيكلية الـ `props` الممررة للمكون، اطبعها دائماً في الكونسول: `console.log(props)`. وإذا ظهر لك الخطأ *Objects are not valid as a React child* فتذكر ألا تصيّر الكائنات مباشرة.

<h4>1.3: معلومات الدورة - الخطوة 3 (Course Information step 3)</h4>

عدل تعريف المتغيرات في المكون `App` لاستخدام الكائنات، وأعد هيكلة التطبيق ليعمل بنجاح:

```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

<h4>1.4: معلومات الدورة - الخطوة 4 (Course Information step 4)</h4>

ضع كائنات الأجزاء داخل مصفوفة `parts`. مرر المصفوفة مباشرة كخاصية واحدة إلى المكونين `Content` و `Total`:

```js
const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

*(في هذه المرحلة يمكنك افتراض وجود ثلاثة عناصر دائماً في المصفوفة دون استخدام حلقات تكرار)*.

<h4>1.5: معلومات الدورة - الخطوة 5 (Course Information step 5)</h4>

ادمج اسم الدورة ومصفوفة أجزائها في كائن جافاسكريبت واحد باسم `course`، وعدل كافة المكونات المرتبطة لتتوافق مع هذا الهيكل الجديد:

```js
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}
```

</div>
