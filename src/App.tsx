import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "./store"
import { getCurrentUser } from "./utils/authService"
import { login } from "./store/slices/authSlice"
import { collapseSidebar } from "./store/slices/sidebarSlice"


export default function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  /**
   * Fetches all users data from the `auth/users.data` file
   */
  const checkIfLoggedIn = async () => {

    // Get current user data from the `auth/currentUser.data` file
    const currentUser = await getCurrentUser()

    // If the user is logged in, redirect to the highlight screen
    if (currentUser) {
      dispatch(login(currentUser))
      dispatch(collapseSidebar())
      navigate("/highlight")
    }
    
    // If the user is not logged in, redirect to the login screen
    else
      navigate("/login")
  }
  
  useEffect(() => {
    checkIfLoggedIn()

    setTimeout(() => {
      checkIfLoggedIn()
    }, 100)
  }, [])

  return (
    <div className="items-center justify-center w-screen h-screen bg-stone-900">
      
    </div>
  )
}