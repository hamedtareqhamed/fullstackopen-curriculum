---
mainImage: ../../../images/part-10.svg
part: 10
letter: b
lang: ar
---

<div class="content">

سنتعلم في هذا القسم بناء واجهات مستخدم متقدمة في React Native باستخدام مكون القوائم عالي الأداء **`FlatList`**، وبناء شريط التنقل العلوي **`AppBar`**، والتنقل بين الشاشات عبر **`React Router Native`**، وإدارة النماذج والتحقق من صحتها عبر **`Formik`** و **`Yup`**.

---

### القوائم عالية الأداء: مكون `FlatList`

لتصيير القوائم الكبيرة بكفاءة واستهلاك ذاكرة منخفض، نستخدم مكون **`FlatList`** المدمج الذي يصيّر فقط العناصر الظاهرة على الشاشة (Virtualization):

```jsx
import { FlatList, View, StyleSheet } from 'react-native';
import RepositoryItem from './RepositoryItem';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryList = ({ repositories }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <RepositoryItem item={item} />}
      keyExtractor={item => item.id}
    />
  );
};

export default RepositoryList;
```

---

### التنقل والتوجيه مع React Router Native

نثبت حزمة التوجيه المخصصة لـ React Native:

```bash
npm install react-router-native
```

في `src/components/Main.jsx`:

```jsx
import { Route, Routes, Navigate } from 'react-router-native';
import { View, StyleSheet } from 'react-native';
import RepositoryList from './RepositoryList';
import AppBar from './AppBar';
import SignIn from './SignIn';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: '#e1e4e8',
  },
});

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<RepositoryList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;
```

---

### بناء شريط التطبيق العلوي `AppBar` مع التمرير الأفقي

```jsx
import { View, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#24292e',
    flexDirection: 'row',
  },
  tab: {
    padding: 15,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
  }
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={{ flexDirection: 'row' }}>
        <Link to="/" style={styles.tab}>
          <Text style={styles.text}>المستودعات</Text>
        </Link>
        <Link to="/signin" style={styles.tab}>
          <Text style={styles.text}>تسجيل الدخول</Text>
        </Link>
      </ScrollView>
    </View>
  );
};

export default AppBar;
```

---

### إدارة النماذج والتحقق من صحتها مع Formik و Yup

```bash
npm install formik yup
```

```jsx
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Text from './Text';

const validationSchema = yup.object().shape({
  username: yup.string().required('اسم المستخدم مطلوب'),
  password: yup.string().required('كلمة المرور مطلوبة'),
});

const SignInForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema,
    onSubmit,
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="اسم المستخدم"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        style={[styles.input, formik.touched.username && formik.errors.username && styles.errorInput]}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}

      <TextInput
        placeholder="كلمة المرور"
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        style={[styles.input, formik.touched.password && formik.errors.password && styles.errorInput]}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}

      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>تسجيل الدخول</Text>
      </Pressable>
    </View>
  );
};
```

</div>

<div class="tasks">

<h3>التمارين 10.3 - 10.10: قائمة المستودعات والتنقل والنماذج</h3>

<h4>10.3: قائمة المستودعات المراجعة (Reviewed repositories list)</h4>
استخدم مكون `FlatList` لعرض تفاصيل المستودعات (الاسم، والوصف، واللغة، وعدد النجوم، والتقييم، والشوكات Forks).

<h4>10.4: شريط التطبيق العلوي (AppBar component)</h4>
أنشئ شريط التنقل العلوي `AppBar` مع دعم التمرير الأفقي على الشاشات الصغيرة.

<h4>10.5: مكون النصوص المخصص ونظام السمة (Custom Text component & theme)</h4>
ابنِ مكون `Text` مخصص يطبق أنماط السمة المشتركة (الألوان، وأوزان الخطوط، والأحجام) لتفادي تكرار الأنماط.

<h4>10.6: تنسيق بطاقة المستودع (Repository item card)</h4>
نسق بطاقة المستودع لتظهر صورة مالك المستودع (Avatar)، وشارة لغة البرمجة، وإحصائيات النجوم والمراجعات بصيغة الآلاف (مثل `21.5k`).

<h4>10.7: التنقل بين الشاشات (Routing with React Router Native)</h4>
اضبط التوجيه بين شاشة قائمة المستودعات وشاشة تسجيل الدخول `SignIn` باستخدام `react-router-native`.

<h4>10.8: نموذج تسجيل الدخول مع Formik (Sign-in form)</h4>
ابنِ شاشة تسجيل الدخول باستخدام `Formik` والتقط الأحداث عبر `onChangeText`.

<h4>10.9: التحقق من صحة مدخلات الدخول مع Yup (Sign-in form validation)</h4>
أضف قواعد التحقق عبر `Yup` واعرض رسائل الخطأ باللون الأحمر تحت الحقول عند تركها فارغة.

<h4>10.10: التمرير الأفقي للألسنة (Horizontal scrollview for AppBar)</h4>
تأكد من قابلية شريط التطبيق العلوي للتمرير بسلاسة أفقياً دون اقتطاع النصوص على الشاشات الضيقة.

</div>
