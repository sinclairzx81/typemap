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

import { type TTypeBoxFromSyntax, TypeBoxFromSyntax } from './typebox-from-syntax'
import { type TTypeBoxFromTypeBox, TypeBoxFromTypeBox } from './typebox-from-typebox'
import { type TTypeBoxFromValibot, TypeBoxFromValibot } from './typebox-from-valibot'
import { type TTypeBoxFromZod, TypeBoxFromZod } from './typebox-from-zod'
import { type TSyntaxOptions } from '../options'
import * as g from '../guard'
import * as t from '@sinclair/typebox'

// ------------------------------------------------------------------------------
//
// TParameter: Shared
//
// TypeBox supports Type injection via a Context parameter. Because the Context
// only accepts types of TSchema, we need to an intermediate structure to hold
// remote types such that they can be mapped prior to syntax parsing.
//
// -------------------------------------------------------------------------------
export type TParameter = Record<PropertyKey, object>

// ------------------------------------------------------------------
// ContextFromParameter
// ------------------------------------------------------------------
// prettier-ignore
export type TContextFromParameter<Parameter extends TParameter,
  Result extends t.TProperties = {
    [Key in keyof Parameter]: TTypeBox<{}, Parameter[Key]>
  }
> = Result
// prettier-ignore
export function ContextFromParameter<Parameter extends TParameter>(parameter: Parameter): TContextFromParameter<Parameter> {
  return globalThis.Object.getOwnPropertyNames(parameter).reduce((result, key) => {
    return { ...result, [key]: TypeBox(parameter[key] as never) }
  }, {} as t.TProperties) as never
}

// ------------------------------------------------------------------
// TypeBox
// ------------------------------------------------------------------
/** Creates a TypeBox type from Syntax or another Type */
// prettier-ignore
export type TTypeBox<Parameter extends TParameter, Type extends object | string, Result = (
  Type extends string ? TTypeBoxFromSyntax<TContextFromParameter<Parameter>, Type> :
  g.TIsTypeBox<Type> extends true ? TTypeBoxFromTypeBox<Type> :
  g.TIsValibot<Type> extends true ? TTypeBoxFromValibot<Type> :
  g.TIsZod<Type> extends true ? TTypeBoxFromZod<Type> :
  t.TNever
)> = Result
/** Creates a TypeBox type from Syntax or another Type */
export function TypeBox<Parameter extends TParameter, Type extends string>(parameter: Parameter, type: Type, options?: TSyntaxOptions): TTypeBox<Parameter, Type>
/** Creates a TypeBox type from Syntax or another Type */
export function TypeBox<Type extends object | string>(type: Type, options?: TSyntaxOptions): TTypeBox<{}, Type>
/** Creates a TypeBox type from Syntax or another Type */
// prettier-ignore
export function TypeBox(...args: any[]): never {
  const [parameter, type, options] = g.Signature(args)
  return (
    t.ValueGuard.IsString(type) ? TypeBoxFromSyntax(ContextFromParameter(parameter), type, options) :
    g.IsTypeBox(type) ? TypeBoxFromTypeBox(type) :
    g.IsValibot(type) ? TypeBoxFromValibot(type) :
    g.IsZod(type) ? TypeBoxFromZod(type) :
    t.Never()
  ) as never
}

/** Creates a TypeBox type from Syntax or another Type */
export function Type<Parameter extends TParameter, Type extends string>(parameter: Parameter, type: Type, options?: TSyntaxOptions): TTypeBox<Parameter, Type>
/** Creates a TypeBox type from Syntax or another Type */
export function Type<Type extends object | string>(type: Type, options?: TSyntaxOptions): TTypeBox<{}, Type>
/** Creates a TypeBox type from Syntax or another Type */
// prettier-ignore
export function Type(...args: any[]): never {
  return TypeBox.apply(null, args as never) as never
}
