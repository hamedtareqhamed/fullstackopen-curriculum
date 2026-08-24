---
mainImage: ../../../images/part-3.svg
part: 3
letter: c
lang: ar
---

<div class="content">

لحفظ بيانات تطبيقنا بشكل دائم لا يزول بإعادة تشغيل الخادم، سنقوم بربط الواجهة الخلفية بقاعدة بيانات سحابية.

تعتمد معظم أجزاء هذه الدورة على **[MongoDB](https://www.mongodb.com/)**، وهي قاعدة بيانات مستندية ([Document Database / NoSQL](https://en.wikipedia.org/wiki/Document-oriented_database)).

---

### إعداد قاعدة البيانات السحابية مع MongoDB Atlas

سنستخدم خدمة **[MongoDB Atlas](https://www.mongodb.com/atlas/database)** السحابية:
1. أنشئ حساباً مجانياً وأنشئ مجموعة خوادم (Cluster) بالباقة المجانية (Shared Cluster).
2. أنشئ مستخدماً لقاعدة البيانات مع كلمة مرور قوية من تبويب *Database Access*.
3. اسمح بالاتصال من أي مكان (`0.0.0.0/0`) من تبويب *Network Access*.
4. انسخ رابط الاتصال السحابي (MongoDB URI) من قسم *Connect > Drivers*.

![شاشة الربط في MongoDB Atlas](../../images/3/mongo6new.png)

---

### مكتبة Mongoose ونموذج المخطط (Schemas and Models)

بدلاً من التعامل المباشر مع محرك Mongo، نستخدم مكتبة **[Mongoose](https://mongoosejs.com/)**، وهي مخطط كائنات المستندات (ODM):

```bash
npm install mongoose
```

في Mongoose، نحدد **المخطط (Schema)** الذي يحدد هيكل الحقول وأنواعها داخل التطبيق، ثم ننشئ **النموذج (Model)**:

```js
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```

عند تسمية النموذج بالمفرد `'Note'`، تُنشئ Mongoose تلقائياً مجموعة في قاعدة البيانات بصيغة الجمع والأحرف الصغيرة `notes`.

---

### فصل إعدادات قاعدة البيانات في وحدة مستقلة ومتغيرات البيئة (.env)

لحماية بيانات الاعتماد السرية (مثل رابط وكلمة مرور قاعدة البيانات)، نستخدم مكتبة **[dotenv](https://github.com/motdotla/dotenv)**:

```bash
npm install dotenv
```

نُنشئ ملف `.env` في المجلد الجذري للمشروع:

```bash
MONGODB_URI=mongodb+srv://fullstack:mypassword@cluster0.mongodb.net/noteApp?retryWrites=true&w=majority
PORT=3001
```

> **تحذير أمني**: *أضف `.env` فوراً إلى ملف `.gitignore` لمنع رفع كلمات المرور السرية على GitHub!*

نُنشئ مجلد `models` وملف `models/note.js`:

```js
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error connecting to MongoDB:', error.message))

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

module.exports = mongoose.model('Note', noteSchema)
```

يقوم تعديل `toJSON` بتحويل معرف `_id` الداخلي إلى الخاصية `id` وحذف الحقل `__v` ليتوافق تماماً مع الواجهة الأمامية.

---

### استخدام قاعدة البيانات في مسارات Express

في ملف `index.js`:

```js
require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

// جلب كافة الملاحظات
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// إنشاء ملاحظة جديدة
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

// جلب ملاحظة فردية
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// حذف ملاحظة
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// تحديث ملاحظة
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then(updatedNote => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})
```

---

### معالجة الأخطاء الموحدة عبر البرمجيات الوسيطة (Error Handling Middleware)

عند حدوث خطأ في التعرف على الـ `id` (مثل تمرير معرف غير متوافق مع بنية Mongo)، تطلق Mongoose استثناء من نوع `CastError`.

نقوم بتعريف برمجية معالجة الأخطاء الوسيطة (التي تستقبل **4 معاملات**) في نهاية ملف `index.js` بعد كافة المسارات:

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)
```

---

### الترتيب الصارم لتحميل البرمجيات الوسيطة

1. `express.static('dist')`
2. `express.json()`
3. برمجيات التسجيل المخصصة (Logging)
4. مسارات التطبيق (`app.get`, `app.post`, ...)
5. وسيط المسارات غير المعرفة `unknownEndpoint`
6. وسيط معالجة الأخطاء `errorHandler` (يجب أن يكون في النهاية المطلقة دائماً).

</div>

<div class="tasks">

<h3>التمارين 3.12 - 3.18: ربط دليل الهاتف بقاعدة بيانات MongoDB</h3>

<h4>3.12: قاعدة البيانات من سطر الأوامر (Command-line database)</h4>
أنشئ ملف `mongo.js` لتجربة إضافة جهات اتصال وسردها عبر سطر الأوامر:
- إضافة جهة اتصال: `node mongo.js password "Arto Vihavainen" 045-1232456`
- عرض كافة جهات الاتصال: `node mongo.js password`

<h4>3.13: قاعدة بيانات دليل الهاتف - الخطوة 1 (Phonebook database step 1)</h4>
عدل مسار `GET /api/persons` في خادم دليل الهاتف ليقوم بجلب جهات الاتصال من قاعدة بيانات MongoDB عبر Mongoose في وحدة `models/person.js`.

<h4>3.14: قاعدة بيانات دليل الهاتف - الخطوة 2 (Phonebook database step 2)</h4>
احفظ جهات الاتصال الجديدة المضافة عبر `POST /api/persons` في قاعدة البيانات.

<h4>3.15: قاعدة بيانات دليل الهاتف - الخطوة 3 (Phonebook database step 3)</h4>
احذف جهات الاتصال من قاعدة البيانات عند استقبال طلب `DELETE /api/persons/:id` باستخدام `findByIdAndDelete()`.

<h4>3.16: قاعدة بيانات دليل الهاتف - الخطوة 4 (Phonebook database step 4)</h4>
انقل معالجة أخطاء الخادم إلى برمجية وسيطة مخصصة لمعالجة الأخطاء (Error Handler Middleware).

<h4>3.17*: قاعدة بيانات دليل الهاتف - الخطوة 5 (Phonebook database step 5)</h4>
ادعم تحديث رقم هاتف جهة اتصال موجودة مسبقاً عبر طلب `PUT /api/persons/:id`.

<h4>3.18*: قاعدة بيانات دليل الهاتف - الخطوة 6 (Phonebook database step 6)</h4>
حدّث مسار جلب جهة اتصال فردية `GET /api/persons/:id` ومسار المعلومات `GET /info` ليعتمدا على قاعدة البيانات بصورة ديناميكية.

</div>

