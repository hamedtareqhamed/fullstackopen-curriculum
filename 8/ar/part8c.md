---
mainImage: ../../../images/part-8.svg
part: 8
letter: c
lang: ar
---

<div class="content">

سنتعلم في هذا القسم حفظ بيانات خادم GraphQL في قاعدة بيانات **MongoDB** عبر **Mongoose**، وإدارة المستخدمين وتطبيق المصادقة بالرموز المميزة (JWT) وسياق GraphQL Context.

---

### ربط GraphQL بقاعدة بيانات MongoDB

نُنشئ نماذج Mongoose في مجلد `models/`:

```js
// models/person.js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5 },
  phone: { type: String, minlength: 5 },
  street: { type: String, required: true, minlength: 5 },
  city: { type: String, required: true, minlength: 3 },
  friendOf: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = mongoose.model('Person', schema)
```

وفي نموذج المستخدم `models/user.js`:

```js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }]
})

module.exports = mongoose.model('User', schema)
```

---

### المُحللات (Resolvers) مع Mongoose والعمليات غير المتزامنة

```js
// resolvers.js
const Person = require('./models/person')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) return Person.find({}).populate('friendOf')
      return Person.find({ phone: { $exists: args.phone === 'YES' } }).populate('friendOf')
    },
    me: (root, args, context) => context.currentUser,
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('غير مصرح - يجب تسجيل الدخول', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const person = new Person({ ...args })
      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name }
        })
      }
      return person
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })
      return user.save().catch(error => {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('بيانات الدخول غير صحيحة', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = { username: user.username, id: user._id }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}
```

---

### سياق Apollo Server للمصادقة (Context)

يتم التحقق من رمز الـ JWT في ترويسة الطلب `authorization` وتمرير كائن المستخدم في سياق `context`:

```js
// index.js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')
const User = require('./models/user')

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  },
})
```

</div>

<div class="tasks">

<h3>التمارين 8.13 - 8.16: حفظ بيانات الكتب والمؤلفين في MongoDB والمصادقة</h3>

<h4>8.13: قاعدة البيانات - الخطوة 1 (Database step 1)</h4>
احفظ الكتب والمؤلفين في قاعدة بيانات MongoDB باستخدام Mongoose، وعدل الاستعلامين `allBooks` و `allAuthors` لجلب البيانات من قاعدة البيانات.

<h4>8.14: قاعدة البيانات - الخطوة 2 (Database step 2)</h4>
عدل طفرتي `addBook` و `editAuthor` لتحديث وحفظ السجلات في قاعدة بيانات MongoDB مع معالجة الأخطاء والتحقق من صحة المدخلات.

<h4>8.15: معالجة الأخطاء (Database error handling)</h4>
تأكد من إطلاق أخطاء `GraphQLError` مع كود `BAD_USER_INPUT` عند محاولة إضافة كتاب باسم مؤلف قصير جداً أو عنوان مكرر.

<h4>8.16: إدارة المستخدمين والمصادقة (User and login)</h4>
أضف نموذج المستخدم `User` وطفرة `createUser` وطفرة `login` التي تُرجع رمز JWT. واجعل طفرة إضافة كتاب `addBook` وتعديل المؤلف `editAuthor` متاحة **فقط** للمستخدمين المسجلين المصرح لهم.

</div>
