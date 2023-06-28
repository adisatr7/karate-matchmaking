/**
 * SVG React Component type definition
*/
export type SVGComponent = React.SVGProps<SVGSVGElement>

/**
 * SVG Icon type definition
*/
export type SVGIcon = React.FunctionComponent<SVGComponent>


/**
 * Options for currentPath state
 */
export type PathOptions = "highlight" | "tournaments" | "teams" | "athletes" | "settings"


/**
 * User data type definition used to login
 */
export type UserType = {
  userId: string,
  userName: string,
  password: string,
  imageUrl: string
} | null

/**
 * Tournament type definition
 */
export type TournamentType = {
  tournamentId: string,
  tournamentName: string,
  desc: string,
  status: "pendaftaran" | "akan main" | "berlangsung" | "selesai" | "ditunda" | "dibatalkan",
  hostedBy: string,
  divisions: DivisionType[],
  [key: string]: any    // Index signature to allow string indexing
}
 
/**
* Tournament subclass type definition
*/
export type DivisionType = {
  divisionId: string,
  divisionName: string,
  registeredTeams: ContestantType[],
  matches: MatchType[]
}

/**
  * Match type definition
  */
export type MatchType = {
  matchId: string,
  matchName?: string,
  nextMatchId: string,
  playDate: string,
  status: "akan main" | "berlangsung" | "selesai" | "ditunda" | "dibatalkan",
  winner: "team1" | "team2" | "draw" | null
  teams: ContestantType[]
}

/**
 * Contestant type definition
 */
export type ContestantType = {
  athleteId: string,
  athleteName: string,
  teamId: string,
  teamName: string,
}

/**
 * Team type definition
 */
export type TeamType = {
  teamId: string,
  teamName: string,
  initial: string,
  city: string,
  members: AthleteType[]
}

/**
 * Athlete type definition
 */
export type AthleteType = {
  athleteId: string,
  athleteName: string,
  imageUrl?: string,
  gender: "m" | "f",
  age: number,
  weight: number,
  currentTeamId: string,
  matchHistory: MatchHistoryType
}

/**
 * Match history type definition
 */
export type MatchHistoryType = {
  idMatch: string,
  isWinning: boolean,
  yuko: number,
  wazari: number,
  ippon: number
}