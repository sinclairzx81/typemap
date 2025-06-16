import { Value } from '@sinclair/typebox/value'
import { Compile, TypeBox, TypeBoxFromZod4, Zod4 } from '@sinclair/typemap'

import * as v from 'valibot'
import * as z from 'zod'
import * as z4 from 'zod/v4'

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
  const T = TypeBox(
    z.object({
      x: z.string(),
      y: z.number(),
      z: z.boolean(),
    }),
  )
  return benchmark('zod', 'typebox:value', () => Value.Check(T, { x: 'hello', y: 42, z: true }))
}
function zod_using_compiler() {
  const T = Compile(
    z.object({
      x: z.string(),
      y: z.number(),
      z: z.boolean(),
    }),
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
  const T = TypeBox(
    v.object({
      x: v.string(),
      y: v.number(),
      z: v.boolean(),
    }),
  )
  return benchmark('valibot', 'typebox:value', () => Value.Check(T, { x: 'hello', y: 42, z: true }))
}
function valibot_using_compiler() {
  const T = Compile(
    v.object({
      x: v.string(),
      y: v.number(),
      z: v.boolean(),
    }),
  )
  return benchmark('valibot', 'typebox:compile', () => T.Check({ x: 'hello', y: 42, z: true }))
}

// ------------------------------------------------------------------
// Zod v4
// ------------------------------------------------------------------
function zod4() {
  const T = z4.object({
    x: z4.string(),
    y: z4.number(),
    z: z4.boolean(),
  })
  return benchmark('zod v4', 'zod v4', () => T.safeParse({ x: 'hello', y: 42, z: true }).success)
}
function zod4_using_value() {
  const T = TypeBox(
    z4.object({
      x: z4.string(),
      y: z4.number(),
      z: z4.boolean(),
    }),
  )
  return benchmark('zod v4', 'typebox:value', () => Value.Check(T, { x: 'hello', y: 42, z: true }))
}
function zod4_using_compiler() {
  const T = Compile(
    z4.object({
      x: z4.string(),
      y: z4.number(),
      z: z4.boolean(),
    }),
  )
  return benchmark('zod v4', 'typebox:compile', () => T.Check({ x: 'hello', y: 42, z: true }))
}

// Direct API comparison
function zod4_using_library_api() {
  const T = Zod4(`{
    x: string,
    y: number,
    z: boolean
  }`) 
  return benchmark('zod v4', 'typemap:zod4', () => T.safeParse({ x: 'hello', y: 42, z: true }).success)
}

console.log('running benchmark')
console.table([valibot(), valibot_using_value(), valibot_using_compiler()])
console.table([zod(), zod_using_value(), zod_using_compiler()])
console.table([zod4(), zod4_using_library_api(), zod4_using_value(), zod4_using_compiler(),])

