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

import { TypeCheck, ValueErrorIterator } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import * as t from '@sinclair/typebox'
import * as s from './standard'

// ------------------------------------------------------------------
// StandardSchemaProps<Input, Output>
// ------------------------------------------------------------------
// prettier-ignore
export class StandardSchemaProps<Type extends t.TSchema, Static = t.Static<Type>, 
  Input extends Static = Static,
  Output extends Static = Static
> implements s.StandardSchemaV1.Props<Input, Output> {
  private readonly __check: TypeCheck<Type>
  constructor(check: TypeCheck<Type>) {
    this.__check = check
  }
  // ----------------------------------------------------------------
  // StandardSchemaV1.Props<Input, Output>
  // ----------------------------------------------------------------
  public get vendor(): '@sinclair/typemap' {
    return '@sinclair/typemap'
  }
  public get version(): 1 {
    return 1
  }
  public get types(): { input: Input; output: Output } {
    throw Error('types is a phantom property used for inference only.')
  }
  public validate(value: unknown): s.StandardSchemaV1.Result<Output> {
    return (
      this.__check.Check(value) ? this.__createValue(value) : this.__createIssues(value)
    ) as never
  }
  // ----------------------------------------------------------------
  // Internal
  // ----------------------------------------------------------------
  private __createIssues(value: unknown) {
    const errors = [...Value.Errors(this.__check.Schema(), value)]
    const issues: s.StandardSchemaV1.Issue[] = errors.map((error) => ({ ...error, path: [error.path] }))
    return { issues }
  }
  private __createValue(value: unknown) {
    return { value }
  }
}
// ------------------------------------------------------------------
// Validator<TSchema>
// ------------------------------------------------------------------
export class Validator<Type extends t.TSchema> implements s.StandardSchemaV1<t.Static<Type>, t.Static<Type>> {
  private readonly __standard: StandardSchemaProps<Type>
  private readonly __check: TypeCheck<Type>
  constructor(check: TypeCheck<Type>) {
    this.__standard = new StandardSchemaProps<Type>(check)
    this.__check = check
  }
  /** Standard Schema Interface */
  public get ['~standard'](): StandardSchemaProps<Type> {
    return this.__standard as never
  }
  /** Returns the code used by this validator. */
  public Code(): string {
    return this.__check.Code()
  }
  /** Parses this value. Do not use this function for high throughput validation */
  public Parse(value: unknown): t.StaticDecode<Type> {
    return Value.Parse(this.__check.Schema(), value)
  }
  /** Checks if this value matches the type */
  public Check(value: unknown): value is t.Static<Type> {
    return this.__check.Check(value)
  }
  /** Returns errors for this value */
  public Errors(value: unknown): ValueErrorIterator {
    return this.__check.Errors(value)
  }
}
