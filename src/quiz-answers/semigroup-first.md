## 문제

다음 세미그룹 예시는 법칙을 만족하나요?

```ts
import { Semigroup } from 'fp-ts/Semigroup'

/** 항상 첫 번째 인자를 반환 */
const first = <A>(): Semigroup<A> => ({
  concat: (first, _second) => first
})
```

## 정답

만족합니다.

- `first`, `second`와 `concat`의 결과(`first`)는 모두 동일한 `A` 타입입니다.
- `concat`은 결합법칙을 만족합니다.
  - `concat(concat(first, second), third)`는 `concat(first, third)`로 평가된 다음 `first`로 평가됩니다.
  - `concat(first, concat(second, third))`는 `concat(first, second)`로 평가된 다음 `first`로 평가됩니다.
