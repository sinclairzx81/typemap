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
import * as v from 'valibot'
import * as Guard from '../guard'

// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
function IsSchemaWithPipe(type: BaseSchema): type is v.SchemaWithPipe<[BaseSchema, ...BaseValidation[]]> {
  return t.ValueGuard.IsObject(type) && t.ValueGuard.HasPropertyKey(type, 'pipe') && t.ValueGuard.IsArray(type.pipe)
}
// prettier-ignore
function Options(type: BaseSchema) {
  if (!IsSchemaWithPipe(type)) return {}
  return type.pipe.slice(1).reduce((options, action: { type: string } & { [key: string]: any }) => {
    return {
      ...options, ...(
      action.type === 'args' ? {} :
      action.type === 'base64' ? { format: 'base64' } :
      action.type === 'bic' ? { format: 'bic' } :
      action.type === 'brand' ? {} :
      action.type === 'bytes' ? {} :
      action.type === 'check' ? {} :
      action.type === 'check_items' ? {} :
      action.type === 'credit_card' ? { format: 'credit_card' } :
      action.type === 'cuid2' ? { format: 'cuid2' } :
      action.type === 'decimal' ? { format: 'decimal' } :
      action.type === 'description' ? { description: action.description } :
      action.type === 'digits' ? { format: 'digits' } :
      action.type === 'email' ? { format: 'email' } :
      action.type === 'emoji' ? { format: 'emoji' } :
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
      type.type === 'array' ? { contains: t.Literal(action.requirement) } :
      type.type === 'string' ? { pattern: action.requirement } :
      {}) :
      action.type === 'integer' ? { multipleOf: 1 } :
      action.type === 'ip' ? { format: 'ip' } :
      action.type === 'ipv4' ? { format: 'ipv4' } :
      action.type === 'ipv6' ? { format: 'ipv6' } :
      action.type === 'iso_date' ? { format: 'iso_date' } :
      action.type === 'iso_date_time' ? { format: 'iso_date_time' } :
      action.type === 'iso_time' ? { format: 'iso_time' } :
      action.type === 'iso_time_second' ? { format: 'iso_time_second' } :
      action.type === 'iso_timestamp' ? { format: 'iso_timestamp' } :
      action.type === 'iso_week' ? { format: 'iso_week' } :
      action.type === 'length' ? (
      type.type === 'string' ? { minLength: action.requirement, maxLength: action.requirement } :
      type.type === 'array' ? { minItems: action.requirement, maxItems: action.requirement } :
      {}) :
      action.type === 'mac' ? { format: 'mac' } :
      action.type === 'mac48' ? { format: 'mac48' } :
      action.type === 'mac64' ? { format: 'mac64' } :
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
      action.type === 'metadata' ? { metadata: action.metadata } :
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
      action.type === 'nanoid' ? { format: 'nanoid' } :
      action.type === 'non_empty' ? {} :
      action.type === 'normalize' ? {} :
      action.type === 'not_bytes' ? {} :
      action.type === 'not_graphemes' ? {} :
      action.type === 'not_length' ? {} : // needs TNot
      action.type === 'not_size' ? {} :
      action.type === 'not_value' ? {} :
      action.type === 'not_words' ? {} :
      action.type === 'octal' ? { format: 'octal' } :
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
      action.type === 'ulid' ? { format: 'ulid' } :
      action.type === 'url' ? { format: 'url' } :
      action.type === 'uuid' ? { format: 'uuid' } :
      action.type === 'value' ? {} :
      action.type === 'words' ? {} :
      {})
    }
  }, {})
}
// ------------------------------------------------------------------
// Formats
// ------------------------------------------------------------------
t.FormatRegistry.Set('base64', (value) => v.safeParse(v.pipe(v.string(), v.base64()), value).success)
t.FormatRegistry.Set('bic', (value) => v.safeParse(v.pipe(v.string(), v.bic()), value).success)
t.FormatRegistry.Set('credit_card', (value) => v.safeParse(v.pipe(v.string(), v.creditCard()), value).success)
t.FormatRegistry.Set('cuid2', (value) => v.safeParse(v.pipe(v.string(), v.cuid2()), value).success)
t.FormatRegistry.Set('decimal', (value) => v.safeParse(v.pipe(v.string(), v.decimal()), value).success)
t.FormatRegistry.Set('digits', (value) => v.safeParse(v.pipe(v.string(), v.digits()), value).success)
t.FormatRegistry.Set('email', (value) => v.safeParse(v.pipe(v.string(), v.email()), value).success)
t.FormatRegistry.Set('emoji', (value) => v.safeParse(v.pipe(v.string(), v.emoji()), value).success)
t.FormatRegistry.Set('ip', (value) => v.safeParse(v.pipe(v.string(), v.ip()), value).success)
t.FormatRegistry.Set('ipv4', (value) => v.safeParse(v.pipe(v.string(), v.ipv4()), value).success)
t.FormatRegistry.Set('ipv6', (value) => v.safeParse(v.pipe(v.string(), v.ipv6()), value).success)
t.FormatRegistry.Set('iso_date', (value) => v.safeParse(v.pipe(v.string(), v.isoDate()), value).success)
t.FormatRegistry.Set('iso_date_time', (value) => v.safeParse(v.pipe(v.string(), v.isoDateTime()), value).success)
t.FormatRegistry.Set('iso_time', (value) => v.safeParse(v.pipe(v.string(), v.isoTime()), value).success)
t.FormatRegistry.Set('iso_time_second', (value) => v.safeParse(v.pipe(v.string(), v.isoTimeSecond()), value).success)
t.FormatRegistry.Set('iso_timestamp', (value) => v.safeParse(v.pipe(v.string(), v.isoTimestamp()), value).success)
t.FormatRegistry.Set('iso_week', (value) => v.safeParse(v.pipe(v.string(), v.isoWeek()), value).success)
t.FormatRegistry.Set('mac', (value) => v.safeParse(v.pipe(v.string(), v.mac()), value).success)
t.FormatRegistry.Set('mac48', (value) => v.safeParse(v.pipe(v.string(), v.mac48()), value).success)
t.FormatRegistry.Set('mac64', (value) => v.safeParse(v.pipe(v.string(), v.mac64()), value).success)
t.FormatRegistry.Set('nanoid', (value) => v.safeParse(v.pipe(v.string(), v.nanoid()), value).success)
t.FormatRegistry.Set('octal', (value) => v.safeParse(v.pipe(v.string(), v.octal()), value).success)
t.FormatRegistry.Set('ulid', (value) => v.safeParse(v.pipe(v.string(), v.ulid()), value).success)
t.FormatRegistry.Set('url', (value) => v.safeParse(v.pipe(v.string(), v.url()), value).success)
t.FormatRegistry.Set('uuid', (value) => v.safeParse(v.pipe(v.string(), v.uuid()), value).success)

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
type BaseValidation = v.BaseValidation<unknown, unknown, v.BaseIssue<unknown>>
type BaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
type BaseRecordKey = v.BaseSchema<string, string | number | symbol, v.BaseIssue<unknown>>
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
type TFromAny<_Type extends v.AnySchema> = t.Ensure<t.TAny>
function FromAny(type: BaseSchema): t.TSchema {
  return t.Any(Options(type))
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
type TFromArray<Type extends BaseSchema> = t.Ensure<t.TArray<TFromType<Type>>>
function FromArray(type: BaseSchema): t.TSchema {
  return t.Array(FromType((type as v.ArraySchema<any, any>).item), Options(type))
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
type TFromBigInt<_Type extends v.BigintSchema<any>> = t.Ensure<t.TBigInt>
function FromBigInt(type: BaseSchema): t.TSchema {
  return t.BigInt(Options(type))
}
// ------------------------------------------------------------------
// Blob
// ------------------------------------------------------------------
t.TypeRegistry.Set<TBlob>('ValibotBlob', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
interface TBlob<Type extends v.BlobSchema<any> = v.BlobSchema<any>> extends t.TSchema {
  [t.Kind]: 'ValibotBlob'
  static: v.InferOutput<this['type']>
  type: Type
}
function _Blob(type: v.BlobSchema<any>, options?: t.SchemaOptions): TBlob {
  return t.CreateType({ [t.Kind]: 'ValibotBlob', type }, options) as never
}
type TFromBlob<Type extends v.BlobSchema<any>> = t.Ensure<TBlob<Type>>
function FromBlob(type: BaseSchema): t.TSchema {
  return _Blob(type as v.BlobSchema<any>, Options(type))
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
type TFromBoolean<_Type extends v.BooleanSchema<any>> = t.TBoolean
function FromBoolean(type: BaseSchema): t.TSchema {
  return t.Boolean(Options(type))
}
// ------------------------------------------------------------------
// Custom
// ------------------------------------------------------------------
t.TypeRegistry.Set<TCustom>('ValibotCustom', (schema, value) => v.safeParse(schema.schema, value).success)
interface TCustom<Type extends v.CustomSchema<any, any> = v.CustomSchema<any, any>> extends t.TSchema {
  [t.Kind]: 'ValibotCustom'
  static: v.InferOutput<this['type']>
  type: Type
}
function Custom<Type extends v.CustomSchema<any, any>>(type: Type, options?: t.SchemaOptions): TCustom<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotCustom', type }, options) as never
}
type TFromCustom<Type extends v.CustomSchema<any, any>> = t.Ensure<TCustom<Type>>
function FromCustom(type: BaseSchema): t.TSchema {
  return Custom(type as v.CustomSchema<any, any>, Options(type))
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
type TFromDate<_Type extends v.DateSchema<any>> = t.TDate
function FromDate(type: BaseSchema): t.TSchema {
  return t.Date(Options(type))
}
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
t.TypeRegistry.Set<TValibotEnum>('ValibotEnum', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TValibotEnum<Type extends v.EnumSchema<v.Enum, any> = v.EnumSchema<v.Enum, any>> extends t.TSchema {
  [t.Kind]: 'ValibotEnum'
  static: v.InferOutput<this['type']>
  type: Type
}
function ValibotEnum<Type extends v.EnumSchema<v.Enum, any>>(type: Type, options?: t.SchemaOptions): TValibotEnum<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotEnum', type }, options) as never
}
type TFromEnum<Enum extends v.EnumSchema<v.Enum, any>> = TValibotEnum<Enum>
function FromEnum<Type extends BaseSchema>(type: Type): t.TSchema {
  return ValibotEnum(type as never as v.EnumSchema<v.Enum, any>, Options(type))
}
// ------------------------------------------------------------------
// File
// ------------------------------------------------------------------
t.TypeRegistry.Set<TValibotFile>('ValibotFile', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TValibotFile<Type extends v.FileSchema<any> = v.FileSchema<any>> extends t.TSchema {
  [t.Kind]: 'ValibotFile'
  static: v.InferOutput<this['type']>
  type: Type
}
function _File(type: v.FileSchema<any>, options?: t.SchemaOptions): TValibotFile {
  return t.CreateType({ [t.Kind]: 'ValibotFile', type }, options) as never
}
type TFromFile<Type extends v.FileSchema<any>> = t.Ensure<TValibotFile<Type>>
function FromFile(type: BaseSchema): t.TSchema {
  return _File(type as v.FileSchema<any>, Options(type))
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
t.TypeRegistry.Set<TValibotFunction>('ValibotFunction', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TValibotFunction<Type extends v.FunctionSchema<any> = v.FunctionSchema<any>> extends t.TSchema {
  [t.Kind]: 'ValibotFunction'
  static: v.InferOutput<this['type']>
  type: Type
}
function _Function<Type extends v.FunctionSchema<any>>(type: Type, options?: t.SchemaOptions): TValibotFunction<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotFunction', type }, options) as never
}
type TFromFunction<Type extends v.FunctionSchema<any>> = t.Ensure<TValibotFunction<Type>>
function FromFunction(type: BaseSchema): t.TSchema {
  return _Function(type as v.FunctionSchema<any>, Options(type))
}
// ------------------------------------------------------------------
// Instance
// ------------------------------------------------------------------
t.TypeRegistry.Set<TValibotInstance>('ValibotInstance', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TValibotInstance<Type extends v.InstanceSchema<v.Class, any> = v.InstanceSchema<v.Class, any>> extends t.TSchema {
  [t.Kind]: 'ValibotInstance'
  static: v.InferOutput<this['type']>
  type: Type
}
function Instance<Type extends v.InstanceSchema<v.Class, any>>(type: Type, options?: t.SchemaOptions): TValibotInstance<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotInstance', type }, options) as never
}
type TFromInstance<Type extends v.InstanceSchema<v.Class, any>> = t.Ensure<TValibotInstance<Type>>
function FromInstance(type: BaseSchema): t.TSchema {
  return Instance(type as v.InstanceSchema<v.Class, any>, Options(type))
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<Type extends BaseSchema[], Result extends t.TSchema[] = []> = (
  Type extends [infer Left extends BaseSchema, ...infer Right extends BaseSchema[]]
    ? TFromIntersect<Right, [...Result, TFromType<Left>]>
    : t.TIntersect<Result>
)
function FromIntersect(type: BaseSchema): t.TSchema {
  const intersect = type as v.IntersectSchema<BaseSchema[], any>
  return t.Intersect(
    intersect.options.map((option) => FromType(option)),
    Options(type),
  )
}
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
type TFromLiteral<Value extends t.TLiteralValue> = t.Ensure<t.TLiteral<Value>>
function FromLiteral(type: BaseSchema): t.TSchema {
  const literal = type as v.LiteralSchema<t.TLiteralValue, any>
  return t.Literal(literal.literal, Options(type))
}
// ------------------------------------------------------------------
// LooseObject
// ------------------------------------------------------------------
type TFromLooseObject<Properties extends v.ObjectEntries> = t.Ensure<
  t.TObject<{
    -readonly [Key in keyof Properties]: TFromType<Properties[Key]>
  }>
>
function FromLooseObject(type: BaseSchema): t.TSchema {
  const object = type as v.LooseObjectSchema<v.ObjectEntries, any>
  const keys = globalThis.Object.getOwnPropertyNames(object.entries)
  return t.Object(
    keys.reduce((properties, key) => {
      return { ...properties, [key]: FromType(object.entries[key]) }
    }, {} as t.TProperties),
    Options(type),
  )
}
// ------------------------------------------------------------------
// LooseTuple
// ------------------------------------------------------------------
t.TypeRegistry.Set<TValibotLooseTuple>('ValibotLooseTuple', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TValibotLooseTuple<Type extends v.LooseTupleSchema<BaseSchema[], any> = v.LooseTupleSchema<BaseSchema[], any>> extends t.TSchema {
  [t.Kind]: 'ValibotLooseTuple'
  static: v.InferOutput<this['type']>
  type: Type
}
function LooseTuple<Type extends v.LooseTupleSchema<BaseSchema[], any>>(type: Type, schema?: t.SchemaOptions): TValibotLooseTuple<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotLooseTuple', type }) as never
}
type TFromLooseTuple<Type extends v.LooseTupleSchema<BaseSchema[], any>> = t.Ensure<TValibotLooseTuple<Type>>
function FromLooseTuple(type: BaseSchema): t.TSchema {
  return LooseTuple(type as v.LooseTupleSchema<BaseSchema[], any>, Options(type))
}
// ------------------------------------------------------------------
// Map
// ------------------------------------------------------------------
t.TypeRegistry.Set<TValibotMap>('ValibotMap', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TValibotMap<Type extends v.MapSchema<BaseSchema, BaseSchema, any> = v.MapSchema<BaseSchema, BaseSchema, any>> extends t.TSchema {
  [t.Kind]: 'ValibotMap'
  static: v.InferOutput<this['type']>
  type: Type
}
function _Map<Type extends v.MapSchema<BaseSchema, BaseSchema, any>>(type: Type, options?: t.SchemaOptions): TValibotMap<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotMap', type }) as never
}
type TFromMap<Type extends v.MapSchema<BaseSchema, BaseSchema, any>> = t.Ensure<TValibotMap<Type>>
function FromMap(type: BaseSchema): t.TSchema {
  return _Map(type as v.MapSchema<BaseSchema, BaseSchema, any>, Options(type))
}
// ------------------------------------------------------------------
// NaN
// ------------------------------------------------------------------
t.TypeRegistry.Set<TValibotNaN>('ValibotNaN', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TValibotNaN<Type extends v.NanSchema<any> = v.NanSchema<any>> extends t.TSchema {
  [t.Kind]: 'ValibotNaN'
  static: v.InferOutput<this['type']>
  type: Type
}
function _NaN<Type extends v.NanSchema<any>>(type: Type, options?: t.SchemaOptions): TValibotNaN<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotNaN', type }, options) as never
}
type TFromNaN<Type extends v.NanSchema<any>> = t.Ensure<TValibotNaN<Type>>
function FromNaN(type: BaseSchema): t.TSchema {
  return _NaN(type as v.NanSchema<any>, Options(type))
}
// ------------------------------------------------------------------
// Never
// ------------------------------------------------------------------
type TFromNever<_Type extends v.NeverSchema<any>> = t.TNever
function FromNever(type: BaseSchema): t.TSchema {
  return t.Never(Options(type))
}
// ------------------------------------------------------------------
// NonNullable
// ------------------------------------------------------------------
type TFromNonNullable<Type extends BaseSchema> = t.TExclude<TFromType<Type>, t.TNull>
function FromNonNullable(type: BaseSchema): t.TSchema {
  const non_nullable = type as v.NonNullableSchema<BaseSchema, any>
  return t.Exclude(FromType(non_nullable.wrapped), t.Null(), Options(type))
}
// ------------------------------------------------------------------
// NonNullish
// ------------------------------------------------------------------
type TFromNonNullish<Type extends BaseSchema> = t.TExclude<TFromType<Type>, t.TUnion<[t.TNull, t.TUndefined]>>
function FromNonNullish(type: BaseSchema): t.TSchema {
  const non_nullish = type as v.NonNullishSchema<BaseSchema, any>
  return t.Exclude(FromType(non_nullish.wrapped), t.Union([t.Null(), t.Undefined()]), Options(type))
}
// ------------------------------------------------------------------
// NonOptional
// ------------------------------------------------------------------
type TFromNonOptional<Type extends BaseSchema, Result extends TFromType<Type> = TFromType<Type>> = t.TOptionalWithFlag<Result, false>
function FromNonOptional(type: BaseSchema): t.TSchema {
  const non_optional = type as v.NonOptionalSchema<BaseSchema, any>
  return t.Optional(FromType(non_optional.wrapped), false)
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
type TFromNull<_Type extends v.NullSchema<any>> = t.TNull
function FromNull(type: BaseSchema) {
  return t.Null(Options(type))
}
// ------------------------------------------------------------------
// Nullable
// ------------------------------------------------------------------
type TFromNullable<Type extends BaseSchema> = t.TUnion<[TFromType<Type>, t.TNull]>
function FromNullable(type: BaseSchema) {
  const nullable = type as v.NullableSchema<BaseSchema, any>
  return t.Union([t.Null(), FromType(nullable.wrapped)], Options(type))
}
// ------------------------------------------------------------------
// Nullish
// ------------------------------------------------------------------
type TFromNullish<Type extends BaseSchema> = t.TUnion<[TFromType<Type>, t.TNull, t.TUndefined]>
function FromNullish(type: BaseSchema) {
  const nullish = type as v.NullishSchema<BaseSchema, any>
  return t.Union([FromType(nullish.wrapped), t.Null(), t.Undefined()], Options(type))
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
type TFromNumber<_Type extends v.NumberSchema<any>> = t.TNumber
function FromNumber(type: BaseSchema): t.TSchema {
  return t.Number(Options(type))
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
type TFromObject<Properties extends v.ObjectEntries> = t.Ensure<
  t.TObject<{
    -readonly [Key in keyof Properties]: TFromType<Properties[Key]>
  }>
>
function FromObject(type: BaseSchema): t.TSchema {
  const object = type as v.ObjectSchema<v.ObjectEntries, any>
  const keys = globalThis.Object.getOwnPropertyNames(object.entries)
  return t.Object(
    keys.reduce((properties, key) => {
      return { ...properties, [key]: FromType(object.entries[key]) }
    }, {} as t.TProperties),
    Options(type),
  )
}
// ------------------------------------------------------------------
// ObjectWithRest
// ------------------------------------------------------------------
type TFromObjectWithRest<Properties extends v.ObjectEntries, _Rest extends BaseSchema> = t.Ensure<
  t.TObject<{
    -readonly [Key in keyof Properties]: TFromType<Properties[Key]>
  }>
>
function FromObjectWithRest(type: BaseSchema): t.TSchema {
  const object = type as v.ObjectWithRestSchema<v.ObjectEntries, BaseSchema, any>
  const keys = globalThis.Object.getOwnPropertyNames(object.entries)
  return t.Object(
    keys.reduce((properties, key) => {
      return { ...properties, [key]: FromType(object.entries[key]) }
    }, {} as t.TProperties),
    { ...Options(type), additionalProperties: FromType(object.rest) },
  )
}
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
type TFromOptional<Type extends BaseSchema, Result extends TFromType<Type> = TFromType<Type>> = t.TOptionalWithFlag<Result, true>
function FromOptional(type: BaseSchema): t.TSchema {
  const optional = type as v.OptionalSchema<BaseSchema, any>
  return t.Optional(FromType(optional.wrapped))
}
// ------------------------------------------------------------------
// PickList
// ------------------------------------------------------------------
type PickListOption = string | number | bigint
// prettier-ignore
type TFromPickList<Options extends PickListOption[], Result extends t.TSchema[] = []> = (
  Options extends [infer Left extends PickListOption, ...infer Right extends PickListOption[]]
  ? (
    Left extends t.TLiteralValue
    ? TFromPickList<Right, [...Result, t.TLiteral<Left>]>
    : TFromPickList<Right, [...Result]>
  )
  : t.TUnion<Result>
)
function FromPickList(type: BaseSchema): t.TSchema {
  const picklist = type as v.PicklistSchema<v.PicklistOptions, any>
  return t.Union(
    picklist.options.map((option) => t.Literal(option as t.TLiteralValue)),
    Options(type),
  )
}
// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
t.TypeRegistry.Set<TValibotPromise>('ValibotPromise', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TValibotPromise<Type extends v.PromiseSchema<any> = v.PromiseSchema<any>> extends t.TSchema {
  [t.Kind]: 'ValibotPromise'
  static: v.InferOutput<this['type']>
  type: Type
}
function _Promise<Type extends v.PromiseSchema<any>>(type: Type, options?: t.SchemaOptions): TValibotPromise<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotPromise', type }, options) as never
}
type TFromPromise<Type extends v.PromiseSchema<any>> = t.Ensure<TValibotPromise<Type>>
function FromPromise(type: BaseSchema): t.TSchema {
  return _Promise(type as v.PromiseSchema<any>, Options(type))
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
type TFromRecord<Key extends BaseRecordKey, Value extends BaseSchema> = t.Ensure<t.TRecordOrObject<TFromType<Key>, TFromType<Value>>>
function FromRecord(type: BaseSchema) {
  const record = type as v.RecordSchema<BaseRecordKey, BaseSchema, any>
  return t.Record(FromType(record.key), FromType(record.value), Options(type))
}
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
t.TypeRegistry.Set<TValibotInstance>('ValibotSet', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
export interface TValibotSet<Type extends v.SetSchema<BaseSchema, any> = v.SetSchema<BaseSchema, any>> extends t.TSchema {
  [t.Kind]: 'ValibotSet'
  static: v.InferOutput<this['type']> extends infer Result ? Result : never
  type: Type
}
function Set<Type extends v.SetSchema<BaseSchema, any>>(type: Type, options?: t.SchemaOptions): TValibotSet<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotSet', type }, options) as never
}
type TFromSet<Type extends v.SetSchema<BaseSchema, any>> = t.Ensure<TValibotSet<Type>>
function FromSet(type: BaseSchema): t.TSchema {
  return Set(type as v.SetSchema<BaseSchema, any>)
}
// ------------------------------------------------------------------
// StrictObject
// ------------------------------------------------------------------
type TFromStrictObject<Properties extends v.ObjectEntries> = t.Ensure<
  t.TObject<{
    -readonly [Key in keyof Properties]: TFromType<Properties[Key]>
  }>
>
function FromStrictObject(type: BaseSchema): t.TSchema {
  const object = type as v.StrictObjectSchema<v.ObjectEntries, any>
  const keys = globalThis.Object.getOwnPropertyNames(object.entries)
  return t.Object(
    keys.reduce((properties, key) => {
      return { ...properties, [key]: FromType(object.entries[key]) }
    }, {} as t.TProperties),
    { ...Options(type), additionalProperties: false },
  )
}
// ------------------------------------------------------------------
// StrictTuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromStrictTuple<Type extends BaseSchema[], Result extends t.TSchema[] = []> = (
  Type extends [infer Left extends BaseSchema, ...infer Right extends BaseSchema[]]
    ? TFromTuple<Right, [...Result, TFromType<Left>]>
    : t.TTuple<Result>
)
function FromStrictTuple(type: BaseSchema): t.TSchema {
  const tuple = type as v.StrictTupleSchema<any, any>
  const items = globalThis.Array.isArray(tuple.items) ? tuple.items.map((item) => FromType(item)) : []
  return t.Tuple(items, Options(type))
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
type TFromString<_Type extends v.StringSchema<any>> = t.TString
function FromString(type: BaseSchema): t.TSchema {
  return t.String(Options(type))
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
type TFromSymbol<_Type extends v.SymbolSchema<any>> = t.TSymbol
function FromSymbol(type: BaseSchema): t.TSchema {
  return t.Symbol(Options(type))
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<Type extends BaseSchema[], Result extends t.TSchema[] = []> = (
  Type extends [infer Left extends BaseSchema, ...infer Right extends BaseSchema[]]
    ? TFromTuple<Right, [...Result, TFromType<Left>]>
    : t.TTuple<Result>
)
function FromTuple(type: BaseSchema): t.TSchema {
  const tuple = type as v.TupleSchema<any, any>
  const items = globalThis.Array.isArray(tuple.items) ? tuple.items.map((item) => FromType(item)) : []
  return t.Tuple(items, Options(type))
}
// ------------------------------------------------------------------
// TupleWithRest
// ------------------------------------------------------------------
t.TypeRegistry.Set<TTupleWithRest>('ValibotTupleWithRest', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
interface TTupleWithRest<Type extends v.TupleWithRestSchema<BaseSchema[], BaseSchema, any> = v.TupleWithRestSchema<BaseSchema[], BaseSchema, any>> extends t.TSchema {
  [t.Kind]: 'ValibotTupleWithRest'
  static: v.InferOutput<this['type']>
  type: Type
}
function TupleWithRest<Type extends v.TupleWithRestSchema<BaseSchema[], BaseSchema, any>>(type: Type, options?: t.SchemaOptions): TTupleWithRest<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotTupleWithRest', type }, Options(type)) as never
}
type TFromTupleWithRest<Type extends v.TupleWithRestSchema<BaseSchema[], BaseSchema, any>> = t.Ensure<TTupleWithRest<Type>>
function FromTupleWithRest(type: BaseSchema): t.TSchema {
  return TupleWithRest(type as v.TupleWithRestSchema<BaseSchema[], BaseSchema, any>, Options(type))
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
type TFromUndefined<_Type extends v.UndefinedSchema<any>> = t.TUndefined
function FromUndefined(type: BaseSchema): t.TSchema {
  return t.Undefined(Options(type))
}
// ------------------------------------------------------------------
// Undefinable
// ------------------------------------------------------------------
type TFromUndefinedable<Type extends BaseSchema> = t.TUnion<[TFromType<Type>, t.TUndefined]>
function FromUndefinedable(type: BaseSchema): t.TSchema {
  const undefinedable = type as v.UndefinedableSchema<BaseSchema, any>
  return t.Union([FromType(undefinedable.wrapped), t.Undefined()], Options(type))
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Type extends BaseSchema[], Result extends t.TSchema[] = []> = (
  Type extends [infer Left extends BaseSchema, ...infer Right extends BaseSchema[]]
    ? TFromUnion<Right, [...Result, TFromType<Left>]>
    : t.TUnion<Result>
)
function FromUnion(type: BaseSchema): t.TSchema {
  const variants = (type as v.UnionSchema<BaseSchema[], any>).options.map((option) => FromType(option))
  return t.Union(variants, Options(type))
}
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
type TFromUnknown<_Type extends v.UnknownSchema> = t.TUnknown
function FromUnknown(type: BaseSchema): t.TSchema {
  return t.Unknown(Options(type))
}
// ------------------------------------------------------------------
// Variant
// ------------------------------------------------------------------
t.TypeRegistry.Set<TVariant>('ValibotVariant', (schema, value) => {
  return v.safeParse(schema.schema, value).success
})
interface TVariant<Type extends v.VariantSchema<string, v.VariantOptions<string>, any> = v.VariantSchema<string, v.VariantOptions<string>, any>> extends t.TSchema {
  [t.Kind]: 'ValibotVariant'
  static: v.InferOutput<this['type']>
  type: Type
}
function Variant<Type extends v.VariantSchema<string, v.VariantOptions<string>, any>>(type: Type): TVariant<Type> {
  return t.CreateType({ [t.Kind]: 'ValibotVariant', type }, Options(type)) as never
}
type TFromVariant<Type extends v.VariantSchema<string, v.VariantOptions<string>, any>> = t.Ensure<TVariant<Type>>
function FromVariant(type: BaseSchema): t.TSchema {
  return Variant(type as v.VariantSchema<string, v.VariantOptions<string>, any>)
}
// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
type TFromVoid<_Type extends v.VoidSchema<any>> = t.TVoid
function FromVoid(type: BaseSchema): t.TSchema {
  return t.Void(Options(type))
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
type TFromType<Type extends BaseSchema> = (
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
  Type extends v.LiteralSchema<infer Value extends t.TLiteralValue, any> ? TFromLiteral<Value> :
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
  t.TNever
)
// prettier-ignore
function FromType<Type extends BaseSchema>(type: Type): TFromType<Type> {
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
    t.Never()
  ) as never
}
// ------------------------------------------------------------------
// TypeBoxFromValibot
// ------------------------------------------------------------------
/** Creates a TypeBox type from Valibot */
// prettier-ignore
export type TTypeBoxFromValibot<Type extends v.BaseSchema<any, any, any>, 
  Result extends t.TSchema = TFromType<Type>
> = Result

/** Creates a TypeBox type from Valibot */
// prettier-ignore
export function TypeBoxFromValibot<Type extends v.BaseSchema<any, any, any>, Result extends TTypeBoxFromValibot<Type> = TTypeBoxFromValibot<Type>>(type: Type): Result {
  return FromType(type) as never
}
