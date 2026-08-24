---
mainImage: ../../../images/part-9.svg
part: 9
letter: c
lang: ar
---

<div class="content">

سنتعلم في هذا القسم كتابة تطبيق **Express** متكامل بالاعتماد الصارم على أنظمة أنواع TypeScript، واستخدام أدوات التعداد **Enums**، وأنواع الأدوات المساعدة **Utility Types** مثل `Omit` و `Pick`، والتحقق المتقدم من صحة البيانات الواردة باستخدام مكتبة **[Zod](https://zod.dev/)**.

---

### بناء مشروع يوميات الطيران (Ilari's Flight Diaries)

نُعرف الأنواع في `src/types.ts`:

```ts
export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}

export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string; // حقل اختياري
}

// استثناء حقل التعليق الحساس باستخدام Omit
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;

// استثناء المعرف id للمدخلات الجديدة قبل الحفظ
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
```

---

### خدمة اليوميات (Diary Service) وتحديد أنواع الاستجابة

```ts
// src/services/diaryService.ts
import diaryData from '../../data/entries';
import { DiaryEntry, NonSensitiveDiaryEntry, NewDiaryEntry } from '../types';

const diaries: DiaryEntry[] = diaryData;

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};

const findById = (id: number): DiaryEntry | undefined => {
  return diaries.find(d => d.id === id);
};

const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    ...entry,
  };
  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  findById,
  addDiary,
};
```

---

### التحقق الصارم من صحة المدخلات باستخدام Zod (Validation with Zod)

تُعد مكتبة **[Zod](https://zod.dev/)** الأداة المعيارية الحديثة للتحقق من صحة البيانات واستنتاج الأنواع (Schema Validation & Type Inference):

```bash
npm install zod
```

نُنشئ مخطط التحقق في `src/utils.ts`:

```ts
import { z } from 'zod';
import { NewDiaryEntry, Weather, Visibility } from './types';

export const NewEntrySchema = z.object({
  date: z.string().date(),
  weather: z.nativeEnum(Weather),
  visibility: z.nativeEnum(Visibility),
  comment: z.string().optional(),
});

export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  return NewEntrySchema.parse(object);
};
```

وفي موجه المسارات `src/routes/diaries.ts`:

```ts
import express, { Request, Response } from 'express';
import diaryService from '../services/diaryService';
import { NonSensitiveDiaryEntry, DiaryEntry } from '../types';
import { toNewDiaryEntry } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req: Request, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries());
});

router.get('/:id', (req: Request, res: Response<DiaryEntry>) => {
  const diary = diaryService.findById(Number(req.params.id));
  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'خطأ غير معروف في البيانات' });
    }
  }
});

export default router;
```

</div>

<div class="tasks">

<h3>التمارين 9.8 - 9.14: خادم تطبيق نظام المرضى (Patientor backend)</h3>

<h4>9.8: تهيئة خادم Patientor (Patientor backend step 1)</h4>
هيئ مشروع TypeScript مع Express و ESLint، وأنشئ مسار `GET /api/ping` الذي يُرجع النص `"pong"`.

<h4>9.9: استعلام التشخيصات (Patientor backend step 2)</h4>
أنشئ مسار `GET /api/diagnoses` لإرجاع بيانات التشخيصات الطبية (`code`, `name`, `latin`).

<h4>9.10: استعلام المرضى بدون البيانات الحساسة (Patientor backend step 3)</h4>
أنشئ مسار `GET /api/patients` لإرجاع قائمة المرضى مع استثناء رقم الضمان الاجتماعي `ssn` باستخدام نوع الأداة `Omit<Patient, 'ssn'>` لحماية الخصوصية.

<h4>9.11: إضافة مريض جديد (Patientor backend step 4)</h4>
ابنِ مسار `POST /api/patients` لإضافة مريض جديد مع التحقق من الحقول الإلزامية وتوليد معرف `id` فريد باستخدام `uuid`.

<h4>9.12: التحقق من التعدادات والأنواع (Gender enum & validation)</h4>
استخدم تعداد `Gender` (مثل `Male`, `Female`, `Other`) ومكتبة **Zod** للتحقق الصارم من مدخلات إضافة المريض.

<h4>9.13: مسار تفاصيل المريض (Patient details endpoint)</h4>
أنشئ مسار `GET /api/patients/:id` لإرجاع كافة تفاصيل المريض المختار بما في ذلك سجل قيوده الطبية `entries`.

<h4>9.14: تطبيق يوميات الطيران مع الواجهة الأمامية (Flight diaries frontend)</h4>
ابنِ واجهة أمامية باستخدام React و TypeScript لعرض وإضافة يوميات الطيران مع إظهار رسائل التحقق من الأخطاء الصادرة من الخادم.

</div>
