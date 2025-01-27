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

import { TTypeBoxFromSyntax, TypeBoxFromSyntax } from '../typebox/typebox-from-syntax'
import { ValibotFromTypeBox, TValibotFromTypeBox } from './valibot-from-typebox'

import * as t from '@sinclair/typebox'
import * as c from './common'

// ------------------------------------------------------------------
// ValibotFromSyntax
// ------------------------------------------------------------------
// prettier-ignore
export type TValibotFromSyntax<Context extends t.TProperties, Type extends string, 
  Schema extends t.TSchema = TTypeBoxFromSyntax<Context, Type>,
  Result extends c.BaseSchema = TValibotFromTypeBox<Schema>
> = Result

// prettier-ignore
export function ValibotFromSyntax<Context extends t.TProperties, Type extends string>(context: Context, type: Type, options?: t.SchemaOptions): TValibotFromSyntax<Context, Type> {
  const schema = TypeBoxFromSyntax(context, type, options)
  const result = ValibotFromTypeBox(schema)
  return result as never
}
