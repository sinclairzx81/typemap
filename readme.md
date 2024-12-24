<div align='center'>

<h1>TypeBox Adapter</h1>

<p>Integrate Valibot and Zod with TypeBox</p>

<img src="https://raw.githubusercontent.com/sinclairzx81/typebox-adapter/refs/heads/main/typebox-adapter.png" />

<br />
<br />

[![npm version](https://badge.fury.io/js/%40sinclair%2Ftypebox-adapter.svg)](https://badge.fury.io/js/%40sinclair%2Ftypebox-adapter)
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

TypeBox Adapter is a library that transforms Zod and Valibot types into TypeBox compatiable schematics. It works by structurally remapping the types provided by these libraries both statically and at runtime, enabling them to integrate with TypeBox infrastructure as well as making them compatible with industry standard Json Schema validators like Ajv.

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

Use the `/valibot` submodule if you only have Valibot installed.

```typescript
import { Box } from '@sinclair/typebox-adapter/valibot' // Transform Valibot Only

import * as v from 'valibot'

const T = Box(v.string())                             // const T = { type: 'string' }
```

Refer to the Valibot [documentation](https://valibot.dev/) for more information on this type library.

### Zod

Use the `/zod` submodule if you only have Zod installed.

```typescript
import { Box } from '@sinclair/typebox-adapter/zod'     // Transform Zod Only

import * as z from 'zod'

const T = Box(z.string())                             // const T = { type: 'string' }
```

Refer to the Zod [documentation](https://zod.dev/) for more information on this type library.



## Benchmark

This project manages a benchmark that runs type check performance using Zod, Valibot and TypeBox validators. The benchmark is setup to run 1 million check operations per library and validator pairing and reports the elapsed time taken to complete.

### Type

```typescript
const T = { x: number, y: number, z: number }
```

### Results
```typescript
┌─────────┬────────────────┬────────────────────┬────────────┬────────────┐
│ (index) │ library        │ using              │ iterations │ elapsed    │
├─────────┼────────────────┼────────────────────┼────────────┼────────────┤
│ 0       │ 'valibot     ' │ 'valibot         ' │ 1000000    │ '378 ms  ' │
│ 1       │ 'valibot     ' │ 'typebox:value   ' │ 1000000    │ '125 ms  ' │
│ 2       │ 'valibot     ' │ 'typebox:compile ' │ 1000000    │ '4 ms    ' │
└─────────┴────────────────┴────────────────────┴────────────┴────────────┘
┌─────────┬────────────────┬────────────────────┬────────────┬────────────┐
│ (index) │ library        │ using              │ iterations │ elapsed    │
├─────────┼────────────────┼────────────────────┼────────────┼────────────┤
│ 0       │ 'zod         ' │ 'zod             ' │ 1000000    │ '444 ms  ' │
│ 1       │ 'zod         ' │ 'typebox:value   ' │ 1000000    │ '127 ms  ' │
│ 2       │ 'zod         ' │ 'typebox:compile ' │ 1000000    │ '5 ms    ' │
└─────────┴────────────────┴────────────────────┴────────────┴────────────┘
```

For community benchmarks, refer to the [runtime-type-benchmarks](https://github.com/moltar/typescript-runtime-type-benchmarks) project.

## Contribute

This project is open to community contribution. Please ensure you submit an open issue before submitting your pull request. TypeBox and associated projects prefer open community discussion before accepting new features.

