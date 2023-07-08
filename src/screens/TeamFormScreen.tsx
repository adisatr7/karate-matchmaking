import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MainLayout from "../components/MainLayout"
import FormInput from "../components/FormInput"
import FormDropdown from "../components/FormDropdown"
import { message } from "@tauri-apps/api/dialog"
import { MONTHS } from "../constants"
import Button from "../components/Button"
import { generateID } from "../utils/idGenerator"
import { useAppDispatch, useAppSelector } from "../store"
import { setModal } from "../store/slices/modalSlice"
import Modal from "../components/Modal/Modal"
import { CircularProgress } from "@mui/material"
import useNotification from "../hooks/useNotification"
import athletePicture from "../assets/athlete3.png"
import Team from "../data/classes/Team"
import FormTextArea from "../components/FormTextArea"


type ParamsType = {
  teamId: string,
  mode: "add" | "edit"
}

export default function TeamFormScreen() {

  // Params passed from URL path
  const params = useParams<ParamsType>()
  const {teamId, mode} = params

  // Initializes other hooks
  const modalStatus: string = useAppSelector(state => state.modal.showing)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Team data
  const [team, setTeam] = useState<Team>()

  // Input values
  const [nameInput, setNameInput] = useState<string>("")
  const [descInput, setDescInput] = useState<string>("")
  const [cityInput, setCityInput] = useState<string>("")
  const [dayCreatedInput, setDayCreatedInput] = useState<number>(1)
  const [monthCreatedInput, setMonthCreatedInput] = useState<string>("")
  const [yearCreatedInput, setYearCreatedInput] = useState<number>(2000)

  
  /**
   * Fetches team data from filesystem
   */
  const fetchTeamData = async () => {
    if (!teamId || teamId === null || teamId === "new") 
      return
    
    setTeam(await Team.load(teamId))
  }

  // Fetch team data when the screen is loaded
  useEffect(() => {
    fetchTeamData()
  }, [teamId])
  
  // Set input values when team data is loaded
  useEffect(() => {
    if (team) {
      setNameInput(team.getTeamName())
      setDescInput(team.getDesc())
      setCityInput(team.getCity())

      const day: string = team.getDateCreated().split(" ")[0]
      const month: string = team.getDateCreated().split(" ")[1]
      const year: string = team.getDateCreated().split(" ")[2]

      setDayCreatedInput(parseInt(day))
      setMonthCreatedInput(month)
      setYearCreatedInput(parseInt(year))
    }
  }, [team])

  
  /**
   * Checks if all fields are filled. If not, show error message.
   * 
   * @returns `true` if all fields are filled, `false` otherwise
   */
  const fieldsAreFilled = () => {
    if (nameInput === "") {
      message("Nama tim tidak boleh kosong", { title: "Error" })
      return false
    }

    else if (dayCreatedInput === 0 || monthCreatedInput === "" || yearCreatedInput === 0) {
      message("Tanggal pembentukan tim tidak boleh kosong", { title: "Error" })
      return false
    }

    else if (cityInput === "") {
      message("Kota asal tim tidak boleh kosong", { title: "Error" })
      return false
    }

    else
      return true
  }

  
  /**
   * Generates the initial of the team's name, which is the first 3 letters
   * in the team's name, all in upper case.
   * 
   * @param fullname The full name of the team
   * @returns The initial of the team's name
   */
  const generateInitial = (): string => {
    const words: string[] = nameInput.split(" ")
    let initial: string = ""
    
    // If the team's name has 3 or more words, get the first letter of the first 3 words
    if (words.length >= 3)
      for (let i = 0; i < 3; i++)
        initial += words[i][0].toUpperCase()

    // If the team's name has less words, get the first letters of the first word
    else
      initial = nameInput.slice(0, 3).toUpperCase()

    return initial
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

    // If current mode is `add`, create new team
    if (mode === "add") {
      const team = new Team(
        generateID("t"),
        nameInput,
        descInput,
        generateInitial(),
        `${dayCreatedInput} ${monthCreatedInput} ${yearCreatedInput}`,
        cityInput,
        []
      )

      // Save team data
      team.save()
      
      // Show success notification
      useNotification("Berhasil", `Data tim ${team!.getTeamName()} berhasil disimpan!`)

      // Redirect user to the team's profile page
      navigate(`/team/${team!.getTeamId()}`)
    }
    
    else if (mode === "edit") {

      if (!team)
        return
      
      // Update team data
      team.setTeamName(nameInput)
      team.setDesc(descInput)
      team.setDateCreated(`${dayCreatedInput} ${monthCreatedInput} ${yearCreatedInput}`)
      team.setCity(cityInput)
      team.setInitial(generateInitial())
      
      // Save team data
      team.save()
  
      // Show success notification
      useNotification("Berhasil", `Data ${team!.getTeamName()} berhasil disimpan!`)
      
      // Redirect user to the team's profile page
      navigate(`/team/${team!.getTeamId()}`)
    }
    
    // Hide the modal
    dispatch(setModal(""))
  }

  return (
    <MainLayout 
      backButton
      prevPageName={ teamId && team?.getTeamName() }
      prevPageUrl={ teamId ? `/team/${teamId}` : `/team` }
      currentPageName={ 
        mode === "edit" ? "Ubah Deskripsi Tim" : 
        mode === "add" ? "Daftarkan Tim Baru" 
        : "Error: Unknown Mode" }>

      <div className="flex flex-row h-full w-full ml-[20px] mt-[12px]">

        {/* Left column */}
        <div className="flex flex-col flex-[5] h-fit px-[8px] gap-[12px]">

          {/* Team name */}
          <FormInput 
            label="Nama Tim"
            onChange={(value) => setNameInput(value)}
            value={nameInput}/>

          {/* Team description */}
          <FormTextArea 
            label="Deskripsi (opsional)"
            onChange={(value) => setDescInput(value)}
            value={descInput}/>

          {/* Team city origin */}
          <FormInput 
            label="Kota asal"
            onChange={(value) => setCityInput(value)}
            value={cityInput}/>

          {/* Date created input */}
          <div className="flex flex-row">
            
            {/* Day */}
            <FormInput 
              label="Tanggal didirikan"
              type="number"
              onChange={(value) => setDayCreatedInput(parseInt(value))}
              value={dayCreatedInput.toString()}/>

            {/* Month */}
            <FormDropdown
              label="Bulan"
              placeholder="Pilih bulan"
              options={MONTHS}
              onChange={(value) => setMonthCreatedInput(value)}
              value={monthCreatedInput}/>

            {/* Year */}
            <FormInput 
              label="Tahun"
              type="number"
              onChange={(value) => setYearCreatedInput(parseInt(value))}
              value={yearCreatedInput.toString()}/>
          </div>

          {/* Submit Button */}
          <div className="flex flex-row self-end w-fit mr-[10px] mt-[36px]">
            <Button
              label="SIMPAN"
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