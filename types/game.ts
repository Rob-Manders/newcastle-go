export class Game {

  constructor(
    readonly app: string,
    readonly boardSize: number,
    readonly playerBlack: string,
    readonly playerWhite: string,
    readonly blackRank: string,
    readonly whiteRank: string,
    readonly komi: number,
    readonly result: {
      winner: string,
      amount: number
    },
    readonly date: string,
    readonly time: number
  ) {}
}