import { Game } from '~/types/game'

export enum sgfErrors {
    NO_GAME_TYPE_PROPERTY = 'SGF string cannot be identified as a GO game.',
    NOT_A_GO_GAME = 'SGF string is not a Go game.',
    NO_BOARD_SIZE_PROPERTY = 'Not board size property in SGF string'
}

enum sgfProperties {
    APPLICATION = 'AP',
    GAME_TYPE = 'GM',
    BOARD_SIZE = 'SZ',
    PLAYER_BLACK = 'PB',
    PLAYER_WHITE = 'PW',
    BLACK_RANK = 'BR',
    WHITE_RANK = 'WR'
}

export function readSGF(sgf: string): Game {
    validateGameType(sgf)

    const app = getProperty(sgf, sgfProperties.APPLICATION)

    const boardSize = Number(getProperty(sgf, sgfProperties.BOARD_SIZE))
    if (boardSize === 0 ) {
        throw new Error(sgfErrors.NO_BOARD_SIZE_PROPERTY)
    }

    const playerBlack = getProperty(sgf, sgfProperties.PLAYER_BLACK)
    const playerWhite = getProperty(sgf, sgfProperties.PLAYER_WHITE)
    const blackRank = getProperty(sgf, sgfProperties.BLACK_RANK)
    const whiteRank = getProperty(sgf, sgfProperties.WHITE_RANK)

    return new Game(
        app,
        boardSize,
        playerBlack,
        playerWhite,
        blackRank,
        whiteRank
    )
}

function getProperty(sgf: string, property: sgfProperties): number | null {
    if (!sgf.includes(property)) return null

    const startIndex = sgf.indexOf(property) + 2
    const endIndex = sgf.slice(startIndex, sgf.length).indexOf(']') + startIndex

    return sgf.slice(startIndex + 1, endIndex)
}

function validateGameType(sgf: string) {
    if (!sgf.includes(sgfProperties.GAME_TYPE)) {
        throw new Error(sgfErrors.NO_GAME_TYPE_PROPERTY)
    }

    const gameType = sgf[sgf.indexOf('GM') + 3]
    if (gameType != '1') {
        throw new Error(sgfErrors.NOT_A_GO_GAME)
    }
}
