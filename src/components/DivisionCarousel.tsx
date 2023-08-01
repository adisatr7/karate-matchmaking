import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Division from "../data/classes/Division"
import useNotification from "../hooks/useNotification"
import { useAppDispatch, useAppSelector } from "../store"
import { nextSlide, previousSlide, setSlide } from "../store/slices/divisionCarouselSlice"
import { ContestantType, TournamentStatusOptions } from "../types"
import Button from "./Button"
import ContestantsTable from "./Tables/ContestantsTable"
// import { ask } from "@tauri-apps/api/dialog"


type PropsType = {
  divisions: Division[]
  tournamentStatus: TournamentStatusOptions
}

export default function DivisionCarousel({ divisions, tournamentStatus }: PropsType) {
  const navigate = useNavigate()
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
    if (activeSlide === 0 || activeSlide < divisions.length)
      return

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


  /**
   * Handle add new contestant button
   */
  const handleNewContestant = () => {
    const division = divisions[activeSlide]
    const tournamentId: string = division.getTournamentId()
    navigate(`/tournament/${tournamentId}/${division.getDivisionId()}/addcontestant`)
  }


  const handleNewDivision = () => {
    navigate(`/tournament/${divisions[activeSlide].getTournamentId()}/division/new`)
  }

  
  // const handleDeleteContestant = async (index: number) => {

  //   const contestants = divisions[activeSlide].getContestantsList()

  //   const confirm = await ask(
  //     `Apakah anda yakin ingin menghapus ${contestants[index].athleteName} dari kelas ini?`, {
  //       title: "Konfirmasi",
  //       type: "warning",
  //     })
    
  //   // If the user confirms the deletion, remove the athlete from the division
  //   if (confirm) {

  //     const currentDivision = divisions[activeSlide]
      
  //     // Create a copy of the division object
  //     const temp = new Division(
  //       currentDivision.getDivisionId(),
  //       currentDivision.getTournamentId(),
  //       currentDivision.getDivisionName(),
  //       currentDivision.getGender(),
  //       currentDivision.getContestantsList(),
  //       currentDivision.getMatchIds()
  //     )

  //     // Remove the athlete from the division
  //     const contestant: ContestantType = currentDivision.getContestantsList()[index]
  //     temp.removeContestant(contestant)

  //     // Save the division to filesystem
  //     temp.save()

  //     useNotification("Berhasil", `Peserta berhasil dikeluarkan dari kelas pertandingan ${currentDivision.getDivisionName()}`)
  //   }
  // }
  
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-fit gap-[6px]">
      
      {/* Header container */}
      <div className="flex flex-row w-full">
        {/* Division name */}
        <p className="w-full text-left text-body">{divisions[activeSlide]?.getDivisionName()}</p>

        
      </div>

      {/* Action buttons */}
      <div className="flex flex-row h-fit w-full gap-[10px] justify-between text-caption">
        <div className="flex flex-row w-fit gap-[12px] mb-[4px]">

          {/* Add contestant button */}
          { tournamentStatus === "pendaftaran" &&
            <Button 
              onClick={handleNewContestant}
              label="Tambah Kontestan"
              className="w-fit px-[24px]"/>
          }

          {/* See bracket button */}
          <Button 
            label="Lihat Bagan Pertandingan"
            className="w-fit px-[24px]"/>

          {/* New division button */}
          { tournamentStatus === "pendaftaran" &&
            <Button 
              onClick={handleNewDivision}
              label="Buat Kelas Baru"
              className="w-fit px-[24px]"/> 
          }
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
        <ContestantsTable 
          division={divisions[activeSlide]} 
          contestants={contestantsOfActiveDivision}
          // handleDeleteContestant={handleDeleteContestant}
          />
      </div>

    </div>
  )
}
