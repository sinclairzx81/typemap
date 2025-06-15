import { Zod4 } from '@sinclair/typemap'
import { Assert } from './assert'
import * as t from '@sinclair/typebox'
import { z } from 'zod/v4'

describe('Zod4 From TypeBox', () => {
  // ----------------------------------------------------------------
  // Any
  // ----------------------------------------------------------------
  it('Should map Any', () => {
    const Z = Zod4(t.Any())
    Assert.IsTrue(Z.safeParse(1).success)
    Assert.IsTrue(Z.safeParse('hello').success)
    Assert.IsTrue(Z.safeParse(true).success)
  })

  // ----------------------------------------------------------------
  // Boolean
  // ----------------------------------------------------------------
  it('Should map Boolean', () => {
    const Z = Zod4(t.Boolean())
    Assert.IsTrue(Z.safeParse(true).success)
    Assert.IsFalse(Z.safeParse(1).success)
  })

  // ----------------------------------------------------------------
  // Number
  // ----------------------------------------------------------------
  it('Should map Number', () => {
    const Z = Zod4(t.Number())
    Assert.IsTrue(Z.safeParse(1).success)
    Assert.IsFalse(Z.safeParse('hello').success)
  })

  // ----------------------------------------------------------------
  // Object
  // ----------------------------------------------------------------
  it('Should map Object', () => {
    const Z = Zod4(t.Object({ x: t.Number(), y: t.String() }))
    Assert.IsTrue(Z.safeParse({ x: 1, y: 'hello' }).success)
    Assert.IsFalse(Z.safeParse({ x: 'hello', y: 1 }).success)
  })

  // ----------------------------------------------------------------
  // String
  // ----------------------------------------------------------------
  it('Should map String', () => {
    const Z = Zod4(t.String())
    Assert.IsTrue(Z.safeParse('hello').success)
    Assert.IsFalse(Z.safeParse(1).success)
  })
  
  // ----------------------------------------------------------------
  // String Format
  // ----------------------------------------------------------------
  it('Should map String with Email format', () => {
    const Z = Zod4(t.String({ format: 'email' }))
    Assert.IsTrue(Z.safeParse('test@example.com').success)
    Assert.IsFalse(Z.safeParse('not-an-email').success)
  })
})
