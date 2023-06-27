import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./store"
import { getCurrentUser } from "./data/controllers/users"
import { login } from "./store/slices/authSlice"
import { collapseSidebar } from "./store/slices/sidebarSlice"


export default function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const checkIfLoggedIn = async () => {
    const currentUser = await getCurrentUser()

    if (currentUser) {
      dispatch(login(currentUser))
      dispatch(collapseSidebar())
      navigate("/highlight")
    }
    
    else
      navigate("/login")
  }

  useEffect(() => {
    checkIfLoggedIn()
  }, [])

  return (
    <div className="bg-stone-900 h-screen w-screen justify-center items-center">
    </div>
  )
}