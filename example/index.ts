import { TypeBox } from '@sinclair/typemap'

import * as z from 'zod'

const Z = z.object({                                // const Z: z.ZodObject<{
  x: z.number(),                                    //   x: z.ZodNumber;
  y: z.number(),                                    //   y: z.ZodNumber;
  z: z.number()                                     //   z: z.ZodNumber;
}).strict()                                         // }, "strict", ...>

// TypeBox represents types as Json Schema

const T = TypeBox(Z)                                // const T = {
                                                    //   type: 'object',
                                                    //   required: ['x', 'y', 'z'],
                                                    //   additionalProperties: false,
                                                    //   properties: {
                                                    //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }


console.log(T)