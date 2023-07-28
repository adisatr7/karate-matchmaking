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
      navigate("/tournament/all")
    }
    
    // If the user is not logged in, redirect to the login screen
    else
      navigate("/login")
  }


  /**
   * Disables the default browser-like right-click menu
   */
  const disableBrowserRightClick = () => {
    
    // Define a custom handler function for the contextmenu event
    const handleContextMenu = (e: MouseEvent) => {
      // Prevent the right-click menu from appearing
      e.preventDefault()
    }

    // Attach the event listener to  the document object
    document.addEventListener("contextmenu", handleContextMenu)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }
  
  
  // Check if the user is logged in when the component mounts
  useEffect(() => {
    disableBrowserRightClick()
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