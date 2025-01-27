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

import { TypeCompiler, TypeCheck, ValueErrorIterator } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import { TypeBox, TTypeBox } from '../typebox/typebox'
import { IsEvalSupported } from './environment'
import { StandardSchemaV1 } from './standard'
import * as t from '@sinclair/typebox'

// ------------------------------------------------------------------
// StandardSchemaProps
// ------------------------------------------------------------------
export class StandardSchemaProps<Type extends t.TSchema> implements StandardSchemaV1.Props<Type, t.Static<Type>> {
  readonly #check: TypeCheck<Type>
  constructor(check: TypeCheck<Type>) {
    this.#check = check
  }
  // ----------------------------------------------------------------
  // StandardSchemaV1.Props<Type, t.Static<Type>>
  // ----------------------------------------------------------------
  public get vendor(): '@sinclair/typemap' {
    return '@sinclair/typemap'
  }
  public get version(): 1 {
    return 1
  }
  public get types(): { input: Type; output: t.Static<Type> } {
    return { input: this.#check.Schema(), output: null }
  }
  public validate(value: unknown): StandardSchemaV1.Result<t.Static<Type>> {
    return this.#check.Check(value) ? this.#createValue(value) : this.#createIssues(value)
  }
  // ----------------------------------------------------------------
  // Internal
  // ----------------------------------------------------------------
  #createIssues(value: unknown) {
    const errors = [...Value.Errors(this.#check.Schema(), value)]
    const issues: StandardSchemaV1.Issue[] = errors.map((error) => ({ ...error, path: [error.path] }))
    return { issues }
  }
  #createValue(value: unknown) {
    return { value }
  }
}
// ------------------------------------------------------------------
// Validator<TSchema>
// ------------------------------------------------------------------
export class Validator<Type extends t.TSchema> implements StandardSchemaV1<Type, t.Static<Type>> {
  private readonly _standard: StandardSchemaProps<Type>
  private readonly _check: TypeCheck<Type>
  constructor(check: TypeCheck<Type>) {
    this._standard = new StandardSchemaProps<Type>(check)
    this._check = check
  }
  /** Standard Schema Interface */
  public get ['~standard'](): StandardSchemaProps<Type> {
    return this._standard
  }
  /** Returns the code used by this validator. */
  public Code(): string {
    return this._check.Code()
  }
  /** Parses this value. Do not use this function for high throughput validation */
  public Parse(value: unknown): t.StaticDecode<Type> {
    return Value.Parse(this._check.Schema(), value)
  }
  /** Checks if this value matches the type */
  public Check(value: unknown): value is t.Static<Type> {
    return this._check.Check(value)
  }
  /** Returns errors for this value */
  public Errors(value: unknown): ValueErrorIterator {
    return this._check.Errors(value)
  }
}
// ------------------------------------------------------------------
// CompileDynamic
// ------------------------------------------------------------------
// prettier-ignore
function CompileDynamic<Type extends t.TSchema>(type: Type, references: t.TSchema[] = []): TypeCheck<Type> {
  return new TypeCheck(type, references, value => Value.Check(type, references, value), TypeCompiler.Code(type, references))  
}
// ------------------------------------------------------------------
// Compile
// ------------------------------------------------------------------
/** Compiles a type for high performance validation */
// prettier-ignore
type TCompile<Type extends object | string,
  Schema extends t.TSchema = TTypeBox<{}, Type>,
> = Validator<Schema>
/** Compiles a type for high performance validation */
// prettier-ignore
export function Compile<Type extends object | string>(type: Type): TCompile<Type> {
  const schema = TypeBox(type)
  const check = IsEvalSupported() ? TypeCompiler.Compile(schema) : CompileDynamic(schema)
  return new Validator(check)
}
