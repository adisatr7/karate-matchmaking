import { Link, useParams } from "react-router-dom"
import Athlete from "../data/classes/Athlete"
import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import Team from "../data/classes/Team"
import Button from "../components/Button"
import NumericDisplay from "../components/NumericDisplay"
import MatchHistory from "../data/classes/MatchHistory"
import MatchHistoryTable from "../components/Tables/MatchHistoryTable"
import Match from "../data/classes/Match"
import useNotification from "../hooks/useNotification"


type ParamsType = {
  athleteId: string
}

export default function AthleteDetailScreen() {
  const params = useParams<ParamsType>()
  const [currentAthlete, setCurrentAthlete] = useState<Athlete | undefined>()
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>()
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([])
  const [prevMatches, setPrevMatches] = useState<Match[]>([])
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
      
      // Calculate the winrate and set it to the state
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

  /**
   * Fetch the match history data of the current athlete from the `matchHistory` directory
   */
  const fetchMatchHistory = async () => {
    await currentAthlete!.getMatchHistories()
      .then(history => setMatchHistory(history))
      .catch(err => useNotification("Terjadi kesalahan saat mengambil data riwayat pertandingan", err))
  }

  // Fetch other data once the athlete data is loaded
  useEffect(() => {
    fetchTeamData()
    fetchMatchHistory()
  }, [currentAthlete])

  /**
   * Fetch the match data of the current athlete from the `matches` directory based on the match history
   */
  const fetchMatchData = async () => {
    let temp: Match[] = []
    
    matchHistory.forEach(async (history: MatchHistory) => {
      await history.getMatchData()
        .then(data => {
          temp.push(data)
          setPrevMatches(temp)
        })

        // In case of error, show the error message through the OS' notification
        .catch(err => {
          useNotification("Terjadi kesalahan saat membaca data riwayat pertandingan", err)
        })
    })
  }

  // Fetch the match data once the match history data is loaded
  useEffect(() => {
    fetchMatchData()
  }, [matchHistory])
  
  return (
    <MainLayout
      currentPageName={currentAthlete ? currentAthlete.getAthleteName() : "Memuat..."}
      prevPageName="Atlet"
      prevPageUrl="/athlete/all">

      {/* Container, goes to the --> */}
      <div className="flex flex-row gap-4 mr-[14px] items-start mt-[12px]">

        {/* Profile Picture */}
        <div
          style={{ backgroundImage: currentAthlete?.getImageUrl() }}
          className="h-[280px] w-[500px] bg-primary-opaque border border-primary-opaque rounded-md hover:brightness-90 hover:cursor-pointer">
          <img 
            className="object-cover w-full h-full"
            src={currentAthlete?.getImageUrl()}/> 
        </div>

        {/* Bio section */}
        <div className="flex flex-col h-full w-full gap-[2px] mb-[6px]">
          <h2 className={subheadingTextStyle}>Bio</h2>
          
          {/* Current team text */}
          <div className="flex flex-row items-center gap-[8px] h-fit"><p className={`${captionTextStyle} ${semiTransparentText}`}>Tim saat ini:</p>
            <Link to={`/team/${currentTeam?.getId()}`}>
              <p className={`hover:underline font-bold ${captionTextStyle}`}>{currentTeam?.getTeamName()}</p>
            </Link>
          </div>

          <p className={captionTextStyle}><span className={semiTransparentText}>Jenis kelamin:</span> {currentAthlete?.getGender() === "m" ? "Laki-laki" : "Perempuan"}</p> 
          <p className={captionTextStyle}><span className={semiTransparentText}>Usia:</span> {currentAthlete?.getAge()} tahun</p>
          <p className={captionTextStyle}><span className={semiTransparentText}>Tempat & tanggal lahir:</span> {currentAthlete?.getTtl()}</p>
          <p className={captionTextStyle}><span className={semiTransparentText}>Berat badan:</span> {currentAthlete?.getWeight()} kg</p>
          <p className={captionTextStyle}><span className={semiTransparentText}>Tinggi badan:</span> {currentAthlete?.getHeight()} cm</p>

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

      {/* Table container */}
      <p className={subheadingTextStyle}>Riwayat Pertandingan</p>
      <div className="flex flex-col w-full overflow-y-scroll h-fit">
        <MatchHistoryTable matchHistory={matchHistory} matches={prevMatches}/>
      </div>
      
    </MainLayout>
  )
}

const captionTextStyle = "text-white font-quicksand text-caption"
const subheadingTextStyle = "text-white font-quicksand text-subheading"
const semiTransparentText = "opacity-70"