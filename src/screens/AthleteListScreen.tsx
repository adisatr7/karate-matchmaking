import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import { Search as SearchIcon } from "../assets/icons"
import Button from "../components/Button"
import Input from "../components/Input"
import MainLayout from "../components/MainLayout"
import AthletesTable from "../components/Tables/AthletesTable"
import Athlete from "../data/classes/Athlete"
import Team from "../data/classes/Team"


export default function AthleteListScreen() {
  const navigate = useNavigate()

  const [athletesList, setAthletesList] = useState<Athlete[]>([])
  const [teamsList, setTeamsList] = useState<Team[]>([])
  
  const [searchKeyword, setSearchKeyword] = useState("")
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])

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
        const teams: Team[] = []

        // For each athlete, fetch the athlete data
        result.forEach(async (file) => {
          const athleteId: string = file.name!.split(".")[0]

          // Create an Athlete object from the athlete data
          const athleteData: Athlete = await Athlete.load(athleteId!)
          const teamData: Team = await athleteData.getCurrentTeam()

          // Push the athlete data to the list
          athleteList.push(athleteData)
          teams.push(teamData)
  
          // Set the list of athletes and teams to the state
          setAthletesList(athleteList)
          setTeamsList(teams)
        })
      })
  }

  // Fetch the list of athletes and teams when the screen is loaded
  useEffect(() => {
    fetchAthletes()
  }, [])

  /**
   * Filter the list of athletes based on the search keyword.
   */
  const filterAthletes = () => {
    const filteredAthletes: Athlete[] = athletesList.filter((athlete) => {
      return athlete.getAthleteName().toLowerCase().includes(searchKeyword.toLowerCase())
    })

    setFilteredAthletes(filteredAthletes)
  }

  // Filter the list of athletes when the search keyword is changed
  useEffect(() => {
    filterAthletes()
  }, [searchKeyword])

  /**
   * Filter the list of teams
   */
  const filterTeams = async () => {
    const filteredTeams: Team[] = []

    filteredAthletes.forEach(async (athlete) => {
      const team: Team = await athlete.getCurrentTeam()

      filteredTeams.push(team)
      setFilteredTeams(filteredTeams)
    })
  }

  // Filter the list of teams when the search keyword is changed
  useEffect(() => {
    filterTeams()
  }, [filteredAthletes])

  /**
   * Handler for the "Daftarkan Atlet Baru" button.
   */
  const handleNewAthlete = () => {
    navigate("/athlete/new/add")
  }

  return (
    <MainLayout currentPageName="Daftar Atlet">

      {/* Search bar and its buttons */}
      <div className="flex flex-row h-fit w-full gap-[10px] text-caption">
        <Input 
          label="Cari nama atlet" 
          inputMode="text" 
          onChange={setSearchKeyword}
          leftIcon={SearchIcon}
          value={searchKeyword}
          className="flex-[2]"/>
        <Button 
          label="CARI ATLET"
          className="flex-[1]"/>
        <Button 
          onClick={handleNewAthlete}
          label="DAFTARKAN ATLET BARU"
          className="flex-[1]"/>
      </div>

      {/* Table */}
      <div className="flex flex-col w-full max-h-full overflow-y-scroll">
        <AthletesTable data={searchKeyword ? filteredAthletes : athletesList} teamsList={searchKeyword ? filteredTeams : teamsList }/>
      </div>

    </MainLayout>
  )
}