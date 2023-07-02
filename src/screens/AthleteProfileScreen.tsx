import { useParams } from "react-router-dom"
import Athlete from "../data/classes/Athlete"
import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"


type ParamsType = {
  athleteId: string
}

export default function AthleteDetailScreen() {
  const params = useParams<ParamsType>()
  const [athlete, setAthlete] = useState<Athlete | undefined>()
  
  /**
   * Fetch the athlete data from the `athletes` directory
   */
  const fetchAthleteData = async () => {
    const id = params.athleteId
    const athleteData = await Athlete.load(id!)
    setAthlete(athleteData)
  }

  // Fetch the athlete data when the screen is loaded
  useEffect(() => {
    fetchAthleteData()
  }, [])

  return (
    <MainLayout
      currentPageName={athlete ? athlete.getAthleteName() : "Memuat..."}
      prevPageName="Atlet"
      prevPageUrl="/athlete/all">

      <div className="flex flex-col gap-4 mr-[14px]">
        <p className="text-white font-quicksand text-body">Placeholder</p>
      </div>

    </MainLayout>
  )
}