#!/usr/bin/env node

/**
 * سكربت فحص جودة الترجمة والالتزام بالمعجم المعتمد وسلامة وسوم الماركداون
 */

const fs = require('fs');
const path = require('path');

const GLOSSARY_RULES = [
  { term: 'Props', regex: /\b(البروبس|البروبز)\b/gi, suggestion: 'الخصائص (Props)' },
  { term: 'State', regex: /\b(الستيت)\b/gi, suggestion: 'الحالة (State)' },
  { term: 'Hook', regex: /\b(الهوك|الهوكس|المعالق)\b/gi, suggestion: 'الخطاف / الخطافات (Hooks)' },
  { term: 'Render', regex: /\b(الرندر|الرندرة|الرندارينج)\b/gi, suggestion: 'التصيير (Rendering)' },
  { term: 'Bundler', regex: /\b(الباندلر|الباندلينج)\b/gi, suggestion: 'مجمّع الشيفرات (Bundler)' },
  { term: 'Destructuring', regex: /\b(الديستركتشرينج|الهدم)\b/gi, suggestion: 'تفكيك الكائنات (Destructuring)' },
  { term: 'Middleware', regex: /\b(الميدلوير|ميدل وير)\b/gi, suggestion: 'الوسيط (Middleware)' },
  { term: 'Mutation', regex: /\b(الميوتيشن)\b/gi, suggestion: 'الطفرة (Mutation)' },
];

function findArabicMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        findArabicMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md') && filePath.includes(path.sep + 'ar' + path.sep)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function lintFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];
  const warnings = [];

  // 1. فحص إغلاق كتل الأكواد
  const codeFences = (content.match(/```/g) || []).length;
  if (codeFences % 2 !== 0) {
    errors.push('توجد كتلة كود (Code block ```) غير مغلقة بشكل صحيح.');
  }

  // 2. فحص تطابق وسوم div
  const openDivs = (content.match(/<div/g) || []).length;
  const closeDivs = (content.match(/<\/div>/g) || []).length;
  if (openDivs !== closeDivs) {
    errors.push(`عدم تطابق في وسوم <div> (المفتوحة: ${openDivs}، المغلقة: ${closeDivs}).`);
  }

  // 3. فحص المعجم (مع استبعاد الأكواد)
  const textWithoutCode = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '');

  GLOSSARY_RULES.forEach((rule) => {
    const matches = textWithoutCode.match(rule.regex);
    if (matches) {
      warnings.push(`مصطلح غير معتمد "${matches[0]}". يُرجى استخدام: "${rule.suggestion}".`);
    }
  });

  return { errors, warnings };
}

function run() {
  console.log('🔍 جاري فحص ملفات الترجمة العربية والتأكد من المعجم والتنسيق...');
  const rootDir = process.cwd();
  const files = findArabicMarkdownFiles(rootDir);

  let totalErrors = 0;
  let totalWarnings = 0;

  files.forEach((file) => {
    const relativePath = path.relative(rootDir, file);
    const { errors, warnings } = lintFile(file);

    if (errors.length > 0 || warnings.length > 0) {
      console.log(`\n📄 الملف: ${relativePath}`);
      errors.forEach((err) => {
        console.error(`  ❌ خطأ: ${err}`);
        totalErrors++;
      });
      warnings.forEach((warn) => {
        console.warn(`  ⚠️ تنبيه معجمي: ${warn}`);
        totalWarnings++;
      });
    }
  });

  console.log('\n========================================');
  console.log(`📊 ملخص الفحص: ${files.length} ملف تم فحصه.`);
  console.log(`❌ إجمالي الأخطاء: ${totalErrors}`);
  console.log(`⚠️ إجمالي التنبيهات المعجمية: ${totalWarnings}`);
  console.log('========================================');

  if (totalErrors > 0) {
    console.error('\n🚨 فشل الفحص لوجود أخطاء هيكلية في ملفات الماركداون.');
    process.exit(1);
  } else {
    console.log('\n✅ جميع الملفات متوافقة وسليمة!');
    process.exit(0);
  }
}

run();

