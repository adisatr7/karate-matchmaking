import { useEffect, useState } from "react"
import MainLayout from "../components/MainLayout"
import Input from "../components/Input"
import Button from "../components/Button"
import { Search as SearchIcon } from "../assets/icons"
import TournamentsTable from "../components/Tables/TournamentsTable"
import Tournament from "../data/classes/Tournament"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import useNotification from "../hooks/useNotification"


export default function TournamentListScreen() {
  const [tournamentList, setTournamentList] = useState<Tournament[]>([])
  const [contestantAmount, setContestantAmount] = useState<number[]>([])
  
  const [searchKeyword, setSearchKeyword] = useState("")
  const [filteredTournaments, setFilteredTeams] = useState<Tournament[]>([])
  const [filteredContestantAmount, setFilteredContestantAmount] = useState<number[]>([])

  /**
   * Fetch the tournaments data from the tournaments directory
   */
  const fetchTournaments = async () => {
    const tournaments: Tournament[] = []
    const totalContestants: number[] = []

    // Read the tournaments directory
    await readDir(
      "tournaments", {
        dir: BaseDirectory.AppData,
        recursive: false
    })
    
    // If the directory is not empty, load the tournaments data one by one
    .then(async (files) => {
      files.forEach(async (file) => {

        // Remove the file extension
        const filename = file.name!.split(".")[0]
        
        // Load the tournament data
        const tournament = await Tournament.load(filename)
        const contestants = await tournament.getContestantAmount()

        // Add the tournament data to the list
        tournaments.push(tournament)
        totalContestants.push(contestants)

        // Update the state
        setTournamentList(tournaments)
        setContestantAmount(totalContestants)
      })
    })

    // If the directory is empty, create a default tournament
    .catch(err => {
      useNotification("Terjadi error saat membaca memuat data pertandingan", err)
    })
  }
  
  // Fetch the tournaments data when the screen is loaded
  useEffect(() => {
    fetchTournaments()
  }, [])


  const filterTournaments = () => {
    const filteredTeams: Tournament[] = []
    const filteredContestantAmount: number[] = []

    tournamentList.forEach((tournament, index) => {
      if (tournament.getTournamentName().toLowerCase().includes(searchKeyword.toLowerCase())) {
        filteredTeams.push(tournament)
        filteredContestantAmount.push(contestantAmount[index])
      }
    })

    setFilteredTeams(filteredTeams)
    setFilteredContestantAmount(filteredContestantAmount)
  }

  useEffect(() => {
    filterTournaments()
  }, [searchKeyword])

  
  const handleAddTournament = () => {
    
  }

  return (
    <MainLayout currentPageName="Daftar Pertandingan">

      {/* Search bar and its buttons */}
      <div className="flex flex-row h-fit w-full gap-[10px] text-caption">
        <Input 
          label="Cari nama pertandingan" 
          inputMode="text" 
          onChange={setSearchKeyword}
          leftIcon={SearchIcon}
          value={searchKeyword}
          className="flex-[2]"/>
        <Button 
          label="CARI PERTANDINGAN"
          className="flex-[1]"/>
        <Button 
          label="PERTANDINGAN BARU"
          className="flex-[1]"/>
        {/* <Button 
          label="?"
          onClick={handleHelp}
          className="w-fit px-[18px]"/> */}
      </div>

      {/* Table */}
      <div className="flex flex-col w-full max-h-full overflow-y-scroll">
        <TournamentsTable data={searchKeyword ? filteredTournaments : tournamentList} contestantAmount={searchKeyword ? filteredContestantAmount :contestantAmount}/>
      </div>

    </MainLayout>
  )
}