class Team {
  teamId: string
  teamName: string
  initial: string
  city: string
  members: Athlete[]

  constructor(teamId: string, teamName: string, initial: string, city: string, members: Athlete[]) {
    this.teamId = teamId
    this.teamName = teamName
    this.initial = initial
    this.city = city
    this.members = members
  }

  /**
   *  Serialize Team object to JSON string
   * 
   * @returns Team object in JSON string
   */
  public serialize(): string {
    return JSON.stringify({
      teamId: this.teamId,
      teamName: this.teamName,
      initial: this.initial,
      city: this.city,
      members: this.members
    })
  }

  /**
   * Deserialize JSON string to Team object
   * 
   * @param jsonString JSON string
   * @returns Team object
   */
  public static deserialize(jsonString: string): Team {
    const tmpObj = JSON.parse(jsonString)

    return new Team(
      tmpObj.teamId,
      tmpObj.teamName,
      tmpObj.initial,
      tmpObj.city,
      tmpObj.members
    )
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

  public getMembers(): Athlete[] {
    return this.members
  }

  public addMember(member: Athlete): void {
    this.members.push(member)
  }

  public removeMember(member: Athlete): void {
    this.members = this.members.filter((registeredMember) => registeredMember.getId() !== member.getId())
  }
}