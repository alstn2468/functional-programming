## 문제

다음 세미그룹 예시는 법칙을 만족하나요?

```ts
import { Semigroup } from 'fp-ts/Semigroup'

/** 항상 두 번째 인자를 반환 */
const last = <A>(): Semigroup<A> => ({
  concat: (_first, second) => second
})
```

## 정답

만족합니다.

- `first`, `second`와 `concat`의 결과(`second`)는 모두 동일한 `A` 타입입니다.
- `concat`은 결합법칙을 만족합니다.
  - `concat(concat(first, second), third)`는 `concat(second, third)`로 평가된 다음 `third`로 평가됩니다.
  - `concat(first, concat(second, third))`는 `concat(first, third)`로 평가된 다음 `third`로 평가됩니다.
