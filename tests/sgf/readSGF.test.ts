import { describe, expect, test } from 'vitest'
import { readSGF } from '~/utils/sgf/readSGF'

describe('Read SGF String', () => {
  test('Return string', () => {
    expect(readSGF('test')).toBe('test')
  })
})