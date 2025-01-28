import { TypeBox, Valibot, Zod, Compile, Static } from '@sinclair/typemap'

// Parse Syntax | Parse Value 

const R = Zod('string | number').parse('...')       // const R: string | number

// Syntax Type

const S = `{
  x: number,
  y: number,
  z: number
}`

const T = TypeBox(S)                                // const T: TObject<{
                                                    //   x: TNumber,
                                                    //   y: TNumber,
                                                    //   z: TNumber
                                                    // }>

const V = Valibot(S)                                // const V: ObjectSchema<{
                                                    //   x: NumberSchema<...>,
                                                    //   y: NumberSchema<...>,
                                                    //   z: NumberSchema<...>
                                                    // }, ...>


const Z = Zod(S)                                    // const Z: ZodObject<{
                                                    //   x: ZodNumber,
                                                    //   y: ZodNumber,
                                                    //   z: ZodNumber
                                                    // }, ...>
                        
