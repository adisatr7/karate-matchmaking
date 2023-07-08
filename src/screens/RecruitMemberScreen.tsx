import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import Athlete from "../data/classes/Athlete"
import useNotification from "../hooks/useNotification"
import { EMPTY_TEAM_ID } from "../constants"
import { useNavigate, useParams } from "react-router-dom"
import Team from "../data/classes/Team"
import { toSentenceCase } from "../utils/stringFunctions"
import { ask } from "@tauri-apps/api/dialog"


type ParamsType = {
  teamId: string
}

export default function JoinTeamScreen() {
  const navigate = useNavigate()
  const params = useParams<ParamsType>()
  const {teamId} = params
  const [currentTeam, setCurrentTeam] = useState<Team>()

  const [athletesList, setAthletesList] = useState<Athlete[]>([])
  const [winrates, setWinrates] = useState<number[]>([])

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
   * Fetch the current team data.
   */
  const fetchCurrentTeam = async () => {
    const teamData: Team = await Team.load(teamId!)
    setCurrentTeam(teamData)
  }

  
  /**
   * Fetch the list  of athletes to be rendered in the table.
   */
  const fetchAthletes = async () => {
    
    // Fetch the list of athletes
    await readDir(
      "athletes", {
        dir: BaseDirectory.AppData,
        recursive: false
    })

      // If the list is not empty, fetch the athlete data
      .then(async (result) => {

        // Prepare an empty list to store the athlete data
        const athleteList: Athlete[] = []

        // For each athlete, fetch the athlete data
        result.forEach(async (file) => {
          const athleteId: string = file.name!.split(".")[0]

          // Create an Athlete object from the athlete data
          const athlete: Athlete = await Athlete.load(athleteId!)
          const winrate: number = await athlete.getWinRateRatio()

          // If the team doesn't belong to any team, push the athlete data to the list
          if (athlete.getCurrentTeamId() === EMPTY_TEAM_ID) {
            athleteList.push(athlete)
            winrates.push(winrate)
    
            // Set the list of athletes and winrate ratio to the state
            setAthletesList(athleteList)
            setWinrates(winrates)
          }
        })
      })
  }

  // Fetch the list of athletes and winrate ratio when the screen is loaded
  useEffect(() => {
    fetchCurrentTeam()
    fetchAthletes()
  }, [])


  /**
   * Handler for when a row is clicked. The app will navigate to the 
   * athlete profile screen.
   * 
   * @param athleteId ID of the athlete
   */
  const handleRowClick = async (athleteId: string) => {

    const athlete = await Athlete.load(athleteId)

    // Ask the user to confirm the action
    const choice = await ask(`Apakah Anda yakin ingin menambahkan ${athlete?.getAthleteName()} ke tim ${currentTeam?.getTeamName()}?`, { title: "Konfirmasi", okLabel: "Gabung", cancelLabel: "Batal" })

    // If the user confirms, add the athlete to the team
    if (choice) {
      currentTeam?.addMemberId(athleteId!)
      athlete?.setCurrentTeamId(teamId!)
      
      // Save the changes
      currentTeam?.save()
      athlete?.save()

      // Show the success notification
      useNotification("Berhasil", `${athlete?.getAthleteName()} berhasil ditambahkan ke tim ${currentTeam?.getTeamName()}!`)
      navigate(`/team/${teamId}`)
    }
  }


  /**
   * Handle new athlete button
   */
  const handleNewAthlete = () => {
    navigate("/athlete/new/add")
  }
  
  
  return (
    <MainLayout
      backButton
      prevPageName={currentTeam?.getTeamName()}
      prevPageUrl={`/team/${teamId}`}
      currentPageName="Tambah Anggota">
        
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
          { athletesList.length > 0 ? athletesList.map((a: Athlete, athleteIndex: number) => {

              // Get the athlete's winrate ratio
              const winrate = winrates[athleteIndex]

              // Render the table row
              return (
                <tr
                  key={athleteIndex}
                  onClick={() => handleRowClick(a.getAthleteId())}
                  className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${athleteIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                  {/* Render table cells based on the header labels */}
                  { headerLabels.map((label: string, rowIndex: number) => (
                      <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                        { 
                          label === "NO" ? athleteIndex + 1 
                            : label === "NAMA ATLET" ? toSentenceCase(a.getAthleteName())
                            : label === "RASIO KEMENANGAN" ? winrate
                            : label === "JENIS KELAMIN" 
                              ? a.getGender() === "m" 
                                ? "Laki-laki" 
                                : "Perempuan"
                            : label === "USIA" ? a.getAge()
                            : label === "BERAT (Kg)" ? a.getWeight()
                            : ""
                        }
                      </td>
                  ))}
                </tr>
              )})
            : <tr className="text-center"><td colSpan={headerLabels.length} className="py-4 text-gray-300 text-caption hover:bg-stone-700">Tidak ada atlet yang tersedia. Klik <span onClick={handleNewAthlete} className="font-bold text-white hover:underline hover:cursor-pointer">disini</span> untuk menambahkan data atlet baru.</td></tr>
          }
        </tbody>
      </table>
    </MainLayout>
  )
}

const headerRowStyle = "px-[10px] py-[4px] font-bold text-left"