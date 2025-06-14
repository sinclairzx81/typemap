# Zod v4 Integration Plan for TypeMap

This document outlines the tasks needed to add Zod v4 support to TypeMap. The implementation will follow the same pattern as the existing Zod (v3) implementation, with adjustments for the changes in Zod v4 as described in the migration guide.

## 1. Package Configuration

- [x] Ensure `package.json` includes `"zod"` as a peer dependency with a version that supports v4 (^3.25.64 or higher). Done! `package.json` has been update to a version that supports `zod/v4`. 

## 2. Create Core Zod4 Files

### 2.1. Main Zod4 Implementation

- [x] Create `/src/zod4/zod4.ts`
  - Base this on `/src/zod/zod.ts`
  - Change import from `import * as z from 'zod'` to `import { z } from 'zod/v4'`
  - Update type definitions and interfaces as needed
  - Implement the main `Zod4` function that acts as the entry point for Zod4 type creation

### 2.2. Converters from Other Types to Zod4

- [x] Create `/src/zod4/zod4-from-syntax.ts`
  - Base this on `/src/zod/zod-from-syntax.ts`
  - Update for Zod v4 API changes
  - Implement `TZod4FromSyntax` and `Zod4FromSyntax`

- [x] Create `/src/zod4/zod4-from-typebox.ts`
  - Base this on `/src/zod/zod-from-typebox.ts`
  - Update for Zod v4 API changes
  - Implement `TZod4FromTypeBox` and `Zod4FromTypeBox`

- [x] Create `/src/zod4/zod4-from-valibot.ts`
  - Base this on `/src/zod/zod-from-valibot.ts`
  - Update for Zod v4 API changes
  - Implement `TZod4FromValibot` and `Zod4FromValibot`

- [x] Create `/src/zod4/zod4-from-zod.ts`
  - Base this on `/src/zod/zod-from-zod.ts`
  - Adjust to convert from Zod v3 to Zod v4
  - Implement `TZod4FromZod` and `Zod4FromZod`

- [x] Create `/src/zod4/zod4-from-zod4.ts`
  - Base this on `/src/zod/zod-from-zod.ts`
  - Adjust to handle Zod v4 types
  - Implement `TZod4FromZod4` and `Zod4FromZod4`

## 3. Create Converters from Zod4 to Other Types

### 3.1. Syntax from Zod4

- [x] Create `/src/syntax/syntax-from-zod4.ts`
  - Base this on `/src/syntax/syntax-from-zod.ts`
  - Adjust imports to use Zod v4
  - Implement `TSyntaxFromZod4` and `SyntaxFromZod4`

### 3.2. TypeBox from Zod4

- [x] Create `/src/typebox/typebox-from-zod4.ts`
  - Base this on `/src/typebox/typebox-from-zod.ts`
  - Adjust imports to use Zod v4
  - Implement `TTypeBoxFromZod4` and `TypeBoxFromZod4`

### 3.3. Valibot from Zod4

- [x] Create `/src/valibot/valibot-from-zod4.ts`
  - Base this on `/src/valibot/valibot-from-zod.ts`
  - Adjust imports to use Zod v4
  - Implement `TValibotFromZod4` and `ValibotFromZod4`

## 4. Update Guard Implementation

- [x] Update `/src/guard.ts` to include Zod4 type detection
  - Add `IsZod4Type` function to detect Zod4 types
- [ ] Find a property besides `~standard` to differentiate between z and z4, because unfortunately, it seems that the z4 `~standard` was set to be the same as the z3 `~standard` : They are both set to `{vendor: "zod", version: 1}`

#### V4 (`node_modules/zod/dist/esm/v4/core/schemas.js`)

```js
    inst["~standard"] = {
        validate: (value) => {
            try {
                const r = safeParse(inst, value);
                return r.success ? { value: r.data } : { issues: r.error?.issues };
            }
            catch (_) {
                return safeParseAsync(inst, value).then((r) => (r.success ? { value: r.data } : { issues: r.error?.issues }));
            }
        },
        vendor: "zod",
        version: 1,
    };
```

#### V3  (`node_modules/zod/dist/esm/v3/types.js`)
```js

   constructor(def) {
        //...
        this["~standard"] = {
            version: 1,
            vendor: "zod",
            validate: (data) => this["~validate"](data),
        };
    }
```


We will need to find some other property that is new to key off of to differentiate them.

I built a test file `test/test-zod-detection.ts` to evaluate ways we can tell. The output of the script is:

```
5305 typemap ±(zod/v4) ✗  ➜ bun run src/test-zod-detection.ts            [20250614 07:42:24]

--- Zod v3 String ---
Standard property: {
  version: 1,
  vendor: "zod",
  validate: [Function: validate],
}
Has _def: true
Has _zod.def: undefined
Constructor name: ZodString
toString: [object Object]
Prototype chain: [ "ZodString", "ZodType", "Object" ]
Keys: [
  "spa", "_def", "parse", "safeParse", "parseAsync", "safeParseAsync", "refine", "refinement", "superRefine",
  "optional", "nullable", "nullish", "array", "promise", "or", "and", "transform", "brand", "default",
  "catch", "describe", "pipe", "readonly", "isNullable", "isOptional", "~standard"
]
Symbol keys: []

--- Zod v4 String ---
Standard property: {
  validate: [Function: validate],
  vendor: "zod",
  version: 1,
}
Has _def: true
Has _zod.def: false
Constructor name: ZodString
toString: [object Object]
Prototype chain: [ "ZodString", "Object" ]
Keys: [
  "~standard", "def", "check", "clone", "brand", "register", "parse", "safeParse", "parseAsync", "safeParseAsync",
  "spa", "refine", "superRefine", "overwrite", "optional", "nullable", "nullish", "nonoptional", "array",
  "or", "and", "transform", "default", "prefault", "catch", "pipe", "readonly", "describe", "meta", "isOptional",
  "isNullable", "format", "minLength", "maxLength", "regex", "includes", "startsWith", "endsWith",
  "min", "max", "length", "nonempty", "lowercase", "uppercase", "trim", "normalize", "toLowerCase",
  "toUpperCase", "email", "url", "jwt", "emoji", "guid", "uuid", "uuidv4", "uuidv6", "uuidv7", "nanoid",
  "cuid", "cuid2", "ulid", "base64", "base64url", "xid", "ksuid", "ipv4", "ipv6", "cidrv4", "cidrv6", "e164",
  "datetime", "date", "time", "duration"
]
Symbol keys: []
```



## 5. Update Core API Files

### 5.1. Update Main Export File

- [x] Update `/src/index.ts` to export the new Zod4 functionality:
  ```typescript
  // Add to existing exports
  // ------------------------------------------------------------------
  // Zod4
  // ------------------------------------------------------------------
  export * from './zod4/zod4-from-syntax'
  export * from './zod4/zod4-from-typebox'
  export * from './zod4/zod4-from-valibot'
  export * from './zod4/zod4-from-zod'
  export * from './zod4/zod4-from-zod4'
  export { type TZod4, Zod4 } from './zod4/zod4'
  ```

### 5.2. Integration with Compile API

- [x] Update `/src/compile/compile.ts` to support compiling Zod4 types
  - Add Zod4 type detection and conversion (no changes needed as it already works via TypeBox)

## 6. Create Tests

- [x] Create `/test/typebox-from-zod4.ts`
  - Base on `/test/typebox-from-zod.ts`
  - Test conversion from Zod4 to TypeBox types

- [x] Create `/test/zod4-from-typebox.ts`
  - Base on `/test/zod-from-typebox.ts`
  - Test conversion from TypeBox to Zod4

- [ ] Create `/test/parameters-zod4.ts` (if needed)
  - Test parameter handling with Zod4 (will implement if required after testing)

- [x] Update `/test/index.ts` to include the new tests:
  ```typescript
  import './typebox-from-zod4'
  import './zod4-from-typebox'
  // ...other tests
  ```

## 7. Address Zod v4 API Changes

For each of the Zod v4 API changes mentioned in the migration guide, make the necessary adjustments across all the files created above:

### 7.1. Error Customization

- [ ] Update error handling to use `error` parameter instead of `message`
- [ ] Remove usage of `invalid_type_error` and `required_error`
- [ ] Replace `errorMap` with `error` parameter

### 7.2. SafeParse Return Type

- [ ] Update handling of SafeParse result errors to account for errors no longer extending Error

### 7.3. ZodError and Issue Types

- [ ] Update issue format references to use the new streamlined issue formats
- [ ] Update error map handling based on new precedence rules

### 7.4. String Methods

- [ ] Update string validation to use top-level validators (e.g., `z.email()` instead of `z.string().email()`)
- [ ] Update IP validation to use separate `z.ipv4()` and `z.ipv6()` validators
- [ ] Update CIDR handling to use `z.cidrv4()` and `z.cidrv6()`

### 7.5. Other API Changes

- [ ] Handle Number type changes (no infinite values, safe integers only in `z.number().int()`)
- [ ] Update Coerce handling for unknown input types
- [ ] Update Default value handling to match the new behavior
- [ ] Adjust Object method handling (use `z.strictObject()` and `z.looseObject()`)

## 8. Documentation Updates

- [ ] Update README.md to include information about Zod v4 support
- [ ] Add examples for Zod v4 usage
- [ ] Document any differences in behavior between Zod v3 and Zod v4 implementations

## Implementation Strategy

1. Create core files first (zod4.ts and the conversion functions)
2. Implement basic functionality (type conversion without advanced features)
3. Add support for Zod v4 specific features
4. Create and run tests to ensure proper functionality
5. Document the implementation

## Implementation Notes

- All implementations should follow the patterns established in the existing codebase
- Type safety must be maintained throughout
- The new Zod v4 implementation should work alongside the existing Zod v3 implementation
- Pay special attention to the import style difference (`import * as z from 'zod'` vs `import { z } from 'zod/v4'`)
- Consider creating utility functions if there is significant shared code between Zod v3 and Zod v4 implementations

## Possible Challenges

- Handling type differences between Zod v3 and v4
- Ensuring compatibility with TypeBox's type system
- Supporting the new error customization approach
- Handling the new top-level string validation functions
- Maintaining backward compatibility while supporting new features
