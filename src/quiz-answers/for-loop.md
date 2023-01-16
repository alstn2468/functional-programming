## 문제

```ts
// 입력
const xs: Array<number> = [1, 2, 3]

// 변환
const double = (n: number): number => n * 2

// 결과: `xs`의 각 요소가 2배가 되는 배열을 원합니다.
const ys: Array<number> = []
for (let i = 0; i <= xs.length; i++) {
  ys.push(double(xs[i]))
}
```

위의 `for 루프`가 올바르게 작성되었나요?

## 정답

틀렸습니다. `i <= xs.length` 조건은 `i < xs.length`여야 합니다.

코드가 작성된 대로 `ys`의 값은 `[ 2, 4, 6 ]`가 아닌 `[ 2, 4, 6, NaN ]`입니다.
