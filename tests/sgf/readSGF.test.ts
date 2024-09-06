import { assertType, describe, expect, test } from 'vitest'
import { readSGF, sgfErrors } from '~/utils/sgf/readSGF'
import { Game } from '~/types/game'

const sampleSGF = `(;FF[4]GM[1]SZ[19]AP[SGFC:1.13b]

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

(;W[dq]N[wrong direction];B[qo];W[qp]))`

describe('Reads an SGF string', () => {
  test('Returns a diagram if SGF file is a go file', () => {
    assertType<Game>(readSGF('(;FF[4]GM[1]SZ[19])'))
  })

  test('Throws an error if SGF does not contain GM[1]', () => {
    expect(() => readSGF('(;FF[4]SZ[19])')).toThrowError(sgfErrors.NO_GAME_TYPE_PROPERTY)
  })

  test('Throws an error if game is not Go', () => {
    expect(() => readSGF('(;FF[4]GM[2]SZ[19])')).toThrowError(sgfErrors.NOT_A_GO_GAME)
  })

  test('Gets the application that generated the SGF file', () => {
    const actual = readSGF(sampleSGF).getMetadata().app
    const expected = 'SGFC:1.13b'

    expect(actual).toBe(expected)
  })

  test('Gets the board size', () => {
    const actual = readSGF(sampleSGF).getMetadata().boardSize
    const expected = 19

    expect(actual).toBe(expected)
  })

  test('Throws an error if no board size property is provided', () => {
    expect(() => readSGF('(;FF[4]GM[1])')).toThrowError(sgfErrors.NO_BOARD_SIZE_PROPERTY)
  })

  test('Gets player names and rankings', () => {
    const actual = readSGF(sampleSGF).getPlayerData()
    const expected = {
      playerBlack: 'troy',
      playerWhite: 'john',
      blackRank: '12k*',
      whiteRank: '11k*'
    }

    expect(actual).toEqual(expected)
  })
})
