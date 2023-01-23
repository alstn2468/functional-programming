// `npm run shapes` 명령어로 실행
/*
  문제: 캔버스에 도형을 그리는 시스템을 고안합니다.
*/
import { pipe } from 'fp-ts/function'
import { Monoid, concatAll } from 'fp-ts/Monoid'

// -------------------------------------------------------------------------------------
// 모델
// -------------------------------------------------------------------------------------

export interface Point {
  readonly x: number
  readonly y: number
}

/**
 * Shape는 주어진 점이 해당 Shape에 속하면
 * `true`를 반환하고 그렇지 않으면 `false`를 반환하는 함수입니다.
 */
export type Shape = (point: Point) => boolean

/*

  FFFFFFFFFFFFFFFFFFFFFF
  FFFFFFFFFFFFFFFFFFFFFF
  FFFFFFFTTTTTTTTFFFFFFF
  FFFFFFFTTTTTTTTFFFFFFF
  FFFFFFFTTTTTTTTFFFFFFF
  FFFFFFFTTTTTTTTFFFFFFF
  FFFFFFFFFFFFFFFFFFFFFF
  FFFFFFFFFFFFFFFFFFFFFF

       ▧▧▧▧▧▧▧▧
       ▧▧▧▧▧▧▧▧
       ▧▧▧▧▧▧▧▧
       ▧▧▧▧▧▧▧▧

*/

// -------------------------------------------------------------------------------------
// 원시 요소
// -------------------------------------------------------------------------------------

/**
 * 원을 표현하는 도형 만들기
 */
export const disk = (center: Point, radius: number): Shape => (point) =>
  distance(point, center) <= radius

// 유클리드 거리
const distance = (p1: Point, p2: Point) =>
  Math.sqrt(
    Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2)
  )

// pipe(disk({ x: 200, y: 200 }, 100), draw)

// -------------------------------------------------------------------------------------
// 결합자
// -------------------------------------------------------------------------------------

/**
 * 주어진 형태의 반대되는 형태을
 * 반환하는 첫 번째 결합자를 정의할 수 있습니다.
 */
export const outside = (s: Shape): Shape => (point) => !s(point)

// pipe(disk({ x: 200, y: 200 }, 100), outside, draw)

// -------------------------------------------------------------------------------------
// 인스턴스
// -------------------------------------------------------------------------------------

/**
 * `concat`이 두 `Shape`의 합집합을 나타내는 모노이드
 */
export const MonoidUnion: Monoid<Shape> = {
  concat: (first, second) => (point) => first(point) || second(point),
  empty: () => false
}

// pipe(
//   MonoidUnion.concat(
//     disk({ x: 150, y: 200 }, 100),
//     disk({ x: 250, y: 200 }, 100)
//   ),
//   draw
// )

/**
 * `concat`이 두 `Shape`의 교집합을 나타내는 모노이드
 */
const MonoidIntersection: Monoid<Shape> = {
  concat: (first, second) => (point) => first(point) && second(point),
  empty: () => true
}

// pipe(
//   MonoidIntersection.concat(
//     disk({ x: 150, y: 200 }, 100),
//     disk({ x: 250, y: 200 }, 100)
//   ),
//   draw
// )

/**
 * 결합자 `outside`와 `MonoidIntersection`을 사용하여
 * 링을 표현하는 `Shape`를 만들 수 있습니다.
 */
export const ring = (
  point: Point,
  bigRadius: number,
  smallRadius: number
): Shape =>
  MonoidIntersection.concat(
    disk(point, bigRadius),
    outside(disk(point, smallRadius))
  )

// pipe(ring({ x: 200, y: 200 }, 100, 50), draw)

export const mickeymouse: ReadonlyArray<Shape> = [
  disk({ x: 200, y: 200 }, 100),
  disk({ x: 130, y: 100 }, 60),
  disk({ x: 280, y: 100 }, 60)
]

// pipe(concatAll(MonoidUnion)(mickeymouse), draw)

// -------------------------------------------------------------------------------------
// 유틸
// -------------------------------------------------------------------------------------

export function draw(shape: Shape): void {
  const canvas: HTMLCanvasElement = document.getElementById('canvas') as any
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as any
  const width = canvas.width
  const height = canvas.height
  const imagedata = ctx.createImageData(width, height)
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const point: Point = { x, y }
      if (shape(point)) {
        const pixelIndex = (point.y * width + point.x) * 4
        imagedata.data[pixelIndex] = 0
        imagedata.data[pixelIndex + 1] = 0
        imagedata.data[pixelIndex + 2] = 0
        imagedata.data[pixelIndex + 3] = 255
      }
    }
  }
  ctx.putImageData(imagedata, 0, 0)
}
