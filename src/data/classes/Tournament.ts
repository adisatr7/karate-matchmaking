import { BaseDirectory, readTextFile, removeFile } from "@tauri-apps/api/fs"
import { TournamentStatusOptions, TournamentType } from "../../types"
import { writeInto } from "../../utils/fileManager"
import { generateID } from "../../utils/idGenerator"
import Division from "./Division"
import useNotification from "../../hooks/useNotification"

export default class Tournament {
  private tournamentId: string
  private tournamentName: string
  private desc: string
  private status: TournamentStatusOptions
  private hostedBy: string
  private divisionIds: string[]

  /**
   * Tournament constructor, used to create new Tournament object
   *
   * @param tournamentId Tournament ID
   * @param tournamentName Tournament name
   * @param desc Tournament description
   * @param status Tournament status
   * @param hostedBy Tournament host
   * @param divisionIds Tournament divisions
   */
  constructor(
    tournamentId?: string,
    tournamentName: string = "",
    desc: string = "",
    status: TournamentStatusOptions = "pendaftaran",
    hostedBy: string = "",
    divisionIds: string[] = []
  ) {
    this.tournamentId = tournamentId || generateID("p")
    this.tournamentName = tournamentName
    this.desc = desc
    this.status = status
    this.hostedBy = hostedBy
    this.divisionIds = divisionIds
  }

  /**
   * Serialize Tournament object to JSON string
   *
   * @returns Tournament object in JSON string
   */
  public save() {
    writeInto(this, `tournaments/${this.tournamentId}`)
  }

  /**
   * Read from filesystem and deserialize it into a Tournament object.
   *
   * @param tournamentId Tournament ID
   * @returns Tournament object
   */
  public static async load(tournamentId: string): Promise<Tournament> {
    return new Promise(async (resolve, reject) => {
      readTextFile(`tournaments/${tournamentId}.data`, {
        dir: BaseDirectory.AppData,
      })
        // If file is found, parse its content
        .then((data) => {
          const parsedObject: TournamentType = JSON.parse(data)

          // Create a new Tournament object
          const tournament = new Tournament(
            parsedObject.tournamentId,
            parsedObject.tournamentName,
            parsedObject.desc,
            parsedObject.status,
            parsedObject.hostedBy,
            parsedObject.divisionIds
          )

          // Resolve the promise
          resolve(tournament)
        })

        // If file is not found, reject the promise
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Count the amount of contestants that belong to this tournament.
   *
   * @returns Amount of contestants
   */
  public async getContestantAmount(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      
      // Get all divisions that belong to this tournament
      await this.getDivisions()

        // Get all contestants from each division
        .then(async (divisions) => {

          // Create a variable to store the total amount of contestants
          let totalContestantAmount = 0

          // Count the amount of contestants from each division
          divisions.forEach(division => {
            const contestantAmount = division.getContestantAmount()

            // Add the amount of contestants to the total amount
            totalContestantAmount += contestantAmount
          })

          // Resolve the promise
          resolve(totalContestantAmount)
        })

        // If error occured, reject the promise
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Get all divisions data that belong to this tournament.
   */
  public async getDivisions(): Promise<Division[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create a list of Division objects
        const divisions: Division[] = []

        // Get all divisions
        this.divisionIds.forEach(async (divisionId) => {
          const division = await Division.load(divisionId)
          divisions.push(division)
        })

        // Resolve the promise
        resolve(divisions)
      } catch (err) {
        // If error occured, reject the promise
        reject(err)
      }
    })
  }

  public getTournamentId(): string {
    return this.tournamentId
  }

  public getTournamentName(): string {
    return this.tournamentName
  }

  public getDesc(): string {
    return this.desc
  }

  public getStatus(): TournamentStatusOptions {
    return this.status
  }

  public getHost(): string {
    return this.hostedBy
  }

  public getDivisionIds(): string[] {
    return this.divisionIds
  }

  public setTournamentId(id: string): void {
    this.tournamentId = id
  }

  public setTournamentName(name: string): void {
    this.tournamentName = name
  }

  public setDesc(desc: string): void {
    this.desc = desc
  }

  public setStatus(status: TournamentStatusOptions): void {
    this.status = status
  }

  public setHost(hostedBy: string): void {
    this.hostedBy = hostedBy
  }

  /**
   * Set tournament divisions.
   *
   * @param divisions A list of Division IDs that belong to this tournament.
   */
  public setDivisions(divisions: string[]): void {
    this.divisionIds = divisions
  }

  /**
   * Add a division to this tournament.
   *
   * @param divisionId A Division ID that belongs to this tournament.
   */
  public addDivision(divisionId: string): void {
    this.divisionIds.push(divisionId)
  }

  /**
   * Remove a division of the given ID from this tournament.
   *
   * @param divisionId A Division ID that belongs to this tournament.
   */
  public removeDivision(divisionId: string): void {
    this.divisionIds = this.divisionIds.filter(
      (division) => division !== divisionId
    )
  }

  /**
   * Delete this tournament from filesystem.
   */
  public async delete(): Promise<void> {

    // Delete this tournament from filesystem
    await removeFile(`tournaments/${this.tournamentId}.data`, { dir: BaseDirectory.AppData })

      // Delete all divisions that belong to this tournament
      .then(() => {
        useNotification("Berhasil", "Data pertandingan berhasil dihapus")
      })

      // If error occured, show a notification
      .catch(err => {
        useNotification("Gagal", `Data pertandingan gagal dihapus: ${err}`)
      })
  }
}
