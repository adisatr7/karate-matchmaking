import { useEffect, useState } from "react"
import { Athlete } from "../../types"
import { toSentenceCase } from "../../utils/stringFunctions"
import { useNavigate } from "react-router-dom"
import { getAllAthletes } from "../../data/controllers/athletes"
import { getTeamById } from "../../data/controllers/teams"


export default function AthletesTable() {
  const [athletesList, setAthletesList] = useState<Athlete[]>([])

  const navigate = useNavigate()

  const headerLabels: string[] = [
    "NO", 
    "NAMA ATLET", 
    "TIM",
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
   * @param idAtlet ID of the athlete
   */
  const handleRowClick = (idAtlet: string) => {
    navigate(`/athlete/${idAtlet}`)
  } 

  /**
   * 
   */
  const fetchAthletes = async () => {
    const athletes = await getAllAthletes()
    setAthletesList(athletes)
  }

  const fetchTeamData = async (idTim: string) => {
    return await getTeamById(idTim)
  }

  useEffect(() => {
    fetchAthletes()
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
        { athletesList.map((athlete: Athlete, teamIndex: number) => {
            const { idAtlet, namaAtlet, idTimSekarang, jenisKelamin, usia, berat } = athlete

            const timSekarang = fetchTeamData(idTimSekarang)
            // const inisialTim = timSekarang.inisial    // TODO: Fix the async-await stuff

            return (
              <tr
                key={teamIndex}
                onClick={() => handleRowClick(idAtlet)}
                className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${teamIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the header labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      {/* Render idPertandingan column conditionally */}
                      { label === "NO" ? teamIndex + 1 
                        : label === "NAMA ATLET" ? toSentenceCase(namaAtlet)
                        // : label === "TIM" ? toSentenceCase(inisialTim)
                        : label === "JENIS KELAMIN" 
                          ? jenisKelamin === "m" 
                            ? "Laki-laki" 
                            : "Perempuan"
                        : label === "USIA" ? usia
                        : label === "BERAT (Kg)" ? berat
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