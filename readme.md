<div align='center'>

<h1>TypeMap</h1>

<p>Unified Syntax, Mapping and Compiler System for Runtime Types</p>

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

Parse and Compile Types from TypeScript syntax ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgYQuYAbApnAvnAMyjTgHIABAZ2ADsBjDAQ2CgHoYBPMLERsUgFAC6EGpXhQslAK4Z4AXhRowmLAApS4qLQDmcAD5wasjKQCUAOgAKjKJXWkAElgwYIcAOrQMAE3MDWVjhg4MAgUhCIyMjwqNi48ICgiJi42MAUUkAAUgy4MFt7OEoOGhhGAA90rOzcuxwAN0YMaSxE6JaIzOyRMQkpWRgALgKYbRo9Q2NXOEUnFzdPbz8gA))

```typescript
import { Compile } from '@sinclair/typemap'

const result = Compile('string | null').Parse('Hello World')
//     │                 │                      │ 
//     │                 └── parse syntax       └─── parse value
//     │
//     └── const result: string | null = 'Hello World'
```

## Overview

TypeMap is an syntax frontend and compiler backend for the [TypeBox](https://github.com/sinclairzx81/typebox), [Valibot](https://github.com/fabian-hiller/valibot) and [Zod](https://github.com/colinhacks/zod) type libraries. It provides a common TypeScript syntax for type construction across libraries, a runtime compiler for high-performance validation and provides type translation from one library to another.

TypeMap is written to be an advanced adapter and type translation system for the TypeBox project. It is designed specifically to integrate and accelerate remote type libraries on Json Schema compatible infrastructure as well as to enable TypeBox schematics to be remapped to remote type library infrastructure. This project also provides high-performance validation for frameworks that orientate around the [Standard Schema](https://github.com/standard-schema/standard-schema) TypeScript interface.

License: MIT

## Contents

- [Install](#Install)
- [Usage](#Usage)
- [Overview](#Overview)
- [Example](#Example)
- [Mapping](#Mapping)
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

Use a TypeScript syntax to create types for TypeBox, Valibot and Zod ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAagIYA2wARhDIQFoQAmcAvnAGZQQhwDkAAgGdgAOwDGZEsCgB6GOgwgSYXgChVMmXAAKJKIIxwAyqhEwSuOAB8deg8XIBXQ+rEQRg+ACU4AXjgMjAAUvJ5QogDm1nAijiCUGFC8AJQAdGB2GCGpOSlw+QVwmnBuHt4AXHBhkdGx8YnqxWiYRmLhYPAmZhau7p7GfnAABgiq+biVdQlQ+GNwqJNx07P5AF6L9VCqLEO9ZSiDzdh4QUbJhReXV9f5xaX9yJXIAPKUAFYYYjAAPKM3-wDAf9iuMngA5JaJFZAmGwm4g+bgyEzOZwtFohHrFAQzao9H4wHFFgAPj2-SIg1IFGoMFO5wJALufXgREqrw+X1aAAtFCRfniGYKLgiJnAcdNubzvjlUsToUKFQUEQsxcjJUppTk5QLFYLMZVxYl1XyZaTdbqiYRTepVPd4HRBoE6eb4Vo7QFKoF2Z8fn8XUKRZ6mIaUf6A1p8irAiH5WH8fqAsHkTq47DLXBTUA))

```typescript
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

// Parse Syntax | Parse Value 

const R = Zod('string | number').parse('...')       // const R: string | number

// TypeScript Syntax

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

Translate TypeBox, Valibot and Zod types ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAagIYA2wARhDIQFoQAmcAvnAGZQQhwDkAAgGdgAOwDGZEsCgB6GOgwgSYXgChVMmXADKqETBK44AWgB8cBszPFyVGifNpMOXOrEQRg+MjgBeFAouABSkFNQwQZZBAAYIqnBwuABccCIAriCUGFD48XCoKemZ2bkJAF6FGVlQqizRAJSNQA))

```typescript
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

// Syntax -> Zod -> Valibot -> TypeBox

const T = TypeBox(Valibot(Zod(`{
  x: number,
  y: number,
  z: number
}`)))
```

Compile Valibot and Zod types on TypeBox validation infrastructure. ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgYQuYAbApnAvnAMyjTgHIABAZ2ADsBjDAQ2CgHoYBPMLERsUgFADQkWHABehYiDLiIAE0EDWrOAC0FcACpcsQuhBqV4auAF4JAOggAjAFZY6MABRI47j56-efHlXAMjEwAudQUAeXtHGAAeNwF3AA9Q8UsaAFcQGywoZwBKABpfYpLi-yTQjXkAOUzsqCLPBLgOFLS6nPzG0p7S8pbKhVqsnILm8TaMkdzC3rmy1XcJsJqOqAFcPPntnfd-XAA+IX8AJR4+OEYaeRQ0MEw9AUDjFHNb9GxnNS3d3v9n+DIUIANUYGGA8kYMGgMS0kQcTji7mav1RfUWcGS2mG9W6yLRBIWHla2LWY0JFK8-WWWhxORRlIp+wOR2UqgAEsAAOYAC20POI6V5EHS8FB4MhMGAhn0hheJzeyEsyB5jgA1q5GT5-ABJGA5KHSoyhACMAAYAPpm61W63NLEmvFauYqZokgBMTudPX8VV8oQALNazSBKHBnHwwMREnlxqEAMzenb+HTcACyFw8gZDYfcEbAUYgMY2eSAA))

```typescript
import { Compile } from '@sinclair/typemap'

import z from 'zod'

// Zod Type

const Z = z.object({                                // const Z: ZodObject<{  
  x: z.number(),                                    //   x: ZodNumber,     
  y: z.number(),                                    //   y: ZodNumber,
  z: z.number(),                                    //   z: ZodNumber
})                                                  // }>

// Remap and Compile

const C = Compile(Z)                                // const C: Validator<TObject<{  
                                                    //   x: TNumber,     
                                                    //   y: TNumber,
                                                    //   z: TNumber
                                                    // }>>

// High Throughout Validation

const R = C.Check({                                 // Iterations: 10_000_000
  x: 1,                                             //
  y: 2,                                             // Zod        : 4000ms (approx)
  z: 3                                              // TypeMap    : 40ms   (approx)
})
```

## Mapping

TypeMap is primarily a mapping system used for type translation. It provides a mapping function per library which is used to translate remote types into types specific to that library. If no translation is possible, these functions return a `never` representation specific to the library being mapped.

### TypeBox

Use the `TypeBox` function to translate types and syntax into TypeBox types.

```typescript
import { TypeBox } from '@sinclair/typemap'

const S = type('string[]')                          // const S: TArray<TString> (Syntax)
const T = type(t.Number())                          // const T: TNumber         (TypeBox)
const V = type(v.string())                          // const V: TString         (Valibot)
const Z = type(z.boolean())                         // const Z: TBoolean        (Zod)

```

### Valibot

Use the `Valibot` function to translate types and syntax into Valibot types.

```typescript
import { Valibot } from '@sinclair/typemap'

const S = Valibot('string[]')                       // const S: v.ArraySchema<...> (Syntax)
const T = Valibot(t.Number())                       // const T: v.NumberSchema     (TypeBox)
const V = Valibot(v.string())                       // const V: v.StringSchema     (Valibot)
const Z = Valibot(z.boolean())                      // const Z: v.BooleanSchema    (Zod)
```

### Zod

Use the `Zod` function to translate types and syntax into Zod types.

```typescript
import { Zod } from '@sinclair/typemap'

const S = Zod('string[]')                           // const S: z.ZodArray<...> (Syntax)
const T = Zod(t.Number())                           // const T: z.ZodNumber     (TypeBox)
const V = Zod(v.string())                           // const V: z.ZodString     (Valibot)
const Z = Zod(z.boolean())                          // const Z: z.ZodBoolean    (Zod)
```

## Syntax

TypeMap provides a TypeScript syntax parser that can be used to create library types. TypeScript parsing is implemented at runtime as well as in the TypeScript type system. It is provided as a convenient means of creating and composing library types under a common syntax. Be mindful, syntax parsing in the type system can reduce inference performance. 

### Types

Syntax types can be created by passing a string parameter to any library mapping function. TypeMap supports most TypeScript annotation syntax. If the string contains a syntax error, the function will return a `never` type. ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA84C+cAZlBCHAOQACAzsAHYDGANgIbBQD0M6GIbMJQBQwphAa14yOAF4UfHLgAUlJLgBccAIyFKASjhHjJ02aNcucQCjkgeD+44ydK3IA8gCMAVhiYwAPEjC5sEhoWHmlsaaKAAywDAYUGwsftoAfEHhWdnhkQQZYhJScADKcgqYSqoAhLUGOVmRgDLkDkXwJS4AchgAbolAA))

```typescript
import { TypeBox } from '@sinclair/typemap'

const T = TypeBox('{ x: 1 }')                       // const T: TObject<{ 
                                                    //   x: TLiteral<1>
                                                    // }>

const S = TypeBox('!!!')                            // const S: TNever
```

### Options

Options can be passed on the last parameter of a type. TypeMap will translate known Json Schema keywords into appropriate runtime representations if possible. ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAWhACZwC+cAZlBCHAOQACAzsAHYDGANgIbAoAehjoMIPmEYAoaUKFwuEDq3jIAXCgDKMKJwDmcALyI4ozJsaq9HfY0LVoEmJfECejSrKUq1xlGI4uAAUVroG9qaOUM6uEsAelACUsvKKyqpwWv4AXgB0EABGAFYYXDDBSLia+RwAriCFGFDBScl51sDlrd4Z8NkmJKShVZr1jc2UkUh8pKTAMMDKfDwACnSYsMAYrJrUK6wYyUA))

```typescript
import { TypeBox, Zod } from '@sinclair/typemap'

const T = TypeBox('string', {                      // const T: TString = {
  format: 'email'                                  //   type: 'string',
})                                                 //   format: 'email'
                                                   // }


const S = Zod('{ x: number }', {                    // const S = z.object({ 
  additionalProperties: false                       //   x: z.number() 
})                                                  // }).strict()
```

### Parameters

Types can be parameterized to accept exterior types. ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgNQIYBtgCMIwDRwBaEAJnAL5wBmUEIcA5AAIDOwAdgMbqrBQD0MAJ5gApiFRgGAKGmcI7FvAAqcALwoM2XAAoG7AK4gsoqAwCUcK9f784AUQAeMU8GhxlI0bPmL4AZXUiUh0kVXICAAMkRwAuDwpIy1tgkgB5LAArUU4YAB4Y+OISADkjEygKAiQAOjqKAD4gA))

```typescript
import { Valibot, Zod } from '@sinclair/typemap'

const T = Valibot('number')                         // const T: NumberSchema

// Parameter T auto remapped to target library

const S = Zod({ T }, `{ x: T }`)                    // const S: ZodObject<{ 
                                                    //   x: ZodNumber 
                                                    // }, { ... }>
```

### Generics

Use parameterized types with functions to create generic types ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgFQJ5gKYCEIA8A0cAagIYA2wARhDIQFoQAmcAvnAGZQQhwDkAAgGdgAOwDGZEsCgB6GOgwgSYXgChVMmXADiGERijAxKBerEQRg+EQxiY0OAF44AHmRwMuGHsaC4ESgArWxgAPgAKZAAuFABKJ1CTTBxccKR3FkIAAyRVODhcGORCPLhUIpL8gC8iuFUWLNj1TTgASUsYEnEMZjRMQTMLKxQnYhDocNIKahhw3hEAVxBKA15Y+PzNre38lvMOlCKAeSCQlwRSnavrm9vblvzClAA5JZWoSruv75+4B7Kiq9lgZ8JdfuCIX8tNVAW8QWDIYi7i0WKFBgcAMqjGx2CYMRhzKyGEQAczWG0ReyG8Axx1OdnOCKRzJ2-yeyAxMGJJM+LL523+5RQnO5oP54s2-xqwq5oh5TIlSJRoSAA))

```typescript
import { TypeBox, Valibot, Zod } from '@sinclair/typemap'

// Generic Type

const Vector = <T extends object>(T: T) => TypeBox({ T }, `{ 
  x: T, 
  y: T, 
  z: T 
}`)

// Instanced Types

const T = Vector(Valibot('number'))                 // const T: TObject<{
                                                    //   x: TNumber, 
                                                    //   y: TNumber,
                                                    //   z: TNumber,
                                                    // }>

const S = Vector(Zod('string'))                     // const S: TObject<{
                                                    //   x: TString, 
                                                    //   y: TString,
                                                    //   z: TString,
                                                    // }>
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

Use the `Compile` function to compile Zod and Valibot on TypeBox validation infrastructure. ([Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgYQuYAbApgGjgLQgBM4BfOAMyjTgHIABAZ2ADsBjDAQ2CgHoYAnmCwhOYWgCgJvXijRhMWOABUhWKWwgtG8AGpwAvHPTYAFISKmABgglx7ADwBccFgFcQAIyxQcd+wIu7l4+fvZwAF5BHt5QEqRWAJSJUjIqagCyYi7IABZYbADWcABibuwwwFpwpiWcOikSmtrwAEoAjIZwugB0eQWFpkjOcO14gXAATHhRcADMZI1pAMownCxEnFAky2z5oi66nBjAmzBKZRVVLDV1DRpaOnCtk126ANq0AH4665vbtAAuj0AG7HU6cc5DOAjMZwCbTSIuBakRJAA))

```typescript
import { Compile, Zod } from '@sinclair/typemap'

// Compile Validator From Zod

const validator = Compile(Zod(`{
   x: number,
   y: number,
   z: number
}`))

const R1 = validator.Check({ x: 1, y: 2, z: 3 })

// Standard Schema
//
// ... which should have been named 'Standard Validator'

const R2 = validator['~standard'].validate({ x: 1, y: 2, z: 3 })
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

