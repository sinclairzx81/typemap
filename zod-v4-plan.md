# Zod v4 Integration Plan for TypeMap

This document outlines the tasks needed to add Zod v4 support to TypeMap. The implementation will follow the same pattern as the existing Zod (v3) implementation, with adjustments for the changes in Zod v4 as described in the migration guide.

## 1. Package Configuration

- [x] Ensure `package.json` includes `"zod"` as a peer dependency with a version that supports v4 (^3.25.64 or higher). Done! `package.json` has been update to a version that supports `zod/v4`. 

## 2. Create Core Zod4 Files

### 2.1. Main Zod4 Implementation

- [ ] Create `/src/zod4/zod4.ts`
  - Base this on `/src/zod/zod.ts`
  - Change import from `import * as z from 'zod'` to `import { z } from 'zod/v4'`
  - Update type definitions and interfaces as needed
  - Implement the main `Zod4` function that acts as the entry point for Zod4 type creation

### 2.2. Converters from Other Types to Zod4

- [ ] Create `/src/zod4/zod4-from-syntax.ts`
  - Base this on `/src/zod/zod-from-syntax.ts`
  - Update for Zod v4 API changes
  - Implement `TZod4FromSyntax` and `Zod4FromSyntax`

- [ ] Create `/src/zod4/zod4-from-typebox.ts`
  - Base this on `/src/zod/zod-from-typebox.ts`
  - Update for Zod v4 API changes
  - Implement `TZod4FromTypeBox` and `Zod4FromTypeBox`

- [ ] Create `/src/zod4/zod4-from-valibot.ts`
  - Base this on `/src/zod/zod-from-valibot.ts`
  - Update for Zod v4 API changes
  - Implement `TZod4FromValibot` and `Zod4FromValibot`

- [ ] Create `/src/zod4/zod4-from-zod.ts`
  - Base this on `/src/zod/zod-from-zod.ts`
  - Adjust to convert from Zod v3 to Zod v4
  - Implement `TZod4FromZod` and `Zod4FromZod`

- [ ] Create `/src/zod4/zod4-from-zod4.ts`
  - Base this on `/src/zod/zod-from-zod.ts`
  - Adjust to handle Zod v4 types
  - Implement `TZod4FromZod4` and `Zod4FromZod4`

## 3. Create Converters from Zod4 to Other Types

### 3.1. Syntax from Zod4

- [ ] Create `/src/syntax/syntax-from-zod4.ts`
  - Base this on `/src/syntax/syntax-from-zod.ts`
  - Adjust imports to use Zod v4
  - Implement `TSyntaxFromZod4` and `SyntaxFromZod4`

### 3.2. TypeBox from Zod4

- [ ] Create `/src/typebox/typebox-from-zod4.ts`
  - Base this on `/src/typebox/typebox-from-zod.ts`
  - Adjust imports to use Zod v4
  - Implement `TTypeBoxFromZod4` and `TypeBoxFromZod4`

### 3.3. Valibot from Zod4

- [ ] Create `/src/valibot/valibot-from-zod4.ts`
  - Base this on `/src/valibot/valibot-from-zod.ts`
  - Adjust imports to use Zod v4
  - Implement `TValibotFromZod4` and `ValibotFromZod4`

## 4. Update Guard Implementation

- [ ] Update `/src/guard.ts` to include Zod4 type detection
  - Add `IsZod4Type` function to detect Zod4 types

## 5. Update Core API Files

### 5.1. Update Main Export File

- [ ] Update `/src/index.ts` to export the new Zod4 functionality:
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

- [ ] Update `/src/compile/compile.ts` to support compiling Zod4 types
  - Add Zod4 type detection and conversion

## 6. Create Tests

- [ ] Create `/test/typebox-from-zod4.ts`
  - Base on `/test/typebox-from-zod.ts`
  - Test conversion from Zod4 to TypeBox types

- [ ] Create `/test/zod4-from-typebox.ts`
  - Base on `/test/zod-from-typebox.ts`
  - Test conversion from TypeBox to Zod4

- [ ] Create `/test/parameters-zod4.ts` (if needed)
  - Test parameter handling with Zod4

- [ ] Update `/test/index.ts` to include the new tests:
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
