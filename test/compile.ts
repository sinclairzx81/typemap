import { Assert } from './assert'
import { TypeBox, Valibot, Zod, Compile } from '@sinclair/typemap'
import { ZodPathFromJsonPointer } from 'src/compile/path'

describe('Compile', () => {
  // ----------------------------------------------------------------
  // Validator
  // ----------------------------------------------------------------
  it('Should compile Syntax', () => {
    const C = Compile('123')
    Assert.IsTrue(C.Check(123))
  })
  it('Should compile Syntax (Parameterized)', () => {
    const C = Compile({ T: TypeBox('123') }, 'T')
    Assert.IsTrue(C.Check(123))
  })
  it('Should compile TypeBox', () => {
    const C = Compile(TypeBox('123'))
    Assert.IsTrue(C.Check(123))
  })
  it('Should compile TypeBox (Parameterized)', () => {
    const C = Compile({ T: TypeBox('123') }, 'T')
    Assert.IsTrue(C.Check(123))
  })
  it('Should compile Valibot', () => {
    const C = Compile(Valibot('123'))
    Assert.IsTrue(C.Check(123))
  })
  it('Should compile Valibot (Parameterized)', () => {
    const C = Compile({ T: Valibot('123') }, 'T')
    Assert.IsTrue(C.Check(123))
  })
  it('Should compile Zod', () => {
    const C = Compile(Zod('123'))
    Assert.IsTrue(C.Check(123))
  })
  it('Should compile Zod (Parameterized)', () => {
    const C = Compile({ T: Zod('123') }, 'T')
    Assert.IsTrue(C.Check(123))
  })
  // ----------------------------------------------------------------
  // Standard Schema
  // ----------------------------------------------------------------
  it('Should validate via Standard Schema interface (Success)', () => {
    const C = Compile('string')
    const R = C['~standard'].validate('hello')
    // @ts-ignore
    Assert.IsEqual(R.value, 'hello') // Reference spec interface is broken here, It's not for me to fix.
  })
  it('Should validate via Standard Schema interface (Failure)', () => {
    const C = Compile('string')
    const R = C['~standard'].validate(12345)
    Assert.IsTrue('issues' in R)
    Assert.IsTrue(R.issues!.length > 0)
  })
})

describe('ZodPathFromJsonPointer', () => {
  it('Should convert empty string', () => {
    const jsonPointer = ''
    Assert.IsEqual(ZodPathFromJsonPointer(jsonPointer), [])
  })
  it('Should convert whole object path', () => {
    const jsonPointer = '/'
    Assert.IsEqual(ZodPathFromJsonPointer(jsonPointer), [''])
  })
  it('Should convert nested object path', () => {
    const jsonPointer = '/a/b'
    Assert.IsEqual(ZodPathFromJsonPointer(jsonPointer), ['a', 'b'])
  })
  it('Should convert array path', () => {
    const jsonPointer = '/a/0'
    Assert.IsEqual(ZodPathFromJsonPointer(jsonPointer), ['a', 0])
  })
  it('Should convert keys which looks like array index', () => {
    const jsonPointer = '/a/"0"'
    Assert.IsEqual(ZodPathFromJsonPointer(jsonPointer), ['a', '"0"'])
  })
  it('Should convert keys with / escape', () => {
    const jsonPointer = '/a~1b'
    Assert.IsEqual(ZodPathFromJsonPointer(jsonPointer), ['a/b'])
  })
  it('Should convert keys with ~ escape', () => {
    const jsonPointer = '/m~0n'
    Assert.IsEqual(ZodPathFromJsonPointer(jsonPointer), ['m~n'])
  })
  it('Should convert keys with ~ and / escape', () => {
    const jsonPointer = '/m~01n'
    Assert.IsEqual(ZodPathFromJsonPointer(jsonPointer), ['m~1n'])
  })
})
