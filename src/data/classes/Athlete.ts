import { BaseDirectory, readTextFile, removeFile } from "@tauri-apps/api/fs"
import { writeInto } from "../../utils/fileManager"
import { generateID } from "../../utils/idGenerator"
import { Gender } from "../../types"
import MatchHistory from "./MatchHistory"
import Team from "./Team"

export default class Athlete {
  private athleteId: string
  private athleteName: string
  private imageUrl: string
  private ttl: string
  private gender: Gender
  private age: number
  private weight: number
  private currentTeamId: string
  private matchHistoryIds: string[]

  constructor(
    athleteId?: string,
    athleteName: string = "",
    imageUrl: string = "",
    ttl: string = "",
    gender: Gender = "m",
    age: number = 0,
    weight: number = 0,
    currentTeamId: string = "",
    matchHistoryIds: string[] = []
  ) {
    this.athleteId = athleteId || generateID("a")
    this.athleteName = athleteName
    this.imageUrl = imageUrl
    this.ttl = ttl
    this.gender = gender
    this.age = age
    this.weight = weight
    this.currentTeamId = currentTeamId
    this.matchHistoryIds = matchHistoryIds
  }

  /**
   * Save Athlete data to filesystem.
   */
  public save() {
    writeInto(this, `athletes/${this.athleteId}`)
  }

  /**
   * Read Athlete data from filesystem.
   *
   * @param athleteId Athlete ID
   * @returns Athlete data
   */
  public static async load(athleteId: string): Promise<Athlete> {
    return new Promise(async (resolve, reject) => {
      // Read from filesystem
      await readTextFile(`athletes/${athleteId}.data`, {
        dir: BaseDirectory.AppData,
      })
        // If file is found, parse its content
        .then((data) => {
          const parsedData: Athlete = JSON.parse(data)

          // Create a new Athlete object
          const athlete = new Athlete(
            parsedData.athleteId,
            parsedData.athleteName,
            parsedData.imageUrl,
            parsedData.ttl,
            parsedData.gender,
            parsedData.age,
            parsedData.weight,
            parsedData.currentTeamId,
            parsedData.matchHistoryIds
          )

          // Resolve the promise with the Athlete object
          resolve(athlete)
        })

        // If file is not found, reject the promise
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Delete Athlete data from filesystem.
   * 
   * ! Warning: Do not use. May break references.
   */
  public async delete(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Delete the Athlete object from its current team
      await this.getCurrentTeam()

        // If Athlete is found in a team, delete it
        .then((team) => {
          team.removeMemberId(this.athleteId)
        })

        // If Athlete is not found in a team, reject the promise
        .catch((err) => {
          reject(err)
        })
      
      // Delete all match histories related to this athlete
      await Promise.all(
        this.matchHistoryIds.map(async (id) => {
          return await MatchHistory.load(id)
        })
      ).then((matchHistories) => {
        matchHistories.forEach((matchHistory) => {
          matchHistory.delete()
        })
      })

      // Delete the Athlete object from filesystem
      await removeFile(`athletes/${this.athleteId}.data`, {
        dir: BaseDirectory.AppData,
      })

      // Resolve the promise
      resolve()
    })
  }

  /**
   * Get the athlete's total wins.
   *
   * @returns Total wins
   */
  public async calculateTotalWins(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        // Load all match histories
        const matchHistories = await Promise.all(
          this.matchHistoryIds.map(async (id) => {
            return await MatchHistory.load(id)
          })
        )

        // Calculate total wins
        let totalWins = 0
        matchHistories.forEach((matchHistory) => {
          if (matchHistory.getIsWinning()) {
            totalWins++
          }
        })

        // Resolve the promise
        resolve(totalWins)
      } catch (err) {
        // If an error occurs, reject the promise
        reject(err)
      }
    })
  }

  /**
   * Get the athlete's win rate ratio.
   *
   * @returns Win rate
   */
  public async calculateWinRate(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get total wins
        const totalWins = await this.calculateTotalWins()

        // Calculate win rate
        const winRate = totalWins / this.matchHistoryIds.length

        // Resolve the promise
        resolve(winRate)
      } catch (err) {
        // If an error occurs, reject the promise
        reject(err)
      }
    })
  }

  /**
   * Get the team data the athlete is currently in.
   *
   * @returns Team data
   */
  public async getCurrentTeam(): Promise<Team> {
    return new Promise(async (resolve, reject) => {
      // Load the current team
      await Team.load(this.currentTeamId)

        // If team is found, resolve the promise
        .then((team) => {
          resolve(team)
        })

        // If team is not found, reject the promise
        .catch((err) => {
          reject(err)
        })
    })
  }

  public getAthleteId(): string {
    return this.athleteId
  }

  public getAthleteName(): string {
    return this.athleteName
  }
  public getImageUrl(): string {
    return this.imageUrl
  }

  public getTtl(): string {
    return this.ttl
  }

  public getGender(): "m" | "f" {
    return this.gender
  }

  public getAge(): number {
    return this.age
  }
  public getWeight(): number {
    return this.weight
  }

  public getCurrentTeamId(): string {
    return this.currentTeamId
  }

  public getMatchHistoryIds(): string[] {
    return this.matchHistoryIds
  }

  public setAthleteName(newName: string) {
    this.athleteName = newName
  }

  public setImageUrl(newUrl: string) {
    this.imageUrl = newUrl
  }

  public setTtl(newTtl: string) {
    this.ttl = newTtl
  }

  public setGender(gender: Gender) {
    this.gender = gender
  }

  public setAge(age: number) {
    this.age = age
  }

  public setWeight(weight: number) {
    this.weight = weight
  }

  public setCurrentTeamId(newTeamId: string) {
    this.currentTeamId = newTeamId
  }

  public setMatchHistoryIds(newMatchHistoryIds: string[]) {
    this.matchHistoryIds = newMatchHistoryIds
  }

  public addMatchHistoryId(newMatchHistoryId: string) {
    this.matchHistoryIds.push(newMatchHistoryId)
  }

  public removeMatchHistoryId(matchHistoryId: string) {
    this.matchHistoryIds = this.matchHistoryIds.filter(
      (id) => id !== matchHistoryId
    )
  }
}
