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


// Should probably remove this if TypeBox supports pattern arrays

export function combinePatternsHack(patterns: string[]): string {
  // Use lookahead assertions to enforce that a string matches all patterns
  // This is more robust than trying to combine regex patterns directly
  
  // Handle patterns with different anchors
  const lookaheadPatterns = patterns.map(pattern => {
    // If the pattern has anchors, we need to preserve them in the lookahead
    // Otherwise, we need to make sure it can match anywhere in the string
    if (pattern.startsWith('^') && pattern.endsWith('$')) {
      // Full string match pattern, use as is in lookahead
      return `(?=${pattern})`;
    } else if (pattern.startsWith('^')) {
      // Beginning of string pattern
      return `(?=${pattern})`;
    } else if (pattern.endsWith('$')) {
      // End of string pattern
      return `(?=${pattern})`;
    } else if (pattern.includes('.*')) {
      // Already has wildcards, use as is
      return `(?=${pattern})`;
    } else {
      // No anchors, can match anywhere
      return `(?=.*${pattern}.*)`;
    }
  });
  
  // Combine all lookaheads and ensure the pattern matches the entire string
  return `^${lookaheadPatterns.join('')}.*$`;
}
