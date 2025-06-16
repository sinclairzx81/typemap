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

import * as t from '@sinclair/typebox'
import z4 from 'zod/dist/types/v4'
import { z } from 'zod/v4'

// ------------------------------------------------------------------
// Constraint
// ------------------------------------------------------------------
type TConstraint<Input extends z.ZodType = z.ZodType, Output extends z.ZodType = Input> = (input: Input) => Output

// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
type TFromAny<Result = z.ZodAny> = Result
function FromAny(_type: t.TAny): z.ZodType {
  return z.any()
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
type TFromArray<Type extends t.TSchema, Result = z.ZodArray<TFromType<Type>>> = Result
function FromArray(type: t.TArray): z.ZodType {
  const constraints: TConstraint<z.ZodArray<z.ZodType>>[] = []
  const { minItems, maxItems /* minContains, maxContains, contains */ } = type
  if (t.ValueGuard.IsNumber(minItems)) constraints.push((input) => input.min(minItems))
  if (t.ValueGuard.IsNumber(maxItems)) constraints.push((input) => input.max(maxItems))
  const mapped = z.array(FromType(type.items))
  return constraints.reduce((type, constraint) => constraint(type), mapped)
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
type TFromBigInt<Result = z.ZodBigInt> = Result
function FromBigInt(_type: t.TBigInt): z.ZodType {
  return z.bigint()
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
type TFromBoolean<Result = z.ZodBoolean> = Result
function FromBoolean(_type: t.TBoolean): z.ZodType {
  return z.boolean()
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
type TFromDate<Result = z.ZodDate> = Result
function FromDate(_type: t.TDate): z.ZodType {
  return z.date()
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// note: Zod v4 does not support function types, so we use a workaround
// z.custom<Parameters<T["implement"]>[0]>((fn) => schema.implement(fn))
// https://github.com/colinhacks/zod/issues/4143#issuecomment-2845134912
// prettier-ignore
type TFromFunction<Parameters extends t.TSchema[], ReturnType extends t.TSchema,
  MappedParameters extends z.ZodType[] = TFromTypes<Parameters>
> = (
  MappedParameters extends [z.ZodType, ...z.ZodType[]] | [] 
    ? z.ZodType<(...args: z.output<z.ZodTuple<MappedParameters, null>>) => z.output<TFromType<ReturnType>>>
    : z.ZodNever
)
function FromFunction(type: t.TFunction): z.ZodType {
  const mappedParameters = FromTypes(type.parameters)
  const input = z.tuple(mappedParameters as [z.ZodType, ...z.ZodType[]])
  const output = FromType(type.returns)
  
  return z.custom().transform((arg, ctx) => {
    if (typeof arg !== 'function') {
      ctx.addIssue({
        code: "invalid_type",
        expected: 'custom',
        received: typeof arg,
        input: arg
      })
      return z.NEVER
    }
    
    // Use function schema internally for validation
    const functionSchema = z.function({
      input,
      output
    })
    
    return functionSchema.implement(arg as (...args: any[]) => any)
  })
}
// ------------------------------------------------------------------
// Integer
// ------------------------------------------------------------------
type TFromInteger<Result = z.ZodNumber> = Result
function FromInteger(type: t.TInteger): z.ZodType {
  const { exclusiveMaximum, exclusiveMinimum, minimum, maximum, multipleOf } = type
  const constraints: TConstraint<z.ZodNumber>[] = [(value) => value.int()]
  if (t.ValueGuard.IsNumber(exclusiveMinimum)) constraints.push((input) => input.min(exclusiveMinimum + 1))
  if (t.ValueGuard.IsNumber(exclusiveMaximum)) constraints.push((input) => input.min(exclusiveMaximum - 1))
  if (t.ValueGuard.IsNumber(maximum)) constraints.push((input) => input.max(maximum))
  if (t.ValueGuard.IsNumber(minimum)) constraints.push((input) => input.min(minimum))
  if (t.ValueGuard.IsNumber(multipleOf)) constraints.push((input) => input.multipleOf(multipleOf))
  return constraints.reduce((input, constraint) => constraint(input), z.number())
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<Types extends t.TSchema[], Result extends z.ZodType = z.ZodUnknown> = (
  Types extends [infer Left extends t.TSchema, ...infer Right extends t.TSchema[]]
    ? TFromIntersect<Right, z.ZodIntersection<TFromType<Left>, Result>>
    : Result
)
function FromIntersect(type: t.TIntersect): z.ZodType {
  return type.allOf.reduce((result, left) => {
    return z.intersection(FromType(left), result) as never
  }, z.unknown()) as never
}
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
type TFromLiteral<Value extends t.TLiteralValue, Result = z.ZodLiteral<Value>> = Result
function FromLiteral(type: t.TLiteral): z.ZodType {
  return z.literal(type.const)
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
type TFromObject< Properties extends t.TProperties,
  Result = z.ZodObject<{
    [Key in keyof Properties]: TFromType<Properties[Key]>
  }>,
> = Result
// prettier-ignore
function FromObject(type: t.TObject): z.ZodType {
  const constraints: TConstraint<z.ZodObject<any, any>>[] = []
  const { additionalProperties } = type
  if (additionalProperties === false) constraints.push((input) => input.strict())
  if (t.KindGuard.IsSchema(additionalProperties)) constraints.push((input) => input.catchall(FromType(additionalProperties)))
  const properties = globalThis.Object.getOwnPropertyNames(type.properties).reduce((result, key) => ({ ...result, [key]: FromType(type.properties[key]) }), {})
  return constraints.reduce((type, constraint) => constraint(type), z.object(properties))
}
// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
type TFromPromise<Type extends t.TSchema, Result = z.ZodPromise<TFromType<Type>>> = Result
function FromPromise(type: t.TPromise): z.ZodType {
  return z.promise(FromType(type.item))
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
type TFromRegExp<Result = z.ZodString> = Result
function FromRegExp(type: t.TRegExp): z.ZodType {
  const constraints: TConstraint<z.ZodString>[] = [(input) => input.regex(new RegExp(type.source), type.flags)]
  const { minLength, maxLength } = type
  if (t.ValueGuard.IsNumber(maxLength)) constraints.push((input) => input.max(maxLength))
  if (t.ValueGuard.IsNumber(minLength)) constraints.push((input) => input.min(minLength))
  return constraints.reduce((type, constraint) => constraint(type), z.string())
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
// prettier-ignore
type TFromRecord<Key extends t.TSchema, Value extends t.TSchema> = (
  TFromType<Key> extends infer ZodKey extends  z4.core.$ZodRecordKey
    ? z.ZodRecord<ZodKey, TFromType<Value>> 
    : z.ZodNever
)
// prettier-ignore
function FromRecord(type: t.TRecord): z.ZodType {
  const pattern = globalThis.Object.getOwnPropertyNames(type.patternProperties)[0]
  const value = FromType(type.patternProperties[pattern])
  return (
    pattern === t.PatternNumberExact ? z.record(z.number(), value) : 
    pattern === t.PatternStringExact ? z.record(z.string(), value) : 
    z.record(z.string().regex(new RegExp(pattern)), value)
  )
}
// ------------------------------------------------------------------
// Never
// ------------------------------------------------------------------
type TFromNever<Result = z.ZodNever> = Result
function FromNever(type: t.TNever): z.ZodType {
  return z.never()
}
// ------------------------------------------------------------------
// Never
// ------------------------------------------------------------------
type TFromNull<Result = z.ZodNull> = Result
function FromNull(_type: t.TNull): z.ZodType {
  return z.null()
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
type TFromNumber<Result = z.ZodNumber> = Result
function FromNumber(type: t.TNumber): z.ZodType {
  const { exclusiveMaximum, exclusiveMinimum, minimum, maximum, multipleOf } = type
  const constraints: TConstraint<z.ZodNumber>[] = []
  if (t.ValueGuard.IsNumber(exclusiveMinimum)) constraints.push((input) => input.min(exclusiveMinimum + 1))
  if (t.ValueGuard.IsNumber(exclusiveMaximum)) constraints.push((input) => input.min(exclusiveMaximum - 1))
  if (t.ValueGuard.IsNumber(maximum)) constraints.push((input) => input.max(maximum))
  if (t.ValueGuard.IsNumber(minimum)) constraints.push((input) => input.min(minimum))
  if (t.ValueGuard.IsNumber(multipleOf)) constraints.push((input) => input.multipleOf(multipleOf))
  return constraints.reduce((input, constraint) => constraint(input), z.number())
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
type TFromString<Result = z.ZodString> = Result
// prettier-ignore
function FromString(type: t.TString): z.ZodType {
  const constraints: TConstraint<z.ZodString>[] = []
  const { minLength, maxLength, pattern, format } = type
  const input =  t.ValueGuard.IsString(format) ? 
      format === 'base64' ? z.base64() : 
      format === 'base64url' ? z.base64url() : 
      format === 'cidrv4' ? z.cidrv4() :
      format === 'cidrv6' ? z.cidrv6() : 
      format === 'cidr' ? z.union([z.cidrv4(), z.cidrv6()]) : 
      format === 'cuid' ? z.cuid() : 
      format === 'cuid2' ? z.cuid2() :
      format === 'date' ? z.date() : 
      format === 'datetime' ? z.iso.datetime() : 
      format === 'duration' ? z.iso.duration() : 
      format === 'email' ? z.email() : 
      format === 'emoji' ? z.emoji() : 
      format === 'ipv4' ? z.ipv4() : 
      format === 'ipv6' ? z.ipv6() : 
      format === 'ip' ? z.union([z.ipv4(), z.ipv6()]) : 
      format === 'jwt' ? z.jwt() : 
      format === 'nanoid'  ? z.nanoid() : 
      format === 'time' ? z.iso.time() : 
      format === 'ulid' ? z.ulid() : 
      format === 'url' ? z.url() : 
      format === 'uuid' ? z.uuid() : 
      z.string() : z.string();
    
  if (t.ValueGuard.IsNumber(maxLength)) constraints.push((input) => input.max(maxLength))
  if (t.ValueGuard.IsNumber(minLength)) constraints.push((input) => input.min(minLength))
  if (t.ValueGuard.IsString(pattern)) constraints.push((input) => input.regex(new RegExp(pattern)))
    return input instanceof z.ZodString 
     ? constraints.reduce((type, constraint) => constraint(type), input)
    : input;
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
type TFromSymbol<Result = z.ZodSymbol> = Result
function FromSymbol(_type: t.TSymbol): z.ZodType {
  return z.symbol()
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<Types extends t.TSchema[], Mapped extends z.ZodType[] = TFromTypes<Types>> = (
  Mapped extends [z.ZodType, ...z.ZodType[]] | []
    ? z.ZodTuple<Mapped>
    : z.ZodNever
)
function FromTuple(type: t.TTuple): z.ZodType {
  const mapped = FromTypes(type.items || []); 
  return z.tuple(mapped as [z.ZodType, ...z.ZodType[]])
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
type TFromUndefined<Result = z.ZodUndefined> = Result
function FromUndefined(_type: t.TUndefined): z.ZodType {
  return z.undefined()
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Types extends t.TSchema[], Mapped extends z.ZodType[] = TFromTypes<Types>> = (
  Mapped extends z.ZodUnion ? z.ZodUnion<Mapped> : z.ZodNever
)
function FromUnion(_type: t.TUnion): z.ZodType {
  const mapped = FromTypes(_type.anyOf) as [z.ZodType, z.ZodType, ...z.ZodType[]]
  return mapped.length >= 1 ? z.union(mapped) : z.never()
}
// ------------------------------------------------------------------
// TUnknown
// ------------------------------------------------------------------
type TFromUnknown<Result = z.ZodUnknown> = Result
function FromUnknown(_type: t.TUnknown): z.ZodType {
  return z.unknown()
}
// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
type TFromVoid<Result = z.ZodVoid> = Result
function FromVoid(_type: t.TVoid): z.ZodType {
  return z.void()
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
// prettier-ignore
type TFromTypes<Types extends t.TSchema[], Result extends z.ZodType[] = []> = (
  Types extends [infer Left extends t.TSchema, ...infer Right extends t.TSchema[]] 
    ? TFromTypes<Right, [...Result, TFromType<Left>]> 
    : Result
)
function FromTypes(types: t.TSchema[]): Readonly<z.ZodType[]> {
  return types.map((type) => FromType(type)) as Readonly<z.ZodType[]>
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
type TFromType<Type extends t.TSchema,
  // Type Mapping
  Mapped extends z.ZodType | z.ZodNever = (
    Type extends t.TAny ? TFromAny :
    Type extends t.TArray<infer Type extends t.TSchema> ? TFromArray<Type> :
    Type extends t.TBigInt ? TFromBigInt :
    Type extends t.TBoolean ? TFromBoolean :
    Type extends t.TDate ? TFromDate :
    Type extends t.TFunction<infer Parameters extends t.TSchema[], infer ReturnType extends t.TSchema> ? TFromFunction<Parameters, ReturnType> :
    Type extends t.TInteger ? TFromInteger :
    Type extends t.TIntersect<infer Types extends t.TSchema[]> ? TFromIntersect<Types> :
    Type extends t.TLiteral<infer Value extends t.TLiteralValue> ? TFromLiteral<Value> :
    Type extends t.TNever ? TFromNever :
    Type extends t.TNull ? TFromNull :
    Type extends t.TNumber ? TFromNumber :
    Type extends t.TObject<infer Properties extends t.TProperties> ? TFromObject<Properties> :
    Type extends t.TPromise<infer Type extends t.TSchema> ? TFromPromise<Type> :
    Type extends t.TRecord<infer Key extends t.TSchema, infer Value extends t.TSchema> ? TFromRecord<Key, Value> :
    Type extends t.TRegExp ? TFromRegExp :
    Type extends t.TString ? TFromString :
    Type extends t.TSymbol ? TFromSymbol :
    Type extends t.TTuple<infer Types extends t.TSchema[]> ? TFromTuple<Types> :
    Type extends t.TUndefined ? TFromUndefined :
    Type extends t.TUnion<infer Types extends t.TSchema[]> ? TFromUnion<Types> :
    Type extends t.TUnknown ? TFromUnknown :
    Type extends t.TVoid ? TFromVoid :
    z.ZodNever
  ),
  // Modifier Mapping
  IsReadonly extends boolean = Type extends t.TReadonly<t.TSchema> ? true : false,
  IsOptional extends boolean = Type extends t.TOptional<t.TSchema> ? true : false,
  Result extends z.ZodType | z.ZodNever = (
    [IsReadonly, IsOptional] extends [true, true] ? z.ZodReadonly<z.ZodOptional<Mapped>> :
    [IsReadonly, IsOptional] extends [false, true] ? z.ZodOptional<Mapped> :
    [IsReadonly, IsOptional] extends [true, false] ? z.ZodReadonly<Mapped> :
    Mapped
  )
> = Result
// prettier-ignore
function FromType(type: t.TSchema): z.ZodType | z.ZodNever {
  const constraints: TConstraint<z.ZodType>[] = []
  if(!t.ValueGuard.IsUndefined(type.description)) constraints.push(input => input.describe(type.description!))
  if(!t.ValueGuard.IsUndefined(type.default)) constraints.push(input => input.default(type.default))
  const mapped = constraints.reduce((type, constraint) => constraint(type), (
    t.KindGuard.IsAny(type) ? FromAny(type) :
    t.KindGuard.IsArray(type) ? FromArray(type) :
    t.KindGuard.IsBigInt(type) ? FromBigInt(type) :
    t.KindGuard.IsBoolean(type) ? FromBoolean(type) :
    t.KindGuard.IsDate(type) ? FromDate(type) :
    t.KindGuard.IsFunction(type) ? FromFunction(type) :
    t.KindGuard.IsInteger(type) ? FromInteger(type) :
    t.KindGuard.IsIntersect(type) ? FromIntersect(type) :
    t.KindGuard.IsLiteral(type) ? FromLiteral(type) :
    t.KindGuard.IsNever(type) ? FromNever(type) :
    t.KindGuard.IsNull(type) ? FromNull(type) :
    t.KindGuard.IsNumber(type) ? FromNumber(type) :
    t.KindGuard.IsObject(type) ? FromObject(type) :
    t.KindGuard.IsPromise(type) ? FromPromise(type) :
    t.KindGuard.IsRegExp(type) ? FromRegExp(type) :
    t.KindGuard.IsRecord(type) ? FromRecord(type) :
    t.KindGuard.IsString(type) ? FromString(type) :
    t.KindGuard.IsSymbol(type) ? FromSymbol(type) :
    t.KindGuard.IsTuple(type) ? FromTuple(type) :
    t.KindGuard.IsUndefined(type) ? FromUndefined(type) :
    t.KindGuard.IsUnion(type) ? FromUnion(type) :
    t.KindGuard.IsUnknown(type) ? FromUnknown(type) :
    t.KindGuard.IsVoid(type) ? FromVoid(type) :
    z.never()
  ))
  // Modifier Mapping
  const isOptional = t.KindGuard.IsOptional(type)
  const isReadonly = t.KindGuard.IsReadonly(type)
  const result = (
    isOptional && isReadonly ? z.optional(mapped) :
    isOptional && !isReadonly ? z.optional(mapped) :
    !isOptional && isReadonly ? mapped :
    mapped
  )
  return result
}
// ------------------------------------------------------------------
// ZodFromTypeBox
// ------------------------------------------------------------------
/** Creates a Zod type from TypeBox */
// prettier-ignore
export type TZod4FromTypeBox<Type extends t.TSchema,
  Result extends z.ZodType | z.ZodNever = TFromType<Type>
> = Result
/** Creates a Zod v4 type from TypeBox */
export function Zod4FromTypeBox<Type extends t.TSchema>(type: Type): TZod4FromTypeBox<Type> {
  return FromType(type) as never
}
