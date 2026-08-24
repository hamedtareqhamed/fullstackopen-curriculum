---
mainImage: ../../../images/part-8.svg
part: 8
letter: b
lang: ar
---

<div class="content">

سنتعلم في هذا القسم ربط تطبيق React بخادم GraphQL باستخدام مكتبة **[Apollo Client](https://www.apollographql.com/docs/react/)** لإرسال الاستعلامات والطفرات وإدارة التخزين المؤقت (Caching).

---

### تثبيت وتهيئة Apollo Client

```bash
npm install @apollo/client graphql
```

في `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

---

### إرسال الاستعلامات عبر خطاف `useQuery`

```jsx
import { gql, useQuery } from '@apollo/client'

const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`

const Persons = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>جاري التحميل...</div>
  }

  if (result.error) {
    return <div>حدث خطأ: {result.error.message}</div>
  }

  return (
    <div>
      <h2>الأشخاص</h2>
      {result.data.allPersons.map(p => (
        <div key={p.id}>{p.name} {p.phone}</div>
      ))}
    </div>
  )
}
```

---

### الاستعلامات المشروطة أو اليدوية: `useLazyQuery`

إذا أردنا جلب تفاصيل شخص فقط عند النقر على اسمه، نستخدم **`useLazyQuery`**:

```jsx
import { gql, useLazyQuery } from '@apollo/client'

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      address {
        street
        city
      }
    }
  }
`

const PersonDetails = () => {
  const [getPerson, result] = useLazyQuery(FIND_PERSON)

  const showPerson = (name) => {
    getPerson({ variables: { nameToSearch: name } })
  }

  // ...
}
```

---

### إرسال الطفرات `useMutation` وتحديث الكاش

```jsx
import { gql, useMutation } from '@apollo/client'

const CREATE_PERSON = gql`
  mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

const PersonForm = () => {
  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }],
    onError: (error) => {
      console.error(error.graphQLErrors[0]?.message)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    createPerson({ variables: { name, street, city, phone } })
  }

  // ...
}
```

- **`refetchQueries`**: يُخبر Apollo Client بإعادة تنفيذ استعلام `ALL_PERSONS` لجلب القائمة المحدثة فور نجاح الطفرة.
- **تحديث الكاش المباشر `update`**: لتحديث الـ Cache فورياً بدون طلب شبكي إضافي.

</div>

<div class="tasks">

<h3>التمارين 8.8 - 8.12: واجهة React مع Apollo Client</h3>

<h4>8.8: واجهة المؤلفين (Authors view)</h4>
استخدم `useQuery` لعرض قائمة المؤلفين في صفحة React مع عدد كتب كل مؤلف `bookCount`.

<h4>8.9: واجهة الكتب (Books view)</h4>
اعرض جدولاً أو قائمة بكافة الكتب المخزنة في خادم GraphQL في واجهة التطبيق.

<h4>8.10: إضافة كتاب جديد (Adding a book)</h4>
ابنِ نموذجاً لإضافة كتاب جديد باستخدام `useMutation` وتحديث واجهة عرض الكتب والمؤلفين فورياً.

<h4>8.11: تعديل سنة ميلاد المؤلف (Author birth year)</h4>
أضف نموذجاً لتحديد وتعديل سنة ميلاد المؤلفين باستخدام طفرة `editAuthor`.

<h4>8.12: اختيار المؤلف من قائمة منسدلة (Author birth year with select)</h4>
طور نموذج تعديل سنة الميلاد بحيث يتم اختيار اسم المؤلف من قائمة منسدلة (Select dropdown مثل `react-select`) لتفادي كتابة الأسماء يدوياً بشكل خاطئ.

</div>

