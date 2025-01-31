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

import { type TSyntaxFromSyntax, SyntaxFromSyntax } from './syntax-from-syntax'
import { type TSyntaxFromTypeBox, SyntaxFromTypeBox } from './syntax-from-typebox'
import { type TSyntaxFromValibot, SyntaxFromValibot } from './syntax-from-valibot'
import { type TSyntaxFromZod, SyntaxFromZod } from './syntax-from-zod'
import { type TSyntaxOptions } from '../options'
import { type TParameter } from '../typebox/typebox'

import * as g from '../guard'
import * as z from 'zod'

// ------------------------------------------------------------------
// Zod
// ------------------------------------------------------------------
/** Creates Syntax by mapping from a remote Type */
// prettier-ignore
export type TSyntax<_Parameter extends TParameter, Type extends object | string, Result extends string = (
  Type extends g.SyntaxType ? TSyntaxFromSyntax<Type> :
  Type extends g.TypeBoxType ? TSyntaxFromTypeBox<Type> :
  Type extends g.ValibotType ? TSyntaxFromValibot<Type> :
  Type extends g.ZodType ? TSyntaxFromZod<Type> :
  'never'
)> = Result

/** Creates Syntax by mapping from a remote Type */
export function Syntax<Parameter extends TParameter, Type extends string>(parameter: Parameter, type: Type, options?: TSyntaxOptions): TSyntax<Parameter, Type>
/** Creates Syntax by mapping from a remote Type */
export function Syntax<Type extends string>(type: Type, options?: TSyntaxOptions): TSyntax<{}, Type>
/** Creates Syntax by mapping from a remote Type */
export function Syntax<Type extends object>(type: Type, options?: TSyntaxOptions): TSyntax<{}, Type>
/** Creates Syntax by mapping from a remote Type */
// prettier-ignore
export function Syntax(...args: any[]): never {
  const [_parameter, type, _options] = g.Signature(args)
  return (
    g.IsSyntax(type) ? SyntaxFromSyntax(type) : 
    g.IsTypeBox(type) ? SyntaxFromTypeBox(type) : 
    g.IsValibot(type) ? SyntaxFromValibot(type) : 
    g.IsZod(type) ? SyntaxFromZod(type) : 
    z.never()
  ) as never
}
