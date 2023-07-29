import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import MainLayout from "../../components/MainLayout"
import Division from "../../data/classes/Division"
import Bracket from "../../components/Bracket"
import useNotification from "../../hooks/useNotification"
import Match from "../../data/classes/Match"


export default function BracketScreen() {
  const {tournamentId, divisionId} = useParams()

  const [division, setDivision] = useState<Division>()
  const [matches, setMatches] = useState<Match[]>()

  /**
   * Fetches division data from the `divisions.data` file
   */
  const fetchDivision = async () => {
    if (!divisionId) 
      return

    const division = await Division.load(divisionId)
    setDivision(division)
  }

  // Fetch division data when the component mounts
  useEffect(() => {
    setTimeout(() => {
      fetchDivision()
    }, 300)
  }, [])


  /**
   * Fetches all matches data from the filesystem
   */
  const fetchMatches = async () => {
    if (!division)
      return

      const divisionMatches: Match[] = []
      const matchIds: string[] = division.getMatchIds()
    
    for (let i=0; i<matchIds.length; i++) {
      const match = await Match.load(matchIds[i])
      divisionMatches.push(match)
    }
    setMatches(divisionMatches)
  }

  // Fetch matches data when the division state changes
  useEffect(() => {
    fetchMatches()
  }, [division])

  
  const handleGenerateMatches = async () => {
    if (!division)
      return

    division.generateMatches()
  }

  return (
    <MainLayout 
      backButton={division ? true : false}
      prevPageName={division?.getDivisionName() || "Error: Gagal memuat data"}
      prevPageUrl={`/tournament/${tournamentId}` || "tournament/all"}
      currentPageName="Bagan Pertandingan">

      { matches && matches.length > 0
        ? <Bracket matches={matches}/> 
        : <p className="text-center text-gray-400">
            Kelas ini belum memiliki pertandingan. <span onClick={handleGenerateMatches} className="font-bold text-gray-300 hover:text-white hover:underline hover:cursor-pointer">Klik disini</span> untuk menambahkan pertandingan.
          </p>
      }

    </MainLayout>
  )
}