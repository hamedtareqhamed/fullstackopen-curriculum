---
mainImage: ../../../images/part-11.svg
part: 11
letter: c
lang: ar
---

<div class="content">

سنتعلم في هذا القسم أتمتة عملية **النشر إلى السحابة (Cloud Deployment)** عبر GitHub Actions لمنصات مثل **[Fly.io](https://fly.io/)** أو **[Render](https://render.com/)**، وإجراء فحوصات السلامة **(Health Checks)** والتراجع التلقائي.

---

### أسرار المستودع (GitHub Secrets)

لا تضع أبداً كلمات المرور أو مفاتيح الـ API أو رموز الوصول داخل ملفات مسار العمل YAML! بدلاً من ذلك، خزنها في إعدادات المستودع **Settings -> Secrets and variables -> Actions**:

```yaml
env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

---

### خطوة النشر الآمن المشروط (Conditional Deployment)

نريد تنفيذ النشر **فقط** عند دمج الكود في فرع `main` وليس أثناء فتح Pull Requests، وفقط عند عدم احتواء رسالة الكوميت على كلمة `#skip`:

```yaml
      - name: Deploy to Fly.io
        if: ${{ github.event_name == 'push' && !contains(toJson(github.event.commits.*.message), '#skip') }}
        uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        if: ${{ github.event_name == 'push' && !contains(toJson(github.event.commits.*.message), '#skip') }}
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

---

### فحص صحة التطبيق (Health Checks)

نُنشئ مسار فحص الصحة في الخادم:

```js
app.get('/health', (req, res) => {
  res.send('ok');
});
```

ونختبره في خط الأنابيب فور انتهاء النشر للتأكد من جاهزية التطبيق لاستقبال الزوار:

```yaml
      - name: Check application health
        uses: jtalk/url-health-check-action@v4
        with:
          url: https://my-pokedex-app.fly.dev/health
          max-attempts: 3
          retry-delay: 5s
```

</div>

<div class="tasks">

<h3>التمارين 11.10 - 11.12: النشر التلقائي وفحص الصحة</h3>

<h4>11.10: النشر إلى السحابة (Deploy to Fly.io / Render)</h4>
أضف خطوة النشر التلقائي لتطبيق Pokedex إلى منصة Fly.io أو Render عبر مسار GitHub Actions.

<h4>11.11: نقطة نهاية فحص الصحة (Health check endpoint)</h4>
أضف مسار `GET /health` في التطبيق يُرجع الاستجابة `"ok"`، واستخدم إجراء `jtalk/url-health-check-action` للتحقق من عمل الخادم بعد النشر.

<h4>11.12: النشر المشروط وتخطي النشر (Skip deployment with #skip)</h4>
اضبط شروط النشر بحيث يتخطى خط الأنابيب مرحلة النشر إذا كانت رسالة الكوميت تحتوي على الرمز `#skip` (مثلاً: `docs: update readme #skip`).

</div>

