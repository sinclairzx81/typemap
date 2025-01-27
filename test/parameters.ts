import { Assert } from './assert'
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'
import { KindGuard } from '@sinclair/typebox'

describe('Parameters', () => {
  it('Should map Parameters (Zod)', () => {
    const A = TypeBox('string')
    const B = Zod({ A }, 'A')
    const C = TypeBox(B)
    Assert.IsTrue(KindGuard.IsString(C))
  })
  it('Should map Parameters (Valibot)', () => {
    const A = TypeBox('string')
    const B = Valibot({ A }, 'A')
    const C = TypeBox(B)
    Assert.IsTrue(KindGuard.IsString(C))
  })
  it('Should map Parameters With Constraints (Zod)', () => {
    const A = TypeBox('string', { minLength: 10 })
    const B = Zod({ A }, 'A')
    const C = TypeBox(B)
    Assert.IsTrue(KindGuard.IsString(C))
    Assert.IsEqual(C.minLength, 10)
  })
  it('Should map Parameters With Constraints (Valibot)', () => {
    const A = TypeBox('string', { minLength: 10 })
    const B = Valibot({ A }, 'A')
    const C = TypeBox(B)
    Assert.IsTrue(KindGuard.IsString(C))
    Assert.IsEqual(C.minLength, 10)
  })
})
