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

import { TypeCompiler, TypeCheck } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import { IsEvalSupported } from './environment'
import { Validator } from './validator'

import { type TTypeBox, TypeBox } from '../typebox/typebox'
import { type TSyntaxOptions } from '../options'
import { type TParameter } from '../typebox/typebox'
import * as t from '@sinclair/typebox'
import * as g from '../guard'

// ------------------------------------------------------------------
// CompileDynamic
// ------------------------------------------------------------------
// prettier-ignore
function CompileDynamic<Type extends t.TSchema>(type: Type, references: t.TSchema[] = []): TypeCheck<Type> {
  return new TypeCheck(type, references, value => Value.Check(type, references, value), TypeCompiler.Code(type, references))  
}
// ------------------------------------------------------------------
// ResolveTypeCheck
// ------------------------------------------------------------------
function ResolveTypeCheck<Type extends t.TSchema>(type: Type): TypeCheck<Type> {
  return IsEvalSupported() ? TypeCompiler.Compile(type) : CompileDynamic(type)
}
// ------------------------------------------------------------------
// Compile
// ------------------------------------------------------------------
/** Compiles a type for high performance validation */
// prettier-ignore
type TCompile<Paramter extends TParameter, Type extends object | string,
  Schema extends t.TSchema = TTypeBox<Paramter, Type>,
  Result = Validator<Schema>
> = Result

/** Compiles a type for high performance validation */
export function Compile<Parameter extends TParameter, Type extends string>(parameter: Parameter, type: Type, options?: TSyntaxOptions): TCompile<Parameter, Type>
/** Compiles a type for high performance validation */
export function Compile<Type extends string>(type: Type, options?: TSyntaxOptions): TCompile<{}, Type>
/** Compiles a type for high performance validation */
export function Compile<Type extends object>(type: Type, options?: TSyntaxOptions): TCompile<{}, Type>
/** Compiles a type for high performance validation */
// prettier-ignore
export function Compile(...args: any[]): never {
  const [parameter, type, options] = g.Signature(args)
  const schema = t.ValueGuard.IsString(type) ? TypeBox(parameter, type, options) : TypeBox(type)
  const check = ResolveTypeCheck(schema)
  return new Validator(check) as never
}
