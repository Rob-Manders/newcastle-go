import { Game } from '~/types/game'

export enum sgfErrors {
  NO_GAME_TYPE_PROPERTY = 'SGF string cannot be identified as a GO game.',
  NOT_A_GO_GAME = 'SGF string is not a Go game.',
  NO_BOARD_SIZE_PROPERTY = 'No board size property in SGF string'
}

const requiredProperties = {
  APPLICATION: 'AP',
  GAME_TYPE: 'GM',
  BOARD_SIZE: 'SZ',
  PLAYER_BLACK: 'PB',
  PLAYER_WHITE: 'PW',
  BLACK_RANK: 'BR',
  WHITE_RANK: 'WR',
  KOMI: 'KM',
  RESULT: 'RE',
  DATE: 'DT',
  TIME: 'TM'
}

export function readGame(sgf: string): Game {
  checkSGFHasRequiredValues(sgf)
  validateGameType(sgf)

  const app = getProperty(sgf, requiredProperties.APPLICATION)

  const boardSize = Number(getProperty(sgf, requiredProperties.BOARD_SIZE))
  if (boardSize === 0 ) {
    throw new Error(sgfErrors.NO_BOARD_SIZE_PROPERTY)
  }

  const playerBlack = getProperty(sgf, requiredProperties.PLAYER_BLACK)
  const playerWhite = getProperty(sgf, requiredProperties.PLAYER_WHITE)
  const blackRank = getProperty(sgf, requiredProperties.BLACK_RANK)
  const whiteRank = getProperty(sgf, requiredProperties.WHITE_RANK)

  const komi = Number(getProperty(sgf, requiredProperties.KOMI))

  const resultString = getProperty(sgf, requiredProperties.RESULT)
  const result = {
    winner: resultString[0] === 'W' ? 'white' : 'black',
    amount: Number(resultString.slice(2, resultString.length))
  }
  const time = Number(getProperty(sgf, requiredProperties.TIME))
  const date = getProperty(sgf, requiredProperties.DATE)

  return new Game(
      app,
      boardSize,
      playerBlack,
      playerWhite,
      blackRank,
      whiteRank,
      komi,
      result,
      date,
      time
  )
}

function getProperty(sgf: string, property: requiredProperties): number | null {
  if (!sgf.includes(property)) return null

  const startIndex = sgf.indexOf(property) + 2
  const endIndex = sgf.slice(startIndex, sgf.length).indexOf(']') + startIndex

  return sgf.slice(startIndex + 1, endIndex)
}

function validateGameType(sgf: string) {
  if (!sgf.includes(requiredProperties.GAME_TYPE)) {
    throw new Error(sgfErrors.NO_GAME_TYPE_PROPERTY)
  }

  const gameType = sgf[sgf.indexOf('GM') + 3]
  if (gameType != '1') {
    throw new Error(sgfErrors.NOT_A_GO_GAME)
  }
}

function checkSGFHasRequiredValues(sgf: string) {
  Object.values(requiredProperties).forEach(property => {
    if (!sgf.includes(property)) {
      throw new Error(`Required property '${property}' is missing`)
    }
  })
}
