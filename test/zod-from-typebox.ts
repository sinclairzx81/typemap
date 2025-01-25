import { TypeBox, Zod } from '@sinclair/typemap'
import { TypeGuard } from '@sinclair/typebox'
import { Assert } from './assert'
import * as t from '@sinclair/typebox'
import * as z from 'zod'

describe('Zod From TypeBox', () => {
  // ----------------------------------------------------------------
  // Metadata
  // ----------------------------------------------------------------
  it('Should map Description', () => {
    const T = TypeBox(Zod(t.Number({ description: 'a number' })))
    Assert.IsEqual(T.description, 'a number')
  })
  it('Should map Default', () => {
    const T = TypeBox(Zod(t.Number({ default: 12345 })))
    Assert.IsEqual(T.default, 12345)
  })
  // ----------------------------------------------------------------
  // Any
  // ----------------------------------------------------------------
  it('Should map Any', () => {
    const T = TypeBox(Zod(t.Any()))
    Assert.IsTrue(TypeGuard.IsAny(T))
  })
  // ----------------------------------------------------------------
  // Array
  // ----------------------------------------------------------------
  it('Should map Array', () => {
    const T = TypeBox(Zod(t.Array(t.Number())))
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  // ----------------------------------------------------------------
  // BigInt
  // ----------------------------------------------------------------
  it('Should map BigInt', () => {
    const T = TypeBox(Zod(t.BigInt()))
    Assert.IsTrue(TypeGuard.IsBigInt(T))
  })
  // ----------------------------------------------------------------
  // Date
  // ----------------------------------------------------------------
  it('Should map Date', () => {
    const T = TypeBox(Zod(t.Date()))
    Assert.IsTrue(TypeGuard.IsDate(T))
  })
  // ----------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------
  // it('Should map Effects (Transform)', () => {
  //   const T = TypeBox(z.number().transform((x) => x))
  //   Assert.IsTrue(TypeGuard.IsNumber(T))
  //   Assert.IsTrue(TypeGuard.IsTransform(T))
  // })
  // it('Should map Effects (Refine)', () => {
  //   const T = TypeBox(z.number().refine((x) => true))
  //   Assert.IsTrue(TypeGuard.IsNumber(T))
  //   Assert.IsTrue(TypeGuard.IsTransform(T))
  // })
  // ----------------------------------------------------------------
  // Literal
  // ----------------------------------------------------------------
  it('Should map Literal (Number)', () => {
    const T = TypeBox(Zod(t.Literal(42)))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 42)
  })
  it('Should map Literal (String)', () => {
    const T = TypeBox(Zod(t.Literal('hello')))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  it('Should map Literal (Boolean)', () => {
    const T = TypeBox(Zod(t.Literal(true)))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, true)
  })
  // ----------------------------------------------------------------
  // Object
  // ----------------------------------------------------------------
  it('Should map Object', () => {
    const T = TypeBox(
      Zod(
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
      Zod(
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
      Zod(
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
  it('Should map Optional (Readonly)', () => {
    const T = TypeBox(
      Zod(
        t.Object({
          x: t.ReadonlyOptional(t.Number()),
          y: t.ReadonlyOptional(t.Number()),
        }),
      ),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsFalse(TypeGuard.IsReadonly(T.properties.x)) // Cannot Map for Readonly in Zod
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
    Assert.IsFalse(TypeGuard.IsReadonly(T.properties.y)) // Cannot Map for Readonly in Zod
  })
  it('Should map Optional (Partial)', () => {
    const T = TypeBox(
      Zod(
        t.Partial(
          t.Object({
            x: t.Number(),
            y: t.Number(),
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
    const T = TypeBox(Zod(t.Promise(t.Number())))
    Assert.IsTrue(TypeGuard.IsPromise(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.item))
  })
  // ----------------------------------------------------------------
  // Readonly
  // ----------------------------------------------------------------
  it('Should map Readonly', () => {
    const T = TypeBox(
      Zod(
        t.Object({
          x: t.Readonly(t.Number()),
          y: t.Readonly(t.Number()),
        }),
      ),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsFalse(TypeGuard.IsReadonly(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsFalse(TypeGuard.IsReadonly(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Record
  // ----------------------------------------------------------------
  it('Should map Record (Number Key)', () => {
    const T = TypeBox(Zod(t.Record(t.Number(), t.Number())))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[t.PatternNumberExact]))
  })
  it('Should map Record (String Key)', () => {
    const T = TypeBox(Zod(t.Record(t.String(), t.Number())))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[t.PatternStringExact]))
  })
  it('Should map Record (Finite Union)', () => {
    const T = TypeBox(Zod(t.Record(t.Union([t.Literal('x'), t.Literal('y')]), t.Number())))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Never
  // ----------------------------------------------------------------
  it('Should map Never', () => {
    const T = TypeBox(Zod(t.Never()))
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  // ----------------------------------------------------------------
  // Null
  // ----------------------------------------------------------------
  it('Should map Null', () => {
    const T = TypeBox(Zod(t.Null()))
    Assert.IsTrue(TypeGuard.IsNull(T))
  })
  // ----------------------------------------------------------------
  // Number
  // ----------------------------------------------------------------
  it('Should map Number', () => {
    const T = TypeBox(Zod(t.Number()))
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  it('Should map Number (Integer)', () => {
    const T = TypeBox(Zod(t.Integer()))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.multipleOf, 1)
  })
  it('Should map Number (Minimum)', () => {
    const T = TypeBox(Zod(t.Number({ minimum: 100 })))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.minimum, 100)
  })
  it('Should map Number (Maximum)', () => {
    const T = TypeBox(Zod(t.Number({ maximum: 100 })))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.maximum, 100)
  })
  // ----------------------------------------------------------------
  // String
  // ----------------------------------------------------------------
  it('Should map String', () => {
    const T = TypeBox(Zod(t.String()))
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  it('Should map String (Base64)', () => {
    const T = TypeBox(Zod(t.String({ format: 'base64' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64')
  })
  it('Should map String (Base64Url)', () => {
    const T = TypeBox(Zod(t.String({ format: 'base64url' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64url')
  })
  it('Should map String (Cidr V4)', () => {
    const T = TypeBox(Zod(t.String({ format: 'cidrv4' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cidrv4')
  })
  it('Should map String (Cidr v6)', () => {
    const T = TypeBox(Zod(t.String({ format: 'cidrv6' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cidrv6')
  })
  it('Should map String (Cidr)', () => {
    const T = TypeBox(Zod(t.String({ format: 'cidr' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cidr')
  })
  it('Should map String (Cuid)', () => {
    const T = TypeBox(Zod(t.String({ format: 'cuid' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid')
  })
  it('Should map String (Cuid2)', () => {
    const T = TypeBox(Zod(t.String({ format: 'cuid2' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid2')
  })
  it('Should map String (Ulid)', () => {
    const T = TypeBox(Zod(t.String({ format: 'ulid' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ulid')
  })
  it('Should map String (Email)', () => {
    const T = TypeBox(Zod(t.String({ format: 'email' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  it('Should map String (Emoji)', () => {
    const T = TypeBox(Zod(t.String({ format: 'emoji' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'emoji')
  })
  it('Should map String (EndsWith)', () => {
    const T = TypeBox(Zod(t.String({ pattern: 'hello$' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello$')
  })
  it('Should map String (Includes)', () => {
    const T = TypeBox(Zod(t.String({ pattern: 'hello' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello')
  })
  it('Should map String (IpV4)', () => {
    const T = TypeBox(Zod(t.String({ format: 'ipv4' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv4')
  })
  it('Should map String (IpV6)', () => {
    const T = TypeBox(Zod(t.String({ format: 'ipv6' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv6')
  })
  it('Should map String (Ip)', () => {
    const T = TypeBox(Zod(t.String({ format: 'ip' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ip')
  })
  it('Should map String (Jwt)', () => {
    const T = TypeBox(Zod(t.String({ format: 'jwt' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'jwt')
  })
  it('Should map String (Length)', () => {
    const T = TypeBox(Zod(t.String({ minLength: 100, maxLength: 100 })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
    Assert.IsEqual(T.maxLength, 100)
  })
  it('Should map String (Min)', () => {
    const T = TypeBox(Zod(t.String({ minLength: 100 })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
  })
  it('Should map String (Max)', () => {
    const T = TypeBox(Zod(t.String({ maxLength: 100 })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 100)
  })
  it('Should map String (Nanoid)', () => {
    const T = TypeBox(Zod(t.String({ format: 'nanoid' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'nanoid')
  })
  it('Should map String (RegExp)', () => {
    const T = TypeBox(Zod(t.RegExp(/abc/)))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'abc')
  })
  it('Should map String (StartsWith)', () => {
    const T = TypeBox(Zod(t.String({ pattern: '^hello' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, '^hello')
  })
  it('Should map String (Time)', () => {
    const T = TypeBox(Zod(t.String({ format: 'time' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'time')
  })
  it('Should map String (Ulid)', () => {
    const T = TypeBox(Zod(t.String({ format: 'ulid' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ulid')
  })
  it('Should map String (Url)', () => {
    const T = TypeBox(Zod(t.String({ format: 'url' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'url')
  })
  it('Should map String (Uuid)', () => {
    const T = TypeBox(Zod(t.String({ format: 'uuid' })))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'uuid')
  })
  // ----------------------------------------------------------------
  // Symbol
  // ----------------------------------------------------------------
  it('Should map Symbol', () => {
    const T = TypeBox(Zod(t.Symbol()))
    Assert.IsTrue(TypeGuard.IsSymbol(T))
  })
  // ----------------------------------------------------------------
  // Tuple
  // ----------------------------------------------------------------
  it('Should map Tuple', () => {
    const T = TypeBox(Zod(t.Tuple([t.Number(), t.String()])))
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
    Assert.IsTrue(TypeGuard.IsString(T.items![1]))
  })
  // ----------------------------------------------------------------
  // Undefined
  // ----------------------------------------------------------------
  it('Should map Undefined', () => {
    const T = TypeBox(Zod(t.Undefined()))
    Assert.IsTrue(TypeGuard.IsUndefined(T))
  })
  // ----------------------------------------------------------------
  // Union
  // ----------------------------------------------------------------
  it('Should map Union', () => {
    const T = TypeBox(Zod(t.Union([t.String(), t.Boolean()])))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsString(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsBoolean(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Unknown
  // ----------------------------------------------------------------
  it('Should map Unknown', () => {
    const T = TypeBox(Zod(t.Unknown()))
    Assert.IsTrue(TypeGuard.IsUnknown(T))
  })
  // ----------------------------------------------------------------
  // Void
  // ----------------------------------------------------------------
  it('Should map Void', () => {
    const T = TypeBox(Zod(t.Void()))
    Assert.IsTrue(TypeGuard.IsVoid(T))
  })
})
