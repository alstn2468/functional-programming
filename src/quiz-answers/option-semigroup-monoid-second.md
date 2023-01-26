## 문제

다음과 같이 동작하는 `Option<A>`에 대한 모노이드 인스턴스를 정의할 수 있습니다.

| x        | y        | concat(x, y)           |
| -------- | -------- | ---------------------- |
| none     | none     | none                   |
| some(a1) | none     | some(a1)               |
| none     | some(a2) | some(a2)               |
| some(a1) | some(a2) | some(S.concat(a1, a2)) |

```ts
// 구현은 독자의 연습 문제로 남겨둡니다.
declare const getMonoid: <A>(S: Semigroup<A>) => Monoid<Option<A>>
```

위 모노이드의 `empty` 요소는 무엇인가요?

## 정답

`none`은 모든 모노이드의 법칙이 참이기 때문에 모노이드의 empty 요소입니다. 새로운 모노이드에 대한 모노이드 법칙을 확인해 봅시다.

**결합법칙**
```ts
concat(none, concat(none, concat(none))) === concat(concat(none, none), none)
concat(none, concat(none, concat(some(z)))) === concat(concat(none, none), some(z))
concat(none, concat(some(y), concat(none))) === concat(concat(none, some(y)), none)
concat(none, concat(some(y), concat(some(z)))) === concat(concat(none, some(y)), some(z))
concat(some(x), concat(none, concat(none))) === concat(concat(some(x), none), none)
...
concat(some(x), concat(some(y), concat(some(z)))) === concat(concat(some(x), some(y)), some(z))
```

**우항등**
```ts
concat(some(x), none) === some(x)
```

**좌항등**
```ts
concat(none, some(x)) === some(x)
```