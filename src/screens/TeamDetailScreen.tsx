import { useParams } from "react-router-dom"
import Team from "../data/classes/Team"
import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import Button from "../components/Button"
import Athlete from "../data/classes/Athlete"
import TeamMembersTable from "../components/Tables/TeamMembersTable"


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

      // Calculate the win rate of said athlete and push it to its own list
      tempWinRates.push(await member.calculateWinRate())
      setWinRates(tempWinRates)
    })
  }

  /**
   * Fetch the team members data when the team data is loaded
   */
  useEffect(() => {
    fetchMembers()
  }, [currentTeam])

  return (
    <MainLayout
      currentPageName={currentTeam ? currentTeam.getTeamName() : "Memuat..."}
      prevPageName="Tim"
      prevPageUrl="/team/all">

      <div className="flex flex-col gap-[8px] mr-[14px] text-white font-quicksand">
        <p className="text-body">Asal: <b>{currentTeam?.getCity()}</b></p>
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