import { TypeBoxFromZod4 as TypeBox } from '../src/typebox/typebox-from-zod4'
import * as t from '@sinclair/typebox'
import { z } from 'zod/v4'

// Ensure that the TS types are assignable to what we expect
type AssertEquivalence<T, U, V> = T extends U ? (U extends T ? V : never) : never;

// ------------------------------------------------------------------------
// ZodAny
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const anySchema = z.any();
// 2. Manually define the expected output type
type AnyType = t.TAny;
// 3. Convert the Zod Schema into TypeBox schema
const anyTypeBox = TypeBox(anySchema);
// 4. Infer the type of the TypeBox type  
type AnyTypeBoxType = t.Static<typeof anyTypeBox>;
// 5. Create a TS assertion
const anyTypeAssertion: [
  AssertEquivalence<AnyTypeBoxType, unknown, "AnyTypeAssertion">
] = ["AnyTypeAssertion"];

// ------------------------------------------------------------------------
// ZodArray
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const arraySchema = z.array(z.string());
// 2. Manually define the expected output type
type ArrayType = string[];
// 3. Convert the Zod Schema into TypeBox schema
const arrayTypeBox = TypeBox(arraySchema);
// 4. Infer the type of the TypeBox type
type ArrayTypeBoxType = t.Static<typeof arrayTypeBox>;
// 5. Create a TS assertion
const arrayTypeAssertion: [
  AssertEquivalence<ArrayTypeBoxType, ArrayType, "ArrayTypeAssertion">
] = ["ArrayTypeAssertion"];

// ------------------------------------------------------------------------
// ZodBigInt
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const bigIntSchema = z.bigint();
// 2. Manually define the expected output type
type BigIntType = bigint;
// 3. Convert the Zod Schema into TypeBox schema
const bigIntTypeBox = TypeBox(bigIntSchema);
// 4. Infer the type of the TypeBox type
type BigIntTypeBoxType = t.Static<typeof bigIntTypeBox>;
// 5. Create a TS assertion
const bigIntTypeAssertion: [
  AssertEquivalence<BigIntTypeBoxType, BigIntType, "BigIntTypeAssertion">
] = ["BigIntTypeAssertion"];

// ------------------------------------------------------------------------
// ZodBoolean
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const booleanSchema = z.boolean();
// 2. Manually define the expected output type
type BooleanType = boolean;
// 3. Convert the Zod Schema into TypeBox schema
const booleanTypeBox = TypeBox(booleanSchema);
// 4. Infer the type of the TypeBox type
type BooleanTypeBoxType = t.Static<typeof booleanTypeBox>;
// 5. Create a TS assertion
const booleanTypeAssertion: [
  AssertEquivalence<BooleanTypeBoxType, BooleanType, "BooleanTypeAssertion">
] = ["BooleanTypeAssertion"];

// ------------------------------------------------------------------------
// ZodCatch
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const catchSchema = z.string().catch("default");
// 2. Manually define the expected output type
type CatchType = string;
// 3. Convert the Zod Schema into TypeBox schema
const catchTypeBox = TypeBox(catchSchema);
// 4. Infer the type of the TypeBox type
type CatchTypeBoxType = t.Static<typeof catchTypeBox>;
// 5. Create a TS assertion
const catchTypeAssertion: [
  AssertEquivalence<CatchTypeBoxType, CatchType, "CatchTypeAssertion">
] = ["CatchTypeAssertion"];

// // ------------------------------------------------------------------------
// // ZodCustom - No idea how to handle this in TypeBox
// // ------------------------------------------------------------------------
// // 1. Define a schema in Zod v4
// const customSchema = z.custom<string>(val => typeof val === 'string');
// // 2. Manually define the expected output type
// type CustomType = string;
// // 3. Convert the Zod Schema into TypeBox schema
// const customTypeBox = TypeBox(customSchema);
// // 4. Infer the type of the TypeBox type
// type CustomTypeBoxType = t.Static<typeof customTypeBox>;
// // 5. Create a TS assertion
// const customTypeAssertion: [
//   AssertEquivalence<CustomTypeBoxType, CustomType, "CustomTypeAssertion">
// ] = ["CustomTypeAssertion"];

// ------------------------------------------------------------------------
// ZodDate
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const dateSchema = z.date();
// 2. Manually define the expected output type
type DateType = Date;
// 3. Convert the Zod Schema into TypeBox schema
const dateTypeBox = TypeBox(dateSchema);
// 4. Infer the type of the TypeBox type
type DateTypeBoxType = t.Static<typeof dateTypeBox>;
// 5. Create a TS assertion
const dateTypeAssertion: [
  AssertEquivalence<DateTypeBoxType, DateType, "DateTypeAssertion">
] = ["DateTypeAssertion"];

// ------------------------------------------------------------------------
// ZodDefault
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const defaultSchema = z.string().default("default");
// 2. Manually define the expected output type
type DefaultType = string;
// 3. Convert the Zod Schema into TypeBox schema
const defaultTypeBox = TypeBox(defaultSchema);
// 4. Infer the type of the TypeBox type
type DefaultTypeBoxType = t.Static<typeof defaultTypeBox>;
// 5. Create a TS assertion
const defaultTypeAssertion: [
  AssertEquivalence<DefaultTypeBoxType, DefaultType, "DefaultTypeAssertion">
] = ["DefaultTypeAssertion"];

// ------------------------------------------------------------------------
// ZodDiscriminatedUnion
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const dogSchema = z.object({
  type: z.literal('dog'),
  bark: z.string()
});
const catSchema = z.object({
  type: z.literal('cat'),
  meow: z.string()
});
const discriminatedUnionSchema = z.discriminatedUnion('type', [dogSchema, catSchema]);
// 2. Manually define the expected output type
type DiscriminatedUnionType = {
  type: 'dog';
  bark: string;
} | {
  type: 'cat';
  meow: string;
};
// 3. Convert the Zod Schema into TypeBox schema
const discriminatedUnionTypeBox = TypeBox(discriminatedUnionSchema);
// 4. Infer the type of the TypeBox type
type DiscriminatedUnionTypeBoxType = t.Static<typeof discriminatedUnionTypeBox>;
// 5. Create a TS assertion
const discriminatedUnionTypeAssertion: [
  AssertEquivalence<DiscriminatedUnionTypeBoxType, DiscriminatedUnionType, "DiscriminatedUnionTypeAssertion">
] = ["DiscriminatedUnionTypeAssertion"];

// ------------------------------------------------------------------------
// ZodEnum
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const enumSchema = z.enum(['a', 'b', 'c']);
// 2. Manually define the expected output type
type EnumType = 'a' | 'b' | 'c';
// 3. Convert the Zod Schema into TypeBox schema
const enumTypeBox = TypeBox(enumSchema);
// 4. Infer the type of the TypeBox type
type EnumTypeBoxType = t.Static<typeof enumTypeBox>;
// 5. Create a TS assertion
const enumTypeAssertion: [
  AssertEquivalence<EnumTypeBoxType, EnumType, "EnumTypeAssertion">
] = ["EnumTypeAssertion"];

// // ------------------------------------------------------------------------
// // ZodLazy  - No idea - could use some expert help here
// // ------------------------------------------------------------------------
// // 1. Define a schema in Zod v4
// type TreeNode = { value: string; children: TreeNode[] };
// const lazySchema: z.ZodType<TreeNode> = z.lazy(() => 
//   z.object({
//     value: z.string(),
//     children: z.array(lazySchema)
//   })
// );
// // 2. Manually define the expected output type
// type LazyType = TreeNode;
// // 3. Convert the Zod Schema into TypeBox schema
// const lazyTypeBox = TypeBox(lazySchema);
// // 4. Infer the type of the TypeBox type
// type LazyTypeBoxType = t.Static<typeof lazyTypeBox>;
// // 5. Create a TS assertion
// const lazyTypeAssertion: [
//   AssertEquivalence<LazyTypeBoxType, LazyType, "LazyTypeAssertion">
// ] = ["LazyTypeAssertion"];

// ------------------------------------------------------------------------
// ZodLiteral
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const literalSchema = z.literal('hello');
// 2. Manually define the expected output type
type LiteralType = 'hello';
// 3. Convert the Zod Schema into TypeBox schema
const literalTypeBox = TypeBox(literalSchema);
// 4. Infer the type of the TypeBox type
type LiteralTypeBoxType = t.Static<typeof literalTypeBox>;
// 5. Create a TS assertion
const literalTypeAssertion: [
  AssertEquivalence<LiteralTypeBoxType, LiteralType, "LiteralTypeAssertion">
] = ["LiteralTypeAssertion"];

// // ------------------------------------------------------------------------
// // ZodMap - No such TypeBox type exists
// // ------------------------------------------------------------------------
// // 1. Define a schema in Zod v4
// const mapSchema = z.map(z.string(), z.number());
// // 2. Manually define the expected output type
// type MapType = Map<string, number>;
// // 3. Convert the Zod Schema into TypeBox schema
// const mapTypeBox = TypeBox(mapSchema);
// // 4. Infer the type of the TypeBox type
// type MapTypeBoxType = t.Static<typeof mapTypeBox>;
// // 5. Create a TS assertion
// const mapTypeAssertion: [
//   AssertEquivalence<MapTypeBoxType, MapType, "MapTypeAssertion">
// ] = ["MapTypeAssertion"];

// ------------------------------------------------------------------------
// ZodNever
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const neverSchema = z.never();
// 2. Manually define the expected output type
type NeverType = never;
// 3. Convert the Zod Schema into TypeBox schema
const neverTypeBox = TypeBox(neverSchema);
// 4. Infer the type of the TypeBox type
type NeverTypeBoxType = t.Static<typeof neverTypeBox>;
// 5. Create a TS assertion
// @ts-expect-
const neverTypeAssertion: [
  AssertEquivalence<NeverTypeBoxType, NeverType, "NeverTypeAssertion">
] = ["NeverTypeAssertion"] as never;

// ------------------------------------------------------------------------
// ZodNull
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const nullSchema = z.null();
// 2. Manually define the expected output type
type NullType = null;
// 3. Convert the Zod Schema into TypeBox schema
const nullTypeBox = TypeBox(nullSchema);
// 4. Infer the type of the TypeBox type
type NullTypeBoxType = t.Static<typeof nullTypeBox>;
// 5. Create a TS assertion
const nullTypeAssertion: [
  AssertEquivalence<NullTypeBoxType, NullType, "NullTypeAssertion">
] = ["NullTypeAssertion"];

// ------------------------------------------------------------------------
// ZodNullable
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const nullableSchema = z.string().nullable();
// 2. Manually define the expected output type
type NullableType = string | null;
// 3. Convert the Zod Schema into TypeBox schema
const nullableTypeBox = TypeBox(nullableSchema);
// 4. Infer the type of the TypeBox type
type NullableTypeBoxType = t.Static<typeof nullableTypeBox>;
// 5. Create a TS assertion
const nullableTypeAssertion: [
  AssertEquivalence<NullableTypeBoxType, NullableType, "NullableTypeAssertion">
] = ["NullableTypeAssertion"];

// ------------------------------------------------------------------------
// ZodNumber
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const numberSchema = z.number();
// 2. Manually define the expected output type
type NumberType = number;
// 3. Convert the Zod Schema into TypeBox schema
const numberTypeBox = TypeBox(numberSchema);
// 4. Infer the type of the TypeBox type
type NumberTypeBoxType = t.Static<typeof numberTypeBox>;
// 5. Create a TS assertion
const numberTypeAssertion: [
  AssertEquivalence<NumberTypeBoxType, NumberType, "NumberTypeAssertion">
] = ["NumberTypeAssertion"];

// ------------------------------------------------------------------------
// ZodObject
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const objectSchema = z.object({
  name: z.string(),
  age: z.number(),
});
// 2. Manually define the expected output type
type ObjectType = {
  name: string;
  age: number;
};
// 3. Convert the Zod Schema into TypeBox schema
const objectTypeBox = TypeBox(objectSchema);
// 4. Infer the type of the TypeBox type
type ObjectTypeBoxType = t.Static<typeof objectTypeBox>;
// 5. Create a TS assertion
const objectTypeAssertion: [
  AssertEquivalence<ObjectTypeBoxType, ObjectType, "ObjectTypeAssertion">
] = ["ObjectTypeAssertion"];

// ------------------------------------------------------------------------
// ZodOptional
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const optionalSchema = z.string().optional();
// 2. Manually define the expected output type
type OptionalType = string | undefined;
// 3. Convert the Zod Schema into TypeBox schema
const optionalTypeBox = TypeBox(optionalSchema);
// 4. Infer the type of the TypeBox type
type OptionalTypeBoxType = t.Static<typeof optionalTypeBox>;
// 5. Create a TS assertion
const optionalTypeAssertion: [
  AssertEquivalence<OptionalTypeBoxType, OptionalType, "OptionalTypeAssertion">
] = ["OptionalTypeAssertion"];

// // ------------------------------------------------------------------------
// // ZodPipe - Too complicate, never seen it used 
// // ------------------------------------------------------------------------
// // 1. Define a schema in Zod v4
// const pipeSchema = z.string().pipe(z.number());
// // 2. Manually define the expected output type
// type PipeType = number;
// // 3. Convert the Zod Schema into TypeBox schema
// const pipeTypeBox = TypeBox(pipeSchema);
// // 4. Infer the type of the TypeBox type
// type PipeTypeBoxType = t.Static<typeof pipeTypeBox>;
// // 5. Create a TS assertion
// const pipeTypeAssertion: [
//   AssertEquivalence<PipeTypeBoxType, PipeType, "PipeTypeAssertion">
// ] = ["PipeTypeAssertion"];

// ------------------------------------------------------------------------
// ZodPromise - Not directly supported in TypeBox
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const promiseSchema = z.promise(z.string());
// 2. Manually define the expected output type
type PromiseType = Promise<string>;
// 3. Convert the Zod Schema into TypeBox schema
const promiseTypeBox = TypeBox(promiseSchema);
// 4. Infer the type of the TypeBox type
type PromiseTypeBoxType = t.Static<typeof promiseTypeBox>;
// 5. Create a TS assertion
const promiseTypeAssertion: [
  AssertEquivalence<PromiseTypeBoxType, PromiseType, "PromiseTypeAssertion">
] = ["PromiseTypeAssertion"];

// ------------------------------------------------------------------------
// ZodRecord
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const recordSchema = z.record(z.string(), z.number());
// 2. Manually define the expected output type
type RecordType = Record<string, number>;
// 3. Convert the Zod Schema into TypeBox schema
const recordTypeBox = TypeBox(recordSchema);
// 4. Infer the type of the TypeBox type
type RecordTypeBoxType = t.Static<typeof recordTypeBox>;
// 5. Create a TS assertion
const recordTypeAssertion: [
  AssertEquivalence<RecordTypeBoxType, RecordType, "RecordTypeAssertion">
] = ["RecordTypeAssertion"];

// // ------------------------------------------------------------------------
// // ZodSet - Like Map, no such TypeBox type exists
// // ------------------------------------------------------------------------
// // 1. Define a schema in Zod v4
// const setSchema = z.set(z.string());
// // 2. Manually define the expected output type
// type SetType = Set<string>;
// // 3. Convert the Zod Schema into TypeBox schema
// const setTypeBox = TypeBox(setSchema);
// // 4. Infer the type of the TypeBox type
// type SetTypeBoxType = t.Static<typeof setTypeBox>;
// // 5. Create a TS assertion
// const setTypeAssertion: [
//   AssertEquivalence<SetTypeBoxType, SetType, "SetTypeAssertion">
// ] = ["SetTypeAssertion"];

// ------------------------------------------------------------------------
// ZodString
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const stringSchema = z.string();
// 2. Manually define the expected output type
type StringType = string;
// 3. Convert the Zod Schema into TypeBox schema
const stringTypeBox = TypeBox(stringSchema);
// 4. Infer the type of the TypeBox type
type StringTypeBoxType = t.Static<typeof stringTypeBox>;
// 5. Create a TS assertion
const stringTypeAssertion: [
  AssertEquivalence<StringTypeBoxType, StringType, "StringTypeAssertion">
] = ["StringTypeAssertion"];

// ------------------------------------------------------------------------
// ZodSymbol
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const symbolSchema = z.symbol();
// 2. Manually define the expected output type
type SymbolType = symbol;
// 3. Convert the Zod Schema into TypeBox schema
const symbolTypeBox = TypeBox(symbolSchema);
// 4. Infer the type of the TypeBox type
type SymbolTypeBoxType = t.Static<typeof symbolTypeBox>;
// 5. Create a TS assertion
const symbolTypeAssertion: [
  AssertEquivalence<SymbolTypeBoxType, SymbolType, "SymbolTypeAssertion">
] = ["SymbolTypeAssertion"];

// ------------------------------------------------------------------------
// ZodTemplateLiteral -- SO CLOSE - need help!
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const templateLiteralSchema = z.templateLiteral(['Hello, ', z.string()]);
// 2. Manually define the expected output type
type TemplateLiteralType = `Hello, ${string}`;
// 3. Convert the Zod Schema into TypeBox schema
const templateLiteralTypeBox = TypeBox(templateLiteralSchema);
// 4. Infer the type of the TypeBox type
type TemplateLiteralTypeBoxType = t.Static<typeof templateLiteralTypeBox>;
// 5. Create a TS assertion
// const templateLiteralTypeAssertion: [
//   AssertEquivalence<TemplateLiteralTypeBoxType, TemplateLiteralType, "TemplateLiteralTypeAssertion">
// ] = ["TemplateLiteralTypeAssertion"];

// ------------------------------------------------------------------------
// ZodTuple
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const tupleSchema = z.tuple([z.string(), z.number(), z.boolean()]);
// 2. Manually define the expected output type
type TupleType = [string, number, boolean];
// 3. Convert the Zod Schema into TypeBox schema
const tupleTypeBox = TypeBox(tupleSchema);
// 4. Infer the type of the TypeBox type
type TupleTypeBoxType = t.Static<typeof tupleTypeBox>;
// 5. Create a TS assertion
const tupleTypeAssertion: [
  AssertEquivalence<TupleTypeBoxType, TupleType, "TupleTypeAssertion">
] = ["TupleTypeAssertion"];

// ------------------------------------------------------------------------
// ZodUndefined
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const undefinedSchema = z.undefined();
// 2. Manually define the expected output type
type UndefinedType = undefined;
// 3. Convert the Zod Schema into TypeBox schema
const undefinedTypeBox = TypeBox(undefinedSchema);
// 4. Infer the type of the TypeBox type
type UndefinedTypeBoxType = t.Static<typeof undefinedTypeBox>;
// 5. Create a TS assertion
const undefinedTypeAssertion: [
  AssertEquivalence<UndefinedTypeBoxType, UndefinedType, "UndefinedTypeAssertion">
] = ["UndefinedTypeAssertion"];

// ------------------------------------------------------------------------
// ZodUnion
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const unionSchema = z.union([z.string(), z.number()]);
// 2. Manually define the expected output type
type UnionType = string | number;
// 3. Convert the Zod Schema into TypeBox schema
const unionTypeBox = TypeBox(unionSchema);
// 4. Infer the type of the TypeBox type
type UnionTypeBoxType = t.Static<typeof unionTypeBox>;
// 5. Create a TS assertion
const unionTypeAssertion: [
  AssertEquivalence<UnionTypeBoxType, UnionType, "UnionTypeAssertion">
] = ["UnionTypeAssertion"];

// ------------------------------------------------------------------------
// ZodUnknown
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const unknownSchema = z.unknown();
// 2. Manually define the expected output type
type UnknownType = unknown;
// 3. Convert the Zod Schema into TypeBox schema
const unknownTypeBox = TypeBox(unknownSchema);
// 4. Infer the type of the TypeBox type
type UnknownTypeBoxType = t.Static<typeof unknownTypeBox>;
// 5. Create a TS assertion
const unknownTypeAssertion: [
  AssertEquivalence<UnknownTypeBoxType, UnknownType, "UnknownTypeAssertion">
] = ["UnknownTypeAssertion"];

// ------------------------------------------------------------------------
// ZodVoid
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const voidSchema = z.void();
// 2. Manually define the expected output type
type VoidType = void;
// 3. Convert the Zod Schema into TypeBox schema
const voidTypeBox = TypeBox(voidSchema);
// 4. Infer the type of the TypeBox type
type VoidTypeBoxType = t.Static<typeof voidTypeBox>;
// 5. Create a TS assertion
const voidTypeAssertion: [
  AssertEquivalence<VoidTypeBoxType, VoidType, "VoidTypeAssertion">
] = ["VoidTypeAssertion"];

// ------------------------------------------------------------------------
// ZodIntersection
// ------------------------------------------------------------------------
// 1. Define a schema in Zod v4
const aSchema = z.object({ a: z.string() });
const bSchema = z.object({ b: z.number() });
const intersectionSchema = aSchema.and(bSchema);
// 2. Manually define the expected output type
type IntersectionType = {
  a: string;
} & {
  b: number;
};
// 3. Convert the Zod Schema into TypeBox schema
const intersectionTypeBox = TypeBox(intersectionSchema);
// 4. Infer the type of the TypeBox type
type IntersectionTypeBoxType = t.Static<typeof intersectionTypeBox>;
// 5. Create a TS assertion
const intersectionTypeAssertion: [
  AssertEquivalence<IntersectionTypeBoxType, IntersectionType, "IntersectionTypeAssertion">
] = ["IntersectionTypeAssertion"];

// ------------------------------------------------------------------------
// Complete Assertion Set
// ------------------------------------------------------------------------
const assertEquivalence: [
  typeof anyTypeAssertion[0],
  typeof arrayTypeAssertion[0],
  typeof bigIntTypeAssertion[0],
  typeof booleanTypeAssertion[0],
  typeof catchTypeAssertion[0],
//   typeof customTypeAssertion[0],
  typeof dateTypeAssertion[0],
  typeof defaultTypeAssertion[0],
  typeof discriminatedUnionTypeAssertion[0],
  typeof enumTypeAssertion[0],
//   typeof lazyTypeAssertion[0],
  typeof literalTypeAssertion[0],
//   typeof mapTypeAssertion[0],
//   typeof neverTypeAssertion[0],
  typeof nullTypeAssertion[0],
  typeof nullableTypeAssertion[0],
  typeof numberTypeAssertion[0],
  typeof objectTypeAssertion[0],
  typeof optionalTypeAssertion[0],
//   typeof pipeTypeAssertion[0],
  typeof promiseTypeAssertion[0],
  typeof recordTypeAssertion[0],
//   typeof setTypeAssertion[0],
  typeof stringTypeAssertion[0],
  typeof symbolTypeAssertion[0],
//   typeof templateLiteralTypeAssertion[0], // for now - so close!
  typeof tupleTypeAssertion[0],
  typeof undefinedTypeAssertion[0],
  typeof unionTypeAssertion[0],
  typeof unknownTypeAssertion[0],
  typeof voidTypeAssertion[0],
  typeof intersectionTypeAssertion[0]
] = [
  "AnyTypeAssertion",
  "ArrayTypeAssertion",
  "BigIntTypeAssertion",
  "BooleanTypeAssertion",
  "CatchTypeAssertion",
//   "CustomTypeAssertion",
  "DateTypeAssertion",
  "DefaultTypeAssertion",
  "DiscriminatedUnionTypeAssertion",
  "EnumTypeAssertion",
//   "LazyTypeAssertion",
  "LiteralTypeAssertion",
//   "MapTypeAssertion",
//   "NeverTypeAssertion",
  "NullTypeAssertion",
  "NullableTypeAssertion",
  "NumberTypeAssertion",
  "ObjectTypeAssertion",
  "OptionalTypeAssertion",
//   "PipeTypeAssertion",
  "PromiseTypeAssertion",
  "RecordTypeAssertion",
//   "SetTypeAssertion",
  "StringTypeAssertion",
  "SymbolTypeAssertion",
//   "TemplateLiteralTypeAssertion", // for now - so close!
  "TupleTypeAssertion",
  "UndefinedTypeAssertion",
  "UnionTypeAssertion",
  "UnknownTypeAssertion",
  "VoidTypeAssertion",
  "IntersectionTypeAssertion"
];

// All assertions should pass, otherwise TypeScript will throw an error
if (assertEquivalence.some(x => !x)) throw new Error("Type assertion failed");
