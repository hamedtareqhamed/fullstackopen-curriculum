---
mainImage: ../../../images/part-4.svg
part: 4
letter: b
lang: ar
---

<div class="content">

سنبدأ الآن في كتابة الاختبارات للواجهة الخلفية. نظراً لأن الواجهة الخلفية لا تحتوي على أي منطق معقد، فليس من المنطقي كتابة [اختبارات وحدات (Unit tests)](https://en.wikipedia.org/wiki/Unit_testing) لها. الشيء الوحيد المحتمل الذي يمكننا اختباره كوحدة هو التابع _toJSON_ المستخدم لتنسيق الملاحظات.

في بعض المواقف، قد يكون من المفيد تنفيذ بعض اختبارات الواجهة الخلفية عن طريق محاكاة قاعدة البيانات (Mocking) بدلاً من استخدام قاعدة بيانات حقيقية. إحدى المكتبات التي يمكن استخدامها لهذا الغرض هي [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server).

نظراً لأن الواجهة الخلفية لتطبيقنا لا تزال بسيطة نسبياً، فسوف نقرر اختبار التطبيق بأكمله من خلال واجهة REST API الخاصة به، بحيث يتم تضمين قاعدة البيانات أيضاً. يسمى هذا النوع من الاختبارات، حيث يتم اختبار مكونات متعددة للنظام كمجموعة واحدة، بـ [اختبارات التكامل (Integration testing)](https://en.wikipedia.org/wiki/Integration_testing).

### بيئة الاختبار (Test environment)

في أحد الفصول السابقة من مادة الدورة، ذكرنا أنه عندما يعمل خادم الواجهة الخلفية في Fly.io أو Render، فإنه يكون في وضع *الإنتاج (Production mode)*.

الاصطلاح المتبع في Node هو تحديد وضع تنفيذ التطبيق باستخدام متغير البيئة <i>NODE\_ENV</i>. في تطبيقنا الحالي، نقوم فقط بتحميل متغيرات البيئة المحددة في ملف <i>.env</i> إذا كان التطبيق *ليس* في وضع الإنتاج.

من الممارسات الشائعة تحديد أوضاع منفصلة للتطوير والاختبار.

بعد ذلك، دعونا نغير السكربتات في ملف <i>package.json</i> لتطبيق الملاحظات، بحيث يحصل <i>NODE\_ENV</i> على القيمة <i>test</i> عند تشغيل الاختبارات:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js", // highlight-line
    "dev": "NODE_ENV=development node --watch index.js", // highlight-line
    "test": "NODE_ENV=test node --test", // highlight-line
    "lint": "eslint ."
  }
  // ...
}
```

حددنا وضع التطبيق ليكون <i>development</i> في سكربت _npm run dev_. وحددنا أيضاً أن أمر _npm start_ الافتراضي سيحدد الوضع على أنه <i>production</i>.

هناك مشكلة طفيفة في الطريقة التي حددنا بها وضع التطبيق في سكربتاتنا: لن تعمل على نظام Windows. يمكننا تصحيح ذلك عن طريق تثبيت حزمة [cross-env](https://www.npmjs.com/package/cross-env) كتبعية للمشروع باستخدام الأمر:

```bash
npm install cross-env
```

يمكننا بعد ذلك تحقيق التوافق عبر الأنظمة الأساسية المختلفة باستخدام مكتبة cross-env في سكربتات npm المحددة في <i>package.json</i>:

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js", // highlight-line
    "dev": "cross-env NODE_ENV=development node --watch index.js", // highlight-line
    "test": "cross-env  NODE_ENV=test node --test", // highlight-line
    "lint": "eslint ."
  },
  // ...
}
```

الآن يمكننا تعديل طريقة تشغيل تطبيقنا في أوضاع مختلفة. وكمثال على ذلك، يمكننا تحديد التطبيق لاستخدام قاعدة بيانات اختبار منفصلة عند تشغيل الاختبارات.

يمكننا إنشاء قاعدة بيانات الاختبار المنفصلة في MongoDB Atlas. هذا ليس حلاً مثالياً في المواقف التي يطور فيها العديد من الأشخاص نفس التطبيق. يتطلب تنفيذ الاختبار على وجه الخصوص عادةً نسخة قاعدة بيانات واحدة لا تستخدمها الاختبارات التي تعمل بشكل متزامن.

سيكون من الأفضل تشغيل اختباراتنا باستخدام قاعدة بيانات مثبتة وتعمل على الجهاز المحلي للمطور. الحل الأمثل هو جعل كل تنفيذ اختبار يستخدم قاعدة بيانات منفصلة. هذا "بسيط نسبياً" لتحقيقه عن طريق [تشغيل Mongo في الذاكرة (in-memory)](https://docs.mongodb.com/manual/core/inmemory/) أو باستخدام حاويات [Docker](https://www.docker.com). لن نعقد الأمور وسنواصل بدلاً من ذلك استخدام قاعدة بيانات MongoDB Atlas.

دعنا نجري بعض التغييرات على الوحدة النمطية التي تحدد تكوين التطبيق في _utils/config.js_:

```js
require('dotenv').config()

const PORT = process.env.PORT

// highlight-start
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
// highlight-end

module.exports = {
  MONGODB_URI,
  PORT
}
```

يحتوي ملف <i>.env</i> على *متغيرات منفصلة* لعناوين قواعد البيانات لكل من قاعدة بيانات التطوير وقاعدة بيانات الاختبار:

```bash
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0
PORT=3001

// highlight-start
TEST_MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0
// highlight-end
```

تشبه وحدة _config_ التي قمنا بتنفيذها قليلاً حزمة [node-config](https://github.com/lorenwest/node-config). إن كتابة تنفيذنا الخاص مبررة لأن تطبيقنا بسيط، وأيضاً لأنها تعلمنا دروساً قيمة.

هذه هي التغييرات الوحيدة التي نحتاج إلى إجرائها على كود تطبيقنا.

يمكنك العثور على شيفرة تطبيقنا الحالي بالكامل في الفرع <i>part4-2</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-2).

### مكتبة supertest

دعونا نستخدم حزمة [supertest](https://github.com/visionmedia/supertest) لمساعدتنا في كتابة اختباراتنا لاختبار واجهة برمجة التطبيقات (API).

سنقوم بتثبيت الحزمة كتبعية تطوير:

```bash
npm install --save-dev supertest
```

دعنا نكتب اختبارنا الأول في ملف <i>tests/note_api.test.js</i>:

```js
const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})
```

يستورد الاختبار تطبيق Express من وحدة <i>app.js</i> النمطية ويلفه بدالة <i>supertest</i> في كائن يسمى [superagent](https://github.com/visionmedia/superagent). يتم إسناد هذا الكائن إلى متغير <i>api</i> ويمكن للاختبارات استخدامه لإجراء طلبات HTTP إلى الواجهة الخلفية.

يقوم اختبارنا بإجراء طلب HTTP GET إلى عنوان url المسار <i>api/notes</i> ويتحقق من الرد على الطلب برمز الحالة 200. يتحقق الاختبار أيضاً من تعيين ترويسة <i>Content-Type</i> إلى <i>application/json</i>، مما يشير إلى أن البيانات بالتنسيق المطلوب.

يستخدم التحقق من قيمة الترويسة صيغة بناء تبدو غريبة بعض الشيء:

```js
.expect('Content-Type', /application\/json/)
```

يتم الآن تعريف القيمة المطلوبة كـ [تعبير نمطي (Regular expression)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) أو regex باختصار. يبدأ التعبير النمطي وينتهي بشرطة مائلة /، ولأن النص المطلوب <i>application/json</i> يحتوي أيضاً على نفس الشرطة المائلة، فإنه يسبقه \ حتى لا يتم تفسيره كحرف إنهاء للتعبير النمطي.

من حيث المبدأ، كان من الممكن أيضاً تعريف الاختبار كنص:

```js
.expect('Content-Type', 'application/json')
```

ومع ذلك، تكمن المشكلة هنا في أنه عند استخدام نص، يجب أن تكون قيمة الترويسة متطابقة تماماً. بالنسبة للتعبير النمطي الذي حددناه، فمن المقبول أن *تحتوي* الترويسة على النص المعني. القيمة الفعلية للترويسة هي <i>application/json; charset=utf-8</i>، أي أنها تحتوي أيضاً على معلومات حول ترميز الأحرف. ومع ذلك، فإن اختبارنا غير مهتم بهذا، وبالتالي من الأفضل تحديد الاختبار كتعبير نمطي بدلاً من نص دقيق.

يحتوي الاختبار على بعض التفاصيل التي سنستكشفها [لاحقاً](/ar/part4/testing_the_backend#async-await). تُسبق الدالة السهمية التي تحدد الاختبار بالكلمة الأساسية <i>async</i> ويُسبق استدعاء التابع لكائن <i>api</i> بالكلمة الأساسية <i>await</i>. سنكتب بعض الاختبارات ثم نلقي نظرة فاحصة على سحر async/await هذا. لا تقلق بشأنهم في الوقت الحالي، فقط تأكد من أن أمثلة الاختبارات تعمل بشكل صحيح. ترتبط صيغة async/await بحقيقة أن تقديم طلب إلى واجهة برمجة التطبيقات هو عملية *غير متزامنة (Asynchronous)*. يمكن استخدام صيغة async/await لكتابة كود غير متزامن بمظهر الكود المتزامن.

بمجرد انتهاء تشغيل جميع الاختبارات (يوجد اختبار واحد فقط حالياً)، يتعين علينا إغلاق اتصال قاعدة البيانات المستخدم بواسطة Mongoose. وبدون ذلك، لن ينتهي برنامج الاختبار. يمكن تحقيق ذلك بسهولة باستخدام التابع [after](https://nodejs.org/api/test.html#afterfn-options):

```js
after(async () => {
  await mongoose.connection.close()
})
```

تفصيلة صغيرة ولكنها مهمة: في [بداية](/ar/part4/structure_of_backend_application_introduction_to_testing#project-structure) هذا الجزء استخرجنا تطبيق Express في ملف <i>app.js</i>، وتم تغيير دور ملف <i>index.js</i> لتشغيل التطبيق عند المنفذ المحدد عبر _app.listen_:

```js
const app = require('./app') // تطبيق Express الفعلي
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

تستخدم الاختبارات فقط تطبيق Express المحدد في ملف <i>app.js</i>، والذي لا يستمع إلى أي منافذ:

```js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // highlight-line

const api = supertest(app) // highlight-line

// ...
```

يقول توثيق supertest ما يلي:

> *إذا لم يكن الخادم يستمع بالفعل للاتصالات، فسيتم ربطه بمنفذ سريع الزوال (Ephemeral port) نيابة عنك، لذلك ليست هناك حاجة لتتبع المنافذ.*

بمعنى آخر، تهتم supertest ببدء تشغيل التطبيق قيد الاختبار على المنفذ الذي يستخدمه داخلياً. هذا أحد الأسباب التي تجعلنا نفضل supertest بدلاً من شيء مثل axios، حيث لا نحتاج إلى تشغيل نسخة أخرى من الخادم بشكل منفصل قبل البدء في الاختبار. والسبب الآخر هو أن supertest توفر دوالاً مثل `()expect`، مما يجعل الاختبار أسهل.

دعنا نضيف ملاحظتين إلى قاعدة بيانات الاختبار باستخدام برنامج _mongo.js_ (هنا يجب أن نتذكر التبديل إلى عنوان url الصحيح لقاعدة البيانات).

دعنا نكتب بعض الاختبارات الإضافية:

```js
const assert = require('node:assert')
// ...

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, 2)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert.strictEqual(contents.includes('HTML is easy'), true)
})

// ...
```

يقوم كلا الاختبارين بتخزين استجابة الطلب في المتغير _response_، وعلى عكس الاختبار السابق الذي استخدم الدوال التي توفرها _supertest_ للتحقق من رمز الحالة والترويسات، فإننا هذه المرة نفحص بيانات الاستجابة المخزنة في خاصية <i>response.body</i>. تتحقق اختباراتنا من تنسيق ومحتوى بيانات الاستجابة باستخدام التابع [strictEqual](https://nodejs.org/docs/latest/api/assert.html#assertstrictequalactual-expected-message) لمكتبة assert.

يمكننا تبسيط الاختبار الثاني قليلاً، واستخدام [assert](https://nodejs.org/docs/latest/api/assert.html#assertokvalue-message) نفسها للتحقق من أن الملاحظة من بين الملاحظات المعادة:

```js
test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})
```

بدأت فائدة استخدام صيغة async/await تتضح. عادةً ما يتعين علينا استخدام دوال رد النداء (Callbacks) للوصول إلى البيانات التي تُرجعها الوعود، ولكن مع الصيغة الجديدة تصبح الأمور أكثر راحة وسهولة:

```js
const response = await api.get('/api/notes')

// يصل التنفيذ إلى هنا فقط بعد اكتمال طلب HTTP
// يتم حفظ نتيجة طلب HTTP في المتغير response
assert.strictEqual(response.body.length, 2)
```

إن البرمجية الوسيطة التي تخرج معلومات حول طلبات HTTP تعيق وتزحم مخرجات تنفيذ الاختبار. دعونا نعدل وحدة التسجيل بحيث لا تطبع في وحدة التحكم في وضع الاختبار:

```js
const info = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
  // highlight-end
}

const error = (...params) => {
  // highlight-start
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
  // highlight-end  
}

module.exports = {
  info, error
}
```

### تهيئة قاعدة البيانات قبل الاختبارات (Initializing the database before tests)

حالياً، تعاني اختباراتنا من مشكلة حيث يعتمد نجاحها على حالة قاعدة البيانات. تنجح الاختبارات إذا كانت قاعدة بيانات الاختبار تحتوي بالصدفة على ملاحظتين، إحداهما تحتوي على المحتوى <i>'HTML is easy'</i>. لجعلها أكثر قوة وموثوقية، يتعين علينا إعادة تعيين قاعدة البيانات وتوليد بيانات الاختبار المطلوبة بطريقة خاضعة للرقابة قبل تشغيل الاختبارات.

تستخدم اختباراتنا بالفعل دالة [after](https://nodejs.org/api/test.html#afterfn-options) لإغلاق الاتصال بقاعدة البيانات بعد انتهاء تنفيذ الاختبارات. توفر مكتبة node:test العديد من الدوال الأخرى التي يمكن استخدامها لتنفيذ العمليات مرة واحدة قبل تشغيل أي اختبار أو في كل مرة قبل تشغيل اختبار معين.

دعونا نهيئ قاعدة البيانات *قبل كل اختبار* باستخدام دالة [beforeEach](https://nodejs.org/api/test.html#beforeeachfn-options):

```js
const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test') // highlight-line
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note') // highlight-line

const api = supertest(app)

// highlight-start
const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]
// highlight-end

// highlight-start
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(initialNotes[0])
  await noteObject.save()

  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})
// highlight-end

// ...
```

يتم مسح قاعدة البيانات في البداية، وبعد ذلك، نحفظ الملاحظتين المخزنتين في مصفوفة _initialNotes_ في قاعدة البيانات. من خلال القيام بذلك، نضمن أن قاعدة البيانات في نفس الحالة قبل تشغيل كل اختبار.

دعنا نعدل الاختبار الذي يتحقق من عدد الملاحظات على النحو التالي:

```js
// ...

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, initialNotes.length) // highlight-line
})

// ...
```

يمكنك العثور على شيفرة تطبيقنا الحالي بالكامل في الفرع <i>part4-3</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-3).

### تشغيل الاختبارات واحداً تلو الآخر (Running tests one by one)

ينفذ الأمر _npm test_ جميع اختبارات التطبيق. عندما نكتب الاختبارات، فمن الحكمة عادةً تنفيذ اختبار أو اختبارين فقط.

هناك عدة طرق مختلفة لتحقيق ذلك، إحداها هي التابع [only](https://nodejs.org/api/test.html#testonlyname-options-fn). باستخدام هذا التابع يمكننا تحديد الاختبارات التي يجب تنفيذها في الكود:

```js
test.only('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, 2)
})
```

عند تشغيل الاختبارات بالخيار _--test-only_، أي بالأمر:

```bash
npm test -- --test-only
```

يتم تنفيذ الاختبارات المميزة بـ _only_ فقط.

يكمن خطر استخدام _only_ في أن ينسى المطور إزالتها من الكود لاحقاً.

خيار آخر هو تحديد الاختبارات التي يجب تشغيلها كوسائط لأمر <i>npm test</i>.

الأمر التالي يقوم فقط بتشغيل الاختبارات الموجودة في ملف <i>tests/note_api.test.js</i>:

```bash
npm test -- tests/note_api.test.js
```

يمكن استخدام الخيار [--test-name-pattern](https://nodejs.org/api/test.html#filtering-tests-by-name) لتشغيل الاختبارات ذات الاسم المحدد:

```bash
npm test -- --test-name-pattern="a specific note is within the returned notes"
```

يمكن أن تشير الوسيطة المقدمة إلى اسم الاختبار أو كتلة describe. يمكن أن تحتوي أيضاً على جزء فقط من الاسم. سيقوم الأمر التالي بتشغيل جميع الاختبارات التي تحتوي على <i>notes</i> في اسمها:

```bash
npm run test -- --test-name-pattern="notes"
```

### الدوال غير المتزامنة والانتظار (async/await)

قبل أن نكتب المزيد من الاختبارات، دعونا نلقي نظرة على الكلمتين الأساسيتين _async_ و _await_.

إن صيغة async/await التي تم تقديمها في ES7 تجعل من الممكن استخدام *الدوال غير المتزامنة التي تُرجع وعداً (Promise)* بطريقة تجعل الكود يبدو متزامناً.

كمثال، يبدو جلب الملاحظات من قاعدة البيانات بالوعود (Promises) هكذا:

```js
Note.find({}).then(notes => {
  console.log('operation returned the following notes', notes)
})
```

يُرجع التابع _()Note.find_ وعداً ويمكننا الوصول إلى نتيجة العملية عن طريق تسجيل دالة رد نداء باستخدام التابع _then_.

تتم كتابة كل الشيفرة التي نريد تنفيذها بمجرد انتهاء العملية في دالة رد النداء. إذا أردنا إجراء عدة استدعاءات لدوال غير متزامنة بالتسلسل، فسرعان ما سيصبح الموقف مؤلماً ومعقداً. يجب إجراء الاستدعاءات غير المتزامنة في رد النداء. ومن المرجح أن يؤدي هذا إلى كود معقد ويمكن أن يولد ما يسمى بـ [جحيم ردود النداء (Callback hell)](https://stackoverflow.com/a/25098230).

من خلال [ربط وسلسلة الوعود (Chaining promises)](https://javascript.info/promise-chaining) يمكننا إبقاء الموقف تحت السيطرة إلى حد ما، وتجنب جحيم ردود النداء عن طريق إنشاء سلسلة نظيفة إلى حد ما من استدعاءات تابع _then_. لقد رأينا بعضاً من هذه خلال الدورة. لتوضيح ذلك، يمكنك عرض مثال مصطنع لدالة تجلب جميع الملاحظات ثم تحذف الملاحظة الأولى:

```js
Note.find({})
  .then(notes => {
    return notes[0].deleteOne()
  })
  .then(response => {
    console.log('the first note is removed')
    // المزيد من الشيفرة هنا
  })
```

إن سلسلة then مقبولة، لكن يمكننا القيام بعمل أفضل. وفرت [دوال التوليد (Generator functions)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) التي تم تقديمها في ES6 [طريقة ذكية](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch4.md#iterating-generators-asynchronously) لكتابة كود غير متزامن بطريقة "تبدو متزامنة". لكن صيغة بنائها غير مريحة بعض الشيء وليست مستخدمة على نطاق واسع.

توفر الكلمتان الأساسيتان _async_ و _await_ اللتان تم تقديمهما في ES7 نفس الوظائف مثل المولدات، ولكن بطريقة مفهومة وأنظف نحواً في أيدي جميع مبرمجي جافاسكريبت.

يمكننا جلب جميع الملاحظات في قاعدة البيانات باستخدام المعامل [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) هكذا:

```js
const notes = await Note.find({})

console.log('operation returned the following notes', notes)
```

يبدو الكود تماماً مثل الكود المتزامن. يتوقف تنفيذ الكود مؤقتاً عند <em>const notes = await Note.find({})</em> وينتظر حتى يتم *الوفاء (Fulfilled)* بالوعد ذي الصلة، ثم يواصل تنفيذه إلى السطر التالي. عندما يستمر التنفيذ، يتم إسناد نتيجة العملية التي أرجعت وعداً إلى متغير _notes_.

المثال المعقد قليلاً والمقدم أعلاه يمكن تنفيذه باستخدام await هكذا:

```js
const notes = await Note.find({})
const response = await notes[0].deleteOne()

console.log('the first note is removed')
```

بفضل الصيغة الجديدة، أصبح الكود أبسط بكثير من سلسلة then السابقة.

هناك بعض التفاصيل المهمة التي يجب الانتباه إليها عند استخدام صيغة async/await. لاستخدام المعامل await مع العمليات غير المتزامنة، يجب أن تُرجع هذه العمليات وعداً (Promise). هذه ليست مشكلة في حد ذاتها، حيث يسهل تغليف الدوال غير المتزامنة العادية التي تستخدم ردود النداء بالوعود.

لا يمكن استخدام الكلمة الأساسية await في أي مكان في كود جافاسكريبت. استخدام await ممكن فقط داخل دالة [غير متزامنة (async function)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

هذا يعني أنه لكي تعمل الأمثلة السابقة، يجب أن تستخدم دوال async. لاحظ السطر الأول في تعريف الدالة السهمية:

```js
const main = async () => { // highlight-line
  const notes = await Note.find({})
  console.log('operation returned the following notes', notes)

  const response = await notes[0].deleteOne()
  console.log('the first note is removed')
}

main() // highlight-line
```

تعلن الشيفرة أن الدالة المسندة إلى _main_ غير متزامنة. بعد ذلك، يستدعي الكود الدالة باستخدام `()main`.

### async/await في الواجهة الخلفية (async/await in the backend)

دعونا نبدأ في تغيير الواجهة الخلفية إلى async و await. دعنا نبدأ بالمسار المسؤول عن جلب جميع الملاحظات.

نظراً لأن جميع العمليات غير المتزامنة تتم حالياً داخل دالة، فيكفي تغيير دوال معالج المسار إلى دوال غير متزامنة (async functions). مسار جلب جميع الملاحظات:

```js
notesRouter.get('/', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})
```

يتغير إلى ما يلي:

```js
notesRouter.get('/', async (request, response) => { 
  const notes = await Note.find({})
  response.json(notes)
})
```

يمكننا التحقق من نجاح إعادة الهيكلة (Refactoring) عن طريق اختبار نقطة النهاية من خلال المتصفح وتشغيل الاختبارات التي كتبناها سابقاً.

### إعادة هيكلة المسار المسؤول عن إضافة ملاحظة

عند إعادة هيكلة الكود، هناك دائماً خطر حدوث [انحدار أو تراجع برمجي (Regression)](https://en.wikipedia.org/wiki/Regression_testing)، مما يعني أن الوظائف الحالية قد تتعطل. دعونا نعيد هيكلة العمليات المتبقية عن طريق كتابة اختبار أولاً لكل مسار من مسارات API.

دعونا نبدأ بالعملية الخاصة بإضافة ملاحظة جديدة. دعنا نكتب اختباراً يضيف ملاحظة جديدة ويتحقق من زيادة عدد الملاحظات التي ترجعها API وأن الملاحظة المضافة حديثاً موجودة في القائمة.

```js
test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  assert.strictEqual(response.body.length, initialNotes.length + 1)

  assert(contents.includes('async/await simplifies making async calls'))
})
```

يفشل الاختبار لأننا أرجعنا عن طريق الخطأ رمز الحالة <i>200 OK</i> عند إنشاء ملاحظة جديدة. دعونا نغير ذلك إلى رمز الحالة <i>201 CREATED</i>:

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.status(201).json(savedNote) // highlight-line
    })
    .catch(error => next(error))
})
```

دعنا نكتب أيضاً اختباراً يتحقق من أن الملاحظة التي لا تحتوي على محتوى لن يتم حفظها في قاعدة البيانات.

```js
test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, initialNotes.length)
})
```

يتحقق كلا الاختبارين من الحالة المخزنة في قاعدة البيانات بعد عملية الحفظ، عن طريق جلب جميع ملاحظات التطبيق.

```js
const response = await api.get('/api/notes')
```

ستتكرر نفس خطوات التحقق في اختبارات أخرى لاحقاً، ومن الجيد استخراج هذه الخطوات في دوال مساعدة (Helper functions). دعنا نضيف الدالة إلى ملف جديد يسمى <i>tests/test_helper.js</i> والموجود في نفس مجلد ملف الاختبار.

```js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb
}
```

تحدد الوحدة النمطية دالة _notesInDb_ التي يمكن استخدامها للتحقق من الملاحظات المخزنة في قاعدة البيانات. توجد أيضاً مصفوفة _initialNotes_ التي تحتوي على حالة قاعدة البيانات الأولية في الوحدة النمطية. نحدد أيضاً دالة _nonExistingId_ مسبقاً، والتي يمكن استخدامها لإنشاء معرف كائن قاعدة بيانات لا ينتمي إلى أي كائن ملاحظة في قاعدة البيانات.

يمكن لاختباراتنا الآن استخدام الوحدة المساعدة وتعديلها هكذا:

```js
const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper') // highlight-line
const Note = require('../models/note')

const api = supertest(app)

beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0]) // highlight-line
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1]) // highlight-line
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, helper.initialNotes.length) // highlight-line
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb() // highlight-line
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1) // highlight-line

  const contents = notesAtEnd.map(n => n.content) // highlight-line
  assert(contents.includes('async/await simplifies making async calls'))
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb() // highlight-line

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length) // highlight-line
})

after(async () => {
  await mongoose.connection.close()
})
```

الشيفرة التي تستخدم الوعود تعمل وتجتاز الاختبارات بنجاح. نحن جاهزون الآن لإعادة هيكلة كودنا لاستخدام صيغة async/await.

المسار المسؤول عن إضافة ملاحظة جديدة:

```js
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note
    .save()
    .then((savedNote) => {
      response.status(201).json(savedNote)
    })
    .catch((error) => next(error))
})
```

يتغير على النحو التالي:

```js
notesRouter.post('/', async (request, response) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  // highlight-start
  const savedNote = await note.save()
  response.status(201).json(savedNote)
  // highlight-end
})
```

تحتاج إلى إضافة الكلمة الأساسية _async_ في بداية المعالج لتمكين استخدام صيغة _async/await_. يصبح الكود أبسط بكثير.

والجدير بالذكر أنه لم يعد هناك حاجة لتمرير الأخطاء المحتملة بشكل منفصل لمعالجتها. في الشيفرة التي تستخدم الوعود، تم تمرير خطأ محتمل إلى البرمجية الوسيطة لمعالجة الأخطاء هكذا:

```js
  note
    .save()
    .then((savedNote) => {
      response.json(savedNote)
    })
    .catch((error) => next(error)) // highlight-line
```

عند استخدام صيغة _async/await_، سيقوم Express [تلقائياً باستدعاء](https://expressjs.com/en/guide/error-handling.html) البرمجية الوسيطة لمعالجة الأخطاء إذا أطلقت عبارة await خطأ أو تم رفض الوعد المنتظر. هذا يجعل الكود النهائي أنظف وأكثر وضوحاً.

**ملاحظة:** تتوفر هذه الميزة بدءاً من الإصدار 5 من Express. إذا قمت بتثبيت Express كتبعية قبل 31 مارس 2025، فقد لا تزال تستخدم الإصدار 4. يمكنك التحقق من إصدار Express لمشروعك في ملف _package.json_. إذا كان لديك إصدار أقدم، فقم بالتحديث إلى الإصدار 5 باستخدام الأمر التالي:

```bash
npm install express@5 
```

### إعادة هيكلة المسار المسؤول عن جلب ملاحظة فردية

بعد ذلك، دعنا نكتب اختباراً لعرض تفاصيل ملاحظة واحدة. تبرز الشيفرة عملية API الفعلية التي يتم إجراؤها:

```js
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToView = notesAtStart[0]

// highlight-start
  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
// highlight-end

  assert.deepStrictEqual(resultNote.body, noteToView)
})
```

أولاً، يجلب الاختبار ملاحظة واحدة من قاعدة البيانات. ثم يتحقق من إمكانية استرداد الملاحظة المحددة من خلال API. وأخيراً، يتحقق من أن محتوى الملاحظة المجلوبة هو كما هو متوقع.

هناك نقطة واحدة تستحق الملاحظة في الاختبار. بدلاً من التابع المستخدم سابقاً [strictEqual](https://nodejs.org/api/assert.html#assertstrictequalactual-expected-message)، يتم استخدام التابع [deepStrictEqual](https://nodejs.org/api/assert.html#assertdeepstrictequalactual-expected-message):

```js
assert.deepStrictEqual(resultNote.body, noteToView)
```

السبب في ذلك هو أن _strictEqual_ يستخدم التابع [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) لمقارنة التطابق المرجعي، أي أنه يقارن ما إذا كانت الكائنات هي نفس النسخة في الذاكرة. في حالتنا، نريد التحقق من أن محتويات الكائنات، أي قيم حقولها، متطابقة. ولهذا الغرض، فإن _deepStrictEqual_ هو التابع المناسب.

تجتاز الاختبارات بنجاح ويمكننا إعادة هيكلة المسار المختبر بأمان لاستخدام async/await:

```js
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```

### إعادة هيكلة المسار المسؤول عن حذف ملاحظة

دعنا نضيف أيضاً اختباراً للمسار الذي يتعامل مع حذف ملاحظة:

```js
test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()

  const ids = notesAtEnd.map(n => n.id)
  assert(!ids.includes(noteToDelete.id))

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})
```

تم تصميم الاختبار بشكل مشابه للاختبار الذي يتحقق من عرض ملاحظة واحدة. أولاً، يتم جلب ملاحظة واحدة من قاعدة البيانات، ثم يتم اختبار حذفها عبر API. وأخيراً، يتم التحقق من أن الملاحظة لم تعد موجودة في قاعدة البيانات وأن العدد الإجمالي للملاحظات قد انخفض بمقدار واحد.

لا تزال الاختبارات تجتاز بنجاح، لذا يمكننا المضي قدماً بأمان في إعادة هيكلة المسار:

```js
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
```

يمكنك العثور على شيفرة تطبيقنا الحالي بالكامل في الفرع <i>part4-4</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-4).

### تحسين دالة beforeEach

دعنا نعود إلى كتابة اختباراتنا ونلقي نظرة فاحصة على دالة _beforeEach_ التي تقوم بإعداد وتهيئة الاختبارات:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
```

تحفظ الدالة أول ملاحظتين من مصفوفة _helper.initialNotes_ في قاعدة البيانات بعمليتين منفصلتين. الحل مقبول، ولكن هناك طريقة أفضل لحفظ كائنات متعددة في قاعدة البيانات:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  console.log('cleared')

  helper.initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()
    console.log('saved')
  })
  console.log('done')
})

test('notes are returned as json', async () => {
  console.log('entered test')
  // ...
}
```

نقوم بحفظ الملاحظات المخزنة في المصفوفة في قاعدة البيانات داخل حلقة _forEach_. ومع ذلك، لا يبدو أن الاختبارات تعمل بشكل صحيح، لذلك أضفنا بعض سجلات وحدة التحكم لمساعدتنا في العثور على المشكلة.

تعرض وحدة التحكم المخرجات التالية:

```
cleared
done
entered test
saved
saved
```

على الرغم من استخدامنا لصيغة async/await، فإن حلنا لا يعمل كما توقعنا. يبدأ تنفيذ الاختبار قبل تهيئة قاعدة البيانات!

المشكلة هي أن كل تكرار لحلقة _forEach_ يولد عمليته غير المتزامنة الخاصة به، ودالة _beforeEach_ لا تنتظر اكتمالها. بمعنى آخر، أوامر await داخل حلقة _forEach_ ليست جزءاً من دالة _beforeEach_ ولكنها بدلاً من ذلك في دوال منفصلة، والتي لا تنتظرها _beforeEach_. بالإضافة إلى ذلك، [يتوقع تابع forEach دالة متزامنة كمعامل له](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#description)، لذلك لا يعمل هيكل _async/await_ بشكل صحيح داخله.

نظراً لأن تنفيذ الاختبارات يبدأ فور انتهاء دالة _beforeEach_ من التنفيذ، فإن تنفيذ الاختبارات يبدأ قبل تهيئة حالة قاعدة البيانات.

تتمثل إحدى طرق إصلاح ذلك في انتظار انتهاء تنفيذ جميع العمليات غير المتزامنة باستخدام التابع [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all):

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

يعد هذا الحل متقدماً للغاية على الرغم من مظهره المدمج. يتم إسناد المتغير _noteObjects_ إلى مصفوفة من كائنات Mongoose التي تم إنشاؤها باستخدام دالة بناء _Note_ لكل ملاحظة من الملاحظات الموجودة في مصفوفة _helper.initialNotes_. السطر التالي من الشيفرة ينشئ مصفوفة جديدة *تتكون من وعود (Promises)*، يتم إنشاؤها عن طريق استدعاء التابع _save_ لكل عنصر في مصفوفة _noteObjects_. بمعنى آخر، إنها مصفوفة من الوعود لحفظ كل عنصر من العناصر في قاعدة البيانات.

يمكن استخدام التابع [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) لتحويل مصفوفة من الوعود إلى وعد واحد، يتم *الوفاء به* بمجرد حل (Resolved) كل وعد في المصفوفة التي تم تمريرها إليه كمعامل. ينتظر السطر الأخير من الشيفرة <em>await Promise.all(promiseArray)</em> حتى ينتهي كل وعد بحفظ ملاحظة، مما يعني أنه تمت تهيئة قاعدة البيانات بالكامل.

> لا يزال من الممكن الوصول إلى القيم المعادة لكل وعد في المصفوفة عند استخدام التابع Promise.all. إذا انتظرنا حل الوعود باستخدام صيغة _await_ مثل <em>const results = await Promise.all(promiseArray)</em>، فسترجع العملية مصفوفة تحتوي على القيم المحلولة لكل وعد في _promiseArray_، وتظهر بنفس الترتيب الذي تظهر به الوعود في المصفوفة.

ينتظر `Promise.all` تسوية الوعود التي يتلقاها بشكل متزامن بالتوازي (Concurrently). إذا كانت العمليات بحاجة إلى أن تحدث بترتيب معين، فسيكون هذا أمراً إشكالياً. في مثل هذه المواقف، يمكن تنفيذ العمليات في [حلقة for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) باستخدام المعامل `await`، مما يضمن اكتمال كل عملية قبل أن تبدأ العملية التالية.

```js
beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of helper.initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})
```

يمكن أن تؤدي الطبيعة غير المتزامنة لجافاسكريبت إلى سلوك مفاجئ، ولهذا السبب، من المهم الانتباه بعناية عند استخدام صيغة async/await. على الرغم من أن الصيغة تجعل التعامل مع الوعود أسهل، إلا أنه لا يزال من الضروري فهم كيفية عمل الوعود!

ومع ذلك، هناك طريقة أبسط لتنفيذ دالة _beforeEach_. أسهل طريقة للتعامل مع هذا الموقف هي استخدام التابع المدمج _insertMany_ في Mongoose:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes) // highlight-line
})
```

يمكن العثور على شيفرة تطبيقنا على [GitHub](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-5)، الفرع <i>part4-5</i>.

### قسم المطور الشامل الحقيقي (A true full stack developer's oath)

يضيف إجراء الاختبارات طبقة أخرى من التحدي للبرمجة. يتعين علينا تحديث قسم مطور الويب الشامل لتذكيرك بأن المنهجية هي أيضاً المفتاح عند تطوير الاختبارات.

لذا يجب علينا مرة أخرى تمديد قسمنا:

تطوير الويب الشامل (Full stack development) *صعب للغاية*، ولهذا السبب سأستخدم جميع الوسائل الممكنة لجعله أسهل

- سأبقي وحدة تحكم مطور المتصفح مفتوحة طوال الوقت
- سأستخدم تبويب الشبكة في أدوات مطور المتصفح للتأكد من أن الواجهة الأمامية والخلفية تتواصلان كما أتوقع
- سأراقب باستمرار حالة الخادم للتأكد من حفظ البيانات المرسلة إليه من الواجهة الأمامية كما أتوقع
- سأراقب قاعدة البيانات: هل تحفظ الواجهة الخلفية البيانات هناك بالتنسيق الصحيح
- سأتقدم بخطوات صغيرة وتدريجية
- *سأكتب الكثير من عبارات _console.log_ للتأكد من أنني أفهم كيف يتصرف الكود والاختبارات وللمساعدة في تحديد المشكلات بدقة*
- إذا لم يعمل الكود الخاص بي، فلن أكتب المزيد من الكود. بدلاً من ذلك، سأبدأ في حذف الكود حتى يعمل أو أعود فقط إلى الحالة التي كان فيها كل شيء لا يزال يعمل
- *إذا لم يجتز الاختبار، أتأكد أولاً من أن الوظيفة المختبرة تعمل بالتأكيد في التطبيق الفعلي*
- عندما أطلب المساعدة في قناة الدورة على Discord أو في أي مكان آخر، سأصيغ أسئلتي بشكل صحيح، انظر [كيفية طلب المساعدة](/ar/part0/general_info#how-to-get-help-in-discord)

</div>

<div class="tasks">

### تمارين 4.8.-4.12.

**تحذير:** إذا وجدت نفسك تستخدم async/await وتوابع <i>then</i> في نفس الشيفرة، فمن المؤكد تقريباً أنك تفعل شيئاً خاطئاً. استخدم أحدهما أو الآخر ولا تخلط بين الاثنين.

#### 4.8: اختبارات قائمة المدونات، الخطوة 1

استخدم مكتبة SuperTest لكتابة اختبار يقوم بإجراء طلب HTTP GET إلى عنوان URL <i>/api/blogs</i>. تحقق من أن تطبيق قائمة المدونات يُرجع الكمية الصحيحة من منشورات المدونة بتنسيق JSON.

بمجرد الانتهاء من الاختبار، أعد هيكلة معالج المسار لاستخدام صيغة async/await بدلاً من الوعود.

لاحظ أنه سيتعين عليك إجراء تغييرات مماثلة على الشيفرة التي تم إجراؤها [في المادة](/ar/part4/testing_the_backend#test-environment)، مثل تحديد بيئة الاختبار بحيث يمكنك كتابة اختبارات تستخدم قواعد بيانات منفصلة.

**ملاحظة:** عندما تكتب اختباراتك **<i>من الأفضل عدم تنفيذها جميعاً</i>**، قم بتنفيذ الاختبارات التي تعمل عليها فقط. اقرأ المزيد حول هذا [هنا](/ar/part4/testing_the_backend#running-tests-one-by-one).

#### 4.9: اختبارات قائمة المدونات، الخطوة 2

اكتب اختباراً يتحقق من أن خاصية المعرف الفريد لمنشورات المدونة تسمى <i>id</i>، حيث تسمي قاعدة البيانات الخاصية افتراضياً بـ <i>_id</i>.

قم بإجراء التغييرات المطلوبة على الشيفرة بحيث تجتاز الاختبار. يعد التابع [toJSON](/ar/part3/saving_data_to_mongo_db#connecting-the-backend-to-a-database) الذي تمت مناقشته في الجزء الثالث مكاناً مناسباً لتحديد معامل <i>id</i>.

#### 4.10: اختبارات قائمة المدونات، الخطوة 3

اكتب اختباراً يتحقق من أن إجراء طلب HTTP POST إلى عنوان URL <i>/api/blogs</i> ينشئ بنجاح منشور مدونة جديداً. على أقل تقدير، تحقق من زيادة إجمالي عدد المدونات في النظام بمقدار واحد. يمكنك أيضاً التحقق من حفظ محتوى منشور المدونة بشكل صحيح في قاعدة البيانات.

بمجرد الانتهاء من الاختبار، أعد هيكلة العملية لاستخدام async/await بدلاً من الوعود.

#### 4.11*: اختبارات قائمة المدونات، الخطوة 4

اكتب اختباراً يتحقق من أنه إذا كانت خاصية <i>likes</i> مفقودة من الطلب، فسيتم تعيين قيمتها الافتراضية إلى 0. لا تختبر الخصائص الأخرى للمدونات التي تم إنشاؤها بعد.

قم بإجراء التغييرات المطلوبة على الكود بحيث يجتاز الاختبار.

#### 4.12*: اختبارات قائمة المدونات، الخطوة 5

اكتب اختبارات تتعلق بإنشاء مدونات جديدة عبر نقطة النهاية <i>/api/blogs</i>، والتي تتحقق من أنه إذا كانت خصائص <i>title</i> أو <i>url</i> مفقودة من بيانات الطلب، فإن الواجهة الخلفية تستجيب للطلب برمز الحالة <i>400 Bad Request</i>.

قم بإجراء التغييرات المطلوبة على الكود بحيث يجتاز الاختبار.

</div>

<div class="content">

### إعادة هيكلة الاختبارات (Refactoring tests)

تغطية الاختبارات لدينا تفتقر إلى الاكتمال حالياً. بعض الطلبات مثل <i>GET /api/notes/:id</i> و <i>DELETE /api/notes/:id</i> لا يتم اختبارها عند إرسال الطلب بمعرف غير صالح. كما يمكن أن يستفيد تجميع الاختبارات وتنظيمها من بعض التحسين، حيث توجد جميع الاختبارات في نفس "المستوى الأعلى" في ملف الاختبار. ستتحسن إمكانية قراءة الاختبار إذا قمنا بتجميع الاختبارات ذات الصلة مع كتل <i>describe</i>.

فيما يلي مثال على ملف الاختبار بعد إجراء بعض التحسينات البسيطة:

```js
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/note')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/notes/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/notes/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('fails with status code 400 if data invalid', async () => {
      const newNote = { important: true }

      await api.post('/api/notes').send(newNote).expect(400)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

      const notesAtEnd = await helper.notesInDb()

      const ids = notesAtEnd.map(n => n.id)
      assert(!ids.includes(noteToDelete.id))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
```

يتم تجميع مخرجات الاختبار في وحدة التحكم وفقاً لكتل <i>describe</i>:

![node:test output showing grouped describe blocks](../../images/4/7new.png)

لا يزال هناك مجال للتحسين، ولكن حان الوقت للمضي قدماً.

إن هذه الطريقة في اختبار API، عن طريق إجراء طلبات HTTP وفحص قاعدة البيانات باستخدام Mongoose، ليست بأي حال من الأحوال الطريقة الوحيدة أو الأفضل لإجراء اختبارات التكامل على مستوى واجهة برمجة التطبيقات لتطبيقات الخادم. لا توجد طريقة مثالية عالمياً لكتابة الاختبارات، حيث يعتمد كل شيء على التطبيق الذي يتم اختباره والموارد المتاحة.

يمكنك العثور على شيفرة تطبيقنا الحالي بالكامل في الفرع <i>part4-6</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part4-6).

</div>

<div class="tasks">

### تمارين 4.13.-4.14.

#### 4.13 توسيعات قائمة المدونات، الخطوة 1

قم بتنفيذ الوظيفة لحذف مورد منشور مدونة فردي.

استخدم صيغة async/await. اتبع اصطلاحات [RESTful](/ar/part3/node_js_and_express#rest) عند تحديد واجهة HTTP API.

قم بتنفيذ اختبارات لهذه الوظيفة.

#### 4.14 توسيعات قائمة المدونات، الخطوة 2

قم بتنفيذ الوظيفة لتحديث معلومات منشور مدونة فردي.

استخدم async/await.

يحتاج التطبيق في الغالب إلى تحديث عدد *الإعجابات (Likes)* لمنشور المدونة. يمكنك تنفيذ هذه الوظيفة بنفس الطريقة التي نفذنا بها تحديث الملاحظات في [الجزء 3](/ar/part3/saving_data_to_mongo_db#other-operations).

قم بتنفيذ اختبارات لهذه الوظيفة.

</div>
