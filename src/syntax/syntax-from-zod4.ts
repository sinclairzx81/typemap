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

import { type TTypeBoxFromZod4, TypeBoxFromZod4 } from '../typebox/typebox-from-zod4'
import { type TSyntaxFromTypeBox, SyntaxFromTypeBox } from './syntax-from-typebox'

import * as t from '@sinclair/typebox'
import { z } from 'zod/v4'

/** Creates Syntax from Zod v4 */
// prettier-ignore
export type TSyntaxFromZod4<Type extends z.ZodTypeAny,
  TypeBox extends t.TSchema = TTypeBoxFromZod4<Type>,
  Result extends string = TSyntaxFromTypeBox<TypeBox>
> = Result

/** Creates Syntax from Zod v4 */
// prettier-ignore
export function SyntaxFromZod4<Type extends z.ZodTypeAny>(type: Type): TSyntaxFromZod4<Type> {
  const typebox = TypeBoxFromZod4(type)
  const result = SyntaxFromTypeBox(typebox)
  return result as never
}
