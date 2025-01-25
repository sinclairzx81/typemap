import { TypeBox } from '@sinclair/typemap'
import { TypeGuard } from '@sinclair/typebox'
import { Assert } from './assert'
import * as t from '@sinclair/typebox'
import * as v from 'valibot'

describe('TypeBox from Valibot', () => {
  // ----------------------------------------------------------------
  // Metadata
  // ----------------------------------------------------------------
  it('Should map Description', () => {
    const T = TypeBox(v.pipe(v.number(), v.description('a number')))
    Assert.IsEqual(T.description, 'a number')
  })
  it('Should map Title', () => {
    const T = TypeBox(v.pipe(v.number(), v.title('a number')))
    Assert.IsEqual(T.title, 'a number')
  })
  it('Should map Metadata', () => {
    const T = TypeBox(v.pipe(v.number(), v.metadata({ x: 1, y: 2 })))
    Assert.IsEqual(T.metadata.x, 1)
    Assert.IsEqual(T.metadata.y, 2)
  })
  // ----------------------------------------------------------------
  // Any
  // ----------------------------------------------------------------
  it('Should map Any', () => {
    const T = TypeBox(v.any())
    Assert.IsTrue(TypeGuard.IsAny(T))
  })
  // ----------------------------------------------------------------
  // Array
  // ----------------------------------------------------------------
  it('Should map Array', () => {
    const T = TypeBox(v.array(v.number()))
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  // ----------------------------------------------------------------
  // BigInt
  // ----------------------------------------------------------------
  it('Should map BigInt', () => {
    const T = TypeBox(v.bigint())
    Assert.IsTrue(TypeGuard.IsBigInt(T))
  })
  // ----------------------------------------------------------------
  // Date
  // ----------------------------------------------------------------
  it('Should map Date', () => {
    const T = TypeBox(v.date())
    Assert.IsTrue(TypeGuard.IsDate(T))
  })
  // ----------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------
  // it('Should map Effects (Transform)', () => {
  //   const T = TypeBox(v.number().transform(x => x))
  //   Assert.IsTrue(TypeGuard.IsNumber(T))
  //   Assert.IsTrue(TypeGuard.IsTransform(T))
  // })
  // it('Should map Effects (Refine)', () => {
  //   const T = TypeBox(v.number().refine(x => true))
  //   Assert.IsTrue(TypeGuard.IsNumber(T))
  //   Assert.IsTrue(TypeGuard.IsTransform(T))
  // })
  // ----------------------------------------------------------------
  // Literal
  // ----------------------------------------------------------------
  it('Should map Literal (Number)', () => {
    const T = TypeBox(v.literal(42))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 42)
  })
  it('Should map Literal (String)', () => {
    const T = TypeBox(v.literal('hello'))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  it('Should map Literal (Boolean)', () => {
    const T = TypeBox(v.literal(true))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, true)
  })
  // ----------------------------------------------------------------
  // Nullable
  // ----------------------------------------------------------------
  it('Should map Nullable', () => {
    const T = TypeBox(v.nullable(v.number()))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsNull(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsNumber(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Object
  // ----------------------------------------------------------------
  it('Should map Object', () => {
    const T = TypeBox(
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
    const T = TypeBox(
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
    const T = TypeBox(
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
    const T = TypeBox(
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
    const T = TypeBox(v.promise())
    Assert.IsEqual(T[t.Kind], 'ValibotPromise')
  })
  // ----------------------------------------------------------------
  // Record
  // ----------------------------------------------------------------
  it('Should map Record (String Key)', () => {
    const T = TypeBox(v.record(v.string(), v.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[t.PatternStringExact]))
  })
  it('Should map Record (Finite Union)', () => {
    const T = TypeBox(v.record(v.union([v.literal('x'), v.literal('y')]), v.number()))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Never
  // ----------------------------------------------------------------
  it('Should map Never', () => {
    const T = TypeBox(v.never())
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  // ----------------------------------------------------------------
  // Null
  // ----------------------------------------------------------------
  it('Should map Null', () => {
    const T = TypeBox(v.null())
    Assert.IsTrue(TypeGuard.IsNull(T))
  })
  // ----------------------------------------------------------------
  // Number
  // ----------------------------------------------------------------
  it('Should map Number', () => {
    const T = TypeBox(v.number())
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  it('Should map Number (Integer)', () => {
    const T = TypeBox(v.pipe(v.number(), v.integer()))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.multipleOf, 1)
  })
  it('Should map Number (Minimum)', () => {
    const T = TypeBox(v.pipe(v.number(), v.minValue(100)))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.minimum, 100)
  })
  it('Should map Number (Maximum)', () => {
    const T = TypeBox(v.pipe(v.number(), v.maxValue(100)))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.maximum, 100)
  })
  // ----------------------------------------------------------------
  // String
  // ----------------------------------------------------------------
  it('Should map String', () => {
    const T = TypeBox(v.string())
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  it('Should map String (Base64)', () => {
    const T = TypeBox(v.pipe(v.string(), v.base64()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64')
  })
  it('Should map String (Bic)', () => {
    const T = TypeBox(v.pipe(v.string(), v.bic()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'bic')
  })
  it('Should map String (CreditCard)', () => {
    const T = TypeBox(v.pipe(v.string(), v.creditCard()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'credit_card')
  })
  it('Should map String (Cuid2)', () => {
    const T = TypeBox(v.pipe(v.string(), v.cuid2()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid2')
  })
  it('Should map String (Decimal)', () => {
    const T = TypeBox(v.pipe(v.string(), v.decimal()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'decimal')
  })
  it('Should map String (Digits)', () => {
    const T = TypeBox(v.pipe(v.string(), v.digits()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'digits')
  })
  it('Should map String (Email)', () => {
    const T = TypeBox(v.pipe(v.string(), v.email()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  it('Should map String (Emoji)', () => {
    const T = TypeBox(v.pipe(v.string(), v.emoji()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'emoji')
  })
  it('Should map String (Empty)', () => {
    const T = TypeBox(v.pipe(v.string(), v.empty()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 0)
  })
  it('Should map String (EndsWith)', () => {
    const T = TypeBox(v.pipe(v.string(), v.endsWith('hello')))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello$')
  })
  it('Should map String (Includes)', () => {
    const T = TypeBox(v.pipe(v.string(), v.includes('hello')))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello')
  })
  it('Should map String (Ipv4)', () => {
    const T = TypeBox(v.pipe(v.string(), v.ipv4()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv4')
  })
  it('Should map String (IpV6)', () => {
    const T = TypeBox(v.pipe(v.string(), v.ipv6()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv6')
  })
  it('Should map String (Ip)', () => {
    const T = TypeBox(v.pipe(v.string(), v.ip()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ip')
  })
  it('Should map String (IsoDate)', () => {
    const T = TypeBox(v.pipe(v.string(), v.isoDate()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_date')
  })
  it('Should map String (IsoDateTime)', () => {
    const T = TypeBox(v.pipe(v.string(), v.isoDateTime()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_date_time')
  })
  it('Should map String (IsoTime)', () => {
    const T = TypeBox(v.pipe(v.string(), v.isoTime()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_time')
  })
  it('Should map String (IsoTimeSecond)', () => {
    const T = TypeBox(v.pipe(v.string(), v.isoTimeSecond()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_time_second')
  })
  it('Should map String (IsoTimestamp)', () => {
    const T = TypeBox(v.pipe(v.string(), v.isoTimestamp()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_timestamp')
  })
  it('Should map String (IsoWeek)', () => {
    const T = TypeBox(v.pipe(v.string(), v.isoWeek()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_week')
  })
  it('Should map String (Length)', () => {
    const T = TypeBox(v.pipe(v.string(), v.length(100)))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 100)
    Assert.IsEqual(T.minLength, 100)
  })
  it('Should map String (Mac48)', () => {
    const T = TypeBox(v.pipe(v.string(), v.mac48()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'mac48')
  })
  it('Should map String (Mac64)', () => {
    const T = TypeBox(v.pipe(v.string(), v.mac64()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'mac64')
  })
  it('Should map String (Mac)', () => {
    const T = TypeBox(v.pipe(v.string(), v.mac()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'mac')
  })
  it('Should map String (MaxLength)', () => {
    const T = TypeBox(v.pipe(v.string(), v.maxLength(100)))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 100)
  })
  it('Should map String (MinLength)', () => {
    const T = TypeBox(v.pipe(v.string(), v.minLength(100)))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
  })
  it('Should map String (Nanoid)', () => {
    const T = TypeBox(v.pipe(v.string(), v.nanoid()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'nanoid')
  })
  it('Should map String (Octal)', () => {
    const T = TypeBox(v.pipe(v.string(), v.octal()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'octal')
  })
  it('Should map String (RegExp)', () => {
    const T = TypeBox(v.pipe(v.string(), v.regex(/abc/)))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'abc')
  })
  it('Should map String (StartsWith)', () => {
    const T = TypeBox(v.pipe(v.string(), v.startsWith('hello')))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, '^hello')
  })
  it('Should map String (Ulid)', () => {
    const T = TypeBox(v.pipe(v.string(), v.ulid()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ulid')
  })
  it('Should map String (Url)', () => {
    const T = TypeBox(v.pipe(v.string(), v.url()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'url')
  })
  it('Should map String (Uuid)', () => {
    const T = TypeBox(v.pipe(v.string(), v.uuid()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'uuid')
  })
  // ----------------------------------------------------------------
  // Symbol
  // ----------------------------------------------------------------
  it('Should map Symbol', () => {
    const T = TypeBox(v.symbol())
    Assert.IsTrue(TypeGuard.IsSymbol(T))
  })
  // ----------------------------------------------------------------
  // Tuple
  // ----------------------------------------------------------------
  it('Should map Tuple', () => {
    const T = TypeBox(v.tuple([v.number(), v.string()]))
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
    Assert.IsTrue(TypeGuard.IsString(T.items![1]))
  })
  // ----------------------------------------------------------------
  // Undefined
  // ----------------------------------------------------------------
  it('Should map Undefined', () => {
    const T = TypeBox(v.undefined())
    Assert.IsTrue(TypeGuard.IsUndefined(T))
  })
  // ----------------------------------------------------------------
  // Union
  // ----------------------------------------------------------------
  it('Should map Union', () => {
    const T = TypeBox(v.union([v.string(), v.boolean()]))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsString(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsBoolean(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Unknown
  // ----------------------------------------------------------------
  it('Should map Unknown', () => {
    const T = TypeBox(v.unknown())
    Assert.IsTrue(TypeGuard.IsUnknown(T))
  })
  // ----------------------------------------------------------------
  // Void
  // ----------------------------------------------------------------
  it('Should map Void', () => {
    const T = TypeBox(v.void())
    Assert.IsTrue(TypeGuard.IsVoid(T))
  })
})
