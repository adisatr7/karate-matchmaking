import { useParams } from "react-router-dom"
import Team from "../data/classes/Team"
import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import Button from "../components/Button"
import Athlete from "../data/classes/Athlete"
import TeamMembersTable from "../components/Tables/TeamMembersTable"
import useNotification from "../hooks/useNotification"


type ParamsType = {
  teamId: string
}

export default function TeamDetailScreen() {
  const params = useParams<ParamsType>()
  const [currentTeam, setTeam] = useState<Team | undefined>()
  const [winRates, setWinRates] = useState<number[] | undefined>([])

  const [members, setMembers] = useState<Athlete[]>([])
  
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
    let tempWinRates: number[] = []

    // For each member id, load the data and push it to the list
    currentTeam?.getMemberIds().forEach(async (id) => {
      const member = await Athlete.load(id)
      athletes.push(member)
      setMembers(athletes)
    })
  }

  /**
   * Fetch the team members data when the team data is loaded
   */
  useEffect(() => {
    fetchMembers()
  }, [currentTeam])

  const fetchWinRates = async () => {
    let tempWinRates: number[] = []
    // Calculate the win rate of said athlete and push it to its own list
    members.forEach(async (member) => {
      const winRate = await member.getWinRateRatio()
      tempWinRates.push(winRate)
      setWinRates(tempWinRates)
    })
  }

  useEffect(() => {
    fetchWinRates()
  }, [members])

  return (
    <MainLayout
      backButton
      prevPageName="Tim"
      prevPageUrl="/team/all"
      currentPageName={currentTeam ? currentTeam.getTeamName() : "Memuat..."}>

      <div className="flex flex-col gap-[8px] mr-[14px] text-white font-quicksand">
        <p className="text-body"><span className="opacity-70">Asal:</span> {currentTeam?.getCity()}</p>
        <p className="text-body">{currentTeam?.getDesc()}</p>
        <Button
          label="UBAH DESKRIPSI TIM"
          className="text-caption w-fit px-[28px]"/>
          {/* TODO: Add on-click */}
          {/* TODO: Implement member management */}
        <TeamMembersTable data={members} winRates={winRates}/>
      </div>

    </MainLayout>
  )
}