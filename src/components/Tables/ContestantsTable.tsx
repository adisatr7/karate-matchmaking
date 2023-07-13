import { useNavigate } from "react-router-dom"
import { ContestantType } from "../../types"
import { toSentenceCase } from "../../utils/stringFunctions"


type PropsType = {
  contestants: ContestantType[]
}

export default function ContestantsTable({ contestants }: PropsType) {

  // Navigation hook so the app can navigate to other screens
  const navigate = useNavigate()

  // Labels for the header row
  const headerLabels: string[] = [
    "NO", 
    "NAMA ATLET", 
    "MEWAKILI TIM",
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
        { contestants?.map((c: ContestantType, athleteIndex: number) => {

            return (
              <tr
                key={athleteIndex}
                onClick={() => handleRowClick(c.athleteId)}
                className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${athleteIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the header labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      { 
                        label === "NO" ? athleteIndex + 1 
                          : label === "NAMA ATLET" ? toSentenceCase(c.athleteName)
                          : label === "MEWAKILI TIM" ? toSentenceCase(c.teamName)
                          : ""
                      }
                    </td>
                ))}
              </tr>
        )})}
        {
          contestants.length === 0 &&
          <tr className="rounded-full bg-opacity-40 hover:bg-stone-700 bg-stone-800">
            <td className="px-[10px] text-center text-caption py-[12px] opacity-60" colSpan={headerLabels.length}>Data peserta kosong</td>
          </tr>
        }
      </tbody>
    </table>
  )
}

const headerRowStyle = "px-[10px] py-[4px] font-bold text-left"