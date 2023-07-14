import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../components/MainLayout"
import Input from "../components/Input"
import Button from "../components/Button"
import { Search as SearchIcon } from "../assets/icons"
import TeamsTable from "../components/Tables/TeamsTable"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import Team from "../data/classes/Team"
import useNotification from "../hooks/useNotification"
import { EMPTY_TEAM_ID } from "../constants"


export default function TeamListScreen() {
  const navigate = useNavigate()

  const [teamList, setTeamsList] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [searchKeyword, setSearchKeyword] = useState("")

  
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

  // Fetch the teams data when the screen is loaded
  useEffect(() => {
    fetchTeams()
  }, [])

  
  /**
   * Filter the teams based on the search keyword
   */
  const filterTeams = () => {
    const filteredTeams: Team[] = []

    teamList.forEach((team) => {
      if (team.getTeamName().toLowerCase().includes(searchKeyword.toLowerCase()))
        filteredTeams.push(team)
    })

    setFilteredTeams(filteredTeams)
  }

  // Filter the teams when the search keyword is changed
  useEffect(() => {
    filterTeams()
  }, [searchKeyword])


  const handleNewTeam = () => {
    navigate("/team/new/add")
  }

  
  return (
    <MainLayout currentPageName="Daftar Tim">

      {/* Search bar and its buttons */}
      <div className="flex flex-row h-fit w-full gap-[10px] text-caption">
        <Input 
          label="Cari nama tim" 
          inputMode="text" 
          onChange={setSearchKeyword}
          leftIcon={SearchIcon}
          value={searchKeyword}
          className="flex-[2]"/>
        <Button 
          label="Cari Tim"
          className="flex-[1]"/>
        <Button 
          label="Daftarkan Tim Baru"
          onClick={handleNewTeam}
          className="flex-[1]"/>
        {/* <Button 
          label="?"
          className="w-fit px-[18px]"/> */}
      </div>

      {/* Table */}
      <div className="flex flex-col w-full max-h-full overflow-y-scroll">
        <TeamsTable data={searchKeyword ? filteredTeams : teamList}/>
      </div>

    </MainLayout>
  )
}