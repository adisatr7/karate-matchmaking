import Particles from "react-particles"
import type { Container, Engine } from "tsparticles-engine"
import { loadFull } from "tsparticles"
import Sidebar from "./Sidebar"
import { useAppDispatch, useAppSelector } from "../store"
import { collapseSidebar, hideSidebar } from "../store/slices/sidebarSlice"
import Modal from "./Modal"
import Button from "./Button"
import { hideModal } from "../store/slices/modalSlice"
import { useNavigate } from "react-router-dom"
import { logout } from "../store/slices/authSlice"


type PropsType = {
  children: React.ReactNode,
}

export default function MenuBackground({ children }: PropsType) {
  const sidebarStatus = useAppSelector(state => state.sidebar.status)
  const modalStatus = useAppSelector(state => state.modal.isShown)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDismissSidebar = () => {
    if (sidebarStatus === "expanded")
      dispatch(collapseSidebar())
  }

  const handleLogout = () => {
    dispatch(hideSidebar())
    dispatch(hideModal())
    dispatch(logout())
    setTimeout(() => {
      navigate("/login")    // TODO: Add better transition animation
    }, 500)
  }

  return (
    <div className={`w-screen h-screen flex flex-row bg-cover bg-gradient-to-br from-pink-900 via-[18%] via-indigo-900 to-purple-900`}>
      
      {/* Sidebar - left side, collapsible */}
      <Sidebar/>

      <div
        onClick={handleDismissSidebar}
        className={`flex flex-1 flex-col pl-[120px] pr-[20px] py-[28px] transition-all duration-500 bg-black ${sidebarStatus === "expanded" ? "blur-sm bg-opacity-20" : "blur-0 bg-opacity-0"}`}>

        {children}

        {/* Logout modal prompt */}
        { modalStatus && (
        <Modal title="Konfirmasi" caption="Yakin ingin keluar?">
          <div className="flex flex-row w-full h-full justify-center items-center gap-[10px]">
            <Button className="w-full h-full" label="Ya" onClick={handleLogout}/>
            <Button className="w-full h-full" label="Tidak" onClick={() => dispatch(hideModal())}/>
          </div>
        </Modal>
        ) }
      </div>
    </div>
  )
}