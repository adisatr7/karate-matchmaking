import Athlete from "../../data/classes/Athlete"
import { useAppDispatch } from "../../store"
import { setCurrentPath } from "../../store/slices/sidebarSlice"
import { toSentenceCase } from "../../utils/stringFunctions"
import { useNavigate } from "react-router-dom"


type PropsType = {
  data: Athlete[],
  winRates?: number[]
}

export default function TeamMembersTable({ data: athletesList, winRates }: PropsType) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const headerLabels: string[] = [
    "NO", 
    "NAMA ATLET",
    "RASIO KEMENANGAN",
    // "BERTANDING DI",
    // "KELAS",
    "JENIS KELAMIN",
    "USIA",
    "BERAT (Kg)"
  ]

  /**
   * Handler for when a row is clicked. The app will navigate to the 
   * athlete profile screen.
   * 
   * @param athleteId ID of the athlete
   */
  const handleRowClick = (athleteId: string) => {
    dispatch(setCurrentPath(""))
    navigate(`/athlete/${athleteId}`)
  }

  return (
    <table className="w-full text-white bg-opacity-50 border border-separate rounded-md table-auto h-fit bg-dark-glass border-stone-600 backdrop-blur-md font-quicksand">
      
      {/* Header */}
      <thead className="sticky top-0 border border-separate rounded-md rounded-t-lg bg-dark-glass hover:bg-stone-700 border-stone-600">
        <tr className="">
          { headerLabels.map((label: string, index: number) => {
            return ( <td key={index} className={headerRowStyle}>{label}</td> )
          })}
        </tr>
      </thead>
      
      <tbody>
        { athletesList.map((a: Athlete, athleteIndex: number) => {

            // Render the table row
            return (
              <tr
                key={athleteIndex}
                onClick={() => handleRowClick(a.getAthleteId())}
                className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${athleteIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the header labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      {/* Render idPertandingan column conditionally */}
                      { label === "NO" ? athleteIndex + 1 
                        : label === "NAMA ATLET" ? toSentenceCase(a.getAthleteName())
                        : label === "JENIS KELAMIN" 
                          ? a.getGender() === "m" 
                            ? "Laki-laki" 
                            : "Perempuan"
                        : label === "RASIO KEMENANGAN" ? winRates![athleteIndex]
                        : label === "USIA" ? a.getAge()
                        : label === "BERAT (Kg)" ? a.getWeight()
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