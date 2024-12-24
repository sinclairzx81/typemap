import { Box } from '@sinclair/typebox-adapter'
import * as v from 'valibot'
import * as z from 'zod'

// Valibot to TypeBox (Runtime)

const V = Box(
  v.object({
    x: v.number(),
    y: v.number(),
    z: v.number(),
  }),
)

// Zod to TypeBox (Static)

const Z = Box(
  z.object({
    a: z.string(),
    b: z.string(),
    c: z.string(),
  }),
)
