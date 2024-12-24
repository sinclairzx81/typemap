import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import { Box } from '@sinclair/typebox-remix'

import * as v from 'valibot'
import * as z from 'zod'

// ------------------------------------------------------------------
// Benchmark
// ------------------------------------------------------------------
function benchmark(library: string, using: string, callback: Function) {
  const [now, iterations] = [Date.now(), 1_000_000]
  for (let i = 0; i < iterations; i++) if (!callback()) throw Error('Invalid' + library + using)
  const elapsed = `${Date.now() - now} ms`.padEnd(8)
  return { library: library.padEnd(12), using: using.padEnd(16), iterations, elapsed }
}
// ------------------------------------------------------------------
// Zod
// ------------------------------------------------------------------
function zod() {
  const T = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  })
  return benchmark('zod', 'zod', () => T.safeParse({ x: 1, y: 2, z: 3 }).success)
}
function zod_using_value() {
  const T = Box(
    z.object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
    }),
  )
  return benchmark('zod', 'typebox:value', () => Value.Check(T, { x: 1, y: 2, z: 3 }))
}
function zod_using_compiler() {
  const T = TypeCompiler.Compile(
    Box(
      z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
      }),
    ),
  )
  return benchmark('zod', 'typebox:compile', () => T.Check({ x: 1, y: 2, z: 3 }))
}
// ------------------------------------------------------------------
// Valibot
// ------------------------------------------------------------------
function valibot() {
  const T = v.object({
    x: v.number(),
    y: v.number(),
    z: v.number(),
  })
  return benchmark('valibot', 'valibot', () => v.safeParse(T, { x: 1, y: 2, z: 3 }).success)
}
function valibot_using_value() {
  const T = Box(
    v.object({
      x: v.number(),
      y: v.number(),
      z: v.number(),
    }),
  )
  return benchmark('valibot', 'typebox:value', () => Value.Check(T, { x: 1, y: 2, z: 3 }))
}
function valibot_using_compiler() {
  const T = TypeCompiler.Compile(
    Box(
      v.object({
        x: v.number(),
        y: v.number(),
        z: v.number(),
      }),
    ),
  )
  return benchmark('valibot', 'typebox:compile', () => T.Check({ x: 1, y: 2, z: 3 }))
}

console.table([valibot(), valibot_using_value(), valibot_using_compiler()])
console.table([zod(), zod_using_value(), zod_using_compiler()])
