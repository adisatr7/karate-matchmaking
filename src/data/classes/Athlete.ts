import { BaseDirectory, readTextFile, removeFile } from "@tauri-apps/api/fs"
import { writeInto } from "../../utils/fileManager"
import { generateID } from "../../utils/idGenerator"
import { Gender } from "../../types"
import MatchHistory from "./MatchHistory"
import Team from "./Team"
import useNotification from "../../hooks/useNotification"

export default class Athlete {
  private athleteId: string
  private athleteName: string
  private imageUrl: string
  private ttl: string
  private gender: Gender
  private weight: number
  private height: number
  private currentTeamId: string
  private matchHistoryIds: string[]

  constructor(
    athleteId?: string,
    athleteName: string = "",
    imageUrl: string = "",
    ttl: string = "Bumi, 1 Januari 1970",
    gender: Gender = "m",
    weight: number = 0,
    height: number = 0,
    currentTeamId: string = "",
    matchHistoryIds: string[] = []
  ) {
    this.athleteId = athleteId || generateID("a")
    this.athleteName = athleteName
    this.imageUrl = imageUrl
    this.ttl = ttl
    this.gender = gender
    this.weight = weight
    this.height = height
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
            parsedData.weight,
            parsedData.height,
            parsedData.currentTeamId,
            parsedData.matchHistoryIds
          )

          // Resolve the promise with the Athlete object
          resolve(athlete)
        })

        // If file is not found, reject the promise
        .catch((err) => {
          useNotification("Terjadi kesalahan saat membaca data atlet", err)
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
          return await MatchHistory.loadByHistoryId(id)
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
            return await MatchHistory.loadByHistoryId(id)
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
   * @returns Win rate ratio
   */
  public async getWinRateRatio(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      // Get total wins
      await this.calculateTotalWins()
        .then((totalWins: number) => {
          // Calculate win rate
          const winrate = totalWins / this.matchHistoryIds.length

          // Resolve the promise
          if (winrate) resolve(winrate)
          else resolve(0)
        })

        .catch((err) => {
          reject(err)
          useNotification("Winrate rejected")
        })
    })
  }

  /**
   * Get the athlete's win rate percentage.
   *
   * @returns Win rate percentage
   */
  public async getWinRatePercent(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      // Get win rate ratio
      await this.getWinRateRatio()
        .then((winRateRatio) => {
          // Calculate win rate percent
          const winRatePercent = winRateRatio * 100

          // Resolve the promise
          resolve(winRatePercent)
        })

        // If an error occurs, reject the promise
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Get the athlete's total yuko score.
   *
   * @returns Total yuko
   */
  public async getTotalYuko(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        // Load all match histories
        const matchHistories = await Promise.all(
          this.matchHistoryIds.map(async (id) => {
            return await MatchHistory.loadByHistoryId(id)
          })
        )

        // Calculate total yuko
        let totalYuko = 0
        matchHistories.forEach((matchHistory) => {
          totalYuko += matchHistory.getYuko()
        })

        // Resolve the promise
        resolve(totalYuko)
      } catch (err) {
        // If an error occurs, reject the promise
        reject(err)
      }
    })
  }

  /**
   * Get the athlete's total wazari score.
   *
   * @returns Total wazari
   */
  public async getTotalWazari(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        // Load all match histories
        const matchHistories = await Promise.all(
          this.matchHistoryIds.map(async (id) => {
            return await MatchHistory.loadByHistoryId(id)
          })
        )

        // Calculate total wazari
        let totalWazari = 0
        matchHistories.forEach((matchHistory) => {
          totalWazari += matchHistory.getWazari()
        })

        // Resolve the promise
        resolve(totalWazari)
      } catch (err) {
        // If an error occurs, reject the promise
        reject(err)
      }
    })
  }

  /**
   * Get the athlete's total ippon score.
   *
   * @returns Total ippon
   */
  public async getTotalIppon(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        // Load all match histories
        const matchHistories = await Promise.all(
          this.matchHistoryIds.map(async (id) => {
            return await MatchHistory.loadByHistoryId(id)
          })
        )

        // Calculate total ippon
        let totalIppon = 0
        matchHistories.forEach((matchHistory) => {
          totalIppon += matchHistory.getIppon()
        })

        // Resolve the promise
        resolve(totalIppon)
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

  /**
   * Get the athlete's match histories.
   *
   * @returns Match histories
   */
  public async getMatchHistories(): Promise<MatchHistory[]> {
    return new Promise(async (resolve, reject) => {
      // Load all match histories
      await Promise.all(
        this.matchHistoryIds.map(async (id) => {
          return await MatchHistory.loadByHistoryId(id)
        })
      )

        // If match histories are found, resolve the promise
        .then((matchHistories) => {
          resolve(matchHistories)
        })

        // If match histories are not found, reject the promise
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
    try {
      const currentYear = new Date().getFullYear()
      const birthYear = this.getTtl().split(",")[1].split(" ")[3]

      return currentYear - parseInt(birthYear)
    } catch (err) {
      useNotification(
        "Terjadi kesalahan saat menghitung umur",
        `Data TTL mungkin tidak menggunakan format yang benar (${this.getTtl()})`
      )

      return -1
    }
  }
  public getWeight(): number {
    return this.weight
  }

  public getHeight(): number {
    return this.height
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

  public setWeight(weight: number) {
    this.weight = weight
  }

  public setHeight(height: number) {
    this.height = height
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
