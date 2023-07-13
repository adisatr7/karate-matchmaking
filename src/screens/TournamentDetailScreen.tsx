import { useParams } from "react-router-dom"
import Tournament from "../data/classes/Tournament"
import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import { toSentenceCase } from "../utils/stringFunctions"
import Division from "../data/classes/Division"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import useNotification from "../hooks/useNotification"
import Button from "../components/Button"


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
          {/* TODO: Buttons related to divisions management */}


          {
            divisions && divisions.map(division => (
              <div className="flex flex-col w-full h-fit my-[12px]">
                
                {/* Division name */}
                <h2 className="text-body">{division.getDivisionName()}</h2>

                <div className="flex flex-row h-fit w-full gap-[12px]">

                  {/* Table containing list of participants */}
                  <div className="flex flex-col w-full overflow-y-scroll text-caption h-fit">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left">Nama Tim</th>
                          <th className="text-left">Nama Atlet</th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col w-fit h-fit">
                    
                  </div>
                  
                </div>
                
                {/* Bracket placeholder */}
                {/* <div className="flex flex-col justify-center items-center h-[500px] w-full bg-dark-glass bg-opacity-80 backdrop-blur-sm rounded-md gap-[12px] mt-[12px]">
                  <p className="text-white font-quicksilver text-body">Bracket placeholder</p>
                </div> */}

              </div>
            ))
          }

          {/* TODO: Participating teams table for each division */}
        </div>

      </div>
    </MainLayout>
  )
}

const transparentTextStyle = "opacity-70"