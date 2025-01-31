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
import * as z from 'zod'

// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
function Options(type: z.ZodTypeAny): t.SchemaOptions {
  const description = t.ValueGuard.IsUndefined(type.description) ? {} : { description: type.description }
  return { ...description }
}
// ------------------------------------------------------------------
// Formats
// ------------------------------------------------------------------
const check = (type: z.ZodTypeAny, value: unknown) => type.safeParse(value).success
t.FormatRegistry.Set('base64', (value) => check(z.string().base64(), value))
t.FormatRegistry.Set('base64url', (value) => check(z.string().base64url(), value))
t.FormatRegistry.Set('cidrv4', (value) => check(z.string().cidr({ version: 'v4' }), value))
t.FormatRegistry.Set('cidrv6', (value) => check(z.string().cidr({ version: 'v6' }), value))
t.FormatRegistry.Set('cidr', (value) => check(z.string().cidr(), value))
t.FormatRegistry.Set('cuid', (value) => check(z.string().cuid(), value))
t.FormatRegistry.Set('cuid2', (value) => check(z.string().cuid2(), value))
t.FormatRegistry.Set('date', (value) => check(z.string().date(), value))
t.FormatRegistry.Set('datetime', (value) => check(z.string().datetime(), value))
t.FormatRegistry.Set('duration', (value) => check(z.string().duration(), value))
t.FormatRegistry.Set('email', (value) => check(z.string().email(), value))
t.FormatRegistry.Set('emoji', (value) => check(z.string().emoji(), value))
t.FormatRegistry.Set('ipv4', (value) => check(z.string().ip({ version: 'v4' }), value))
t.FormatRegistry.Set('ipv6', (value) => check(z.string().ip({ version: 'v6' }), value))
t.FormatRegistry.Set('ip', (value) => check(z.string().ip(), value))
t.FormatRegistry.Set('jwt', (value) => check(z.string().jwt(), value))
t.FormatRegistry.Set('nanoid', (value) => check(z.string().nanoid(), value))
t.FormatRegistry.Set('time', (value) => check(z.string().time(), value))
t.FormatRegistry.Set('ulid', (value) => check(z.string().ulid(), value))
t.FormatRegistry.Set('url', (value) => check(z.string().url(), value))
t.FormatRegistry.Set('uuid', (value) => check(z.string().uuid(), value))
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
type TFromAny = t.TAny
function FromAny<Def extends z.ZodAnyDef>(_def: Def): t.TSchema {
  return t.Any()
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
type TFromArray<Type extends z.ZodTypeAny> = t.Ensure<t.TArray<TFromType<Type>>>
function FromArray<Def extends z.ZodArrayDef>(def: Def): t.TSchema {
  const minItems = def.minLength === null ? {} : { minItems: def.minLength.value }
  const maxItems = def.maxLength === null ? {} : { minItems: def.maxLength.value }
  const options = { ...minItems, ...maxItems }
  return t.Array(FromType(def.type), options)
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
type TFromBigInt = t.TBigInt
function FromBigInt<Def extends z.ZodBigIntDef>(def: Def): t.TSchema {
  return t.BigInt()
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
type TFromBoolean = t.TBoolean
function FromBoolean<Def extends z.ZodBooleanDef>(def: Def): t.TSchema {
  return t.Boolean()
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
type TFromDate = t.TDate
function FromDate<Def extends z.ZodDateDef>(def: Def): t.TSchema {
  return t.Date()
}
// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
type TFromDefault<Type extends z.ZodType> = TFromType<Type>
function FromDefault<Def extends z.ZodDefaultDef>(def: Def): t.TSchema {
  return t.CloneType(FromType(def.innerType), { default: def.defaultValue() })
}
// ------------------------------------------------------------------
// DiscriminatedUnion
// ------------------------------------------------------------------
// prettier-ignore
type TFromDiscriminatedUnion<Discriminator extends string, Types extends readonly z.ZodObject<any>[], Result extends t.TSchema[] = []> = (
  Types extends [infer Left extends z.ZodObject<any>, ...infer Right extends z.ZodObject<any>[]] 
    ? TFromDiscriminatedUnion<Discriminator, Right, [...Result, TFromType<Left>]>
    : t.TUnion<Result>
)
function FromDiscriminatedUnion<Def extends z.ZodDiscriminatedUnionDef<string, z.ZodDiscriminatedUnionOption<string>[]>>(def: Def): t.TSchema {
  const types = def.options.map((type) => FromType(type))
  return t.Union(types, { discriminator: def.discriminator })
}
// ------------------------------------------------------------------
// Effects
// ------------------------------------------------------------------
type TFromEffects<Input extends z.ZodTypeAny, Output extends unknown> = t.Ensure<t.TTransform<TFromType<Input>, Output>>
function FromEffects<Type extends z.ZodEffects<z.ZodTypeAny, unknown>>(type: Type): t.TSchema {
  return t
    .Transform(FromType(type._def.schema))
    .Decode((value) => type.parse(value))
    .Encode((_) => {
      throw Error('Encode not implemented for Zod types')
    })
}
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
/** prettier-ignore */
type TFromEnum<Variants extends string[], Result extends t.TLiteral[] = []> = Variants extends [infer Left extends string, ...infer Right extends string[]] ? TFromEnum<Right, [...Result, t.TLiteral<Left>]> : t.TUnion<Result>
function FromEnum<Def extends z.ZodEnumDef>(def: Def): t.TSchema {
  const variants = def.values.map((value) => t.Literal(value))
  return t.Union(variants)
}
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
type TFromLiteral<Value extends unknown> = t.Ensure<Value extends t.TLiteralValue ? t.TLiteral<Value> : t.TNever>
function FromLiteral<Def extends z.ZodLiteralDef>(def: Def): t.TSchema {
  return t.Literal(def.value as t.TLiteralValue)
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<Types extends z.ZodTypeAny[], Result extends t.TSchema[] = []> = (
  Types extends [infer Left extends z.ZodTypeAny, ...infer Right extends z.ZodTypeAny[]]
    ? TFromIntersect<Right, [...Result, TFromType<Left>]>
    : t.Ensure<t.TIntersect<Result>>
)
function FromIntersect<Type extends z.ZodIntersectionDef>(type: Type): t.TSchema {
  return t.Intersect([FromType(type.left), FromType(type.right)])
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
type TFromObject<Properties extends z.ZodRawShape> = t.Ensure<
  t.TObject<{
    [Key in keyof Properties]: TFromType<Properties[Key]>
  }>
>
function FromObject<Def extends z.ZodObjectDef<z.ZodRawShape>, Shape extends z.ZodRawShape>(def: Def, shape: Shape): t.TSchema {
  const additionalProperties = def.unknownKeys === 'strict' ? { additionalProperties: false } : {}
  const options = { ...additionalProperties }
  return t.Object(
    globalThis.Object.keys(shape).reduce((properties: any, key: any) => {
      return { ...properties, [key]: FromType(shape[key]) }
    }, {} as t.TProperties) as never,
    options,
  )
}
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
type TFromOptional<Type extends z.ZodTypeAny, Result extends t.TSchema = t.TOptional<TFromType<Type>>> = Result
function FromOptional<Def extends z.ZodOptionalDef>(def: Def): t.TSchema {
  return t.Optional(FromType(def.innerType))
}
// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
type TFromPromise<Type extends z.ZodTypeAny> = t.Ensure<t.TPromise<TFromType<Type>>>
function FromPromise<Def extends z.ZodPromiseDef>(def: Def): t.TSchema {
  return t.Promise(FromType(def.type))
}
// ------------------------------------------------------------------
// Nullable
// ------------------------------------------------------------------
type TFromNullable<Type extends z.ZodTypeAny> = t.Ensure<t.TUnion<[t.TNull, TFromType<Type>]>>
function FromNullable<Def extends z.ZodNullableDef>(def: Def): t.TSchema {
  return t.Union([t.Null(), FromType(def.innerType)])
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
type TFromNumber = t.TNumber
// prettier-ignore
function FromNumber<Def extends z.ZodNumberDef>(def: Def): t.TSchema {
  const options = def.checks.reduce((options, check) => {
    return { ...options, ... (    
      check.kind === 'int' ? { multipleOf: 1 } :
      check.kind === 'max' ? check.inclusive ? { maximum: check.value } : { exclusiveMaximum: check.value } :
      check.kind === 'min' ? check.inclusive ? { minimum: check.value } : { exclusiveMinimum: check.value } :
      check.kind === 'multipleOf' ? { multipleOf: check.value } :
      {} 
    )}
  }, {})
  return t.Number(options)
}
// ------------------------------------------------------------------
// Never
// ------------------------------------------------------------------
type TFromNever = t.TNever
function FromNever<Def extends z.ZodNeverDef>(def: Def): t.TSchema {
  return t.Never()
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
type TFromNull = t.TNull
function FromNull<Def extends z.ZodNullDef>(def: Def): t.TSchema {
  return t.Null()
}
// ------------------------------------------------------------------
// Readonly
// ------------------------------------------------------------------
type TFromReadonly<Type extends z.ZodTypeAny, Result extends t.TSchema = t.TReadonly<TFromType<Type>>> = Result
function FromReadonly<Def extends z.ZodReadonlyDef>(def: Def): t.TSchema {
  return t.Readonly(FromType(def.innerType))
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
type TFromRecord<Key extends z.ZodTypeAny, Value extends z.ZodTypeAny> = t.Ensure<t.TRecordOrObject<TFromType<Key>, TFromType<Value>>>
function FromRecord<Def extends z.ZodRecordDef>(def: Def): t.TSchema {
  return t.Record(FromType(def.keyType), FromType(def.valueType))
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
type TFromString = t.TString
// prettier-ignore
function FromString<Def extends z.ZodStringDef>(def: Def): t.TSchema {
  const options = def.checks.reduce((options, check) => {
    return { ...options, ...(
      check.kind === 'base64' ? { format: 'base64' } :
      check.kind === 'base64url' ? { format: 'base64url' } :
      check.kind === 'cidr' ? { format: check.version === 'v4' ? 'cidrv4' : check.version === 'v6' ? 'cidrv6' : 'cidr' } :
      check.kind === 'cuid' ? { format: 'cuid' } :
      check.kind === 'cuid2' ? { format: 'cuid2' } :
      check.kind === 'date' ? { format: 'date' } : 
      check.kind === 'datetime' ? { format: 'datetime' } :
      check.kind === 'duration' ? { format: 'duration' } :
      check.kind === 'email' ? { format: 'email' } :
      check.kind === 'emoji' ? { format: 'emoji' } :
      check.kind === 'endsWith' ? { pattern: `${check.value}$` } :
      check.kind === 'includes' ? { pattern: check.value } :
      check.kind === 'ip' ? { format: check.version === 'v4' ? 'ipv4' : check.version === 'v6' ? 'ipv6' : 'ip' } :
      check.kind === 'jwt' ? { format: 'jwt' } :
      check.kind === 'length' ? { minLength: check.value, maxLength: check.value } :
      check.kind === 'min' ? { minLength: check.value } : 
      check.kind === 'max' ? { maxLength: check.value } : 
      check.kind === 'nanoid' ? { format: 'nanoid' } :
      check.kind === 'regex' ? { pattern: check.regex.source } :
      check.kind === 'startsWith' ? { pattern: `^${check.value}` } :
      check.kind === 'time' ? { format: 'time' } :
      check.kind === 'ulid' ? { format: 'ulid' } :
      check.kind === 'url' ? { format: 'url' } : 
      check.kind === 'uuid' ? { format: 'uuid' } :
      {}
    )}
  }, {})
  return t.String(options)
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
type TFromSymbol = t.TSymbol
function FromSymbol<Def extends z.ZodSymbolDef>(def: Def): t.TSchema {
  return t.Symbol()
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<Types extends z.ZodTypeAny[], Result extends t.TSchema[] = []> = (
  Types extends [infer Left extends z.ZodTypeAny, ...infer Right extends z.ZodTypeAny[]]
    ? TFromTuple<Right, [...Result, TFromType<Left>]>
    : t.TTuple<Result>
)
function FromTuple<Def extends z.ZodTupleDef>(def: Def): t.TSchema {
  return t.Tuple(def.items.map((item) => FromType(item)))
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
type TFromUndefined = t.TUndefined
function FromUndefined<Def extends z.ZodUndefinedDef>(def: Def): t.TSchema {
  return t.Undefined()
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Types extends z.ZodTypeAny[], Result extends t.TSchema[] = []> = (
  Types extends [infer Left extends z.ZodTypeAny, ...infer Right extends z.ZodTypeAny[]]
    ? TFromUnion<Right, [...Result, TFromType<Left>]>
    : t.TUnion<Result>
)
function FromUnion<Def extends z.ZodUnionDef>(def: Def): t.TSchema {
  return t.Union(def.options.map((item) => FromType(item)))
}
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
type TFromUnknown = t.TUnknown
function FromUnknown<Def extends z.ZodUnknownDef>(def: Def): t.TSchema {
  return t.Unknown()
}
// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
type TFromVoid = t.TVoid
function FromVoid<Def extends z.ZodVoidDef>(def: Def): t.TSchema {
  return t.Void()
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
  Type extends z.ZodDiscriminatedUnion<infer Discriminator, infer Types> ? TFromDiscriminatedUnion<Discriminator, Types> : 
  Type extends z.ZodEffects<infer Input, infer Output> ? TFromEffects<Input, Output> :
  Type extends z.ZodEnum<infer Variants> ? TFromEnum<Variants> :
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
  Type extends z.ZodTuple<infer Types> ? TFromTuple<t.Assert<Types, z.ZodTypeAny[]>> :  
  Type extends z.ZodUndefined ? TFromUndefined :
  Type extends z.ZodUnion<infer Types> ? TFromUnion<t.Assert<Types, z.ZodTypeAny[]>> :
  Type extends z.ZodUnknown ? TFromUnknown :
  Type extends z.ZodVoid ? TFromVoid :
  // Intersection (Ensure Last Due to Zod Differentiation Issue)
  Type extends z.ZodIntersection<infer Left, infer Right> ? TFromIntersect<[Left, Right]> :
  t.TNever
)
// prettier-ignore
function FromType<Type extends z.ZodType>(type: Type): t.TSchema {
  const schema = (
    type instanceof z.ZodAny ? FromAny(type._def) :
    type instanceof z.ZodArray ? FromArray(type._def) :
    type instanceof z.ZodBigInt ? FromBigInt(type._def) :
    type instanceof z.ZodBoolean ? FromBoolean(type._def) :
    type instanceof z.ZodDate ? FromDate(type._def) :
    type instanceof z.ZodDefault ? FromDefault(type._def) :
    type instanceof z.ZodDiscriminatedUnion ? FromDiscriminatedUnion(type._def) :
    type instanceof z.ZodEffects ? FromEffects(type) :
    type instanceof z.ZodEnum ? FromEnum(type._def) :
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
    t.Never()
  ) as t.TSchema
  return t.CreateType(schema, Options(type)) as t.TSchema
}
// ------------------------------------------------------------------
// TypeBoxFromZod
// ------------------------------------------------------------------
/** Creates a TypeBox type from Zod */
export type TTypeBoxFromZod<Type extends z.ZodTypeAny | z.ZodEffects<any>, Result extends t.TSchema = TFromType<Type>> = Result

/** Creates a TypeBox type from Zod */
// prettier-ignore
export function TypeBoxFromZod<Type extends z.ZodTypeAny | z.ZodEffects<any>>(type: Type): TTypeBoxFromZod<Type> {
  return FromType(type) as never
}
