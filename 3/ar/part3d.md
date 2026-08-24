---
mainImage: ../../../images/part-3.svg
part: 3
letter: d
lang: ar
---

<div class="content">

عادةً ما تكون هناك قيود نريد تطبيقها على البيانات المخزنة في قاعدة بيانات تطبيقنا. لا ينبغي لتطبيقنا قبول ملاحظات تحتوي على خاصية <i>content</i> مفقودة أو فارغة. يتم التحقق من صحة الملاحظة في معالج المسار:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body
  // highlight-start
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }
  // highlight-end

  // ...
})
```

إذا لم تكن الملاحظة تحتوي على خاصية <i>content</i>، فإننا نستجيب للطلب برمز الحالة <i>400 bad request</i>.

تتمثل إحدى الطرق الأكثر ذكاءً للتحقق من صحة تنسيق البيانات قبل تخزينها في قاعدة البيانات في استخدام وظيفة [التحقق من الصحة (Validation)](https://mongoosejs.com/docs/validation.html) المتوفرة في Mongoose.

يمكننا تحديد قواعد تحقق محددة لكل حقل في المخطط (Schema):

```js
const noteSchema = new mongoose.Schema({
  // highlight-start
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  // highlight-end
  important: Boolean
})
```

حقل <i>content</i> مطلوب الآن أن يكون طوله خمسة أحرف على الأقل وتم تعيينه كـ required، مما يعني أنه لا يمكن أن يكون مفقوداً. لم نضف أي قيود على حقل <i>important</i>، لذلك لم يتغير تعريفه في المخطط.

محددات التحقق <i>minLength</i> و <i>required</i> هي أدوات تحقق [مدمجة (Built-in)](https://mongoosejs.com/docs/validation.html#built-in-validators) وتوفرها Mongoose. تتيح لنا وظيفة [أداة التحقق المخصصة (Custom validator)](https://mongoosejs.com/docs/validation.html#custom-validators) في Mongoose إنشاء أدوات تحقق جديدة إذا لم تكن أي من الأدوات المدمجة تغطي احتياجاتنا.

إذا حاولنا تخزين كائن في قاعدة البيانات يكسر أحد القيود، فستطلق العملية استثناءً (Exception). دعنا نغير معالجنا لإنشاء ملاحظة جديدة بحيث يمرر أي استثناءات محتملة إلى البرمجية الوسيطة لمعالجة الأخطاء:

```js
app.post('/api/notes', (request, response, next) => { // highlight-line
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error)) // highlight-line
})
```

دعنا نوسع معالج الأخطاء للتعامل مع أخطاء التحقق من الصحة هذه:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // highlight-line
    return response.status(400).json({ error: error.message }) // highlight-line
  }

  next(error)
}
```

عندما يفشل التحقق من صحة كائن، فإننا نرجع رسالة الخطأ الافتراضية التالية من Mongoose:

![postman showing error message](../../images/3/50.png)

### نشر الواجهة الخلفية لقاعدة البيانات إلى بيئة الإنتاج

يجب أن يعمل التطبيق كما هو تقريباً في Fly.io/Render. ليس علينا إنشاء بناء إنتاج جديد للواجهة الأمامية لأن التغييرات حتى الآن كانت على واجهتنا الخلفية فقط.

سيتم استخدام متغيرات البيئة المحددة في dotenv فقط عندما لا تكون الواجهة الخلفية في *وضع الإنتاج (Production mode)*، أي في بيئة Fly.io أو Render.

بالنسبة للإنتاج، يتعين علينا تعيين عنوان URL لقاعدة البيانات في الخدمة التي تستضيف تطبيقنا.

في Fly.io يتم ذلك باستخدام الأمر _fly secrets set_:

```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

عند تطوير التطبيق، فمن المرجح جداً أن يفشل شيء ما. على سبيل المثال، عندما قمت بنشر تطبيقي لأول مرة مع قاعدة البيانات، لم تظهر أي ملاحظة على الإطلاق:

![browser showing no notes appearing](../../images/3/fly-problem1.png)

كشف تبويب الشبكة في وحدة تحكم المتصفح أن جلب الملاحظات لم ينجح، وظل الطلب لفترة طويلة في حالة _pending_ حتى فشل برمز الحالة 502.

يجب أن تكون وحدة تحكم المتصفح مفتوحة *طوال الوقت!*

من الضروري أيضاً متابعة سجلات الخادم باستمرار. أصبحت المشكلة واضحة عند فتح السجلات باستخدام _fly logs_:

![fly.io server log showing connecting to undefined](../../images/3/fly-problem3.png)

كان عنوان url لقاعدة البيانات _undefined_، لذا تم نسيان الأمر *fly secrets set MONGODB\_URI*.

ستحتاج أيضاً إلى إضافة عنوان IP الخاص بتطبيق fly.io إلى القائمة البيضاء (Whitelist) في MongoDB Atlas. إذا لم تفعل ذلك، فسترفض MongoDB الاتصال.

للأسف، لا توفر لك fly.io عنوان IPv4 مخصصاً لتطبيقك، لذا ستحتاج إلى السماح لجميع عناوين IP في MongoDB Atlas.

عند استخدام Render، يتم إعطاء عنوان url لقاعدة البيانات عن طريق تحديد متغير البيئة المناسب في لوحة التحكم (Dashboard):

![render dashboard showing the MONGODB_URI env variable](../../images/3/render-env.png)

تعرض لوحة تحكم Render سجلات الخادم:

![render dashboard with arrow pointing to server running on port 10000](../../images/3/r7.png)

يمكنك العثور على شيفرة تطبيقنا الحالي بالكامل في الفرع <i>part3-6</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-6).

</div>

<div class="tasks">

### تمارين 3.19.-3.21.

#### 3.19*: قاعدة بيانات دليل الهاتف، الخطوة 7

قم بتوسيع التحقق من الصحة بحيث يجب أن يتكون الاسم المخزن في قاعدة البيانات من ثلاثة أحرف على الأقل.

قم بتوسيع الواجهة الأمامية بحيث تعرض نوعاً من رسائل الخطأ عند حدوث خطأ في التحقق من الصحة. يمكن تنفيذ معالجة الأخطاء عن طريق إضافة كتلة <em>catch</em> كما هو موضح أدناه:

```js
personService
    .create({ ... })
    .then(createdPerson => {
      // ...
    })
    .catch(error => {
      // this is the way to access the error message
      console.log(error.response.data.error)
    })
```

يمكنك عرض رسالة الخطأ الافتراضية التي تُرجعها Mongoose، على الرغم من أنها قد لا تكون سهلة القراءة بالقدر المطلوب:

![phonebook screenshot showing person validation failure](../../images/3/56e.png)

**ملاحظة:** في عمليات التحديث (Update operations)، تكون أدوات التحقق من Mongoose معطلة بشكل افتراضي. [اقرأ التوثيق](https://mongoosejs.com/docs/validation.html) لمعرفة كيفية تمكينها.

#### 3.20*: قاعدة بيانات دليل الهاتف، الخطوة 8

أضف التحقق من الصحة إلى تطبيق دليل الهاتف الخاص بك، والذي سيتأكد من أن أرقام الهواتف بالشكل الصحيح. يجب أن يتوفر في رقم الهاتف ما يلي:

- أن يكون طوله 8 أحرف/أرقام أو أكثر
- أن يتكون من جزأين مفصولين بـ -، الجزء الأول يحتوي على رقمين أو ثلاثة والجزء الثاني يتكون أيضاً من أرقام
    - على سبيل المثال: 09-1234556 و 040-22334455 أرقام هواتف صالحة
    - على سبيل المثال: 1234556 و 1-22334455 و 10-22-334455 أرقام غير صالحة

استخدم [أداة تحقق مخصصة (Custom validator)](https://mongoosejs.com/docs/validation.html#custom-validators) لتنفيذ الجزء الثاني من التحقق من الصحة.

إذا حاول طلب HTTP POST إضافة شخص برقم هاتف غير صالح، فيجب أن يستجيب الخادم برمز الحالة المناسب ورسالة الخطأ.

#### 3.21 نشر الواجهة الخلفية لقاعدة البيانات إلى الإنتاج

قم بإنشاء نسخة "full stack" جديدة من التطبيق عن طريق إنشاء بناء إنتاج جديد للواجهة الأمامية، ونسخه إلى مجلد الواجهة الخلفية. تحقق من أن كل شيء يعمل محلياً باستخدام التطبيق بأكمله من العنوان <http://localhost:3001/>.

ادفع أحدث إصدار إلى Fly.io/Render وتحقق من أن كل شيء يعمل هناك أيضاً.

**تنبيه:** لا يجوز لك نشر الواجهة الأمامية مباشرة في أي مرحلة من هذا الجزء. يتم نشر مستودع الواجهة الخلفية فقط طوال هذا الجزء بأكمله. تتم إضافة بناء الإنتاج للواجهة الأمامية إلى مستودع الواجهة الخلفية، وتقدمه الواجهة الخلفية كما هو موضح في قسم [تقديم الملفات الثابتة من الواجهة الخلفية](/ar/part3/deploying_app_to_internet#serving-static-files-from-the-backend).

</div>

<div class="content">

### فاحص الشيفرة (Lint)

قبل أن ننتقل إلى الجزء التالي، سنلقي نظرة على أداة مهمة تسمى [lint](<https://en.wikipedia.org/wiki/Lint_(software)>). تقول ويكيبيديا ما يلي عن lint:

> *بشكل عام، فإن lint أو linter هي أي أداة تكتشف الأخطاء وتضع علامات عليها في لغات البرمجة، بما في ذلك الأخطاء الأسلوبية (Stylistic errors). يُطبق مصطلح السلوك الشبيه بـ lint أحياناً على عملية الإبلاغ عن الاستخدام المشبوه للغة. تؤدي الأدوات الشبيهة بـ Lint بشكل عام تحليلاً ثابتاً للشيفرة المصدرية.*

في اللغات المترجمة ذات الأنواع الثابتة (Statically typed) مثل Java، يمكن لبيئات التطوير المتكاملة (IDEs) مثل NetBeans الإشارة إلى الأخطاء في الكود، حتى تلك التي تتجاوز مجرد أخطاء الترجمة. يمكن استخدام أدوات إضافية لإجراء [التحليل الثابت (Static analysis)](https://en.wikipedia.org/wiki/Static_program_analysis) مثل [checkstyle](https://checkstyle.sourceforge.io)، لتوسيع قدرات بيئة التطوير للإشارة أيضاً إلى المشكلات المتعلقة بالأسلوب، مثل المحاذاة والمسافات البادئة (Indentation).

في عالم جافاسكريبت، الأداة الرائدة الحالية للتحليل الثابت (المعروف أيضاً باسم "linting") هي [ESlint](https://eslint.org/).

دعنا نضيف ESLint كـ *تبعية تطوير (Development dependency)* للواجهة الخلفية. تبعيات التطوير هي أدوات لازمة فقط أثناء تطوير التطبيق. على سبيل المثال، الأدوات المتعلقة بالاختبار هي مثل هذه التبعيات. عندما يتم تشغيل التطبيق في وضع الإنتاج، لا تكون هناك حاجة إلى تبعيات التطوير.

قم بتثبيت ESLint كتبعية تطوير للواجهة الخلفية باستخدام الأمر:

```bash
npm install eslint @eslint/js --save-dev
```

ستتغير محتويات ملف package.json على النحو التالي:

```js
{
  //...
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "mongoose": "^8.11.0"
  },
  "devDependencies": { // highlight-line
    "@eslint/js": "^9.22.0", // highlight-line
    "eslint": "^9.22.0" // highlight-line
  }
}
```

أضاف الأمر قسم <i>devDependencies</i> إلى الملف وتضمن الحزمتين <i>eslint</i> و <i>@eslint/js</i>، وقام بتثبيت المكتبات المطلوبة في المجلد <i>node_modules</i>.

بعد ذلك يمكننا تهيئة تكوين ESlint الافتراضي باستخدام الأمر:

```bash
npx eslint --init
```

سنجيب على جميع الأسئلة المطروحة:

![terminal output from ESlint init](../../images/3/lint1.png)

سيتم حفظ التكوين في ملف _eslint.config.mjs_ المُنشأ.

### تنسيق ملف التكوين (Formatting the Configuration File)

دعنا نعيد تنسيق ملف التكوين _eslint.config.mjs_ من شكله الحالي إلى ما يلي:

```js
import globals from 'globals'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
  },
]
```

حتى الآن، يحدد ملف تكوين ESLint الخاص بنا خيار _files_ بـ _["\*\*/\*.js"]_، والذي يخبر ESLint بالنظر في جميع ملفات جافاسكريبت في مجلد مشروعنا. تحدد خاصية _languageOptions_ الخيارات المتعلقة بميزات اللغة التي يجب أن يتوقعها ESLint، حيث قمنا بتعريف خيار _sourceType_ على أنه "commonjs". يشير هذا إلى أن كود جافاسكريبت في مشروعنا يستخدم نظام وحدات CommonJS، مما يسمح لـ ESLint بتحليل الكود وفقاً لذلك.

تحدد خاصية _globals_ المتغيرات العامة المعرفة مسبقاً. يخبر عامل النشر (Spread operator) المطبق هنا ESLint بتضمين جميع المتغيرات العامة المحددة في إعدادات _globals.node_ مثل _process_. في حالة كود المتصفح سنحدد هنا _globals.browser_ للسماح بالمتغيرات العامة الخاصة بالمتصفح مثل _window_ و _document_.

أخيراً، يتم تعيين خاصية _ecmaVersion_ إلى "latest". يؤدي هذا إلى تعيين إصدار ECMAScript إلى أحدث إصدار متاح، مما يعني أن ESLint سيفهم ويفحص أحدث صيغ وميزات جافاسكريبت بشكل صحيح.

نريد الاستفادة من [إعدادات ESLint الموصى بها](https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations) جنباً إلى جنب مع إعداداتنا الخاصة. توفر لنا الحزمة _@eslint/js_ التي قمنا بتثبيتها سابقاً تكوينات محددة مسبقاً لـ ESLint. سنقوم باستيرادها وتمكينها في ملف التكوين:

```js
import globals from 'globals'
import js from '@eslint/js' // highlight-line
// ...

export default [
  js.configs.recommended, // highlight-line
  {
    // ...
  },
]
```

لقد أضفنا _js.configs.recommended_ إلى أعلى مصفوفة التكوين، وهذا يضمن تطبيق إعدادات ESLint الموصى بها أولاً قبل خياراتنا المخصصة.

دعنا نواصل بناء ملف التكوين. قم بتثبيت [إضافة (Plugin)](https://eslint.style/packages/js) تحدد مجموعة من القواعد المتعلقة بنمط وأسلوب الكود:

```bash
npm install --save-dev @stylistic/eslint-plugin
```

استورد الإضافة ومكنها، وأضف قواعد نمط الكود الأربع هذه:

```js
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin' // highlight-line

export default [
  {
    // ...
    // highlight-start
    plugins: { 
      '@stylistic/js': stylisticJs,
    },
    rules: { 
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    }, 
    // highlight-end
  },
]
```

توفر خاصية [plugins](https://eslint.org/docs/latest/use/configure/plugins) طريقة لتوسيع وظائف ESLint عن طريق إضافة قواعد مخصصة وتكوينات وإمكانيات أخرى غير متوفرة في مكتبة ESLint الأساسية. لقد قمنا بتثبيت وتمكين _@stylistic/eslint-plugin_، والتي تضيف قواعد أسلوبية لجافاسكريبت لـ ESLint. بالإضافة إلى ذلك، تمت إضافة قواعد للمسافات البادئة، وفواصل الأسطر، وعلامات الاقتباس، والفاصلة المنقوطة. تم تحديد هذه القواعد الأربع في [إضافة أنماط Eslint](https://eslint.style/packages/js).

**ملاحظة لمستخدمي Windows:** تم تعيين نمط فاصل الأسطر (Linebreak) إلى _unix_ في قواعد النمط. يوصى باستخدام فواصل أسطر بنمط Unix (وهي _\n_) بغض النظر عن نظام التشغيل الخاص بك، لأنها متوافقة مع معظم أنظمة التشغيل الحديثة وتسهل التعاون عندما يعمل عدة أشخاص على نفس الملفات. إذا كنت تستخدم فواصل أسطر بنمط Windows، فسيصدر ESLint الأخطاء التالية: <i>Expected linebreaks to be 'LF' but found 'CRLF'</i>. في هذه الحالة، قم بتهيئة Visual Studio Code لاستخدام فواصل الأسطر بنمط Unix باتباع [هذا الدليل](https://stackoverflow.com/questions/48692741/how-can-i-make-all-line-endings-eols-in-all-files-in-visual-studio-code-unix).

### تشغيل أداة الفحص (Running the Linter)

يمكن فحص ملف مثل _index.js_ والتحقق من صحته باستخدام الأمر التالي:

```bash
npx eslint index.js
```

يوصى بإنشاء *سكربت npm* منفصل لعملية الفحص:

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint ." // highlight-line
    // ...
  },
  // ...
}
```

الآن سيتحقق الأمر _npm run lint_ من كل ملف في المشروع.

يتم أيضاً فحص الملفات الموجودة في المجلد <em>dist</em> عند تشغيل الأمر. نحن لا نريد أن يحدث هذا، ويمكننا تحقيق ذلك عن طريق إضافة كائن بخاصية [ignores](https://eslint.org/docs/latest/use/configure/ignore) التي تحدد مصفوفة من المجلدات والملفات التي نريد تجاهلها.

```js
// ...
export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    // ...
  },
  // highlight-start
  { 
    ignores: ['dist/**'], 
  },
  // highlight-end
]
```

يؤدي هذا إلى عدم فحص مجلد <em>dist</em> بأكمله بواسطة ESlint.

لدى Lint الكثير ليقوله عن كودنا:

![terminal output of ESlint errors](../../images/3/53ea.png)

البديل الأفضل لتنفيذ أداة الفحص من سطر الأوامر هو تكوين _eslint-plugin_ في المحرر، والذي يشغل أداة الفحص باستمرار. باستخدام الإضافة، ستشاهد الأخطاء في الكود الخاص بك على الفور. يمكنك العثور على مزيد من المعلومات حول إضافة ESLint لـ Visual Studio [هنا](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

ستضع إضافة ESlint في VS Code خطاً أحمر تحت انتهاكات النمط:

![Screenshot of vscode ESlint plugin showing errors](../../images/3/54a.png)

هذا يجعل من السهل اكتشاف الأخطاء وإصلاحها على الفور.

### إضافة المزيد من قواعد الأنماط (Adding More Style Rules)

لدى ESlint مجموعة واسعة من [القواعد](https://eslint.org/docs/rules/) التي يسهل استخدامها عن طريق تحرير ملف _eslint.config.mjs_.

دعنا نضيف قاعدة [eqeqeq](https://eslint.org/docs/rules/eqeqeq) التي تحذرنا إذا تم التحقق من المساواة بأي شيء غير عامل المساواة الثلاثي (`===`). تتم إضافة القاعدة أسفل حقل rules في ملف التكوين.

```js
export default [
  // ...
  rules: {
    // ...
   eqeqeq: 'error', // highlight-line
  },
  // ...
]
```

وبينما نحن بصدد ذلك، دعنا نجري بعض التغييرات الأخرى على القواعد.

دعنا نمنع [المسافات الزائدة غير الضرورية (Trailing spaces)](https://eslint.style/rules/no-trailing-spaces) في نهايات الأسطر، ونطلب [وجود مسافة دائماً قبل وبعد الأقواس المعقوفة](https://eslint.style/rules/object-curly-spacing)، ونطلب أيضاً استخداماً متسقاً للمسافات البيضاء في معاملات دوال الأسهم (Arrow functions).

```js
export default [
  // ...
  rules: {
    // ...
    eqeqeq: 'error',
    // highlight-start
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    // highlight-end
  },
]
```

يستخدم تكويننا الافتراضي مجموعة من القواعد المحددة مسبقاً من:

```js
// ...

export default [
  js.configs.recommended,
  // ...
]
```

يتضمن هذا قاعدة تحذر من أوامر <em>console.log</em> التي لا نريد استخدامها في الإنتاج. يمكن تعطيل القاعدة عن طريق تحديد "قيمتها" على أنها 0 أو _off_ في ملف التكوين. دعنا نفعل ذلك لقاعدة _no-console_ في هذه الأثناء.

```js
[
  {
    // ...
    rules: {
      // ...
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off', // highlight-line
    },
  },
]
```

سيسمح لنا تعطيل قاعدة no-console باستخدام عبارات console.log دون أن يصنفها ESLint على أنها مشكلات. يمكن أن يكون هذا مفيداً بشكل خاص أثناء التطوير عندما تحتاج إلى تصحيح أخطاء الشيفرة الخاصة بك. فيما يلي ملف التكوين الكامل مع جميع التغييرات التي أجريناها حتى الآن:

```js
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
]
```

**ملاحظة:** عند إجراء تغييرات على ملف _eslint.config.mjs_، يوصى بتشغيل أداة الفحص من سطر الأوامر. سيؤدي هذا إلى التحقق من تنسيق ملف التكوين بشكل صحيح:

![terminal output from npm run lint](../../images/3/lint2.png)

إذا كان هناك خطأ ما في ملف التكوين الخاص بك، فقد تتصرف إضافة lint بشكل غير منتظم.

تحدد العديد من الشركات معايير الترميز التي يتم فرضها في جميع أنحاء المؤسسة من خلال ملف تكوين ESlint. لا يُنصح بإعادة اختراع العجلة مراراً وتكراراً، وقد يكون من الجيد اعتماد تكوين جاهز من مشروع شخص آخر في مشروعك. في الآونة الأخيرة، اعتمدت العديد من المشاريع [دليل أسلوب Airbnb لجافاسكريبت](https://github.com/airbnb/javascript) عن طريق استخدام تكوين [ESlint الخاص بـ Airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb).

يمكنك العثور على شيفرة تطبيقنا الحالي بالكامل في الفرع <i>part3-7</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-7).

</div>

<div class="tasks">

### تمرين 3.22.

#### 3.22: تكوين Lint

أضف ESlint إلى تطبيقك وأصلح جميع التحذيرات.

كان هذا هو التمرين الأخير في هذا الجزء من الدورة. حان الوقت لدفع الكود الخاص بك إلى GitHub وتحديد جميع تمارينك المكتملة في [نظام إرسال التمارين](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
