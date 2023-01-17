## 문제

```ts
import { Magma } from 'fp-ts/Magma'

const MagmaSub: Magma<number> = {
  concat: (first, second) => first - second
}
```

`concat`이 *닫혀있는* 작업이라는 사실은 사소한 내용이 아닙니다. 만약 `A`가 JavaScript의 숫자 타입(양수 및 음수 부동 집합)이 아닌 자연수 집합(양의 정수)인 우리가 구현한 `MagmaSub`와 같이 `concat`을 사용해 `Magma<Natural>`을 정의할 수 있을까요? `closure` 속성이 유효하지 않은 자연수에 대한 다른 `concat` 작업을 생각할 수 있을까요?

## 정답

자연수를 사용하면 빼기 연산으로 `Magma`를 정의할 수 없습니다. `b`가 `a`보다 큰 `a - b`는 자연수가 아닌 음수가 됩니다.

다음은 `closure` 속성이 유효하지 않은 자연수에 대한 `concat` 연산의 다른 예시입니다.

- `concat: (first, second) => first / second`
- `concat: (first, second) => (first + second) / 2`
