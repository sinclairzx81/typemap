/*--------------------------------------------------------------------------

@sinclair/typemap

The MIT License (MIT)

Copyright (c) 2024-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
/** Structural Type for Syntax */
export type SyntaxType = string

export function IsSyntax(value: unknown): value is string {
  return t.ValueGuard.IsString(value)
}

// ------------------------------------------------------------------
// TypeBox
// ------------------------------------------------------------------
/** Structural Type for TypeBox */
export type TypeBoxType = t.TSchema

/** Returns true if the given value is a TypeBox type */
export function IsTypeBox(type: unknown): type is t.TSchema {
  return t.KindGuard.IsSchema(type)
}
// ------------------------------------------------------------------
// Valibot
// ------------------------------------------------------------------
/** Structural Type for Valibot */
export type ValibotType = v.BaseSchema<any, any, v.BaseIssue<any>>

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
/** Structural Type for Zod */
export type ZodType = z.ZodTypeAny | z.ZodEffects<any>

/** Returns true if the given value is a Zod type */
// prettier-ignore
export type TIsZod<Type extends unknown> = (
  Type extends z.ZodTypeAny ? true : false
)
/** Returns true if the given value is a Zod type */
// prettier-ignore
export function IsZod(type: unknown): type is z.ZodTypeAny {
  return (
    t.ValueGuard.IsObject(type) && 
    t.ValueGuard.HasPropertyKey(type, '~standard') && 
    t.ValueGuard.IsObject(type['~standard']) && 
    t.ValueGuard.HasPropertyKey(type['~standard'], 'vendor') && 
    type['~standard'].vendor === 'zod'
  )
}
// ------------------------------------------------------------------
// Signature
// ------------------------------------------------------------------
function Signature1(args: any[]) {
  return args.length === 3 && t.ValueGuard.IsObject(args[0]) && t.ValueGuard.IsString(args[1]) && t.ValueGuard.IsObject(args[2])
}
function Signature2(args: any[]) {
  return args.length === 2 && t.ValueGuard.IsString(args[0]) && t.ValueGuard.IsObject(args[1])
}
function Signature3(args: any[]) {
  return args.length === 2 && t.ValueGuard.IsObject(args[0]) && t.ValueGuard.IsString(args[1])
}
function Signature4(args: any[]) {
  return args.length === 1 && (t.ValueGuard.IsString(args[0]) || t.ValueGuard.IsObject(args[0]))
}
export function Signature(args: any[]): [parameter: Record<PropertyKey, object>, type: string | object, options: object] {
  // prettier-ignore
  return (
    Signature1(args) ? [args[0], args[1], args[2]] :
    Signature2(args) ? [{}, args[0], args[1]] :
    Signature3(args) ? [args[0], args[1], {}] :
    Signature4(args) ? [{}, args[0], {}] :
    [{}, 'never', {}]
  )
}
