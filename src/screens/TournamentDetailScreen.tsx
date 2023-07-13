import { useParams } from "react-router-dom"
import Tournament from "../data/classes/Tournament"
import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import { toSentenceCase } from "../utils/stringFunctions"
import Division from "../data/classes/Division"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import useNotification from "../hooks/useNotification"
import Button from "../components/Button"
import DivisionCarousel from "../components/DivisionCarousel"


type ParamsType = {
  tournamentId: string
}

export default function TournamentDetailScreen() {
  const params = useParams<ParamsType>()
  const [tournament, setTournament] = useState<Tournament>()
  const [divisions, setDivisions] = useState<Division[]>([])

  const [desc, setDesc] = useState<string>("")
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [descTextHeight, setDescTextHeight] = useState<number>(4)
  
  
  /**
   * Fetch the tournament data from the `tournaments` directory
   */
  const fetchTournamentData = async () => {

    // Get the tournament id from the URL
    const id = params.tournamentId

    // Load the tournament data from the `tournaments` directory
    const tournamentData = await Tournament.load(id!)
    setDesc(tournamentData.getDesc()!)

    // Set the tournament data state
    setTournament(tournamentData)
  }

  // Fetch the tournament data when the screen is loaded
  useEffect(() => {
    fetchTournamentData()
  }, [])


  /**
   * Fetch all divisions data from the `divisions` directory
   */
  const fetchAllDivisionsData = async () => {
    
    // Read the `divisions` directory
    await readDir(
      `divisions`, {
        dir: BaseDirectory.AppData, 
        recursive: false
    })
    
    // If directory exists, read the files inside
    .then(dir => {

      // Temporary list to store the divisions data
      const tempDivisions: Division[] = []
      
      // Read each file inside the `divisions` directory
      dir.forEach(async file => {

        // Get the division id from the file name
        const divisionId = file.name?.split(".")[0]

        // Load the division data
        const divisionData = await Division.load(divisionId!)
        
        // If the division belongs to the current tournament
        if (divisionData.getTournamentId() === tournament?.getTournamentId()) {
          
          // Add the division data to the divisions list
          tempDivisions.push(divisionData)
          setDivisions(tempDivisions)
        }
      })
    })

    // In case the `divisions` directory doesn't exist, show an error notification
    .catch(err => {
      useNotification("Terjadi kesalahan", `Tidak dapat membaca direktori 'divisions': ${err}`)
    })
  }

  // Fetch the divisions data when the tournament data is loaded
  useEffect(() => {
    fetchAllDivisionsData()
  }, [tournament])


  /**
   * Handle the toggle edit button
   */
  const handleToggleEditMode = () => {
    if (isEditMode) {
      const newTournament: Tournament = new Tournament(
        tournament?.getTournamentId()!,
        tournament?.getTournamentName()!,
        desc,
        tournament?.getStatus()!,
        tournament?.getHost()!,
        tournament?.getDivisionIds()!
      )
      setTournament(newTournament)
      newTournament.save()
      useNotification("Berhasil", "Deskripsi berhasil disimpan")
    }

    setIsEditMode(!isEditMode)
  }


  /**
   * Handle the edit mode
   */
  const handleEditDesc = (value: string, scrollHeight: number) => {
    if (isEditMode) {
      setDesc(value)
      setDescTextHeight(scrollHeight)
    }
  }


  /**
   * Handle the cancel edit button
   */
  const handleCancelEdit = () => {
    setIsEditMode(false)
    setDesc(tournament?.getDesc()!)
  }


  const handleChangeStatus = () => {
    
  }

  
  const handleNewDivision = () => {
    
  }
  

  return (
    <MainLayout
      backButton
      prevPageName="Pertandingan"
      prevPageUrl="/tournament/all"
      currentPageName={tournament ? tournament.getTournamentName() : "Memuat..."}>

      <div className="overflow-y-scroll">

        {/* Tournament info section */}
        <div className="flex flex-col gap-1 mr-[14px] text-body">

          {/* Tournament host */}
          <p><span className={transparentTextStyle}>Penyelenggara: </span>{toSentenceCase(tournament?.getHost()! || "")}</p>

          {/* Tournament status */}
          <p><span className={transparentTextStyle}>Status: </span>{toSentenceCase(tournament?.getStatus()! || "")}</p>

          {/* Tournament description */}
          <textarea
            onChange={(e => handleEditDesc(e.target.value, e.target.rows))}
            value={desc}
            rows={descTextHeight}
            className={`${transparentTextStyle} bg-transparent w-full h-fit text-caption mb-[6px] focus:outline-none ${isEditMode ? "focus:border focus:border-primary-opaque rounded-md bg-white text-black px-[8px] py-[4px]" : "hover:cursor-default focus:caret-transparent"}`}/>

          <div className="flex flex-row h-fit w-full text-caption gap-[12px]">
            <Button 
              label={`${isEditMode ? "SIMPAN PERUBAHAN" : "UBAH DESKRIPSI PERTANDINGAN"}`} 
              onClick={handleToggleEditMode}
              className="w-fit px-[36px]"/>
            { isEditMode &&
              <Button 
                label="BATAL"
                onClick={handleCancelEdit}
                className="w-fit px-[36px]"/>
            }
            { !isEditMode &&
              <Button 
                label="UBAH STATUS PERTANDINGAN" 
                className="w-fit px-[36px]"/>
            }
          </div>
        </div>

        {/* Divisions container */}
        <div className="flex flex-col gap-[8px] mb-[12px]">
          <h1 className="text-heading mt-[16px]">Kelas</h1>

          {/* Divisions carousel */}
          {
            divisions.length > 0 
              ? <DivisionCarousel divisions={divisions} tournamentStatus={tournament?.getStatus()!}/>
              : <p className="text-left text-gray-300 text-caption">Pertandingan ini belum memiliki kelas. <span onClick={handleNewDivision} className="font-semibold text-gray-200 hover:text-white hover:underline hover:cursor-pointer">Klik disini</span> untuk membuat kelas baru.</p>
          }

        </div>

      </div>
    </MainLayout>
  )
}

const transparentTextStyle = "opacity-70"