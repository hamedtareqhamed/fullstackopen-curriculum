---
mainImage: ../../../images/part-8.svg
part: 8
letter: d
lang: ar
---

<div class="content">

سنتعلم في هذا القسم تطبيق تسجيل الدخول في الواجهة الأمامية (React)، وإرفاق رمز المصادقة (JWT Token) تلقائياً في ترويسات كافة طلبات Apollo Client باستخدام **`setContext`**، وتصفية البيانات وإدارة وتصفير كاش Apollo.

---

### إرفاق رمز المصادقة في ترويسة الطلبات (Apollo Auth Link)

نثبت حزمة `@apollo/client/link/context`:

```bash
npm install @apollo/client
```

في `src/main.jsx`:

```jsx
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

// إرفاق رمز الـ JWT من localStorage تلقائياً في ترويسة authorization لكل طلب
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
```

---

### مكون تسجيل الدخول `LoginForm`

```jsx
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    },
    onError: (error) => {
      setError(error.graphQLErrors[0]?.message || error.message)
    }
  })

  const submit = (e) => {
    e.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <form onSubmit={submit}>
      <div>
        اسم المستخدم: <input value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        كلمة المرور: <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">دخول</button>
    </form>
  )
}

export default LoginForm
```

---

### تسجيل الخروج وتصفير كاش Apollo (`client.resetStore()`)

عند تسجيل الخروج، يجب حذف الرمز وتصفير الـ Cache لضمان مسح أي بيانات خاصة بالمستخدم:

```jsx
import { useApolloClient } from '@apollo/client'

const logout = () => {
  setToken(null)
  localStorage.clear()
  client.resetStore()
}
```

</div>

<div class="tasks">

<h3>التمارين 8.17 - 8.22: تسجيل الدخول وتصفية وتوصيات الكتب</h3>

<h4>8.17: قائمة الكتب المحدثة (Listing books)</h4>
تأكد من أن قائمة الكتب تعرض أسماء المؤلفين وسنوات النشر والتصنيفات بدقة بعد الانتقال لقاعدة البيانات.

<h4>8.18: تسجيل الدخول (Log in)</h4>
أضف نموذج تسجيل الدخول في الواجهة الأمامية، واجعل إضافة الكتب وتعديل المؤلفين متاحة فقط للمستخدمين المسجلين.

<h4>8.19: تصفية الكتب حسب التصنيف - الخطوة 1 (Books by genre part 1)</h4>
أضف أزراراً في واجهة عرض الكتب لتصفية الكتب المعروضة حسب النوع (Genres) في الواجهة الأمامية.

<h4>8.20: صفحة التوصيات (Genre recommendations)</h4>
أضف صفحة جديدة "توصيات (Recommendations)" تعرض الكتب التي تنتمي إلى التصنيف المفضل للمستخدم المسجل حالياً (`favoriteGenre`).

<h4>8.21: تصفية الكتب مع استعلام GraphQL (Books by genre part 2)</h4>
عدل تصفية الكتب واستعلام التوصيات لتعتمد على استعلام الخادم `allBooks(genre: $genre)` بدلاً من التصفية في المتصفح.

<h4>8.22: التخزين المؤقت وتحديث التوصيات</h4>
تأكد من تحديث صفحة التوصيات وقائمة الكتب فور إضافة كتاب جديد دون الحاجة لإعادة تحميل الصفحة يدوياً.

</div>
