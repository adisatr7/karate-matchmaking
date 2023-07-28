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
    fetchDivision()
  }, [])


  /**
   * Fetches all matches data from the filesystem
   */
  const fetchMatches = async () => {
    if (!division)
      return

    await division.getMatches()
      .then(matches => setMatches(matches))
      .catch(err => useNotification("Terjadi kesalahan saat mengambil data pertandingan", err))
  }

  // Fetch matches data when the division state changes
  useEffect(() => {
    fetchMatches()
  }, [division])


  const handleGenerateMatches = async () => {
    // TODO: Implement
  }

  return (
    <MainLayout 
      backButton={division ? true : false}
      prevPageName={division?.getDivisionName() || "Error: Gagal memuat data"}
      prevPageUrl={`/tournament/${tournamentId}` || "tournament/all"}
      currentPageName="Bagan Pertandingan">

      { matches 
        ? <Bracket matches={matches}/> 
        : <p className="text-center text-gray-500">
            Kelas ini belum memiliki pertandingan. <span onClick={handleGenerateMatches} className="font-bold hover:underline hover:cursor-pointer">Klik disini</span> untuk menambahkan pertandingan.
          </p>
      }

    </MainLayout>
  )
}