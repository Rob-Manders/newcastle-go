export class Game {

  constructor(
      private app: string,
      private boardSize: number,
      private playerBlack: string,
      private playerWhite: string,
      private blackRank: string,
      private whiteRank: string
  ) {}

  getMetadata() {
    return {
      app: this.app,
      boardSize: this.boardSize
    }
  }

  getPlayerData() {
    return {
      playerBlack: this.playerBlack,
      playerWhite: this.playerWhite,
      blackRank: this.blackRank,
      whiteRank: this.whiteRank
    }
  }
}