---
mainImage: ../../../images/part-11.svg
part: 11
letter: e
lang: ar
---

<div class="content">

سنتعلم في هذا القسم الختامي من الجزء 11 كيفية إدارة **الإصدارات الدلالية (Semantic Versioning - SemVer)** تلقائياً، وإضافة وسوم Git التلقائية (Automated Tagging)، وإرسال إشعارات فورية بنجاح أو فشل النشر إلى قنوات **Discord** أو **Slack**.

---

### نظام الترقيم الدلالي (Semantic Versioning)

يتكون رقم الإصدار من ثلاثة أجزاء رئيسية: `MAJOR.MINOR.PATCH` (مثلاً `1.4.2`):
- **PATCH (التصحيح)**: عند إصلاح أخطاء برمجية دون كسر أي وظائف سابقة (`#patch`).
- **MINOR (الإضافة)**: عند إضافة ميزات جديدة متوافقة مع الإصدارات السابقة (`#minor`).
- **MAJOR (الترقية الكبرى)**: عند إجراء تغييرات جذرية غير متوافقة تكسر الشيفرات السابقة (`#major`).

---

### إضافة الوسوم التلقائية عبر `anothrNick/github-tag-action`

```yaml
      - name: Bump version and push tag
        if: ${{ github.event_name == 'push' && !contains(toJson(github.event.commits.*.message), '#skip') }}
        uses: anothrNick/github-tag-action@1.67.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          DEFAULT_BUMP: patch
          WITH_V: true
```

---

### إرسال التنبيهات إلى Discord أو Slack

عند نجاح أو فشل مسار العمل، يمكن إرسال رسالة فورية إلى قناة Discord عبر Webhook:

```yaml
      - name: Discord Notification
        uses: rjstone/discord-webhook-notify@v1
        if: always()
        with:
          severity: ${{ job.status == 'success' && 'info' || 'error' }}
          text: ${{ job.status == 'success' && 'تم نشر إصدار جديد بنجاح إلى بيئة الإنتاج!' || 'فشل بناء أو نشر خط الأنابيب!' }}
          webhookUrl: ${{ secrets.DISCORD_WEBHOOK }}
```

</div>

<div class="tasks">

<h3>التمارين 11.15 - 11.22: الإصدارات التلقائية والتنبيهات وخطوط الأنابيب للتطبيقات السابقة</h3>

<h4>11.15: الترقيم والوسم التلقائي للإصدارات (Automatic versioning and tagging)</h4>
أضف خطوة `anothrNick/github-tag-action` إلى مسار العمل لترقية رقم الإصدار وإضافة وسم Git تلقائياً عند دمج الكود في `main`.

<h4>11.16: الترقيم المخصص (Custom version bumps)</h4>
تأكد من أن كتابة `#minor` أو `#major` في رسالة الكوميت تقوم بترقية الإصدار وفقاً للنوع المطلوب بدلاً من `patch` الافتراضي.

<h4>11.17: تنبيهات ديسكورد أو سلاك (Discord / Slack notifications)</h4>
أضف خطوة لإرسال إشعار فوري إلى ديسكورد أو سلاك عند نجاح النشر يوضح رابط النسخة المنشورة، وإشعاراً باللون الأحمر عند فشل الاختبارات.

<h4>11.18: خط أنابيب تطبيق قائمة المدونات (Bloglist CI/CD pipeline)</h4>
أنشئ مسار عمل GitHub Actions متكامل لتطبيق قائمة المدونات من الأجزاء السابقة يفحص الكود ويجري الاختبارات وينشر التطبيق تلقائياً.

<h4>11.19: فحص واختبار تطبيق قائمة المدونات</h4>
أضف اختبارات Playwright الشاملة لمشروع المدونات إلى مسار العمل لضمان عدم حدوث أي أخطاء أثناء النشر.

<h4>11.20: خط أنابيب تطبيق السجلات الطبية أو يوميات الطيران (Patientor / Flight diaries CI)</h4>
ابنِ خط أنابيب CI/CD لتطبيق TypeScript (Patientor أو Flight Diaries) يتحقق من تصريف الأنواع واجتياز الاختبارات ونشر الخادم والواجهة.

<h4>11.21: حماية فرع main والمراجعة الإلزامية</h4>
فعل شرط مراجعة الكود الإلزامية واجتياز خط الأنابيب قبل دمج طلبات السحب في كافة مشاريعك السابقة.

<h4>11.22: تقرير التوثيق والملخص النهائي</h4>
وثق كيفية عمل خط الأنابيب في ملف `README.md` مع توضيح مراحل الفحص والاختبار والنشر والوسوم.

هذا هو التمرين الأخير في الجزء الحادي عشر. ارفع حلولك وسجل إنجازك في نظام المتابعة.

</div>

