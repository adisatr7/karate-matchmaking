import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import Athlete from "../data/classes/Athlete"
import Division from "../data/classes/Division"
import Team from "../data/classes/Team"
import { useAppDispatch, useAppSelector } from "../store"
import { nextSlide, previousSlide, setSlide } from "../store/slices/divisionCarouselSlice"
import ContestantsTable from "./Tables/ContestantsTable"
import useNotification from "../hooks/useNotification"


type PropsType = {
  divisions: Division[]
}

export default function DivisionCarousel({ divisions }: PropsType) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const activeSlide = useAppSelector(state => state.divisionCarousel.activeSlide)
  const [playingTeams, setPlayingTeams] = useState<Team[]>([])
  const [playingAthletes, setPlayingAthletes] = useState<Athlete[]>([])
  
  
  /**
   * Fetch the contestants of the current division
  */
  const fetchContestants = async (): Promise<void> => {
    const teams = await divisions[activeSlide]?.getRegisteredTeams()
    setPlayingTeams(teams)
    
    const athletes = await divisions[activeSlide]?.getRegisteredAthletes()
    setPlayingAthletes(athletes)
  }
  
  // Set the active slide to 0 when the component is loaded
  useEffect(() => {
    dispatch(setSlide(0))
    fetchContestants()
  }, [])
  
  // Fetch the contestants when the active slide changes
  useEffect(() => {
    fetchContestants()
  }, [activeSlide])
  
  
  /**
   * Handle the carousel to show the next division
   */
  const handleNextCarousel = () => {
    if (activeSlide < divisions.length - 1) {
      dispatch(nextSlide())
    }
  }

  
  /**
   * Handle the carousel to show the previous division
   */
  const handlePrevCarousel = () => {
    if (activeSlide > 0)
      dispatch(previousSlide())
  }
  
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-fit gap-[6px]">
      
      {/* Header container */}
      <div className="flex flex-row w-full">
        {/* Division name */}
        <p className="w-full text-left text-body">{divisions[activeSlide]?.getDivisionName()}</p>

        {/* Division selector */}
        <div className="flex flex-row w-fit gap-[6px] items-center mr-[12px]">
          {/* Previous button
           */}
          <ChevronLeftIcon 
            fontSize="medium"
            onClick={handlePrevCarousel}
            className={`text-white transition-all duration-300
            ${activeSlide === 0 
              ? "opacity-30" 
              : "opacity-50 hover:cursor-pointer hover:opacity-100"}`}/>

          {/* Clickable dots indicator */}
          { divisions.map((_, index: number) => (
            <div
              key={index}
              onClick={() => dispatch(setSlide(index))}
              className={`rounded-full w-[6px] h-[6px] bg-white transition-all duration-300
                ${index === activeSlide 
                  ? "bg-opacity-100" 
                  : "bg-opacity-50 hover:cursor-pointer hover:bg-opacity-100"}`}/>
            ))
          }

          {/* Next button */}
          <ChevronRightIcon 
            fontSize="medium"
            onClick={handleNextCarousel}
            className={`text-white transition-all duration-300
              ${activeSlide === divisions.length - 1
                ? "opacity-30"
                : "opacity-50 hover:cursor-pointer hover:opacity-100"}`}/>
        </div>
      </div>

      {/* Content container */}
      <div className="flex flex-row w-full h-fit">
        <ContestantsTable teams={playingTeams} athletes={playingAthletes}/>
      </div>

    </div>
  )
}