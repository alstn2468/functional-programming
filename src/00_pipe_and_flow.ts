import { pipe, flow } from 'fp-ts/function'

const double = (n: number): number => n * 2

const increment = (n: number): number => n + 1

const decrement = (n: number): number => n - 1

/*
    pipe 연산자:

    def program1 (n) do
      n
        |> increment
        |> double
        |> decrement
    end

    메서드 체이닝:

    n
      .andThen(increment)
      .andThen(double)
      .andThen(decrement)
*/
const program1 = (n: number): number => pipe(n, increment, double, decrement)

console.log(program1(10)) // 21

// const program2: (n: number) => number
const program2 = flow(increment, double, decrement)

console.log(program2(10)) // 21
