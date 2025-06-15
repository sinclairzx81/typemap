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
import { z as z4 } from 'zod/v4'

/** Structural Type for Syntax */
export type SyntaxType = string
/** Structural Type for TypeBox */
export type TypeBoxType = t.TSchema
/** Structural Type for Valibot */
export type ValibotType = v.BaseSchema<any, any, v.BaseIssue<any>>
/** Structural Type for Zod */
export type ZodType = z.ZodTypeAny | z.ZodEffects<any>
/** Structural Type for Zod4 */
export type Zod4Type = z4.ZodTypeAny

// ------------------------------------------------------------------
// Syntax
// ------------------------------------------------------------------
/** Returns true if the given value is a Syntax type */
export function IsSyntax(value: unknown): value is string {
  return t.ValueGuard.IsString(value)
}
// ------------------------------------------------------------------
// TypeBox
// ------------------------------------------------------------------
/** Returns true if the given value is a TypeBox type */
export function IsTypeBox(type: unknown): type is t.TSchema {
  return t.KindGuard.IsSchema(type)
}
// ------------------------------------------------------------------
// Valibot
// ------------------------------------------------------------------
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
// Common Zod Detection
// ------------------------------------------------------------------
/**
 * Returns true if the given value has the standard Zod vendor property
 * This is common to both Zod v3 and Zod v4 types
 */
// prettier-ignore
function IsZodVendor(type: unknown): boolean {
  if (!t.ValueGuard.IsObject(type)) return false;
  if (!t.ValueGuard.HasPropertyKey(type, '~standard')) return false;
  
  const standardProp = (type as any)['~standard'];
  if (!t.ValueGuard.IsObject(standardProp)) return false;
  if (!t.ValueGuard.HasPropertyKey(standardProp, 'vendor')) return false;
  
  return standardProp.vendor === 'zod';
}

// ------------------------------------------------------------------
// Zod
// ------------------------------------------------------------------
/** Returns true if the given value is a Zod v3 type */
// prettier-ignore
export function IsZod(type: unknown): type is z.ZodTypeAny {
  if (!IsZodVendor(type)) return false;
  
  const obj = type as Record<string, unknown>;
  
  // Check for Zod v3 specific properties:
  // 1. Has '_def' property (not 'def')
  // 2. Does not have Zod v4 specific methods like 'meta'
  return (
    t.ValueGuard.HasPropertyKey(obj, '_def') &&
    !t.ValueGuard.HasPropertyKey(obj, 'meta')
  );
}

// ------------------------------------------------------------------
// Zod4
// ------------------------------------------------------------------
/** Returns true if the given value is a Zod4 type */
// prettier-ignore
export function IsZod4(type: unknown): type is z4.ZodTypeAny {
  if (!IsZodVendor(type)) return false;
  
  const obj = type as Record<string, unknown>;
  
  // Check Zod v4 specific properties:
  // 1. Has 'def' property
  // 2. Has specific v4 methods like 'meta'
  return (
    t.ValueGuard.HasPropertyKey(obj, 'def') &&
    t.ValueGuard.HasPropertyKey(obj, 'meta')
  );
}
// ------------------------------------------------------------------
// Signature
// ------------------------------------------------------------------
// (parameter, syntax, options)
function Signature1(args: any[]) {
  return args.length === 3 && t.ValueGuard.IsObject(args[0]) && t.ValueGuard.IsString(args[1]) && t.ValueGuard.IsObject(args[2])
}
// (syntax, options)
function Signature2(args: any[]) {
  return args.length === 2 && t.ValueGuard.IsString(args[0]) && t.ValueGuard.IsObject(args[1])
}
// (parameter, options)
function Signature3(args: any[]) {
  return args.length === 2 && t.ValueGuard.IsObject(args[0]) && t.ValueGuard.IsString(args[1])
}
// (syntax | type)
function Signature4(args: any[]) {
  return args.length === 1 && (t.ValueGuard.IsString(args[0]) || t.ValueGuard.IsObject(args[0]))
}
/** Resolve common mapping signature parameters */
// prettier-ignore
export function Signature(args: any[]): [parameter: Record<PropertyKey, object>, type: string | object, options: object] {
  return (
    Signature1(args) ? [args[0], args[1], args[2]] :
    Signature2(args) ? [{}, args[0], args[1]] :
    Signature3(args) ? [args[0], args[1], {}] :
    Signature4(args) ? [{}, args[0], {}] :
    [{}, 'never', {}]
  )
}
