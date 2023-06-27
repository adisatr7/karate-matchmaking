import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../store"

import { collapseSidebar } from "../store/slices/sidebarSlice"
import { login } from "../store/slices/authSlice"

import Entry from "../components/Entry"
import Button from "../components/Button"

import athleteImage1 from "../assets/athlete1.png"
import athleteImage2 from "../assets/athlete2.png"
import useNotification from "../hooks/useNotification"
import { useNavigate } from "react-router-dom"
import { appDataDir } from "@tauri-apps/api/path"
import { assignDefaultUsersData, getAllUsers } from "../data/controllers/users"


export default function LoginScreen() {
  const navigate = useNavigate()

  const [idPanitiaInput, setIdPanitiaInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")

  const currentUser = useAppSelector(state => state.auth.currentUser)
  const dispatch = useAppDispatch()
  
  /**
   * Handle login button click
  */
  const handleLogin = async () => {
    // Check if inputs are empty
    if (idPanitiaInput === "" || passwordInput === "") {
      useNotification("ID panitia atau kata sandi kosong", "Silakan coba lagi")
      // TODO: Implement in-app modal popup instead
      
      return
    }

    // Read registered users data
    const registeredUsers = await getAllUsers()

    // If the data is null, assign default data
    if (registeredUsers.length === 0) {
      useNotification("Gagal memuat data", "Tidak dapat membaca data pengguna!")
      assignDefaultUsersData()

      return
    }

    const user = registeredUsers.find(user => user!.id === idPanitiaInput)

    // If the user doesn't exist
    if (!user) {
      useNotification("ID panitia tidak terdaftar", "Silakan coba lagi")

      return
    }

    // If the user exists but the password is wrong
    if (user.password !== passwordInput) {
      useNotification("Kata sandi salah", "Silakan coba lagi")

      return
    }
    
    // If user exists, set the current user inside Redux store
    dispatch(login(user))
    
    // Navigate to home screen
    navigate("/highlight")
    
    if (currentUser)
    useNotification("Berhasil masuk", `Selamat datang, ${currentUser.name}!`)
    
    // Collapse sidebar
    setTimeout(() => {
      dispatch(collapseSidebar())
    }, 300)
  }

  return (
    <div className="w-screen h-screen flex flex-row justify-center items-center bg-cover bg-gradient-to-br from-pink-900 via-[18%] via-indigo-900 to-purple-900">

      {/* Image backgrounds */}
      <img src={athleteImage1} className={`bottom-[30px] left-[12px] opacity-60 ${athleteImageStyle}`}/>
      <img src={athleteImage2} className={`right-[10px] opacity-50 ${athleteImageStyle}`}/>

      {/* Login form */}
      <div className="bg-dark-glass bg-opacity-50 px-[24px] py-[22px] backdrop-blur-md rounded-lg flex flex-col gap-[16px]">
        <Entry 
          label="ID panitia" 
          value={idPanitiaInput} 
          onChange={setIdPanitiaInput} 
          className="w-[250px]"/>
        <Entry 
          label="Kata sandi"
          value={passwordInput} 
          onChange={setPasswordInput}
          type="password" 
          className="w-[250px]"/>
        <Button label="Masuk" onClick={handleLogin}/>
      </div>

    </div>
  )
}

const athleteImageStyle = "absolute mix-blend-screen transition-all ease-in-out"