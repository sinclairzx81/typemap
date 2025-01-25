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

import * as t from '@sinclair/typebox'
import * as v from 'valibot'
import * as c from './common'

// ------------------------------------------------------------------
// Constraints
// ------------------------------------------------------------------
function CreateConstraints(type: t.TSchema, initial: c.BaseConstraint[] = []): c.BaseConstraint[] {
  const constraints: c.BaseConstraint[] = []
  if (t.ValueGuard.IsString(type.description)) constraints.push(v.description(type.description!))
  if (t.ValueGuard.IsString(type.title)) constraints.push(v.title(type.title!))
  if (t.ValueGuard.IsObject(type.metadata)) constraints.push(v.metadata(type.metadata!))
  return [...initial, ...constraints]
}
function CreateType(type: c.BaseSchema, constraints: c.BaseConstraint[] = []) {
  return constraints.length === 0 ? type : v.pipe(type, ...constraints)
}
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
type TFromAny<Result = v.AnySchema> = Result
function FromAny(type: t.TAny): c.BaseSchema {
  return CreateType(v.any(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
type TFromArray<Type extends t.TSchema, Result = v.ArraySchema<TFromType<Type>, c.BaseError>> = Result
function FromArray(type: t.TArray): c.BaseSchema {
  const { minItems, maxItems /* minContains, maxContains, contains */ } = type
  const constraints = CreateConstraints(type)
  if (t.ValueGuard.IsNumber(minItems)) constraints.push(v.minLength(minItems))
  if (t.ValueGuard.IsNumber(maxItems)) constraints.push(v.maxLength(maxItems))
  const mapped = v.array(FromType(type.items))
  return CreateType(mapped, constraints)
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
type TFromBigInt<Result = v.BigintSchema<c.BaseError>> = Result
function FromBigInt(type: t.TBigInt): c.BaseSchema {
  return CreateType(v.bigint(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
type TFromBoolean<Result = v.BooleanSchema<c.BaseError>> = Result
function FromBoolean(type: t.TBoolean): c.BaseSchema {
  return CreateType(v.boolean(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
type TFromDate<Result = v.DateSchema<c.BaseError>> = Result
function FromDate(type: t.TDate): c.BaseSchema {
  return CreateType(v.date(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
type TFromFunction<Parameters extends t.TSchema[], ReturnType extends t.TSchema> = (
  v.FunctionSchema<any>
)
function FromFunction(type: t.TFunction): c.BaseSchema {
  return CreateType(v.function(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Integer
// ------------------------------------------------------------------
type TFromInteger = v.NumberSchema<c.BaseError>
function FromInteger(type: t.TInteger): c.BaseSchema {
  const { exclusiveMaximum, exclusiveMinimum, minimum, maximum, multipleOf } = type
  const constraints = CreateConstraints(type, [v.integer()])
  if (t.ValueGuard.IsNumber(exclusiveMinimum)) constraints.push(v.minValue(exclusiveMinimum + 1))
  if (t.ValueGuard.IsNumber(exclusiveMaximum)) constraints.push(v.minValue(exclusiveMaximum - 1))
  if (t.ValueGuard.IsNumber(maximum)) constraints.push(v.maxValue(maximum))
  if (t.ValueGuard.IsNumber(minimum)) constraints.push(v.minValue(minimum))
  if (t.ValueGuard.IsNumber(multipleOf)) constraints.push(v.multipleOf(multipleOf))
  return CreateType(v.number(), constraints)
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
type TFromIntersect<Types extends t.TSchema[], Result extends c.BaseSchema[] = []> = Types extends [infer Left extends t.TSchema, ...infer Right extends t.TSchema[]]
  ? TFromIntersect<Right, [...Result, TFromType<Left>]>
  : v.IntersectSchema<Result, any>
function FromIntersect(type: t.TIntersect): c.BaseSchema {
  const schemas = type.allOf.map((schema) => FromType(schema))
  return CreateType(v.intersect(schemas), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
type TFromLiteral<Value extends t.TLiteralValue> = v.LiteralSchema<Value, any>
function FromLiteral(type: t.TLiteral): c.BaseSchema {
  return CreateType(v.literal(type.const), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
type TFromObject<Properties extends t.TProperties,
  Result = v.ObjectSchema<{
      [Key in keyof Properties]: TFromType<Properties[Key]>
  }, c.BaseError>
> = Result
function FromObject(type: t.TObject): c.BaseSchema {
  const { additionalProperties } = type
  const constraints = CreateConstraints(type)
  const properties = globalThis.Object.getOwnPropertyNames(type.properties).reduce((result, key) => ({ ...result, [key]: FromType(type.properties[key]) }), {})
  return additionalProperties === false
    ? CreateType(v.strictObject(properties), constraints) // facade
    : CreateType(v.object(properties), constraints)
}
// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
type TFromPromise<_Type extends t.TSchema, Result = v.PromiseSchema<c.BaseError>> = Result
function FromPromise(type: t.TPromise): c.BaseSchema {
  return CreateType(v.promise(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
type TFromRegExp<Result = v.StringSchema<c.BaseError>> = Result
function FromRegExp(type: t.TRegExp): c.BaseSchema {
  const { minLength, maxLength } = type
  const constraints = CreateConstraints(type, [v.regex(new RegExp(type.source, type.flags))])
  if (t.ValueGuard.IsNumber(maxLength)) constraints.push(v.maxLength(maxLength))
  if (t.ValueGuard.IsNumber(minLength)) constraints.push(v.minLength(minLength))
  return CreateType(v.string(), constraints)
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
// prettier-ignore
type TFromRecord<Key extends t.TSchema, Value extends t.TSchema> = (
  TFromType<Key> extends infer MappedKey extends c.BaseRecordKey 
    ? v.RecordSchema<MappedKey, TFromType<Value>, c.BaseError> 
    : v.RecordSchema<v.StringSchema<c.BaseError>, TFromType<Value>, c.BaseError>
)
// prettier-ignore
function FromRecord(type: t.TRecord): c.BaseSchema {
  const constraints = CreateConstraints(type)
  const pattern = globalThis.Object.getOwnPropertyNames(type.patternProperties)[0]
  const value = FromType(type.patternProperties[pattern])
  return (
    pattern === t.PatternStringExact 
      ? CreateType(v.record(v.string(), value), constraints) 
      : CreateType(v.record(v.pipe(v.string(), v.regex(new RegExp(pattern))), value), constraints)
  )
}
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
type TFromOptional<Type extends t.TSchema, Result = v.OptionalSchema<TFromType<Type>, c.BaseError>> = Result
function FromOptional(type: t.TOptional<t.TSchema>): c.BaseSchema {
  return v.optional(FromType(t.Optional(type, false)))
}
// ------------------------------------------------------------------
// Readonly
// ------------------------------------------------------------------
type TFromReadonly<Type extends t.TSchema, Result = TFromType<Type>> = Result
function FromReadonly(type: t.TReadonly<t.TSchema>): c.BaseSchema {
  return FromType(t.Readonly(type, false))
}
// ------------------------------------------------------------------
// Never
// ------------------------------------------------------------------
type TFromNever<Result = v.NeverSchema<c.BaseError>> = Result
function FromNever(type: t.TNever): c.BaseSchema {
  return CreateType(v.never(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
type TFromNull<Result = v.NullSchema<c.BaseError>> = Result
function FromNull(type: t.TNull): c.BaseSchema {
  return CreateType(v.null(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
type TFromNumber<Result = v.NumberSchema<c.BaseError>> = Result
function FromNumber(type: t.TNumber): c.BaseSchema {
  const { exclusiveMaximum, exclusiveMinimum, minimum, maximum, multipleOf } = type
  const constraints = CreateConstraints(type)
  if (t.ValueGuard.IsNumber(exclusiveMinimum)) constraints.push(v.minValue(exclusiveMinimum + 1))
  if (t.ValueGuard.IsNumber(exclusiveMaximum)) constraints.push(v.minValue(exclusiveMaximum - 1))
  if (t.ValueGuard.IsNumber(maximum)) constraints.push(v.maxValue(maximum))
  if (t.ValueGuard.IsNumber(minimum)) constraints.push(v.minValue(minimum))
  if (t.ValueGuard.IsNumber(multipleOf)) constraints.push(v.multipleOf(multipleOf))
  return CreateType(v.number(), constraints)
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
type TFromString<Result = v.StringSchema<c.BaseError>> = Result
// prettier-ignore
function FromString(type: t.TString): c.BaseSchema {
  const { minLength, maxLength, pattern, format } = type
  const constraints = CreateConstraints(type)
  if (t.ValueGuard.IsNumber(maxLength)) constraints.push(v.maxLength(maxLength))
  if (t.ValueGuard.IsNumber(minLength)) constraints.push(v.minLength(minLength))
  if (t.ValueGuard.IsString(pattern)) constraints.push(v.regex(new RegExp(pattern)))
  if (t.ValueGuard.IsString(format)) constraints.push(...(
    format === 'base64' ? [v.base64()] : 
    format === 'bic' ? [v.bic()] : 
    format === 'credit_card' ? [v.creditCard()] : 
    format === 'cuid2' ? [v.cuid2()] : 
    format === 'decimal' ? [v.decimal()] : 
    format === 'digits' ? [v.digits()] : 
    format === 'email' ? [v.email()] : 
    format === 'emoji' ? [v.emoji()] : 
    format === 'ip' ? [v.ip()] : 
    format === 'ipv4' ? [v.ipv4()] : 
    format === 'ipv6' ? [v.ipv6()] : 
    format === 'iso_date' ? [v.isoDate()] : 
    format === 'iso_date_time' ? [v.isoDateTime()] : 
    format === 'iso_time' ? [v.isoTime()] : 
    format === 'iso_time_second' ? [v.isoTimeSecond()] : 
    format === 'iso_timestamp' ? [v.isoTimestamp()] : 
    format === 'iso_week' ? [v.isoWeek()] : 
    format === 'mac' ? [v.mac()] : 
    format === 'mac48' ? [v.mac48()] : 
    format === 'mac64' ? [v.mac64()] : 
    format === 'nanoid' ? [v.nanoid()] : 
    format === 'octal' ? [v.octal()] : 
    format === 'ulid' ? [v.ulid()] : 
    format === 'url' ? [v.url()] : 
    format === 'uuid' ? [v.uuid()] : 
    []))
  return CreateType(v.string(), constraints)
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
type TFromSymbol<Result = v.SymbolSchema<c.BaseError>> = Result
function FromSymbol(type: t.TSymbol): c.BaseSchema {
  return CreateType(v.symbol(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<Types extends t.TSchema[], Mapped extends c.BaseSchema[] = TFromTypes<Types>> = (
  v.TupleSchema<Mapped, c.BaseError>
)
function FromTuple(type: t.TTuple): c.BaseSchema {
  const mapped = FromTypes(type.items || []) as [] | [c.BaseSchema, ...c.BaseSchema[]]
  return CreateType(v.tuple(mapped), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
type TFromUndefined<Result = v.UndefinedSchema<c.BaseError>> = Result
function FromUndefined(type: t.TUndefined): c.BaseSchema {
  return CreateType(v.undefined(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Types extends t.TSchema[], Mapped extends c.BaseSchema[] = TFromTypes<Types>, Result = v.UnionSchema<Mapped, c.BaseError>> = (
  Result  
)
function FromUnion(type: t.TUnion): c.BaseSchema {
  const mapped = FromTypes(type.anyOf) as [c.BaseSchema, c.BaseSchema, ...c.BaseSchema[]]
  return CreateType(v.union(mapped), CreateConstraints(type))
}
// ------------------------------------------------------------------
// TUnknown
// ------------------------------------------------------------------
type TFromUnknown<Result = v.UnknownSchema> = Result
function FromUnknown(type: t.TUnknown): c.BaseSchema {
  return CreateType(v.unknown(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
type TFromVoid<Result = v.VoidSchema<c.BaseError>> = Result
function FromVoid(type: t.TVoid): c.BaseSchema {
  return CreateType(v.void(), CreateConstraints(type))
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
type TFromTypes<Types extends t.TSchema[], Result extends c.BaseSchema[] = []> = Types extends [infer Left extends t.TSchema, ...infer Right extends t.TSchema[]] ? TFromTypes<Right, [...Result, TFromType<Left>]> : Result
function FromTypes(types: t.TSchema[]): c.BaseSchema[] {
  return types.map((type) => FromType(type))
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
type TFromType<Type extends t.TSchema> = (
  Type extends t.TReadonly<infer Type extends t.TSchema> ? TFromReadonly<Type> :
  Type extends t.TOptional<infer Type extends t.TSchema> ? TFromOptional<Type> :
  Type extends t.TAny ? TFromAny :
  Type extends t.TArray<infer Type extends t.TSchema> ? TFromArray<Type> :
  Type extends t.TBigInt ? TFromBigInt :
  Type extends t.TBoolean ? TFromBoolean :
  Type extends t.TDate ? TFromDate :
  Type extends t.TFunction<infer Parameters extends t.TSchema[], infer ReturnType extends t.TSchema> ? TFromFunction<Parameters, ReturnType> :
  Type extends t.TInteger ? TFromInteger :
  Type extends t.TIntersect<infer Types extends t.TSchema[]> ? TFromIntersect<Types> :
  Type extends t.TLiteral<infer Value extends t.TLiteralValue> ? TFromLiteral<Value> :
  Type extends t.TNull ? TFromNull :
  Type extends t.TNever ? TFromNever :
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
  v.NeverSchema<c.BaseError>
)
// prettier-ignore
function FromType(type: t.TSchema): c.BaseSchema {
  return  (
    t.KindGuard.IsReadonly(type) ? FromReadonly(type) :
    t.KindGuard.IsOptional(type) ? FromOptional(type) :
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
    v.never()
  )
}
// ------------------------------------------------------------------
// ValibotFromTypeBox
// ------------------------------------------------------------------
// prettier-ignore
export type TValibotFromTypeBox<Type extends object | string> = (
  Type extends t.TSchema ? TFromType<Type> : v.NeverSchema<c.BaseError>
)
// prettier-ignore
export function ValibotFromTypeBox<Type extends object | string>(type: Type): TValibotFromTypeBox<Type> {
  return (t.KindGuard.IsSchema(type) ? FromType(type) : v.never()) as never
}
