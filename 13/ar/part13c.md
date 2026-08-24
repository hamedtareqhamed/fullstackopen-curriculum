---
mainImage: ../../../images/part-13.svg
part: 13
letter: c
lang: ar
---

<div class="content">

سنتعلم في هذا القسم الختامي من الجزء 13 كيفية إدارة تعديلات وهجرة مخططات قواعد البيانات الاحترافية عبر مكتبة **[Umzug](https://github.com/sequelize/umzug)**، وتطبيق علاقة متعدد لمتعدد **(Many-to-Many Relationships)** لقائمة قراءة المدونات، وإدارة الجلسات النشطة وقوائم حظر الرموز **(Token Blacklisting)** وتعطيل المستخدمين.

---

### هجرة قواعد البيانات الاحترافية مع Umzug (Database Migrations)

تسمح الهجرات بتسجيل وتتبع التعديلات الهيكلية على الجداول عبر الزمن وإمكانية تطبيقها في بيئة الإنتاج (`up`) أو التراجع عنها (`down`):

```bash
npm install umzug
```

في `util/db.js`:

```js
const { Umzug, SequelizeStorage } = require('umzug')

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('تم تطبيق الهجرات بنجاح:', {
    files: migrations.map((mig) => mig.name),
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}
```

مثال لملف هجرة `migrations/20211209_00_initialize_blogs_and_users.js`:

```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('blogs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      author: { type: DataTypes.TEXT },
      url: { type: DataTypes.TEXT, allowNull: false },
      title: { type: DataTypes.TEXT, allowNull: false },
      likes: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    })
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false }
    })
    await queryInterface.addColumn('blogs', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('blogs')
    await queryInterface.dropTable('users')
  },
}
```

---

### علاقة متعدد لمتعدد: قائمة القراءة (Reading List)

```js
// models/index.js
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_marked' })
```

استعلام قائمة القراءة للمستخدم مع إمكانية التصفية حسب حالة القراءة (`?read=true` أو `?read=false`):

```js
router.get('/:id', async (req, res) => {
  let where = {}
  if (req.query.read) {
    where.read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: ['id', 'read'],
          where
        }
      }
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

---

### إدارة الجلسات وقوائم حظر الرموز (Active Sessions & User Disabling)

للتحكم الفوري في إبطال الجلسات عند تسجيل الخروج أو حظر مستخدم مسيء، نُنشئ جدول الجلسات `ActiveSession`:

```js
const user = await User.findByPk(decodedToken.id)
const session = await ActiveSession.findOne({ where: { token } })

if (!user || user.disabled || !session) {
  return res.status(401).json({ error: 'الجلسة غير صالحة أو تم تعطيل الحساب' })
}
```

</div>

<div class="tasks">

<h3>التمارين 13.17 - 13.24: الهجرات وقائمة القراءة والجلسات النشطة</h3>

<h4>13.17: هجرات المخطط الأولي (Initial migrations)</h4>
انقل تعريفات جداول المدونات والمستخدمين إلى نظام ملفات الهجرات التلقائي باستخدام `Umzug`.

<h4>13.18: هجرة سنة التأليف (Year column migration)</h4>
أضف ملف هجرة جديد لإضافة عمود `year` إلى جدول المدونات.

<h4>13.19: هجرة جدول قائمة القراءة (Reading lists migration)</h4>
أنشئ جدول الربط `reading_lists` عبر ملف هجرة يربط معرف المستخدم ومعرف المدونة وحالة القراءة `read: boolean` (افتراضياً `false`).

<h4>13.20: إضافة مدونة لقائمة القراءة (POST /api/readinglists)</h4>
أنشئ مساراً لإضافة مدونة محددة إلى قائمة قراءة المستخدم المسجل.

<h4>13.21: استعلام قائمة القراءة للمستخدم (User reading list with filter)</h4>
عدل مسار `GET /api/users/:id` ليعرض قائمة القراءة مع دعم معامل التصفية `?read=true` أو `?read=false`.

<h4>13.22: تحديث حالة القراءة (PUT /api/readinglists/:id)</h4>
أضف مساراً يتيح للمستخدم تعديل حالة قراءة المدونة في قائمته إلى مقروءة (`read: true`) والتأكد من أنه صاحب القيد.

<h4>13.23: حظر وتعطيل المستخدمين (User disabled state)</h4>
أضف خاصية `disabled: boolean` لنموذج المستخدم وتحقق منها في وسيط المصادقة لمنع المستخدمين المعطلين من إجراء أي عمليات.

<h4>13.24: إدارة الجلسات النشطة وتسجيل الخروج (Active sessions & logout)</h4>
أنشئ جدول `ActiveSession` واحفظ الرمز المميز عند تسجيل الدخول، وأضف مسار `DELETE /api/logout` لحذف الجلسة من قاعدة البيانات وإبطال الرمز فورياً.

هذا هو التمرين الأخير في الجزء الثالث عشر. ارفع حلولك إلى GitHub وسجل إنجازك في نظام التسليم.

</div>

