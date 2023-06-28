import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import useNotification from "../../hooks/useNotification"
import { UserType } from "../../types"
import defaultUsersData from "../defaults/defaultUsers.json"
import { createFolder, writeInto } from "../../utils/fileManager"


/**
 * Save all users and current user data that is logged in to the app into
 * 'auth/users.data' file
 * 
 * @param currentUser The current user that is logged in to the app
 * @param allUsers List of all users to be saved to 'users.data' file
 */
export const saveUsersData = async (currentUser: UserType, allUsers: UserType[] | any) => {

  // Create 'data' folder (if it doesn't exist yet)
  await createFolder("auth")

  // Write into 'users.data' file
  await writeInto({ currentUser: currentUser, users: allUsers }, "auth/users")
}


/**
 * Initiate users data by creating the 'data' folder
 */
export const assignDefaultUsersData = async () => {
  saveUsersData(null, defaultUsersData)
}


/**
 * Get all users from 'users.data' file
 * 
 * @returns List of all registered users from 'users.data' file
 */
export const getAllUsers = async (): Promise<UserType[]> => {
  return new Promise((resolve, reject) => {
    readTextFile("data/users.data", {
      dir: BaseDirectory.AppData
    })
      .then(res => {
        const data = JSON.parse(res)
        resolve(data.users)
      })
      .catch(err => {
        useNotification("Terjadi kesalahan saat membaca data pengguna", err)
        assignDefaultUsersData()
        reject(err)
      })
  })
}


/**
 * Get a user data by its id
 * 
 * @param userId The id of the user to be searched
 * @returns The user with the specified id
 */
export const getUserById = async (userId: string): Promise<UserType> => {
  const users = await getAllUsers()
  const user = users.find(user => user?.userId === userId)

  return user ? user : null
}


/**
 * Get the data of current user that is logged in to the app
 * 
 * @returns The current user that is logged in to the app
 */
export const getCurrentUser = async (): Promise<UserType> => {
  return new Promise((resolve, reject) => {
    readTextFile("data/users.data", {
      dir: BaseDirectory.AppData
    })
      .then(res => {
        const data = JSON.parse(res)
        resolve(data.currentUser)
      })
      .catch(err => {
        useNotification("Terjadi kesalahan saat membaca data pengguna", err)
        assignDefaultUsersData()
        reject(err)
      })
  })
}


/**
 * Set the current user that is logged in to the app
 * 
 * @param user The current user that is logged in to the app
 */
export const setCurrentUser = async (user: UserType) => {
  const allUsers = await getAllUsers()
  saveUsersData(user, allUsers)
}


/**
 * Override the list of all registered users in 'users.data' file. Doesn't 
 * affect the current user
 * 
 * @param users List of all registered users to be saved to 'users.data' file
 */
export const setAllUsers = async (users: UserType[]) => {
  const currentUser = await getCurrentUser()
  saveUsersData(currentUser, users)
}


/**
 * Register a new user and save it to 'users.data' file
 * 
 * @param newUser The new user to be registered
 */
export const registerNewUser = async (newUser: UserType) => {

  // Check for existing user with the same id
  if (await getUserById(newUser!.userId)) {
    useNotification("Pengguna dengan ID tersebut sudah terdaftar", "Silahkan gunakan ID lain!")

    return
  }

  const allUsers = await getAllUsers()
  allUsers.push(newUser)
  setAllUsers(allUsers)
}


/**
 * Update a user data
 * 
 * @param updatedUser The updated user data to be saved
 */
export const updateUser = async (updatedUser: UserType) => {
  const allUsers = await getAllUsers()
  const newUsers = allUsers.map(user => {
    if (user!.userId === updatedUser!.userId) {
      return updatedUser
    }
    return user
  })
  setAllUsers(newUsers)
}


/**
 * Delete a user by its id
 * 
 * @param userId The id of the user to be deleted
 */
export const deleteUser = async (userId: string) => {
  const allUsers = await getAllUsers()
  const newUsers = allUsers.filter(user => user!.userId !== userId)
  setAllUsers(newUsers)
}