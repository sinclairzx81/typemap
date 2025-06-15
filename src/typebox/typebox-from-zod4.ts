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

import * as t from '@sinclair/typebox'
import { z } from 'zod/v4'
import { combineRegExpHack } from '../regexp.js'
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
function Options(type: z.ZodType): t.SchemaOptions {
  const description = typeof type.description === 'undefined' ? {} : { description: type.description }
  return { ...description }
}
// ------------------------------------------------------------------
// Formats
// ------------------------------------------------------------------
const check = (type: z.ZodType, value: unknown) => type.safeParse(value).success
// Register formats for Zod4 validators
// Note: In Zod v4, string formats are top-level functions rather than methods
// Types defined in zod/v4: 
// // "email" | "url" | "emoji" | "uuid" | "guid" | "nanoid" | "cuid" | "cuid2" | "ulid" | "xid" | "ksuid" | "datetime" | "date" | "time" | "duration" | "ipv4" | "ipv6" | "cidrv4" | "cidrv6" | "base64" | "base64url" | "json_string" | "e164" | "lowercase" | "uppercase" | "regex" | "jwt" | "starts_with" | "ends_with" | "includes";
t.FormatRegistry.Set('base64', (value) => check(z.base64(), value))
t.FormatRegistry.Set('base64url', (value) => check(z.base64url(), value))
t.FormatRegistry.Set('cidrv4', (value) => check(z.cidrv4(), value))
t.FormatRegistry.Set('cidrv6', (value) => check(z.cidrv6(), value))
t.FormatRegistry.Set('cuid', (value) => check(z.cuid(), value))
t.FormatRegistry.Set('cuid2', (value) => check(z.cuid2(), value))
t.FormatRegistry.Set('date', (value) => check(z.iso.date(), value))
t.FormatRegistry.Set('datetime', (value) => check(z.iso.datetime(), value))
t.FormatRegistry.Set('time', (value) => check(z.iso.time(), value))
t.FormatRegistry.Set('duration', (value) => check(z.iso.duration(), value))
t.FormatRegistry.Set('email', (value) => check(z.email(), value))
t.FormatRegistry.Set('emoji', (value) => check(z.emoji(), value))
t.FormatRegistry.Set('ipv4', (value) => check(z.ipv4(), value))
t.FormatRegistry.Set('ipv6', (value) => check(z.ipv6(), value))
t.FormatRegistry.Set('nanoid', (value) => check(z.nanoid(), value))
t.FormatRegistry.Set('ulid', (value) => check(z.ulid(), value))
t.FormatRegistry.Set('url', (value) => check(z.url(), value))
t.FormatRegistry.Set('uuid', (value) => check(z.uuid(), value))
// ------------------------------------------------------------------
// Any
// ------------------------------------------------------------------
type TFromAny<Result = t.TAny> = Result
function FromAny(_type: z.ZodAny): t.TSchema {
  return t.Any(Options(_type))
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
type TFromArray<Type extends z.ZodType, Result = t.TArray<TFromType<Type>>> = Result
function FromArray(type: z.ZodArray<any>): t.TSchema {
  const items = FromType(type.element)
  const constraints = {}
  return t.Array(items, { ...Options(type), ...constraints })
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
type TFromBigInt<Result = t.TBigInt> = Result
function FromBigInt(type: z.ZodBigInt): t.TSchema {
  return t.BigInt(Options(type))
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
type TFromBoolean<Result = t.TBoolean> = Result
function FromBoolean(type: z.ZodBoolean): t.TSchema {
  return t.Boolean(Options(type))
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
type TFromDate<Result = t.TDate> = Result
function FromDate(type: z.ZodDate): t.TSchema {
  return t.Date(Options(type))
}
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
function FromEnum(type: z.ZodEnum): t.TSchema {
  return t.Enum(type.enum, Options(type))
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
type TFromIntersect<Left extends z.ZodType, Right extends z.ZodType, Result = t.TIntersect<[TFromType<Left>, TFromType<Right>]>> = Result
function FromIntersect(type: z.ZodIntersection): t.TSchema {
  const left = FromType(type.def.left as z.ZodType)
  const right = FromType(type.def.right as z.ZodType)
  return t.Intersect([left, right], Options(type))
}
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
type TFromLiteral<Type extends string | number | boolean, Result = t.TLiteral<Type>> = Result
function FromLiteral(type: z.ZodLiteral<any>): t.TSchema {
  return t.Literal(type.value, Options(type))
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
type TFromNull<Result = t.TNull> = Result
function FromNull(type: z.ZodNull): t.TSchema {
  return t.Null(Options(type))
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
type TFromNumber<Result = t.TNumber> = Result
function FromNumber(type: z.ZodNumber): t.TSchema {
  const constraints = {}
  // In Zod4 check minValue and maxValue properties if available
  if (type.minValue !== null) {
    Object.assign(constraints, { minimum: type.minValue })
  }
  if (type.maxValue !== null) {
    Object.assign(constraints, { maximum: type.maxValue })
  }
  if (type.format === 'int' || type.format === 'integer') {
    Object.assign(constraints, { type: 'integer' })
  }
  return t.Number({ ...Options(type), ...constraints })
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
function FromObject(type: z.ZodObject<any>): t.TSchema {
  // Extract properties from Zod object type
  const properties: Record<string, t.TSchema> = {}
  const required: string[] = []
  
  for (const [key, schema] of Object.entries(type.def.shape)) {
    const zschema = schema as z.ZodType
    properties[key] = FromType(zschema)
    // Check if property is optional
    if (!zschema.isOptional()) {
      required.push(key)
    }
  }
  
  let objectOptions: t.SchemaOptions = { ...Options(type) }
  
  // Handle strict vs loose objects (additionalProperties)
  if (type.constructor.name === 'ZodStrictObject') {
    objectOptions = { ...objectOptions, additionalProperties: false }
  }
  
  return t.Object(properties, { ...objectOptions, required })
}
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
type TFromOptional<Type extends z.ZodType, Result = t.TOptional<TFromType<Type>>> = Result
function FromOptional(type: z.ZodOptional): t.TSchema {
  // Get the inner type and convert it first
  const innerType = type.def.innerType as z.ZodType;

  // Default handling for other types
  return t.Optional(FromType(innerType));
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
function FromRecord(type: z.ZodRecord): t.TSchema {
  // Handle key and value types
  const keyType = t.String()
  const valueType = FromType(type.def.valueType as z.ZodType)
  
  return t.Record(keyType, valueType, Options(type))
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
type TFromString<Result = t.TString> = Result

function IsStringDef(def: z.core.$ZodTypeDef): def is z.core.$ZodStringDef {
  return 'type' in def && def.type === 'string';
}
function IsStringInternals(type: z.ZodType): type is z.ZodType & {_zod: z.core.$ZodStringInternals<unknown>} {
  return IsStringDef(type.def) && IsStringDef(type._zod.def);
}

function IsStringFormatDef(def: z.core.$ZodStringDef): def is z.core.$ZodStringFormatDef {
  return 'format' in def && typeof def.format === 'string'
    && ('pattern' in def ? def.pattern instanceof RegExp : true);
}

function FromStringLike(
  type: z.ZodType & { _zod: z.core.$ZodStringInternals<unknown> }
): t.TSchema {
  const def = type._zod.def;
  const _zod = type._zod as z.core.$ZodStringInternals<unknown>;
  const coerce = def.coerce;
  const checkPatterns =
    def.checks && def.checks.length > 0 ? getExtraPatterns(def.checks) : [];
  // bag parsing
  const bag = _zod.bag;
  const bagPatterns = bag?.patterns ? Array.from(bag.patterns) : [];
  const minLength = bag?.minimum;
  const maxLength = bag?.maximum;
  // string format
  const format = IsStringFormatDef(def)
    ? (def.format ?? bag?.format)
    : bag?.format;
  const fmtPattern = IsStringFormatDef(def) ? def.pattern : undefined;
  const contentEncoding = bag?.contentEncoding;
  const pattern = combineRegExpHack(
    fmtPattern,
    ...checkPatterns,
    ...bagPatterns
  );
  const options: t.StringOptions = {
    ...Options(type),
    pattern,
    minLength,
    maxLength,
    format,
    contentEncoding,
    coerce,
  };
  return t.String(options);
}


// ------------------------------------------------------------------
// String Formats
// ------------------------------------------------------------------
//
// | Format         | Special Properties in Internals (if any)         |
// |----------------|--------------------------------------------------|
// | email          | None                                             |
// | url            | `hostname?: RegExp`, `protocol?: RegExp`         |
// | emoji          | None                                             |
// | uuid           | `version?: "v1" \| "v2" \| "v3" \| "v4" \| "v5" \| "v6" \| "v7" \| "v8"` |
// | guid           | None                                             |
// | nanoid         | None                                             |
// | cuid           | None                                             |
// | cuid2          | None                                             |
// | ulid           | None                                             |
// | xid            | None                                             |
// | ksuid          | None                                             |
// | datetime       | `precision: number \| null`, `offset: boolean`, `local: boolean` |
// | date           | None                                             |
// | time           | `precision?: number \| null`                     |
// | duration       | None                                             |
// | ipv4           | `version?: "v4"`                                 |
// | ipv6           | `version?: "v6"`                                 |
// | cidrv4         | `version?: "v4"`                                 |
// | cidrv6         | `version?: "v6"`                                 |
// | base64         | None                                             |
// | base64url      | None                                             |
// | json_string    | None (not defined as a schema in your list, only as a format) |
// | e164           | None                                             |
// | lowercase      | None (see $ZodCheckLowerCase)                    |
// | uppercase      | None (see $ZodCheckUpperCase)                    |
// | regex          | `pattern: RegExp` (see $ZodCheckRegex)           |
// | jwt            | `alg?: util.JWTAlgorithm`                        |
// | starts_with    | `prefix: string` (see $ZodCheckStartsWith)        |
// | ends_with      | `suffix: string` (see $ZodCheckEndsWith)          |
// | includes       | `includes: string`, `position?: number` (see $ZodCheckIncludes) |

// **Notes:**
// - For formats like `lowercase`, `uppercase`, `regex`, `starts_with`, `ends_with`, and `includes`, these are implemented as checks (see `$ZodCheckLowerCase`, `$ZodCheckUpperCase`, etc.), not as schemas in your main list.
// - All other formats are implemented as schemas with Internals extending `$ZodStringFormatInternals`, and any special properties are listed above.

/* Perhaps TypeBox has a better way to handle this, but I can only find one 'pattern' singular string */
function getExtraPatterns(checks: z.core.$ZodCheck[]): string[]{
  return checks.map(item => {
    const check = item._zod.def.check;
    if(check === 'regex') return (item._zod.def as z.core.$ZodCheckRegexDef).pattern?.source;
    if(check === 'lowercase') return '^[^A-Z]*$'; // Matches non-uppercase letters
    if(check === 'uppercase') return '^[^a-z]*$'; // Matches non-lowercase letters
    if(check === 'starts_with') return `^${(item._zod.def as z.core.$ZodCheckStartsWithDef).prefix}`;
    if(check === 'ends_with') return `${(item._zod.def as z.core.$ZodCheckEndsWithDef).suffix}$`;
    if(check === 'includes') return `.*${(item._zod.def as z.core.$ZodCheckIncludesDef).includes}.*`;
    // TODO - warn or something if we hit an unknown check
    return undefined;
  }).filter(x => x !== undefined ).filter(x=>!!x);
}

// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
function FromTuple(type: z.ZodTuple): t.TSchema {
  const items = type.def.items.map(item => FromType(item as z.ZodType))
  return t.Tuple(items, Options(type))
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
type TFromUnion<Types extends [z.ZodType, ...z.ZodType[]], Result = t.TUnion<{ [K in keyof Types]: TFromType<Types[K]> }>> = Result
function FromUnion(type: z.ZodUnion): t.TSchema {
  const options = type.options.map(option => FromType(option as z.ZodType))
  return t.Union(options, Options(type))
}
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
type TFromUnknown<Result = t.TUnknown> = Result
function FromUnknown(type: z.ZodUnknown): t.TSchema {
  return t.Unknown(Options(type))
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
type TFromUndefined<Result = t.TUndefined> = Result
function FromUndefined(type: z.ZodUndefined): t.TSchema {
  return t.Undefined(Options(type))
}
// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
type TFromDefault<Type extends z.ZodType, Result = TFromType<Type>> = Result
function FromDefault(type: z.ZodDefault<any>): t.TSchema {
  const inner = FromType(type.unwrap())
  // Note: we might need to extract the default value differently in Zod v4
  return t.Optional(inner, type.def.defaultValue())
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
type TFromType<Type extends z.ZodType> = 
  Type extends z.ZodAny ? TFromAny :
  Type extends z.ZodArray<infer T extends z.ZodType> ? TFromArray<T> :
  Type extends z.ZodBigInt ? TFromBigInt :
  Type extends z.ZodBoolean ? TFromBoolean :
  Type extends z.ZodDate ? TFromDate :
  Type extends z.ZodIntersection<infer L extends z.ZodType, infer R extends z.ZodType> ? TFromIntersect<L, R> :
  Type extends z.ZodLiteral<infer T extends string | number | boolean> ? TFromLiteral<T> :
  Type extends z.ZodNull ? TFromNull :
  Type extends z.ZodNumber ? TFromNumber :
  Type extends z.ZodOptional<infer T extends z.ZodType> ? TFromOptional<T> :
  Type extends z.ZodString ? TFromString :
  Type extends z.ZodUnion<infer T extends [z.ZodType, ...z.ZodType[]]> ? TFromUnion<T> :
  Type extends z.ZodUnknown ? TFromUnknown :
  Type extends z.ZodUndefined ? TFromUndefined :
  Type extends z.ZodDefault<infer T extends z.ZodType> ? TFromDefault<T> :
  t.TSchema


// ------------------------------------------------------------------
// Transform & Pipe
// ------------------------------------------------------------------
function FromTransform(type: z.ZodTransform<any, any>): t.TSchema {
  // Get the input type and pass it through the FromType function
  const input = type._zod.input as z.ZodType;
  return FromType(input);
}

function FromPipe(type: z.ZodPipe<any, any>): t.TSchema {
  // Get the input type and pass it through the FromType function
  const input = type.def.in as z.ZodType;
  return FromType(input);
}

// prettier-ignore
function FromType(type: z.ZodType): t.TSchema {
  if(type instanceof z.ZodString 
    || type instanceof z.ZodStringFormat
    || IsStringInternals(type)) {
    return FromStringLike(type);
  }
  
  if (type instanceof z.ZodAny) return FromAny(type)
  if (type instanceof z.ZodArray) return FromArray(type)
  if (type instanceof z.ZodBigInt) return FromBigInt(type)
  if (type instanceof z.ZodBoolean) return FromBoolean(type)
  if (type instanceof z.ZodDate) return FromDate(type)
  if (type instanceof z.ZodEnum) return FromEnum(type)
  if (type instanceof z.ZodIntersection) return FromIntersect(type)
  if (type instanceof z.ZodLiteral) return FromLiteral(type)
  if (type instanceof z.ZodNull) return FromNull(type)
  if (type instanceof z.ZodNumber) return FromNumber(type)
  if (type instanceof z.ZodObject) return FromObject(type)
  if (type instanceof z.ZodOptional) return FromOptional(type)
  if (type instanceof z.ZodPipe) return FromPipe(type)
  if (type instanceof z.ZodRecord) return FromRecord(type)
  // if (type instanceof z.ZodString) return FromString(type)
  if (type instanceof z.ZodTransform) return FromTransform(type)
  if (type instanceof z.ZodTuple) return FromTuple(type)
  if (type instanceof z.ZodUnion) return FromUnion(type)
  if (type instanceof z.ZodUnknown) return FromUnknown(type)
  if (type instanceof z.ZodUndefined) return FromUndefined(type)
  if (type instanceof z.ZodDefault) return FromDefault(type)
  return t.Never()
}

// ------------------------------------------------------------------
// TypeBoxFromZod
// ------------------------------------------------------------------
/** Creates a TypeBox type from Zod v4 */
// prettier-ignore
export type TTypeBoxFromZod4<Type extends z.ZodType,
  Result extends t.TSchema = TFromType<Type>
> = Result
/** Creates a TypeBox type from Zod v4 */
export function TypeBoxFromZod4<Type extends z.ZodType>(type: Type): TTypeBoxFromZod4<Type> {
  return FromType(type) as never
}
