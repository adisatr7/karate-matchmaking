import { useNavigate } from "react-router-dom"
import { ContestantType } from "../../types"
import { toSentenceCase } from "../../utils/stringFunctions"
import CloseIcon from "@mui/icons-material/Close"
import Division from "../../data/classes/Division"
import useNotification from "../../hooks/useNotification"
import { ask } from "@tauri-apps/api/dialog"


type PropsType = {
  division: Division
  contestants: ContestantType[]
  // handleDeleteContestant: (index: number) => Promise<void>
}

export default function ContestantsTable({ division, contestants }: PropsType) {
  const navigate = useNavigate()

  // Labels for the header row
  const headerLabels: string[] = [
    "NO", 
    "NAMA ATLET", 
    "MEWAKILI TIM",
    ""
  ]

  
  const handleDeleteContestant = async (index: number) => {
    
    const confirm = await ask(
      `Apakah anda yakin ingin menghapus ${contestants[index].athleteName} dari kelas ini?`, {
        title: "Konfirmasi",
        type: "warning",
      })
    
    // If the user confirms the deletion, remove the athlete from the division
    if (confirm) {
      
      // Create a copy of the division object
      const temp = new Division(
        division.getDivisionId(),
        division.getTournamentId(),
        division.getDivisionName(),
        division.getGender(),
        division.getContestantsList(),
        division.getMatchIds()
      )

      // Remove the athlete from the division
      const contestant: ContestantType = division.getContestantsList()[index]
      temp.removeContestant(contestant)

      // Save the division to filesystem
      temp.save()

      // Show notification
      useNotification("Berhasil", `Peserta berhasil dikeluarkan dari kelas pertandingan ${division.getDivisionName()}`)

      // Refresh the page
      window.location.reload()
    }
  }

  
  /**
   * Handler for when a row is clicked. The app will navigate to the 
   * athlete's profile screen.
   * 
   * @param athleteId ID of the athlete
   */
  const handleRowClick = (athleteId: string) => {
    navigate(`/athlete/profile/${athleteId}/1`)
  }


  /**
   * Handler for when the user clicks the "Tambah Peserta" button.
   */
  const handleNewContestant = () => {
    navigate(`/tournament/${division.getTournamentId()}/${division.getDivisionId()}/addcontestant`)
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
            <td className="px-[10px] text-center text-caption py-[12px] text-gray-400" colSpan={headerLabels.length}>Data peserta kosong <span onClick={handleNewContestant} className="font-semibold text-gray-200 hover:text-white hover:underline hover:cursor-pointer">Klik disini</span> untuk mulai menambahkan peserta ke kelas ini.</td>
          </tr>
        }
      </tbody>
    </table>
  )
}

const headerRowStyle = "px-[10px] py-[4px] font-bold text-left"