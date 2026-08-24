---
mainImage: ../../../images/part-11.svg
part: 11
letter: d
lang: ar
---

<div class="content">

سنتعلم في هذا القسم استراتيجيات الحفاظ على خضار خط الأنابيب (Keeping the build green): تشغيل مسارات العمل المجدولة دورياً، وحماية الفروع، وإدارة طلبات السحب (Pull Requests) بصرامة، ومراقبة التبعيات القديمة والأمنية.

---

### مسارات العمل المجدولة (Cron Scheduled Workflows)

يمكن تشغيل مسار العمل تلقائياً وفق جدول زمني محدد دون الحاجة لأي كوميت يدوي (مثلاً لإجراء فحوصات أمان يومية أو فحص عمل الخادم كل صباح):

```yaml
name: Periodic Health Check

on:
  schedule:
    # يعمل كل يوم اثنين في الساعة 00:00 بتوقيت UTC
    - cron: '0 0 * * 1'

jobs:
  periodic_check:
    runs-on: ubuntu-latest
    steps:
      - name: Ping production server
        uses: jtalk/url-health-check-action@v4
        with:
          url: https://my-pokedex-app.fly.dev/health
```

---

### مسارات عمل طلبات السحب (Pull Request Workflows)

عند فتح أي Pull Request، يتم تشغيل مسار الفحص والاختبارات للتأكد من سلامة الكود المقترح قبل الموافقة على دمجه في الفرع الرئيسي:

```yaml
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize]
```

---

### شارات الحالة (Status Badges)

لإظهار شارة خضراء في ملف `README.md` تدل على نجاح خط الأنابيب:

```markdown
![الحالة](https://github.com/<username>/<repo>/actions/workflows/pipeline.yml/badge.svg)
```

</div>

<div class="tasks">

<h3>التمارين 11.13 - 11.14: طلبات السحب والمسارات المجدولة</h3>

<h4>11.13: مسار فحص دوري مجدول (Periodic workflow)</h4>
أنشئ مسار عمل منفصل `.github/workflows/periodic-check.yml` يُجري فحصاً صحياً للخادم المنشور على السحابة وفق جدول زمني محدد (مثل كل 24 ساعة).

<h4>11.14: شارة حالة البناء (Build status badge)</h4>
أضف شارة حالة مسار العمل (Workflow Badge) إلى ملف `README.md` في المستودع.

</div>
