/*

  성공할 때까지 작업을 반복적으로 수행하는 메커니즘에 대한 추상화입니다.

  이 모듈은 세 부분으로 나뉩니다:

  - 모델
  - 원시 요소
  - 결합자

*/

// -------------------------------------------------------------------------------------
// 모델
// -------------------------------------------------------------------------------------

export interface RetryStatus {
  /** 반복 횟수, 여기서 `0`은 첫 번째 시도 */
  readonly iterNumber: number

  /** 최근 시도의 지연 시간, 첫 실행에서는 항상 `undefined` 상태가 됩니다. */
  readonly previousDelay: number | undefined
}

export const startStatus: RetryStatus = {
  iterNumber: 0,
  previousDelay: undefined
}

/**
 * `RetryPolicy`은 `RetryStatus`를 받는 함수입니다.
 * 지연 시간(밀리초)을 반환할 수 있습니다. 반복 횟수는
 * 0에서 시작하여 재시도할 때마다 1씩 증가합니다.
 * 함수가 *undefined*를 반환하는 것은 재시도 제한에 도달했음을 의미합니다.
 */
export interface RetryPolicy {
  (status: RetryStatus): number | undefined
}

// -------------------------------------------------------------------------------------
// 원시 요소
// -------------------------------------------------------------------------------------

/**
 * 무제한 재시도와 지속적인 지연
 */
export const constantDelay = (delay: number): RetryPolicy => () => delay

/**
 * 최대 'i'회까지만 즉시 다시 시도
 */
export const limitRetries = (i: number): RetryPolicy => (status) =>
  status.iterNumber >= i ? undefined : 0

/**
 * 반복할 때마다 지연 시간이 기하급수적으로 증가합니다.
 * 각 지연 시간은 2배씩 증가합니다.
 */
export const exponentialBackoff = (delay: number): RetryPolicy => (status) =>
  delay * Math.pow(2, status.iterNumber)

// -------------------------------------------------------------------------------------
// 결합자
// -------------------------------------------------------------------------------------

/**
 * 지정된 정책에 의해 지시될 수 있는 지연에 대한 시간 상한을 설정합니다.
 */
export const capDelay = (maxDelay: number) => (
  policy: RetryPolicy
): RetryPolicy => (status) => {
  const delay = policy(status)
  return delay === undefined ? undefined : Math.min(maxDelay, delay)
}

/**
 * 두 정책을 병합합니다.
 * **퀴즈**: 두 정책을 병합한다는 것은 무엇을 의미하나요?
 */
export const concat = (second: RetryPolicy) => (
  first: RetryPolicy
): RetryPolicy => (status) => {
  const delay1 = first(status)
  const delay2 = second(status)
  if (delay1 !== undefined && delay2 !== undefined) {
    return Math.max(delay1, delay2)
  }
  return undefined
}

// -------------------------------------------------------------------------------------
// 테스트
// -------------------------------------------------------------------------------------

/**
 * 상태에 대한 정책을 적용하여 결정 사항을 확인합니다.
 */
export const applyPolicy = (policy: RetryPolicy) => (
  status: RetryStatus
): RetryStatus => ({
  iterNumber: status.iterNumber + 1,
  previousDelay: policy(status)
})

/**
 * 모든 중간 결과를 유지하는 정책을 적용합니다.
 */
export const dryRun = (policy: RetryPolicy): ReadonlyArray<RetryStatus> => {
  const apply = applyPolicy(policy)
  let status: RetryStatus = apply(startStatus)
  const out: Array<RetryStatus> = [status]
  while (status.previousDelay !== undefined) {
    out.push((status = apply(out[out.length - 1])))
  }
  return out
}

import { pipe } from 'fp-ts/function'

/*
  constantDelay(300)
    |> concat(exponentialBackoff(200))
    |> concat(limitRetries(5))
    |> capDelay(2000)
*/
const myPolicy = pipe(
  constantDelay(300),
  concat(exponentialBackoff(200)),
  concat(limitRetries(5)),
  capDelay(2000)
)

console.log(dryRun(myPolicy))
/*
[
  { iterNumber: 1, previousDelay: 300 },      <= constantDelay
  { iterNumber: 2, previousDelay: 400 },      <= exponentialBackoff
  { iterNumber: 3, previousDelay: 800 },      <= exponentialBackoff
  { iterNumber: 4, previousDelay: 1600 },     <= exponentialBackoff
  { iterNumber: 5, previousDelay: 2000 },     <= capDelay
  { iterNumber: 6, previousDelay: undefined } <= limitRetries
]
*/
