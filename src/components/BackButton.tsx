import { Back } from "../assets/icons"
import { useAppDispatch } from "../store"
import { collapseSidebar } from "../store/slices/sidebarSlice"


export default function BackButton() {

  const dispatch = useAppDispatch()

  const handleBackButton = () => {
    dispatch(collapseSidebar())
    window.history.back()
  }

  return (
    <Back 
      onClick={handleBackButton}
      className="flex items-center justify-center text-gray-400 bg-cover hover:text-white hover:cursor-pointer"/>
  )
}