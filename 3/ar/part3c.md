---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: ar
---

<div class="content">

قبل أن ننتقل إلى الموضوع الرئيسي وهو حفظ البيانات واستمراريتها (Persisting data) في قاعدة بيانات، سنلقي نظرة على بعض الطرق المختلفة لتنقيح وتصحيح أخطاء (Debugging) تطبيقات Node.

### تنقيح أخطاء تطبيقات Node (Debugging Node applications)

يعد تنقيح أخطاء تطبيقات Node أصعب قليلاً من تصحيح أخطاء جافاسكريبت التي تعمل في متصفحك. وتعد الطباعة في وحدة التحكم (Console) طريقة مجربة وموثوقة، وتستحق دائماً استخدامها. يعتقد بعض الناس أنه يجب استخدام طرق أكثر تطوراً بدلاً من ذلك، لكني لا أوافق على ذلك. حتى نخبة مطوري المصادر المفتوحة في العالم [يستخدمون](https://tenderlovemaking.com/2016/02/05/i-am-a-puts-debuggerer.html) هذه [الطريقة](https://swizec.com/blog/javascript-debugging-slightly-beyond-consolelog/).

#### محرر Visual Studio Code

يمكن أن يكون منقح الأخطاء (Debugger) في Visual Studio Code مفيداً في بعض المواقف. يمكنك تشغيل التطبيق في وضع تصحيح الأخطاء هكذا (في هذه الصورة والصور القليلة التالية، تحتوي الملاحظات على حقل _date_ الذي تمت إزالته من الإصدار الحالي للتطبيق):

![screenshot showing how to launch debugger in vscode](../../images/3/35x.png)

لاحظ أنه لا ينبغي تشغيل التطبيق في طرفية أخرى، وإلا فسيكون المنفذ مستخدماً بالفعل.

**ملاحظة:** قد يحتوي الإصدار الأحدث من Visual Studio Code على كلمة _Run_ بدلاً من _Debug_. علاوة على ذلك، قد تضطر إلى تكوين ملف _launch.json_ لبدء تصحيح الأخطاء. يمكن القيام بذلك عن طريق اختيار _...Add Configuration_ من القائمة المنسدلة، والموجودة بجوار زر التشغيل الأخضر وفوق قائمة _VARIABLES_، وتحديد _Run "npm start" in a debug terminal_. لمزيد من إرشادات الإعداد التفصيلية، تفضل بزيارة [توثيق تصحيح الأخطاء](https://code.visualstudio.com/docs/editor/debugging) في Visual Studio Code.

أدناه يمكنك رؤية لقطة شاشة تم فيها إيقاف تنفيذ الشيفرة مؤقتاً في منتصف حفظ ملاحظة جديدة:

![vscode screenshot of execution at a breakpoint](../../images/3/36x.png)

توقف التنفيذ عند *نقطة التوقف (Breakpoint)* في السطر 69. في وحدة التحكم، يمكنك رؤية قيمة المتغير <i>note</i>. في النافذة العلوية اليسرى، يمكنك رؤية أشياء أخرى تتعلق بحالة التطبيق.

يمكن استخدام الأسهم الموجودة في الأعلى للتحكم في تدفق مسار منقح الأخطاء.

لسبب ما، أنا شخصياً لا أستخدم منقح الأخطاء في Visual Studio Code كثيراً.

#### أدوات مطوري Chrome (Chrome dev tools)

تصحيح الأخطاء ممكن أيضاً باستخدام وحدة تحكم مطوري Chrome عن طريق بدء تشغيل تطبيقك بالأمر:

```bash
node --inspect index.js
```

يمكنك الوصول إلى منقح الأخطاء بالنقر فوق الأيقونة الخضراء - شعار node - التي تظهر في وحدة تحكم مطوري Chrome:

![dev tools with green node logo icon](../../images/3/37.png)

تعمل طريقة عرض تصحيح الأخطاء بنفس الطريقة التي كانت تعمل بها مع تطبيقات React. يمكن استخدام تبويب *المصادر (Sources)* لتعيين نقاط التوقف (Breakpoints) حيث سيتم إيقاف تنفيذ الشيفرة مؤقتاً.

![dev tools sources tab breakpoint and watch variables](../../images/3/38eb.png)

ستظهر جميع رسائل <i>console.log</i> الخاصة بالتطبيق في تبويب *وحدة التحكم (Console)* في منقح الأخطاء. يمكنك أيضاً فحص قيم المتغيرات وتنفيذ كود جافاسكريبت الخاص بك.

![dev tools console tab showing note object typed in](../../images/3/39ea.png)

#### شك في كل شيء (Question everything)

قد يبدو تصحيح أخطاء تطبيقات Full Stack خادعاً وصعباً في البداية. قريباً سيكون لتطبيقنا أيضاً قاعدة بيانات بالإضافة إلى الواجهة الأمامية والواجهة الخلفية، وسيكون هناك العديد من المجالات المحتملة للأخطاء البرمجية في التطبيق.

عندما "لا يعمل" التطبيق، يتعين علينا أولاً معرفة مكان حدوث المشكلة بالفعل. من الشائع جداً وجود المشكلة في مكان لم تكن تتوقعه، وقد يستغرق الأمر دقائق أو ساعات أو حتى أياماً قبل أن تجد مصدر المشكلة.

المفتاح هو أن تكون منهجياً ومنظماً. نظراً لأن المشكلة يمكن أن توجد في أي مكان، *يجب أن تشك في كل شيء*، وتستبعد جميع الاحتمالات واحداً تلو الآخر. ستساعدك الطباعة في وحدة التحكم (Logging)، و Postman، ومنقحات الأخطاء، والخبرة العملية.

عند حدوث أخطاء برمجية، فإن *أسوأ استراتيجية ممكنة* هي الاستمرار في كتابة الشيفرة البرمجية. سيضمن ذلك أن كودك سيحتوي قريباً على المزيد من الأخطاء، وسيكون تصحيحها أكثر صعوبة. إن مبدأ [Jidoka](https://leanscape.io/principles-of-lean-13-jidoka/) (توقف وأصلح الخلل فوراً) من أنظمة إنتاج تويوتا فعال للغاية في هذا الموقف أيضاً.

### قاعدة بيانات MongoDB

لتخزين ملاحظاتنا المحفوظة بشكل دائم، نحتاج إلى قاعدة بيانات. تستخدم معظم الدورات التي يتم تدريسها في جامعة هلسنكي قواعد البيانات العلائقية (Relational databases). في معظم أجزاء هذه الدورة، سنستخدم [MongoDB](https://www.mongodb.com/) وهي [قاعدة بيانات وثائقية (Document database)](https://en.wikipedia.org/wiki/Document-oriented_database).

السبب وراء استخدام Mongo كقاعدة بيانات هو تعقيدها الأقل مقارنة بقاعدة البيانات العلائقية. يوضح [الجزء 13](/ar/part13) من الدورة كيفية بناء واجهات خلفية بـ Node.js تستخدم قاعدة بيانات علائقية.

تختلف قواعد البيانات الوثائقية عن قواعد البيانات العلائقية في كيفية تنظيم البيانات وكذلك في لغات الاستعلام التي تدعمها. يتم تصنيف قواعد البيانات الوثائقية عادةً تحت المصطلح المظلي [NoSQL](https://en.wikipedia.org/wiki/NoSQL).

يمكنك قراءة المزيد حول قواعد البيانات الوثائقية و NoSQL من مواد الدورة التدريبية لـ [الأسبوع 7](https://tikape-s18.mooc.fi/part7/) من دورة مقدمة في قواعد البيانات. لسوء الحظ، فإن المادة متاحة حالياً باللغة الفنلندية فقط.

اقرأ الآن الفصول الخاصة بـ [المجموعات (Collections)](https://docs.mongodb.com/manual/core/databases-and-collections/) و [الوثائق (Documents)](https://docs.mongodb.com/manual/core/document/) من دليل MongoDB للحصول على فكرة أساسية عن كيفية قيام قاعدة البيانات الوثائقية بتخزين البيانات.

بطبيعة الحال، يمكنك تثبيت وتشغيل MongoDB على جهاز الكمبيوتر الخاص بك. ومع ذلك، فإن الإنترنت مليء أيضاً بخدمات قواعد بيانات Mongo السحابية التي يمكنك استخدامها. سيكون موفر MongoDB المفضل لدينا في هذه الدورة هو [MongoDB Atlas](https://www.mongodb.com/atlas/database).

بمجرد إنشاء حسابك وتسجيل الدخول إليه، دعنا ننشئ عنقوداً (Cluster) جديداً باستخدام الزر المرئي في الصفحة الأولى. من العرض الذي يفتح، حدد الخطة المجانية، وحدد المزود السحابي ومركز البيانات، وأنشئ العنقود:

![mongodb picking shared, aws and region](../../images/3/mongo2.png)

المزود المحدد هو <i>AWS</i> والمنطقة هي <i>Stockholm (eu-north-1)</i>. لاحظ أنه إذا اخترت شيئاً آخر، فسيكون نص الاتصال بقاعدة البيانات الخاص بك مختلفاً قليلاً عن هذا المثال. انتظر حتى يصبح العنقود جاهزاً، الأمر الذي سيستغرق بضع دقائق.

**ملاحظة:** لا تتابع قبل أن يصبح العنقود جاهزاً.

دعنا نستخدم تبويب *الأمان (Security)* لإنشاء بيانات اعتماد المستخدم لقاعدة البيانات. يرجى ملاحظة أن هذه ليست نفس بيانات الاعتماد التي تستخدمها لتسجيل الدخول إلى MongoDB Atlas. سيتم استخدام هذه لربط تطبيقك بقاعدة البيانات.

![mongodb security quickstart](../../images/3/mongo3.png)

بعد ذلك، يتعين علينا تحديد عناوين IP المسموح لها بالوصول إلى قاعدة البيانات. من أجل البساطة، سنسمح بالوصول من جميع عناوين IP:

![mongodb network access/add ip access list](../../images/3/mongo4.png)

ملاحظة: في حالة اختلاف القائمة المنبثقة بالنسبة لك، وفقاً لوثائق MongoDB، فإن إضافة 0.0.0.0 كعنوان IP يسمح بالوصول من أي مكان أيضاً.

أخيراً، نحن جاهزون للاتصال بقاعدة بياناتنا. للقيام بذلك، نحتاج إلى نص الاتصال بقاعدة البيانات (Connection string)، والذي يمكن العثور عليه عن طريق تحديد <i>Connect</i> ثم <i>Drivers</i> من طريقة العرض، ضمن قسم <i>Connect to your application</i>:

![mongodb database deployment connect](../../images/3/mongo5.png)

يعرض العرض <i>MongoDB URI</i>، وهو عنوان قاعدة البيانات الذي سنوفره لمكتبة عميل MongoDB التي سنضيفها إلى تطبيقنا:

![mongodb connect application](../../images/3/mongo6new.png)

يبدو العنوان هكذا:

```js
mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

نحن الآن جاهزون لاستخدام قاعدة البيانات.

يمكننا استخدام قاعدة البيانات مباشرة من شيفرة جافاسكريبت الخاصة بنا باستخدام مكتبة [محرك MongoDB الرسمي لـ Node.js](https://mongodb.github.io/node-mongodb-native/)، ولكن استخدامها مرهق للغاية. سنستخدم بدلاً من ذلك مكتبة [Mongoose](http://mongoosejs.com/index.html) التي توفر واجهة برمجة تطبيقات ذات مستوى أعلى.

يمكن وصف Mongoose بأنها *مخطط وثائق الكائنات (Object Document Mapper - ODM)*، ويعد حفظ كائنات جافاسكريبت كوثائق في Mongo أمراً بسيطاً ومباشراً باستخدام هذه المكتبة.

دعنا نثبت Mongoose في الواجهة الخلفية لمشروع الملاحظات:

```bash
npm install mongoose
```

دعنا لا نضيف أي كود يتعامل مع Mongo إلى واجهتنا الخلفية حتى الآن. بدلاً من ذلك، دعنا ننشئ تطبيقاً تدريبياً عن طريق إنشاء ملف جديد باسم <i>mongo.js</i> في جذر تطبيق الواجهة الخلفية للملاحظات:

```js
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

**ملاحظة:** اعتماداً على المنطقة التي حددتها عند إنشاء العنقود، قد يختلف <i>MongoDB URI</i> عن المثال الموضح أعلاه. يجب عليك التحقق من واستخدام URI الصحيح الذي تم إنشاؤه من MongoDB Atlas.

يتم إنشاء الاتصال بقاعدة البيانات باستخدام الأمر:

```js
mongoose.connect(url, { family: 4 })
```

يأخذ التابع عنوان URL لقاعدة البيانات كمعامل أول وكائناً يحدد الإعدادات المطلوبة كمعامل ثانٍ. يدعم MongoDB Atlas عناوين IPv4 فقط، لذلك مع الكائن _{ family: 4 }_ نحدد أن الاتصال يجب أن يستخدم دائماً IPv4.

يفترض التطبيق التدريبي أنه سيتم تمرير كلمة المرور من بيانات الاعتماد التي أنشأناها في MongoDB Atlas، كمعامل سطر أوامر (Command-line parameter). يمكننا الوصول إلى معامل سطر الأوامر هكذا:

```js
const password = process.argv[2]
```

عند تشغيل الشيفرة باستخدام الأمر <i>node mongo.js yourPassword</i>، ستضيف Mongo وثيقة جديدة إلى قاعدة البيانات.

**ملاحظة:** يرجى ملاحظة أن كلمة المرور هي كلمة المرور التي تم إنشاؤها لمستخدم قاعدة البيانات، وليست كلمة مرور حساب MongoDB Atlas الخاص بك. أيضاً، إذا أنشأت كلمة مرور تحتوي على أحرف خاصة، فستحتاج إلى [ترميز كلمة المرور للرابط (URL encode)](https://docs.atlas.mongodb.com/troubleshoot-connection/#special-characters-in-connection-string-password).

يمكننا عرض الحالة الحالية لقاعدة البيانات من MongoDB Atlas من <i>Browse collections</i>، في تبويب Database.

![mongodb databases browse collections button](../../images/3/mongo7.png)

كما تنص طريقة العرض، تمت إضافة *الوثيقة (Document)* المطابقة للملاحظة إلى مجموعة (Collection) <i>notes</i> في قاعدة البيانات <i>myFirstDatabase</i>.

![mongodb collections tab db myfirst app notes](../../images/3/mongo8new.png)

دعنا نحذف قاعدة البيانات الافتراضية <i>test</i> ونغير اسم قاعدة البيانات المشار إليها في نص الاتصال الخاص بنا إلى <i>noteApp</i> بدلاً من ذلك، عن طريق تعديل الـ URI:

```js
const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
```

دعنا نشغل كودنا مرة أخرى:

![mongodb collections tab noteApp notes](../../images/3/mongo9.png)

يتم تخزين البيانات الآن في قاعدة البيانات الصحيحة. توفر طريقة العرض أيضاً وظيفة <i>create database</i>، والتي يمكن استخدامها لإنشاء قواعد بيانات جديدة من موقع الويب. لا يُعد إنشاء قاعدة بيانات بهذه الطريقة أمراً ضرورياً، نظراً لأن MongoDB Atlas ينشئ قاعدة بيانات جديدة تلقائياً عندما يحاول أحد التطبيقات الاتصال بقاعدة بيانات غير موجودة بعد.

### المخطط (Schema)

بعد إنشاء الاتصال بقاعدة البيانات، نحدد [المخطط (Schema)](https://mongoosejs.com/docs/guide.html#schemas) للملاحظة و [النموذج (Model)](https://mongoosejs.com/docs/models.html) المطابق:

```js
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

أولاً، نحدد [المخطط (Schema)](https://mongoosejs.com/docs/guide.html#schemas) للملاحظة المخزنة في المتغير _noteSchema_. يخبر المخطط مكتبة Mongoose بكيفية تخزين كائنات الملاحظات في قاعدة البيانات.

في تعريف نموذج _Note_، يكون المعامل الأول <i>"Note"</i> هو الاسم المفرد للنموذج. سيكون اسم المجموعة هو صيغة الجمع بأحرف صغيرة <i>notes</i>، لأن [اصطلاح Mongoose](https://mongoosejs.com/docs/models.html#compiling) هو تسمية المجموعات تلقائياً بصيغة الجمع (مثل <i>notes</i>) عندما يشير إليها المخطط بصيغة المفرد (مثل <i>Note</i>).

تُعد قواعد البيانات الوثائقية مثل Mongo *عديمة المخطط (Schemaless)*، مما يعني أن قاعدة البيانات نفسها لا تهتم ببنية البيانات المخزنة فيها. من الممكن تخزين وثائق ذات حقول مختلفة تماماً في نفس المجموعة.

تكمن الفكرة وراء Mongoose في أن البيانات المخزنة في قاعدة البيانات تُمنح *مخططاً على مستوى التطبيق (Schema at the application level)* يحدد شكل الوثائق المخزنة في أي مجموعة محددة.

### إنشاء وحفظ الكائنات (Creating and saving objects)

بعد ذلك، ينشئ التطبيق كائن ملاحظة جديداً بمساعدة [نموذج (Model)](https://mongoosejs.com/docs/models.html) <i>Note</i>:

```js
const note = new Note({
  content: 'HTML is Easy',
  important: false,
})
```

النماذج هي *دوال بناء (Constructor functions)* تنشئ كائنات جافاسكريبت جديدة بناءً على المعاملات المقدمة. نظراً لأن الكائنات يتم إنشاؤها باستخدام دالة بناء النموذج، فإنها تمتلك جميع خصائص النموذج، والتي تتضمن توابع لحفظ الكائن في قاعدة البيانات.

يتم حفظ الكائن في قاعدة البيانات باستخدام التابع المسمى بشكل ملائم _save_، والذي يمكن تزويده بمعالج أحداث باستخدام التابع _then_:

```js
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```

عند حفظ الكائن في قاعدة البيانات، يتم استدعاء معالج الأحداث المقدم إلى _then_. يغلق معالج الأحداث اتصال قاعدة البيانات بالأمر <code>mongoose.connection.close()</code>. إذا لم يتم إغلاق الاتصال، فسيظل الاتصال مفتوحاً حتى ينتهي البرنامج.

تكون نتيجة عملية الحفظ في المعامل _result_ لمعالج الأحداث. النتيجة ليست مثيرة للاهتمام عندما نقوم بتخزين كائن واحد في قاعدة البيانات. يمكنك طباعة الكائن في وحدة التحكم إذا كنت تريد إلقاء نظرة فاحصة عليه أثناء تنفيذ تطبيقك أو أثناء تصحيح الأخطاء.

دعنا أيضاً نحفظ بضع ملاحظات أخرى عن طريق تعديل البيانات في الشيفرة وتنفيذ البرنامج مرة أخرى.

**ملاحظة:** لسوء الحظ، فإن توثيق Mongoose غير متسق للغاية، حيث تستخدم أجزاء منه عمليات رد النداء (Callbacks) في أمثلتها وأجزاء أخرى تستخدم أساليب أخرى، لذلك لا يوصى بنسخ الشيفرات ولصقها مباشرة من هناك. خلط الوعود (Promises) مع ردود النداء القديمة في نفس الكود غير موصى به.

### جلب الكائنات من قاعدة البيانات (Fetching objects from the database)

دعنا نضع كود إنشاء الملاحظات الجديدة كتعليق ونستبدله بما يلي:

```js
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```

عند تنفيذ الكود، يطبع البرنامج جميع الملاحظات المخزنة في قاعدة البيانات:

![node mongo.js outputs notes as JSON](../../images/3/70new.png)

يتم استرداد الكائنات من قاعدة البيانات باستخدام التابع [find](https://mongoosejs.com/docs/api/model.html#model_Model-find) لنموذج _Note_. معامل التابع هو كائن يعبر عن شروط البحث. نظراً لأن المعامل عبارة عن كائن فارغ <code>{}</code>، فإننا نحصل على جميع الملاحظات المخزنة في مجموعة <i>notes</i>.

تلتزم شروط البحث بـ [صيغة بناء](https://www.mongodb.com/docs/manual/tutorial/query-documents/) استعلام البحث في Mongo.

يمكننا تقييد بحثنا ليشمل الملاحظات المهمة فقط هكذا:

```js
Note.find({ important: true }).then(result => {
  // ...
})
```

</div>

<div class="tasks">

### تمرين 3.12.

#### 3.12: قاعدة بيانات سطر الأوامر

أنشئ قاعدة بيانات MongoDB سحابية لتطبيق دليل الهاتف باستخدام MongoDB Atlas.

أنشئ ملف <i>mongo.js</i> في مجلد المشروع، والذي يمكن استخدامه لإضافة مدخلات إلى دليل الهاتف، ولسرد جميع المدخلات الموجودة في دليل الهاتف.

**ملاحظة:** لا تقم بتضمين كلمة المرور في الملف الذي تقوم بإيداعه ودفعه إلى GitHub!

يجب أن يعمل التطبيق على النحو التالي. يمكنك استخدام البرنامج عن طريق تمرير ثلاث وسائط في سطر الأوامر (الأول هو كلمة المرور)، على سبيل المثال:

```bash
node mongo.js yourpassword Anna 040-1234556
```

ونتيجة لذلك، سيطبع التطبيق:

```bash
added Anna number 040-1234556 to phonebook
```

سيتم حفظ الإدخال الجديد في دليل الهاتف في قاعدة البيانات. لاحظ أنه إذا كان الاسم يحتوي على مسافات، فيجب إحاطته بعلامات اقتباس:

```bash
node mongo.js yourpassword "Arto Vihavainen" 045-1232456
```

إذا كانت كلمة المرور هي المعامل الوحيد المعطى للبرنامج، مما يعني أنه تم استدعاؤه هكذا:

```bash
node mongo.js yourpassword
```

يجب أن يعرض البرنامج بعد ذلك جميع الإدخالات الموجودة في دليل الهاتف:

```
phonebook:
Anna 040-1234556
Arto Vihavainen 045-1232456
Ada Lovelace 040-1231236
```

يمكنك الحصول على معاملات سطر الأوامر من متغير [process.argv](https://nodejs.org/docs/latest-v18.x/api/process.html#process_process_argv).

**ملاحظة: لا تغلق الاتصال في المكان الخطأ**. على سبيل المثال، الكود التالي لن يعمل:

```js
Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()
```

في الكود أعلاه، سيتم تنفيذ الأمر <i>mongoose.connection.close()</i> مباشرة بعد بدء عملية <i>Person.find</i>. هذا يعني أنه سيتم إغلاق اتصال قاعدة البيانات على الفور، ولن يصل التنفيذ أبداً إلى النقطة التي تنتهي فيها عملية <i>Person.find</i> ويتم فيها استدعاء دالة *رد النداء (Callback)*.

المكان الصحيح لإغلاق اتصال قاعدة البيانات هو في نهاية دالة رد النداء:

```js
Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })
```

**ملاحظة:** إذا حددت نموذجاً بالاسم <i>Person</i>، فستقوم mongoose تلقائياً بتسمية المجموعة المرتبطة به بصيغة الجمع <i>people</i>.

</div>

<div class="content">

### ربط الواجهة الخلفية بقاعدة البيانات (Connecting the backend to a database)

لدينا الآن المعرفة الكافية لبدء استخدام Mongo في الواجهة الخلفية لتطبيق الملاحظات الخاص بنا.

دعنا نحصل على بداية سريعة عن طريق نسخ ولصق تعريفات Mongoose في ملف <i>index.js</i>:

```js
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

دعنا نغير معالج جلب جميع الملاحظات إلى الشكل التالي:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

دعنا نشغل الواجهة الخلفية بالأمر <code>node --watch index.js yourpassword</code> حتى نتمكن من التحقق في المتصفح من أن الواجهة الخلفية تعرض بشكل صحيح جميع الملاحظات المحفوظة في قاعدة البيانات:

![api/notes in browser shows notes in JSON](../../images/3/44ea.png)

يعمل التطبيق بشكل شبه مثالي. تفترض الواجهة الأمامية أن كل كائن له معرف فريد في حقل <i>id</i>. ولا نريد أيضاً إرجاع حقل إصدار mongo المسمى <i>\_\_v</i> إلى الواجهة الأمامية.

تتمثل إحدى طرق تنسيق الكائنات التي ترجعها Mongoose في [تعديل](https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id) التابع _toJSON_ للمخطط، والذي يُستخدم في جميع نسخ النماذج التي تم إنشاؤها باستخدام هذا المخطط. يمكن إجراء التعديل على النحو التالي:

```js
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```

على الرغم من أن خاصية <i>\_id</i> لكائنات Mongoose تبدو كنص، إلا أنها في الواقع عبارة عن كائن. يقوم التابع _toJSON_ الذي حددناه بتحويله إلى نص فقط لنكون بأمان. إذا لم نقم بهذا التغيير، فسيتسبب ذلك في المزيد من الضرر لنا في المستقبل بمجرد أن نبدأ في كتابة الاختبارات.

لا يلزم إجراء أي تغييرات في المعالج:

```js
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
```

تستخدم الشيفرة تلقائياً _toJSON_ المحدد عند تنسيق الملاحظات إلى الاستجابة.

### نقل إعدادات قاعدة البيانات إلى وحدة نمطية خاصة بها

قبل أن نعيد هيكلة بقية الواجهة الخلفية لاستخدام قاعدة البيانات، دعنا نستخرج الشيفرة الخاصة بـ Mongoose في وحدة نمطية (Module) خاصة بها.

دعنا ننشئ مجلداً جديداً للوحدة يسمى <i>models</i>، ونضيف ملفاً يسمى <i>note.js</i>:

```js
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI // highlight-line

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
// highlight-start
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
// highlight-end

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema) // highlight-line
```

هناك بعض التغييرات في الشيفرة مقارنة بما كان عليه الحال سابقاً. يتم الآن تمرير عنوان URL للاتصال بقاعدة البيانات إلى التطبيق عبر متغير البيئة MONGODB_URI، حيث إن كتابته مباشرة وثابتة في التطبيق ليست فكرة جيدة:

```js
const url = process.env.MONGODB_URI
```

هناك طرق عديدة لتحديد قيمة متغير البيئة. على سبيل المثال، يمكننا تحديده عند بدء تشغيل التطبيق على النحو التالي:

```bash
MONGODB_URI="your_connection_string_here" npm run dev
```

سنتعلم قريباً طريقة أكثر تطوراً لتحديد متغيرات البيئة.

لقد تغيرت طريقة إجراء الاتصال قليلاً:

```js
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
```

يتم الآن إعطاء دالة إنشاء الاتصال دوالاً للتعامل مع محاولة الاتصال الناجحة وغير الناجحة. تقوم كلتا الدالتين فقط بتسجيل رسالة في وحدة التحكم حول حالة النجاح أو الفشل:

![node output when wrong username/password](../../images/3/45e.png)

يختلف تعريف [وحدات Node النمطية (Node modules)](https://nodejs.org/docs/latest-v18.x/api/modules.html) قليلاً عن طريقة تعريف [وحدات ES6 النمطية](/ar/part2/rendering_a_collection_modules#refactoring-modules) في الجزء الثاني.

يتم تعريف الواجهة العامة (Public interface) للوحدة النمطية عن طريق تعيين قيمة للمتغير _module.exports_. سنقوم بتعيين القيمة لتكون نموذج <i>Note</i>. أما الأشياء الأخرى المحددة داخل الوحدة، مثل المتغيرين _mongoose_ و _url_، فلن تكون قابلة للوصول أو مرئية لمستخدمي الوحدة النمطية.

يتم استيراد الوحدة بإضافة السطر التالي إلى <i>index.js</i>:

```js
const Note = require('./models/note')
```

بهذه الطريقة سيتم إسناد المتغير _Note_ إلى نفس الكائن الذي تحدده الوحدة النمطية.

### تحديد متغيرات البيئة باستخدام مكتبة dotenv

تتمثل الطريقة الأكثر تطوراً لتحديد متغيرات البيئة في استخدام مكتبة [dotenv](https://github.com/motdotla/dotenv#readme). يمكنك تثبيت المكتبة بالأمر:

```bash
npm install dotenv
```

لاستخدام المكتبة، ننشئ ملف <i>.env</i> في جذر المشروع. يتم تعريف متغيرات البيئة داخل الملف، ويمكن أن تبدو هكذا:

```bash
MONGODB_URI=mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
```

أضفنا أيضاً المنفذ المحدد للخادم في متغير البيئة <em>PORT</em>.

**يجب إضافة ملف <i>.env</i> إلى gitignore على الفور لأننا لا نريد نشر أي معلومات سرية أو حساسة علناً على الإنترنت!**

![.gitignore in vscode with .env line added](../../images/3/45ae.png)

يمكن استخدام متغيرات البيئة المحددة في ملف <i>.env</i> مع التعبير <em>require('dotenv').config()</em> ويمكنك الرجوع إليها في الشيفرة الخاصة بك تماماً كما تشير إلى متغيرات البيئة العادية، باستخدام صيغة <em>process.env.MONGODB_URI</em>.

دعنا نحمل متغيرات البيئة في بداية ملف index.js بحيث تكون متاحة في جميع أنحاء التطبيق بأكمله. دعنا نعدل ملف <i>index.js</i> بالطريقة التالية:

```js
require('dotenv').config() // highlight-line
const express = require('express')
const Note = require('./models/note') // highlight-line

const app = express()
// ..

const PORT = process.env.PORT // highlight-line
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

من المهم استيراد <i>dotenv</i> قبل استيراد نموذج <i>note</i>. يضمن هذا توفر متغيرات البيئة من ملف <i>.env</i> عالمياً قبل استيراد الشيفرة من الوحدات النمطية الأخرى.

#### ملاحظة مهمة حول تحديد متغيرات البيئة في Fly.io و Render

**مستخدمو Fly.io:** نظراً لعدم استخدام GitHub مع Fly.io، فإن الملف .env يصل أيضاً إلى خوادم Fly.io عند نشر التطبيق. وبسبب هذا، ستكون متغيرات البيئة المحددة في الملف متاحة هناك.

ومع ذلك، فإن [الخيار الأفضل](https://community.fly.io/t/clarification-on-environment-variables/6309) هو منع نسخ .env إلى Fly.io عن طريق إنشاء ملف _.dockerignore_ في جذر المشروع، مع المحتويات التالية:

```bash
.env
```

وتعيين قيمة متغير البيئة من سطر الأوامر بالأمر:

```bash
fly secrets set MONGODB_URI="mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0"
```

**مستخدمو Render:** عند استخدام Render، يتم توفير عنوان url لقاعدة البيانات عن طريق تحديد متغير البيئة المناسب في لوحة التحكم (Dashboard):

![browser showing render environment variables](../../images/3/render-env.png)

قم بتعيين عنوان URL الذي يبدأ بـ <i>...mongodb+srv://</i> فقط في حقل _value_.

### استخدام قاعدة البيانات في معالجات المسارات (Using database in route handlers)

بعد ذلك، دعنا نغير بقية وظائف الواجهة الخلفية لاستخدام قاعدة البيانات.

يتم إنشاء ملاحظة جديدة على النحو التالي:

```js
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
```

يتم إنشاء كائنات الملاحظة باستخدام دالة بناء _Note_. يتم إرسال الاستجابة داخل دالة رد النداء لعملية _save_. يضمن هذا إرسال الاستجابة فقط في حالة نجاح العملية. سنناقش معالجة الأخطاء بعد قليل.

المعامل _savedNote_ في دالة رد النداء هو الملاحظة المحفوظة والمُنشأة حديثاً. البيانات المرسلة مرة أخرى في الاستجابة هي النسخة المنسقة التي تم إنشاؤها تلقائياً باستخدام التابع _toJSON_:

```js
response.json(savedNote)
```

باستخدام التابع [findById](https://mongoosejs.com/docs/api/model.html#model_Model-findById) في Mongoose، يتغير جلب ملاحظة فردية إلى ما يلي:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
```

### التحقق من تكامل الواجهة الأمامية والخلفية

عند توسيع الواجهة الخلفية، من الجيد اختبار الواجهة الخلفية أولاً باستخدام **المتصفح أو Postman أو عميل REST في VS Code**. بعد ذلك، دعنا نجرب إنشاء ملاحظة جديدة بعد استخدام قاعدة البيانات:

![VS code rest client doing a post](../../images/3/46new.png)

فقط بمجرد التحقق من أن كل شيء يعمل في الواجهة الخلفية، تكون فكرة جيدة اختبار أن الواجهة الأمامية تعمل مع الواجهة الخلفية. من غير الفعال إطلاقاً اختبار الأشياء حصرياً من خلال الواجهة الأمامية.

من الجيد على الأرجح دمج الواجهة الأمامية والواجهة الخلفية وظيفة واحدة في كل مرة. أولاً، يمكننا تنفيذ جلب جميع الملاحظات من قاعدة البيانات واختبارها من خلال نقطة نهاية الواجهة الخلفية في المتصفح. بعد ذلك، يمكننا التحقق من أن الواجهة الأمامية تعمل مع الواجهة الخلفية الجديدة. وبمجرد أن يبدو أن كل شيء يعمل، سننتقل إلى الميزة التالية.

بمجرد إدخال قاعدة بيانات في التطبيق، من المفيد فحص الحالة المحفوظة في قاعدة البيانات، على سبيل المثال من لوحة التحكم في MongoDB Atlas. وفي كثير من الأحيان، يمكن أن تكون برامج المساعدة الصغيرة في Node مثل برنامج <i>mongo.js</i> الذي كتبناه سابقاً مفيدة جداً أثناء التطوير.

يمكنك العثور على شيفرة تطبيقنا الحالي بالكامل في الفرع <i>part3-4</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-4).

### قسم المطور الشامل الحقيقي (A true full stack developer's oath)

حان الوقت مرة أخرى للتمارين. لقد اتخذ تعقيد تطبيقنا الآن خطوة أخرى حيث أصبح لدينا قاعدة بيانات بالإضافة إلى الواجهة الأمامية والخلفية.
هناك بالفعل العديد من المصادر المحتملة للخطأ.

لذا يجب علينا مرة أخرى تمديد قسمنا:

تطوير الويب الشامل (Full stack development) *صعب للغاية*، ولهذا السبب سأستخدم جميع الوسائل الممكنة لجعله أسهل

- سأبقي وحدة تحكم مطور المتصفح مفتوحة طوال الوقت
- سأستخدم تبويب الشبكة (Network) في أدوات مطور المتصفح للتأكد من أن الواجهة الأمامية والخلفية تتواصلان كما أتوقع
- سأراقب باستمرار حالة الخادم للتأكد من حفظ البيانات المرسلة إليه من الواجهة الأمامية كما أتوقع
- *سأراقب قاعدة البيانات؛ وما إذا كانت البيانات محفوظة بالحالة المتوقعة*
- سأتقدم بخطوات صغيرة وتدريجية
- سأكتب الكثير من عبارات _console.log_ للتأكد من أنني أفهم كيف يتصرف الكود وللمساعدة في تحديد المشاكل بدقة
- إذا لم يعمل الكود الخاص بي، فلن أكتب المزيد من الكود. بدلاً من ذلك، سأبدأ في حذف الكود حتى يعمل أو أعود فقط إلى الحالة التي كان فيها كل شيء لا يزال يعمل
- عندما أطلب المساعدة في قناة الدورة على Discord أو في أي مكان آخر، سأصيغ أسئلتي بشكل صحيح، انظر [هنا](/ar/part0/general_info#how-to-get-help-in-discord) لمعرفة كيفية طلب المساعدة

</div>

<div class="tasks">

### تمارين 3.13.-3.14.

التمارين التالية مباشرة وبسيطة، ولكن إذا توقفت واجهتك الأمامية عن العمل مع الواجهة الخلفية، فإن العثور على الأخطاء وإصلاحها قد يكون أمراً ممتعاً ومثيراً للاهتمام.

#### 3.13: قاعدة بيانات دليل الهاتف، الخطوة 1

قم بتغيير عملية جلب جميع مدخلات دليل الهاتف بحيث يتم *جلب البيانات من قاعدة البيانات*.

تحقق من أن الواجهة الأمامية تعمل بعد إجراء التغييرات.

في التمارين التالية، اكتب جميع الأكواد الخاصة بـ Mongoose في وحدة نمطية خاصة بها، تماماً كما فعلنا في فصل [نقل إعدادات قاعدة البيانات إلى وحدة نمطية خاصة بها](/ar/part3/saving_data_to_mongo_db#moving-db-configuration-to-its-own-module).

#### 3.14: قاعدة بيانات دليل الهاتف، الخطوة 2

قم بتغيير الواجهة الخلفية بحيث يتم *حفظ الأرقام الجديدة في قاعدة البيانات*. تحقق من أن واجهتك الأمامية لا تزال تعمل بعد التغييرات.

في هذه المرحلة، يمكنك تجاهل ما إذا كان هناك بالفعل شخص في قاعدة البيانات يحمل نفس اسم الشخص الذي تضيفه.

</div>

<div class="content">

### معالجة الأخطاء (Error handling)

إذا حاولنا زيارة عنوان URL لملاحظة ذات معرف غير موجود، على سبيل المثال <http://localhost:3001/api/notes/5c41c90e84d891c15dfa3431> حيث <i>5c41c90e84d891c15dfa3431</i> ليس معرفاً مخزناً في قاعدة البيانات، فستكون الاستجابة _null_.

دعنا نغير هذا السلوك بحيث إذا لم تكن هناك ملاحظة بالمعرف المحدد، فسيستجيب الخادم للطلب برمز حالة HTTP 404 not found. بالإضافة إلى ذلك، دعنا ننفذ كتلة <em>catch</em> بسيطة للتعامل مع الحالات التي يتم فيها *رفض (Rejected)* الوعد (Promise) الذي يرجعه التابع <em>findById</em>:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      // highlight-start
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
      // highlight-end
    })
    // highlight-start
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
    // highlight-end
})
```

إذا لم يتم العثور على كائن مطابق في قاعدة البيانات، فستكون قيمة _note_ هي _null_ وسيتم تنفيذ كتلة _else_. ينتج عن هذا استجابة برمز الحالة <i>404 not found</i>. وإذا تم رفض الوعد الذي يرجعه التابع <em>findById</em>، فستكون للاستجابة رمز الحالة <i>500 internal server error</i>. تعرض وحدة التحكم معلومات أكثر تفصيلاً حول الخطأ.

بالإضافة إلى الملاحظة غير الموجودة، هناك موقف خطأ آخر يحتاج إلى معالجة. في هذه الحالة، نحاول جلب ملاحظة بنوع خاطئ من _id_، أي _id_ لا يطابق تنسيق معرف Mongo (Mongo ObjectId).

إذا أجرينا الطلب التالي، فسنحصل على رسالة الخطأ الموضحة أدناه:

```
Method: GET
Path:   /api/notes/someInvalidId
Body:   {}
---
{ CastError: Cast to ObjectId failed for value "someInvalidId" at path "_id"
    at CastError (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/error/cast.js:27:11)
    at ObjectId.cast (/Users/mluukkai/opetus/_fullstack/osa3-muisiinpanot/node_modules/mongoose/lib/schema/objectid.js:158:13)
    ...
```

عند إعطاء معرف مشوه كمعامل، سيطلق التابع <em>findById</em> خطأً يؤدي إلى رفض الوعد المرتجع. سيؤدي هذا إلى استدعاء دالة رد النداء المحددة في كتلة <em>catch</em>.

دعنا نجري بعض التعديلات الصغيرة على الاستجابة في كتلة <em>catch</em>:

```js
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) // highlight-line
    })
})
```

إذا كان تنسيق المعرف غير صحيح، فسننتهي في معالج الأخطاء المحدد في كتلة _catch_. رمز الحالة المناسب لهذا الموقف هو [400 Bad Request](https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request) لأن الموقف يناسب الوصف تماماً:

> *يشير رمز الحالة 400 (Bad Request) إلى أن الخادم لا يستطيع معالجة الطلب أو لن يعالجه بسبب شيء يُنظر إليه على أنه خطأ من جانب العميل (على سبيل المثال، بناء جملة طلب مشوه، أو تأطير رسالة طلب غير صالح، أو توجيه طلب خادع).*

لقد أضفنا أيضاً بعض البيانات إلى الاستجابة لإلقاء بعض الضوء على سبب الخطأ.

عند التعامل مع الوعود (Promises)، من الجيد دائماً تقريباً إضافة معالجة الأخطاء والاستثناءات. وإلا، ستجد نفسك تتعامل مع أخطاء غريبة وغير متوقعة.

ليس من السيئ أبداً طباعة الكائن الذي تسبب في الاستثناء إلى وحدة التحكم في معالج الأخطاء:

```js
.catch(error => {
  console.log(error)  // highlight-line
  response.status(400).send({ error: 'malformatted id' })
})
```

قد يكون سبب استدعاء معالج الأخطاء شيئاً مختلفاً تماماً عما كنت تتوقعه. إذا قمت بتسجيل الخطأ في وحدة التحكم، فقد تنقذ نفسك من جلسات تصحيح أخطاء طويلة ومحبطة. علاوة على ذلك، فإن معظم الخدمات الحديثة التي تنشر تطبيقك عليها تدعم نوعاً من أنظمة تسجيل السجلات (Logging system) التي يمكنك استخدامها للتحقق من هذه السجلات. كما ذكرنا، تعد Fly.io إحداها.

في كل مرة تعمل فيها على مشروع به واجهة خلفية، *من الضروري جداً مراقبة مخرجات وحدة التحكم للواجهة الخلفية*. إذا كنت تعمل على شاشة صغيرة، فيكفي فقط رؤية جزء صغير من المخرجات في الخلفية. ستلفت أي رسائل خطأ انتباهك حتى عندما تكون وحدة التحكم في أقصى الخلفية:

![sample screenshot showing tiny slice of output](../../images/3/15b.png)

### نقل معالجة الأخطاء إلى برمجية وسيطة (Moving error handling into middleware)

لقد كتبنا كود معالج الأخطاء وسط بقية أكوادنا البرمجية. يمكن أن يكون هذا حلاً معقولاً في بعض الأحيان، ولكن هناك حالات يكون من الأفضل فيها تنفيذ جميع معالجة الأخطاء في مكان مركزي واحد. يمكن أن يكون هذا مفيداً بشكل خاص إذا أردنا الإبلاغ عن البيانات المتعلقة بالأخطاء إلى نظام خارجي لتتبع الأخطاء مثل [Sentry](https://sentry.io/welcome/) لاحقاً.

دعنا نغير معالج المسار <i>/api/notes/:id</i> بحيث يمرر الخطأ إلى الأمام باستخدام دالة <em>next</em>. يتم تمرير دالة next إلى المعالج كمعامل ثالث:

```js
app.get('/api/notes/:id', (request, response, next) => { // highlight-line
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // highlight-line
})
```

يتم إعطاء الخطأ الذي يتم تمريره إلى الأمام لدالة <em>next</em> كمعامل. إذا تم استدعاء <em>next</em> بدون وسيط، فسيتحرك التنفيذ ببساطة إلى المسار أو البرمجية الوسيطة التالية. أما إذا تم استدعاء دالة <em>next</em> مع وسيط، فسيستمر التنفيذ إلى *البرمجية الوسيطة لمعالجة الأخطاء (Error handler middleware)*.

تُعد [معالجات الأخطاء](https://expressjs.com/en/guide/error-handling.html) في Express عبارة عن برمجيات وسيطة يتم تعريفها باستخدام دالة تقبل *أربعة معاملات*. يبدو معالج الأخطاء الخاص بنا هكذا:

```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
```

يتحقق معالج الأخطاء مما إذا كان الخطأ عبارة عن استثناء <i>CastError</i>، وفي هذه الحالة نعلم أن الخطأ كان ناتجاً عن معرف كائن غير صالح لـ Mongo. في هذه الحالة، سيرسل معالج الأخطاء استجابة إلى المتصفح مع كائن الاستجابة الذي تم تمريره كمعامل. في جميع حالات الأخطاء الأخرى، يمرر الوسيط الخطأ إلى معالج الأخطاء الافتراضي في Express.

لاحظ أن البرمجية الوسيطة لمعالجة الأخطاء يجب أن تكون آخر برمجية وسيطة يتم تحميلها، كما يجب تسجيل جميع المسارات قبل معالج الأخطاء!

### ترتيب تحميل البرمجيات الوسيطة (The order of middleware loading)

ترتيب تنفيذ البرمجيات الوسيطة هو نفس الترتيب الذي يتم تحميلها به في Express باستخدام دالة _app.use_. لهذا السبب، من المهم توخي الحذر عند تعريف البرمجيات الوسيطة.

الترتيب الصحيح هو التالي:

```js
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

app.post('/api/notes', (request, response) => {
  const body = request.body
  // ...
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  // ...
}

// handler of requests that result in errors
app.use(errorHandler)
```

يجب أن تكون البرمجية الوسيطة json-parser من بين أولى البرمجيات الوسيطة التي يتم تحميلها في Express. إذا كان الترتيب كالتالي:

```js
app.use(requestLogger) // request.body is undefined!

app.post('/api/notes', (request, response) => {
  // request.body is undefined!
  const body = request.body
  // ...
})

app.use(express.json())
```

فلن تكون بيانات JSON المرسلة مع طلبات HTTP متاحة لبرمجية التسجيل الوسيطة أو لمعالج مسار POST، لأن _request.body_ ستكون _undefined_ في تلك المرحلة.

من المهم أيضاً تحميل البرمجية الوسيطة لمعالجة المسارات غير المدعومة فقط بعد تحديد جميع نقاط النهاية، وقبل معالج الأخطاء مباشرة. على سبيل المثال، قد يتسبب ترتيب التحميل التالي في حدوث مشكلة:

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

app.get('/api/notes', (request, response) => {
  // ...
})
```

الآن تم ترتيب معالجة نقاط النهاية غير المعروفة *قبل معالج طلبات HTTP*. نظراً لأن معالج نقطة النهاية غير المعروفة يستجيب لجميع الطلبات بـ <i>404 unknown endpoint</i>، فلن يتم استدعاء أي مسارات أو برمجيات وسيطة بعد إرسال الاستجابة بواسطة برمجية المسارات غير المعروفة الوسيطة. الاستثناء الوحيد لذلك هو معالج الأخطاء الذي يجب أن يأتي في النهاية تماماً، بعد معالج نقاط النهاية غير المعروفة.

### العمليات الأخرى (Other operations)

دعنا نضيف بعض الوظائف المفقودة إلى تطبيقنا، بما في ذلك حذف وتحديث ملاحظة فردية.

أسهل طريقة لحذف ملاحظة من قاعدة البيانات هي باستخدام التابع [findByIdAndDelete](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()):

```js
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
```

في كلتا حالتي "النجاح" في حذف مورد، تستجيب الواجهة الخلفية برمز الحالة <i>204 no content</i>. الحالتان المختلفتان هما حذف ملاحظة موجودة، وحذف ملاحظة غير موجودة في قاعدة البيانات. يمكن استخدام معامل رد النداء _result_ للتحقق مما إذا كان المورد قد تم حذفه بالفعل، ويمكننا استخدام هذه المعلومات لإرجاع رموز حالة مختلفة للحالتين إذا رأينا ذلك ضرورياً. يتم تمرير أي استثناء يحدث إلى معالج الأخطاء.

دعنا ننفذ وظيفة تحديث ملاحظة واحدة، مما يسمح بتغيير أهمية الملاحظة. يتم تحديث الملاحظة على النحو التالي:

```js
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})
```

يتم جلب الملاحظة المراد تحديثها أولاً من قاعدة البيانات باستخدام التابع _findById_. إذا لم يتم العثور على كائن في قاعدة البيانات بالمعرف المحدد، فستكون قيمة المتغير _note_ هي _null_، ويستجيب الاستعلام برمز الحالة <i>404 Not Found</i>.

إذا تم العثور على كائن بالمعرف المحدد، فسيتم تحديث حقلي _content_ و _important_ بالبيانات المقدمة في الطلب، ويتم حفظ الملاحظة المعدلة في قاعدة البيانات باستخدام التابع _()save_. يستجيب طلب HTTP بإرسال الملاحظة المحدثة في الاستجابة.

إحدى النقاط البارزة هي أن الكود يحتوي الآن على وعود متداخلة (Nested promises)، مما يعني أنه داخل تابع _.then_ الخارجي، تم تحديد [سلسلة وعود (Promise chain)](https://javascript.info/promise-chaining) أخرى:

```js
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      // highlight-start
      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
      // highlight-end
```

عادةً لا يُنصح بهذا لأنه قد يجعل قراءة الشيفرة صعبة. ولكن في هذه الحالة، يعمل الحل لأنه يضمن عدم تنفيذ كتلة _.then_ التي تلي التابع _()save_ إلا إذا تم العثور على ملاحظة بالمعرف المحدد في قاعدة البيانات واستدعاء التابع _()save_. في الجزء الرابع من الدورة، سنستكشف صيغة async/await، والتي توفر طريقة أسهل وأوضح للتعامل مع مثل هذه المواقف.

توفر Mongoose أيضاً التابع [findByIdAndUpdate](https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate())، والذي يمكن استخدامه للبحث عن وثيقة بواسطة <i>id</i> وتحديثها باستدعاء تابع واحد. ومع ذلك، فإن هذا الأسلوب لا يناسب احتياجاتنا تماماً، لأننا سنحدد لاحقاً في هذا الجزء متطلبات معينة للبيانات المخزنة في قاعدة البيانات، و <i>findByIdAndUpdate</i> لا يدعم عمليات التحقق من الصحة (Validations) في Mongoose بشكل كامل افتراضياً. تشير [وثائق Mongoose](https://mongoosejs.com/docs/documents.html#updating-using-queries) أيضاً إلى أن التابع _()save_ هو بشكل عام الخيار الصحيح لتحديث وثيقة، لأنه يوفر تحققاً كاملاً من الصحة.

بعد اختبار الواجهة الخلفية مباشرة باستخدام Postman أو عميل REST في VS Code، يمكننا التحقق من أنها تعمل. كما يبدو أن الواجهة الأمامية تعمل أيضاً مع الواجهة الخلفية باستخدام قاعدة البيانات.

يمكنك العثور على شيفرة تطبيقنا الحالي بالكامل في الفرع <i>part3-5</i> من [مستودع GitHub هذا](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-5).

</div>

<div class="tasks">

### تمارين 3.15.-3.18.

#### 3.15: قاعدة بيانات دليل الهاتف، الخطوة 3

قم بتغيير الواجهة الخلفية بحيث تنعكس عملية حذف مدخلات دليل الهاتف في قاعدة البيانات.

تحقق من أن الواجهة الأمامية لا تزال تعمل بعد إجراء التغييرات.

#### 3.16: قاعدة بيانات دليل الهاتف، الخطوة 4

انقل معالجة الأخطاء في التطبيق إلى برمجية وسيطة جديدة لمعالجة الأخطاء (Error handler middleware).

#### 3.17*: قاعدة بيانات دليل الهاتف، الخطوة 5

إذا حاول المستخدم إنشاء إدخال جديد في دليل الهاتف لشخص موجود اسمه بالفعل في دليل الهاتف، فستحاول الواجهة الأمامية تحديث رقم هاتف الإدخال الحالي عن طريق إجراء طلب HTTP PUT إلى عنوان URL الفريد للإدخال.

قم بتعديل الواجهة الخلفية لدعم هذا الطلب.

تحقق من أن الواجهة الأمامية تعمل بعد إجراء التغييرات.

#### 3.18*: قاعدة بيانات دليل الهاتف، الخطوة 6

قم أيضاً بتحديث معالجة مسارات HTTP GET التالية <i>api/persons/:id</i> و <i>info</i> لاستخدام قاعدة البيانات، وتحقق من أنها تعمل مباشرة مع المتصفح أو Postman أو عميل REST في VS Code.

يجب أن يبدو فحص إدخال دليل هاتف فردي من المتصفح هكذا:

![screenshot of browser showing one person with api/persons/their_id](../../images/3/49.png)

</div>
