import { useParams } from "react-router-dom"
import Team from "../data/classes/Team"
import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"


type ParamsType = {
  teamId: string
}

export default function TeamDetailScreen() {
  const params = useParams<ParamsType>()
  const [team, setTeam] = useState<Team | undefined>()
  
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

  return (
    <MainLayout
      currentPageName={team ? team.getTeamName() : "Memuat..."}
      prevPageName="Tim"
      prevPageUrl="/team/all">

      <div className="flex flex-col gap-4 mr-[14px]">
        <p className="text-white font-quicksand text-body">{team?.getDesc()}</p>
      </div>

    </MainLayout>
  )
}