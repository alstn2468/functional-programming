## 문제

`concat`이 [**가환적**](https://en.wikipedia.org/wiki/Commutative_property)인 세미그룹 예시와 그렇지 않은 예시를 찾을 수 있나요?

## 정답

### 가환적인 예시

```ts
import { Semigroup } from 'fp-ts/Semigroup'

const SemigroupSum: Semigroup<number> = {
  concat: (first, second) => first + second
}
```

덧셈이 가환적이므로 `concat(a, b) = a + b = b + a = concat(b, a)`는 가환적이다.

### 가환적이지 않은 예시

```ts
import { Semigroup } from 'fp-ts/Semigroup'

const first = <A>(): Semigroup<A> => ({
  concat: (first, _second) => first
})
```

`concat(a, b) = a != concat(b, a)`
