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
import * as Guard from '../guard'
import * as z from 'zod'

/** Creates a Zod type from Syntax or another Type */
// prettier-ignore
export type TZod<Type extends object | string, Result = (
  Guard.TIsSyntax<Type> extends true ? TZodFromSyntax<Type> :
  Guard.TIsTypeBox<Type> extends true ? TZodFromTypeBox<Type> :
  Guard.TIsValibot<Type> extends true ? TZodFromValibot<Type> :
  Guard.TIsZod<Type> extends true ? TZodFromZod<Type> :
  z.ZodNever
)> = Result

/** Creates a Zod type from Syntax or another Type */
// prettier-ignore
export function Zod<Type extends object | string, Mapped = TZod<Type>, Result extends Mapped = Mapped>(type: Type): Result {
  return (
    Guard.IsSyntax(type) ? ZodFromSyntax(type) : 
    Guard.IsTypeBox(type) ? ZodFromTypeBox(type) : 
    Guard.IsValibot(type) ? ZodFromValibot(type) : 
    Guard.IsZod(type) ? ZodFromZod(type) : 
    z.never()
  ) as never
}
