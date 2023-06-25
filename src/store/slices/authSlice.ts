import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { User } from "../../types"


/**
 * Auth states type definition
 */
export interface AuthState {
  currentUser: User | null,
  registeredUsers: User[]
}

/**
 * Auth initial state containing the current user and the list of registered users
 */
const initialState: AuthState = {
  currentUser: null,
  registeredUsers: [
    {
      id: "admin",
      name: "Admin",
      password: "admin"
    }
  ]
}

/**
 * Auth slice containing the reducer and actions for the auth
 */
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    /**
     * Set the current user
     * 
     * @param action The user to be set as the current user
     */
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
    },

    /**
     * Clear the current user
     */
    clearCurrentUser: (state) => {
      state.currentUser = null
    },

    /**
     * Set the registered users list
     * 
     * @param action 
     */
    setRegisteredUsers: (state, action: PayloadAction<User[]>) => {
      state.registeredUsers = action.payload
    },

    /**
     * Add a user to the registered users list
     * 
     * @param action 
     */
    addRegisteredUser: (state, action: PayloadAction<User>) => {
      state.registeredUsers.push(action.payload)
    }
  }
})

export default authSlice.reducer
export const { setCurrentUser, clearCurrentUser, setRegisteredUsers, addRegisteredUser } = authSlice.actions