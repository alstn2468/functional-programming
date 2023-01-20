## 문제

```ts
import { Eq } from 'fp-ts/Eq'

type Point = {
  readonly x: number
  readonly y: number
}

const EqPoint: Eq<Point> = {
  equals: (first, second) => first.x === second.x && first.y === second.y
}

const points: ReadonlyArray<Point> = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 2 }
]

const search: Point = { x: 1, y: 1 }

console.log(points.includes(search)) // => false :(
console.log(pipe(points, elem(EqPoint)(search))) // => true :)
```

왜 `includes` 메소드가 `false`를 반환할까요?

## 정답

`includes` 메소드는 원시 값의 경우 값으로 비교하고 다른 경우에는 참조로 비교합니다.

자세한 [설명](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)은 여기를 확인하세요. includes()는 `sameValueZero` 알고리즘을 사용해 전달된 요소가 있는지 결정합니다.

`sameValueZero` 알고리즘은 `===`를 사용하는 것과 매우 비슷하며 객체는 값 대신 참조를 비교합니다. (자세한 내용은 [여기](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality)를 확인하세요.)


```ts
console.log({ foo: 'bar' } === { foo: 'bar' }) // => false

const foo = { foo: 'bar' }
console.log(foo === foo) // => true
```
