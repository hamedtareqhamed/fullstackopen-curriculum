---
mainImage: ../../../images/part-5.svg
part: 5
letter: a
lang: ar
---

<div class="content">

سنقوم الآن بربط واجهة المستخدم في React بنظام إدارة المستخدمين وتسجيل الدخول الذي بنيناه في الجزء الرابع، وإرفاق الرمز المميز (JWT Token) تلقائياً مع طلبات إنشاء الملاحظات.

### نموذج تسجيل الدخول في React (Login Form)

نُضيف حقول اسم المستخدم وكلمة المرور في مكون `App`:

```jsx
import { useState, useEffect } from 'react'
import loginService from './services/login'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      
      // حفظ جلسة المستخدم في المتصفح
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('بيانات الدخول غير صحيحة')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  // ...
}
```

---

### خدمة تسجيل الدخول `services/login.js`

```js
import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
```

---

### إرسال الرمز المميز مع الطلبات عبر Axios Headers

في ملف `src/services/notes.js`، نضيف وظيفة ضبط الترويسة `Authorization`:

```js
import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, setToken }
```

---

### حفظ الجلسة واستعادتها من التخزين المحلي (Local Storage)

للحفاظ على تسجيل دخول المستخدم عند تحديث الصفحة (Refresh)، نستخدم **`window.localStorage`**:

1. **الحفظ**: `window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))`
2. **الاسترجاع عند أول تحميل** عبر خطاف `useEffect`:

```jsx
useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    noteService.setToken(user.token)
  }
}, [])
```

3. **تسجيل الخروج (Logout)**:

```jsx
const handleLogout = () => {
  window.localStorage.removeItem('loggedNoteappUser')
  setUser(null)
  noteService.setToken(null)
}
```

---

### التصيير المشروط واستخدام عنصر `<label>`

تُعرض استمارة الدخول إذا كان `user === null`، بينما تُعرض استمارة إضافة الملاحظات عند تسجيل الدخول:

```jsx
return (
  <div>
    <h1>Notes</h1>
    <Notification message={errorMessage} />

    {!user && (
      <form onSubmit={handleLogin}>
        <div>
          <label>
            اسم المستخدم
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            كلمة المرور
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">تسجيل الدخول</button>
      </form>
    )}

    {user && (
      <div>
        <p>{user.name} مسجل دخوله حالياً <button onClick={handleLogout}>خروج</button></p>
        {/* استمارة إضافة ملاحظة */}
      </div>
    )}
  </div>
)
```

يُعد وضع حقل الإدخال `<input>` داخل وسم `<label>` من أفضل الممارسات لتحسين إمكانية الوصول (Accessibility - a11y) وقارئات الشاشة للمكفوفين.

</div>

<div class="tasks">

<h3>التمارين 5.1 - 5.4: واجهة تطبيق قائمة المدونات</h3>

استنسخ مشروع الواجهة الأمامية للمدونات وابدأ بتطويرها:

<h4>5.1: واجهة قائمة المدونات - الخطوة 1 (Blog List Frontend step 1)</h4>
ابنِ نموذج تسجيل الدخول، واعرض قائمة المدونات واسم المستخدم فقط عندما يكون المستخدم مسجلاً لدخوله.

![تسجيل الدخول في واجهة المدونات](../../images/5/4e.png)

<h4>5.2: واجهة قائمة المدونات - الخطوة 2 (Blog List Frontend step 2)</h4>
اجعل جلسة تسجيل الدخول دائمة باستخدام التخزين المحلي `localStorage`، وأضف زر تسجيل الخروج (Logout).

![زر تسجيل الخروج](../../images/5/6e.png)

<h4>5.3: واجهة قائمة المدونات - الخطوة 3 (Blog List Frontend step 3)</h4>
أتح للمستخدم المسجل إضافة مدونة جديدة (العنوان Title، الكاتب Author، الرابط URL).

<h4>5.4: واجهة قائمة المدونات - الخطوة 4 (Blog List Frontend step 4)</h4>
أضف إشعارات تنبيهية تظهر لعدة ثوانٍ أعلى الصفحة لإبلاغ المستخدم بنجاح العمليات (مثل إضافة مدونة بنجاح) أو فشلها (مثل خطأ في بيانات تسجيل الدخول).

![إشعار النجاح](../../images/5/8e.png)

</div>

