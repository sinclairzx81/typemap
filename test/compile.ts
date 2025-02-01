import { Assert } from './assert'
import { TypeBox, Valibot, Zod, Compile } from '@sinclair/typemap'

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
