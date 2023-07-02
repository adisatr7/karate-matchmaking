import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store"
import { logout } from "../../store/slices/authSlice"
import { closeModal } from "../../store/slices/modalSlice"
import { hideSidebar } from "../../store/slices/sidebarSlice"
import Modal from "./Modal"
import Button from "../Button"


export default function LogoutPrompt() {
  const modalStatus = useAppSelector(state => state.modal.showing)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(hideSidebar())
    dispatch(closeModal())
    dispatch(logout())
    setTimeout(() => {
      navigate("/login")    // TODO: Add better transition animation
    }, 500)
  }

  return (
    <>
      { modalStatus === "exit" && (
        <Modal title="Konfirmasi" caption="Yakin ingin keluar?">
          <div className="flex flex-row w-full h-full justify-center items-center gap-[10px]">
            <Button className="w-full h-full" label="Ya" onClick={handleLogout}/>
            <Button className="w-full h-full" label="Tidak" onClick={() => dispatch(closeModal())}/>
          </div>
        </Modal>
      )}
    </>
  )
}