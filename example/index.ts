import { TypeBox, Valibot, Zod, Syntax, Compile } from '@sinclair/typemap'

// ------------------------------------------------------------------
// Syntax Types
// ------------------------------------------------------------------

const S = `{
  x: number,
  y: number,
  z: number
}`

// ------------------------------------------------------------------
// Runtime Types
// ------------------------------------------------------------------

const T = TypeBox(S)                                // const T: TObject<{ ... }>

const V = Valibot(S)                                // const V: ObjectSchema<{ ... }, ...>

const Z = Zod(S)                                    // const Z: ZodObject<{ ... }, ...>

// ------------------------------------------------------------------
// Reverse Syntax
// ------------------------------------------------------------------

const X = Syntax(Z)                                 // const X: "{ x: number, y: number, z: number }"

// ------------------------------------------------------------------
// Compile
// ------------------------------------------------------------------

const C = Compile(X)                                // const C: Validator<TObject<{
                                                    //  x: TNumber;
                                                    //  y: TNumber;
                                                    //  z: TNumber;
                                                    // }>>