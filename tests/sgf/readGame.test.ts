import { assertType, describe, expect, test } from 'vitest'
import { readGame, sgfErrors } from '~/utils/sgf/readGame'
import { Game } from '~/types/game'

const sampleGameSGF = `
  (;FF[4]GM[1]SZ[19]AP[SGFC:1.13b]
  
  PB[troy]BR[12k*]
  PW[john]WR[11k*]
  KM[0.5]RE[W+12.5]
  DT[1998-06-15]
  TM[600]
  
  ;B[pd];W[dp];B[pq];W[dd];B[qk];W[jd];B[fq];W[dj];B[jp];W[jj]
  ;B[cn]LB[dn:A][po:B]C[dada: other ideas are 'A' (d6) or 'B' (q5)]
  ;W[eo](;B[dl]C[dada: hm - looks troublesome.Usually B plays the 3,3 invasion - see variation];W[qo];B[qp]
  ;W[sr];B[sk];W[sg];B[pa];W[gc];B[pi];W[ph];B[de];W[ed];B[kn]
  ;W[dh];B[eh];W[se];B[sd];W[af];B[ie];W[id];B[hf];W[hd];B[if]
  ;W[fp];B[gq];W[qj];B[sj];W[rh];B[sn];W[so];B[sm];W[ep];B[mn])
  
  (;W[dq]N[wrong direction];B[qo];W[qp]))
`

describe('Reads an SGF string for a Go game', () => {
  test('Throws an error if any of the required properties are missing', () => {
    expect(() => readGame('FF[4]')).toThrowError(`Required property 'AP' is missing`)
  })

  test('Returns a diagram if SGF string is a Go game', () => {
    assertType<Game>(readGame(sampleGameSGF))
  })

  test('Throws an error if game is not Go', () => {
    const sgf = `
      (;FF[4]GM[2]SZ[19]AP[SGFC:1.13b]
      PB[troy]BR[12k*]
      PW[john]WR[11k*]
      KM[0.5]RE[W+12.5]
      DT[1998-06-15]
      TM[600])
    `
    expect(() => readGame(sgf)).toThrowError(sgfErrors.NOT_A_GO_GAME)
  })

  test('Gets the application that generated the SGF file', () => {
    expect(readGame(sampleGameSGF).app).toBe('SGFC:1.13b')
  })

  test('Gets the board size', () => {
    expect(readGame(sampleGameSGF).boardSize).toBe(19)
  })

  test('Gets black player name', () => {
    expect(readGame(sampleGameSGF).playerBlack).toBe('troy')
  })

  test('Gets white player name', () => {
    expect(readGame(sampleGameSGF).playerWhite).toBe('john')
  })

  test('Get black rank', () => {
    expect(readGame(sampleGameSGF).blackRank).toBe('12k*')
  })

  test('Gets white rank', () => {
    expect(readGame(sampleGameSGF).whiteRank).toBe('11k*')
  })

  test('Gets Komi', () => {
    expect(readGame(sampleGameSGF).komi).toBe(0.5)
  })

  test('Gets result', () => {
    const actual = readGame(sampleGameSGF).result
    const expected = {
      winner: 'white',
      amount: 12.5
    }

    expect(actual).toEqual(expected)
  })

  test('Gets date', () => {
    expect(readGame(sampleGameSGF).date).toBe('1998-06-15')
  })

  test(' Gets game time', () => {
    expect(readGame(sampleGameSGF).time).toBe(600)
  })
})
