import { MatchStatusOptions } from "../../types"
import statusColor from "./statusColor"


type PropsType = {
  name?: string
  score?: number
  blockWidth: number
  status: MatchStatusOptions
  isWinning?: boolean
}

export default function TeamBlock({ name="???", score=-1, blockWidth, status, isWinning=false }: PropsType) {

  /**
   * The length of the horizontal lines
   */
  const LINES_LENGTH: number = 24

  return (
    <div className="flex flex-row w-fit h-fit items-center justify-center">
      {/* Left horizontal line */}
      {/* <div className={`h-[1px] w-[${LINES_LENGTH}px] ${statusColor(status, isWinning)}`}/> */}
      
      {/* The team block */}
      <div className={`text-white text-caption px-[6px] py-[2px] h-[36px] w-[${blockWidth}px] flex flex-row justify-between ${statusColor(status, isWinning)}`}>
        <p>{name}</p>
        <p>{score !== -1 && score}</p>
      </div>

      {/* Right horizontal line */}
      <div className={`h-[1px] w-[${LINES_LENGTH}px] ${statusColor(status, isWinning)}`}/>
    </div>
  )
}
