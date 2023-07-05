import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import Entry from "../components/Entry"
import Button from "../components/Button"
import { Search as SearchIcon } from "../assets/icons"
import TeamsTable from "../components/Tables/TeamsTable"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import Team from "../data/classes/Team"
import useNotification from "../hooks/useNotification"
import { EMPTY_TEAM_ID } from "../constants"


export default function TeamListScreen() {
  const [teamList, setTeamsList] = useState<Team[]>([])
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
        if (team.getId() !== EMPTY_TEAM_ID)
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

  return (
    <MainLayout currentPageName="Daftar Tim">

      {/* Search bar and its buttons */}
      <div className="flex flex-row h-fit w-full gap-[10px] text-caption">
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
        {/* <Button 
          label="?"
          className="w-fit px-[18px]"/> */}
      </div>

      {/* Table | TODO: Implement search function5 */}
      <div className="flex flex-col w-full max-h-full overflow-y-scroll">
        <TeamsTable data={teamList}/>
      </div>

    </MainLayout>
  )
}