import { Link, useParams } from "react-router-dom"
import Athlete from "../data/classes/Athlete"
import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import Team from "../data/classes/Team"
import Button from "../components/Button"
import NumericDisplay from "../components/NumericDisplay"


type ParamsType = {
  athleteId: string
}

export default function AthleteDetailScreen() {
  const params = useParams<ParamsType>()
  const [currentAthlete, setCurrentAthlete] = useState<Athlete | undefined>()
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>()
  const [winrate, setWinrate] = useState<number>(0)
  
  /**
   * Fetch the athlete data from the `athletes` directory
   */
  const fetchAthleteData = async () => {

    // Get the athlete ID from the URL
    const id = params.athleteId
    
    // Load the athlete data from the `athletes` directory and set it to the state
    while (currentAthlete === undefined) {
      await Athlete.load(id!)
        .then(athleteData => setCurrentAthlete(athleteData))
      
      await currentAthlete!.calculateWinRate()
        .then(winrate => setWinrate(winrate))
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
        <div
          className="bg-cover h-full w-[500px] bg-primary-opaque border border-primary-opaque rounded-md">
          <img 
            src={currentAthlete?.getImageUrl()}/>
        </div>

        {/* Bio section */}
        <div className="flex flex-col h-full w-full gap-[2px] mb-[6px]">
          <h2 className={subheadingTextStyle}>Bio</h2>
          
          {/* Current team text */}
          <div className="flex flex-row items-center gap-[8px] h-fit"><p className={captionTextStyle}>Tim saat ini:</p>
            <Link to={`/team/${currentTeam?.getId()}`}>
              <p className={`hover:underline font-bold ${captionTextStyle}`}>{currentTeam?.getTeamName()}</p>
            </Link>
          </div>

          <p className={captionTextStyle}>Jenis kelamin: {currentAthlete?.getGender() === "m" ? "Laki-laki" : "Perempuan"}</p> 
          {/* TODO: Restructure the Athlete class AGAIN! */}
          <p className={captionTextStyle}>Usia: {currentAthlete?.getAge()} tahun</p>
          <p className={captionTextStyle}>Tempat & tanggal lahir: [NOT IMPLEMENTED]</p>
          <p className={captionTextStyle}>Berat badan: {currentAthlete?.getWeight()} kg</p>
          <p className={captionTextStyle}>Tinggi badan: [NOT IMPLEMENTED] cm</p>

          {/* Edit profile button */}
          <Button label="PERBARUI BIODATA" className="text-caption w-[280px] mt-[10px]"/>
        </div>

        {/* Performance section */}
        <div className="flex flex-col w-full h-fit">
          <h2 className={subheadingTextStyle}>Performa</h2>
            
          <div className="flex flex-row">

            {/* Numeric stats */}
            <div className="flex flex-col w-full">
              
              <NumericDisplay label="Yuko"/>
              <NumericDisplay label="Wazari"/>
              <NumericDisplay label="Ippon"/>
              <NumericDisplay label="Winrate" value={`${winrate}%`}/>
            </div>

            {/* Radar chart */}
            <div className="flex flex-col w-full">  
              {/* TODO: Put <RadarChart/> component here */}
              <div className="flex flex-row items-center justify-center text-white rounded-full bg-opacity-80 h-[200px] w-[200px] bg-dark-glass">Placeholder</div>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  )
}

const captionTextStyle = "text-white font-quicksand text-caption"
const subheadingTextStyle = "text-white font-quicksand text-subheading"