class Division {
  private divisionId: string
  private divisionName: string
  private registeredTeams: Contestant[]
  private matches: Match[]

  /**
   * Division constructor, used to create new Division object
   * 
   * @param id Division ID
   * @param name Division name
   * @param registeredTeams Division registered teams
   * @param matches Division matches
   */
  constructor(id: string, name: string = "", registeredTeams: Contestant[] = [], matches: Match[] = []) {
    this.divisionId = id
    this.divisionName = name
    this.registeredTeams = registeredTeams
    this.matches = matches
  }

  /**
   * Serialize Division object to JSON string
   */
  public serialize(): string {
    return JSON.stringify({
      divisionId: this.divisionId,
      divisionName: this.divisionName,
      registeredTeams: this.registeredTeams,
      matches: this.matches
    })
  }

  /**
   * Deserialize JSON string to Division object
   */
  public static deserialize(jsonString: string): Division {
    const tmpObj = JSON.parse(jsonString)

    return new Division(
      tmpObj.divisionId,
      tmpObj.divisionName,
      tmpObj.registeredTeams,
      tmpObj.matches
    )
  }
  
  // TODO: Implement match randomizer based on how many teams are registered

  public getMatchById(matchId: string): Match | undefined {
    return this.matches.find((match) => match.getId() === matchId)
  }

  public getId(): string {
    return this.divisionId
  }

  public getName(): string {
    return this.divisionName
  }

  public getRegisteredTeams(): Contestant[] {
    return this.registeredTeams
  }

  public getMatches(): Match[] {
    return this.matches
  }

  public setName(name: string): void {
    this.divisionName = name
  }

  public setRegisteredTeams(registeredTeams: Contestant[]): void {
    this.registeredTeams = registeredTeams
  }

  public setMatches(matches: Match[]): void {
    this.matches = matches
  }

  public addRegisteredTeam(team: Contestant): void {
    this.registeredTeams.push(team)
  }

  public addMatch(match: Match): void {
    this.matches.push(match)
  }

  public removeRegisteredTeam(team: Contestant): void {
    this.registeredTeams = this.registeredTeams.filter((registeredTeam) => registeredTeam.getId() !== team.getId())
  }

  public removeMatch(match: Match): void {
    this.matches = this.matches.filter((registeredMatch) => registeredMatch.getId() !== match.getId())
  }
}