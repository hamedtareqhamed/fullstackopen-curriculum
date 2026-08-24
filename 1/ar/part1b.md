---
mainImage: ../../../images/part-1.svg
part: 1
letter: b
lang: ar
---

<div class="content">

خلال هذه الدورة، لدينا هدف وحاجة ماسة لتعلم قدر كافٍ من لغة JavaScript بالإضافة إلى تعلم تطوير تطبيقات الويب.

تطورت JavaScript بسرعة هائلة في السنوات القليلة الماضية، ونحن في هذه الدورة نستخدم أحدث ميزات إصداراتها الجديدة. الاسم الرسمي لمعيار لغة JavaScript هو [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). في هذه اللحظة، أحدث إصدار هو الإصدار الصادر في يونيو 2025 باسم [ECMAScript®2025](https://www.ecma-international.org/ecma-262/)، والمعروف أيضاً باسم ES16.

لا تدعم المتصفحات حتى الآن جميع ميزات JavaScript الحديثة بشكل كامل وتلقائي. وبسبب هذه الحقيقة، فإن الكثير من الشيفرات البرمجية التي تعمل في المتصفحات تخضع لعملية *تحويل تجميعي (Transpilation)* من إصدار أحدث لـ JavaScript إلى إصدار أقدم وأكثر توافقية مع المتصفحات.

اليوم، الطريقة الأكثر شيوعاً لإجراء هذا التحويل هي استخدام أداة [Babel](https://babeljs.io/). يتم إعداد التحويل التجميعي (Transpilation) تلقائياً في تطبيقات React التي تم إنشاؤها باستخدام Vite. سنلقي نظرة فاحصة على إعدادات التحويل في [الجزء السابع (Part 7)](/ar/part7) من هذه الدورة.

تُعد [Node.js](https://nodejs.org/en/) بيئة تشغيل لجافاسكريبت مبنية على محرك جافاسكريبت [Chrome V8](https://developers.google.com/v8/) من Google، وتعمل عملياً في أي مكان - من الخوادم السحابية إلى الهواتف المحمولة. دعونا نتدرب على كتابة بعض أكواد JavaScript باستخدام Node. تفهم الإصدارات الحديثة من Node بالفعل أحدث ميزات JavaScript، لذا لا تحتاج الشيفرة البرمجية إلى تحويل تجميعي.

تُكتب الشيفرة في ملفات تنتهي بالامتداد <i>.js</i> ويتم تشغيلها عن طريق تنفيذ الأمر: <em>node name\_of\_file.js</em>

من الممكن أيضاً كتابة أكواد JavaScript داخل منصة تحكم Node.js التفاعلية، والتي يتم فتحها بكتابة _node_ في سطر الأوامر، وكذلك داخل منصة أدوات المطور (Developer Tools Console) في المتصفح. [تتعامل أحدث مراجعات متصفح Chrome مع الميزات الأحدث لـ JavaScript بشكل جيد للغاية](https://compat-table.github.io/compat-table/es2016plus/) دون الحاجة إلى تحويل الكود. بدلاً من ذلك، يمكنك استخدام أدوات سحابية مثل [JS Bin](https://jsbin.com/?js,console).

تُذكرنا JavaScript إلى حد ما بلغة Java من حيث الاسم والصياغة النحوية (Syntax). ولكن عندما يتعلق الأمر بالآليات الجوهرية للغة، فإنهما مختلفتان تماماً. بالنسبة لمن يأتي من خلفية برمجية في Java، قد يبدو سلوك JavaScript غريباً بعض الشيء، خاصة إذا لم يبذل المرء الجهد الكافي للبحث في ميزاتها وفهم طبيعتها.

في بعض الأوساط البرمجية، كان من الشائع أيضاً محاولة "محاكاة" ميزات وأنماط تصميم Java داخل JavaScript. نحن لا نوصي بالقيام بذلك، حيث إن اللغتين والبيئتين البرمجيتين الخاصتين بهما مختلفتان جذرياً في النهاية.

### المتغيرات (Variables)

في JavaScript، هناك بضع طرق لتعريف المتغيرات:

```js
const x = 1
let y = 5

console.log(x, y)   // تتم طباعة 1 5
y += 10
console.log(x, y)   // تتم طباعة 1 15
y = 'sometext'
console.log(x, y)   // تتم طباعة 1 sometext
x = 4               // يسبب خطأ برمجي
```

لا تُعرّف [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) متغيراً قابلاً لإعادة التعيين، بل تُعرّف *ثابتاً (Constant)* لا يمكن تغيير قيمته أو إعادة إسناده لاحقاً. من ناحية أخرى، تُعرّف [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) متغيراً عادياً يمكن تعديله.

في المثال أعلاه، نرى أيضاً أن نوع بيانات المتغير (Data Type) يمكن أن يتغير أثناء التشغيل. ففي البداية، يخزن المتغير _y_ عدداً صحيحاً (Integer)، وفي النهاية يخزن سلسلة نصية (String).

من الممكن أيضاً تعريف المتغيرات في JavaScript باستخدام الكلمة المفتاحية [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var). لفترة طويلة، كانت var هي الطريقة الوحيدة لتعريف المتغيرات. تم تقديم الكلمتين المفتاحيتين const و let في عام 2015 مع إطلاق ES6. في مواقف محددة، تعمل var بطريقة مختلفة مقارنة بتعريف المتغيرات في معظم لغات البرمجة الأخرى - راجع [JavaScript Variables - Should You Use let, var or const? على Medium](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) أو [Keyword: var vs. let على JS Tips](http://www.jstips.co/en/javascript/keyword-var-vs-let/) لمزيد من المعلومات. خلال هذه الدورة، لا يُنصح باستخدام var على الإطلاق ويجب عليك الالتزام باستخدام const و let دائماً!
يمكنك العثور على المزيد حول هذا الموضوع على YouTube - على سبيل المثال: [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8).

### المصفوفات (Arrays)

فيما يلي [مصفوفة (Array)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) وبضعة أمثلة على استخدامها:

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // تتم طباعة 4
console.log(t[1])     // تتم طباعة -1

t.forEach(value => {
  console.log(value)  // تتم طباعة الأرقام 1, -1, 3, 5 كل رقم في سطر منفصل
})                    
```

من الجدير بالملاحظة في هذا المثال أنه على الرغم من أن المتغير المُعلن عنه باستخدام const لا يمكن إعادة تعيينه لقيمة جديدة، إلا أنه لا يزال من الممكن تعديل محتويات الكائن أو المصفوفة التي يشير إليها. وذلك لأن الإعلان بـ const يضمن ثبات المرجع (Reference) نفسه وليس ثبات البيانات التي يشير إليها. فكر في الأمر مثل تغيير الأثاث داخل المنزل، بينما يظل عنوان المنزل ثابتاً كما هو.

إحدى طرق التكرار عبر عناصر المصفوفة هي استخدام الدالة _forEach_ كما رأينا في المثال. تستقبل _forEach_ *دالة* مُعرّفة باستخدام صيغة السهم (Arrow Syntax) كمعامل لها:

```js
value => {
  console.log(value)
}
```

تستدعي forEach هذه الدالة *لكل عنصر من عناصر المصفوفة*، ممررة العنصر الفردي كمعطى للدالة في كل مرة. ويمكن للدالة الممررة إلى forEach أن تستقبل أيضاً [معاملات أخرى](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) مثل الفهرس (Index).

في المثال السابق، تمت إضافة عنصر جديد إلى المصفوفة باستخدام الدالة [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push). عند استخدام React، غالباً ما يتم تطبيق أساليب من البرمجة الوظيفية (Functional Programming). وإحدى سمات نموذج البرمجة الوظيفية هي استخدام هياكل بيانات [غير قابلة للتعديل (Immutable)](https://en.wikipedia.org/wiki/Immutable_object). في كود React، يُفضل استخدام الدالة [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)، والتي تُنشئ مصفوفة جديدة تحتوي على العنصر المضاف مع بقاء المصفوفة الأصلية كما هي دون أي تغيير:

```js
const t = [1, -1, 3]

const t2 = t.concat(5)  // ينشئ مصفوفة جديدة

console.log(t)  // تتم طباعة [1, -1, 3]
console.log(t2) // تتم طباعة [1, -1, 3, 5]
```

استدعاء الدالة _t.concat(5)_ لا يضيف عنصراً جديداً إلى المصفوفة القديمة، بل يُرجع مصفوفة جديدة تحتوي على عناصر المصفوفة القديمة بالإضافة إلى العنصر الجديد.

هناك العديد من الدوال المفيدة المعرفة للمصفوفات. دعونا نلقي نظرة على مثال قصير لاستخدام دالة [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map):

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // تتم طباعة [2, 4, 6]
```

بناءً على المصفوفة القديمة، تُنشئ دالة map *مصفوفة جديدة*، حيث تُستخدم الدالة المعطاة كمعامل لإنشاء كل عنصر من عناصرها. في حالة هذا المثال، يتم ضرب القيمة الأصلية في اثنين.

يمكن لـ map أيضاً تحويل المصفوفة إلى شيء مختلف تماماً:

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// تتم طباعة [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ]
```

هنا، تم تحويل مصفوفة مليئة بقيم أعداد صحيحة إلى مصفوفة تحتوي على سلاسل نصية من وسوم HTML باستخدام دالة map. في [الجزء الثاني (Part 2)](/ar/part2) من هذه الدورة، سنرى أن map تُستخدم بشكل متكرر للغاية في React.

من السهل أيضاً إسناد العناصر الفردية للمصفوفة إلى متغيرات مستقلة بمساعدة [تفكيك المصفوفات (Destructuring Assignment)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment):

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // تتم طباعة 1 2
console.log(rest)          // تتم طباعة [3, 4, 5]
```

في الكود أعلاه، يتم إسناد العدد الصحيح الأول من المصفوفة إلى المتغير _first_ والعدد الصحيح الثاني إلى المتغير _second_. بينما يقوم المتغير _rest_ بـ "جمع" الأعداد الصحيحة المتبقية داخل مصفوفة خاصة به.

### الكائنات (Objects)

هناك بضع طرق مختلفة لتعريف الكائنات في JavaScript. إحدى الطرق الشائعة جداً هي استخدام [الكائنات الحرفية (Object Literals)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#object_literals)، والتي تتم عن طريق سرد خصائصها داخل أقواس معقوفة:

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

يمكن أن تكون قيم الخصائص من أي نوع، مثل الأعداد الصحيحة، والسلاسل النصية، والمصفوفات، والكائنات الأخرى...

يتم الوصول إلى خصائص الكائن والرجوع إليها باستخدام صيغة "النقطة" (Dot notation)، أو باستخدام الأقواس المربعة (Bracket notation):

```js
console.log(object1.name)         // تتم طباعة Arto Hellas
const fieldName = 'age'
console.log(object1[fieldName])    // تتم طباعة 35
```

يمكنك أيضاً إضافة خصائص جديدة إلى الكائن ديناميكياً إما باستخدام صيغة النقطة أو الأقواس المربعة:

```js
object1.address = 'Helsinki'
object1['secret number'] = 12341
```

الإضافة الأخيرة يجب أن تتم باستخدام الأقواس المربعة؛ لأنه عند استخدام صيغة النقطة، لا يُعد <i>secret number</i> اسم خاصية صالحاً بسبب وجود مسافة فيه.

بطبيعة الحال، يمكن أن تحتوي الكائنات في JavaScript على دوال وطرق (Methods) أيضاً. ومع ذلك، خلال هذه الدورة، لا نحتاج إلى تعريف أي كائنات تحتوي على توابع خاصة بها، ولهذا السبب تتم مناقشتها بإيجاز فقط خلال المنهج.

يمكن أيضاً تعريف الكائنات باستخدام ما يُعرف بدوال البناء (Constructor Functions)، مما ينتج عنه آلية تشبه العديد من لغات البرمجة الأخرى مثل فئات (Classes) لغة Java. وعلى الرغم من هذا التشابه، فإن JavaScript لا تمتلك فئات بنفس المعنى الموجود في لغات البرمجة كائنية التوجه (OOP). ومع ذلك، تمت إضافة *صيغة الفئات (Class Syntax)* بدءاً من إصدار ES6، والتي تساعد في بعض الحالات على هيكلة الأصناف كائنية التوجه.

### الدوال (Functions)

لقد تعرفنا بالفعل على كيفية تعريف الدوال السهمية (Arrow Functions). والعملية الكاملة لتعريف دالة سهمية، دون اختصارات، تكون على النحو التالي:

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

ويتم استدعاء الدالة بالشكل المتوقع:

```js
const result = sum(1, 5)
console.log(result)
```

إذا كان هناك معامل واحد فقط، فيمكننا استبعاد الأقواس الدائرية من التعريف:

```js
const square = p => {
  console.log(p)
  return p * p
}
```

إذا كانت الدالة تحتوي على تعبير برمجي واحد فقط، فلا حاجة للأقواس المعقوفة. في هذه الحالة، تُرجع الدالة نتيجة تعبيرها الوحيد تلقائياً. والآن، إذا قمنا بإزالة جملة الطباعة التشخيصية، فيمكننا اختصار تعريف الدالة بشكل أكبر:

```js
const square = p => p * p
```

هذه الصيغة مفيدة بشكل خاص عند معالجة المصفوفات - على سبيل المثال عند استخدام دالة map:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// تصبح tSquared الآن [1, 4, 9]
```

تمت إضافة ميزة الدوال السهمية إلى JavaScript في عام 2015 مع إصدار [ES6](https://rse.github.io/es6-features/). قبل ذلك، كانت الطريقة الوحيدة لتعريف الدوال هي استخدام الكلمة المفتاحية _function_.

هناك طريقتان للتعامل مع الدوال التقليدية؛ إحداهما هي إعطاء اسم في [إعلان الدالة (Function Declaration)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function):

```js
function product(a, b) {
  return a * b
}

const result = product(2, 6)
// النتيجة الآن 12
```

والطريقة الأخرى لتعريف الدالة هي باستخدام [تعبير الدالة (Function Expression)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function). في هذه الحالة، لا توجد حاجة لتسمية الدالة، ويمكن أن يتواجد التعريف مباشرة ضمن بقية الكود:

```js
const average = function(a, b) {
  return (a + b) / 2
}

const result = average(2, 5)
// النتيجة الآن 3.5
```

خلال هذه الدورة، سنقوم بتعريف جميع الدوال باستخدام صيغة السهم (Arrow Syntax).

</div>

<div class="tasks">

  <h3>التمارين 1.3.-1.5.</h3>

<i>نواصل بناء التطبيق الذي بدأنا العمل عليه في التمارين السابقة. يمكنك كتابة الكود في نفس المشروع لأننا مهتمون فقط بالحالة النهائية للتطبيق المُسلَّم.</i>

**نصيحة احترافية:** قد تواجه مشكلات عندما يتعلق الأمر بهيكل <i>الخصائص (props)</i> التي تستقبلها المكونات. ومن الطرق الجيدة لتوضيح الأمور طباعة props في منصة التحكم (console)، على سبيل المثال كالتالي:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

إذا و<i>عندما</i> تصادف رسالة الخطأ التالية:

> <i>Objects are not valid as a React child</i>

تذكر دائماً النقاط والتوجيهات المذكورة [هنا](/ar/part1/introduction_to_react#do-not-render-objects).

  <h4>1.3: معلومات الدورة، الخطوة 3 (Course Information step 3)</h4>

دعونا ننتقل إلى استخدام الكائنات (Objects) في تطبيقنا. قم بتعديل تعريفات المتغيرات في المكوّن <i>App</i> على النحو التالي وأعد هيكلة التطبيق بحيث يظل يعمل بشكل صحيح:

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

  <h4>1.4: معلومات الدورة، الخطوة 4 (Course Information step 4)</h4>

ضع الكائنات داخل مصفوفة (Array). قم بتعديل تعريفات المتغيرات في المكوّن <i>App</i> لتأخذ الشكل التالي، وعدّل الأجزاء الأخرى من التطبيق وفقاً لذلك:

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
      ...
    </div>
  )
}
```

**ملاحظة**: في هذه المرحلة، <i>يمكنك افتراض وجود ثلاثة عناصر دائماً</i>، لذلك لا داعي للمرور عبر المصفوفات باستخدام حلقات التكرار (Loops). وسنعود إلى موضوع تصيير المكونات بناءً على عناصر المصفوفات بشكل أكثر تفصيلاً في [الجزء التالي من الدورة](../part2).

ومع ذلك، لا تقم بتمرير كائنات مختلفة كخصائص منفصلة من المكوّن <i>App</i> إلى المكونين <i>Content</i> و <i>Total</i>. بل قم بتمريرها مباشرة كمصفوفة واحدة:

```js
const App = () => {
  // const definitions

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

  <h4>1.5: معلومات الدورة، الخطوة 5 (Course Information step 5)</h4>

دعونا نأخذ التغييرات خطوة أخرى إلى الأمام. حوّل الدورة وأجزاءها إلى كائن JavaScript واحد متكامل. وقم بإصلاح كل ما قد يتعطل نتيجة لذلك:

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
      ...
    </div>
  )
}
```

</div>

<div class="content">

### توابع الكائنات والكلمة المفتاحية "this" (Object methods and "this")

نظراً لأن هذه الدورة تستخدم إصداراً من React يحتوي على خطافات ريأكت (React Hooks)، فلن نحتاج إلى تعريف كائنات تحتوي على توابع ودوال خاصة بها. **إن محتويات هذا الفصل ليست ذات صلة مباشرة بمتطلبات الدورة**، ولكنها بالتأكيد مفيدة وجيدة للمعرفة بعدة طرق. وبشكل خاص، عند التعامل مع إصدارات أقدم من React، يجب على المرء فهم موضوعات هذا الفصل.

تختلف الدوال السهمية والدوال المعرفة باستخدام الكلمة المفتاحية _function_ اختلافاً جوهرياً عندما يتعلق الأمر بكيفية تصرفها فيما يتعلق بالكلمة المفتاحية [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)، والتي تشير إلى الكائن نفسه.

يمكننا تعيين توابع (Methods) لكائن ما عن طريق تعريف خصائص تكون عبارة عن دوال:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  // highlight-start
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-end
}

arto.greet()  // تتم طباعة "hello, my name is Arto Hellas"
```

يمكن تعيين التوابع للكائنات حتى بعد إنشاء الكائن:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

// highlight-start
arto.growOlder = function() {
  this.age += 1
}
// highlight-end

console.log(arto.age)   // تتم طباعة 35
arto.growOlder()
console.log(arto.age)   // تتم طباعة 36
```

دعونا نعدل الكائن قليلاً:

```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-start
  doAddition: function(a, b) {
    console.log(a + b)
  },
  // highlight-end
}

arto.doAddition(1, 4)        // تتم طباعة 5

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // تتم طباعة 25
```

الآن يحتوي الكائن على التابع _doAddition_ الذي يحسب مجموع الأرقام المعطاة له كمعاملات. يتم استدعاء التابع بالطريقة المعتادة باستخدام الكائن: <em>arto.doAddition(1, 4)</em> أو عن طريق تخزين *مرجع التابع (Method Reference)* في متغير واستدعاء التابع من خلال ذلك المتغير: <em>referenceToAddition(10, 15)</em>.

إذا حاولنا فعل الشيء نفسه مع التابع _greet_ فسنواجه مشكلة:

```js
arto.greet()       // تتم طباعة "hello, my name is Arto Hellas"

const referenceToGreet = arto.greet
referenceToGreet() // تطبع "hello, my name is undefined"
```

عند استدعاء التابع من خلال مرجع، يفقد التابع معرفته بما كان عليه _this_ الأصلي. على عكس اللغات الأخرى، في JavaScript يتم تحديد قيمة [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) بناءً على *كيفية ومكان استدعاء التابع*. عند استدعاء التابع من خلال مرجع، تصبح قيمة _this_ هي ما يُعرف بـ [الكائن العام (Global Object)](https://developer.mozilla.org/en-US/docs/Glossary/Global_object)، وتكون النتيجة النهائية غالباً غير ما كان يقصده مطور البرمجيات في الأصل.

يؤدي فقدان تتبع _this_ عند كتابة كود JavaScript إلى ظهور بعض المشكلات المحتملة. فغالباً ما تنشأ مواقف تحتاج فيها React أو Node (أو بشكل أكثر تحديداً محرك JavaScript لمتصفح الويب) إلى استدعاء تابع في كائن قام المطور بتعريفه. ومع ذلك، في هذه الدورة، نتجنب هذه المشكلات باستخدام أسلوب JavaScript "خالٍ من this" (this-less JavaScript).

أحد المواقف التي تؤدي إلى "اختفاء" _this_ ينشأ عندما نقوم بتعيين مؤقت لاستدعاء الدالة _greet_ على كائن _arto_ باستخدام دالة [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout):

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

setTimeout(arto.greet, 1000)  // highlight-line
```

كما ذكرنا، يتم تحديد قيمة _this_ في JavaScript بناءً على كيفية استدعاء التابع. وعندما تستدعي <em>setTimeout</em> التابع، فإن محرك JavaScript هو الذي يستدعي التابع فعلياً، وفي تلك اللحظة يشير _this_ إلى الكائن العام.

هناك عدة آليات يمكن من خلالها الحفاظ على _this_ الأصلي. إحدى هذه الآليات هي استخدام دالة تسمى [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind):

```js
setTimeout(arto.greet.bind(arto), 1000)
```

يؤدي استدعاء <em>arto.greet.bind(arto)</em> إلى إنشاء دالة جديدة يتم فيها ربط _this_ ليشير دائماً إلى Arto، بصرف النظر عن مكان وكيفية استدعاء الدالة.

باستخدام [الدوال السهمية (Arrow Functions)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)، يمكن حل بعض المشكلات المتعلقة بـ _this_. ومع ذلك، لا ينبغي استخدامها كتوابع للكائنات لأن _this_ لن يعمل معها على الإطلاق في سياق الكائن. سنعود لاحقاً إلى سلوك _this_ فيما يتعلق بالدوال السهمية.

إذا كنت ترغب في اكتساب فهم أعمق لكيفية عمل _this_ في JavaScript، فإن الإنترنت مليء بالمواد حول هذا الموضوع، وعلى سبيل المثال نوصي بشدة بسلسلة الفيديوهات التعليمية [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) المقدمة من [egghead.io](https://egghead.io)!

### الفئات (Classes)

كما ذكرنا سابقاً، لا توجد آلية فئات في JavaScript مثل تلك الموجودة في لغات البرمجة كائنية التوجه التقليدية. ومع ذلك، توجد ميزات تجعل "محاكاة" [الفئات (Classes)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) كائنية التوجه أمراً ممكناً.

دعونا نلقي نظرة سريعة على *صيغة الفئات (Class Syntax)* التي تم إدخالها إلى JavaScript مع إصدار ES6، والتي تبسط بشكل كبير تعريف الفئات (أو الأشياء الشبيهة بالفئات) في JavaScript.

في المثال التالي، نُعرّف "فئة" تُدعى Person وكائنين من نوع Person:

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

const janja = new Person('Janja Garnbret', 27)
janja.greet()
```

عندما يتعلق الأمر بالصياغة النحوية، فإن فئات JavaScript والمثيلات (Instances) المُنشأة منها تُذكرنا كثيراً بكيفية عمل الفئات والكائنات في Java. كما أن سلوكها مشابه تماماً لكائنات Java. ومع ذلك، في جوهرها، تظل كائنات JavaScript عادية مبنية على [الوراثة النموذجية (Prototypal Inheritance)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance). ويظل نوع أي مثيل لمثل هذه الفئة هو _Object_، لأن JavaScript تُعرّف بشكل أساسي مجموعة محدودة فقط من الأنواع: [Boolean و Null و Undefined و Number و String و Symbol و BigInt و Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).

كان إدخال صيغة الفئات إضافة مثيرة للجدل والنقاش. اطلع على [Not Awesome: ES6 Classes](https://github.com/petsel/not-awesome-es6-classes) أو [Is “Class” In ES6 The New “Bad” Part? على Medium](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65) لمزيد من التفاصيل.

تُستخدم صيغة فئات ES6 بكثرة في إصدارات React "القديمة" وكذلك في Node.js، وبالتالي فإن فهمها مفيد حتى في هذه الدورة. ومع ذلك، نظراً لأننا نستخدم ميزة [الخطافات (Hooks)](https://react.dev/reference/react/hooks) الجديدة في React طوال هذه الدورة، فليس لدينا استخدام ملموس لصيغة الفئات في JavaScript.

### مصادر ومراجع لتعلم JavaScript

توجد أدلة ومراجع جيدة وأخرى متواضعة لـ JavaScript على شبكة الإنترنت. معظم الروابط الموجودة في هذه الصفحة والمتعلقة بميزات JavaScript تشير إلى [دليل JavaScript من موزيلا (Mozilla's JavaScript Guide)](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

يوصى بشدة بقراءة [نظرة عامة على لغة JavaScript (JavaScript language overview)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_overview) على موقع موزيلا على الفور.

إذا كنت ترغب في التعرف على JavaScript بعمق، فهناك سلسلة كتب مجانية رائعة على الإنترنت تسمى [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).

مصدر رائع آخر لتعلم JavaScript هو [javascript.info](https://javascript.info).
  
الكتاب المجاني والممتع للغاية [Eloquent JavaScript](https://eloquentjavascript.net) ينقلك من الأساسيات إلى الموضوعات المتقدمة والمثيرة للاهتمام بسرعة. وهو مزيج من المشاريع النظرية والتمارين ويغطي نظرية البرمجة العامة بالإضافة إلى لغة JavaScript.

[Namaste 🙏 JavaScript](https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP) هو دليل تعليمي مجاني ممتاز وموصى به بشدة لفهم كيفية عمل JavaScript تحت الغطاء. Namaste JavaScript هي دورة متعمقة في JavaScript تم نشرها مجاناً على YouTube. وهي تغطي المفاهيم الأساسية لـ JavaScript بالتفصيل وكل شيء حول كيفية عمل JS خلف الكواليس داخل محرك JavaScript.

يحتوي موقع [egghead.io](https://egghead.io) على الكثير من مقاطع الفيديو التعليمية عالية الجودة حول JavaScript و React وغيرها من الموضوعات الشيقة. لسوء الحظ، بعض مواده التعليمية تتطلب اشتراكاً مدفوعاً.

</div>
