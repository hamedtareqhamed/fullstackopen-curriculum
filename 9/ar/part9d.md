---
mainImage: ../../../images/part-9.svg
part: 9
letter: d
lang: ar
---

<div class="content">

سنتعلم في هذا القسم دمج **TypeScript** في تطبيقات **React** باستخدام **Vite**، وتحديد أنواع الخصائص (Props)، والتحقق الشامل من الأنواع باستخدام **الاتحادات المميزة (Discriminated Unions)** ودالة الفحص الشامل **`assertNever`**.

---

### إنشاء مشروع React مع TypeScript عبر Vite

```bash
npm create vite@latest my-app -- --template react-ts
```

---

### تحديد أنواع خصائص المكونات (Typing Component Props)

بدلاً من مكتبة `PropTypes` القديمة، نستخدم واجهات TypeScript (`interface`):

```tsx
interface HeaderProps {
  name: string;
}

const Header = (props: HeaderProps) => {
  return <h1>{props.name}</h1>;
};

// أو باستخدام تفكيك الكائنات مباشرة:
const Content = ({ parts }: { parts: CoursePart[] }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.name} part={part} />
      ))}
    </div>
  );
};
```

---

### الاتحادات المميزة (Discriminated Unions)

عندما تتشارك عدة أنواع في خصائص أساسية وتختلف في خصائص أخرى، نستخدم خاصية مشتركة (مثل `kind`) للتمييز بينها:

```ts
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: 'basic';
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group';
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: 'background';
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: 'special';
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;
```

---

### التحقق الشامل من الأنواع مع `assertNever` (Exhaustive Type Checking)

لضمان معالجة كافة الحالات الممكنة في جملة `switch` وإطلاق خطأ تصريف إذا نسي المطور معالجة نوع جديد:

```tsx
const assertNever = (value: never): never => {
  throw new Error(`معالجة غير متوقعة للنوع: ${JSON.stringify(value)}`);
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case 'basic':
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p><em>{part.description}</em></p>
        </div>
      );
    case 'group':
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>مشاريع المجموعة: {part.groupProjectCount}</p>
        </div>
      );
    case 'background':
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p><em>{part.description}</em></p>
          <p>مواد الخلفية: {part.backgroundMaterial}</p>
        </div>
      );
    case 'special':
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p><em>{part.description}</em></p>
          <p>المتطلبات: {part.requirements.join(', ')}</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};
```

</div>

<div class="tasks">

<h3>التمارين 9.15 - 9.20: معلومات الدورة ويوميات الطيران مع React و TypeScript</h3>

<h4>9.15: معلومات الدورة - الخطوة 1 (Course info step 1)</h4>
هيئ تطبيق React مع TypeScript وأعد بناء تطبيق معلومات الدورة التدريبية من الجزء الأول بمكونات محددة الأنواع (`Header`, `Content`, `Total`).

<h4>9.16: معلومات الدورة - الخطوة 2 (Course info step 2)</h4>
عرف واجهات أجزاء الدورة التدريبية كـ Discriminated Unions باستخدام الحقل المميز `kind`.

<h4>9.17: معلومات الدورة - الخطوة 3 (Course info step 3)</h4>
ابنِ مكوّن `Part` واستخدم جملة `switch` ودالة `assertNever` لعرض تفاصيل كل جزء وفقاً لنوعه.

<h4>9.18: معلومات الدورة - الخطوة 4 (Course info step 4)</h4>
أضف نوعاً جديداً `CoursePartSpecial` مع مصفوفة المتطلبات `requirements` وتأكد من عمل الفحص الشامل للأنواع بدقة.

<h4>9.19: واجهة يوميات الطيران - الخطوة 1 (Flight diaries frontend step 1)</h4>
ابنِ واجهة React لعرض قائمة يوميات الطيران التي يجلبها التطبيق من خادم Express الخلفي.

<h4>9.20: واجهة يوميات الطيران - الخطوة 2 (Flight diaries frontend step 2)</h4>
أضف نموذجاً في الواجهة لإضافة قيد طيران جديد مع أزرار الراديو لاختيار الطقس والرؤية، واعرض رسائل أخطاء التحقق الصادرة من الخادم بلون أحمر بارز عند إدخال بيانات خاطئة.

</div>

