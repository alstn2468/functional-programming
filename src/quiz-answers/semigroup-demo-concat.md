## 문제

데모 [`01_retry.ts`](src/01_retry.ts)에 정의된 `concat` 결합자를 사용해 `RetryPolicy` 타입에 대한 `Semigroup` 인스턴스를 정의할 수 있을까요?

## 정답

네, 가능합니다. 세미그룹을 다음과 같이 정의해 보겠습니다.

```ts
import { Semigroup } from 'fp-ts/Semigroup'

const SemigroupRetryPolicy: Semigroup<RetryPolicy> = {
  concat: (first, second) => concat(first)(second)
}
```

모든 Semigroup 규칙을 준수합니다.

- `first`, `second`와 `concat`의 결과는 모두 동일한 타입인 `RetryPolicy`입니다.
- `concat`은 결합법칙을 만족합니다.

  3개의 `RetryPolicy` `first`, `second`, `third`와 `status`가 주어진다고 가정해봅시다.

  - `RetryPolicy` 중 하나라도 `undefined`를 반환하면 `concat(concat(first, second), third)(status)`와 `concat(first, concat(second, third))(status)` 모두 `undefined`가 됩니다.
  - 모든 `RetryPolicy`가 숫자를 반환하면 `concat(concat(first, second), third)(status)`는 `Math.max(Math.max(delay1, delay2), delay3)` 및 `concat(first, concat(second, third))(status)`는 `Math.max(delay1, Math.max(delay2, delay3))`입니다. `Math.max`는 결합법칙을 만족하므로 결과는 `delay1`, `delay2`, `delay3`의 최대값이 됩니다.
