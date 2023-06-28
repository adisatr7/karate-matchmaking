import { BaseDirectory, readTextFile, removeFile } from "@tauri-apps/api/fs"
import { writeInto } from "../../utils/fileManager"
import generateID from "../../utils/generateID"
import { Athlete } from "./Athlete"
import { Match } from "./Match"

export class MatchHistory {
  private matchHistoryId: string
  private athleteId: string
  private matchId: string
  private isWinning: boolean
  private yuko: number
  private wazari: number
  private ippon: number

  constructor(matchHistoryId?: string, athleteId: string = "", matchId: string = "", isWinning: boolean = false, yuko: number = 0, wazari: number = 0, ippon: number = 0) {
    this.matchHistoryId = matchHistoryId || generateID()
    this.athleteId = athleteId
    this.matchId = matchId
    this.isWinning = isWinning
    this.yuko = yuko
    this.wazari = wazari
    this.ippon = ippon
  }

  /**
   * Save MatchHistory data to filesystem.
   */
  public save() {
    writeInto(this, `matchHistories/${this.matchHistoryId}`)
  }

  /**
   * 
   * @param matchHistoryId 
   * @returns 
   */
  public static async load(matchHistoryId: string): Promise<MatchHistory> {
    return new Promise(async (resolve, reject) => {

      // Read from filesystem
      await readTextFile(
        `matchHistories/${matchHistoryId}.data`, {
        dir: BaseDirectory.AppData
      })

      // If file is found, parse its content
      .then(data => {
        const parsedData: MatchHistory = JSON.parse(data)

        // Create a new MatchHistory object
        const matchHistory = new MatchHistory(
          parsedData.matchHistoryId,
          parsedData.athleteId,
          parsedData.matchId,
          parsedData.isWinning,
          parsedData.yuko,
          parsedData.wazari,
          parsedData.ippon
        )

        // Resolve promise
        resolve(matchHistory)
      })

      // If file is not found, reject the promise
      .catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Delete MatchHistory data from filesystem.
   * 
   * @returns Promise that resolves to an array of MatchHistory objects
   */
  public async delete(): Promise<void> {
    return new Promise(async (resolve, reject) => {

      // Delete MatchHistory data from filesystem
      await removeFile(
        `matchHistories/${this.matchHistoryId}.data`, {
        dir: BaseDirectory.AppData
      })

      // If MatchHistory data is deleted, resolve the promise
      .then(() => {
        resolve()
      })

      // If there's an error, reject the promise
      .catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Get the athlete data that is associated with this match history.
   * 
   * @returns Athlete data
   */
  public async getAthleteData(): Promise<Athlete> {
    return new Promise(async (resolve, reject) => {

      // Load Athlete data from filesystem
      await Athlete.load(this.athleteId)

      // If Athlete data is found, resolve the promise
      .then(athlete => {
        resolve(athlete)
      })

      // If Athlete data is not found, reject the promise
      .catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Get the match data that is associated with this match history.
   * 
   * @returns Match data
   */
  public async getMatchData(): Promise<Match> {
    return new Promise(async (resolve, reject) => {
        
        // Load Match data from filesystem
        await Match.load(this.matchId)
  
        // If Match data is found, resolve the promise
        .then(match => {
          resolve(match)
        })
  
        // If Match data is not found, reject the promise
        .catch(err => {
          reject(err)
        })
    })
  }

  public getMatchHistoryId(): string {
    return this.matchHistoryId
  }

  public getAthleteId(): string {
    return this.athleteId
  }

  public getMatchId(): string {
    return this.matchId
  }

  public getIsWinning(): boolean {
    return this.isWinning
  }

  public getYuko(): number {
    return this.yuko
  }

  public getWazari(): number {
    return this.wazari
  }

  public getIppon(): number {
    return this.ippon
  }

  public setIsWinning(isWinning: boolean): void {
    this.isWinning = isWinning
  }

  public setYuko(newScore: number): void {
    this.yuko = newScore
  }

  public setWazari(newScore: number): void {
    this.wazari = newScore
  }

  public setIppon(newScore: number): void {
    this.ippon = newScore
  }
}