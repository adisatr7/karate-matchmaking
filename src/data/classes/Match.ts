import Division from "./Division"
import { BaseDirectory, readTextFile, removeFile } from "@tauri-apps/api/fs"
import {
  ContestantType,
  MatchStatusOptions,
  MatchWinnerOptions,
} from "../../types"
import { writeInto } from "../../utils/fileManager"
import { generateID } from "../../utils/idGenerator"

export default class Match {
  private divisionId: string // References -> Division
  private matchId: string
  private matchName: string
  // private nextMatchId: string
  private round: number
  // private playDate: Date
  private status: MatchStatusOptions
  private winner: MatchWinnerOptions
  private contestants: ContestantType[]
  private scores: number[]

  constructor(
    divisionId: string,
    matchId?: string,
    matchName: string = "",
    // nextMatchId: string = "",
    round: number = 0,
    // playDate: Date = new Date(),
    status: MatchStatusOptions = "akan main",
    winner: MatchWinnerOptions = "tbd",
    contestants: ContestantType[] = [],
    scores: number[] = [0, 0]
  ) {
    this.divisionId = divisionId
    this.matchId = matchId || generateID("m-x")
    this.matchName = matchName
    // this.nextMatchId = nextMatchId
    this.round = round
    // this.playDate = playDate
    this.status = status
    this.winner = winner
    this.contestants = contestants
    this.scores = scores
  }

  public save() {
    writeInto(this, `matches/${this.matchId}`)
  }

  public static async load(matchId: string): Promise<Match> {
    return new Promise(async (resolve, reject) => {
      // Read from filesystem
      await readTextFile(`matches/${matchId}.data`, {
        dir: BaseDirectory.AppData,
      })
        // If file is found, parse its content
        .then((data) => {
          const parsedData = JSON.parse(data)

          // Create a new Match object
          const match = new Match(
            parsedData.divisionId,
            parsedData.matchId,
            parsedData.matchName,
            // parsedData.nextMatchId,
            parsedData.round,
            // parsedData.playDate,
            parsedData.status,
            parsedData.winner,
            parsedData.contestants,
            parsedData.scores
          )

          // Resolve the promise with the new Match object
          resolve(match)
        })

        // If data is not found, reject the promise with the error
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Delete this match from the filesystem
   */
  public async delete(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await removeFile(`matches/${this.matchId}.data`, {
        dir: BaseDirectory.AppData,
      })
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  public async getDivision(): Promise<Division> {
    return new Promise(async (resolve, reject) => {
      await Division.load(this.divisionId)
        .then((division: Division) => {
          resolve(division)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Get the next match object
   *
   * @returns The next match data
   */
  // public async getNextMatch(): Promise<Match> {
  //   return new Promise(async (resolve, reject) => {
  //     await Match.load(this.nextMatchId)
  //       .then((match: Match) => {
  //         resolve(match)
  //       })
  //       .catch((err) => {
  //         reject(err)
  //       })
  //   })
  // }

  public getDivisionId(): string {
    return this.divisionId
  }

  public getMatchId(): string {
    return this.matchId
  }

  public getMatchName(): string {
    return this.matchName
  }

  // public getNextMatchId(): string {
  //   return this.nextMatchId
  // }

  public getRound(): number {
    return this.round
  }

  // public getPlayDate(): Date {
  //   return this.playDate
  // }

  public getStatus(): MatchStatusOptions {
    return this.status
  }

  public getWinnerStatus(): MatchWinnerOptions {
    return this.winner
  }

  public getContestants(): ContestantType[] {
    return this.contestants
  }

  public getScores(): number[] {
    return this.scores
  }

  public getScore(contestantIndex: number): number {
    return this.scores[contestantIndex]
  }

  public setDivisionId(newId: string) {
    this.divisionId = newId
  }

  public setMatchName(newName: string) {
    this.matchName = newName
  }

  // public setNextMatchId(newId: string) {
  //   this.nextMatchId = newId
  // }

  public setRound(newRound: number) {
    this.round = newRound
  }

  // public setPlayDate(newDate: string) {
  //   this.playDate = newDate
  // }

  public setStatus(newStatus: MatchStatusOptions) {
    this.status = newStatus
  }

  public setWinner(winner: MatchWinnerOptions) {
    this.winner = winner
  }

  public setContestants(newContestants: ContestantType[]) {
    this.contestants = newContestants
  }

  public setScores(newScores: number[]) {
    this.scores = newScores
  }

  public setScore(contestantIndex: number, newScore: number) {
    this.scores[contestantIndex] = newScore
  }
}
