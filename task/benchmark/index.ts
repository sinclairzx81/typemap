import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import { Box } from '@sinclair/typebox-adapter'

import * as v from 'valibot'
import * as z from 'zod'

// ------------------------------------------------------------------
// Benchmark
// ------------------------------------------------------------------
function benchmark(library: string, using: string, callback: Function) {
  const [now, iterations] = [Date.now(), 10_000_000]
  for (let i = 0; i < iterations; i++) if (!callback()) throw Error('Invalid' + library + using)
  const elapsed = `${Date.now() - now} ms`.padEnd(8)
  return { library: library.padEnd(12), using: using.padEnd(16), iterations, elapsed }
}
// ------------------------------------------------------------------
// Zod
// ------------------------------------------------------------------
function zod() {
  const T = z.object({
    x: z.string(),
    y: z.number(),
    z: z.boolean(),
  })
  return benchmark('zod', 'zod', () => T.safeParse({ x: 'hello', y: 42, z: true }).success)
}
function zod_using_value() {
  const T = Box(
    z.object({
      x: z.string(),
      y: z.number(),
      z: z.boolean(),
    }),
  )
  return benchmark('zod', 'typebox:value', () => Value.Check(T, { x: 'hello', y: 42, z: true }))
}
function zod_using_compiler() {
  const T = TypeCompiler.Compile(
    Box(
      z.object({
        x: z.string(),
        y: z.number(),
        z: z.boolean(),
      }),
    ),
  )
  return benchmark('zod', 'typebox:compile', () => T.Check({ x: 'hello', y: 42, z: true }))
}
// ------------------------------------------------------------------
// Valibot
// ------------------------------------------------------------------
function valibot() {
  const T = v.object({
    x: v.string(),
    y: v.number(),
    z: v.boolean(),
  })
  return benchmark('valibot', 'valibot', () => v.safeParse(T, { x: 'hello', y: 42, z: true }).success)
}
function valibot_using_value() {
  const T = Box(
    v.object({
      x: v.string(),
      y: v.number(),
      z: v.boolean(),
    }),
  )
  return benchmark('valibot', 'typebox:value', () => Value.Check(T, { x: 'hello', y: 42, z: true }))
}
function valibot_using_compiler() {
  const T = TypeCompiler.Compile(
    Box(
      v.object({
        x: v.string(),
        y: v.number(),
        z: v.boolean(),
      }),
    ),
  )
  return benchmark('valibot', 'typebox:compile', () => T.Check({ x: 'hello', y: 42, z: true }))
}

console.log('running benchmark')
console.table([valibot(), valibot_using_value(), valibot_using_compiler()])
console.table([zod(), zod_using_value(), zod_using_compiler()])

