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
import * as v from 'valibot'

// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
function IsSchemaWithPipe(type: BaseSchema): type is v.SchemaWithPipe<[BaseSchema, ...BaseValidation[]]> {
  return tb.ValueGuard.IsObject(type) && tb.ValueGuard.HasPropertyKey(type, 'pipe') && tb.ValueGuard.IsArray(type.pipe)
}
// prettier-ignore
function Options(type: BaseSchema) {
  if (!IsSchemaWithPipe(type)) return {}
  return type.pipe.slice(1).reduce((options, action: { type: string } & { [key: string]: any }) => {
    return {
      ...options, ...(
      action.type === 'args' ? {} :
      action.type === 'base64' ? { format: 'valibot:base64' } :
      action.type === 'bic' ? { format: 'valibot:bic' } :
      action.type === 'brand' ? {} :
      action.type === 'bytes' ? {} :
      action.type === 'check' ? {} :
      action.type === 'check_items' ? {} :
      action.type === 'credit_card' ? { format: 'valibot:credit_card' } :
      action.type === 'cuid2' ? { format: 'valibot:cuid2' } :
      action.type === 'decimal' ? { format: 'valibot:decimal' } :
      action.type === 'description' ? { description: action.description } :
      action.type === 'digits' ? { format: 'valibot:digits' } :
      action.type === 'email' ? { format: 'valibot:email' } :
      action.type === 'emoji' ? { format: 'valibot:emoji' } :
      action.type === 'empty' ? (
      type.type === 'array' ? { maxItems: 0 } :
      type.type === 'string' ? { maxLength: 0 } :
      {}) :
      action.type === 'ends_with' ? { pattern: `${action.requirement}$` } :
      action.type === 'every_item' ? {} :
      action.type === 'excludes' ? {} :
      action.type === 'filter_items' ? {} :
      action.type === 'find_items' ? {} :
      action.type === 'finite' ? {} :
      action.type === 'graphemes' ? {} :
      action.type === 'hash' ? {} :
      action.type === 'hexadecimal' ? {} :
      action.type === 'hex_color' ? {} :
      action.type === 'imei' ? {} :
      action.type === 'includes' ? (
      type.type === 'array' ? { contains: tb.Literal(action.requirement) } :
      type.type === 'string' ? { pattern: action.requirement } :
      {}) :
      action.type === 'integer' ? { multipleOf: 1 } :
      action.type === 'ip' ? { format: 'valibot:ip' } :
      action.type === 'ipv4' ? { format: 'valibot:ipv4' } :
      action.type === 'ipv6' ? { format: 'valibot:ipv6' } :
      action.type === 'iso_date' ? { format: 'valibot:iso_date' } :
      action.type === 'iso_date_time' ? { format: 'valibot:iso_date_time' } :
      action.type === 'iso_time' ? { format: 'valibot:iso_time' } :
      action.type === 'iso_time_second' ? { format: 'valibot:iso_time_second' } :
      action.type === 'iso_timestamp' ? { format: 'valibot:iso_timestamp' } :
      action.type === 'iso_week' ? { format: 'valibot:iso_week' } :
      action.type === 'length' ? (
      type.type === 'string' ? { minLength: action.requirement, maxLength: action.requirement } :
      type.type === 'array' ? { minItems: action.requirement, maxItems: action.requirement } :
      {}) :
      action.type === 'mac' ? { format: 'valibot:mac' } :
      action.type === 'mac48' ? { format: 'valibot:mac48' } :
      action.type === 'mac64' ? { format: 'valibot:mac64' } :
      action.type === 'map_items' ? {} :
      action.type === 'max_bytes' ? {} :
      action.type === 'max_graphemes' ? {} :
      action.type === 'max_length' ? (
      type.type === 'string' ? { maxLength: action.requirement } :
      type.type === 'array' ? { maxItems: action.requirement } :
      {}) :
      action.type === 'max_size' ? {} :
      action.type === 'max_value' ? { maximum: action.requirement } :
      action.type === 'max_words' ? {} :
      action.type === 'metadata' ? { ...action.metadata } :
      action.type === 'mime_type' ? {} :
      action.type === 'min_bytes' ? {} :
      action.type === 'min_graphemes' ? {} :
      action.type === 'min_length' ? (
      type.type === 'string' ? { minLength: action.requirement } :
      type.type === 'array' ? { minItems: action.requirement } :
      {}) :
      action.type === 'min_size' ? {} :
      action.type === 'min_value' ? { minimum: action.requirement } :
      action.type === 'min_words' ? {} :
      action.type === 'multiple_of' ? { multipleOf: action.requirement } :
      action.type === 'nanoid' ? { format: 'valibot:nanoid' } :
      action.type === 'non_empty' ? {} :
      action.type === 'normalize' ? {} :
      action.type === 'not_bytes' ? {} :
      action.type === 'not_graphemes' ? {} :
      action.type === 'not_length' ? {} : // needs TNot
      action.type === 'not_size' ? {} :
      action.type === 'not_value' ? {} :
      action.type === 'not_words' ? {} :
      action.type === 'octal' ? { format: 'valibot:octal' } :
      action.type === 'partial_check' ? {} :
      action.type === 'raw_check' ? {} :
      action.type === 'raw_transform' ? {} :
      action.type === 'readonly' ? {} :
      action.type === 'reduce_items' ? {} :
      action.type === 'regex' ? { pattern: action.requirement.source } :
      action.type === 'returns' ? {} :
      action.type === 'safe_integer' ? { multipleOf: 1 } :
      action.type === 'size' ? {} :
      action.type === 'some_item' ? {} :
      action.type === 'sort_items' ? {} :
      action.type === 'starts_with' ? { pattern: `^${action.requirement}` } :
      action.type === 'title' ? { title: action.title } :
      action.type === 'to_lower_case' ? {} :
      action.type === 'to_max_value' ? {} :
      action.type === 'to_min_value' ? {} :
      action.type === 'to_upper_case' ? {} :
      action.type === 'transform' ? {} :
      action.type === 'trim' ? {} :
      action.type === 'trim_end' ? {} :
      action.type === 'trim_start' ? {} :
      action.type === 'ulid' ? { format: 'valibot:ulid' } :
      action.type === 'url' ? { format: 'valibot:url' } :
      action.type === 'uuid' ? { format: 'valibot:uuid' } :
      action.type === 'value' ? {} :
      action.type === 'words' ? {} :
      {})
    }
  }, {})
}
// ------------------------------------------------------------------
// Formats
// ------------------------------------------------------------------
tb.FormatRegistry.Set('valibot:base64', (value) => v.safeParse(v.pipe(v.string(), v.base64()), value).success)
tb.FormatRegistry.Set('valibot:bic', (value) => v.safeParse(v.pipe(v.string(), v.bic()), value).success)
tb.FormatRegistry.Set('valibot:credit_card', (value) => v.safeParse(v.pipe(v.string(), v.creditCard()), value).success)
tb.FormatRegistry.Set('valibot:cuid2', (value) => v.safeParse(v.pipe(v.string(), v.cuid2()), value).success)
tb.FormatRegistry.Set('valibot:decimal', (value) => v.safeParse(v.pipe(v.string(), v.decimal()), value).success)
tb.FormatRegistry.Set('valibot:digits', (value) => v.safeParse(v.pipe(v.string(), v.digits()), value).success)
tb.FormatRegistry.Set('valibot:email', (value) => v.safeParse(v.pipe(v.string(), v.email()), value).success)
tb.FormatRegistry.Set('valibot:emoji', (value) => v.safeParse(v.pipe(v.string(), v.emoji()), value).success)
tb.FormatRegistry.Set('valibot:ip', (value) => v.safeParse(v.pipe(v.string(), v.ip()), value).success)
tb.FormatRegistry.Set('valibot:ipv4', (value) => v.safeParse(v.pipe(v.string(), v.ipv4()), value).success)
tb.FormatRegistry.Set('valibot:ipv6', (value) => v.safeParse(v.pipe(v.string(), v.ipv6()), value).success)
tb.FormatRegistry.Set('valibot:iso_date', (value) => v.safeParse(v.pipe(v.string(), v.isoDate()), value).success)
tb.FormatRegistry.Set('valibot:iso_date_time', (value) => v.safeParse(v.pipe(v.string(), v.isoDateTime()), value).success)
tb.FormatRegistry.Set('valibot:iso_time', (value) => v.safeParse(v.pipe(v.string(), v.isoTime()), value).success)
tb.FormatRegistry.Set('valibot:iso_time_second', (value) => v.safeParse(v.pipe(v.string(), v.isoTimeSecond()), value).success)
tb.FormatRegistry.Set('valibot:iso_timestamp', (value) => v.safeParse(v.pipe(v.string(), v.isoTimestamp()), value).success)
tb.FormatRegistry.Set('valibot:iso_week', (value) => v.safeParse(v.pipe(v.string(), v.isoWeek()), value).success)
tb.FormatRegistry.Set('valibot:mac', (value) => v.safeParse(v.pipe(v.string(), v.mac()), value).success)
tb.FormatRegistry.Set('valibot:mac48', (value) => v.safeParse(v.pipe(v.string(), v.mac48()), value).success)
tb.FormatRegistry.Set('valibot:mac64', (value) => v.safeParse(v.pipe(v.string(), v.mac64()), value).success)
tb.FormatRegistry.Set('valibot:nanoid', (value) => v.safeParse(v.pipe(v.string(), v.nanoid()), value).success)
tb.FormatRegistry.Set('valibot:octal', (value) => v.safeParse(v.pipe(v.string(), v.octal()), value).success)
tb.FormatRegistry.Set('valibot:ulid', (value) => v.safeParse(v.pipe(v.string(), v.ulid()), value).success)
tb.FormatRegistry.Set('valibot:url', (value) => v.safeParse(v.pipe(v.string(), v.url()), value).success)
tb.FormatRegistry.Set('valibot:uuid', (value) => v.safeParse(v.pipe(v.string(), v.uuid()), value).success)

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
type BaseValidation = v.BaseValidation<unknown, unknown, v.BaseIssue<unknown>>
type BaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
type BaseRecordKey = v.BaseSchema<string, string | number | symbol, v.BaseIssue<unknown>>
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
type TFromAny<_Type extends v.AnySchema> = tb.Ensure<tb.TAny>
function FromAny(type: BaseSchema): tb.TSchema {
  return tb.Any(Options(type))
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
type TFromArray<Type extends BaseSchema> = tb.Ensure<tb.TArray<TFromType<Type>>>
function FromArray(type: BaseSchema): tb.TSchema {
  return tb.Array(FromType((type as v.ArraySchema<any, any>).item), Options(type))
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
type TFromBigInt<_Type extends v.BigintSchema<any>> = tb.Ensure<tb.TBigInt>
function FromBigInt(type: BaseSchema): tb.TSchema {
  return tb.BigInt(Options(type))
}
// ------------------------------------------------------------------
// Blob
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TBlob>('ValibotBlob', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
interface TBlob<Type extends v.BlobSchema<any> = v.BlobSchema<any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotBlob'
  static: v.InferOutput<this['type']>
  type: Type
}
function _Blob(type: v.BlobSchema<any>, options?: tb.SchemaOptions): TBlob {
  return tb.CreateType({ [tb.Kind]: 'ValibotBlob', type }, options) as never
}
type TFromBlob<Type extends v.BlobSchema<any>> = tb.Ensure<TBlob<Type>>
function FromBlob(type: BaseSchema): tb.TSchema {
  return _Blob(type as v.BlobSchema<any>, Options(type))
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
type TFromBoolean<_Type extends v.BooleanSchema<any>> = tb.TBoolean
function FromBoolean(type: BaseSchema): tb.TSchema {
  return tb.Boolean(Options(type))
}
// ------------------------------------------------------------------
// Custom
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TCustom>('ValibotCustom', (schema, value) => v.safeParse(schema.schema, value).success)
export interface TCustom<Type extends v.CustomSchema<any, any> = v.CustomSchema<any, any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotCustom'
  static: v.InferOutput<this['type']>
  type: Type
}
function Custom<Type extends v.CustomSchema<any, any>>(type: Type, options?: tb.SchemaOptions): TCustom<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotCustom', type }, options) as never
}
type TFromCustom<Type extends v.CustomSchema<any, any>> = tb.Ensure<TCustom<Type>>
function FromCustom(type: BaseSchema): tb.TSchema {
  return Custom(type as v.CustomSchema<any, any>, Options(type))
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
type TFromDate<_Type extends v.DateSchema<any>> = tb.TDate
function FromDate(type: BaseSchema): tb.TSchema {
  return tb.Date(Options(type))
}
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TValibotEnum>('ValibotEnum', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TValibotEnum<Type extends v.EnumSchema<v.Enum, any> = v.EnumSchema<v.Enum, any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotEnum'
  static: v.InferOutput<this['type']>
  type: Type
}
function ValibotEnum<Type extends v.EnumSchema<v.Enum, any>>(type: Type, options?: tb.SchemaOptions): TValibotEnum<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotEnum', type }, options) as never
}
type TFromEnum<Enum extends v.EnumSchema<v.Enum, any>> = TValibotEnum<Enum>
function FromEnum<Type extends BaseSchema>(type: Type): tb.TSchema {
  return ValibotEnum(type as never as v.EnumSchema<v.Enum, any>, Options(type))
}
// ------------------------------------------------------------------
// File
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TFile>('ValibotFile', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TFile<Type extends v.FileSchema<any> = v.FileSchema<any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotFile'
  static: v.InferOutput<this['type']>
  type: Type
}
function _File(type: v.FileSchema<any>, options?: tb.SchemaOptions): TFile {
  return tb.CreateType({ [tb.Kind]: 'ValibotFile', type }, options) as never
}
type TFromFile<Type extends v.FileSchema<any>> = tb.Ensure<TFile<Type>>
function FromFile(type: BaseSchema): tb.TSchema {
  return _File(type as v.FileSchema<any>, Options(type))
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TFunction>('ValibotFunction', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TFunction<Type extends v.FunctionSchema<any> = v.FunctionSchema<any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotFunction'
  static: v.InferOutput<this['type']>
  type: Type
}
function _Function<Type extends v.FunctionSchema<any>>(type: Type, options?: tb.SchemaOptions): TFunction<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotFunction', type }, options) as never
}
type TFromFunction<Type extends v.FunctionSchema<any>> = tb.Ensure<TFunction<Type>>
function FromFunction(type: BaseSchema): tb.TSchema {
  return _Function(type as v.FunctionSchema<any>, Options(type))
}
// ------------------------------------------------------------------
// Instance
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TInstance>('ValibotInstance', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TInstance<Type extends v.InstanceSchema<v.Class, any> = v.InstanceSchema<v.Class, any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotInstance'
  static: v.InferOutput<this['type']>
  type: Type
}
function Instance<Type extends v.InstanceSchema<v.Class, any>>(type: Type, options?: tb.SchemaOptions): TInstance<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotInstance', type }, options) as never
}
type TFromInstance<Type extends v.InstanceSchema<v.Class, any>> = tb.Ensure<TInstance<Type>>
function FromInstance(type: BaseSchema): tb.TSchema {
  return Instance(type as v.InstanceSchema<v.Class, any>, Options(type))
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<Type extends BaseSchema[], Result extends tb.TSchema[] = []> = (
  Type extends [infer Left extends BaseSchema, ...infer Right extends BaseSchema[]]
    ? TFromIntersect<Right, [...Result, TFromType<Left>]>
    : tb.TIntersect<Result>
)
function FromIntersect(type: BaseSchema): tb.TSchema {
  const intersect = type as v.IntersectSchema<BaseSchema[], any>
  return tb.Intersect(
    intersect.options.map((option) => FromType(option)),
    Options(type),
  )
}
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
type TFromLiteral<Value extends tb.TLiteralValue> = tb.Ensure<tb.TLiteral<Value>>
function FromLiteral(type: BaseSchema): tb.TSchema {
  const literal = type as v.LiteralSchema<tb.TLiteralValue, any>
  return tb.Literal(literal.literal, Options(type))
}
// ------------------------------------------------------------------
// LooseObject
// ------------------------------------------------------------------
type TFromLooseObject<Properties extends v.ObjectEntries> = tb.Ensure<
  tb.TObject<{
    -readonly [Key in keyof Properties]: TFromType<Properties[Key]>
  }>
>
function FromLooseObject(type: BaseSchema): tb.TSchema {
  const object = type as v.LooseObjectSchema<v.ObjectEntries, any>
  const keys = globalThis.Object.getOwnPropertyNames(object.entries)
  return tb.Object(
    keys.reduce((properties, key) => {
      return { ...properties, [key]: FromType(object.entries[key]) }
    }, {} as tb.TProperties),
    Options(type),
  )
}
// ------------------------------------------------------------------
// LooseTuple
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TLooseTuple>('ValibotLooseTuple', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TLooseTuple<Type extends v.LooseTupleSchema<BaseSchema[], any> = v.LooseTupleSchema<BaseSchema[], any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotLooseTuple'
  static: v.InferOutput<this['type']>
  type: Type
}
function LooseTuple<Type extends v.LooseTupleSchema<BaseSchema[], any>>(type: Type, schema?: tb.SchemaOptions): TLooseTuple<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotLooseTuple', type }) as never
}
type TFromLooseTuple<Type extends v.LooseTupleSchema<BaseSchema[], any>> = tb.Ensure<TLooseTuple<Type>>
function FromLooseTuple(type: BaseSchema): tb.TSchema {
  return LooseTuple(type as v.LooseTupleSchema<BaseSchema[], any>, Options(type))
}
// ------------------------------------------------------------------
// Map
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TMap>('ValibotMap', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TMap<Type extends v.MapSchema<BaseSchema, BaseSchema, any> = v.MapSchema<BaseSchema, BaseSchema, any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotMap'
  static: v.InferOutput<this['type']>
  type: Type
}
function _Map<Type extends v.MapSchema<BaseSchema, BaseSchema, any>>(type: Type, options?: tb.SchemaOptions): TMap<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotMap', type }) as never
}
type TFromMap<Type extends v.MapSchema<BaseSchema, BaseSchema, any>> = tb.Ensure<TMap<Type>>
function FromMap(type: BaseSchema): tb.TSchema {
  return _Map(type as v.MapSchema<BaseSchema, BaseSchema, any>, Options(type))
}
// ------------------------------------------------------------------
// NaN
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TNaN>('ValibotNaN', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TNaN<Type extends v.NanSchema<any> = v.NanSchema<any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotNaN'
  static: v.InferOutput<this['type']>
  type: Type
}
function NaN<Type extends v.NanSchema<any>>(type: Type, options?: tb.SchemaOptions): TNaN<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotNaN', type }, options) as never
}
type TFromNaN<Type extends v.NanSchema<any>> = tb.Ensure<TNaN<Type>>
function FromNaN(type: BaseSchema): tb.TSchema {
  return NaN(type as v.NanSchema<any>, Options(type))
}
// ------------------------------------------------------------------
// Never
// ------------------------------------------------------------------
type TFromNever<_Type extends v.NeverSchema<any>> = tb.TNever
function FromNever(type: BaseSchema): tb.TSchema {
  return tb.Never(Options(type))
}
// ------------------------------------------------------------------
// NonNullable
// ------------------------------------------------------------------
type TFromNonNullable<Type extends BaseSchema> = tb.TExclude<TFromType<Type>, tb.TNull>
function FromNonNullable(type: BaseSchema): tb.TSchema {
  const non_nullable = type as v.NonNullableSchema<BaseSchema, any>
  return tb.Exclude(FromType(non_nullable.wrapped), tb.Null(), Options(type))
}
// ------------------------------------------------------------------
// NonNullish
// ------------------------------------------------------------------
type TFromNonNullish<Type extends BaseSchema> = tb.TExclude<TFromType<Type>, tb.TUnion<[tb.TNull, tb.TUndefined]>>
function FromNonNullish(type: BaseSchema): tb.TSchema {
  const non_nullish = type as v.NonNullishSchema<BaseSchema, any>
  return tb.Exclude(FromType(non_nullish.wrapped), tb.Union([tb.Null(), tb.Undefined()]), Options(type))
}
// ------------------------------------------------------------------
// NonOptional
// ------------------------------------------------------------------
type TFromNonOptional<Type extends BaseSchema, Result extends TFromType<Type> = TFromType<Type>> = tb.TOptionalWithFlag<Result, false>
function FromNonOptional(type: BaseSchema): tb.TSchema {
  const non_optional = type as v.NonOptionalSchema<BaseSchema, any>
  return tb.Optional(FromType(non_optional.wrapped), false)
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
type TFromNull<_Type extends v.NullSchema<any>> = tb.TNull
function FromNull(type: BaseSchema) {
  return tb.Null(Options(type))
}
// ------------------------------------------------------------------
// Nullable
// ------------------------------------------------------------------
type TFromNullable<Type extends BaseSchema> = tb.TUnion<[TFromType<Type>, tb.TNull]>
function FromNullable(type: BaseSchema) {
  const nullable = type as v.NullableSchema<BaseSchema, any>
  return tb.Union([tb.Null(), FromType(nullable.wrapped)], Options(type))
}
// ------------------------------------------------------------------
// Nullish
// ------------------------------------------------------------------
type TFromNullish<Type extends BaseSchema> = tb.TUnion<[TFromType<Type>, tb.TNull, tb.TUndefined]>
function FromNullish(type: BaseSchema) {
  const nullish = type as v.NullishSchema<BaseSchema, any>
  return tb.Union([FromType(nullish.wrapped), tb.Null(), tb.Undefined()], Options(type))
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
type TFromNumber<_Type extends v.NumberSchema<any>> = tb.TNumber
function FromNumber(type: BaseSchema): tb.TSchema {
  return tb.Number(Options(type))
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
type TFromObject<Properties extends v.ObjectEntries> = tb.Ensure<
  tb.TObject<{
    -readonly [Key in keyof Properties]: TFromType<Properties[Key]>
  }>
>
function FromObject(type: BaseSchema): tb.TSchema {
  const object = type as v.ObjectSchema<v.ObjectEntries, any>
  const keys = globalThis.Object.getOwnPropertyNames(object.entries)
  return tb.Object(
    keys.reduce((properties, key) => {
      return { ...properties, [key]: FromType(object.entries[key]) }
    }, {} as tb.TProperties),
    Options(type),
  )
}
// ------------------------------------------------------------------
// ObjectWithRest
// ------------------------------------------------------------------
type TFromObjectWithRest<Properties extends v.ObjectEntries, _Rest extends BaseSchema> = tb.Ensure<
  tb.TObject<{
    -readonly [Key in keyof Properties]: TFromType<Properties[Key]>
  }>
>
function FromObjectWithRest(type: BaseSchema): tb.TSchema {
  const object = type as v.ObjectWithRestSchema<v.ObjectEntries, BaseSchema, any>
  const keys = globalThis.Object.getOwnPropertyNames(object.entries)
  return tb.Object(
    keys.reduce((properties, key) => {
      return { ...properties, [key]: FromType(object.entries[key]) }
    }, {} as tb.TProperties),
    { ...Options(type), additionalProperties: FromType(object.rest) },
  )
}
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
type TFromOptional<Type extends BaseSchema, Result extends TFromType<Type> = TFromType<Type>> = tb.TOptionalWithFlag<Result, true>
function FromOptional(type: BaseSchema): tb.TSchema {
  const optional = type as v.OptionalSchema<BaseSchema, any>
  return tb.Optional(FromType(optional.wrapped))
}
// ------------------------------------------------------------------
// PickList
// ------------------------------------------------------------------
type PickListOption = string | number | bigint
// prettier-ignore
type TFromPickList<Options extends PickListOption[], Result extends tb.TSchema[] = []> = (
  Options extends [infer Left extends PickListOption, ...infer Right extends PickListOption[]]
  ? (
    Left extends tb.TLiteralValue
    ? TFromPickList<Right, [...Result, tb.TLiteral<Left>]>
    : TFromPickList<Right, [...Result]>
  )
  : tb.TUnion<Result>
)
function FromPickList(type: BaseSchema): tb.TSchema {
  const picklist = type as v.PicklistSchema<v.PicklistOptions, any>
  return tb.Union(
    picklist.options.map((option) => tb.Literal(option as tb.TLiteralValue)),
    Options(type),
  )
}
// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TPromise>('ValibotPromise', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TPromise<Type extends v.PromiseSchema<any> = v.PromiseSchema<any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotPromise'
  static: v.InferOutput<this['type']>
  type: Type
}
function _Promise<Type extends v.PromiseSchema<any>>(type: Type, options?: tb.SchemaOptions): TPromise<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotPromise', type }, options) as never
}
type TFromPromise<Type extends v.PromiseSchema<any>> = tb.Ensure<TPromise<Type>>
function FromPromise(type: BaseSchema): tb.TSchema {
  return _Promise(type as v.PromiseSchema<any>, Options(type))
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
type TFromRecord<Key extends BaseRecordKey, Value extends BaseSchema> = tb.Ensure<tb.TRecordOrObject<TFromType<Key>, TFromType<Value>>>
function FromRecord(type: BaseSchema) {
  const record = type as v.RecordSchema<BaseRecordKey, BaseSchema, any>
  return tb.Record(FromType(record.key), FromType(record.value), Options(type))
}
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TInstance>('ValibotSet', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TSet<Type extends v.SetSchema<BaseSchema, any> = v.SetSchema<BaseSchema, any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotSet'
  static: v.InferOutput<this['type']> extends infer Result ? Result : never
  type: Type
}
function Set<Type extends v.SetSchema<BaseSchema, any>>(type: Type, options?: tb.SchemaOptions): TSet<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotSet', type }, options) as never
}
type TFromSet<Type extends v.SetSchema<BaseSchema, any>> = tb.Ensure<TSet<Type>>
function FromSet(type: BaseSchema): tb.TSchema {
  return Set(type as v.SetSchema<BaseSchema, any>)
}
// ------------------------------------------------------------------
// StrictObject
// ------------------------------------------------------------------
type TFromStrictObject<Properties extends v.ObjectEntries> = tb.Ensure<
  tb.TObject<{
    -readonly [Key in keyof Properties]: TFromType<Properties[Key]>
  }>
>
function FromStrictObject(type: BaseSchema): tb.TSchema {
  const object = type as v.StrictObjectSchema<v.ObjectEntries, any>
  const keys = globalThis.Object.getOwnPropertyNames(object.entries)
  return tb.Object(
    keys.reduce((properties, key) => {
      return { ...properties, [key]: FromType(object.entries[key]) }
    }, {} as tb.TProperties),
    { ...Options(type), additionalProperties: false },
  )
}
// ------------------------------------------------------------------
// StrictTuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromStrictTuple<Type extends BaseSchema[], Result extends tb.TSchema[] = []> = (
  Type extends [infer Left extends BaseSchema, ...infer Right extends BaseSchema[]]
    ? TFromTuple<Right, [...Result, TFromType<Left>]>
    : tb.TTuple<Result>
)
function FromStrictTuple(type: BaseSchema): tb.TSchema {
  const tuple = type as v.StrictTupleSchema<any, any>
  const items = globalThis.Array.isArray(tuple.items) ? tuple.items.map((item) => FromType(item)) : []
  return tb.Tuple(items, Options(type))
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
type TFromString<_Type extends v.StringSchema<any>> = tb.TString
function FromString(type: BaseSchema): tb.TSchema {
  return tb.String(Options(type))
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
type TFromSymbol<_Type extends v.SymbolSchema<any>> = tb.TSymbol
function FromSymbol(type: BaseSchema): tb.TSchema {
  return tb.Symbol(Options(type))
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<Type extends BaseSchema[], Result extends tb.TSchema[] = []> = (
  Type extends [infer Left extends BaseSchema, ...infer Right extends BaseSchema[]]
    ? TFromTuple<Right, [...Result, TFromType<Left>]>
    : tb.TTuple<Result>
)
function FromTuple(type: BaseSchema): tb.TSchema {
  const tuple = type as v.TupleSchema<any, any>
  const items = globalThis.Array.isArray(tuple.items) ? tuple.items.map((item) => FromType(item)) : []
  return tb.Tuple(items, Options(type))
}
// ------------------------------------------------------------------
// TupleWithRest
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TTupleWithRest>('ValibotTupleWithRest', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
interface TTupleWithRest<Type extends v.TupleWithRestSchema<BaseSchema[], BaseSchema, any> = v.TupleWithRestSchema<BaseSchema[], BaseSchema, any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotTupleWithRest'
  static: v.InferOutput<this['type']>
  type: Type
}
function TupleWithRest<Type extends v.TupleWithRestSchema<BaseSchema[], BaseSchema, any>>(type: Type, options?: tb.SchemaOptions): TTupleWithRest<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotTupleWithRest', type }, Options(type)) as never
}
type TFromTupleWithRest<Type extends v.TupleWithRestSchema<BaseSchema[], BaseSchema, any>> = tb.Ensure<TTupleWithRest<Type>>
function FromTupleWithRest(type: BaseSchema): tb.TSchema {
  return TupleWithRest(type as v.TupleWithRestSchema<BaseSchema[], BaseSchema, any>, Options(type))
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
type TFromUndefined<_Type extends v.UndefinedSchema<any>> = tb.TUndefined
function FromUndefined(type: BaseSchema): tb.TSchema {
  return tb.Undefined(Options(type))
}
// ------------------------------------------------------------------
// Undefinable
// ------------------------------------------------------------------
type TFromUndefinedable<Type extends BaseSchema> = tb.TUnion<[TFromType<Type>, tb.TUndefined]>
function FromUndefinedable(type: BaseSchema): tb.TSchema {
  const undefinedable = type as v.UndefinedableSchema<BaseSchema, any>
  return tb.Union([FromType(undefinedable.wrapped), tb.Undefined()], Options(type))
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Type extends BaseSchema[], Result extends tb.TSchema[] = []> = (
  Type extends [infer Left extends BaseSchema, ...infer Right extends BaseSchema[]]
    ? TFromUnion<Right, [...Result, TFromType<Left>]>
    : tb.TUnion<Result>
)
function FromUnion(type: BaseSchema): tb.TSchema {
  const variants = (type as v.UnionSchema<BaseSchema[], any>).options.map((option) => FromType(option))
  return tb.Union(variants, Options(type))
}
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
type TFromUnknown<_Type extends v.UnknownSchema> = tb.TUnknown
function FromUnknown(type: BaseSchema): tb.TSchema {
  return tb.Unknown(Options(type))
}
// ------------------------------------------------------------------
// Variant
// ------------------------------------------------------------------
tb.TypeRegistry.Set<TVariant>('ValibotVariant', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
interface TVariant<Type extends v.VariantSchema<string, v.VariantOptions<string>, any> = v.VariantSchema<string, v.VariantOptions<string>, any>> extends tb.TSchema {
  [tb.Kind]: 'ValibotVariant'
  static: v.InferOutput<this['type']>
  type: Type
}
function Variant<Type extends v.VariantSchema<string, v.VariantOptions<string>, any>>(type: Type): TVariant<Type> {
  return tb.CreateType({ [tb.Kind]: 'ValibotVariant', type }, Options(type)) as never
}
type TFromVariant<Type extends v.VariantSchema<string, v.VariantOptions<string>, any>> = tb.Ensure<TVariant<Type>>
function FromVariant(type: BaseSchema): tb.TSchema {
  return Variant(type as v.VariantSchema<string, v.VariantOptions<string>, any>)
}
// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
type TFromVoid<_Type extends v.VoidSchema<any>> = tb.TVoid
function FromVoid(type: BaseSchema): tb.TSchema {
  return tb.Void(Options(type))
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
export type TFromType<Type extends BaseSchema> = (
  // Pipes - Extract First Type And Remap
  Type extends { pipe: [infer Type extends BaseSchema, ...any[]] } ? TFromType<Type> :
  // Types
  Type extends v.AnySchema ? TFromAny<Type> :
  Type extends v.ArraySchema<infer Type extends BaseSchema, any> ? TFromArray<Type> :
  Type extends v.BigintSchema<any> ? TFromBigInt<Type> :
  Type extends v.BlobSchema<any> ? TFromBlob<Type> :
  Type extends v.BooleanSchema<any> ? TFromBoolean<Type> :
  Type extends v.CustomSchema<unknown, any> ? TFromCustom<Type> :
  Type extends v.DateSchema<any> ? TFromDate<Type> :
  Type extends v.EnumSchema<v.Enum, any> ? TFromEnum<Type> :
  Type extends v.FileSchema<any> ? TFromFile<Type> :
  Type extends v.FunctionSchema<any> ? TFromFunction<Type> :
  Type extends v.InstanceSchema<v.Class, any> ? TFromInstance<Type> :
  Type extends v.IntersectSchema<infer Types extends BaseSchema[], any> ? TFromIntersect<Types> :
  Type extends v.LiteralSchema<infer Value extends tb.TLiteralValue, any> ? TFromLiteral<Value> :
  Type extends v.LooseObjectSchema<infer Properties extends v.ObjectEntries, any> ? TFromLooseObject<Properties> :
  Type extends v.LooseTupleSchema<BaseSchema[], any> ? TFromLooseTuple<Type> :
  Type extends v.MapSchema<BaseSchema, BaseSchema, any> ? TFromMap<Type> :
  Type extends v.NanSchema<any> ? TFromNaN<Type> :
  Type extends v.NeverSchema<any> ? TFromNever<Type> :
  Type extends v.NonNullableSchema<infer Type extends BaseSchema, any> ? TFromNonNullable<Type> :
  Type extends v.NonNullishSchema<infer Type extends BaseSchema, any> ? TFromNonNullish<Type> :
  Type extends v.NonOptionalSchema<infer Type extends BaseSchema, any> ? TFromNonOptional<Type> :
  Type extends v.NullSchema<any> ? TFromNull<Type> :
  Type extends v.NullableSchema<infer Type extends BaseSchema, any> ? TFromNullable<Type> :
  Type extends v.NullishSchema<infer Type extends BaseSchema, any> ? TFromNullish<Type> :
  Type extends v.NumberSchema<any> ? TFromNumber<Type> :
  Type extends v.ObjectSchema<infer Properties extends v.ObjectEntries, any> ? TFromObject<Properties> :
  Type extends v.ObjectWithRestSchema<infer Properties extends v.ObjectEntries, infer Rest extends BaseSchema, any> ? TFromObjectWithRest<Properties, Rest> :
  Type extends v.OptionalSchema<infer Type extends BaseSchema, any> ? TFromOptional<Type> :
  Type extends v.PicklistSchema<infer Options extends PickListOption[], any> ? TFromPickList<Options> :
  Type extends v.PromiseSchema<any> ? TFromPromise<Type> :
  Type extends v.RecordSchema<infer Key extends BaseRecordKey, infer Value extends BaseSchema, any> ? TFromRecord<Key, Value> :
  Type extends v.SetSchema<BaseSchema, any> ? TFromSet<Type> :
  Type extends v.StrictObjectSchema<infer Properties extends v.ObjectEntries, any> ? TFromStrictObject<Properties> :
  Type extends v.StrictTupleSchema<infer Types extends BaseSchema[], any> ? TFromStrictTuple<Types> :
  Type extends v.StringSchema<any> ? TFromString<Type> :
  Type extends v.SymbolSchema<any> ? TFromSymbol<Type> :
  Type extends v.TupleSchema<infer Types extends BaseSchema[], any> ? TFromTuple<Types> :
  Type extends v.TupleWithRestSchema<BaseSchema[], BaseSchema, any> ? TFromTupleWithRest<Type> :
  Type extends v.UndefinedSchema<any> ? TFromUndefined<Type> :
  Type extends v.UndefinedableSchema<infer Type extends BaseSchema, any> ? TFromUndefinedable<Type> :
  Type extends v.UnionSchema<infer Types extends BaseSchema[], any> ? TFromUnion<Types> :
  Type extends v.UnknownSchema ? TFromUnknown<Type> :
  Type extends v.VariantSchema<string, v.VariantOptions<string>, any> ? TFromVariant<Type> :
  Type extends v.VoidSchema<any> ? TFromVoid<Type> :
  tb.TNever
)
// prettier-ignore
export function FromType<Type extends BaseSchema>(type: Type): TFromType<Type> {
  return (
    type.type === 'any' ? FromAny(type) :
    type.type === 'array' ? FromArray(type) :
    type.type === 'bigint' ? FromBigInt(type) :
    type.type === 'blob' ? FromBlob(type) :
    type.type === 'boolean' ? FromBoolean(type) :
    type.type === 'custom' ? FromCustom(type) :
    type.type === 'date' ? FromDate(type) :
    type.type === 'enum' ? FromEnum(type) :
    type.type === 'file' ? FromFile(type) :
    type.type === 'function' ? FromFunction(type) :
    type.type === 'intersect' ? FromIntersect(type) :
    type.type === 'instance' ? FromInstance(type) :
    type.type === 'literal' ? FromLiteral(type) :
    type.type === 'loose_object' ? FromLooseObject(type) :
    type.type === 'loose_tuple' ? FromLooseTuple(type) :
    type.type === 'map' ? FromMap(type) :
    type.type === 'nan' ? FromNaN(type) :
    type.type === 'never' ? FromNever(type) :
    type.type === 'non_nullable' ? FromNonNullable(type) :
    type.type === 'non_nullish' ? FromNonNullish(type) :
    type.type === 'non_optional' ? FromNonOptional(type) :
    type.type === 'null' ? FromNull(type) :
    type.type === 'nullable' ? FromNullable(type) :
    type.type === 'nullish' ? FromNullish(type) :
    type.type === 'number' ? FromNumber(type) :
    type.type === 'object' ? FromObject(type) :
    type.type === 'object_with_rest' ? FromObjectWithRest(type) :
    type.type === 'optional' ? FromOptional(type) :
    type.type === 'picklist' ? FromPickList(type) :
    type.type === 'promise' ? FromPromise(type) :
    type.type === 'record' ? FromRecord(type) :
    type.type === 'string' ? FromString(type) :
    type.type === 'set' ? FromSet(type) :
    type.type === 'strict_object' ? FromStrictObject(type) :
    type.type === 'strict_tuple' ? FromStrictTuple(type) :
    type.type === 'symbol' ? FromSymbol(type) :
    type.type === 'tuple_with_rest' ? FromTupleWithRest(type) :
    type.type === 'tuple' ? FromTuple(type) :
    type.type === 'undefined' ? FromUndefined(type) :
    type.type === 'undefinedable' ? FromUndefinedable(type) :
    type.type === 'unknown' ? FromUnknown(type) :
    type.type === 'union' ? FromUnion(type) :
    type.type === 'variant' ? FromVariant(type) :
    type.type === 'void' ? FromVoid(type) :
    tb.Never()
  ) as never
}
// ------------------------------------------------------------------
// IsValibot
// ------------------------------------------------------------------
// prettier-ignore
export function IsValibot(type: unknown): type is BaseSchema {
  return (
    tb.ValueGuard.IsObject(type) &&
    tb.ValueGuard.HasPropertyKey(type, '~standard') &&
    tb.ValueGuard.IsObject(type['~standard']) &&
    tb.ValueGuard.HasPropertyKey(type['~standard'], 'vendor') &&
    type['~standard'].vendor === 'valibot'
  )
}
// ------------------------------------------------------------------
// Box
// ------------------------------------------------------------------
/** Converts a Valibot Type to a TypeBox Type */
// prettier-ignore
export type TBox<Type extends unknown> = (
  Type extends BaseSchema
  ? Type extends { '~standard': { vendor: 'valibot' } }
  ? TFromType<Type>
  : undefined
  : undefined
)
/** Converts a Valibot Type to a TypeBox Type */
export function Box<Type extends unknown, Result extends TBox<Type> = TBox<Type>>(type: Type): Result {
  return (IsValibot(type) ? FromType(type) : undefined) as never
}
