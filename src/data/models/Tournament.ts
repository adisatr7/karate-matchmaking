import { DivisionType } from "../../types"

type TournamentStatusOptions = "pendaftaran" | "akan main" | "selesai" | "ditunda" | "dibatalkan"


class Tournament {
  
  /** 
   * Tournament ID. Should always be automatically generated 
   * using `generateID()` method when creating a whole new 
   * tournament object.
   */
  private id: string

  /** Tournament name. */
  private name: string

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

  /** Tournament divisions, a list of Division objects. */
  private divisions: Division[]

  /**
   * Tournament constructor, used to create new Tournament object
   * 
   * @param id Tournament ID
   * @param name Tournament name
   * @param desc Tournament description
   * @param status Tournament status
   * @param hostedBy Tournament host
   * @param divisions Tournament divisions
   */
  constructor(id: string, name: string = "", desc: string = "", status: TournamentStatusOptions = "pendaftaran", hostedBy: string = "", divisions: Division[] = []) {
    this.id = id
    this.name = name
    this.desc = desc
    this.status = status
    this.hostedBy = hostedBy
    this.divisions = divisions
  }

  /**
   * Serialize Tournament object to JSON string
   * 
   * @returns Tournament object in JSON string
   */
  public serialize(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      desc: this.desc,
      status: this.status,
      hostedBy: this.hostedBy,
      divisions: this.divisions
    })
  }

  /**
   * Deserialize JSON string to Tournament object
   * 
   * @param jsonString Tournament object in JSON string
   * @returns Tournament object
   */
  public static deserialize(jsonString: string): Tournament {
    const tmpObj = JSON.parse(jsonString)

    return new Tournament(
      tmpObj.id,
      tmpObj.name,
      tmpObj.desc,
      tmpObj.status,
      tmpObj.hostedBy,
      tmpObj.divisions
    )
  }

  public getId(): string {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getDesc(): string {
    return this.desc
  }

  public getStatus(): TournamentStatusOptions {
    return this.status
  }

  public getHostedBy(): string {
    return this.hostedBy
  }

  public getDivisions(): DivisionType[] {
    return this.divisions
  }

  public setId(id: string): void {
    this.id = id
  }

  public setName(name: string): void {
    this.name = name
  }

  public setDesc(desc: string): void {
    this.desc = desc
  }

  public setStatus(status: TournamentStatusOptions): void {
    this.status = status
  }

  public setHostedBy(hostedBy: string): void {
    this.hostedBy = hostedBy
  }

  public setDivisions(divisions: DivisionType[]): void {
    this.divisions = divisions
  }
}