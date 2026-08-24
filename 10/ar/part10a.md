---
mainImage: ../../../images/part-10.svg
part: 10
letter: a
lang: ar
---

<div class="content">

سنتعرف في هذا القسم على إطار العمل **[React Native](https://reactnative.dev/)** وكيف يختلف تطوير تطبيقات الهواتف عن تطبيقات الويب، وسنبدأ بتهيئة بيئة **[Expo](https://expo.dev/)** وبناء المكونات الأصلية الأولى وتنسيقها بنظام **Flexbox**.

---

### ما هو React Native؟

على عكس تطبيقات الويب التي تُصيّر عناصر الـ DOM في المتصفح، يقوم React Native بترجمة مكونات React إلى **مكونات واجهة مستخدم أصلية حقيقية (Native UI Widgets)** تعمل مباشرة على نظامي Android و iOS.

- بدلاً من `<div>` نستخدم **`<View>`**.
- بدلاً من `<p>` أو `<h1>` نستخدم **`<Text>`**.
- بدلاً من `<input>` نستخدم **`<TextInput>`**.
- بدلاً من `<button>` نستخدم **`<Pressable>`** أو `<TouchableOpacity>`.

---

### بيئة التطوير السريعة: Expo CLI

تُعد Expo المنصة القياسية لتطوير تطبيقات React Native بسهولة دون الحاجة لتثبيت Android Studio أو Xcode في البداية:

```bash
npx create-expo-app rate-repository-app --template blank
cd rate-repository-app
npm start
```

يمكنك مسح رمز الاستجابة السريعة (QR Code) باستخدام تطبيق **Expo Go** على هاتفك الذكي لمعاينة التطبيق وتحديثه فورياً عند حفظ أي تعديل (Fast Refresh).

---

### نظام التنسيق مع StyleSheet و Flexbox

في React Native، لا توجد ملفات CSS خارجية. بدلاً من ذلك، نستخدم كائن **`StyleSheet.create`**:

```jsx
import { View, Text, StyleSheet, Pressable } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e1e4e8',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#24292e',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0366d6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

const HelloWorld = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>مرحباً بك في تطبيق React Native!</Text>
      <Pressable style={styles.button} onPress={() => alert('تم النقر!')}>
        <Text style={styles.buttonText}>اضغط هنا</Text>
      </Pressable>
    </View>
  );
};

export default HelloWorld;
```

**ملاحظة هامة**: في React Native، القيمة الافتراضية لخاصية `flexDirection` هي `'column'` (وليس `'row'` كما في المتصفح).

</div>

<div class="tasks">

<h3>التمارين 10.1 - 10.2: إعداد مشروع Expo ومكونات العرض الأساسية</h3>

<h4>10.1: تهيئة المشروع وتطبيق Expo Go (Initializing the project)</h4>
أنشئ مشروع Expo جديد باسم `rate-repository-app` وافتحه وعاينه على هاتفك الحقيقي باستخدام تطبيق Expo Go أو على المحاكي.

<h4>10.2: إنشاء مكون قائمة المستودعات المبدئي (Repository list component)</h4>
أنشئ مكون `RepositoryList` واستخدم المكونات الأصلية `View` و `Text` لعرض بيانات تجريبية لمستودعات GitHub.

</div>
