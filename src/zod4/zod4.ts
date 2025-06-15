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

import { type TZod4FromSyntax, Zod4FromSyntax } from './zod4-from-syntax'
import { type TZod4FromTypeBox, Zod4FromTypeBox } from './zod4-from-typebox'
import { type TZod4FromValibot, Zod4FromValibot } from './zod4-from-valibot'
import { type TZod4FromZod4, Zod4FromZod4 } from './zod4-from-zod4'
import { type TZod4FromZod, Zod4FromZod } from './zod4-from-zod'
import { type TSyntaxOptions } from '../options'

import { type TParameter, type TContextFromParameter, ContextFromParameter } from '../typebox/typebox'

import * as g from '../guard'
import { z } from 'zod/v4'

// ------------------------------------------------------------------
// Zod4
// ------------------------------------------------------------------
/** Creates a Zod v4 type by mapping from a remote Type */
// prettier-ignore
export type TZod4<Parameter extends TParameter, Type extends object | string, Result extends z.ZodTypeAny | z.ZodNever = (
  Type extends g.SyntaxType ? TZod4FromSyntax<TContextFromParameter<Parameter>, Type> :
  Type extends g.TypeBoxType ? TZod4FromTypeBox<Type> :
  Type extends g.ValibotType ? TZod4FromValibot<Type> :
  Type extends g.ZodType ? TZod4FromZod<Type> :
  Type extends g.Zod4Type ? TZod4FromZod4<Type> :
  z.ZodNever
)> = Result

/** Creates a Zod v4 type by mapping from a remote Type */
export function Zod4<Parameter extends TParameter, Type extends string>(parameter: Parameter, type: Type, options?: TSyntaxOptions): TZod4<Parameter, Type>
/** Creates a Zod v4 type by mapping from a remote Type */
export function Zod4<Type extends string>(type: Type, options?: TSyntaxOptions): TZod4<{}, Type>
/** Creates a Zod v4 type by mapping from a remote Type */
export function Zod4<Type extends object>(type: Type, options?: TSyntaxOptions): TZod4<{}, Type>
/** Creates a Zod v4 type by mapping from a remote Type */
// prettier-ignore
export function Zod4(...args: any[]): never {
  const [parameter, type, options] = g.Signature(args)
  return (
    g.IsSyntax(type) ? Zod4FromSyntax(ContextFromParameter(parameter), type, options) : 
    g.IsTypeBox(type) ? Zod4FromTypeBox(type) : 
    g.IsValibot(type) ? Zod4FromValibot(type) : 
    g.IsZod(type) ? Zod4FromZod(type) : 
    g.IsZod4(type) ? Zod4FromZod4(type) : 
    z.never()
  ) as never
}
