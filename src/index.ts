/*--------------------------------------------------------------------------

@sinclair/typemap

The MIT License (MIT)

Copyright (c) 2024-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

export { type TSyntaxOptions } from './options'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export { type Static } from './static'

// ------------------------------------------------------------------
// Compile
// ------------------------------------------------------------------
export * from './compile/compile'

// ------------------------------------------------------------------
// TypeBox
// ------------------------------------------------------------------
export * from './typebox/typebox-from-syntax'
export * from './typebox/typebox-from-typebox'
export * from './typebox/typebox-from-valibot'
export * from './typebox/typebox-from-zod'
export { type TTypeBox, TypeBox } from './typebox/typebox'

// ------------------------------------------------------------------
// Valibot
// ------------------------------------------------------------------
export * from './valibot/valibot-from-syntax'
export * from './valibot/valibot-from-typebox'
export * from './valibot/valibot-from-valibot'
export * from './valibot/valibot-from-zod'
export { type TValibot, Valibot } from './valibot/valibot'

// ------------------------------------------------------------------
// Zod
// ------------------------------------------------------------------
export * from './zod/zod-from-syntax'
export * from './zod/zod-from-typebox'
export * from './zod/zod-from-valibot'
export * from './zod/zod-from-zod'
export { type TZod, Zod } from './zod/zod'
