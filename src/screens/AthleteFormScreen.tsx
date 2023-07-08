import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MainLayout from "../components/MainLayout"
import Athlete from "../data/classes/Athlete"
import { FormPageParams } from "../types"
import FormInput from "../components/FormInput"
import FormDropdown from "../components/FormDropdown"
import { message } from "@tauri-apps/api/dialog"
import { EMPTY_TEAM_ID, MONTHS } from "../constants"
import Button from "../components/Button"
import { generateID } from "../utils/idGenerator"
import { useAppDispatch, useAppSelector } from "../store"
import { setModal } from "../store/slices/modalSlice"
import Modal from "../components/Modal/Modal"
import { CircularProgress } from "@mui/material"
import useNotification from "../hooks/useNotification"
import athletePicture from "../assets/athlete3.png"


export default function AthleteFormScreen() {

  // Params passed from URL path
  const params = useParams<FormPageParams>()
  const {id: athleteId, mode} = params

  // Initializes other hooks
  const modalStatus: string = useAppSelector(state => state.modal.showing)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Athlete data
  const [athlete, setAthlete] = useState<Athlete>()

  // Input values
  const [nameInput, setNameInput] = useState<string>("")
  const [placeOfBirthInput, setPlaceOfBirthInput] = useState<string>("")

  const [dayOfBirthInput, setDayOfBirthInput] = useState<number>(1)
  const [monthOfBirthInput, setMonthOfBirthInput] = useState<string>("")
  const [yearOfBirthInput, setYearOfBirthInput] = useState<number>(2000)

  const [genderInput, setGenderInput] = useState<string>("")
  const [weightInput, setWeightInput] = useState<string>("")
  const [heightInput, setHeightInput] = useState<string>("")

  /**
   * Fetches athlete data from filesystem
   */
  const fetchAthleteData = async () => {
    if (!athleteId || athleteId === null || athleteId === "new") 
      return
    
    setAthlete(await Athlete.load(athleteId))
  }

  // Fetch athlete data when the screen is loaded
  useEffect(() => {
    fetchAthleteData()
  }, [athleteId])

  // Set input values when athlete data is loaded
  useEffect(() => {
    if (athlete) {
      const ttl: string = athlete.getTtl()
      
      const place: string = ttl.split(",")[0]
      const day: number = parseInt(ttl.split(",")[1].split(" ")[1])
      const month: string = ttl.split(",")[1].split(" ")[2]
      const year: number = parseInt(ttl.split(",")[1].split(" ")[3])
      
      setNameInput(athlete.getAthleteName())
      setPlaceOfBirthInput(place)
      setDayOfBirthInput(day)
      setMonthOfBirthInput(month)
      setYearOfBirthInput(year)
      setGenderInput(athlete.getGender())
      setWeightInput(athlete.getWeight().toString())
      setHeightInput(athlete.getHeight().toString())
    }
  }, [athlete])

  /**
   * Converts `m` and `f` to `Laki-laki` and `Perempuan` respectively
   * 
   * @returns `Laki-laki` or `Perempuan`
   */
    const parseGender = (): string => {

      if (genderInput === "m")
        return "Laki-laki"
  
      else if (genderInput === "f")
        return "Perempuan"
  
      else
        return ""
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

    else if (placeOfBirthInput === "") {
      message("Tempat lahir tidak boleh kosong", { title: "Error" })
      return false
    }

    else if (dayOfBirthInput <= 0 || dayOfBirthInput > 31) {
      message("Tanggal lahir tidak benar", { title: "Error" })
      return false
    }

    else if (yearOfBirthInput <= 1970) {
      message("Tahun lahir tidak benar", { title: "Error" })
      return false
    }

    else if (genderInput !== "m" && genderInput !== "f") {
      message("Jenis kelamin tidak benar", { title: "Error" })
      return false
    }

    else if (weightInput === "") {
      message("Berat badan tidak boleh kosong", { title: "Error" })
      return false
    }

    else if (heightInput === "") {
      message("Tinggi badan tidak boleh kosong", { title: "Error" })
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

    // Combine place, day, month, and year of birth into a single string
    const ttl: string = `${placeOfBirthInput}, ${dayOfBirthInput} ${monthOfBirthInput} ${yearOfBirthInput}`

    // If current mode is `add`, create new athlete
    if (mode === "add") {
      const athlete = new Athlete(
        generateID("a"),
        nameInput,
        "",
        ttl,
        genderInput === "m" ? "m" : "f",
        Number(weightInput),
        Number(heightInput),
        "",
        []
      )

      athlete.setCurrentTeamId(EMPTY_TEAM_ID)
      setAthlete(athlete)

      // Save athlete data
      athlete.save()
      
      // Show success notification
      useNotification("Berhasil", `Data ${athlete!.getAthleteName()} berhasil disimpan!`)

      // Redirect user to the athlete's profile page
      navigate(`/athlete/${athlete!.getAthleteId()}`)
    }
    
    else if (mode === "edit") {

      if (!athlete)
        return
      
      // Update athlete data
      athlete.setAthleteName(nameInput)
      athlete.setTtl(ttl)
      athlete.setGender(genderInput === "m" ? "m" : "f")
      athlete.setWeight(Number(weightInput))
      athlete.setHeight(Number(heightInput))
      
      // Save athlete data
      athlete.save()
  
      // Show success notification
      useNotification("Berhasil", `Data ${athlete!.getAthleteName()} berhasil disimpan!`)
      
      // Redirect user to the athlete's profile page
      navigate(`/athlete/${athlete!.getAthleteId()}`)
    }
    
    // Hide the modal
    dispatch(setModal(""))
  }

  return (
    <MainLayout 
      backButton
      prevPageName={ athleteId && athlete?.getAthleteName() }
      prevPageUrl={ athleteId ? `/athlete/${athleteId}` : `/athlete` }
      currentPageName={ 
        mode === "edit" ? "Ubah Biodata" : 
        mode === "add" ? "Daftarkan Atlet Baru" 
        : "Error: Unknown Mode" }>

      <div className="flex flex-row h-full w-full ml-[20px] mt-[12px]">

        {/* Left column */}
        <div className="flex flex-col flex-[5] h-fit px-[8px] gap-[12px]">
          <FormInput 
            label="Nama Lengkap"
            onChange={(value) => setNameInput(value)}
            value={nameInput}/>

          <FormInput 
            label="Tempat Lahir"
            onChange={(value) => setPlaceOfBirthInput(value)}
            value={placeOfBirthInput}/>

          {/* Date of birth input */}
          <div className="flex flex-row">
            
            {/* Day */}
            <FormInput 
              label="Tanggal Lahir"
              type="number"
              onChange={(value) => setDayOfBirthInput(Number(value))}
              value={dayOfBirthInput.toString()}/>

            {/* Month */}
            <FormDropdown
              label="Bulan"
              placeholder="Pilih bulan"
              options={MONTHS}
              onChange={(value) => setMonthOfBirthInput(value)}
              value={monthOfBirthInput}/>

            {/* Year */}
            <FormInput 
              label="Tahun"
              type="number"
              onChange={(value) => setYearOfBirthInput(Number(value))}
              value={yearOfBirthInput.toString()}/>
          </div>

          <FormDropdown
            label="Jenis Kelamin"
            placeholder="Pilih jenis kelamin"
            options={["Laki-laki", "Perempuan"]}
            onChange={(value) => handleGenderSelect(value)}
            value={parseGender()}/>

          <div className="flex flex-row">
            <FormInput 
              label="Berat Badan (Kg)"
              type="number"
              onChange={(value) => setWeightInput(value)}
              value={weightInput}/>
            <FormInput
              label="Tinggi Badan (cm)"
              type="number"
              onChange={(value) => setHeightInput(value)}
              value={heightInput}/>
          </div>

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