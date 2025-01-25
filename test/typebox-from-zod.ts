import { TypeBox } from '@sinclair/typemap'
import { TypeGuard } from '@sinclair/typebox'
import { Assert } from './assert'
import * as t from '@sinclair/typebox'
import * as z from 'zod'

describe('TypeBox From Zod', () => {
  // ----------------------------------------------------------------
  // Metadata
  // ----------------------------------------------------------------
  it('Should map Description', () => {
    const T = TypeBox(z.number().describe('a number'))
    Assert.IsEqual(T.description, 'a number')
  })
  it('Should map Default', () => {
    const T = TypeBox(z.number().default(12345))
    Assert.IsEqual(T.default, 12345)
  })
  // ----------------------------------------------------------------
  // Any
  // ----------------------------------------------------------------
  it('Should map Any', () => {
    const T = TypeBox(z.any())
    Assert.IsTrue(TypeGuard.IsAny(T))
  })
  // ----------------------------------------------------------------
  // Array
  // ----------------------------------------------------------------
  it('Should map Array', () => {
    const T = TypeBox(z.array(z.number()))
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  // ----------------------------------------------------------------
  // BigInt
  // ----------------------------------------------------------------
  it('Should map BigInt', () => {
    const T = TypeBox(z.bigint())
    Assert.IsTrue(TypeGuard.IsBigInt(T))
  })
  // ----------------------------------------------------------------
  // Date
  // ----------------------------------------------------------------
  it('Should map Date', () => {
    const T = TypeBox(z.date())
    Assert.IsTrue(TypeGuard.IsDate(T))
  })
  // ----------------------------------------------------------------
  // DiscriminatedUnion
  // ----------------------------------------------------------------
  it('Should map DiscriminatedUnion', () => {
    const A = z.object({ type: z.literal('A') })
    const B = z.object({ type: z.literal('B') })
    const C = z.object({ type: z.literal('C') })
    const T = TypeBox(z.discriminatedUnion('type', [A, B, C]))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsEqual(T.discriminator, 'type')
    Assert.IsTrue(T.anyOf[0].properties.type.const === 'A')
    Assert.IsTrue(T.anyOf[1].properties.type.const === 'B')
    Assert.IsTrue(T.anyOf[2].properties.type.const === 'C')
  })
  // ----------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------
  it('Should map Effects (Transform)', () => {
    const T = TypeBox(z.number().transform((x) => x))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsTrue(TypeGuard.IsTransform(T))
  })
  it('Should map Effects (Refine)', () => {
    const T = TypeBox(z.number().refine((x) => true))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsTrue(TypeGuard.IsTransform(T))
  })
  // ----------------------------------------------------------------
  // Enum
  // ----------------------------------------------------------------
  it('Should map Enum', () => {
    const T = TypeBox(z.enum(['a', 'b', 'c']))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'a')
    Assert.IsEqual(T.anyOf[1].const, 'b')
    Assert.IsEqual(T.anyOf[2].const, 'c')
  })
  // ----------------------------------------------------------------
  // Literal
  // ----------------------------------------------------------------
  it('Should map Literal (Number)', () => {
    const T = TypeBox(z.literal(42))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 42)
  })
  it('Should map Literal (String)', () => {
    const T = TypeBox(z.literal('hello'))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  it('Should map Literal (Boolean)', () => {
    const T = TypeBox(z.literal(true))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, true)
  })
  // ----------------------------------------------------------------
  // Nullable
  // ----------------------------------------------------------------
  it('Should map Nullable', () => {
    const T = TypeBox(z.number().nullable())
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsNull(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsNumber(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Object
  // ----------------------------------------------------------------
  it('Should map Object', () => {
    const T = TypeBox(
      z.object({
        x: z.number(),
        y: z.string(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsString(T.properties.y))
  })
  it('Should map Object (Strict)', () => {
    const T = TypeBox(
      z
        .object({
          x: z.number(),
          y: z.string(),
        })
        .strict(),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsString(T.properties.y))
    Assert.IsEqual(T.additionalProperties, false)
  })
  // ----------------------------------------------------------------
  // Optional
  // ----------------------------------------------------------------
  it('Should map Optional', () => {
    const T = TypeBox(
      z.object({
        x: z.number().optional(),
        y: z.number().optional(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
  })
  it('Should map Optional (Readonly)', () => {
    const T = TypeBox(
      z.object({
        x: z.number().optional().readonly(),
        y: z.number().optional().readonly(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.y))
  })
  it('Should map Optional (Partial)', () => {
    const T = TypeBox(
      z
        .object({
          x: z.number(),
          y: z.number(),
        })
        .partial(),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Promise
  // ----------------------------------------------------------------
  it('Should map Promise', () => {
    const T = TypeBox(z.promise(z.number()))
    Assert.IsTrue(TypeGuard.IsPromise(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.item))
  })
  // ----------------------------------------------------------------
  // Readonly
  // ----------------------------------------------------------------
  it('Should map Readonly', () => {
    const T = TypeBox(
      z.object({
        x: z.number().readonly(),
        y: z.number().readonly(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.y))
  })
  it('Should map Readonly (Optional)', () => {
    const T = TypeBox(
      z.object({
        x: z.number().readonly().optional(),
        y: z.number().readonly().optional(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Record
  // ----------------------------------------------------------------
  it('Should map Record (Key Implicit)', () => {
    const T = TypeBox(z.record(z.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[t.PatternStringExact]))
  })
  it('Should map Record (Number Key)', () => {
    const T = TypeBox(z.record(z.number(), z.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[t.PatternNumberExact]))
  })
  it('Should map Record (String Key)', () => {
    const T = TypeBox(z.record(z.string(), z.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[t.PatternStringExact]))
  })
  it('Should map Record (Finite Union)', () => {
    const T = TypeBox(z.record(z.union([z.literal('x'), z.literal('y')]), z.number()))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Never
  // ----------------------------------------------------------------
  it('Should map Never', () => {
    const T = TypeBox(z.never())
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  // ----------------------------------------------------------------
  // Null
  // ----------------------------------------------------------------
  it('Should map Null', () => {
    const T = TypeBox(z.null())
    Assert.IsTrue(TypeGuard.IsNull(T))
  })
  // ----------------------------------------------------------------
  // Number
  // ----------------------------------------------------------------
  it('Should map Number', () => {
    const T = TypeBox(z.number())
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  it('Should map Number (Integer)', () => {
    const T = TypeBox(z.number().int())
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.multipleOf, 1)
  })
  it('Should map Number (Minimum)', () => {
    const T = TypeBox(z.number().min(100))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.minimum, 100)
  })
  it('Should map Number (Maximum)', () => {
    const T = TypeBox(z.number().max(100))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.maximum, 100)
  })
  // ----------------------------------------------------------------
  // String
  // ----------------------------------------------------------------
  it('Should map String', () => {
    const T = TypeBox(z.string())
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  it('Should map String (Base64)', () => {
    const T = TypeBox(z.string().base64())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64')
  })
  it('Should map String (Base64Url)', () => {
    const T = TypeBox(z.string().base64url())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64url')
  })
  it('Should map String (Cidr V4)', () => {
    const T = TypeBox(z.string().cidr({ version: 'v4' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cidrv4')
  })
  it('Should map String (Cidr v6)', () => {
    const T = TypeBox(z.string().cidr({ version: 'v6' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cidrv6')
  })
  it('Should map String (Cidr)', () => {
    const T = TypeBox(z.string().cidr())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cidr')
  })
  it('Should map String (Cuid)', () => {
    const T = TypeBox(z.string().cuid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid')
  })
  it('Should map String (Cuid2)', () => {
    const T = TypeBox(z.string().cuid2())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid2')
  })
  it('Should map String (Ulid)', () => {
    const T = TypeBox(z.string().ulid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ulid')
  })
  it('Should map String (Email)', () => {
    const T = TypeBox(z.string().email())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  it('Should map String (Emoji)', () => {
    const T = TypeBox(z.string().emoji())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'emoji')
  })
  it('Should map String (EndsWith)', () => {
    const T = TypeBox(z.string().endsWith('hello'))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello$')
  })
  it('Should map String (Includes)', () => {
    const T = TypeBox(z.string().includes('hello'))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello')
  })
  it('Should map String (IpV4)', () => {
    const T = TypeBox(z.string().ip({ version: 'v4' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv4')
  })
  it('Should map String (IpV6)', () => {
    const T = TypeBox(z.string().ip({ version: 'v6' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv6')
  })
  it('Should map String (Ip)', () => {
    const T = TypeBox(z.string().ip())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ip')
  })
  it('Should map String (Jwt)', () => {
    const T = TypeBox(z.string().jwt())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'jwt')
  })
  it('Should map String (Length)', () => {
    const T = TypeBox(z.string().length(100))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
    Assert.IsEqual(T.maxLength, 100)
  })

  it('Should map String (Min)', () => {
    const T = TypeBox(z.string().min(100))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
  })
  it('Should map String (Max)', () => {
    const T = TypeBox(z.string().max(100))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 100)
  })
  it('Should map String (Nanoid)', () => {
    const T = TypeBox(z.string().nanoid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'nanoid')
  })
  it('Should map String (RegExp)', () => {
    const T = TypeBox(z.string().regex(/abc/))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'abc')
  })
  it('Should map String (StartsWith)', () => {
    const T = TypeBox(z.string().startsWith('hello'))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, '^hello')
  })
  it('Should map String (Time)', () => {
    const T = TypeBox(z.string().time())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'time')
  })
  it('Should map String (Ulid)', () => {
    const T = TypeBox(z.string().ulid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ulid')
  })
  it('Should map String (Url)', () => {
    const T = TypeBox(z.string().url())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'url')
  })
  it('Should map String (Uuid)', () => {
    const T = TypeBox(z.string().uuid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'uuid')
  })
  // ----------------------------------------------------------------
  // Symbol
  // ----------------------------------------------------------------
  it('Should map Symbol', () => {
    const T = TypeBox(z.symbol())
    Assert.IsTrue(TypeGuard.IsSymbol(T))
  })
  // ----------------------------------------------------------------
  // Tuple
  // ----------------------------------------------------------------
  it('Should map Tuple', () => {
    const T = TypeBox(z.tuple([z.number(), z.string()]))
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
    Assert.IsTrue(TypeGuard.IsString(T.items![1]))
  })
  // ----------------------------------------------------------------
  // Undefined
  // ----------------------------------------------------------------
  it('Should map Undefined', () => {
    const T = TypeBox(z.undefined())
    Assert.IsTrue(TypeGuard.IsUndefined(T))
  })
  // ----------------------------------------------------------------
  // Union
  // ----------------------------------------------------------------
  it('Should map Union', () => {
    const T = TypeBox(z.union([z.string(), z.boolean()]))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsString(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsBoolean(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Unknown
  // ----------------------------------------------------------------
  it('Should map Unknown', () => {
    const T = TypeBox(z.unknown())
    Assert.IsTrue(TypeGuard.IsUnknown(T))
  })
  // ----------------------------------------------------------------
  // Void
  // ----------------------------------------------------------------
  it('Should map Void', () => {
    const T = TypeBox(z.void())
    Assert.IsTrue(TypeGuard.IsVoid(T))
  })
})
