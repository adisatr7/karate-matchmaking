import { useEffect, useState } from "react"
import MenuBackground from "../components/MenuBackground"
import Entry from "../components/Entry"
import Button from "../components/Button"
import { Search as SearchIcon } from "../assets/icons"
import TournamentsTable from "../components/Tables/TournamentsTable"
import Tournament from "../data/classes/Tournament"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import useNotification from "../hooks/useNotification"
import { useAppDispatch, useAppSelector } from "../store"
import Modal from "../components/Modal"
import { showModal } from "../store/slices/modalSlice"


export default function TournamentListScreen() {
  const [tournamentList, setTournamentList] = useState<Tournament[]>([])
  const [contestantAmount, setContestantAmount] = useState<number[]>([])
  
  const [searchKeyword, setSearchKeyword] = useState("")

  const modalIsShown = useAppSelector(state => state.modal.isShown)
  const dispatch = useAppDispatch()

  
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

  
  const handleSearch = () => {
    
  }

  
  const handleAddTournament = () => {
    
  }

  const handleHelp = () => {
    dispatch(showModal())
  }
  

  return (
    <MenuBackground pageName="Daftar Pertandingan">

      {/* Search bar and its buttons */}
      <div className="flex flex-row h-fit w-full gap-[10px]">
        <Entry 
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
        <Button 
          label="?"
          onClick={handleHelp}
          className="w-fit px-[18px]"/>
      </div>

      {/* Table | TODO: Implement search function5 */}
      <div className="flex flex-col w-full max-h-full overflow-y-scroll">
        <TournamentsTable data={tournamentList} contestantAmount={contestantAmount}/>
      </div>

      {
        modalIsShown && (
          <Modal 
            title="Pertandingan" 
            caption="Pada layar ini, Anda dapat melihat semua pertandingan yang terdaftar di sistem."/>
        )
      }

    </MenuBackground>
  )
}