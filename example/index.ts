import { TypeBox, Zod, Valibot } from '@sinclair/typemap'

// const T: TObject<{ ... }>

const T = TypeBox(`{ 
  x: number,
  y: number,
  z: number
}`)

// const V: ObjectSchema<{ ... }>

const V = Valibot(`{ 
  x: number,
  y: number,
  z: number
}`)

// const Z: ZodObject<{ ... }>

const Z = Zod(`{ 
  x: number,
  y: number,
  z: number
}`)
