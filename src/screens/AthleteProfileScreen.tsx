import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../components/Button"
import MainLayout from "../components/MainLayout"
import NumericDisplay from "../components/NumericDisplay"
import PerformanceChart from "../components/PerformanceChart"
import MatchHistoryTable from "../components/Tables/MatchHistoryTable"
import Athlete from "../data/classes/Athlete"
import Match from "../data/classes/Match"
import MatchHistory from "../data/classes/MatchHistory"
import Team from "../data/classes/Team"
import useNotification from "../hooks/useNotification"
import { AthletePerformance } from "../types"
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded"
import { message, open } from "@tauri-apps/api/dialog"


type ParamsType = {
  athleteId: string
}

export default function AthleteDetailScreen() {
  const navigate = useNavigate()
  const params = useParams<ParamsType>()

  const [currentAthlete, setCurrentAthlete] = useState<Athlete | undefined>()
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>()
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([])
  const [prevMatches, setPrevMatches] = useState<Match[]>([])
  const [winrate, setWinrate] = useState<number>(0)
  const [performance, setPerformance] = useState<AthletePerformance | undefined>()
  const [profPictIsHovered, setProfPictIsHovered] = useState<boolean>(false)

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
    }
  }
    
  // Fetch the athlete data when the screen is loaded
  useEffect(() => {
    fetchAthleteData()
  }, [])

  /**
   * Fetch the athlete performance data 
   */
  const fetchAthletePerformance = async () => {
    let tempObj: AthletePerformance = {
      yuko: 0,
      wazari: 0,
      ippon: 0
    }

    // Calculate the yuko score and set it to the state
    await currentAthlete!.getTotalYuko()
      .then(yuko => tempObj!.yuko = yuko)
    
    // Calculate the wazari score and set it to the state
    await currentAthlete!.getTotalWazari()
      .then(wazari => tempObj!.wazari = wazari)
    
    // Calculate the ippon score and set it to the state
    await currentAthlete!.getTotalIppon()
      .then(ippon => tempObj!.ippon = ippon)

    // Set the performance data to the state
    setPerformance(tempObj)
    
    // Calculate the winrate and set it to the state
    await currentAthlete!.getWinRatePercent()
      .then(winrate => setWinrate(winrate))
  }
  
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
    fetchAthletePerformance()
    fetchTeamData()

    if (prevMatches.length === 0) {
      fetchMatchHistory()
    }
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

  /**
   * Handle the button click to go to the team page of the current athlete
   */
  const handleGoToTeamPageButton = () => {
    navigate(`/team/${currentTeam?.getId()}`)
  }

  /**
   * Handle the button click to go to the
   */
  const handleChangePicture = async () => {
    const selected = await open({
      multiple: false,
      filters: [{
        name: "Image",
        extensions: ["png", "jpeg"]
      }]
    });
    // If user selected a files
    if (selected) {
      message("Normalnya, foto atlet akan diubah. Namun, fitur ini belum tersedia di fase prototype ini.", { title: "Mohon maaf" })
    }
    
    // If user cancelled the selection
    else {
    }
  }
  
  if (currentAthlete)
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
            onMouseEnter={() => setProfPictIsHovered(true)}
            onMouseLeave={() => setProfPictIsHovered(false)}
            className="h-[280px] w-[500px] bg-gray-500 border hover:border-2 border-primary-opaque rounded-md hover:cursor-pointer">
            <div style={{ backgroundImage: `url(${currentAthlete?.getImageUrl()})` }} className="h-full w-full bg-cover rounded-md flex justify-center items-center">
            {
              profPictIsHovered && (
                <div
                  onClick={handleChangePicture}
                  className="flex flex-col h-full w-full bg-black bg-opacity-50 justify-center items-center text-white font-quicksand text-caption">
                  <PhotoCameraRoundedIcon/>
                  <p>Ubah foto</p>
                </div>
              )
            }
            </div>
          </div>

          {/* Bio section */}
          <div className="flex flex-col h-full w-full gap-[2px] mb-[6px]">
            <h2 className={subheadingTextStyle}>Bio</h2>
            
            {/* Current team text */}
            <div className="flex flex-row items-center gap-[8px] h-fit">
              <p className={`${captionTextStyle} ${semiTransparentText}`}>Tim saat ini:</p>
              <p onClick={handleGoToTeamPageButton} className={`hover:underline font-bold hover:cursor-pointer ${captionTextStyle}`}>{currentTeam?.getTeamName()}</p>
            </div>

            <p className={captionTextStyle}><span className={semiTransparentText}>Jenis kelamin:</span> {currentAthlete!.getGender() === "m" ? "Laki-laki" : "Perempuan"}</p> 
            <p className={captionTextStyle}><span className={semiTransparentText}>Usia:</span> {currentAthlete!.getAge()} tahun</p>
            <p className={captionTextStyle}><span className={semiTransparentText}>Tempat & tanggal lahir:</span> {currentAthlete!.getTtl()}</p>
            <p className={captionTextStyle}><span className={semiTransparentText}>Berat badan:</span> {currentAthlete!.getWeight()} kg</p>
            <p className={captionTextStyle}><span className={semiTransparentText}>Tinggi badan:</span> {currentAthlete!.getHeight()} cm</p>

            {/* Edit profile button */}
            <Button label="PERBARUI BIODATA" className="text-caption w-[280px] mt-[10px]"/>
          </div>

          {/* Performance section */}
          <div className="flex flex-col w-full h-fit">
            <h2 className={subheadingTextStyle}>Performa</h2>
              
            <div className="flex flex-row">

              {/* Numeric stats */}
              <div className="flex flex-col w-full">
                
                <NumericDisplay label="Yuko" value={performance?.yuko}/>
                <NumericDisplay label="Wazari" value={performance?.wazari}/>
                <NumericDisplay label="Ippon" value={performance?.ippon}/>
                <NumericDisplay label="Winrate" value={`${winrate}%`}/>
              </div>

              {/* Radar chart */}
              <div className="flex flex-col w-full">
                <PerformanceChart performanceData={performance}/>
                {/* <div className="flex flex-row items-center justify-center text-white rounded-full bg-opacity-80 h-[200px] w-[200px] bg-dark-glass">Placeholder</div> */}
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