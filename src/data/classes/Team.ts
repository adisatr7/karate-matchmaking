import Athlete from "./Athlete"
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import { writeInto } from "../../utils/fileManager"
import { generateID } from "../../utils/idGenerator"

export default class Team {
  private teamId: string
  private teamName: string
  private desc: string
  private initial: string
  private dateCreated: string
  private city: string
  private memberIds: string[]

  constructor(
    teamId?: string,
    teamName: string = "",
    desc: string = "",
    initial: string = "",
    dateCreated: string = new Date().toISOString(),
    city: string = "",
    memberIds: string[] = []
  ) {
    this.teamId = teamId ? teamId : generateID("t")
    this.teamName = teamName
    this.desc = desc
    this.initial = initial
    this.dateCreated = dateCreated
    this.city = city
    this.memberIds = memberIds
  }

  /**
   * Serialize Team object and save it to filesystem.
   */
  public save() {
    writeInto(this, `teams/${this.teamId}`)
  }

  /**
   * Deserialize JSON string to Team object
   *
   * @param jsonString JSON string
   * @returns Team object
   */
  public static async load(teamId: string): Promise<Team> {
    return new Promise(async (resolve, reject) => {
      // Read from filesystem
      await readTextFile(`teams/${teamId}.data`, {
        dir: BaseDirectory.AppData,
      })
        // If file is found, parse its content
        .then((data) => {
          const parsedData = JSON.parse(data)

          // Create a new Team object
          const team = new Team(
            parsedData.teamId,
            parsedData.teamName,
            parsedData.desc,
            parsedData.initial,
            parsedData.dateCreated,
            parsedData.city,
            parsedData.memberIds
          )

          // Resolve promise
          resolve(team)
        })

        // If file is not found, reject the promise
        .catch((err) => {
          reject(err)
        })
    })
  }

  public getTeamId(): string {
    return this.teamId
  }

  public getTeamName(): string {
    return this.teamName
  }

  public getDesc(): string {
    return this.desc
  }

  public getInitial(): string {
    return this.initial
  }

  public getDateCreated(): string {
    return this.dateCreated
  }

  public getCity(): string {
    return this.city
  }

  public getMemberIds(): string[] {
    return this.memberIds
  }

  /**
   * Get list of Athlete data.
   *
   * @returns List of Athlete data
   */
  public async getMembers(): Promise<Athlete[]> {
    return new Promise(async (resolve, reject) => {
      // Create an empty list to store the Athlete data
      const members: Athlete[] = []

      // For each member of this team
      this.memberIds.forEach(async (memberId) => {
        // Load the Athlete data from filesystem
        await Athlete.load(memberId)

          // If Athlete data is found, push it into the list
          .then((member) => {
            members.push(member)
          })

          // If Athlete data is not found, reject the promise
          .catch((err) => {
            reject(err)
          })
      })

      // Resolve the promise with the list of Athlete data
      resolve(members)
    })
  }

  public isMember(memberId: string): boolean {
    return this.memberIds.includes(memberId)
  }

  public addMemberId(memberId: string): void {
    this.memberIds.push(memberId)
  }

  public removeMemberId(memberId: string): void {
    this.memberIds = this.memberIds.filter((id) => id !== memberId)
  }

  public setTeamName(newName: string): void {
    this.teamName = newName
  }

  public setDesc(desc: string): void {
    this.desc = desc
  }

  public setInitial(newInitial: string): void {
    this.initial = newInitial
  }

  public setDateCreated(newDate: string): void {
    this.dateCreated = newDate
  }

  public setCity(newCity: string): void {
    this.city = newCity
  }
}
