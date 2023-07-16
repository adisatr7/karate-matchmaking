import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MainLayout from "../../components/MainLayout"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import Team from "../../data/classes/Team"
import useNotification from "../../hooks/useNotification"
import { EMPTY_TEAM_ID } from "../../constants"
import Athlete from "../../data/classes/Athlete"
import { toSentenceCase } from "../../utils/stringFunctions"
import { ask } from "@tauri-apps/api/dialog"


type ParamsType = {
  athleteId: string
}

export default function JoinTeamScreen() {
  const navigate = useNavigate()
  const params = useParams<ParamsType>()
  const { athleteId } = params

  const [teamList, setTeamsList] = useState<Team[]>([])
  const [athlete, setAthlete] = useState<Athlete>()
  // const [searchKeyword, setSearchKeyword] = useState("")

  const headerLabels: string[] = [
    "NO", 
    "NAMA TIM", 
    "INISIAL",
    "ANGGOTA",
    "ASAL",
    // "PERTANDINGAN BERIKUTNYA"
  ]

  /**
   * Fetch the teams data from the teams directory
   */
  const fetchTeams = async () => {
    const teams: Team[] = []

    // Read the teams directory
    await readDir(
      "teams", {
        dir: BaseDirectory.AppData,
        recursive: false
    })

    // If the directory is not empty, load the teams data one by one
    .then(async (files) => {
      files.forEach(async (file) => {
        
        // Remove the file extension
        const filename: string = file.name!.split(".")[0]
        
        // Load the team data
        const team: Team = await Team.load(filename)

        // Add the team data to the list
        if (team.getTeamId() !== EMPTY_TEAM_ID)
          teams.push(team)

        // Update the state
        setTeamsList(teams)
      })
    })

    // If the directory is empty, create a default team
    .catch(err => {
      useNotification("Tidak dapat membaca data tim", err)
    })
  }

  /**
   * Fetch the athlete data from the athlete directory
   */
  const fetchAthlete = async () => {
    const temp: Athlete = await Athlete.load(athleteId!)
    setAthlete(temp)
  }

  // Fetch the teams data when the screen is loaded
  useEffect(() => {
    fetchTeams()
    fetchAthlete()
  }, [])

  /**
   * Handle the row click event
   * 
   * @param selectedTeamId The selected team's ID of the row
   */
  const handleRowClick = async (selectedTeamId: string) => {

    // Load the selected team
    const team = await Team.load(selectedTeamId)

    // Ask for confirmation
    const choice = await ask(`Apakah Anda yakin ingin menambahkan ${athlete?.getAthleteName()} ke tim ${team.getTeamName()}?`, { title: "Konfirmasi", okLabel: "Gabung", cancelLabel: "Batal" })

    // If the user confirms, add the athlete to the team
    if (choice) {
      team.addMemberId(athleteId!)
      athlete?.setCurrentTeamId(selectedTeamId)
      
      // Save the changes
      team.save()
      athlete?.save()

      // Show the success notification
      useNotification("Berhasil", `${athlete?.getAthleteName()} berhasil bergabung ke tim ${team.getTeamName()}!`)
      navigate(`/athlete/${athleteId}`)
    }
  }

  return (
    <MainLayout
      backButton
      prevPageUrl={`/athlete/${athleteId}`}
      prevPageName={athlete?.getAthleteName()}
      currentPageName="Gabung Tim">

      {/* Search bar and its buttons */}
      {/* <div className="flex flex-row h-fit w-full gap-[10px] text-caption">
        <Entry 
          label="Cari nama tim" 
          inputMode="text" 
          onChange={setSearchKeyword}
          leftIcon={SearchIcon}
          value={searchKeyword}
          className="flex-[2]"/>
        <Button 
          label="CARI TIM"
          className="flex-[1]"/>
        <Button 
          label="DAFTARKAN TIM BARU"
          className="flex-[1]"/>
        <Button 
          label="?"
          className="w-fit px-[18px]"/>
      </div> */}

      {/* Table */}
      <div className="flex flex-col w-full max-h-full overflow-y-scroll">
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
                    onClick={() => handleRowClick(t.getTeamId())}
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
      </div>

    </MainLayout>
  )
}

const headerRowStyle = "px-[10px] py-[4px] font-bold text-left"