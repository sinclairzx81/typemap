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

import { type TValibotFromSyntax, ValibotFromSyntax } from './valibot-from-syntax'
import { type TValibotFromTypeBox, ValibotFromTypeBox } from './valibot-from-typebox'
import { type TValibotFromValibot, ValibotFromValibot } from './valibot-from-valibot'
import { type TValibotFromZod, ValibotFromZod } from './valibot-from-zod'
import { type TSyntaxOptions } from '../options'

import { type TParameter, type TContextFromParameter, ContextFromParameter } from '../typebox/typebox'

import * as g from '../guard'
import * as t from '@sinclair/typebox'
import * as v from 'valibot'
import * as c from './common'

// ------------------------------------------------------------------
// Valibot
// ------------------------------------------------------------------
/** Creates a Valibot type by mapping from a remote Type */
// prettier-ignore
export type TValibot<Parameter extends TParameter, Type extends object | string, Result extends g.ValibotType = (
  Type extends g.SyntaxType ? TValibotFromSyntax<TContextFromParameter<Parameter>, Type> :
  Type extends t.TSchema ? TValibotFromTypeBox<Type> :
  Type extends g.ValibotType ? TValibotFromValibot<Type> :
  Type extends g.ZodType ? TValibotFromZod<Type> :
  v.NeverSchema<c.BaseError>
)> = Result

/** Creates a Valibot type by mapping from a remote Type */
export function Valibot<Parameter extends TParameter, Type extends string>(parameter: Parameter, type: Type, options?: TSyntaxOptions): TValibot<Parameter, Type>
/** Creates a Valibot type by mapping from a remote Type */
export function Valibot<Type extends string>(type: Type, options?: TSyntaxOptions): TValibot<{}, Type>
/** Creates a Valibot type by mapping from a remote Type */
export function Valibot<Type extends object>(type: Type, options?: TSyntaxOptions): TValibot<{}, Type>
/** Creates a Valibot type by mapping from a remote Type */
// prettier-ignore
export function Valibot(...args: any[]): never {
  const [parameter, type, options] = g.Signature(args)
  return (
    g.IsSyntax(type) ? ValibotFromSyntax(ContextFromParameter(parameter), type, options) : 
    g.IsTypeBox(type) ? ValibotFromTypeBox(type) : 
    g.IsValibot(type) ? ValibotFromValibot(type) : 
    g.IsZod(type) ? ValibotFromZod(type as any) : 
    v.never()
  ) as never
}
