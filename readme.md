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

Runtime Types from TypeScript Syntax ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgLQgEzgXzgMyhEOAcgAEBnYAOwGMAbAQ2CgHoYBPMAUxHrCICh+1CJTLwonMgFda8ALwp0ACgAGYqFQDmKgJQA6MPShlOSogAlOtWhDgB1aLTREdQA))

```typescript
import { Zod } from '@sinclair/typemap'

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

Use a TypeScript syntax to create types for TypeBox, Valibot and Zod ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAagIYA2wARhDIQFoQAmcAvnAGZQQhwDkAAgGdgAOwDGZEsCgB6GOgwgSYXgChVMmXAAKJKIIxwAyqhEwSuOAB8deg8XIBXQ+rEQRg+ACU4AXjgMjAAUvJ5QogDm1nAijiCUGFC8AJQAdGB2GCGpOSlw+QVwmnBuHt4AXHBhkdGx8YnqxQDC3CDuxqbmlmiYcF4YYFAYBmYkMMDuru6exn5wAAYIqvm4lXUJUPjLcKhrcRtb+QBee-VQqizzU2Uocz3YeEFGyYWvb+8f+cWlM8iVyAB5SgAKwwYhgAB4lp8YbC4TDiit-gA5faJQ7wzFYz6InYotGbbbY4nE3EnFCos5Ekk0uHFFgAPmuMyIc1IFGoMCeL1psO+03gREqQNB4KMYgAFooSFDqbz5a9cas4JSNuKpUoITlUgyMQr9QVcbsVQT1dKtTldXKDfKyZVVYkzZrtUybTb6YQXepVD94HQ5oFuW6cVpfQFKoERWDIdDgwqlRGmA7CXH41p8sbAsm9amaXaAkmCdbc1iPXAXUA))

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

Parse and map between TypeBox, Valibot and Zod types ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAagIYA2wARhDIQFoQAmcAvnAGZQQhwDkAAgGdgAOwDGZEsCgB6GOgwgSYXgChVMmXADKqETBK44AWgB8cBszPFyVGifNpMOXOrEQRg+MjgBeFAouABSkFNQwQZZBAAYIqnBwuABccCIAriCUGFD48XCoKemZ2bkJAF6FGVlQqizRAJSNQA))

```typescript
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

// Syntax -> Zod -> Valibot -> TypeBox

const T = TypeBox(Valibot(Zod(`{
  x: number,
  y: number,
  z: number
}`)))
```

Compile Valibot and Zod types on TypeBox validation infrastructure. ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199&ssl=17&ssc=3&pln=1&pc=1#code/JYWwDg9gTgLgBAbzgYQuYAbApnAvnAMyjTgHIABAZ2ADsBjDAQ2CgHoYBPMLERsUgFADQkWHABehYiDLiIAE0EDWrFGjCYcALQVwAKlyxC6EGpXjI4AXjXpsACnEA6CACMAVljox7SOP4DAoOCAlTgTMwsALjgANUYMYHlGGGgAHj0AeQ8vGDS-AX8ADxjnGgBXEFcsKHsASgAaEOaW1tDVYpi9ADlK6qgmwMK4DlKnCqqa+sG22dmw-1H9XsmB4fExif7pud3WhYkulf6BXDq6vcur-zDcAD47gOHr3YEI8zgAJWsUJ2QACy8AGtfC89mEAJIwGopYCmSgxACMAAYAPrIjHojHDEpwREzMGEm6sYZLABMBKJYLCOnkzRiABYMciQJQ4PY+GBiEU6usYgBmKlCsIGbgAWT4gUZLLZ-g5YC5EB5pzqQA))

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

TypeMap provides a built in TypeScript syntax parser that can be used to create runtime types. Parsing is implemented at runtime as well as in the TypeScript type system.

### Types

Syntax types can be created by passing a string parameter to any ibrary mapping function. TypeMap supports most TypeScript annotation syntax. If the string contains a syntax error, the function will return a `never` type. ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA84C+cAZlBCHAOQACAzsAHYDGANgIbBQD0M6GIbMJQBQwphAa14yOAF4UfHLgAUlJLgBccAIyFKASjhGjXLnHGTpW5AHkARgCsMTGAB511gDLAYGKGxZXbQA+QmDRCyk4AGU5BUwlVQ0uA2M0tNNzCSjo6wA5DAA3PyA))

```typescript
import { TypeBox } from '@sinclair/typemap'

const T = TypeBox('{ x: 1 }')     // const T: TObject<{ x: TLiteral<1> }>

const S = TypeBox(':/')           // const S: TNever
```

### Options

Options can be passed on the last parameter of a type. TypeMap will translate known Json Schema keywords into appropriate runtime representations if possible. ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAWhACZwC+cAZlBCHAOQACAzsAHYDGANgIbAoAehjoMIPmEYAoaUKFwuEDq3jIAXCgDKMKJwDmcALyI4ozJsaq9HfY0LVoEmJfECejSrKUq1xlGI4uAAUVroG9qaOUM6uEsAelACUsvKKyqpwWv4AXgB0EABGAFYYXDDBSLia+RwAriCFGFDBScl51sDlrd4Z8NkmJKShVZr1jc2UkUh8pKTAMMDKfDwACnSYsMAYrJrUK6wYyUA))

```typescript
import { TypeBox, Zod } from '@sinclair/typemap'

// const T: TString = { type: 'string', format: 'email' }

const T = TypeBox('string', { format: 'email' })

// const S = z.object({ x: z.number() }).strict()

const S = Zod('{ x: number }', { additionalProperties: false })
```

### Parameters

Types can be parameterized to accept exterior types. ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgNQIYBtgCMIwDRwBaEAJnAL5wBmUEIcA5AAIDOwAdgMbqrBQD0MAJ5gApiFRgGAKGmcI7FvAAqcALwoM2XAAoG7AK4gsoqAwCUcK9f784AUQAeMU8GhxlI0bPmL4AZXUiUh0kVXICAAMkRwAuDwpIy1tgkgB5LAArUU4YAB4Y+OISADkjEygKAiQAOjqKAD4gA))

```typescript
import { Valibot, Zod } from '@sinclair/typemap'

const T = Valibot('number')      // Exterior Type

const S = Zod({ T }, `{ x: T }`) // ZodObject<{ x: ZodNumber }, { ... }>
```

### Generics

Use functions to create generic types ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAagIYA2wARhDIQFoQAmcAvnAGZQQhwDkAAgGdgAOwDGZEsCgB6GOgwgSYXgChVMmXADiGERijAxxDGJjQUCuAB84AMQCu4mMAgj1Yt4PhFT5qHAAvHAAPMhwGLgweoyCcBCUAFZ+AHwAFMgAXCgAlEEpxORUNGlI4SyEAAZIqnB1uNnIhLV1qI3NdXAAXo1wqiyVOeqacAByDiCUBiZmFmiYHl7w45MGvrMBwev+GQo4uGm8IhNTULw5QxpaAMowhiIA5jP+lguqniLecLf3D9sWWz80DSDEYh28v3OOSAA))

```typescript
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

// Generic Vector Type | Function

const Vector = <T extends object>(T: T) => Valibot({ T }, `{ 
   x: T, 
   y: T, 
   z: T 
}`)

// Number Vector Type

const NumberVector = Vector(TypeBox('number'))

// String Vector Type

const StringVector = Vector(Zod('string'))
```

## Static

Use Static to infer for library and syntax types 

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

Use Compile to build Zod and Valibot on TypeBox validation infrastructure. ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgYQuYAbApgGjgLQgBM4BfOAMyjTgHIABAZ2ADsBjDAQ2CgHoYAnmCwhOYWgCgJvXijRhMWOABUhWKWwgtG8AGpwAvHPTYAFISKmABgglx7ADwBccFgFcQAIyxQcd+wIu7l4+fvZwAF5BHt5QEqRWAJSJUjIqagCyYi7IABZYbADWcABibuwwwFpwpiWcOikSmtrwAEoAjIZwugB0eQWFpkjOcO14gXAATHhRcADMZI1pAMownCxEnFAky2z5oi66nBjAmzBKZRVVLDV1DRpaOnCtk126ANq0AH4665vbtAAuj0AG7HU6cc5DOAjMZwCbTSIuBakRJAA))

```typescript
import { Compile, Zod } from '@sinclair/typemap'

// Compile Type

const V = Compile(Zod(`{
   x: number,
   y: number,
   z: number
}`))

// TypeMap: Check Function (Fast)

const R1 = V.Check({ x: 1, y: 2, z: 3 })

// Standard Schema: Validate Function (Fast)

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

