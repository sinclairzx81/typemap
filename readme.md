<div align='center'>

<h1>TypeMap</h1>

<p>Uniform Syntax, Mapping and Compiler Library for TypeBox, Valibot and Zod</p>

<img src="https://github.com/sinclairzx81/typemap/blob/main/typemap.png?raw=true" />

<br />
<br />

[![npm version](https://badge.fury.io/js/%40sinclair%2Ftypemap.svg)](https://badge.fury.io/js/%40sinclair%2Ftypemap)
[![Downloads](https://img.shields.io/npm/dm/%40sinclair%2F2Ftypemap.svg)](https://www.npmjs.com/package/%40sinclair%2Ftypemap)
[![Build](https://github.com/sinclairzx81/typemap/actions/workflows/build.yml/badge.svg)](https://github.com/sinclairzx81/typemap/actions/workflows/build.yml)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Install

```bash
$ npm install @sinclair/typemap --save
```

## Example

Use TypeScript syntax to construct types for TypeBox, Valibot and Zod ... 

[Example Link](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAWhACaEBqAhgDbABGE8AvnAGZQQhwDkAAgGdgAOwDGNKsCgB6GOgwgqYHgCgV06XFERhA+MgBcKAPL0AVhlEwAPEgB0DuMwB8a7bv1wAvCnk5cABQABkgqcHC4RsIAriD0GFD4YXCoUbHxickAXmlxCSrMQQCU4aVl5WoaWjp6cBRGphZWAMqiABYKVLZwDnZOrirutRTedbQMTMGh4ZFwMXmZ4alz6QlJ4TkrCwXFlZpD8ERGJKSNljb2ji5uNYejJ1NwybPzGespuW-Zn-mFRUA)

```typescript
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

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
```

... or structurally remap types from one library to another

[Example Link](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAagIYA2wARhDIQFoQAmcAvnAGZQQhwDkAAgGdgAOwDGZEsCgB6GOgwgSYXgChVMmXADKqETBK44APjgNmp0hWrxTaTDlzqxEEYPjI4AXhQLHACisqGn9zfwADBFU4OFwALjgRAFcQSgwofGi4VATk1PTMmIAvXJS0qFUWcIBKWqA)

```typescript
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

// Syntax > Zod > Valibot > TypeBox

const T = TypeBox(Valibot(Zod(`{
  x: number,
  y: number,
  z: number
}`)))
```

... or compile types for high performance runtime type checking

[Example Link](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgYQuYAbApnAvnAMyjTgHIABAZ2ADsBjDAQ2CgHoYBPMLERsUgFADQkWHABehYiDLiIAE0EC6EGpXgAVOAF4JAOggAjAFZY6MABRI4N23butWcFWs0AufQC0FAeRNmYAB4kARsADw9xPRoAVxBDLCgLAEoAGnsMzLhHWwivBQA5OISoVNC4Dkjo4sSU9KyG7KcbSvz5IvjEsptxKtjOpLTGhpyequ92mtKBXGTh+cac3AA+IRd1FB0UNDBMLAsNOYWm51UN5A8ANUYMYHlGGGhAjT9Tc2Dy46+HZrg8jQ6JW63xBJxaHgBU2BoK+owkEMBiU+MIWS2Wy1sazO8AASltkHpkAALMwAays3xy61xHkMEAg2EYNDgAFo4AAJYAAcyJcAACokCNBePQcMSybQuQBCcp5ACMwNaACZ0uVenAAMwzZJAA)

```typescript
import { Compile } from '@sinclair/typemap'

import z from 'zod'

const T = Compile(z.object({              // const T: Validator<TObject<{  
  x: z.number(),                          //   x: TNumber,     
  y: z.number(),                          //   y: TNumber,
  z: z.number(),                          //   z: TNumber
}))                                       // }>>   
                                  
const R = T.Check({                       // High Performance Check
  x: 1,
  y: 2, 
  z: 3
})
```



## Overview

TypeMap is a type mapping library developed for the [TypeBox](https://github.com/sinclairzx81/typebox), [Valibot](https://github.com/fabian-hiller/valibot) and [Zod](https://github.com/colinhacks/zod) runtime type libraries. It is designed to make these libraries cross compatible by structurally remapping types from one library to another. TypeMap also provides a uniform frontend syntax for creating types, as well as uniform type compilation for high-performance validation via the TypeBox compiler infrastructure.

TypeMap is built to be a simple tool to let Valibot and Zod to integrate with TypeBox and Json Schema infrastructure. It is also written to enable TypeBox to integrate with systems using Valibot and Zod for validation.

License: MIT

## Contents

- [Install](#Install)
- [Overview](#Overview)
- [Libraries](#Libraries)
  - [TypeBox](#TypeBox)
  - [Valibot](#Valibot)
  - [Zod](#Zod)
- [Static](#Static)
- [Compile](#Compile)
- [Benchmark](#Benchmark)
- [Contribute](#Contribute)

## Libraries

TypeMap exports mapping functions named after the library they map for. Each function can accept a type from any other library, where the function will attempt to map the type or return a `never` representation if a mapping is not possible.

### TypeBox

Use the TypeBox function to map the parameter into a TypeBox type

```typescript
import { TypeBox } from '@sinclair/typemap'

const A = TypeBox(t.Number())                  // const A: TNumber         (TypeBox)
const B = TypeBox(v.string())                  // const B: TString         (Valibot)
const C = TypeBox(z.boolean())                 // const C: TBoolean        (Zod)
const D = TypeBox('string[]')                  // const D: TArray<TString> (Syntax)
```

### Valibot

Use the Valibot function to map the parameter into a Valibot type

```typescript
import { Valibot } from '@sinclair/typemap'

const A = Valibot(t.Number())                  // const A: v.NumberSchema     (TypeBox)
const B = Valibot(v.string())                  // const B: v.StringSchema     (Valibot)
const C = Valibot(z.boolean())                 // const C: v.BooleanSchema    (Zod)
const D = Valibot('string[]')                  // const D: v.ArraySchema<...> (Syntax)
```

### Zod

Use the Zod function to map the parameter into a Zod type

```typescript
import { Zod } from '@sinclair/typemap'

const A = Zod(t.Number())                  // const A: z.ZodNumber     (TypeBox)
const B = Zod(v.string())                  // const B: z.ZodString     (Valibot)
const C = Zod(z.boolean())                 // const C: z.ZodBoolean    (Zod)
const D = Zod('string[]')                  // const D: z.ZodArray<...> (Syntax)
```

## Static

TypeMap can statically infer for TypeBox, Valibot, Zod and Syntax with the `Static` type.

```typescript
import { type Static } from '@sinclair/typemap'

const T = t.Number()                                // TypeBox
const V = v.string()                                // Valibot
const Z = z.boolean()                               // Zod
const S = 'string[]'                                // Syntax

type T = Static<typeof T>                           // number
type V = Static<typeof V>                           // string
type Z = Static<typeof Z>                           // boolean 
type S = Static<typeof S>                           // string[]
```

## Compile

TypeMap offers JIT compilation of TypeBox, Valibot, Zod and Syntax using the `Compile` function. This function will internally use the TypeBox TypeCompiler for high performance checking. This function will also gracefully degrade to dynamic checking if the runtime does not support JavaScript evaluation.

The `Compile` function returns a validator object that implements the [standard-schema](https://github.com/standard-schema/standard-schema) interface.

```typescript
import { Compile } from '@sinclair/typemap'

// Pass TypeBox, Valibot, Zod or Syntax to JIT Compile the type.
const V = Compile(`{
  x: number
  y: number,
  z: number
}`)

// TypeMap Interface
const R1 = V.Check({ x: 1, y: 2, z: 3 })

// Standard Schema Interface
const R2 = V['~standard'].validate({ x: 1, y: 2, z: 3 })
```

## Benchmark

This project manages a benchmark that evaluates type-check performance using Zod, Valibot, and TypeBox validators. The benchmark is set up to run 10 million check operations per library-validator pairing and reports the elapsed time taken to complete.

### Type

Benchmarks are run for the following type.

```typescript
type T = { x: number, y: string, z: boolean }
```

### Results

Results show validate performance for the type.

```typescript
┌─────────┬────────────────┬────────────────────┬────────────┬────────────┐
│ (index) │ library        │ using              │ iterations │ elapsed    │
├─────────┼────────────────┼────────────────────┼────────────┼────────────┤
│ 0       │ 'valibot     ' │ 'valibot         ' │ 10000000   │ '1534 ms ' │
│ 1       │ 'valibot     ' │ 'typebox:value   ' │ 10000000   │ '1377 ms ' │
│ 2       │ 'valibot     ' │ 'typebox:compile ' │ 10000000   │ '46 ms   ' │
└─────────┴────────────────┴────────────────────┴────────────┴────────────┘
┌─────────┬────────────────┬────────────────────┬────────────┬────────────┐
│ (index) │ library        │ using              │ iterations │ elapsed    │
├─────────┼────────────────┼────────────────────┼────────────┼────────────┤
│ 0       │ 'zod         ' │ 'zod             ' │ 10000000   │ '4669 ms ' │
│ 1       │ 'zod         ' │ 'typebox:value   ' │ 10000000   │ '1359 ms ' │
│ 2       │ 'zod         ' │ 'typebox:compile ' │ 10000000   │ '47 ms   ' │
└─────────┴────────────────┴────────────────────┴────────────┴────────────┘
```

For community benchmarks, refer to the [runtime-type-benchmarks](https://github.com/moltar/typescript-runtime-type-benchmarks) project.

## Contribute

This project is open to community contributions. Please ensure you submit an open issue before creating a pull request. TypeMap encourages open community discussion before accepting new features.

