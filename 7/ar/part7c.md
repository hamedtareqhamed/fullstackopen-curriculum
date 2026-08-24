---
mainImage: ../../../images/part-7.svg
part: 7
letter: c
lang: ar
---

<div class="content">

سنتعرف في هذا القسم على مكونات الفئات القديمة (Class Components)، واستخدامها الحصري الضروري في **حدود الأخطاء (Error Boundaries)**، وإدارة الواجهة والخادم معاً في **مستودع موحد (Monorepo)**، ومعايير أمان تطبيقات الويب (OWASP Security)، وأحدث التوجهات التقنية في هندسة البرمجيات.

---

### مكونات الفئات (Class Components)

قبل ظهور الخطافات (Hooks) في React 16.8، كانت مكونات الفئات هي الطريقة الوحيدة لامتلاك حالة محلية ودورات حياة:

```jsx
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anecdotes: [],
      current: 0,
    }
  }

  componentDidMount() {
    // دالة دورة الحياة التي تنفذ فور تصيير المكون لأول مرة (مماثلة لـ useEffect مع [])
    axios.get('http://localhost:3001/anecdotes').then(res => {
      this.setState({ anecdotes: res.data })
    })
  }

  handleClick = () => {
    const current = Math.floor(Math.random() * this.state.anecdotes.length)
    this.setState({ current })
  }

  render() {
    if (this.state.anecdotes.length === 0) return <div>لا توجد طرائف...</div>

    return (
      <div>
        <h1>طرفة اليوم</h1>
        <div>{this.state.anecdotes[this.state.current].content}</div>
        <button onClick={this.handleClick}>التالي</button>
      </div>
    )
  }
}
```

---

### حدود الأخطاء (Error Boundaries)

حتى اليوم، لا توفر React خطافاً (Hook) لاصطياد أخطاء التصيير (Rendering Errors). الطريقة الوحيدة لمنع تعطل الصفحة البيضاء بالكامل هي استخدام مكوّن فئة يطبق دالتي دورة الحياة **`getDerivedStateFromError`** و **`componentDidCatch`**:

```jsx
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('تم اصطياد خطأ تصيير في ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h2>حدث خطأ غير متوقع في الواجهة.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            إعادة المحاولة
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

---

### الواجهة الأمامية والخلفية في مستودع موحد (Monorepo)

لتنظيم المشروع بالكامل في مستودع واحد نظيف:

```
my-monorepo/
  package.json        (ملف الجذر لتشغيل الأوامر المشتركة)
  client/             (مشروع React + Vite)
    package.json
    vite.config.js
    src/
  server/             (مشروع Express + Node.js)
    package.json
    index.js
```

في ملف `package.json` في الجذر، نستخدم أداة **`concurrently`** لتشغيل الاثنين معاً بأمر واحد:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "build": "npm run build --prefix client",
    "start": "NODE_ENV=production npm start --prefix server"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

---

### أمان تطبيقات React و Node.js (Security & OWASP)

- **هجمات الحقن (Injection Attacks & SQL/NoSQL Injection)**: تجنب دمج مدخلات المستخدم يدوياً في الاستعلامات، واستخدم الاستعلامات المجهزة (Parameterized Queries) والتعقيم التلقائي في Mongoose.
- **البرمجة النصية عبر المواقع (XSS - Cross-Site Scripting)**: تعالج React تلقائياً تعقيم المتغيرات داخل JSX وتمنع تنفيذ أكواد JavaScript الخبيثة المحقونة.
- **حزم الأمان وحماية الخادم**:
  - فحص ثغرات الحزم الدورية عبر: `npm audit` و `npm outdated`.
  - إضافة حزمة **`helmet`** لتأمين ترويسات HTTP في Express:
    ```js
    const helmet = require('helmet')
    app.use(helmet())
    ```

---

### الاتجاهات الحديثة في هندسة الويب (Current Trends)

1. **TypeScript**: الكتابة الثابتة للأنواع (Static Typing) لمنع أخطاء زمن التشغيل في JavaScript.
2. **React Server Components (RSC) و Next.js**: تصيير المكونات في الخادم وجلب البيانات مباشرة من قواعد البيانات دون إرسال كود الـ JavaScript إلى العميل.
3. **معمارية الخدمات المصغرة (Microservices Architecture)**: تقسيم النظام الكبير إلى خدمات شبكية مستقلة ذات مهام محددة تتواصل عبر واجهات برمجية و API Gateways.
4. **الحوسبة السحابية بدون خادم (Serverless Computing & Cloud Functions)**: تشغيل الدوال البرمجية عند الطلب عبر مزودي السحابة (مثل AWS Lambda و Google Cloud Functions).

</div>
