---
mainImage: ../../../images/part-8.svg
part: 8
letter: a
lang: ar
---

<div class="content">

سنتعلم في هذا القسم بناء خادم **GraphQL** متكامل باستخدام مكتبة **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)**.

---

### الفلسفة: مقارنة بين GraphQL و REST

في REST، تعتمد الواجهة على الموارد (Resource-based)، حيث يمتلك كل مورد مساراً خاصاً به (مثل `/api/persons/1`). يتطلب جلب بيانات مركبة إرسال عدة طلبات HTTP منفصلة قد تُرجع بيانات فائضة عن الحاجة.

في **GraphQL**، يرسل العميل استعلاماً واحداً بصيغة `POST` إلى نقطة نهاية موحدة يصف فيه بدقة الحقول المطلوبة فقط:

```graphql
query FetchPerson {
  findPerson(name: "Arto Hellas") {
    phone
    city
  }
}
```

---

### المخطط (Schema) والأنواع (Types)

يُعرّف المخطط بنية البيانات والعمليات المتاحة:

```graphql
type Person {
  name: String!
  phone: String
  street: String!
  city: String!
  id: ID!
}

type Query {
  personCount: Int!
  allPersons(phone: YesNo): [Person!]!
  findPerson(name: String!): Person
}

type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
  editNumber(
    name: String!
    phone: String!
  ): Person
}

enum YesNo {
  YES
  NO
}
```

- علامة التعجب `!` تعني أن الحقل إلزامي ولا يمكن أن يكون `null`.
- `ID`: نوع قياسي يضمن فرادة المعرف.
- `enum`: لتحديد قيم ثابتة مسبقاً.

---

### المُحللات (Resolvers)

المحلل هو الدالة المسؤولة عن جلب وحساب بيانات كل حقل واستعلام محدد في المخطط:

```js
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { v1 as uuid } from 'uuid'
import { GraphQLError } from 'graphql'

let persons = [ /* ... */ ]

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) return persons
      return persons.filter(p => args.phone === 'YES' ? p.phone : !p.phone)
    },
    findPerson: (root, args) => persons.find(p => p.name === args.name),
  },
  Person: {
    address: (root) => ({
      street: root.street,
      city: root.city
    })
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)) {
        throw new GraphQLError('Name must be unique', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name }
        })
      }
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    },
    editNumber: (root, args) => {
      const person = persons.find(p => p.name === args.name)
      if (!person) return null
      const updatedPerson = { ...person, phone: args.phone }
      persons = persons.map(p => p.name === args.name ? updatedPerson : p)
      return updatedPerson
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })
console.log(`Server ready at ${url}`)
```

---

### معالجة الأخطاء (Error Handling)

نستخدم كائن `GraphQLError` لإرسال أخطاء واضحة مع كود الحالة `BAD_USER_INPUT` عند إدخال بيانات غير صالحة.

</div>

<div class="tasks">

<h3>التمارين 8.1 - 8.7: خادم GraphQL للكتب والمؤلفين</h3>

<h4>8.1: عدد الكتب والمؤلفين (Book and Author count)</h4>
نفذ الاستعلامين `bookCount` و `authorCount` لإرجاع عدد الكتب والمؤلفين في النظام.

<h4>8.2: جميع الكتب (All books)</h4>
نفذ استعلام `allBooks` لإرجاع تفاصيل كافة الكتب (العنوان `title`، والمؤلف `author`، وسنة النشر `published`، والتصنيفات `genres`).

<h4>8.3: جميع المؤلفين (All authors)</h4>
نفذ استعلام `allAuthors` لإرجاع تفاصيل المؤلفين مع حقل مخصص `bookCount` يحتوي على عدد الكتب التي ألفها كل كاتب.

<h4>8.4: كتب مؤلف معين (Books of an author)</h4>
عدل استعلام `allBooks` ليقبل معاملاً اختيارياً `author` لتصفية الكتب حسب اسم المؤلف.

<h4>8.5: الكتب حسب التصنيف (Books by genre)</h4>
عدل استعلام `allBooks` ليقبل معاملاً اختيارياً `genre` لتصفية الكتب حسب النوع، مع دعم التصفية بكلا المعاملين معاً.

<h4>8.6: إضافة كتاب جديد (Adding a book)</h4>
نفذ طفرة `addBook` لإضافة كتاب جديد وإضافة المؤلف تلقائياً إلى قائمة المؤلفين إن لم يكن موجوداً من قبل.

<h4>8.7: تحديث سنة ميلاد المؤلف (Updating author's birth year)</h4>
نفذ طفرة `editAuthor` لتحديد وتعديل سنة ميلاد المؤلف `setBornTo`.

</div>
