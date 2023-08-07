import { useNavigate } from "react-router-dom"
import { MatchStatusOptions } from "../../types"
import statusColor from "./statusColor"
import { useAppDispatch } from "../../store"
import { hideSidebar } from "../../store/slices/sidebarSlice"


type PropsType = {
  matchId: string
  name?: string
  longestName?: number
  score?: number
  status: MatchStatusOptions
  isWinning?: boolean
  isFinalist?: boolean
}

export default function TeamBlock({ matchId, name="", score=-1, status, isWinning=false, isFinalist=false }: PropsType) {  

  /**
   * React router's navigate function.
   */
  const navigate = useNavigate()

  /**
   * Redux's dispatch function.
   */
  const dispatch = useAppDispatch()

  /**
   * Handles the click event on the team block.
   */
  const handleClick = () => {
    if (status !== "berlangsung" || isFinalist)
      return

    dispatch(hideSidebar())
    setTimeout(() => {
      navigate(`/match/${matchId}`)
    }, 400)
  }

  return (
    <div className="flex flex-row items-center justify-center w-fit h-fit">
      
      {/* The team block */}
      <div
        onClick={handleClick}
        className={`rounded-md items-center text-white text-caption gap-[12px] px-[10px] w-[300px] py-[2px] h-[36px] flex flex-row justify-between 
        ${isFinalist && name !== "" 
          ? "bg-gradient-to-bl from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-700" 
          : statusColor(status, isWinning)} 
        ${status === "berlangsung" && !isFinalist && "hover:cursor-pointer"}`}>
        <p className="flex-row w-full truncate">{name}</p>
        <p>{score === -1 ? "" : score}</p>
      </div>

      {/* Right horizontal line */}
      { !isFinalist && <div className={`h-[1px] w-[24px] ${isWinning ? "bg-blue-600" : "bg-stone-500"}`}/> }
    </div>
  )
}
