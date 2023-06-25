import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BaseDirectory, createDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { useAppDispatch, useAppSelector } from "./store"
import { setCurrentUser, setRegisteredUsers } from "./store/slices/authSlice"
import { collapseSidebar } from "./store/slices/sidebarSlice"
import useNotification from "./hooks/useNotification"


export default function App() {
  const navigate = useNavigate()

  const registeredUsers = useAppSelector(state => state.auth.registeredUsers)
  const dispatch = useAppDispatch()

  /**
   * Create data directory and files if they don't exist
   */
  const initiateUsersData = async () => {

    // Create 'data' folder
    await createDir("data", { 
      dir: BaseDirectory.AppData, 
      recursive: true 
    }).catch(err => {
      useNotification("Terjadi kesalahan saat membuat folder baru", err)
    })
    
    // Create 'users.data' file
    await writeTextFile({
      path: "data/users.data",
      contents: JSON.stringify({
        currentUser: null,
        users: registeredUsers
      })},
      { dir: BaseDirectory.AppData }
    ).catch(err => {
      useNotification("Terjadi kesalahan saat membuat file baru", err)
    })
  }

  /**
   * Read 'users.data' and set currentUser in Redux store (if exists)
   */
  const readUserData = async () => {
    try {
      const dataString = await readTextFile(
          "data/users.data", {
          dir: BaseDirectory.AppData,
        }
      )
      
      const dataObject = await JSON.parse(dataString)
      const currentUser: User = await dataObject["currentUser"]

      // Set registered users list from 'users.data' into Redux store
      dispatch(setRegisteredUsers(dataObject.users))

      // Set current user inside Redux store
      if (dataObject.currentUser) {
        dispatch(setCurrentUser(currentUser))

        // Redirect to highlight screen if user is logged in before
        if (currentUser !== null) {
          navigate("/highlight")

          setTimeout(() => {
            dispatch(collapseSidebar())
          }, 100)
        }
        
        // Redirect to login screen if user is not logged in before
        else
          navigate("/login")
      }
    }
    catch (err) {
      await useNotification("Terjadi kesalahan saat membaca file `users.data`", err)
      await initiateUsersData()
    }
  }

  useEffect(() => {
    readUserData()
  }, [])

  return (
    <div className="bg-stone-900 h-screen w-screen justify-center items-center">
    </div>
  )
}