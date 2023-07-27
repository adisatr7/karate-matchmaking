import { MatchStatusOptions, MatchWinnerOptions } from "../../types"
import TeamBlock from "./TeamBlock"


type PropsType = {
  blockWidth: number
  teamAName: string
  teamAScore: number
  teamBName?: string
  teamBScore?: number
  round: number
  status: MatchStatusOptions
  winner: MatchWinnerOptions
}

export default function MatchBlock({ blockWidth, teamAName, teamAScore, teamBName="", teamBScore=-1, round, status, winner }: PropsType) {

  /**
   * The gap between two opposing team blocks that fight each other
   * during the current match.
   */
  const teamBlockGap = round === 1 
    ? 0
    : 48 * (1.5 ** (round - 1))

  /**
   * The height of the line that connects two opposing team blocks
   * that fight each other during the current match.
   */
  // const lineHeight = round === 1
  //   ? 36
  //   : 36 * 3 * (round -1)

  /**
   * Team names and scores of the current match. This is so that we can
   * easily map over them and render the team blocks.
   */
  const contestants = [
    {
      name: teamAName,
      score: teamAScore
    },
    {
      name: teamBName,
      score: teamBScore
    }
  ]


  return (
    <div className={`flex flex-row gap-[${teamBlockGap}px] justify-center h-full w-fit items-center`}>

      {/* Block container */}
      <div className="flex flex-col h-full w-fit">
        { contestants.map((contestant, index) => (
          <TeamBlock 
            blockWidth={blockWidth}
            name={contestant.name}
            score={contestant.score}
            status={status}
            isWinning={
              // Team A is winning
              (index === 0 && winner === "teamA") || 

              // Team B is winning
              (index === 1 && winner === "teamB") ||
              
              // Team A is winning by default (bye)
              (index === 0 && status === "bye")}/>
        ))}
      </div>

      {/* Vertical lines */}
      <div className="flex flex-col h-full w-fit my-[36px] items-center justify-center">

        {/* Team A */}
        <div className={`w-1 h-full ${winner === "teamA" ? "bg-secondary-opaque" : "bg-stone-700"}`}/>

        {/* Team B */}
        <div className={`w-1 h-full ${winner === "teamB" ? "bg-secondary-opaque" : "bg-stone-700"}`}/>
      </div>

      {/* Horizontal line */}
      <div className={`w-[${blockWidth}px] h-[1px] ${status === "akan main" ? "bg-stone-800" : status === "selesai" ? "bg-secondary-opaque" : ""}`}/>
    </div>
  )
}