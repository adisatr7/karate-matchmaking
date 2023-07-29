import { useEffect, useState } from "react"
import Match from "../../data/classes/Match"
import Round from "./RoundBlock"
import { ContestantType } from "../../types"
import TeamBlock from "./TeamBlock"


type PropsType = {
  matches: Match[]
  finalist: ContestantType | null
}

export default function Bracket({ matches, finalist }: PropsType) {
  const [roundBlocks, setRoundBlocks] = useState<any[]>([])

  useEffect(() => {
    let tempRoundBlocks: any[] = []

    for (let i=0; i<getMaxRounds(); i++) {
      let roundMatches: Match[] = filterMatchesByRound(i+1)
      tempRoundBlocks.push(roundMatches)
    }

    setRoundBlocks(tempRoundBlocks)
  }, [matches])


  // /**
  //  * Calculate the width of a single match block based on the length
  //  * of the longest team name.
  //  * 
  //  * @returns The width of a single match block in pixels.
  //  */
  // const getLongestName = (): number => {

  //   // Get only the matches from the first round to not waste time
  //   const firstRoundMatches = matches.filter(match => match.getRound() === 1)

  //   // Iterate over the matches and find the longest team name
  //   let longestTeamName: number = 0
  //   firstRoundMatches.forEach(match => {
  //     match.getContestants().forEach(contestant => {
  //       if (contestant.teamName.length > longestTeamName) {
  //         longestTeamName = contestant.teamName.length
  //       }
  //     })
  //   })

  //   // Return the width of a single match block
  //   return longestTeamName
  // }

  /**
   * Calculate the height of a single round block based on the number.
   * 
   * @returns The maximum number of rounds in the bracket.
   */
  const getMaxRounds = (): number => {
    let maxRounds: number = 0
    matches.forEach(match => {
      if (match.getRound() > maxRounds) {
        maxRounds = match.getRound()
      }
    })
    return maxRounds
  }


  /**
   * Filter the matches by round.
   * 
   * @param round The round to filter the matches by.
   * 
   * @returns An array of matches that are in the specified round.
   */
  const filterMatchesByRound = (round: number): Match[] => {
    return matches.filter(match => match.getRound() === round)
  }


  return (
    <div className="flex flex-row w-full bg-opacity-60 h-fit bg-dark-glass px-[32px] py-[36px] border border-stone-600 rounded-xl overflow-scroll">
      { roundBlocks.map((matches: Match[]) => (
        <Round matches={matches}/>
      ))}

      <div className="flex flex-row items-center justify-center h-full w-fit">
        <TeamBlock 
          isWinning
          isFinalist
          score={-1}
          name={finalist !== null ? finalist.teamName : ""} 
          status={finalist ? "selesai" : "akan main"}/>
      </div>
    </div>
  )
}