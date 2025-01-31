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

// ------------------------------------------------------------------
// Characters
// ------------------------------------------------------------------
type TEmptyString = ''

type TAmpersand = '&'
type TComma = ','
type TPipe = '|'

const Ampersand = '&'
const Comma = ','
const Pipe = '|'

// ------------------------------------------------------------------
// Delmited
// ------------------------------------------------------------------
// prettier-ignore
type TFromDelimited<Values extends string[], Delimiter extends string, Result extends string = TEmptyString> = (
  Values extends [infer Left extends string, ...infer Right extends string[]] 
    ? Result extends TEmptyString 
      ? TFromDelimited<Right, Delimiter, Left>
      : TFromDelimited<Right, Delimiter, `${Result}${Delimiter} ${Left}`>
    : Result
)
function FromDelimited(values: string[], delimiter: string): string {
  return values.join(delimiter)
}
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
type TFromAny<_Type extends t.TAny> = 'any'
function FromAny(_type: t.TSchema): string {
  return 'any'
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
type TFromArray<Type extends t.TSchema, 
  Result extends string = `${TFromType<Type>}[]`
> = Result
function FromArray(type: t.TSchema): string {
  return `${type}[]`
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
type TFromBigInt<_Type extends t.TBigInt> = 'bigint'
function FromBigInt(_type: t.TSchema): string {
  return 'bigint'
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
type TFromBoolean<_Type extends t.TBoolean> = 'boolean'
function FromBoolean(_type: t.TSchema): string {
  return 'boolean'
}
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
// prettier-ignore
type TFromConstructor<Parameters extends t.TSchema[], InstanceType extends t.TSchema,
  MappedParameters extends string = TFromParameters<Parameters>,
  MappedInstanceType extends string = TFromType<InstanceType>
> = `new ${MappedParameters} => ${MappedInstanceType}`
// prettier-ignore
function FromConstructor(parameters: t.TSchema[], instanceType: t.TSchema): string {
  const mappedParameters = FromParameters(parameters)
  const mappedInstanceType = FromType(instanceType)
  return `new ${mappedParameters} => ${mappedInstanceType}`
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
type TFromFunction<Parameters extends t.TSchema[], ReturnType extends t.TSchema,
  MappedParameters extends string = TFromParameters<Parameters>,
  MappedReturnType extends string = TFromType<ReturnType>
> = `${MappedParameters} => ${MappedReturnType}`
// prettier-ignore
function FromFunction(parameters: t.TSchema[], returnType: t.TSchema): string {
  const mappedParameters = FromParameters(parameters)
  const mappedReturnType = FromType(returnType)
  return `${mappedParameters} => ${mappedReturnType}`
}
// ------------------------------------------------------------------
// Integer
// ------------------------------------------------------------------
type TFromInteger<_Type extends t.TInteger> = 'integer'
function FromInteger(_type: t.TSchema): string {
  return 'integer'
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<Types extends t.TSchema[], Result extends string[] = []> = (
  Types extends [infer Left extends t.TSchema, ...infer Right extends t.TSchema[]]
    ? TFromIntersect<Right, [...Result, TFromType<Left>]>
    : `(${TFromDelimited<Result, ` ${TAmpersand}`>})`
)
function FromIntersect(types: t.TSchema[]): string {
  const result = types.map((type) => FromType(type))
  return `(${FromDelimited(result, ` ${Ampersand} `)})`
}
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
// prettier-ignore
type TFromLiteral<Value extends t.TLiteralValue,
  Result extends string = Value extends string ? `"${Value}"` : `${Value}`
> = Result
// prettier-ignore
function FromLiteral(value: t.TLiteralValue): string {
  return t.ValueGuard.IsString(value) ? `"${value}"` : `${value}`
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
type TFromNumber<_Type extends t.TNumber> = 'number'
function FromNumber(_type: t.TSchema): string {
  return 'number'
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
type TFromNull<_Type extends t.TNull> = 'null'
function FromNull(_type: t.TSchema): string {
  return 'null'
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
type TFromObject<Properties extends t.TProperties, 
  PropertyKeys extends PropertyKey[] = t.UnionToTuple<keyof Properties>,
  Delimited extends string[] = TFromProperties<PropertyKeys, Properties>,
  Result extends string = TFromDelimited<Delimited, TComma>
> = `{ ${Result} }`
function FromObject(properties: t.TProperties): string {
  const propertyKeys = globalThis.Object.getOwnPropertyNames(properties)
  const delimited = FromProperties(propertyKeys, properties)
  const result = FromDelimited(delimited, `${Comma} `)
  return `{ ${result} }`
}
// ------------------------------------------------------------------
// Parameters
// ------------------------------------------------------------------
// prettier-ignore
type TFromParameters<Parameters extends t.TSchema[], Index extends string = '0', Result extends string[] = []> = (
  Parameters extends [infer Left extends t.TSchema, ...infer Right extends t.TSchema[]]
    ? TFromParameters<Right, t.TIncrement<Index>, [...Result, `arg${Index}: ${TFromType<Left>}`]>
    : `(${TFromDelimited<Result, TComma>})`
)
function FromParameters(parameters: t.TSchema[]): string {
  const result = parameters.map((parameter, index) => `arg${index}: ${FromType(parameter)}`)
  return `(${FromDelimited(result, `${Comma} `)})`
}
// ------------------------------------------------------------------
// Property
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperty<Key extends string, Type extends t.TSchema,
  IsOptional extends boolean = Type extends t.TOptional<t.TSchema> ? true : false,
  IsReadonly extends boolean = Type extends t.TReadonly<t.TSchema> ? true : false,
  Mapped extends string = TFromType<Type>,
  Result = (
    [IsReadonly, IsOptional] extends [true, true] ? `readonly ${Key}?: ${Mapped}` :
    [IsReadonly, IsOptional] extends [false, true] ? `${Key}?: ${Mapped}` :
    [IsReadonly, IsOptional] extends [true, false] ? `readonly ${Key}: ${Mapped}` :
    `${Key}: ${Mapped}`
  )
> = Result
// prettier-ignore
function FromProperty(key: string, type: t.TSchema): string {
  const isOptional = t.KindGuard.IsOptional(type)
  const isReadonly = t.KindGuard.IsReadonly(type)
  const mapped = FromType(type)
  return (
    isReadonly && isOptional ? `readonly ${key}?: ${mapped}` :
    !isReadonly && isOptional ? `${key}?: ${mapped}` :
    isReadonly && !isOptional ? `readonly ${key}: ${mapped}` :
    `${key}: ${mapped}`
  )
}
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<PropertyKeys extends PropertyKey[], Properties extends t.TProperties, Result extends string[] = []> = (
  PropertyKeys extends [infer Left extends PropertyKey, ...infer Right extends PropertyKey[]]
    ? (Left extends infer Key extends string
      ? (Key extends keyof Properties
        ? TFromProperties<Right, Properties, [...Result, TFromProperty<Key, Properties[Key]>]>
        : TFromProperties<Right, Properties, Result>
      ) : TFromProperties<Right, Properties, Result>
    ) : Result
)
// prettier-ignore
function FromProperties(propertyKeys: PropertyKey[], properties: t.TProperties): string[] {
  return propertyKeys.reduce((result, left) => {
    const key = t.ValueGuard.IsString(left) || t.ValueGuard.IsNumber(left) || t.ValueGuard.IsBoolean(left) ? `${left}` : undefined
    return (
      t.ValueGuard.IsString(key)
        ? (key in properties
            ? [...result, FromProperty(key, properties[key])]
            : result
        ): result
    )
  }, [] as string[])
}
// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
type TFromPromise<Type extends t.TSchema, Result extends string = `Promise<${TFromType<Type>}>`> = Result
function FromPromise(type: t.TSchema): string {
  return `Promise<${FromType(type)}>`
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
type TFromString<_Type extends t.TString> = 'string'
function FromString(_type: t.TSchema): string {
  return 'string'
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
type TFromSymbol<_Type extends t.TSymbol> = 'symbol'
function FromSymbol(_type: t.TSchema): string {
  return 'symbol'
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<Types extends t.TSchema[], Result extends string[] = []> = (
  Types extends [infer Left extends t.TSchema, ...infer Right extends t.TSchema[]]
  ? TFromTuple<Right, [...Result, TFromType<Left>]>
  : `[${TFromDelimited<Result, TComma>}]`
)
function FromTuple(types: t.TSchema[]): string {
  const result = types.map((type) => FromType(type))
  return `[${FromDelimited(result, Comma)}]`
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
type TFromUndefined<_Type extends t.TUndefined> = 'undefined'
function FromUndefined(type: t.TSchema): string {
  return 'undefined'
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Types extends t.TSchema[], Result extends string[] = []> = (
  Types extends [infer Left extends t.TSchema, ...infer Right extends t.TSchema[]]
    ? TFromUnion<Right, [...Result, TFromType<Left>]>
    : `(${TFromDelimited<Result, ` ${TPipe}`>})`
)
function FromUnion(types: t.TSchema[]): string {
  const result = types.map((type) => FromType(type))
  return `(${FromDelimited(result, ` ${Pipe} `)})`
}
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
type TFromUnknown<Type extends t.TSchema> = 'unknown'
function FromUnknown(type: t.TSchema): string {
  return 'unknown'
}
// ------------------------------------------------------------------
// Void
// ------------------------------------------------------------------
type TFromVoid<Type extends t.TSchema> = 'void'
function FromVoid(type: t.TSchema): string {
  return 'void'
}
// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
// prettier-ignore
type TFromType<Type extends t.TSchema> = (
  Type extends t.TAny ? TFromAny<Type> :
  Type extends t.TArray<infer Type extends t.TSchema> ? TFromArray<Type> :
  Type extends t.TBigInt ? TFromBigInt<Type> :
  Type extends t.TBoolean ? TFromBoolean<Type> :
  Type extends t.TConstructor<infer Parameters extends t.TSchema[], infer InstanceType extends t.TSchema> ? TFromConstructor<Parameters, InstanceType> :
  Type extends t.TFunction<infer Parameters extends t.TSchema[], infer ReturnType extends t.TSchema> ? TFromFunction<Parameters, ReturnType> :
  Type extends t.TInteger ? TFromInteger<Type> :
  Type extends t.Intersect<infer Types extends t.TSchema[]> ? TFromIntersect<Types> :
  Type extends t.TLiteral<infer Value extends t.TLiteralValue> ? TFromLiteral<Value> :
  Type extends t.TNumber ? TFromNumber<Type> :
  Type extends t.TNull ? TFromNull<Type> :
  Type extends t.TObject<infer Properties extends t.TProperties> ? TFromObject<Properties> :
  Type extends t.TPromise<infer Type extends t.TSchema> ? TFromPromise<Type> :
  Type extends t.TString ? TFromString<Type> :
  Type extends t.TSymbol ? TFromSymbol<Type> :
  Type extends t.TTuple<infer Types extends t.TSchema[]> ? TFromTuple<Types> :
  Type extends t.TUndefined ? TFromUndefined<Type> :
  Type extends t.TUnion<infer Types extends t.TSchema[]> ? TFromUnion<Types> :
  Type extends t.TUnknown ? TFromUnknown<Type> :
  Type extends t.TVoid ? TFromVoid<Type> :
  'never'
)
// prettier-ignore
function FromType<Type extends t.TSchema>(type: Type): TFromType<Type> {
  return (
    t.KindGuard.IsAny(type) ? FromAny(type) :
    t.KindGuard.IsArray(type) ? FromArray(type.items) :
    t.KindGuard.IsBigInt(type) ? FromBigInt(type) :
    t.KindGuard.IsBoolean(type) ? FromBoolean(type) :
    t.KindGuard.IsConstructor(type) ? FromConstructor(type.parameters, type.returns) :
    t.KindGuard.IsFunction(type) ? FromFunction(type.parameters, type.returns) :
    t.KindGuard.IsInteger(type) ? FromInteger(type) :
    t.KindGuard.IsIntersect(type) ? FromIntersect(type.allOf) :
    t.KindGuard.IsLiteral(type) ? FromLiteral(type.const) :
    t.KindGuard.IsNumber(type) ? FromNumber(type) :
    t.KindGuard.IsNull(type) ? FromNull(type) :
    t.KindGuard.IsObject(type) ? FromObject(type.properties) :
    t.KindGuard.IsPromise(type) ? FromPromise(type.item) :
    t.KindGuard.IsString(type) ? FromString(type) :
    t.KindGuard.IsSymbol(type) ? FromSymbol(type) :
    t.KindGuard.IsTuple(type) ? FromTuple(type.items || []) :
    t.KindGuard.IsUndefined(type) ? FromUndefined(type) :
    t.KindGuard.IsUnion(type) ? FromUnion(type.anyOf) :
    t.KindGuard.IsUnknown(type) ? FromUnknown(type) :
    t.KindGuard.IsVoid(type) ? FromVoid(type) :
    'never'
  ) as never
}

// ------------------------------------------------------------------
// SyntaxFromTypeBox
// ------------------------------------------------------------------
// prettier-ignore
export type TSyntaxFromTypeBox<Type extends t.TSchema, 
  Result extends string = TFromType<Type>
> = Result
export function SyntaxFromTypeBox<Type extends t.TSchema>(type: t.TSchema): TSyntaxFromTypeBox<Type> {
  return FromType(type) as never
}
