---
mainImage: ../../../images/part-8.svg
part: 8
letter: e
lang: ar
---

<div class="content">

سنتعلم في هذا القسم تقنيات GraphQL المتقدمة: **الأجزاء (Fragments)** لتفادي تكرار الحقول، والاشتراكات الحية عبر الويب سوكت **(Subscriptions & WebSockets)** لتحديث الواجهة فورياً عند حدوث تغييرات في الخادم، وحل مشكلة **n+1** في استعلامات قواعد البيانات.

---

### الأجزاء (Fragments) في GraphQL

تسمح الأجزاء بإعادة استخدام مجموعات الحقول المشتركة عبر استعلامات متعددة في العميل:

```graphql
fragment PersonDetails on Person {
  id
  name
  phone
  address {
    street
    city
  }
}
```

واستخدامها داخل الاستعلامات:

```graphql
query {
  allPersons {
    ...PersonDetails
  }
}

query findPerson($name: String!) {
  findPerson(name: $name) {
    ...PersonDetails
  }
}
```

---

### الاشتراكات الحية (GraphQL Subscriptions)

تتيح الاشتراكات للعميل الاستماع للتحديثات الحية من الخادم عبر اتصال **WebSocket** مستمر:

```graphql
type Subscription {
  personAdded: Person!
  bookAdded: Book!
}
```

#### 1. تهيئة الخادم للاشتراكات (`graphql-ws` و `expressMiddleware`):

```js
const { createServer } = require('http')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const resolvers = {
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })
      await person.save()
      // نشر حدث إضافة الشخص لكافة المشتركين
      pubsub.publish('PERSON_ADDED', { personAdded: person })
      return person
    }
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['PERSON_ADDED'])
    }
  }
}
```

#### 2. الاستماع للاشتراكات في React عبر `useSubscription`:

```jsx
import { useSubscription, gql } from '@apollo/client'

const PERSON_ADDED = gql`
  subscription {
    personAdded {
      id
      name
      phone
    }
  }
`

const App = () => {
  useSubscription(PERSON_ADDED, {
    onData: ({ data, client }) => {
      const addedPerson = data.data.personAdded
      window.alert(`تمت إضافة شخص جديد: ${addedPerson.name}`)
      // تحديث كاش Apollo فورياً
      client.cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(addedPerson)
        }
      })
    }
  })

  // ...
}
```

---

### مشكلة n+1 وحلها (The n+1 Problem)

تحدث مشكلة **n+1** عندما يُنفذ الخادم استعلام قاعدة بيانات رئيسياً (1)، ثم استعلاماً إضافياً منفصلاً لكل عنصر في النتيجة (n):

```
Person.find      // الاستعلام الرئيسي (1)
User.find        // استعلام لكل شخص (n)
User.find
User.find
```

#### الحلول:
1. استخدام استعلام الربط المباشر **`populate()`** في Mongoose:
   ```js
   Person.find({}).populate('friendOf')
   ```
2. استخدام مكتبة **DataLoader** لتجميع وتخزين الاستعلامات المتكررة مؤقتاً (Batching and Caching).

</div>

<div class="tasks">

<h3>التمارين 8.23 - 8.26: الاشتراكات الحية وحل مشكلة n+1</h3>

<h4>8.23: الاشتراكات في الخادم (Subscriptions server)</h4>
نفذ اشتراك `bookAdded` في خادم GraphQL لنشر تنبيهات الكتب الجديدة فور إضافتها.

<h4>8.24: اشتراكات العميل - التنبيهات (Subscriptions client step 1)</h4>
اشترك في `bookAdded` في واجهة React واعرض تنبيهاً للمستخدم (مثل `window.alert` أو نافذة تنبيه) عند إضافة أي كتاب جديد.

<h4>8.25: اشتراكات العميل - تحديث الواجهة التلقائي (Subscriptions client step 2)</h4>
قم بتحديث قائمة الكتب المعروضة وكاش Apollo فور استلام حدث `bookAdded` من الخادم بحيث يظهر الكتاب الجديد تلقائياً في كافة المتصفحات المفتوحة دون إعادة تحميل الصفحة.

<h4>8.26: حل مشكلة n+1 (Solving the n+1 problem)</h4>
أصلح مشكلة n+1 في استعلام المؤلفين `allAuthors` بحيث لا يتم تنفيذ استعلام منفصل لكل مؤلف لحساب عدد كتبه.

هذا هو التمرين الأخير في الجزء الثامن. ارفع حلولك إلى مستودع GitHub وسجل إنجازك في نظام التسليم.

</div>

