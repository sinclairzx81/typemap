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

import { type TZodFromSyntax, ZodFromSyntax } from './zod-from-syntax'
import { type TZodFromTypeBox, ZodFromTypeBox } from './zod-from-typebox'
import { type TZodFromValibot, ZodFromValibot } from './zod-from-valibot'
import { type TZodFromZod, ZodFromZod } from './zod-from-zod'
import { type TZodFromZod4, ZodFromZod4 } from './zod-from-zod4'
import { type TSyntaxOptions } from '../options'

import { type TParameter, type TContextFromParameter, ContextFromParameter } from '../typebox/typebox'

import * as g from '../guard'
import * as z from 'zod'

// ------------------------------------------------------------------
// Zod
// ------------------------------------------------------------------
/** Creates a Zod type by mapping from a remote Type */
// prettier-ignore
export type TZod<Parameter extends TParameter, Type extends object | string, Result extends z.ZodTypeAny | z.ZodEffects<any> = (
  Type extends g.SyntaxType ? TZodFromSyntax<TContextFromParameter<Parameter>, Type> :
  Type extends g.TypeBoxType ? TZodFromTypeBox<Type> :
  Type extends g.ValibotType ? TZodFromValibot<Type> :
  Type extends g.ZodType ? TZodFromZod<Type> :
  Type extends g.Zod4Type ? TZodFromZod4<Type> :
  z.ZodNever
)> = Result

/** Creates a Zod type by mapping from a remote Type */
export function Zod<Parameter extends TParameter, Type extends string>(parameter: Parameter, type: Type, options?: TSyntaxOptions): TZod<Parameter, Type>
/** Creates a Zod type by mapping from a remote Type */
export function Zod<Type extends string>(type: Type, options?: TSyntaxOptions): TZod<{}, Type>
/** Creates a Zod type by mapping from a remote Type */
export function Zod<Type extends object>(type: Type, options?: TSyntaxOptions): TZod<{}, Type>
/** Creates a Zod type by mapping from a remote Type */
// prettier-ignore
export function Zod(...args: any[]): never {
  const [parameter, type, options] = g.Signature(args)
  return (
    g.IsSyntax(type) ? ZodFromSyntax(ContextFromParameter(parameter), type, options) : 
    g.IsTypeBox(type) ? ZodFromTypeBox(type) : 
    g.IsValibot(type) ? ZodFromValibot(type) : 
    g.IsZod(type) ? ZodFromZod(type) : 
    g.IsZod4(type) ? ZodFromZod4(type) : 
    z.never()
  ) as never
}
