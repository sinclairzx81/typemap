import { ValibotFromTypeBox, Zod, Static, TypeBox, Valibot } from '@sinclair/typemap'

import { Type } from '@sinclair/typebox'

const T = Zod(Valibot(`{
  x: number
  y: number  
}`))







