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
import { AthletePageParams, AthletePerformance } from "../types"
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded"
import { ask, message, open } from "@tauri-apps/api/dialog"
import { EMPTY_TEAM_ID } from "../constants"


export default function AthleteProfileScreen() {
  const navigate = useNavigate()
  const params = useParams<AthletePageParams>()

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
        extensions: ["png", "jpeg", "jpg", "webp", "gif"]
      }]
    })
    // If user selected a files
    if (selected) {
      useNotification("Berhasil", "Foto profil berhasil diubah!")
      message("Normalnya, foto atlet akan diubah. Namun, fitur ini belum tersedia di fase prototype ini.", { title: "Berhasil!" })
    }
  }

  const handleQuitTeam = async () => {
    const namaAtlet = currentAthlete?.getAthleteName()
    const namaTim = currentTeam?.getTeamName()

    const confirm = await ask(
      `Apakah Anda yakin ingin mengeluarkan ${namaAtlet} dari ${namaTim}?`, 
      { title: "Konfirmasi", type: "warning" })
      
    if (confirm) {
      // Remove the team ID from the athlete data
      currentAthlete!.setCurrentTeamId(EMPTY_TEAM_ID)

      // Remove the athlete from the team member list
      currentTeam?.removeMemberId(currentAthlete!.getAthleteId())
      
      // Save all changes to local filesystem
      currentAthlete?.save()
      currentTeam?.save()
      
      // Show the success message
      useNotification("Berhasil", `${namaAtlet} berhasil keluar dari ${namaTim}!`)
    }
  }

  /**
   * Handle the button click to go to the edit profile page of the current athlete
   */
  const handleEditProfile = () => {
    navigate(`/athlete/${params.athleteId}/edit`)
  }

  
  /**
   * Handle the button click to join the team
   */
  const handleJoinTeam = () => {
    navigate(`/athlete/${params.athleteId}/jointeam`)
  }
  

  if (currentAthlete)
    return (
      <MainLayout
        backButton
        prevPageName="Atlet"
        prevPageUrl="/athlete/all"
        currentPageName={currentAthlete ? currentAthlete.getAthleteName() : "Memuat..."}>

        {/* Container, goes to the --> */}
        <div className="flex flex-row gap-4 mr-[14px] items-start mt-[12px]">

          {/* Profile Picture */}
          <div
            style={{ backgroundImage: currentAthlete?.getImageUrl() }}
            onMouseEnter={() => setProfPictIsHovered(true)}
            onMouseLeave={() => setProfPictIsHovered(false)}
            className="h-[280px] w-[500px] bg-gray-400 border hover:border-2 border-primary-opaque rounded-md hover:cursor-pointer">
            <div style={{ backgroundImage: `url(${currentAthlete?.getImageUrl()})` }} className="flex items-center justify-center w-full h-full bg-cover rounded-md">
            {
              profPictIsHovered && (
                <div
                  onClick={handleChangePicture}
                  className="flex flex-col items-center justify-center w-full h-full text-white bg-black bg-opacity-50 font-quicksand text-caption">
                  <PhotoCameraRoundedIcon/>
                  <p>Ubah foto</p>
                </div>
              )
            }
            </div>
          </div>

          {/* Bio section */}
          <div className="flex flex-col h-full w-full gap-[6px] mb-[6px]">
            <h2 className={subheadingTextStyle}>Bio</h2>

            <p className={captionTextStyle}><span className={semiTransparentText}>Jenis kelamin:</span> {currentAthlete!.getGender() === "m" ? "Laki-laki" : "Perempuan"}</p> 
            <p className={captionTextStyle}><span className={semiTransparentText}>Usia:</span> {currentAthlete!.getAge()} tahun</p>
            <p className={captionTextStyle}><span className={semiTransparentText}>Tempat & tanggal lahir:</span> {currentAthlete!.getTtl()}</p>
            <p className={captionTextStyle}><span className={semiTransparentText}>Berat badan:</span> {currentAthlete!.getWeight()} kg</p>
            <p className={captionTextStyle}><span className={semiTransparentText}>Tinggi badan:</span> {currentAthlete!.getHeight()} cm</p>

            {/* Edit profile button */}
            <Button
              onClick={handleEditProfile}
              label="PERBARUI BIODATA" 
              className="text-caption w-[280px] mt-[10px]"/>
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

        {/* Current team text */}
        <p className={subheadingTextStyle}>Riwayat Pertandingan</p>
        <div className="flex flex-row items-center w-full h-fit">
          { currentTeam?.getId() !== EMPTY_TEAM_ID
            
            // If the athlete is in a team
            ? ( <div className="flex flex-row items-center w-full h-fit gap-[8px]">
                  <p className={`${captionTextStyle}`}>Tim saat ini:</p>
                  <p onClick={handleGoToTeamPageButton} className={`font-bold hover:underline hover:cursor-pointer ${captionTextStyle}`}>{currentTeam?.getTeamName()}</p>

                  {/* Separator line */}
                  <p className={`${captionTextStyle} ${semiTransparentText} mx-[4px] font-bold`}>|</p>

                  {/* Quit Team button */}
                  <p onClick={handleQuitTeam} className={`${captionTextStyle} ${semiTransparentText} hover:cursor-pointer hover:underline`}>Keluar</p>
                </div>
              ) :

              // If the athlete is NOT in a team
              ( <div className="flex flex-row items-center w-full h-fit gap-[8px]">
                  <p className={`${captionTextStyle} ${semiTransparentText}`}>{currentAthlete.getAthleteName()} sedang tidak berada di tim manapun</p>

                  {/* Separator line */}
                  <p className={`${captionTextStyle} ${semiTransparentText} mx-[4px] font-bold`}>|</p>
                  
                  {/* Join Team button */}
                  <p onClick={handleJoinTeam} className={`${captionTextStyle} font-bold hover:cursor-pointer hover:underline`}>Gabung</p>
                </div>  
              ) 
            }
        </div>
        
        {/* Table container */}
        <div className="flex flex-col w-full overflow-y-scroll h-fit">
          <MatchHistoryTable matchHistory={matchHistory} matches={prevMatches}/>
        </div>
        
      </MainLayout>
    )
}

const captionTextStyle = "text-white font-quicksand text-caption"
const subheadingTextStyle = "text-white font-quicksand text-subheading"
const semiTransparentText = "opacity-70"