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

import { TTypeBoxFromSyntax, TypeBoxFromSyntax } from './typebox-from-syntax'
import { TTypeBoxFromTypeBox, TypeBoxFromTypeBox } from './typebox-from-typebox'
import { TTypeBoxFromValibot, TypeBoxFromValibot } from './typebox-from-valibot'
import { TTypeBoxFromZod, TypeBoxFromZod } from './typebox-from-zod'
import * as Guard from '../guard'
import * as t from '@sinclair/typebox'

/** Creates a TypeBox type from Syntax or another Type */
// prettier-ignore
export type TTypeBox<Type extends object | string, Result = (
  Guard.TIsSyntax<Type> extends true ? TTypeBoxFromSyntax<Type> :
  Guard.TIsTypeBox<Type> extends true ? TTypeBoxFromTypeBox<Type> :
  Guard.TIsValibot<Type> extends true ? TTypeBoxFromValibot<Type> :
  Guard.TIsZod<Type> extends true ? TTypeBoxFromZod<Type> :
  t.TNever
)> = Result

/** Creates a TypeBox type from Syntax or another Type */
// prettier-ignore
export function TypeBox<Type extends object | string>(type: Type): TTypeBox<Type> {
  return (
    Guard.IsSyntax(type) ? TypeBoxFromSyntax(type) :
    Guard.IsTypeBox(type) ? TypeBoxFromTypeBox(type) :
    Guard.IsValibot(type) ? TypeBoxFromValibot(type) :
    Guard.IsZod(type) ? TypeBoxFromZod(type) :
    t.Never()
  ) as never
}

/**
 * Creates a TypeBox type from Syntax or another Type
 * @deprecated Use TypeBox() export instead
 */
export function Box<Type extends object | string, Mapped = TTypeBox<Type>, Result extends Mapped = Mapped>(type: Type): Result {
  return TypeBox(type) as never
}
