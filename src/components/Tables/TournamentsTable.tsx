import { useEffect, useState } from "react"
import { TournamentType } from "../../types"
import { getAllTournaments } from "../../data/controllers/tournaments"
import { toSentenceCase } from "../../utils/stringFunctions"
import { useNavigate } from "react-router-dom"


export default function TournamentsTable() {
  const [tournamentsList, setTournamentsList] = useState<TournamentType[]>([])

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

  const fetchTournaments = async () => {
    const tournaments = await getAllTournaments()
    setTournamentsList(tournaments)
  }

  const fetchJmlPeserta = (tournament: TournamentType) => {
    let totalParticipants = 0

    tournament.divisions.forEach(kelas => {
      totalParticipants += kelas.registeredTeams.length
    })
    return totalParticipants
  }

  useEffect(() => {
    fetchTournaments()
  }, [])

  return (
    <table className="table-auto w-full h-fit bg-dark-glass border border-separate border-stone-600 rounded-md bg-opacity-50 backdrop-blur-md text-white font-quicksand">
      
      {/* Header */}
      <thead className="sticky top-0 rounded-t-lg bg-dark-glass hover:bg-stone-700 border border-separate border-stone-600 rounded-md">
        <tr className="">
          { headerLabels.map((value: string, index: number) => {
            return ( <td key={index} className={headerRowStyle}>{value}</td> )
          })}
        </tr>
      </thead>
      
      <tbody>
        { tournamentsList.map((tournament: TournamentType, tournamentIndex: number) => {
            const { tournamentId: idPertandingan, tournamentName: namaPertandingan, status, hostedBy: penyelenggara } = tournament
            const jmlPeserta = fetchJmlPeserta(tournament)

            return (
              <tr
                key={tournamentIndex}
                onClick={() => handleRowClick(idPertandingan)}
                className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${tournamentIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the heaxder labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      {/* Render idPertandingan column conditionally */}
                      { label === "NO" ? tournamentIndex + 1 
                        : label === "NAMA PERTANDINGAN" ? toSentenceCase(namaPertandingan)
                        : label === "STATUS" ? toSentenceCase(status)
                        : label === "PENYELENGGARA" ? toSentenceCase(penyelenggara) 
                        : jmlPeserta }
                    </td>
                ))}
              </tr>
        )})}
      </tbody>
    </table>
  )
}

const headerRowStyle = "px-[10px] py-[4px] font-bold text-left"