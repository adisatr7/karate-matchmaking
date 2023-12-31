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
export type SidebarOptions =
  | "highlight"
  | "tournaments"
  | "teams"
  | "athletes"
  | "settings"
  | ""

/**
 * Tournament status options type definition
 */
export type TournamentStatusOptions =
  | "pendaftaran"
  | "akan main"
  | "berlangsung"
  | "selesai"
  | "ditunda"
  | "dibatalkan"

/**
 * Match status options type definition
 */
export type MatchStatusOptions =
  | "akan main"
  | "berlangsung"
  | "bye"
  | "selesai"
  | "ditunda"
  | "dibatalkan"

/**
 * Match winner options type definition
 */
export type MatchWinnerOptions = "teamA" | "teamB" | "draw" | "tbd" | "skipped"

/**
 * Contestant type definition
 */
export type ContestantType = {
  athleteId: string // References -> Athlete
  athleteName: string
  teamId: string // References -> Team
  teamName: string
}

/**
 * Gender type definition. THERE ARE ONLY 2 GENDERS
 */
export type Gender = "m" | "f"

/**
 * Dataset type definition for the polar chart in the athlete profile screen
 */
export type AthletePerformance = {
  yuko: number
  wazari: number
  ippon: number
}

/**
 * User data type definition used to login
 */
export type UserType = {
  id: string // Unique ID - Customizable
  name: string
  password: string
  imageUrl: string
} | null

/**
 * Tournament type definition
 */
// export type TournamentType = {
//   tournamentId: string // Unique ID - Value randomized
//   tournamentName: string
//   desc: string
//   status: TournamentStatusOptions
//   hostedBy: string
//   divisionIds: string[]
//   // [key: string]: any     // Index signature to allow string indexing
// }

/**
 * Tournament subclass type definition
 */
// export type DivisionType = {
//   tournamentId: string // References -> Tournament
//   divisionId: string // Unique ID - Value randomized
//   divisionName: string
//   gender: Gender
//   contestants: ContestantType[]
//   matchIds: string[]
// }

/**
 * Match type definition
 */
// export type MatchType = {
//   divisionId: string            // References -> Division
//   matchId: string               // Unique ID - Value randomized
//   matchName?: string
//   nextMatchId: string
//   playDate: string
//   status: MatchStatusOptions
//   winner: MatchWinnerOptions    // May require more thinking
//   contestants: ContestantType[] // Contains 2 Contestant objects
// }

/**
 * Team type definition
 */
// export type TeamType = {
//   teamId: string // Unique ID - Value randomized
//   teamName: string
//   initial: string
//   city: string
//   memberIds: string[] // References -> Athlete
// }

/**
 * Athlete type definition
 */
// export type AthleteType = {
//   athleteId: string // Unique ID - Value randomized
//   athleteName: string
//   imageUrl?: string
//   gender: "m" | "f"
//   age: number
//   weight: number
//   currentTeamId: string // References -> Team
//   matchHistoryIds: string[] // References -> MatchHistory
// }

/**
 * Match history type definition
 */
// export type MatchHistoryType = {
//   matchHistoryId: string // Unique ID - Value randomized
//   athleteId: string // References -> Athlete
//   matchId: string // References -> Match
//   isWinning: boolean
//   yuko: number
//   wazari: number
//   ippon: number
// }
