import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Match from "../data/classes/Match"
import Division from "../data/classes/Division"
import MatchHistory from "../data/classes/MatchHistory"
import Spinner from "../components/Spinner"
import { generateID } from "../utils/idGenerator"
import Button from "../components/Button"
import { ask } from "@tauri-apps/api/dialog"
import { useAppDispatch } from "../store"
import { collapseSidebar } from "../store/slices/sidebarSlice"


type ParamsType = {
  matchId: string
}

export default function MatchScreen() {

  /**
   * Navigation hook from react-router-dom
   */
  const navigate = useNavigate()

  /**
   * Dispatch hook from react-redux
   */
  const dispatch = useAppDispatch()

  /**
   * Retrieves the match id from the url param.
   */
  const { matchId } = useParams<ParamsType>()

  /**
   * State that tracks the match data.
   */
  const [match, setMatch] = useState<Match>()

  /**
   * State that tracks the involved athletes' match history data.
   */
  const [matchHistories, setMatchHistories] = useState<MatchHistory[]>([])
  const [scores, setScores] = useState<number[]>([-1, -1])
  const [yuko, setYuko] = useState<number[]>([0, 0])
  const [wazari, setWazari] = useState<number[]>([0, 0])
  const [ippon, setIppon] = useState<number[]>([0, 0])

  /**
   * State that tracks the division data.
   */
  const [division, setDivision] = useState<Division>()

  /**
   * State that tracks whether the screen is black or not.
   */
  const [screenIsBlack, setScreenIsBlack] = useState<boolean>(false)

  /**
   * Fetches division data from the filesystem
   */
  const fetchMatch = async () => {
    if (!matchId)
      return

    const temp = await Match.load(matchId)
    setMatch(temp)
  }

  // When the screen loads, immediately turn the screen black.
  useEffect(() => {
    setScreenIsBlack(true)
    fetchMatch()
  }, [])


  /**
   * Fetches division data from the filesystem
   */
  const fetchDivision = async () => {
    if (!match)
      return
    
    const temp = await Division.load(match.getDivisionId())
    setDivision(temp)
  }

  /**
   * Fetches match history data from the filesystem
   */
  const fetchMatchHistory = async () => {
    if (!match || !matchId)
      return
    
    const temp = await Promise.all(match.getContestants().map(async (c) => {
      return await MatchHistory.loadByMatchId(c.athleteId, matchId)
        .catch(() => new MatchHistory(
          generateID("h"),
          c.athleteId,
          matchId,
          false,
          0,
          0,
          0,
        ))
    }))

    setMatchHistories(temp)
  }

  // Fetch division data when the match data changes
  useEffect(() => {

    // Fetch division and athlete performance data
    fetchDivision()
    fetchMatchHistory()
    
    // Set the initial scores based on what's stored in match data
    if (match)
      setScores([...match.getScores()])
  }, [match])


  const fetchYuko = () => {
    const temp: number[] = []

    matchHistories.forEach((history) => {
      temp.push(history.getYuko())
    })
    setYuko(temp)
  }

  const fetchWazari = () => {
    const temp: number[] = []

    matchHistories.forEach((history) => {
      temp.push(history.getWazari())
    })
    setWazari(temp)
  }

  const fetchIppon = () => {
    const temp: number[] = []

    matchHistories.forEach((history) => {
      temp.push(history.getIppon())
    })
    setIppon(temp)
  }

  // Fetch athlete scores when the match history data changes
  useEffect(() => {
    fetchYuko()
    fetchWazari()
    fetchIppon()
  }, [matchHistories])

  // Calculate the total scores when the value of yuko, wazari, or ippon changes.
  useEffect(() => {
    let temp: number[] = [0, 0]

    for (let i=0; i<2; i++) { 
      temp[i] += yuko[i] * 1
      temp[i] += wazari[i] * 2
      temp[i] += ippon[i] * 3
    }
    setScores(temp)
  }, [yuko, wazari, ippon])


  /**
   * Handles the update of the yuko score.
   * 
   * @param yukoScore The new yuko score.
   * @param index The index of the athlete.
   */
  const handleUpdateYuko = (yukoScore: number, index: number) => {
    let temp = [...yuko]
    temp[index] = yukoScore
    setYuko(temp)

    matchHistories[index].setYuko(yukoScore)
  }


  /**
   * Handles the update of the wazari score.
   * 
   * @param wazariScore The new wazari score.
   * @param index The index of the athlete.
   */
  const handleUpdateWazari = (wazariScore: number, index: number) => {
    let temp = [...wazari]
    temp[index] = wazariScore
    setWazari(temp)

    matchHistories[index].setWazari(wazariScore)
  }


  /**
   * Handles the update of the ippon score.
   * 
   * @param ipponScore The new ippon score.
   * @param index The index of the athlete.
   */
  const handleUpdateIppon = (ipponScore: number, index: number) => {
    let temp = [...ippon]
    temp[index] = ipponScore
    setIppon(temp)

    matchHistories[index].setIppon(ipponScore)
  }

  
  /**
   * Handles the finish match button.
   */
  const handleMinimizeScreen = () => {
    if (match)
      match.save()
    
    if (matchHistories.length > 0)
      matchHistories.forEach((history) => {
        history.save()
      })
    
    dispatch(collapseSidebar())
    navigate(`/tournament/${division!.getTournamentId()}/division/${division!.getDivisionId()}/bracket`)
  }


  /**
   * Handles the finish match button.
   */
  const handleFinishMatch = async () => {

    // Show confirmation dialogue
    const confirmFinish = await ask(
      "Dengan melanjutkan, status pertandingan ini akan dianggap selesai dan skor tidak akan dapat diubah lagi.", {
        title: "Anda yakin ingin menyelesaikan pertandingan ini?",
        cancelLabel: "Batal",
        okLabel: "Selesai"
      }
    )

    // On "yes", save the data and change the match status to finished
    if (confirmFinish) {
      match!.setScores(scores)

      // Set the winner based on whose score is higher
      if (scores[0] > scores[1]) {
        match!.setWinner("teamA")
        matchHistories[0].setIsWinning(true)
      }

      else if (scores[0] < scores[1]) {
        match!.setWinner("teamB")
        matchHistories[1].setIsWinning(true)
      }

      else {
        match!.setWinner("draw")
      }

      // Set match status to finished
      match!.setStatus("selesai")

      // Save all changes to the filesystem
      match!.save()
      
      // Save athletes' match history
      if (matchHistories.length > 0)
        matchHistories.forEach((history) => {
          history.save()
        })
      
      // Redirect the user to the Bracket Screen
      dispatch(collapseSidebar())
      navigate(`/tournament/${division!.getTournamentId()}/division/${division!.getDivisionId()}/bracket`)
    }
  }


  return (
    <div className={`w-screen h-screen transition-colors duration-300 flex flex-col bg-cover hover:cursor-default justify-between items-center ${screenIsBlack ? "bg-black" : "bg-gradient-to-br from-pink-900 via-[18%] via-indigo-900 to-purple-900"} font-quicksand text-white px-[30px] py-[28px]`}>

      {/* Page header */}
      {/* <Header
        backButton
        hideProfileButton
        prevPageName={division?.getDivisionName() || "Loading..."}
        prevPageUrl={`/tournament/${division?.getTournamentId() || "all"}`}
        currentPageName={match?.getMatchName() || "Loading..."}/> */}

      {/* Page content */}
      { match && division? (
        <div className="flex flex-col py-[12px] h-full w-full gap-[12px] overflow-x-clip overflow-y-scroll items-center">
          
          {/* Match name */}
          <p className="text-subheading">{match?.getMatchName()}</p>

          <div className="flex flex-row items-center justify-center gap-[320px] w-full h-fit">
            
            { match && match.getContestants().map((c, index) => (
              <div key={index} className="flex flex-col items-center justify-between">

                {/* Score */}
                <p className="text-8xl my-[36px]">{scores[index]}</p>
                <p className="text-body">{c.athleteName}</p>
                <p className="text-body">{c.teamName}</p>

                <div className="flex h-[18px] w-[1px]"/>

                {/* Score buttons */}
                { matchHistories.length > 0 && (
                  <>
                    <Spinner
                      label="Yuko"
                      value={yuko[index]}
                      setValue={value => handleUpdateYuko(value, index)}/>
                    
                    <Spinner
                      label="Wazari"
                      value={matchHistories[index].getWazari()}
                      setValue={value => handleUpdateWazari(value, index)}/>
                    
                    <Spinner
                      label="Ippon"
                      value={matchHistories[index].getIppon()}
                      setValue={value => handleUpdateIppon(value, index)}/>
                  </>
                )}

              </div>
            ))}
          </div>

        </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="text-subheading">Memuat...</p>
          </div>
        )}
      <div className="flex flex-row justify-center w-full h-fit text-body items-center gap-[24px]">

        {/* Minimize Screen */}
        <button 
          onClick={handleMinimizeScreen} 
          className="hover:underline hover:cursor-buttonointer">Kembali</button>
        
        {/* Finish Tournament */}
        <Button 
          label="Selesai"
          onClick={handleFinishMatch}
          className="px-[18px]"/>
      </div>
    </div>
  )
}