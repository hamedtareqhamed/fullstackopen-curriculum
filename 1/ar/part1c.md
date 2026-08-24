---
mainImage: ../../../images/part-1.svg
part: 1
letter: c
lang: ar
---

<div class="content">

سنعود الآن للتعمق في استخدام React. لنبدأ بمثال جديد:

```js
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```

---

### الدوال المساعدة داخل المكونات (Component helper functions)

لنوسع المكون `Hello` ليتوقع سنة ميلاد الشخص:

```js
const Hello = (props) => {
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

تم تضمين منطق حساب سنة الميلاد داخل دالة مساعدة تُستدعى عند تصيير المكون. في JavaScript، يُعتبر تعريف الدوال داخل دوال أخرى أسلوباً شائعاً وطبيعياً جداً ومستخدماً على نطاق واسع.

---

### التفكيك (Destructuring)

بدلاً من تكرار كتابة `props.name` و `props.age`، يمكننا استخراج الخصائص عبر التفكيك:

```js
const Hello = (props) => {
  const { name, age } = props
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

ويمكننا الذهاب خطوة أبعد بتفكيك الخصائص مباشرة في معاملات الدالة:

```js
const Hello = ({ name, age }) => {
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

---

### دورة إعادة التصيير (Page re-rendering)

حتى هذه اللحظة، كانت كافة تطبيقاتنا ثابتة (Static). ماذا لو أردنا بناء عداد تزداد قيمته بمرور الوقت أو عند الضغط على زر؟

إذا قمنا بتعديل قيمة المتغير `counter += 1`، فلن يُعاد تصيير المكون تلقائياً ما لم يتم استدعاء دالة التصيير مجدداً.

---

### المكونات ذات الحالة وخطاف `useState` (Stateful component)

لإضافة حالة تتغير وتدفع React لتحديث الواجهة تلقائياً، نستخدم [خطاف الحالة (`useState`)](https://react.dev/learn/state-a-components-memory):

```js
import { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )

  console.log('rendering...', counter)

  return (
    <div>{counter}</div>
  )
}

export default App
```

تقوم دالة `useState(0)` بتهيئة الحالة بالرقم 0، وتُرجع مصفوفة من عنصرين:
1. `counter`: القيمة الحالية للحالة.
2. `setCounter`: دالة لتحديث قيمة الحالة.

> **قاعدة أساسية في React**: *استدعاء دالة تحديث الحالة (مثل `setCounter`) يؤدي إلى إعادة تنفيذ دالة المكون وتصيير الواجهة المحدثة فورياً على الشاشة*.

![سجل التصيير في الكونسول](../../images/1/4e.png)

---

### معالجة الأحداث (Event handling)

نربط تفاعل المستخدم، مثل النقر على الأزرار عبر عنصر `<button>`، بـ [معالج أحداث (Event handler)](https://react.dev/learn/responding-to-events) باستخدام الخاصية `onClick`:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const handleClick = () => {
    console.log('clicked')
  }

  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleClick}>
        plus
      </button>
    </div>
  )
}
```

عند النقر على الزر يتم استدعاء الدالة `handleClick` وطباعة الرسالة.

لتحديث العداد وإعادة التصيير:

```js
const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}>
        zero
      </button>
    </div>
  )
}
```

---

### معالج الحدث يجب أن يكون دالة وليس استدعاء دالة

إذا كتبت معالج الحدث كاستدعاء مباشر للدالة:

```js
<button onClick={setCounter(counter + 1)}>
  plus
</button>
```

فسيتعطل التطبيق تماماً:

![خطأ Too many re-renders](../../images/1/5c.png)

**السبب**: عند تصيير المكون للمرة الأولى، يُنفذ كود `setCounter(0 + 1)` فوراً، فيغير الحالة ويدفع React لإعادة التصيير، مما يؤدي لاستدعاء `setCounter` مرة أخرى والدخول في حلقة تكرار لانهائية (Infinite recursion).

لذلك، يجب أن تكون قيمة `onClick` دائماً **دالة أو مرجعاً لدالة**، مثل `() => setCounter(counter + 1)` أو `increaseByOne`.

---

### رفع الحالة وتمريرها للمكونات الفرعية (Passing state to child components)

من أفضل الممارسات في React تجزئة الواجهات إلى مكونات صغيرة يعاد استخدامها، ورفع الحالة إلى أقرب مكون أب مشترك ([Lifting state up](https://react.dev/learn/sharing-state-between-components)):

```js
const Display = ({ counter }) => <div>{counter}</div>

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter}/>
      <Button onClick={increaseByOne} text='plus' />
      <Button onClick={setToZero} text='zero' />
      <Button onClick={decreaseByOne} text='minus' />
    </div>
  )
}
```

عند النقر على أي زر:
1. يُنفذ معالج الحدث دالة التحديث (`setCounter`).
2. تقوم React بإعادة تصيير المكون الرئيسي `App`.
3. يُعاد تصيير المكونات الفرعية `Display` و `Button` بالقيم والخصائص الجديدة.

![الطباعة في الكونسول لتتبع الأحداث](../../images/1/31.png)

لا تخمن أبداً ما يقوم به الكود؛ استخدم `console.log` لرؤية تدفق البيانات وتغير الحالة بنفسك.

</div>
