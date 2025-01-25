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

import { type TValibotFromSyntax, ValibotFromSyntax } from './valibot-from-syntax'
import { type TValibotFromTypeBox, ValibotFromTypeBox } from './valibot-from-typebox'
import { type TValibotFromValibot, ValibotFromValibot } from './valibot-from-valibot'
import { type TValibotFromZod, ValibotFromZod } from './valibot-from-zod'
import * as Guard from '../guard'
import * as v from 'valibot'
import * as c from './common'

/** Creates a Valibot type from Syntax or another Type */
// prettier-ignore
export type TValibot<Type extends object | string> = (
  Guard.TIsSyntax<Type> extends true ? TValibotFromSyntax<Type> :
  Guard.TIsTypeBox<Type> extends true ? TValibotFromTypeBox<Type> :
  Guard.TIsValibot<Type> extends true ? TValibotFromValibot<Type> :
  Guard.TIsZod<Type> extends true ? TValibotFromZod<Type> :
  v.NeverSchema<c.BaseError>
)
/** Creates a Valibot type from Syntax or another Type */
// prettier-ignore
export function Valibot<Type extends object | string, Result = TValibot<Type>>(type: Type): Result {
  return (
    Guard.IsSyntax(type) ? ValibotFromSyntax(type) :
    Guard.IsTypeBox(type) ? ValibotFromTypeBox(type) :
    Guard.IsValibot(type) ? ValibotFromValibot(type) :
    Guard.IsZod(type) ? ValibotFromZod(type as any) :
    v.never()
  ) as never
}
