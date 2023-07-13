import { toSentenceCase } from "../../utils/stringFunctions"
import { useNavigate } from "react-router-dom"
import Team from "../../data/classes/Team"
import Athlete from "../../data/classes/Athlete"


type PropsType = {
  teams: Team[]
  athletes: Athlete[]
}

export default function ContestantsTable({ teams: teamList, athletes: athleteList }: PropsType) {

  // Navigation hook so the app can navigate to other screens
  const navigate = useNavigate()

  // Labels for the header row
  const headerLabels: string[] = [
    "NO", 
    "NAMA ATLET", 
    "MEWAKILI TIM",
    "INISIAL",
  ]

  
  /**
   * Handler for when a row is clicked. The app will navigate to the 
   * athlete's profile screen.
   * 
   * @param athleteId ID of the athlete
   */
  const handleRowClick = (athleteId: string) => {
    navigate(`/athlete/${athleteId}`)
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
        { athleteList?.map((a: Athlete, athleteIndex: number) => {

            return (
              <tr
                key={athleteIndex}
                onClick={() => handleRowClick(athleteList[athleteIndex].getAthleteId())}
                className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${athleteIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the header labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      { 
                        label === "NO" ? athleteIndex + 1 
                          : label === "NAMA ATLET" ? toSentenceCase(a.getAthleteName())
                          : label === "MEWAKILI TIM" ? teamList[athleteIndex].getTeamName()
                          : label === "INISIAL" ? teamList[athleteIndex].getInitial().toUpperCase()
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