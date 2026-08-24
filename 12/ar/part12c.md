---
mainImage: ../../../images/part-12.svg
part: 12
letter: c
lang: ar
---

<div class="content">

سنتعلم في هذا القسم كيفية تنسيق وإدارة الأنظمة الموزعة متعددة الخدمات (Multi-container Architecture) باستخدام **[Docker Compose](https://docs.docker.com/compose/)**، وربط قواعد البيانات (MongoDB)، وذاكرة التخزين المؤقت (Redis)، وخادم البروكسي العكسي (**Nginx**) في بيئة تشغيل موحدة بأمر واحد: `docker compose up`.

---

### ملف التنسيق الموحد: `compose.yaml` (أو `docker-compose.yml`)

```yaml
services:
  app-frontend:
    build:
      context: ./frontend
      dockerfile: dev.Dockerfile
    volumes:
      - ./frontend:/usr/src/app
    ports:
      - "3000:3000"
    container_name: notes-frontend

  app-backend:
    build:
      context: ./backend
      dockerfile: dev.Dockerfile
    volumes:
      - ./backend:/usr/src/app
    environment:
      - REDIS_URL=redis://redis-db:6379
      - MONGO_URL=mongodb://root:example@mongo-db:27017/the_database?authSource=admin
    ports:
      - "3001:3001"
    depends_on:
      - redis-db
      - mongo-db
    container_name: notes-backend

  redis-db:
    image: redis:7.0-alpine
    container_name: redis-cache

  mongo-db:
    image: mongo:6.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    volumes:
      - mongo_data:/data/db
    container_name: mongo-database

  nginx:
    image: nginx:1.201-alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "8080:80"
    depends_on:
      - app-frontend
      - app-backend

volumes:
  mongo_data:
```

---

### تكوين خادم البروكسي العكسي (Nginx Reverse Proxy)

يتيح خادم Nginx توجيه كافة الطلبات القادمة إلى المنفذ `80` بحيث تذهب طلبات الواجهة إلى حاوية `app-frontend` وطلبات الـ API إلى حاوية `app-backend`:

```nginx
# nginx.conf
events { }

http {
  server {
    listen 80;

    location / {
      proxy_pass http://app-frontend:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
    }

    location /api/ {
      proxy_pass http://app-backend:3001/;
    }
  }
}
```

---

### أوامر تشغيل وإدارة Docker Compose

- **تشغيل كافة الخدمات في الخلفية**:
  ```bash
  docker compose up -d
  ```
- **إعادة بناء الصور وتشغيلها**:
  ```bash
  docker compose up --build
  ```
- **عرض سجلات الحاويات المباشرة**:
  ```bash
  docker compose logs -f
  ```
- **إيقاف وحذف الحاويات والشبكات**:
  ```bash
  docker compose down
  ```
- **إيقاف وحذف الحاويات مع مسح وسائط التخزين (Volumes)**:
  ```bash
  docker compose down -v
  ```

</div>

<div class="tasks">

<h3>التمارين 12.12 - 12.22: تنسيق نظام التطبيقات المتكامل مع Docker Compose</h3>

<h4>12.12: عداد الزيارات مع Redis (Redis visit counter)</h4>
أضف مساراً في الخادم الخلفي يستخدم قاعدة بيانات Redis لحساب وزيادة عدد مرات زيارة التطبيق (`/api/statistics`).

<h4>12.13: ربط الواجهة والخادم عبر Docker Compose (Connecting frontend & backend)</h4>
اكتب ملف `compose.yaml` لتشغيل حاوية الواجهة والخادم معاً وضبط بيئة التطوير الحية بالربط المباشر.

<h4>12.14: إضافة قاعدة بيانات MongoDB (MongoDB in compose)</h4>
أضف خدمة MongoDB في ملف Compose مع تحديد وسيط تخزين دائم `volumes` للحفاظ على بيانات الملاحظات عند إعادة تشغيل الحاوية.

<h4>12.15: تهيئة الخادم البروكسي العكسي Nginx (Configuring Nginx)</h4>
اضبط خادم Nginx لتوجيه مسار الجذر `/` للواجهة ومسار `/api/` للخادم الخلفي تحت منفذ موحد.

<h4>12.16: بيئة الإنتاج في Docker Compose (Production compose setup)</h4>
اكتب ملف `compose.prod.yaml` لتشغيل النسخة الإنتاجية المبنية بالكامل عبر Nginx.

<h4>12.17: تطبيق قائمة المدونات مع Docker Compose (Bloglist app with Compose)</h4>
انسخ تطبيق قائمة المدونات وأنشئ ملفات `Dockerfile` و `compose.yaml` لتشغيل الواجهة والخادم وقاعدة البيانات بنقرة واحدة.

<h4>12.18: بيئة التطوير والإنتاج لتطبيق المدونات</h4>
تأكد من دعم تطبيق المدونات لبيئة التطوير الحية وبيئة الإنتاج فائقة الأداء في الحاويات.

<h4>12.19: تطبيق السجلات الطبية Patientor في الحاويات</h4>
قم بتغليف خادم وواجهة تطبيق Patientor في حاويات Docker Compose.

<h4>12.20: تطبيق الطرائف الموجهة أو Pokedex</h4>
شغل أحد تطبيقاتك السابقة في حاوية مخصصة وأدرجه في نظام Compose.

<h4>12.21: فحص وتحسين استهلاك الموارد</h4>
استخدم `docker stats` لمراقبة استهلاك الذاكرة والمعالج لكل حاوية وتحسين الأداء.

<h4>12.22: التوثيق الشامل في README</h4>
اكتب دليلاً واضحاً في ملف `README.md` يوضح خطوات تشغيل المشروع بالكامل بأمر `docker compose up`.

هذا هو التمرين الأخير في الجزء الثاني عشر. ارفع حلولك إلى GitHub وسجل إنجازك في نظام المتابعة.

</div>
