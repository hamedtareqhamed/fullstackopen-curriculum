---
mainImage: ../../../images/part-6.svg
part: 6
lang: ar
---

<div class="intro">

حتى الآن، قمنا بوضع حالة التطبيق ومنطق معالجتها مباشرة داخل مكونات React. ولكن مع نمو التطبيقات وتوسعها، يصبح من الضروري نقل إدارة الحالة خارج مكونات الواجهة إلى مخازن بيانات مركزية.

سنتعلم في هذا الجزء كيفية استخدام مكتبة **[Zustand](https://zustand.docs.pmnd.rs/)**، وهي المكتبة الأحدث والأسرع والأكثر شعبية لإدارة الحالة في React متفوقة على Redux ببساطتها الفائقة وعدم حاجتها لكود زائد (Boilerplate).

كما سنتعرف على أدوات إدارة الحالة المدمجة مباشرة في React — مثل سياق React Context وخطاف `useReducer` — بالإضافة إلى مكتبة **[TanStack Query (React Query)](https://tanstack.com/query/latest)** المتخصصة في إدارة وتخزين ومزامنة حالة الخادم (Server State).

<i>تم تحديث هذا الجزء</i>
- <i>الاعتماد الكامل على مكتبة Zustand الحديثة بدلاً من Redux التقليدي</i>
- <i>إدارة حالة الخادم الاحترافية عبر TanStack React Query</i>
- <i>استخدام useReducer مع React Context</i>

</div>
