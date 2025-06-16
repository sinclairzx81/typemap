import { TypeBox, Compile } from '@sinclair/typemap'
import { TypeGuard , TSchema} from '@sinclair/typebox'
import { Assert } from './assert'
import * as t from '@sinclair/typebox'
import * as z from 'zod'
const ideally = process.env.EXTRA_TESTING === 'true' ? it : it.skip
describe('TypeBox From Zod', () => {
  // ----------------------------------------------------------------
  // Metadata
  // ----------------------------------------------------------------
  it('Should map Description', () => {
    const T = TypeBox(z.number().describe('a number'))
    Assert.IsEqual(T.description, 'a number')
  })
  it('Should map Default', () => {
    const T = TypeBox(z.number().default(12345))
    Assert.IsEqual(T.default, 12345)
  })
  // ----------------------------------------------------------------
  // Any
  // ----------------------------------------------------------------
  it('Should map Any', () => {
    const T = TypeBox(z.any())
    Assert.IsTrue(TypeGuard.IsAny(T))
  })
  // ----------------------------------------------------------------
  // Array
  // ----------------------------------------------------------------
  it('Should map Array', () => {
    const T = TypeBox(z.array(z.number()))
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  // ----------------------------------------------------------------
  // BigInt
  // ----------------------------------------------------------------
  it('Should map BigInt', () => {
    const T = TypeBox(z.bigint())
    Assert.IsTrue(TypeGuard.IsBigInt(T))
  })
  // ----------------------------------------------------------------
  // Date
  // ----------------------------------------------------------------
  it('Should map Date', () => {
    const T = TypeBox(z.date())
    Assert.IsTrue(TypeGuard.IsDate(T))
  })
  // ----------------------------------------------------------------
  // DiscriminatedUnion
  // ----------------------------------------------------------------
  it('Should map DiscriminatedUnion', () => {
    const A = z.object({ type: z.literal('A') })
    const B = z.object({ type: z.literal('B') })
    const C = z.object({ type: z.literal('C') })
    const T = TypeBox(z.discriminatedUnion('type', [A, B, C]))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsEqual(T.discriminator, 'type')
    Assert.IsTrue(T.anyOf[0].properties.type.const === 'A')
    Assert.IsTrue(T.anyOf[1].properties.type.const === 'B')
    Assert.IsTrue(T.anyOf[2].properties.type.const === 'C')
  })
  // ----------------------------------------------------------------
  // Effects
  // ----------------------------------------------------------------
  it('Should map Effects (Transform)', () => {
    const T = TypeBox(z.number().transform((x) => x))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsTrue(TypeGuard.IsTransform(T))
  })
  it('Should map Effects (Refine)', () => {
    const T = TypeBox(z.number().refine((x) => true))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsTrue(TypeGuard.IsTransform(T))
  })
  // ----------------------------------------------------------------
  // Enum
  // ----------------------------------------------------------------
  it('Should map Enum', () => {
    const T = TypeBox(z.enum(['a', 'b', 'c']))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsEqual(T.anyOf[0].const, 'a')
    Assert.IsEqual(T.anyOf[1].const, 'b')
    Assert.IsEqual(T.anyOf[2].const, 'c')
  })
  // ----------------------------------------------------------------
  // Literal
  // ----------------------------------------------------------------
  it('Should map Literal (Number)', () => {
    const T = TypeBox(z.literal(42))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 42)
  })
  it('Should map Literal (String)', () => {
    const T = TypeBox(z.literal('hello'))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, 'hello')
  })
  it('Should map Literal (Boolean)', () => {
    const T = TypeBox(z.literal(true))
    Assert.IsTrue(TypeGuard.IsLiteral(T))
    Assert.IsEqual(T.const, true)
  })
  // ----------------------------------------------------------------
  // Nullable
  // ----------------------------------------------------------------
  it('Should map Nullable', () => {
    const T = TypeBox(z.number().nullable())
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsNull(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsNumber(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Object
  // ----------------------------------------------------------------
  it('Should map Object', () => {
    const T = TypeBox(
      z.object({
        x: z.number(),
        y: z.string(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsString(T.properties.y))
  })
  it('Should map Object (Strict)', () => {
    const T = TypeBox(
      z
        .object({
          x: z.number(),
          y: z.string(),
        })
        .strict(),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsString(T.properties.y))
    Assert.IsEqual(T.additionalProperties, false)
  })
  // ----------------------------------------------------------------
  // Optional
  // ----------------------------------------------------------------
  it('Should map Optional', () => {
    const T = TypeBox(
      z.object({
        x: z.number().optional(),
        y: z.number().optional(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
  })
  it('Should map Optional (Readonly)', () => {
    const T = TypeBox(
      z.object({
        x: z.number().optional().readonly(),
        y: z.number().optional().readonly(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.y))
  })
  it('Should map Optional (Partial)', () => {
    const T = TypeBox(
      z
        .object({
          x: z.number(),
          y: z.number(),
        })
        .partial(),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Promise
  // ----------------------------------------------------------------
  it('Should map Promise', () => {
    const T = TypeBox(z.promise(z.number()))
    Assert.IsTrue(TypeGuard.IsPromise(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.item))
  })
  // ----------------------------------------------------------------
  // Readonly
  // ----------------------------------------------------------------
  it('Should map Readonly', () => {
    const T = TypeBox(
      z.object({
        x: z.number().readonly(),
        y: z.number().readonly(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.y))
  })
  it('Should map Readonly (Optional)', () => {
    const T = TypeBox(
      z.object({
        x: z.number().readonly().optional(),
        y: z.number().readonly().optional(),
      }),
    )
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Record
  // ----------------------------------------------------------------
  it('Should map Record (Key Implicit)', () => {
    const T = TypeBox(z.record(z.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[t.PatternStringExact]))
  })
  it('Should map Record (Number Key)', () => {
    const T = TypeBox(z.record(z.number(), z.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[t.PatternNumberExact]))
  })
  it('Should map Record (String Key)', () => {
    const T = TypeBox(z.record(z.string(), z.number()))
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties[t.PatternStringExact]))
  })
  it('Should map Record (Finite Union)', () => {
    const T = TypeBox(z.record(z.union([z.literal('x'), z.literal('y')]), z.number()))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
  })
  // ----------------------------------------------------------------
  // Never
  // ----------------------------------------------------------------
  it('Should map Never', () => {
    const T = TypeBox(z.never())
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  // ----------------------------------------------------------------
  // Null
  // ----------------------------------------------------------------
  it('Should map Null', () => {
    const T = TypeBox(z.null())
    Assert.IsTrue(TypeGuard.IsNull(T))
  })
  // ----------------------------------------------------------------
  // Number
  // ----------------------------------------------------------------
  it('Should map Number', () => {
    const T = TypeBox(z.number())
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  it('Should map Number (Integer)', () => {
    const T = TypeBox(z.number().int())
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.multipleOf, 1)
  })
  it('Should map Number (Minimum)', () => {
    const T = TypeBox(z.number().min(100))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.minimum, 100)
  })
  it('Should map Number (Maximum)', () => {
    const T = TypeBox(z.number().max(100))
    Assert.IsTrue(TypeGuard.IsNumber(T))
    Assert.IsEqual(T.maximum, 100)
  })
  // ----------------------------------------------------------------
  // String
  // ----------------------------------------------------------------
  it('Should map String', () => {
    const T = TypeBox(z.string())
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  it('Should map String (Base64)', () => {
    const T = TypeBox(z.string().base64())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64')
  })
  it('Should map String (Base64Url)', () => {
    const T = TypeBox(z.string().base64url())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64url')
  })
  it('Should map String (Cidr V4)', () => {
    const T = TypeBox(z.string().cidr({ version: 'v4' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cidrv4')
  })
  it('Should map String (Cidr v6)', () => {
    const T = TypeBox(z.string().cidr({ version: 'v6' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cidrv6')
  })
  it('Should map String (Cidr)', () => {
    const T = TypeBox(z.string().cidr())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cidr')
  })
  it('Should map String (Cuid)', () => {
    const T = TypeBox(z.string().cuid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid')
  })
  it('Should map String (Cuid2)', () => {
    const T = TypeBox(z.string().cuid2())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid2')
  })
  it('Should map String (Ulid)', () => {
    const T = TypeBox(z.string().ulid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ulid')
  })
  it('Should map String (Email)', () => {
    const T = TypeBox(z.string().email())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  it('Should map String (Emoji)', () => {
    const T = TypeBox(z.string().emoji())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'emoji')
  })
  it('Should map String (EndsWith)', () => {
    const T = TypeBox(z.string().endsWith('hello'))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello$')
  })
  it('Should map String (Includes)', () => {
    const T = TypeBox(z.string().includes('hello'))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'hello')
  })
  it('Should map String (IpV4)', () => {
    const T = TypeBox(z.string().ip({ version: 'v4' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv4')
  })
  it('Should map String (IpV6)', () => {
    const T = TypeBox(z.string().ip({ version: 'v6' }))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv6')
  })
  it('Should map String (Ip)', () => {
    const T = TypeBox(z.string().ip())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ip')
  })
  it('Should map String (Jwt)', () => {
    const T = TypeBox(z.string().jwt())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'jwt')
  })
  it('Should map String (Length)', () => {
    const T = TypeBox(z.string().length(100))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
    Assert.IsEqual(T.maxLength, 100)
  })

  it('Should map String (Min)', () => {
    const T = TypeBox(z.string().min(100))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 100)
  })
  it('Should map String (Max)', () => {
    const T = TypeBox(z.string().max(100))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.maxLength, 100)
  })
  it('Should map String (Nanoid)', () => {
    const T = TypeBox(z.string().nanoid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'nanoid')
  })
  it('Should map String (RegExp)', () => {
    const T = TypeBox(z.string().regex(/abc/))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, 'abc')
  })
  it('Should map String (StartsWith)', () => {
    const T = TypeBox(z.string().startsWith('hello'))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.pattern, '^hello')
  })
  it('Should map String (Time)', () => {
    const T = TypeBox(z.string().time())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'time')
  })
  it('Should map String (Ulid)', () => {
    const T = TypeBox(z.string().ulid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ulid')
  })
  it('Should map String (Url)', () => {
    const T = TypeBox(z.string().url())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'url')
  })
  it('Should map String (Uuid)', () => {
    const T = TypeBox(z.string().uuid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'uuid')
  })
  // ----------------------------------------------------------------
  // Symbol
  // ----------------------------------------------------------------
  it('Should map Symbol', () => {
    const T = TypeBox(z.symbol())
    Assert.IsTrue(TypeGuard.IsSymbol(T))
  })
  // ----------------------------------------------------------------
  // Tuple
  // ----------------------------------------------------------------
  it('Should map Tuple', () => {
    const T = TypeBox(z.tuple([z.number(), z.string()]))
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
    Assert.IsTrue(TypeGuard.IsString(T.items![1]))
  })
  // ----------------------------------------------------------------
  // Undefined
  // ----------------------------------------------------------------
  it('Should map Undefined', () => {
    const T = TypeBox(z.undefined())
    Assert.IsTrue(TypeGuard.IsUndefined(T))
  })
  // ----------------------------------------------------------------
  // Union
  // ----------------------------------------------------------------
  it('Should map Union', () => {
    const T = TypeBox(z.union([z.string(), z.boolean()]))
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(TypeGuard.IsString(T.anyOf[0]))
    Assert.IsTrue(TypeGuard.IsBoolean(T.anyOf[1]))
  })
  // ----------------------------------------------------------------
  // Unknown
  // ----------------------------------------------------------------
  it('Should map Unknown', () => {
    const T = TypeBox(z.unknown())
    Assert.IsTrue(TypeGuard.IsUnknown(T))
  })
  // ----------------------------------------------------------------
  // Void
  // ----------------------------------------------------------------
  it('Should map Void', () => {
    const T = TypeBox(z.void())
    Assert.IsTrue(TypeGuard.IsVoid(T))
  })
  // ----------------------------------------------------------------
  // String Validation Behavior Tests
  // ----------------------------------------------------------------
  
  describe('String Validation Behavior', () => {
  const Validator =  (s: TSchema)=>{
      const S = Compile(s);
      return {
        AssertValidateIsTrue: (v: string) => {
          const result = S.Check(v);
          const err = result ? "is-valid" : `Validation was false (expected true) for value: '${v}' with schema:${JSON.stringify(s , null, 2)}`;
          Assert.IsEqual(err, "is-valid");
        },
        AssertValidateIsFalse: (v: string) => {
          const result = S.Check(v);
          const err = !result ? "not-valid" : `Validation was true (expected false) for value: '${v}' with schema:${JSON.stringify(s , null, 2)}`;
          Assert.IsEqual(err, "not-valid");
        }
    }
  }  
  
    // Tests for single string checks
    describe('Basic String Checks', () => {
      it('Should validate startsWith correctly', () => {
        const schema = TypeBox(z.string().startsWith('prefix'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept strings that start with 'prefix'
        AssertValidateIsTrue('prefix123');
        AssertValidateIsTrue('prefixABC');
        
        // Should reject strings that don't start with 'prefix'
        AssertValidateIsFalse('wrongprefix');
        AssertValidateIsFalse('wrong');
      });
  
      it('Should validate endsWith correctly', () => {
        const schema = TypeBox(z.string().endsWith('suffix'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept strings that end with 'suffix'
        AssertValidateIsTrue('123suffix');
        AssertValidateIsTrue('ABCsuffix');
        
        // Should reject strings that don't end with 'suffix'
        AssertValidateIsFalse('suffixwrong');
        AssertValidateIsFalse('wrong');
      });
      ideally('Should validate includes correctly', () => {
        const schema = TypeBox(z.string().includes('middle'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept strings that include 'middle'
        AssertValidateIsTrue('start-middle-end');
        AssertValidateIsTrue('middleAtStart');
        AssertValidateIsTrue('atTheMiddle');
        
        // Should reject strings that don't include 'middle'
        AssertValidateIsFalse('nomid');
        AssertValidateIsFalse('midle'); // Misspelled
      });
      ideally('Should validate regex patterns correctly', () => {
        const schema = TypeBox(z.string().regex(/^A[BC]+D$/));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept strings that match the regex
        AssertValidateIsTrue('ABCD');
        AssertValidateIsTrue('AABBBCD');
        AssertValidateIsTrue('AABCD');
        AssertValidateIsTrue('AABBBBCD');
        // Should reject strings that don't match the regex
        AssertValidateIsFalse('AC');
        AssertValidateIsFalse('123');
        AssertValidateIsFalse('mixed123');
      });
      
    // Tests for combined string checks
    describe('Combined String Checks', () => {
      it('Should validate startsWith + endsWith correctly', () => {
        const schema = TypeBox(z.string().startsWith('start').endsWith('end'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept strings that start with 'start' AND end with 'end'
        AssertValidateIsTrue('startend');
        AssertValidateIsTrue('start_middle_end');
        
        // Should reject strings that don't meet both conditions
        AssertValidateIsFalse('startonly');
        AssertValidateIsFalse('endonly');
        AssertValidateIsFalse('neither');
      });
      ideally('Should validate startsWith + includes correctly', () => {
        const schema = TypeBox(z.string().startsWith('start').includes('middle'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept strings that start with 'start' AND include 'middle'
        AssertValidateIsTrue('startmiddle');
        AssertValidateIsTrue('start_middle_end');
        
        // Should reject strings that don't meet both conditions
        AssertValidateIsFalse('startonly');
        AssertValidateIsFalse('middleonly');
        AssertValidateIsFalse('neither');
      });
      ideally('Should validate endsWith + includes correctly', () => {
        const schema = TypeBox(z.string().endsWith('end').includes('middle'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept strings that end with 'end' AND include 'middle'
        AssertValidateIsTrue('middleend');
        AssertValidateIsTrue('start_middle_end');
        
        // Should reject strings that don't meet both conditions
        AssertValidateIsFalse('endonly');
        AssertValidateIsFalse('middleonly');
        AssertValidateIsFalse('neither');
      });
      ideally('Should validate startsWith + endsWith + includes correctly', () => {
        const schema = TypeBox(z.string().startsWith('start').endsWith('end').includes('middle'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept strings that meet all three conditions
        AssertValidateIsTrue('startmiddleend');
        AssertValidateIsTrue('start_middle_end');
        
        // Should reject strings that don't meet all conditions
        AssertValidateIsFalse('startend'); // Missing 'middle'
        AssertValidateIsFalse('startmiddle'); // Missing 'end'
        AssertValidateIsFalse('middlewithend'); // Missing 'start'
        AssertValidateIsFalse('neither');
      });
    });
  
    // Tests for special cases mentioned in the comments
    describe('Special Case Combinations', () => {
      it('Should validate ipv4 with startsWith correctly', () => {
        // This tests the commented case "z.ipv4().startsWith('192.168.')"
        const schema = TypeBox(z.string().ip("v4").startsWith('192.168.'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept IPv4 addresses that start with '192.168.'
        AssertValidateIsTrue('192.168.1.1');
        AssertValidateIsTrue('192.168.0.1');
        AssertValidateIsTrue('192.168.254.254');
        
        // Should reject IPv4 addresses that don't start with '192.168.'
        AssertValidateIsFalse('10.0.0.1');
        AssertValidateIsFalse('172.16.0.1');
        
        // Should reject strings that start with '192.168.' but aren't valid IPv4s
        AssertValidateIsFalse('192.168.');
        AssertValidateIsFalse('192.168.1');
        AssertValidateIsFalse('192.168.1.');
        AssertValidateIsFalse('192.168.256.1');
      });
      ideally('Should validate regex with startsWith correctly', () => {
        const schema = TypeBox(z.string().regex(/^[a-z]+$/).startsWith('abc'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept strings that are lowercase AND start with 'abc'
        AssertValidateIsTrue('abc');
        AssertValidateIsTrue('abcdef');
        
        // Should reject strings that don't meet both conditions
        AssertValidateIsFalse('abcDEF'); // Not all lowercase
        AssertValidateIsFalse('def'); // Doesn't start with 'abc'
      });
      
      it('Should validate email with endsWith correctly', () => {
        const schema = TypeBox(z.string().email().endsWith('@example.com'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should accept emails that end with '@example.com'
        AssertValidateIsTrue('user@example.com');
        AssertValidateIsTrue('another.user@example.com');
        
        // Should reject emails that don't end with '@example.com'
        AssertValidateIsFalse('user@gmail.com');
        AssertValidateIsFalse('user@example.org');
        
        // Should reject invalid emails even if they end with '@example.com'
        AssertValidateIsFalse('invalid@example.com@example.com');
        AssertValidateIsFalse('@example.com');
      });
    });
  
    // Edge cases
    describe('Edge Cases', () => {
      it('Should handle empty string checks correctly', () => {
        const schema = TypeBox(z.string().startsWith('').endsWith(''));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Empty strings at start/end should match any string
        AssertValidateIsTrue('anystring');
        AssertValidateIsTrue('');
      });
      ideally('Should handle special regex characters in string checks', () => {
        const schema = TypeBox(z.string().startsWith('$^.+*?()[]{}|\\'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // Should properly escape regex special chars
        AssertValidateIsTrue('$^.+*?()[]{}|\\followed');
        AssertValidateIsFalse('normal');
      });
      ideally('Should handle conflicting constraints', () => {
        // This tests what happens with mutually exclusive constraints
        const schema = TypeBox(z.string().startsWith('abc').startsWith('def'));
        const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
        
        // A string can't start with both 'abc' and 'def', so validation should fail
        AssertValidateIsFalse('abcdef');
        AssertValidateIsFalse('defabc');
      });
    });
  });
  
  // ----------------------------------------------------------------
  // Format and Constraint Combinations
  // ----------------------------------------------------------------
  describe('Format and Constraint Combinations', () => {
    it('Should combine format with length constraints', () => {
      const schema = TypeBox(z.string().email().min(10).max(30));
      const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
      
      // Valid email within length constraints
      AssertValidateIsTrue('test@example.com'); // 15 chars
      
      // Valid email too short
      AssertValidateIsFalse('a@b.com'); // 7 chars
      
      // Valid email too long
      AssertValidateIsFalse('verylongusername@verylongdomain.com'); // > 30 chars
      
      // Invalid email but correct length
      AssertValidateIsFalse('notanemailbutlongenough'); // 24 chars
    });
    
    it('Should combine format with pattern constraints', () => {
      // Test a domain-specific email format: only gmail addresses
      const schema = TypeBox(z.string().email().endsWith('@gmail.com'));
      const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
      
      // Valid gmail addresses
      AssertValidateIsTrue('user@gmail.com');
      AssertValidateIsTrue('test.account@gmail.com');
      
      // Valid email but not gmail
      AssertValidateIsFalse('user@example.com');
      
      // Invalid email with gmail ending
      AssertValidateIsFalse('not-valid@example@gmail.com');
    });
    ideally('Should handle multiple constraints on formats', () => {
      // IPv4 addresses in a specific range with specific constraints
      const schema = TypeBox(z.string().ip('v4').startsWith('192.168.').includes('.100'));
      const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
      
      // Valid IPv4 meeting both constraints
      AssertValidateIsTrue('192.168.0.100');
      AssertValidateIsTrue('192.168.100.101');
      
      // Valid IPv4 but missing one constraint
      AssertValidateIsFalse('192.168.0.1'); // Missing .100
      AssertValidateIsFalse('10.0.0.100'); // Has .100 but wrong prefix
      
      // Invalid IPv4
      AssertValidateIsFalse('192.168.300.100'); // Invalid IPv4 format
    });
  });
});
})
