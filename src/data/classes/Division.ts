import Match from "./Match"
import Team from "./Team"
import Tournament from "./Tournament"
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import { ContestantType, DivisionType } from "../../types"
import { writeInto } from "../../utils/fileManager"
import { generateID } from "../../utils/idGenerator"
import Athlete from "./Athlete"
import useNotification from "../../hooks/useNotification"

export default class Division {
  private tournamentId: string
  private divisionId: string
  private divisionName: string
  private contestants: ContestantType[]
  private matchIds: string[]

  /**
   * Division constructor, used to create new Division object. Division ID
   * will be generated automatically via `generateID()` function.
   *
   * @param divisionName Division name
   * @param contestants Division registered teams
   * @param matches Division matches
   */
  constructor(
    divisionId?: string,
    tournamentId: string = "",
    divisionName: string = "",
    contestants: ContestantType[] = [],
    matchIds: string[] = []
  ) {
    this.divisionId = divisionId || generateID("k")
    this.tournamentId = tournamentId
    this.divisionName = divisionName
    this.contestants = contestants
    this.matchIds = matchIds
  }

  /**
   * Serialize Division object to JSON string and save it into filesystem.
   */
  public save() {
    writeInto(this, `divisions/${this.divisionId}`)
  }

  /**
   * Read from a filesystem and deserialize it into a Division object.
   *
   * @returns A Division object
   */
  public static async load(divisionId: string): Promise<Division> {
    return new Promise(async (resolve, reject) => {
      // Read from filesystem
      await readTextFile(`divisions/${divisionId}.data`, {
        dir: BaseDirectory.AppData,
      })
        // If file is found, parse its content
        .then((data) => {
          const parsedData: DivisionType = JSON.parse(data)

          // Create a new Division object
          const division = new Division(
            parsedData.divisionId,
            parsedData.tournamentId,
            parsedData.divisionName,
            parsedData.registeredTeams,
            parsedData.matchIds
          )

          // Resolve the promise with the new Division object
          resolve(division)
        })

        // If data is not found, reject the promise with the error
        .catch((err) => {
          reject(err)
        })
    })
  }

  // TODO: Implement match randomizer based on how many teams are registered

  public async getMatch(matchId: string): Promise<Match> {
    return new Promise(async (resolve, reject) => {
      // Read match data from filesystem
      await readTextFile(`matches/${matchId}.data`)
        // If match data is found, resolve the promise
        .then(async (matchData) => {
          const match: Match = await Match.load(matchData)
          resolve(match)
        })

        // If match data is not found, reject the promise
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Get the tournament data this division belongs to.
   *
   * @returns Tournament data
   */
  public async getTournamentData(): Promise<Tournament> {
    return new Promise(async (resolve, reject) => {
      // Read tournament data from filesystem
      await Tournament.load(this.tournamentId)

        // If tournament data is found, resolve the promise
        .then((tournament) => {
          resolve(tournament)
        })

        // If tournament data is not found, reject the promise
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Get the amount of registered teams.
   *
   * @returns Amount of registered teams
   */
  public getContestantAmount(): number {
    return this.contestants.length
  }

  public getTournamentId(): string {
    return this.tournamentId
  }

  public getDivisionId(): string {
    return this.divisionId
  }

  public getDivisionName(): string {
    return this.divisionName
  }

  public getContestantsList(): ContestantType[] {
    return this.contestants
  }

  /**
   * Get registered teams data.
   *
   * @returns A list of registered teams data
   */
  public async getRegisteredTeams(): Promise<Team[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create an empty list to store the teams data
        const teams: Team[] = []

        // For each registered team IDs stored by this Division
        this.contestants.forEach(async (contestant) => {
          const team: Team = await Team.load(contestant.teamId)
          teams.push(team)
        })

        // At the end of the forEach loop, resolve the promise
        resolve(teams)
      } catch (err) {
        // In the case of an error, reject the promise
        useNotification("Terjadi kesalahan saat mengambil data tim", err)
        reject(err)
      }
    })
  }

  /**
   * Get registered athletes data.
   *
   * @returns A list of registered athletes data
   */
  public async getRegisteredAthletes(): Promise<Athlete[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create an empty list to store the athletes data
        const athletes: Athlete[] = []

        // For each registered team IDs stored by this Division
        this.contestants.forEach(async (contestant) => {
          const athlete: Athlete = await Athlete.load(contestant.athleteId)
          athletes.push(athlete)
        })

        // Resolve the promise
        resolve(athletes)
      } catch (err) {
        // In the case of an error, reject the promise
        useNotification("Terjadi kesalahan saat mengambil data atlet", err)
        reject(err)
      }
    })
  }

  /**
   * Get all Match data that belong to this division
   *
   * @returns List of Match data
   */
  public async getMatches(): Promise<Match[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create an empty list to store the matches data
        const matches: Match[] = []

        // For each match IDs stored by this Division
        this.matchIds.forEach(async (matchId) => {
          // Get the match data from filesystem
          const match = await this.getMatch(matchId)

          // Push the data into the list created earlier
          matches.push(match)
        })

        // Resolve the promise
        resolve(matches)
      } catch (err) {
        // In the case of an error, reject the promise
        reject(err)
      }
    })
  }

  public setName(name: string): void {
    this.divisionName = name
  }

  public setRegisteredTeams(registeredTeams: ContestantType[]): void {
    this.contestants = registeredTeams
  }

  public addRegisteredTeam(team: ContestantType): void {
    this.contestants.push(team)
  }

  public removeRegisteredTeam(team: ContestantType): void {
    this.contestants = this.contestants.filter(
      (registeredTeam) => registeredTeam.teamId !== team.teamId
    )
  }

  public setMatchIds(newMatchIds: string[]): void {
    this.matchIds = newMatchIds
  }

  public addMatchId(newMatchId: string): void {
    this.matchIds.push(newMatchId)
  }

  public removeMatchId(matchId: string): void {
    this.matchIds = this.matchIds.filter((id) => id !== matchId)
  }
}
