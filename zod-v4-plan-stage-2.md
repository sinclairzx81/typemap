# Zod v4 Integration Plan for TypeMap - Updated

This document outlines the remaining tasks needed to complete Zod v4 support in TypeMap.

## Completed Work

The foundational implementation is already complete:

- ✅ Core Zod v4 implementation files in `/src/zod4/`
- ✅ Converters from other types to Zod4
- ✅ Converters from Zod4 to other types
- ✅ Zod4 type detection in guard implementation
- ✅ Core API exports from `index.ts`
- ✅ Compile API integration
- ✅ Basic tests for TypeBox ↔ Zod4 conversion

## Remaining Work

### 1. Testing Enhancements

#### 1.1 Core Unit Tests

- [ ] Create additional tests for Zod v4 detection in `test/zod-detection-test.ts`
  - Expand test coverage for edge cases
  - Test objects with similar properties to Zod types

#### 1.2 End-to-End Testing

- [ ] Create `test/parameters-zod4.ts` to test parameter handling with Zod4
- [ ] Test conversions between all supported type systems (TypeBox, Syntax, Valibot, Zod, Zod4)

### 2. API Adaptation for Zod v4

#### 2.1 Error Handling

- [ ] Update error handling to use `error` parameter instead of `message`
- [ ] Replace `errorMap` with `error` parameter
- [ ] Handle the new error structure in SafeParse results

#### 2.2 String Validation

- [ ] Support top-level validators (e.g., `z.email()` instead of `z.string().email()`)
- [ ] Add support for separate IP validators (`z.ipv4()`, `z.ipv6()`)
- [ ] Support new string formats like `z.jwt()`, `z.emoji()`, etc.

#### 2.3 Other API Changes

- [ ] Handle Number type changes (no infinite values, safe integers only)
- [ ] Support Object method changes (`z.strictObject()` and `z.looseObject()`)
- [ ] Implement support for `z.nonoptional()` and `z.prefault()`

### 3. Documentation

- [ ] Update README.md with Zod v4 support information
- [ ] Document the detection mechanism for Zod v4 vs Zod v3
- [ ] Create usage examples for Zod v4 features
- [ ] Document any known limitations or edge cases

### 4. Performance Optimization

- [ ] Benchmark Zod v4 conversions against Zod v3 equivalents
- [ ] Optimize critical conversion paths if needed

### 5. Final Integration

- [ ] Add test coverage requirements for Zod v4 code
- [ ] Prepare for release (beta and stable versions)

## Implementation Note

Direct conversions between Zod v3 and Zod v4 types remain **out of scope**. Users should utilize intermediate formats (like Syntax or TypeBox) for conversion between Zod versions.
