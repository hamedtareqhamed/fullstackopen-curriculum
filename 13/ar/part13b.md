---
mainImage: ../../../images/part-13.svg
part: 13
letter: b
lang: ar
---

<div class="content">

سنتعلم في هذا القسم بناء العلاقات بين الجداول في **Sequelize**: علاقة واحد لمتعدد (1-to-N) بين المستخدمين والمدونات، واستخدام التحميل المسبق **Eager Loading** عبر `include`، والفرز والتصفية مع معاملات الاستعلام المتقدمة، وإحصائيات التجميع (Aggregations).

---

### بناء العلاقات بين النماذج (Model Associations)

في `models/index.js`:

```js
const Blog = require('./blog')
const User = require('./user')

// علاقة واحد لمتعدد
User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = {
  Blog,
  User,
}
```

---

### جلب البيانات المترابطة (Eager Loading with `include`)

```js
// جلب كافة المدونات مع تضمين بيانات المستخدم الذي أضاف كل مدونة
router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username']
    }
  })
  res.json(blogs)
})
```

---

### البحث والتصفية والترتيب (Filtering and Ordering)

نستخدم مشغلات Sequelize مثل `Op.substring` أو `Op.or`:

```js
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.substring]: req.query.search } },
        { author: { [Op.substring]: req.query.search } },
      ]
    }
  }

  const blogs = await Blog.findAll({
    where,
    order: [
      ['likes', 'DESC'] // ترتيب تنازلي حسب عدد الإعجابات
    ],
    include: {
      model: User,
      attributes: ['name', 'username']
    }
  })
  res.json(blogs)
})
```

---

### استعلامات التجميع والمؤلفين (Aggregations & Group By)

لحساب إجمالي عدد المقالات ومجموع الإعجابات لكل كاتب:

```js
router.get('/authors', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    group: ['author'],
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]
  })
  res.json(authors)
})
```

</div>

<div class="tasks">

<h3>التمارين 13.8 - 13.16: ربط المدونات بالمستخدمين والبحث والإحصائيات</h3>

<h4>13.8: ربط المدونة بالمستخدم (User-Blog association)</h4>
أضف علاقة `User.hasMany(Blog)` و `Blog.belongsTo(User)` واحفظ معرف المستخدم عند إضافة مدونة جديدة.

<h4>13.9: استعلام المستخدمين مع مدوناتهم (Users with blogs)</h4>
عدل مسار `GET /api/users` ليتضمن قائمة بكافة المدونات المضافة من قبل كل مستخدم.

<h4>13.10: استعلام المدونات مع المستخدم صاحب المدونة (Blogs with user info)</h4>
ضمن بيانات المستخدم (الاسم واسم المستخدم) داخل استجابة `GET /api/blogs`.

<h4>13.11: حذف المدونة من قبل صاحبها فقط (Deleting own blogs only)</h4>
تحقق من رمز JWT واجعل عملية حذف المدونة مقتصرة حصرياً على المستخدم الذي قام بإنشائها.

<h4>13.12: وسيط التحقق من المعرف (Finder middleware)</h4>
أنشئ وسيط Express مخصص `blogFinder` للبحث عن المدونة بواسطة المعرف وإرفاقها بكائن `req.blog` لتفادي تكرار الأكواد.

<h4>13.13: البحث في المدونات (Search filtering)</h4>
أضف معامل البحث `?search=` في استعلام `GET /api/blogs` للبحث عن الكلمات المطابقة في عنوان المدونة أو اسم المؤلف دون مراعاة حالة الأحرف.

<h4>13.14: ترتيب المدونات حسب الإعجابات (Sorting blogs)</h4>
اضبط الترتيب التنازلي للمدونات في استجابة `GET /api/blogs` وفقاً لعدد الإعجابات.

<h4>13.15: مسار إحصائيات المؤلفين (Authors endpoint)</h4>
أنشئ مسار `GET /api/authors` لعرض أسماء كافة المؤلفين وإجمالي عدد مقالاتهم ومجموع إعجاباتهم مرتبة تنازلياً.

<h4>13.16: نموذج قائمة القراءة (Reading list join model)</h4>
عرف نموذج جدول الربط `ReadingList` لربط المستخدمين بالمدونات التي يرغبون في قراءتها مع تحديد حالة القراءة (`read: boolean`).

</div>
