import Match from "./Match"
import Team from "./Team"
import Tournament from "./Tournament"
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import { ContestantType, Gender } from "../../types"
import { writeInto } from "../../utils/fileManager"
import { generateID } from "../../utils/idGenerator"
import Athlete from "./Athlete"
import useNotification from "../../hooks/useNotification"

export default class Division {
  private tournamentId: string
  private divisionId: string
  private divisionName: string
  private gender: Gender
  private contestants: ContestantType[]
  private matchIds: string[]
  private finalist: ContestantType | null

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
    gender: Gender = "m",
    contestants: ContestantType[] = [],
    matchIds: string[] = [],
    finalist?: ContestantType
  ) {
    this.divisionId = divisionId || generateID("k")
    this.tournamentId = tournamentId
    this.divisionName = divisionName
    this.gender = gender
    this.contestants = contestants
    this.matchIds = matchIds
    this.finalist = finalist || null
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
          const parsedData = JSON.parse(data)

          // Create a new Division object
          const division = new Division(
            parsedData.divisionId,
            parsedData.tournamentId,
            parsedData.divisionName,
            parsedData.gender,
            parsedData.contestants,
            parsedData.matchIds,
            parsedData.finalist
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

  /**
   * Generate matches for this division all the way to the final match.
   * Future matches are created but have no contestants yet.
   */
  public generateMatches(): void {
    // Calculate the amount of rounds needed based on the amount of contestants
    const rounds = Math.ceil(Math.log2(this.contestants.length))

    // Create an empty list to store the matches
    const matches: Match[] = []
    let game = 0

    // For each round
    for (let round = 0; round < rounds; round++) {
      // Calculate the amount of matches in this round
      const matchesInRound = Math.ceil(this.contestants.length / Math.pow(2, round + 1))

      // For each match in this round
      for (let match = 0; match < matchesInRound; match++) {
        // // Check if there are enough contestants to create a regular match
        // if (this.contestants.length > match * 2 + 1) {

        // Create a new match
        const newMatch = new Match(
          this.divisionId,
          generateID(`m-${game}`),
          this.generateMatchName(game, this.contestants.length),
          // "Placeholder: NextMatchID",
          round,
          "akan main",
          "tbd",
          [this.contestants[match * 2], this.contestants[match * 2 + 1]],
          [0, 0]
        )

        // Add the new match to the list
        matches.push(newMatch)
        // } 
        
        // // If there are not enough contestants, create a bye match
        // else {
        //   const byeMatch = new Match(this.divisionId)
        //   byeMatch.setBye(true)

        //   // Add the bye match to the list
        //   matches.push(byeMatch)
        // }
      }
    }

    // Save the matches into filesystem
    matches.forEach((match) => {
      match.save()
    })
  }

  /**
   * Generate match name.
   * 
   * @param currentMatchNumber Current match number, starting from 0
   * @param totalMatches Total amount of matches in this division
   * 
   * @returns Match name
   */
  private generateMatchName(currentMatchNumber: number, totalMatches: number): string {
    // Qualification round
    if (currentMatchNumber <= totalMatches / 2) {
      return `Babak Penyisihan ${currentMatchNumber}`
    }

    // Quarter final
    else if (currentMatchNumber <= totalMatches * 0.75) {
      return `Perempat Final ${currentMatchNumber - totalMatches / 2}`
    }

    // Semi final
    else if (currentMatchNumber <= totalMatches * 0.875) {
      return `Semi Final ${currentMatchNumber - totalMatches * 0.75}`
    }

    // Final
    else if (currentMatchNumber <= totalMatches * 0.9375) {
      return `Final ${currentMatchNumber - totalMatches * 0.875}`
    }

    return `Pertandingan ke-${currentMatchNumber +1}`
  }

  // /**
  //  * Generate match name for all matches in this division.
  //  * 
  //  * @param matchId Match ID
  //  * @returns Match object 
  //  */
  // public async getMatch(matchId: string): Promise<Match> {
  //   return new Promise(async (resolve, reject) => {
  //     // Read match data from filesystem
  //     await readTextFile(`matches/${matchId}.data`)
  //       // If match data is found, resolve the promise
  //       .then(async (matchData) => {
  //         const match: Match = await Match.load(matchData)
  //         resolve(match)
  //       })

  //       // If match data is not found, reject the promise
  //       .catch((err) => {
  //         reject(err)
  //       })
  //   })
  // }

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
    return this.divisionName // + this.gender === "m" ? " Putra" : " Putri"
  }

  public getGender(): Gender {
    return this.gender
  }

  public getContestantsList(): ContestantType[] {
    return this.contestants
  }

  public getMatchIds(): string[] {
    return this.matchIds
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
          const match = await Match.load(matchId)

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

  public getFinalist(): ContestantType | null {
    return this.finalist
  }

  public setName(name: string): void {
    this.divisionName = name
  }

  public setGender(gender: Gender): void {
    this.gender = gender
  }

  public setRegisteredTeams(registeredTeams: ContestantType[]): void {
    this.contestants = registeredTeams
  }

  public addContestant(newContestant: ContestantType): void {
    this.contestants.push(newContestant)
  }

  public removeContestant(team: ContestantType): void {
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

  public setFinalist(finalist: ContestantType): void {
    this.finalist = finalist
  }
}
