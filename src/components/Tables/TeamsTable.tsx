import { useEffect, useState } from "react"
import { Team } from "../../types"
import { toSentenceCase } from "../../utils/stringFunctions"
import { useNavigate } from "react-router-dom"
import { getAllTeams } from "../../data/controllers/teams"


export default function TournamentTable() {
  const [teamsList, setTeamsList] = useState<Team[]>([])

  const navigate = useNavigate()

  const headerLabels: string[] = [
    "NO", 
    "NAMA TIM", 
    "INISIAL",
    "ANGGOTA",
    "ASAL",
    // "PERTANDINGAN BERIKUTNYA"
  ]

  /**
   * Handler for when a row is clicked. The app will navigate to the 
   * tournament profile screen.
   * 
   * @param idTim ID of the tournament
   */
  const handleRowClick = (idTim: string) => {
    navigate(`/team/${idTim}`)
  } 

  const fetchTournaments = async () => {
    const teams = await getAllTeams()
    setTeamsList(teams)
  }

  // const fetchJmlPeserta = (tournament: Tournament) => {
  //   let totalParticipants = 0

  //   tournament.kelas.forEach(kelas => {
  //     totalParticipants += kelas.daftarTim.length
  //   })
  //   return totalParticipants
  // }

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
        { teamsList.map((team: Team, teamIndex: number) => {
            const { idTim, namaTim, inisial, idAnggota, asal } = team

            return (
              <tr
                key={teamIndex}
                onClick={() => handleRowClick(idTim)}
                className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${teamIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the header labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      {/* Render idPertandingan column conditionally */}
                      { label === "NO" ? teamIndex + 1 
                        : label === "NAMA TIM" ? toSentenceCase(namaTim)
                        : label === "INISIAL" ? toSentenceCase(inisial.toUpperCase())
                        : label === "ANGGOTA" ? idAnggota.length
                        : label === "ASAL" ? toSentenceCase(asal)
                        : ""
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