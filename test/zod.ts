import { Box } from '@sinclair/typebox-remix'
import * as Types from '@sinclair/typebox'
import { TypeGuard } from '@sinclair/typebox'
import { Assert } from './assert'
import * as z from 'zod'

describe('Zod', () => {
  // ----------------------------------------------------------------
  // Metadata
  // ----------------------------------------------------------------
  it('Should map Description', () => {
    const T = Box(z.number().describe('a number'))
    Assert.IsEqual(T.description, 'a number')
  })
  it('Should map Default', () => {
    const T = Box(z.number().default(12345))
    Assert.IsEqual(T.default, 12345)
  })
  // ----------------------------------------------------------------
  // Any
  // ----------------------------------------------------------------
  it('Should map Any', () => {
    const T = Box(z.any())
    Assert.IsTrue(TypeGuard.IsAny(T))
  })
  // ----------------------------------------------------------------
  // Array
  // ----------------------------------------------------------------
  it('Should map Array', () => {
    const T = Box(z.array(z.number()))
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  // ----------------------------------------------------------------
  // BigInt
  // ----------------------------------------------------------------
  it('Should map BigInt', () => {
    const T = Box(z.bigint())
    Assert.IsTrue(TypeGuard.IsBigInt(T))
  })
  // ----------------------------------------------------------------
  // Date
  // ----------------------------------------------------------------
  it('Should map Date', () => {
    const T = Box(z.date())
    Assert.IsTrue(TypeGuard.IsDate(T))
  })
  // ----------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------
  it('Should map Effects (Transform)', () => {
    const T = Box(z.number().transform((x) => x))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsTrue(TypeGuard.IsTransform(T))
  })
  it('Should map Effects (Refine)', () => {
    const T = Box(z.number().refine((x) => true))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsTrue(TypeGuard.IsTransform(T))
  })
  // ----------------------------------------------------------------
  // Literal
  // ----------------------------------------------------------------
  it('Should map Literal (Number)', () => {
    const T = Box(z.literal(42))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 42)
  })
  it('Should map Literal (String)', () => {
    const T = Box(z.literal('hello'))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  it('Should map Literal (Boolean)', () => {
    const T = Box(z.literal(true))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, true)
  })
  // ----------------------------------------------------------------
  // Nullable
  // ----------------------------------------------------------------
  it('Should map Nullable', () => {
    const T = Box(z.number().nullable())
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsNull(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsNumber(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Object
  // ----------------------------------------------------------------
  it('Should map Object', () => {
    const T = Box(
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
    const T = Box(
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
    const T = Box(
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
    const T = Box(
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
    const T = Box(
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
    const T = Box(z.promise(z.number()))
    Assert.IsTrue(TypeGuard.IsPromise(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.item))
  })
  // ----------------------------------------------------------------
  // Readonly
  // ----------------------------------------------------------------
  it('Should map Readonly', () => {
    const T = Box(
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
    const T = Box(
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
    const T = Box(z.record(z.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[Types.PatternStringExact]))
  })
  it('Should map Record (Number Key)', () => {
    const T = Box(z.record(z.number(), z.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[Types.PatternNumberExact]))
  })
  it('Should map Record (String Key)', () => {
    const T = Box(z.record(z.string(), z.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[Types.PatternStringExact]))
  })
  it('Should map Record (Finite Union)', () => {
    const T = Box(z.record(z.union([z.literal('x'), z.literal('y')]), z.number()))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Never
  // ----------------------------------------------------------------
  it('Should map Never', () => {
    const T = Box(z.never())
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  // ----------------------------------------------------------------
  // Null
  // ----------------------------------------------------------------
  it('Should map Null', () => {
    const T = Box(z.null())
    Assert.IsTrue(TypeGuard.IsNull(T))
  })
  // ----------------------------------------------------------------
  // Number
  // ----------------------------------------------------------------
  it('Should map Number', () => {
    const T = Box(z.number())
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  it('Should map Number (Integer)', () => {
    const T = Box(z.number().int())
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.multipleOf, 1)
  })
  it('Should map Number (Minimum)', () => {
    const T = Box(z.number().min(100))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.minimum, 100)
  })
  it('Should map Number (Maximum)', () => {
    const T = Box(z.number().max(100))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.maximum, 100)
  })
  // ----------------------------------------------------------------
  // String
  // ----------------------------------------------------------------
  it('Should map String', () => {
    const T = Box(z.string())
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  it('Should map String (Base64)', () => {
    const T = Box(z.string().base64())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:base64')
  })
  it('Should map String (Base64Url)', () => {
    const T = Box(z.string().base64url())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:base64url')
  })
  it('Should map String (Cidr V4)', () => {
    const T = Box(z.string().cidr({ version: 'v4' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:cidrv4')
  })
  it('Should map String (Cidr v6)', () => {
    const T = Box(z.string().cidr({ version: 'v6' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:cidrv6')
  })
  it('Should map String (Cidr)', () => {
    const T = Box(z.string().cidr())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:cidr')
  })
  it('Should map String (Cuid)', () => {
    const T = Box(z.string().cuid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:cuid')
  })
  it('Should map String (Cuid2)', () => {
    const T = Box(z.string().cuid2())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:cuid2')
  })
  it('Should map String (Ulid)', () => {
    const T = Box(z.string().ulid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:ulid')
  })
  it('Should map String (Email)', () => {
    const T = Box(z.string().email())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:email')
  })
  it('Should map String (Emoji)', () => {
    const T = Box(z.string().emoji())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:emoji')
  })
  it('Should map String (EndsWith)', () => {
    const T = Box(z.string().endsWith('hello'))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello$')
  })
  it('Should map String (Includes)', () => {
    const T = Box(z.string().includes('hello'))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello')
  })
  it('Should map String (IpV4)', () => {
    const T = Box(z.string().ip({ version: 'v4' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:ipv4')
  })
  it('Should map String (IpV6)', () => {
    const T = Box(z.string().ip({ version: 'v6' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:ipv6')
  })
  it('Should map String (Ip)', () => {
    const T = Box(z.string().ip())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:ip')
  })
  it('Should map String (Jwt)', () => {
    const T = Box(z.string().jwt())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:jwt')
  })
  it('Should map String (Length)', () => {
    const T = Box(z.string().length(100))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
    Assert.IsEqual(T.maxLength, 100)
  })

  it('Should map String (Min)', () => {
    const T = Box(z.string().min(100))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
  })
  it('Should map String (Max)', () => {
    const T = Box(z.string().max(100))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 100)
  })
  it('Should map String (Nanoid)', () => {
    const T = Box(z.string().nanoid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:nanoid')
  })
  it('Should map String (RegExp)', () => {
    const T = Box(z.string().regex(/abc/))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'abc')
  })
  it('Should map String (StartsWith)', () => {
    const T = Box(z.string().startsWith('hello'))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, '^hello')
  })
  it('Should map String (Time)', () => {
    const T = Box(z.string().time())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:time')
  })
  it('Should map String (Ulid)', () => {
    const T = Box(z.string().ulid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:ulid')
  })
  it('Should map String (Url)', () => {
    const T = Box(z.string().url())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:url')
  })
  it('Should map String (Uuid)', () => {
    const T = Box(z.string().uuid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'zod:uuid')
  })
  // ----------------------------------------------------------------
  // Symbol
  // ----------------------------------------------------------------
  it('Should map Symbol', () => {
    const T = Box(z.symbol())
    Assert.IsTrue(TypeGuard.IsSymbol(T))
  })
  // ----------------------------------------------------------------
  // Tuple
  // ----------------------------------------------------------------
  it('Should map Tuple', () => {
    const T = Box(z.tuple([z.number(), z.string()]))
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
    Assert.IsTrue(TypeGuard.IsString(T.items![1]))
  })
  // ----------------------------------------------------------------
  // Undefined
  // ----------------------------------------------------------------
  it('Should map Undefined', () => {
    const T = Box(z.undefined())
    Assert.IsTrue(TypeGuard.IsUndefined(T))
  })
  // ----------------------------------------------------------------
  // Union
  // ----------------------------------------------------------------
  it('Should map Union', () => {
    const T = Box(z.union([z.string(), z.boolean()]))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsString(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsBoolean(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Unknown
  // ----------------------------------------------------------------
  it('Should map Unknown', () => {
    const T = Box(z.unknown())
    Assert.IsTrue(TypeGuard.IsUnknown(T))
  })
  // ----------------------------------------------------------------
  // Void
  // ----------------------------------------------------------------
  it('Should map Void', () => {
    const T = Box(z.void())
    Assert.IsTrue(TypeGuard.IsVoid(T))
  })
})
