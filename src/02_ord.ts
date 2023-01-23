/*

  **퀴즈**: 타입 `A` 주어지면 `Ord<A>`에 대한 세미그룹 인스턴스를 정의할 수 있나요?
  그것은 무엇을 표현할 수 있나요?
*/

import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Ord'
import { sort } from 'fp-ts/ReadonlyArray'
import { concatAll, Semigroup } from 'fp-ts/Semigroup'
import * as S from 'fp-ts/string'
import * as N from 'fp-ts/number'
import * as B from 'fp-ts/boolean'

/*

  우선 `Ord<A>`에 대한 세미그룹 인스턴스를 정의하겠습니다.

*/

const getSemigroup = <A = never>(): Semigroup<O.Ord<A>> => ({
  concat: (first, second) =>
    O.fromCompare((a1, a2) => {
      const ordering = first.compare(a1, a2)
      return ordering !== 0 ? ordering : second.compare(a1, a2)
    })
})

/*

  이제 실제 사례에 적용해 보겠습니다.

*/

interface User {
  readonly id: number
  readonly name: string
  readonly age: number
  readonly rememberMe: boolean
}

const byName = pipe(
  S.Ord,
  O.contramap((_: User) => _.name)
)

const byAge = pipe(
  N.Ord,
  O.contramap((_: User) => _.age)
)

const byRememberMe = pipe(
  B.Ord,
  O.contramap((_: User) => _.rememberMe)
)

const SemigroupOrdUser = getSemigroup<User>()

// 정렬할 테이블을 표현합니다.
const users: ReadonlyArray<User> = [
  { id: 1, name: 'Guido', age: 47, rememberMe: false },
  { id: 2, name: 'Guido', age: 46, rememberMe: true },
  { id: 3, name: 'Giulio', age: 44, rememberMe: false },
  { id: 4, name: 'Giulio', age: 44, rememberMe: true }
]

// 일반적인 정렬:
// 처음에는 이름으로, 그다음에는 나이로, 그다음에는 `rememberMe`

const byNameAgeRememberMe = concatAll(SemigroupOrdUser)(byName)([
  byAge,
  byRememberMe
])
pipe(users, sort(byNameAgeRememberMe), console.log)
/*
[ { id: 3, name: 'Giulio', age: 44, rememberMe: false },
  { id: 4, name: 'Giulio', age: 44, rememberMe: true },
  { id: 2, name: 'Guido', age: 46, rememberMe: true },
  { id: 1, name: 'Guido', age: 47, rememberMe: false } ]
*/

// 이제 `rememberMe = true`인 사용자가 앞 순서이길 원합니다.

const byRememberMeNameAge = concatAll(SemigroupOrdUser)(
  O.reverse(byRememberMe)
)([byName, byAge])
pipe(users, sort(byRememberMeNameAge), console.log)
/*
[ { id: 4, name: 'Giulio', age: 44, rememberMe: true },
  { id: 2, name: 'Guido', age: 46, rememberMe: true },
  { id: 3, name: 'Giulio', age: 44, rememberMe: false },
  { id: 1, name: 'Guido', age: 47, rememberMe: false } ]
*/
