import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MainLayout from "../../components/MainLayout"
import Tournament from "../../data/classes/Tournament"
import FormInput from "../../components/FormInput"
import { message } from "@tauri-apps/api/dialog"
import Button from "../../components/Button"
import { generateID } from "../../utils/idGenerator"
import { useAppDispatch, useAppSelector } from "../../store"
import { setModal } from "../../store/slices/modalSlice"
import Modal from "../../components/Modal/Modal"
import { CircularProgress } from "@mui/material"
import useNotification from "../../hooks/useNotification"
import athletePicture from "../../assets/athlete3.png"
import FormTextArea from "../../components/FormTextArea"


type ParamsType = {
  tournamentId: string,
  mode: "add" | "edit"
}

export default function TournamentFormScreen() {

  // Params passed from URL path
  const params = useParams<ParamsType>()
  const {tournamentId, mode} = params

  // Initializes other hooks
  const modalStatus: string = useAppSelector(state => state.modal.showing)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Tournament data
  const [tournament, setTournament] = useState<Tournament>()

  // Input values
  const [nameInput, setNameInput] = useState<string>("")
  const [descInput, setDescInput] = useState<string>("")
  const [hostInput, setHostInput] = useState<string>("")

  
  /**
   * Fetches tournament data from filesystem
   */
  const fetchTournamentData = async () => {
    if (!tournamentId || tournamentId === null || tournamentId === "new") 
      return
    
    setTournament(await Tournament.load(tournamentId))
  }

  // Fetch tournament data when the screen is loaded
  useEffect(() => {
    fetchTournamentData()
  }, [tournamentId])

  // Set input values when tournament data is loaded
  useEffect(() => {
    if (tournament) {
      
      
      setNameInput(tournament.getTournamentName())
      setDescInput(tournament.getDesc())
      setHostInput(tournament.getHost())
    }
  }, [tournament])


  /**
   * Checks if all fields are filled. If not, show error message.
   * 
   * @returns `true` if all fields are filled, `false` otherwise
   */
  const fieldsAreFilled = () => {
    if (nameInput === "") {
      message("Nama lengkap tidak boleh kosong", { title: "Error" })
      return false
    }

    else if (hostInput === "") {
      message("Kolom penyelenggara tidak boleh kosong", { title: "Error" })
      return false
    }

    else
      return true
  }

  
  /**
   * Handles submit button click
   */
  const handleSubmitButton = async () => {

    // Check if all fields are filled
    if (!fieldsAreFilled())
      return

    // Show popup modal with saving animation
    dispatch(setModal("savingdata"))

    // If current mode is `add`, create new tournament
    if (mode === "add") {
      const tournament = new Tournament(
        generateID("a"),
        nameInput,
        descInput,
        "pendaftaran",
        hostInput,
        []
      )

      
      // Save tournament data
      setTournament(tournament)
      tournament.save()
      
      // Show success notification
      useNotification("Berhasil", `Pertandingan ${tournament!.getTournamentName()} berhasil dibuat!`)

      // Redirect user to the tournament's profile page
      navigate(`/tournament/${tournament!.getTournamentId()}`)
    }
    
    else if (mode === "edit") {

      if (!tournament)
        return
      
      // Update tournament data
      tournament.setTournamentName(nameInput)
      tournament.setDesc(descInput)
      tournament.setHost(hostInput)
      
      // Save tournament data
      tournament.save()
  
      // Show success notification
      useNotification("Berhasil", `Data ${tournament!.getTournamentName()} berhasil disimpan!`)
      
      // Redirect user to the tournament's profile page
      navigate(`/tournament/${tournament!.getTournamentId()}`)
    }
    
    // Hide the modal
    dispatch(setModal(""))
  }

  return (
    <MainLayout 
      backButton
      prevPageName={ tournamentId && tournament?.getTournamentName() }
      prevPageUrl={ tournamentId ? `/tournament/${tournamentId}` : `/tournament` }
      currentPageName={ 
        mode === "edit" ? "Ubah Biodata" : 
        mode === "add" ? "Daftarkan Atlet Baru" 
        : "Error: Unknown Mode" }>

      <div className="flex flex-row h-full w-full ml-[20px] mt-[12px]">

        {/* Left column */}
        <div className="flex flex-col flex-[5] h-fit px-[8px] gap-[12px]">
          <FormInput 
            label="Nama Pertandingan"
            onChange={(value) => setNameInput(value)}
            value={nameInput}/>

          <FormTextArea 
            label="Deskripsi (opsional)"
            onChange={(value) => setDescInput(value)}
            value={descInput}/>

          <FormInput 
            label="Penyelenggara"
            onChange={(value) => setHostInput(value)}
            value={hostInput}/>

          <div className="flex flex-row self-end w-fit mr-[10px] mt-[36px]">
            <Button
              label="Simpan"
              onClick={handleSubmitButton}
              className="text-caption px-[26px]"/>    
          </div>
        </div>


        {/* Separator line */}
        {/* <div className="flex w-[4px] h-full rounded-full bg-gray-500 bg-opacity-50 z-10"/> */}

        {/* Right column */}
        <div className="flex flex-col flex-[4] px-[8px] gap-[12px]">
          <img src={athletePicture} className="absolute top-0 right-0 h-full mix-blend-screen opacity-10"/>
        </div>

      </div>
      {
        modalStatus === "savingdata" && (
          <Modal title="Menyimpan data">
            <div className="flex flex-row w-full h-fit py-[4px] justify-center items-center">
              <CircularProgress color="error" />
            </div>
          </Modal>
        )
      }
    </MainLayout>
  )
}