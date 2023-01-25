## 문제

```ts
interface Nil {
  readonly _tag: 'Nil'
}

interface Cons<A> {
  readonly _tag: 'Cons'
  readonly head: A
  readonly tail: List<A>
}

export type List<A> = Nil | Cons<A>

export const match = <R, A>(
  onNil: () => R,
  onCons: (head: A, tail: List<A>) => R
) => (fa: List<A>): R => {
  switch (fa._tag) {
    case 'Nil':
      return onNil()
    case 'Cons':
      return onCons(fa.head, fa.tail)
  }
}

export const head = match(
  () => undefined,
  (head, _tail) => head
)
```

`head` API가 완벽하지 않은 이유는 무엇일까요?

## 정답

여기서 `head`의 문제는 공역(반환 유형)이 `A`(`List<A>`에서) 또는 `undefined`의 유형일 수 있다는 것입니다. 이 반환 타입으로 작업하는 것은 어려울 수 있으며 버그가 발생할 가능성이 높아집니다. 항상 같은 타입을 반환할 수 있다면 head 함수에서 가능한 두 가지 반환 타입을 처리하기 위해 두 개의 개별 코드를 작성할 필요가 없습니다.

사실, 우리는 이 예제와 다르게 항상 `match` 함수를 구현하여 동일한 타입을 반환합니다. 이 튜토리얼의 뒷부분에서 `A`(`List<A>`에서)와 `undefined`를 하나의 타입으로 모델링하는 방법을 배우게 됩니다.