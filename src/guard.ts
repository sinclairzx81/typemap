/*--------------------------------------------------------------------------

@sinclair/typemap

The MIT License (MIT)

Copyright (c) 2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import * as t from '@sinclair/typebox'
import * as v from 'valibot'
import * as z from 'zod'

// ------------------------------------------------------------------
// Syntax
// ------------------------------------------------------------------
/** Returns true if the given value is a Syntax type */
export type TIsSyntax<Type extends unknown> = Type extends string ? true : false
/** Returns true if the given value is a Syntax type */
export function IsSyntax(type: unknown): type is string {
  return t.ValueGuard.IsString(type)
}
// ------------------------------------------------------------------
// TypeBox
// ------------------------------------------------------------------
/** Returns true if the given value is a TypeBox type */
export type TIsTypeBox<Type extends unknown> = Type extends t.TSchema ? true : false
/** Returns true if the given value is a TypeBox type */
export function IsTypeBox(type: unknown): type is t.TSchema {
  return t.KindGuard.IsSchema(type)
}
// ------------------------------------------------------------------
// Valibot
// ------------------------------------------------------------------
/** Returns true if the given value is a Valibot type */
// prettier-ignore
export type TIsValibot<Type extends unknown> = (
  Type extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
    ? Type extends { '~standard': { vendor: 'valibot' } }
      ? true
      : false
    : false
)
/** Returns true if the given value is a Valibot type */
// prettier-ignore
export function IsValibot(type: unknown): type is v.AnySchema {
  return (
    t.ValueGuard.IsObject(type) && 
    t.ValueGuard.HasPropertyKey(type, '~standard') && 
    t.ValueGuard.IsObject(type['~standard']) && 
    t.ValueGuard.HasPropertyKey(type['~standard'], 'vendor') && 
    type['~standard'].vendor === 'valibot'
  )
}
// ------------------------------------------------------------------
// Zod
// ------------------------------------------------------------------
// prettier-ignore
/** Returns true if the given value is a Zod type */
export type TIsZod<Type extends unknown> = (
  Type extends z.ZodTypeAny ? true : false
)
/** Returns true if the given value is a Zod type */
export function IsZod(type: unknown): type is z.ZodTypeAny {
  return t.ValueGuard.IsObject(type) && t.ValueGuard.HasPropertyKey(type, '~standard') && t.ValueGuard.IsObject(type['~standard']) && t.ValueGuard.HasPropertyKey(type['~standard'], 'vendor') && type['~standard'].vendor === 'zod'
}
