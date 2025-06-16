import { TypeBox, Compile } from '@sinclair/typemap'
import { TSchema, TString, TypeGuard } from '@sinclair/typebox'
import { Assert } from './assert'
import { z } from 'zod/v4'
const ideally = process.env.EXTRA_TESTING === 'true' ? it : it.skip
describe('TypeBox From Zod4', () => {
  // ----------------------------------------------------------------
  // Metadata
  // ----------------------------------------------------------------
  it('Should map Description', () => {
    const T = TypeBox(z.number().describe('a number'))
    Assert.IsEqual(T.description, 'a number')
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
  // Boolean
  // ----------------------------------------------------------------
  it('Should map Boolean', () => {
    const T = TypeBox(z.boolean())
    Assert.IsTrue(TypeGuard.IsBoolean(T))
  })
  
  // ----------------------------------------------------------------
  // Number
  // ----------------------------------------------------------------
  it('Should map Number', () => {
    const T = TypeBox(z.number())
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  
  // ----------------------------------------------------------------
  // Object
  // ----------------------------------------------------------------
  it('Should map Object', () => {
    const T = TypeBox(z.object({ x: z.number() }))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
  })
  
  // ----------------------------------------------------------------
  // String
  // ----------------------------------------------------------------
  it('Should map String', () => {
    const T = TypeBox(z.string())
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  
  // ----------------------------------------------------------------
  // String Formats
  // ----------------------------------------------------------------
  it('Should map String Email format', () => {
    const T = TypeBox(z.email())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  
  it('Should map String UUID format', () => {
    const T = TypeBox(z.uuid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'uuid')
  })
  
  it('Should map String URL format', () => {
    const T = TypeBox(z.url())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'url')
  })
  
  it('Should map String IPv4 format', () => {
    const T = TypeBox(z.ipv4())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv4')
  })
  
  it('Should map String IPv6 format', () => {
    const T = TypeBox(z.ipv6())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ipv6')
  })
  
  it('Should map String CUID format', () => {
    const T = TypeBox(z.cuid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid')
  })
  
  it('Should map String CUID2 format', () => {
    const T = TypeBox(z.cuid2())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'cuid2')
  })
  
  it('Should map String ULID format', () => {
    const T = TypeBox(z.ulid())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'ulid')
  })
  
  it('Should map String Base64 format', () => {
    const T = TypeBox(z.base64())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64')
  })
  
  it('Should map String Base64URL format', () => {
    const T = TypeBox(z.base64url())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'base64url')
  })

  // ISO date formats
  it('Should map String ISO Date format', () => {
    const T = TypeBox(z.iso.date())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'date')
  })
  
  it('Should map String ISO DateTime format', () => {
    const T = TypeBox(z.iso.datetime())
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'datetime')
  })
  
  // ----------------------------------------------------------------
  // Edge Cases & Complex Cases
  // ----------------------------------------------------------------
  it('Should map string format validators with transform', () => {
    const T = TypeBox(z.email().transform(val => val.toLowerCase()))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  
  it('Should map string format validators with pipe', () => {
    const T = TypeBox(z.string().pipe(z.email()))
    Assert.IsTrue(TypeGuard.IsString(T))
    // This might actually fail depending on how pipe is implemented in Zod v4
  })
  
  it('Should map optional string format validators', () => {
    const T = TypeBox(z.email().optional())
    Assert.IsTrue(TypeGuard.IsOptional(T))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.format, 'email')
  })
  
  it('Should map array of string format validators', () => {
    const T = TypeBox(z.array(z.email()))
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsString(T.items))
    Assert.IsEqual(T.items.format, 'email')
  })
  
  it('Should map object with string format validators', () => {
    const T = TypeBox(z.object({
      email: z.email(),
      uuid: z.uuid(),
      url: z.url()
    }))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsString(T.properties.email))
    Assert.IsEqual(T.properties.email.format, 'email')
    Assert.IsTrue(TypeGuard.IsString(T.properties.uuid))
    Assert.IsEqual(T.properties.uuid.format, 'uuid')
    Assert.IsTrue(TypeGuard.IsString(T.properties.url))
    Assert.IsEqual(T.properties.url.format, 'url')
  })
  it("Should respect string validator chaining",()=>{
    const T = TypeBox(z.email().min(5).max(10))
    Assert.IsTrue(TypeGuard.IsString(T))
    Assert.IsEqual(T.minLength, 5)
    Assert.IsEqual(T.maxLength, 10)
    Assert.IsEqual(T.format, 'email')
  })
})

// ----------------------------------------------------------------
// String Validation Behavior Tests
// ----------------------------------------------------------------
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
describe('String Validation Behavior', () => {
  

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
    
    it('Should validate lowercase correctly', () => {
      const schema = TypeBox(z.string().lowercase());
      const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
      
      // Should accept lowercase strings
      AssertValidateIsTrue('abc');
      AssertValidateIsTrue('lowercase');
      
      // Should reject strings with uppercase
      AssertValidateIsFalse('Abc');
      AssertValidateIsFalse('UPPERCASE');
      AssertValidateIsFalse('mixedCASE');
    });
    
    it('Should validate uppercase correctly', () => {
      const schema = TypeBox(z.string().uppercase());
      const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
      
      // Should accept uppercase strings
      AssertValidateIsTrue('ABC');
      AssertValidateIsTrue('UPPERCASE');
      
      // Should reject strings with lowercase
      AssertValidateIsFalse('aBC');
      AssertValidateIsFalse('lowercase');
      AssertValidateIsFalse('mixedCASE');
    });
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
    
    it('Should validate startsWith + includes correctly', () => {
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
    
    it('Should validate endsWith + includes correctly', () => {
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
    
    it('Should validate startsWith + endsWith + includes correctly', () => {
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
      const schema = TypeBox(z.ipv4().startsWith('192.168.'));
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
      const schema = TypeBox(z.email().endsWith('@example.com'));
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
    
    it('Should handle special regex characters in string checks', () => {
      const schema = TypeBox(z.string().startsWith('$^.+*?()[]{}|\\'));
      const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
      
      // Should properly escape regex special chars
      AssertValidateIsTrue('$^.+*?()[]{}|\\followed');
      AssertValidateIsFalse('normal');
    });
    
    it('Should handle conflicting constraints', () => {
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
    const schema = TypeBox(z.email().min(10).max(30));
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
    const schema = TypeBox(z.email().endsWith('@gmail.com'));
    const {AssertValidateIsTrue, AssertValidateIsFalse }  = Validator(schema);
    
    // Valid gmail addresses
    AssertValidateIsTrue('user@gmail.com');
    AssertValidateIsTrue('test.account@gmail.com');
    
    // Valid email but not gmail
    AssertValidateIsFalse('user@example.com');
    
    // Invalid email with gmail ending
    AssertValidateIsFalse('not-valid@example@gmail.com');
  });
  
  it('Should handle multiple constraints on formats', () => {
    // IPv4 addresses in a specific range with specific constraints
    const schema = TypeBox(z.ipv4().startsWith('192.168.').includes('.100'));
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
