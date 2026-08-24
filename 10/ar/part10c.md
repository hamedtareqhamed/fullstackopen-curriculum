---
mainImage: ../../../images/part-10.svg
part: 10
letter: c
lang: ar
---

<div class="content">

سنتعلم في هذا القسم الاتصال بالخادم في تطبيقات React Native، واستخدام **Apollo Client** لجلب وتعديل بيانات GraphQL، وحفظ رموز المصادقة (Tokens) محلياً في ذاكرة الهاتف الدائمة باستخدام **`AsyncStorage`**، وإدارة متغيرات البيئة عبر **Expo Constants**.

---

### الاتصال بالخادم عبر Apollo Client في React Native

نثبت مكتبة Apollo Client وحزمة التخزين الدائم للهاتف:

```bash
npm install @apollo/client graphql @react-native-async-storage/async-storage
```

نُنشئ صنف التخزين `src/utils/authStorage.js`:

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace;
  }

  async getAccessToken() {
    const token = await AsyncStorage.getItem(`${this.namespace}:token`);
    return token ? JSON.parse(token) : null;
  }

  async setAccessToken(accessToken) {
    await AsyncStorage.setItem(
      `${this.namespace}:token`,
      JSON.stringify(accessToken)
    );
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem(`${this.namespace}:token`);
  }
}

export default AuthStorage;
```

---

### تهيئة عميل Apollo مع إرفاق الرمز التلقائي

```js
// src/utils/apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Constants from 'expo-constants';

const httpLink = createHttpLink({
  uri: Constants.expoConfig.extra.apolloUri,
});

const createApolloClient = (authStorage) => {
  const authLink = setContext(async (_, { headers }) => {
    try {
      const accessToken = await authStorage.getAccessToken();
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    } catch (e) {
      console.error(e);
      return { headers };
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
```

---

### إدارة متغيرات البيئة في Expo (`app.config.js`)

نُنشئ ملف `app.config.js` في جذر المشروع:

```js
import 'dotenv/config';

export default {
  expo: {
    name: 'rate-repository-app',
    slug: 'rate-repository-app',
    version: '1.0.0',
    extra: {
      apolloUri: process.env.APOLLO_URI || 'http://192.168.1.100:5000/graphql',
    },
  },
};
```

---

### خطاف تسجيل الدخول المخصص `useSignIn`

```js
import { useMutation, useApolloClient } from '@apollo/client';
import { AUTHENTICATE } from '../graphql/mutations';
import useAuthStorage from '../hooks/useAuthStorage';

const useSignIn = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const [mutate, result] = useMutation(AUTHENTICATE);

  const signIn = async ({ username, password }) => {
    const { data } = await mutate({
      variables: { credentials: { username, password } }
    });

    if (data?.authenticate?.accessToken) {
      await authStorage.setAccessToken(data.authenticate.accessToken);
      await apolloClient.resetStore();
    }

    return data;
  };

  return [signIn, result];
};

export default useSignIn;
```

---

### تسجيل الخروج وتحديث الواجهة

```jsx
const signOut = async () => {
  await authStorage.removeAccessToken();
  await apolloClient.resetStore();
};
```

</div>

<div class="tasks">

<h3>التمارين 10.11 - 10.16: الاتصال بخادم GraphQL والمصادقة</h3>

<h4>10.11: جلب المستودعات من GraphQL (Fetching repositories with Apollo)</h4>
استبدل البيانات الوهمية في قائمة المستودعات باستعلام GraphQL `GET_REPOSITORIES` عبر Apollo Client.

<h4>10.12: متغيرات البيئة (Environment variables)</h4>
اضبط عنوان خادم GraphQL في ملف `.env` و `app.config.js` واقرأه عبر `Constants.expoConfig.extra`.

<h4>10.13: طفرة تسجيل الدخول (Sign in mutation)</h4>
عرف طفرة `AUTHENTICATE` وأنشئ خطاف `useSignIn` لتنفيذ تسجيل الدخول وإرجاع رمز الوصول `accessToken`.

<h4>10.14: حفظ الرمز في AsyncStorage (Storing the token)</h4>
احفظ رمز الدخول في التخزين الدائم للجهاز باستخدام صنف `AuthStorage` ومرره لسياق Apollo Client.

<h4>10.15: تسجيل الخروج (Sign out)</h4>
أضف زر تسجيل الخروج في شريط التطبيق العلوي `AppBar` لحذف الرمز وتصفير كاش Apollo.

<h4>10.16: استعلام المستخدم الحالي (Me query)</h4>
استخدم استعلام `ME` للتحقق من هوية المستخدم المسجل وتبديل زر الدخول بزري "مراجعاتي" و "تسجيل الخروج".

</div>
