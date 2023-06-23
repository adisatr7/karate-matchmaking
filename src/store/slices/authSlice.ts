import { PayloadAction, createSlice } from "@reduxjs/toolkit"


export interface AuthState {
  currentUser: any
}

const initialState: AuthState = {
  currentUser: false
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction) => {
      state.currentUser = action.payload
    },

    clearCurrentUser: (state) => {
      state.currentUser = false
    }
  }
})

export default authSlice.reducer
export const { setCurrentUser, clearCurrentUser } = authSlice.actions