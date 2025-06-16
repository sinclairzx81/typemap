import * as z3 from 'zod';
import { z as z4 } from 'zod/v4';
import { IsZod, IsZod4 } from '../src/guard';
import { Assert } from './assert';

describe('Zod Version Detection', () => {
  // Create test schemas
  const z3String = z3.string();
  const z4String = z4.string();

  describe('Zod v3 Detection', () => {
    it('Should correctly identify Zod v3 schema', () => {
      Assert.IsTrue(IsZod(z3String));
      Assert.IsFalse(IsZod4(z3String));
    });
  });

  describe('Zod v4 Detection', () => {
    it('Should correctly identify Zod v4 schema', () => {
      Assert.IsFalse(IsZod(z4String));
      Assert.IsTrue(IsZod4(z4String));
    });
  });
});
