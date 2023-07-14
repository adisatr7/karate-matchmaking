import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Search as SearchIcon } from "../assets/icons"
import Button from "../components/Button"
import Input from "../components/Input"
import MainLayout from "../components/MainLayout"
import TeamMembersTable from "../components/Tables/TeamMembersTable"
import Athlete from "../data/classes/Athlete"
import Team from "../data/classes/Team"


type ParamsType = {
  teamId: string
}

export default function TeamDetailScreen() {
  const navigate = useNavigate()

  const params = useParams<ParamsType>()
  const [currentTeam, setTeam] = useState<Team>()
  
  const [winRates, setWinRates] = useState<number[]>([])
  const [members, setMembers] = useState<Athlete[]>([])
  
  const [filteredMembers, setFilteredMembers] = useState<Athlete[]>([])
  const [filteredWinrates, setFilteredWinrates] = useState<number[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>("")
  
  
  /**
   * Fetch the team data from the `teams` directory
   */
  const fetchTeamData = async () => {
    const id = params.teamId
    const teamData = await Team.load(id!)
    setTeam(teamData)
  }
  
  // Fetch the team data when the screen is loaded
  useEffect(() => {
    fetchTeamData()
  }, [])

  
  /**
   * Fetch the team members data from the `athletes` directory
   */
  const fetchMembers = async () => {

    // Prepare temporary variables to store the data
    let athletes: Athlete[] = []
    let winRates: number[] = []

    // For each member id, load the data and push it to the list
    currentTeam?.getMemberIds().forEach(async (id) => {

      // Load the member data
      const member = await Athlete.load(id)
      const winRate = await member.getWinRateRatio()
      
      // Push the member data to the list
      athletes.push(member)
      winRates.push(winRate)
      
      // Set the list of members and their win rates to the state
      setWinRates(winRates)
      setMembers(athletes)
    })
  }

  /**
   * Fetch the team members data when the team data is loaded
   */
  useEffect(() => {
    fetchMembers()
  }, [currentTeam])

  
  /**
   * Filter the members and their winrate based on the search keyword
   */
  const filterMembers = () => {
    let filteredMembers: Athlete[] = []
    let filteredWinRates: number[] = []
    
    members.forEach((member, index) => {
      if (member.getAthleteName().toLowerCase().includes(searchKeyword.toLowerCase())) {
        filteredMembers.push(member)
        filteredWinRates.push(winRates![index])
      }
    })
    setFilteredMembers(filteredMembers)
    setFilteredWinrates(filteredWinRates)
  }

  // Filter the members when the search keyword is changed
  useEffect(() => {
    filterMembers()
  }, [searchKeyword])

  
  /**
   * Handle the change description button
   */  
  const handleChangeDesc = () => {
    navigate(`/team/${params.teamId}/edit`)
  }

  
  /**
   * Handle the new member button
   */
  const handleNewMember = () => {
    navigate(`/team/${params.teamId}/addmember`)
  }

  return (
    <MainLayout
      backButton
      prevPageName="Tim"
      prevPageUrl="/team/all"
      currentPageName={currentTeam ? currentTeam.getTeamName() : "Memuat..."}>

      <div className="flex flex-col gap-[8px] mr-[14px] text-white font-quicksand text-body">
        <div className="flex flex-col gap-[1px]">
          <p><span className="opacity-70">Inisial: </span>{currentTeam?.getInitial()}</p>
          <p><span className="opacity-70">Asal:</span> {currentTeam?.getCity()}</p>
        </div>
        <p className="opacity-70">{currentTeam?.getDesc()}</p>
        <Button
          label="Ubah Deskripsi Tim"
          onClick={handleChangeDesc}
          className="text-caption w-fit px-[28px]"/>
        <h2 className="text-subheading font-quicksand">Anggota Tim</h2>

        {/* Search bar and its buttons */}
        <div className="flex flex-row h-fit w-full gap-[10px] text-caption">
          <Input 
            label="Cari nama anggota" 
            inputMode="text" 
            onChange={setSearchKeyword}
            leftIcon={SearchIcon}
            value={searchKeyword}
            className="flex-[2]"/>
          <Button 
            label="Cari Anggota"
            className="flex-[1]"/>
          <Button 
            onClick={handleNewMember}
            label="Tambah Anggota Baru"
            className="flex-[1]"/>
        </div>
        
        <div className="flex flex-col w-full max-h-full overflow-y-scroll">
          <TeamMembersTable data={searchKeyword ? filteredMembers : members} winRates={searchKeyword ? filteredWinrates : winRates}/>
        </div>
      </div>

    </MainLayout>
  )
}