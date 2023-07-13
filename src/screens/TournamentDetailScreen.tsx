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
  
  
  /**
   * Fetch the tournament data from the `tournaments` directory
   */
  const fetchTournamentData = async () => {
    const id = params.tournamentId
    const tournamentData = await Tournament.load(id!)
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
          <p className={transparentTextStyle}>{tournament?.getDesc()}</p>

          <div className="flex flex-row h-fit w-full text-caption gap-[12px]">
            <Button label="UBAH DESKRIPSI TIM" className="w-fit px-[36px]"/>
            {/* <Button label="DETAIL PERTANDINGAN" className="w-full"/>
            <Button label="DAFTAR TIM" className="w-full"/>
            <Button label="DAFTAR PESERTA" className="w-full"/> */}
          </div>
        </div>

        {/* Divisions container */}
        <div>
          <h1 className="text-heading mt-[16px]">Kelas</h1>

          {/* Divisions carousel */}
          <DivisionCarousel divisions={divisions}/>

          {/* TODO: Participating teams table for each division */}
        </div>

      </div>
    </MainLayout>
  )
}

const transparentTextStyle = "opacity-70"