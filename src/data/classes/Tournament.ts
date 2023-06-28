import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import { TournamentStatusOptions, TournamentType } from "../../types"
import { writeInto } from "../../utils/fileManager"
import generateID from "../../utils/generateID"


export class Tournament {
  
  /** 
   * Tournament ID. Should always be automatically generated 
   * using `generateID()` method when creating a whole new 
   * tournament object.
   */
  private tournamentId: string

  /** Tournament name. */
  private tournamentName: string

  /** Tournament description. */
  private desc: string

  /** 
   * Tournament status. Can only be one of these:
   * - "pendaftaran"
   * - "akan main"
   * - "selesai"
   * - "ditunda"
   * - "dibatalkan"
   */
  private status: TournamentStatusOptions

  /** Tournament host. */
  private hostedBy: string

  /** A list of Division IDs that belong to this tournament.. */
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
  constructor(tournamentId?: string, tournamentName: string = "", desc: string = "", status: TournamentStatusOptions = "pendaftaran", hostedBy: string = "", divisionIds: string[] = []) {
    this.tournamentId = tournamentId || generateID()
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
      readTextFile(
        `tournaments/${tournamentId}.data`, {
        dir: BaseDirectory.AppData
      })

      // If file is found, parse its content
      .then(data => {
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
      .catch(err => {
        reject(err)
      })
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

  public getDivisions(): string[] {
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
    this.divisionIds = this.divisionIds.filter((division) => division !== divisionId)
  }
}