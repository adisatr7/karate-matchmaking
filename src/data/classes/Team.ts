import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import { Athlete } from "./Athlete"
import { writeInto } from "../../utils/fileManager"
import { generateID } from "../../utils/idGenerator"

export class Team {
  private teamId: string
  private teamName: string
  private initial: string
  private city: string
  private memberIds: string[]

  constructor(
    teamId?: string,
    teamName: string = "",
    initial: string = "",
    city: string = "",
    memberIds: string[] = []
  ) {
    this.teamId = teamId ? teamId : generateID("t")
    this.teamName = teamName
    this.initial = initial
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
            parsedData.initial,
            parsedData.city,
            parsedData.members
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

  public getId(): string {
    return this.teamId
  }

  public getName(): string {
    return this.teamName
  }

  public getInitial(): string {
    return this.initial
  }

  public getCity(): string {
    return this.city
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

  public addMemberId(memberId: string): void {
    this.memberIds.push(memberId)
  }

  public removeMemberId(memberId: string): void {
    this.memberIds = this.memberIds.filter((id) => id !== memberId)
  }
}
