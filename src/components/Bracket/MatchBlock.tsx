import { MatchStatusOptions, MatchWinnerOptions } from "../../types"
import TeamBlock from "./TeamBlock"


type PropsType = {
  teamAName: string
  teamAScore: number
  teamBName?: string
  teamBScore?: number
  round: number
  status: MatchStatusOptions
  winner: MatchWinnerOptions
}

export default function MatchBlock({ teamAName, teamAScore, teamBName="", teamBScore=-1, round, status, winner }: PropsType) {

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
    <div className={`flex flex-row justify-center h-full w-fit items-center`}>

      {/* Block container */}
      <div className="flex flex-col justify-center h-full w-fit">
          { contestants.map((contestant, index) => {

            // Iteration helper for the gap div
            const roundArray = []
            let i = 1
            while (i < round) {
              for (let j=0; j<=i; j++)
                roundArray.push(i)
              i++
            }
            
            return (
              <>
                <TeamBlock 
                  key={index}
                  name={contestant.name}
                  score={contestant.score}
                  status={status}
                  isWinning={
                    // Team A is winning
                    (index === 0 && winner === "teamA") || 

                    // Team B is winning
                    (index === 1 && winner === "teamB")}/>
                
                {/* Gap between the two teams that are fighting */}
                { index === 0 && roundArray.map(() => (
                  <div className="flex flex-col h-[36px] w-full"/>
                ))}
              </>
              
              // // Team A is winning by default (bye)
              // (index === 0 && status === "bye")
        )})}
      </div>

      {/* Vertical lines */}
      <div className="flex flex-col items-center justify-center h-full w-fit">

        {/* Team A */}
        <div className={`w-[1px] h-[28%] ${winner === "teamA" ? "bg-secondary-opaque" : "bg-stone-500"}`}/>

        {/* Team B */}
        <div className={`w-[1px] h-[28%] ${winner === "teamB" ? "bg-secondary-opaque" : "bg-stone-500"}`}/>
      </div>

      {/* Horizontal line */}
      <div className={`w-[24px] h-[1px] ${status === "akan main" || status === "berlangsung" ? "bg-stone-500" : status === "selesai" ? "bg-secondary-opaque" : ""}`}/>
    </div>
  )
}