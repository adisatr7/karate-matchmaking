import Match from "../../data/classes/Match"
import MatchBlock from "./MatchBlock"


type PropsType = {
  matches: Match[]
  blockWidth: number
}

export default function Round({ matches, blockWidth }: PropsType) {

  
  const currentRound = matches[0].getRound()

  /**
   * Vertical margin, just to make sure the bracket is centered.
   */
  const verticalMargin = currentRound === 1
    ? 0
    : 18 * (currentRound - 1)

  return (
    <div className={`flex flex-col h-full w-fit justify-between my-[${verticalMargin}px]`}>
      { matches.map(match => {

        const matchAName = match.getContestants()[0].teamName
        const matchAScore = match.getScores()[0]
        const matchBName = match.getContestants()[1].teamName
        const matchBScore = match.getScores()[1]

        return (
          <MatchBlock 
            blockWidth={blockWidth}
            teamAName={matchAName}
            teamAScore={matchAScore}
            teamBName={matchBName}
            teamBScore={matchBScore}
            round={currentRound}
            status={match.getStatus()}
            winner={match.getWinner()}/>
        )
      })}
    </div>
  )
}