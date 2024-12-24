/*--------------------------------------------------------------------------

@sinclair/typebox-remix

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

import * as tb from '@sinclair/typebox'
import * as z from 'zod'

// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
function Options(type: z.ZodTypeAny): tb.SchemaOptions {
  const description = tb.ValueGuard.IsUndefined(type.description) ? {} : { description: type.description }
  return { ...description }
}
// ------------------------------------------------------------------
// Formats
// ------------------------------------------------------------------
const check = (type: z.ZodTypeAny, value: unknown) => type.safeParse(value).success
tb.FormatRegistry.Set('zod:base64', (value) => check(z.string().base64(), value))
tb.FormatRegistry.Set('zod:base64url', (value) => check(z.string().base64url(), value))
tb.FormatRegistry.Set('zod:cidrv4', (value) => check(z.string().cidr({ version: 'v4' }), value))
tb.FormatRegistry.Set('zod:cidrv6', (value) => check(z.string().cidr({ version: 'v6' }), value))
tb.FormatRegistry.Set('zod:cidr', (value) => check(z.string().cidr(), value))
tb.FormatRegistry.Set('zod:cuid', (value) => check(z.string().cuid(), value))
tb.FormatRegistry.Set('zod:cuid2', (value) => check(z.string().cuid2(), value))
tb.FormatRegistry.Set('zod:ulid', (value) => check(z.string().ulid(), value))
tb.FormatRegistry.Set('zod:email', (value) => check(z.string().email(), value))
tb.FormatRegistry.Set('zod:emoji', (value) => check(z.string().emoji(), value))
tb.FormatRegistry.Set('zod:ipv4', (value) => check(z.string().ip({ version: 'v4' }), value))
tb.FormatRegistry.Set('zod:ipv6', (value) => check(z.string().ip({ version: 'v6' }), value))
tb.FormatRegistry.Set('zod:ip', (value) => check(z.string().ip(), value))
tb.FormatRegistry.Set('zod:ipv6Cidr', (value) => check(z.string().cidr({ version: 'v6' }), value))
tb.FormatRegistry.Set('zod:nanoid', (value) => check(z.string().nanoid(), value))
tb.FormatRegistry.Set('zod:jwt', (value) => check(z.string().jwt(), value))
tb.FormatRegistry.Set('zod:date', (value) => check(z.string().date(), value))
tb.FormatRegistry.Set('zod:datetime', (value) => check(z.string().datetime(), value))
tb.FormatRegistry.Set('zod:duration', (value) => check(z.string().duration(), value))
tb.FormatRegistry.Set('zod:time', (value) => check(z.string().time(), value))
tb.FormatRegistry.Set('zod:url', (value) => check(z.string().url(), value))
tb.FormatRegistry.Set('zod:uuid', (value) => check(z.string().uuid(), value))
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
type TFromAny = tb.TAny
function FromAny<Def extends z.ZodAnyDef>(_def: Def) {
  return tb.Any()
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
type TFromArray<Type extends z.ZodTypeAny> = tb.Ensure<tb.TArray<TFromType<Type>>>
function FromArray<Def extends z.ZodArrayDef>(def: Def): tb.TSchema {
  const minItems = def.minLength === null ? {} : { minItems: def.minLength.value }
  const maxItems = def.maxLength === null ? {} : { minItems: def.maxLength.value }
  const options = { ...minItems, ...maxItems }
  return tb.Array(FromType(def.type), options)
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
type TFromBigInt = tb.TBigInt
function FromBigInt<Def extends z.ZodBigIntDef>(def: Def) {
  return tb.BigInt()
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
type TFromBoolean = tb.TBoolean
function FromBoolean<Def extends z.ZodBooleanDef>(def: Def) {
  return tb.Boolean()
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
type TFromDate = tb.TDate
function FromDate<Def extends z.ZodDateDef>(def: Def) {
  return tb.Date()
}
// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
type TFromDefault<Type extends z.ZodType> = TFromType<Type>
function FromDefault<Def extends z.ZodDefaultDef>(def: Def): tb.TSchema {
  return tb.CloneType(FromType(def.innerType), { default: def.defaultValue() })
}
// ------------------------------------------------------------------
// Effects
// ------------------------------------------------------------------
type TFromEffects<Input extends z.ZodTypeAny, Output extends unknown> = tb.Ensure<tb.TTransform<TFromType<Input>, Output>>
function FromEffects<Type extends z.ZodEffects<z.ZodTypeAny, unknown>>(type: Type): tb.TSchema {
  return tb
    .Transform(FromType(type._def.schema))
    .Decode((value) => type.parse(value))
    .Encode((_) => {
      throw Error('Encode not implemented for Zod types')
    })
}
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
type TFromLiteral<Value extends unknown> = tb.Ensure<Value extends tb.TLiteralValue ? tb.TLiteral<Value> : tb.TNever>
function FromLiteral<Def extends z.ZodLiteralDef>(def: Def) {
  return tb.Literal(def.value as tb.TLiteralValue)
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<Types extends z.ZodTypeAny[], Result extends tb.TSchema[] = []> = (
  Types extends [infer Left extends z.ZodTypeAny, ...infer Right extends z.ZodTypeAny[]]
    ? TFromIntersect<Right, [...Result, TFromType<Left>]>
    : tb.Ensure<tb.TIntersect<Result>>
)
function FromIntersect<Type extends z.ZodIntersectionDef>(type: Type): tb.TSchema {
  return tb.Intersect([FromType(type.left), FromType(type.right)])
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
type TFromObject<Properties extends z.ZodRawShape> = tb.Ensure<
  tb.TObject<{
    [Key in keyof Properties]: TFromType<Properties[Key]>
  }>
>
function FromObject<Def extends z.ZodObjectDef<z.ZodRawShape>, Shape extends z.ZodRawShape>(def: Def, shape: Shape): tb.TSchema {
  const additionalProperties = def.unknownKeys === 'strict' ? { additionalProperties: false } : {}
  const options = { ...additionalProperties }
  return tb.Object(
    globalThis.Object.keys(shape).reduce((properties: any, key: any) => {
      return { ...properties, [key]: FromType(shape[key]) }
    }, {} as tb.TProperties) as never,
    options,
  )
}
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
type TFromOptional<Type extends z.ZodTypeAny, Result extends tb.TSchema = tb.TOptional<TFromType<Type>>> = Result
function FromOptional<Def extends z.ZodOptionalDef>(def: Def): tb.TSchema {
  return tb.Optional(FromType(def.innerType))
}
// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
type TFromPromise<Type extends z.ZodTypeAny> = tb.Ensure<tb.TPromise<TFromType<Type>>>
function FromPromise<Def extends z.ZodPromiseDef>(def: Def): tb.TSchema {
  return tb.Promise(FromType(def.type))
}
// ------------------------------------------------------------------
// Nullable
// ------------------------------------------------------------------
type TFromNullable<Type extends z.ZodTypeAny> = tb.Ensure<tb.TUnion<[tb.TNull, TFromType<Type>]>>
function FromNullable<Def extends z.ZodNullableDef>(def: Def): tb.TSchema {
  return tb.Union([tb.Null(), FromType(def.innerType)])
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
type TFromNumber = tb.TNumber
// prettier-ignore
function FromNumber<Def extends z.ZodNumberDef>(def: Def) {
  const options = def.checks.reduce((options, check) => {
    return { ...options, ... (    
      check.kind === 'int' ? { multipleOf: 1 } :
      check.kind === 'max' ? check.inclusive ? { maximum: check.value } : { exclusiveMaximum: check.value } :
      check.kind === 'min' ? check.inclusive ? { minimum: check.value } : { exclusiveMinimum: check.value } :
      check.kind === 'multipleOf' ? { multipleOf: check.value } :
      {} 
    )}
  }, {})
  return tb.Number(options)
}
// ------------------------------------------------------------------
// Never
// ------------------------------------------------------------------
type TFromNever = tb.TNever
function FromNever<Def extends z.ZodNeverDef>(def: Def) {
  return tb.Never()
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
type TFromNull = tb.TNull
function FromNull<Def extends z.ZodNullDef>(def: Def) {
  return tb.Null()
}
// ------------------------------------------------------------------
// Readonly
// ------------------------------------------------------------------
type TFromReadonly<Type extends z.ZodTypeAny, Result extends tb.TSchema = tb.TReadonly<TFromType<Type>>> = Result
function FromReadonly<Def extends z.ZodReadonlyDef>(def: Def): tb.TSchema {
  return tb.Readonly(FromType(def.innerType))
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
export type TFromRecord<Key extends z.ZodTypeAny, Value extends z.ZodTypeAny> = tb.Ensure<tb.TRecordOrObject<TFromType<Key>, TFromType<Value>>>
function FromRecord<Def extends z.ZodRecordDef>(def: Def): tb.TSchema {
  return tb.Record(FromType(def.keyType), FromType(def.valueType))
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
type TFromString = tb.TString
// prettier-ignore
function FromString<Def extends z.ZodStringDef>(def: Def) {
  const options = def.checks.reduce((options, check) => {
    return { ...options, ...(
      check.kind === 'base64' ? { format: 'zod:base64' } :
      check.kind === 'base64url' ? { format: 'zod:base64url' } :
      check.kind === 'cidr' ? { format: check.version === 'v4' ? 'zod:cidrv4' : check.version === 'v6' ? 'zod:cidrv6' : 'zod:cidr' } :
      check.kind === 'cuid' ? { format: 'zod:cuid' } :
      check.kind === 'cuid2' ? { format: 'zod:cuid2' } :
      check.kind === 'date' ? { format: 'zod:date' } : 
      check.kind === 'datetime' ? { format: 'zod:datetime' } :
      check.kind === 'duration' ? { format: 'zod:duration' } :
      check.kind === 'email' ? { format: 'zod:email' } :
      check.kind === 'emoji' ? { format: 'zod:emoji' } :
      check.kind === 'endsWith' ? { pattern: `${check.value}$` } :
      check.kind === 'includes' ? { pattern: check.value } :
      check.kind === 'ip' ? { format: check.version === 'v4' ? 'zod:ipv4' : check.version === 'v6' ? 'zod:ipv6' : 'zod:ip' } :
      check.kind === 'jwt' ? { format: 'zod:jwt' } :
      check.kind === 'length' ? { minLength: check.value, maxLength: check.value } :
      check.kind === 'min' ? { minLength: check.value } : 
      check.kind === 'max' ? { maxLength: check.value } : 
      check.kind === 'nanoid' ? { format: 'zod:nanoid' } :
      check.kind === 'regex' ? { pattern: check.regex.source } :
      check.kind === 'startsWith' ? { pattern: `^${check.value}` } :
      check.kind === 'time' ? { format: 'zod:time' } :
      check.kind === 'ulid' ? { format: 'zod:ulid' } :
      check.kind === 'url' ? { format: 'zod:url' } : 
      check.kind === 'uuid' ? { format: 'zod:uuid' } :
      {}
    )}
  }, {})
  return tb.String(options)
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
type TFromSymbol = tb.TSymbol
function FromSymbol<Def extends z.ZodSymbolDef>(def: Def) {
  return tb.Symbol()
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<Types extends z.ZodTypeAny[], Result extends tb.TSchema[] = []> = (
  Types extends [infer Left extends z.ZodTypeAny, ...infer Right extends z.ZodTypeAny[]]
    ? TFromTuple<Right, [...Result, TFromType<Left>]>
    : tb.TTuple<Result>
)
function FromTuple<Def extends z.ZodTupleDef>(def: Def): tb.TSchema {
  return tb.Tuple(def.items.map((item) => FromType(item)))
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
type TFromUndefined = tb.TUndefined
function FromUndefined<Def extends z.ZodUndefinedDef>(def: Def) {
  return tb.Undefined()
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Types extends z.ZodTypeAny[], Result extends tb.TSchema[] = []> = (
  Types extends [infer Left extends z.ZodTypeAny, ...infer Right extends z.ZodTypeAny[]]
    ? TFromUnion<Right, [...Result, TFromType<Left>]>
    : tb.TUnion<Result>
)
function FromUnion<Def extends z.ZodUnionDef>(def: Def): tb.TSchema {
  return tb.Union(def.options.map((item) => FromType(item)))
}
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
type TFromUnknown = tb.TUnknown
function FromUnknown<Def extends z.ZodUnknownDef>(def: Def) {
  return tb.Unknown()
}
// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
type TFromVoid = tb.TVoid
function FromVoid<Def extends z.ZodVoidDef>(def: Def) {
  return tb.Void()
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
type TFromType<Type extends z.ZodType> = (
  Type extends z.ZodAny ? TFromAny :
  Type extends z.ZodArray<infer Type> ? TFromArray<Type> :
  Type extends z.ZodBigInt ? TFromBigInt :
  Type extends z.ZodBoolean ? TFromBoolean :
  Type extends z.ZodDate ? TFromDate :
  Type extends z.ZodDefault<infer Type> ? TFromDefault<Type> :
  Type extends z.ZodEffects<infer Input, infer Output> ? TFromEffects<Input, Output> :
  Type extends z.ZodLiteral<infer Value> ? TFromLiteral<Value> :
  Type extends z.ZodNullable<infer Type> ? TFromNullable<Type> :
  Type extends z.ZodObject<infer Properties> ? TFromObject<Properties> :
  Type extends z.ZodOptional<infer Type> ? TFromOptional<Type> :
  Type extends z.ZodPromise<infer Type> ? TFromPromise<Type> :
  Type extends z.ZodRecord<infer Key, infer Value> ? TFromRecord<Key, Value> :
  Type extends z.ZodReadonly<infer Type> ? TFromReadonly<Type> :
  Type extends z.ZodNumber ? TFromNumber :
  Type extends z.ZodNever ? TFromNever :
  Type extends z.ZodNull ? TFromNull :
  Type extends z.ZodString ? TFromString :
  Type extends z.ZodSymbol ? TFromSymbol :
  Type extends z.ZodTuple<infer Types> ? TFromTuple<tb.Assert<Types, z.ZodTypeAny[]>> :  
  Type extends z.ZodUndefined ? TFromUndefined :
  Type extends z.ZodUnion<infer Types> ? TFromUnion<tb.Assert<Types, z.ZodTypeAny[]>> :
  Type extends z.ZodUnknown ? TFromUnknown :
  Type extends z.ZodVoid ? TFromVoid :
  // Intersection (Ensure Last Due to Zod Differentiation Issue)
  Type extends z.ZodIntersection<infer Left, infer Right> ? TFromIntersect<[Left, Right]> :
  tb.TNever
)
// prettier-ignore
function FromType<Type extends z.ZodType>(type: Type): tb.TSchema {
  const schema = (
    type instanceof z.ZodAny ? FromAny(type._def) :
    type instanceof z.ZodArray ? FromArray(type._def) :
    type instanceof z.ZodBigInt ? FromBigInt(type._def) :
    type instanceof z.ZodBoolean ? FromBoolean(type._def) :
    type instanceof z.ZodDate ? FromDate(type._def) :
    type instanceof z.ZodDefault ? FromDefault(type._def) :
    type instanceof z.ZodEffects ? FromEffects(type) :
    type instanceof z.ZodLiteral ? FromLiteral(type._def) :
    type instanceof z.ZodNullable ? FromNullable(type._def) :
    type instanceof z.ZodObject ? FromObject(type._def, type.shape) :
    type instanceof z.ZodOptional ? FromOptional(type._def) :
    type instanceof z.ZodPromise ? FromPromise(type._def) :
    type instanceof z.ZodReadonly ? FromReadonly(type._def) :
    type instanceof z.ZodRecord ? FromRecord(type._def) : 
    type instanceof z.ZodNever ? FromNever(type._def) :
    type instanceof z.ZodNull ? FromNull(type._def) :
    type instanceof z.ZodNumber ? FromNumber(type._def) :
    type instanceof z.ZodString ? FromString(type._def) :
    type instanceof z.ZodSymbol ? FromSymbol(type._def) :
    type instanceof z.ZodTuple ? FromTuple(type._def) :
    type instanceof z.ZodUndefined ? FromUndefined(type._def) :
    type instanceof z.ZodUnion ? FromUnion(type._def) :
    type instanceof z.ZodUnknown ? FromUnknown(type._def) :
    type instanceof z.ZodVoid ? FromVoid(type._def) :
    // Intersection (Ensure Last Due to Zod Differentiation Issue)
    type instanceof z.ZodIntersection ? FromIntersect(type._def) :
    tb.Never()
  ) as tb.TSchema
  return tb.CreateType(schema, Options(type)) as tb.TSchema
}
// ------------------------------------------------------------------
// Box
// ------------------------------------------------------------------
/** Converts a Zod Type to a TypeBox Type */
export type TBox<Type extends unknown> = Type extends z.ZodType ? TFromType<Type> : undefined
/** Converts a Zod Type to a TypeBox Type */
export function Box<Type extends unknown, Result extends TBox<Type> = TBox<Type>>(type: Type): Result {
  return (type instanceof z.ZodType ? FromType(type) : undefined) as never
}
