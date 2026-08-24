---
mainImage: ../../../images/part-0.svg
part: 0
letter: b
lang: ar
---

<div class="content">

قبل أن نبدأ البرمجة، سنستعرض بعض مبادئ تطوير الويب من خلال فحص تطبيق نموذجي على الرابط: <https://studies.cs.helsinki.fi/exampleapp>.

الهدف من وجود التطبيق هو فقط توضيح بعض المفاهيم الأساسية للدورة التدريبية، ولا يُعد بأي حال من الأحوال مثالاً على *كيفية* بناء تطبيقات الويب الحديثة. بل على العكس من ذلك، فهو يوضح بعض التقنيات القديمة لتطوير الويب، والتي يمكن اعتبارها في الوقت الحاضر *ممارسات سيئة (Bad Practices)*.

ستتوافق الشيفرات البرمجية مع أفضل الممارسات المعاصرة بدءاً من [الجزء الأول](/ar/part1) فصاعداً.

افتح [التطبيق النموذجي](https://studies.cs.helsinki.fi/exampleapp) في متصفحك. قد يستغرق هذا بعض الوقت أحياناً.

تم إعداد مادة الدورة التدريبية وتكييفها لمتصفح Chrome.

**القاعدة الأولى في تطوير الويب**: احتفظ دائماً بأدوات المطور (Developer Console) مفتوحة في متصفح الويب الخاص بك. على نظام macOS، افتح وحدة التحكم بالضغط على *fn*-*F12* أو *option-cmd-i* في وقت واحد. على نظام Windows أو Linux، افتح وحدة التحكم بالضغط على *Fn*-*F12* أو *ctrl-shift-i* في وقت واحد. يمكن أيضاً فتح وحدة التحكم عبر [قائمة السياق](https://en.wikipedia.org/wiki/Menu_key) (النقر بزر الفأرة الأيمن ثم فحص العنصر Inspect).

تذكر أن تبقي وحدة تحكم المطور مفتوحة *دائماً* عند تطوير تطبيقات الويب.

تبدو وحدة التحكم بهذا الشكل:

![لقطة شاشة لأدوات المطور مفتوحة في المتصفح](../../images/0/1e.png)

تأكد من فتح تبويب **الشبكة (Network)**، وحدد خيار **تعطيل الذاكرة المؤقتة (Disable cache)** كما هو موضح. يمكن أن يكون خيار **الحفاظ على السجل (Preserve log)** مفيداً أيضاً (فهو يحفظ السجلات المطبوعة بواسطة التطبيق عند إعادة تحميل الصفحة) بالإضافة إلى "إخفاء عناوين URL للإضافات" (يخفي طلبات أي إضافات مثبتة في المتصفح).

**ملاحظة هامة**: علامة التبويب الأكثر أهمية هي علامة التبويب **Console**. ومع ذلك، في هذه المقدمة، سنستخدم علامة التبويب **Network** كثيراً.

### بروتوكول HTTP وطريقة GET

يتواصل الخادم ومتصفح الويب مع بعضهما البعض باستخدام بروتوكول [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP). تعرض علامة التبويب *Network* كيف يتواصل المتصفح والخادم.

عند إعادة تحميل الصفحة (لتحديث صفحة ويب، على نظام Windows، اضغط على مفاتيح *Fn*-*F5*. وعلى نظام macOS، اضغط على *command*-*R*. أو اضغط على رمز التحديث في متصفحك)، ستُظهر وحدة التحكم وقوع حدثين:

- جلب المتصفح محتويات الصفحة *studies.cs.helsinki.fi/exampleapp* من الخادم.
- وقام بتنزيل الصورة *kuva.png*.

![لقطة شاشة لوحدة تحكم المطور تظهر هذين الحدثين](../../images/0/2e.png)

على شاشة صغيرة، قد تضطر إلى توسيع نافذة وحدة التحكم لرؤيتها.

يؤدي النقر فوق الحدث الأول إلى الكشف عن مزيد من المعلومات حول ما يحدث:

![عرض تفصيلي لحدث واحد](../../images/0/3e.png)

يوضح الجزء العلوي، *العام (General)*، أن المتصفح طلب العنوان *<https://studies.cs.helsinki.fi/exampleapp>* باستخدام طريقة [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)، وأن الطلب كان ناجحاً لأن استجابة الخادم كانت برمز الحالة [Status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) هو 200.

يحتوي كل من الطلب واستجابة الخادم على عدة [ترويسات (Headers)](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields):

![لقطة شاشة لترويسات الاستجابة](../../images/0/4e.png)

تخبرنا *ترويسات الاستجابة (Response headers)* في الجزء العلوي، على سبيل المثال، بحجم الاستجابة بالبايت والوقت المحدد للاستجابة. تخبرنا الترويسة المهمة [Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) أن الاستجابة عبارة عن ملف نصي بتنسيق [utf-8](https://en.wikipedia.org/wiki/UTF-8) وقد تمت صياغة محتوياته باستخدام HTML. بهذه الطريقة يعرف المتصفح أن الاستجابة هي صفحة [HTML](https://en.wikipedia.org/wiki/HTML) عادية ويقوم بتصييرها وعرضها في المتصفح "كصفحة ويب".

تعرض علامة التبويب *Response* بيانات الاستجابة، وهي صفحة HTML عادية. يحدد قسم *body* بنية الصفحة المعروضة على الشاشة:

![لقطة شاشة لعلامة تبويب الاستجابة](../../images/0/5e.png)

تحتوي الصفحة على عنصر [div](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)، والذي يحتوي بدوره على عنوان، ورابط لصفحة الملاحظات *notes*، ووسم صورة [img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)، ويعرض عدد الملاحظات التي تم إنشاؤها.

بسبب وسم الصورة img، يقوم المتصفح بطلب *HTTP request* ثانٍ لجلب الصورة *kuva.png* من الخادم. تفاصيل الطلب هي كما يلي:

![عرض تفصيلي للحدث الثاني](../../images/0/6e.png)

تم تقديم الطلب إلى العنوان <https://studies.cs.helsinki.fi/exampleapp/kuva.png> ونوعه هو HTTP GET. تخبرنا ترويسات الاستجابة أن حجم الاستجابة هو 89350 بايت، ونوع المحتوى [Content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) هو *image/png*، لذا فهي صورة بتنسيق png. يستخدم المتصفح هذه المعلومات لتصيير الصورة وعرضها بشكل صحيح على الشاشة.

تشكل سلسلة الأحداث الناتجة عن فتح الصفحة <https://studies.cs.helsinki.fi/exampleapp> على المتصفح [مخطط التسلسل (Sequence diagram)](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/) التالي:

![مخطط تسلسلي للمسار الموضح أعلاه](../../images/0/7m.png)

يوضح مخطط التسلسل كيف يتواصل المتصفح والخادم بمرور الوقت. يتدفق الوقت في المخطط من الأعلى إلى الأسفل، لذلك يبدأ المخطط بالطلب الأول الذي يرسله المتصفح إلى الخادم، متبوعاً بالاستجابة.

أولاً، يرسل المتصفح طلب HTTP GET إلى الخادم لجلب كود HTML الخاص بالصفحة. يطالب وسم *img* في HTML المتصفح بجلب الصورة *kuva.png*. يقوم المتصفح بتصيير صفحة HTML والصورة على الشاشة.

على الرغم من صعوبة ملاحظة ذلك، تبدأ صفحة HTML في العرض قبل جلب الصورة من الخادم.

### تطبيقات الويب التقليدية (Traditional web applications)

تعمل الصفحة الرئيسية للتطبيق النموذجي مثل *تطبيق الويب التقليدي*. عند الدخول إلى الصفحة، يجلب المتصفح مستند HTML الذي يوضح بنية الصفحة ومحتواها النصي من الخادم.

قام الخادم بتكوين هذا المستند بطريقة ما. يمكن أن يكون المستند ملفاً نصياً *ثابتاً (Static)* محفوظاً في دليل الخادم. يمكن للخادم أيضاً تكوين مستندات HTML *ديناميكياً (Dynamically)* وفقاً لشيفرة التطبيق، باستخدام بيانات من قاعدة بيانات على سبيل المثال.
تم تشكيل كود HTML للتطبيق النموذجي ديناميكياً لأنه يحتوي على معلومات حول عدد الملاحظات التي تم إنشاؤها.

يتم تشكيل كود HTML للصفحة الرئيسية ديناميكياً على الخادم على النحو التالي:

```js
const getFrontPageHtml = noteCount => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div class='container'>
          <h1>Full stack example app</h1>
          <p>number of notes created ${noteCount}</p>
          <a href='/notes'>notes</a>
          <img src='kuva.png' width='200' />
        </div>
      </body>
    </html>
`
}

app.get('/', (req, res) => {
  const page = getFrontPageHtml(notes.length)
  res.send(page)
})
```

ليس عليك فهم الشيفرة في الوقت الحالي.

تم حفظ محتوى صفحة HTML كسلسلة قالب (Template String) تتيح تقييم المتغيرات، مثل *noteCount*، في وسطها. يتم استبدال الجزء المتغير ديناميكياً من الصفحة الرئيسية، وهو عدد الملاحظات المحفوظة (في الكود *noteCount*)، بالعدد الحالي للملاحظات (في الكود *notes.length*) في سلسلة القالب.

إن كتابة كود HTML داخل كود البرمجة ليست خطوة ذكية بالطبع، ولكن بالنسبة لمبرمجي PHP من المدرسة القديمة، كانت هذه ممارسة معتادة.

في تطبيقات الويب التقليدية، يكون المتصفح "بسيطاً". فهو يجلب فقط بيانات HTML من الخادم، وتكون جميع عمليات منطق التطبيق موجودة على الخادم. يمكن إنشاء الخادم باستخدام [Java Spring](https://spring.io/projects/spring-framework) أو [Python Flask](https://flask.palletsprojects.com/en/2.2.x/) أو [Ruby on Rails](http://rubyonrails.org/) على سبيل المثال لا الحصر.

يستخدم المثال مكتبة [Express](https://expressjs.com/) مع Node.js. ستستخدم هذه الدورة Node.js و Express لإنشاء خوادم الويب.

### تشغيل منطق التطبيق في المتصفح (Running application logic in browser)

احتفظ بوحدة تحكم المطور مفتوحة. أفرغ وحدة التحكم بالنقر فوق رمز 🚫، أو بكتابة `()clear` في وحدة التحكم.
الآن عندما تنتقل إلى صفحة [الملاحظات](https://studies.cs.helsinki.fi/exampleapp/notes)، يُجري المتصفح 4 طلبات HTTP:

![لقطة شاشة لوحدة تحكم المطور مع الطلبات الأربعة المرئية](../../images/0/8e.png)

جميع الطلبات لها أنواع *مختلفة*. نوع الطلب الأول هو *document*. وهو كود HTML الخاص بالصفحة، ويبدو كما يلي:

![عرض تفصيلي للطلب الأول](../../images/0/9e.png)

عندما نقارن الصفحة المعروضة على المتصفح وكود HTML الذي أرجعه الخادم، نلاحظ أن الكود لا يحتوي على قائمة الملاحظات.
يحتوي قسم [head](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head) من HTML على وسم [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)، مما يجعل المتصفح يجلب ملف JavaScript يسمى *main.js*.

يبدو كود JavaScript كما يلي:

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    console.log(data)

    var ul = document.createElement('ul')
    ul.setAttribute('class', 'notes')

    data.forEach(function(note) {
      var li = document.createElement('li')

      ul.appendChild(li)
      li.appendChild(document.createTextNode(note.content))
    })

    document.getElementById('notes').appendChild(ul)
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

تفاصيل الشيفرة ليست مهمة الآن، ولكن تم تضمين بعض الأكواد لتوضيح الصور والنصوص. سنبدأ البرمجة الفعلية في [الجزء الأول](/ar/part1). الشيفرة النموذجية في هذا الجزء ليست ذات صلة على الإطلاق بتقنيات البرمجة المعتمدة في هذه الدورة.

> قد يتساءل البعض عن سبب استخدام كائن xhttp بدلاً من دالة fetch الحديثة. يرجع هذا إلى عدم الرغبة في الخوض في مفهوم الوعود (Promises) في هذه المرحلة، ولكون الكود يلعب دوراً ثانوياً في هذا الجزء التمهيدي. سنعود إلى الطرق الحديثة لتقديم الطلبات إلى الخادم في [الجزء الثاني](/ar/part2).

مباشرة بعد جلب وسم *script*، يبدأ المتصفح في تنفيذ الكود.

يوجه السطران الأخيران المتصفح للقيام بطلب HTTP GET إلى عنوان الخادم */data.json*:

```js
xhttp.open('GET', '/data.json', true)
xhttp.send()
```

هذا هو الطلب الموجود في أقصى الأسفل الموضح في تبويب الشبكة Network.

يمكننا محاولة الانتقال إلى العنوان <https://studies.cs.helsinki.fi/exampleapp/data.json> مباشرة من المتصفح:

![بيانات JSON الخام](../../images/0/10e.png)

هناك نجد الملاحظات في شكل "بيانات أولية خام" بتنسيق [JSON](https://en.wikipedia.org/wiki/JSON). بشكل افتراضي، المتصفحات المعتمدة على Chromium ليست جيدة جداً في عرض بيانات JSON. يمكن استخدام الإضافات للتعامل مع التنسيق. ثبّت على سبيل المثال إضافة [JSONView](https://chromewebstore.google.com/detail/gmegofmjomhknnokphhckolhcffdaihd) على Chrome، وأعد تحميل الصفحة. أصبحت البيانات الآن منسقة بشكل جيد:

![مخرجات JSON المنسقة](../../images/0/11e.png)

يقوم كود JavaScript الخاص بصفحة الملاحظات أعلاه بتنزيل بيانات JSON التي تحتوي على الملاحظات، ويشكل قائمة نقطية من محتويات الملاحظات:

يتم ذلك بواسطة الشيفرة التالية:

```js
const data = JSON.parse(this.responseText)
console.log(data)

var ul = document.createElement('ul')
ul.setAttribute('class', 'notes')

data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})

document.getElementById('notes').appendChild(ul)
```

ينشئ الكود أولاً قائمة غير مرتبة باستخدام الوسم [ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)...

```js
var ul = document.createElement('ul')
ul.setAttribute('class', 'notes')
```

...ثم يضيف وسماً واحداً [li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li) لكل ملاحظة. يُستخدم فقط الحقل *content* الخاص بكل ملاحظة كمحتوى لوسم li. لا تُستخدم الطوابع الزمنية الموجودة في البيانات الأولية لأي شيء هنا.

```js
data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})
```

افتح الآن علامة التبويب **Console** في وحدة تحكم المطور لديك:

![لقطة شاشة لعلامة تبويب وحدة التحكم](../../images/0/12e.png)

بالنقر فوق المثلث الصغير في بداية السطر، يمكنك توسيع النص على وحدة التحكم.

![لقطة شاشة لأحد الإدخالات موسعة](../../images/0/13e.png)

هذا الإخراج على وحدة التحكم ناتج عن أمر *console.log* في الكود:

```js
const data = JSON.parse(this.responseText)
console.log(data)
```

لذا، بعد تلقي البيانات من الخادم، يقوم الكود بطباعتها على وحدة التحكم.

ستصبح علامة التبويب *Console* وأمر *console.log* مألوفين جداً بالنسبة لك أثناء الدورة التدريبية.

### معالجات الأحداث ودوال الرد (Event handlers & Callbacks)

بنية هذا الكود تبدو غريبة بعض الشيء:

```js
var xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  // الكود الذي يتعامل مع استجابة الخادم
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```

يتم إرسال الطلب إلى الخادم في السطر الأخير، ولكن يمكن العثور على الكود للتعامل مع الاستجابة في الأعلى. ماذا يحدث هنا؟

```js
xhttp.onreadystatechange = function () {
```

في هذا السطر، يتم تعريف *معالج أحداث (Event Handler)* للحدث *onreadystatechange* لكائن *xhttp* الذي يقوم بالطلب. عندما تتغير حالة الكائن، يستدعي المتصفح دالة معالج الأحداث. يتحقق كود الدالة من أن [readyState](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState) يساوي 4 (مما يوضح الموقف *اكتملت العملية*) وأن رمز حالة HTTP للاستجابة هو 200.

```js
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    // الكود الذي يعالج استجابة الخادم
  }
}
```

تعد آلية استدعاء معالجات الأحداث شائعة جداً في JavaScript. تسمى دوال معالج الأحداث بدوال [الرد (Callback functions)](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function). لا تستدعي شيفرة التطبيق الدوال بنفسها، ولكن بيئة التشغيل - المتصفح - تستدعي الدالة في الوقت المناسب عند وقوع *الحدث*.

### نموذج كائن المستند (DOM)

يمكننا التفكير في صفحات HTML كهياكل شجرية ضمنية (Tree Structures).

```
html
  head
    link
    script
  body
    div
      h1
      div
        ul
          li
          li
          li
      form
        input
        input
```

يمكن رؤية نفس الهيكل الشجري في علامة التبويب **Elements** في وحدة التحكم.

![لقطة شاشة لعلامة التبويب Elements في وحدة تحكم المطور](../../images/0/14e.png)

يعتمد عمل المتصفح على فكرة تمثيل عناصر HTML كشجرة.

نموذج كائن المستند، أو [DOM](https://en.wikipedia.org/wiki/Document_Object_Model)، عبارة عن واجهة برمجة تطبيقات (*API*) تتيح التعديل البرمجي لـ *أشجار العناصر* المقابلة لصفحات الويب.

استخدم كود JavaScript المقدم في الفصل السابق واجهة برمجة تطبيقات DOM-API لإضافة قائمة بالملاحظات إلى الصفحة.

تنشئ الشيفرة التالية عقدة جديدة، وتعينها للمتغير *ul*، وتضيف إليها بعض العقد الفرعية:

```js
var ul = document.createElement('ul')

data.forEach(function(note) {
  var li = document.createElement('li')

  ul.appendChild(li)
  li.appendChild(document.createTextNode(note.content))
})
```

أخيراً، يتم توصيل فرع الشجرة لمتغير *ul* بمكانه المناسب في شجرة HTML للصفحة بأكملها:

```js
document.getElementById('notes').appendChild(ul)
```

### التلاعب بكائن المستند من وحدة التحكم

تسمى العقدة العلوية لشجرة DOM لمستند HTML بكائن *document*. يمكننا إجراء عمليات مختلفة على صفحة ويب باستخدام DOM-API. يمكنك الوصول إلى كائن *document* بكتابة *document* في علامة التبويب Console:

![document في علامة التبويب console](../../images/0/15e.png)

دعنا نضيف ملاحظة جديدة إلى الصفحة من وحدة التحكم.

أولاً، سنحصل على قائمة الملاحظات من الصفحة. القائمة موجودة في عنصر ul الأول من الصفحة:

```js
list = document.getElementsByTagName('ul')[0]
```

ثم قم بإنشاء عنصر li جديد وأضف إليه بعض المحتوى النصي:

```js
newElement = document.createElement('li')
newElement.textContent = 'Page manipulation from console is easy'
```

وأضف عنصر li الجديد إلى القائمة:

```js
list.appendChild(newElement)
```

![لقطة شاشة للصفحة مع إضافة الملاحظة الجديدة إلى القائمة](../../images/0/16e.png)

على الرغم من تحديث الصفحة على متصفحك، إلا أن التغييرات ليست دائمة. إذا تمت إعادة تحميل الصفحة، فستختفي الملاحظة الجديدة، لأن التغييرات لم يتم دفعها إلى الخادم. ستنشئ شيفرة JavaScript التي يجلبها المتصفح دائماً قائمة الملاحظات بناءً على بيانات JSON من العنوان <https://studies.cs.helsinki.fi/exampleapp/data.json>.

### تنسيقات CSS

يحتوي عنصر *head* لكود HTML لصفحة الملاحظات على وسم [link](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)، والذي يحدد أنه يجب على المتصفح جلب ورقة أنماط [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) من العنوان [main.css](https://studies.cs.helsinki.fi/exampleapp/main.css).

صفحات الأنماط الانسيابية، أو CSS، هي لغة أوراق أنماط تُستخدم لتحديد المظهر المرئي لصفحات الويب.

يبدو ملف CSS الذي تم جلبه كما يلي:

```css
.container {
  padding: 10px;
  border: 1px solid;
}

.notes {
  color: blue;
}
```

يحدد الملف اثنين من [محددات الفئات (Class selectors)](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors). وتُستخدم هذه لتحديد أجزاء معينة من الصفحة وتحديد قواعد التنسيق لتصميمها.

يبدأ تعريف محدد الفئة دائماً بنقطة ويحتوي على اسم الفئة.

الفئات عبارة عن [سمات (Attributes)](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) يمكن إضافتها إلى عناصر HTML.

يمكن فحص سمات CSS في علامة التبويب *Elements* بوحدة التحكم:

![لقطة شاشة لعلامة التبويب Elements في وحدة تحكم المطور](../../images/0/17e.png)

يحتوي عنصر *div* الخارجي على الفئة *container*. يحتوي عنصر *ul* الذي يحتوي على قائمة الملاحظات على الفئة *notes*.

تحدد قاعدة CSS أن العناصر التي تحتوي على فئة *container* سيتم إحاطتها بإطار [border](https://developer.mozilla.org/en-US/docs/Web/CSS/border) بعرض بكسل واحد. كما يحدد هوامش داخلية [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) بمقدار 10 بكسل على العنصر. يضيف هذا مساحة فارغة بين محتوى العنصر والحدود.

تحدد قاعدة CSS الثانية لون نص فئة *notes* باللون الأزرق.

يمكن أن تحتوي عناصر HTML أيضاً على سمات أخرى بخلاف الفئات. يحتوي عنصر *div* الذي يحتوي على الملاحظات على سمة [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). يستخدم كود JavaScript المعرف id للعثور على العنصر.

يمكن استخدام علامة التبويب *Elements* في وحدة التحكم لتغيير أنماط العناصر مباشرة.

![تطبيق قواعد CSS في علامة التبويب elements](../../images/0/18e.png)

التغييرات التي يتم إجراؤها على وحدة التحكم لن تكون دائمة. إذا كنت ترغب في إجراء تغييرات دائمة، فيجب حفظها في ورقة أنماط CSS على الخادم.

### مراجعة تحميل صفحة تحتوي على JavaScript

دعنا نراجع ما يحدث عند فتح الصفحة <https://studies.cs.helsinki.fi/exampleapp/notes> على المتصفح:

![مخطط تسلسل التفاعل بين المتصفح والخادم](../../images/0/19m.png)

- يجلب المتصفح كود HTML الذي يحدد محتوى الصفحة وهيكلها من الخادم باستخدام طلب HTTP GET.
- تتسبب الروابط الموجودة في كود HTML في قيام المتصفح أيضاً بجلب ورقة أنماط CSS المسمى *main.css*...
- ...وملف كود JavaScript المسمى *main.js*.
- ينفذ المتصفح كود JavaScript. يقوم الكود بإجراء طلب HTTP GET إلى العنوان <https://studies.cs.helsinki.fi/exampleapp/data.json>، والذي يُرجع الملاحظات كبيانات بتنسيق JSON.
- عند جلب البيانات، ينفذ المتصفح *معالج الأحداث (Event handler)*، الذي يصيّر ويعرض الملاحظات على الصفحة باستخدام واجهة برمجة تطبيقات DOM-API.

### النماذج وطلب HTTP POST

بعد ذلك، دعنا نفحص كيفية إضافة ملاحظة جديدة.

تحتوي صفحة الملاحظات على [عنصر نموذج (Form element)](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).

![عنصر النموذج في صفحة الويب وأدوات المطور](../../images/0/20e.png)

عند النقر فوق الزر الموجود في النموذج، سيرسل المتصفح مدخلات المستخدم إلى الخادم. دعنا نفتح علامة التبويب *Network* ونرى كيف يبدو إرسال النموذج:

![لقطة شاشة لعلامة التبويب Network تعرض أحداث إرسال النموذج](../../images/0/21e.png)

من المدهش أن إرسال النموذج يتسبب في ما لا يقل عن *خمسة* طلبات HTTP.
الأول هو حدث إرسال النموذج نفسه. دعنا نقرب الصورة:

![عرض تفصيلي للطلب الأول](../../images/0/22e.png)

إنه طلب [HTTP POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) إلى عنوان الخادم *new_note*. يستجيب الخادم برمز حالة HTTP هو 302. هذا عبارة عن [إعادة توجيه عنوان URL](https://en.wikipedia.org/wiki/URL_redirection)، حيث يطلب الخادم من المتصفح إجراء طلب HTTP GET جديد إلى العنوان المحدد في ترويسة *Location* - العنوان *notes*.

لذا، يعيد المتصفح تحميل صفحة الملاحظات. تؤدي إعادة التحميل إلى ثلاثة طلبات HTTP أخرى: جلب ورقة الأنماط (main.css)، وكود JavaScript (main.js)، والبيانات الأولية للملاحظات (data.json).

تعرض علامة التبويب Network أيضاً البيانات المقدمة مع النموذج. يمكنك عرض البيانات بتحديد اسم الطلب أولاً ثم التحقق من علامة التبويب Payload:

![بيانات النموذج في أدوات المطور](../../images/0/23g.png)

يحتوي وسم Form على سمتين هما *action* و *method*، واللتان تحددان أن إرسال النموذج يتم كطلب HTTP POST إلى العنوان *new_note*.

![سمات action و method](../../images/0/24e.png)

الكود الموجود على الخادم المسؤول عن طلب POST بسيط للغاية:

```js
app.post('/new_note', (req, res) => {
  notes.push({
    content: req.body.note,
    date: new Date(),
  })

  return res.redirect('/notes')
})
```

يتم إرسال البيانات كـ [body](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) لطلب POST.
يمكن للخادم الوصول إلى البيانات من خلال الوصول إلى حقل *req.body* لكائن الطلب *req*.
ينشئ الخادم كائن ملاحظة جديداً، ويضيفه إلى مصفوفة تسمى *notes*.

```js
notes.push({
  content: req.body.note,
  date: new Date(),
})
```

يحتوي كل كائن ملاحظة على حقلين: *content* الذي يحتوي على المحتوى الفعلي للملاحظة، و *date* الذي يحتوي على تاريخ ووقت إنشاء الملاحظة.
لا يحفظ الخادم ملاحظات جديدة في قاعدة بيانات، لذلك تختفي الملاحظات الجديدة عند إعادة تشغيل الخادم.

### تقنية أجاكس (AJAX)

تتبع صفحة الملاحظات في التطبيق أسلوب تطوير الويب في أوائل التسعينيات وتستخدم "Ajax". على هذا النحو، فهي في طليعة موجة تكنولوجيا الويب في أوائل العقد الأول من القرن الحادي والعشرين.

[AJAX](<https://en.wikipedia.org/wiki/Ajax_(programming)>) (Asynchronous JavaScript and XML) هو مصطلح تم تقديمه في فبراير 2005 على خلفية التطورات في تكنولوجيا المتصفحات لوصف نهج ثوري جديد مكّن من جلب المحتوى إلى صفحات الويب باستخدام JavaScript المضمنة داخل HTML، دون الحاجة إلى إعادة تصيير الصفحة وتحديثها بالكامل.

قبل عصر AJAX، كانت جميع صفحات الويب تعمل مثل [تطبيق الويب التقليدي](/ar/part0/fundamentals_of_web_apps#traditional-web-applications) الذي رأيناه سابقاً في هذا الفصل. تم جلب جميع البيانات المعروضة على الصفحة باستخدام كود HTML الذي تم إنشاؤه بواسطة الخادم.

تستخدم صفحة الملاحظات تقنية AJAX لجلب بيانات الملاحظات. لا يزال إرسال النموذج يستخدم الآلية التقليدية لإرسال نماذج الويب.

تعكس عناوين URL للتطبيق الأوقات القديمة. يتم جلب بيانات JSON من عنوان URL <https://studies.cs.helsinki.fi/exampleapp/data.json> ويتم إرسال الملاحظات الجديدة إلى عنوان URL <https://studies.cs.helsinki.fi/exampleapp/new_note>. في الوقت الحاضر، لن تعتبر عناوين URL مثل هذه مقبولة، لأنها لا تتبع الاصطلاحات المعترف بها عموماً لواجهات برمجة التطبيقات [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services)، والتي سنبحث فيها بمزيد من التفصيل في [الجزء الثالث](/ar/part3).

أصبح الشيء الذي يُطلق عليه اسم AJAX شائعاً جداً الآن لدرجة أنه يعتبر أمراً مفروغاً منه. لقد تلاشى المصطلح وتناسته الأجيال الجديدة.

### تطبيقات الصفحة الواحدة (Single Page App - SPA)

في تطبيقنا النموذجي، تعمل الصفحة الرئيسية مثل صفحة الويب التقليدية: كل المنطق موجود على الخادم، والمتصفح يعرض فقط كود HTML كما تم توجيهه.

تمنح صفحة الملاحظات بعض المسؤولية، وهي إنشاء كود HTML للملاحظات الحالية، إلى المتصفح. يتعامل المتصفح مع هذه المهمة عن طريق تنفيذ كود JavaScript الذي جلبه من الخادم. يجلب الكود الملاحظات من الخادم كبيانات JSON ويضيف عناصر HTML لعرض الملاحظات على الصفحة باستخدام [DOM-API](/ar/part0/fundamentals_of_web_apps#document-object-model-or-dom).

في السنوات الأخيرة، برز أسلوب [تطبيقات الصفحة الواحدة](https://en.wikipedia.org/wiki/Single-page_application) (SPA) لإنشاء تطبيقات الويب. لا تجلب مواقع الويب بأسلوب SPA جميع صفحاتها بشكل منفصل من الخادم كما يفعل تطبيقنا النموذجي، ولكنها تشتمل بدلاً من ذلك على صفحة HTML واحدة فقط يتم جلبها من الخادم، ويتم التلاعب بمحتوياتها باستخدام JavaScript التي يتم تنفيذها في المتصفح.

تشبه صفحة الملاحظات في تطبيقنا تطبيقات SPA نوعاً ما، لكنها لم تصل إلى هناك تماماً بعد. على الرغم من تشغيل منطق تصيير الملاحظات على المتصفح، إلا أن الصفحة لا تزال تستخدم الطريقة التقليدية لإضافة ملاحظات جديدة. يتم إرسال البيانات إلى الخادم عبر إرسال النموذج، ويوجه الخادم المتصفح لإعادة تحميل صفحة الملاحظات بـ *إعادة توجيه Redirect*.

يمكن العثور على إصدار تطبيق الصفحة الواحدة من تطبيقنا النموذجي على <https://studies.cs.helsinki.fi/exampleapp/spa>. للوهلة الأولى، يبدو التطبيق مطابقاً تماماً للتطبيق السابق. كود HTML متطابق تقريباً، لكن ملف JavaScript مختلف (*spa.js*) وهناك تغيير طفيف في كيفية تعريف وسم form:

![نموذج بدون سمات action و method](../../images/0/25e.png)

لا يحتوي النموذج على سمات *action* أو *method* لتحديد كيفية ومكان إرسال بيانات الإدخال.

افتح علامة التبويب *Network* وأفرغها. عندما تنشئ الآن ملاحظة جديدة، ستلاحظ أن المتصفح يرسل طلباً واحداً فقط إلى الخادم.

![علامة التبويب Network تظهر طلباً واحداً من نوع POST إلى new_note_spa](../../images/0/26e.png)

يحتوي طلب POST إلى العنوان *new_note_spa* على الملاحظة الجديدة كبيانات JSON تحتوي على كل من محتوى الملاحظة (*content*) والطابع الزمني (*date*):

```js
{
  content: "single page app does not reload the whole page",
  date: "2019-05-25T15:15:59.905Z"
}
```

تخبر ترويسة *Content-Type* للطلب الخادم أن البيانات المضمنة ممثلة بتنسيق JSON:

![تمييز ترويسة Content-type](../../images/0/27e.png)

بدون هذه الترويسة، لن يعرف الخادم كيفية تحليل البيانات بشكل صحيح.

يستجيب الخادم برمز الحالة [201 created](https://httpstatuses.com/201). هذه المرة لا يطلب الخادم إعادة توجيه، ويبقى المتصفح في نفس الصفحة، ولا يرسل أي طلبات HTTP إضافية.

لا يرسل إصدار SPA من التطبيق بيانات النموذج بالطريقة التقليدية، ولكنه يستخدم بدلاً من ذلك كود JavaScript الذي جلبه من الخادم:

```js
var form = document.getElementById('notes_form')
form.onsubmit = function(e) {
  e.preventDefault()

  var note = {
    content: e.target.elements[0].value,
    date: new Date(),
  }

  notes.push(note)
  e.target.elements[0].value = ''
  redrawNotes()
  sendToServer(note)
}
```

يوجه الأمر `document.getElementById('notes_form')` الكود لجلب مرجع لعنصر نموذج HTML في الصفحة الذي يحتوي على المعرف "notes_form" وتسجيل *معالج أحداث* للتعامل مع حدث إرسال النموذج. يستدعي معالج الأحداث على الفور التابع `()e.preventDefault` لمنع المعالجة الافتراضية لإرسال النموذج. سترسل الطريقة الافتراضية البيانات إلى الخادم وتتسبب في طلب GET جديد، وهو ما لا نريد حدوثه.

ثم ينشئ معالج الأحداث ملاحظة جديدة، ويضيفها إلى قائمة الملاحظات باستخدام الأمر `(notes.push(note`، ويعيد تصيير قائمة الملاحظات على الصفحة ويرسل الملاحظة الجديدة إلى الخادم.

كود إرسال الملاحظة إلى الخادم هو كما يلي:

```js
var sendToServer = function(note) {
  var xhttpForPost = new XMLHttpRequest()
  // ...

  xhttpForPost.open('POST', '/new_note_spa', true)
  xhttpForPost.setRequestHeader('Content-type', 'application/json')
  xhttpForPost.send(JSON.stringify(note))
}
```

يحدد الكود أنه سيتم إرسال البيانات بطلب HTTP POST ونوع البيانات هو JSON. يتم تحديد نوع البيانات بترويسة *Content-type*. ثم يتم إرسال البيانات كسلسلة JSON.

شيفرة التطبيق متاحة على <https://github.com/mluukkai/example_app>.

### مكتبات جافاسكريبت (JavaScript libraries)

تم إنشاء التطبيق النموذجي باستخدام ما يسمى [vanilla JavaScript](https://www.freecodecamp.org/news/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34/) (جافاسكريبت النقية)، باستخدام DOM-API و JavaScript فقط للتلاعب ببنية الصفحات.

بدلاً من استخدام JavaScript و DOM-API فقط، غالباً ما تُستخدم مكتبات مختلفة تحتوي على أدوات يسهل التعامل معها مقارنة بـ DOM-API لتعديل الصفحات. إحدى هذه المكتبات هي المكتبة المشهورة جداً [jQuery](https://jquery.com/).

تم تطوير jQuery عندما كانت تطبيقات الويب تتبع بشكل أساسي النمط التقليدي للخادم الذي ينشئ صفحات HTML، والتي تم تحسين وظائفها على جانب المتصفح باستخدام JavaScript المكتوبة باستخدام jQuery. كان أحد أسباب نجاح jQuery هو ما يسمى بالتوافق عبر المتصفحات. عملت المكتبة بغض النظر عن المتصفح أو الشركة التي صنعته. في الوقت الحاضر، ليس استخدام jQuery مبرراً نظراً لتقدم لغة JavaScript، وأصبحت المتصفحات الأكثر شيوعاً تدعم الوظائف الأساسية بشكل ممتاز.

أدى ظهور تطبيقات الصفحة الواحدة إلى ظهور العديد من الطرق الأكثر "حداثة" لتطوير الويب مقارنة بـ jQuery. كانت [BackboneJS](http://backbonejs.org/) هي المفضلة في الموجة الأولى من المطورين. بعد [إطلاقها](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#100rc1-moir%C3%A9-vision-2012-03-13) في عام 2012، سرعان ما أصبحت [AngularJS](https://angularjs.org/) من Google المعيار الفعلي لتطوير الويب الحديث.

ومع ذلك، تراجعت شعبية Angular في أكتوبر 2014 بعد أن أعلن فريق Angular أن الدعم للإصدار 1 سينتهي، وأن Angular 2 لن يكون متوافقاً مع الإصدار الأول.

حالياً، الأداة الأكثر شيوعاً لتنفيذ منطق جانب المتصفح لتطبيقات الويب هي مكتبة [React](https://react.dev/) من فيسبوك (Meta).
خلال هذه الدورة، سنتعرف على مكتبة React ومكتبة [Zustand](https://github.com/pmndrs/zustand)، واللتين تُستخدمان بشكل متكرر معاً.

مكانة React قوية جداً، ولكن عالم JavaScript دائم التغير. على سبيل المثال، في الآونة الأخيرة، استحوذ الوافد الجديد - [VueJS](https://vuejs.org/) - على بعض الاهتمام.

### تطوير الويب المتكامل (Full-stack web development)

ماذا يعني اسم الدورة، *تطوير الويب المتكامل (Full stack web development)*؟ Full stack هي كلمة رنانة يتحدث عنها الجميع. عملياً، تحتوي جميع تطبيقات الويب على طبقتين (على الأقل): المتصفح، كونه أقرب إلى المستخدم النهائي، هو الطبقة العليا، والخادم هو الطبقة السفلية. وغالباً ما توجد أيضاً طبقة قاعدة بيانات أسفل الخادم. لذلك يمكننا التفكير في *بنية* تطبيق الويب على أنها *حزمة متراكمة (Stack)* من الطبقات.

غالباً ما نتحدث أيضاً عن [الواجهة الأمامية والخلفية (Frontend and Backend)](https://en.wikipedia.org/wiki/Front_and_back_ends). المتصفح هو الواجهة الأمامية، وكود JavaScript الذي يعمل على المتصفح هو كود الواجهة الأمامية. من ناحية أخرى، فإن الخادم هو الواجهة الخلفية.

في سياق هذه الدورة، يعني تطوير الويب المتكامل أننا نركز على جميع أجزاء التطبيق: الواجهة الأمامية، والواجهة الخلفية، وقاعدة البيانات.

سنقوم ببرمجة الواجهة الخلفية باستخدام JavaScript، باستخدام بيئة تشغيل [Node.js](https://nodejs.org/en/). إن استخدام نفس لغة البرمجة على طبقات متعددة من المكدس يمنح تطوير الويب المتكامل بعداً جديداً تماماً. ومع ذلك، ليس من متطلبات تطوير الويب المتكامل استخدام نفس لغة البرمجة (JavaScript) لجميع طبقات المكدس.

### إجهاد جافاسكريبت (JavaScript fatigue)

يعد تطوير الويب المتكامل أمراً صعباً من نواحٍ عديدة. تجري الأمور في العديد من الأماكن في وقت واحد، وتصحيح الأخطاء أصعب بكثير من تطبيقات سطح المكتب العادية. لا تعمل لغة JavaScript دائماً كما تتوقع منها (مقارنة بالعديد من اللغات الأخرى)، وتتسبب الطريقة غير المتزامنة التي تعمل بها بيئات التشغيل الخاصة بها في جميع أنواع التحديات. يتطلب التواصل على الويب معرفة بروتوكول HTTP. يجب على المرء أيضاً التعامل مع قواعد البيانات وإدارة الخادم وتكوينه. سيكون من الجيد أيضاً معرفة ما يكفي من CSS لجعل التطبيقات مقبولة الشكل على الأقل.

يتطور عالم JavaScript بسرعة، مما يجلب مجموعة التحديات الخاصة به. فالأدوات والمكتبات واللغة نفسها قيد التطوير المستمر. بدأ البعض يتعب من التغيير المستمر، وصاغوا مصطلحاً له: *إجهاد جافاسكريبت (JavaScript fatigue)*.

سوف تعاني من إجهاد JavaScript بنفسك أثناء هذه الدورة. لحسن حظنا، هناك بضع طرق لتسهيل منحنى التعلم، ويمكننا البدء بالبرمجة بدلاً من التكوين والإعدادات المعقدة.

</div>

<div class="tasks">

### التمارين 0.1.-0.6.

يتم تسليم التمارين عبر GitHub، ومن خلال تحديد التمارين على أنها مكتملة في علامة التبويب "my submissions" في [نظام التسليم](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

يمكنك تسليم جميع التمارين في نفس المستودع، أو استخدام مستودعات متعددة مختلفة. إذا قمت بتسليم تمارين من أجزاء مختلفة في نفس المستودع، فقم بتسمية مجلداتك جيداً. إذا كنت تستخدم مستودعاً خاصاً لتسليم التمارين، فأضف *mluukkai* كمتعاون فيه.

إحدى الطرق الجيدة لتسمية المجلدات في مستودع التسليم الخاص بك هي كما يلي:

```text
part0
part1
  courseinfo
  unicafe
  anecdotes
part2
  courseinfo
  phonebook
  countries
```

يتم تسليم التمارين **جزءاً واحداً في كل مرة**. عندما ترسل التمارين لجزء ما، لم يعد بإمكانك تسليم أي تمارين فائتة لهذا الجزء.

#### 0.1: لغة HTML

راجع أساسيات HTML من خلال قراءة هذا الدليل التعليمي من Mozilla: [دليل HTML التعليمي](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics).

*لا يتم تسليم هذا التمرين إلى GitHub، يكفي مجرد قراءة البرنامج التعليمي.*

#### 0.2: تنسيقات CSS

راجع أساسيات CSS من خلال قراءة هذا الدليل التعليمي من Mozilla: [دليل CSS التعليمي](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).

*لا يتم تسليم هذا التمرين إلى GitHub، يكفي مجرد قراءة البرنامج التعليمي.*

#### 0.3: نماذج HTML

تعرف على أساسيات نماذج HTML من خلال قراءة دليل Mozilla التعليمي [نموذجك الأول](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Your_first_HTML_form).

*لا يتم تسليم هذا التمرين إلى GitHub، يكفي مجرد قراءة البرنامج التعليمي.*

#### 0.4: مخطط الملاحظة الجديدة (New note diagram)

في القسم [مراجعة تحميل صفحة تحتوي على JavaScript](/ar/part0/fundamentals_of_web_apps#loading-a-page-containing-java-script-review)، تم تمثيل سلسلة الأحداث الناتجة عن فتح الصفحة <https://studies.cs.helsinki.fi/exampleapp/notes> كـ [مخطط تسلسلي](https://www.geeksforgeeks.org/unified-modeling-language-uml-sequence-diagrams/).

تم عمل المخطط كملف GitHub Markdown باستخدام صيغة [Mermaid](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)، على النحو التالي:

```text
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```

**أنشئ مخططاً مشابهاً** يصور الموقف الذي يقوم فيه المستخدم بإنشاء ملاحظة جديدة على الصفحة <https://studies.cs.helsinki.fi/exampleapp/notes> عن طريق كتابة شيء ما في حقل النص والنقر فوق الزر *Save*.

إذا لزم الأمر، أظهر العمليات على المتصفح أو على الخادم كتعليقات على المخطط. لا يلزم أن يكون المخطط مخطط تسلسل، فأي طريقة معقولة لعرض الأحداث مقبولة.

يمكن العثور على جميع المعلومات اللازمة للقيام بهذا التمرين والتمارين التالية في نص [هذا الجزء](/ar/part0/fundamentals_of_web_apps#forms-and-http-post).

يمكنك عمل المخططات باستخدام صيغة [Mermaid](https://github.com/mermaid-js/mermaid#sequence-diagram-docs---live-editor) التي يتم دعمها في صفحات [GitHub](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/) Markdown!

#### 0.5: مخطط تطبيق الصفحة الواحدة (Single page app diagram)

أنشئ مخططاً يصور الموقف الذي ينتقل فيه المستخدم إلى إصدار تطبيق الصفحة الواحدة من تطبيق الملاحظات على <https://studies.cs.helsinki.fi/exampleapp/spa>.

#### 0.6: مخطط ملاحظة جديدة في تطبيق الصفحة الواحدة

أنشئ مخططاً يصور الموقف الذي ينشئ فيه المستخدم ملاحظة جديدة باستخدام إصدار الصفحة الواحدة من التطبيق.

كان هذا هو التمرين الأخير، وحان الوقت لدفع إجاباتك إلى GitHub وتحديد التمارين على أنها مكتملة في [نظام التسليم](https://studies.cs.helsinki.fi/stats/courses/fullstackopen).

</div>
