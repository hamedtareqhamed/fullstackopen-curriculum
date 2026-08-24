#!/usr/bin/env node

/**
 * سكربت فحص وتتبع كوميتات جامعة هلسنكي الأصلية وإنشاء Issues للمترجمين
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const STATE_FILE = path.join(__dirname, '..', '.github', 'upstream-tracking.json');

function httpsGet(url, token) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'FullStackOpen-Arabic-Sync-Bot',
      Accept: 'application/vnd.github.v3+json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function httpsPost(url, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsedUrl = new URL(url);

    const req = https.request(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'User-Agent': 'FullStackOpen-Arabic-Sync-Bot',
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(resData));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${resData}`));
          }
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  const isDryRun = process.argv.includes('--dry-run');
  const token = process.env.GITHUB_TOKEN;

  if (!fs.existsSync(STATE_FILE)) {
    console.error('ملف التتبع غير موجود:', STATE_FILE);
    process.exit(1);
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  console.log(`🔎 فحص التحديثات من: ${state.upstreamRepo} (الفرع: ${state.upstreamBranch})`);
  console.log(`📌 آخر كوميت تم تتبعه: ${state.lastSyncedCommit.substring(0, 7)}`);

  try {
    const commitsUrl = `https://api.github.com/repos/${state.upstreamRepo}/commits?sha=${state.upstreamBranch}&per_page=20`;
    const commits = await httpsGet(commitsUrl, token);

    const baseIndex = commits.findIndex(
      (c) => c.sha.startsWith(state.lastSyncedCommit) || state.lastSyncedCommit.startsWith(c.sha)
    );

    const newCommits = baseIndex !== -1 ? commits.slice(0, baseIndex) : commits;

    if (newCommits.length === 0) {
      console.log('✅ المنهج متزامن تماماً! لا توجد كوميتات جديدة من جامعة هلسنكي.');
      process.exit(0);
    }

    console.log(`⚡ تم رصد ${newCommits.length} كوميت جديد بحاجة للفحص!`);

    for (const commit of newCommits.reverse()) {
      const commitSha = commit.sha;
      const shortSha = commitSha.substring(0, 7);
      const commitTitle = commit.commit.message.split('\n')[0];

      // جلب تفاصيل الكوميت والملفات المتأثرة
      const detailUrl = `https://api.github.com/repos/${state.upstreamRepo}/commits/${commitSha}`;
      const details = await httpsGet(detailUrl, token);

      const affectedContentFiles = (details.files || []).filter(
        (f) => f.filename.includes('/en/') || f.filename.includes('pages/')
      );

      if (affectedContentFiles.length === 0) {
        console.log(`⏩ تم تخطي الكوميت ${shortSha} (لا يحتوي على تعديلات في نصوص المنهج الإنجليزي).`);
        state.lastSyncedCommit = commitSha;
        continue;
      }

      console.log(`📝 معالجة الكوميت: ${shortSha} - ${commitTitle} (${affectedContentFiles.length} ملف متأثر)`);

      const issueTitle = `🔄 [تحديث المنهج]: ${commitTitle} (${shortSha})`;
      const issueBody = `## 📢 تحديث جديد من مستودع جامعة هلسنكي الأصلي

- **الكوميت الأصلي**: [${shortSha}](${commit.html_url})
- **الكاتب**: ${commit.commit.author.name}
- **التاريخ**: ${commit.commit.author.date}
- **رسالة الكوميت**:
> ${commit.commit.message}

---

### 📂 الملفات الإنجليزية المعدلة:
${affectedContentFiles.map((f) => `- \`${f.filename}\` (${f.status}) [+${f.additions} / -${f.deletions}]`).join('\n')}

---

### 🛠️ الفروقات والتغييرات المطلوبة (Diff):
<details>
<summary><b>اضغط هنا لمعاينة كود التعديلات (Git Diff)</b></summary>

\`\`\`diff
${affectedContentFiles.map((f) => f.patch || '// تعديل ثنائي أو ملف كبير').join('\n\n')}
\`\`\`
</details>

---

### 🙋‍♂️ كيف تتكفل بهذه المهمة وترجمتها؟
إذا كنت ترغب بالقيام بترجمة هذا التعديل:
1. اكتب تعليقاً في هذا الـ Issue يحتوي على:
   \`\`\`
   .take
   \`\`\`
2. سيقوم البوت الآلي فوراً بتعيين هذه المهمة لك.
3. يمكنك استخدام **[محرر الماركداون المدمج في المنصة](http://localhost:8000/ar/contribute)** للتعديل السريع، أو إرسال Pull Request محلياً وكتابة \`Closes #${commitSha.substring(0, 4)}\` في الوصف ليتم إغلاق المهمة تلقائياً فور الدمج.
`;

      if (isDryRun) {
        console.log('\n--- [DRY RUN ISSUE PREVIEW] ---');
        console.log('Title:', issueTitle);
        console.log('Body:\n', issueBody.substring(0, 300) + '...\n');
      } else if (token && process.env.GITHUB_REPOSITORY) {
        console.log(`🚀 إنشاء Issue في المستودع: ${process.env.GITHUB_REPOSITORY}...`);
        const createIssueUrl = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues`;
        await httpsPost(
          createIssueUrl,
          {
            title: issueTitle,
            body: issueBody,
            labels: ['upstream-sync', 'help wanted', 'translation'],
          },
          token
        );
      }

      state.lastSyncedCommit = commitSha;
      state.lastCheckedAt = new Date().toISOString();
    }

    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    console.log('💾 تم تحديث ملف حالة التتبع بنجاح.');
  } catch (err) {
    console.error('❌ حدث خطأ أثناء فحص التحديثات:', err.message);
    process.exit(1);
  }
}

run();

