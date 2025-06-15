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
})
