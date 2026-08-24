---
mainImage: ../../../images/part-13.svg
part: 13
letter: a
lang: ar
---

<div class="content">

سنتعلم في هذا القسم الاتصال بقاعدة بيانات **PostgreSQL** واستخدام مكتبة **Sequelize** لتعريف النماذج وإجراء عمليات الاستعلام والإضافة والتعديل والحذف.

---

### الاتصال بقاعدة البيانات مع Sequelize

نثبت حزم Sequelize ومحرك الاتصال بـ PostgreSQL (`pg`):

```bash
npm install sequelize pg dotenv
```

في `util/db.js`:

```js
const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    // إعدادات الاتصال الآمن بالسحابة
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('تم الاتصال بقاعدة بيانات PostgreSQL بنجاح!')
  } catch (err) {
    console.error('فشل الاتصال بقاعدة البيانات:', err)
    return process.exit(1)
  }
  return null
}

module.exports = { connectToDatabase, sequelize }
```

---

### تعريف النماذج (Sequelize Models)

نُعرّف نموذج المدونة `models/blog.js`:

```js
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: {
        args: 1991,
        msg: 'سنة التأليف يجب أن تكون 1991 على الأقل'
      },
      max: {
        args: new Date().getFullYear(),
        msg: 'لا يمكن أن تكون سنة التأليف في المستقبل'
      }
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog'
})

module.exports = Blog
```

---

### عمليات الاستعلام وتوجيه المسارات (CRUD Operations)

```js
// controllers/blogs.js
const router = require('express').Router()
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    blog.likes = req.body.likes
    await blog.save()
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    await blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

module.exports = router
```

</div>

<div class="tasks">

<h3>التمارين 13.1 - 13.7: إدارة المدونات في PostgreSQL</h3>

<h4>13.1: تجربة استعلامات PostgreSQL المباشرة (Raw SQL queries)</h4>
اتصل بقاعدة بيانات PostgreSQL السحابية (أو المحلية عبر Docker) ونفذ استعلامات SQL لإنشاء جدول المدونات وجلب السجلات.

<h4>13.2: قراءة المدونات عبر Sequelize (Fetching blogs)</h4>
عرف نموذج `Blog` واطبع قائمة المدونات بصيغة `author: 'title', likes: X` في الطرفية.

<h4>13.3: مسارات Express لطباعة وتخزين المدونات (GET & POST /api/blogs)</h4>
ابنِ خادم Express مع مسار `GET /api/blogs` لجلب كافة المدونات ومسار `POST /api/blogs` لإنشاء مدونة جديدة.

<h4>13.4: تعديل وحذف المدونات (PUT & DELETE /api/blogs/:id)</h4>
أضف مسار `DELETE /api/blogs/:id` لحذف المدونة، ومسار `PUT /api/blogs/:id` لتحديث عدد الإعجابات.

<h4>13.5: نموذج المستخدم والتحقق من البريد (User model & email validation)</h4>
عرف نموذج `User` مع التحقق من أن حقل `username` هو بريد إلكتروني صالح باستخدام مدققات Sequelize (`isEmail: true`).

<h4>13.6: تعديل اسم المستخدم (PUT /api/users/:username)</h4>
أضف مساراً يتيح للمستخدم تعديل اسمه، وتأكد من عمل معالجة الأخطاء (Error handling middleware) بمركزية ونظافة.

<h4>13.7: التحقق من سنة التأليف (Blog year validation)</h4>
أضف عمود `year` إلى نموذج المدونة مع التحقق من أن السنة تقع بين 1991 والسنة الحالية.

</div>

