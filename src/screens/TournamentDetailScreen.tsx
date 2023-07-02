import { useParams } from "react-router-dom"
import Tournament from "../data/classes/Tournament"
import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"


type ParamsType = {
  tournamentId: string
}

export default function TournamentDetailScreen() {
  const params = useParams<ParamsType>()
  const [tournament, setTournament] = useState<Tournament | undefined>()
  
  /**
   * Fetch the tournament data from the `tournaments` directory
   */
  const fetchTournamentData = async () => {
    const id = params.tournamentId
    const tournamentData = await Tournament.load(id!)
    setTournament(tournamentData)
  }

  // Fetch the tournament data when the screen is loaded
  useEffect(() => {
    fetchTournamentData()
  }, [])

  return (
    <MainLayout
      currentPageName={tournament ? tournament.getTournamentName() : "Memuat..."}
      prevPageName="Pertandingan"
      prevPageUrl="/tournament/all">

      <div className="flex flex-col gap-4 mr-[14px]">
        <p className="text-white font-quicksand text-body">{tournament?.getDesc()}</p>
      </div>

    </MainLayout>
  )
}