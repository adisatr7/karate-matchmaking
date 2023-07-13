import { useNavigate } from "react-router-dom"
import { ContestantType } from "../../types"
import { toSentenceCase } from "../../utils/stringFunctions"
import CloseIcon from "@mui/icons-material/Close"
import { ask } from "@tauri-apps/api/dialog"
import Division from "../../data/classes/Division"
import useNotification from "../../hooks/useNotification"


type PropsType = {
  division: Division
  contestants: ContestantType[]
}

export default function ContestantsTable({ division, contestants }: PropsType) {

  // Navigation hook so the app can navigate to other screens
  const navigate = useNavigate()

  // Labels for the header row
  const headerLabels: string[] = [
    "NO", 
    "NAMA ATLET", 
    "MEWAKILI TIM",
    ""
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


  const handleDeleteContestant = async (index: number) => {
    const confirm = await ask(
      `Apakah anda yakin ingin menghapus ${contestants[index].athleteName} dari kelas ini?`, {
        title: "Konfirmasi",
        type: "warning",
      })
    
    if (confirm) {
      division.removeContestant(contestants[index])
      division.save()

      useNotification("Berhasil", `Peserta berhasil dikeluarkan dari kelas pertandingan ${division.getDivisionName()}`)
    }
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
                className={`bg-opacity-40 rounded-full hover:bg-primary-gradient hover:cursor-pointer ${athleteIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the header labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px] ${label === "" && "bg-stone-800 hover:cursor-default"}`}>
                      { 
                        label === "NO" ? athleteIndex + 1 
                          : label === "NAMA ATLET" ? <p onClick={() => handleRowClick(c.athleteId)}>{toSentenceCase(c.athleteName)}</p>
                          : label === "MEWAKILI TIM" ? <p onClick={() => handleRowClick(c.athleteId)}>{toSentenceCase(c.teamName)}</p>
                          : <CloseIcon 
                              fontSize="small"
                              onClick={() => handleDeleteContestant(athleteIndex)}
                              className="w-full text-white hover:text-red-600 hover:cursor-pointer"/>
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