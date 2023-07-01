import Tournament from "../../data/classes/Tournament"
import { toSentenceCase } from "../../utils/stringFunctions"
import { useNavigate } from "react-router-dom"
// import useNotification from "../../hooks/useNotification"
// import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
// import useNotification from "../../hooks/useNotification"
// import { assignDefaultTournamentsData } from "../../../.trash/controllers/tournaments"


type PropsType = {
  data: Tournament[],
  contestantAmount: number[]
}

export default function TournamentsTable({ data: tournamentList, contestantAmount }: PropsType) {

  /**
   * Hook to allow the app to navigate to another screen
   */
  const navigate = useNavigate()

  /**
   * Labels for the table header
   */
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
        { tournamentList.map((t: Tournament, tournamentIndex: number) => {

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
                        : label === "PENYELENGGARA" ? t.getHost()
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