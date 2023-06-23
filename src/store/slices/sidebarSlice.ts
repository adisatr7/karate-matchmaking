import { PayloadAction, createSlice } from "@reduxjs/toolkit"


export interface SidebarState {
  isExpanded: boolean
}

const initialState: SidebarState = {
  isExpanded: false
}

export const sidebarSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleState: (state, action: PayloadAction) => {
      state.isExpanded = !state.isExpanded
    },

    showSidebar: (state) => {
      state.isExpanded = true
    },

    hideSidebar: (state) => {
      state.isExpanded = false
    }
  }
})

export default sidebarSlice.reducer
export const { toggleState, showSidebar, hideSidebar } = sidebarSlice.actions