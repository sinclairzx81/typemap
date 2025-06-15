import { TypeBox } from '@sinclair/typemap'
import { TypeGuard } from '@sinclair/typebox'
import { Assert } from './assert'
import { z } from 'zod/v4'

describe('TypeBox From Zod4', () => {
  // ----------------------------------------------------------------
  // Metadata
  // ----------------------------------------------------------------
  it('Should map Description', () => {
    const T = TypeBox(z.number().describe('a number'))
    Assert.IsEqual(T.description, 'a number')
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
  // Boolean
  // ----------------------------------------------------------------
  it('Should map Boolean', () => {
    const T = TypeBox(z.boolean())
    Assert.IsTrue(TypeGuard.IsBoolean(T))
  })
  
  // ----------------------------------------------------------------
  // Number
  // ----------------------------------------------------------------
  it('Should map Number', () => {
    const T = TypeBox(z.number())
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  
  // ----------------------------------------------------------------
  // Object
  // ----------------------------------------------------------------
  it('Should map Object', () => {
    const T = TypeBox(z.object({ x: z.number() }))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
  })
  
  // ----------------------------------------------------------------
  // String
  // ----------------------------------------------------------------
  it('Should map String', () => {
    const T = TypeBox(z.string())
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  
  // ----------------------------------------------------------------
  // String Formats
  // ----------------------------------------------------------------
  it('Should map String Email format', () => {
    const T = TypeBox(z.email())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  
  it('Should map String UUID format', () => {
    const T = TypeBox(z.uuid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'uuid')
  })
  
  it('Should map String URL format', () => {
    const T = TypeBox(z.url())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'url')
  })
  
  it('Should map String IPv4 format', () => {
    const T = TypeBox(z.ipv4())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv4')
  })
  
  it('Should map String IPv6 format', () => {
    const T = TypeBox(z.ipv6())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv6')
  })
  
  it('Should map String CUID format', () => {
    const T = TypeBox(z.cuid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid')
  })
  
  it('Should map String CUID2 format', () => {
    const T = TypeBox(z.cuid2())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid2')
  })
  
  it('Should map String ULID format', () => {
    const T = TypeBox(z.ulid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ulid')
  })
  
  it('Should map String Base64 format', () => {
    const T = TypeBox(z.base64())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64')
  })
  
  it('Should map String Base64URL format', () => {
    const T = TypeBox(z.base64url())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64url')
  })

  // ISO date formats
  it('Should map String ISO Date format', () => {
    const T = TypeBox(z.iso.date())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'date')
  })
  
  it('Should map String ISO DateTime format', () => {
    const T = TypeBox(z.iso.datetime())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'datetime')
  })
  
  // ----------------------------------------------------------------
  // Edge Cases & Complex Cases
  // ----------------------------------------------------------------
  it('Should map string format validators with transform', () => {
    const T = TypeBox(z.email().transform(val => val.toLowerCase()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  
  it('Should map string format validators with pipe', () => {
    const T = TypeBox(z.string().pipe(z.email()))
    Assert.IsTrue(TypeGuard.IsString(T))
    // This might actually fail depending on how pipe is implemented in Zod v4
  })
  
  it('Should map optional string format validators', () => {
    const T = TypeBox(z.email().optional())
    Assert.IsTrue(TypeGuard.IsOptional(T))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  
  it('Should map array of string format validators', () => {
    const T = TypeBox(z.array(z.email()))
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsString(T.items))
    Assert.IsEqual(T.items.format, 'email')
  })
  
  it('Should map object with string format validators', () => {
    const T = TypeBox(z.object({
      email: z.email(),
      uuid: z.uuid(),
      url: z.url()
    }))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsString(T.properties.email))
    Assert.IsEqual(T.properties.email.format, 'email')
    Assert.IsTrue(TypeGuard.IsString(T.properties.uuid))
    Assert.IsEqual(T.properties.uuid.format, 'uuid')
    Assert.IsTrue(TypeGuard.IsString(T.properties.url))
    Assert.IsEqual(T.properties.url.format, 'url')
  })
})
