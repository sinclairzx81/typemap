import { Zod, Zod4 } from '@sinclair/typemap'
import { Assert } from './assert'
import * as z from 'zod'
import { z as z4 } from 'zod/v4'

describe('Zod4 From Zod and Zod From Zod4', () => {
  // ----------------------------------------------------------------
  // String Conversion
  // ----------------------------------------------------------------
  it('Should convert Zod string to Zod4 string', () => {
    const zodString = z.string()
    const zod4String = Zod4(zodString)
    
    // Verify it's a Zod4 string type
    Assert.IsTrue(typeof zod4String.parse === 'function')
    Assert.IsEqual(zod4String.parse('test'), 'test')
  })
  
  it('Should convert Zod4 string to Zod string', () => {
    const zod4String = z4.string()
    const zodString = Zod(zod4String)
    
    // Verify it's a Zod string type
    Assert.IsTrue(typeof zodString.parse === 'function')
    Assert.IsEqual(zodString.parse('test'), 'test')
  })

  // ----------------------------------------------------------------
  // Object Conversion
  // ----------------------------------------------------------------
  it('Should convert Zod object to Zod4 object', () => {
    const zodObject = z.object({
      name: z.string(),
      age: z.number()
    })
    
    const zod4Object = Zod4(zodObject)
    
    // Verify it's a Zod4 object type and can parse correctly
    const testData = { name: 'John', age: 30 }
    Assert.IsTrue(typeof zod4Object.parse === 'function')
    const parsed = zod4Object.parse(testData)
    Assert.IsEqual(parsed, testData)
  })
  
  it('Should convert Zod4 object to Zod object', () => {
    const zod4Object = z4.object({
      name: z4.string(),
      age: z4.number()
    })
    
    const zodObject = Zod(zod4Object)
    
    // Verify it's a Zod object type and can parse correctly
    const testData = { name: 'John', age: 30 }
    Assert.IsTrue(typeof zodObject.parse === 'function')
    const parsed = zodObject.parse(testData)
    Assert.IsEqual(parsed, testData)
  })
  
  // ----------------------------------------------------------------
  // Back and Forth Conversion
  // ----------------------------------------------------------------
  it('Should preserve structure when converting Zod → Zod4 → Zod', () => {
    const original = z.object({
      name: z.string(),
      age: z.number(),
      isAdmin: z.boolean().optional()
    })
    
    const toZod4 = Zod4(original)
    const backToZod = Zod(toZod4)
    
    // Verify round-trip conversion works
    const testData = { name: 'John', age: 30 }
    Assert.IsEqual(backToZod.parse(testData), testData)
    
    // Optional field should work too
    const testDataWithOptional = { name: 'John', age: 30, isAdmin: true }
    Assert.IsEqual(backToZod.parse(testDataWithOptional), testDataWithOptional)
  })
})
