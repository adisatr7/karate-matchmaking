import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import Entry from "../components/Entry"
import Button from "../components/Button"
import AthletesTable from "../components/Tables/AthletesTable"
import { Athlete } from "../data/classes/Athlete"
import { Team } from "../data/classes/Team"
import { Search as SearchIcon } from "../assets/icons"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"


export default function AthleteListScreen() {
  const [athletesList, setAthletesList] = useState<Athlete[]>([])
  const [teamsList, setTeamsList] = useState<Team[]>([])
  const [searchKeyword, setSearchKeyword] = useState("")

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
      .then(result => {

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

  return (
    <MainLayout currentPageName="Daftar Atlet">

      {/* Search bar and its buttons */}
      <div className="flex flex-row h-fit w-full gap-[10px]">
        <Entry 
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
          label="DAFTARKAN ATLET BARU"
          className="flex-[1]"/>
        <Button 
          label="?"
          className="w-fit px-[18px]"/>
      </div>

      {/* Table | TODO: Implement search function5 */}
      <div className="flex flex-col w-full max-h-full overflow-y-scroll">
        <AthletesTable data={athletesList} teamsList={teamsList}/>
      </div>

    </MainLayout>
  )
}