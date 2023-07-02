import { Link, useParams } from "react-router-dom"
import Athlete from "../data/classes/Athlete"
import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import Team from "../data/classes/Team"
import Button from "../components/Button"


type ParamsType = {
  athleteId: string
}

export default function AthleteDetailScreen() {
  const params = useParams<ParamsType>()
  const [currentAthlete, setCurrentAthlete] = useState<Athlete | undefined>()

  const [currentTeam, setCurrentTeam] = useState<Team | undefined>()
  
  /**
   * Fetch the athlete data from the `athletes` directory
   */
  const fetchAthleteData = async () => {

    // Get the athlete ID from the URL
    const id = params.athleteId
    
    // Load the athlete data from the `athletes` directory and set it to the state
    while (currentAthlete === undefined) {
      await Athlete.load(id!).then(athleteData => setCurrentAthlete(athleteData))
    }
  }
    
  // Fetch the athlete data when the screen is loaded
  useEffect(() => {
    fetchAthleteData()
  }, [])
  
  /**
   * Fetch the team data from the `teams` directory
   */
  const fetchTeamData = async () => {
    await currentAthlete!.getCurrentTeam()
    .then(team => setCurrentTeam(team))
  }

  // Fetch the team data when the athlete data is loaded
  useEffect(() => {
    fetchTeamData()
  }, [currentAthlete])

  return (
    <MainLayout
      currentPageName={currentAthlete ? currentAthlete.getAthleteName() : "Memuat..."}
      prevPageName="Atlet"
      prevPageUrl="/athlete/all">

      {/* Container, goes to the --> */}
      <div className="flex flex-row gap-4 mr-[14px] items-start mt-[12px]">

        {/* Profile Picture */}
        <img src={currentAthlete?.getImageUrl()} className="bg-cover h-full w-[180px] bg-primary-opaque border border-primary-opaque rounded-md"/>

        {/* Bio */}
        <div className="flex flex-col h-full w-fit gap-[2px]">

          {/* BIo label */}
          <h2 className="text-white font-quicksand text-subheading">Bio</h2>
          
          {/* Current team text */}
          <div className="flex flex-row items-center gap-[8px] h-fit"><p className={bioTextStyle}>Tim saat ini:</p>
            <Link to={`/team/${currentTeam?.getId()}`}>
              <p className={`hover:underline font-bold ${bioTextStyle}`}>{currentTeam?.getTeamName()}</p>
            </Link>
          </div>

          <p className={bioTextStyle}>Jenis kelamin: {currentAthlete?.getGender() === "m" ? "Laki-laki" : "Perempuan"}</p> 
          {/* TODO: Restructure the Athlete class AGAIN! */}
          <p className={bioTextStyle}>Usia: {currentAthlete?.getAge()} tahun</p>
          <p className={bioTextStyle}>Tempat & tanggal lahir: [NOT IMPLEMENTED]</p>
          <p className={bioTextStyle}>Berat badan: {currentAthlete?.getWeight()} kg</p>
          <p className={bioTextStyle}>Tinggi badan: [NOT IMPLEMENTED] cm</p>

          <Button label="PERBARUI BIODATA" className="text-caption"/>
          
        </div>

      </div>
    </MainLayout>
  )
}

const bioTextStyle = "text-white font-quicksand text-caption"