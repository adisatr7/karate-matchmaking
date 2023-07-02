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
  private divisionId: string
  private matchId: string
  private matchName: string
  private nextMatchId: string
  private playDate: string
  private status: MatchStatusOptions
  private winner: MatchWinnerOptions
  private contestants: ContestantType[]

  constructor(
    divisionId: string,
    matchId?: string,
    matchName: string = "",
    nextMatchId: string = "",
    playDate: string = "",
    status: MatchStatusOptions = "akan main",
    winner: MatchWinnerOptions = "tbd",
    contestants: ContestantType[] = []
  ) {
    this.divisionId = divisionId
    this.matchId = matchId || generateID("m")
    this.matchName = matchName
    this.nextMatchId = nextMatchId
    this.playDate = playDate
    this.status = status
    this.winner = winner
    this.contestants = contestants
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
            parsedData.nextMatchId,
            parsedData.playDate,
            parsedData.status,
            parsedData.winner,
            parsedData.contestants
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
  public async getNextMatch(): Promise<Match> {
    return new Promise(async (resolve, reject) => {
      await Match.load(this.nextMatchId)
        .then((match: Match) => {
          resolve(match)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  public getDivisionId(): string {
    return this.divisionId
  }

  public getMatchId(): string {
    return this.matchId
  }

  public getMatchName(): string {
    return this.matchName
  }

  public getNextMatchId(): string {
    return this.nextMatchId
  }

  public getPlayDate(): string {
    return this.playDate
  }

  public getStatus(): MatchStatusOptions {
    return this.status
  }

  // TODO: May require some more thinking
  public getWinner(): MatchWinnerOptions {
    return this.winner
  }

  public getContestants(): ContestantType[] {
    return this.contestants
  }

  public setDivisionId(newId: string) {
    this.divisionId = newId
  }

  public setMatchName(newName: string) {
    this.matchName = newName
  }

  public setNextMatchId(newId: string) {
    this.nextMatchId = newId
  }

  public setPlayDate(newDate: string) {
    this.playDate = newDate
  }

  public setStatus(newStatus: MatchStatusOptions) {
    this.status = newStatus
  }

  public setWinner(winner: MatchWinnerOptions) {
    this.winner = winner
  }

  public setContestants(newContestants: ContestantType[]) {
    this.contestants = newContestants
  }
}
