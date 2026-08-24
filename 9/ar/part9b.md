---
mainImage: ../../../images/part-9.svg
part: 9
letter: b
lang: ar
---

<div class="content">

سنتعلم في هذا القسم الخطوات العملية الأولى للبدء مع **TypeScript**: إعداد بيئة التطوير (`tsconfig.json` و `ts-node`)، وتعريف الأنواع الأساسية (Primitive Types) وأنواع الاتحادات (Union Types)، وبناء خادم **Express** متوافق كلياً مع نظام الأنواع.

---

### تجهيز بيئة العمل (Setting up the environment)

نُنشئ مشروع npm جديد ونثبت حزم TypeScript:

```bash
npm init -y
npm install --save-dev typescript ts-node ts-node-dev @types/node
```

نُنشئ ملف ضبط المصرف `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

### الأنواع الأساسية والأنواع المركبة (Types & Unions)

```ts
// تعريف نوع مخصص باستخدام الكلمة المفتاحية type
type Operation = 'multiply' | 'add' | 'divide';

type Result = number | string;

const calculator = (a: number, b: number, op: Operation): Result => {
  switch (op) {
    case 'multiply':
      return a * b;
    case 'add':
      return a + b;
    case 'divide':
      if (b === 0) throw new Error('لا يمكن القسمة على الصفر!');
      return a / b;
    default:
      throw new Error('العملية غير مدعومة!');
  }
};
```

---

### قراءة ومعالجة معاملات سطر الأوامر (Command-line arguments)

```ts
interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error('يرجى تمرير معاملين على الأقل!');
  if (args.length > 4) throw new Error('عدد المعاملات زائد عن الحد!');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    };
  } else {
    throw new Error('القيم المدخلة يجب أن تكون أرقاماً صالحة!');
  }
};
```

---

### بناء خادم Express مع TypeScript

لتثبيت حزم تعريفات الأنواع لـ Express:

```bash
npm install express
npm install --save-dev @types/express
```

نكتب خادم `index.ts`:

```ts
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

app.get('/bmi', (req: Request, res: Response) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(height, weight);
  return res.json({ weight, height, bmi });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

في `package.json`:

```json
{
  "scripts": {
    "dev": "ts-node-dev index.ts",
    "build": "tsc"
  }
}
```

</div>

<div class="tasks">

<h3>التمارين 9.1 - 9.7: حاسبة مؤشر كتلة الجسم (BMI) وحاسبة التمارين الرياضية</h3>

<h4>9.1: حاسبة مؤشر كتلة الجسم (Body Mass Index - BMI)</h4>
أنشئ دالة `calculateBmi` تقبل الطول بالسنتيمتر والوزن بالكيلوغرام وتُرجع وصفاً لحالة الجسم (مثل `"Normal range"` أو `"Overweight"`).

<h4>9.2: حاسبة التمارين الرياضية (Exercise calculator)</h4>
أنشئ دالة `calculateExercises` تحلل سجل ساعات التمارين اليومية وتُرجع كائناً يحتوي على:
- إجمالي عدد الأيام (`periodLength`).
- عدد أيام التمرين الفعلية (`trainingDays`).
- الهدف اليومي المستهدف (`target`).
- متوسط ساعات التمرين اليومية (`average`).
- هل تحقق الهدف؟ (`success`: boolean).
- التقييم من 1 إلى 3 (`rating`).
- تفسير التقييم نصياً (`ratingDescription`).

<h4>9.3: قراءة المدخلات من سطر الأوامر (Command line)</h4>
طور البرنامجين لقراءة المدخلات من سطر الأوامر عبر `process.argv` مع التحقق الصارم من صحة الأرقام.

<h4>9.4: مسار Express الترحيبي (Express /hello)</h4>
ابنِ مسار `GET /hello` يُرجع النص `"Hello Full Stack!"`.

<h4>9.5: نقطة نهاية مؤشر كتلة الجسم (BMI endpoint)</h4>
ابنِ مسار `GET /bmi` يستقبل الطول والوزن عبر Query parameters ويُرجع النتيجة بصيغة JSON.

<h4>9.6: إعداد ESLint مع TypeScript</h4>
ثبت وهيئ حزم `@typescript-eslint/eslint-plugin` و `@typescript-eslint/parser` لضبط جودة الكود.

<h4>9.7: نقطة نهاية حاسبة التمارين (Exercises endpoint)</h4>
ابنِ مسار `POST /exercises` يستقبل مصفوفة الساعات والهدف اليومي في جسم الطلب `req.body` ويُرجع تقرير الحسابات، مع التحقق من وجود وصحة البيانات وإرجاع خطأ `400` عند وجود خلل.

</div>

