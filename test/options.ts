import { Assert } from './assert'
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

describe('SyntaxOptions', () => {
  it('Should map Options (Zod)', () => {
    const A = TypeBox('string', { minLength: 10 })
    const B = Zod(A)
    const C = TypeBox(B)
    Assert.IsEqual(C.minLength, 10)
  })
  it('Should map Options (Valibot)', () => {
    const A = TypeBox('string', { minLength: 10 })
    const B = Valibot(A)
    const C = TypeBox(B)
    Assert.IsEqual(C.minLength, 10)
  })
})
