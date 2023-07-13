import { useEffect, useState } from "react"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import Division from "../data/classes/Division"
import { useAppDispatch, useAppSelector } from "../store"
import { nextSlide, previousSlide, setSlide } from "../store/slices/divisionCarouselSlice"
import ContestantsTable from "./Tables/ContestantsTable"
import { ContestantType } from "../types"
import useNotification from "../hooks/useNotification"
import Button from "./Button"


type PropsType = {
  divisions: Division[]
}

export default function DivisionCarousel({ divisions }: PropsType) {
  const dispatch = useAppDispatch()
  const activeSlide = useAppSelector(state => state.divisionCarousel.activeSlide)
  const [contestantsOfActiveDivision, setContestantsOfActiveDivision] = useState<ContestantType[]>([])
  

  /**
   * Update contestants data tp match what the currently selected division is
   */
  const updateContestantsData = () => {
    try {
      const division = divisions[activeSlide]

      if (!division)
        return

      const contestants = division.getContestantsList()
      setContestantsOfActiveDivision(contestants)
    }

    catch (err) {
      useNotification("Terjadi kesalahan saat memuat data kontestan", err)
    }
  }

  // Calls the method above when the page is loaded
  useEffect(() => {
    dispatch(setSlide(-1))
    // updateContestantsData()
    setTimeout(() => {
      dispatch(setSlide(0))
    }, 200)
  }, [])
  
  // Set the current contestant when the active slide changes
  useEffect(() => {
    updateContestantsData()
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

        
      </div>

      {/* Action buttons */}
      <div className="flex flex-row h-fit w-full gap-[10px] justify-between text-caption">
        <div className="flex flex-row w-fit">
          <Button 
            label="TAMBAH KONTESTAN"
            className="w-fit px-[24px]"/>
          <Button 
            label="LIHAT BAGAN PERTANDINGAN"
            className="w-fit px-[24px]"/>
        </div>

        {/* Division selector */}
        <div className="flex flex-row">
          <div className="flex flex-row w-fit gap-[6px] items-center mr-[12px]">
            {/* Previous button */}
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
      </div>

      {/* Content container */}
      <div className="flex flex-row w-full h-fit">
        <ContestantsTable contestants={contestantsOfActiveDivision}/>
      </div>

    </div>
  )
}