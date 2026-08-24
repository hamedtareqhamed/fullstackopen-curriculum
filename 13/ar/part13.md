---
mainImage: ../../../images/part-13.svg
part: 13
lang: ar
---

<div class="intro">

سنتعلم في هذا الجزء كيفية استخدام **قواعد البيانات العلائقية (Relational Databases)** وتحديداً قاعدة بيانات **[PostgreSQL](https://www.postgresql.org/)** باستخدام مكتبة **[Sequelize ORM](https://sequelize.org/)** في بيئة Node.js.

على عكس قواعد بيانات المستندات (NoSQL مثل MongoDB)، تفرض قواعد البيانات العلائقية مخططاً صارماً للجداول (Tables) والأعمدة (Columns) وتدعم عمليات الربط المعقدة (Joins)، والقيود، والتعاملات الذرية (ACID Transactions).

سنغطي في هذا الجزء:
- المبادئ الجوهرية لقواعد البيانات العلائقية ولغة SQL.
- ربط Express بقاعدة بيانات PostgreSQL عبر Sequelize ORM.
- تعريف النماذج (Models) وتطبيق عمليات القراءة والكتابة (CRUD Operations).
- بناء العلاقات: واحد لمتعدد (1-to-N) ومتعدد لمتعدد (N-to-N) وجداول الربط (Join Tables).
- إدارة هجرة مخططات قواعد البيانات الاحترافية عبر أداة **[Umzug](https://github.com/sequelize/umzug)**.
- إدارة الجلسات النشطة وقوائم الحظر (Token Blacklisting) وإلغاء تنشيط المستخدمين.

</div>
