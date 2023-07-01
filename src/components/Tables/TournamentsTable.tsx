import { useEffect, useState } from "react"
import Tournament from "../../data/classes/Tournament"
import { toSentenceCase } from "../../utils/stringFunctions"
import { useNavigate } from "react-router-dom"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import useNotification from "../../hooks/useNotification"
import { assignDefaultTournamentsData } from "../../../.trash/controllers/tournaments"


export default function TournamentsTable() {
  const [tournamentsList, setTournamentsList] = useState<Tournament[]>([])
  const [contestantAmount, setContestantAmount] = useState<number[]>([])

  const navigate = useNavigate()

  const headerLabels: string[] = [
    "NO", 
    "NAMA PERTANDINGAN", 
    "STATUS", 
    // "JADWAL",
    "PENYELENGGARA", 
    "PESERTA"
  ]

  /**
   * Handler for when a row is clicked. The app will navigate to the 
   * tournament profile screen.
   * 
   * @param idPertandingan ID of the tournament
   */
  const handleRowClick = (idPertandingan: string) => {
    navigate(`/tournament/${idPertandingan}`)
  } 

  /**
   * Fetches all tournaments data from the `data/tournaments` directory
   */
  const fetchTournaments = async () => {
    const tournaments: Tournament[] = []
    
    // Read the tournaments directory
    await readDir(
      "tournaments", {
        dir: BaseDirectory.AppData,
        recursive: false
    })
    
    // If the directory is not empty, load the tournaments data one by one
    .then(async (files) => {
      files.forEach(async (file) => {

        // Remove the file extension
        const filename = file.name!.split(".")[0]
        
        // Load the tournament data
        const tournament = await Tournament.load(filename)

        // Add the tournament to the list
        tournaments.push(tournament)
      })

      // Set the tournaments list state once all tournaments are loaded
      setTournamentsList(tournaments)
    })

    // In case of error, show a notification
    .catch(error => {
      useNotification("Terjadi kesalahan saat membaca data pertandingan", error)
      assignDefaultTournamentsData()
    })
  }

  /**
   * Fetch total contestant amount and store it inside the 
   */
  const fetchJmlPeserta = () => {
    
    // For each tournaments registered within the app
    tournamentsList.forEach(async (tournament) => {
      
      // Start counting from 0
      let temp: number[] = []

      // Get the contestant amount of each tournament
      await tournament.getContestantAmount()
      
      // Sum the amount
      .then(result => {
        temp.push(result)
      })

      setContestantAmount(temp)
    })
  }

  useEffect(() => {
    fetchTournaments()
    fetchJmlPeserta()
  }, [])

  return (
    <table className="w-full text-white bg-opacity-50 border border-separate rounded-md table-auto h-fit bg-dark-glass border-stone-600 backdrop-blur-md font-quicksand">
      
      {/* Header */}
      <thead className="sticky top-0 border border-separate rounded-md rounded-t-lg bg-dark-glass hover:bg-stone-700 border-stone-600">
        <tr className="">
          { headerLabels.map((value: string, index: number) => {
            return ( <td key={index} className={headerRowStyle}>{value}</td> )
          })}
        </tr>
      </thead>
      
      <tbody>
        { tournamentsList.map((t: Tournament, tournamentIndex: number) => {

            return (
              <tr
                key={tournamentIndex}
                onClick={() => handleRowClick(t.getTournamentId())}
                className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${tournamentIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the heaxder labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      { 
                        label === "NO" ? tournamentIndex + 1 
                        : label === "NAMA PERTANDINGAN" ? toSentenceCase(t.getTournamentName())
                        : label === "STATUS" ? toSentenceCase(t.getStatus())
                        : label === "PENYELENGGARA" ? toSentenceCase(t.getHost()) 
                        : contestantAmount[tournamentIndex]
                      }
                    </td>
                ))}
              </tr>
        )})}
      </tbody>
    </table>
  )
}

const headerRowStyle = "px-[10px] py-[4px] font-bold text-left"