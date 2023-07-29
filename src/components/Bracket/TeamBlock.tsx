import { MatchStatusOptions } from "../../types"
import statusColor from "./statusColor"


type PropsType = {
  name?: string
  longestName?: number
  score?: number
  status: MatchStatusOptions
  isWinning?: boolean
}

export default function TeamBlock({ name="", score=-1, status, isWinning=false }: PropsType) {

  /**
   * The length of the horizontal lines
   */
  const LINES_LENGTH: number = 24
  

  return (
    <div className="flex flex-row items-center justify-center w-fit h-fit">
      {/* Left horizontal line */}
      {/* <div className={`h-[1px] w-[${LINES_LENGTH}px] ${statusColor(status, isWinning)}`}/> */}
      
      {/* The team block */}
      <div className={`rounded-md items-center text-white text-caption gap-[12px] px-[6px] w-[300px] py-[2px] h-[36px] flex flex-row justify-between ${statusColor(status, isWinning)}`}>
        <p className="flex-row w-full truncate">{name}</p>
        <p>{score === -1 ? "" : score}</p>
      </div>

      {/* Right horizontal line */}
      <div className={`h-[1px] w-[${LINES_LENGTH}px] ${statusColor(status, isWinning)}`}/>
    </div>
  )
}
