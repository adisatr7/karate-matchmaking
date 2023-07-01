import { useEffect, useState } from "react"
import { TeamType } from "../../types"
import { toSentenceCase } from "../../utils/stringFunctions"
import { useNavigate } from "react-router-dom"
import { getAllTeams } from "../../../.trash/controllers/teams"


export default function TeamsTable() {
  const [teamsList, setTeamsList] = useState<TeamType[]>([])

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
   * team profile screen.
   * 
   * @param idTim ID of the team
   */
  const handleRowClick = (idTim: string) => {
    navigate(`/team/${idTim}`)
  } 

  const fetchTeams = async () => {
    const teams = await getAllTeams()
    setTeamsList(teams)
  }

  useEffect(() => {
    fetchTeams()
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
        { teamsList.map((team: TeamType, teamIndex: number) => {
            const { teamId: idTim, teamName: namaTim, initial: inisial, members: idAnggota, city: asal } = team

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
                        : label === "INISIAL" ? inisial.toUpperCase()
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