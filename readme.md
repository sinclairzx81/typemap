<div align='center'>

<h1>TypeBox Adapter</h1>

<p>Integrate Valibot and Zod with TypeBox</p>

<img src="https://raw.githubusercontent.com/sinclairzx81/typebox-adapter/refs/heads/main/typebox-adapter.png" />

<br />
<br />

[![npm version](https://badge.fury.io/js/%40sinclair%2Ftypebox-adapter.svg?1)](https://badge.fury.io/js/%40sinclair%2Ftypebox-adapter)
[![Downloads](https://img.shields.io/npm/dm/%40sinclair%2Ftypebox-adapter.svg)](https://www.npmjs.com/package/%40sinclair%2Ftypebox-adapter)
[![Build](https://github.com/sinclairzx81/typebox-adapter/actions/workflows/build.yml/badge.svg)](https://github.com/sinclairzx81/typebox-adapter/actions/workflows/build.yml)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Install

```bash
$ npm install @sinclair/typebox-adapter --save
```

## Example

TypeBox Adapter converts Valibot and Zod Types into TypeBox compatible schematics

[TypeScript Example](https://www.typescriptlang.org/play/?moduleResolution=99&module=199#code/JYWwDg9gTgLgBAbzgIQgDzgXzgMyhEOAcgAEBnYAOwGMAbAQ2CgHoYBPMAUwCN0BaegBN6YGJyhEAUKEixEcAMox6MYNSy58hUhRoMmrDj3RSZ0eACo49MnABumgsTv1awXjFPhzcKzbgAXo7aARCCUpLMzHAAaq7uEPAwEHAAKkaoaJKS7FyxcAC8isqq1AA8uZwQOLEAfNnUEJRk8DGFKOgAFHYAdBDcAFac1DCdSHATk1PTMzNRcI3Nre0IkhNoAFz2PZQAriDc4p0AlAA0sxeXVxPzE5VbRP1DI0Sna3BsW717B0dn1wDAbc4FBOABHXZMTiCLYAbSIaFexDYSKIASIAF03hMAl8dvtDlAToCSVdgWB8FxYMBOGQtqtMMdjqSWay4MD1vS4PdiD9CUQsNi2cKSRyPlyeUQ+eIBZghSKFZcxbj5JLpRIsO9FdrpsDMFqdYb5vrItEAFphbkpdJcTLZSpwM3tJQqNQVIzVR31SSLFqO9qZToBPqDYajcaG9nRX3wM1bVIAeVDIzKqwm9C2wZaUCoAHMTudI0roun40oc5Rc0LuJmetm8wWi8XJjW0uW80LqLX65XiU2LsCu22YBXc5JGcz+8LjbUgA)

```typescript
import { Box } from '@sinclair/typebox-adapter'

import * as v from 'valibot'
import * as z from 'zod'

// Valibot to TypeBox (Runtime)

const V = Box(v.object({                            // const V = {
  x: v.number(),                                    //   type: 'object',
  y: v.number(),                                    //   required: ['x', 'y', 'z'],
  z: v.number()                                     //   properties: {
}))                                                 //     x: { type: 'number' },
                                                    //     y: { type: 'number' },
                                                    //     z: { type: 'number' }
                                                    //   }
                                                    // }

// Zod to TypeBox (Static)

const Z = Box(z.object({                            // const Z: TObject<{
  a: z.string(),                                    //   a: TString,
  b: z.string(),                                    //   b: TString,
  c: z.string()                                     //   c: TString
}))                                                 // }>
```

## Overview

TypeBox Adapter converts Zod and Valibot types into TypeBox schematics (Json Schema). It performs a deep structural remapping of the types provided by these libraries into TypeScript-aligned Json Schema, enabling integration with industry-standard validators like Ajv and OpenAPI-related technologies, while also facilitating interoperability and acceleration via the TypeBox validation infrastructure.

License MIT

## Contents

- [Install](#Install)
- [Overview](#Overview)
- [Usage](#Usage)
  - [Valibot](#Valibot)
  - [Zod](#Zod)
- [Benchmark](#Benchmark)
- [Contribute](#Contribute)

## Usage

TypeBox Adapter provides a singular Box function to transform Valibot and Zod types into TypeBox schematics. The top-level export is capable of transforming both Valibot and Zod, but you should use the appropriate submodule depending on which library you are using.

### Valibot

Use the `/valibot` submodule if you only have Valibot installed. Refer to the Valibot [documentation](https://valibot.dev/) for more information on this type library.

```typescript
import { Box } from '@sinclair/typebox-adapter/valibot' // Transform Valibot Only

import * as v from 'valibot'

const T = Box(v.string())                               // const T = { type: 'string' }
```

### Zod

Use the `/zod` submodule if you only have Zod installed. Refer to the Zod [documentation](https://zod.dev/) for more information on this type library.

```typescript
import { Box } from '@sinclair/typebox-adapter/zod'     // Transform Zod Only

import * as z from 'zod'

const T = Box(z.string())                               // const T = { type: 'string' }
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

This project is open to community contributions. Please ensure you submit an open issue before creating a pull request. TypeBox and its associated projects encourage open community discussion before accepting new features.

