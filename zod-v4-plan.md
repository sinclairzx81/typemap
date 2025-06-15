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

- [ ] ~~Create `/src/zod4/zod4-from-zod.ts`~~ (Out of scope - see Project Scope section)

- [x] Create `/src/zod4/zod4-from-zod4.ts`
  - Base this on `/src/zod/zod-from-zod.ts`
  - Identity conversion for Zod v4 types
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
- [x] Find a property besides `~standard` to differentiate between z and z4, because unfortunately, it seems that the z4 `~standard` was set to be the same as the z3 `~standard` : They are both set to `{vendor: "zod", version: 1}`

### 4.1. Differentiating Between Zod v3 and Zod v4

After analyzing both Zod v3 and Zod v4 objects through `test/test-zod-detection.ts`, we found several reliable differences:

1. **Prototype chain differences**: 
   - Zod v3: `["ZodString", "ZodType", "Object"]` 
   - Zod v4: `["ZodString", "Object"]` (No `ZodType` in chain)

2. **Property differences**:
   - Zod v4 has `def` property
   - Zod v3 has `_def` property

3. **Method availability**:
   - Zod v4 has many additional methods like `meta`, `format`, etc.
   - These methods don't exist in Zod v3

To solve the detection problem, we extracted the common detection logic into a helper function and added specific checks for each version:

```typescript
// Common detection for any Zod-like object
function IsZodVendor(type: unknown): boolean {
  if (!t.ValueGuard.IsObject(type)) return false;
  if (!t.ValueGuard.HasPropertyKey(type, '~standard')) return false;
  
  const standardProp = (type as any)['~standard'];
  if (!t.ValueGuard.IsObject(standardProp)) return false;
  if (!t.ValueGuard.HasPropertyKey(standardProp, 'vendor')) return false;
  
  return standardProp.vendor === 'zod';
}

// Zod v3 detection
export function IsZod(type: unknown): type is z.ZodTypeAny {
  if (!IsZodVendor(type)) return false;
  
  const obj = type as Record<string, unknown>;
  
  return (
    t.ValueGuard.HasPropertyKey(obj, '_def') &&
    !t.ValueGuard.HasPropertyKey(obj, 'meta')
  );
}

// Zod v4 detection
export function IsZod4(type: unknown): type is z4.ZodTypeAny {
  if (!IsZodVendor(type)) return false;
  
  const obj = type as Record<string, unknown>;
  
  return (
    t.ValueGuard.HasPropertyKey(obj, 'def') &&
    t.ValueGuard.HasPropertyKey(obj, 'meta')
  );
}
```

This implementation:
1. First checks if the object has the general Zod structure (vendor === 'zod')
2. Then applies specific checks for each version:
   - For Zod v3: Has `_def` property and does not have `meta` method
   - For Zod v4: Has `def` property and has `meta` method

We've created a test file `test/zod-detection-test.ts` to verify this approach works correctly for both versions.



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

## 5. Testing and Validation

### 5.1. Core Unit Tests

- [x] Run existing unit tests to ensure backward compatibility
- [ ] Add specific tests for Zod v4 detection and differentiation from Zod v3
- [ ] Test edge cases, like handling objects with similar properties to Zod types

### 5.2. End-to-End Testing

- [ ] Create sample applications that use both Zod v3 and Zod v4 simultaneously
- [ ] Test conversions between all supported type systems (TypeBox, Syntax, Valibot, Zod, Zod4)
- [ ] Validate that type information is properly preserved during conversions

## 6. Performance Optimization

- [ ] Benchmark Zod v4 conversions against Zod v3 equivalents
- [ ] Identify any performance bottlenecks in the conversion process
- [ ] Optimize critical paths for better performance
- [ ] Consider caching strategies for frequent conversions

## 7. Address Zod v4 API Changes

For each of the Zod v4 API changes mentioned in the migration guide, make the necessary adjustments across all the files created above:

### 7.1. Error Customization

- [ ] Update error handling to use `error` parameter instead of `message`
- [ ] Remove usage of `invalid_type_error` and `required_error`
- [ ] Replace `errorMap` with `error` parameter

### 7.2. SafeParse Return Type

- [ ] Update handling of SafeParse result errors to account for errors no longer extending Error
- [ ] Adapt error handling patterns for the new error structure

### 7.3. ZodError and Issue Types

- [ ] Update issue format references to use the new streamlined issue formats
- [ ] Update error map handling based on new precedence rules
- [ ] Handle the simplified issue types in validation logic

### 7.4. String Methods

- [ ] Update string validation to use top-level validators (e.g., `z.email()` instead of `z.string().email()`)
- [ ] Update IP validation to use separate `z.ipv4()` and `z.ipv6()` validators
- [ ] Update CIDR handling to use `z.cidrv4()` and `z.cidrv6()`
- [ ] Implement new string formats like `z.jwt()`, `z.emoji()`, etc.

### 7.5. Other API Changes

- [ ] Handle Number type changes (no infinite values, safe integers only in `z.number().int()`)
- [ ] Update Coerce handling for unknown input types
- [ ] Update Default value handling to match the new behavior
- [ ] Adjust Object method handling (use `z.strictObject()` and `z.looseObject()`)
- [ ] Implement support for `z.nonoptional()` method
- [ ] Handle `z.prefault()` and other new methods

## 8. Documentation Updates

### 8.1. User Documentation

- [ ] Update README.md to include information about Zod v4 support
- [ ] Add examples for Zod v4 usage
- [ ] Document any differences in behavior between Zod v3 and Zod v4 implementations
- [ ] Create a migration guide for users moving from Zod v3 to Zod v4 with TypeMap

### 8.2. API Documentation

- [ ] Update API docs with new Zod4 types and functions
- [ ] Document the detection mechanism for Zod v4 vs Zod v3
- [ ] Create usage examples for all new Zod v4 features
- [ ] Document any known limitations or edge cases

## 9. Final Integration Steps

### 9.1. Package Updates

- [ ] Update package.json with correct peer dependencies
- [ ] Include Zod v4 in the build and bundling process
- [ ] Update the exports configuration for proper module resolution

### 9.2. CI/CD Integration

- [ ] Update GitHub Actions workflows to include Zod v4 tests
- [ ] Add test coverage requirements for Zod v4 code
- [ ] Add specific test suites for Zod v3/v4 interoperability

### 9.3. Release Management

- [ ] Determine versioning strategy (major vs minor version bump)
- [ ] Plan a beta release cycle for early adopter feedback
- [ ] Create release notes highlighting Zod v4 support

## 10. Implementation Strategy

1. Create core files first (zod4.ts and the conversion functions)
2. Implement basic functionality (type conversion without advanced features)
3. Add support for Zod v4 specific features
4. Create and run tests to ensure proper functionality
5. Optimize detection and conversion logic
6. Document the implementation
7. Release beta version for community feedback
8. Finalize and release stable version

## 11. Implementation Notes

- All implementations should follow the patterns established in the existing codebase
- Type safety must be maintained throughout
- The new Zod v4 implementation should work alongside the existing Zod v3 implementation
- Pay special attention to the import style difference (`import * as z from 'zod'` vs `import { z } from 'zod/v4'`)
- Consider creating utility functions if there is significant shared code between Zod v3 and Zod v4 implementations

## 12. Possible Challenges and Solutions

### 12.1. Type Detection Challenges

- **Challenge**: Reliably differentiating between Zod v3 and Zod v4 types
- **Solution**: Use multiple property checks as implemented in `IsZod4`

### 12.2. API Compatibility 

- **Challenge**: Handling Zod v4's substantial API differences from Zod v3
- **Solution**: Implement separate, independent converters for each version rather than direct conversions between them

### 12.3. Performance Concerns

- **Challenge**: Ensuring detection and conversion performance is optimized
- **Solution**: Implement caching and optimize type checking logic

### 12.4. Error Handling

- **Challenge**: Supporting the new error customization approach
- **Solution**: Create wrappers for error handling that adapt to both styles

### 12.5. New Features

- **Challenge**: Handling the new top-level string validation functions
- **Solution**: Map these to appropriate representations in other type systems

## 13. Timeline and Milestones

- **Milestone 1**: Core implementation (Sections 1-4) - Completed
- **Milestone 2**: Testing and optimization (Sections 5-6) - Week of June 21, 2025
- **Milestone 3**: API changes and documentation (Sections 7-8) - Week of June 28, 2025
- **Milestone 4**: Final integration and release (Sections 9) - Week of July 5, 2025

## Project Scope

### Direct Zod v3 and Zod v4 Conversions

After careful consideration, direct conversions between Zod v3 and Zod v4 types have been deemed **out of scope** for this implementation. This decision is based on:

1. The significant differences between Zod v3 and v4 APIs would make direct conversions complex and error-prone
2. Users should instead utilize intermediate formats (like Syntax or TypeBox) for conversion if needed
3. If direct conversions were simple, the Zod maintainers would likely have provided them already

This means the following files are no longer needed and should be removed:
- `/src/zod4/zod4-from-zod.ts` 
- `/src/zod/zod-from-zod4.ts` (if exists)

TypeMap will continue to support both Zod v3 and Zod v4 independently, allowing users to convert between each version and other supported type systems.
