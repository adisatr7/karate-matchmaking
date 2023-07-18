import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store"
import { useEffect, useState } from "react"
import Tournament from "../../data/classes/Tournament"
import { message } from "@tauri-apps/api/dialog"
import { generateID } from "../../utils/idGenerator"
import Division from "../../data/classes/Division"
import { setModal } from "../../store/slices/modalSlice"
import useNotification from "../../hooks/useNotification"
import MainLayout from "../../components/MainLayout"
import FormInput from "../../components/FormInput"
import { CircularProgress } from "@mui/material"
import FormDropdown from "../../components/FormDropdown"
import { genderToString } from "../../utils/genderToString"
import athletePicture from "../../assets/athlete3.png"
import Modal from "../../components/Modal/Modal"
import Button from "../../components/Button"


type ParamsType = {
  tournamentId: string
}

export default function DivisionFormScreen() {
  const params = useParams<ParamsType>()
  const { tournamentId } = params

  // Initializes other hooks
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const modalStatus: string = useAppSelector(state => state.modal.showing)

  // Tournament  data
  const [tournament, setTournament] = useState<Tournament>()

  // Input values
  const [nameInput, setNameInput] = useState<string>("")
  const [genderInput, setGenderInput] = useState<string>("")
  // const [minAgeInput, setMinAgeInput] = useState<number>(0)
  // const [maxAgeInput, setMaxAgeInput] = useState<number>(0)
  // const [minWeightInput, setMinWeightInput] = useState<number>(0)
  // const [maxWeightInput, setMaxWeightInput] = useState<number>(0)

  
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
  }, [])

  
  /**
   * Checks if all fields are filled. If not, show error message.
   * 
   * @returns `true` if all fields are filled, `false` otherwise
   */
  const fieldsAreFilled = () => {
    if (!nameInput || nameInput === "") {
      message("Nama kelas tidak boleh kosong!", { title: "Error" })
      return false
    }

    if (!genderInput) {
      message("Jenis kelamin tidak boleh kosong!", { title: "Error" })
      return false
    }

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
    
    const division = new Division(
      generateID("k"),
      tournamentId,
      nameInput,
      genderInput === "m" ? "m" : "f",
      [],
      []
    )
    tournament?.addDivisionId(division.getDivisionId())

    // Save division data
    division.save()
    tournament?.save()
    
    // Show success notification
    useNotification("Berhasil", `${division.getDivisionName()} berhasil disimpan!`)

    // Redirect user to the tournament page
    navigate(`/tournament/${tournamentId}`)
    
    // Hide the modal
    dispatch(setModal(""))
  }


  /**
   * Handles gender selection dropdown. Converts `Laki-laki` to `m` and `Perempuan` to `f`
   * 
   * @param value 
   */
  const handleGenderSelect = (value: string): void => {
    if (value === "Laki-laki")
      setGenderInput("m")

    else if (value === "Perempuan")
      setGenderInput("f")

    else
      message("Hanya ada 2 jenis kelamin di Indonesia", { title: "Gender Error" })
  }
  

  return (
    <MainLayout 
      backButton
      prevPageName={ tournament?.getTournamentName() }
      prevPageUrl={ `/tournament/${tournamentId}` }
      currentPageName="Buat Kelas Baru">

      <div className="flex flex-row h-full w-full ml-[20px] mt-[12px]">

        {/* Left column */}
        <div className="flex flex-col flex-[5] h-fit px-[8px] gap-[12px]">

          {/* tournament name */}
          <div className="flex flex-col">
            <FormInput 
              label="Nama Kelas"
              onChange={(value) => setNameInput(value)}
              value={nameInput}/>
          </div>

          {/* Athlete gender input */}
          <FormDropdown
            label="Jenis Kelamin"
            placeholder="Pilih jenis kelamin"
            options={["Laki-laki", "Perempuan"]}
            onChange={(value) => handleGenderSelect(value)}
            value={genderToString(genderInput)}/>

          {/* Minimum and maximum age input */}
          {/* <div className="flex flex-row"> */}
            
            {/* Minimum age */}
            {/* <FormInput 
              label="Usia minimal"
              type="number"
              onChange={(value) => setMinimumAgeInput(parseInt(value))}
              value={minimumAgeInput.toString()}/> */}

            {/* Maximum age */}
            {/* <FormInput 
              label="Usia maksimal"
              type="number"
              onChange={(value) => setMaximumAgeInput(parseInt(value))}
              value={maximumAgeInput.toString()}/>
          </div> */}

          {/* Minimum and maximum weight input */}
          {/* <div className="flex flex-row"> */}
            
            {/* Minimum weight */}
            {/* <FormInput 
              label="Usia minimal"
              type="number"
              onChange={(value) => setMinimumWeightInput(parseInt(value))}
              value={minimumWeightInput.toString()}/> */}

            {/* Maximum weight */}
            {/* <FormInput 
              label="Usia maksimal"
              type="number"
              onChange={(value) => setMaximumWeightInput(parseInt(value))}
              value={maximumWeightInput.toString()}/>
          </div> */}

          {/* Submit Button */}
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