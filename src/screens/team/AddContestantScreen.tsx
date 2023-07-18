import { useEffect, useState } from "react"
import MainLayout from "../../components/MainLayout"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import Athlete from "../../data/classes/Athlete"
import useNotification from "../../hooks/useNotification"
import { useNavigate, useParams } from "react-router-dom"
import Division from "../../data/classes/Division"
import { toSentenceCase } from "../../utils/stringFunctions"
import { ask } from "@tauri-apps/api/dialog"
import Tournament from "../../data/classes/Tournament"
import Team from "../../data/classes/Team"
import { ContestantType } from "../../types"


type ParamsType = {
  tournamentId: string
  divisionId: string
}

export default function AddContestantScreen() {
  const navigate = useNavigate()
  const params = useParams<ParamsType>()
  const {tournamentId, divisionId} = params
  
  const [currentTournament, setCurrentTournament] = useState<Tournament>()
  const [currentDivision, setCurrentDivision] = useState<Division>()
  const [athletesList, setAthletesList] = useState<Athlete[]>([])
  const [teamsList, setTeamsList] = useState<Team[]>([])

  const headerLabels: string[] = [
    "NO", 
    "NAMA ATLET",
    "TIM",
    // "JENIS KELAMIN",
    "USIA",
    "BERAT (Kg)"
  ]


  /**
   * Fetch the current tournament data.
   */
  const fetchTournament = async () => {
    const tempData: Tournament = await Tournament.load(tournamentId!)
    setCurrentTournament(tempData)
  }

  
  /**
   * Fetch the current team data.
   */
  const fetchCurrentDivision = async () => {
    const tempData: Division = await Division.load(divisionId!)
    setCurrentDivision(tempData)
  }
    
  // Fetch the current tournament and division data when the screen is loaded
  useEffect(() => {
    fetchTournament()
    fetchCurrentDivision()
  }, [])

  
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

        // Retrieves the gender option for the current division
        const divisionGender = currentDivision?.getGender()

        // If gender is undefined, return // an error 
        if (!divisionGender)
          return // useNotification("Terjadi kesalahan saat memuat data atlet", `currentDivision.gender is ${currentDivision?.getGender()}`)

        // Prepare an empty list to store the athlete and team data
        const athleteList: Athlete[] = []
        const teams: Team[] = []

        // For each athlete, fetch the athlete data
        result.forEach(async (file) => {
          const athleteId: string = file.name!.split(".")[0]

          // Create an Athlete object from the athlete data
          const athlete: Athlete = await Athlete.load(athleteId!)
          const team = await athlete.getCurrentTeam()

          // Check if the athlete's gender matches the required gender to join the division
          if (athlete.getGender() !== divisionGender)
            return
          
          // Check if athlete is already registered in the current division
          const contestants = currentDivision?.getContestantsList()
          if (contestants?.some((contestant) => contestant.athleteId === athleteId))
            return
          
          // Check if the team already has a player playing in the current division
          if (contestants?.some((contestant) => contestant.teamId === athlete.getCurrentTeamId()))
            return
          
          // Push the athlete data into the list
          athleteList.push(athlete)
          setAthletesList(athleteList)

          // Push the team data into the list
          teams.push(team)
          setTeamsList(teams)
        })
      })
  }

  // Fetch the list of athletes when the screen is loaded
  useEffect(() => {
    fetchAthletes()
  }, [currentDivision])


  /**
   * Handler for when a row is clicked. The app will navigate to the 
   * athlete profile screen.
   * 
   * @param athleteId ID of the athlete
   */
  const handleRowClick = async (athleteId: string) => {

    const athlete = await Athlete.load(athleteId)
    const team = await athlete.getCurrentTeam()

    // Ask the user to confirm the action
    const choice = await ask(
      `Apakah Anda yakin ingin menambahkan ${athlete?.getAthleteName()} ke ${currentDivision?.getDivisionName()} ${currentTournament?.getTournamentName()}?`, { 
        title: "Konfirmasi", 
        okLabel: "Gabung", 
        cancelLabel: "Batal" 
      })

    // If the user confirms, add the athlete to the team
    if (choice) {

      // If current division is not loaded, return an error notification
      if (!currentDivision) {
        useNotification("Terjadi kesalahan saat menambahkan peserta", `currentDivision = ${JSON.stringify(currentDivision)}`)
          return
      }
      
      
      // Add the selected contestant into the division
      const newContestant: ContestantType = {
        athleteId: athlete.getAthleteId(),
        athleteName: athlete.getAthleteName(),
        teamId: team.getTeamId(),
        teamName: team.getTeamName()
      }
      currentDivision.addContestant(newContestant)
      
      // Save all changes
      currentDivision.save()

      // Show the success notification
      useNotification("Berhasil", `${athlete?.getAthleteName()} berhasil ditambahkan ke tim ${currentTournament?.getTournamentName()}!`)

      // Redirect to the tournament screen
      navigate(`/tournament/${tournamentId}`)
    }
  }


  /**
   * Handle new athlete button
   */
  const handleNewAthlete = () => {
    navigate("/athlete/form/new/add/")
  }
  
  
  return (
    <MainLayout
      backButton
      prevPageName={currentDivision?.getDivisionName()}
      prevPageUrl={`/tournament/${tournamentId}`}
      currentPageName="Tambah Anggota">

      <p className="text-caption">{
        // TODO: Add a text that explains that athletes which team has been represented by another athlete will not be displayed
      }</p>

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

            const currentTeam = teamsList[athleteIndex]
            const teamName = currentTeam?.getTeamName()

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
                            : label === "TIM" ? teamName
                            // : label === "JENIS KELAMIN" 
                            //   ? a.getGender() === "m" 
                            //     ? "Laki-laki" 
                            //     : "Perempuan"
                            : label === "USIA" ? a.getAge()
                            : label === "BERAT (Kg)" ? a.getWeight()
                            : ""
                        }
                      </td>
                  ))}
                </tr>
              )})
            : <tr className="text-center">
                <td colSpan={headerLabels.length} className="py-4 text-gray-300 text-caption hover:bg-stone-700">
                    Tidak ada atlet yang tersedia. Klik <span onClick={handleNewAthlete} className="font-bold text-white hover:underline hover:cursor-pointer">disini</span> untuk menambahkan data atlet baru.
                </td>
              </tr>
          }
        </tbody>
      </table>
    </MainLayout>
  )
}

const headerRowStyle = "px-[10px] py-[4px] font-bold text-left"