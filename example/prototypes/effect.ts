// /*--------------------------------------------------------------------------

// @sinclair/typemap

// The MIT License (MIT)

// Copyright (c) 2024-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// ---------------------------------------------------------------------------*/

// import { Schema as et } from '@effect/schema/Schema'
// import { Schema as es } from '@effect/schema'
// import * as ast from '@effect/schema/AST'
// import * as tb from '@sinclair/typebox'

// // ------------------------------------------------------------------
// // Effect Guard
// // ------------------------------------------------------------------
// function IsBigInt(type: ast.Annotated) {
//   return type.annotations[ast.IdentifierAnnotationId] === 'bigint'
// }
// function IsDate(type: ast.Annotated) {
//   return type.annotations[ast.IdentifierAnnotationId] === 'Date'
// }
// function IsInt(type: ast.Annotated) {
//   return type.annotations[ast.IdentifierAnnotationId] === 'Int'
// }
// function IsNull(type: ast.Annotated) {
//   return type instanceof ast.Literal && tb.ValueGuard.IsNull(type.literal)
// }
// function IsOptional(type: ast.Annotated) {
//   return 'isOptional' in type && type.isOptional === true
// }
// function IsUint8Array(type: ast.Annotated) {
//   return type.annotations[ast.IdentifierAnnotationId] === 'Uint8Array'
// }
// function IsNumberFromString(type: ast.Annotated) {
//   return type.annotations[ast.IdentifierAnnotationId] === 'NumberFromString'
// }
// function IsArray(type: ast.Annotated): type is ast.TupleType {
//   return type instanceof ast.TupleType && type.rest.length > 0 && type.elements.length === 0
// }
// function IsTuple(type: ast.Annotated): type is ast.TupleType {
//   return type instanceof ast.TupleType && type.rest.length === 0
// }
// // ------------------------------------------------------------------
// // Any
// // ------------------------------------------------------------------
// type TFromAny<_Type> = tb.TAny
// function FromAny(_type: ast.AnyKeyword): tb.TSchema {
//   return tb.Any()
// }
// // ------------------------------------------------------------------
// // Array
// // ------------------------------------------------------------------
// type TFromArray<Type, Result extends tb.TSchema = tb.TArray<TFromType<Type>>> = Result
// function FromArray(_type: ast.TupleType): tb.TSchema {
//   return tb.Array(FromType(_type.rest[0].type))
// }
// // ------------------------------------------------------------------
// // BigInt
// // ------------------------------------------------------------------
// type TFromBigInt<_Type> = tb.TBigInt
// function FromBigInt(_type: ast.Annotated): tb.TSchema {
//   return tb.BigInt()
// }
// // ------------------------------------------------------------------
// // Boolean
// // ------------------------------------------------------------------
// type TFromBoolean<_Type> = tb.TBoolean
// function FromBoolean(_type: ast.BooleanKeyword): tb.TSchema {
//   return tb.Boolean()
// }
// // ------------------------------------------------------------------
// // Date
// // ------------------------------------------------------------------
// type TFromDate<_Type> = tb.TDate
// function FromDate(_type: ast.Annotated): tb.TSchema {
//   return tb.Date()
// }
// // ------------------------------------------------------------------
// // Integer
// // ------------------------------------------------------------------
// type TFromInteger<_Type> = tb.TNumber
// function FromInteger(_type: ast.Annotated): tb.TSchema {
//   return tb.Number({ multipleOf: 1 })
// }
// // ------------------------------------------------------------------
// // Literal: Effect literal types may be union
// // ------------------------------------------------------------------
// // prettier-ignore
// type TFromLiteral<Value extends readonly unknown[], Result extends tb.TSchema[] = []> = (
//   Value extends [infer Left extends unknown, ...infer Right extends unknown[]]
//    ? (
//     Left extends tb.TLiteralValue 
//       ? TFromLiteral<Right, [...Result, tb.TLiteral<Left>]>
//       : TFromLiteral<Right, [...Result]>
//    ) : tb.TUnionEvaluated<Result>
// )
// function FromLiteral(type: ast.Literal): tb.TSchema {
//   return tb.KindGuard.IsLiteralValue(type.literal) ? tb.Literal(type.literal) : tb.Unknown()
// }
// // ------------------------------------------------------------------
// // FromNever
// // ------------------------------------------------------------------
// function FromNever(_type: ast.NeverKeyword): tb.TSchema {
//   return tb.Never()
// }
// type TFromNever<_Type, Result extends tb.TSchema = tb.TNever> = Result
// // ------------------------------------------------------------------
// // NullishOr
// // ------------------------------------------------------------------
// type TFromNullishOr<Type, Result extends tb.TSchema = tb.TUnion<[TFromType<Type>, tb.TNull, tb.TUndefined]>> = Result
// // ------------------------------------------------------------------
// // NullOr
// // ------------------------------------------------------------------
// type TFromNullOr<Type, Result extends tb.TSchema = tb.TUnion<[TFromType<Type>, tb.TNull]>> = Result
// // ------------------------------------------------------------------
// // Null
// // ------------------------------------------------------------------
// type TFromNull<_Type> = tb.TNull
// function FromNull(_type: ast.Annotated): tb.TSchema {
//   return tb.Null()
// }
// // ------------------------------------------------------------------
// // Number
// // ------------------------------------------------------------------
// type TFromNumber<_Type> = tb.TNumber
// function FromNumber(_type: ast.NumberKeyword): tb.TSchema {
//   return tb.Number()
// }
// // ------------------------------------------------------------------
// // Object
// // ------------------------------------------------------------------
// type TFromObject<_Type> = tb.TObject
// function FromObject(type: ast.ObjectKeyword): tb.TSchema {
//   return tb.Object({})
// }
// // ------------------------------------------------------------------
// // Optional
// // ------------------------------------------------------------------
// type TFromOptional<Type, Mapped extends tb.TSchema = TFromType<Type>, Result = tb.TOptional<Mapped>> = Result
// function FromOptional(type: ast.Annotated): tb.TSchema {
//   return tb.Optional(FromType(type))
// }
// // ------------------------------------------------------------------
// // Record
// // ------------------------------------------------------------------
// type TFromRecord<Key, Value> = tb.TRecordOrObject<TFromType<Key>, TFromType<Value>>
// // ------------------------------------------------------------------
// // SchemaClass: TypeLiteral
// // ------------------------------------------------------------------
// type TFromSchemaClass<Properties, Result = tb.TUnsafe<Properties>> = Result
// // ------------------------------------------------------------------
// // String
// // ------------------------------------------------------------------
// type TFromString<_Type> = tb.TString
// function FromString(_type: ast.Annotated): tb.TSchema {
//   return tb.String()
// }
// // ------------------------------------------------------------------
// // Struct
// // ------------------------------------------------------------------
// // prettier-ignore
// type TFromStruct<Properties extends Record<PropertyKey, unknown>, 
//   Mapped extends tb.TProperties = { [Key in keyof Properties]: TFromType<Properties[Key]> },
//   Result = tb.TObject<Mapped>
// > = Result
// // prettier-ignore
// function FromStruct(type: ast.TypeLiteral): tb.TSchema {
//   const properties = type.propertySignatures.reduce((result, property) => {
//     const mappedProperty = property.isOptional ? tb.Optional(FromType(property.type)) : FromType(property.type)
//     return { ...result, [property.name]: mappedProperty }
//   }, {} as tb.TProperties) as tb.TProperties
//   return tb.Object(properties)
// }
// // ------------------------------------------------------------------
// // Symbol
// // ------------------------------------------------------------------
// type TFromSymbol<_Type> = tb.TSymbol
// function FromSymbol(_type: ast.Annotated): tb.TSchema {
//   return tb.Symbol()
// }
// // ------------------------------------------------------------------
// // Tuple
// // ------------------------------------------------------------------
// // prettier-ignore
// type TFromTuple<Types extends readonly unknown[], Result extends tb.TSchema[] = []> = (
//   Types extends [infer Left extends unknown, ...infer Right extends unknown[]] 
//     ? TFromTuple<Right, [...Result, TFromType<Left>]>
//     : tb.TTuple<Result>
// )
// function FromTuple(type: ast.TupleType): tb.TSchema {
//   return tb.Tuple(type.elements.map((type) => FromType(type.type)))
// }
// // ------------------------------------------------------------------
// // UndefinedOr
// // ------------------------------------------------------------------
// type TFromUndefinedOr<Type, Result extends tb.TSchema = tb.TUnion<[TFromType<Type>, tb.TUndefined]>> = Result
// // ------------------------------------------------------------------
// // Undefined
// // ------------------------------------------------------------------
// type TFromUndefined<_Type> = tb.TUndefined
// function FromUndefined(_type: ast.Annotated): tb.TSchema {
//   return tb.Undefined()
// }
// // ------------------------------------------------------------------
// // Uint8Array
// // ------------------------------------------------------------------
// type TFromUint8Array<_Type> = tb.TUint8Array
// function FromUint8Array(_type: ast.Annotated): tb.TSchema {
//   return tb.Uint8Array()
// }
// // ------------------------------------------------------------------
// // Unknown
// // ------------------------------------------------------------------
// type TFromUnknown<_Type> = tb.TUnknown
// function FromUnknown(_type: ast.Annotated): tb.TSchema {
//   return tb.Unknown()
// }
// // ------------------------------------------------------------------
// // Union
// // ------------------------------------------------------------------
// // prettier-ignore
// type TFromUnion<Variants extends readonly unknown[], Result extends tb.TSchema[] = []> = (
//   Variants extends [infer Left extends unknown, ...infer Right extends unknown[]]
//     ? TFromUnion<Right, [...Result, TFromType<Left>]>
//     : tb.TUnionEvaluated<Result>
// )
// function FromUnion(type: ast.Union): tb.TSchema {
//   return tb.Union(type.types.map((type) => FromType(type)))
// }
// // ------------------------------------------------------------------
// // Void
// // ------------------------------------------------------------------
// type TFromVoid<_Type> = tb.TVoid
// function FromVoid(_type: ast.VoidKeyword): tb.TSchema {
//   return tb.Void()
// }
// // ------------------------------------------------------------------
// // Type
// //
// // Note: Type differentition in Effect is quite challenging as the
// // library doesn't provide discriminable types in all cases. An
// // example would be Number and Integer where both are observed 
// // as Number. Unions also provide challenges for NullishOr and 
// // similar types. The order in which we resolve is important.
// // ------------------------------------------------------------------
// // prettier-ignore
// type TFromType<Type> = (
//   Type extends es.optional<infer Type> ? TFromOptional<Type> :
//   Type extends es.Tuple<infer Types> ? TFromTuple<Types> : 
//   Type extends es.Record$<infer Key, infer Value> ? TFromRecord<Key, Value> :
//   Type extends es.Array$<infer Type> ? TFromArray<Type> :
//   Type extends es.Date ? TFromDate<Type> :
//   Type extends es.Struct<infer Properties> ? TFromStruct<Properties> : 
//   Type extends es.SchemaClass<infer Properties> ? TFromSchemaClass<Properties> :
//   Type extends es.Literal<infer Value> ? TFromLiteral<Value> :
//   Type extends es.Int ? TFromInteger<Type> :
//   Type extends es.BigInt ? TFromBigInt<Type> :
//   Type extends es.Boolean ? TFromBoolean<Type> :
//   Type extends es.Object ? TFromObject<Type> :
//   Type extends es.Never ? TFromNever<Type> :
//   Type extends es.Null ? TFromNull<Type> :
//   Type extends es.Number ? TFromNumber<Type> :
//   Type extends es.String ? TFromString<Type> :
//   Type extends es.Symbol ? TFromSymbol<Type> :
//   Type extends et<Uint8Array, any> ? TFromUint8Array<Type> :
//   Type extends es.Undefined ? TFromUndefined<Type> :
//   Type extends es.Void ? TFromVoid<Type> :
//   // Union-Like
//   Type extends es.UndefinedOr<infer Type> ? TFromUndefinedOr<Type> :
//   Type extends es.NullishOr<infer Type> ? TFromNullishOr<Type> :
//   Type extends es.NullOr<infer Type> ? TFromNullOr<Type> :
//   Type extends es.Union<infer Variants> ? TFromUnion<Variants> :
//   // Fallthrough
//   Type extends es.Unknown ? TFromUnknown<Type> :
//   Type extends es.Any ? TFromAny<Type> :
//   tb.TUnknown
// )
// // prettier-ignore
// function FromType(type: ast.Annotated): tb.TSchema {
//   const schema = (
//     // Non-Differentiable
//     IsOptional(type) ? FromOptional(type) :
//     IsArray(type) ? FromArray(type) :    
//     IsBigInt(type) ? FromBigInt(type) :
//     IsDate(type) ? FromDate(type) :
//     IsInt(type) ? FromInteger(type) :
//     IsNull(type) ? FromNull(type) :
//     IsTuple(type) ? FromTuple(type) :
//     IsUint8Array(type) ? FromUint8Array(type) :
//     // Differentiable
//     type instanceof ast.AnyKeyword ? FromAny(type) :
//     type instanceof ast.BooleanKeyword ? FromBoolean(type) :
//     type instanceof ast.Literal ? FromLiteral(type) :
//     type instanceof ast.NeverKeyword ? FromNever(type) :
//     type instanceof ast.NumberKeyword ? FromNumber(type) :
//     type instanceof ast.ObjectKeyword ? FromObject(type) :
//     type instanceof ast.StringKeyword ? FromString(type) :
//     type instanceof ast.SymbolKeyword ? FromSymbol(type) :
//     type instanceof ast.TypeLiteral ? FromStruct(type) :
//     type instanceof ast.UndefinedKeyword ? FromUndefined(type) :
//     type instanceof ast.UnknownKeyword ? FromUnknown(type) :
//     type instanceof ast.Union ? FromUnion(type) :
//     type instanceof ast.VoidKeyword ? FromVoid(type) :
//     tb.Unknown()
//   )
//   return schema
// }
// // ------------------------------------------------------------------
// // Box
// // ------------------------------------------------------------------
// /** Converts an Effect Type to a TypeBox Type */
// // prettier-ignore
// export type TBox<Type extends unknown> = (
//   Type extends es.Any ? TFromType<Type> : undefined
// )
// /** Converts an Effect Type to a TypeBox Type */
// // prettier-ignore
// export function Box<Type>(type: Type): TBox<Type> {
//   return (
//     es.isSchema(type) 
//       ? FromType(type.ast) 
//       : undefined
//   ) as never
// }
