<div align='center'>

<h1>TypeMap</h1>

<p>Unified Syntax, Mapping and Compiler System for Runtime Type Systems</p>

<img src="./typemap.png" />

<br />
<br />

[![npm version](https://badge.fury.io/js/%40sinclair%2Ftypemap.svg)](https://badge.fury.io/js/%40sinclair%2Ftypemap)
![Downloads](https://img.shields.io/npm/dm/%40sinclair%2Ftypemap)
[![Build](https://github.com/sinclairzx81/typemap/actions/workflows/build.yml/badge.svg)](https://github.com/sinclairzx81/typemap/actions/workflows/build.yml)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Install

```bash
$ npm install @sinclair/typemap --save
```

## Usage

Create Types with TypeScript syntax.

```typescript
import { Zod, Compile } from '@sinclair/typemap'

const result = Zod(`string`).parse('Hello World')
```

## Overview

TypeMap is a syntax frontend and compiler backend for the [TypeBox](https://github.com/sinclairzx81/typebox), [Valibot](https://github.com/fabian-hiller/valibot) and [Zod](https://github.com/colinhacks/zod) type libraries. It provides a uniform syntax for creating types, a runtime compiler for high-performance validation and enables types written in one library to be transformed to another. 

TypeMap is built as an advanced adapter system for the TypeBox project. It enables Valibot and Zod to be integrated on TypeBox validation infrastructure as well as enabling TypeBox to be integrated on Zod infrastructure via reverse type mapping.

License: MIT



## Contents

- [Install](#Install)
- [Usage](#Usage)
- [Overview](#Overview)
- [Example](#Example)
- [Libraries](#Libraries)
  - [TypeBox](#TypeBox)
  - [Valibot](#Valibot)
  - [Zod](#Zod)
- [Syntax](#Syntax)
  - [Types](#Types)
  - [Options](#Options)
  - [Parameters](#Parameters)
  - [Generics](#Generics)
- [Static](#Static)
- [Compile](#Compile)
- [Benchmark](#Benchmark)
- [Contribute](#Contribute)

## Example

Construct types for TypeBox, Valibot and Zod using a common TypeScript syntax

[Example Link](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAagIYA2wARhDIQFoQAmcAvnAGZQQhwDkAAgGdgAOwDGZEsCgB6GOgwgSYXgChVMmXAAKJKIIxwAyqhEwSuOAB8deg8XIBXQ+rEQRg+ACU4AXjgMjAAUvJ5QogDm1nAijiCUGFC8AJQAdGB2GCGpOSlw+QVwmnBuHt4AXHBhkdGx8YnqxQDC3CDuxqbmlmiYcF4YYFAYBmYkMMDuru6exn5wAAYIqvm4lXUJUPjLcKhrcRtb+QBee-VQqizzU2Uocz3YeEFGyYWvb+8f+cWlM8iVyAB5SgAKwwYhgAB4lp8YbC4TDiit-gA5faJQ7wzFYz6InYotGbbbY4nE3EnFCos5Ekk0uHFFgAPmuMyIc1IFGoMCeL1psO+03gREqQNB4KMYgAFooSFDqbz5a9cas4JSNuKpUoITlUgyMQr9QVcbsVQT1dKtTldXKDfKyZVVYkzZrtUybTb6YQXepVD94HQ5oFuW6cVpfQFKoERWDIdDgwqlRGmA7CXH41p8sbAsm9amaXaAkmCdbc1iPXAXUA)

```typescript
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

// Parse Syntax | Parse Value 

const R = Zod('string | number').parse('...')       // const R: string | number

// Common Syntax Type Representation

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
```

Transform types between TypeBox, Valibot and Zod

[Example Link](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAagIYA2wARhDIQFoQAmcAvnAGZQQhwDkAAgGdgAOwDGZEsCgB6GOgwgSYXgChVYiCMHwAUoK0BlMQAtFJOAF4UCnLgAUpCtRj2GjewAMEquHFwAXHAiAK4glBhQ+L5wqEGh4ZHRfgBe8WERUKosngCU+UA)

```typescript
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

const JsonSchema = TypeBox(Valibot(Zod(`{
  x: number,
  y: number,
  z: number
}`)))
```

Compile Zod and Valibot on TypeBox validation infrastructure

[Example Link](https://www.typescriptlang.org/play/?moduleResolution=99&module=199&ssl=17&ssc=3&pln=1&pc=1#code/JYWwDg9gTgLgBAbzgYQuYAbApnAvnAMyjTgHIABAZ2ADsBjDAQ2CgHoYBPMLERsUgFADQkWHABehYiDLiIAE0EDWrFGjCYcALQVwAKlyxC6EGpXjI4AXjXpsACnEA6CACMAVljox7SOP4DAoOCAlTgTMwsALjgANUYMYHlGGGgAHj0AeQ8vGDS-AX8ADxjnGgBXEFcsKHsASgAaEOaW1tDVYpi9ADlK6qgmwMK4DlKnCqqa+sG22dmw-1H9XsmB4fExif7pud3WhYkulf6BXDq6vcur-zDcAD47gOHr3YEI8zgAJWsUJ2QACy8AGtfC89mEAJIwGopYCmSgxACMAAYAPrIjHojHDEpwREzMGEm6sYZLABMBKJYLCOnkzRiABYMciQJQ4PY+GBiEU6usYgBmKlCsIGbgAWT4gUZLLZ-g5YC5EB5pzqQA)

```typescript
import { Compile } from '@sinclair/typemap'

import z from 'zod'

// Compile Zod Type

const C = Compile(z.object({                         // const C: Validator<TObject<{  
  x: z.number(),                                     //   x: TNumber,     
  y: z.number(),                                     //   y: TNumber,
  z: z.number(),                                     //   z: TNumber
}))                                                  // }>>   
                                  
const R = C.Check({                                  // Iterations: 10_000_000
  x: 1,                                              //
  y: 2,                                              // Zod        : 4000ms (approx)
  z: 3                                               // TypeMap    : 40ms   (approx)
})
```

## Libraries

TypeMap, at its core, is a runtime type mapping library. It is specifically designed to transform types from one library into types for another. 

TypeMap performs deep type mapping both statically (within the type system) and at runtime. As a rule, if a type cannot be mapped during traversal, the library function returns a never representation specific to the library being mapped for.

### TypeBox

Use the TypeBox function to map a parameter into a TypeBox type.

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

## Syntax

TypeMap provides an optional syntax that can be used to construct runtime type representations. Syntax mapping is based on [Syntax Type](https://github.com/sinclairzx81/typebox?#syntax) provided by TypeBox.

### Types

Pass a constant string parameter with an embedded TypeScript type annotion to construct a type. If there is a syntax error, the function return type will be `never`.

[Example Link](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgLQgEzgXzgMyhEOAcgAEBnYAOwGMAbAQ2CgHoYBPMAUxHrCICh+zZnADCUTvRic49FOjjsusyhgAK9KGRnAYg6hEpl4EsgFda8ALzy0ACiJIAHgC44ARixEAlADowmtp2zm6emN5AA)

```typescript
import { Zod } from '@sinclair/typemap'

// Create a Zod type and Parse it

const result = Zod('{ x: 1 }').parse({ x: 1 })
```

### Options

Options can be passed on the last parameter of a syntax type. TypeMap understands Json Schema keyword constraints. Known constraints will be mapped to analogs structures for the target library if possible.

```typescript
import { Zod } from '@sinclair/typemap'

// const T = z.string().email()

const T = Zod('string', {
  format: 'email' 
})

// const S = z.object({ x: z.number() }).strict()

const S = Zod('{ x: number }', { 
  additionalProperties: false 
})

```

### Parameters

Syntax types can be parameterized to accept exterior types. The following injects a Zod type into a Valibot vector structure.

[Example Link](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgNQIYBtgCMIwDRwBaEAJnAL5wBmUEIcA5AAIDOwAdgMbqrBQD0MAJ5gApiFRgGAKGn9+cAMIR2LGFACuneABVZnFWrg64AXiKkAFA3YaQWUVAYBKWfLgAFVCxbG4MCDgAZX1DeCCzFAxsXEskE3ICAAMkAA8ALmMCIUydAgAvXIok5yA)

```typescript
import { Valibot, Zod } from '@sinclair/typemap'

// Construct T

const T = Zod('number')

// Pass T to S

const S = Valibot({ T }, `{ x: T, y: T, z: T }`)
```

### Generics

Using type parameters, you can construct generic via functions.

[Example Link](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAagIYA2wARhDIQFoQAmcAvnAGZQQhwDkAAgGdgAOwDGZEsCgB6GOgwgSYXgChVMmXADiGERijAxxDGJjQUCuAB84AMQCu4mMAgj1Yt4PhFT5qHAAvHAAPMhwGLgweoyCcBCUAFZ+AHwAFMgAXCgAlEEpxORUNGlI4SyEqnBwAAZIuNnIhKiNhABejaw1qjnqmnAAcg4glAYmZhZomB5e8EMjBr4TAcFL-hkKOLhpvCLDo1C8Ob0aWgDKMIYiAObj-pbTqp4i3nAXV9drFqt+0GkMjB23g+RxyQA)

```typescript
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

// Generic Vector Type | Function

const Vector = <T extends object>(T: T) => Valibot({ T }, 
  `{ x: T, y: T, z: T }`
)

// Number Vector Type

const NumberVector = Vector(TypeBox('number'))

// String Vector Type

const StringVector = Vector(Zod('string'))
```

## Static

Use Static to uniformly infer for syntax and library types 

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

Use the Compile function to compile Zod and Valibot on TypeBox validation infrastructure.

```typescript
import { Compile, Zod } from '@sinclair/typemap'

// Compile Zod Type

const V = Compile(Zod(`{
   x: number,
   y: number,
   z: number
}`))

// TypeMap Check Function

const R1 = V.Check({ x: 1, y: 2, z: 3 })

// Standard Schema Interface Check Function

const R2 = V['~standard'].validate({ x: 1, y: 2, z: 3 })
```

## Benchmark

This project manages a small benchmark that compares validation performance using Zod, Valibot, and TypeBox validators. For more comprehensive community benchmarks, refer to the [runtime-type-benchmarks](https://github.com/moltar/typescript-runtime-type-benchmarks) project.

### Test

Benchmarks are run for the following type.

```typescript
type T = { x: number, y: string, z: boolean }
```

### Results

Results show the approximate elapsed time to complete the given iterations

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



## Contribute

This project is open to community contributions. Please ensure you submit an open issue before creating a pull request. TypeBox and associated projects preference open community discussion before accepting new features.

