import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import MainLayout from "../../components/MainLayout"
import Division from "../../data/classes/Division"
import Bracket from "../../components/Bracket"
import Match from "../../data/classes/Match"
import Tournament from "../../data/classes/Tournament"
import { toSentenceCase } from "../../utils/stringFunctions"
import { TournamentStatusOptions } from "../../types"
import { useAppDispatch, useAppSelector } from "../../store"
import Modal from "../../components/Modal/Modal"
import Button from "../../components/Button"
import { closeModal, setModal } from "../../store/slices/modalSlice"
import useNotification from "../../hooks/useNotification"


export default function BracketScreen() {
  const {tournamentId, divisionId} = useParams()
  const dispatch = useAppDispatch()
  const modal = useAppSelector(state => state.modal.showing)

  const [division, setDivision] = useState<Division>()
  const [tournament, setTournament] = useState<Tournament>()
  const [tournamentStatus, setTournamentStatus] = useState<TournamentStatusOptions>("selesai")
  const [matches, setMatches] = useState<Match[]>([])

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

  /**
   * Fetches tournament data from the `tournaments.data` file
   */
  const fetchTournament = async () => {
    if (!tournamentId)
      return

    const tournament = await Tournament.load(tournamentId)
    setTournament(tournament)
  }

  // Fetch matches data when the division state changes
  useEffect(() => {
    fetchMatches()
    fetchTournament()
  }, [division])

  
  /**
   * Fetches tournament status from the `tournaments.data` file.
   */
  const fetchTournamentStatus = () => {
    if (!tournament)
      return

    setTournamentStatus(tournament.getStatus())
  }

  // Fetch tournament status when the tournament state changes
  useEffect(() => {
    fetchTournamentStatus()
  }, [tournament])

  
  /**
   * Generates matches for the current division.
   * 
   * TODO: Implement the thing
   */
  const handleGenerateMatches = async () => {
    if (!division)
      return

    division.generateMatches()
  }

  
  /**
   * Shows the confirmation modal to start the tournament.
   */
  const handleShowConfirmation = () => {
    dispatch(setModal("start-confirmation"))
  }


  /**
   * Change tournament status to "akan main" (scheduled).
   */
  const handleStartTournament = () => {
    if (!tournament)
      return

    tournament.setStatus("akan main")
    setTournamentStatus("akan main")
    tournament.save()
    dispatch(closeModal())
    useNotification("Pertandingan Dimulai", `Status ${tournament.getTournamentName()} berhasil diubah!`)
  }
  
  
  return (  
    <MainLayout 
      backButton
      prevPageName={division?.getDivisionName() || "Error: Gagal memuat data"}
      prevPageUrl={`/tournament/${tournamentId}` || "tournament/all"}
      currentPageName="Bagan Pertandingan">

      {/* Subheader container */}
      { division && tournament && 
        <div className="flex flex-row w-full h-fit text-body text-gray-300 gap-[8px] items-center">
          
          {/* Tournament status label */}
          { tournamentStatus === "pendaftaran" &&
            <p>Pertandingan belum dimulai. <button onClick={handleShowConfirmation} className="font-semibold text-white hover:underline">Klik disini</button> untuk memulai.</p>
          }

          { tournamentStatus === "akan main" &&
            <p>Klik pertandingan yang sedang berlangsung untuk mengakses skor</p>  
          }

        </div>
      }

      <div className="flex flex-col justify-center w-full h-full">
        { matches && matches.length > 0
          ? <Bracket matches={matches} finalist={division!.getFinalist()}/>
          : <p className="text-center text-gray-400">
              Kelas ini belum memiliki pertandingan. <span onClick={handleGenerateMatches} className="font-bold text-gray-300 hover:text-white hover:underline hover:cursor-pointer">Klik disini</span> untuk menambahkan pertandingan.
            </p>
        }
      </div>


      {/* Confirmation box */}
      { modal === "start-confirmation" &&
        <Modal 
          title="Konfirmasi"
          caption="Apakah Anda yakin ingn memulai pertandingan?">
          
          {/* Button Container */}
          <div className="flex flex-row justify-end gap-[24px] w-full">
            
            {/* Confirm Button */}
            <Button
              label="Mulai"
              onClick={handleStartTournament}
              className="flex flex-row w-full"/>

            {/* Cancel Button */}
            <Button
              label="Batal"
              onClick={() => dispatch(closeModal())}
              className="flex flex-row w-full"/>

          </div>

        </Modal>
      }

    </MainLayout>
  )
}