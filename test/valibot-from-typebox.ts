import { TypeBox, Valibot } from '@sinclair/typemap'
import { TypeGuard } from '@sinclair/typebox'
import { Assert } from './assert'
import * as t from '@sinclair/typebox'
import * as v from 'valibot'

describe('Valibot from TypeBox', () => {
  // ----------------------------------------------------------------
  // Metadata
  // ----------------------------------------------------------------
  it('Should map Description', () => {
    const T = TypeBox(Valibot(t.Number({ description: 'a number' })))
    Assert.IsEqual(T.description, 'a number')
  })
  it('Should map Title', () => {
    const T = TypeBox(Valibot(t.Number({ title: 'a number' })))
    Assert.IsEqual(T.title, 'a number')
  })
  it('Should map Metadata', () => {
    const T = TypeBox(Valibot(t.Number({ metadata: { x: 1, y: 2 } })))
    Assert.IsEqual(T.metadata.x, 1)
    Assert.IsEqual(T.metadata.y, 2)
  })
  // ----------------------------------------------------------------
  // Any
  // ----------------------------------------------------------------
  it('Should map Any', () => {
    const T = TypeBox(Valibot(t.Any()))
    Assert.IsTrue(TypeGuard.IsAny(T))
  })
  // ----------------------------------------------------------------
  // Array
  // ----------------------------------------------------------------
  it('Should map Array', () => {
    const T = TypeBox(Valibot(t.Array(t.Number())))
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  // ----------------------------------------------------------------
  // BigInt
  // ----------------------------------------------------------------
  it('Should map BigInt', () => {
    const T = TypeBox(Valibot(t.BigInt()))
    Assert.IsTrue(TypeGuard.IsBigInt(T))
  })
  // ----------------------------------------------------------------
  // Date
  // ----------------------------------------------------------------
  it('Should map Date', () => {
    const T = TypeBox(Valibot(t.Date()))
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
    const T = TypeBox(Valibot(t.Literal(42)))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 42)
  })
  it('Should map Literal (String)', () => {
    const T = TypeBox(Valibot(t.Literal('hello')))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  it('Should map Literal (Boolean)', () => {
    const T = TypeBox(Valibot(t.Literal(true)))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, true)
  })
  // ----------------------------------------------------------------
  // Nullable
  // ----------------------------------------------------------------
  it('Should map Nullable', () => {
    const T = TypeBox(Valibot(t.Union([t.Null(), t.Number()])))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsNull(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsNumber(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Object
  // ----------------------------------------------------------------
  it('Should map Object', () => {
    const T = TypeBox(
      Valibot(
        t.Object({
          x: t.Number(),
          y: t.String(),
        }),
      ),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsString(T.properties.y))
  })
  it('Should map Object (Strict)', () => {
    const T = TypeBox(
      Valibot(
        t.Object(
          {
            x: t.Number(),
            y: t.String(),
          },
          { additionalProperties: false },
        ),
      ),
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
      Valibot(
        t.Object({
          x: t.Optional(t.Number()),
          y: t.Optional(t.Number()),
        }),
      ),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
  })
  it('Should map Optional (Partial)', () => {
    const T = TypeBox(
      Valibot(
        t.Partial(
          t.Object({
            x: t.Optional(t.Number()),
            y: t.Optional(t.Number()),
          }),
        ),
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
    const T = TypeBox(Valibot(t.Promise(t.String())))
    Assert.IsEqual(T[t.Kind], 'ValibotPromise')
  })
  // ----------------------------------------------------------------
  // Record
  // ----------------------------------------------------------------
  it('Should map Record (String Key)', () => {
    const T = TypeBox(Valibot(t.Record(t.String(), t.Number())))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[t.PatternStringExact]))
  })
  it('Should map Record (Finite Union)', () => {
    const T = TypeBox(Valibot(t.Record(t.Union([t.Literal('x'), t.Literal('y')]), t.Number())))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Never
  // ----------------------------------------------------------------
  it('Should map Never', () => {
    const T = TypeBox(Valibot(t.Never()))
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  // ----------------------------------------------------------------
  // Null
  // ----------------------------------------------------------------
  it('Should map Null', () => {
    const T = TypeBox(Valibot(t.Null()))
    Assert.IsTrue(TypeGuard.IsNull(T))
  })
  // ----------------------------------------------------------------
  // Number
  // ----------------------------------------------------------------
  it('Should map Number', () => {
    const T = TypeBox(Valibot(t.Number()))
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  it('Should map Number (Integer)', () => {
    const T = TypeBox(Valibot(t.Integer())) // remap as Number + Modulo
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.multipleOf, 1)
  })
  it('Should map Number (Minimum)', () => {
    const T = TypeBox(Valibot(t.Number({ minimum: 100 })))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.minimum, 100)
  })
  it('Should map Number (Maximum)', () => {
    const T = TypeBox(Valibot(t.Number({ maximum: 100 })))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.maximum, 100)
  })
  // ----------------------------------------------------------------
  // String
  // ----------------------------------------------------------------
  it('Should map String', () => {
    const T = TypeBox(Valibot(t.String()))
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  it('Should map String (Base64)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'base64' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64')
  })
  it('Should map String (Bic)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'bic' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'bic')
  })
  it('Should map String (CreditCard)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'credit_card' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'credit_card')
  })
  it('Should map String (Cuid2)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'cuid2' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid2')
  })
  it('Should map String (Decimal)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'decimal' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'decimal')
  })
  it('Should map String (Digits)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'digits' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'digits')
  })
  it('Should map String (Email)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'email' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  it('Should map String (Emoji)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'emoji' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'emoji')
  })
  it('Should map String (EndsWith)', () => {
    const T = TypeBox(Valibot(t.String({ pattern: 'hello$' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello$')
  })
  it('Should map String (Includes)', () => {
    const T = TypeBox(Valibot(t.String({ pattern: 'hello' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello')
  })
  it('Should map String (Ipv4)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'ipv4' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv4')
  })
  it('Should map String (IpV6)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'ipv6' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv6')
  })
  it('Should map String (Ip)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'ip' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ip')
  })
  it('Should map String (IsoDate)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'iso_date' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_date')
  })
  it('Should map String (IsoDateTime)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'iso_date_time' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_date_time')
  })
  it('Should map String (IsoTime)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'iso_time' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_time')
  })
  it('Should map String (IsoTimeSecond)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'iso_time_second' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_time_second')
  })
  it('Should map String (IsoTimestamp)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'iso_timestamp' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_timestamp')
  })
  it('Should map String (IsoWeek)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'iso_week' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'iso_week')
  })
  it('Should map String (Mac48)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'mac48' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'mac48')
  })
  it('Should map String (Mac64)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'mac64' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'mac64')
  })
  it('Should map String (Mac)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'mac' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'mac')
  })
  it('Should map String (MaxLength)', () => {
    const T = TypeBox(Valibot(t.String({ maxLength: 100 })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 100)
  })
  it('Should map String (MinLength)', () => {
    const T = TypeBox(Valibot(t.String({ minLength: 100 })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
  })
  it('Should map String (Nanoid)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'nanoid' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'nanoid')
  })
  it('Should map String (Octal)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'octal' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'octal')
  })
  it('Should map String (RegExp)', () => {
    const T = TypeBox(Valibot(t.RegExp(/abc/)))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'abc')
  })
  it('Should map String (StartsWith)', () => {
    const T = TypeBox(Valibot(t.String({ pattern: '^hello' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, '^hello')
  })
  it('Should map String (Ulid)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'ulid' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ulid')
  })
  it('Should map String (Url)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'url' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'url')
  })
  it('Should map String (Uuid)', () => {
    const T = TypeBox(Valibot(t.String({ format: 'uuid' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'uuid')
  })
  // ----------------------------------------------------------------
  // Symbol
  // ----------------------------------------------------------------
  it('Should map Symbol', () => {
    const T = TypeBox(Valibot(t.Symbol()))
    Assert.IsTrue(TypeGuard.IsSymbol(T))
  })
  // ----------------------------------------------------------------
  // Tuple
  // ----------------------------------------------------------------
  it('Should map Tuple', () => {
    const T = TypeBox(Valibot(t.Tuple([t.Number(), t.String()])))
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
    Assert.IsTrue(TypeGuard.IsString(T.items![1]))
  })
  // ----------------------------------------------------------------
  // Undefined
  // ----------------------------------------------------------------
  it('Should map Undefined', () => {
    const T = TypeBox(Valibot(t.Undefined()))
    Assert.IsTrue(TypeGuard.IsUndefined(T))
  })
  // ----------------------------------------------------------------
  // Union
  // ----------------------------------------------------------------
  it('Should map Union', () => {
    const T = TypeBox(Valibot(t.Union([t.String(), t.Boolean()])))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsString(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsBoolean(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Unknown
  // ----------------------------------------------------------------
  it('Should map Unknown', () => {
    const T = TypeBox(Valibot(t.Unknown()))
    Assert.IsTrue(TypeGuard.IsUnknown(T))
  })
  // ----------------------------------------------------------------
  // Void
  // ----------------------------------------------------------------
  it('Should map Void', () => {
    const T = TypeBox(Valibot(t.Void()))
    Assert.IsTrue(TypeGuard.IsVoid(T))
  })
})
