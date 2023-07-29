import { useEffect, useState } from "react"
import Match from "../../data/classes/Match"
import Round from "./RoundBlock"
import useNotification from "../../hooks/useNotification"


type PropsType = {
  matches: Match[]
}

export default function Bracket({ matches }: PropsType) {
  const [roundBlocks, setRoundBlocks] = useState<any[]>([])

  useEffect(() => {
    let tempRoundBlocks: any[] = []

    for (let i=0; i<getMaxRounds(); i++) {
      let roundMatches: Match[] = filterMatchesByRound(i+1)
      tempRoundBlocks.push(roundMatches)
    }


    setRoundBlocks(tempRoundBlocks)
  }, [matches])


  /**
   * Calculate the width of a single match block based on the length
   * of the longest team name.
   * 
   * @returns The width of a single match block in pixels.
   */
  const getLongestName = (): number => {

    // Get only the matches from the first round to not waste time
    const firstRoundMatches = matches.filter(match => match.getRound() === 1)

    // Iterate over the matches and find the longest team name
    let longestTeamName: number = 0
    firstRoundMatches.forEach(match => {
      match.getContestants().forEach(contestant => {
        if (contestant.teamName.length > longestTeamName) {
          longestTeamName = contestant.teamName.length
        }
      })
    })

    // Return the width of a single match block
    return longestTeamName
  }

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
    <div className="flex flex-row w-full h-fit">
      { roundBlocks.map((matches: Match[]) => (
        <Round matches={matches}/>
      ))}
    </div>
  )
}