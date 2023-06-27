import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { User } from "../../types"
import { getCurrentUser, setCurrentUser } from "../../data/controllers/users"


/**
 * Auth states type definition
 */
export interface AuthState {
  currentUser: User
}

/**
 * Auth initial state containing the current user and the list of registered users
 */
const initialState: AuthState = {
  currentUser: null
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
     * @param action The user object to be set as the current user
     */
    login: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      setCurrentUser(action.payload)
    },

    /**
     * Clear the current user and log out
     */
    logout: (state) => {
      state.currentUser = null
      setCurrentUser(null)
    }
  }
})

export default authSlice.reducer
export const { login, logout } = authSlice.actions