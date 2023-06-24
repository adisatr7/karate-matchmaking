import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "./store"

import { BaseDirectory, createDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs"

import { setCurrentUser } from "./store/slices/authSlice"


export default function App() {

  const currentUser = useAppSelector(state => state.auth.currentUser)
  const dispatch = useAppDispatch()

  /**
   * Create data directory and files if they don't exist
   */
  const initiateUsersData = async () => {

    // Create 'data' folder
    await createDir("data", { 
      dir: BaseDirectory.App, 
      recursive: true 
    })
    
    // Create 'users.data' file
    await writeTextFile({
      path: "users.data",
      contents: JSON.stringify({
        currentUser: null,
        users: []
      })},
      { dir: BaseDirectory.App }
    )
  }

  /**
   * Read 'users.data' and set currentUser in Redux store (if exists)
   */
  const readUserData = async () => {
    try {
      const dataString = await readTextFile(
          "users.data", {
          dir: BaseDirectory.App,
        }
      )
      
      const dataObject = JSON.parse(dataString)
      const currentUser = dataObject.currentUser
  
      // Set current user inside Redux store
      if (dataObject.currentUser) {
        dispatch(setCurrentUser(currentUser))
      }
    }
    catch (err) {
      initiateUsersData()
    }
  }

  useEffect(() => {
    readUserData()

    if (currentUser)
      window.location.href = "/highlight"
    
    else
      window.location.href = "/login"
  }, [])

  return (
    <div className="bg-white h-screen w-screen justify-center items-center">
    </div>
  )
}