import { toSentenceCase } from "../../utils/stringFunctions"
import { useNavigate } from "react-router-dom"
import Team from "../../data/classes/Team"


type PropsType = {
  data: Team[]
}

export default function TeamsTable({ data: teamList }: PropsType) {

  // Navigation hook so the app can navigate to other screens
  const navigate = useNavigate()

  // Labels for the header row
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
   * @param teamId ID of the team
   */
  const handleRowClick = (teamId: string) => {
    navigate(`/team/${teamId}`)
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
        { teamList.map((t: Team, teamIndex: number) => {

            return (
              <tr
                key={teamIndex}
                onClick={() => handleRowClick(t.getId())}
                className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${teamIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the header labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      { 
                        label === "NO" ? teamIndex + 1 
                          : label === "NAMA TIM" ? toSentenceCase(t.getTeamName())
                          : label === "INISIAL" ? t.getInitial().toUpperCase()
                          : label === "ANGGOTA" ? t.getMemberIds().length
                          : label === "ASAL" ? toSentenceCase(t.getCity())
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