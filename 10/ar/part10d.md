---
mainImage: ../../../images/part-10.svg
part: 10
letter: d
lang: ar
---

<div class="content">

سنتعلم في هذا القسم اختبار تطبيقات الهاتف باستخدام **React Native Testing Library** و **Jest**، وإضافة شاشة تفاصيل المستودع المستقل، وكتابة المراجعات، والتسجيل، والفرز والبحث، والتمرير اللانهائي **(Infinite Scrolling)** باستخدام **`fetchMore`**.

---

### اختبار مكونات React Native مع Jest و Testing Library

نثبت حزم الاختبار:

```bash
npm install --save-dev jest jest-expo @testing-library/react-native @testing-library/jest-native
```

مثال لاختبار مكون القائمة:

```jsx
import { render, screen } from '@testing-library/react-native';
import { RepositoryListContainer } from '../../components/RepositoryList';

describe('RepositoryList', () => {
  it('renders repository information correctly', () => {
    const repositories = {
      edges: [
        {
          node: {
            id: 'jaredpalmer.formik',
            fullName: 'jaredpalmer/formik',
            description: 'Build forms in React, without the tears',
            language: 'TypeScript',
            forksCount: 1619,
            stargazersCount: 21856,
            ratingAverage: 88,
            reviewCount: 3,
            ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
          },
        },
      ],
    };

    render(<RepositoryListContainer repositories={repositories} />);

    expect(screen.getByText('jaredpalmer/formik')).toBeDefined();
    expect(screen.getByText('Build forms in React, without the tears')).toBeDefined();
    expect(screen.getByText('TypeScript')).toBeDefined();
  });
});
```

---

### الفرز والبحث (Sorting and Filtering)

```jsx
import { Picker } from '@react-native-picker/picker';
import { Searchbar } from 'react-native-paper';
import { useDebounce } from 'use-debounce';

const RepositoryListHeader = ({ selectedOrder, setSelectedOrder, searchKeyword, setSearchKeyword }) => {
  return (
    <View>
      <Searchbar
        placeholder="ابحث في المستودعات..."
        onChangeText={setSearchKeyword}
        value={searchKeyword}
      />
      <Picker
        selectedValue={selectedOrder}
        onValueChange={(itemValue) => setSelectedOrder(itemValue)}
      >
        <Picker.Item label="أحدث المستودعات" value="LATEST" />
        <Picker.Item label="الأعلى تقييماً" value="RATING_DESC" />
        <Picker.Item label="الأقل تقييماً" value="RATING_ASC" />
      </Picker>
    </View>
  );
};
```

---

### التمرير اللانهائي (Infinite Scrolling) عبر `fetchMore`

```jsx
const useRepositories = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
    variables,
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;
    if (!canFetchMore) return;

    fetchMore({
      variables: {
        after: data.repositories.pageInfo.endCursor,
        ...variables,
      },
    });
  };

  return {
    repositories: data?.repositories,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
};
```

استخدامه داخل `FlatList` عبر `onEndReached`:

```jsx
<FlatList
  data={repositoryNodes}
  renderItem={({ item }) => <RepositoryItem item={item} />}
  onEndReached={onEndReach}
  onEndReachedThreshold={0.5}
/>
```

</div>

<div class="tasks">

<h3>التمارين 10.17 - 10.27: اختبار التطبيق وتوسيعه بالميزات المتقدمة</h3>

<h4>10.17: اختبار قائمة المستودعات (Testing repository list)</h4>
اكتب اختباراً باستخدام `React Native Testing Library` للتحقق من تصيير كافة تفاصيل المستودع وأرقامه بدقة.

<h4>10.18: اختبار نموذج تسجيل الدخول (Testing sign in form)</h4>
اكتب اختباراً يتحقق من استدعاء دالة `onSubmit` بالقيم المدخلة الصحيحة عند الضغط على زر تسجيل الدخول.

<h4>10.19: شاشة المستودع الفردي (Single repository view)</h4>
أضف شاشة جديدة `/repository/:id` تفتح عند النقر على أي مستودع وتعرض زراً لفتحه مباشرة في متصفح الهاتف عبر `Linking.openURL`.

<h4>10.20: قائمة مراجعات المستودع (Repository reviews list)</h4>
اعرض قائمة بكافة المراجعات والتقييمات الخاصة بالمستودع في شاشة تفاصيل المستودع.

<h4>10.21: إنشاء مراجعة جديدة (Create a review form)</h4>
ابنِ نموذجاً يتيح للمستخدم المسجل إضافة تقييم ومراجعة نصية لأي مستودع على GitHub عبر طفرة `CREATE_REVIEW`.

<h4>10.22: تسجيل مستخدم جديد (Sign up form)</h4>
ابنِ شاشة تسجيل حساب جديد `/signup` تطلب اسم المستخدم وتأكيد كلمة المرور، ثم تقوم بتسجيل دخوله وتوجيهه تلقائياً لقائمة المستودعات.

<h4>10.23: فرز المستودعات (Sorting repositories)</h4>
أضف قائمة اختيار (Picker) لفرز المستودعات حسب: الأحدث، أو الأعلى تقييماً، أو الأقل تقييماً.

<h4>10.24: البحث في المستودعات (Filtering repositories with debounce)</h4>
أضف حقل بحث واستخدم خطاف `useDebounce` لتجنب إرسال طلبات متتالية عند كل ضغطة زر أثناء الكتابة.

<h4>10.25: صفحة مراجعاتي (User reviews view)</h4>
أضف شاشة تعرض كافة المراجعات التي كتبها المستخدم الحالي مع زر لفتح المستودع وزر لحذف المراجعة.

<h4>10.26: حذف المراجعة مع نافذة تأكيد (Delete review with Alert.alert)</h4>
أضف نافذة تأكيد أصلية `Alert.alert` عند رغبة المستخدم في حذف مراجعته، ونفذ طفرة `DELETE_REVIEW`.

<h4>10.27: التمرير اللانهائي (Infinite scrolling)</h4>
طبق ميزة التمرير اللانهائي في قائمة المستودعات وقوائم المراجعات باستخدام `relayStylePagination` و `fetchMore` و `onEndReached`.

هذا هو التمرين الأخير في الجزء العاشر. ارفع حلولك إلى GitHub وسجل إنجازك في نظام التسليم.

</div>
