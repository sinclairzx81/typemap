import { Box } from '@sinclair/typebox-remix'
import * as Types from '@sinclair/typebox'
import { TypeGuard } from '@sinclair/typebox'
import { Assert } from './assert'
import * as v from 'valibot'

describe('Valibot', () => {
  // ----------------------------------------------------------------
  // Metadata
  // ----------------------------------------------------------------
  it('Should map Description', () => {
    const T = Box(v.pipe(v.number(), v.description('a number')))
    Assert.IsEqual(T.description, 'a number')
  })
  it('Should map Title', () => {
    const T = Box(v.pipe(v.number(), v.title('a number')))
    Assert.IsEqual(T.title, 'a number')
  })
  it('Should map Metadata', () => {
    const T = Box(v.pipe(v.number(), v.metadata({ x: 1, y: 2 })))
    Assert.IsEqual(T.x, 1)
    Assert.IsEqual(T.y, 2)
  })
  // ----------------------------------------------------------------
  // Any
  // ----------------------------------------------------------------
  it('Should map Any', () => {
    const T = Box(v.any())
    Assert.IsTrue(TypeGuard.IsAny(T))
  })
  // ----------------------------------------------------------------
  // Array
  // ----------------------------------------------------------------
  it('Should map Array', () => {
    const T = Box(v.array(v.number()))
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  // ----------------------------------------------------------------
  // BigInt
  // ----------------------------------------------------------------
  it('Should map BigInt', () => {
    const T = Box(v.bigint())
    Assert.IsTrue(TypeGuard.IsBigInt(T))
  })
  // ----------------------------------------------------------------
  // Date
  // ----------------------------------------------------------------
  it('Should map Date', () => {
    const T = Box(v.date())
    Assert.IsTrue(TypeGuard.IsDate(T))
  })
  // ----------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------
  // it('Should map Effects (Transform)', () => {
  //   const T = Box(v.number().transform(x => x))
  //   Assert.IsTrue(TypeGuard.IsNumber(T))
  //   Assert.IsTrue(TypeGuard.IsTransform(T))
  // })
  // it('Should map Effects (Refine)', () => {
  //   const T = Box(v.number().refine(x => true))
  //   Assert.IsTrue(TypeGuard.IsNumber(T))
  //   Assert.IsTrue(TypeGuard.IsTransform(T))
  // })
  // ----------------------------------------------------------------
  // Literal
  // ----------------------------------------------------------------
  it('Should map Literal (Number)', () => {
    const T = Box(v.literal(42))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 42)
  })
  it('Should map Literal (String)', () => {
    const T = Box(v.literal('hello'))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  it('Should map Literal (Boolean)', () => {
    const T = Box(v.literal(true))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, true)
  })
  // ----------------------------------------------------------------
  // Nullable
  // ----------------------------------------------------------------
  it('Should map Nullable', () => {
    const T = Box(v.nullable(v.number()))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsNull(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsNumber(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Object
  // ----------------------------------------------------------------
  it('Should map Object', () => {
    const T = Box(
      v.object({
        x: v.number(),
        y: v.string(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsString(T.properties.y))
  })
  it('Should map Object (Strict)', () => {
    const T = Box(
      v.strictObject({
        x: v.number(),
        y: v.string(),
      }),
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
      v.object({
        x: v.optional(v.number()),
        y: v.optional(v.number()),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
  })
  it('Should map Optional (Partial)', () => {
    const T = Box(
      v.partial(
        v.object({
          x: v.number(),
          y: v.number(),
        }),
      ),
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
    const T = Box(v.promise())
    Assert.IsEqual(T[Types.Kind], 'ValibotPromise')
  })
  // ----------------------------------------------------------------
  // Record
  // ----------------------------------------------------------------
  it('Should map Record (String Key)', () => {
    const T = Box(v.record(v.string(), v.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[Types.PatternStringExact]))
  })
  it('Should map Record (Finite Union)', () => {
    const T = Box(v.record(v.union([v.literal('x'), v.literal('y')]), v.number()))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Never
  // ----------------------------------------------------------------
  it('Should map Never', () => {
    const T = Box(v.never())
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  // ----------------------------------------------------------------
  // Null
  // ----------------------------------------------------------------
  it('Should map Null', () => {
    const T = Box(v.null())
    Assert.IsTrue(TypeGuard.IsNull(T))
  })
  // ----------------------------------------------------------------
  // Number
  // ----------------------------------------------------------------
  it('Should map Number', () => {
    const T = Box(v.number())
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  it('Should map Number (Integer)', () => {
    const T = Box(v.pipe(v.number(), v.integer()))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.multipleOf, 1)
  })
  it('Should map Number (Minimum)', () => {
    const T = Box(v.pipe(v.number(), v.minValue(100)))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.minimum, 100)
  })
  it('Should map Number (Maximum)', () => {
    const T = Box(v.pipe(v.number(), v.maxValue(100)))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.maximum, 100)
  })
  // ----------------------------------------------------------------
  // String
  // ----------------------------------------------------------------
  it('Should map String', () => {
    const T = Box(v.string())
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  it('Should map String (Base64)', () => {
    const T = Box(v.pipe(v.string(), v.base64()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:base64')
  })
  it('Should map String (Bic)', () => {
    const T = Box(v.pipe(v.string(), v.bic()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:bic')
  })
  it('Should map String (CreditCard)', () => {
    const T = Box(v.pipe(v.string(), v.creditCard()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:credit_card')
  })
  it('Should map String (Cuid2)', () => {
    const T = Box(v.pipe(v.string(), v.cuid2()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:cuid2')
  })
  it('Should map String (Decimal)', () => {
    const T = Box(v.pipe(v.string(), v.decimal()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:decimal')
  })
  it('Should map String (Digits)', () => {
    const T = Box(v.pipe(v.string(), v.digits()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:digits')
  })
  it('Should map String (Email)', () => {
    const T = Box(v.pipe(v.string(), v.email()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:email')
  })
  it('Should map String (Emoji)', () => {
    const T = Box(v.pipe(v.string(), v.emoji()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:emoji')
  })
  it('Should map String (Empty)', () => {
    const T = Box(v.pipe(v.string(), v.empty()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 0)
  })
  it('Should map String (EndsWith)', () => {
    const T = Box(v.pipe(v.string(), v.endsWith('hello')))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello$')
  })
  it('Should map String (Includes)', () => {
    const T = Box(v.pipe(v.string(), v.includes('hello')))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello')
  })
  it('Should map String (Ipv4)', () => {
    const T = Box(v.pipe(v.string(), v.ipv4()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:ipv4')
  })
  it('Should map String (IpV6)', () => {
    const T = Box(v.pipe(v.string(), v.ipv6()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:ipv6')
  })
  it('Should map String (Ip)', () => {
    const T = Box(v.pipe(v.string(), v.ip()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:ip')
  })
  it('Should map String (IsoDate)', () => {
    const T = Box(v.pipe(v.string(), v.isoDate()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:iso_date')
  })
  it('Should map String (IsoDateTime)', () => {
    const T = Box(v.pipe(v.string(), v.isoDateTime()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:iso_date_time')
  })
  it('Should map String (IsoTime)', () => {
    const T = Box(v.pipe(v.string(), v.isoTime()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:iso_time')
  })
  it('Should map String (IsoTimeSecond)', () => {
    const T = Box(v.pipe(v.string(), v.isoTimeSecond()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:iso_time_second')
  })
  it('Should map String (IsoTimestamp)', () => {
    const T = Box(v.pipe(v.string(), v.isoTimestamp()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:iso_timestamp')
  })
  it('Should map String (IsoWeek)', () => {
    const T = Box(v.pipe(v.string(), v.isoWeek()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:iso_week')
  })
  it('Should map String (Length)', () => {
    const T = Box(v.pipe(v.string(), v.length(100)))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 100)
    Assert.IsEqual(T.minLength, 100)
  })
  it('Should map String (Mac48)', () => {
    const T = Box(v.pipe(v.string(), v.mac48()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:mac48')
  })
  it('Should map String (Mac64)', () => {
    const T = Box(v.pipe(v.string(), v.mac64()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:mac64')
  })
  it('Should map String (Mac)', () => {
    const T = Box(v.pipe(v.string(), v.mac()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:mac')
  })
  it('Should map String (MaxLength)', () => {
    const T = Box(v.pipe(v.string(), v.maxLength(100)))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 100)
  })
  it('Should map String (MinLength)', () => {
    const T = Box(v.pipe(v.string(), v.minLength(100)))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
  })
  it('Should map String (Nanoid)', () => {
    const T = Box(v.pipe(v.string(), v.nanoid()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:nanoid')
  })
  it('Should map String (Octal)', () => {
    const T = Box(v.pipe(v.string(), v.octal()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:octal')
  })
  it('Should map String (RegExp)', () => {
    const T = Box(v.pipe(v.string(), v.regex(/abc/)))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'abc')
  })
  it('Should map String (StartsWith)', () => {
    const T = Box(v.pipe(v.string(), v.startsWith('hello')))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, '^hello')
  })
  it('Should map String (Ulid)', () => {
    const T = Box(v.pipe(v.string(), v.ulid()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:ulid')
  })
  it('Should map String (Url)', () => {
    const T = Box(v.pipe(v.string(), v.url()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:url')
  })
  it('Should map String (Uuid)', () => {
    const T = Box(v.pipe(v.string(), v.uuid()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'valibot:uuid')
  })
  // ----------------------------------------------------------------
  // Symbol
  // ----------------------------------------------------------------
  it('Should map Symbol', () => {
    const T = Box(v.symbol())
    Assert.IsTrue(TypeGuard.IsSymbol(T))
  })
  // ----------------------------------------------------------------
  // Undefined
  // ----------------------------------------------------------------
  it('Should map Undefined', () => {
    const T = Box(v.undefined())
    Assert.IsTrue(TypeGuard.IsUndefined(T))
  })
  // ----------------------------------------------------------------
  // Union
  // ----------------------------------------------------------------
  it('Should map Union', () => {
    const T = Box(v.union([v.string(), v.boolean()]))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsString(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsBoolean(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Unknown
  // ----------------------------------------------------------------
  it('Should map Unknown', () => {
    const T = Box(v.unknown())
    Assert.IsTrue(TypeGuard.IsUnknown(T))
  })
  // ----------------------------------------------------------------
  // Void
  // ----------------------------------------------------------------
  it('Should map Void', () => {
    const T = Box(v.void())
    Assert.IsTrue(TypeGuard.IsVoid(T))
  })
})
