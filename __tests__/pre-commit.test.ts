/**
 * Pre-commit smoke test to ensure hooks are runnable
 * This test does not replace the actual pre-commit hook; it just validates scripts exist.
 */
import { describe, it, expect } from '@jest/globals';

describe('pre-commit scripts', () => {
  it('should have lint script', () => {
    const pkg = require('../package.json');
    expect(pkg.scripts.lint).toBe('next lint');
  });

  it('should have type-check script', () => {
    const pkg = require('../package.json');
    expect(pkg.scripts['type-check']).toBe('tsc --noEmit');
  });

  it('should have test script', () => {
    const pkg = require('../package.json');
    expect(pkg.scripts.test).toBe('jest');
  });
});
