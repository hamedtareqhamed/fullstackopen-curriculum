---
mainImage: ../../../images/part-9.svg
part: 9
letter: e
lang: ar
---

<div class="content">

سنتعلم في هذا القسم الختامي من الجزء التاسع كيفية استكمال وبناء تطبيق **Patientor** الشامل لإدارة السجلات الطبية للمرضى باستخدام **React** و **TypeScript** و **Material UI** و **Express**.

---

### نمذجة السجلات الطبية للمرضى (Medical Entries Modeling)

يتضمن كل مريض سجلات طبية مختلفة (Entries) تشترك في خصائص أساسية وتختلف في تفاصيل الرعاية الطبية. نُعرّفها باستخدام **الاتحادات المميزة (Discriminated Unions)**:

```ts
// types.ts
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}
```

---

### تصيير السجلات الطبية وفقاً لنوعها (EntryDetails Component)

```tsx
const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <Box p={2} border={1} borderRadius={4} mb={2}>
          <Typography variant="h6">{entry.date} <LocalHospitalIcon /></Typography>
          <Typography><em>{entry.description}</em></Typography>
          <Typography>تاريخ الخروج: {entry.discharge.date} ({entry.discharge.criteria})</Typography>
          <Typography>الطبيب المشرف: {entry.specialist}</Typography>
        </Box>
      );
    case "OccupationalHealthcare":
      return (
        <Box p={2} border={1} borderRadius={4} mb={2}>
          <Typography variant="h6">{entry.date} <WorkIcon /> ({entry.employerName})</Typography>
          <Typography><em>{entry.description}</em></Typography>
          {entry.sickLeave && (
            <Typography>إجازة مرضية: من {entry.sickLeave.startDate} إلى {entry.sickLeave.endDate}</Typography>
          )}
          <Typography>الطبيب المشرف: {entry.specialist}</Typography>
        </Box>
      );
    case "HealthCheck":
      return (
        <Box p={2} border={1} borderRadius={4} mb={2}>
          <Typography variant="h6">{entry.date} <MedicalServicesIcon /></Typography>
          <Typography><em>{entry.description}</em></Typography>
          <HealthRatingBar showText={false} rating={entry.healthCheckRating} />
          <Typography>الطبيب المشرف: {entry.specialist}</Typography>
        </Box>
      );
    default:
      return assertNever(entry);
  }
};
```

</div>

<div class="tasks">

<h3>التمارين 9.21 - 9.30: تطبيق Patientor المتكامل</h3>

<h4>9.21: صفحة تفاصيل المريض (Patient details view)</h4>
ابنِ صفحة تفاصيل المريض لعرض اسمه وجنسه ووظيفته ورقم الضمان الاجتماعي وقائمة قيوده الطبية `entries`.

<h4>9.22: أنواع القيود الطبية (Entry types)</h4>
عرف واجهات القيود الطبية الثلاثة (`HospitalEntry`, `OccupationalHealthcareEntry`, `HealthCheckEntry`) ونوع الاتحاد `Entry` في كل من الخادم والواجهة الأمامية.

<h4>9.23: استرجاع أكواد التشخيصات (Diagnoses codes)</h4>
اعرض نصوص وأسماء التشخيصات الطبية بجانب الأكواد (`diagnosisCodes`) باستخدام بيانات التشخيصات المحملة من الخادم.

<h4>9.24: مكون تفاصيل القيد الطبي (EntryDetails component)</h4>
ابنِ مكون `EntryDetails` للتعامل مع الأنواع المختلفة من القيود باستخدام الفحص الشامل للأنواع `assertNever`.

<h4>9.25: إضافة الأيقونات البصرية (Entry icons)</h4>
أضف أيقونات مميزة من Material UI تعبر عن كل نوع من أنواع الفحوصات (مستشفى، رعاية مهنية، فحص دوري مع تقييم صحة القلب).

<h4>9.26: إضافة قيد فحص صحي في الخادم (Add HealthCheck entry backend)</h4>
ابنِ مسار `POST /api/patients/:id/entries` في الخادم لإضافة قيد طبي جديد للمريض والتحقق من صحة المدخلات عبر Zod.

<h4>9.27: إضافة كافة أنواع القيود في الخادم (Add all entry types backend)</h4>
وسع مسار الخادم ليدعم إضافة قيود المستشفى والرعاية المهنية مع التحقق من معايير الخروج والإجازات المرضية.

<h4>9.28: نموذج إضافة فحص صحي في الواجهة (Add HealthCheck entry frontend)</h4>
أضف نموذجاً في الواجهة الأمامية لتمكين الأطباء من إضافة قيود الفحص الصحي `HealthCheck` مع التحقق من القيم وعرض رسائل الخطأ.

<h4>9.29: نموذج إضافة قيود المستشفى والرعاية المهنية في الواجهة (Hospital & Occupational entries frontend)</h4>
أضف خيارات إضافية في النموذج لإدخال قيود دخول المستشفى والرعاية المهنية مع إمكانية اختيار التشخيصات المتعددة.

<h4>9.30: التحقق الشامل من النموذج والتنسيق النهائي</h4>
تأكد من عمل كافة أجزاء نظام السجلات الطبية Patientor بكفاءة متناهية وبدون أي أخطاء تصريف أو تشغيل.

هذا هو التمرين الأخير في الجزء التاسع. ارفع حلولك إلى مستودع GitHub وسجل إنجازك في نظام التسليم.

</div>
