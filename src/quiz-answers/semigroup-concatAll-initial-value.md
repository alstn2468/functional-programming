## 문제

정의에 따라 `concat`은 매번 `A`의 두 요소만 결합합니다. 여러 개를 결합하는 것이 가능할까요?

`concatAll` 함수는 다음을 받습니다.

- 세미그룹의 인스턴스
- 초기값
- 요소 배열

```ts
import * as S from 'fp-ts/Semigroup'
import * as N from 'fp-ts/number'

const sum = S.concatAll(N.SemigroupSum)(2)

console.log(sum([1, 2, 3, 4])) // => 12
```

초기 값을 제공해야 하는 이유는 무엇인가요?

## 정답

`concatAll` 메서드는 `A` 타입의 요소를 반환해야 합니다. 제공된 요소 배열이 비어 있으면 반환할 `A` 유형의 요소가 없습니다.
초기 값의 필요성을 강제하면 배열이 비어 있는 경우 이 초기 값을 반환할 수 있습니다.

또한 `NonEmptyArray<A>`를 사용하고 초기 값을 사용하지 않는 `concatAll` 메서드를 정의할 수도 있습니다. 실제로 구현하기가 매우 쉽습니다.

```ts
import * as Semigroup from 'fp-ts/Semigroup'
import * as NEA from 'fp-ts/NonEmptyArray'

const concatAll = <A>(S: Semigroup<A>) => (as: NEA<A>) =>
  Semigroup.concatAll(S)(NEA.tail(as))(NEA.head(as))
```
